#!/usr/bin/env -S deno run --allow-all

/**
 * Cluster Health Monitor
 * 
 * Comprehensive Kubernetes cluster health monitoring with Talos and Flux integration.
 * Provides real-time insights into cluster state, resource usage, and potential issues.
 * 
 * Features:
 * - Multi-layer health monitoring (nodes, etcd, workloads, resources)
 * - Flux GitOps status monitoring
 * - Real-time continuous monitoring mode
 * - Critical issue filtering
 * - Resource usage tracking
 * - Alert detection and reporting
 * 
 * Usage Examples:
 * 
 * # One-time comprehensive health check
 * deno task health:monitor
 * 
 * # Continuous monitoring (refreshes every 10 seconds)
 * deno task health:monitor --watch
 * 
 * # Monitor with custom refresh interval
 * deno task health:monitor --watch --interval 30
 * 
 * # Show only critical issues
 * deno task health:monitor --critical-only
 * 
 * # Include Flux GitOps monitoring
 * deno task health:monitor --flux
 * 
 * # Full monitoring setup for maintenance
 * deno task health:monitor --watch --flux --critical-only
 * 
 * # Quick check during operations
 * deno task health:monitor --critical-only
 * 
 * Monitoring Layers:
 * - Cluster: Node health, etcd quorum, schedulability
 * - Workloads: Pod distribution, critical pod health, restart counts
 * - Resources: CPU/memory usage, capacity planning
 * - Flux: GitOps reconciliation status (optional)
 * 
 * Alert Types:
 * - etcd quorum risks
 * - Node conditions (disk pressure, memory pressure, etc.)
 * - High resource usage
 * - Pod distribution imbalances
 * - Critical pod failures or restarts
 * - Flux reconciliation failures
 * 
 * Use Cases:
 * - Pre-maintenance health validation
 * - During hardware upgrades monitoring
 * - General cluster monitoring
 * - Troubleshooting cluster issues
 */

import { Command } from "jsr:@cliffy/command@1.0.0-rc.7";
import { colors } from "jsr:@cliffy/ansi@1.0.0-rc.7/colors";
import $ from "jsr:@david/dax@0.42.0";
import { Table } from "jsr:@cliffy/table@1.0.0-rc.7";

interface HealthStatus {
  timestamp: string;
  cluster: {
    healthy: boolean;
    nodes: {
      total: number;
      ready: number;
      cordoned: number;
    };
    etcd: {
      healthy: boolean;
      members: number;
      healthyMembers: number;
      leader?: string;
    };
  };
  workloads: {
    totalPods: number;
    runningPods: number;
    pendingPods: number;
    failedPods: number;
    criticalPodsHealthy: boolean;
  };
  resources: {
    nodes: Array<{
      name: string;
      cpu: { used: string; capacity: string; percentage: number };
      memory: { used: string; capacity: string; percentage: number };
      pods: { count: number; capacity: string };
    }>;
  };
  flux?: {
    healthy: boolean;
    sources: { ready: number; total: number };
    kustomizations: { ready: number; total: number };
    helmreleases: { ready: number; total: number };
  };
  alerts: string[];
}

class ClusterHealthMonitor {
  private status: HealthStatus | null = null;
  private criticalNamespaces = ["kube-system", "flux-system", "cert-manager", "network"];
  private criticalApps = ["etcd", "kube-apiserver", "kube-controller-manager", "kube-scheduler", "cilium", "coredns"];

  async monitor(options: {
    watch: boolean;
    interval: number;
    criticalOnly: boolean;
    includeFlux: boolean;
  }) {
    if (options.watch) {
      console.log(colors.blue("🔍 Starting cluster health monitoring..."));
      console.log(colors.gray(`Refresh interval: ${options.interval}s\n`));
      
      // Initial check
      await this.checkHealth(options);
      
      // Continuous monitoring
      while (true) {
        await new Promise(resolve => setTimeout(resolve, options.interval * 1000));
        
        // Clear screen for fresh output
        console.clear();
        await this.checkHealth(options);
      }
    } else {
      await this.checkHealth(options);
    }
  }

  private async checkHealth(options: {
    criticalOnly: boolean;
    includeFlux: boolean;
  }) {
    this.status = {
      timestamp: new Date().toISOString(),
      cluster: {
        healthy: true,
        nodes: { total: 0, ready: 0, cordoned: 0 },
        etcd: { healthy: true, members: 0, healthyMembers: 0 },
      },
      workloads: {
        totalPods: 0,
        runningPods: 0,
        pendingPods: 0,
        failedPods: 0,
        criticalPodsHealthy: true,
      },
      resources: {
        nodes: [],
      },
      alerts: [],
    };

    // Check nodes
    await this.checkNodes();
    
    // Check etcd
    await this.checkEtcd();
    
    // Check workloads
    await this.checkWorkloads(options.criticalOnly);
    
    // Check resources
    await this.checkResources();
    
    // Check Flux if requested
    if (options.includeFlux) {
      await this.checkFlux();
    }

    // Display results
    this.displayStatus(options.criticalOnly);
  }

