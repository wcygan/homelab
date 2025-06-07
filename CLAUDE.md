# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is "Anton" - a production-grade Kubernetes homelab running on 3 MS-01 mini PCs using Talos Linux and Flux GitOps. The cluster implements patterns for automated deployment, monitoring, and security.

## Quick Reference

- **Initial Setup**: `task init` → `task configure` → `task bootstrap:talos` → `task bootstrap:apps`
- **Deploy App**: Add to `kubernetes/apps/{namespace}/` → `task reconcile`
- **Debug Issues**: `flux get hr -A` → `kubectl describe hr {name} -n {namespace}`
- **Upgrade Cluster**: `task talos:upgrade-node IP={ip}` → `task talos:upgrade-k8s`
- **Monitor Health**: `./scripts/k8s-health-check.ts --verbose`

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
- Two root Kustomizations: `cluster-meta` (repos) → `cluster-apps` (applications)
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

1. Create namespace directory: `kubernetes/apps/{namespace}/`
2. Create app structure:
   ```
   {namespace}/
   ├── {app-name}/
   │   ├── ks.yaml          # Flux Kustomization
   │   └── app/
   │       ├── kustomization.yaml
   │       └── helmrelease.yaml (or other resources)
   ```

3. Standard Kustomization pattern (`ks.yaml`):
   ```yaml
   apiVersion: kustomize.toolkit.fluxcd.io/v1
   kind: Kustomization
   metadata:
     name: &app {app-name}
     namespace: flux-system
   spec:
     targetNamespace: {namespace}
     commonMetadata:
       labels:
         app.kubernetes.io/name: *app
     interval: 1h
     retryInterval: 2m
     timeout: 10m
     prune: true
     wait: true
     path: ./kubernetes/apps/{namespace}/{app-name}/app
     sourceRef:
       kind: GitRepository
       name: flux-system
       namespace: flux-system
   ```

4. For HelmReleases, reference OCIRepository from `kubernetes/flux/meta/repos/`

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
- External services: use `external` ingress class + external-dns annotation (only used when EXPLICITLY STATED; default to `internal`)
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

### Legacy: SOPS (Deprecated)

SOPS encryption is only for existing/legacy secrets:
- Files matching `*.sops.yaml` are auto-encrypted
- Uses `age.key` in repo root
- **Do not use for new applications**

## Monitoring & Debugging

### Monitoring Tools
All scripts use Deno and require `--allow-all`:

- **k8s-health-check.ts**: Comprehensive cluster health monitoring
- **flux-deployment-check.ts**: GitOps deployment verification with `--watch` for real-time
- **flux-monitor.ts**: Real-time Flux resource monitoring
- **check-flux-config.ts**: Configuration best practices analyzer
- **validate-manifests.sh**: Pre-commit manifest validation

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
- Storage: Local-path provisioner on each node (Note: Additional storage options coming soon - evaluating Rook Ceph, Longhorn, MinIO, Garage, etc.)

### Namespace Organization
- `external-secrets`: All secret management (1Password, ESO)
- `network`: All ingress/DNS (internal/external nginx, cloudflared)
- `monitoring`: Prometheus stack, Grafana
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

## Configuration Analysis & Version Management

### AI Agent Guidelines for Chart Updates

When analyzing Kubernetes configurations and comparing against latest versions:

#### Guiding Principles
- **Declarative First**: All changes must be made via Git repository modifications, not direct kubectl/helm commands
- **Version Pinning**: Charts and images are intentionally pinned for predictable deployments
- **Impact Analysis**: Don't just update versions - analyze breaking changes, value schema changes, and compatibility
- **Follow Patterns**: Maintain consistency with existing repository structure and conventions
- **Safety First**: Distinguish between patch/minor/major upgrades with appropriate warnings

#### Analysis Workflow

**Phase 1: Discovery**
1. Locate HelmRelease at `kubernetes/apps/<namespace>/<app>/app/helmrelease.yaml`
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

This structured approach ensures safe, informed upgrades that align with GitOps principles.

## Advanced Troubleshooting & Debugging

### Systematic Troubleshooting Methodology

When Flux deployments fail, follow this top-down investigation approach starting with high-level abstractions and drilling down only when necessary.

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
- **Debug locally**: `flux build kustomization <name> -n flux-system --path ./kubernetes/apps/...`
- **Common causes**: YAML syntax errors, missing file references, invalid patches

**D. Dependency Errors**
- **Missing resources**: Application needs CRDs, secrets, or other dependencies
- **Fix**: Add `dependsOn` to Kustomization or HelmRelease:
  ```yaml
  spec:
    dependsOn:
      - name: dependency-kustomization-name
  ```

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