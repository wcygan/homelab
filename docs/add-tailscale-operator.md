# Tailscale Operator

When added, this will allow remote access to the cluster via Tailscale.

Without using Talos Linux or the Cluster Template, I would do this in the past like so:

```bash
helm repo add tailscale https://pkgs.tailscale.com/helmcharts

helm repo update

helm upgrade \
  --install \
  tailscale-operator \
  tailscale/tailscale-operator \
  --namespace=tailscale \
  --create-namespace \
  --set-string oauth.clientId="<OAauth client ID>" \
  --set-string oauth.clientSecret="<OAuth client secret>" \
  --set-string apiServerProxyConfig.mode="true" \
  --wait

tailscale configure kubeconfig tailscale-operator
```

References:

- https://tailscale.com/kb/1185/kubernetes
- https://tailscale.com/kb/1236/kubernetes-operator
- https://tailscale.com/kb/1437/kubernetes-operator-api-server-proxy

## Using Tailscale with the Cluster Template

Now we have a more interesting problem to solve... How can we get this working with the Cluster Template, and through secrets provided by 1Password?

This will be the first application that I add to the cluster using a secret (that isn't bootstrapped like 1Password Connect).

I need a secret for `clientId` and `clientSecret` for Tailscale.

