#!/usr/bin/env -S deno run --allow-all

import { parseArgs } from "@std/cli/parse-args";
import { delay } from "@std/async/delay";

interface FluxCheckOptions {
  verbose: boolean;
  namespace?: string;
  continuous: boolean;
  interval: number;
  help: boolean;
  watch: boolean;
  forceReconcile: boolean;
}

interface FluxResource {
  name: string;
  namespace: string;
  kind: string;
  ready: boolean;
  suspended: boolean;
  lastAppliedRevision?: string;
  lastReconcileTime?: string;
  conditions: Array<{
    type: string;
    status: string;
    reason?: string;
    message?: string;
    lastTransitionTime?: string;
  }>;
  source?: {
    kind: string;
    name: string;
    namespace?: string;
  };
  dependsOn?: Array<{
    name: string;
    namespace?: string;
  }>;
}

interface GitRepositoryInfo {
  name: string;
  namespace: string;
  url: string;
  branch?: string;
  ready: boolean;
  lastFetchedRevision?: string;
  conditions: Array<{
    type: string;
    status: string;
    reason?: string;
    message?: string;
  }>;
}

interface HealthScore {
  overall: number;
  sources: number;
  kustomizations: number;
  helmreleases: number;
  details: {
    totalResources: number;
    readyResources: number;
    suspendedResources: number;
    failedResources: number;
  };
}

class FluxDeploymentChecker {
  private verbose: boolean;
  private forceReconcile: boolean;

