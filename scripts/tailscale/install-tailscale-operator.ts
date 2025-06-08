#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run --allow-env

/**
 * install-tailscale-operator - Core Tailscale Kubernetes Operator installer
 *
 * Helper script that handles the core Helm-based installation of the Tailscale
 * Kubernetes Operator. This script is typically called by the main installer
 * (tailscale-operator-install.ts) but can be run independently for advanced use cases.
 *
 * For most users, run the main installer instead: ./scripts/tailscale/tailscale-operator-install.ts
 *
 * Usage: deno run --allow-all scripts/install-tailscale-operator.ts [options]
 */

import { parseArgs } from "@std/cli";
import { ensureFile } from "@std/fs";

// Configuration
const CREDENTIAL_FILES = {
  clientId: "tailscale-oauth-client-id.txt",
  clientSecret: "tailscale-oauth-client-secret.txt",
} as const;

const GITIGNORE_FILE = ".gitignore";
const CURSORIGNORE_FILE = ".cursorignore";
const TAILSCALE_NAMESPACE = "tailscale";
const HELM_REPO_NAME = "tailscale";
const HELM_REPO_URL = "https://pkgs.tailscale.com/helmcharts";
const HELM_CHART = "tailscale/tailscale-operator";

interface TailscaleCredentials {
  clientId: string;
  clientSecret: string;
}

interface InstallOptions {
  namespace: string;
  apiServerProxy: boolean;
  cleanupCredentials: boolean;
  dryRun: boolean;
  verbose: boolean;
}

class TailscaleOperatorInstaller {
  private options: InstallOptions;

  constructor(options: InstallOptions) {
    this.options = options;
  }

  async install(): Promise<void> {
    console.log("🚀 Starting Tailscale Kubernetes Operator installation...\n");

    try {
      // Step 1: Check prerequisites
      await this.checkPrerequisites();

      // Step 2: Manage ignore files (.gitignore and .cursorignore)
      await this.ensureGitignore();
      await this.ensureCursorignore();

      // Step 3: Load credentials
      const credentials = await this.loadCredentials();

      // Step 4: Validate Kubernetes access
      await this.validateKubernetesAccess();

      // Step 5: Install operator
      await this.installOperator(credentials);

      // Step 5.5: Wait for operator readiness
      const operatorReady = await this.waitForOperatorReady();
      if (!operatorReady) {
        console.warn(
          "\n⚠️  Tailscale operator deployment is not ready after waiting. Skipping kubeconfig setup and credential cleanup.",
        );
        console.warn(
          "   You can check the status with: kubectl get deployment operator -n tailscale",
        );
        console.warn(
          "   And view logs with: kubectl logs -n tailscale -l app=operator",
        );
        return;
      }

      // Step 6: Configure kubeconfig
      await this.configureKubeconfig();

      // Step 7: Cleanup credentials (if requested)
      if (this.options.cleanupCredentials) {
        await this.cleanupCredentials();
      }

      console.log(
        "\n✅ Tailscale Kubernetes Operator installation completed successfully!",
      );
      console.log("\nNext steps:");
      console.log("1. Configure your Tailscale access controls");
      console.log(
        "2. Create Tailscale resources (Services, ProxyClasses, etc.)",
      );
      console.log(
        "3. Check the operator logs: kubectl logs -n tailscale -l app=tailscale-operator",
      );
    } catch (error) {
      console.error("\n❌ Installation failed:", (error as Error).message);
      if (this.options.verbose) {
        console.error("Stack trace:", (error as Error).stack);
      }
      Deno.exit(1);
    }
  }

  private async checkPrerequisites(): Promise<void> {
    console.log("🔍 Checking prerequisites...");

    const requiredCommands = ["helm", "kubectl"];

    for (const cmd of requiredCommands) {
      try {
        await this.runCommand([cmd, "version", "--client"], { silent: true });
        console.log(`  ✅ ${cmd} is available`);
      } catch {
        throw new Error(`${cmd} is not installed or not in PATH`);
      }
    }
  }

