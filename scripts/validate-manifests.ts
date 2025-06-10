#!/usr/bin/env -S deno run --allow-read --allow-run --allow-write --allow-env
/**
 * Validate Kubernetes manifests before committing
 * 
 * This script validates YAML syntax and Kubernetes schema compliance for all
 * manifests in the kubernetes/ directory. It handles Flux template variables
 * by substituting them with safe placeholder values before validation.
 * 
 * Supported template variables:
 * - ${SECRET_DOMAIN} -> example.com
 * - ${SECRET_DOMAIN/./-} -> example-com
 * - ${DS_PROMETHEUS} -> prometheus-datasource
 */

import $ from "@david/dax";
import { walk } from "@std/fs";
import { join, relative } from "@std/path";
import { colors } from "@cliffy/ansi";

// Template variable substitutions
const TEMPLATE_SUBSTITUTIONS = [
  { pattern: /\${SECRET_DOMAIN}/g, replacement: "example.com" },
  { pattern: /\${SECRET_DOMAIN\/\.\/\-}/g, replacement: "example-com" },
  { pattern: /\${DS_PROMETHEUS}/g, replacement: "prometheus-datasource" },
];

interface ValidationResult {
  path: string;
  success: boolean;
  templated: boolean;
  error?: string;
}

interface DragonflyValidationResult {
  path: string;
  success: boolean;
  error?: string;
}

/**
 * Check if kubectl is available
 */
async function isKubectlAvailable(): Promise<boolean> {
  try {
    await $`kubectl version --client --short`.quiet();
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if file contains template variables
 */
async function hasTemplateVars(filePath: string): Promise<boolean> {
  try {
    const content = await Deno.readTextFile(filePath);
    return /\${[^}]*}/.test(content);
  } catch {
    return false;
  }
}

/**
 * Substitute template variables with safe defaults
 */
async function substituteVars(filePath: string): Promise<string> {
  let content = await Deno.readTextFile(filePath);
  
  for (const sub of TEMPLATE_SUBSTITUTIONS) {
    content = content.replace(sub.pattern, sub.replacement);
  }
  
  const tempFile = await Deno.makeTempFile({ suffix: ".yaml" });
  await Deno.writeTextFile(tempFile, content);
  return tempFile;
}

/**
 * Check if file is a Kubernetes resource
 */
async function isKubernetesResource(filePath: string): Promise<boolean> {
  try {
    const content = await Deno.readTextFile(filePath);
    return /^kind:/m.test(content);
  } catch {
    return false;
  }
}

/**
 * Validate a single manifest file
 */
async function validateManifest(filePath: string): Promise<ValidationResult> {
  // Skip kustomization files and flux-specific files
  if (filePath.includes("kustomization.yaml") || filePath.endsWith("/ks.yaml")) {
    return { path: filePath, success: true, templated: false };
  }

  // Check if it's a Kubernetes resource
  if (!(await isKubernetesResource(filePath))) {
    return { path: filePath, success: true, templated: false };
  }

  const templated = await hasTemplateVars(filePath);
  let fileToValidate = filePath;
  let tempFile: string | null = null;

  try {
    if (templated) {
      tempFile = await substituteVars(filePath);
      fileToValidate = tempFile;
    }

    // Run kubectl validation
    const result = await $`kubectl apply --dry-run=client -f ${fileToValidate}`.quiet().noThrow();
    
    if (result.code === 0) {
      return { path: filePath, success: true, templated };
    } else {
      // Extract error message
      const errorOutput = result.stderr;
      const errorMatch = errorOutput.match(/error|Error.*/);
      const error = errorMatch ? errorMatch[0] : errorOutput;
      
      return { path: filePath, success: false, templated, error };
    }
  } finally {
    // Clean up temp file
    if (tempFile) {
      try {
        await Deno.remove(tempFile);
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}

/**
 * Validate Dragonfly CRD manifests
 */
async function validateDragonflyManifest(filePath: string): Promise<DragonflyValidationResult> {
  const content = await Deno.readTextFile(filePath);
  
  if (/spec:\s*redis:/.test(content)) {
    return { path: filePath, success: false, error: "Invalid field 'redis' found" };
  }
  
  if (/spec:\s*storage:/.test(content)) {
    return { path: filePath, success: false, error: "Invalid field 'storage' found" };
  }
  
  return { path: filePath, success: true };
}

/**
 * Find all Dragonfly manifests
 */
async function findDragonflyManifests(): Promise<string[]> {
  const manifests: string[] = [];
  
  for await (const entry of walk("kubernetes", { exts: [".yaml", ".yml"] })) {
    if (entry.isFile) {
      try {
        const content = await Deno.readTextFile(entry.path);
        if (/kind:\s*Dragonfly/.test(content)) {
          manifests.push(entry.path);
        }
      } catch {
        // Skip files we can't read
      }
    }
  }
  
  return manifests;
}

/**
 * Main validation function
 */
async function main() {
  console.log("🔍 Validating Kubernetes manifests...");

  // Check if kubectl is available
  if (!(await isKubectlAvailable())) {
    console.log(colors.yellow("⚠ kubectl not available, skipping validation"));
    Deno.exit(0);
  }

  // Find all YAML files
  const manifests: string[] = [];
  for await (const entry of walk("kubernetes", { exts: [".yaml", ".yml"] })) {
    if (entry.isFile && !entry.path.includes(".sops.yaml")) {
      manifests.push(entry.path);
    }
  }

  // Validate manifests in parallel for speed
  const validationPromises = manifests.map(manifest => validateManifest(manifest));
  const results = await Promise.all(validationPromises);

  // Process results
  let errors = 0;
  for (const result of results) {
    // Skip files that were skipped during validation
    if (result.path.includes("kustomization.yaml") || result.path.endsWith("/ks.yaml")) {
      continue;
    }

    // Only show output for actual Kubernetes resources
    if (await isKubernetesResource(result.path)) {
      const relativePath = relative(Deno.cwd(), result.path);
      process.stdout.write(`Checking ${relativePath}... `);
      
      if (result.success) {
        const templatedSuffix = result.templated ? " (templated)" : "";
        console.log(colors.green("✓") + templatedSuffix);
      } else {
        const templatedSuffix = result.templated ? " (templated)" : "";
        console.log(colors.red("✗") + templatedSuffix);
        console.log(colors.red(`Error in ${relativePath}:`));
        console.log(colors.red(result.error || "Unknown error"));
        errors++;
      }
    }
  }

  // Check for CRD-specific validations
  console.log("\n🔍 Checking CRD-specific manifests...");
  
  const dragonflyManifests = await findDragonflyManifests();
  const dragonflyPromises = dragonflyManifests.map(manifest => validateDragonflyManifest(manifest));
  const dragonflyResults = await Promise.all(dragonflyPromises);

  for (const result of dragonflyResults) {
    const relativePath = relative(Deno.cwd(), result.path);
    process.stdout.write(`Validating Dragonfly manifest ${relativePath}... `);
    
    if (result.success) {
      console.log(colors.green("✓"));
    } else {
      console.log(colors.red(`✗ ${result.error}`));
      errors++;
    }
  }

  // Final summary
  if (errors === 0) {
    console.log("\n" + colors.green("✅ All manifests validated successfully!"));
    Deno.exit(0);
  } else {
    console.log("\n" + colors.red(`❌ Found ${errors} validation errors!`));
    Deno.exit(1);
  }
}

// Run the script
if (import.meta.main) {
  main().catch((error) => {
    console.error(colors.red("Fatal error:"), error);
    Deno.exit(1);
  });
}