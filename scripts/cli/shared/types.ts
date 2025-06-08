// Import and re-export existing monitoring types
import type { MonitoringResult as BaseMonitoringResult } from "../../types/monitoring.ts";
import { ExitCode as BaseExitCode } from "../../types/monitoring.ts";

export type MonitoringResult = BaseMonitoringResult;
export const ExitCode = BaseExitCode;

// CLI-specific types
export interface DomainCheck {
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  result?: MonitoringResult;
  duration?: number;
  error?: string;
}

export interface QuickCheckResult {
  status: "healthy" | "warning" | "critical" | "error";
  timestamp: string;
  totalDuration: number;
  domains: DomainCheck[];
  summary: {
    total: number;
    healthy: number;
    warnings: number;
    critical: number;
  };
  issues: string[];
}

export interface CLIOptions {
  json?: boolean;
  verbose?: boolean;
  quick?: boolean;
}