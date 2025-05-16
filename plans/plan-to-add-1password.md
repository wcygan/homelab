# Plan to Add 1Password Connect Server

## Objective
Install 1Password Connect server and Kubernetes Operator to sync 1Password items as Kubernetes Secrets.

## Prerequisites
- Helm ≥ 3.0 installed and configured
- `kubectl` configured to target your cluster
- 1Password CLI (`op`) installed and signed in
- 1Password Connect credentials JSON file (`wcygan-net Credentials File`)
- 1Password Connect token (`wcygan-net Access Token: Kubernetes`)

## Steps

1. Add the 1Password Helm chart repository:
   ```bash
   helm repo add 1password https://1password.github.io/connect-helm-charts
   helm repo update
   ```

2. Store credentials locally:
   ```bash
   cp /path/to/wcygan-net-credentials.json 1password-credentials.json
   export OP_CONNECT_TOKEN="$(cat /path/to/wcygan-net-access-token.txt)"
   ```

3. Install Connect server and Operator:
   ```bash
   helm install connect 1password/connect \
     --namespace=1password-system \
     --create-namespace \
     --set-file connect.credentials=1password-credentials.json \
     --set operator.create=true \
     --set operator.token.value=$OP_CONNECT_TOKEN \
     --wait
   ```

4. Verify installation:
   ```bash
   kubectl get pods -n 1password-system
   kubectl get crd onepassworditems.operator.1password.io
   ```

## Verification
- All pods in `1password-system` are `Running`.
- CRDs `onepassworditems`, `onepasswordvaults` exist.
- Create a test `OnePasswordItem` and confirm a Kubernetes Secret is created.

## Next Steps
- Encrypt `1password-credentials.json` with SOPS or store securely via GitOps.
- Define `OnePasswordItem` CRs for required secrets. For example, sync Tailscale OAuth credentials:
  ```yaml
  apiVersion: operator.1password.io/v1beta1
  kind: OnePasswordItem
  metadata:
    name: tailscale-oauth
    namespace: tailscale-system
  spec:
    vault: Technology
    itemPath: "Tailscale OAuth"
    output:
      secretName: tailscale-oauth
  ```
- Configure application deployments to consume synced Secrets.

Refer to: https://developer.1password.com/docs/k8s/operator/
