#!/usr/bin/env -S deno run --allow-all

/**
 * Node Maintenance Manager
 *
 * Safely manage Kubernetes node maintenance operations with proper safety checks.
 * Supports both Kubernetes node names and Talos node IP addresses.
 *
 * Features:
 * - Pre-flight safety checks (etcd quorum, cluster health)
 * - Dry-run mode for testing
 * - Automatic workload distribution analysis
 * - Talos-specific information display
 *
 * Usage Examples:
 *
 * # Check node status (accepts node name or IP)
 * deno task node:maintain -n k8s-1 -a status
 * deno task node:maintain -n 192.168.1.98 -a status
 *
 * # Simulate draining a node (safe - no changes)
 * deno task node:maintain -n k8s-1 -a drain --dry-run
 *
 * # Actually drain a node (with confirmation)
 * deno task node:maintain -n k8s-1 -a drain
 *
 * # Force drain without confirmations
 * deno task node:maintain -n k8s-1 -a drain --force
 *
 * # Restore node after maintenance
 * deno task node:maintain -n k8s-1 -a restore
 *
 * # Skip etcd checks (dangerous!)
 * deno task node:maintain -n k8s-1 -a drain --skip-etcd-check
 *
 * Safety Notes:
 * - Always use --dry-run first to see what would happen
 * - Script prevents draining if etcd quorum would be lost
 * - Checks workload distribution before proceeding
 * - Supports both k8s node names (k8s-1) and IP addresses (192.168.1.98)
 */

import { Command } from "jsr:@cliffy/command@1.0.0-rc.7";
import { colors } from "jsr:@cliffy/ansi@1.0.0-rc.7/colors";
import { Confirm, Select } from "jsr:@cliffy/prompt@1.0.0-rc.7";
import $ from "jsr:@david/dax@0.42.0";
import { Table } from "jsr:@cliffy/table@1.0.0-rc.7";

interface MaintenanceOptions {
  node: string;
  action: "drain" | "restore" | "status";
  dryRun: boolean;
  force?: boolean;
  timeout?: number;
  skipEtcdCheck?: boolean;
}

interface NodeInfo {
  name: string;
  ip: string;
  status: string;
  schedulable: boolean;
  roles: string[];
}

interface PodInfo {
  name: string;
  namespace: string;
  status: string;
  node: string;
}

class NodeMaintenanceManager {
  private nodeInfo: NodeInfo | null = null;
  private dryRun: boolean = false;

  async execute(options: MaintenanceOptions) {
    this.dryRun = options.dryRun;

    if (this.dryRun) {
      console.log(colors.yellow("🔸 DRY RUN MODE - No changes will be made\n"));
    }

    // Get node information
    await this.getNodeInfo(options.node);

    switch (options.action) {
      case "drain":
        await this.drainNode(options);
        break;
      case "restore":
        await this.restoreNode(options);
        break;
      case "status":
        await this.showStatus();
        break;
    }
  }

  private async getNodeInfo(nodeIdentifier: string) {
    try {
      const nodes = await $`kubectl get nodes -o json`.json();

      const node = nodes.items.find((n: any) =>
        n.metadata.name === nodeIdentifier ||
        n.status.addresses.some((addr: any) =>
          addr.type === "InternalIP" && addr.address === nodeIdentifier
        )
      );

      if (!node) {
        throw new Error(`Node ${nodeIdentifier} not found`);
      }

      this.nodeInfo = {
        name: node.metadata.name,
        ip: node.status.addresses.find((a: any) =>
          a.type === "InternalIP"
        ).address,
        status: node.status.conditions.find((c: any) =>
            c.type === "Ready"
          ).status === "True"
          ? "Ready"
          : "NotReady",
        schedulable: !node.spec.unschedulable,
        roles: Object.keys(node.metadata.labels)
          .filter((label) => label.startsWith("node-role.kubernetes.io/"))
          .map((label) => label.replace("node-role.kubernetes.io/", "")),
      };
    } catch (error) {
      console.error(colors.red(`Failed to get node info: ${error}`));
      throw error;
    }
  }

