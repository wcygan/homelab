#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * setup-tailscale-credentials - OAuth credential setup helper
 *
 * Helper script for setting up Tailscale OAuth credentials required by the
 * Tailscale Kubernetes Operator installation. This script is typically called
 * by the main installer (tailscale-operator-install.ts) but can also be run
 * independently if needed.
 *
 * Usage: deno run --allow-read --allow-write scripts/setup-tailscale-credentials.ts
 */

import { parseArgs } from "@std/cli";

const CREDENTIAL_FILES = {
  clientId: "tailscale-oauth-client-id.txt",
  clientSecret: "tailscale-oauth-client-secret.txt",
} as const;

async function promptUser(question: string): Promise<string> {
  console.log(question);
  console.log("(Press Enter when done)");

  const buf = new Uint8Array(1024);
  const n = await Deno.stdin.read(buf) ?? 0;
  return new TextDecoder().decode(buf.subarray(0, n)).trim();
}

async function promptHiddenInput(prompt: string): Promise<string> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // Check if we're in a TTY (terminal)
  if (!Deno.stdin.isTerminal()) {
    // Fallback to regular input if not in terminal (e.g., piped input)
    console.log(prompt);
    console.log(
      "(Input will be visible - not running in interactive terminal)",
    );
    const buf = new Uint8Array(1024);
    const n = await Deno.stdin.read(buf) ?? 0;
    return decoder.decode(buf.subarray(0, n)).trim();
  }

  // Display prompt
  await Deno.stdout.write(encoder.encode(prompt));

  // Set terminal to raw mode to read character by character
  Deno.stdin.setRaw(true);

  let input = "";
  const buf = new Uint8Array(1);

  try {
    while (true) {
      const bytesRead = await Deno.stdin.read(buf);
      if (bytesRead === null) break;

      const char = buf[0];

      // Handle different key presses
      if (char === 13) { // Enter key
        await Deno.stdout.write(encoder.encode("\n"));
        break;
      } else if (char === 3) { // Ctrl+C
        await Deno.stdout.write(encoder.encode("\n^C\n"));
        Deno.exit(1);
      } else if (char === 127 || char === 8) { // Backspace or Delete
        if (input.length > 0) {
          input = input.slice(0, -1);
          // Move cursor back, print space, move cursor back again
          await Deno.stdout.write(encoder.encode("\b \b"));
        }
      } else if (char >= 32 && char <= 126) { // Printable characters
        input += String.fromCharCode(char);
        await Deno.stdout.write(encoder.encode("*"));
      }
      // Ignore other control characters
    }
  } finally {
    // Restore terminal mode
    Deno.stdin.setRaw(false);
  }

  return input;
}

async function setupCredentials(): Promise<void> {
  console.log("🔐 Tailscale OAuth Credentials Setup\n");

  console.log("Before proceeding, you need to create OAuth credentials:");
  console.log("1. Visit: https://login.tailscale.com/admin/settings/oauth");
  console.log("2. Click 'Generate OAuth Client'");
  console.log("3. Give it a descriptive name (e.g., 'Kubernetes Operator')");
  console.log("4. Copy the generated Client ID and Client Secret\n");

  // Check if files already exist
  const existingFiles: string[] = [];
  for (const filename of Object.values(CREDENTIAL_FILES)) {
    try {
      await Deno.stat(filename);
      existingFiles.push(filename);
    } catch {
      // File doesn't exist
    }
  }

  if (existingFiles.length > 0) {
    console.log("⚠️  Warning: The following credential files already exist:");
    for (const file of existingFiles) {
      console.log(`  - ${file}`);
    }

    const overwrite = await promptUser(
      "\nDo you want to overwrite them? (y/N):",
    );
    if (!overwrite.toLowerCase().startsWith("y")) {
      console.log("Cancelled.");
      return;
    }
  }

  // Get Client ID (using hidden input)
  console.log(""); // Add some spacing
  const clientId = await promptHiddenInput("Paste your OAuth Client ID: ");
  if (!clientId) {
    console.error("❌ Client ID is required");
    Deno.exit(1);
  }

  // Get Client Secret (using hidden input)
  const clientSecret = await promptHiddenInput(
    "Paste your OAuth Client Secret: ",
  );
  if (!clientSecret) {
    console.error("❌ Client Secret is required");
    Deno.exit(1);
  }

  // Validate format (basic check)
  if (!clientId.startsWith("ts-client-")) {
    console.warn("⚠️  Warning: Client ID doesn't start with 'ts-client-'");
  }

  if (!clientSecret.startsWith("ts-secret-")) {
    console.warn("⚠️  Warning: Client Secret doesn't start with 'ts-secret-'");
  }

  // Write files
  try {
    await Deno.writeTextFile(CREDENTIAL_FILES.clientId, clientId);
    await Deno.writeTextFile(CREDENTIAL_FILES.clientSecret, clientSecret);

    console.log("\n✅ Credentials saved successfully!");
    console.log(`  📄 ${CREDENTIAL_FILES.clientId}`);
    console.log(`  📄 ${CREDENTIAL_FILES.clientSecret}`);

    console.log("\nNext steps:");
    console.log(
      "1. Run the main installer: ./scripts/tailscale/tailscale-operator",
    );
    console.log(
      "2. Or run the installation helper: deno run --allow-all scripts/install-tailscale-operator.ts",
    );
    console.log(
      "3. Credential files will be automatically cleaned up after successful installation",
    );
  } catch (error) {
    console.error(
      "❌ Failed to write credential files:",
      (error as Error).message,
    );
    Deno.exit(1);
  }
}

async function main(): Promise<void> {
  const args = parseArgs(Deno.args, {
    boolean: ["help"],
    alias: { h: "help" },
  });

  if (args.help) {
    console.log(`
Tailscale OAuth Credentials Setup Helper

DESCRIPTION:
    Helper script for setting up OAuth credentials required by the Tailscale
    Kubernetes Operator. This script is typically called automatically by the
    main installer (tailscale-operator-install.ts).

USAGE:
    setup-tailscale-credentials.ts

CREDENTIAL FILES:
    - ${CREDENTIAL_FILES.clientId}
    - ${CREDENTIAL_FILES.clientSecret}

OAUTH SETUP PROCESS:
    1. Visit: https://login.tailscale.com/admin/settings/oauth
    2. Click 'Generate OAuth Client'
    3. Give it a name (e.g., 'Kubernetes Operator')
    4. Copy the Client ID and Client Secret
    5. Run this script and paste them when prompted (input will be hidden)

SECURITY FEATURES:
    • Input masking: Credentials are hidden with asterisks (*) when typed
    • Terminal detection: Falls back to visible input if not in interactive terminal
    • Git-ignored files: Credentials are automatically excluded from version control

MAIN INSTALLER:
    For the complete installation workflow, use:
    ./scripts/tailscale/tailscale-operator

STANDALONE USAGE:
    This helper can be run independently if you need to just set up credentials:
    deno run --allow-read --allow-write scripts/setup-tailscale-credentials.ts
    `);
    return;
  }

  await setupCredentials();
}

if (import.meta.main) {
  await main();
}
