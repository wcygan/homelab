#!/usr/bin/env -S deno run --allow-all

import { walk } from "@std/fs";
import { parse } from "@std/yaml";
import { dirname, basename } from "@std/path";

interface KustomizationConfig {
  path: string;
  name: string;
  namespace: string;
  targetNamespace: string;
  interval?: string;
  retryInterval?: string;
  timeout?: string;
  wait?: boolean;
  healthChecks?: any[];
  prune?: boolean;
  dependencies?: string[];
}

interface Analysis {
  criticalInfrastructure: KustomizationConfig[];
  coreServices: KustomizationConfig[];
  standardApplications: KustomizationConfig[];
  issues: string[];
}

// Define critical infrastructure namespaces/apps
const CRITICAL_INFRASTRUCTURE = [
  "flux-system",
  "kube-system",
  "cert-manager",
  "external-secrets",
  "network",
];

// Define core services
const CORE_SERVICES = [
  "storage",
  "monitoring",
  "cnpg-system",
  "database",
];

async function analyzeKustomizations(): Promise<Analysis> {
  const analysis: Analysis = {
    criticalInfrastructure: [],
    coreServices: [],
    standardApplications: [],
    issues: [],
  };

  for await (const entry of walk("kubernetes/apps", {
    exts: [".yaml"],
    match: [/ks\.yaml$/],
  })) {
    const content = await Deno.readTextFile(entry.path);
    
    // Handle multiple documents in one file
    const docs = content.split("---\n").filter(doc => doc.trim());
    
    for (const doc of docs) {
      try {
        const parsed = parse(doc) as any;
        if (!parsed || parsed.kind !== "Kustomization") continue;

        const config: KustomizationConfig = {
          path: entry.path,
          name: parsed.metadata?.name || "unknown",
          namespace: parsed.metadata?.namespace || "flux-system",
          targetNamespace: parsed.spec?.targetNamespace || parsed.metadata?.namespace || "default",
          interval: parsed.spec?.interval,
          retryInterval: parsed.spec?.retryInterval,
          timeout: parsed.spec?.timeout,
          wait: parsed.spec?.wait,
          healthChecks: parsed.spec?.healthChecks,
          prune: parsed.spec?.prune,
          dependencies: parsed.spec?.dependsOn?.map((d: any) => `${d.name}@${d.namespace || "flux-system"}`) || [],
        };

        // Categorize by criticality
        const appNamespace = config.targetNamespace;
        const appName = config.name;

        if (CRITICAL_INFRASTRUCTURE.includes(appNamespace) || 
            ["cilium", "coredns", "metrics-server"].includes(appName)) {
          analysis.criticalInfrastructure.push(config);
        } else if (CORE_SERVICES.includes(appNamespace) ||
                   ["kube-prometheus-stack", "loki", "external-snapshotter"].includes(appName)) {
          analysis.coreServices.push(config);
        } else {
          analysis.standardApplications.push(config);
        }

        // Check for issues
        if (config.retryInterval) {
          analysis.issues.push(`${config.name}: Has deprecated retryInterval field`);
        }

        // Check interval recommendations
        const intervalMinutes = parseInterval(config.interval);
        if (CRITICAL_INFRASTRUCTURE.includes(appNamespace) && intervalMinutes > 5) {
          analysis.issues.push(`${config.name}: Critical infrastructure should use 5m interval (currently ${config.interval})`);
        } else if (CORE_SERVICES.includes(appNamespace) && intervalMinutes > 15) {
          analysis.issues.push(`${config.name}: Core service should use 15m interval (currently ${config.interval})`);
        }

        // Check for missing timeout
        if (!config.timeout) {
          analysis.issues.push(`${config.name}: Missing timeout specification`);
        }

        // Check for missing health checks on critical services
        if ((CRITICAL_INFRASTRUCTURE.includes(appNamespace) || CORE_SERVICES.includes(appNamespace)) && 
            !config.healthChecks && config.wait !== false) {
          analysis.issues.push(`${config.name}: Critical/core service missing health checks`);
        }
      } catch (e) {
        console.error(`Error parsing ${entry.path}:`, e);
      }
    }
  }

  return analysis;
}

function parseInterval(interval?: string): number {
  if (!interval) return Infinity;
  
  const match = interval.match(/(\d+)([mh])/);
  if (!match) return Infinity;
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  return unit === "h" ? value * 60 : value;
}

