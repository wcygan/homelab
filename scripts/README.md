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

---

These scripts follow the [deno-utilities](../.cursor/rules/deno-utilities.mdc)
patterns established in this workspace and integrate seamlessly with your
existing Talos cluster management workflow.
