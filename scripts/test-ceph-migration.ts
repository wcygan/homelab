#!/usr/bin/env -S deno run --allow-all

/**
 * Test script for validating Ceph migration process
 * Tests backup and restore functionality with a small test workload
 */

import { $ } from "jsr:@david/dax@0.42.0";

const TEST_NAMESPACE = "default";
const TEST_PVC_NAME = "migration-test-pvc";
const TEST_POD_NAME = "migration-test-pod";
const TEST_DATA_FILE = "test-data.txt";
const TEST_DATA_CONTENT = `Test data created at ${new Date().toISOString()}\nRandom: ${Math.random()}`;

async function cleanup() {
  console.log("🧹 Cleaning up test resources...");
  
  // Delete in reverse order
  await $`kubectl delete pod ${TEST_POD_NAME} -n ${TEST_NAMESPACE} --ignore-not-found=true`.quiet();
  await $`kubectl delete pvc ${TEST_PVC_NAME}-ceph -n ${TEST_NAMESPACE} --ignore-not-found=true`.quiet();
  await $`kubectl delete pvc ${TEST_PVC_NAME} -n ${TEST_NAMESPACE} --ignore-not-found=true`.quiet();
  await $`kubectl delete replicationsource backup-${TEST_PVC_NAME} -n ${TEST_NAMESPACE} --ignore-not-found=true`.quiet();
  await $`kubectl delete replicationdestination restore-${TEST_PVC_NAME} -n ${TEST_NAMESPACE} --ignore-not-found=true`.quiet();
  await $`kubectl delete secret ${TEST_PVC_NAME}-backup-secret -n ${TEST_NAMESPACE} --ignore-not-found=true`.quiet();
}

async function createTestPVC() {
  console.log("📦 Creating test PVC on local-path...");
  
  const pvcManifest = `
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ${TEST_PVC_NAME}
  namespace: ${TEST_NAMESPACE}
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: local-path
  resources:
    requests:
      storage: 1Gi
`;

  await $`kubectl apply -f -`.stdin(pvcManifest);
  
  // Wait for PVC to be bound
  await $`kubectl wait --for=condition=Bound pvc/${TEST_PVC_NAME} -n ${TEST_NAMESPACE} --timeout=60s`;
}

async function createTestData() {
  console.log("📝 Creating test data...");
  
  const podManifest = `
apiVersion: v1
kind: Pod
metadata:
  name: ${TEST_POD_NAME}
  namespace: ${TEST_NAMESPACE}
spec:
  containers:
  - name: test
    image: busybox:latest
    command: ["sleep", "3600"]
    volumeMounts:
    - name: data
      mountPath: /data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: ${TEST_PVC_NAME}
`;

  await $`kubectl apply -f -`.stdin(podManifest);
  await $`kubectl wait --for=condition=Ready pod/${TEST_POD_NAME} -n ${TEST_NAMESPACE} --timeout=60s`;
  
  // Write test data
  await $`kubectl exec -n ${TEST_NAMESPACE} ${TEST_POD_NAME} -- sh -c "echo '${TEST_DATA_CONTENT}' > /data/${TEST_DATA_FILE}"`;
  
  // Read back to verify
  const readData = await $`kubectl exec -n ${TEST_NAMESPACE} ${TEST_POD_NAME} -- cat /data/${TEST_DATA_FILE}`.text();
  console.log("✅ Test data written:", readData.trim());
  
  return readData.trim();
}

async function createBackupSecret() {
  console.log("🔐 Creating backup secret...");
  
  // For testing, we'll use local repository
  const secretManifest = `
apiVersion: v1
kind: Secret
metadata:
  name: ${TEST_PVC_NAME}-backup-secret
  namespace: ${TEST_NAMESPACE}
type: Opaque
stringData:
  RESTIC_REPOSITORY: "/tmp/restic-repo-${TEST_PVC_NAME}"
  RESTIC_PASSWORD: "test-password-${Date.now()}"
`;

  await $`kubectl apply -f -`.stdin(secretManifest);
}

async function performBackup() {
  console.log("💾 Creating backup with Volsync...");
  
  const backupManifest = `
apiVersion: volsync.backube/v1alpha1
kind: ReplicationSource
metadata:
  name: backup-${TEST_PVC_NAME}
  namespace: ${TEST_NAMESPACE}
spec:
  sourcePVC: ${TEST_PVC_NAME}
  trigger:
    manual: test-backup-${Date.now()}
  restic:
    pruneIntervalDays: 1
    repository: ${TEST_PVC_NAME}-backup-secret
    retain:
      daily: 1
    copyMethod: Snapshot
    volumeSnapshotClassName: csi-ceph-blockpool
`;

  await $`kubectl apply -f -`.stdin(backupManifest);
  
  // Wait for backup to complete
  console.log("⏳ Waiting for backup to complete...");
  let backupComplete = false;
  let attempts = 0;
  
  while (!backupComplete && attempts < 30) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second wait
    
    try {
      const status = await $`kubectl get replicationsource backup-${TEST_PVC_NAME} -n ${TEST_NAMESPACE} -o jsonpath='{.status.lastSyncTime}'`.text();
      if (status && status.trim() !== "") {
        backupComplete = true;
        console.log("✅ Backup completed at:", status.trim());
      }
    } catch (e) {
      // Ignore errors, keep waiting
    }
    
    attempts++;
  }
  
  if (!backupComplete) {
    throw new Error("Backup did not complete within timeout");
  }
}

