#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run

/**
 * tailscale-operator-install - Main Tailscale Kubernetes Operator Installer
 *
 * This is the primary script for installing the Tailscale Kubernetes Operator.
 * It orchestrates the complete workflow including credential setup, validation,
 * and operator deployment with secure credential management.
 *
 * Usage: deno run --allow-all scripts/tailscale-operator-install.ts [options]
 */

import { parseArgs } from "@std/cli";

const HELPER_SCRIPTS = {
  setup: "scripts/tailscale/setup-tailscale-credentials.ts",
  install: "scripts/tailscale/install-tailscale-operator.ts"
} as const;

async function runHelperScript(scriptPath: string, args: string[] = []): Promise<boolean> {
  try {
    const cmd = new Deno.Command("deno", {
      args: ["run", "--allow-all", scriptPath, ...args],
      stdout: "inherit",
      stderr: "inherit",
      stdin: "inherit"
    });

    const { code } = await cmd.output();
    return code === 0;
  } catch (error) {
    console.error(`Failed to run ${scriptPath}:`, (error as Error).message);
    return false;
  }
}

async function checkPrerequisites(): Promise<boolean> {
  console.log("🔍 Checking prerequisites...\n");

  const checks = [
    { name: "deno", cmd: ["deno", "--version"] },
    { name: "helm", cmd: ["helm", "version", "--client"] },
    { name: "kubectl", cmd: ["kubectl", "version", "--client"] }
  ];

  let allGood = true;

  for (const check of checks) {
    try {
      const cmd = new Deno.Command(check.cmd[0], {
        args: check.cmd.slice(1),
        stdout: "null",
        stderr: "null"
      });

      const { code } = await cmd.output();

      if (code === 0) {
        console.log(`  ✅ ${check.name} is available`);
      } else {
        console.log(`  ❌ ${check.name} failed to run`);
        allGood = false;
      }
    } catch {
      console.log(`  ❌ ${check.name} not found`);
      allGood = false;
    }
  }

  if (!allGood) {
    console.log("\n❌ Some prerequisites are missing. Please install:");
    console.log("  - Deno: https://deno.land/manual/getting_started/installation");
    console.log("  - Helm: https://helm.sh/docs/intro/install/");
    console.log("  - kubectl: https://kubernetes.io/docs/tasks/tools/");
  }

  return allGood;
}

async function isTailscaleOperatorReady(): Promise<boolean> {
  try {
    const cmd = new Deno.Command("kubectl", {
      args: [
        "get",
        "deployment",
        "operator",
        "-n",
        "tailscale",
        "-o",
        "json"
      ],
      stdout: "piped",
      stderr: "null"
    });
    const { code, stdout } = await cmd.output();
    if (code !== 0) {
      // Deployment not found or error
      return false;
    }
    const json = JSON.parse(new TextDecoder().decode(stdout));
    const readyReplicas = json.status?.readyReplicas || 0;
    const desiredReplicas = json.spec?.replicas || 1;
    // Consider ready if at least one replica is ready (or all desired replicas are ready)
    return readyReplicas >= Math.min(desiredReplicas, 1);
  } catch {
    // Any error: treat as not ready
    return false;
  }
}

