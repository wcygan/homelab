#!/usr/bin/env -S deno run --allow-read --allow-env

import { parse } from "https://deno.land/std@0.224.0/yaml/mod.ts";
import { walk } from "https://deno.land/std@0.224.0/fs/walk.ts";
import { relative } from "https://deno.land/std@0.224.0/path/mod.ts";

interface ResourceConfig {
  requests?: {
    cpu?: string;
    memory?: string;
  };
  limits?: {
    cpu?: string;
    memory?: string;
  };
}

interface HelmReleaseInfo {
  path: string;
  name: string;
  namespace: string;
  hasResources: boolean;
  resourceConfig?: ResourceConfig;
  containers?: {
    name: string;
    resources?: ResourceConfig;
  }[];
}

async function analyzeHelmRelease(filePath: string): Promise<HelmReleaseInfo | null> {
  try {
    const content = await Deno.readTextFile(filePath);
    const docs = content.split("---").filter(d => d.trim());
    
    for (const doc of docs) {
      const yaml = parse(doc) as any;
      if (yaml?.kind === "HelmRelease") {
        const name = yaml.metadata?.name || "unknown";
        const namespace = yaml.metadata?.namespace || "unknown";
        const values = yaml.spec?.values || {};
        
        // Check for resources in various common locations
        let hasResources = false;
        let resourceConfig: ResourceConfig | undefined;
        const containers: HelmReleaseInfo["containers"] = [];
        
        // Direct resources field
        if (values.resources) {
          hasResources = true;
          resourceConfig = values.resources;
        }
        
        // Check in specific component configurations
        const componentsToCheck = [
          "controller", "webhook", "cainjector", // cert-manager
          "prometheus", "grafana", "alertmanager", // monitoring
          "server", "agent", "operator", // generic
          "ingester", "distributor", "queryFrontend", // loki
          "app", "api", "worker", // generic app patterns
          "webserver", "scheduler", "workers", "triggerer", // airflow
          "singleBinary", "gateway", "connect", // loki, 1password
          "dags", // airflow dags
        ];
        
        for (const component of componentsToCheck) {
          if (values[component]?.resources) {
            hasResources = true;
            containers.push({
              name: component,
              resources: values[component].resources
            });
          }
        }
        
        // Check nested structures like prometheus.prometheusSpec.resources
        if (values.prometheus?.prometheusSpec?.resources) {
          hasResources = true;
          containers.push({
            name: "prometheus",
            resources: values.prometheus.prometheusSpec.resources
          });
        }
        
        if (values.grafana?.resources) {
          hasResources = true;
          containers.push({
            name: "grafana",
            resources: values.grafana.resources
          });
        }
        
        // Check gitSync resources (for DAG sync in Airflow)
        if (values.dags?.gitSync?.resources) {
          hasResources = true;
          containers.push({
            name: "gitSync",
            resources: values.dags.gitSync.resources
          });
        }
        
        // If no resources found in spec.values, check for valuesFrom references
        if (!hasResources && yaml.spec?.valuesFrom) {
          // Check if there's a values.yaml file in the same directory or subdirectories
          const dir = filePath.substring(0, filePath.lastIndexOf('/'));
          try {
            // Check common locations for values files
            const valuePaths = [
              `${dir}/values.yaml`,
              `${dir}/helm/values.yaml`,
              `${dir}/../values.yaml`
            ];
            
            for (const valuePath of valuePaths) {
              try {
                const valuesContent = await Deno.readTextFile(valuePath);
                const valuesYaml = parse(valuesContent) as any;
                
                // Check for resources in the values file
                if (valuesYaml?.resources) {
                  hasResources = true;
                  resourceConfig = valuesYaml.resources;
                }
                
                // Check component-specific resources
                for (const component of componentsToCheck) {
                  if (valuesYaml[component]?.resources) {
                    hasResources = true;
                    containers.push({
                      name: component,
                      resources: valuesYaml[component].resources
                    });
                  }
                }
                
                if (hasResources) break; // Found resources, no need to check other files
              } catch {
                // File doesn't exist, continue
              }
            }
          } catch {
            // Directory operations failed, continue
          }
        }
        
        return {
          path: relative(Deno.cwd(), filePath),
          name,
          namespace,
          hasResources,
          resourceConfig,
          containers: containers.length > 0 ? containers : undefined
        };
      }
    }
  } catch (error) {
    console.error(`Error analyzing ${filePath}: ${error.message}`);
  }
  return null;
}

