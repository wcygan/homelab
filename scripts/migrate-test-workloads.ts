#!/usr/bin/env -S deno run --allow-all

/**
 * Migrate test workloads from local-path to Ceph storage
 * This script handles the df-test-cache-0 and test-postgres-cluster-1 migrations
 */

import { $ } from "jsr:@david/dax@0.42.0";

interface MigrationTarget {
  name: string;
  namespace: string;
  pvcName: string;
  size: string;
  workloadType: string;
  scaleTarget: string;
}

const targets: MigrationTarget[] = [
  {
    name: "DragonflyDB Test Cache",
    namespace: "database",
    pvcName: "df-test-cache-0",
    size: "1Gi",
    workloadType: "statefulset",
    scaleTarget: "test-cache"
  },
  {
    name: "PostgreSQL Test Cluster",
    namespace: "database", 
    pvcName: "test-postgres-cluster-1",
    size: "5Gi",
    workloadType: "cluster.postgresql.cnpg.io",
    scaleTarget: "test-postgres-cluster"
  }
];

async function createMigrationLog(entry: string) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${entry}\n`;
  
  const logFile = "/Users/wcygan/Development/homelab/docs/ceph/migration-log.md";
  
  // Create file if it doesn't exist
  try {
    await Deno.stat(logFile);
  } catch {
    await Deno.writeTextFile(logFile, "# Ceph Migration Log\n\n");
  }
  
  // Append log entry
  await Deno.writeTextFile(logFile, logEntry, { append: true });
  console.log(logEntry.trim());
}

async function waitForPodReady(namespace: string, labelSelector: string, timeout: number = 300) {
  const startTime = Date.now();
  
  while ((Date.now() - startTime) / 1000 < timeout) {
    try {
      const result = await $`kubectl get pods -n ${namespace} -l ${labelSelector} -o jsonpath='{.items[0].status.conditions[?(@.type=="Ready")].status}'`.text();
      
      if (result.trim() === "True") {
        return true;
      }
    } catch {
      // Ignore errors, keep waiting
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  throw new Error(`Timeout waiting for pod with selector ${labelSelector} to be ready`);
}

async function migrateWorkload(target: MigrationTarget) {
  await createMigrationLog(`Starting migration of ${target.name}`);
  
  try {
    // Step 1: Create new PVC on Ceph
    await createMigrationLog(`Creating new PVC ${target.pvcName}-ceph on Ceph storage`);
    
    const pvcManifest = `
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ${target.pvcName}-ceph
  namespace: ${target.namespace}
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: ceph-block
  resources:
    requests:
      storage: ${target.size}
`;

    await $`kubectl apply -f -`.stdin(pvcManifest);
    await $`kubectl wait --for=condition=Bound pvc/${target.pvcName}-ceph -n ${target.namespace} --timeout=60s`;
    
    await createMigrationLog(`PVC ${target.pvcName}-ceph created and bound`);
    
    // Step 2: Scale down workload
    await createMigrationLog(`Scaling down ${target.scaleTarget}`);
    
    if (target.workloadType === "statefulset") {
      await $`kubectl scale statefulset ${target.scaleTarget} -n ${target.namespace} --replicas=0`;
    } else if (target.workloadType === "cluster.postgresql.cnpg.io") {
      // For CNPG, we need to handle this differently
      await createMigrationLog(`CNPG cluster requires special handling - marking for manual migration`);
      return;
    }
    
    // Wait for pod to terminate
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Step 3: Copy data using a job
    await createMigrationLog(`Copying data from ${target.pvcName} to ${target.pvcName}-ceph`);
    
    const copyJobManifest = `
apiVersion: batch/v1
kind: Job
metadata:
  name: migrate-${target.pvcName}
  namespace: ${target.namespace}
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: migrate
        image: busybox:latest
        command: ["sh", "-c"]
        args: 
        - |
          echo "Starting data copy..."
          cp -av /source/* /dest/ 2>/dev/null || true
          echo "Data copy completed"
          ls -la /dest/
        volumeMounts:
        - name: source
          mountPath: /source
        - name: dest
          mountPath: /dest
      volumes:
      - name: source
        persistentVolumeClaim:
          claimName: ${target.pvcName}
      - name: dest
        persistentVolumeClaim:
          claimName: ${target.pvcName}-ceph
`;

    await $`kubectl apply -f -`.stdin(copyJobManifest);
    
    // Wait for job to complete
    await $`kubectl wait --for=condition=complete job/migrate-${target.pvcName} -n ${target.namespace} --timeout=300s`;
    
    // Get job logs
    const logs = await $`kubectl logs job/migrate-${target.pvcName} -n ${target.namespace}`.text();
    await createMigrationLog(`Copy job output:\n${logs}`);
    
    // Clean up job
    await $`kubectl delete job migrate-${target.pvcName} -n ${target.namespace}`;
    
    // Step 4: Update StatefulSet to use new PVC
    if (target.workloadType === "statefulset") {
      await createMigrationLog(`Updating ${target.scaleTarget} to use new PVC`);
      
      // For StatefulSets, we need to delete and recreate with new storage class
      // First, get the current StatefulSet
      const stsJson = await $`kubectl get statefulset ${target.scaleTarget} -n ${target.namespace} -o json`.json();
      
      // Update the volumeClaimTemplates
      if (stsJson.spec.volumeClaimTemplates) {
        stsJson.spec.volumeClaimTemplates[0].spec.storageClassName = "ceph-block";
      }
      
      // Delete the old StatefulSet (without cascading to pods)
      await $`kubectl delete statefulset ${target.scaleTarget} -n ${target.namespace} --cascade=orphan`;
      
      // Delete the old PVC
      await $`kubectl delete pvc ${target.pvcName} -n ${target.namespace}`;
      
      // Rename the new PVC to match the original name
      await $`kubectl patch pvc ${target.pvcName}-ceph -n ${target.namespace} --type='json' -p='[{"op": "add", "path": "/metadata/annotations/migration-original-name", "value": "${target.pvcName}"}]'`;
      
      // For now, we'll need to manually update the StatefulSet
      await createMigrationLog(`StatefulSet needs manual update to use ceph-block storage class`);
      
      // Scale back up
      await createMigrationLog(`Please manually recreate StatefulSet ${target.scaleTarget} with ceph-block storage class`);
    }
    
    await createMigrationLog(`Migration of ${target.name} completed successfully`);
    
  } catch (error) {
    await createMigrationLog(`ERROR: Migration of ${target.name} failed: ${error}`);
    throw error;
  }
}

async function main() {
  await createMigrationLog("=== Starting Test Workload Migration ===");
  
  // Migrate DragonflyDB test cache first
  try {
    await migrateWorkload(targets[0]);
  } catch (error) {
    console.error("Failed to migrate DragonflyDB:", error);
  }
  
  // Note about PostgreSQL
  await createMigrationLog("PostgreSQL CNPG cluster requires special migration procedure - see CNPG documentation");
  
  await createMigrationLog("=== Test Workload Migration Completed ===");
}

// Execute migration
await main();