async function installTailscaleOperator(options: { dryRun: boolean; skipCredentials: boolean }): Promise<void> {
  console.log("🚀 Tailscale Kubernetes Operator Installation\n");
  console.log("This script will install the Tailscale Kubernetes Operator with secure");
  console.log("credential management and complete environment validation.\n");

  // Step 1: Check prerequisites
  const prereqsOk = await checkPrerequisites();
  if (!prereqsOk) {
    console.log("\n❌ Cannot proceed without required tools.");
    console.log("\nPlease install the missing prerequisites and try again.");
    return;
  }

  // Step 1.5: Check if operator is already installed and ready (before user prompt)
  const alreadyReady = await isTailscaleOperatorReady();
  if (alreadyReady) {
    console.log("\n✅ Tailscale Operator is already installed and ready in the cluster. Exiting.\n");
    return;
  }

  console.log("\n" + "=".repeat(60));
  console.log("📋 INSTALLATION WORKFLOW");
  console.log("=".repeat(60));
  console.log("1. Set up OAuth credentials (interactive)");
  console.log("2. Install Tailscale Kubernetes Operator");
  console.log("3. Configure kubeconfig for Tailscale access");
  console.log("4. Clean up credential files");
  console.log("=".repeat(60) + "\n");

  // Step 2: Setup credentials (unless skipped)
  if (!options.skipCredentials) {
    console.log("📋 Step 1: Setting up OAuth credentials...\n");
    console.log("You'll need to create OAuth credentials in the Tailscale admin console.");
    console.log("The setup script will guide you through:");
    console.log("• Visiting the Tailscale admin console");
    console.log("• Creating an OAuth client");
    console.log("• Securely storing the credentials\n");

    const proceed = confirm("Ready to set up OAuth credentials?");
    if (!proceed) {
      console.log("❌ Installation cancelled by user.");
      return;
    }

    console.log("\n🔧 Running credential setup helper...");
    const credentialsOk = await runHelperScript(HELPER_SCRIPTS.setup);
    if (!credentialsOk) {
      console.log("\n❌ Credential setup failed. Cannot proceed with installation.");
      console.log("Please fix the issues above and run this script again.");
      return;
    }

    console.log("\n✅ OAuth credentials configured successfully!\n");
  } else {
    console.log("⏭️  Skipping credential setup (--skip-credentials)\n");
  }

  // Step 3: Install the operator
  console.log("📋 Step 2: Installing Tailscale Kubernetes Operator...\n");

  const installArgs: string[] = [];
  if (options.dryRun) {
    installArgs.push("--dry-run");
    console.log("🔍 Running in dry-run mode (no actual changes will be made)\n");
  }

  console.log("🔧 Running installation helper...");
  const installOk = await runHelperScript(HELPER_SCRIPTS.install, installArgs);
  if (!installOk) {
    console.log("\n❌ Installation failed.");
    console.log("Please check the error messages above and resolve any issues.");
    return;
  }

  if (options.dryRun) {
    console.log("\n✅ Dry run completed successfully!");
    console.log("\nTo perform the actual installation:");
    console.log("  ./scripts/tailscale/tailscale-operator-install.ts");
  } else {
    console.log("\n🎉 Installation completed successfully!");

    // Step 4: Next steps
    console.log("\n" + "=".repeat(60));
    console.log("🚀 NEXT STEPS");
    console.log("=".repeat(60));
    console.log("Your Tailscale Kubernetes Operator is now installed and ready to use!");
    console.log("");
    console.log("1. Verify the installation:");
    console.log("   kubectl get pods -n tailscale");
    console.log("");
    console.log("2. Check operator logs:");
    console.log("   kubectl logs -n tailscale -l app=tailscale-operator");
    console.log("");
    console.log("3. Test Tailscale access to your cluster:");
    console.log("   kubectl cluster-info");
    console.log("");
    console.log("4. Expose your first service to Tailscale:");
    console.log("   kubectl annotate service my-service tailscale.com/expose=true");
    console.log("");
    console.log("📚 Documentation and examples:");
    console.log("   • Tailscale K8s Operator: https://tailscale.com/kb/1185/kubernetes");
    console.log("=".repeat(60));
  }
}

async function main(): Promise<void> {
  const args = parseArgs(Deno.args, {
    boolean: ["dry-run", "skip-credentials", "help", "version"],
    alias: { d: "dry-run", s: "skip-credentials", h: "help", v: "version" }
  });

  if (args.version) {
    console.log("Tailscale Kubernetes Operator Installer v1.0.0");
    console.log("https://tailscale.com/kb/1185/kubernetes");
    return;
  }

  if (args.help) {
    console.log(`
Tailscale Kubernetes Operator Installer

DESCRIPTION:
    Primary installation script for the Tailscale Kubernetes Operator.
    Provides a complete, secure, and automated installation workflow.

USAGE:
    tailscale-operator-install.ts [OPTIONS]

OPTIONS:
    -d, --dry-run              Show what would be done without making changes
    -s, --skip-credentials     Skip the credential setup step
    -v, --version              Show version information
    -h, --help                 Show this help

WORKFLOW:
    This script orchestrates the complete installation process:

    1. Prerequisites checking (deno, helm, kubectl)
    2. Interactive OAuth credential setup
    3. Tailscale operator installation via Helm
    4. Kubeconfig configuration for Tailscale access
    5. Automatic credential cleanup

EXAMPLES:
    # Complete installation (recommended)
    ./scripts/tailscale/tailscale-operator-install.ts

    # Dry run to see what would happen
    ./scripts/tailscale/tailscale-operator-install.ts --dry-run

    # Skip credential setup (if already configured)
    ./scripts/tailscale/tailscale-operator-install.ts --skip-credentials

HELPER SCRIPTS:
    This main script uses the following helper scripts that can also
    be run independently if needed:

    • setup-tailscale-credentials.ts - OAuth credential setup
    • install-tailscale-operator.ts  - Core installation logic

REQUIREMENTS:
    • Deno runtime
    • Helm v3+
    • kubectl with cluster access
    • Tailscale account with admin access
    `);
    return;
  }

  const options = {
    dryRun: args["dry-run"],
    skipCredentials: args["skip-credentials"]
  };

  await installTailscaleOperator(options);
}

if (import.meta.main) {
  await main();
}