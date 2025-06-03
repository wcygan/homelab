#!/usr/bin/env -S deno run --allow-read

import { walk } from "@std/fs";

interface IntervalCount {
  interval: string;
  count: number;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function checkInfiniteRetries(): Promise<void> {
  console.log("1. Checking for infinite retries (retries: -1) in HelmReleases...");
  console.log("   These should be changed to finite retries (e.g., retries: 3)");
  console.log();

  let foundInfiniteRetries = false;

  for await (const entry of walk("kubernetes/apps", {
    exts: [".yaml"],
    includeDirs: false,
  })) {
    if (entry.name === "helmrelease.yaml") {
      try {
        const content = await Deno.readTextFile(entry.path);
        if (content.includes("retries: -1")) {
          console.log(`   ⚠ Infinite retries found: ${entry.path}`);
          foundInfiniteRetries = true;
        }
      } catch (error) {
        console.error(`   Error reading ${entry.path}: ${getErrorMessage(error)}`);
      }
    }
  }

  if (!foundInfiniteRetries) {
    console.log("   ✓ No infinite retries found");
  }
  console.log();
}

async function checkMissingHealthChecks(): Promise<void> {
  console.log("2. Checking for Kustomizations without health checks...");
  console.log("   Consider adding health checks for critical services");
  console.log();

  for await (const entry of walk("kubernetes/apps", {
    exts: [".yaml"],
    includeDirs: false,
  })) {
    if (entry.name === "ks.yaml") {
      try {
        const content = await Deno.readTextFile(entry.path);
        if (!content.includes("healthChecks:")) {
          console.log(`   ⚠ Missing health checks: ${entry.path}`);
        }
      } catch (error) {
        console.error(`   Error reading ${entry.path}: ${getErrorMessage(error)}`);
      }
    }
  }
  console.log();
}

async function checkMissingWaitConfig(): Promise<void> {
  console.log("3. Checking for Kustomizations without explicit wait configuration...");
  console.log("   Infrastructure and dependencies should have wait: true");
  console.log();

  for await (const entry of walk("kubernetes/apps", {
    exts: [".yaml"],
    includeDirs: false,
  })) {
    if (entry.name === "ks.yaml") {
      try {
        const content = await Deno.readTextFile(entry.path);
        if (!content.includes("wait:")) {
          console.log(`   ⚠ Missing wait config: ${entry.path}`);
        }
      } catch (error) {
        console.error(`   Error reading ${entry.path}: ${getErrorMessage(error)}`);
      }
    }
  }
  console.log();
}

async function checkMissingTimeout(): Promise<void> {
  console.log("4. Checking for Kustomizations without timeout configuration...");
  console.log("   Large deployments need appropriate timeouts");
  console.log();

  for await (const entry of walk("kubernetes/apps", {
    exts: [".yaml"],
    includeDirs: false,
  })) {
    if (entry.name === "ks.yaml") {
      try {
        const content = await Deno.readTextFile(entry.path);
        if (!content.includes("timeout:")) {
          console.log(`   ⚠ Missing timeout: ${entry.path}`);
        }
      } catch (error) {
        console.error(`   Error reading ${entry.path}: ${getErrorMessage(error)}`);
      }
    }
  }
  console.log();
}

async function checkMissingNamespaceInSourceRef(): Promise<void> {
  console.log("5. Checking for sourceRef without namespace specification...");
  console.log("   All sourceRef should include 'namespace: flux-system'");
  console.log();

  for await (const entry of walk("kubernetes/apps", {
    exts: [".yaml"],
    includeDirs: false,
  })) {
    try {
      const content = await Deno.readTextFile(entry.path);
      if (content.includes("sourceRef:")) {
        // Split content into lines and find sourceRef sections
        const lines = content.split('\n');
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
              console.log(`   ⚠ Missing namespace in sourceRef: ${entry.path}`);
              break; // Only report once per file
            }
          }
        }
      }
    } catch (error) {
      console.error(`   Error reading ${entry.path}: ${getErrorMessage(error)}`);
    }
  }
  console.log();
}

