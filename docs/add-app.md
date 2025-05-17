# Add an application

## Without secrets

Given that the echo server is already running & configured in this application, we can attempt to clone it to learn how to add an application.

Echo comes from https://github.com/mendhak/docker-http-https-echo, available on Docker Hub as `mendhak/http-https-echo`.

### Relevant Code Snippets

```bash
rg 'echo'
README.md
186:4. Check you can resolve DNS for `echo`, this should resolve to `${cluster_ingress_addr}`:
189:    dig @${cluster_dns_gateway_addr} echo.${cloudflare_domain}
203:The `external-dns` application created in the `network` namespace will handle creating public DNS records. By default, `echo` and the `flux-webhook` are the only subdomains reachable from the public internet. In order to make additional applications public you must **set the correct ingress class name and ingress annotations** like in the HelmRelease for `echo`.

docs/add-app.md
5:Given that the echo server is already running & configured in this application, we can attempt to clone it to learn how to add an application.

kubernetes/apps/default/kustomization.yaml
10:  - ./echo/ks.yaml

kubernetes/apps/default/echo/ks.yaml
6:  name: &app echo
13:  path: ./kubernetes/apps/default/echo/app

kubernetes/apps/default/echo/app/helmrelease.yaml
6:  name: echo
24:      echo:
29:              repository: ghcr.io/mendhak/http-https-echo
66:        controller: echo
72:        serviceName: echo
```

And view the directory structure:

```bash
tree kubernetes/apps/default/echo
kubernetes/apps/default/echo
├── app
│   ├── helmrelease.yaml
│   └── kustomization.yaml
└── ks.yaml
```

Notably, `kubernetes/apps/default/echo/ks.yaml` is a plugged into `kubernetes/apps/default/kustomization.yaml` to hook up the application.

### Scaffolding new files and directories

We will call this deployment `echo-2` and it will be a clone of the `echo` configuration which has a `kustomization.yaml`, `ks.yaml` and `helmrelease.yaml` files.

```bash
# Create a new directory for the application
mkdir -p kubernetes/apps/default/echo-2/app

# Create a new kustomization file
touch kubernetes/apps/default/echo-2/app/kustomization.yaml

# Create a new helmrelease file
touch kubernetes/apps/default/echo-2/app/helmrelease.yaml

# Create a new ks file
touch kubernetes/apps/default/echo-2/ks.yaml
```

## With secrets

TBD: we will revisit this.