  private async checkNodes() {
    try {
      const nodes = await $`kubectl get nodes -o json`.json();
      
      this.status!.cluster.nodes.total = nodes.items.length;
      
      nodes.items.forEach((node: any) => {
        const isReady = node.status.conditions.find((c: any) => c.type === "Ready")?.status === "True";
        if (isReady) {
          this.status!.cluster.nodes.ready++;
        }
        
        if (node.spec.unschedulable) {
          this.status!.cluster.nodes.cordoned++;
          this.status!.alerts.push(`Node ${node.metadata.name} is cordoned`);
        }
        
        // Check for other node conditions
        node.status.conditions.forEach((condition: any) => {
          if (condition.type !== "Ready" && condition.status === "True") {
            this.status!.alerts.push(`Node ${node.metadata.name}: ${condition.type}`);
          }
        });
      });
      
      if (this.status!.cluster.nodes.ready < this.status!.cluster.nodes.total) {
        this.status!.cluster.healthy = false;
      }
    } catch (error) {
      this.status!.cluster.healthy = false;
      this.status!.alerts.push(`Failed to check nodes: ${error.message}`);
    }
  }

  private async checkEtcd() {
    try {
      const etcdPods = await $`kubectl -n kube-system get pods -l component=etcd -o json`.json();
      
      this.status!.cluster.etcd.members = etcdPods.items.length;
      
      for (const pod of etcdPods.items) {
        const isReady = pod.status.conditions?.find((c: any) => c.type === "Ready")?.status === "True";
        if (isReady) {
          this.status!.cluster.etcd.healthyMembers++;
        }
        
        // Try to determine leader
        if (pod.metadata.annotations?.["etcd.kubernetes.io/etcd-leader"]) {
          this.status!.cluster.etcd.leader = pod.spec.nodeName;
        }
      }
      
      // Check quorum
      const quorum = Math.floor(this.status!.cluster.etcd.members / 2) + 1;
      if (this.status!.cluster.etcd.healthyMembers < quorum) {
        this.status!.cluster.etcd.healthy = false;
        this.status!.cluster.healthy = false;
        this.status!.alerts.push(`etcd quorum at risk: ${this.status!.cluster.etcd.healthyMembers}/${this.status!.cluster.etcd.members} healthy`);
      }
    } catch (error) {
      this.status!.cluster.etcd.healthy = false;
      this.status!.alerts.push(`Failed to check etcd: ${error.message}`);
    }
  }

  private async checkWorkloads(criticalOnly: boolean) {
    try {
      const pods = await $`kubectl get pods --all-namespaces -o json`.json();
      
      this.status!.workloads.totalPods = pods.items.length;
      
      const criticalPods: any[] = [];
      
      pods.items.forEach((pod: any) => {
        // Count pod states
        switch (pod.status.phase) {
          case "Running":
            this.status!.workloads.runningPods++;
            break;
          case "Pending":
            this.status!.workloads.pendingPods++;
            if (!criticalOnly) {
              this.status!.alerts.push(`Pod ${pod.metadata.namespace}/${pod.metadata.name} is pending`);
            }
            break;
          case "Failed":
            this.status!.workloads.failedPods++;
            this.status!.alerts.push(`Pod ${pod.metadata.namespace}/${pod.metadata.name} has failed`);
            break;
        }
        
        // Check critical pods
        const isCritical = this.criticalNamespaces.includes(pod.metadata.namespace) ||
                          this.criticalApps.some(app => pod.metadata.name.includes(app));
        
        if (isCritical) {
          criticalPods.push(pod);
          
          if (pod.status.phase !== "Running") {
            this.status!.workloads.criticalPodsHealthy = false;
            this.status!.alerts.push(`Critical pod ${pod.metadata.namespace}/${pod.metadata.name} is ${pod.status.phase}`);
          }
          
          // Check container restarts
          pod.status.containerStatuses?.forEach((container: any) => {
            if (container.restartCount > 5) {
              this.status!.alerts.push(`Critical pod ${pod.metadata.namespace}/${pod.metadata.name} has ${container.restartCount} restarts`);
            }
          });
        }
      });
      
      // Check for pod distribution issues
      const nodeDistribution = new Map<string, number>();
      pods.items.forEach((pod: any) => {
        if (pod.spec.nodeName && pod.status.phase === "Running") {
          nodeDistribution.set(pod.spec.nodeName, (nodeDistribution.get(pod.spec.nodeName) || 0) + 1);
        }
      });
      
      const avgPodsPerNode = this.status!.workloads.runningPods / this.status!.cluster.nodes.ready;
      nodeDistribution.forEach((count, node) => {
        if (count > avgPodsPerNode * 1.5) {
          this.status!.alerts.push(`High pod density on ${node}: ${count} pods (avg: ${avgPodsPerNode.toFixed(0)})`);
        }
      });
      
    } catch (error) {
      this.status!.workloads.criticalPodsHealthy = false;
      this.status!.alerts.push(`Failed to check workloads: ${error.message}`);
    }
  }

