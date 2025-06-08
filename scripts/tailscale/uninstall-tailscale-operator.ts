#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run --allow-env

/**
 * uninstall-tailscale-operator - Uninstall Tailscale Kubernetes Operator
 *
 * Removes the Tailscale Operator Helm release, optionally deletes the namespace,
 * and cleans up credential files. All command output is streamed to the console.
 *
 * Usage: deno run --allow-all scripts/tailscale/uninstall-tailscale-operator.ts [options]
 */

import { parseArgs } from "@std/cli";

const CREDENTIAL_FILES = [
  "tailscale-oauth-client-id.txt",
  "tailscale-oauth-client-secret.txt",
];
const TAILSCALE_NAMESPACE = "tailscale";
const HELM_RELEASE = "tailscale-operator";

async function runCommand(args: string[], options: { silent?: boolean } = {}) {
  if (!options.silent) {
    console.log(`    Running: ${args.join(" ")}`);
  }
  const process = new Deno.Command(args[0], {
    args: args.slice(1),
    stdout: "inherit",
    stderr: "inherit",
  });
  const { code } = await process.output();
  if (code !== 0) {
    throw new Error(`Command failed: ${args.join(" ")}`);
  }
}

async function promptUser(question: string): Promise<boolean> {
  const buf = new Uint8Array(1024);
  await Deno.stdout.write(new TextEncoder().encode(question + " [y/N]: "));
  const n = await Deno.stdin.read(buf) ?? 0;
  const answer = new TextDecoder().decode(buf.subarray(0, n)).trim()
    .toLowerCase();
  return answer === "y" || answer === "yes";
}

async function uninstall({ force }: { force: boolean }) {
  console.log("\n🗑️  Uninstalling Tailscale Kubernetes Operator...\n");
  // Step 1: Uninstall Helm release
  try {
    await runCommand([
      "helm",
      "uninstall",
      HELM_RELEASE,
      "-n",
      TAILSCALE_NAMESPACE,
    ]);
    console.log(
      `\n✅ Helm release '${HELM_RELEASE}' uninstalled from namespace '${TAILSCALE_NAMESPACE}'.`,
    );
  } catch (e) {
    console.warn(
      `\n⚠️  Helm release '${HELM_RELEASE}' may not exist or failed to uninstall: ${
        (e as Error).message
      }`,
    );
  }

  // Step 2: Optionally delete namespace
  let deleteNamespace = force;
  if (!force) {
    deleteNamespace = await promptUser(
      `\nDo you want to delete the namespace '${TAILSCALE_NAMESPACE}'?`,
    );
  }
  if (deleteNamespace) {
    try {
      await runCommand([
        "kubectl",
        "delete",
        "namespace",
        TAILSCALE_NAMESPACE,
      ]);
      console.log(`\n✅ Namespace '${TAILSCALE_NAMESPACE}' deleted.`);
    } catch (e) {
      console.warn(
        `\n⚠️  Namespace '${TAILSCALE_NAMESPACE}' may not exist or failed to delete: ${
          (e as Error).message
        }`,
      );
    }
  } else {
    console.log(`\nℹ️  Skipped deleting namespace '${TAILSCALE_NAMESPACE}'.`);
  }

  // Step 3: Remove credential files
  let cleanupCreds = force;
  if (!force) {
    cleanupCreds = await promptUser(
      "\nDo you want to remove Tailscale credential files?",
    );
  }
  if (cleanupCreds) {
    for (const file of CREDENTIAL_FILES) {
      try {
        await Deno.remove(file);
        console.log(`  🗑️  Removed ${file}`);
      } catch {
        // Ignore if file doesn't exist
      }
    }
    console.log("\n✅ Credential files cleaned up.");
  } else {
    console.log("\nℹ️  Skipped credential file cleanup.");
  }

  console.log("\n🎉 Uninstallation complete.");
}

function printHelp() {
  console.log(`
Tailscale Kubernetes Operator Uninstall Helper

DESCRIPTION:
    Uninstalls the Tailscale Operator Helm release, optionally deletes the namespace,
    and cleans up credential files. All command output is streamed to the console.

USAGE:
    uninstall-tailscale-operator.ts [OPTIONS]

OPTIONS:
    -f, --force     Skip confirmation prompts (delete namespace and creds)
    -h, --help      Show this help message

EXAMPLES:
    # Standard uninstall (with prompts)
    uninstall-tailscale-operator.ts

    # Uninstall and force delete everything
    uninstall-tailscale-operator.ts --force
`);
}

async function main() {
  const args = parseArgs(Deno.args, {
    boolean: ["force", "help"],
    alias: { f: "force", h: "help" },
    default: { force: false },
  });

  if (args.help) {
    printHelp();
    return;
  }

  await uninstall({ force: args.force });
}

if (import.meta.main) {
  await main();
}
