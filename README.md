# Anton

<img src="static/anton.jpg" alt="Anton" width="300px">

Anton runs in my basement. It is based on
[onedr0p's cluster-template](https://github.com/onedr0p/cluster-template).

## 🔧 Hardware

| Name  | Device | CPU       | Disk       | RAM  | OS    | Purpose           |
| ----- | ------ | --------- | ---------- | ---- | ----- | ----------------- |
| k8s-1 | MS-01  | i9-13900H | 500GB NVMe | 96GB | Talos | k8s control-plane |
| k8s-2 | MS-01  | i9-13900H | 500GB NVMe | 96GB | Talos | k8s control-plane |
| k8s-3 | MS-01  | i9-13900H | 500GB NVMe | 96GB | Talos | k8s control-plane |

## ✨ Features

A production-grade Kubernetes cluster deployed with
[Talos Linux](https://github.com/siderolabs/talos) and a complete GitOps implementation using [Flux](https://github.com/fluxcd/flux2), 
[1Password Connect](https://github.com/1Password/connect) for secret management, and
[Rook-Ceph](https://github.com/rook/rook) for distributed storage.

- **Required:** Some knowledge of [Containers](https://opencontainers.org/),
  [YAML](https://noyaml.com/), [Git](https://git-scm.com/), a **1Password account**,
  and a **Cloudflare account** with a **domain**.
- **Core Infrastructure:** [flux](https://github.com/fluxcd/flux2),
  [cilium](https://github.com/cilium/cilium),
  [cert-manager](https://github.com/cert-manager/cert-manager),
  [external-secrets-operator](https://github.com/external-secrets/external-secrets),
  [1password-connect](https://github.com/1Password/connect),
  [rook-ceph](https://github.com/rook/rook),
  [ingress-nginx](https://github.com/kubernetes/ingress-nginx/),
  [external-dns](https://github.com/kubernetes-sigs/external-dns),
  [cloudflared](https://github.com/cloudflare/cloudflared), and
  [tailscale](https://github.com/tailscale/tailscale) for secure remote access.

**Other features include:**

- Dev env managed w/ [mise](https://mise.jdx.dev/)
- Workflow automation w/ [GitHub Actions](https://github.com/features/actions)
- Dependency automation w/ [Renovate](https://www.mend.io/renovate)
- Flux `HelmRelease` and `Kustomization` diffs w/
  [flux-local](https://github.com/allenporter/flux-local)

Does this sound cool to you? If so, continue to read on! 👇

## 🚀 Let's Go!

There are **6 stages** outlined below for completing this project, make sure you
follow the stages in order.

### Stage 1: Machine Preparation

> [!IMPORTANT]
> If you have **3 or more nodes** it is recommended to make 3 of them controller
> nodes for a highly available control plane. This project configures **all
> nodes** to be able to run workloads. **Worker nodes** are therefore
> **optional**.
>
> **Minimum system requirements**
>
> | Role           | Cores | Memory | System Disk    |
> | -------------- | ----- | ------ | -------------- |
> | Control/Worker | 4     | 16GB   | 256GB SSD/NVMe |

1. Head over to the [Talos Linux Image Factory](https://factory.talos.dev) and
   follow the instructions. Be sure to only choose the **bare-minimum system
   extensions** as some might require additional configuration and prevent Talos
   from booting without it. You can always add system extensions after Talos is
   installed and working.

2. This will eventually lead you to download a Talos Linux ISO (or for SBCs a
   RAW) image. Make sure to note the **schematic ID** you will need this later
   on.

3. Flash the Talos ISO or RAW image to a USB drive and boot from it on your
   nodes.

4. Verify with `nmap` that your nodes are available on the network. (Replace
   `192.168.1.0/24` with the network your nodes are on.)

   ```sh
   nmap -Pn -n -p 50000 192.168.1.0/24 -vv | grep 'Discovered'
   ```

### Stage 2: Local Workstation

> [!TIP]
> It is recommended to set the visibility of your repository to `Public` so you
> can easily request help if you get stuck.

1. Create a new repository by clicking the green `Use this template` button at
   the top of this page, then clone the new repo you just created and `cd` into
   it. Alternatively you can us the [GitHub CLI](https://cli.github.com/) ...

   ```sh
   export REPONAME="home-ops"
   gh repo create $REPONAME --template onedr0p/cluster-template --disable-wiki --public --clone && cd $REPONAME
   ```

2. **Install** and **activate** [mise](https://mise.jdx.dev/) following the
   instructions for your workstation
   [here](https://mise.jdx.dev/getting-started.html).

3. Use `mise` to install the **required** CLI tools:

   ```sh
   mise trust
   pip install pipx
   mise install  # This will automatically install all missing dependencies
   ```

   📍 _The `mise install` command will install all tools defined in `.mise.toml` including cue, kubeconform, yq, gh CLI, and cilium-cli_

   📍 _**Having trouble installing the tools?** Try unsetting the `GITHUB_TOKEN`
   env var and then run these commands again_

   📍 _**Having trouble compiling Python?** Try running
   `mise settings python.compile=0` and then run these commands again_

### Stage 3: Cloudflare configuration

> [!WARNING]
> If any of the commands fail with `command not found` or `unknown command` it
> means `mise` is either not install or configured incorrectly.

1. Create a Cloudflare API token for use with cloudflared and external-dns by
   reviewing the official
   [documentation](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)
   and following the instructions below.

   - Click the blue `Use template` button for the `Edit zone DNS` template.
   - Name your token `kubernetes`
   - Under `Permissions`, click `+ Add More` and add permissions
     `Zone - DNS - Edit` and `Account - Cloudflare Tunnel - Read`
   - Limit the permissions to a specific account and/or zone resources and then
     click `Continue to Summary` and then `Create Token`.
   - **Save this token somewhere safe**, you will need it later on.

2. Create the Cloudflare Tunnel:

   ```sh
   cloudflared tunnel login
   cloudflared tunnel create --credentials-file cloudflare-tunnel.json kubernetes
   ```

### Stage 3.5: 1Password Setup

> [!IMPORTANT]
> 1Password Connect is **REQUIRED** for secret management and GitOps functionality.
> Without this, applications will fail to deploy due to missing secrets.

1. **Set up 1Password Connect credentials**:

   You'll need two files from your 1Password account:
   - `1password-credentials.json` - Connect server credentials 
   - `1password-api-token.txt` - API access token

   📍 _Download these from your 1Password account and place them in `~/Downloads/`_

2. **1Password Connect will be installed later** after the initial cluster bootstrap:

   ```sh
   # This command will be run AFTER task bootstrap:apps
   deno task 1p:install
   ```

   📍 _Don't run this yet - we'll come back to it in Stage 5_

### Stage 4: Cluster configuration

1. Generate the config files from the sample files:

   ```sh
   task init
   ```

2. Fill out `cluster.yaml` and `nodes.yaml` configuration files using the
   comments in those file as a guide.

3. Template out the kubernetes and talos configuration files, if any issues come
   up be sure to read the error and adjust your config files accordingly.

   ```sh
   task configure
   ```

4. Push your changes to git:

   📍 _**Verify** all the `./kubernetes/**/*.sops.*` files are **encrypted**
   with SOPS_

   ```sh
   git add -A
   git commit -m "chore: initial commit :rocket:"
   git push
   ```

> [!TIP]
> Using a **private repository**? Make sure to paste the public key from
> `github-deploy.key.pub` into the deploy keys section of your GitHub repository
> settings. This will make sure Flux has read/write access to your repository.

### Stage 5: Bootstrap Talos, Kubernetes, and Flux

> [!WARNING]
> The complete bootstrap process can take 15+ minutes and involves multiple phases.
> You'll see various error messages initially - this is normal until all components are ready.
> **Do not interrupt the process** or you may need to [reset the cluster](#-reset).

1. Install Talos:

   ```sh
   task bootstrap:talos
   ```

2. Push your changes to git:

   ```sh
   git add -A
   git commit -m "chore: add talhelper encrypted secret :lock:"
   git push
   ```

3. Install essential services (Cilium, CoreDNS, Spegel, Flux):

   ```sh
   task bootstrap:apps
   ```

   📍 _This installs core infrastructure but applications will fail until secrets are available_

4. **CRITICAL: Set up 1Password Connect for secret management**:

   ```sh
   deno task 1p:install
   ```

   📍 _This enables GitOps by providing secrets to applications. Wait for this to complete before proceeding._

5. Force full cluster reconciliation:

   ```sh
   task reconcile
   ```

6. Watch the complete rollout happen:

   ```sh
   kubectl get pods --all-namespaces --watch
   ```

## 📣 Post installation

### ✅ Verifications

1. **Verify 1Password Connect is working**:

   ```sh
   kubectl get clustersecretstore onepassword-connect
   kubectl get externalsecret -A | grep cluster-secrets
   ```

   📍 _All ExternalSecrets should show "SecretSynced: True"_

2. Check the status of Cilium:

   ```sh
   cilium status
   ```

3. Check the status of Flux and GitOps deployment:

   📍 _Run `task reconcile` to force Flux to sync your Git repository state_

   ```sh
   flux check
   flux get sources git flux-system
   flux get ks -A
   flux get hr -A
   ```

   📍 _All Kustomizations should show "Ready: True" and HelmReleases should be deployed_

4. Check TCP connectivity to both the ingress controllers:

   ```sh
   nmap -Pn -n -p 443 ${cluster_ingress_addr} ${cloudflare_ingress_addr} -vv
   ```

5. Check you can resolve DNS for `echo`, this should resolve to
   `${cluster_ingress_addr}`:

   ```sh
   dig @${cluster_dns_gateway_addr} echo.${cloudflare_domain}
   ```

6. Check the status of your wildcard `Certificate`:

   ```sh
   kubectl -n cert-manager describe certificates
   ```

> [!NOTE]
> **Troubleshooting Bootstrap Issues?**
> 
> If you encounter problems during bootstrap, check the comprehensive troubleshooting guides:
> - [Bootstrap Troubleshooting Guide](docs/cluster-template/bootstrap-troubleshooting.md)
> - [Successful Bootstrap Checklist](docs/cluster-template/successful-bootstrap-checklist.md)
> 
> Common issues include CRD compatibility problems and secret management setup.

### 🌐 Public DNS

> [!TIP]
> Use the `external` ingress class to make applications public to the internet.

The `external-dns` application created in the `network` namespace will handle
creating public DNS records. By default, `echo` and the `flux-webhook` are the
only subdomains reachable from the public internet. In order to make additional
applications public you must **set the correct ingress class name and ingress
annotations** like in the HelmRelease for `echo`.

### 🏠 Home DNS

> [!TIP]
> Use the `internal` ingress class to make applications private to your network.
> If you're having trouble with internal DNS resolution check out
> [this](https://github.com/onedr0p/cluster-template/discussions/719) GitHub
> discussion.

`k8s_gateway` will provide DNS resolution to external Kubernetes resources (i.e.
points of entry to the cluster) from any device that uses your home DNS server.
For this to work, your home DNS server must be configured to forward DNS queries
for `${cloudflare_domain}` to `${cluster_dns_gateway_addr}` instead of the
upstream DNS server(s) it normally uses. This is a form of **split DNS** (aka
split-horizon DNS / conditional forwarding).

_... Nothing working? That is expected, this is DNS after all!_

### 🪝 Github Webhook

By default Flux will periodically check your git repository for changes.
In-order to have Flux reconcile on `git push` you must configure Github to send
`push` events to Flux.

1. Obtain the webhook path:

   📍 _Hook id and path should look like
   `/hook/12ebd1e363c641dc3c2e430ecf3cee2b3c7a5ac9e1234506f6f5f3ce1230e123`_

   ```sh
   kubectl -n flux-system get receiver github-webhook --output=jsonpath='{.status.webhookPath}'
   ```

2. Piece together the full URL with the webhook path appended:

   ```text
   https://flux-webhook.${cloudflare_domain}/hook/12ebd1e363c641dc3c2e430ecf3cee2b3c7a5ac9e1234506f6f5f3ce1230e123
   ```

3. Navigate to the settings of your repository on Github, under
   "Settings/Webhooks" press the "Add webhook" button. Fill in the webhook URL
   and your token from `github-push-token.txt`, Content type:
   `application/json`, Events: Choose Just the push event, and save.

## 🔒 Stage 6: Tailscale Remote Access

> [!IMPORTANT]
> Tailscale provides secure remote access to your homelab cluster and is essential
> for remote cluster recovery and management. Set this up after full cluster reconciliation.

### Option A: Tailscale System Extension (Recommended for Remote Node Management)

For secure remote `talosctl` access to your cluster nodes:

1. **Create Factory Schematic with Tailscale Extension**:

   Visit [Talos Factory](https://factory.talos.dev/) and include the `siderolabs/tailscale` extension:
   ```
   https://factory.talos.dev/?arch=amd64&cmdline-set=true&extensions=siderolabs%2Ftailscale&platform=metal&target=metal&version=1.10.4
   ```

2. **Generate Tailscale Auth Key**:
   - Create non-ephemeral, reusable auth key in Tailscale admin console
   - Add `tag:k8s-node` for organization

3. **Configure Tailscale Extension**:

   Create SOPS-encrypted configuration files for each node:
   ```sh
   # Create tailscale-extension.sops.yaml for each node
   sops -e -i talos/patches/k8s-*/tailscale-extension.sops.yaml
   ```

4. **Update Certificate SANs**:

   Add Tailscale IPs to `talconfig.yaml`:
   ```yaml
   additionalApiServerCertSans: &sans
     - "127.0.0.1"
     - "192.168.1.101"
     - "100.x.x.x"  # Tailscale IP
   additionalMachineCertSans: *sans
   ```

5. **Deploy to Nodes**:
   ```sh
   task talos:generate-config
   task talos:upgrade-node IP=192.168.1.98  # Repeat for each node
   ```

6. **Verify Remote Access**:
   ```sh
   talosctl -n 100.x.x.x time    # Should work via Tailscale IP
   talosctl -n 100.x.x.x version
   ```

   📍 _See [Tailscale System Extension Guide](docs/talos-linux/tailscale-integration.md) for complete implementation details_

### Option B: Tailscale Kubernetes Operator (For Application Access)

For secure remote access to Kubernetes applications:

1. **Set up Tailscale Kubernetes Operator**:

   ```sh
   # Check if Tailscale ingress resources exist
   kubectl get ingress -A | grep tailscale
   ```

2. **Access your services remotely**:

   Once configured, you'll have secure access to:
   - **Grafana**: `grafana.{your-tailnet}.ts.net`
   - **Ceph Dashboard**: `storage-ceph-dashboard-ingress.{your-tailnet}.ts.net`
   - **KubeAI API**: `kubeai-api.{your-tailnet}.ts.net`
   - **Open WebUI**: `open-webui.{your-tailnet}.ts.net`

   📍 _See [Tailscale Operator Documentation](docs/milestones/2025-06-12-tailscale-kubernetes-operator-deployment.md) for setup details_

### Why Both Options?

- **System Extension**: Provides infrastructure-level access for emergency cluster recovery and remote `talosctl` commands
- **Kubernetes Operator**: Provides secure application access via Tailscale hostnames

Choose the option that best fits your needs, or implement both for comprehensive remote access capabilities.

## 💥 Reset

> [!WARNING]
> **Resetting** the cluster **multiple times in a short period of time** could
> lead to being **rate limited by DockerHub or Let's Encrypt**.

There might be a situation where you want to destroy your Kubernetes cluster.
The following command will reset your nodes back to maintenance mode.

```sh
task talos:reset
```

## 🛠️ Talos and Kubernetes Maintenance

### ⚙️ Updating Talos node configuration

> [!TIP]
> Ensure you have updated `talconfig.yaml` and any patches with your updated
> configuration. In some cases you **not only need to apply the configuration
> but also upgrade talos** to apply new configuration.

```sh
# (Re)generate the Talos config
task talos:generate-config
# Apply the config to the node
task talos:apply-node IP=? MODE=?
# e.g. task talos:apply-node IP=10.10.10.10 MODE=auto
```

### ⬆️ Updating Talos and Kubernetes versions

> [!TIP]
> Ensure the `talosVersion` and `kubernetesVersion` in `talenv.yaml` are
> up-to-date with the version you wish to upgrade to.

```sh
# Upgrade node to a newer Talos version
task talos:upgrade-node IP=?
# e.g. task talos:upgrade-node IP=10.10.10.10
```

```sh
# Upgrade cluster to a newer Kubernetes version
task talos:upgrade-k8s
# e.g. task talos:upgrade-k8s
```

## 🤖 Renovate

[Renovate](https://www.mend.io/renovate) is a tool that automates dependency
management. It is designed to scan your repository around the clock and open PRs
for out-of-date dependencies it finds. Common dependencies it can discover are
Helm charts, container images, GitHub Actions and more! In most cases merging a
PR will cause Flux to apply the update to your cluster.

To enable Renovate, click the 'Configure' button over at their
[Github app page](https://github.com/apps/renovate) and select your repository.
Renovate creates a "Dependency Dashboard" as an issue in your repository, giving
an overview of the status of all updates. The dashboard has interactive
checkboxes that let you do things like advance scheduling or reattempt update
PRs you closed without merging.

The base Renovate configuration in your repository can be viewed at
[.renovaterc.json5](.renovaterc.json5). By default it is scheduled to be active
with PRs every weekend, but you can
[change the schedule to anything you want](https://docs.renovatebot.com/presets-schedule),
or remove it if you want Renovate to open PRs immediately.

## 🐛 Debugging

Below is a general guide on trying to debug an issue with an resource or
application. For example, if a workload/resource is not showing up or a pod has
started but in a `CrashLoopBackOff` or `Pending` state. These steps do not
include a way to fix the problem as the problem could be one of many different
things.

1. Check if the Flux resources are up-to-date and in a ready state:

   📍 _Run `task reconcile` to force Flux to sync your Git repository state_

   ```sh
   flux get sources git -A
   flux get ks -A
   flux get hr -A
   ```

2. Do you see the pod of the workload you are debugging:

   ```sh
   kubectl -n <namespace> get pods -o wide
   ```

3. Check the logs of the pod if its there:

   ```sh
   kubectl -n <namespace> logs <pod-name> -f
   ```

4. If a resource exists try to describe it to see what problems it might have:

   ```sh
   kubectl -n <namespace> describe <resource> <name>
   ```

5. Check the namespace events:

   ```sh
   kubectl -n <namespace> get events --sort-by='.metadata.creationTimestamp'
   ```

Resolving problems that you have could take some tweaking of your YAML manifests
in order to get things working, other times it could be a external factor like
permissions on a NFS server. If you are unable to figure out your problem see
the support sections below.

## 🧹 Tidy up

Once your cluster is fully configured and you no longer need to run
`task configure`, it's a good idea to clean up the repository by removing the
[templates](./templates) directory and any files related to the templating
process. This will help eliminate unnecessary clutter from the upstream template
repository and resolve any "duplicate registry" warnings from Renovate.

1. Tidy up your repository:

   ```sh
   task template:tidy
   ```

2. Push your changes to git:

   ```sh
   git add -A
   git commit -m "chore: tidy up :broom:"
   git push
   ```

## 👉 Community Support

- Make a post in this repository's Github
  [Discussions](https://github.com/onedr0p/cluster-template/discussions).
- Start a thread in the `#support` or `#cluster-template` channels in the
  [Home Operations](https://discord.gg/home-operations) Discord server.

## 🙋 GitHub Sponsors Support

If you're having difficulty with this project, can't find the answers you need
through the community support options above, or simply want to show your
appreciation while gaining deeper insights, I’m offering one-on-one paid support
through GitHub Sponsors for a limited time. Payment and scheduling will be
coordinated through [GitHub Sponsors](https://github.com/sponsors/onedr0p).

<details>

<summary>Click to expand the details</summary>

<br>

- **Rate**: $50/hour (no longer than 2 hours / day).
- **What’s Included**: Assistance with deployment, debugging, or answering
  questions related to this project.
- **What to Expect**:
  1. Sessions will focus on specific questions or issues you are facing.
  2. I will provide guidance, explanations, and actionable steps to help resolve
     your concerns.
  3. Support is limited to this project and does not extend to unrelated tools
     or custom feature development.

</details>

## ❔ What's next

The cluster is your oyster (or something like that). Below are some optional
considerations you might want to review.

### DNS

Instead of using [k8s_gateway](https://github.com/ori-edge/k8s_gateway) to
provide DNS for your applications you might want to check out
[external-dns](https://github.com/kubernetes-sigs/external-dns), there is wide
support for many different DNS providers such as
[Pi-hole](https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/pihole.md),
[UniFi](https://github.com/kashalls/external-dns-unifi-webhook),
[Adguard Home](https://github.com/muhlba91/external-dns-provider-adguard),
[Bind](https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/rfc2136.md)
and more.

### Storage

You might find you need persistent storage for your workloads with features like
replicated storage or to connect to a NFS/SMB/iSCSI server. If you need any of
those features be sure to check out the projects like
[rook-ceph](https://github.com/rook/rook),
[longhorn](https://github.com/longhorn/longhorn),
[openebs](https://github.com/openebs/openebs),
[democratic-csi](https://github.com/democratic-csi/democratic-csi),
[csi-driver-nfs](https://github.com/kubernetes-csi/csi-driver-nfs),
[csi-driver-smb](https://github.com/kubernetes-csi/csi-driver-smb) or
[synology-csi](https://github.com/SynologyOpenSource/synology-csi).

### Community Repositories

Community member [@whazor](https://github.com/whazor) created
[Kubesearch](https://kubesearch.dev) to allow searching Flux HelmReleases across
Github and Gitlab repositories with the `kubesearch` topic.

## 🙌 Related Projects

If this repo is too hot to handle or too cold to hold check out these following
projects.

- [ajaykumar4/cluster-template](https://github.com/ajaykumar4/cluster-template) -
  _A template for deploying a Talos Kubernetes cluster including Argo for
  GitOps_
- [khuedoan/homelab](https://github.com/khuedoan/homelab) - _Fully automated
  homelab from empty disk to running services with a single command._
- [mitchross/k3s-argocd-starter](https://github.com/mitchross/k3s-argocd-starter) -
  starter kit for k3s, argocd
- [ricsanfre/pi-cluster](https://github.com/ricsanfre/pi-cluster) - _Pi
  Kubernetes Cluster. Homelab kubernetes cluster automated with Ansible and
  FluxCD_
- [techno-tim/k3s-ansible](https://github.com/techno-tim/k3s-ansible) - _The
  easiest way to bootstrap a self-hosted High Availability Kubernetes cluster. A
  fully automated HA k3s etcd install with kube-vip, MetalLB, and more. Build.
  Destroy. Repeat._

## ⭐ Stargazers

<div align="center">

<a href="https://star-history.com/#onedr0p/cluster-template&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=onedr0p/cluster-template&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=onedr0p/cluster-template&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=onedr0p/cluster-template&type=Date" />
  </picture>
</a>

</div>

## 🤝 Thanks

Big shout out to all the contributors, sponsors and everyone else who has helped
on this project.
