export interface MonitoringResult {
  status: "healthy" | "warning" | "critical" | "error";
  timestamp: string;
  summary: {
    total: number;
    healthy: number;
    warnings: number;
    critical: number;
  };
  details: any[]; // Script-specific data
  issues: string[]; // Array of human-readable issues
}

export enum ExitCode {
  SUCCESS = 0,       // All checks passed (healthy)
  WARNING = 1,       // Warnings detected (degraded but functional)
  CRITICAL = 2,      // Critical issues detected (requires immediate attention)
  ERROR = 3          // Execution error (script/connectivity failure)
}