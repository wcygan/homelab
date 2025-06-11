#!/usr/bin/env -S deno run --allow-all

/**
 * logcli wrapper for easy Loki querying
 * Automatically sets up port forwarding and environment variables
 */

import { $ } from "jsr:@david/dax@^0.42.0";
import { parseArgs } from "jsr:@std/cli@^1.0.0/parse-args";

// Configuration
const LOKI_NAMESPACE = "monitoring";
const LOKI_SERVICE = "loki-gateway";
const LOKI_PORT = 80;
const LOCAL_PORT = 3100;

async function checkPortForward(): Promise<boolean> {
  try {
    const result = await $`lsof -i :${LOCAL_PORT}`.noThrow();
    return result.code === 0;
  } catch {
    return false;
  }
}

async function setupPortForward(): Promise<Deno.ChildProcess | null> {
  console.log(`🔄 Setting up port-forward to ${LOKI_SERVICE}...`);
  
  const cmd = new Deno.Command("kubectl", {
    args: [
      "port-forward",
      "-n", LOKI_NAMESPACE,
      `svc/${LOKI_SERVICE}`,
      `${LOCAL_PORT}:${LOKI_PORT}`
    ],
    stdout: "piped",
    stderr: "piped",
  });
  
  const process = cmd.spawn();
  
  // Wait a bit for port-forward to establish
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Check if it's running
  if (await checkPortForward()) {
    console.log("✅ Port-forward established");
    return process;
  }
  
  console.error("❌ Failed to establish port-forward");
  return null;
}

async function runLogcli(args: string[]): Promise<void> {
  // Set Loki address
  const env = {
    ...Deno.env.toObject(),
    LOGCLI_ADDR: `http://localhost:${LOCAL_PORT}`
  };
  
  // Run logcli with provided arguments
  const cmd = new Deno.Command("logcli", {
    args: args,
    env: env,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  
  const status = await cmd.output();
  if (!status.success) {
    Deno.exit(status.code);
  }
}

async function main() {
  const args = Deno.args;
  
  // Show help if no args
  if (args.length === 0) {
    console.log(`
🔍 Loki CLI Wrapper

This wrapper automatically sets up port-forwarding to Loki and runs logcli commands.

Usage:
  ${Deno.mainModule} <logcli-command> [options]

Examples:
  # Query logs from the last hour
  ${Deno.mainModule} query '{namespace="storage"}' --limit 100

  # Stream logs in real-time
  ${Deno.mainModule} query --tail '{namespace="monitoring"}'

  # Query with time range
  ${Deno.mainModule} query --from=1h --to=now '{app="rook-ceph-rgw"} |= "error"'

  # List all available labels
  ${Deno.mainModule} labels

  # List label values
  ${Deno.mainModule} labels namespace

  # Export logs as JSON
  ${Deno.mainModule} query --output=jsonl '{namespace="flux-system"}'

Common queries for your cluster:
  - Rook-Ceph errors: '{app="rook-ceph-rgw"} |= "error"'
  - Flux reconciliation: '{namespace="flux-system"} |= "reconciliation"'
  - Pod crashes: '{namespace=~".+"} |~ "Error|CrashLoopBackOff"'
  - Alloy collector logs: '{job="monitoring/alloy"}'
  - Storage logs: '{namespace="storage"}'

For more logcli options, run: logcli --help
`);
    Deno.exit(0);
  }
  
  // Check if port-forward already exists
  const portForwardExists = await checkPortForward();
  let portForwardProcess: Deno.ChildProcess | null = null;
  
  try {
    if (!portForwardExists) {
      portForwardProcess = await setupPortForward();
      if (!portForwardProcess) {
        console.error("Failed to setup port-forward");
        Deno.exit(1);
      }
    } else {
      console.log("✅ Using existing port-forward");
    }
    
    // Run logcli with provided arguments
    await runLogcli(args);
    
  } finally {
    // Clean up port-forward if we created it
    if (portForwardProcess) {
      console.log("\n🧹 Cleaning up port-forward...");
      try {
        portForwardProcess.kill();
      } catch {
        // Ignore errors during cleanup
      }
    }
  }
}

// Handle interrupts gracefully
let portForwardProcess: Deno.ChildProcess | null = null;

Deno.addSignalListener("SIGINT", () => {
  if (portForwardProcess) {
    portForwardProcess.kill();
  }
  Deno.exit(0);
});

await main();