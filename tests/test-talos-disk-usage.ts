#!/usr/bin/env -S deno run --allow-all

import { $ } from "@david/dax";
import { colors } from "@cliffy/ansi/colors";

// Test script to explore Talos disk usage collection methods

async function testMountStatus() {
  console.log(colors.bold.blue("Testing Talos Mount Status"));
  console.log("=" . repeat(50));

  const nodes = ["192.168.1.98", "192.168.1.99", "192.168.1.100"];
  
  for (const nodeIp of nodes) {
    console.log(`\n${colors.bold.yellow(`Testing node: ${nodeIp}`)}`);
    
    try {
      // Get mount status with timeout
      const mountStatus = await $`talosctl -n ${nodeIp} get mountstatus -o json`.timeout(5000).json();
      
      console.log(`Found ${mountStatus.items?.length || 0} mounts`);
      
      // Look for relevant mounts
      const relevantMounts = mountStatus.items?.filter((mount: any) => {
        const target = mount.spec.target || "";
        return target.includes("local-path-provisioner") ||
               target.includes("/var") ||
               target.includes("/opt");
      }) || [];
      
      for (const mount of relevantMounts) {
        console.log(`\nMount: ${mount.metadata.id}`);
        console.log(`  Target: ${mount.spec.target}`);
        
        if (mount.status) {
          const used = mount.status.used || 0;
          const size = mount.status.size || 0;
          const available = mount.status.available || 0;
          const usagePercent = size > 0 ? (used / size * 100).toFixed(2) : 0;
          
          console.log(`  Usage: ${formatBytes(used)} / ${formatBytes(size)} (${usagePercent}%)`);
        }
      }
    } catch (error) {
      console.error(colors.red(`  Failed to connect to ${nodeIp}: ${error.message}`));
    }
  }
}

async function testPVInfo() {
  console.log("\n" + colors.bold.blue("Testing PV to Node Mapping"));
  console.log("=" . repeat(50));

  try {
    // Get all PVs
    const pvs = await $`kubectl get pv -o json`.json();
    
    console.log(`\nFound ${pvs.items.length} PVs`);
    
    for (const pv of pvs.items) {
      if (pv.spec.storageClassName === "local-path") {
        console.log(`\nPV: ${pv.metadata.name}`);
        console.log(`  Storage Class: ${pv.spec.storageClassName}`);
        console.log(`  Capacity: ${pv.spec.capacity.storage}`);
        console.log(`  Status: ${pv.status.phase}`);
        
        // Get node affinity to find which node hosts this PV
        const nodeAffinity = pv.spec.nodeAffinity?.required?.nodeSelectorTerms?.[0];
        if (nodeAffinity) {
          const nodeSelector = nodeAffinity.matchExpressions?.find((expr: any) => 
            expr.key === "kubernetes.io/hostname"
          );
          if (nodeSelector) {
            console.log(`  Node: ${nodeSelector.values?.[0]}`);
          }
        }
        
        // Local path info
        if (pv.spec.local?.path) {
          console.log(`  Local Path: ${pv.spec.local.path}`);
        } else if (pv.spec.hostPath?.path) {
          console.log(`  Host Path: ${pv.spec.hostPath.path}`);
        }
        
        // Check which PVC is bound to this PV
        if (pv.spec.claimRef) {
          console.log(`  Bound to PVC: ${pv.spec.claimRef.namespace}/${pv.spec.claimRef.name}`);
        }
      }
    }
  } catch (error) {
    console.error(colors.red(`Error: ${error.message}`));
  }
}

async function testDiskUsage() {
  console.log("\n" + colors.bold.blue("Testing Alternative Disk Usage Methods"));
  console.log("=" . repeat(50));

  // Get PV to node mappings first
  const pvs = await $`kubectl get pv -o json`.json();
  const pvNodeMap = new Map();
  
  for (const pv of pvs.items) {
    if (pv.spec.storageClassName === "local-path") {
      const nodeAffinity = pv.spec.nodeAffinity?.required?.nodeSelectorTerms?.[0];
      const nodeSelector = nodeAffinity?.matchExpressions?.find((expr: any) => 
        expr.key === "kubernetes.io/hostname"
      );
      if (nodeSelector?.values?.[0]) {
        pvNodeMap.set(pv.metadata.name, {
          node: nodeSelector.values[0],
          path: pv.spec.hostPath?.path || pv.spec.local?.path,
          pvc: pv.spec.claimRef ? `${pv.spec.claimRef.namespace}/${pv.spec.claimRef.name}` : null
        });
      }
    }
  }

  // Try to get disk usage using different methods
  console.log("\nPV disk usage by node:");
  
  for (const [pvName, pvInfo] of pvNodeMap) {
    console.log(`\n${colors.bold.cyan(`PV: ${pvName}`)}`);
    console.log(`  Node: ${pvInfo.node}`);
    console.log(`  Path: ${pvInfo.path}`);
    console.log(`  PVC: ${pvInfo.pvc}`);
    
    // Map node name to IP
    const nodeToIp: Record<string, string> = {
      "k8s-1": "192.168.1.98",
      "k8s-2": "192.168.1.99", 
      "k8s-3": "192.168.1.100"
    };
    
    const nodeIp = nodeToIp[pvInfo.node];
    if (nodeIp && pvInfo.path) {
      try {
        // Try using ls -la to get directory info
        const lsResult = await $`talosctl -n ${nodeIp} ls -la ${pvInfo.path}`.timeout(5000).text();
        console.log(`  Directory listing available`);
        
        // Try to get disk stats
        const statResult = await $`talosctl -n ${nodeIp} stat ${pvInfo.path}`.timeout(5000).text();
        console.log(`  Stat info available`);
      } catch (error) {
        console.log(`  Unable to get disk info: ${error.message}`);
      }
    }
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

// Run tests
if (import.meta.main) {
  await testMountStatus();
  await testPVInfo();
  await testDiskUsage();
}