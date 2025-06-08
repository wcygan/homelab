#!/usr/bin/env -S deno run --allow-run --allow-net --allow-read
/**
 * Flux Monitor - Track Flux GitOps activity and deployments (Compatible with Flux v2.5.1)
 *
 * This script monitors Flux activity including:
 * - Git repository sync status
 * - Kustomization reconciliation
 * - HelmRelease deployments
 * - Recent events and changes
 * - Suspended resources
 * - Error conditions
 */

import { parseArgs } from "@std/cli/parse-args";
import { delay } from "@std/async/delay";

interface FluxResource {
  name: string;
  namespace: string;
  kind: string;
  ready: boolean;
  suspended: boolean;
  status: string;
  age: string;
  revision?: string;
  lastReconcileTime?: string;
  conditions: Array<{
    type: string;
    status: string;
    reason?: string;
    message?: string;
  }>;
  source?: {
    kind: string;
    name: string;
    namespace?: string;
  };
}

interface KubernetesEvent {
  type: string;
  reason: string;
  object: string;
  message: string;
  age: string;
  namespace: string;
}

class FluxMonitor {
  private verbose: boolean;
  private watch: boolean;
  private interval: number;
  private forceReconcile: boolean;

  constructor(options: {
    verbose: boolean;
    watch: boolean;
    interval: number;
    forceReconcile: boolean;
  }) {
    this.verbose = options.verbose;
    this.watch = options.watch;
    this.interval = options.interval;
    this.forceReconcile = options.forceReconcile;
  }

