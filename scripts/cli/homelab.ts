#!/usr/bin/env -S deno run --allow-all

import { Command } from "@cliffy/command";
import { printQuickMonitor } from "./commands/monitor/index.ts";

// Main CLI entry point
const cli = new Command()
  .name("homelab")
  .description("Homelab monitoring and management CLI")
  .version("1.0.0");

// Monitor command
const monitorCommand = new Command()
  .name("monitor")
  .description("Monitor homelab components")
  .option("-j, --json", "Output in JSON format for CI/CD integration")
  .option("-v, --verbose", "Enable detailed output")
  .action(async (options) => {
    await printQuickMonitor(options);
  });

cli.command("monitor", monitorCommand);

// Parse arguments and execute
if (import.meta.main) {
  await cli.parse(Deno.args);
}