  private async checkResources() {
    try {
      // Get node metrics
      const metrics = await $`kubectl top nodes --no-headers`.text();
      const nodes = await $`kubectl get nodes -o json`.json();
      
      const lines = metrics.trim().split('\n');
      
      for (const line of lines) {
        const [name, cpu, cpuPercent, memory, memoryPercent] = line.split(/\s+/);
        
        const cpuPercentNum = parseInt(cpuPercent);
        const memoryPercentNum = parseInt(memoryPercent);
        
        // Get pod capacity
        const node = nodes.items.find((n: any) => n.metadata.name === name);
        const podCapacity = node?.status.capacity?.pods || "unknown";
        const podCount = node?.status.allocatable ? 
          await this.getPodsOnNode(name) : 0;
        
        this.status!.resources.nodes.push({
          name,
          cpu: { 
            used: cpu, 
            capacity: node?.status.capacity?.cpu || "unknown",
            percentage: cpuPercentNum 
          },
          memory: { 
            used: memory, 
            capacity: node?.status.capacity?.memory || "unknown",
            percentage: memoryPercentNum 
          },
          pods: { 
            count: podCount,
            capacity: podCapacity 
          },
        });
        
        // Alert on high resource usage
        if (cpuPercentNum > 80) {
          this.status!.alerts.push(`High CPU usage on ${name}: ${cpuPercent}`);
        }
        if (memoryPercentNum > 85) {
          this.status!.alerts.push(`High memory usage on ${name}: ${memoryPercent}`);
        }
      }
    } catch (error) {
      // Metrics server might not be available
      console.log(colors.gray("Note: Metrics not available"));
    }
  }

  private async checkFlux() {
    try {
      this.status!.flux = {
        healthy: true,
        sources: { ready: 0, total: 0 },
        kustomizations: { ready: 0, total: 0 },
        helmreleases: { ready: 0, total: 0 },
      };

      // Check Git sources
      const sources = await $`kubectl get gitrepositories -A -o json`.json();
      this.status!.flux.sources.total = sources.items.length;
      sources.items.forEach((source: any) => {
        if (source.status?.conditions?.find((c: any) => c.type === "Ready" && c.status === "True")) {
          this.status!.flux.sources.ready++;
        } else {
          this.status!.alerts.push(`Flux source ${source.metadata.namespace}/${source.metadata.name} not ready`);
        }
      });

      // Check Kustomizations
      const kustomizations = await $`kubectl get kustomizations -A -o json`.json();
      this.status!.flux.kustomizations.total = kustomizations.items.length;
      kustomizations.items.forEach((ks: any) => {
        if (ks.status?.conditions?.find((c: any) => c.type === "Ready" && c.status === "True")) {
          this.status!.flux.kustomizations.ready++;
        } else {
          this.status!.alerts.push(`Flux kustomization ${ks.metadata.namespace}/${ks.metadata.name} not ready`);
        }
      });

      // Check HelmReleases
      const helmreleases = await $`kubectl get helmreleases -A -o json`.json();
      this.status!.flux.helmreleases.total = helmreleases.items.length;
      helmreleases.items.forEach((hr: any) => {
        if (hr.status?.conditions?.find((c: any) => c.type === "Ready" && c.status === "True")) {
          this.status!.flux.helmreleases.ready++;
        } else {
          this.status!.alerts.push(`Flux helmrelease ${hr.metadata.namespace}/${hr.metadata.name} not ready`);
        }
      });

      if (this.status!.flux.sources.ready < this.status!.flux.sources.total ||
          this.status!.flux.kustomizations.ready < this.status!.flux.kustomizations.total ||
          this.status!.flux.helmreleases.ready < this.status!.flux.helmreleases.total) {
        this.status!.flux.healthy = false;
      }
    } catch (error) {
      // Flux might not be installed
      console.log(colors.gray("Note: Flux not available or not installed"));
    }
  }

  private async getPodsOnNode(nodeName: string): Promise<number> {
    try {
      const result = await $`kubectl get pods --all-namespaces --field-selector spec.nodeName=${nodeName} -o json`.json();
      return result.items.length;
    } catch {
      return 0;
    }
  }

