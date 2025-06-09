#!/usr/bin/env deno run --allow-all

/**
 * Setup script for 1Password Connect
 * 
 * This script helps deploy 1Password Connect with proper credentials
 * while maintaining GitOps for the rest of the configuration.
 */

import { $ } from "https://deno.land/x/dax@0.35.0/mod.ts";
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { exists } from "https://deno.land/std@0.224.0/fs/mod.ts";
import { parse } from "https://deno.land/std@0.224.0/flags/mod.ts";

const args = parse(Deno.args, {
  string: ["credentials", "token", "namespace"],
  boolean: ["help", "uninstall"],
  default: {
    namespace: "external-secrets",
  },
});

if (args.help) {
  console.log(`
Usage: setup-1password-connect.ts [options]

Options:
  --credentials <path>  Path to 1password-credentials.json file
  --token <path>        Path to API token file (or --token=<value> for direct token)
  --namespace <name>    Kubernetes namespace (default: external-secrets)
  --uninstall          Uninstall 1Password Connect
  --help               Show this help message

Examples:
  # Install with credential files
  ./setup-1password-connect.ts --credentials ~/Downloads/1password-credentials.json --token ~/Downloads/1password-api-token.txt

  # Install with direct token
  ./setup-1password-connect.ts --credentials ~/Downloads/1password-credentials.json --token="eyJhbGc..."
  
  # Uninstall
  ./setup-1password-connect.ts --uninstall
`);
  Deno.exit(0);
}

// ANSI colors
const colors = {
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  blue: (text: string) => `\x1b[34m${text}\x1b[0m`,
  bold: (text: string) => `\x1b[1m${text}\x1b[0m`,
};

async function checkPrerequisites() {
  console.log(colors.blue("🔍 Checking prerequisites..."));
  
  // Check kubectl
  try {
    await $`kubectl version --client -o json`.quiet();
  } catch {
    console.error(colors.red("❌ kubectl not found. Please install kubectl first."));
    Deno.exit(1);
  }

  // Check helm
  try {
    await $`helm version`.quiet();
  } catch {
    console.error(colors.red("❌ helm not found. Please install helm first."));
    Deno.exit(1);
  }

  // Check if connected to cluster
  try {
    await $`kubectl cluster-info`.quiet();
  } catch {
    console.error(colors.red("❌ Not connected to a Kubernetes cluster."));
    Deno.exit(1);
  }

  // Check if namespace exists
  try {
    await $`kubectl get namespace ${args.namespace}`.quiet();
  } catch {
    console.log(colors.yellow(`⚠️  Namespace ${args.namespace} doesn't exist. Creating it...`));
    await $`kubectl create namespace ${args.namespace}`;
  }
  
  console.log(colors.green("✅ Prerequisites check passed"));
}

async function addHelmRepo() {
  console.log(colors.blue("📦 Adding 1Password Helm repository..."));
  
  try {
    // Try to add the repo, ignore error if it already exists
    await $`helm repo add 1password https://1password.github.io/connect-helm-charts`.quiet();
  } catch {
    // Repo might already exist, that's ok
  }
  
  try {
    await $`helm repo update 1password`;
    console.log(colors.green("✅ Helm repository updated"));
  } catch (error) {
    console.error(colors.red(`❌ Failed to update Helm repository: ${error}`));
    Deno.exit(1);
  }
}

async function uninstall() {
  console.log(colors.yellow("🗑️  Uninstalling 1Password Connect..."));
  
  try {
    // Delete Helm release
    await $`helm uninstall onepassword-connect -n ${args.namespace}`.quiet();
    console.log(colors.green("✅ Helm release uninstalled"));
  } catch {
    console.log(colors.yellow("⚠️  Helm release not found or already uninstalled"));
  }

  try {
    // Delete secrets
    await $`kubectl delete secret -n ${args.namespace} onepassword-connect-token op-credentials`.quiet();
    console.log(colors.green("✅ Secrets deleted"));
  } catch {
    console.log(colors.yellow("⚠️  Some secrets not found or already deleted"));
  }

  try {
    // Delete ClusterSecretStore
    await $`kubectl delete clustersecretstore onepassword-connect`.quiet();
    console.log(colors.green("✅ ClusterSecretStore deleted"));
  } catch {
    console.log(colors.yellow("⚠️  ClusterSecretStore not found or already deleted"));
  }
  
  console.log(colors.green("✅ Uninstall complete"));
}