async function checkMissingResourceConstraints(): Promise<void> {
  console.log("6. Checking for HelmReleases without resource constraints...");
  console.log("   All deployments should specify resource requests/limits");
  console.log();

  for await (const entry of walk("kubernetes/apps", {
    exts: [".yaml"],
    includeDirs: false,
  })) {
    if (entry.name === "helmrelease.yaml") {
      try {
        const content = await Deno.readTextFile(entry.path);
        if (!content.includes("resources:")) {
          console.log(`   ⚠ Missing resources: ${entry.path}`);
        }
      } catch (error) {
        console.error(`   Error reading ${entry.path}: ${getErrorMessage(error)}`);
      }
    }
  }
  console.log();
}

async function checkIntervalConfigurations(): Promise<void> {
  console.log("7. Checking interval configurations...");
  console.log("   Intervals should follow standards (5m for critical, 15m for core, 30m-1h for apps)");
  console.log();

  const helmReleaseIntervals: Map<string, number> = new Map();
  const kustomizationIntervals: Map<string, number> = new Map();

  // Check HelmRelease intervals
  for await (const entry of walk("kubernetes/apps", {
    exts: [".yaml"],
    includeDirs: false,
  })) {
    if (entry.name === "helmrelease.yaml") {
      try {
        const content = await Deno.readTextFile(entry.path);
        const intervalMatch = content.match(/interval:\s*(.+)/);
        if (intervalMatch) {
          const interval = intervalMatch[1].trim();
          helmReleaseIntervals.set(interval, (helmReleaseIntervals.get(interval) || 0) + 1);
        }
      } catch (error) {
        console.error(`   Error reading ${entry.path}: ${getErrorMessage(error)}`);
      }
    }
  }

  // Check Kustomization intervals
  for await (const entry of walk("kubernetes/apps", {
    exts: [".yaml"],
    includeDirs: false,
  })) {
    if (entry.name === "ks.yaml") {
      try {
        const content = await Deno.readTextFile(entry.path);
        const intervalMatch = content.match(/interval:\s*(.+)/);
        if (intervalMatch) {
          const interval = intervalMatch[1].trim();
          kustomizationIntervals.set(interval, (kustomizationIntervals.get(interval) || 0) + 1);
        }
      } catch (error) {
        console.error(`   Error reading ${entry.path}: ${getErrorMessage(error)}`);
      }
    }
  }

  console.log("   HelmRelease intervals:");
  const sortedHelmIntervals = Array.from(helmReleaseIntervals.entries())
    .sort((a, b) => b[1] - a[1]);
  for (const [interval, count] of sortedHelmIntervals) {
    console.log(`      ${count} ${interval}`);
  }

  console.log();
  console.log("   Kustomization intervals:");
  const sortedKsIntervals = Array.from(kustomizationIntervals.entries())
    .sort((a, b) => b[1] - a[1]);
  for (const [interval, count] of sortedKsIntervals) {
    console.log(`      ${count} ${interval}`);
  }
  console.log();
}

async function main(): Promise<void> {
  console.log("=== Flux Configuration Health Check ===");
  console.log();

  try {
    await checkInfiniteRetries();
    await checkMissingHealthChecks();
    await checkMissingWaitConfig();
    await checkMissingTimeout();
    await checkMissingNamespaceInSourceRef();
    await checkMissingResourceConstraints();
    await checkIntervalConfigurations();

    console.log("=== Check Complete ===");
    console.log();
    console.log("Review the findings above and consider:");
    console.log("- Standardizing retry strategies (use finite retries)");
    console.log("- Adding health checks to critical services");
    console.log("- Setting appropriate wait/timeout values");
    console.log("- Ensuring all sourceRef include namespace");
    console.log("- Adding resource constraints to all deployments");
    console.log("- Standardizing interval configurations");
  } catch (error) {
    console.error("Error during health check:", getErrorMessage(error));
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}