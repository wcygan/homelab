#!/usr/bin/env -S deno run --allow-all

import { parseArgs } from "@std/cli/parse-args";

// Simple delay function using web standard setTimeout
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface HealthCheckOptions {
  verbose: boolean;
  namespace?: string;
  continuous: boolean;
  interval: number;
  help: boolean;
}

interface NodeInfo {
  name: string;
  status: string;
  version: string;
  osImage: string;
  internalIP: string;
  roles: string[];
  ready: boolean;
  conditions: Array<{type: string, status: string, reason?: string, message?: string}>;
}

interface PodInfo {
  name: string;
  namespace: string;
  status: string;
  ready: string;
  restarts: number;
  age: string;
  node?: string;
  healthy: boolean;
}

class KubernetesHealthChecker {
  private verbose: boolean;

  constructor(verbose = false) {
    this.verbose = verbose;
  }

  private async runKubectl(args: string[]): Promise<{success: boolean, output: string, error?: string}> {
    try {
      const command = new Deno.Command("kubectl", {
        args,
        stdout: "piped",
        stderr: "piped",
      });

      const result = await command.output();
      const stdout = new TextDecoder().decode(result.stdout);
      const stderr = new TextDecoder().decode(result.stderr);

      return {
        success: result.success,
        output: stdout.trim(),
        error: stderr.trim() || undefined
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        output: "",
        error: `Failed to run kubectl: ${errorMessage}`
      };
    }
  }

