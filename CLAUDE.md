# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Repository Overview

This is "Anton" - a production-grade Kubernetes homelab running on 3 MS-01 mini
PCs using Talos Linux and Flux GitOps. The cluster implements patterns for
automated deployment, monitoring, and security.

## Quick Reference

- **Initial Setup**: `task init` → `task configure` → `task bootstrap:talos` →
  `task bootstrap:apps`
- **Deploy App**: Add to `kubernetes/apps/{namespace}/` → `task reconcile`
- **Debug Issues**: `flux get hr -A` →
  `kubectl describe hr {name} -n {namespace}`
- **Upgrade Cluster**: `task talos:upgrade-node IP={ip}` →
  `task talos:upgrade-k8s`
- **Monitor Health**: 
  - Interactive: `./scripts/k8s-health-check.ts --verbose`
  - Automated/CI: `./scripts/k8s-health-check.ts --json`
  - Full suite: `deno task test:all:json`

## Core Architecture

### Infrastructure Stack

- **OS**: Talos Linux (immutable, API-driven)
- **GitOps**: Flux v2.5.1 with hierarchical Kustomizations
- **CNI**: Cilium in kube-proxy replacement mode
- **Ingress**: Dual NGINX controllers (internal/external)
- **External Access**: Cloudflare tunnel via cloudflared
- **Storage**: Local Path Provisioner
- **Secrets**: 1Password + External Secrets Operator (preferred)

### GitOps Structure

- Two root Kustomizations: `cluster-meta` (repos) → `cluster-apps`
  (applications)
- Apps organized by namespace: `kubernetes/apps/{namespace}/{app-name}/`
- Each app has: `ks.yaml` (Kustomization) + `app/` directory
- HelmReleases use OCIRepository sources from `kubernetes/flux/meta/repos/`

## Common Development Commands

### Initial Cluster Setup (One-Time)

```bash
# Generate config from templates
task init

# Configure cluster (generates Talos/k8s configs)
task configure

# Bootstrap Talos
task bootstrap:talos

# Bootstrap apps (Cilium, Flux, core services)
task bootstrap:apps
```

### Talos Management

```bash
# Apply config to node
task talos:apply-node IP=192.168.1.98 MODE=auto

# Upgrade Talos on node
task talos:upgrade-node IP=192.168.1.98

# Upgrade Kubernetes
task talos:upgrade-k8s

# Reset cluster (destructive!)
task talos:reset
```

## Adding New Applications

### Pre-Deployment Verification

1. **Verify Helm chart exists and version is available**:
   ```bash
   helm search repo <repo>/<chart> --versions
   ```

2. **Check current Flux schema** (no `retryInterval` in v2):
   ```bash
   flux install --export | grep -A20 HelmRelease
   ```

3. **Validate dependencies exist**:
   ```bash
   flux get kustomization -A | grep <dependency-name>
   ```

### App Deployment Steps

1. Create namespace directory: `kubernetes/apps/{namespace}/`
2. Create app structure:
   ```
   {namespace}/
   ├── {app-name}/
   │   ├── ks.yaml          # Flux Kustomization
   │   └── app/
   │       ├── kustomization.yaml  # MUST specify namespace!
   │       └── helmrelease.yaml (or other resources)
   ```

3. Standard Kustomization pattern (`ks.yaml`):
   ```yaml
   apiVersion: kustomize.toolkit.fluxcd.io/v1
   kind: Kustomization
   metadata:
     name: &app { app-name }
     namespace: flux-system
   spec:
     targetNamespace: { namespace }
     commonMetadata:
       labels:
         app.kubernetes.io/name: *app
     interval: 1h
     # NO retryInterval field in Flux v2!
     timeout: 10m
     prune: true
     wait: true
     path: ./kubernetes/apps/{namespace}/{app-name}/app
     sourceRef:
       kind: GitRepository
       name: flux-system
       namespace: flux-system
     dependsOn: # Use actual namespace, not flux-system
       - name: <dependency-kustomization-name>
         namespace: <dependency-actual-namespace>
   ```

4. For HelmReleases, reference HelmRepository from
   `kubernetes/flux/meta/repos/`:
   - Add new repos to `kubernetes/flux/meta/repos/` if needed
   - Update `kubernetes/flux/meta/repos/kustomization.yaml` to include new repo
     file

## Key Patterns & Conventions

### Flux Intervals

- Critical infrastructure: `5m`
- Core services: `15m`
- Standard applications: `30m` to `1h`

### Resource Management

- Always specify resource requests/limits in HelmReleases
- Use finite retries (e.g., `retries: 3`) not infinite (`retries: -1`)
- Add health checks for critical services
- Include `wait: true` for dependencies