function formatReport(analysis: Analysis): void {
  console.log("# Flux Kustomization Analysis Report\n");

  // Summary
  console.log("## Summary");
  console.log(`- Critical Infrastructure: ${analysis.criticalInfrastructure.length} kustomizations`);
  console.log(`- Core Services: ${analysis.coreServices.length} kustomizations`);
  console.log(`- Standard Applications: ${analysis.standardApplications.length} kustomizations`);
  console.log(`- Issues Found: ${analysis.issues.length}\n`);

  // Critical Infrastructure
  console.log("## Critical Infrastructure (Should use 5m intervals)");
  console.log("| Name | Namespace | Interval | Timeout | Health Checks | Issues |");
  console.log("|------|-----------|----------|---------|---------------|--------|");
  for (const config of analysis.criticalInfrastructure) {
    const issues = getConfigIssues(config, "critical");
    console.log(`| ${config.name} | ${config.targetNamespace} | ${config.interval || "none"} | ${config.timeout || "none"} | ${config.healthChecks ? "✓" : "✗"} | ${issues.join(", ") || "none"} |`);
  }

  // Core Services
  console.log("\n## Core Services (Should use 15m intervals)");
  console.log("| Name | Namespace | Interval | Timeout | Health Checks | Issues |");
  console.log("|------|-----------|----------|---------|---------------|--------|");
  for (const config of analysis.coreServices) {
    const issues = getConfigIssues(config, "core");
    console.log(`| ${config.name} | ${config.targetNamespace} | ${config.interval || "none"} | ${config.timeout || "none"} | ${config.healthChecks ? "✓" : "✗"} | ${issues.join(", ") || "none"} |`);
  }

  // Standard Applications
  console.log("\n## Standard Applications (Should use 30m-1h intervals)");
  console.log("| Name | Namespace | Interval | Timeout | Health Checks | Wait |");
  console.log("|------|-----------|----------|---------|---------------|------|");
  for (const config of analysis.standardApplications) {
    console.log(`| ${config.name} | ${config.targetNamespace} | ${config.interval || "none"} | ${config.timeout || "none"} | ${config.healthChecks ? "✓" : "✗"} | ${config.wait !== false ? "✓" : "✗"} |`);
  }

  // Issues
  if (analysis.issues.length > 0) {
    console.log("\n## Issues to Fix");
    for (const issue of analysis.issues) {
      console.log(`- ${issue}`);
    }
  }

  // Patterns Found
  console.log("\n## Patterns Found");
  
  // Check for retryInterval usage
  const withRetryInterval = [...analysis.criticalInfrastructure, ...analysis.coreServices, ...analysis.standardApplications]
    .filter(c => c.retryInterval);
  if (withRetryInterval.length > 0) {
    console.log(`\n### Deprecated retryInterval Usage (${withRetryInterval.length} instances)`);
    for (const config of withRetryInterval) {
      console.log(`- ${config.name}: ${config.retryInterval}`);
    }
  }

  // Check wait: false usage
  const withWaitFalse = [...analysis.criticalInfrastructure, ...analysis.coreServices, ...analysis.standardApplications]
    .filter(c => c.wait === false);
  if (withWaitFalse.length > 0) {
    console.log(`\n### Resources with wait: false (${withWaitFalse.length} instances)`);
    for (const config of withWaitFalse) {
      console.log(`- ${config.name} in ${config.targetNamespace}`);
    }
  }
}

function getConfigIssues(config: KustomizationConfig, type: "critical" | "core" | "standard"): string[] {
  const issues: string[] = [];
  
  if (config.retryInterval) {
    issues.push("deprecated retryInterval");
  }
  
  const intervalMinutes = parseInterval(config.interval);
  if (type === "critical" && intervalMinutes > 5) {
    issues.push("interval too high");
  } else if (type === "core" && intervalMinutes > 15) {
    issues.push("interval too high");
  }
  
  if (!config.timeout) {
    issues.push("missing timeout");
  }
  
  if ((type === "critical" || type === "core") && !config.healthChecks && config.wait !== false) {
    issues.push("missing health checks");
  }
  
  return issues;
}

// Main execution
if (import.meta.main) {
  const analysis = await analyzeKustomizations();
  formatReport(analysis);
}