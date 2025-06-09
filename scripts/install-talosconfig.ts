#!/usr/bin/env -S deno run --allow-all

import $ from "@david/dax";
import { exists } from "@std/fs";
import * as path from "@std/path";
import { colors } from "@cliffy/ansi/colors";

// Configuration
const SOURCE_CONFIG = "talos/clusterconfig/talosconfig";
const DEFAULT_DEST = path.join(Deno.env.get("HOME") || "", ".talos", "config");
const XDG_CONFIG_HOME = Deno.env.get("XDG_CONFIG_HOME") || path.join(Deno.env.get("HOME") || "", ".config");
const XDG_DEST = path.join(XDG_CONFIG_HOME, "talos", "config.yaml");

async function main() {
  // Parse command line arguments
  const args = Deno.args;
  const nonInteractive = args.includes("--non-interactive") || args.includes("-y");
  const forceDefault = args.includes("--default-location");
  const forceXDG = args.includes("--xdg");
  
  if (args.includes("--help") || args.includes("-h")) {
    console.log(`Usage: install-talosconfig.ts [options]

Options:
  --non-interactive, -y    Non-interactive mode (uses XDG by default)
  --default-location       Use ~/.talos/config location
  --xdg                    Use XDG config location (default in non-interactive)
  --help, -h               Show this help message
`);
    Deno.exit(0);
  }

  // Check if source config exists
  if (!await exists(SOURCE_CONFIG)) {
    console.error(colors.red(`Error: Source config not found at ${SOURCE_CONFIG}`));
    Deno.exit(1);
  }

  // Check current talosctl config location
  const currentConfig = Deno.env.get("TALOSCONFIG");
  if (currentConfig) {
    console.log(colors.yellow(`Note: TALOSCONFIG environment variable is set to: ${currentConfig}`));
  }

  // Determine which destination to use
  let useXDG = true; // Default to XDG
  
  if (forceDefault) {
    useXDG = false;
  } else if (!forceXDG && !nonInteractive && Deno.isatty(Deno.stdin.rid)) {
    // Only prompt if we're in a TTY and not forced
    useXDG = await $.confirm({
      message: "Use XDG config location? (recommended for modern systems)",
      default: true,
    });
  }

  const destination = useXDG ? XDG_DEST : DEFAULT_DEST;
  const destDir = path.dirname(destination);

  // Create destination directory if it doesn't exist
  await $.path(destDir).ensureDir();

  // Check if destination already exists
  if (await exists(destination)) {
    let overwrite = nonInteractive; // In non-interactive mode, default to overwrite
    
    if (!nonInteractive && Deno.isatty(Deno.stdin.rid)) {
      overwrite = await $.confirm({
        message: `Config already exists at ${destination}. Overwrite?`,
        default: false,
      });
    }
    
    if (!overwrite) {
      console.log(colors.yellow("Installation cancelled."));
      Deno.exit(0);
    }
    
    // Backup existing config
    const backupPath = `${destination}.backup.${new Date().toISOString().replace(/:/g, '-')}`;
    await $`cp ${destination} ${backupPath}`;
    console.log(colors.blue(`Backed up existing config to: ${backupPath}`));
  }

  // Copy the config
  console.log("Installing talosconfig...");
  
  try {
    await $`cp ${SOURCE_CONFIG} ${destination}`;
    console.log(colors.green(`✓ Talosconfig installed to: ${destination}`));
    
    // Test the installation
    console.log(colors.blue("\nTesting installation..."));
    const result = await $`talosctl version --short`.quiet();
    
    if (result.code === 0) {
      console.log(colors.green("✓ Talosctl is working correctly!"));
      console.log(colors.dim(result.stdout));
    } else {
      console.log(colors.yellow("⚠ Talosctl test failed. You may need to restart your shell or set TALOSCONFIG."));
    }
    
    // Show next steps
    console.log(colors.bold("\nNext steps:"));
    if (useXDG) {
      console.log("• Talosctl should now work from any directory");
      console.log("• No additional configuration needed for XDG-compliant systems");
    } else {
      console.log("• Talosctl should now work from any directory");
      console.log("• If it doesn't work, add this to your shell profile:");
      console.log(colors.dim(`  export TALOSCONFIG="${destination}"`));
    }
    
  } catch (error) {
    console.error(colors.red(`Error installing talosconfig: ${error}`));
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}