### Networking

- Internal services: use `internal` ingress class
- External services: use `external` ingress class + external-dns annotation
  (only used when EXPLICITLY STATED; default to `internal`)
- Split DNS via k8s-gateway for internal resolution

## Secrets Management

### Recommended Approach: 1Password + External Secrets Operator

For all new applications, use 1Password with External Secrets Operator:

1. Store secrets in 1Password vault
2. Create `OnePasswordItem` CR to sync secrets:
   ```yaml
   apiVersion: onepassword.com/v1
   kind: OnePasswordItem
   metadata:
     name: app-credentials
     namespace: app-namespace
   spec:
     itemPath: "vaults/Homelab/items/app-name"
   ```
3. Reference the synced Kubernetes Secret in your app

#### External Secrets v0.17.0+ Breaking Change

**IMPORTANT**: External Secrets Operator v0.17.0 removed support for `v1beta1` API.
- **Always use** `apiVersion: external-secrets.io/v1` (not v1beta1)
- **Applies to**: SecretStore, ClusterSecretStore, ExternalSecret, ClusterExternalSecret
- **Current version**: v0.17.0 (check with `kubectl get deployment -n external-secrets external-secrets -o jsonpath='{.spec.template.spec.containers[0].image}'`)

#### 1Password Integration

For 1Password secrets, use `ExternalSecret` resources with explicit field mapping:

```yaml
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: app-secrets
  namespace: default
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: onepassword-connect
    kind: ClusterSecretStore
  target:
    name: app-secrets
    creationPolicy: Owner
  data:
    # Map each field individually - field names must match exactly
    - secretKey: database-url      # Key in K8s secret
      remoteRef:
        key: app-config           # Item name in 1Password
        property: database_url    # Field name in 1Password (case-sensitive!)
    - secretKey: api-key
      remoteRef:
        key: app-config
        property: api_key
```

**Important Notes:**
- **Do NOT use** `OnePasswordItem` CRD unless you have 1Password Operator installed
- **Field names are case-sensitive** - must match exactly as defined in 1Password
- **Use setup script** for deployment: `./scripts/setup-1password-connect.ts`
- **Cannot store credentials in Git** - use manual deployment for Connect server

Example ClusterSecretStore for 1Password:
```yaml
apiVersion: external-secrets.io/v1
kind: ClusterSecretStore
metadata:
  name: onepassword-connect
spec:
  provider:
    onepassword:
      connectHost: http://onepassword-connect.external-secrets.svc.cluster.local:8080
      vaults:
        anton: 1  # Use your vault name
      auth:
        secretRef:
          connectTokenSecretRef:
            name: onepassword-connect-token
            namespace: external-secrets
            key: token
```

### Legacy: SOPS (Deprecated)

SOPS encryption is only for existing/legacy secrets:

- Files matching `*.sops.yaml` are auto-encrypted
- Uses `age.key` in repo root
- **Do not use for new applications**

## Monitoring & Debugging

### Talos Linux Troubleshooting

For detailed Talos-specific troubleshooting including node reboots, kubeconfig issues, and storage verification, see:
- **[Talos Troubleshooting Guide](docs/talos-linux/troubleshooting.md)** - Common issues and resolution steps

### Monitoring Tools

All scripts use Deno and require `--allow-all`. Each monitoring script supports
both human-readable and JSON output formats:

- **k8s-health-check.ts**: Comprehensive cluster health monitoring
  - Human-readable: `deno task health:monitor` or `./scripts/k8s-health-check.ts`
  - JSON output: `deno task health:monitor:json` or add `--json` flag
- **flux-deployment-check.ts**: GitOps deployment verification with `--watch`
  for real-time
- **flux-monitor.ts**: Real-time Flux resource monitoring
- **check-flux-config.ts**: Configuration best practices analyzer
  - Human-readable: `deno task check-flux-config`
  - JSON output: `deno task check-flux-config:json` or add `--json` flag
- **cluster-health-monitor.ts**: Cluster-wide health monitoring
  - Human-readable: `deno task health:monitor`
  - JSON output: `deno task health:monitor:json` (incompatible with `--watch`)
- **network-monitor.ts**: Network and ingress health monitoring
  - Human-readable: `deno task network:check`
  - JSON output: `deno task network:check:json`
- **storage-health-check.ts**: PVC usage and storage health
  - Human-readable: `deno task storage:check`
  - JSON output: `deno task storage:check:json`
- **test-all.ts**: Unified test suite for all monitoring scripts
  - Human-readable: `deno task test:all`
  - JSON output: `deno task test:all:json`
