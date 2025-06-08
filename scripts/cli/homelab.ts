#!/usr/bin/env -S deno run --allow-all

import { Command } from "@cliffy/command";

// Main CLI entry point
const cli = new Command()
  .name("homelab")
  .description("Homelab monitoring and management CLI")
  .version("1.0.0");

// Monitor command
const monitorCommand = new Command()
  .name("monitor")
  .description("Monitor homelab components")
  .action(() => {
    console.log("Quick parallel health check - not implemented yet");
  });

cli.command("monitor", monitorCommand);

// Parse arguments and execute
if (import.meta.main) {
  await cli.parse(Deno.args);
}