#!/usr/bin/env -S deno run --allow-all

import { $ } from "@david/dax";
import { colors } from "@cliffy/ansi/colors";
import { Command } from "@cliffy/command";

interface BackupTestResult {
  status: "healthy" | "warning" | "critical" | "error";
  timestamp: string;
  summary: {
    scheduledBackups: number;
    recentBackups: number;
    successfulBackups: number;
    testBackupCreated: boolean;
    testRestoreSuccessful: boolean;
  };
  details: {
    schedules: any[];
    backups: any[];
    testResults: {
      backupName?: string;
      restoreName?: string;
      verificationPassed: boolean;
    };
  };
  issues: string[];
}

class VeleroBackupTester {
  private issues: string[] = [];
  private testNamespace = "velero-test";
  private testBackupName = "";
  private testRestoreName = "";
  private verbose = false;
  private skipRestore = false;
  private manualMode = false;

  constructor(options: { verbose?: boolean; skipRestore?: boolean; manual?: boolean }) {
    this.verbose = options.verbose || false;
    this.skipRestore = options.skipRestore || false;
    this.manualMode = options.manual || false;
  }

  async runTests(): Promise<BackupTestResult> {
    const startTime = Date.now();
    console.log(colors.bold.blue("🔍 Velero Backup Integration Test"));
    console.log("=" . repeat(50));

    const result: BackupTestResult = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      summary: {
        scheduledBackups: 0,
        recentBackups: 0,
        successfulBackups: 0,
        testBackupCreated: false,
        testRestoreSuccessful: false,
      },
      details: {
        schedules: [],
        backups: [],
        testResults: {
          verificationPassed: false,
        },
      },
      issues: [],
    };

    try {
      // Step 1: Check Velero installation
      await this.checkVeleroInstallation();

      // Step 2: Verify backup schedules
      const schedules = await this.getBackupSchedules();
      result.details.schedules = schedules;
      result.summary.scheduledBackups = schedules.length;

      // Step 3: Check existing backups
      const backups = await this.getExistingBackups();
      result.details.backups = backups;
      result.summary.recentBackups = backups.length;
      result.summary.successfulBackups = backups.filter(b => b.status === "Completed").length;

      // Step 4: Create test backup
      if (!this.manualMode) {
        const backupCreated = await this.createTestBackup();
        result.summary.testBackupCreated = backupCreated;
        result.details.testResults.backupName = this.testBackupName;
      }

      // Step 5: Test restore (if not skipped)
      if (!this.skipRestore && !this.manualMode && result.summary.testBackupCreated) {
        const restoreSuccessful = await this.testRestore();
        result.summary.testRestoreSuccessful = restoreSuccessful;
        result.details.testResults.restoreName = this.testRestoreName;
      }

      // Step 6: Verify backup content
      if (result.summary.testBackupCreated || this.manualMode) {
        const verificationPassed = await this.verifyBackupContent();
        result.details.testResults.verificationPassed = verificationPassed;
      }

      // Determine overall status
      if (this.issues.length === 0) {
        result.status = "healthy";
      } else if (this.issues.some(i => i.includes("CRITICAL"))) {
        result.status = "critical";
      } else if (this.issues.some(i => i.includes("WARNING"))) {
        result.status = "warning";
      }

      result.issues = this.issues;

    } catch (error) {
      result.status = "error";
      result.issues.push(`ERROR: ${error.message}`);
    } finally {
      // Cleanup test resources
      if (!this.manualMode) {
        await this.cleanup();
      }
    }

    // Display results
    this.displayResults(result);