  private async ensureGitignore(): Promise<void> {
    console.log("\n📝 Managing .gitignore...");

    // Ensure .gitignore exists
    await ensureFile(GITIGNORE_FILE);

    // Read current .gitignore content
    let gitignoreContent = "";
    try {
      gitignoreContent = await Deno.readTextFile(GITIGNORE_FILE);
    } catch {
      // File doesn't exist or is empty
    }

    // Check if our credential files are already ignored
    let needsUpdate = false;
    const linesToAdd: string[] = [];

    for (const filename of Object.values(CREDENTIAL_FILES)) {
      if (!gitignoreContent.includes(filename)) {
        linesToAdd.push(filename);
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      const newContent = gitignoreContent.trim() +
        (gitignoreContent.trim() ? "\n\n" : "") +
        "# Tailscale OAuth credentials (managed by install script)\n" +
        linesToAdd.join("\n") + "\n";

      await Deno.writeTextFile(GITIGNORE_FILE, newContent);
      console.log(`  ✅ Added ${linesToAdd.length} file(s) to .gitignore`);
    } else {
      console.log("  ✅ .gitignore already includes credential files");
    }
  }

  private async ensureCursorignore(): Promise<void> {
    console.log("📝 Managing .cursorignore...");

    // Ensure .cursorignore exists
    await ensureFile(CURSORIGNORE_FILE);

    // Read current .cursorignore content
    let cursorignoreContent = "";
    try {
      cursorignoreContent = await Deno.readTextFile(CURSORIGNORE_FILE);
    } catch {
      // File doesn't exist or is empty
    }

    // Check if our credential files are already ignored
    let needsUpdate = false;
    const linesToAdd: string[] = [];

    for (const filename of Object.values(CREDENTIAL_FILES)) {
      if (!cursorignoreContent.includes(filename)) {
        linesToAdd.push(filename);
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      const newContent = cursorignoreContent.trim() +
        (cursorignoreContent.trim() ? "\n\n" : "") +
        "# Tailscale OAuth credentials (managed by install script)\n" +
        linesToAdd.join("\n") + "\n";

      await Deno.writeTextFile(CURSORIGNORE_FILE, newContent);
      console.log(`  ✅ Added ${linesToAdd.length} file(s) to .cursorignore`);
    } else {
      console.log("  ✅ .cursorignore already includes credential files");
    }
  }

  private async loadCredentials(): Promise<TailscaleCredentials> {
    console.log("\n🔐 Loading Tailscale OAuth credentials...");

    const credentials: Partial<TailscaleCredentials> = {};
    const missingFiles: string[] = [];

    // Check for credential files
    for (const [key, filename] of Object.entries(CREDENTIAL_FILES)) {
      try {
        await Deno.stat(filename);
        const content = await Deno.readTextFile(filename);
        credentials[key as keyof TailscaleCredentials] = content.trim();
        console.log(`  ✅ Loaded ${filename}`);
      } catch {
        missingFiles.push(filename);
      }
    }

    if (missingFiles.length > 0) {
      console.error("\n❌ Missing credential files:");
      for (const file of missingFiles) {
        console.error(`  - ${file}`);
      }
      console.error("\nTo create OAuth credentials:");
      console.error(
        "1. Visit: https://login.tailscale.com/admin/settings/oauth",
      );
      console.error("2. Create a new OAuth client");
      console.error("3. Save the client ID to:", CREDENTIAL_FILES.clientId);
      console.error(
        "4. Save the client secret to:",
        CREDENTIAL_FILES.clientSecret,
      );
      console.error("5. Run this script again");
      throw new Error("Missing required credential files");
    }

    // Validate credentials format
    if (!credentials.clientId || !credentials.clientSecret) {
      throw new Error("Credential files are empty or invalid");
    }

    return credentials as TailscaleCredentials;
  }

  private async validateKubernetesAccess(): Promise<void> {
    console.log("\n☸️  Validating Kubernetes access...");

    try {
      await this.runCommand(["kubectl", "cluster-info"], { silent: true });
      console.log("  ✅ Kubernetes cluster is accessible");
    } catch {
      throw new Error(
        "Cannot access Kubernetes cluster. Check your kubeconfig and cluster connection.",
      );
    }
  }

  private async installOperator(
    credentials: TailscaleCredentials,
  ): Promise<void> {
    console.log("\n📦 Installing Tailscale Kubernetes Operator...");

    if (this.options.dryRun) {
      console.log("  🔍 DRY RUN: Would execute the following commands:");
      this.logHelmCommands(credentials);
      return;
    }

    // Add Helm repository
    console.log("  📝 Adding Tailscale Helm repository...");
    await this.runCommand([
      "helm",
      "repo",
      "add",
      HELM_REPO_NAME,
      HELM_REPO_URL,
    ]);

    // Update Helm repositories
    console.log("  🔄 Updating Helm repositories...");
    await this.runCommand(["helm", "repo", "update"]);

    // Install the operator
    console.log("  🚀 Installing Tailscale operator...");
    const helmArgs = [
      "helm",
      "upgrade",
      "--install",
      "tailscale-operator",
      HELM_CHART,
      `--namespace=${this.options.namespace}`,
      "--create-namespace",
      `--set-string=oauth.clientId=${credentials.clientId}`,
      `--set-string=oauth.clientSecret=${credentials.clientSecret}`,
      "--wait",
    ];

    if (this.options.apiServerProxy) {
      helmArgs.push("--set-string=apiServerProxyConfig.mode=true");
    }

    await this.runCommand(helmArgs);
    console.log("  ✅ Tailscale operator installed successfully");
  }

  private async configureKubeconfig(): Promise<void> {
    console.log("\n⚙️  Configuring kubeconfig...");

    if (this.options.dryRun) {
      console.log("  🔍 DRY RUN: Would configure kubeconfig");
      return;
    }

    try {
      await this.runCommand([
        "tailscale",
        "configure",
        "kubeconfig",
        "tailscale-operator",
      ]);
      console.log("  ✅ Kubeconfig configured for Tailscale access");
    } catch (error) {
      console.warn(
        "  ⚠️  Warning: Could not configure kubeconfig:",
        (error as Error).message,
      );
      console.warn(
        "     You may need to run manually: tailscale configure kubeconfig tailscale-operator",
      );
    }
  }

  private async cleanupCredentials(): Promise<void> {
    console.log("\n🧹 Cleaning up credential files...");

    for (const filename of Object.values(CREDENTIAL_FILES)) {
      try {
        await Deno.remove(filename);
        console.log(`  🗑️  Removed ${filename}`);
      } catch {
        console.warn(`  ⚠️  Could not remove ${filename} (may not exist)`);
      }
    }
  }

  private logHelmCommands(credentials: TailscaleCredentials): void {
    console.log(`    helm repo add ${HELM_REPO_NAME} ${HELM_REPO_URL}`);
    console.log(`    helm repo update`);
    console.log(
      `    helm upgrade --install tailscale-operator ${HELM_CHART} \\`,
    );
    console.log(`      --namespace=${this.options.namespace} \\`);
    console.log(`      --create-namespace \\`);
    console.log(`      --set-string=oauth.clientId=${credentials.clientId} \\`);
    console.log(`      --set-string=oauth.clientSecret=<hidden> \\`);
    if (this.options.apiServerProxy) {
      console.log(`      --set-string=apiServerProxyConfig.mode=true \\`);
    }
    console.log(`      --wait`);
    console.log(`    tailscale configure kubeconfig tailscale-operator`);
  }

  private async runCommand(
    args: string[],
    options: { silent?: boolean } = {},
  ): Promise<string> {
    if (this.options.verbose && !options.silent) {
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

    // No output to return since output is streamed live
    return "";
  }

  /**
   * Waits for the Tailscale operator deployment to become ready.
   * Returns true if ready, false if not ready after timeout.
   */
  private async waitForOperatorReady(
    timeoutMs = 180000,
    pollIntervalMs = 5000,
  ): Promise<boolean> {
    console.log(
      "\n⏳ Waiting for Tailscale operator deployment to become ready...",
    );
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const proc = new Deno.Command("kubectl", {
          args: [
            "get",
            "deployment",
            "operator",
            "-n",
            this.options.namespace,
            "-o",
            "json",
          ],
          stdout: "piped",
          stderr: "null",
        });
        const { code, stdout } = await proc.output();
        if (code === 0) {
          const json = JSON.parse(new TextDecoder().decode(stdout));
          // Check .status.conditions[] for Available=True
          const conditions = json.status?.conditions || [];
          const available = conditions.find((c: any) =>
            c.type === "Available" && c.status === "True"
          );
          const availableReplicas = json.status?.availableReplicas || 0;
          if (available && availableReplicas >= 1) {
            console.log("  ✅ Operator deployment is ready.");
            return true;
          }
        }
      } catch (e) {
        // Ignore errors, just retry
      }
      await new Promise((r) => setTimeout(r, pollIntervalMs));
      await Deno.stdout.write(new TextEncoder().encode("."));
    }
    console.warn(
      "\n❌ Operator deployment did not become ready within timeout.",
    );
    return false;
  }
}

// CLI interface
async function main(): Promise<void> {
  const args = parseArgs(Deno.args, {
    string: ["namespace"],
    boolean: [
      "api-server-proxy",
      "cleanup-credentials",
      "dry-run",
      "verbose",
      "help",
    ],
    alias: {
      n: "namespace",
      a: "api-server-proxy",
      c: "cleanup-credentials",
      d: "dry-run",
      v: "verbose",
      h: "help",
    },
    default: {
      namespace: TAILSCALE_NAMESPACE,
      "api-server-proxy": true,
      "cleanup-credentials": true,
      "dry-run": false,
      verbose: false,
    },
  });

  if (args.help) {
    console.log(`
Tailscale Kubernetes Operator Installation Helper

DESCRIPTION:
    Core installation helper for the Tailscale Kubernetes Operator.
    This script handles the Helm-based deployment and configuration.

    For most users, use the main installer instead:
    ./scripts/tailscale/tailscale-operator-install.ts

USAGE:
    install-tailscale-operator.ts [OPTIONS]

OPTIONS:
    -n, --namespace <name>        Kubernetes namespace (default: ${TAILSCALE_NAMESPACE})
    -a, --api-server-proxy        Enable API server proxy (default: true)
    -c, --cleanup-credentials     Delete credential files after success (default: true)
    -d, --dry-run                 Show what would be done without executing
    -v, --verbose                 Enable verbose output
    -h, --help                    Show this help

PREREQUISITES:
    - helm and kubectl must be installed and in PATH
    - Kubernetes cluster must be accessible
    - OAuth credentials must be in these files:
      * ${CREDENTIAL_FILES.clientId}
      * ${CREDENTIAL_FILES.clientSecret}

CREDENTIAL SETUP:
    Use the credential helper first:
    ./scripts/setup-tailscale-credentials.ts

    Or manually:
    1. Visit: https://login.tailscale.com/admin/settings/oauth
    2. Create a new OAuth client
    3. Save client ID to: ${CREDENTIAL_FILES.clientId}
    4. Save client secret to: ${CREDENTIAL_FILES.clientSecret}

EXAMPLES:
    # Standard installation
    install-tailscale-operator.ts

    # Dry run to see what would happen
    install-tailscale-operator.ts --dry-run

    # Install without API server proxy
    install-tailscale-operator.ts --no-api-server-proxy

    # Keep credential files after installation
    install-tailscale-operator.ts --no-cleanup-credentials

MAIN INSTALLER:
    For the complete workflow with guided setup:
    ./scripts/tailscale/tailscale-operator-install.ts
    `);
    return;
  }

  const options: InstallOptions = {
    namespace: args.namespace,
    apiServerProxy: args["api-server-proxy"],
    cleanupCredentials: args["cleanup-credentials"],
    dryRun: args["dry-run"],
    verbose: args.verbose,
  };

  const installer = new TailscaleOperatorInstaller(options);
  await installer.install();
}

if (import.meta.main) {
  await main();
}
