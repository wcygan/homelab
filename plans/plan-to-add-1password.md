# Plan to Add 1Password Connect Server

## Objective

Install 1Password Connect server and Kubernetes Operator to sync 1Password items
as Kubernetes Secrets.

## Prerequisites

- Helm ≥ 3.0 installed and configured
- `kubectl` configured to target your cluster
- 1Password CLI (`op`) installed and signed in
- 1Password Connect credentials JSON file (`wcygan-net Credentials File`)
- 1Password Connect token (`wcygan-net Access Token: Kubernetes`)

## Steps

Replace the manual Helm commands with a GitOps-driven approach. All resources
will be managed in Git under `kubernetes/apps/onepassword-connect/`:

1. Create a directory `kubernetes/apps/onepassword-connect/` and add:
   - `namespace.yaml` (a Namespace CR)
   - `helmrepo.yaml` (a Flux HelmRepository CR for the 1Password chart)
   - `externalsecret-credentials.yaml` (an ExternalSecret CR to sync Connect
     credentials and token)
   - `helmrelease.yaml` (a Flux HelmRelease CR to install the Connect server +
     Operator using the synced Secret)
   - `kustomization.yaml` (a Flux Kustomization CR to deploy all of the above)

2. Commit and push these files. Flux will automatically install or update the
   Connect server and Operator.

Example snippets:

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: onepassword-system
```

```yaml
# helmrepo.yaml
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: HelmRepository
metadata:
  name: onepassword-charts
  namespace: flux-system
spec:
  interval: 1h
  url: https://1password.github.io/connect-helm-charts
```

```yaml
# externalsecret-credentials.yaml
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: onepassword-credentials
  namespace: onepassword-system
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: onepassword
    kind: ClusterSecretStore
  target:
    name: onepassword-credentials
  data:
    - secretKey: credentials.json
      remoteRef:
        key: connect/credentials
        property: file
    - secretKey: token
      remoteRef:
        key: connect/token
        property: value
```

```yaml
# helmrelease.yaml
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: onepassword-connect
  namespace: onepassword-system
spec:
  interval: 1h
  chart:
    spec:
      chart: connect
      version: 1.8.0 # pin a chart version
      sourceRef:
        kind: HelmRepository
        name: onepassword-charts
        namespace: flux-system
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  valuesFrom:
    - kind: Secret
      name: onepassword-credentials
  values:
    connect:
      credentials:
        secretKeyRef:
          name: onepassword-credentials
          key: credentials.json
      token:
        secretKeyRef:
          name: onepassword-credentials
          key: token
    operator:
      create: true
      token:
        secretKeyRef:
          name: onepassword-credentials
          key: token
```

```yaml
# kustomization.yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: onepassword-connect
  namespace: flux-system
spec:
  interval: 1h
  path: ./kubernetes/apps/onepassword-connect
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
```

## Verification

- Run `flux get kustomizations -n flux-system` to confirm `onepassword-connect`
  is reconciling.
- Use `kubectl get pods -n onepassword-system` and
  `kubectl get crds | grep onepassword` to verify the Connect server, operator,
  and CRDs are present.

## Next Steps

- Define `OnePasswordItem` CRs to sync required secrets into Kubernetes.
- Reference the synced Secrets in your application manifests via `valuesFrom` or
  `env.valueFrom.secretKeyRef`.

Refer to: https://developer.1password.com/docs/k8s/operator/
