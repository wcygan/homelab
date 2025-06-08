#!/usr/bin/env -S deno run --allow-all

import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { colors } from "@cliffy/ansi/colors";
import { $ } from "@david/dax";
import { MonitoringResult, ExitCode } from "./types/monitoring.ts";

interface StorageMetrics {
  namespace: string;
  pvcName: string;
  storageClass: string;
  capacity: string;
  used: string;
  available: string;
  usagePercent: number;
  status: "healthy" | "warning" | "critical";
  growthRatePerDay?: number;
  daysUntilFull?: number | null;
  node?: string;
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

interface HistoricalMetrics {
  timestamp: string;
  usagePercent: number;
  usedBytes: number;
}

interface MetricsHistory {
  [pvcKey: string]: HistoricalMetrics[];
}

class StorageMonitor {
  private static readonly HISTORY_CONFIGMAP = "storage-metrics-history";
  private static readonly HISTORY_NAMESPACE = "default";
  private static readonly MAX_HISTORY_ENTRIES = 30; // Keep 30 days of history
  private issues: string[] = [];

  constructor(
    private namespace?: string,
    private verbose = false,
    private warningThreshold = 80,
    private criticalThreshold = 90,
    private includeGrowthAnalysis = false,
    private jsonOutput = false,
  ) {}

