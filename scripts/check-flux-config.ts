#!/usr/bin/env -S deno run --allow-read

import { walk } from "@std/fs";
import { parseArgs } from "@std/cli/parse-args";
import { MonitoringResult, ExitCode } from "./types/monitoring.ts";

interface IntervalCount {
  interval: string;
  count: number;
}

interface ConfigIssue {
  type: string;
  file: string;
  message: string;
  severity: "warning" | "critical";
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

class FluxConfigChecker {
  private issues: ConfigIssue[] = [];
  private jsonOutput: boolean;

  constructor(jsonOutput = false) {
    this.jsonOutput = jsonOutput;
  }

  private log(message: string): void {
    if (!this.jsonOutput) {
      console.log(message);
    }
  }

  async checkInfiniteRetries(): Promise<void> {
    this.log(
      "1. Checking for infinite retries (retries: -1) in HelmReleases...",
    );
    this.log(
      "   These should be changed to finite retries (e.g., retries: 3)",
    );
    this.log("");

    let foundInfiniteRetries = false;

    for await (
      const entry of walk("kubernetes/apps", {
        exts: [".yaml"],
        includeDirs: false,
      })
    ) {
      if (entry.name === "helmrelease.yaml") {
        try {
          const content = await Deno.readTextFile(entry.path);
          if (content.includes("retries: -1")) {
            this.log(`   ⚠ Infinite retries found: ${entry.path}`);
            this.issues.push({
              type: "infinite-retries",
              file: entry.path,
              message: "HelmRelease has infinite retries (-1)",
              severity: "warning",
            });
            foundInfiniteRetries = true;
          }
        } catch (error) {
          this.log(
            `   Error reading ${entry.path}: ${getErrorMessage(error)}`,
          );
        }
      }
    }

    if (!foundInfiniteRetries) {
      this.log("   ✓ No infinite retries found");
    }
    this.log("");
  }

  async checkMissingHealthChecks(): Promise<void> {
    this.log("2. Checking for Kustomizations without health checks...");
    this.log("   Consider adding health checks for critical services");
    this.log("");

    for await (
      const entry of walk("kubernetes/apps", {
        exts: [".yaml"],
        includeDirs: false,
      })
    ) {
      if (entry.name === "ks.yaml") {
        try {
          const content = await Deno.readTextFile(entry.path);
          if (!content.includes("healthChecks:")) {
            this.log(`   ⚠ Missing health checks: ${entry.path}`);
            this.issues.push({
              type: "missing-health-checks",
              file: entry.path,
              message: "Kustomization missing health checks",
              severity: "warning",
            });
          }
        } catch (error) {
          this.log(
            `   Error reading ${entry.path}: ${getErrorMessage(error)}`,
          );
        }
      }
    }
    this.log("");
  }

  async checkMissingWaitConfig(): Promise<void> {
    this.log(
      "3. Checking for Kustomizations without explicit wait configuration...",
    );
    this.log("   Infrastructure and dependencies should have wait: true");
    this.log("");

    for await (
      const entry of walk("kubernetes/apps", {
        exts: [".yaml"],
        includeDirs: false,
      })
    ) {
      if (entry.name === "ks.yaml") {
        try {
          const content = await Deno.readTextFile(entry.path);
          if (!content.includes("wait:")) {
            this.log(`   ⚠ Missing wait config: ${entry.path}`);
            this.issues.push({
              type: "missing-wait-config",
              file: entry.path,
              message: "Kustomization missing wait configuration",
              severity: "warning",
            });
          }
        } catch (error) {
          this.log(
            `   Error reading ${entry.path}: ${getErrorMessage(error)}`,
          );
        }
      }
    }
    this.log("");
  }

  async checkMissingTimeout(): Promise<void> {
    this.log(
      "4. Checking for Kustomizations without timeout configuration...",
    );
    this.log("   Large deployments need appropriate timeouts");
    this.log("");

    for await (
      const entry of walk("kubernetes/apps", {
        exts: [".yaml"],
        includeDirs: false,
      })
    ) {
      if (entry.name === "ks.yaml") {
        try {
          const content = await Deno.readTextFile(entry.path);
          if (!content.includes("timeout:")) {
            this.log(`   ⚠ Missing timeout: ${entry.path}`);
            this.issues.push({
              type: "missing-timeout",
              file: entry.path,
              message: "Kustomization missing timeout configuration",
              severity: "warning",
            });
          }
        } catch (error) {
          this.log(
            `   Error reading ${entry.path}: ${getErrorMessage(error)}`,
          );
        }
      }
    }
    this.log("");
  }

