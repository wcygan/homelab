#!/usr/bin/env -S deno run --allow-all

/**
 * Fix stuck Ceph resources by removing finalizers
 * This script helps clean up stuck CephCluster and CephObjectStore resources
 */

import { $ } from "https://deno.land/x/dax@0.39.2/mod.ts";

async function removeFinalizers(resourceType: string, name: string, namespace: string) {
  console.log(`🔧 Removing finalizers from ${resourceType} ${name} in namespace ${namespace}...`);
  
  try {
    // Patch the resource to remove finalizers
    await $`kubectl patch ${resourceType} ${name} -n ${namespace} --type='json' -p='[{"op": "remove", "path": "/metadata/finalizers"}]'`.quiet();
    console.log(`✅ Successfully removed finalizers from ${resourceType} ${name}`);
  } catch (error) {
    console.error(`❌ Failed to remove finalizers from ${resourceType} ${name}:`, error);
  }
}

async function main() {
  console.log("🚀 Starting Ceph resource cleanup...\n");

  // Step 1: Remove finalizers from stuck CephObjectStore
  console.log("Step 1: Removing finalizers from CephObjectStore...");
  await removeFinalizers("cephobjectstore", "ceph-objectstore", "storage");

  // Step 2: Remove finalizers from stuck CephClusters
  console.log("\nStep 2: Removing finalizers from stuck CephClusters...");
  await removeFinalizers("cephcluster", "default", "default");
  await removeFinalizers("cephcluster", "storage", "storage");

  // Step 3: Wait for resources to be deleted
  console.log("\nStep 3: Waiting for resources to be deleted...");
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Step 4: Check remaining resources
  console.log("\nStep 4: Checking remaining resources...");
  
  console.log("\n📊 CephClusters:");
  await $`kubectl get cephcluster -A`.printCommand();
  
  console.log("\n📊 CephObjectStores:");
  await $`kubectl get cephobjectstore -A`.printCommand();

  // Step 5: Clean up any remaining RGW pools (if they exist)
  console.log("\nStep 5: Checking for RGW pools in Ceph...");
  try {
    const pools = await $`kubectl -n storage exec deploy/rook-ceph-tools -- ceph osd pool ls`.text();
    console.log("Current pools:", pools);
    
    // Look for RGW-related pools
    const rgwPools = pools.split('\n').filter(pool => 
      pool.includes('rgw') || pool.includes('.bucket') || pool.includes('.user')
    );
    
    if (rgwPools.length > 0) {
      console.log("\n⚠️  Found RGW-related pools:", rgwPools);
      console.log("These may need manual cleanup if you're not planning to use ObjectStore");
    }
  } catch (error) {
    console.log("Could not check Ceph pools (tools pod might not be available)");
  }

  console.log("\n✅ Cleanup complete!");
  console.log("\n📝 Next steps:");
  console.log("1. Verify all stuck resources are gone");
  console.log("2. If you want to use ObjectStore, create a fresh deployment");
  console.log("3. Consider disabling the ObjectStore kustomization if not needed");
}

if (import.meta.main) {
  main().catch(console.error);
}