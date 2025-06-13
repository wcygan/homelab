#!/usr/bin/env -S deno run --allow-all

import { $ } from "https://deno.land/x/dax@0.39.2/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";
import { Confirm } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/confirm.ts";

interface ClusterInfo {
  currentFsid: string;
  osdCount: number;
  health: string;
  diskInfo: Map<string, { fsid: string; osdId: string }[]>;
}

async function getClusterInfo(): Promise<ClusterInfo> {
  console.log(colors.blue("🔍 Gathering cluster information..."));
  
  // Get current cluster FSID
  const currentFsid = await $`kubectl exec -n storage deploy/rook-ceph-tools -- ceph fsid`.text();
  
  // Get OSD count
  const osdTree = await $`kubectl exec -n storage deploy/rook-ceph-tools -- ceph osd tree -f json`.json();
  const osdCount = osdTree.nodes.filter((n: any) => n.type === "osd").length;
  
  // Get health
  const health = await $`kubectl exec -n storage deploy/rook-ceph-tools -- ceph health`.text();
  
  // Get disk info from each node
  const diskInfo = new Map<string, { fsid: string; osdId: string }[]>();
  const nodes = ["k8s-1", "k8s-2", "k8s-3"];
  
  for (const node of nodes) {
    console.log(colors.gray(`  Checking disks on ${node}...`));
    try {
      const prepareJob = await $`kubectl logs -n storage job/rook-ceph-osd-prepare-${node} 2>/dev/null || echo "No job found"`.text();
      const disks: { fsid: string; osdId: string }[] = [];
      
      // Parse disk info from logs
      const matches = prepareJob.matchAll(/"ceph_fsid":\s*"([^"]+)".*?"osd_id":\s*(\d+)/g);
      for (const match of matches) {
        disks.push({ fsid: match[1], osdId: match[2] });
      }
      
      if (disks.length > 0) {
        diskInfo.set(node, disks);
      }
    } catch {
      // Job might not exist
    }
  }
  
  return { currentFsid: currentFsid.trim(), osdCount, health: health.trim(), diskInfo };
}

async function displayClusterStatus(info: ClusterInfo) {
  console.log("\n" + colors.bold.yellow("=== Current Ceph Cluster Status ==="));
  console.log(colors.cyan("Current Cluster FSID:"), info.currentFsid);
  console.log(colors.cyan("Active OSDs:"), info.osdCount);
  console.log(colors.cyan("Health:"), info.health.includes("HEALTH_OK") ? colors.green(info.health) : colors.red(info.health));
  
  if (info.diskInfo.size > 0) {
    console.log("\n" + colors.bold.yellow("=== Disk Status by Node ==="));
    for (const [node, disks] of info.diskInfo) {
      console.log(colors.cyan(`${node}:`));
      for (const disk of disks) {
        const match = disk.fsid === info.currentFsid ? colors.green("✓ MATCH") : colors.red("✗ MISMATCH");
        console.log(`  OSD ${disk.osdId}: FSID ${disk.fsid} ${match}`);
      }
    }
  }
}

async function cleanupDisks(node: string) {
  console.log(colors.blue(`🧹 Cleaning disks on ${node}...`));
  
  const cleanupScript = `
set -e
echo "Starting disk cleanup on $(hostname)"
for device in /dev/nvme0n1 /dev/nvme1n1; do
  if [ -e "$device" ]; then
    echo "Cleaning $device"
    sgdisk --zap-all $device || true
    dd if=/dev/zero of=$device bs=1M count=100 oflag=direct,dsync || true
    blkdiscard $device || true
    partprobe $device || true
    echo "$device cleaned"
  else
    echo "$device not found, skipping"
  fi
done
echo "Cleanup complete on $(hostname)"
`;

  const jobYaml = `
apiVersion: batch/v1
kind: Job
metadata:
  name: disk-cleanup-${node}
  namespace: storage
spec:
  ttlSecondsAfterFinished: 300
  template:
    spec:
      restartPolicy: Never
      serviceAccountName: rook-ceph-osd
      containers:
      - name: disk-cleanup
        image: rook/ceph:v1.16.0
        command: ["/bin/bash", "-c"]
        args:
        - |
${cleanupScript.split('\n').map(line => '          ' + line).join('\n')}
        securityContext:
          privileged: true
          runAsUser: 0
        volumeMounts:
        - name: dev
          mountPath: /dev
        - name: sys-bus
          mountPath: /sys/bus
        - name: lib-modules
          mountPath: /lib/modules
      volumes:
      - name: dev
        hostPath:
          path: /dev
      - name: sys-bus
        hostPath:
          path: /sys/bus
      - name: lib-modules
        hostPath:
          path: /lib/modules
      nodeSelector:
        kubernetes.io/hostname: ${node}
`;

  // Apply the job
  await $`echo ${jobYaml}`.pipe($`kubectl apply -f -`);
  
  // Wait for completion
  console.log(colors.gray(`  Waiting for cleanup job to complete...`));
  await $`kubectl wait --for=condition=complete -n storage job/disk-cleanup-${node} --timeout=120s`;
  
  // Get logs
  const logs = await $`kubectl logs -n storage job/disk-cleanup-${node}`.text();
  console.log(colors.gray("  " + logs.split('\n').join('\n  ')));
  
  // Delete the job
  await $`kubectl delete -n storage job/disk-cleanup-${node}`;
}