  async runCommand(
    cmd: string[],
  ): Promise<{ success: boolean; output: string; error?: string }> {
    try {
      const command = new Deno.Command(cmd[0], {
        args: cmd.slice(1),
        stdout: "piped",
        stderr: "piped",
      });

      const result = await command.output();
      const stdout = new TextDecoder().decode(result.stdout);
      const stderr = new TextDecoder().decode(result.stderr);

      return {
        success: result.success,
        output: stdout.trim(),
        error: stderr.trim() || undefined,
      };
    } catch (error) {
      return {
        success: false,
        output: "",
        error: `Error running command: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }

  private log(
    message: string,
    level: "INFO" | "WARN" | "ERROR" = "INFO",
  ): void {
    const timestamp = new Date().toISOString();
    const prefix = level === "ERROR" ? "❌" : level === "WARN" ? "⚠️ " : "ℹ️ ";
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  private verboseLog(message: string): void {
    if (this.verbose) {
      this.log(message);
    }
  }

  async checkFluxStatus(): Promise<void> {
    console.log("🔍 Checking Flux system status...\n");

    const result = await this.runCommand(["flux", "check"]);
    if (!result.success) {
      console.log("❌ Flux check failed:");
      console.log(result.output);
      if (result.error) console.log(result.error);
      return;
    }

    console.log("✅ Flux system is healthy\n");
  }

  async getAllFluxResources(): Promise<FluxResource[]> {
    this.verboseLog("Fetching all Flux resources using compatible commands...");

    const resources: FluxResource[] = [];

    try {
      // Get GitRepositories
      const gitRepos = await this.getGitRepositories();
      resources.push(...gitRepos);

      // Get Kustomizations
      const kustomizations = await this.getKustomizations();
      resources.push(...kustomizations);

      // Get HelmReleases
      const helmReleases = await this.getHelmReleases();
      resources.push(...helmReleases);

      return resources;
    } catch (error) {
      this.log(`Failed to get Flux resources: ${error}`, "ERROR");
      return [];
    }
  }

  async getGitRepositories(): Promise<FluxResource[]> {
    const result = await this.runCommand([
      "flux",
      "get",
      "sources",
      "git",
      "-A",
      "--no-header",
    ]);
    if (!result.success) {
      this.verboseLog(`Failed to get GitRepositories: ${result.error}`);
      return [];
    }

    return this.parseFluxOutput(result.output, "GitRepository");
  }

  async getKustomizations(): Promise<FluxResource[]> {
    const result = await this.runCommand([
      "flux",
      "get",
      "kustomizations",
      "-A",
      "--no-header",
    ]);
    if (!result.success) {
      this.verboseLog(`Failed to get Kustomizations: ${result.error}`);
      return [];
    }

    return this.parseFluxOutput(result.output, "Kustomization");
  }

  async getHelmReleases(): Promise<FluxResource[]> {
    const result = await this.runCommand([
      "flux",
      "get",
      "helmreleases",
      "-A",
      "--no-header",
    ]);
    if (!result.success) {
      this.verboseLog(`Failed to get HelmReleases: ${result.error}`);
      return [];
    }

    return this.parseFluxOutput(result.output, "HelmRelease");
  }

  private parseFluxOutput(output: string, kind: string): FluxResource[] {
    if (!output.trim()) return [];

    const lines = output.trim().split("\n");
    const resources: FluxResource[] = [];

    for (const line of lines) {
      if (!line.trim()) continue;

      // Parse flux output format: NAMESPACE NAME REVISION SUSPENDED READY MESSAGE
      const parts = line.trim().split(/\s+/);

      if (parts.length < 5) continue; // Skip malformed lines

      const namespace = parts[0];
      const name = parts[1];
      const revision = parts[2];
      const suspended = parts[3] === "True";
      const ready = parts[4] === "True";
      const message = parts.slice(5).join(" ") ||
        (ready ? "Ready" : "Not Ready");

      // Calculate a simple age (we don't have this info from flux CLI)
      const age = "unknown";

      resources.push({
        name,
        namespace,
        kind,
        ready,
        suspended,
        status: message,
        age,
        revision: revision?.substring(0, 8),
        conditions: [], // We'll get detailed conditions if needed
        source: undefined, // We'll get source info if needed
      });
    }

    return resources;
  }

  async getRecentEvents(): Promise<KubernetesEvent[]> {
    const result = await this.runCommand([
      "kubectl",
      "get",
      "events",
      "--all-namespaces",
      "--sort-by=.metadata.creationTimestamp",
      "--no-headers",
    ]);

    if (!result.success) return [];

    return result.output.split("\n")
      .filter((line) => line.trim())
      .slice(-20) // Get last 20 events
      .map((line) => {
        const parts = line.split(/\s+/);
        return {
          namespace: parts[0] || "",
          age: parts[1] || "",
          type: parts[2] || "",
          reason: parts[3] || "",
          object: parts[4] || "",
          message: parts.slice(5).join(" ") || "",
        };
      });
  }

  async getFluxEvents(): Promise<KubernetesEvent[]> {
    const result = await this.runCommand([
      "kubectl",
      "get",
      "events",
      "-n",
      "flux-system",
      "--sort-by=.metadata.creationTimestamp",
      "--no-headers",
    ]);

    if (!result.success) return [];

    return result.output.split("\n")
      .filter((line) => line.trim())
      .slice(-10) // Get last 10 Flux events
      .map((line) => {
        const parts = line.split(/\s+/);
        return {
          namespace: "flux-system",
          age: parts[0] || "",
          type: parts[1] || "",
          reason: parts[2] || "",
          object: parts[3] || "",
          message: parts.slice(4).join(" ") || "",
        };
      });
  }

  formatTable(headers: string[], rows: string[][]): void {
    const colWidths = headers.map((header, i) =>
      Math.max(header.length, ...rows.map((row) => (row[i] || "").length))
    );

    // Print header
    const headerRow = headers.map((header, i) => header.padEnd(colWidths[i]))
      .join(" | ");
    console.log(headerRow);
    console.log("-".repeat(headerRow.length));

    // Print rows
    rows.forEach((row) => {
      const formattedRow = row.map((cell, i) =>
        (cell || "").padEnd(colWidths[i])
      ).join(" | ");
      console.log(formattedRow);
    });
  }

  getStatusIcon(ready: boolean, suspended: boolean, status: string): string {
    if (suspended) return "⏸️";
    if (ready) return "✅";
    if (status.includes("Progressing") || status.includes("Reconciling")) {
      return "🔄";
    }
    return "❌";
  }

  async displayFluxResources(): Promise<void> {
    console.log("🔄 Flux Resources Overview:");
    const resources = await this.getAllFluxResources();

    if (resources.length === 0) {
      console.log("  No Flux resources found\n");
      return;
    }

    // Group by kind
    const byKind = new Map<string, FluxResource[]>();
    for (const resource of resources) {
      if (!byKind.has(resource.kind)) {
        byKind.set(resource.kind, []);
      }
      byKind.get(resource.kind)!.push(resource);
    }

    for (const [kind, kindResources] of byKind) {
      console.log(`\n📦 ${kind}s:`);

      const rows = kindResources.map((resource) => [
        this.getStatusIcon(resource.ready, resource.suspended, resource.status),
        resource.name,
        resource.namespace,
        resource.status,
        resource.revision || "",
        resource.age,
      ]);

      this.formatTable(
        ["", "NAME", "NAMESPACE", "STATUS", "REVISION", "AGE"],
        rows,
      );

      // Show error details for failed resources in verbose mode
      if (this.verbose) {
        const failedResources = kindResources.filter((r) =>
          !r.ready && !r.suspended
        );
        for (const resource of failedResources) {
          console.log(`\n  ❌ ${resource.name} details:`);
          await this.showResourceDetails(resource);
        }
      }
    }

    // Summary
    const totalResources = resources.length;
    const readyResources =
      resources.filter((r) => r.ready && !r.suspended).length;
    const suspendedResources = resources.filter((r) => r.suspended).length;
    const failedResources =
      resources.filter((r) => !r.ready && !r.suspended).length;

    console.log(
      `\n📊 Summary: ${readyResources}/${
        totalResources - suspendedResources
      } ready, ${suspendedResources} suspended, ${failedResources} failed\n`,
    );
  }

  async showResourceDetails(resource: FluxResource): Promise<void> {
    try {
      let cmd: string[];

      if (resource.kind === "GitRepository") {
        cmd = [
          "kubectl",
          "get",
          "gitrepository",
          resource.name,
          "-n",
          resource.namespace,
          "-o",
          "yaml",
        ];
      } else if (resource.kind === "Kustomization") {
        cmd = [
          "kubectl",
          "get",
          "kustomization",
          resource.name,
          "-n",
          resource.namespace,
          "-o",
          "yaml",
        ];
      } else if (resource.kind === "HelmRelease") {
        cmd = [
          "kubectl",
          "get",
          "helmrelease",
          resource.name,
          "-n",
          resource.namespace,
          "-o",
          "yaml",
        ];
      } else {
        return;
      }

      const result = await this.runCommand(cmd);
      if (result.success) {
        // Parse YAML to extract conditions (simplified)
        const lines = result.output.split("\n");
        let inConditions = false;

        for (const line of lines) {
          if (line.includes("conditions:")) {
            inConditions = true;
            continue;
          }

          if (inConditions && line.includes("- lastTransitionTime:")) {
            inConditions = false;
            continue;
          }

          if (inConditions && line.includes("message:")) {
            const message = line.split("message:")[1]?.trim().replace(
              /^["']|["']$/g,
              "",
            );
            if (message && message !== "null") {
              console.log(`     ${message}`);
            }
          }
        }
      }
    } catch (error) {
      this.verboseLog(`Failed to get details for ${resource.name}: ${error}`);
    }
  }

  async displayRecentEvents(): Promise<void> {
    console.log("📋 Recent Kubernetes Events (last 20):");
    const events = await this.getRecentEvents();

    if (events.length === 0) {
      console.log("  No recent events found\n");
      return;
    }

    events.forEach((event) => {
      const typeIcon = event.type === "Normal" ? "✅" : "⚠️";
      console.log(
        `  ${typeIcon} ${event.age.padEnd(8)} ${event.namespace.padEnd(15)} ${
          event.reason.padEnd(20)
        } ${event.object}`,
      );
      if (this.verbose && event.message) {
        console.log(`     ${event.message}`);
      }
    });
    console.log();
  }

  async displayFluxEvents(): Promise<void> {
    console.log("🔄 Recent Flux Events:");
    const events = await this.getFluxEvents();

    if (events.length === 0) {
      console.log("  No recent Flux events found\n");
      return;
    }

    events.forEach((event) => {
      const typeIcon = event.type === "Normal" ? "✅" : "⚠️";
      console.log(
        `  ${typeIcon} ${event.age.padEnd(8)} ${
          event.reason.padEnd(20)
        } ${event.object}`,
      );
      if (this.verbose && event.message) {
        console.log(`     ${event.message}`);
      }
    });
    console.log();
  }

  async getLatestCommit(): Promise<void> {
    console.log("📝 Latest Git Commit:");
    const result = await this.runCommand([
      "git",
      "log",
      "-1",
      "--oneline",
      "--decorate",
    ]);

    if (result.success) {
      console.log(`  ${result.output}\n`);
    } else {
      console.log("  Unable to get latest commit\n");
    }
  }

  async reconcileFlux(): Promise<void> {
    console.log("🔄 Triggering Flux reconciliation (compatible mode)...");

    try {
      // Get all GitRepositories and reconcile them
      this.verboseLog("Reconciling Git sources...");
      const gitRepos = await this.getGitRepositories();
      for (const repo of gitRepos) {
        const result = await this.runCommand([
          "flux",
          "reconcile",
          "source",
          "git",
          repo.name,
          "-n",
          repo.namespace,
          "--with-source",
        ]);
        if (!result.success) {
          this.verboseLog(
            `Failed to reconcile GitRepository ${repo.name}: ${result.error}`,
          );
        }
      }

      // Wait a bit for sources to be ready
      await delay(2000);

      // Get all Kustomizations and reconcile them
      this.verboseLog("Reconciling Kustomizations...");
      const kustomizations = await this.getKustomizations();
      for (const ks of kustomizations) {
        if (!ks.suspended) {
          const result = await this.runCommand([
            "flux",
            "reconcile",
            "kustomization",
            ks.name,
            "-n",
            ks.namespace,
            "--with-source",
          ]);
          if (!result.success) {
            this.verboseLog(
              `Failed to reconcile Kustomization ${ks.name}: ${result.error}`,
            );
          }
        }
      }

      // Wait a bit for kustomizations to be ready
      await delay(2000);

      // Get all HelmReleases and reconcile them
      this.verboseLog("Reconciling HelmReleases...");
      const helmReleases = await this.getHelmReleases();
      for (const hr of helmReleases) {
        if (!hr.suspended) {
          const result = await this.runCommand([
            "flux",
            "reconcile",
            "helmrelease",
            hr.name,
            "-n",
            hr.namespace,
            "--with-source",
          ]);
          if (!result.success) {
            this.verboseLog(
              `Failed to reconcile HelmRelease ${hr.name}: ${result.error}`,
            );
          }
        }
      }

      console.log("✅ Flux reconciliation completed");
      console.log("⏳ Waiting for reconciliation to take effect...\n");
      await delay(5000); // Wait for reconciliation to take effect
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);
      this.log(`❌ Reconciliation failed: ${errorMessage}`, "ERROR");
    }
  }

  async displayStatus(): Promise<void> {
    const timestamp = new Date().toLocaleString();
    console.clear();
    console.log(`🚀 Flux Monitor - ${timestamp}\n`);
    console.log("=".repeat(80) + "\n");

    await this.checkFluxStatus();
    await this.getLatestCommit();
    await this.displayFluxResources();

    if (this.verbose) {
      await this.displayFluxEvents();
      await this.displayRecentEvents();
    }
  }

  async run(): Promise<void> {
    if (this.forceReconcile) {
      await this.reconcileFlux();
    }

    if (this.watch) {
      console.log(
        `🔍 Monitoring Flux activity (refreshing every ${this.interval}s)...`,
      );
      console.log("Press Ctrl+C to stop\n");

      while (true) {
        await this.displayStatus();
        await delay(this.interval * 1000);
      }
    } else {
      await this.displayStatus();
    }
  }
}

function showHelp(): void {
  console.log(`
🚀 Flux Monitor - Track GitOps activity and deployments (Compatible with Flux v2.5.1)

Usage: deno run --allow-run --allow-net --allow-read flux-monitor.ts [options]

Options:
  -w, --watch           Watch mode - continuously refresh the display
  -v, --verbose         Show detailed events and error messages
  -i, --interval <sec>  Refresh interval in seconds (default: 30)
  -r, --reconcile       Trigger Flux reconciliation before monitoring
  -h, --help            Show this help message

Examples:
  # Show current status once
  ./flux-monitor.ts

  # Watch mode with 15-second refresh
  ./flux-monitor.ts --watch --interval 15

  # Verbose mode with detailed events and error messages
  ./flux-monitor.ts --watch --verbose

  # Force reconciliation and then watch
  ./flux-monitor.ts --reconcile --watch

Key Features:
  ✅ Compatible with Flux v2.5.1
  ✅ Shows suspended resources and their status
  ✅ Displays error conditions and messages in verbose mode
  ✅ Groups resources by type for better organization
  ✅ Provides reconciliation option
  ✅ Better error handling and status reporting
  `);
}

async function main(): Promise<void> {
  const args = parseArgs(Deno.args, {
    string: ["interval"],
    boolean: ["watch", "verbose", "reconcile", "help"],
    alias: {
      w: "watch",
      v: "verbose",
      i: "interval",
      r: "reconcile",
      h: "help",
    },
    default: {
      interval: "30",
      watch: false,
      verbose: false,
      reconcile: false,
    },
  });

  if (args.help) {
    showHelp();
    return;
  }

  const monitor = new FluxMonitor({
    verbose: args.verbose,
    watch: args.watch,
    interval: parseInt(args.interval),
    forceReconcile: args.reconcile,
  });

  try {
    await monitor.run();
  } catch (error) {
    if (error instanceof Deno.errors.Interrupted) {
      console.log("\n👋 Monitoring stopped");
    } else {
      console.error(
        "❌ Error:",
        error instanceof Error ? error.message : String(error),
      );
      Deno.exit(1);
    }
  }
}

if (import.meta.main) {
  main();
}
