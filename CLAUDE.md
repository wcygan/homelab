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