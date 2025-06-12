#!/usr/bin/env -S deno run --allow-all

import { parse, parseAll, stringify } from "jsr:@std/yaml@1.0.0";
import { walk } from "jsr:@std/fs@1.0.0";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";

interface HelmRelease {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
  };
  spec: {
    chart?: any;
    values?: any;
    [key: string]: any;
  };
}

// Resource profiles based on service type
const RESOURCE_PROFILES = {
  minimal: {
    resources: {
      requests: {
        cpu: "10m",
        memory: "16Mi"
      },
      limits: {
        cpu: "50m",
        memory: "64Mi"
      }
    }
  },
  lightweight: {
    resources: {
      requests: {
        cpu: "50m",
        memory: "64Mi"
      },
      limits: {
        cpu: "100m",
        memory: "128Mi"
      }
    }
  },
  standard: {
    resources: {
      requests: {
        cpu: "100m",
        memory: "128Mi"
      },
      limits: {
        cpu: "200m",
        memory: "256Mi"
      }
    }
  },
  gitops: {
    resources: {
      requests: {
        cpu: "100m",
        memory: "256Mi"
      },
      limits: {
        cpu: "500m",
        memory: "512Mi"
      }
    }
  },
  storage: {
    resources: {
      requests: {
        cpu: "500m",
        memory: "1Gi"
      },
      limits: {
        cpu: "1000m",
        memory: "2Gi"
      }
    }
  }
};

// Map of services to resource profiles
const SERVICE_PROFILES: Record<string, string> = {
  "flux-instance": "gitops",
  "cloudflared": "standard",
  "echo": "minimal",
  "echo-2": "minimal",
  "rook-ceph-cluster": "storage",
  "vpa": "lightweight",
  "reloader": "lightweight",
  "spegel": "standard"
};

// Components that need resources in Flux instance
const FLUX_COMPONENTS = [
  "source-controller",
  "kustomize-controller",
  "helm-controller",
  "notification-controller"
];

function addResourcesFluxInstance(values: any): boolean {
  let changed = false;
  
  for (const component of FLUX_COMPONENTS) {
    if (!values[component]) {
      values[component] = {};
    }
    
    if (!values[component].resources) {
      values[component].resources = RESOURCE_PROFILES.gitops.resources;
      changed = true;
    }
  }
  
  return changed;
}

function addResourcesRookCephCluster(values: any): boolean {
  let changed = false;
  
  // Toolbox resources
  if (values.toolbox && typeof values.toolbox === 'object' && !values.toolbox.resources) {
    values.toolbox.resources = RESOURCE_PROFILES.lightweight.resources;
    changed = true;
  }
  
  // Ceph cluster spec resources
  if (!values.cephClusterSpec) {
    values.cephClusterSpec = {};
  }
  
  if (!values.cephClusterSpec.resources) {
    values.cephClusterSpec.resources = {
      mgr: RESOURCE_PROFILES.standard.resources,
      mon: RESOURCE_PROFILES.standard.resources,
      osd: RESOURCE_PROFILES.storage.resources,
      cleanup: RESOURCE_PROFILES.minimal.resources
    };
    changed = true;
  }
  
  return changed;
}

