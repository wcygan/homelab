import type { CLIOptions, QuickCheckResult } from "../../shared/types.ts";
import { printQuickMonitor } from "./index.ts";
import { colors } from "@cliffy/ansi/colors";

interface ComprehensiveOptions extends CLIOptions {
  quick?: boolean;
  ci?: boolean;
}

/**
 * Comprehensive monitoring across all domains
 */
export async function runComprehensiveMonitor(options: ComprehensiveOptions): Promise<void> {
  try {
    if (options.quick) {
      // Use the existing quick monitor
      await printQuickMonitor(options);
      return;
    }
    
    const startTime = Date.now();
    
    if (!options.json) {
      console.log(colors.bold("Comprehensive Homelab Health Check"));
      console.log("=".repeat(40));
      console.log();
    }
    
    // Run comprehensive checks in parallel for speed
    const checks = await Promise.allSettled([
      runFluxComprehensive(options),
      runK8sComprehensive(options),
      runStorageComprehensive(options),
      runNetworkComprehensive(options),
      runHardwareComprehensive(options)
    ]);
    
    const totalDuration = Date.now() - startTime;
    
    // Aggregate results
    const results = checks.map((check, index) => {
      const domains = ["flux", "k8s", "storage", "network", "hardware"];
      if (check.status === "fulfilled") {
        return { domain: domains[index], ...check.value };
      } else {
        return {
          domain: domains[index],
          status: "error" as const,
          error: check.reason instanceof Error ? check.reason.message : String(check.reason)
        };
      }
    });
    
    const overallStatus = determineOverallStatus(results);
    
    if (options.json) {
      const jsonResult = {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        totalDuration,
        domains: results,
        summary: createSummary(results),
        issues: collectAllIssues(results)
      };
      console.log(JSON.stringify(jsonResult, null, 2));
    } else {
      printComprehensiveResults(results, totalDuration);
    }
    
    // Exit with appropriate code
    const exitCode = 
      overallStatus === "healthy" ? 0 :
      overallStatus === "warning" ? 1 :
      overallStatus === "critical" ? 2 : 3;
    
    Deno.exit(exitCode);
    
  } catch (error) {
    if (options.json) {
      const errorResult = {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error)
      };
      console.log(JSON.stringify(errorResult, null, 2));
    } else {
      console.error(colors.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
    }
    Deno.exit(3);
  }
}

/**
 * Run comprehensive Flux check (existing detailed check)
 */
async function runFluxComprehensive(options: CLIOptions) {
  const { FluxConfigChecker } = await import("../../../check-flux-config-wrapper.ts");
  const checker = new FluxConfigChecker(true); // Always JSON mode for aggregation
  const result = await checker.run();
  return { status: result.status, issues: result.issues, details: result.details };
}

/**
 * Run comprehensive K8s check (existing script)
 */
async function runK8sComprehensive(options: CLIOptions) {
  try {
    // Use existing comprehensive k8s health check
    const command = new Deno.Command("deno", {
      args: ["run", "--allow-all", "scripts/k8s-health-check.ts", "--json"],
      stdout: "piped",
      stderr: "piped"
    });
    
    const result = await command.output();
    
    if (result.success) {
      const output = new TextDecoder().decode(result.stdout);
      const data = JSON.parse(output);
      return { status: data.status, issues: data.issues || [], details: data.details || [] };
    } else {
      return { status: "error", issues: ["K8s health check failed"], details: [] };
    }
  } catch {
    return { status: "error", issues: ["Failed to run K8s health check"], details: [] };
  }
}

/**
 * Run comprehensive storage check (existing script)
 */
async function runStorageComprehensive(options: CLIOptions) {
  try {
    const command = new Deno.Command("deno", {
      args: ["run", "--allow-all", "scripts/storage-health-check.ts", "--json"],
      stdout: "piped",
      stderr: "piped"
    });
    
    const result = await command.output();
    
    if (result.success) {
      const output = new TextDecoder().decode(result.stdout);
      const data = JSON.parse(output);
      return { status: data.status, issues: data.issues || [], details: data.details || [] };
    } else {
      return { status: "error", issues: ["Storage health check failed"], details: [] };
    }
  } catch {
    return { status: "error", issues: ["Failed to run storage health check"], details: [] };
  }
}

/**
 * Run comprehensive network check (existing script)
 */
