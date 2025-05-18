# AGENTS.md - Guiding Principles for Homelab Kubernetes Management

## 1. Purpose & Context
This document provides guidance for AI agents interacting with this repository. The primary goal of this repository is to declaratively manage a single Kubernetes cluster deployed in a homelab environment using Talos Linux.

The "code" primarily consists of **YAML configuration files** for:
- Talos Linux (OS configuration, node roles)
- Kubernetes (manifests, Custom Resources for Flux, HelmReleases, etc.)
- Supporting applications (cert-manager, ingress-nginx, external-dns, etc.)

Key technologies and tools used:
- **Talos Linux**: The underlying operating system for Kubernetes nodes.
- **Flux**: For GitOps, synchronizing the cluster state with this Git repository.
- **makejinja**: For templating configurations from `cluster.yaml` and `nodes.yaml`.
- **SOPS**: For encrypting secrets. All `*.sops.yaml` files must remain encrypted.
- **Taskfile.yaml**: Contains `task` commands for automation (e.g., `task configure`, `task bootstrap:apps`, `task reconcile`).

## 2. Core Principles for Modifying Configurations
- **Declarative First**: All changes to cluster configuration should be made by modifying the YAML files in this repository. Avoid direct `kubectl apply -f` or imperative `helm install/upgrade` commands unless explicitly for debugging or temporary measures.
- **GitOps Workflow**: Changes are committed to Git, and Flux applies them to the cluster.
- **Idempotency**: Ensure all configurations and scripts are idempotent.
- **Secrets Management**:
    - Any file containing sensitive data **must** be encrypted with SOPS.
    - The filename should typically be `secrets.sops.yaml` or similar.
    - Verify encryption after editing.
- **Templating Awareness**:
    - Core cluster and node configurations are defined in `cluster.yaml` and `nodes.yaml`.
    - The `task configure` command uses `makejinja` to render these into final Talos and Kubernetes manifests.
    - If changing `cluster.yaml` or `nodes.yaml`, always re-run `task configure` and commit the resulting changes.

## 3. Working with YAML
- **Style**: Maintain consistent indentation (usually 2 spaces). Use YAML linters if available or follow existing patterns in the repository.
- **Comments**: Add comments to explain non-obvious configurations.
- **HelmReleases**:
    - Pin chart versions (`spec.chart.spec.version`).
    - Pin image tags within `values` where applicable.
- **Kustomizations**: Ensure paths and dependencies are correctly defined.

## 4. Validation and Verification
Before committing changes, and after Flux syncs:
- **Flux Checks**:
    - Run `flux check` to ensure Flux components are healthy.
    - Check `flux get ks -A` and `flux get hr -A` for reconciliation status.
    - Use `task reconcile` to force a sync if needed.
- **YAML Linting**: If a linter is configured (e.g., via pre-commit), ensure it passes.
- **Application Health**: After deployment, check the status of relevant pods (`kubectl get pods -n <namespace>`), logs (`kubectl logs ...`), and events (`kubectl get events -n <namespace>`).
- **Cilium Status**: `cilium status`
- **Secrets**: Double-check that no unencrypted secrets are committed.

## 5. Taskfile Usage
Familiarize yourself with commands in `Taskfile.yaml` (referenced throughout `README.md`) for common operations like:
- `task init`: Initialize config files.
- `task configure`: Generate Talos and Kubernetes configs.
- `task bootstrap:talos`: Initial Talos installation.
- `task bootstrap:apps`: Deploy core applications via Flux.
- `task talos:generate-config`: (Re)generate Talos config.
- `task talos:apply-node IP=? MODE=?`: Apply config to a Talos node.
- `task talos:upgrade-node IP=?`: Upgrade Talos on a node.
- `task talos:upgrade-k8s`: Upgrade Kubernetes version.

## 6. Committing Changes
- Ensure all generated files (after `task configure` or similar) are included in the commit.
- Write clear and concise commit messages.

This AGENTS.md file should help guide an AI in making informed and correct changes to your homelab configuration.