- **validate-manifests.sh**: Pre-commit manifest validation

### JSON Output Standards

All monitoring scripts that support JSON output follow a standardized schema:

```typescript
interface MonitoringResult {
  status: "healthy" | "warning" | "critical" | "error";
  timestamp: string;
  summary: {
    total: number;
    healthy: number;
    warnings: number;
    critical: number;
  };
  details: any; // Script-specific data
  issues: string[]; // Array of human-readable issues
}
```

Exit codes are standardized across all scripts:
- `0`: All checks passed (healthy)
- `1`: Warnings detected (degraded but functional)
- `2`: Critical issues detected (requires immediate attention)
- `3`: Execution error (script/connectivity failure)

### CI/CD Integration with JSON

For automated pipelines and monitoring integration:

```bash
# Run all tests with JSON output for parsing
deno task test:all:json > test-results.json

# Check specific component and parse results
./scripts/network-monitor.ts --json | jq '.status'

# Get only critical issues
./scripts/k8s-health-check.ts --json | jq '.issues[]'

# Check exit code for CI/CD decisions
./scripts/storage-health-check.ts --json
if [ $? -eq 2 ]; then
  echo "Critical storage issues detected!"
fi
```

### Common Debugging Commands

```bash
# Check Flux status
flux check
flux get all -A
flux get sources git -A

# Force reconciliation
task reconcile

# Check events and logs
kubectl -n flux-system get events --sort-by='.lastTimestamp'
kubectl -n {namespace} logs {pod-name} -f
kubectl -n {namespace} describe {kind} {name}
```

### Debugging Patterns

- Always check Flux dependencies first: `kubectl get kustomization -A`
- For app issues, trace: Kustomization → HelmRelease → Pods
- Check git sync: `flux get sources git -A`
- **Force resource recreation when cached**:
  ```bash
  kubectl delete helmchart -n flux-system <namespace>-<name>
  flux reconcile hr <name> -n <namespace> --with-source
  ```
- **Check correct dependency naming**:
  ```bash
  flux get kustomization -A | grep <pattern>
  # Dependencies use: name: <kustomization-name>, namespace: <actual-namespace>
  ```

## CI/CD Integration

- GitHub webhook configured for push-based reconciliation
- Renovate for automated dependency updates
- Pre-commit validation via `validate-manifests.sh`

## Common Operations

### Rolling Cluster Upgrades

1. Always upgrade Talos first: `task talos:upgrade-node IP=192.168.1.98`
2. Wait for node Ready before proceeding to next
3. Then upgrade Kubernetes: `task talos:upgrade-k8s`
4. Monitor with: `./scripts/cluster-health-monitor.ts`

### Emergency Recovery

- If Flux stuck: `flux suspend/resume kustomization <name> -n flux-system`
- If node NotReady: Check `talosctl -n <IP> dmesg` for boot issues
- If PVC unbound: Verify `local-path-provisioner` in storage namespace

## Anton Cluster Specifics

### Hardware Details

- Nodes: k8s-1 (192.168.1.98), k8s-2 (.99), k8s-3 (.100)
- All nodes are control-plane (no dedicated workers)
- Storage: 
  - **Primary**: Rook-Ceph distributed storage (default)
    - 6x 1TB NVMe drives (2 per node)
    - Storage class: `ceph-block` (default)
    - 3-way replication across hosts
  - **Legacy**: Local-path provisioner (for migration period)

### Namespace Organization

- `external-secrets`: All secret management (1Password, ESO)
- `network`: All ingress/DNS (internal/external nginx, cloudflared)
- `monitoring`: Prometheus stack, Grafana
- `storage`: Rook-Ceph operator, cluster, and toolbox
- `kubeai`: AI model serving infrastructure

## Development Workflow Integration

### Before Committing

1. Validate manifests: `./scripts/validate-manifests.sh`
2. Check Flux config: `./scripts/check-flux-config.ts`
3. For secrets: Use 1Password OnePasswordItem CRs

### After Changes

1. Force reconciliation: `task reconcile`
2. Monitor deployment: `./scripts/flux-monitor.ts`

### Common Pitfalls

- Missing `namespace: flux-system` in sourceRef → "GitRepository not found"
- Infinite retries in HelmRelease → Resource exhaustion
- Missing resource constraints → Pod scheduling issues
- Wrong ingress class → Service unreachable
- **Invalid `retryInterval` field** → Schema validation errors (removed in Flux
  v2)
