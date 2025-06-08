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

// K8s subcommands
const k8sCommand = new Command()
  .name("k8s")
  .description("Monitor Kubernetes cluster health")
  .option("-j, --json", "Output in JSON format")
  .option("-v, --verbose", "Enable detailed output");

k8sCommand
  .command("health")
  .description("Check Kubernetes cluster health")
  .option("-j, --json", "Output in JSON format")
  .option("-n, --namespace <namespace>", "Check specific namespace")
  .option("--no-flux", "Exclude Flux checks")
  .action(async (options) => {
    const { runK8sHealth } = await import("./commands/monitor/k8s-detailed.ts");
    await runK8sHealth(options);
  });

monitorCommand.command("k8s", k8sCommand);

// Storage subcommands
const storageCommand = new Command()
  .name("storage")
  .description("Monitor storage health and usage")
  .option("-j, --json", "Output in JSON format")
  .option("-v, --verbose", "Enable detailed output");

storageCommand
  .command("health")
  .description("Check storage health and PVC usage")
  .option("-j, --json", "Output in JSON format")
  .option("--growth-analysis", "Include growth rate analysis")
  .option("--check-provisioner", "Check storage provisioner health")
  .action(async (options) => {
    const { runStorageHealth } = await import("./commands/monitor/storage-detailed.ts");
    await runStorageHealth(options);
  });

monitorCommand.command("storage", storageCommand);

// Network subcommands
const networkCommand = new Command()
  .name("network")
  .description("Monitor network connectivity and health")
  .option("-j, --json", "Output in JSON format")
  .option("-v, --verbose", "Enable detailed output");

networkCommand
  .command("health")
  .description("Check network connectivity and ingress health")
  .option("-j, --json", "Output in JSON format")
  .option("--check-dns", "Include DNS resolution tests")
  .option("--check-endpoints", "Include endpoint connectivity tests")
  .action(async (options) => {
    const { runNetworkHealth } = await import("./commands/monitor/network-detailed.ts");
    await runNetworkHealth(options);
  });

monitorCommand.command("network", networkCommand);

// All command - comprehensive monitoring
monitorCommand
  .command("all")
  .description("Run comprehensive health checks across all domains")
  .option("-j, --json", "Output in JSON format")
  .option("-v, --verbose", "Enable detailed output")
  .option("--quick", "Quick checks only (same as default monitor)")
  .option("--ci", "CI mode with strict checks")
  .action(async (options) => {
    const { runComprehensiveMonitor } = await import("./commands/monitor/all.ts");
    await runComprehensiveMonitor(options);
  });

cli.command("monitor", monitorCommand);

// Parse arguments and execute
if (import.meta.main) {
  await cli.parse(Deno.args);
}