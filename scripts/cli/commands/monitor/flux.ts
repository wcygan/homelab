import { walk } from "@std/fs";
import type { MonitoringResult } from "../../shared/types.ts";

interface FluxIssue {
  file: string;
  message: string;
  severity: "warning" | "critical";
}

/**
 * Quick Flux configuration check - focuses on critical issues only
 * for fast execution in the default monitor command
 */
export async function fluxQuickCheck(): Promise<MonitoringResult> {
  const startTime = Date.now();
  const issues: FluxIssue[] = [];
  
  try {
    // Quick check 1: Critical sourceRef namespace issues
    await checkCriticalSourceRefIssues(issues);
    
    // Quick check 2: Basic file structure validation
    await validateBasicFluxStructure(issues);
    
    const duration = Date.now() - startTime;
    
    // Determine status
    const critical = issues.filter(i => i.severity === "critical").length;
    const warnings = issues.filter(i => i.severity === "warning").length;
    
    const status: MonitoringResult["status"] = 
      critical > 0 ? "critical" :
      warnings > 0 ? "warning" :
      "healthy";
    
    return {
      status,
      timestamp: new Date().toISOString(),
      summary: {
        total: critical + warnings,
        healthy: critical + warnings === 0 ? 1 : 0,
        warnings,
        critical,
      },
      details: [
        `Quick checks: sourceref-namespace, flux-structure`,
        `Duration: ${duration}ms`,
        ...issues.map(i => `${i.severity}: ${i.file} - ${i.message}`)
      ],
      issues: issues.map(i => `${i.file}: ${i.message}`),
    };
    
  } catch (error) {
    return {
      status: "error",
      timestamp: new Date().toISOString(),
      summary: {
        total: 0,
        healthy: 0,
        warnings: 0,
        critical: 0,
      },
      details: [`Error: ${error instanceof Error ? error.message : String(error)}`],
      issues: [`Flux check failed: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Check for missing namespace in sourceRef - most critical Flux issue
 */
async function checkCriticalSourceRefIssues(issues: FluxIssue[]): Promise<void> {
  let checkedFiles = 0;
  
  try {
    for await (
      const entry of walk("kubernetes/apps", {
        exts: [".yaml"],
        includeDirs: false,
        maxDepth: 6, // Limit depth for performance
      })
    ) {
      checkedFiles++;
      
      // Only check key files for speed
      if (!entry.name.includes("helmrelease") && !entry.name.includes("ks.yaml")) {
        continue;
      }
      
      try {
        const content = await Deno.readTextFile(entry.path);
        if (content.includes("sourceRef:")) {
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
                issues.push({
                  file: entry.path.replace("kubernetes/apps/", ""),
                  message: "SourceRef missing namespace specification",
                  severity: "critical",
                });
                break; // Only report once per file
              }
            }
          }
        }
      } catch {
        // Skip files that can't be read
        continue;
      }
      
      // Early exit if we've checked too many files (performance limit)
      if (checkedFiles > 50) {
        break;
      }
    }
  } catch {
    // If walk fails, it's not critical for quick check
  }
}

/**
 * Basic validation that expected Flux directories exist
 */
async function validateBasicFluxStructure(issues: FluxIssue[]): Promise<void> {
  const requiredPaths = [
    "kubernetes/apps",
    "kubernetes/flux",
  ];
  
  for (const path of requiredPaths) {
    try {
      const stat = await Deno.stat(path);
      if (!stat.isDirectory) {
        issues.push({
          file: path,
          message: "Expected Flux directory not found",
          severity: "critical",
        });
      }
    } catch {
      issues.push({
        file: path,
        message: "Expected Flux directory not found",
        severity: "critical",
      });
    }
  }
}