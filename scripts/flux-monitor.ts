#!/usr/bin/env -S deno run --allow-run --allow-net --allow-read
/**
 * Flux Monitor - Track Flux GitOps activity and deployments (Optimized)
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

  async runCommand(cmd: string[]): Promise<{ success: boolean; output: string; error?: string }> {
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
        error: stderr.trim() || undefined
      };
    } catch (error) {
      return {
        success: false,
        output: "",
        error: `Error running command: ${error instanceof Error ? error.message : String(error)}`
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
    this.verboseLog("Fetching all Flux resources using JSON output...");

    // Use flux get all with JSON output for reliable parsing
    const result = await this.runCommand(["flux", "get", "all", "-A", "--output", "json"]);
    if (!result.success) {
      this.log(`Failed to get Flux resources: ${result.error}`, "ERROR");
      return [];
    }

    try {
      const data = JSON.parse(result.output);
      const resources: FluxResource[] = [];

      // Process each resource type
      for (const item of data) {
        const conditions = item.status?.conditions || [];
        const readyCondition = conditions.find((c: any) => c.type === "Ready");
        const suspended = item.spec?.suspend === true;

        // Calculate age
        const createdTime = new Date(item.metadata?.creationTimestamp || Date.now());
        const age = this.calculateAge(createdTime);

        // Get last reconcile time
        const lastReconcileTime = item.status?.lastHandledReconcileAt ||
                                 item.status?.lastAttemptedRevision ||
                                 item.status?.lastAppliedRevision;

        resources.push({
          name: item.metadata?.name || "unknown",
          namespace: item.metadata?.namespace || "unknown",
          kind: item.kind || "unknown",
          ready: readyCondition?.status === "True",
          suspended,
          status: this.getResourceStatus(item, readyCondition),
          age,
          revision: this.getRevision(item),
          lastReconcileTime,
          conditions: conditions.map((c: any) => ({
            type: c.type,
            status: c.status,
            reason: c.reason,
            message: c.message
          })),
          source: item.spec?.sourceRef ? {
            kind: item.spec.sourceRef.kind,
            name: item.spec.sourceRef.name,
            namespace: item.spec.sourceRef.namespace
          } : undefined
        });
      }

      return resources;
    } catch (error) {
      this.log(`Failed to parse Flux resources JSON: ${error}`, "ERROR");
      return [];
    }
  }

  private getResourceStatus(item: any, readyCondition: any): string {
    if (item.spec?.suspend === true) return "Suspended";
    if (readyCondition?.status === "True") return "Ready";
    if (readyCondition?.status === "False") {
      return readyCondition.reason || "Not Ready";
    }
    return item.status?.phase || "Unknown";
  }

  private getRevision(item: any): string | undefined {
    return item.status?.lastAppliedRevision?.substring(0, 8) ||
           item.status?.artifact?.revision?.substring(0, 8) ||
           item.status?.lastAttemptedRevision?.substring(0, 8);
  }

  private calculateAge(createdTime: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - createdTime.getTime();

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d${hours}h`;
    if (hours > 0) return `${hours}h${minutes}m`;
    return `${minutes}m`;
  }

  async getRecentEvents(): Promise<KubernetesEvent[]> {
    const result = await this.runCommand([
      "kubectl", "get", "events",
      "--all-namespaces",
      "--sort-by=.metadata.creationTimestamp",
      "--no-headers"
    ]);

    if (!result.success) return [];

    return result.output.split('\n')
      .filter(line => line.trim())
      .slice(-20) // Get last 20 events
      .map(line => {
        const parts = line.split(/\s+/);
        return {
          namespace: parts[0] || '',
          age: parts[1] || '',
          type: parts[2] || '',
          reason: parts[3] || '',
          object: parts[4] || '',
          message: parts.slice(5).join(' ') || ''
        };
      });
  }

  async getFluxEvents(): Promise<KubernetesEvent[]> {
    const result = await this.runCommand([
      "kubectl", "get", "events",
      "-n", "flux-system",
      "--sort-by=.metadata.creationTimestamp",
      "--no-headers"
    ]);

    if (!result.success) return [];

    return result.output.split('\n')
      .filter(line => line.trim())
      .slice(-10) // Get last 10 Flux events
      .map(line => {
        const parts = line.split(/\s+/);
        return {
          namespace: 'flux-system',
          age: parts[0] || '',
          type: parts[1] || '',
          reason: parts[2] || '',
          object: parts[3] || '',
          message: parts.slice(4).join(' ') || ''
        };
      });
  }

  formatTable(headers: string[], rows: string[][]): void {
    const colWidths = headers.map((header, i) =>
      Math.max(header.length, ...rows.map(row => (row[i] || '').length))
    );

    // Print header
    const headerRow = headers.map((header, i) => header.padEnd(colWidths[i])).join(' | ');
    console.log(headerRow);
    console.log('-'.repeat(headerRow.length));

    // Print rows
    rows.forEach(row => {
      const formattedRow = row.map((cell, i) => (cell || '').padEnd(colWidths[i])).join(' | ');
      console.log(formattedRow);
    });
  }

  getStatusIcon(ready: boolean, suspended: boolean, status: string): string {
    if (suspended) return '⏸️';
    if (ready) return '✅';
    if (status.includes('Progressing') || status.includes('Reconciling')) return '🔄';
    return '❌';
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

      const rows = kindResources.map(resource => [
        this.getStatusIcon(resource.ready, resource.suspended, resource.status),
        resource.name,
        resource.namespace,
        resource.status,
        resource.revision || '',
        resource.age
      ]);

      this.formatTable(
        ['', 'NAME', 'NAMESPACE', 'STATUS', 'REVISION', 'AGE'],
        rows
      );

      // Show error details for failed resources
      if (this.verbose) {
        const failedResources = kindResources.filter(r => !r.ready && !r.suspended);
        for (const resource of failedResources) {
          const errorConditions = resource.conditions.filter(c =>
            c.status === "False" && c.message
          );
          if (errorConditions.length > 0) {
            console.log(`\n  ❌ ${resource.name} errors:`);
            for (const condition of errorConditions) {
              console.log(`     ${condition.type}: ${condition.reason} - ${condition.message}`);
            }
          }
        }
      }
    }

    // Summary
    const totalResources = resources.length;
    const readyResources = resources.filter(r => r.ready && !r.suspended).length;
    const suspendedResources = resources.filter(r => r.suspended).length;
    const failedResources = resources.filter(r => !r.ready && !r.suspended).length;

    console.log(`\n📊 Summary: ${readyResources}/${totalResources - suspendedResources} ready, ${suspendedResources} suspended, ${failedResources} failed\n`);
  }

  async displayRecentEvents(): Promise<void> {
    console.log("📋 Recent Kubernetes Events (last 20):");
    const events = await this.getRecentEvents();

    if (events.length === 0) {
      console.log("  No recent events found\n");
      return;
    }

    events.forEach(event => {
      const typeIcon = event.type === 'Normal' ? '✅' : '⚠️';
      console.log(`  ${typeIcon} ${event.age.padEnd(8)} ${event.namespace.padEnd(15)} ${event.reason.padEnd(20)} ${event.object}`);
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

    events.forEach(event => {
      const typeIcon = event.type === 'Normal' ? '✅' : '⚠️';
      console.log(`  ${typeIcon} ${event.age.padEnd(8)} ${event.reason.padEnd(20)} ${event.object}`);
      if (this.verbose && event.message) {
        console.log(`     ${event.message}`);
      }
    });
    console.log();
  }

  async getLatestCommit(): Promise<void> {
    console.log("📝 Latest Git Commit:");
    const result = await this.runCommand(["git", "log", "-1", "--oneline", "--decorate"]);

    if (result.success) {
      console.log(`  ${result.output}\n`);
    } else {
      console.log("  Unable to get latest commit\n");
    }
  }

  async reconcileFlux(): Promise<void> {
    console.log("🔄 Triggering comprehensive Flux reconciliation...");

    // Reconcile all sources first
    const sourcesResult = await this.runCommand([
      "flux", "reconcile", "source", "git", "--all", "--with-source"
    ]);

    if (sourcesResult.success) {
      console.log("✅ Git sources reconciled");
    } else {
      console.log("⚠️  Git source reconciliation had issues:");
      console.log(sourcesResult.output);
    }

    // Then reconcile all kustomizations
    const ksResult = await this.runCommand([
      "flux", "reconcile", "kustomization", "--all", "--with-source"
    ]);

    if (ksResult.success) {
      console.log("✅ Kustomizations reconciled");
    } else {
      console.log("⚠️  Kustomization reconciliation had issues:");
      console.log(ksResult.output);
    }

    // Finally reconcile all helm releases
    const hrResult = await this.runCommand([
      "flux", "reconcile", "helmrelease", "--all", "--with-source"
    ]);

    if (hrResult.success) {
      console.log("✅ HelmReleases reconciled");
    } else {
      console.log("⚠️  HelmRelease reconciliation had issues:");
      console.log(hrResult.output);
    }

    console.log("🔄 Reconciliation completed, waiting for changes to take effect...\n");
    await delay(5000); // Wait for reconciliation to take effect
  }

  async displayStatus(): Promise<void> {
    const timestamp = new Date().toLocaleString();
    console.clear();
    console.log(`🚀 Flux Monitor - ${timestamp}\n`);
    console.log("=" .repeat(80) + "\n");

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
      console.log(`🔍 Monitoring Flux activity (refreshing every ${this.interval}s)...`);
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
🚀 Flux Monitor - Track GitOps activity and deployments (Optimized)

Usage: deno run --allow-run --allow-net --allow-read flux-monitor.ts [options]

Options:
  -w, --watch           Watch mode - continuously refresh the display
  -v, --verbose         Show detailed events and error messages
  -i, --interval <sec>  Refresh interval in seconds (default: 30)
  -r, --reconcile       Trigger comprehensive Flux reconciliation before monitoring
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

Key Improvements:
  ✅ Uses JSON parsing instead of fragile text parsing
  ✅ Shows suspended resources and their status
  ✅ Displays error conditions and messages
  ✅ Groups resources by type for better organization
  ✅ Provides comprehensive reconciliation option
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
      h: "help"
    },
    default: {
      interval: "30",
      watch: false,
      verbose: false,
      reconcile: false
    }
  });

  if (args.help) {
    showHelp();
    return;
  }

  const monitor = new FluxMonitor({
    verbose: args.verbose,
    watch: args.watch,
    interval: parseInt(args.interval),
    forceReconcile: args.reconcile
  });

  try {
    await monitor.run();
  } catch (error) {
    if (error instanceof Deno.errors.Interrupted) {
      console.log("\n👋 Monitoring stopped");
    } else {
      console.error("❌ Error:", error instanceof Error ? error.message : String(error));
      Deno.exit(1);
    }
  }
}

if (import.meta.main) {
  main();
}