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
}

interface FluxResource {
  name: string;
  namespace: string;
  kind: string;
  ready: boolean;
  suspended: boolean;
  lastAppliedRevision?: string;
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

class FluxDeploymentChecker {
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

  async getGitRepositories(): Promise<GitRepositoryInfo[]> {
    this.verboseLog("Fetching GitRepository resources...");

    const result = await this.runKubectl([
      "get", "gitrepositories.source.toolkit.fluxcd.io",
      "--all-namespaces", "-o", "json"
    ]);

    if (!result.success) {
      throw new Error(`Failed to get GitRepositories: ${result.error}`);
    }

    const data = JSON.parse(result.output);
    const repos: GitRepositoryInfo[] = [];

    for (const repo of data.items || []) {
      const conditions = repo.status?.conditions || [];
      const readyCondition = conditions.find((c: any) => c.type === "Ready");

      repos.push({
        name: repo.metadata?.name || "unknown",
        namespace: repo.metadata?.namespace || "unknown",
        url: repo.spec?.url || "unknown",
        branch: repo.spec?.ref?.branch || "main",
        ready: readyCondition?.status === "True",
        lastFetchedRevision: repo.status?.artifact?.revision,
        conditions: conditions.map((c: any) => ({
          type: c.type,
          status: c.status,
          reason: c.reason,
          message: c.message
        }))
      });
    }

    return repos;
  }

  async getKustomizations(): Promise<FluxResource[]> {
    this.verboseLog("Fetching Kustomization resources...");

    const result = await this.runKubectl([
      "get", "kustomizations.kustomize.toolkit.fluxcd.io",
      "--all-namespaces", "-o", "json"
    ]);

    if (!result.success) {
      throw new Error(`Failed to get Kustomizations: ${result.error}`);
    }

    const data = JSON.parse(result.output);
    return this.parseFluxResources(data.items || [], "Kustomization");
  }

  async getHelmReleases(): Promise<FluxResource[]> {
    this.verboseLog("Fetching HelmRelease resources...");

    const result = await this.runKubectl([
      "get", "helmreleases.helm.toolkit.fluxcd.io",
      "--all-namespaces", "-o", "json"
    ]);

    if (!result.success) {
      throw new Error(`Failed to get HelmReleases: ${result.error}`);
    }

    const data = JSON.parse(result.output);
    return this.parseFluxResources(data.items || [], "HelmRelease");
  }

  private parseFluxResources(items: any[], kind: string): FluxResource[] {
    const resources: FluxResource[] = [];

    for (const item of items) {
      const conditions = item.status?.conditions || [];
      const readyCondition = conditions.find((c: any) => c.type === "Ready");

      resources.push({
        name: item.metadata?.name || "unknown",
        namespace: item.metadata?.namespace || "unknown",
        kind,
        ready: readyCondition?.status === "True",
        suspended: item.spec?.suspend === true,
        lastAppliedRevision: item.status?.lastAppliedRevision,
        conditions: conditions.map((c: any) => ({
          type: c.type,
          status: c.status,
          reason: c.reason,
          message: c.message,
          lastTransitionTime: c.lastTransitionTime
        })),
        source: item.spec?.sourceRef ? {
          kind: item.spec.sourceRef.kind,
          name: item.spec.sourceRef.name,
          namespace: item.spec.sourceRef.namespace
        } : undefined
      });
    }

    return resources;
  }

  async checkGitRepositories(): Promise<boolean> {
    this.log("🔍 Checking GitRepository sources...");

    const repos = await this.getGitRepositories();
    let allHealthy = true;

    for (const repo of repos) {
      if (repo.ready) {
        this.log(`✅ GitRepository ${repo.namespace}/${repo.name}: Ready`);

        if (this.verbose) {
          this.verboseLog(`   URL: ${repo.url}`);
          this.verboseLog(`   Branch: ${repo.branch}`);
          if (repo.lastFetchedRevision) {
            this.verboseLog(`   Last fetched: ${repo.lastFetchedRevision.substring(0, 8)}`);
          }
        }
      } else {
        this.log(`❌ GitRepository ${repo.namespace}/${repo.name}: Not Ready`, "ERROR");
        allHealthy = false;

        // Show error conditions
        const errorConditions = repo.conditions.filter(c =>
          c.status === "False" || (c.type !== "Ready" && c.status === "True")
        );

        for (const condition of errorConditions) {
          this.log(`   ${condition.type}: ${condition.reason} - ${condition.message}`, "WARN");
        }
      }
    }

    this.log(`📊 GitRepository Summary: ${repos.filter(r => r.ready).length}/${repos.length} ready`);
    return allHealthy;
  }

