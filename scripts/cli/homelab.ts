#!/usr/bin/env -S deno run --allow-all

import { Command } from "@cliffy/command";
import { printQuickMonitor } from "./commands/monitor/index.ts";

// Main CLI entry point
const cli = new Command()
  .name("homelab")
  .description("Homelab monitoring and management CLI")
  .version("1.0.0");

// Monitor command with subcommands
const monitorCommand = new Command()
  .name("monitor")
  .description("Monitor homelab components")
  .option("-j, --json", "Output in JSON format for CI/CD integration")
  .option("-v, --verbose", "Enable detailed output")
  .action(async (options) => {
    // Default action - quick parallel health check
    await printQuickMonitor(options);
  });

// Flux subcommands
const fluxCommand = new Command()
  .name("flux")
  .description("Monitor Flux GitOps components")
  .option("-j, --json", "Output in JSON format")
  .option("-v, --verbose", "Enable detailed output");

fluxCommand
  .command("check")
  .description("Check Flux configuration best practices")
  .option("-j, --json", "Output in JSON format")
  .action(async (options) => {
    const { runFluxConfigCheck } = await import("./commands/monitor/flux-detailed.ts");
    await runFluxConfigCheck(options);
  });

fluxCommand
  .command("status")
  .description("Check Flux resource status")
  .option("-j, --json", "Output in JSON format")
  .option("-n, --namespace <namespace>", "Check specific namespace")
  .action(async (options) => {
    const { runFluxStatus } = await import("./commands/monitor/flux-detailed.ts");
    await runFluxStatus(options);
  });

fluxCommand
  .command("watch")
  .description("Watch Flux deployments in real-time")
  .option("--interval <seconds>", "Watch interval in seconds", { default: 5 })
  .action(async (options) => {
    const { runFluxWatch } = await import("./commands/monitor/flux-detailed.ts");
    await runFluxWatch({ interval: parseInt(String(options.interval), 10) });
  });

monitorCommand.command("flux", fluxCommand);

cli.command("monitor", monitorCommand);

// Parse arguments and execute
if (import.meta.main) {
  await cli.parse(Deno.args);
}