async function runNetworkComprehensive(options: CLIOptions) {
  try {
    const command = new Deno.Command("deno", {
      args: ["run", "--allow-all", "scripts/network-monitor.ts", "--json"],
      stdout: "piped",
      stderr: "piped"
    });
    
    const result = await command.output();
    
    if (result.success) {
      const output = new TextDecoder().decode(result.stdout);
      const data = JSON.parse(output);
      return { status: data.status, issues: data.issues || [], details: data.details || [] };
    } else {
      return { status: "error", issues: ["Network health check failed"], details: [] };
    }
  } catch {
    return { status: "error", issues: ["Failed to run network health check"], details: [] };
  }
}

/**
 * Run hardware check (simplified - no Talos unless specified)
 */
async function runHardwareComprehensive(options: CLIOptions) {
  try {
    const command = new Deno.Command("deno", {
      args: ["run", "--allow-all", "scripts/hardware-inventory.ts", "--json"],
      stdout: "piped",
      stderr: "piped"
    });
    
    const result = await command.output();
    
    if (result.success) {
      const output = new TextDecoder().decode(result.stdout);
      const data = JSON.parse(output);
      return { status: data.status || "healthy", issues: data.issues || [], details: data.details || [] };
    } else {
      return { status: "warning", issues: ["Hardware inventory not available"], details: [] };
    }
  } catch {
    return { status: "warning", issues: ["Hardware check not available"], details: [] };
  }
}

/**
 * Determine overall status from all domain results
 */
function determineOverallStatus(results: any[]): "healthy" | "warning" | "critical" | "error" {
  let hasError = false;
  let hasCritical = false;
  let hasWarning = false;
  
  for (const result of results) {
    if (result.status === "error") {
      hasError = true;
    } else if (result.status === "critical") {
      hasCritical = true;
    } else if (result.status === "warning") {
      hasWarning = true;
    }
  }
  
  if (hasError) return "error";
  if (hasCritical) return "critical";
  if (hasWarning) return "warning";
  return "healthy";
}

/**
 * Create summary statistics
 */
function createSummary(results: any[]) {
  const summary = {
    total: results.length,
    healthy: 0,
    warnings: 0,
    critical: 0,
    errors: 0
  };
  
  for (const result of results) {
    switch (result.status) {
      case "healthy":
        summary.healthy++;
        break;
      case "warning":
        summary.warnings++;
        break;
      case "critical":
        summary.critical++;
        break;
      case "error":
        summary.errors++;
        break;
    }
  }
  
  return summary;
}

/**
 * Collect all issues from all domains
 */
function collectAllIssues(results: any[]): string[] {
  const allIssues: string[] = [];
  
  for (const result of results) {
    if (result.issues) {
      allIssues.push(...result.issues.map((issue: string) => `${result.domain}: ${issue}`));
    }
    if (result.error) {
      allIssues.push(`${result.domain}: ${result.error}`);
    }
  }
  
  return allIssues;
}

/**
 * Print comprehensive results in human-readable format
 */
function printComprehensiveResults(results: any[], totalDuration: number): void {
  console.log("Domain Results:");
  console.log("-".repeat(20));
  
  for (const result of results) {
    const icon = result.status === "healthy" ? colors.green("✓") :
                 result.status === "warning" ? colors.yellow("⚠") :
                 result.status === "critical" ? colors.red("✗") :
                 colors.red("✗");
    
    const issueCount = result.issues ? result.issues.length : 0;
    const issueText = issueCount > 0 ? colors.gray(` (${issueCount} issues)`) : "";
    
    console.log(`${icon} ${result.domain.padEnd(12)} ${result.status.toUpperCase()}${issueText}`);
  }
  
  console.log();
  console.log(`Total Duration: ${(totalDuration / 1000).toFixed(1)}s`);
  
  // Show issues if any
  const allIssues = collectAllIssues(results);
  if (allIssues.length > 0) {
    console.log();
    console.log(colors.bold("Issues Found:"));
    for (const issue of allIssues.slice(0, 10)) { // Limit to first 10
      console.log(`  ${colors.yellow("⚠")} ${issue}`);
    }
    if (allIssues.length > 10) {
      console.log(`  ${colors.gray(`... and ${allIssues.length - 10} more issues`)}`);
    }
  }
}