- **Wrong dependency namespace** → Use actual namespace, not flux-system
- **Git commits required** → Flux only deploys committed changes
- **Chart version mismatch** → Always verify with `helm search repo`
- **Missing namespace in kustomization.yaml** → Resources created in wrong namespace
- **Ceph monitoring disabled** → Set `rulesNamespaceOverride: monitoring` when enabling Prometheus rules

## Rook-Ceph Storage Configuration

### Architecture Overview

- **Operator**: Manages Ceph lifecycle in `storage` namespace
- **Cluster**: Named "storage" to avoid clusterID mismatches
- **Block Storage**: Default via `ceph-block` storage class
- **Dashboard**: Accessible via Tailscale at `ceph-dashboard`
- **Monitoring**: Prometheus rules in `monitoring` namespace

### Critical Configuration

```yaml
# HelmRelease values for rook-ceph-cluster
monitoring:
  enabled: true
  createPrometheusRules: true
  rulesNamespaceOverride: monitoring  # Co-locate with other rules
cephClusterSpec:
  external:
    enable: false  # Required field for template validation
  clusterName: storage  # Must match for CSI provisioning
```

### Common Ceph Operations

```bash
# Check cluster health
kubectl -n storage exec deploy/rook-ceph-tools -- ceph status

# Monitor OSD status
kubectl -n storage exec deploy/rook-ceph-tools -- ceph osd status

# View storage usage
kubectl -n storage exec deploy/rook-ceph-tools -- ceph df
```

## Configuration Analysis & Version Management

### AI Agent Guidelines for Chart Updates

When analyzing Kubernetes configurations and comparing against latest versions:

#### Guiding Principles

- **Declarative First**: All changes must be made via Git repository
  modifications, not direct kubectl/helm commands
- **Version Pinning**: Charts and images are intentionally pinned for
  predictable deployments
- **Impact Analysis**: Don't just update versions - analyze breaking changes,
  value schema changes, and compatibility
- **Follow Patterns**: Maintain consistency with existing repository structure
  and conventions
- **Safety First**: Distinguish between patch/minor/major upgrades with
  appropriate warnings

#### Analysis Workflow

**Phase 1: Discovery**

1. Locate HelmRelease at
   `kubernetes/apps/<namespace>/<app>/app/helmrelease.yaml`
2. Extract: chart name, pinned version, sourceRef, custom values
3. Find source repository in `kubernetes/flux/meta/repos/`

**Phase 2: Comparison**

1. Determine latest stable versions (patch/minor/major)
2. Compare values.yaml between current and target versions
3. Identify deprecated/changed configuration keys
4. Check custom values compatibility with new schema
5. Review official changelogs for breaking changes

**Phase 3: Remediation**

1. Provide specific version upgrade recommendation
2. Explain impact level (patch/minor/major)
3. Supply exact YAML diffs for HelmRelease updates
4. Include any required values migration
5. Note container image updates if applicable

This structured approach ensures safe, informed upgrades that align with GitOps
principles.

## Advanced Troubleshooting & Debugging

### Systematic Troubleshooting Methodology

When Flux deployments fail, follow this top-down investigation approach starting
with high-level abstractions and drilling down only when necessary.

#### Step 1: Initial Triage - The Big Picture

**Always start here** to get system-wide health status:

```bash
# Critical first command - shows health of all Flux resources
flux get all -A

# Identify failing resources with Ready: False status
# Note the KIND, NAME, and NAMESPACE of any failures
```

#### Step 2: Isolate the Failure

Once you've identified a failing resource, investigate specifically:

```bash
# Most valuable debugging command - shows Conditions and Events
flux describe helmrelease <name> -n <namespace>
flux describe kustomization <name> -n flux-system

# Check responsible controller logs
kubectl logs -n flux-system deployment/helm-controller -f      # HelmRelease issues
kubectl logs -n flux-system deployment/kustomize-controller -f # Kustomization issues
kubectl logs -n flux-system deployment/source-controller -f    # Source issues

# Force reconciliation with fresh source fetch
flux reconcile helmrelease <name> -n <namespace> --with-source
```

#### Step 3: Common Failure Patterns

**A. Source Errors (GitRepository/HelmRepository Not Ready)**

- **Symptoms**: Sources not ready, "GitRepository not found" errors
- **Fix**: Check authentication, verify `namespace: flux-system` in sourceRef
- **Debug**: `flux describe gitrepository flux-system -n flux-system`

**B. Helm Chart Failures (HelmRelease Not Ready)**

- **Schema Validation**: Values don't match chart schema
  - Use: `helm show values <repo>/<chart> --version <version>`
- **Immutable Fields**: Resource cannot be updated
  - Solution: `flux suspend` → `kubectl delete` → `flux resume`
