#!/usr/bin/env -S deno run --allow-all

import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { colors } from "@cliffy/ansi/colors";
import { $ } from "@david/dax";

interface StorageMetrics {
  namespace: string;
  pvcName: string;
  storageClass: string;
  capacity: string;
  used: string;
  available: string;
  usagePercent: number;
  status: "healthy" | "warning" | "critical";
  // TODO: Future additions
  // growthRatePerDay: number;
  // daysUntilFull: number | null;
  // node: string;
  // lastBackup?: Date;
}

interface PVCInfo {
  metadata: {
    name: string;
    namespace: string;
  };
  spec: {
    storageClassName: string;
    volumeName?: string;
  };
  status: {
    capacity?: {
      storage: string;
    };
    phase: string;
  };
}

class StorageMonitor {
  constructor(
    private namespace?: string,
    private verbose = false,
    private warningThreshold = 80,
    private criticalThreshold = 90,
  ) {}

  async run(): Promise<void> {
    console.log(colors.bold.blue("Storage Health Check"));
    console.log("=" . repeat(50));

    try {
      const metrics = await this.collectPVCMetrics();
      this.displayResults(metrics);
      
      // Check for critical issues
      const criticalPVCs = metrics.filter(m => m.status === "critical");
      if (criticalPVCs.length > 0) {
        console.log(colors.bold.red(`\n⚠️  ${criticalPVCs.length} PVCs in critical state!`));
        Deno.exit(1);
      }
    } catch (error) {
      console.error(colors.red(`Error: ${error.message}`));
      Deno.exit(1);
    }
  }

  async collectPVCMetrics(): Promise<StorageMetrics[]> {
    const pvcs = await this.getPVCs();
    const metrics: StorageMetrics[] = [];

    for (const pvc of pvcs) {
      if (pvc.status.phase !== "Bound") {
        if (this.verbose) {
          console.log(colors.yellow(`Skipping unbound PVC: ${pvc.metadata.namespace}/${pvc.metadata.name}`));
        }
        continue;
      }

      const capacity = pvc.status.capacity?.storage || "Unknown";
      
      // Get actual usage from pods
      const usage = await this.getActualUsage(pvc);
      
      metrics.push({
        namespace: pvc.metadata.namespace,
        pvcName: pvc.metadata.name,
        storageClass: pvc.spec.storageClassName || "default",
        capacity,
        used: usage.used,
        available: usage.available,
        usagePercent: usage.percent,
        status: this.getHealthStatus(usage.percent),
      });
    }

    return metrics.sort((a, b) => b.usagePercent - a.usagePercent);
  }

  private async getPVCs(): Promise<PVCInfo[]> {
    const namespaceFilter = this.namespace ? `-n ${this.namespace}` : "-A";
    const result = await $`kubectl get pvc ${namespaceFilter} -o json`.json();
    return result.items as PVCInfo[];
  }

  private async getActualUsage(pvc: PVCInfo): Promise<{used: string, available: string, percent: number}> {
    try {
      // Find pods using this PVC
      const pods = await $`kubectl get pods -n ${pvc.metadata.namespace} -o json`.json();
      
      for (const pod of pods.items) {
        // Check if pod uses this PVC
        const volumeMount = this.findVolumeMount(pod, pvc.metadata.name);
        if (volumeMount && pod.status.phase === "Running") {
          // Get the first container name
          const containerName = pod.spec.containers[0]?.name;
          if (!containerName) continue;
          
          try {
            // Execute df command in the pod
            const dfResult = await $`kubectl exec -n ${pvc.metadata.namespace} ${pod.metadata.name} -c ${containerName} -- df -h ${volumeMount}`.text();
            const lines = dfResult.trim().split('\n');
            
            if (lines.length > 1) {
              // Parse df output: Filesystem Size Used Avail Use% Mounted
              const parts = lines[1].split(/\s+/);
              if (parts.length >= 5) {
                const used = parts[2];
                const available = parts[3];
                const percentStr = parts[4].replace('%', '');
                const percent = parseInt(percentStr) || 0;
                
                if (this.verbose) {
                  console.log(colors.gray(`  Found usage for ${pvc.metadata.namespace}/${pvc.metadata.name}: ${used}/${parts[1]} (${percent}%)`));
                }
                
                return { used, available, percent };
              }
            }
          } catch (error) {
            // Pod might not have df command, continue to next pod
            if (this.verbose) {
              console.log(colors.gray(`  Could not get df from pod ${pod.metadata.name}: ${error.message}`));
            }
          }
        }
      }
    } catch (error) {
      if (this.verbose) {
        console.log(colors.yellow(`  Could not get actual usage for ${pvc.metadata.namespace}/${pvc.metadata.name}: ${error.message}`));
      }
    }
    
    // Fallback to showing capacity as available
    const capacity = pvc.status.capacity?.storage || "Unknown";
    return { used: "Unknown", available: capacity, percent: 0 };
  }

  private findVolumeMount(pod: any, pvcName: string): string | null {
    // Find if pod uses this PVC
    const volume = pod.spec.volumes?.find((v: any) => 
      v.persistentVolumeClaim?.claimName === pvcName
    );
    
    if (!volume) return null;
    
    // Find mount path
    for (const container of pod.spec.containers || []) {
      const mount = container.volumeMounts?.find((vm: any) => vm.name === volume.name);
      if (mount) return mount.mountPath;
    }
    
    return null;
  }