async function restartOSDDeployment() {
  console.log(colors.blue("🔄 Restarting OSD deployment..."));
  
  // Delete old prepare jobs if they exist
  console.log(colors.gray("  Cleaning up old prepare jobs..."));
  await $`kubectl delete jobs -n storage -l app=rook-ceph-osd-prepare`.noThrow();
  
  // Restart the operator to trigger new OSD deployment
  console.log(colors.gray("  Restarting Rook operator..."));
  await $`kubectl rollout restart -n storage deployment/rook-ceph-operator`;
  await $`kubectl rollout status -n storage deployment/rook-ceph-operator --timeout=120s`;
  
  console.log(colors.gray("  Waiting for OSD prepare jobs to be created..."));
  await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
  
  // Monitor OSD deployment
  console.log(colors.gray("  Monitoring OSD deployment..."));
  for (let i = 0; i < 60; i++) { // Check for up to 5 minutes
    const osdCount = await $`kubectl exec -n storage deploy/rook-ceph-tools -- ceph osd stat -f json`
      .json()
      .then(data => data.num_up_osds)
      .catch(() => 0);
    
    if (osdCount >= 6) { // Expecting 6 OSDs (2 per node)
      console.log(colors.green(`✓ ${osdCount} OSDs are now running!`));
      break;
    }
    
    process.stdout.write(colors.gray(`\r  OSDs running: ${osdCount}/6...`));
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  console.log(); // New line after progress
}

async function verifyClusterHealth() {
  console.log(colors.blue("\n🏥 Verifying cluster health..."));
  
  const health = await $`kubectl exec -n storage deploy/rook-ceph-tools -- ceph status`.text();
  console.log(health);
  
  const osdTree = await $`kubectl exec -n storage deploy/rook-ceph-tools -- ceph osd tree`.text();
  console.log("\n" + colors.bold("OSD Tree:"));
  console.log(osdTree);
}

async function main() {
  console.log(colors.bold.red("⚠️  CEPH EMERGENCY RECOVERY TOOL ⚠️"));
  console.log(colors.yellow("This tool will clean all Ceph data from cluster nodes and rebuild OSDs.\n"));
  
  try {
    // Phase 1: Gather information
    const clusterInfo = await getClusterInfo();
    await displayClusterStatus(clusterInfo);
    
    // Check if recovery is needed
    const hasMismatch = Array.from(clusterInfo.diskInfo.values()).some(disks => 
      disks.some(disk => disk.fsid !== clusterInfo.currentFsid)
    );
    
    if (!hasMismatch && clusterInfo.osdCount > 0) {
      console.log(colors.green("\n✓ Cluster appears healthy. No recovery needed."));
      return;
    }
    
    // Phase 2: Confirm with user
    console.log(colors.bold.red("\n⚠️  WARNING: This will DESTROY all data on Ceph disks! ⚠️"));
    const confirm = await Confirm.prompt({
      message: "Do you want to proceed with emergency recovery?",
      default: false,
    });
    
    if (!confirm) {
      console.log(colors.yellow("Recovery cancelled."));
      return;
    }
    
    // Phase 3: Cleanup
    console.log(colors.bold.blue("\n📋 Starting recovery process..."));
    const nodes = ["k8s-1", "k8s-2", "k8s-3"];
    for (const node of nodes) {
      await cleanupDisks(node);
    }
    
    // Phase 4: Restart OSD deployment
    await restartOSDDeployment();
    
    // Phase 5: Verify
    await verifyClusterHealth();
    
    console.log(colors.bold.green("\n✓ Recovery complete!"));
    console.log(colors.gray("Monitor PVC provisioning with: kubectl get pvc -A -w"));
    
  } catch (error) {
    console.error(colors.red(`\n❌ Error: ${error.message}`));
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}