    return result;
  }

  private async checkVeleroInstallation(): Promise<void> {
    try {
      const result = await $`velero version --client-only`.text();
      if (this.verbose) {
        console.log(colors.green("✅ Velero CLI installed"));
        console.log(colors.gray(result.trim()));
      }
    } catch {
      // Velero CLI not installed, use kubectl instead
      if (this.verbose) {
        console.log(colors.yellow("⚠️  Velero CLI not found, using kubectl"));
      }
    }

    // Check Velero deployment
    try {
      const pods = await $`kubectl get pods -n storage -l app.kubernetes.io/name=velero -o json`.json();
      const runningPods = pods.items.filter((p: any) => p.status.phase === "Running");
      
      if (runningPods.length === 0) {
        this.issues.push("CRITICAL: No Velero pods running");
      } else if (this.verbose) {
        console.log(colors.green(`✅ Velero deployment healthy (${runningPods.length} pods running)`));
      }
    } catch (error) {
      this.issues.push(`CRITICAL: Failed to check Velero deployment: ${error.message}`);
    }
  }

  private async getBackupSchedules(): Promise<any[]> {
    try {
      const schedules = await $`kubectl get schedules -n storage -o json`.json();
      
      if (this.verbose) {
        console.log(colors.blue("\n📅 Backup Schedules:"));
        for (const schedule of schedules.items) {
          console.log(`  - ${schedule.metadata.name}: ${schedule.spec.schedule} (${schedule.status.phase})`);
        }
      }

      if (schedules.items.length === 0) {
        this.issues.push("WARNING: No backup schedules configured");
      }

      return schedules.items;
    } catch (error) {
      this.issues.push(`ERROR: Failed to get backup schedules: ${error.message}`);
      return [];
    }
  }

  private async getExistingBackups(): Promise<any[]> {
    try {
      const backups = await $`kubectl get backups -n storage -o json`.json();
      
      // Filter for recent backups (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentBackups = backups.items.filter((b: any) => {
        const completionTime = new Date(b.status.completionTimestamp || b.metadata.creationTimestamp);
        return completionTime > sevenDaysAgo;
      });

      if (this.verbose) {
        console.log(colors.blue("\n📦 Recent Backups (last 7 days):"));
        for (const backup of recentBackups) {
          const status = backup.status.phase;
          const statusIcon = status === "Completed" ? "✅" : "❌";
          console.log(`  ${statusIcon} ${backup.metadata.name}: ${status}`);
        }
      }

      if (recentBackups.length === 0) {
        this.issues.push("WARNING: No backups found in the last 7 days");
      }

      // Check for failed backups
      const failedBackups = recentBackups.filter((b: any) => 
        b.status.phase === "Failed" || b.status.phase === "PartiallyFailed"
      );
      
      if (failedBackups.length > 0) {
        this.issues.push(`WARNING: ${failedBackups.length} failed backups in the last 7 days`);
      }

      return recentBackups;
    } catch (error) {
      this.issues.push(`ERROR: Failed to get backups: ${error.message}`);
      return [];
    }
  }

  private async createTestBackup(): Promise<boolean> {
    console.log(colors.blue("\n🧪 Creating test backup..."));
    
    // First, create test namespace with test resources
    try {
      await this.createTestResources();
    } catch (error) {
      this.issues.push(`ERROR: Failed to create test resources: ${error.message}`);
      return false;
    }

    // Create backup
    this.testBackupName = `velero-test-${Date.now()}`;
    
    try {
      // Create backup using Kubernetes API
      const backupManifest = {
        apiVersion: "velero.io/v1",
        kind: "Backup",
        metadata: {
          name: this.testBackupName,
          namespace: "storage"
        },
        spec: {
          includedNamespaces: [this.testNamespace],
          ttl: "24h0m0s",
          storageLocation: "default",
          volumeSnapshotLocations: ["default"]
        }
      };

      if (this.verbose) {
        console.log(colors.gray(`  Creating backup: ${this.testBackupName}`));
      }

      await $`kubectl apply -f -`.stdin(JSON.stringify(backupManifest));
      
      // Wait for backup to complete
      console.log(colors.gray("  Waiting for backup to complete..."));
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds
      
      while (attempts < maxAttempts) {
        const backup = await $`kubectl get backup ${this.testBackupName} -n storage -o json`.json();
        
        if (backup.status?.phase === "Completed") {
          console.log(colors.green(`✅ Test backup created: ${this.testBackupName}`));
          return true;
        } else if (backup.status?.phase === "Failed" || backup.status?.phase === "PartiallyFailed") {
          this.issues.push(`ERROR: Backup failed with status: ${backup.status.phase}`);
          return false;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        attempts++;
      }
      
      this.issues.push("ERROR: Backup timed out after 30 seconds");
      return false;
    } catch (error) {
      this.issues.push(`ERROR: Failed to create test backup: ${error.message}`);
      return false;
    }
  }

  private async createTestResources(): Promise<void> {
    // Create test namespace
    try {
      await $`kubectl create namespace ${this.testNamespace}`.quiet();
    } catch {
      // Namespace might already exist
    }

    // Create test resources
    const testManifest = `
apiVersion: v1
kind: ConfigMap
metadata:
  name: velero-test-config
  namespace: ${this.testNamespace}
  labels:
    test: velero-integration
data:
  test-time: "${new Date().toISOString()}"
  test-data: "This is test data for Velero backup verification"
---
apiVersion: v1
kind: Secret
metadata:
  name: velero-test-secret
  namespace: ${this.testNamespace}
  labels:
    test: velero-integration
type: Opaque
stringData:
  test-key: "test-value-${Date.now()}"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: velero-test-app
  namespace: ${this.testNamespace}
  labels:
    test: velero-integration
spec:
  replicas: 1
  selector:
    matchLabels:
      app: velero-test
  template:
    metadata:
      labels:
        app: velero-test
    spec:
      containers:
      - name: test
        image: busybox:latest
        command: ["sleep", "3600"]
        env:
        - name: TEST_CONFIG
          valueFrom:
            configMapKeyRef:
              name: velero-test-config
              key: test-data
`;

    await $`kubectl apply -f -`.stdin(testManifest);
    
    // Wait for deployment to be ready
    await $`kubectl wait --for=condition=available --timeout=30s deployment/velero-test-app -n ${this.testNamespace}`.quiet();
    
    if (this.verbose) {
      console.log(colors.green(`✅ Test resources created in namespace: ${this.testNamespace}`));
    }
  }

  private async testRestore(): Promise<boolean> {
    console.log(colors.blue("\n🔄 Testing restore functionality..."));
    
    // Delete test namespace
    try {
      await $`kubectl delete namespace ${this.testNamespace} --wait=false`.quiet();
      await $`kubectl wait --for=delete namespace/${this.testNamespace} --timeout=60s`.quiet();
    } catch {
      // Continue even if deletion fails
    }

    // Perform restore
    this.testRestoreName = `restore-${this.testBackupName}`;
    
    try {
      // Create restore using Kubernetes API
      const restoreManifest = {
        apiVersion: "velero.io/v1",
        kind: "Restore",
        metadata: {
          name: this.testRestoreName,
          namespace: "storage"
        },
        spec: {
          backupName: this.testBackupName,
          includedNamespaces: [this.testNamespace]
        }
      };

      if (this.verbose) {
        console.log(colors.gray(`  Creating restore: ${this.testRestoreName}`));
      }

      await $`kubectl apply -f -`.stdin(JSON.stringify(restoreManifest));
      
      // Wait for restore to complete
      console.log(colors.gray("  Waiting for restore to complete..."));
      let attempts = 0;
      const maxAttempts = 60; // 60 seconds
      
      while (attempts < maxAttempts) {
        const restore = await $`kubectl get restore ${this.testRestoreName} -n storage -o json`.json();
        
        if (restore.status?.phase === "Completed") {
          console.log(colors.green(`✅ Test restore completed: ${this.testRestoreName}`));
          // Verify restored resources
          return await this.verifyRestoredResources();
        } else if (restore.status?.phase === "Failed" || restore.status?.phase === "PartiallyFailed") {
          this.issues.push(`ERROR: Restore failed with status: ${restore.status.phase}`);
          return false;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        attempts++;
      }
      
      this.issues.push("ERROR: Restore timed out after 60 seconds");
      return false;
    } catch (error) {
      this.issues.push(`ERROR: Failed to restore from backup: ${error.message}`);
      return false;
    }
  }

  private async verifyRestoredResources(): Promise<boolean> {
    try {
      // Check namespace exists
      await $`kubectl get namespace ${this.testNamespace}`.quiet();
      
      // Check resources exist
      const configMap = await $`kubectl get configmap velero-test-config -n ${this.testNamespace} -o json`.json();
      const secret = await $`kubectl get secret velero-test-secret -n ${this.testNamespace} -o json`.json();
      const deployment = await $`kubectl get deployment velero-test-app -n ${this.testNamespace} -o json`.json();
      
      // Verify content
      if (configMap.data["test-data"] !== "This is test data for Velero backup verification") {
        this.issues.push("WARNING: Restored ConfigMap data doesn't match original");
        return false;
      }
      
      if (!secret.data["test-key"]) {
        this.issues.push("WARNING: Restored Secret missing expected key");
        return false;
      }
      
      if (deployment.spec.replicas !== 1) {
        this.issues.push("WARNING: Restored Deployment replica count incorrect");
        return false;
      }
      
      console.log(colors.green("✅ Restored resources verified successfully"));
      return true;
    } catch (error) {
      this.issues.push(`ERROR: Failed to verify restored resources: ${error.message}`);
      return false;
    }
  }

  private async verifyBackupContent(): Promise<boolean> {
    if (this.manualMode) {
      console.log(colors.blue("\n📋 Manual Backup Verification Checklist:"));
      console.log("  1. Check backup exists: kubectl get backups -n storage");
      console.log("  2. Describe backup: kubectl describe backup <backup-name> -n storage");
      console.log("  3. Check backup logs: kubectl logs -n storage deployment/velero | grep <backup-name>");
      console.log("  4. Verify S3 bucket content: kubectl exec -n storage deployment/rook-ceph-tools -- s3cmd ls s3://velero/");
      return true;
    }

    try {
      // Get backup details
      const backup = await $`kubectl get backup ${this.testBackupName} -n storage -o json`.json();
      
      if (backup.status.phase !== "Completed") {
        this.issues.push(`WARNING: Test backup status is ${backup.status.phase}`);
        return false;
      }
      
      // Check backup has expected resources
      const itemCount = backup.status.progress?.itemsBackedUp || 0;
      if (itemCount < 3) { // We expect at least 3 resources (ConfigMap, Secret, Deployment)
        this.issues.push(`WARNING: Backup contains only ${itemCount} items (expected at least 3)`);
        return false;
      }
      
      if (this.verbose) {
        console.log(colors.green(`✅ Backup verified: ${itemCount} items backed up`));
      }
      
      return true;
    } catch (error) {
      this.issues.push(`ERROR: Failed to verify backup content: ${error.message}`);
      return false;
    }
  }

  private async cleanup(): Promise<void> {
    if (this.verbose) {
      console.log(colors.blue("\n🧹 Cleaning up test resources..."));
    }

    try {
      // Delete test namespace
      await $`kubectl delete namespace ${this.testNamespace} --wait=false`.quiet();
      
      // Delete test backup (optional - you might want to keep for debugging)
      if (this.testBackupName) {
        await $`kubectl delete backup ${this.testBackupName} -n storage --wait=false`.quiet();
      }
      
      // Delete test restore
      if (this.testRestoreName) {
        await $`kubectl delete restore ${this.testRestoreName} -n storage --wait=false`.quiet();
      }
      
      if (this.verbose) {
        console.log(colors.green("✅ Cleanup completed"));
      }
    } catch {
      // Ignore cleanup errors
    }
  }

  private displayResults(result: BackupTestResult): void {
    console.log(colors.bold("\n📊 Test Results"));
    console.log("=" . repeat(30));
    
    const statusColor = result.status === "healthy" ? colors.green : 
                       result.status === "warning" ? colors.yellow : colors.red;
    
    console.log(`Status: ${statusColor(result.status.toUpperCase())}`);
    console.log(`Scheduled Backups: ${result.summary.scheduledBackups}`);
    console.log(`Recent Backups: ${result.summary.recentBackups}`);
    console.log(`Successful Backups: ${result.summary.successfulBackups}`);
    
    if (!this.manualMode) {
      console.log(`Test Backup Created: ${result.summary.testBackupCreated ? "✅" : "❌"}`);
      if (!this.skipRestore) {
        console.log(`Test Restore Successful: ${result.summary.testRestoreSuccessful ? "✅" : "❌"}`);
      }
    }
    
    if (result.issues.length > 0) {
      console.log(colors.bold.red("\n⚠️  Issues Found:"));
      for (const issue of result.issues) {
        console.log(colors.red(`  - ${issue}`));
      }
    }
    
    console.log(colors.bold.blue("\n📚 Manual Backup Documentation"));
    console.log("=" . repeat(40));
    console.log("To manually create a backup outside of scheduled hours:\n");
    console.log("1. Full cluster backup:");
    console.log(colors.gray("   cat <<EOF | kubectl apply -f -"));
    console.log(colors.gray("   apiVersion: velero.io/v1"));
    console.log(colors.gray("   kind: Backup"));
    console.log(colors.gray("   metadata:"));
    console.log(colors.gray("     name: manual-backup-$(date +%Y%m%d-%H%M%S)"));
    console.log(colors.gray("     namespace: storage"));
    console.log(colors.gray("   spec:"));
    console.log(colors.gray("     includeClusterResources: true"));
    console.log(colors.gray("     storageLocation: default"));
    console.log(colors.gray("   EOF\n"));
    
    console.log("2. Namespace-specific backup:");
    console.log(colors.gray("   cat <<EOF | kubectl apply -f -"));
    console.log(colors.gray("   apiVersion: velero.io/v1"));
    console.log(colors.gray("   kind: Backup"));
    console.log(colors.gray("   metadata:"));
    console.log(colors.gray("     name: namespace-backup-$(date +%Y%m%d-%H%M%S)"));
    console.log(colors.gray("     namespace: storage"));
    console.log(colors.gray("   spec:"));
    console.log(colors.gray("     includedNamespaces:"));
    console.log(colors.gray("       - default"));
    console.log(colors.gray("       - monitoring"));
    console.log(colors.gray("   EOF\n"));
    
    console.log("3. Backup with specific TTL (retention):");
    console.log(colors.gray("   cat <<EOF | kubectl apply -f -"));
    console.log(colors.gray("   apiVersion: velero.io/v1"));
    console.log(colors.gray("   kind: Backup"));
    console.log(colors.gray("   metadata:"));
    console.log(colors.gray("     name: temp-backup-$(date +%Y%m%d-%H%M%S)"));
    console.log(colors.gray("     namespace: storage"));
    console.log(colors.gray("   spec:"));
    console.log(colors.gray("     ttl: 24h0m0s"));
    console.log(colors.gray("     includedNamespaces:"));
    console.log(colors.gray("       - default"));
    console.log(colors.gray("   EOF\n"));
    
    console.log("4. Check backup status:");
    console.log(colors.gray("   kubectl get backups -n storage"));
    console.log(colors.gray("   kubectl describe backup <backup-name> -n storage"));
    console.log(colors.gray("   kubectl logs -n storage deployment/velero | grep <backup-name>\n"));
    
    console.log("5. Restore from backup:");
    console.log(colors.gray("   cat <<EOF | kubectl apply -f -"));
    console.log(colors.gray("   apiVersion: velero.io/v1"));
    console.log(colors.gray("   kind: Restore"));
    console.log(colors.gray("   metadata:"));
    console.log(colors.gray("     name: restore-<backup-name>"));
    console.log(colors.gray("     namespace: storage"));
    console.log(colors.gray("   spec:"));
    console.log(colors.gray("     backupName: <backup-name>"));
    console.log(colors.gray("   EOF\n"));
  }

  async outputJSON(result: BackupTestResult): Promise<void> {
    console.log(JSON.stringify(result, null, 2));
  }
}

// CLI Command
const command = new Command()
  .name("test-velero-backup")
  .version("1.0.0")
  .description("Test Velero backup functionality and verify disaster recovery readiness")
  .option("-v, --verbose", "Enable verbose output")
  .option("--skip-restore", "Skip restore testing (only verify backups)")
  .option("--manual", "Show manual verification steps without creating test resources")
  .option("--json", "Output results in JSON format")
  .action(async (options) => {
    const tester = new VeleroBackupTester({
      verbose: options.verbose,
      skipRestore: options.skipRestore,
      manual: options.manual,
    });
    
    const result = await tester.runTests();
    
    if (options.json) {
      await tester.outputJSON(result);
    }
    
    // Exit with appropriate code
    if (result.status === "critical" || result.status === "error") {
      Deno.exit(2);
    } else if (result.status === "warning") {
      Deno.exit(1);
    }
  });

if (import.meta.main) {
  await command.parse(Deno.args);
}