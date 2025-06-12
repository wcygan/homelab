#!/usr/bin/env -S deno run --allow-all

import { parse, stringify } from "jsr:@std/yaml@1.0.0";
import { walk } from "jsr:@std/fs@1.0.0";
import { $ } from "jsr:@david/dax@0.42.0";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";

interface KustomizationConfig {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
  };
  spec: {
    interval: string;
    retryInterval?: string; // Deprecated in Flux v2
    timeout?: string;
    prune: boolean;
    wait?: boolean;
    [key: string]: any;
  };
}

// Define service categories and their recommended intervals
const CRITICAL_NAMESPACES = [
  "flux-system",
  "kube-system",
  "cert-manager",
  "external-secrets",
  "network",
];

const CORE_NAMESPACES = [
  "storage",
  "monitoring",
  "database",
];

const CRITICAL_APPS = [
  "cilium",
  "coredns",
  "metrics-server",
  "reloader",
  "spegel",
  "cert-manager",
  "external-secrets",
  "cloudflared",
  "external-dns",
  "k8s-gateway",
  "nginx-external",
  "nginx-internal",
];

const CORE_APPS = [
  "rook-ceph",
  "velero",
  "volsync",
  "external-snapshotter",
  "kube-prometheus-stack",
  "loki",
  "alloy",
  "cloudnative-pg",
  "dragonfly-operator",
];

function getServiceCategory(namespace: string, appName: string): "critical" | "core" | "standard" {
  if (CRITICAL_NAMESPACES.includes(namespace) || CRITICAL_APPS.includes(appName)) {
    return "critical";
  }
  if (CORE_NAMESPACES.includes(namespace) || CORE_APPS.includes(appName)) {
    return "core";
  }
  return "standard";
}

function getRecommendedConfig(category: "critical" | "core" | "standard") {
  switch (category) {
    case "critical":
      return {
        interval: "5m",
        timeout: "5m",
        wait: true,
      };
    case "core":
      return {
        interval: "15m",
        timeout: "10m",
        wait: true,
      };
    case "standard":
      return {
        interval: "30m",
        timeout: "10m",
        wait: false,
      };
  }
}

async function processKustomizationFile(filePath: string, apply: boolean): Promise<boolean> {
  try {
    const content = await Deno.readTextFile(filePath);
    const config = parse(content) as KustomizationConfig;

    if (config.kind !== "Kustomization" || !config.apiVersion?.includes("kustomize.toolkit.fluxcd.io")) {
      return false;
    }

    const appName = config.metadata.name;
    const namespace = config.spec.targetNamespace || config.metadata.namespace;
    const category = getServiceCategory(namespace, appName);
    const recommended = getRecommendedConfig(category);

    let hasChanges = false;
    const changes: string[] = [];

    // Remove deprecated retryInterval
    if (config.spec.retryInterval) {
      delete config.spec.retryInterval;
      hasChanges = true;
      changes.push("Removed deprecated retryInterval");
    }

    // Update interval if needed
    const currentInterval = config.spec.interval;
    if (currentInterval !== recommended.interval) {
      config.spec.interval = recommended.interval;
      hasChanges = true;
      changes.push(`Updated interval: ${currentInterval} → ${recommended.interval}`);
    }

    // Add or update timeout
    if (!config.spec.timeout || config.spec.timeout !== recommended.timeout) {
      const oldTimeout = config.spec.timeout || "none";
      config.spec.timeout = recommended.timeout;
      hasChanges = true;
      changes.push(`Updated timeout: ${oldTimeout} → ${recommended.timeout}`);
    }

    // Ensure wait is set appropriately for critical/core services
    if (category !== "standard" && config.spec.wait !== recommended.wait) {
      config.spec.wait = recommended.wait;
      hasChanges = true;
      changes.push(`Set wait: ${recommended.wait}`);
    }

    if (hasChanges) {
      console.log(colors.cyan(`\n📋 ${filePath}`));
      console.log(colors.gray(`   Category: ${category}`));
      console.log(colors.gray(`   App: ${appName} | Namespace: ${namespace}`));
      changes.forEach(change => console.log(colors.yellow(`   ✓ ${change}`)));

      if (apply) {
        // Preserve the original YAML structure and comments as much as possible
        const updatedYaml = stringify(config, {
          lineWidth: 120,
          noRefs: true,
          sortKeys: false,
        });
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

  console.log(colors.bold.blue("🔧 Flux Kustomization Configuration Fixer\n"));

  if (dryRun) {
    console.log(colors.yellow("🔍 Running in DRY RUN mode. Use --apply to make changes.\n"));
  } else {
    console.log(colors.yellow("⚠️  Running in APPLY mode. Changes will be written to files.\n"));
  }

  let totalFiles = 0;
  let modifiedFiles = 0;

  // Find all ks.yaml files
  for await (const entry of walk("kubernetes/apps", {
    includeFiles: true,
    includeDirs: false,
    match: [/ks\.yaml$/],
  })) {
    totalFiles++;
    const changed = await processKustomizationFile(entry.path, apply);
    if (changed) {
      modifiedFiles++;
    }
  }

  console.log(colors.bold.blue("\n📊 Summary:"));
  console.log(`   Total files scanned: ${totalFiles}`);
  console.log(`   Files needing changes: ${modifiedFiles}`);

  if (dryRun && modifiedFiles > 0) {
    console.log(colors.yellow("\n💡 To apply these changes, run:"));
    console.log(colors.gray("   ./scripts/fix-flux-kustomizations.ts --apply"));
  }

  if (apply && modifiedFiles > 0) {
    console.log(colors.green("\n✅ All changes applied successfully!"));
    console.log(colors.yellow("\n⚠️  Next steps:"));
    console.log("   1. Review the changes with: git diff");
    console.log("   2. Validate configurations: deno task validate");
    console.log("   3. Commit the changes: git add -A && git commit -m 'fix(flux): standardize kustomization configurations'");
    console.log("   4. Push and reconcile: git push && task reconcile");
  }
}

if (import.meta.main) {
  await main();
}