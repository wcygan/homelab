import { colors } from "@cliffy/ansi/colors";
import { $ } from "https://deno.land/x/dax@0.35.0/mod.ts";
import type { MonitoringResult } from "../../shared/types.ts";

const NODE_IPS = {
  "k8s-1": "192.168.1.98",
  "k8s-2": "192.168.1.99", 
  "k8s-3": "192.168.1.100",
};

interface NodeStatus {
  name: string;
  ip: string;
  containerd: boolean;
  hasErrors: boolean;
  memoryPercent: number;
  errors: string[];
}

/**
 * Quick node health check
 */
export async function nodesQuickCheck(): Promise<MonitoringResult> {
  const startTime = Date.now();
  const issues: string[] = [];
  const nodeStatuses: NodeStatus[] = [];

  try {
    // Check all nodes in parallel
    const nodeChecks = Object.entries(NODE_IPS).map(async ([name, ip]) => {
      const status: NodeStatus = {
        name,
        ip,
        containerd: false,
        hasErrors: false,
        memoryPercent: 0,
        errors: [],
      };

      try {
        // Check containerd
        const containerdResult = await $`talosctl -n ${ip} service containerd`.quiet();
        status.containerd = containerdResult.stdout.includes("Running");

        // Check for recent errors
        const errorsResult = await $`talosctl -n ${ip} dmesg | grep -i "segfault" | tail -3`.quiet();
        if (errorsResult.stdout.trim()) {
          status.hasErrors = true;
          status.errors = errorsResult.stdout.trim().split('\n');
        }

        // Get memory usage
        const memResult = await $`talosctl -n ${ip} memory`.quiet();
        const lines = memResult.stdout.split('\n');
        if (lines[1]) {
          const parts = lines[1].split(/\s+/);
          if (parts.length > 3) {
            const used = parseInt(parts[2]);
            const total = parseInt(parts[1]);
            status.memoryPercent = (used / total) * 100;
          }
        }
      } catch (error) {
        status.errors.push(`Failed to check node: ${error.message}`);
        status.hasErrors = true;
      }

      return status;
    });

    const results = await Promise.all(nodeChecks);
    nodeStatuses.push(...results);

    // Analyze results
    let unhealthyNodes = 0;
    for (const node of nodeStatuses) {
      if (!node.containerd) {
        issues.push(`${node.name}: containerd not running`);
        unhealthyNodes++;
      }
      if (node.hasErrors) {
        issues.push(`${node.name}: segfault errors detected`);
        unhealthyNodes++;
      }
      if (node.memoryPercent > 90) {
        issues.push(`${node.name}: high memory usage (${node.memoryPercent.toFixed(1)}%)`);
      }
    }

    const status = unhealthyNodes > 0 ? "critical" : 
                   issues.length > 0 ? "warning" : "healthy";

    return {
      status,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      summary: {
        total: nodeStatuses.length,
        healthy: nodeStatuses.length - unhealthyNodes,
        warnings: issues.length,
        critical: unhealthyNodes,
      },
      details: {
        nodes: nodeStatuses,
      },
      issues,
    };
  } catch (error) {
    return {
      status: "error",
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      summary: {
        total: Object.keys(NODE_IPS).length,
        healthy: 0,
        warnings: 0,
        critical: 0,
      },
      details: {},
      issues: [`Failed to check nodes: ${error.message}`],
    };
  }
}

/**
 * Detailed node health analysis
 */
export async function runNodeHealth(options: { json?: boolean; verbose?: boolean } = {}) {
  const result = await nodesQuickCheck();

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    Deno.exit(result.status === "healthy" ? 0 : result.status === "warning" ? 1 : 2);
  }

  // Human-readable output
  console.log(colors.bold.blue("\n🖥️  Node Health Status"));
  console.log("=" .repeat(50));

  const statusIcon = result.status === "healthy" ? "✅" : 
                     result.status === "warning" ? "⚠️" : "❌";
  const statusColor = result.status === "healthy" ? colors.green :
                      result.status === "warning" ? colors.yellow : colors.red;
  
  console.log(`\n${statusIcon} Overall Status: ${statusColor(result.status.toUpperCase())}`);
  console.log(`⏱️  Check Duration: ${result.duration}ms`);

  if (result.details.nodes) {
    console.log("\n📊 Node Details:");
    for (const node of result.details.nodes as NodeStatus[]) {
      const nodeStatus = node.containerd && !node.hasErrors ? colors.green("✓") : colors.red("✗");
      console.log(`\n  ${nodeStatus} ${colors.bold(node.name)} (${node.ip})`);
      console.log(`     Containerd: ${node.containerd ? colors.green("Running") : colors.red("Not Running")}`);
      console.log(`     Memory: ${node.memoryPercent.toFixed(1)}%`);
      
      if (node.errors.length > 0 && options.verbose) {
        console.log(`     ${colors.red("Errors:")}`);
        for (const error of node.errors) {
          console.log(`       ${colors.red(error)}`);
        }
      }
    }
  }

  if (result.issues.length > 0) {
    console.log(`\n⚠️  ${colors.yellow("Issues Found:")}`);
    for (const issue of result.issues) {
      console.log(`  - ${issue}`);
    }
  }

  console.log();
}

/**
 * Clean up completed pods
 */
export async function cleanupPods(options: { json?: boolean } = {}): Promise<MonitoringResult> {
  const startTime = Date.now();
  const issues: string[] = [];
  let cleanedCount = 0;

  try {
    // Get completed pods
    const podsResult = await $`kubectl get pods -A --field-selector=status.phase=Succeeded -o json`.json();
    const completedPods = podsResult.items || [];

    for (const pod of completedPods) {
      try {
        await $`kubectl delete pod -n ${pod.metadata.namespace} ${pod.metadata.name}`.quiet();
        cleanedCount++;
      } catch (error) {
        issues.push(`Failed to delete ${pod.metadata.namespace}/${pod.metadata.name}: ${error.message}`);
      }
    }

    const status = issues.length === 0 ? "healthy" : "warning";

    const result: MonitoringResult = {
      status,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      summary: {
        total: completedPods.length,
        healthy: cleanedCount,
        warnings: issues.length,
        critical: 0,
      },
      details: {
        cleanedPods: cleanedCount,
        totalCompleted: completedPods.length,
      },
      issues,
    };

    if (!options.json) {
      console.log(colors.blue.bold("\n🧹 Pod Cleanup"));
      console.log("=" .repeat(30));
      console.log(`\n${colors.green(`✓ Cleaned ${cleanedCount} completed pods`)}`);
      if (issues.length > 0) {
        console.log(`\n${colors.yellow("⚠️  Issues:")}`);
        for (const issue of issues) {
          console.log(`  - ${issue}`);
        }
      }
    }

    return result;
  } catch (error) {
    return {
      status: "error",
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      summary: {
        total: 0,
        healthy: 0,
        warnings: 0,
        critical: 0,
      },
      details: {},
      issues: [`Failed to cleanup pods: ${error.message}`],
    };
  }
}