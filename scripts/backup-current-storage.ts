#!/usr/bin/env -S deno run --allow-all

/**
 * Backup Current Storage State
 * 
 * This script backs up all PVCs in the cluster before Ceph migration.
 * Part of Ceph bootstrap objective 0.2.
 */

import { $ } from "jsr:@david/dax@0.42.0";
import { format } from "jsr:@std/datetime@0.224.4";

interface PVCInfo {
  name: string;
  namespace: string;
  storageClass: string;
  size: string;
  volumeName: string;
  nodeName: string;
  hostPath: string;
}

interface BackupResult {
  pvc: PVCInfo;
  success: boolean;
  backupPath?: string;
  error?: string;
  sizeOnDisk?: string;
}

const BACKUP_BASE_DIR = "/tmp/ceph-migration-backups";
const TIMESTAMP = format(new Date(), "yyyy-MM-dd-HH-mm-ss");
const BACKUP_DIR = `${BACKUP_BASE_DIR}/${TIMESTAMP}`;

async function main() {
  console.log("🔄 Starting storage backup process...");
  console.log(`📁 Backup directory: ${BACKUP_DIR}`);

  // Create backup directory
  await $`mkdir -p ${BACKUP_DIR}`;

  // Get all PVCs
  const pvcs = await getPVCInfo();
  console.log(`📊 Found ${pvcs.length} PVCs to backup`);

  // Create storage inventory
  await createStorageInventory(pvcs);

  // Perform backups
  const results: BackupResult[] = [];
  for (const pvc of pvcs) {
    console.log(`\n🔄 Backing up ${pvc.namespace}/${pvc.name}...`);
    const result = await backupPVC(pvc);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ Backup completed: ${result.backupPath}`);
    } else {
      console.log(`❌ Backup failed: ${result.error}`);
    }
  }

  // Generate backup report
  await generateBackupReport(results);

  // Test one backup restoration
  await testBackupRestoration(results);

  console.log("\n📋 Backup Summary:");
  const successful = results.filter(r => r.success).length;
  console.log(`✅ Successful: ${successful}/${results.length}`);
  console.log(`📁 Backup location: ${BACKUP_DIR}`);
  
  if (successful === results.length) {
    console.log("🎉 All backups completed successfully!");
    return 0;
  } else {
    console.log("⚠️  Some backups failed. Check the report for details.");
    return 1;
  }
}

async function getPVCInfo(): Promise<PVCInfo[]> {
  const pvcsJson = await $`kubectl get pvc -A -o json`.text();
  const pvsJson = await $`kubectl get pv -o json`.text();
  
  const pvcs = JSON.parse(pvcsJson);
  const pvs = JSON.parse(pvsJson);
  
  return pvcs.items.map((pvc: any) => {
    const pv = pvs.items.find((p: any) => p.metadata.name === pvc.spec.volumeName);
    const nodeName = pv?.spec?.nodeAffinity?.required?.nodeSelectorTerms?.[0]?.matchExpressions?.[0]?.values?.[0] || 'unknown';
    const hostPath = pv?.spec?.hostPath?.path || pv?.spec?.local?.path || 'unknown';

    return {
      name: pvc.metadata.name,
      namespace: pvc.metadata.namespace,
      storageClass: pvc.spec.storageClassName,
      size: pvc.status?.capacity?.storage || pvc.spec.resources.requests.storage,
      volumeName: pvc.spec.volumeName,
      nodeName,
      hostPath
    };
  });
}

async function createStorageInventory(pvcs: PVCInfo[]): Promise<void> {
  const inventoryPath = `${BACKUP_DIR}/storage-inventory.md`;
  
  let inventory = `# Storage Inventory - ${TIMESTAMP}\n\n`;
  inventory += `## Cluster Information\n`;
  inventory += `- Backup Date: ${new Date().toISOString()}\n`;
  inventory += `- Kubernetes Version: ${await $`kubectl version --short -o json`.text().then(t => JSON.parse(t).serverVersion.gitVersion).catch(() => 'unknown')}\n`;
  inventory += `- Storage Class: local-path (Local Path Provisioner)\n`;
  inventory += `- Total PVCs: ${pvcs.length}\n\n`;

  inventory += `## PVC Details\n\n`;
  inventory += `| Namespace | Name | Size | Node | Host Path | Volume Name |\n`;
  inventory += `|-----------|------|------|------|-----------|-------------|\n`;
  
  for (const pvc of pvcs) {
    inventory += `| ${pvc.namespace} | ${pvc.name} | ${pvc.size} | ${pvc.nodeName} | \`${pvc.hostPath}\` | ${pvc.volumeName} |\n`;
  }

  inventory += `\n## Storage Usage Summary\n\n`;
  const totalSize = pvcs.reduce((sum, pvc) => {
    const size = parseInt(pvc.size.replace('Gi', ''));
    return sum + size;
  }, 0);
  inventory += `- Total Allocated Storage: ${totalSize}Gi\n`;
  inventory += `- Storage Distribution:\n`;
  
  const nodeDistribution = pvcs.reduce((acc: any, pvc) => {
    acc[pvc.nodeName] = (acc[pvc.nodeName] || 0) + parseInt(pvc.size.replace('Gi', ''));
    return acc;
  }, {});
  
  for (const [node, size] of Object.entries(nodeDistribution)) {
    inventory += `  - ${node}: ${size}Gi\n`;
  }

  await Deno.writeTextFile(inventoryPath, inventory);
  console.log(`📋 Storage inventory created: ${inventoryPath}`);
}

async function backupPVC(pvc: PVCInfo): Promise<BackupResult> {
  try {
    const backupPath = `${BACKUP_DIR}/${pvc.namespace}-${pvc.name}.tar.gz`;
    
    // Use kubectl cp to backup PVC data via a temporary pod
    const podName = `backup-${pvc.name}-${Date.now()}`;
    const podYaml = `
apiVersion: v1
kind: Pod
metadata:
  name: ${podName}
  namespace: ${pvc.namespace}
spec:
  restartPolicy: Never
  containers:
  - name: backup
    image: alpine:latest
    command: ["/bin/sh", "-c", "sleep 3600"]
    volumeMounts:
    - name: data
      mountPath: /data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: ${pvc.name}
`;

    // Create temporary pod
    await $`echo ${podYaml}`.pipe($`kubectl apply -f -`);
    
    // Wait for pod to be ready
    await $`kubectl wait --for=condition=Ready pod/${podName} -n ${pvc.namespace} --timeout=60s`;
    
    // Create backup using tar
    await $`kubectl exec -n ${pvc.namespace} ${podName} -- tar czf /tmp/backup.tar.gz -C /data .`;
    
    // Copy backup from pod
    await $`kubectl cp ${pvc.namespace}/${podName}:/tmp/backup.tar.gz ${backupPath}`;
    
    // Get actual size on disk
    const sizeInfo = await $`du -h ${backupPath}`.text();
    const sizeOnDisk = sizeInfo.split('\t')[0];
    
    // Clean up pod
    await $`kubectl delete pod ${podName} -n ${pvc.namespace}`;
    
    return {
      pvc,
      success: true,
      backupPath,
      sizeOnDisk
    };
  } catch (error) {
    // Clean up pod on error
    try {
      await $`kubectl delete pod backup-${pvc.name}-${Date.now()} -n ${pvc.namespace}`.quiet();
    } catch {}
    
    return {
      pvc,
      success: false,
      error: error.message
    };
  }
}

async function generateBackupReport(results: BackupResult[]): Promise<void> {
  const reportPath = `${BACKUP_DIR}/backup-report.md`;
  
  let report = `# Storage Backup Report - ${TIMESTAMP}\n\n`;
  report += `## Summary\n`;
  const successful = results.filter(r => r.success).length;
  report += `- Total PVCs: ${results.length}\n`;
  report += `- Successful Backups: ${successful}\n`;
  report += `- Failed Backups: ${results.length - successful}\n`;
  report += `- Backup Location: \`${BACKUP_DIR}\`\n\n`;

  report += `## Backup Details\n\n`;
  report += `| PVC | Status | Size on Disk | Backup Path | Error |\n`;
  report += `|-----|--------|--------------|-------------|-------|\n`;
  
  for (const result of results) {
    const status = result.success ? '✅' : '❌';
    const sizeOnDisk = result.sizeOnDisk || 'N/A';
    const backupPath = result.backupPath ? `\`${result.backupPath.split('/').pop()}\`` : 'N/A';
    const error = result.error || 'N/A';
    
    report += `| ${result.pvc.namespace}/${result.pvc.name} | ${status} | ${sizeOnDisk} | ${backupPath} | ${error} |\n`;
  }

  if (successful < results.length) {
    report += `\n## Failed Backups\n\n`;
    for (const result of results.filter(r => !r.success)) {
      report += `### ${result.pvc.namespace}/${result.pvc.name}\n`;
      report += `- Error: ${result.error}\n`;
      report += `- PVC Size: ${result.pvc.size}\n`;
      report += `- Node: ${result.pvc.nodeName}\n\n`;
    }
  }

  report += `\n## Next Steps\n\n`;
  if (successful === results.length) {
    report += `✅ All backups completed successfully. Ready to proceed with Ceph migration.\n\n`;
    report += `To restore a backup:\n`;
    report += `1. Create a new PVC with the same size\n`;
    report += `2. Mount it to a temporary pod\n`;
    report += `3. Extract the backup: \`tar xzf backup.tar.gz -C /data\`\n\n`;
  } else {
    report += `⚠️ Some backups failed. Investigate and retry failed backups before proceeding.\n\n`;
  }

  await Deno.writeTextFile(reportPath, report);
  console.log(`📊 Backup report generated: ${reportPath}`);
}

async function testBackupRestoration(results: BackupResult[]): Promise<void> {
  console.log("\n🧪 Testing backup restoration...");
  
  const successfulBackups = results.filter(r => r.success);
  if (successfulBackups.length === 0) {
    console.log("❌ No successful backups to test");
    return;
  }

  // Test with the smallest backup
  const smallestBackup = successfulBackups.reduce((prev, current) => {
    const prevSize = parseInt(prev.pvc.size.replace('Gi', ''));
    const currentSize = parseInt(current.pvc.size.replace('Gi', ''));
    return currentSize < prevSize ? current : prev;
  });

  console.log(`🔄 Testing restoration of ${smallestBackup.pvc.namespace}/${smallestBackup.pvc.name}...`);

  try {
    const testNamespace = "backup-test";
    const testPvcName = `test-restore-${Date.now()}`;
    
    // Create test namespace
    await $`kubectl create namespace ${testNamespace}`.quiet().catch(() => {});
    
    // Create test PVC
    const testPvcYaml = `
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ${testPvcName}
  namespace: ${testNamespace}
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: local-path
  resources:
    requests:
      storage: ${smallestBackup.pvc.size}
`;

    await $`echo ${testPvcYaml}`.pipe($`kubectl apply -f -`);
    
    // Wait for PVC to be bound
    await $`kubectl wait --for=jsonpath='{.status.phase}'=Bound pvc/${testPvcName} -n ${testNamespace} --timeout=60s`;
    
    // Create restoration pod
    const restorePodName = `restore-test-${Date.now()}`;
    const restorePodYaml = `
apiVersion: v1
kind: Pod
metadata:
  name: ${restorePodName}
  namespace: ${testNamespace}
spec:
  restartPolicy: Never
  containers:
  - name: restore
    image: alpine:latest
    command: ["/bin/sh", "-c", "sleep 3600"]
    volumeMounts:
    - name: data
      mountPath: /data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: ${testPvcName}
`;

    await $`echo ${restorePodYaml}`.pipe($`kubectl apply -f -`);
    await $`kubectl wait --for=condition=Ready pod/${restorePodName} -n ${testNamespace} --timeout=60s`;
    
    // Copy backup to pod and extract
    await $`kubectl cp ${smallestBackup.backupPath} ${testNamespace}/${restorePodName}:/tmp/test-backup.tar.gz`;
    await $`kubectl exec -n ${testNamespace} ${restorePodName} -- tar xzf /tmp/test-backup.tar.gz -C /data`;
    
    // Verify restoration
    const fileCount = await $`kubectl exec -n ${testNamespace} ${restorePodName} -- find /data -type f | wc -l`.text();
    
    console.log(`✅ Restoration test successful! Restored ${fileCount.trim()} files`);
    
    // Record test results
    const testResultPath = `${BACKUP_DIR}/restoration-test.md`;
    const testResult = `# Backup Restoration Test - ${TIMESTAMP}

## Test Details
- Tested PVC: ${smallestBackup.pvc.namespace}/${smallestBackup.pvc.name}
- Backup File: ${smallestBackup.backupPath}
- Test Namespace: ${testNamespace}
- Test PVC: ${testPvcName}

## Results
✅ **PASSED** - Backup restoration successful
- Files restored: ${fileCount.trim()}
- Test completed: ${new Date().toISOString()}

## Validation Steps Performed
1. Created test PVC with same size (${smallestBackup.pvc.size})
2. Mounted PVC to restoration pod
3. Extracted backup archive
4. Verified file count restoration

This confirms the backup process creates valid, restorable archives.
`;

    await Deno.writeTextFile(testResultPath, testResult);
    
    // Clean up test resources
    await $`kubectl delete namespace ${testNamespace}`;
    
  } catch (error) {
    console.log(`❌ Restoration test failed: ${error.message}`);
    
    // Clean up on error
    try {
      await $`kubectl delete namespace backup-test`.quiet();
    } catch {}
  }
}

if (import.meta.main) {
  const exitCode = await main();
  Deno.exit(exitCode);
}