- **Hook Failures**: Check Job/Pod logs for failing post-install hooks

**C. Kustomize Build Failures (Kustomization Not Ready)**

- **Debug locally**:
  `flux build kustomization <name> -n flux-system --path ./kubernetes/apps/...`
- **Common causes**: YAML syntax errors, missing file references, invalid
  patches

**D. Dependency Errors**

- **Missing resources**: Application needs CRDs, secrets, or other dependencies
- **Fix**: Add `dependsOn` to Kustomization with correct namespace:
  ```yaml
  spec:
    dependsOn:
      - name: dependency-kustomization-name
        namespace: dependency-actual-namespace # NOT flux-system unless it really is
  ```
- **Common dependencies**:
  - `external-secrets` in namespace `external-secrets`
  - `cert-manager` in namespace `cert-manager`
  - `local-path-provisioner` in namespace `storage`

**E. SOPS Secret Decryption**

- **Check**: `sops-age` secret exists in `flux-system` namespace
- **Validate**: `sops -d <file.sops.yaml>` works locally
- **Verify**: `.sops.yaml` configuration is correct

#### Step 4: Advanced Recovery Techniques

**Suspend and Resume (Soft Reset)**

```bash
flux suspend kustomization <name> -n flux-system
# Manual fixes if needed
flux resume kustomization <name> -n flux-system
```

**Trace Resource Origin**

```bash
flux trace --api-version apps/v1 --kind Deployment --name <name> -n <namespace>
```

**Force Chart Re-fetch**

```bash
# Delete cached HelmChart to force complete re-fetch
kubectl delete helmchart -n flux-system <namespace>-<helmrelease-name>
flux reconcile helmrelease <name> -n <namespace> --with-source
```

**Emergency Debugging Commands**

```bash
# Check all events across cluster
kubectl get events -A --sort-by='.lastTimestamp'

# Monitor real-time Flux activity
flux logs --follow --tail=50

# Validate configuration before applying
./scripts/validate-manifests.sh
./scripts/check-flux-config.ts
```

**Talos-Specific Issues**

For Talos Linux specific issues (node access, kubeconfig problems, storage verification):
- See [Talos Troubleshooting Guide](docs/talos-linux/troubleshooting.md)

## App Deployment Debugging Workflow

When deploying a new app via GitOps, follow this systematic approach:

### 1. Initial Deployment

```bash
# Commit and push changes first - Flux only deploys from Git
git add kubernetes/apps/<namespace>/
git commit -m "feat: add <app-name> deployment"
git push

# Force immediate reconciliation
flux reconcile source git flux-system
flux reconcile kustomization cluster-apps
```

### 2. Check Deployment Status

```bash
# Check if namespace and kustomization created
kubectl get namespace <namespace>
flux get kustomization -A | grep <app-name>

# Check HelmRelease status
flux get hr -A | grep <app-name>

# Check if pods are running
kubectl get pods -n <namespace>
```

### 3. Common Fixes

**HelmChart not found or wrong version**:

```bash
# Verify chart exists
helm repo add <repo> <url>
helm search repo <repo>/<chart> --versions

# Delete cached HelmChart to force refresh
kubectl delete helmchart -n flux-system <namespace>-<app-name>
```

**Stale resource after changes**:

```bash
# Delete the resource to force recreation
kubectl delete helmrelease <app-name> -n <namespace>
flux reconcile kustomization cluster-apps
```

**Schema validation errors**:

- Remove `retryInterval` from Kustomization/HelmRelease (not valid in Flux v2)
- Check HelmRelease values against chart schema
- Verify all required fields are present

## AI Agent Preferences for Monitoring

When asked to check system health or monitor the cluster:

1. **Use JSON output for automated parsing**:
   - Prefer `--json` flag on monitoring scripts for structured data
   - Parse JSON output to provide concise summaries
   - Example: `./scripts/network-monitor.ts --json | jq '.summary'`

2. **Combine multiple checks efficiently**:
   ```bash
   # Run comprehensive test suite with JSON output
   deno task test:all:json
   
   # Or run specific checks for targeted analysis
   ./scripts/k8s-health-check.ts --json
   ./scripts/storage-health-check.ts --json --check-provisioner
   ```

3. **Interpret exit codes correctly**:
   - Exit code 0: System healthy
   - Exit code 1: Non-critical warnings
   - Exit code 2: Critical issues requiring attention
   - Exit code 3: Script execution errors

4. **Summarize issues concisely**:
   - Extract critical issues from JSON `.issues` array
   - Group related problems together
   - Prioritize actionable items

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