async function install() {
  // Validate inputs
  if (!args.credentials) {
    console.error(colors.red("❌ --credentials flag is required"));
    Deno.exit(1);
  }

  if (!args.token) {
    console.error(colors.red("❌ --token flag is required"));
    Deno.exit(1);
  }

  // Check if credentials file exists
  if (!await exists(args.credentials)) {
    console.error(colors.red(`❌ Credentials file not found: ${args.credentials}`));
    Deno.exit(1);
  }

  // Get token value
  let tokenValue: string;
  if (await exists(args.token)) {
    // Token is a file path
    tokenValue = (await Deno.readTextFile(args.token)).trim();
  } else {
    // Token is provided directly
    tokenValue = args.token;
  }

  console.log(colors.blue("🚀 Installing 1Password Connect..."));

  // Create token secret
  console.log(colors.blue("🔐 Creating token secret..."));
  try {
    // First create the YAML
    const secretYaml = await $`kubectl create secret generic onepassword-connect-token \
      --from-literal=token=${tokenValue} \
      --namespace=${args.namespace} \
      --dry-run=client -o yaml`.text();
    
    // Then apply it
    await $`kubectl apply -f -`.stdinText(secretYaml);
    console.log(colors.green("✅ Token secret created"));
  } catch (error) {
    console.error(colors.red(`❌ Failed to create token secret: ${error}`));
    Deno.exit(1);
  }

  // Install Helm chart
  console.log(colors.blue("📊 Installing Helm chart..."));
  try {
    await $`helm upgrade --install onepassword-connect 1password/connect \
      --namespace ${args.namespace} \
      --set-file connect.credentials=${args.credentials} \
      --set connect.serviceType=ClusterIP \
      --set connect.resources.requests.cpu=10m \
      --set connect.resources.requests.memory=16Mi \
      --set connect.resources.limits.memory=64Mi \
      --wait`;
    console.log(colors.green("✅ Helm chart installed"));
  } catch (error) {
    console.error(colors.red(`❌ Failed to install Helm chart: ${error}`));
    Deno.exit(1);
  }

  // Wait for deployment to be ready
  console.log(colors.blue("⏳ Waiting for deployment to be ready..."));
  try {
    await $`kubectl wait --for=condition=available --timeout=120s \
      deployment/onepassword-connect -n ${args.namespace}`;
    console.log(colors.green("✅ Deployment is ready"));
  } catch (error) {
    console.error(colors.red(`❌ Deployment failed to become ready: ${error}`));
    Deno.exit(1);
  }

  // Create ClusterSecretStore
  console.log(colors.blue("🏪 Creating ClusterSecretStore..."));
  const clusterSecretStore = `
apiVersion: external-secrets.io/v1
kind: ClusterSecretStore
metadata:
  name: onepassword-connect
spec:
  provider:
    onepassword:
      connectHost: http://onepassword-connect.${args.namespace}.svc.cluster.local:8080
      vaults:
        anton: 1
      auth:
        secretRef:
          connectTokenSecretRef:
            name: onepassword-connect-token
            namespace: ${args.namespace}
            key: token
`;

  try {
    await $`kubectl apply -f -`.stdinText(clusterSecretStore);
    console.log(colors.green("✅ ClusterSecretStore created"));
  } catch (error) {
    console.error(colors.red(`❌ Failed to create ClusterSecretStore: ${error}`));
    Deno.exit(1);
  }

  // Check ClusterSecretStore status
  console.log(colors.blue("🔍 Checking ClusterSecretStore status..."));
  await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
  
  const result = await $`kubectl get clustersecretstore onepassword-connect -o json`.json();
  const status = result.status?.conditions?.[0]?.status;
  const message = result.status?.conditions?.[0]?.message;

  if (status === "True") {
    console.log(colors.green("✅ ClusterSecretStore is ready!"));
  } else {
    console.log(colors.yellow(`⚠️  ClusterSecretStore status: ${message || "Not ready"}`));
    console.log(colors.yellow("   You may need to check the logs for more details:"));
    console.log(colors.yellow(`   kubectl logs -n ${args.namespace} deployment/onepassword-connect`));
  }

  console.log(colors.bold(colors.green("\n✨ 1Password Connect setup complete!")));
  console.log("\nNext steps:");
  console.log("1. Verify the ClusterSecretStore is ready:");
  console.log(colors.blue(`   kubectl get clustersecretstore onepassword-connect`));
  console.log("2. Create your OnePasswordItem resources to sync secrets");
  console.log("3. Check the test secret guide at: docs/secrets/test-secret.md");
}

// Main execution
if (import.meta.main) {
  try {
    await checkPrerequisites();
    
    if (args.uninstall) {
      await uninstall();
    } else {
      await addHelmRepo();
      await install();
    }
  } catch (error) {
    console.error(colors.red(`\n❌ Script failed: ${error}`));
    Deno.exit(1);
  }
}