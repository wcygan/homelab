# Kubernetes Cluster Monitoring Scripts

This directory contains Deno-based scripts for monitoring and verifying your
Talos Kubernetes cluster and GitOps deployments.

## Scripts Overview

### 🏥 `k8s-health-check.ts` - Cluster Health Monitoring

Comprehensive health monitoring for your Kubernetes cluster, checking nodes,
pods, and system components.

**Features:**

- Node health and readiness verification
- Critical namespace pod monitoring (`kube-system`, `flux-system`,
  `cert-manager`, `external-secrets`)
- Storage class verification
- High restart count detection
- Continuous monitoring mode
- Detailed verbose output

**Usage:**

```bash
# Basic health check
./scripts/k8s-health-check.ts

# Detailed output
./scripts/k8s-health-check.ts --verbose

# Check specific namespace only
./scripts/k8s-health-check.ts -n flux-system

# Continuous monitoring every 30 seconds
./scripts/k8s-health-check.ts -c -i 30

# Help
./scripts/k8s-health-check.ts --help
```

### 🔄 `flux-deployment-check.ts` - GitOps Deployment Verification

Monitors and verifies Flux GitOps deployments, checking the health of
GitRepositories, Kustomizations, and HelmReleases.

**Features:**

- Flux installation verification
- GitRepository source health checking
- Kustomization deployment status
- HelmRelease deployment status
- Automatic reconciliation in watch mode
- Suspended resource detection
- Namespace-grouped reporting

**Usage:**

```bash
# Basic deployment check
./scripts/flux-deployment-check.ts

# Detailed output
./scripts/flux-deployment-check.ts --verbose

# Watch mode with reconciliation every 2 minutes
./scripts/flux-deployment-check.ts -w -i 120

# Continuous monitoring without reconciliation
./scripts/flux-deployment-check.ts -c -i 60

# Help
./scripts/flux-deployment-check.ts --help
```

## Prerequisites

### Required Tools

- **Deno**: For running the TypeScript scripts
- **kubectl**: Configured with access to your cluster
- **flux**: Flux CLI tool (for GitOps verification script)

### Permissions

Both scripts require:

- `--allow-all` Deno permissions (for subprocess execution)
- Valid kubeconfig with cluster access
- Appropriate RBAC permissions to read cluster resources

## Integration with Your Cluster

These scripts are designed specifically for your Talos Kubernetes cluster setup
and understand:

- **Critical Namespaces**: Monitors `kube-system`, `flux-system`,
  `cert-manager`, `external-secrets`
- **Flux Resources**: Checks GitRepositories, Kustomizations, and HelmReleases
- **Node Roles**: Understands control-plane and worker node roles
- **Talos OS**: Recognizes Talos-specific node information

## Exit Codes

Both scripts follow standard Unix exit code conventions:

- `0`: Success - all checks passed
- `1`: Failure - issues detected or script error

This makes them suitable for use in CI/CD pipelines, monitoring systems, or
automation scripts.

## Examples

### Basic Monitoring Workflow

```bash
# Quick cluster health check
./scripts/k8s-health-check.ts

# If issues found, check GitOps deployments
./scripts/flux-deployment-check.ts --verbose

# For ongoing monitoring
./scripts/k8s-health-check.ts -c -i 60 &
./scripts/flux-deployment-check.ts -w -i 300 &
```

### CI/CD Integration

```bash
# In your CI pipeline
if ! ./scripts/k8s-health-check.ts; then
  echo "Cluster health check failed"
  exit 1
fi

if ! ./scripts/flux-deployment-check.ts; then
  echo "GitOps deployment verification failed"
  exit 1
fi

echo "All checks passed!"
```

### Troubleshooting Mode

```bash
# Verbose health check with specific namespace focus
./scripts/k8s-health-check.ts --verbose -n kube-system

# Force Flux reconciliation and monitor
./scripts/flux-deployment-check.ts -w -i 30 --verbose
```

## Implementation Details

