import type { MonitoringResult, CLIOptions } from "../../shared/types.ts";
import { colors } from "@cliffy/ansi/colors";

/**
 * Flux configuration check - wraps existing comprehensive check with optimizations
 */
export async function runFluxConfigCheck(options: CLIOptions): Promise<void> {
  try {
    // Import and run the existing flux config checker
    const startTime = Date.now();
    
    // Use dynamic import to avoid loading unless needed
    const { FluxConfigChecker } = await import("../../../check-flux-config-wrapper.ts");
    const checker = new FluxConfigChecker(!!options.json);
    const result = await checker.run();
    
    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      // Already printed by the checker in human mode
    }
    
    // Exit with appropriate code
    const exitCode = 
      result.status === "healthy" ? 0 :
      result.status === "warning" ? 1 :
      result.status === "critical" ? 2 : 3;
    
    Deno.exit(exitCode);
    
  } catch (error) {
    if (options.json) {
      const errorResult: MonitoringResult = {
        status: "error",
        timestamp: new Date().toISOString(),
        summary: { total: 0, healthy: 0, warnings: 0, critical: 0 },
        details: [`Error: ${error instanceof Error ? error.message : String(error)}`],
        issues: [`Flux config check failed: ${error instanceof Error ? error.message : String(error)}`]
      };
      console.log(JSON.stringify(errorResult, null, 2));
    } else {
      console.error(colors.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
    }
    Deno.exit(3);
  }
}

/**
 * Quick Flux status check using kubectl commands
 */
export async function runFluxStatus(options: CLIOptions & { namespace?: string }): Promise<void> {
  try {
    const startTime = Date.now();
    const issues: string[] = [];
    
    // Quick parallel status checks
    const checks = await Promise.allSettled([
      checkFluxSystem(),
      checkGitRepositories(options.namespace),
      checkKustomizations(options.namespace),
      checkHelmReleases(options.namespace)
    ]);
    
    let critical = 0;
    let warnings = 0;
    
    checks.forEach((check, index) => {
      if (check.status === "rejected") {
        issues.push(`Check ${index + 1} failed: ${check.reason}`);
        critical++;
      } else {
        issues.push(...check.value.issues);
        critical += check.value.critical;
        warnings += check.value.warnings;
      }
    });
    
    const duration = Date.now() - startTime;
    const status = critical > 0 ? "critical" : warnings > 0 ? "warning" : "healthy";
    
    const result: MonitoringResult = {
      status,
      timestamp: new Date().toISOString(),
      summary: {
        total: critical + warnings,
        healthy: critical + warnings === 0 ? 1 : 0,
        warnings,
        critical
      },
      details: [`Duration: ${duration}ms`, `Checked: flux-system, git repos, kustomizations, helm releases`],
      issues
    };
    
    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      printFluxStatus(result);
    }
    
    Deno.exit(status === "healthy" ? 0 : status === "warning" ? 1 : 2);
    
  } catch (error) {
    if (options.json) {
      const errorResult: MonitoringResult = {
        status: "error",
        timestamp: new Date().toISOString(),
        summary: { total: 0, healthy: 0, warnings: 0, critical: 0 },
        details: [`Error: ${error instanceof Error ? error.message : String(error)}`],
        issues: [`Flux status check failed: ${error instanceof Error ? error.message : String(error)}`]
      };
      console.log(JSON.stringify(errorResult, null, 2));
    } else {
      console.error(colors.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
    }
    Deno.exit(3);
  }
}

/**
 * Watch Flux deployments with optimized polling
 */
