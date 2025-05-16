# Plan to Add Tailscale Operator

## Objective
Install Tailscale Kubernetes Operator to manage Tailscale Nodes and network connectivity within your cluster.

## Prerequisites
- Helm ≥ 3.0 installed and configured
- `kubectl` configured to target your cluster
- 1Password Connect server and Operator installed and healthy
- A `OnePasswordItem` CR syncing your Tailscale OAuth credentials into a `tailscale-oauth` Secret in `tailscale-system`
- Tailscale OAuth client ID and secret available via the Kubernetes Secret
- (Optional) 1Password CLI (`op`) installed for managing OnePasswordItem CRs

## Steps

1. Ensure the `tailscale-system` namespace exists and the `tailscale-oauth` Secret is synced:
   ```bash
   kubectl get secret tailscale-oauth -n tailscale-system
   ```

2. Add the Tailscale Helm chart repository:
   ```bash
   helm repo add tailscale https://pkgs.tailscale.com/helmcharts
   helm repo update
   ```

3. Install or upgrade the Tailscale operator without injecting credentials:
   ```bash
   helm upgrade --install tailscale-operator tailscale/tailscale-operator \
     --namespace=tailscale-system \
     --create-namespace \
     --set apiServerProxyConfig.mode=true \
     --wait
   ```

4. Patch the Deployment to load credentials from the `tailscale-oauth` Secret:
   ```bash
   kubectl patch deployment tailscale-operator -n tailscale-system --patch '{
     "spec": {
       "template": {
         "spec": {
           "containers": [{
             "name": "operator",
             "env": [
               {"name": "OAUTH_CLIENT_ID",    "valueFrom": {"secretKeyRef": {"name": "tailscale-oauth", "key": "clientId"}}},
               {"name": "OAUTH_CLIENT_SECRET","valueFrom": {"secretKeyRef": {"name": "tailscale-oauth", "key": "clientSecret"}}}
             ]
           }]
         }
       }
     }
   }'
   ```

5. Configure `kubectl` context via Tailscale:
   ```bash
   tailscale configure kubeconfig tailscale-operator
   ```

## Verification
- All pods in `tailscale-system` are `Running`:
  ```bash
  kubectl get pods -n tailscale-system
  ```
- CRD for TailscaleNodes exists:
  ```bash
  kubectl get crd tailscalenodes.tailscale.com
  ```
- Create a sample `TailscaleNode` resource and verify connectivity.

## Next Steps
- Define and manage `TailscaleNode` CRs via GitOps (e.g., Flux).
- Configure Tailscale ACLs, exit nodes, and DNS settings.
- Monitor Tailscale logs and metrics for performance and audit.

Refer to: https://tailscale.com/kb/1236/kubernetes-operator