  private async drainNode(options: MaintenanceOptions) {
    console.log(
      colors.blue(
        `🔧 Preparing to drain node ${this.nodeInfo!.name} (${
          this.nodeInfo!.ip
        })`,
      ),
    );

    // Pre-flight checks
    if (
      !options.skipEtcdCheck && this.nodeInfo!.roles.includes("control-plane")
    ) {
      await this.checkEtcdQuorum();
    }

    await this.checkClusterHealth();
    await this.checkWorkloadDistribution();

    // Show what would happen
    const pods = await this.getPodsOnNode();
    console.log(colors.gray(`\n📊 Pods that would be evicted: ${pods.length}`));

    if (pods.length > 0) {
      const podTable = new Table()
        .header(["Namespace", "Pod Name", "Status"])
        .body(
          pods.slice(0, 10).map((pod) => [
            pod.namespace,
            pod.name,
            pod.status,
          ]),
        );
      podTable.render();

      if (pods.length > 10) {
        console.log(colors.gray(`... and ${pods.length - 10} more pods`));
      }
    }

    // Confirm action
    if (!options.force && !this.dryRun) {
      const confirm = await Confirm.prompt({
        message: `Drain node ${
          this.nodeInfo!.name
        }? This will evict ${pods.length} pods.`,
        default: false,
      });
      if (!confirm) return;
    }

    // Cordon node
    console.log(colors.yellow("\n📍 Cordoning node..."));
    if (!this.dryRun) {
      await $`kubectl cordon ${this.nodeInfo!.name}`;
    } else {
      console.log(
        colors.gray(`Would run: kubectl cordon ${this.nodeInfo!.name}`),
      );
    }

    // Drain node
    console.log(colors.yellow("\n🚰 Draining node..."));
    const timeout = options.timeout || 300;

    const drainCmd = `kubectl drain ${
      this.nodeInfo!.name
    } --ignore-daemonsets --delete-emptydir-data --force --timeout=${timeout}s`;

    if (!this.dryRun) {
      try {
        await $`${drainCmd}`.text();
        console.log(colors.green("✅ Node drained successfully"));
        await this.verifyNodeEmpty();
      } catch (error) {
        console.error(colors.red("❌ Drain failed"));
        throw error;
      }
    } else {
      console.log(colors.gray(`Would run: ${drainCmd}`));
      console.log(colors.green("✅ Dry run completed - no changes made"));
    }
  }

  private async restoreNode(options: MaintenanceOptions) {
    console.log(
      colors.blue(`🔧 Preparing to restore node ${this.nodeInfo!.name}`),
    );

    // Check current state
    if (this.nodeInfo!.schedulable) {
      console.log(colors.yellow("⚠️  Node is already schedulable"));
    }

    // Check node health
    if (this.nodeInfo!.status !== "Ready") {
      console.log(
        colors.yellow(`⚠️  Node is not ready: ${this.nodeInfo!.status}`),
      );
      if (!options.force) {
        const proceed = await Confirm.prompt(
          "Node is not ready. Proceed anyway?",
        );
        if (!proceed) return;
      }
    }

    // Uncordon
    console.log(colors.yellow("\n📍 Uncordoning node..."));
    if (!this.dryRun) {
      await $`kubectl uncordon ${this.nodeInfo!.name}`;
      console.log(colors.green("✅ Node restored to service"));

      // Wait for some pods to be scheduled
      console.log(colors.gray("\n⏳ Waiting for pod scheduling..."));
      await this.waitForPodScheduling();
    } else {
      console.log(
        colors.gray(`Would run: kubectl uncordon ${this.nodeInfo!.name}`),
      );
      console.log(colors.green("✅ Dry run completed - no changes made"));
    }
  }