  private log(message: string, level: "INFO" | "WARN" | "ERROR" = "INFO"): void {
    const timestamp = new Date().toISOString();
    const prefix = level === "ERROR" ? "❌" : level === "WARN" ? "⚠️ " : "ℹ️ ";
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  private verboseLog(message: string): void {
    if (this.verbose) {
      this.log(message);
    }
  }

  async checkClusterAccess(): Promise<boolean> {
    this.verboseLog("Checking cluster access...");

    const result = await this.runKubectl(["cluster-info"]);
    if (!result.success) {
      this.log(`Failed to access cluster: ${result.error}`, "ERROR");
      return false;
    }

    this.verboseLog("✅ Cluster access verified");
    return true;
  }

  async getNodes(): Promise<NodeInfo[]> {
    this.verboseLog("Fetching node information...");

    const result = await this.runKubectl(["get", "nodes", "-o", "json"]);
    if (!result.success) {
      throw new Error(`Failed to get nodes: ${result.error}`);
    }

    const data = JSON.parse(result.output);
    const nodes: NodeInfo[] = [];

    for (const node of data.items || []) {
      const conditions = node.status?.conditions || [];
      const readyCondition = conditions.find((c: any) => c.type === "Ready");
      const roles = Object.keys(node.metadata?.labels || {})
        .filter(label => label.startsWith("node-role.kubernetes.io/"))
        .map(label => label.replace("node-role.kubernetes.io/", ""));

      nodes.push({
        name: node.metadata?.name || "unknown",
        status: node.status?.phase || "unknown",
        version: node.status?.nodeInfo?.kubeletVersion || "unknown",
        osImage: node.status?.nodeInfo?.osImage || "unknown",
        internalIP: node.status?.addresses?.find((a: any) => a.type === "InternalIP")?.address || "unknown",
        roles: roles.length > 0 ? roles : ["worker"],
        ready: readyCondition?.status === "True",
        conditions: conditions.map((c: any) => ({
          type: c.type,
          status: c.status,
          reason: c.reason,
          message: c.message
        }))
      });
    }

    return nodes;
  }

  async getPods(namespace?: string): Promise<PodInfo[]> {
    this.verboseLog(`Fetching pod information${namespace ? ` for namespace: ${namespace}` : ""}...`);

    const args = ["get", "pods", "-o", "json"];
    if (namespace) {
      args.push("-n", namespace);
    } else {
      args.push("--all-namespaces");
    }

    const result = await this.runKubectl(args);
    if (!result.success) {
      throw new Error(`Failed to get pods: ${result.error}`);
    }

    const data = JSON.parse(result.output);
    const pods: PodInfo[] = [];

    for (const pod of data.items || []) {
      const containerStatuses = pod.status?.containerStatuses || [];
      const readyCount = containerStatuses.filter((c: any) => c.ready).length;
      const totalCount = containerStatuses.length;
      const restarts = containerStatuses.reduce((sum: number, c: any) => sum + (c.restartCount || 0), 0);

      const isHealthy = pod.status?.phase === "Running" || pod.status?.phase === "Succeeded";

      pods.push({
        name: pod.metadata?.name || "unknown",
        namespace: pod.metadata?.namespace || "default",
        status: pod.status?.phase || "unknown",
        ready: `${readyCount}/${totalCount}`,
        restarts,
        age: this.calculateAge(pod.metadata?.creationTimestamp),
        node: pod.spec?.nodeName,
        healthy: isHealthy && readyCount === totalCount
      });
    }

    return pods;
  }

  private calculateAge(creationTimestamp?: string): string {
    if (!creationTimestamp) return "unknown";

    const created = new Date(creationTimestamp);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d${hours}h`;
    if (hours > 0) return `${hours}h${minutes}m`;
    return `${minutes}m`;
  }

  async checkNodeHealth(): Promise<boolean> {
    this.log("🔍 Checking node health...");

    const nodes = await this.getNodes();
    let allHealthy = true;

    for (const node of nodes) {
      const rolesStr = node.roles.join(", ");

      if (node.ready) {
        this.log(`✅ Node ${node.name} (${rolesStr}): Ready - ${node.version}`);

        if (this.verbose) {
          this.verboseLog(`   Internal IP: ${node.internalIP}`);
          this.verboseLog(`   OS: ${node.osImage}`);
        }
      } else {
        this.log(`❌ Node ${node.name} (${rolesStr}): Not Ready`, "ERROR");
        allHealthy = false;

        // Show problematic conditions
        const problemConditions = node.conditions.filter(c =>
          c.type !== "Ready" && c.status === "True"
        );

        for (const condition of problemConditions) {
          this.log(`   Problem: ${condition.type} - ${condition.reason}: ${condition.message}`, "WARN");
        }
      }
    }

    this.log(`📊 Node Summary: ${nodes.filter(n => n.ready).length}/${nodes.length} nodes ready`);
    return allHealthy;
  }

  async checkCriticalPods(): Promise<boolean> {
    this.log("🔍 Checking critical system pods...");

    const criticalNamespaces = [
      "kube-system",
      "flux-system",
      "cert-manager",
      "external-secrets"
    ];

    let allHealthy = true;

    for (const namespace of criticalNamespaces) {
      try {
        const pods = await this.getPods(namespace);
        const unhealthyPods = pods.filter(pod => !pod.healthy);
        const highRestartPods = pods.filter(pod => pod.restarts > 10);

        if (unhealthyPods.length === 0) {
          this.log(`✅ Namespace ${namespace}: All ${pods.length} pods healthy`);
        } else {
          this.log(`❌ Namespace ${namespace}: ${unhealthyPods.length}/${pods.length} pods unhealthy`, "ERROR");
          allHealthy = false;

          for (const pod of unhealthyPods) {
            this.log(`   ${pod.name}: ${pod.status} (${pod.ready}) - ${pod.restarts} restarts`, "WARN");
            if (pod.node && this.verbose) {
              this.verboseLog(`     Running on node: ${pod.node}`);
            }
          }
        }

        if (highRestartPods.length > 0) {
          this.log(`⚠️  High restart count in ${namespace}:`, "WARN");
          for (const pod of highRestartPods) {
            this.log(`   ${pod.name}: ${pod.restarts} restarts`, "WARN");
          }
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.log(`❌ Failed to check namespace ${namespace}: ${errorMessage}`, "ERROR");
        allHealthy = false;
      }
    }

    return allHealthy;
  }

  async checkStorageClasses(): Promise<void> {
    this.verboseLog("Checking storage classes...");

    const result = await this.runKubectl(["get", "storageclass", "-o", "json"]);
    if (!result.success) {
      this.log(`⚠️  Could not check storage classes: ${result.error}`, "WARN");
      return;
    }

    const data = JSON.parse(result.output);
    const storageClasses = data.items || [];
    const defaultSC = storageClasses.find((sc: any) =>
      sc.metadata?.annotations?.["storageclass.kubernetes.io/is-default-class"] === "true"
    );

    if (defaultSC) {
      this.verboseLog(`✅ Default storage class: ${defaultSC.metadata?.name}`);
    } else {
      this.log("⚠️  No default storage class found", "WARN");
    }

    this.verboseLog(`📊 Total storage classes: ${storageClasses.length}`);
  }

  async performFullHealthCheck(): Promise<boolean> {
    this.log("🚀 Starting comprehensive cluster health check...");

    // Check cluster access first
    if (!(await this.checkClusterAccess())) {
      return false;
    }

    let overallHealthy = true;

    // Check nodes
    if (!(await this.checkNodeHealth())) {
      overallHealthy = false;
    }

    // Check critical pods
    if (!(await this.checkCriticalPods())) {
      overallHealthy = false;
    }

    // Check storage (informational)
    await this.checkStorageClasses();

    // Final summary
    if (overallHealthy) {
      this.log("🎉 Cluster health check PASSED - All systems operational!");
    } else {
      this.log("⚠️  Cluster health check FAILED - Issues detected", "ERROR");
    }

    return overallHealthy;
  }
}

function showHelp(): void {
  console.log(`
🏥 Kubernetes Cluster Health Checker

Usage: deno run --allow-all k8s-health-check.ts [options]

Options:
  -v, --verbose         Verbose output with detailed information
  -n, --namespace <ns>  Check pods in specific namespace only
  -c, --continuous      Run continuously (use with --interval)
  -i, --interval <sec>  Interval between checks in seconds (default: 30)
  -h, --help           Show this help message

Examples:
  deno run --allow-all k8s-health-check.ts                    # Basic health check
  deno run --allow-all k8s-health-check.ts --verbose          # Detailed output
  deno run --allow-all k8s-health-check.ts -n flux-system     # Check only flux-system
  deno run --allow-all k8s-health-check.ts -c -i 60           # Monitor every 60 seconds
  `);
}

async function main(): Promise<void> {
  const parsedArgs = parseArgs(Deno.args, {
    string: ["namespace", "interval"],
    boolean: ["verbose", "continuous", "help"],
    alias: {
      v: "verbose",
      n: "namespace",
      c: "continuous",
      i: "interval",
      h: "help"
    },
    default: {
      verbose: false,
      continuous: false,
      interval: "30"
    }
  });

  const args = {
    verbose: Boolean(parsedArgs.verbose),
    namespace: parsedArgs.namespace as string | undefined,
    continuous: Boolean(parsedArgs.continuous),
    help: Boolean(parsedArgs.help),
    interval: String(parsedArgs.interval || "30")
  };

  if (args.help) {
    showHelp();
    return;
  }

  const interval = parseInt(args.interval) * 1000; // Convert to milliseconds
  const checker = new KubernetesHealthChecker(args.verbose);

  try {
    if (args.continuous) {
      console.log(`🔄 Starting continuous monitoring (interval: ${args.interval}s, Ctrl+C to stop)...`);

      while (true) {
        const healthy = await checker.performFullHealthCheck();

        if (!healthy) {
          console.log("⏳ Waiting before next check due to issues...");
        }

        await delay(interval);
        console.log("\n" + "=".repeat(80) + "\n");
      }
    } else {
      const healthy = await checker.performFullHealthCheck();
      Deno.exit(healthy ? 0 : 1);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Health check failed: ${errorMessage}`);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}