  async checkMissingNamespaceInSourceRef(): Promise<void> {
    this.log("5. Checking for sourceRef without namespace specification...");
    this.log("   All sourceRef should include 'namespace: flux-system'");
    this.log("");

    for await (
      const entry of walk("kubernetes/apps", {
        exts: [".yaml"],
        includeDirs: false,
      })
    ) {
      try {
        const content = await Deno.readTextFile(entry.path);
        if (content.includes("sourceRef:")) {
          // Split content into lines and find sourceRef sections
          const lines = content.split("\n");
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes("sourceRef:")) {
              // Check the next 3 lines for namespace
              let hasNamespace = false;
              for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
                if (lines[j].includes("namespace:")) {
                  hasNamespace = true;
                  break;
                }
              }
              if (!hasNamespace) {
                this.log(`   ⚠ Missing namespace in sourceRef: ${entry.path}`);
                this.issues.push({
                  type: "missing-sourceref-namespace",
                  file: entry.path,
                  message: "SourceRef missing namespace specification",
                  severity: "critical",
                });
                break; // Only report once per file
              }
            }
          }
        }
      } catch (error) {
        this.log(
          `   Error reading ${entry.path}: ${getErrorMessage(error)}`,
        );
      }
    }
    this.log("");
  }

  async checkMissingResourceConstraints(): Promise<void> {
    this.log("6. Checking for HelmReleases without resource constraints...");
    this.log("   All deployments should specify resource requests/limits");
    this.log("");

    for await (
      const entry of walk("kubernetes/apps", {
        exts: [".yaml"],
        includeDirs: false,
      })
    ) {
      if (entry.name === "helmrelease.yaml") {
        try {
          const content = await Deno.readTextFile(entry.path);
          if (!content.includes("resources:")) {
            this.log(`   ⚠ Missing resources: ${entry.path}`);
            this.issues.push({
              type: "missing-resource-constraints",
              file: entry.path,
              message: "HelmRelease missing resource constraints",
              severity: "warning",
            });
          }
        } catch (error) {
          this.log(
            `   Error reading ${entry.path}: ${getErrorMessage(error)}`,
          );
        }
      }
    }
    this.log("");
  }

  async checkIntervalConfigurations(): Promise<void> {
    this.log("7. Analyzing interval configurations...");
    this.log("");

    const intervals = new Map<string, number>();

    for await (
      const entry of walk("kubernetes/apps", {
        exts: [".yaml"],
        includeDirs: false,
      })
    ) {
      if (entry.name === "ks.yaml" || entry.name === "helmrelease.yaml") {
        try {
          const content = await Deno.readTextFile(entry.path);
          const intervalMatch = content.match(/interval:\s*(\d+[hms])/);
          if (intervalMatch) {
            const interval = intervalMatch[1];
            intervals.set(interval, (intervals.get(interval) || 0) + 1);
          }
        } catch (error) {
          // Ignore read errors for this analysis
        }
      }
    }

    const intervalCounts: IntervalCount[] = Array.from(intervals.entries())
      .map(([interval, count]) => ({ interval, count }))
      .sort((a, b) => b.count - a.count);

    this.log("   Interval Distribution:");
    intervalCounts.forEach((count) => {
      this.log(`     ${count.interval}: ${count.count} occurrences`);
    });
    this.log("");
  }

  async run(): Promise<MonitoringResult> {
    this.log("Flux Configuration Health Check");
    this.log("================================\n");

    try {
      await this.checkInfiniteRetries();
      await this.checkMissingHealthChecks();
      await this.checkMissingWaitConfig();
      await this.checkMissingTimeout();
      await this.checkMissingNamespaceInSourceRef();
      await this.checkMissingResourceConstraints();
      await this.checkIntervalConfigurations();

      if (!this.jsonOutput) {
        this.log("Summary:");
        this.log("========");
        this.log("Review the findings above and consider:");
        this.log("- Standardizing retry strategies (use finite retries)");
        this.log("- Adding health checks to critical services");
        this.log("- Setting appropriate wait/timeout values");
        this.log("- Ensuring all sourceRef include namespace");
        this.log("- Adding resource constraints to all deployments");
        this.log("- Standardizing interval configurations");
      }

      return this.createMonitoringResult();
    } catch (error) {
      if (!this.jsonOutput) {
        console.error("Error during health check:", getErrorMessage(error));
      }
      return {
        status: "error",
        timestamp: new Date().toISOString(),
        summary: {
          total: 0,
          healthy: 0,
          warnings: 0,
          critical: 0,
        },
        details: [],
        issues: [`Error during health check: ${getErrorMessage(error)}`],
      };
    }
  }

  private createMonitoringResult(): MonitoringResult {
    const critical = this.issues.filter(i => i.severity === "critical").length;
    const warnings = this.issues.filter(i => i.severity === "warning").length;
    const total = critical + warnings;

    const status: MonitoringResult["status"] = 
      critical > 0 ? "critical" :
      warnings > 0 ? "warning" :
      "healthy";

    return {
      status,
      timestamp: new Date().toISOString(),
      summary: {
        total,
        healthy: total === 0 ? 1 : 0,
        warnings,
        critical,
      },
      details: {
        issues: this.issues,
        checksPerformed: [
          "infinite-retries",
          "missing-health-checks",
          "missing-wait-config",
          "missing-timeout",
          "missing-sourceref-namespace",
          "missing-resource-constraints",
          "interval-configurations"
        ]
      },
      issues: this.issues.map(i => `${i.file}: ${i.message}`),
    };
  }
}

function showHelp(): void {
  console.log(`
Flux Configuration Health Check

Usage: deno run --allow-read check-flux-config.ts [options]

Options:
  --json    Output results in JSON format
  --help    Show this help message

This tool checks Flux GitOps configurations for best practices:
- Infinite retries in HelmReleases
- Missing health checks in Kustomizations
- Missing wait configurations
- Missing timeout configurations
- SourceRef without namespace specification
- Missing resource constraints
- Interval configuration analysis
`);
}

async function main() {
  const args = parseArgs(Deno.args, {
    boolean: ["json", "help"],
    default: {
      json: false,
      help: false,
    },
  });

  if (args.help) {
    showHelp();
    Deno.exit(0);
  }

  const checker = new FluxConfigChecker(args.json);
  const result = await checker.run();

  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
  }

  // Exit with appropriate code
  const exitCode = 
    result.status === "healthy" ? ExitCode.SUCCESS :
    result.status === "warning" ? ExitCode.WARNING :
    result.status === "critical" ? ExitCode.CRITICAL :
    ExitCode.ERROR;

  Deno.exit(exitCode);
}

if (import.meta.main) {
  await main();
}