  private getHealthStatus(usagePercent: number): StorageMetrics["status"] {
    if (usagePercent >= this.criticalThreshold) return "critical";
    if (usagePercent >= this.warningThreshold) return "warning";
    return "healthy";
  }

  private displayResults(metrics: StorageMetrics[]): void {
    if (metrics.length === 0) {
      console.log(colors.yellow("No PVCs found"));
      return;
    }

    const table = new Table()
      .header(["Namespace", "PVC Name", "Storage Class", "Capacity", "Used", "Available", "Usage %", "Status"])
      .body(
        metrics.map(m => [
          m.namespace,
          m.pvcName,
          m.storageClass,
          m.capacity,
          m.used,
          m.available,
          this.formatUsagePercent(m.usagePercent),
          this.formatStatus(m.status),
        ])
      )
      .padding(1)
      .border(true);

    console.log(table.toString());

    // Summary
    const summary = {
      total: metrics.length,
      healthy: metrics.filter(m => m.status === "healthy").length,
      warning: metrics.filter(m => m.status === "warning").length,
      critical: metrics.filter(m => m.status === "critical").length,
    };

    console.log("\nSummary:");
    console.log(colors.green(`  Healthy: ${summary.healthy}`));
    console.log(colors.yellow(`  Warning: ${summary.warning}`));
    console.log(colors.red(`  Critical: ${summary.critical}`));
  }

  private formatUsagePercent(percent: number): string {
    const color = percent >= this.criticalThreshold ? colors.red :
                  percent >= this.warningThreshold ? colors.yellow :
                  colors.green;
    return color(`${percent}%`);
  }

  private formatStatus(status: StorageMetrics["status"]): string {
    switch (status) {
      case "healthy":
        return colors.green("✅ Healthy");
      case "warning":
        return colors.yellow("⚠️  Warning");
      case "critical":
        return colors.red("❌ Critical");
    }
  }

  // TODO: Future additions
  async checkProvisionerHealth(): Promise<void> {
    // Check local-path-provisioner pod health
    // Check for stuck provisioning operations
    // Monitor provisioner event logs
  }

  async calculateGrowthRates(): Promise<void> {
    // Store historical metrics in ConfigMap
    // Calculate daily/weekly growth rates
    // Predict when volumes will fill
  }

  async exportMetrics(format: "json" | "prometheus"): Promise<void> {
    // Export metrics in various formats
    // Support Prometheus pushgateway
  }

  async runContinuousMode(interval: number): Promise<void> {
    // Run checks continuously
    // Alert on threshold changes
    // Support webhook notifications
  }
}

// CLI setup
const command = new Command()
  .name("storage-health-check")
  .version("1.0.0")
  .description("Monitor PVC usage and storage health in Kubernetes cluster")
  .option("-n, --namespace <namespace:string>", "Filter by namespace")
  .option("-v, --verbose", "Enable verbose output")
  .option("-w, --warning <threshold:number>", "Warning threshold percentage", { default: 80 })
  .option("-c, --critical <threshold:number>", "Critical threshold percentage", { default: 90 })
  // TODO: Future options
  // .option("--watch", "Run continuously and watch for changes")
  // .option("--interval <seconds:number>", "Check interval in seconds", { default: 300 })
  // .option("--export <format:string>", "Export metrics (json|prometheus)")
  // .option("--growth-analysis", "Include growth rate analysis")
  // .option("--check-provisioner", "Check storage provisioner health")
  // .option("--alert-webhook <url:string>", "Webhook URL for alerts")
  .action(async (options) => {
    const monitor = new StorageMonitor(
      options.namespace,
      options.verbose,
      options.warning,
      options.critical,
    );
    await monitor.run();
  });

if (import.meta.main) {
  await command.parse(Deno.args);
}

/* Future Enhancements TODO List:
 * 
 * 1. Actual Usage Collection:
 *    - Execute df commands on nodes via kubectl exec
 *    - Parse volume mount points and match to PVCs
 *    - Handle different storage types (local-path, NFS, etc.)
 * 
 * 2. Growth Rate Analysis:
 *    - Store metrics history in ConfigMap
 *    - Calculate daily/weekly/monthly growth rates
 *    - Predict time until volume full
 *    - Alert on abnormal growth patterns
 * 
 * 3. Storage Provisioner Monitoring:
 *    - Check local-path-provisioner pod health
 *    - Monitor provisioning event logs
 *    - Detect stuck volume operations
 *    - Track provisioning latency
 * 
 * 4. Advanced Features:
 *    - Backup status integration
 *    - Storage performance metrics (IOPS, latency)
 *    - Volume snapshot monitoring
 *    - Cross-node storage distribution analysis
 * 
 * 5. Integration:
 *    - Prometheus metrics export
 *    - Grafana dashboard templates
 *    - Alert manager integration
 *    - Slack/webhook notifications
 * 
 * 6. Performance Optimization:
 *    - Parallel metric collection
 *    - Caching for frequently accessed data
 *    - Batch API calls
 */