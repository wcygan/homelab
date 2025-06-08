import { executeParallelTasks } from "../../shared/parallel.ts";
import type { ParallelTask } from "../../shared/parallel.ts";
import type { CLIOptions, QuickCheckResult, DomainCheck } from "../../shared/types.ts";
import { colors } from "@cliffy/ansi/colors";
import { fluxQuickCheck } from "./flux.ts";
import { k8sQuickCheck } from "./k8s.ts";
import { storageQuickCheck } from "./storage.ts";
import { networkQuickCheck } from "./network.ts";

/**
 * All task implementations complete
 */

// Utility functions (consolidated from shared/utils.ts and shared/output.ts)

/**
 * Format duration in human-readable format
 */
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Determine overall status from multiple domain results
 */
function aggregateStatus(domains: DomainCheck[]): "healthy" | "warning" | "critical" | "error" {
  let hasError = false;
  let hasCritical = false;
  let hasWarning = false;

  for (const domain of domains) {
    if (domain.status === "failed" || domain.result?.status === "error") {
      hasError = true;
    } else if (domain.result?.status === "critical") {
      hasCritical = true;
    } else if (domain.result?.status === "warning") {
      hasWarning = true;
    }
  }

  if (hasError) return "error";
  if (hasCritical) return "critical";
  if (hasWarning) return "warning";
  return "healthy";
}

/**
 * Create summary statistics from domain results
 */
function createSummary(domains: DomainCheck[]) {
  const summary = {
    total: domains.length,
    healthy: 0,
    warnings: 0,
    critical: 0
  };

  for (const domain of domains) {
    switch (domain.result?.status) {
      case "healthy":
        summary.healthy++;
        break;
      case "warning":
        summary.warnings++;
        break;
      case "critical":
        summary.critical++;
        break;
      default:
        // Failed/error domains don't count as any of the above
        break;
    }
  }

  return summary;
}

/**
 * Collect all issues from domain results
 */
function collectIssues(domains: DomainCheck[]): string[] {
  const issues: string[] = [];
  
  for (const domain of domains) {
    if (domain.error) {
      issues.push(`${domain.name}: ${domain.error}`);
    } else if (domain.result?.issues) {
      issues.push(...domain.result.issues);
    }
  }
  
  return issues;
}

/**
 * Get appropriate status icon
 */
function getStatusIcon(status?: string): string {
  switch (status) {
    case "healthy": return colors.green("✓");
    case "warning": return colors.yellow("⚠");
    case "critical": return colors.red("✗");
    case "error": return colors.red("✗");
    case "failed": return colors.red("✗");
    case "running": return colors.blue("⠋");
    default: return colors.gray("◦");
  }
}

/**
 * Format output for human-readable display
 */
function formatHumanOutput(result: QuickCheckResult): string {
  const lines: string[] = [];
  
  // Header
  lines.push("");
  lines.push(colors.bold("Homelab Quick Health Check"));
  lines.push("=".repeat(26));
  lines.push("");
  
  // Domain results
  for (const domain of result.domains) {
    const icon = getStatusIcon(domain.result?.status || domain.status);
    const duration = domain.duration ? colors.gray(` [${formatDuration(domain.duration)}]`) : "";
    const warnings = domain.result?.summary?.warnings ? 
      colors.yellow(` ${domain.result.summary.warnings} warnings`) : "";
    
    lines.push(`${icon} ${domain.name.padEnd(22)}${duration}${warnings}`);
  }
  
  lines.push("");
  
  // Summary
  lines.push(`${colors.bold("Summary")} (${formatDuration(result.totalDuration)} total):`);
  lines.push(`  ${colors.green("✓")} ${result.summary.healthy} healthy  ` +
    `${colors.yellow("⚠")} ${result.summary.warnings} warning  ` +
    `${colors.red("✗")} ${result.summary.critical} critical`);
  
  // Issues
  if (result.issues.length > 0) {
    lines.push("");
    lines.push(colors.bold("Issues:"));
    for (const issue of result.issues) {
      lines.push(`  ${colors.yellow("⚠")} ${issue}`);
    }
  }
  
  return lines.join("\n");
}

/**
 * Format output as JSON
 */
function formatJsonOutput(result: QuickCheckResult): string {
  return JSON.stringify(result, null, 2);
}

/**
 * Default quick monitor command - runs all domains in parallel
 */
export async function runQuickMonitor(options: CLIOptions = {}): Promise<QuickCheckResult> {
  const startTime = Date.now();
  
  // Define parallel tasks for each domain
  const tasks: ParallelTask[] = [
    {
      id: "flux",
      name: "Flux Configuration",
      task: fluxQuickCheck
    },
    {
      id: "k8s", 
      name: "Kubernetes Health",
      task: k8sQuickCheck
    },
    {
      id: "storage",
      name: "Storage Health", 
      task: storageQuickCheck
    },
    {
      id: "network",
      name: "Network Connectivity",
      task: networkQuickCheck
    }
  ];

  // Execute all checks in parallel (silent mode for JSON output)
  const domainResults = await executeParallelTasks(tasks, false, options.json);
  
  const totalDuration = Date.now() - startTime;
  
  // Aggregate results
  const overallStatus = aggregateStatus(domainResults);
  const summary = createSummary(domainResults);
  const issues = collectIssues(domainResults);
  
  const result: QuickCheckResult = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    totalDuration,
    domains: domainResults,
    summary,
    issues
  };

  return result;
}

/**
 * Print the quick monitor results
 */
export async function printQuickMonitor(options: CLIOptions = {}): Promise<void> {
  const result = await runQuickMonitor(options);
  
  if (options.json) {
    console.log(formatJsonOutput(result));
  } else {
    console.log(formatHumanOutput(result));
  }
  
  // Exit with appropriate code
  const exitCode = result.status === "healthy" ? 0 : 
                   result.status === "warning" ? 1 : 
                   result.status === "critical" ? 2 : 3;
  
  Deno.exit(exitCode);
}