async function main() {
  const helmReleases: HelmReleaseInfo[] = [];
  
  // Find all helmrelease.yaml files
  for await (const entry of walk("kubernetes/apps", {
    includeDirs: false,
    match: [/helmrelease\.yaml$/]
  })) {
    const info = await analyzeHelmRelease(entry.path);
    if (info) {
      helmReleases.push(info);
    }
  }
  
  // Categorize releases
  const criticalNamespaces = ["kube-system", "flux-system", "monitoring", "storage", "external-secrets", "cert-manager"];
  const coreNamespaces = ["network", "cnpg-system", "system-health"];
  
  const critical = helmReleases.filter(r => criticalNamespaces.includes(r.namespace));
  const core = helmReleases.filter(r => coreNamespaces.includes(r.namespace));
  const standard = helmReleases.filter(r => !criticalNamespaces.includes(r.namespace) && !coreNamespaces.includes(r.namespace));
  
  // Memory-intensive apps
  const memoryIntensive = ["prometheus", "grafana", "loki", "hive-metastore", "airflow", "alloy"];
  
  console.log("=== Resource Limits Analysis ===\n");
  
  console.log("## Critical Services Without Resource Limits:");
  const criticalWithoutLimits = critical.filter(r => !r.hasResources);
  if (criticalWithoutLimits.length === 0) {
    console.log("✅ All critical services have resource limits defined!");
  } else {
    criticalWithoutLimits.forEach(r => {
      const isMemoryIntensive = memoryIntensive.some(app => r.name.includes(app));
      console.log(`❌ ${r.namespace}/${r.name} ${isMemoryIntensive ? "(⚠️  Memory-intensive)" : ""}`);
      console.log(`   Path: ${r.path}`);
    });
  }
  
  console.log("\n## Core Services Without Resource Limits:");
  const coreWithoutLimits = core.filter(r => !r.hasResources);
  if (coreWithoutLimits.length === 0) {
    console.log("✅ All core services have resource limits defined!");
  } else {
    coreWithoutLimits.forEach(r => {
      console.log(`⚠️  ${r.namespace}/${r.name}`);
      console.log(`   Path: ${r.path}`);
    });
  }
  
  console.log("\n## Standard Apps Without Resource Limits:");
  const standardWithoutLimits = standard.filter(r => !r.hasResources);
  if (standardWithoutLimits.length === 0) {
    console.log("✅ All standard apps have resource limits defined!");
  } else {
    standardWithoutLimits.forEach(r => {
      const isMemoryIntensive = memoryIntensive.some(app => r.name.includes(app));
      console.log(`⚡ ${r.namespace}/${r.name} ${isMemoryIntensive ? "(⚠️  Memory-intensive)" : ""}`);
      console.log(`   Path: ${r.path}`);
    });
  }
  
  console.log("\n## Existing Resource Configurations (Reference):");
  const withResources = helmReleases.filter(r => r.hasResources);
  withResources.forEach(r => {
    console.log(`\n### ${r.namespace}/${r.name}`);
    console.log(`Path: ${r.path}`);
    
    if (r.resourceConfig) {
      console.log("Resources:");
      if (r.resourceConfig.requests) {
        console.log("  Requests:");
        if (r.resourceConfig.requests.cpu) console.log(`    CPU: ${r.resourceConfig.requests.cpu}`);
        if (r.resourceConfig.requests.memory) console.log(`    Memory: ${r.resourceConfig.requests.memory}`);
      }
      if (r.resourceConfig.limits) {
        console.log("  Limits:");
        if (r.resourceConfig.limits.cpu) console.log(`    CPU: ${r.resourceConfig.limits.cpu}`);
        if (r.resourceConfig.limits.memory) console.log(`    Memory: ${r.resourceConfig.limits.memory}`);
      }
    }
    
    if (r.containers) {
      r.containers.forEach(c => {
        console.log(`Component: ${c.name}`);
        if (c.resources?.requests) {
          console.log("  Requests:");
          if (c.resources.requests.cpu) console.log(`    CPU: ${c.resources.requests.cpu}`);
          if (c.resources.requests.memory) console.log(`    Memory: ${c.resources.requests.memory}`);
        }
        if (c.resources?.limits) {
          console.log("  Limits:");
          if (c.resources.limits.cpu) console.log(`    CPU: ${c.resources.limits.cpu}`);
          if (c.resources.limits.memory) console.log(`    Memory: ${c.resources.limits.memory}`);
        }
      });
    }
  });
  
  // Summary
  console.log("\n## Summary:");
  console.log(`Total HelmReleases analyzed: ${helmReleases.length}`);
  console.log(`With resource limits: ${withResources.length}`);
  console.log(`Without resource limits: ${helmReleases.length - withResources.length}`);
  console.log(`\nMemory-intensive apps identified: ${memoryIntensive.join(", ")}`);
}

if (import.meta.main) {
  await main();
}