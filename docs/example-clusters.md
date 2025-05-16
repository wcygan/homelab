# Example Clusters

This document summarizes the shared structure and conventions used by the two example Flux-managed Talos/Kubernetes clusters.

## Common Patterns

- **Per-app directories** under `kubernetes/apps/<namespace>/<app>/`, each containing:
  - A top-level `kustomization.yaml` defining a Flux `Kustomization` CR (with `prune: true`, `interval`, `sourceRef: flux-system`, `path`, `targetNamespace`).
  - An `app/helmrelease.yaml` defining the chart source and a nested `app/kustomization.yaml` that applies the `HelmRelease`.
- **Shared components** in `kubernetes/components/common`, imported by each app via `components:`.
- **Encrypted secrets** managed with SOPS (`*.sops.yaml`) next to each HelmRelease and/or Kustomize overlay.
- **ConfigMapGenerators** used to surface `valuesFrom` for HelmReleases via `configMapGenerator` blocks and `kustomizeconfig.yaml` nameReference patches.
- **Repository CRs** (`HelmRepository` or `OCIRepository`) declared alongside charts to fetch Helm charts from registries.
- **Flux source** always `GitRepository` named `flux-system` in the `flux-system` namespace.

## Referencing These Examples

You can refer to either of these full cluster examples in the `/examples` folder:

- `examples/onedr0p-home-ops.md`  &ndash; Onedr0p's cluster-template demonstration
- `examples/Tanguille-cluster.md` &ndash; Tanguille's full cluster configuration

Each file contains the complete directory layout and manifest definitions following the above patterns.