async function migrateToСeph() {
  console.log("🚀 Migrating to Ceph storage...");
  
  // Delete the test pod first
  await $`kubectl delete pod ${TEST_POD_NAME} -n ${TEST_NAMESPACE}`;
  
  // Create new PVC on Ceph
  const cephPvcManifest = `
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ${TEST_PVC_NAME}-ceph
  namespace: ${TEST_NAMESPACE}
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: ceph-block
  resources:
    requests:
      storage: 1Gi
`;

  await $`kubectl apply -f -`.stdin(cephPvcManifest);
  await $`kubectl wait --for=condition=Bound pvc/${TEST_PVC_NAME}-ceph -n ${TEST_NAMESPACE} --timeout=60s`;
  
  // Restore to new PVC
  const restoreManifest = `
apiVersion: volsync.backube/v1alpha1
kind: ReplicationDestination
metadata:
  name: restore-${TEST_PVC_NAME}
  namespace: ${TEST_NAMESPACE}
spec:
  trigger:
    manual: test-restore-${Date.now()}
  restic:
    repository: ${TEST_PVC_NAME}-backup-secret
    destinationPVC: ${TEST_PVC_NAME}-ceph
    copyMethod: Direct
`;

  await $`kubectl apply -f -`.stdin(restoreManifest);
  
  // Wait for restore to complete
  console.log("⏳ Waiting for restore to complete...");
  let restoreComplete = false;
  attempts = 0;
  
  while (!restoreComplete && attempts < 30) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second wait
    
    try {
      const status = await $`kubectl get replicationdestination restore-${TEST_PVC_NAME} -n ${TEST_NAMESPACE} -o jsonpath='{.status.lastSyncTime}'`.text();
      if (status && status.trim() !== "") {
        restoreComplete = true;
        console.log("✅ Restore completed at:", status.trim());
      }
    } catch (e) {
      // Ignore errors, keep waiting
    }
    
    attempts++;
  }
  
  if (!restoreComplete) {
    throw new Error("Restore did not complete within timeout");
  }
}

async function verifyMigration(originalData: string) {
  console.log("🔍 Verifying migrated data...");
  
  // Create pod with new PVC
  const podManifest = `
apiVersion: v1
kind: Pod
metadata:
  name: ${TEST_POD_NAME}
  namespace: ${TEST_NAMESPACE}
spec:
  containers:
  - name: test
    image: busybox:latest
    command: ["sleep", "3600"]
    volumeMounts:
    - name: data
      mountPath: /data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: ${TEST_PVC_NAME}-ceph
`;

  await $`kubectl apply -f -`.stdin(podManifest);
  await $`kubectl wait --for=condition=Ready pod/${TEST_POD_NAME} -n ${TEST_NAMESPACE} --timeout=60s`;
  
  // Read migrated data
  const migratedData = await $`kubectl exec -n ${TEST_NAMESPACE} ${TEST_POD_NAME} -- cat /data/${TEST_DATA_FILE}`.text();
  
  console.log("📄 Original data:", originalData);
  console.log("📄 Migrated data:", migratedData.trim());
  
  if (originalData === migratedData.trim()) {
    console.log("✅ Data verification successful! Migration completed correctly.");
    return true;
  } else {
    console.error("❌ Data verification failed! Data does not match.");
    return false;
  }
}

async function main() {
  console.log("🧪 Starting Ceph migration test...\n");
  
  try {
    // Cleanup any existing resources
    await cleanup();
    
    // Step 1: Create test PVC and data
    await createTestPVC();
    const originalData = await createTestData();
    
    // Step 2: Create backup
    await createBackupSecret();
    await performBackup();
    
    // Step 3: Migrate to Ceph
    await migrateToСeph();
    
    // Step 4: Verify migration
    const success = await verifyMigration(originalData);
    
    if (success) {
      console.log("\n🎉 Migration test completed successfully!");
      console.log("\nThis validates that:");
      console.log("- Volsync can backup from local-path storage");
      console.log("- Volsync can restore to Ceph storage");
      console.log("- Data integrity is maintained during migration");
    } else {
      console.error("\n❌ Migration test failed!");
      Deno.exit(1);
    }
    
  } catch (error) {
    console.error("\n❌ Test failed with error:", error);
    Deno.exit(1);
  } finally {
    // Cleanup
    console.log("\n🧹 Cleaning up test resources...");
    await cleanup();
  }
}

// Run the test
await main();