  private displayStatus(criticalOnly: boolean) {
    const healthIcon = this.status!.cluster.healthy ? "🟢" : "🔴";
    const healthText = this.status!.cluster.healthy ? "HEALTHY" : "UNHEALTHY";
    
    console.log("═".repeat(55));
    console.log(`${healthIcon} Cluster Health: ${colors.bold(healthText)}`);
    console.log(`Time: ${new Date(this.status!.timestamp).toLocaleString()}`);
    console.log("═".repeat(55));

    // Cluster Status
    console.log(colors.blue("\n📊 CLUSTER STATUS:"));
    console.log(`  Nodes: ${this.status!.cluster.nodes.ready}/${this.status!.cluster.nodes.total} Ready`);
    if (this.status!.cluster.nodes.cordoned > 0) {
      console.log(colors.yellow(`  Cordoned: ${this.status!.cluster.nodes.cordoned}`));
    }

    // etcd Status
    const etcdIcon = this.status!.cluster.etcd.healthy ? "✓" : "✗";
    console.log(`\n  etcd: ${this.status!.cluster.etcd.healthyMembers}/${this.status!.cluster.etcd.members} Members ${etcdIcon}`);
    if (this.status!.cluster.etcd.leader) {
      console.log(`  Leader: ${this.status!.cluster.etcd.leader}`);
    }

    // Workload Status
    console.log(colors.blue("\n📦 WORKLOADS:"));
    console.log(`  Total Pods: ${this.status!.workloads.totalPods}`);
    console.log(`  Running: ${this.status!.workloads.runningPods}`);
    if (this.status!.workloads.pendingPods > 0) {
      console.log(colors.yellow(`  Pending: ${this.status!.workloads.pendingPods}`));
    }
    if (this.status!.workloads.failedPods > 0) {
      console.log(colors.red(`  Failed: ${this.status!.workloads.failedPods}`));
    }
    
    const criticalIcon = this.status!.workloads.criticalPodsHealthy ? "✓" : "✗";
    console.log(`  Critical Pods: ${criticalIcon}`);

    // Resource Usage
    if (this.status!.resources.nodes.length > 0) {
      console.log(colors.blue("\n💻 RESOURCES:"));
      
      const resourceTable = new Table()
        .header(["Node", "CPU", "Memory", "Pods"])
        .body(
          this.status!.resources.nodes.map(node => [
            node.name,
            `${node.cpu.percentage}%`,
            `${node.memory.percentage}%`,
            `${node.pods.count}/${node.pods.capacity}`,
          ])
        );
      resourceTable.render();
    }

    // Flux Status
    if (this.status!.flux) {
      const fluxIcon = this.status!.flux.healthy ? "✓" : "✗";
      console.log(colors.blue("\n🔄 FLUX STATUS:"));
      console.log(`  Sources: ${this.status!.flux.sources.ready}/${this.status!.flux.sources.total} ${fluxIcon}`);
      console.log(`  Kustomizations: ${this.status!.flux.kustomizations.ready}/${this.status!.flux.kustomizations.total}`);
      console.log(`  HelmReleases: ${this.status!.flux.helmreleases.ready}/${this.status!.flux.helmreleases.total}`);
    }

    // Alerts
    if (this.status!.alerts.length > 0) {
      console.log(colors.red("\n⚠️  ALERTS:"));
      const displayAlerts = criticalOnly ? 
        this.status!.alerts.filter(a => a.includes("Critical") || a.includes("etcd") || a.includes("Failed")) :
        this.status!.alerts;
      
      displayAlerts.slice(0, 10).forEach(alert => {
        console.log(`  • ${alert}`);
      });
      
      if (displayAlerts.length > 10) {
        console.log(colors.gray(`  ... and ${displayAlerts.length - 10} more alerts`));
      }
    } else {
      console.log(colors.green("\n✅ No alerts"));
    }

    console.log("\n" + "═".repeat(55));
  }
}

// CLI setup
if (import.meta.main) {
  await new Command()
    .name("cluster-health-monitor")
    .version("0.1.0")
    .description("Monitor Kubernetes cluster health with detailed insights")
    .option("-w, --watch", "Continuously monitor cluster health")
    .option("-i, --interval <seconds:number>", "Update interval in seconds", { default: 10 })
    .option("-c, --critical-only", "Show only critical issues", { default: false })
    .option("-f, --flux", "Include Flux status monitoring", { default: false })
    .example("One-time check", "cluster-health-monitor.ts")
    .example("Continuous monitoring", "cluster-health-monitor.ts --watch")
    .example("Critical only", "cluster-health-monitor.ts --watch --critical-only")
    .example("With Flux", "cluster-health-monitor.ts --watch --flux")
    .action(async (options) => {
      try {
        const monitor = new ClusterHealthMonitor();
        await monitor.monitor(options);
      } catch (error) {
        console.error(colors.red(`\n❌ Error: ${error.message}`));
        Deno.exit(1);
      }
    })
    .parse(Deno.args);
}