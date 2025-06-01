#!/usr/bin/env -S deno run --allow-run --allow-net --allow-read
/**
 * Flux Monitor - Track Flux GitOps activity and deployments
 *
 * This script monitors Flux activity including:
 * - Git repository sync status
 * - Kustomization reconciliation
 * - HelmRelease deployments
 * - Recent events and changes
 */

import { parseArgs } from "@std/cli/parse-args";
import { delay } from "@std/async/delay";

interface FluxResource {
  name: string;
  namespace: string;
  ready: string;
  status: string;
  age: string;
  revision?: string;
  suspended?: string;
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

  constructor(options: { verbose: boolean; watch: boolean; interval: number }) {
    this.verbose = options.verbose;
    this.watch = options.watch;
    this.interval = options.interval;
  }

  async runCommand(cmd: string[]): Promise<{ success: boolean; output: string }> {
    try {
      const command = new Deno.Command(cmd[0], {
        args: cmd.slice(1),
        stdout: "piped",
        stderr: "piped",
      });

      const result = await command.output();
      const output = new TextDecoder().decode(result.stdout) +
                     new TextDecoder().decode(result.stderr);

      return {
        success: result.success,
        output: output.trim()
      };
    } catch (error) {
      return {
        success: false,
        output: `Error running command: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  async checkFluxStatus(): Promise<void> {
    console.log("🔍 Checking Flux system status...\n");

    const result = await this.runCommand(["flux", "check"]);
    if (!result.success) {
      console.log("❌ Flux check failed:");
      console.log(result.output);
      return;
    }

    console.log("✅ Flux system is healthy\n");
  }

  async getGitRepositories(): Promise<FluxResource[]> {
    const result = await this.runCommand(["flux", "get", "sources", "git", "-A", "--no-header"]);
    if (!result.success) return [];

    return result.output.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const parts = line.split(/\s+/);
        return {
          name: parts[1] || '',
          namespace: parts[0] || '',
          ready: parts[2] || '',
          status: parts[3] || '',
          age: parts[4] || '',
          revision: parts[5] || ''
        };
      });
  }

  async getKustomizations(): Promise<FluxResource[]> {
    const result = await this.runCommand(["flux", "get", "kustomizations", "-A", "--no-header"]);
    if (!result.success) return [];

    return result.output.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const parts = line.split(/\s+/);
        return {
          name: parts[1] || '',
          namespace: parts[0] || '',
          ready: parts[2] || '',
          status: parts[3] || '',
          age: parts[4] || '',
          revision: parts[5] || ''
        };
      });
  }

  async getHelmReleases(): Promise<FluxResource[]> {
    const result = await this.runCommand(["flux", "get", "helmreleases", "-A", "--no-header"]);
    if (!result.success) return [];

    return result.output.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const parts = line.split(/\s+/);
        return {
          name: parts[1] || '',
          namespace: parts[0] || '',
          ready: parts[2] || '',
          status: parts[3] || '',
          age: parts[4] || '',
          revision: parts[5] || ''
        };
      });
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

  getStatusIcon(ready: string, status: string): string {
    if (ready === 'True') return '✅';
    if (ready === 'False') return '❌';
    if (status.includes('Progressing') || status.includes('Reconciling')) return '🔄';
    return '⚠️';
  }

  async displayGitRepositories(): Promise<void> {
    console.log("📦 Git Repositories:");
    const repos = await this.getGitRepositories();

    if (repos.length === 0) {
      console.log("  No Git repositories found\n");
      return;
    }

    const rows = repos.map(repo => [
      this.getStatusIcon(repo.ready, repo.status),
      repo.name,
      repo.namespace,
      repo.ready,
      repo.status,
      repo.revision?.substring(0, 8) || '',
      repo.age
    ]);

    this.formatTable(
      ['', 'NAME', 'NAMESPACE', 'READY', 'STATUS', 'REVISION', 'AGE'],
      rows
    );
    console.log();
  }

  async displayKustomizations(): Promise<void> {
    console.log("🔧 Kustomizations:");
    const kustomizations = await this.getKustomizations();

    if (kustomizations.length === 0) {
      console.log("  No Kustomizations found\n");
      return;
    }

    const rows = kustomizations.map(ks => [
      this.getStatusIcon(ks.ready, ks.status),
      ks.name,
      ks.namespace,
      ks.ready,
      ks.status,
      ks.revision?.substring(0, 8) || '',
      ks.age
    ]);

    this.formatTable(
      ['', 'NAME', 'NAMESPACE', 'READY', 'STATUS', 'REVISION', 'AGE'],
      rows
    );
    console.log();
  }

  async displayHelmReleases(): Promise<void> {
    console.log("⚓ Helm Releases:");
    const releases = await this.getHelmReleases();

    if (releases.length === 0) {
      console.log("  No Helm releases found\n");
      return;
    }

    const rows = releases.map(hr => [
      this.getStatusIcon(hr.ready, hr.status),
      hr.name,
      hr.namespace,
      hr.ready,
      hr.status,
      hr.revision || '',
      hr.age
    ]);

    this.formatTable(
      ['', 'NAME', 'NAMESPACE', 'READY', 'STATUS', 'REVISION', 'AGE'],
      rows
    );
    console.log();
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
    console.log("🔄 Triggering Flux reconciliation...");

    const result = await this.runCommand([
      "flux", "reconcile", "kustomization", "flux-system",
      "--with-source", "-n", "flux-system"
    ]);

    if (result.success) {
      console.log("✅ Flux reconciliation triggered\n");
    } else {
      console.log("❌ Failed to trigger reconciliation:");
      console.log(result.output + "\n");
    }
  }

  async displayStatus(): Promise<void> {
    const timestamp = new Date().toLocaleString();
    console.clear();
    console.log(`🚀 Flux Monitor - ${timestamp}\n`);
    console.log("=" .repeat(80) + "\n");

    await this.checkFluxStatus();
    await this.getLatestCommit();
    await this.displayGitRepositories();
    await this.displayKustomizations();
    await this.displayHelmReleases();

    if (this.verbose) {
      await this.displayFluxEvents();
      await this.displayRecentEvents();
    }
  }

  async run(): Promise<void> {
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
🚀 Flux Monitor - Track GitOps activity and deployments

Usage: deno run --allow-run --allow-net --allow-read flux-monitor.ts [options]

Options:
  -w, --watch           Watch mode - continuously refresh the display
  -v, --verbose         Show detailed events and messages
  -i, --interval <sec>  Refresh interval in seconds (default: 30)
  -r, --reconcile       Trigger Flux reconciliation before monitoring
  -h, --help            Show this help message

Examples:
  # Show current status once
  ./flux-monitor.ts

  # Watch mode with 15-second refresh
  ./flux-monitor.ts --watch --interval 15

  # Verbose mode with detailed events
  ./flux-monitor.ts --watch --verbose

  # Trigger reconciliation and then watch
  ./flux-monitor.ts --reconcile --watch
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
    interval: parseInt(args.interval)
  });

  try {
    if (args.reconcile) {
      await monitor.reconcileFlux();
    }

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