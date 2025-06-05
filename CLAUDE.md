# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is "Anton" - a production-grade Kubernetes homelab running on 3 MS-01 mini PCs using Talos Linux and Flux GitOps. The cluster implements patterns for automated deployment, monitoring, and security.

## Core Architecture

### Infrastructure Stack
- **OS**: Talos Linux (immutable, API-driven)
- **GitOps**: Flux v2.5.1 with hierarchical Kustomizations
- **CNI**: Cilium in kube-proxy replacement mode
- **Ingress**: Dual NGINX controllers (internal/external)
- **External Access**: Cloudflare tunnel via cloudflared
- **Storage**: Local Path Provisioner
- **Secrets**:  External Secrets with 1Password (and deprecated: SOPS with age encryption)

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

### Daily Operations
```bash
# Force Flux reconciliation
task reconcile
# OR
flux --namespace flux-system reconcile kustomization flux-system --with-source

# Monitor cluster health
./scripts/k8s-health-check.ts --verbose

# Monitor Flux deployments
./scripts/flux-deployment-check.ts --watch

# Check Flux status
flux check
flux get sources git -A
flux get ks -A
flux get hr -A
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

### Validation & Testing
```bash
# Validate Kubernetes manifests
./scripts/validate-manifests.sh

# Check Flux configuration health
./scripts/check-flux-config.ts
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

### Security
- External secrets via 1Password Connect
- Non-root containers with security contexts

### Networking
- Internal services: use `internal` ingress class 
- External services: use `external` ingress class + external-dns annotation (only used when EXPLICITLY STATED; default to `internal`)
- Split DNS via k8s-gateway for internal resolution

## Monitoring Scripts

All scripts use Deno and require `--allow-all`:

- **k8s-health-check.ts**: Comprehensive cluster health monitoring
- **flux-deployment-check.ts**: GitOps deployment verification
- **flux-monitor.ts**: Real-time Flux resource monitoring
- **check-flux-config.ts**: Configuration best practices analyzer
- **validate-manifests.sh**: Pre-commit manifest validation

## SOPS Encryption

Files matching `*.sops.yaml` or `*.sops.yml` are automatically encrypted:
- Encryption key: `age.key` in repo root
- Decryption handled by Flux via `sops-age` secret

## Debugging Tips

1. Check Flux events: `kubectl -n flux-system get events --sort-by='.lastTimestamp'`
2. View pod logs: `kubectl -n {namespace} logs {pod-name} -f`
3. Describe failed resources: `kubectl -n {namespace} describe {kind} {name}`
4. Force reconciliation: `flux reconcile {kind} {name} -n {namespace}`
5. Check git sync: `flux get sources git -A`

## CI/CD Integration

- GitHub webhook configured for push-based reconciliation
- Renovate for automated dependency updates
- Pre-commit validation via `validate-manifests.sh`