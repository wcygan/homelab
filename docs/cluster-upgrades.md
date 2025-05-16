# Upgrade Talos and Kubernetes

First, upgrade the Talos nodes:

```diff
# renovate: datasource=docker depName=ghcr.io/siderolabs/installer
- talosVersion: v1.9.1
+ talosVersion: v1.10.0
# renovate: datasource=docker depName=ghcr.io/siderolabs/kubelet
kubernetesVersion: v1.32.0
```

First, check the nodes out:

```bash
talosctl dashboard --nodes 192.168.1.98,192.168.1.99,192.168.1.100

# Or just
talosctl dashboard
```

Then, upgrade the nodes:

```bash
task talos:generate-config
task talos:apply-node IP=192.168.1.98 MODE=auto
task talos:apply-node IP=192.168.1.99 MODE=auto
task talos:apply-node IP=192.168.1.100 MODE=auto
```