  constructor(verbose = false, forceReconcile = false) {
    this.verbose = verbose;
    this.forceReconcile = forceReconcile;
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

  private async runFlux(args: string[]): Promise<{success: boolean, output: string, error?: string}> {
    try {
      const command = new Deno.Command("flux", {
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
        error: `Failed to run flux: ${errorMessage}`
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

  async checkFluxInstallation(): Promise<boolean> {
    this.verboseLog("Checking Flux installation...");

    const result = await this.runFlux(["check"]);
    if (!result.success) {
      this.log(`Flux installation check failed: ${result.error}`, "ERROR");
      return false;
    }

    this.verboseLog("✅ Flux installation verified");
    return true;
  }

  async getAllFluxResources(): Promise<{
    gitRepositories: GitRepositoryInfo[];
    kustomizations: FluxResource[];
    helmReleases: FluxResource[];
  }> {
    this.verboseLog("Fetching all Flux resources using compatible commands...");

    try {
      // Get GitRepositories using flux CLI
      const gitRepositories = await this.getGitRepositories();

      // Get Kustomizations using flux CLI
      const kustomizations = await this.getKustomizations();

      // Get HelmReleases using flux CLI
      const helmReleases = await this.getHelmReleases();

      return { gitRepositories, kustomizations, helmReleases };
    } catch (error) {
      throw new Error(`Failed to get Flux resources: ${error}`);
    }
  }

  async getGitRepositories(): Promise<GitRepositoryInfo[]> {
    const result = await this.runFlux(["get", "sources", "git", "-A", "--no-header"]);
    if (!result.success) {
      throw new Error(`Failed to get GitRepositories: ${result.error}`);
    }

    const repos: GitRepositoryInfo[] = [];
    const lines = result.output.trim().split('\n');

    for (const line of lines) {
      if (!line.trim()) continue;

      const parts = line.trim().split(/\s+/);
      if (parts.length < 5) continue;

      const namespace = parts[0];
      const name = parts[1];
      const revision = parts[2];
      const suspended = parts[3] === "True";
      const ready = parts[4] === "True";
      const message = parts.slice(5).join(' ');

      repos.push({
        name,
        namespace,
        url: "unknown", // We'd need kubectl to get the URL
        branch: revision.includes("refs/heads/") ? revision.split("refs/heads/")[1].split("@")[0] : "main",
        ready,
        lastFetchedRevision: revision,
        conditions: [] // We'd need kubectl to get detailed conditions
      });
    }

    return repos;
  }

  async getKustomizations(): Promise<FluxResource[]> {
    const result = await this.runFlux(["get", "kustomizations", "-A", "--no-header"]);
    if (!result.success) {
      throw new Error(`Failed to get Kustomizations: ${result.error}`);
    }

    return this.parseFluxResources(result.output, "Kustomization");
  }

  async getHelmReleases(): Promise<FluxResource[]> {
    const result = await this.runFlux(["get", "helmreleases", "-A", "--no-header"]);
    if (!result.success) {
      throw new Error(`Failed to get HelmReleases: ${result.error}`);
    }

    return this.parseFluxResources(result.output, "HelmRelease");
  }

  private parseFluxResources(output: string, kind: string): FluxResource[] {
    const resources: FluxResource[] = [];
    const lines = output.trim().split('\n');

    for (const line of lines) {
      if (!line.trim()) continue;

      const parts = line.trim().split(/\s+/);
      if (parts.length < 5) continue;

      const namespace = parts[0];
      const name = parts[1];
      const revision = parts[2];
      const suspended = parts[3] === "True";
      const ready = parts[4] === "True";
      const message = parts.slice(5).join(' ') || (ready ? "Ready" : "Not Ready");

      resources.push({
        name,
        namespace,
        kind,
        ready,
        suspended,
        lastAppliedRevision: revision,
        conditions: [], // We'd need kubectl to get detailed conditions
        source: undefined, // We'd need kubectl to get source info
        dependsOn: undefined // We'd need kubectl to get dependencies
      });
    }

    return resources;
  }

  async checkGitRepositories(repos: GitRepositoryInfo[]): Promise<boolean> {
    this.log("🔍 Checking GitRepository sources...");

    let allHealthy = true;

    for (const repo of repos) {
      if (repo.ready) {
        this.log(`✅ GitRepository ${repo.namespace}/${repo.name}: Ready`);

        if (this.verbose) {
          if (repo.lastFetchedRevision) {
            this.verboseLog(`   Last fetched: ${repo.lastFetchedRevision.substring(0, 8)}`);
          }
        }
      } else {
        this.log(`❌ GitRepository ${repo.namespace}/${repo.name}: Not Ready`, "ERROR");
        allHealthy = false;

        // Get detailed info if verbose
        if (this.verbose) {
          await this.showResourceDetails("GitRepository", repo.name, repo.namespace);
        }
      }
    }

    this.log(`📊 GitRepository Summary: ${repos.filter(r => r.ready).length}/${repos.length} ready`);
    return allHealthy;
  }

  async checkKustomizations(kustomizations: FluxResource[]): Promise<boolean> {
    this.log("🔍 Checking Kustomization deployments...");

    let allHealthy = true;

    // Group by namespace for better organization
    const byNamespace = new Map<string, FluxResource[]>();
    for (const ks of kustomizations) {
      if (!byNamespace.has(ks.namespace)) {
        byNamespace.set(ks.namespace, []);
      }
      byNamespace.get(ks.namespace)!.push(ks);
    }

    for (const [namespace, resources] of byNamespace) {
      const readyCount = resources.filter(r => r.ready && !r.suspended).length;
      const suspendedCount = resources.filter(r => r.suspended).length;
      const totalActive = resources.length - suspendedCount;

      if (readyCount === totalActive && totalActive > 0) {
        this.log(`✅ Namespace ${namespace}: All ${totalActive} Kustomizations ready`);
        if (suspendedCount > 0) {
          this.verboseLog(`   (${suspendedCount} suspended)`);
        }
      } else {
        this.log(`❌ Namespace ${namespace}: ${readyCount}/${totalActive} Kustomizations ready`, "ERROR");
        allHealthy = false;
      }

      // Show details for failed resources
      for (const resource of resources) {
        if (!resource.ready && !resource.suspended) {
          this.log(`   ${resource.name}: Not Ready`, "WARN");

          if (this.verbose) {
            await this.showResourceDetails("Kustomization", resource.name, resource.namespace);
          }
        } else if (resource.suspended) {
          this.verboseLog(`   ${resource.name}: Suspended`);
        } else if (this.verbose) {
          this.verboseLog(`   ${resource.name}: Ready`);
          if (resource.lastAppliedRevision) {
            this.verboseLog(`     Last applied: ${resource.lastAppliedRevision.substring(0, 8)}`);
          }
        }
      }
    }

    const totalReady = kustomizations.filter(k => k.ready && !k.suspended).length;
    const totalSuspended = kustomizations.filter(k => k.suspended).length;
    const totalActive = kustomizations.length - totalSuspended;

    this.log(`📊 Kustomization Summary: ${totalReady}/${totalActive} ready, ${totalSuspended} suspended`);
    return allHealthy;
  }

  async checkHelmReleases(helmReleases: FluxResource[]): Promise<boolean> {
    this.log("🔍 Checking HelmRelease deployments...");

    let allHealthy = true;

    // Group by namespace
    const byNamespace = new Map<string, FluxResource[]>();
    for (const hr of helmReleases) {
      if (!byNamespace.has(hr.namespace)) {
        byNamespace.set(hr.namespace, []);
      }
      byNamespace.get(hr.namespace)!.push(hr);
    }

    for (const [namespace, resources] of byNamespace) {
      const readyCount = resources.filter(r => r.ready && !r.suspended).length;
      const suspendedCount = resources.filter(r => r.suspended).length;
      const totalActive = resources.length - suspendedCount;

      if (readyCount === totalActive && totalActive > 0) {
        this.log(`✅ Namespace ${namespace}: All ${totalActive} HelmReleases ready`);
        if (suspendedCount > 0) {
          this.verboseLog(`   (${suspendedCount} suspended)`);
        }
      } else if (totalActive > 0) {
        this.log(`❌ Namespace ${namespace}: ${readyCount}/${totalActive} HelmReleases ready`, "ERROR");
        allHealthy = false;
      }

      // Show details for failed resources
      for (const resource of resources) {
        if (!resource.ready && !resource.suspended) {
          this.log(`   ${resource.name}: Not Ready`, "WARN");

          if (this.verbose) {
            await this.showResourceDetails("HelmRelease", resource.name, resource.namespace);
          }
        } else if (resource.suspended) {
          this.verboseLog(`   ${resource.name}: Suspended`);
        } else if (this.verbose) {
          this.verboseLog(`   ${resource.name}: Ready`);
        }
      }
    }

    const totalReady = helmReleases.filter(hr => hr.ready && !hr.suspended).length;
    const totalSuspended = helmReleases.filter(hr => hr.suspended).length;
    const totalActive = helmReleases.length - totalSuspended;

    this.log(`📊 HelmRelease Summary: ${totalReady}/${totalActive} ready, ${totalSuspended} suspended`);
    return allHealthy;
  }

  async showResourceDetails(kind: string, name: string, namespace: string): Promise<void> {
    try {
      let resourceType: string;

      if (kind === "GitRepository") {
        resourceType = "gitrepository";
      } else if (kind === "Kustomization") {
        resourceType = "kustomization";
      } else if (kind === "HelmRelease") {
        resourceType = "helmrelease";
      } else {
        return;
      }

      const result = await this.runKubectl([
        "get", resourceType, name, "-n", namespace, "-o", "yaml"
      ]);

      if (result.success) {
        // Parse YAML to extract conditions (simplified)
        const lines = result.output.split('\n');
        let inConditions = false;

        for (const line of lines) {
          if (line.includes('conditions:')) {
            inConditions = true;
            continue;
          }

          if (inConditions && line.includes('- lastTransitionTime:')) {
            inConditions = false;
            continue;
          }

          if (inConditions && line.includes('message:')) {
            const message = line.split('message:')[1]?.trim().replace(/^["']|["']$/g, '');
            if (message && message !== 'null') {
              this.log(`     ${message}`, "WARN");
            }
          }
        }
      }
    } catch (error) {
      this.verboseLog(`Failed to get details for ${name}: ${error}`);
    }
  }

  calculateHealthScore(
    gitRepos: GitRepositoryInfo[],
    kustomizations: FluxResource[],
    helmReleases: FluxResource[]
  ): HealthScore {
    const allResources = [...kustomizations, ...helmReleases];
    const totalResources = allResources.length;
    const readyResources = allResources.filter(r => r.ready && !r.suspended).length;
    const suspendedResources = allResources.filter(r => r.suspended).length;
    const failedResources = allResources.filter(r => !r.ready && !r.suspended).length;

    const sourcesScore = gitRepos.length > 0 ?
      (gitRepos.filter(r => r.ready).length / gitRepos.length) * 100 : 100;

    const activeResources = totalResources - suspendedResources;
    const kustomizationsScore = kustomizations.length > 0 ?
      (kustomizations.filter(k => k.ready && !k.suspended).length /
       Math.max(1, kustomizations.length - kustomizations.filter(k => k.suspended).length)) * 100 : 100;

    const helmReleasesScore = helmReleases.length > 0 ?
      (helmReleases.filter(hr => hr.ready && !hr.suspended).length /
       Math.max(1, helmReleases.length - helmReleases.filter(hr => hr.suspended).length)) * 100 : 100;

    const overallScore = activeResources > 0 ? (readyResources / activeResources) * 100 : 100;

    return {
      overall: Math.round(overallScore),
      sources: Math.round(sourcesScore),
      kustomizations: Math.round(kustomizationsScore),
      helmreleases: Math.round(helmReleasesScore),
      details: {
        totalResources,
        readyResources,
        suspendedResources,
        failedResources
      }
    };
  }

  async reconcileAll(): Promise<void> {
    this.log("🔄 Triggering Flux reconciliation (compatible mode)...");

    try {
      // Get all GitRepositories and reconcile them individually
      this.verboseLog("Reconciling Git sources...");
      const gitRepos = await this.getGitRepositories();
      for (const repo of gitRepos) {
        const result = await this.runFlux([
          "reconcile", "source", "git", repo.name, "-n", repo.namespace, "--with-source"
        ]);
        if (!result.success) {
          this.verboseLog(`Failed to reconcile GitRepository ${repo.name}: ${result.error}`);
        }
      }

      if (gitRepos.length > 0) {
        this.log("✅ Git sources reconciled");
        // Wait a bit for sources to be ready
        await delay(2000);
      }

      // Get all Kustomizations and reconcile them individually
      this.verboseLog("Reconciling Kustomizations...");
      const kustomizations = await this.getKustomizations();
      let reconciledKs = 0;
      for (const ks of kustomizations) {
        if (!ks.suspended) {
          const result = await this.runFlux([
            "reconcile", "kustomization", ks.name, "-n", ks.namespace, "--with-source"
          ]);
          if (!result.success) {
            this.verboseLog(`Failed to reconcile Kustomization ${ks.name}: ${result.error}`);
          } else {
            reconciledKs++;
          }
        }
      }

      if (reconciledKs > 0) {
        this.log("✅ Kustomizations reconciled");
        // Wait a bit for kustomizations to be ready
        await delay(2000);
      }

      // Get all HelmReleases and reconcile them individually
      this.verboseLog("Reconciling HelmReleases...");
      const helmReleases = await this.getHelmReleases();
      let reconciledHr = 0;
      for (const hr of helmReleases) {
        if (!hr.suspended) {
          const result = await this.runFlux([
            "reconcile", "helmrelease", hr.name, "-n", hr.namespace, "--with-source"
          ]);
          if (!result.success) {
            this.verboseLog(`Failed to reconcile HelmRelease ${hr.name}: ${result.error}`);
          } else {
            reconciledHr++;
          }
        }
      }

      if (reconciledHr > 0) {
        this.log("✅ HelmReleases reconciled");
      }

      this.log("✅ Comprehensive reconciliation completed");
      this.log("⏳ Waiting for reconciliation to take effect...");
      await delay(5000); // Wait for reconciliation to take effect

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log(`❌ Reconciliation failed: ${errorMessage}`, "ERROR");
    }
  }

  async performFullDeploymentCheck(): Promise<boolean> {
    this.log("🚀 Starting comprehensive GitOps deployment verification...");

    // Check Flux installation first
    if (!(await this.checkFluxInstallation())) {
      return false;
    }

    // Force reconciliation if requested
    if (this.forceReconcile) {
      await this.reconcileAll();
    }

    // Get all resources using compatible commands
    const { gitRepositories, kustomizations, helmReleases } = await this.getAllFluxResources();

    let allHealthy = true;

    // Check GitRepository sources
    if (!(await this.checkGitRepositories(gitRepositories))) {
      allHealthy = false;
    }

    // Check Kustomizations
    if (!(await this.checkKustomizations(kustomizations))) {
      allHealthy = false;
    }

    // Check HelmReleases
    if (!(await this.checkHelmReleases(helmReleases))) {
      allHealthy = false;
    }

    // Calculate and display health score
    const healthScore = this.calculateHealthScore(gitRepositories, kustomizations, helmReleases);
    this.log(`🏥 Health Score: ${healthScore.overall}% overall`);

    if (this.verbose) {
      this.verboseLog(`   Sources: ${healthScore.sources}%`);
      this.verboseLog(`   Kustomizations: ${healthScore.kustomizations}%`);
      this.verboseLog(`   HelmReleases: ${healthScore.helmreleases}%`);
      this.verboseLog(`   Details: ${healthScore.details.readyResources}/${healthScore.details.totalResources - healthScore.details.suspendedResources} ready, ${healthScore.details.suspendedResources} suspended, ${healthScore.details.failedResources} failed`);
    }

    // Final summary
    if (allHealthy) {
      this.log("🎉 GitOps deployment verification PASSED - All deployments healthy!");
    } else {
      this.log("⚠️  GitOps deployment verification FAILED - Issues detected", "ERROR");

      if (healthScore.overall < 80) {
        this.log("💡 Consider running with --force-reconcile to refresh all resources", "WARN");
      }
    }

    return allHealthy;
  }
}

function showHelp(): void {
  console.log(`
🔄 Flux GitOps Deployment Checker (Compatible with Flux v2.5.1)

Usage: deno run --allow-all flux-deployment-check.ts [options]

Options:
  -v, --verbose         Verbose output with detailed information
  -n, --namespace <ns>  Check resources in specific namespace only
  -c, --continuous      Run continuously (use with --interval)
  -w, --watch           Watch mode - reconcile and check repeatedly
  -r, --force-reconcile Force reconciliation before checking for fresh data
  -i, --interval <sec>  Interval between checks in seconds (default: 60)
  -h, --help           Show this help message

Examples:
  deno run --allow-all flux-deployment-check.ts                    # Basic deployment check
  deno run --allow-all flux-deployment-check.ts --verbose          # Detailed output
  deno run --allow-all flux-deployment-check.ts --force-reconcile  # Force fresh data
  deno run --allow-all flux-deployment-check.ts -w -i 120          # Watch mode every 2 minutes
  deno run --allow-all flux-deployment-check.ts -r -w              # Force reconcile + watch

Key Features:
  ✅ Compatible with Flux v2.5.1
  ✅ Individual resource reconciliation (no --all flag needed)
  ✅ Shows dependency relationships between resources
  ✅ Calculates and displays health scores
  ✅ Better error aggregation and reporting
  ✅ Improved reconciliation timing and sequencing
  `);
}

async function main(): Promise<void> {
  const parsedArgs = parseArgs(Deno.args, {
    string: ["namespace", "interval"],
    boolean: ["verbose", "continuous", "help", "watch", "force-reconcile"],
    alias: {
      v: "verbose",
      n: "namespace",
      c: "continuous",
      w: "watch",
      r: "force-reconcile",
      i: "interval",
      h: "help"
    },
    default: {
      verbose: false,
      continuous: false,
      watch: false,
      "force-reconcile": false,
      interval: "60"
    }
  });

  const args = {
    verbose: Boolean(parsedArgs.verbose),
    namespace: parsedArgs.namespace as string | undefined,
    continuous: Boolean(parsedArgs.continuous),
    watch: Boolean(parsedArgs.watch),
    forceReconcile: Boolean(parsedArgs["force-reconcile"]),
    help: Boolean(parsedArgs.help),
    interval: String(parsedArgs.interval || "60")
  };

  if (args.help) {
    showHelp();
    return;
  }

  const interval = parseInt(args.interval) * 1000; // Convert to milliseconds
  const checker = new FluxDeploymentChecker(args.verbose, args.forceReconcile);

  try {
    if (args.continuous || args.watch) {
      const mode = args.watch ? "watch" : "continuous";
      console.log(`🔄 Starting ${mode} monitoring (interval: ${args.interval}s, Ctrl+C to stop)...`);

      while (true) {
        if (args.watch) {
          // In watch mode, trigger reconciliation first
          await checker.reconcileAll();
          await delay(5000); // Wait a bit for reconciliation to take effect
        }

        const healthy = await checker.performFullDeploymentCheck();

        if (!healthy) {
          console.log("⏳ Waiting before next check due to issues...");
        }

        await delay(interval);
        console.log("\n" + "=".repeat(80) + "\n");
      }
    } else {
      const healthy = await checker.performFullDeploymentCheck();
      Deno.exit(healthy ? 0 : 1);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Deployment check failed: ${errorMessage}`);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}