- **Language**: TypeScript running on Deno
- **Architecture**: Subprocess-based using `kubectl` and `flux` CLI tools
- **Error Handling**: Comprehensive error handling with detailed logging
- **Performance**: Efficient parallel operations where possible
- **Compatibility**: Works with standard Kubernetes and Flux installations

## Future Enhancements

Potential improvements for these scripts:

- Slack/Discord notification integration
- Prometheus metrics export
- Custom resource definition monitoring
- Network policy verification
- Resource usage analysis
- Historical trend tracking

## Deno and Dax Patterns

### Cross-Platform Command Execution

All scripts use [Dax](https://github.com/dsherret/dax) for cross-platform shell command execution. Key patterns:

#### Basic Command Execution

```typescript
import { $ } from "https://deno.land/x/dax@0.35.0/mod.ts";

// Simple command
await $`kubectl get pods`;

// Capture output
const result = await $`kubectl get nodes -o json`.text();

// Quiet execution (suppress output)
await $`helm repo update`.quiet();
```

#### Handling Pipes and Complex Commands

Dax doesn't support shell pipes directly. Instead, use these patterns:

```typescript
// ❌ This won't work
await $`kubectl get pods | grep Running`;

// ✅ Use Dax chaining
const pods = await $`kubectl get pods`.text();
const runningPods = pods.split('\n').filter(line => line.includes('Running'));

// ✅ Or use .lines() for line processing
const lines = await $`kubectl get pods`.lines();

// ✅ For stdin redirection
const yaml = await $`kubectl create secret generic test --dry-run=client -o yaml`.text();
await $`kubectl apply -f -`.stdinText(yaml);
```

#### Error Handling

```typescript
try {
  await $`kubectl version --client -o json`.quiet();
} catch (error) {
  console.error("kubectl not found");
  Deno.exit(1);
}
```

#### Environment Variables

```typescript
// Dax inherits Deno's environment
Deno.env.set("KUBECONFIG", "/path/to/config");

// Or use command-specific env
await $`kubectl get pods`.env({ NAMESPACE: "default" });
```

### Common Pitfalls and Solutions

1. **PATH Issues**: Dax uses Deno's environment. If commands aren't found:
   ```typescript
   // Check current PATH
   console.log(Deno.env.get("PATH"));
   
   // Ensure command is available
   const kubectlPath = await $`which kubectl`.text();
   ```

2. **Command Flags**: Some kubectl flags have changed:
   ```typescript
   // ❌ Old flag that doesn't exist
   await $`kubectl version --client --short`;
   
   // ✅ Use supported flags
   await $`kubectl version --client -o json`;
   ```

3. **JSON Parsing**: Use built-in JSON support:
   ```typescript
   const nodes = await $`kubectl get nodes -o json`.json();
   console.log(nodes.items.length);
   ```

4. **Parallel Execution**: Run commands concurrently:
   ```typescript
   const [pods, nodes, namespaces] = await Promise.all([
     $`kubectl get pods -o json`.json(),
     $`kubectl get nodes -o json`.json(),
     $`kubectl get namespaces -o json`.json(),
   ]);
   ```

### Script Structure Template

```typescript
#!/usr/bin/env deno run --allow-all

import { $ } from "https://deno.land/x/dax@0.35.0/mod.ts";
import { parse } from "https://deno.land/std@0.224.0/flags/mod.ts";

// Parse command line arguments
const args = parse(Deno.args, {
  boolean: ["verbose", "help"],
  string: ["namespace"],
  default: { verbose: false },
});

// ANSI colors for output
const colors = {
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
};

// Main execution
if (import.meta.main) {
  try {
    // Your script logic here
    const result = await $`kubectl get pods -n ${args.namespace || "default"}`.text();
    console.log(colors.green("✅ Success"));
  } catch (error) {
    console.error(colors.red(`❌ Error: ${error.message}`));
    Deno.exit(1);
  }
}
```

---

These scripts follow the [deno-utilities](../.cursor/rules/deno-utilities.mdc)
patterns established in this workspace and integrate seamlessly with your
existing Talos cluster management workflow.
