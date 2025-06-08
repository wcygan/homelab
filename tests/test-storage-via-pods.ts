#!/usr/bin/env -S deno run --allow-all

import { $ } from "@david/dax";
import { colors } from "@cliffy/ansi/colors";

// Test getting disk usage by creating debug pods

async function testStorageViaPods() {
  console.log(colors.bold.blue("Testing Storage Usage via Debug Pods"));
  console.log("=" . repeat(50));

  try {
    // Get all PVCs with their bound PVs
    const pvcs = await $`kubectl get pvc -A -o json`.json();
    
    for (const pvc of pvcs.items) {
      if (pvc.status.phase !== "Bound") continue;
      
      const namespace = pvc.metadata.namespace;
      const pvcName = pvc.metadata.name;
      const pvName = pvc.spec.volumeName;
      
      console.log(`\n${colors.bold.cyan(`PVC: ${namespace}/${pvcName}`)}`);
      
      // Get the PV details
      const pv = await $`kubectl get pv ${pvName} -o json`.json();
      const capacity = pv.spec.capacity.storage;
      console.log(`  Capacity: ${capacity}`);
      
      // Find which node hosts this PV
      const nodeAffinity = pv.spec.nodeAffinity?.required?.nodeSelectorTerms?.[0];
      const nodeSelector = nodeAffinity?.matchExpressions?.find((expr: any) => 
        expr.key === "kubernetes.io/hostname"
      );
      const nodeName = nodeSelector?.values?.[0];
      console.log(`  Node: ${nodeName}`);
      
      // Find a pod that uses this PVC
      const pods = await $`kubectl get pods -n ${namespace} -o json`.json();
      let mountPath = null;
      let podName = null;
      
      for (const pod of pods.items) {
        if (pod.spec.volumes?.some((v: any) => v.persistentVolumeClaim?.claimName === pvcName)) {
          podName = pod.metadata.name;
          // Find the mount path
          for (const container of pod.spec.containers || []) {
            const mount = container.volumeMounts?.find((vm: any) => 
              pod.spec.volumes?.some((v: any) => 
                v.name === vm.name && v.persistentVolumeClaim?.claimName === pvcName
              )
            );
            if (mount) {
              mountPath = mount.mountPath;
              break;
            }
          }
          if (mountPath) break;
        }
      }
      
      if (podName && mountPath) {
        console.log(`  Pod: ${podName}`);
        console.log(`  Mount Path: ${mountPath}`);
        
        try {
          // Get disk usage from inside the pod
          const dfResult = await $`kubectl exec -n ${namespace} ${podName} -- df -h ${mountPath}`.text();
          const lines = dfResult.trim().split('\n');
          if (lines.length > 1) {
            // Parse the df output
            const parts = lines[1].split(/\s+/);
            if (parts.length >= 5) {
              console.log(`  Used: ${parts[2]} / ${parts[1]} (${parts[4]})`);
            }
          }
        } catch (error) {
          console.log(`  Unable to get disk usage: ${error.message}`);
        }
      } else {
        console.log(`  No running pod found using this PVC`);
      }
    }
  } catch (error) {
    console.error(colors.red(`Error: ${error.message}`));
  }
}

// Alternative: Use a debug pod on each node
async function testWithDebugPod() {
  console.log("\n" + colors.bold.blue("Testing with Debug Pod"));
  console.log("=" . repeat(50));
  
  const debugPodYaml = `
apiVersion: v1
kind: Pod
metadata:
  name: storage-debug
  namespace: default
spec:
  containers:
  - name: debug
    image: busybox:latest
    command: ["sleep", "300"]
    volumeMounts:
    - name: host-opt
      mountPath: /host-opt
      readOnly: true
  volumes:
  - name: host-opt
    hostPath:
      path: /opt
      type: Directory
  restartPolicy: Never
  nodeSelector:
    kubernetes.io/hostname: k8s-1
`;

  try {
    // Create debug pod
    console.log("\nCreating debug pod on k8s-1...");
    await $`kubectl apply -f -`.stdin(debugPodYaml);
    
    // Wait for pod to be ready
    await $`kubectl wait --for=condition=ready pod/storage-debug -n default --timeout=30s`;
    
    // Check disk usage
    console.log("\nChecking /opt/local-path-provisioner usage:");
    const result = await $`kubectl exec -n default storage-debug -- du -sh /host-opt/local-path-provisioner/*`.text();
    console.log(result);
    
    // Cleanup
    console.log("\nCleaning up debug pod...");
    await $`kubectl delete pod storage-debug -n default --grace-period=0 --force`;
    
  } catch (error) {
    console.error(colors.red(`Error: ${error.message}`));
    // Try cleanup anyway
    try {
      await $`kubectl delete pod storage-debug -n default --grace-period=0 --force`.quiet();
    } catch {}
  }
}

// Run tests
if (import.meta.main) {
  await testStorageViaPods();
  await testWithDebugPod();
}