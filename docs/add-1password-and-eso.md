# 1Password and External Secrets Operator

This document outlines how to bootstrap the External Secrets Operator (ESO) and the 1Password Connect server into the cluster using GitOps with Flux and Kustomize.

1. **External Secrets Operator (ESO)**
   - Ensure ESO is already installed and configured to use 1Password Connect as a backend.

2. **Register the 1Password Connect HelmRepository**
   - Create [kubernetes/flux/meta/repos/1password-connect.yaml](mdc:kubernetes/flux/meta/repos/1password-connect.yaml) with the HelmRepository CRD pointing to `https://1password.github.io/connect-helm-charts`.
   - Add it to the Flux sources kustomization at [kubernetes/flux/meta/repos/kustomization.yaml](mdc:kubernetes/flux/meta/repos/kustomization.yaml).

3. **Scaffold the 1Password Connect App**
   - Under `kubernetes/apps/external-secrets/onepassword-connect/`, create:
     - `ks.yaml` (Flux Kustomization in the `flux-system` namespace).
     - `app/kustomization.yaml` (Kustomize root referencing `helmrelease.yaml`).
     - `app/helmrelease.yaml` (HelmRelease CRD with a pinned chart version and `install.createNamespace: true`).

4. **Wire into the external-secrets Namespace**
   - Add `- ./onepassword-connect/ks.yaml` to the `resources` list in [kubernetes/apps/external-secrets/kustomization.yaml](mdc:kubernetes/apps/external-secrets/kustomization.yaml).

5. **Flux Reconciliation Flow**
   - Flux's `cluster-meta` applies all source CRDs, including the new HelmRepository.
   - Flux's `cluster-apps` discovers the `external-secrets` namespace kustomization, which now includes the Connect app's `ks.yaml`.
   - Flux applies the Connect app's Kustomization, which renders its `HelmRelease` and deploys the Connect server into the `onepassword-connect` namespace.

---

## Kick off 1Password Synchronization

Once the Connect server is deployed by Flux, you must provide the API credentials to allow it to authenticate and begin syncing secrets. For a one-time bootstrap:

```bash
kubectl create secret generic op-credentials \
  --namespace external-secrets \
  --from-file=1password-credentials.json=/Users/wcygan/Downloads/1password-credentials.json

kubectl create secret generic onepassword-connect-token \
  --from-literal=token='<YOUR_CONNECT_TOKEN>' \
  -n external-secrets
```

For a fully GitOps-managed approach, store the credentials in 1Password and create an `ExternalSecret` in the `onepassword-connect` namespace that references the credentials item. ESO will sync the secret into the cluster, ensuring the secret is never stored in Git.
