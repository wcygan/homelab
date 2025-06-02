#!/usr/bin/env -S deno run --allow-all

import { parseArgs } from "@std/cli/parse-args";
import { delay } from "@std/async/delay";

interface ModelInfo {
  id: string;
  created: number;
  object: string;
  owned_by: string;
  features: string[];
}

interface ModelsResponse {
  object: string;
  data: ModelInfo[];
}

interface ListModelsOptions {
  port: number;
  timeout: number;
  help: boolean;
  verbose: boolean;
}

class KubeAIModelLister {
  private verbose: boolean;
  private portForwardProcess?: Deno.ChildProcess;

  constructor(verbose = false) {
    this.verbose = verbose;
  }

  private log(message: string, level: "INFO" | "WARN" | "ERROR" = "INFO"): void {
    const timestamp = new Date().toISOString();
    const prefix = level === "ERROR" ? "❌" : level === "WARN" ? "⚠️ " : "ℹ️ ";
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  private verboseLog(message: string): void {
    if (this.verbose) {
      this.log(message);
    }
  }

  private async runKubectl(args: string[]): Promise<{success: boolean, output: string, error?: string}> {
    try {
      const command = new Deno.Command("kubectl", {
        args,
        stdout: "piped",
        stderr: "piped",
      });

      const result = await command.output();
      const stdout = new TextDecoder().decode(result.stdout);
      const stderr = new TextDecoder().decode(result.stderr);

      return {
        success: result.success,
        output: stdout.trim(),
        error: stderr.trim() || undefined
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        output: "",
        error: `Failed to run kubectl: ${errorMessage}`
      };
    }
  }

  private async checkKubeAIService(): Promise<boolean> {
    this.verboseLog("Checking if kubeai service exists...");

    const result = await this.runKubectl(["get", "svc", "kubeai", "-n", "kubeai", "-o", "json"]);
    if (!result.success) {
      this.log(`KubeAI service not found: ${result.error}`, "ERROR");
      this.log("Make sure KubeAI is deployed and the service is running", "ERROR");
      return false;
    }

    this.verboseLog("✅ KubeAI service found");
    return true;
  }

  private async startPortForward(localPort: number): Promise<boolean> {
    this.verboseLog(`Starting port-forward to kubeai service on port ${localPort}...`);

    try {
      const command = new Deno.Command("kubectl", {
        args: ["port-forward", "svc/kubeai", `${localPort}:80`, "-n", "kubeai"],
        stdout: "piped",
        stderr: "piped",
      });

      this.portForwardProcess = command.spawn();

      // Give port-forward some time to establish
      await delay(2000);

      // Check if the process is still running
      const status = await Promise.race([
        this.portForwardProcess.status,
        delay(100).then(() => null)
      ]);

      if (status !== null) {
        this.log("Port-forward process exited prematurely", "ERROR");
        return false;
      }

      this.verboseLog(`✅ Port-forward established on localhost:${localPort}`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log(`Failed to start port-forward: ${errorMessage}`, "ERROR");
      return false;
    }
  }

  private async stopPortForward(): Promise<void> {
    if (this.portForwardProcess) {
      this.verboseLog("Stopping port-forward...");
      try {
        this.portForwardProcess.kill("SIGTERM");
        await this.portForwardProcess.status;
      } catch (error) {
        // Process might already be dead, that's okay
      }
      this.portForwardProcess = undefined;
    }
  }

  private async fetchModels(port: number, timeoutSeconds: number): Promise<ModelsResponse> {
    const url = `http://localhost:${port}/openai/v1/models`;
    this.verboseLog(`Fetching models from ${url}...`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutSeconds * 1000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json() as ModelsResponse;
      this.verboseLog("✅ Successfully fetched models data");
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeoutSeconds} seconds`);
      }
      throw error;
    }
  }

  private formatCreatedTime(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  }

  private displayModelsTable(modelsResponse: ModelsResponse): void {
    if (!modelsResponse.data || modelsResponse.data.length === 0) {
      this.log("No models found", "WARN");
      return;
    }

    console.log("\n🤖 Available KubeAI Models\n");

    // Calculate column widths
    const models = modelsResponse.data;
    const idWidth = Math.max(8, ...models.map(m => m.id.length));
    const ownerWidth = Math.max(10, ...models.map(m => m.owned_by.length));
    const featuresWidth = Math.max(12, ...models.map(m => m.features.join(", ").length));
    const createdWidth = 20; // Fixed width for date

    // Print header
    const separator = "─".repeat(idWidth + ownerWidth + featuresWidth + createdWidth + 13);
    console.log(`┌${separator}┐`);
    console.log(`│ ${"Model ID".padEnd(idWidth)} │ ${"Owner".padEnd(ownerWidth)} │ ${"Features".padEnd(featuresWidth)} │ ${"Created".padEnd(createdWidth)} │`);
    console.log(`├${separator}┤`);

    // Print data rows
    for (const model of models) {
      const id = model.id.padEnd(idWidth);
      const owner = (model.owned_by || "N/A").padEnd(ownerWidth);
      const features = model.features.join(", ").padEnd(featuresWidth);
      const created = this.formatCreatedTime(model.created).padEnd(createdWidth);

      console.log(`│ ${id} │ ${owner} │ ${features} │ ${created} │`);
    }

    console.log(`└${separator}┘`);
    console.log(`\n📊 Total models: ${models.length}`);

    if (this.verbose) {
      console.log(`\n📋 Raw Response:`);
      console.log(JSON.stringify(modelsResponse, null, 2));
    }
  }

  async listModels(options: ListModelsOptions): Promise<void> {
    try {
      // Check if kubeai service exists
      if (!(await this.checkKubeAIService())) {
        return;
      }

      // Start port-forward
      if (!(await this.startPortForward(options.port))) {
        return;
      }

      // Fetch models
      const modelsResponse = await this.fetchModels(options.port, options.timeout);

      // Display results
      this.displayModelsTable(modelsResponse);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log(`Failed to list models: ${errorMessage}`, "ERROR");
      throw error;
    } finally {
      // Always cleanup port-forward
      await this.stopPortForward();
    }
  }
}

function showHelp(): void {
  console.log(`
🤖 KubeAI Models Lister

This script sets up a port-forward to the KubeAI service and lists available models.

Usage: deno run --allow-all list-models.ts [options]

Options:
  -p, --port <port>     Local port for port-forwarding (default: 8000)
  -t, --timeout <sec>   HTTP request timeout in seconds (default: 10)
  -v, --verbose         Verbose output with detailed information
  -h, --help           Show this help message

Examples:
  deno run --allow-all list-models.ts                    # List models using default port 8000
  deno run --allow-all list-models.ts --verbose          # Detailed output
  deno run --allow-all list-models.ts -p 8080            # Use different port
  deno run --allow-all list-models.ts -t 30              # 30 second timeout

Requirements:
  - kubectl must be installed and configured
  - KubeAI must be deployed in the 'kubeai' namespace
  - kubeai service must be running and accessible
  `);
}

async function main(): Promise<void> {
  const parsedArgs = parseArgs(Deno.args, {
    string: ["port", "timeout"],
    boolean: ["verbose", "help"],
    alias: {
      p: "port",
      t: "timeout",
      v: "verbose",
      h: "help"
    },
    default: {
      port: "8000",
      timeout: "10",
      verbose: false
    }
  });

  const options: ListModelsOptions = {
    port: parseInt(parsedArgs.port as string),
    timeout: parseInt(parsedArgs.timeout as string),
    verbose: Boolean(parsedArgs.verbose),
    help: Boolean(parsedArgs.help)
  };

  if (options.help) {
    showHelp();
    return;
  }

  // Validate options
  if (isNaN(options.port) || options.port < 1 || options.port > 65535) {
    console.error("❌ Invalid port number. Must be between 1 and 65535.");
    Deno.exit(1);
  }

  if (isNaN(options.timeout) || options.timeout < 1) {
    console.error("❌ Invalid timeout. Must be a positive number of seconds.");
    Deno.exit(1);
  }

  const lister = new KubeAIModelLister(options.verbose);

  try {
    await lister.listModels(options);
  } catch (error) {
    console.error("❌ Script failed");
    Deno.exit(1);
  }
}

// Cleanup on exit
addEventListener("beforeunload", async () => {
  // This will trigger the finally block in listModels
});

if (import.meta.main) {
  await main();
}