  async checkKustomizations(): Promise<boolean> {
    this.log("🔍 Checking Kustomization deployments...");

    const kustomizations = await this.getKustomizations();
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

          if (this.verbose && resource.source) {
            this.verboseLog(`     Source: ${resource.source.kind}/${resource.source.name}`);
          }

          const errorConditions = resource.conditions.filter(c =>
            c.status === "False" || (c.type !== "Ready" && c.status === "True")
          );

          for (const condition of errorConditions) {
            this.log(`     ${condition.type}: ${condition.reason} - ${condition.message}`, "WARN");
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

  async checkHelmReleases(): Promise<boolean> {
    this.log("🔍 Checking HelmRelease deployments...");

    const helmReleases = await this.getHelmReleases();
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

          if (this.verbose && resource.source) {
            this.verboseLog(`     Chart source: ${resource.source.kind}/${resource.source.name}`);
          }

          const errorConditions = resource.conditions.filter(c =>
            c.status === "False" || (c.type !== "Ready" && c.status === "True")
          );

          for (const condition of errorConditions) {
            this.log(`     ${condition.type}: ${condition.reason} - ${condition.message}`, "WARN");
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

  async reconcileAll(): Promise<void> {
    this.log("🔄 Triggering Flux reconciliation...");

    try {
      // Reconcile GitRepository sources first
      const gitRepos = await this.getGitRepositories();
      for (const repo of gitRepos) {
        this.verboseLog(`Reconciling GitRepository ${repo.namespace}/${repo.name}...`);
        await this.runFlux([
          "reconcile", "source", "git", repo.name,
          "-n", repo.namespace, "--with-source"
        ]);
      }

      // Then reconcile Kustomizations
      const kustomizations = await this.getKustomizations();
      for (const ks of kustomizations) {
        if (!ks.suspended) {
          this.verboseLog(`Reconciling Kustomization ${ks.namespace}/${ks.name}...`);
          await this.runFlux([
            "reconcile", "kustomization", ks.name,
            "-n", ks.namespace, "--with-source"
          ]);
        }
      }

      // Finally reconcile HelmReleases
      const helmReleases = await this.getHelmReleases();
      for (const hr of helmReleases) {
        if (!hr.suspended) {
          this.verboseLog(`Reconciling HelmRelease ${hr.namespace}/${hr.name}...`);
          await this.runFlux([
            "reconcile", "helmrelease", hr.name,
            "-n", hr.namespace, "--with-source"
          ]);
        }
      }

      this.log("✅ Flux reconciliation completed");
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

    let allHealthy = true;

    // Check GitRepository sources
    if (!(await this.checkGitRepositories())) {
      allHealthy = false;
    }

    // Check Kustomizations
    if (!(await this.checkKustomizations())) {
      allHealthy = false;
    }

    // Check HelmReleases
    if (!(await this.checkHelmReleases())) {
      allHealthy = false;
    }

    // Final summary
    if (allHealthy) {
      this.log("🎉 GitOps deployment verification PASSED - All deployments healthy!");
    } else {
      this.log("⚠️  GitOps deployment verification FAILED - Issues detected", "ERROR");
    }

    return allHealthy;
  }
}

function showHelp(): void {
  console.log(`
🔄 Flux GitOps Deployment Checker

Usage: deno run --allow-all flux-deployment-check.ts [options]

Options:
  -v, --verbose         Verbose output with detailed information
  -n, --namespace <ns>  Check resources in specific namespace only
  -c, --continuous      Run continuously (use with --interval)
  -w, --watch           Watch mode - reconcile and check repeatedly
  -i, --interval <sec>  Interval between checks in seconds (default: 60)
  -h, --help           Show this help message

Examples:
  deno run --allow-all flux-deployment-check.ts                    # Basic deployment check
  deno run --allow-all flux-deployment-check.ts --verbose          # Detailed output
  deno run --allow-all flux-deployment-check.ts -n flux-system     # Check only flux-system
  deno run --allow-all flux-deployment-check.ts -w -i 120          # Watch mode every 2 minutes
  `);
}

async function main(): Promise<void> {
  const parsedArgs = parseArgs(Deno.args, {
    string: ["namespace", "interval"],
    boolean: ["verbose", "continuous", "help", "watch"],
    alias: {
      v: "verbose",
      n: "namespace",
      c: "continuous",
      w: "watch",
      i: "interval",
      h: "help"
    },
    default: {
      verbose: false,
      continuous: false,
      watch: false,
      interval: "60"
    }
  });

  const args = {
    verbose: Boolean(parsedArgs.verbose),
    namespace: parsedArgs.namespace as string | undefined,
    continuous: Boolean(parsedArgs.continuous),
    watch: Boolean(parsedArgs.watch),
    help: Boolean(parsedArgs.help),
    interval: String(parsedArgs.interval || "60")
  };

  if (args.help) {
    showHelp();
    return;
  }

  const interval = parseInt(args.interval) * 1000; // Convert to milliseconds
  const checker = new FluxDeploymentChecker(args.verbose);

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