async function processHelmRelease(filePath: string, apply: boolean): Promise<boolean> {
  try {
    const content = await Deno.readTextFile(filePath);
    
    // Handle multi-document YAML files
    let documents: any[];
    try {
      documents = parseAll(content);
    } catch {
      // If parseAll fails, try single document
      documents = [parse(content)];
    }
    
    // Find the HelmRelease document
    const helmReleaseIndex = documents.findIndex(doc => doc?.kind === "HelmRelease");
    if (helmReleaseIndex === -1) {
      return false;
    }
    
    const helmRelease = documents[helmReleaseIndex] as HelmRelease;
    
    const releaseName = helmRelease.metadata.name;
    const profile = SERVICE_PROFILES[releaseName];
    
    if (!profile) {
      return false;
    }
    
    if (!helmRelease.spec.values) {
      helmRelease.spec.values = {};
    }
    
    let hasChanges = false;
    const changes: string[] = [];
    
    // Special handling for different services
    if (releaseName === "flux-instance") {
      hasChanges = addResourcesFluxInstance(helmRelease.spec.values);
      if (hasChanges) {
        changes.push(`Added resources to Flux components: ${FLUX_COMPONENTS.join(", ")}`);
      }
    } else if (releaseName === "rook-ceph-cluster") {
      hasChanges = addResourcesRookCephCluster(helmRelease.spec.values);
      if (hasChanges) {
        changes.push("Added resources to Ceph components (mgr, mon, osd, cleanup, toolbox)");
      }
    } else {
      // Standard services
      if (!helmRelease.spec.values.resources) {
        helmRelease.spec.values.resources = RESOURCE_PROFILES[profile].resources;
        hasChanges = true;
        changes.push(`Added ${profile} resource profile`);
      }
    }
    
    if (hasChanges) {
      console.log(colors.cyan(`\n📋 ${filePath}`));
      console.log(colors.gray(`   Service: ${releaseName}`));
      console.log(colors.gray(`   Profile: ${profile}`));
      changes.forEach(change => console.log(colors.yellow(`   ✓ ${change}`)));
      
      if (apply) {
        // Update the HelmRelease in the documents array
        documents[helmReleaseIndex] = helmRelease;
        
        // Serialize all documents back
        const updatedYaml = documents
          .map(doc => stringify(doc, {
            lineWidth: 120,
            noRefs: true,
            sortKeys: false,
          }))
          .join("---\n");
        
        await Deno.writeTextFile(filePath, updatedYaml);
        console.log(colors.green("   ✅ Changes applied"));
      }
    }
    
    return hasChanges;
  } catch (error) {
    console.error(colors.red(`Error processing ${filePath}: ${error.message}`));
    return false;
  }
}

async function main() {
  const args = Deno.args;
  const apply = args.includes("--apply");
  const dryRun = !apply;
  
  console.log(colors.bold.blue("🔧 Resource Limits Configuration Tool\n"));
  
  if (dryRun) {
    console.log(colors.yellow("🔍 Running in DRY RUN mode. Use --apply to make changes.\n"));
  } else {
    console.log(colors.yellow("⚠️  Running in APPLY mode. Changes will be written to files.\n"));
  }
  
  let totalFiles = 0;
  let modifiedFiles = 0;
  
  // Services that need resources
  const targetServices = Object.keys(SERVICE_PROFILES);
  const helmReleasePaths: string[] = [];
  
  // Find HelmRelease files for target services
  for await (const entry of walk("kubernetes/apps", {
    includeFiles: true,
    includeDirs: false,
    match: [/helmrelease\.yaml$/],
  })) {
    try {
      const content = await Deno.readTextFile(entry.path);
      
      // Handle multi-document YAML files
      let documents: any[];
      try {
        documents = parseAll(content);
      } catch {
        // If parseAll fails, try single document
        documents = [parse(content)];
      }
      
      // Check if any document is a HelmRelease for our target services
      const hasTargetHelmRelease = documents.some(doc => 
        doc?.kind === "HelmRelease" && 
        targetServices.includes(doc?.metadata?.name)
      );
      
      if (hasTargetHelmRelease) {
        helmReleasePaths.push(entry.path);
      }
    } catch (error) {
      // Skip files that can't be parsed
      continue;
    }
  }
  
  console.log(`Found ${helmReleasePaths.length} HelmReleases to update:\n`);
  
  for (const path of helmReleasePaths) {
    totalFiles++;
    const changed = await processHelmRelease(path, apply);
    if (changed) {
      modifiedFiles++;
    }
  }
  
  console.log(colors.bold.blue("\n📊 Summary:"));
  console.log(`   Total files processed: ${totalFiles}`);
  console.log(`   Files needing changes: ${modifiedFiles}`);
  
  if (dryRun && modifiedFiles > 0) {
    console.log(colors.yellow("\n💡 To apply these changes, run:"));
    console.log(colors.gray("   ./scripts/add-resource-limits.ts --apply"));
  }
  
  if (apply && modifiedFiles > 0) {
    console.log(colors.green("\n✅ All changes applied successfully!"));
    console.log(colors.yellow("\n⚠️  Next steps:"));
    console.log("   1. Review the changes with: git diff");
    console.log("   2. Validate configurations: deno task validate");
    console.log("   3. Commit the changes: git add -A && git commit -m 'feat(resources): add resource limits to remaining services'");
    console.log("   4. Push and reconcile: git push && task reconcile");
  }
}

if (import.meta.main) {
  await main();
}