  async run(checkProvisioner = false): Promise<void> {
    if (!this.jsonOutput) {
      console.log(colors.bold.blue("Storage Health Check"));
      console.log("=" . repeat(50));
    }

    let exitCode = ExitCode.SUCCESS;
    this.issues = [];

    try {
      const metrics = await this.collectPVCMetrics();
      
      if (this.includeGrowthAnalysis) {
        await this.analyzeGrowthRates(metrics);
      }
      
      if (this.jsonOutput) {
        const result = await this.createMonitoringResult(metrics, checkProvisioner);
        console.log(JSON.stringify(result, null, 2));
        exitCode = this.getExitCodeFromResult(result);
      } else {
        this.displayResults(metrics);
        
        // Store current metrics for future analysis
        await this.storeMetricsHistory(metrics);
        
        // Check provisioner health if requested
        if (checkProvisioner) {
          await this.checkProvisionerHealth();
        }
        
        // Check for critical issues
        const criticalPVCs = metrics.filter(m => m.status === "critical");
        if (criticalPVCs.length > 0) {
          console.log(colors.bold.red(`\n⚠️  ${criticalPVCs.length} PVCs in critical state!`));
          exitCode = ExitCode.CRITICAL;
        } else if (metrics.filter(m => m.status === "warning").length > 0) {
          exitCode = ExitCode.WARNING;
        }
      }
    } catch (error) {
      if (this.jsonOutput) {
        const result: MonitoringResult = {
          status: "error",
          timestamp: new Date().toISOString(),
          summary: {
            total: 0,
            healthy: 0,
            warnings: 0,
            critical: 0,
          },
          details: [],
          issues: [`Script execution error: ${error.message}`],
        };
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.error(colors.red(`Error: ${error.message}`));
      }
      exitCode = ExitCode.ERROR;
    }
    
    Deno.exit(exitCode);
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

    const headers = ["Namespace", "PVC Name", "Storage Class", "Capacity", "Used", "Available", "Usage %", "Status"];
    if (this.includeGrowthAnalysis) {
      headers.push("Growth/Day", "Days Until Full");
    }

    const table = new Table()
      .header(headers)
      .body(
        metrics.map(m => {
          const row = [
            m.namespace,
            m.pvcName,
            m.storageClass,
            m.capacity,
            m.used,
            m.available,
            this.formatUsagePercent(m.usagePercent),
            this.formatStatus(m.status),
          ];
          
          if (this.includeGrowthAnalysis) {
            row.push(
              this.formatGrowthRate(m.growthRatePerDay),
              this.formatDaysUntilFull(m.daysUntilFull)
            );
          }
          
          return row;
        })
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
    
    if (this.includeGrowthAnalysis) {
      const rapidGrowth = metrics.filter(m => (m.growthRatePerDay ?? 0) > 5);
      if (rapidGrowth.length > 0) {
        console.log(colors.yellow(`  Rapid Growth (>5%/day): ${rapidGrowth.length}`));
      }
    }
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

  private formatGrowthRate(rate?: number): string {
    if (rate === undefined) return colors.gray("N/A");
    const color = rate > 5 ? colors.red : rate > 2 ? colors.yellow : colors.green;
    return color(`${rate > 0 ? '+' : ''}${rate.toFixed(1)}%`);
  }

  private formatDaysUntilFull(days?: number | null): string {
    if (days === undefined || days === null) return colors.gray("N/A");
    if (days < 0) return colors.gray("Never");
    if (days < 7) return colors.red(`${days.toFixed(0)} days`);
    if (days < 30) return colors.yellow(`${days.toFixed(0)} days`);
    return colors.green(`${days.toFixed(0)} days`);
  }

  async analyzeGrowthRates(metrics: StorageMetrics[]): Promise<void> {
    const history = await this.loadMetricsHistory();
    
    for (const metric of metrics) {
      const pvcKey = `${metric.namespace}/${metric.pvcName}`;
      const historicalData = history[pvcKey] || [];
      
      if (historicalData.length >= 2) {
        // Calculate growth rate
        const oldestEntry = historicalData[0];
        const daysDiff = (Date.now() - new Date(oldestEntry.timestamp).getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysDiff > 0) {
          const growthPercent = metric.usagePercent - oldestEntry.usagePercent;
          metric.growthRatePerDay = growthPercent / daysDiff;
          
          // Predict days until full
          if (metric.growthRatePerDay > 0) {
            const remainingPercent = 100 - metric.usagePercent;
            metric.daysUntilFull = remainingPercent / metric.growthRatePerDay;
          } else {
            metric.daysUntilFull = null;
          }
        }
      }
      
      // Get node information
      if (metric.pvcName) {
        try {
          const pvcs = await $`kubectl get pvc ${metric.pvcName} -n ${metric.namespace} -o json`.json();
          if (pvcs.spec?.volumeName) {
            const pv = await $`kubectl get pv ${pvcs.spec.volumeName} -o json`.json();
            const nodeAffinity = pv.spec.nodeAffinity?.required?.nodeSelectorTerms?.[0];
            const nodeSelector = nodeAffinity?.matchExpressions?.find((expr: any) => 
              expr.key === "kubernetes.io/hostname"
            );
            if (nodeSelector?.values?.[0]) {
              metric.node = nodeSelector.values[0];
            }
          }
        } catch {}
      }
    }
  }

  async loadMetricsHistory(): Promise<MetricsHistory> {
    try {
      const cm = await $`kubectl get configmap ${StorageMonitor.HISTORY_CONFIGMAP} -n ${StorageMonitor.HISTORY_NAMESPACE} -o json`.json();
      return JSON.parse(cm.data?.history || "{}");
    } catch {
      // ConfigMap doesn't exist yet
      return {};
    }
  }

  async storeMetricsHistory(metrics: StorageMetrics[]): Promise<void> {
    const history = await this.loadMetricsHistory();
    const timestamp = new Date().toISOString();
    
    for (const metric of metrics) {
      const pvcKey = `${metric.namespace}/${metric.pvcName}`;
      if (!history[pvcKey]) {
        history[pvcKey] = [];
      }
      
      // Parse used bytes for historical tracking
      const usedBytes = this.parseStorageSize(metric.used);
      
      history[pvcKey].push({
        timestamp,
        usagePercent: metric.usagePercent,
        usedBytes,
      });
      
      // Keep only the last N entries
      if (history[pvcKey].length > StorageMonitor.MAX_HISTORY_ENTRIES) {
        history[pvcKey] = history[pvcKey].slice(-StorageMonitor.MAX_HISTORY_ENTRIES);
      }
    }
    
    // Save back to ConfigMap using a temp file to avoid pipe issues
    const historyJson = JSON.stringify(history);
    const tempFile = await Deno.makeTempFile({ suffix: ".json" });
    
    try {
      await Deno.writeTextFile(tempFile, historyJson);
      
      // Check if ConfigMap exists
      const exists = await $`kubectl get configmap ${StorageMonitor.HISTORY_CONFIGMAP} -n ${StorageMonitor.HISTORY_NAMESPACE}`.quiet().noThrow();
      
      if (exists.code === 0) {
        // Update existing ConfigMap
        await $`kubectl create configmap ${StorageMonitor.HISTORY_CONFIGMAP} -n ${StorageMonitor.HISTORY_NAMESPACE} --from-file=history=${tempFile} --dry-run=client -o yaml | kubectl replace -f -`;
      } else {
        // Create new ConfigMap
        await $`kubectl create configmap ${StorageMonitor.HISTORY_CONFIGMAP} -n ${StorageMonitor.HISTORY_NAMESPACE} --from-file=history=${tempFile}`;
      }
    } catch (error) {
      if (this.verbose) {
        console.log(colors.yellow(`Could not store metrics history: ${error.message}`));
      }
    } finally {
      // Clean up temp file
      try {
        await Deno.remove(tempFile);
      } catch {}
    }
  }

  private parseStorageSize(size: string): number {
    if (size === "Unknown") return 0;
    
    const match = size.match(/^([\d.]+)([KMGT]?)i?B?$/i);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    
    const multipliers: { [key: string]: number } = {
      '': 1,
      'K': 1024,
      'M': 1024 * 1024,
      'G': 1024 * 1024 * 1024,
      'T': 1024 * 1024 * 1024 * 1024,
    };
    
    return value * (multipliers[unit] || 1);
  }

  async checkProvisionerHealth(): Promise<void> {
    if (!this.jsonOutput) {
      console.log("\n" + colors.bold.blue("Storage Provisioner Health"));
      console.log("=" . repeat(50));
    }
    
    try {
      // Check local-path-provisioner deployment
      const deployment = await $`kubectl get deployment local-path-provisioner -n storage -o json`.json();
      
      const replicas = deployment.status.replicas || 0;
      const readyReplicas = deployment.status.readyReplicas || 0;
      const status = readyReplicas === replicas ? colors.green("✅ Healthy") : colors.red("❌ Unhealthy");
      
      if (!this.jsonOutput) {
        console.log(`\nLocal Path Provisioner:`);
        console.log(`  Status: ${status}`);
        console.log(`  Replicas: ${readyReplicas}/${replicas}`);
        
        // Check for recent events
        const events = await $`kubectl get events -n storage --field-selector involvedObject.name=local-path-provisioner --sort-by='.lastTimestamp' -o json`.json();
        const recentEvents = (events.items || []).slice(-5);
        
        if (recentEvents.length > 0) {
          console.log(`  Recent Events:`);
          for (const event of recentEvents) {
            const type = event.type === "Warning" ? colors.yellow("Warning") : colors.gray("Normal");
            console.log(`    ${type}: ${event.message}`);
          }
        }
        
        // Check for pending PVCs
        const allPVCs = await $`kubectl get pvc -A -o json`.json();
        const pendingPVCs = (allPVCs.items || []).filter((pvc: any) => pvc.status.phase === "Pending");
        
        if (pendingPVCs.length > 0) {
          console.log(colors.yellow(`\n⚠️  ${pendingPVCs.length} PVCs pending provisioning:`));
          for (const pvc of pendingPVCs) {
            const age = this.getResourceAge(pvc.metadata.creationTimestamp);
            console.log(`  - ${pvc.metadata.namespace}/${pvc.metadata.name} (${age})`);
          }
        } else {
          console.log(colors.green("\n✅ No pending PVCs"));
        }
      }
      
      // Check provisioner logs for errors
      if (this.verbose && !this.jsonOutput) {
        console.log("\nChecking provisioner logs for recent errors...");
        try {
          const logs = await $`kubectl logs -n storage deployment/local-path-provisioner --tail=50 --since=1h`.text();
          const errorLines = logs.split('\n').filter(line => 
            line.toLowerCase().includes('error') || 
            line.toLowerCase().includes('fail')
          );
          
          if (errorLines.length > 0) {
            console.log(colors.yellow(`Found ${errorLines.length} error entries in recent logs`));
          } else {
            console.log(colors.green("No errors in recent logs"));
          }
        } catch {}
      }
      
    } catch (error) {
      if (!this.jsonOutput) {
        console.log(colors.red(`Could not check provisioner health: ${error.message}`));
      }
    }
  }
  
  private getResourceAge(timestamp: string): string {
    const age = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(age / (1000 * 60));
    const hours = Math.floor(age / (1000 * 60 * 60));
    const days = Math.floor(age / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
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

  private async createMonitoringResult(metrics: StorageMetrics[], checkProvisioner: boolean): Promise<MonitoringResult> {
    const total = metrics.length;
    const critical = metrics.filter(m => m.status === "critical").length;
    const warning = metrics.filter(m => m.status === "warning").length;
    const healthy = metrics.filter(m => m.status === "healthy").length;

    // Collect issues
    for (const metric of metrics) {
      if (metric.status === "critical") {
        this.issues.push(`PVC ${metric.namespace}/${metric.pvcName} is ${metric.usagePercent}% full (critical)`);
      } else if (metric.status === "warning") {
        this.issues.push(`PVC ${metric.namespace}/${metric.pvcName} is ${metric.usagePercent}% full (warning)`);
      }
      
      if (metric.growthRatePerDay && metric.daysUntilFull !== null && metric.daysUntilFull < 30) {
        this.issues.push(`PVC ${metric.namespace}/${metric.pvcName} will be full in ${metric.daysUntilFull} days at current growth rate`);
      }
    }

    // Check provisioner if requested
    let provisionerHealthy = true;
    if (checkProvisioner) {
      provisionerHealthy = await this.checkProvisionerHealthJson();
    }

    const status: MonitoringResult["status"] = 
      critical > 0 ? "critical" :
      warning > 0 ? "warning" :
      provisionerHealthy ? "healthy" : "warning";

    return {
      status,
      timestamp: new Date().toISOString(),
      summary: {
        total,
        healthy,
        warnings: warning,
        critical,
      },
      details: {
        pvcs: metrics,
        checkProvisioner,
        provisionerHealthy,
        thresholds: {
          warning: this.warningThreshold,
          critical: this.criticalThreshold,
        }
      },
      issues: this.issues,
    };
  }

  private async checkProvisionerHealthJson(): Promise<boolean> {
    try {
      const deployment = await $`kubectl get deployment local-path-provisioner -n storage -o json`.json();
      const replicas = deployment.status.replicas || 0;
      const readyReplicas = deployment.status.readyReplicas || 0;
      
      if (readyReplicas !== replicas) {
        this.issues.push(`Local path provisioner unhealthy: ${readyReplicas}/${replicas} replicas ready`);
        return false;
      }
      
      // Check for pending PVCs
      const allPVCs = await $`kubectl get pvc -A -o json`.json();
      const pendingPVCs = (allPVCs.items || []).filter((pvc: any) => pvc.status.phase === "Pending");
      
      if (pendingPVCs.length > 0) {
        this.issues.push(`${pendingPVCs.length} PVCs pending provisioning`);
        return false;
      }
      
      return true;
    } catch (error) {
      this.issues.push(`Could not check provisioner health: ${error.message}`);
      return false;
    }
  }

  private getExitCodeFromResult(result: MonitoringResult): number {
    switch (result.status) {
      case "healthy":
        return ExitCode.SUCCESS;
      case "warning":
        return ExitCode.WARNING;
      case "critical":
        return ExitCode.CRITICAL;
      case "error":
        return ExitCode.ERROR;
    }
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
  .option("-g, --growth-analysis", "Include growth rate analysis")
  .option("-p, --check-provisioner", "Check storage provisioner health")
  .option("--json", "Output results in JSON format")
  // TODO: Future options
  // .option("--watch", "Run continuously and watch for changes")
  // .option("--interval <seconds:number>", "Check interval in seconds", { default: 300 })
  // .option("--export <format:string>", "Export metrics (json|prometheus)")
  // .option("--alert-webhook <url:string>", "Webhook URL for alerts")
  .action(async (options) => {
    const monitor = new StorageMonitor(
      options.namespace,
      options.verbose,
      options.warning,
      options.critical,
      options.growthAnalysis,
      options.json,
    );
    await monitor.run(options.checkProvisioner);
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