export async function runFluxWatch(options: { interval: number }): Promise<void> {
  console.log(colors.bold("Watching Flux deployments (Ctrl+C to stop)..."));
  console.log("=".repeat(50));
  
  const interval = Math.max(options.interval, 1) * 1000; // Convert to ms, minimum 1s
  
  try {
    while (true) {
      const timestamp = new Date().toISOString();
      console.log(`\n${colors.dim(timestamp)}`);
      
      // Quick status check
      await runFluxStatus({ json: false });
      
      // Wait for next interval
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  } catch (error) {
    if (error instanceof Error && error.name === "Interrupted") {
      console.log(colors.yellow("\nWatch stopped by user"));
      Deno.exit(0);
    } else {
      console.error(colors.red(`Watch error: ${error instanceof Error ? error.message : String(error)}`));
      Deno.exit(3);
    }
  }
}

/**
 * Check flux-system namespace health
 */
async function checkFluxSystem(): Promise<{ issues: string[]; critical: number; warnings: number }> {
  const command = new Deno.Command("kubectl", {
    args: ["get", "pods", "-n", "flux-system", "-o", "json", "--request-timeout=5s"],
    stdout: "piped",
    stderr: "piped"
  });
  
  const result = await command.output();
  const issues: string[] = [];
  let critical = 0;
  let warnings = 0;
  
  if (!result.success) {
    issues.push("Cannot access flux-system namespace");
    critical++;
    return { issues, critical, warnings };
  }
  
  const data = JSON.parse(new TextDecoder().decode(result.stdout));
  
  for (const pod of data.items || []) {
    const phase = pod.status?.phase;
    const name = pod.metadata?.name || "unknown";
    
    if (phase === "Failed" || phase === "Unknown") {
      issues.push(`Flux pod ${name} is ${phase}`);
      critical++;
    } else if (phase === "Pending") {
      issues.push(`Flux pod ${name} is pending`);
      warnings++;
    }
  }
  
  return { issues, critical, warnings };
}

/**
 * Check GitRepository resources
 */
async function checkGitRepositories(namespace?: string): Promise<{ issues: string[]; critical: number; warnings: number }> {
  const namespaceArg = namespace ? `-n ${namespace}` : "-A";
  const command = new Deno.Command("kubectl", {
    args: ["get", "gitrepository", ...namespaceArg.split(" "), "-o", "json", "--request-timeout=5s"],
    stdout: "piped",
    stderr: "piped"
  });
  
  const result = await command.output();
  const issues: string[] = [];
  let critical = 0;
  let warnings = 0;
  
  if (!result.success) {
    return { issues, critical, warnings }; // GitRepository CRD might not exist
  }
  
  const data = JSON.parse(new TextDecoder().decode(result.stdout));
  
  for (const repo of data.items || []) {
    const conditions = repo.status?.conditions || [];
    const readyCondition = conditions.find((c: any) => c.type === "Ready");
    const name = `${repo.metadata?.namespace || "unknown"}/${repo.metadata?.name || "unknown"}`;
    
    if (!readyCondition || readyCondition.status !== "True") {
      issues.push(`GitRepository ${name} not ready`);
      critical++;
    }
  }
  
  return { issues, critical, warnings };
}

/**
 * Check Kustomization resources
 */
async function checkKustomizations(namespace?: string): Promise<{ issues: string[]; critical: number; warnings: number }> {
  const namespaceArg = namespace ? `-n ${namespace}` : "-A";
  const command = new Deno.Command("kubectl", {
    args: ["get", "kustomization", ...namespaceArg.split(" "), "-o", "json", "--request-timeout=5s"],
    stdout: "piped",
    stderr: "piped"
  });
  
  const result = await command.output();
  const issues: string[] = [];
  let critical = 0;
  let warnings = 0;
  
  if (!result.success) {
    return { issues, critical, warnings };
  }
  
  const data = JSON.parse(new TextDecoder().decode(result.stdout));
  
  for (const kustomization of data.items || []) {
    const conditions = kustomization.status?.conditions || [];
    const readyCondition = conditions.find((c: any) => c.type === "Ready");
    const name = `${kustomization.metadata?.namespace || "unknown"}/${kustomization.metadata?.name || "unknown"}`;
    
    if (!readyCondition || readyCondition.status !== "True") {
      const reason = readyCondition?.reason || "Unknown";
      issues.push(`Kustomization ${name} not ready: ${reason}`);
      critical++;
    }
  }
  
  return { issues, critical, warnings };
}

/**
 * Check HelmRelease resources
 */
async function checkHelmReleases(namespace?: string): Promise<{ issues: string[]; critical: number; warnings: number }> {
  const namespaceArg = namespace ? `-n ${namespace}` : "-A";
  const command = new Deno.Command("kubectl", {
    args: ["get", "helmrelease", ...namespaceArg.split(" "), "-o", "json", "--request-timeout=5s"],
    stdout: "piped",
    stderr: "piped"
  });
  
  const result = await command.output();
  const issues: string[] = [];
  let critical = 0;
  let warnings = 0;
  
  if (!result.success) {
    return { issues, critical, warnings };
  }
  
  const data = JSON.parse(new TextDecoder().decode(result.stdout));
  
  for (const release of data.items || []) {
    const conditions = release.status?.conditions || [];
    const readyCondition = conditions.find((c: any) => c.type === "Ready");
    const name = `${release.metadata?.namespace || "unknown"}/${release.metadata?.name || "unknown"}`;
    
    if (!readyCondition || readyCondition.status !== "True") {
      const reason = readyCondition?.reason || "Unknown";
      issues.push(`HelmRelease ${name} not ready: ${reason}`);
      critical++;
    }
  }
  
  return { issues, critical, warnings };
}

/**
 * Print flux status in human readable format
 */
function printFluxStatus(result: MonitoringResult): void {
  console.log(colors.bold("Flux Status Check"));
  console.log("=".repeat(20));
  console.log();
  
  const statusIcon = result.status === "healthy" ? colors.green("✓") :
                     result.status === "warning" ? colors.yellow("⚠") : colors.red("✗");
  
  console.log(`${statusIcon} Overall Status: ${result.status.toUpperCase()}`);
  console.log(`📊 Summary: ${result.summary.healthy} healthy, ${result.summary.warnings} warnings, ${result.summary.critical} critical`);
  console.log();
  
  if (result.issues.length > 0) {
    console.log(colors.bold("Issues:"));
    for (const issue of result.issues) {
      console.log(`  ${colors.yellow("⚠")} ${issue}`);
    }
  } else {
    console.log(colors.green("✓ All Flux components are healthy"));
  }
}