  private async showStatus() {
    console.log(colors.blue(`📊 Node Status: ${this.nodeInfo!.name}`));
    console.log(colors.gray("─".repeat(50)));

    // Basic info
    console.log(`IP Address: ${this.nodeInfo!.ip}`);
    console.log(
      `Status: ${
        this.nodeInfo!.status === "Ready"
          ? colors.green(this.nodeInfo!.status)
          : colors.red(this.nodeInfo!.status)
      }`,
    );
    console.log(
      `Schedulable: ${
        this.nodeInfo!.schedulable
          ? colors.green("Yes")
          : colors.yellow("No (Cordoned)")
      }`,
    );
    console.log(`Roles: ${this.nodeInfo!.roles.join(", ") || "worker"}`);

    // Resource usage
    try {
      const metrics = await $`kubectl top node ${
        this.nodeInfo!.name
      } --no-headers`.text();
      const [, cpu, cpuPercent, memory, memoryPercent] = metrics.trim().split(
        /\s+/,
      );
      console.log(`\nResources:`);
      console.log(`  CPU: ${cpu} (${cpuPercent})`);
      console.log(`  Memory: ${memory} (${memoryPercent})`);
    } catch {
      console.log(colors.gray("\nMetrics not available"));
    }

    // Pod count
    const pods = await this.getPodsOnNode();
    console.log(`\nPods: ${pods.length}`);

    // Show pod distribution by namespace
    const namespaces = new Map<string, number>();
    pods.forEach((pod) => {
      namespaces.set(pod.namespace, (namespaces.get(pod.namespace) || 0) + 1);
    });

    console.log("\nPods by namespace:");
    Array.from(namespaces.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([ns, count]) => {
        console.log(`  ${ns}: ${count}`);
      });

    if (namespaces.size > 5) {
      console.log(`  ... and ${namespaces.size - 5} more namespaces`);
    }

    // Talos-specific info
    if (this.nodeInfo!.roles.includes("control-plane")) {
      await this.showTalosInfo();
    }
  }

  private async checkEtcdQuorum() {
    console.log(colors.gray("🔍 Checking etcd quorum..."));

    try {
      const etcdPods =
        await $`kubectl -n kube-system get pods -l component=etcd -o json`
          .json();
      const healthyCount = etcdPods.items.filter((pod: any) =>
        pod.status.phase === "Running" &&
        pod.status.conditions.find((c: any) =>
          c.type === "Ready" && c.status === "True"
        )
      ).length;

      const totalCount = etcdPods.items.length;

      if (healthyCount < totalCount) {
        console.log(
          colors.red(
            `❌ Etcd quorum at risk: ${healthyCount}/${totalCount} healthy`,
          ),
        );
        if (!this.dryRun) {
          throw new Error("Cannot proceed with degraded etcd cluster");
        }
      } else {
        console.log(
          colors.green(
            `✅ Etcd healthy: ${healthyCount}/${totalCount} members`,
          ),
        );
      }
    } catch (error) {
      console.error(colors.red("Failed to check etcd status"));
      throw error;
    }
  }

  private async checkClusterHealth() {
    console.log(colors.gray("🔍 Checking cluster health..."));

    const nodes = await $`kubectl get nodes -o json`.json();
    const readyNodes =
      nodes.items.filter((n: any) =>
        n.status.conditions.find((c: any) =>
          c.type === "Ready" && c.status === "True"
        )
      ).length;

    const cordonedNodes =
      nodes.items.filter((n: any) => n.spec.unschedulable).length;

    console.log(`  Nodes: ${readyNodes}/${nodes.items.length} ready`);
    if (cordonedNodes > 0) {
      console.log(
        colors.yellow(`  ⚠️  ${cordonedNodes} nodes already cordoned`),
      );
    }
  }

  private async checkWorkloadDistribution() {
    console.log(colors.gray("🔍 Checking workload distribution..."));

    const pods = await $`kubectl get pods --all-namespaces -o json`.json();
    const nodeDistribution = new Map<string, number>();

    pods.items.forEach((pod: any) => {
      if (pod.spec.nodeName) {
        nodeDistribution.set(
          pod.spec.nodeName,
          (nodeDistribution.get(pod.spec.nodeName) || 0) + 1,
        );
      }
    });

    // Check if remaining nodes can handle the load
    const currentNodePods = nodeDistribution.get(this.nodeInfo!.name) || 0;
    const otherNodes = Array.from(nodeDistribution.entries())
      .filter(([node]) => node !== this.nodeInfo!.name);

    if (otherNodes.length === 0) {
      console.log(colors.red("❌ This is the only node!"));
      if (!this.dryRun) {
        throw new Error("Cannot drain the only node in the cluster");
      }
    }

    const avgPodsPerNode =
      otherNodes.reduce((sum, [, count]) => sum + count, 0) / otherNodes.length;
    const expectedLoadIncrease = currentNodePods / otherNodes.length;

    console.log(`  Current node has ${currentNodePods} pods`);
    console.log(`  Average on other nodes: ${avgPodsPerNode.toFixed(1)} pods`);
    console.log(
      `  Expected increase: +${expectedLoadIncrease.toFixed(1)} pods per node`,
    );
  }

