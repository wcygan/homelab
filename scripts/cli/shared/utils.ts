import type { MonitoringResult, QuickCheckResult, DomainCheck } from "./types.ts";

/**
 * Sleep utility for delays
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Determine overall status from multiple domain results
 */
export function aggregateStatus(domains: DomainCheck[]): "healthy" | "warning" | "critical" | "error" {
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
export function createSummary(domains: DomainCheck[]) {
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
export function collectIssues(domains: DomainCheck[]): string[] {
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
 * Get appropriate exit code based on status
 */
export function getExitCode(status: string): number {
  switch (status) {
    case "healthy": return 0;
    case "warning": return 1;
    case "critical": return 2;
    case "error": return 3;
    default: return 3;
  }
}