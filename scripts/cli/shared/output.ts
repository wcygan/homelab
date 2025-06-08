import { colors } from "@cliffy/ansi/colors";
import type { QuickCheckResult, DomainCheck } from "./types.ts";
import { formatDuration } from "./utils.ts";

/**
 * Format output for human-readable display
 */
export function formatHumanOutput(result: QuickCheckResult): string {
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
  const statusText = result.status.charAt(0).toUpperCase() + result.status.slice(1);
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
export function formatJsonOutput(result: QuickCheckResult): string {
  return JSON.stringify(result, null, 2);
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