  private async getPodsOnNode(): Promise<PodInfo[]> {
    const result =
      await $`kubectl get pods --all-namespaces --field-selector spec.nodeName=${
        this.nodeInfo!.name
      } -o json`.json();

    return result.items
      .filter((pod: any) =>
        !pod.metadata.ownerReferences?.some((ref: any) =>
          ref.kind === "DaemonSet"
        )
      )
      .map((pod: any) => ({
        name: pod.metadata.name,
        namespace: pod.metadata.namespace,
        status: pod.status.phase,
        node: pod.spec.nodeName,
      }));
  }

  private async verifyNodeEmpty() {
    const pods = await this.getPodsOnNode();
    if (pods.length > 0) {
      console.log(
        colors.yellow(
          `⚠️  ${pods.length} pods still on node (excluding DaemonSets)`,
        ),
      );
    } else {
      console.log(colors.green("✅ All pods evacuated"));
    }
  }

  private async waitForPodScheduling() {
    // In dry-run mode, just simulate
    if (this.dryRun) return;

    let attempts = 0;
    while (attempts < 6) {
      const pods = await this.getPodsOnNode();
      if (pods.length > 0) {
        console.log(colors.green(`✅ ${pods.length} pods scheduled on node`));
        break;
      }
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  private async showTalosInfo() {
    try {
      console.log(colors.gray("\n🖥️  Talos Information:"));

      // Get Talos version
      const versionOutput = await $`talosctl version --nodes ${
        this.nodeInfo!.ip
      } --short`.text();
      const version =
        versionOutput.split("\n")[1]?.replace("Server:", "").trim() ||
        "unknown";
      console.log(`  Version: ${version}`);

      // Get services status
      const services = await $`talosctl services -n ${this.nodeInfo!.ip}`
        .text();
      const runningServices = services.split("\n").filter((line) =>
        line.includes("Running")
      ).length;
      console.log(`  Services: ${runningServices} running`);
    } catch {
      console.log(colors.gray("  Talos info not available"));
    }
  }
}

// CLI setup
if (import.meta.main) {
  await new Command()
    .name("node-maintenance")
    .version("0.1.0")
    .description("Safely manage Kubernetes node maintenance operations")
    .option("-n, --node <node:string>", "Node name or IP address", {
      required: true,
    })
    .option("-a, --action <action:string>", "Action to perform", {
      required: true,
      enum: ["drain", "restore", "status"],
    })
    .option("--dry-run", "Simulate actions without making changes", {
      default: false,
    })
    .option("-f, --force", "Skip confirmation prompts")
    .option("-t, --timeout <seconds:number>", "Drain timeout in seconds", {
      default: 300,
    })
    .option("--skip-etcd-check", "Skip etcd quorum verification (dangerous!)")
    .example("Check status", "node-maintenance.ts -n k8s-1 -a status")
    .example(
      "Drain node (dry run)",
      "node-maintenance.ts -n k8s-1 -a drain --dry-run",
    )
    .example("Drain node", "node-maintenance.ts -n k8s-1 -a drain")
    .example("Restore node", "node-maintenance.ts -n k8s-1 -a restore")
    .action(async (options) => {
      try {
        const manager = new NodeMaintenanceManager();
        await manager.execute(options as MaintenanceOptions);
      } catch (error) {
        console.error(colors.red(`\n❌ Error: ${error.message}`));
        Deno.exit(1);
      }
    })
    .parse(Deno.args);
}
