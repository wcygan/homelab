Directory structure:
└── jjgadgets-biohazard/
    ├── README.md
    ├── _redirects
    ├── LICENSE
    ├── Taskfile.dist.yaml
    ├── .mise.toml
    ├── .pre-commit-config.yaml
    ├── .renovaterc.json5
    ├── .sops-stdin.yaml
    ├── .sops.yaml
    ├── dots/
    │   ├── starship.toml
    │   ├── vimrc
    │   ├── k9s/
    │   │   ├── aliases.yaml
    │   │   ├── config.yaml
    │   │   ├── .gitignore
    │   │   ├── clusters/
    │   │   │   └── biohazard/
    │   │   │       └── biohazard/
    │   │   │           └── config.yaml
    │   │   ├── skins -> skins
    │   │   └── .source/
    │   ├── kanshi/
    │   │   └── blackhawk
    │   └── nvim/
    │       ├── init.lua
    │       ├── lazy-lock.json
    │       └── setup.sh
    ├── kube/
    │   ├── bootstrap/
    │   │   ├── README.md
    │   │   └── flux/
    │   │       ├── flux-install-localhost.yaml
    │   │       └── svc-metrics.yaml
    │   ├── clusters/
    │   │   └── biohazard/
    │   │       ├── config/
    │   │       │   ├── externalsecret-secrets.yaml
    │   │       │   ├── externalsecret-vars.yaml
    │   │       │   ├── gvisor.yaml
    │   │       │   └── kustomization.yaml
    │   │       ├── flux/
    │   │       │   ├── externalsecret.yaml
    │   │       │   ├── flux-repo.yaml
    │   │       │   └── kustomization.yaml
    │   │       └── talos/
    │   │           ├── talconfig.yaml
    │   │           ├── talsecret.yaml
    │   │           └── watchdog.yaml
    │   ├── deploy/
    │   │   ├── apps/
    │   │   │   ├── README.md
    │   │   │   ├── kustomization.yaml
    │   │   │   ├── ns.yaml
    │   │   │   ├── actual/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       └── hr.yaml
    │   │   │   ├── atuin/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       └── hr.yaml
    │   │   │   ├── audiobookshelf/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── hr.yaml
    │   │   │   │       ├── pvc.yaml
    │   │   │   │       └── volsync.yaml
    │   │   │   ├── authentik/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   ├── app/
    │   │   │   │   │   ├── es.yaml
    │   │   │   │   │   ├── hr.yaml
    │   │   │   │   │   ├── netpol.yaml
    │   │   │   │   │   └── tls.yaml
    │   │   │   │   └── forward-auth/
    │   │   │   │       ├── ingress.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── blocky/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       ├── hr.yaml
    │   │   │   │       ├── netpol.yaml
    │   │   │   │       ├── pg.yaml
    │   │   │   │       └── config/
    │   │   │   │           ├── config.yaml
    │   │   │   │           └── kustomization.yaml
    │   │   │   ├── code-server/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       ├── hr.yaml
    │   │   │   │       ├── pvc.yaml
    │   │   │   │       ├── rbac.yaml
    │   │   │   │       └── talos-serviceaccount.yaml
    │   │   │   ├── cryptpad/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       └── hr.yaml
    │   │   │   ├── cyberchef/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       └── hr.yaml
    │   │   │   ├── davis/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── authentik.yaml
    │   │   │   │       ├── es.yaml
    │   │   │   │       └── hr.yaml
    │   │   │   ├── dns/
    │   │   │   │   ├── README.org
    │   │   │   │   └── dnsdist/
    │   │   │   │       ├── ks.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       └── app/
    │   │   │   │           └── hr.yaml
    │   │   │   ├── elk/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── hr.yaml
    │   │   │   │       └── secrets.yaml
    │   │   │   ├── excalidraw/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── app/
    │   │   │   │   │   └── hr.yaml
    │   │   │   │   └── deps/
    │   │   │   │       └── namespace.yaml
    │   │   │   ├── fava/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── hr.yaml
    │   │   │   │       └── ns.yaml
    │   │   │   ├── firefly/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       ├── hr.yaml
    │   │   │   │       └── ns.yaml
    │   │   │   ├── flatnotes/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       ├── hr.yaml
    │   │   │   │       ├── ns.yaml
    │   │   │   │       └── pvc.yaml
    │   │   │   ├── fortidynasync/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       └── hr.yaml
    │   │   │   ├── go-discord-modtools/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       └── hr.yaml
    │   │   │   ├── goatcounter/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       └── hr.yaml
    │   │   │   ├── gokapi/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── hr.yaml
    │   │   │   │       └── netpol.yaml
    │   │   │   ├── gotosocial/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       ├── hr.yaml
    │   │   │   │       ├── s3.yaml
    │   │   │   │       └── tls.yaml
    │   │   │   ├── gts-robo/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── crunchy.yaml
    │   │   │   │       ├── netpol.yaml
    │   │   │   │       └── s3.yaml
    │   │   │   ├── home-assistant/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       ├── hr.yaml
    │   │   │   │       ├── multus.yaml
    │   │   │   │       └── netpol.yaml
    │   │   │   ├── homebox/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       └── hr.yaml
    │   │   │   ├── immich/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── dns.yaml
    │   │   │   │       ├── es.yaml
    │   │   │   │       ├── hr.yaml
    │   │   │   │       ├── netpol.yaml
    │   │   │   │       └── pvc.yaml
    │   │   │   ├── insurgency-sandstorm/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       ├── hr.yaml
    │   │   │   │       ├── netpol.yaml
    │   │   │   │       ├── pvc.yaml
    │   │   │   │       └── config/
    │   │   │   │           ├── Engine.ini
    │   │   │   │           ├── Game.ini
    │   │   │   │           ├── kustomization.yaml
    │   │   │   │           ├── MapCycle.txt
    │   │   │   │           └── Mods.txt
    │   │   │   ├── k8s-schemas/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── hr.yaml
    │   │   │   │       ├── rbac.yaml
    │   │   │   │       ├── s3.yaml
    │   │   │   │       └── secrets.yaml
    │   │   │   ├── kah/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   ├── deps/
    │   │   │   │   │   └── tls.yaml
    │   │   │   │   └── inspircd/
    │   │   │   │       ├── dns-external.yaml
    │   │   │   │       ├── hr.yaml
    │   │   │   │       ├── netpol.yaml
    │   │   │   │       └── secrets.yaml
    │   │   │   ├── kanidm/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       └── hr.yaml
    │   │   │   ├── kromgo/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── hr.yaml
    │   │   │   │       └── config/
    │   │   │   │           ├── config.yaml
    │   │   │   │           └── kustomization.yaml
    │   │   │   ├── languagetool/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       └── hr.yaml
    │   │   │   ├── librespeed/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       └── hr.yaml
    │   │   │   ├── linkding/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       ├── hr.yaml
    │   │   │   │       └── pvc.yaml
    │   │   │   ├── maloja/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       ├── hr.yaml
    │   │   │   │       ├── ns.yaml
    │   │   │   │       └── pvc.yaml
    │   │   │   ├── media/
    │   │   │   │   ├── _deps/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── ns.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       └── pvc.yaml
    │   │   │   │   ├── jellyfin/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       └── hr.yaml
    │   │   │   │   ├── kavita/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       └── hr.yaml
    │   │   │   │   ├── komga/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       ├── es.yaml
    │   │   │   │   │       └── hr.yaml
    │   │   │   │   ├── navidrome/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       ├── es.yaml
    │   │   │   │   │       └── hr.yaml
    │   │   │   │   └── plex/
    │   │   │   │       ├── ks.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       └── app/
    │   │   │   │           ├── hr.yaml
    │   │   │   │           └── pvc.yaml
    │   │   │   ├── minecraft/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   ├── repo.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       ├── hr.yaml
    │   │   │   │       ├── netpol.yaml
    │   │   │   │       ├── pvc.yaml
    │   │   │   │       └── volsync.yaml
    │   │   │   ├── minecraft2/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── hr.yaml
    │   │   │   │       ├── pvc.yaml
    │   │   │   │       └── volsync.yaml
    │   │   │   ├── miniflux/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       ├── hr.yaml
    │   │   │   │       └── ns.yaml
    │   │   │   ├── mlc-llm/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── hr.yaml
    │   │   │   │       └── pvc.yaml
    │   │   │   ├── morphos/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       └── hr.yaml
    │   │   │   ├── nfs-web/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       └── hr.yaml
    │   │   │   ├── ntfy/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── hr.yaml
    │   │   │   │       ├── netpol.yaml
    │   │   │   │       └── secrets.yaml
    │   │   │   ├── ocis/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       └── hr.yaml
    │   │   │   ├── open-webui/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       └── hr.yaml
    │   │   │   ├── paperless-ngx/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── authentik.yaml
    │   │   │   │       ├── es.yaml
    │   │   │   │       ├── hr.yaml
    │   │   │   │       └── netpol.yaml
    │   │   │   ├── phanpy/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── app/
    │   │   │   │       └── hr.yaml
    │   │   │   ├── piped/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       └── hr.yaml
    │   │   │   ├── radicale/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── authentik.yaml
    │   │   │   │       ├── es.yaml
    │   │   │   │       └── hr.yaml
    │   │   │   ├── reactive-resume/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       ├── hr.yaml
    │   │   │   │       └── s3.yaml
    │   │   │   ├── redbot/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── hr.yaml
    │   │   │   │       ├── netpol.yaml
    │   │   │   │       └── secrets.yaml
    │   │   │   ├── redlib/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       └── hr.yaml
    │   │   │   ├── restic-rest-nfs/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       └── hr.yaml
    │   │   │   ├── rimgo/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       ├── hr.yaml
    │   │   │   │       └── ns.yaml
    │   │   │   ├── satisfactory/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── hr.yaml
    │   │   │   │       └── pvc.yaml
    │   │   │   ├── searxng/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       └── hr.yaml
    │   │   │   ├── sillytavern/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       └── hr.yaml
    │   │   │   ├── silverbullet/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       ├── hr.yaml
    │   │   │   │       └── ns.yaml
    │   │   │   ├── soft-serve/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       └── hr.yaml
    │   │   │   ├── stirling-pdf/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       └── hr.yaml
    │   │   │   ├── talosctl-image-pull-agent/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── hr.yaml
    │   │   │   │       ├── ns.yaml
    │   │   │   │       └── talos-serviceaccount.yaml
    │   │   │   ├── thelounge/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── config.yaml
    │   │   │   │       ├── hr.yaml
    │   │   │   │       └── netpol.yaml
    │   │   │   ├── velociraptor/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── config.sops.yaml
    │   │   │   │       ├── hr.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       ├── netpol.yaml
    │   │   │   │       └── .sops.yaml
    │   │   │   ├── vikunja/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       └── hr.yaml
    │   │   │   ├── whoogle/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       └── hr.yaml
    │   │   │   ├── zigbee2mqtt/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── es.yaml
    │   │   │   │       └── hr.yaml
    │   │   │   └── zipline/
    │   │   │       ├── ks.yaml
    │   │   │       ├── kustomization.yaml
    │   │   │       ├── ns.yaml
    │   │   │       └── app/
    │   │   │           ├── hr.yaml
    │   │   │           ├── s3.yaml
    │   │   │           └── secret.yaml
    │   │   ├── core/
    │   │   │   ├── README.md
    │   │   │   ├── _networking/
    │   │   │   │   ├── bird/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── ns.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       ├── hr.yaml
    │   │   │   │   │       ├── kustomization.yaml
    │   │   │   │   │       ├── kustomizeconfig.yaml
    │   │   │   │   │       └── config/
    │   │   │   │   │           └── bird.conf
    │   │   │   │   ├── cilium/
    │   │   │   │   │   ├── README.md
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── app/
    │   │   │   │   │   │   ├── hr.yaml
    │   │   │   │   │   │   ├── prometheusrule-alerts.yaml
    │   │   │   │   │   │   └── config/
    │   │   │   │   │   │       ├── kustomization.yaml
    │   │   │   │   │   │       ├── kustomizeconfig.yaml
    │   │   │   │   │   │       ├── README.org
    │   │   │   │   │   │       ├── biohazard/
    │   │   │   │   │   │       │   ├── helm-values.yaml
    │   │   │   │   │   │       │   └── kustomization.yaml
    │   │   │   │   │   │       ├── hercules/
    │   │   │   │   │   │       │   ├── helm-values.yaml
    │   │   │   │   │   │       │   └── kustomization.yaml
    │   │   │   │   │   │       ├── nuclear/
    │   │   │   │   │   │       │   ├── helm-values.yaml
    │   │   │   │   │   │       │   └── kustomization.yaml
    │   │   │   │   │   │       └── sinon/
    │   │   │   │   │   │           ├── helm-values.yaml
    │   │   │   │   │   │           └── kustomization.yaml
    │   │   │   │   │   ├── loadbalancer/
    │   │   │   │   │   │   ├── BGP.yaml
    │   │   │   │   │   │   ├── es.yaml
    │   │   │   │   │   │   ├── L2.yaml
    │   │   │   │   │   │   └── LB-IPs.yaml
    │   │   │   │   │   └── netpols/
    │   │   │   │   │       ├── cluster-default-kube-dns.yaml
    │   │   │   │   │       ├── flux.yaml
    │   │   │   │   │       ├── kube-system-allow-all.yaml
    │   │   │   │   │       ├── kubevirt.yaml
    │   │   │   │   │       ├── labelled-allow-egress.yaml
    │   │   │   │   │       └── labelled-allow-ingress.yaml
    │   │   │   │   ├── e1000e-fix/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── ns.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       └── hr.yaml
    │   │   │   │   └── multus/
    │   │   │   │       ├── ks.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       └── app/
    │   │   │   │           └── hr.yaml
    │   │   │   ├── db/
    │   │   │   │   ├── emqx/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── ns.yaml
    │   │   │   │   │   ├── app/
    │   │   │   │   │   │   ├── hr.yaml
    │   │   │   │   │   │   └── netpol.yaml
    │   │   │   │   │   └── cluster/
    │   │   │   │   │       ├── emqx.yaml
    │   │   │   │   │       ├── es.yaml
    │   │   │   │   │       └── netpol.yaml
    │   │   │   │   ├── litestream/
    │   │   │   │   │   └── template/
    │   │   │   │   │       ├── externalsecret.yaml
    │   │   │   │   │       └── kustomization.yaml
    │   │   │   │   ├── pg/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── ns.yaml
    │   │   │   │   │   ├── app/
    │   │   │   │   │   │   ├── hr.yaml
    │   │   │   │   │   │   ├── netpol.yaml
    │   │   │   │   │   │   ├── prometheusrule-alerts.yaml
    │   │   │   │   │   │   ├── rbac-pushsecret.yaml
    │   │   │   │   │   │   └── sc-nfs-wal.yaml
    │   │   │   │   │   └── clusters/
    │   │   │   │   │       ├── default/
    │   │   │   │   │       │   ├── ks.yaml
    │   │   │   │   │       │   └── kustomization.yaml
    │   │   │   │   │       ├── home/
    │   │   │   │   │       │   ├── ks.yaml
    │   │   │   │   │       │   └── kustomization.yaml
    │   │   │   │   │       └── template/
    │   │   │   │   │           ├── crunchy.yaml
    │   │   │   │   │           ├── dump-local.yaml
    │   │   │   │   │           ├── kustomization.yaml
    │   │   │   │   │           ├── netpol.yaml
    │   │   │   │   │           ├── nfs.yaml
    │   │   │   │   │           ├── podmonitor.yaml
    │   │   │   │   │           ├── s3.yaml
    │   │   │   │   │           └── pguser/
    │   │   │   │   │               ├── externalsecrets.yaml
    │   │   │   │   │               └── kustomization.yaml
    │   │   │   │   └── redis/
    │   │   │   │       └── template/
    │   │   │   │           └── standalone-mem/
    │   │   │   │               ├── hr.yaml
    │   │   │   │               └── secret-redis.yaml
    │   │   │   ├── dns/
    │   │   │   │   ├── external-dns/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       ├── es.yaml
    │   │   │   │   │       ├── hr.yaml
    │   │   │   │   │       └── ns.yaml
    │   │   │   │   └── internal/
    │   │   │   │       ├── _deps/
    │   │   │   │       │   ├── kustomization.yaml
    │   │   │   │       │   └── ns.yaml
    │   │   │   │       └── k8s-gateway/
    │   │   │   │           ├── ks.yaml
    │   │   │   │           ├── kustomization.yaml
    │   │   │   │           └── app/
    │   │   │   │               ├── hr.yaml
    │   │   │   │               └── netpol.yaml
    │   │   │   ├── flux-system/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── alerts/
    │   │   │   │   │   ├── github/
    │   │   │   │   │   │   ├── alert.yaml
    │   │   │   │   │   │   ├── es.yaml
    │   │   │   │   │   │   └── provider.yaml
    │   │   │   │   │   └── template/
    │   │   │   │   │       ├── alert.yaml
    │   │   │   │   │       ├── es.yaml
    │   │   │   │   │       ├── kustomization.yaml
    │   │   │   │   │       └── provider.yaml
    │   │   │   │   ├── blank/
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── healthcheck/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── misc/
    │   │   │   │   │   ├── grafana.yaml
    │   │   │   │   │   └── servicemonitor.yaml
    │   │   │   │   └── webhook/
    │   │   │   │       ├── ingress.yaml
    │   │   │   │       ├── receiver.yaml
    │   │   │   │       └── secret-token.yaml
    │   │   │   ├── hardware/
    │   │   │   │   ├── README.md
    │   │   │   │   ├── intel-device-plugins/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       ├── _operator.yaml
    │   │   │   │   │       ├── gpu.yaml
    │   │   │   │   │       └── talos-intel-gpu-nfd-rule.yaml
    │   │   │   │   └── node-feature-discovery/
    │   │   │   │       ├── ks.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       └── app/
    │   │   │   │           └── hr.yaml
    │   │   │   ├── ingress/
    │   │   │   │   ├── _deps/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── ns.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       └── kustomization.yaml
    │   │   │   │   ├── cloudflare/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── ns.yaml
    │   │   │   │   │   └── tunnel/
    │   │   │   │   │       ├── hr.yaml
    │   │   │   │   │       ├── netpol.yaml
    │   │   │   │   │       └── secret.yaml
    │   │   │   │   ├── external-proxy-x/
    │   │   │   │   │   ├── README.md
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       ├── hr.yaml
    │   │   │   │   │       └── netpol.yaml
    │   │   │   │   ├── ingress-nginx/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       ├── common-values.yaml
    │   │   │   │   │       ├── default-backend.yaml
    │   │   │   │   │       ├── hr-external.yaml
    │   │   │   │   │       ├── hr-internal.yaml
    │   │   │   │   │       ├── hr-public.yaml
    │   │   │   │   │       ├── kustomization.yaml
    │   │   │   │   │       ├── kustomizeconfig.yaml
    │   │   │   │   │       └── netpol.yaml
    │   │   │   │   └── secrets-sync/
    │   │   │   │       ├── ks.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       └── app/
    │   │   │   │           ├── clustersecretstore.yaml
    │   │   │   │           └── rbac.yaml
    │   │   │   ├── monitoring/
    │   │   │   │   ├── _deps/
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── ns.yaml
    │   │   │   │   ├── alertmanager/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       ├── es.yaml
    │   │   │   │   │       ├── hr.yaml
    │   │   │   │   │       └── config/
    │   │   │   │   │           ├── alertmanager.yaml
    │   │   │   │   │           └── kustomization.yaml
    │   │   │   │   ├── fluentbit/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── ns.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       ├── hr.yaml
    │   │   │   │   │       ├── netpol.yaml
    │   │   │   │   │       ├── rbac.yaml
    │   │   │   │   │       └── config/
    │   │   │   │   │           ├── fluent-bit.yaml
    │   │   │   │   │           └── kustomization.yaml
    │   │   │   │   ├── grafana/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       ├── hr.yaml
    │   │   │   │   │       ├── ingress.yaml
    │   │   │   │   │       └── secrets.yaml
    │   │   │   │   ├── intel-gpu-exporter/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── ns.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       └── hr.yaml
    │   │   │   │   ├── karma/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       └── hr.yaml
    │   │   │   │   ├── kps/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── app/
    │   │   │   │   │   │   ├── hr.yaml
    │   │   │   │   │   │   ├── netpol.yaml
    │   │   │   │   │   │   └── helm-values/
    │   │   │   │   │   │       ├── kube-state-metrics.yaml
    │   │   │   │   │   │       ├── kube.yaml
    │   │   │   │   │   │       ├── kustomization.yaml
    │   │   │   │   │   │       ├── kustomizeconfig.yaml
    │   │   │   │   │   │       └── prom.yaml
    │   │   │   │   │   └── external/
    │   │   │   │   │       ├── alerts.yaml
    │   │   │   │   │       ├── nighthawk.yaml
    │   │   │   │   │       ├── node-exporter.yaml
    │   │   │   │   │       └── smartctl-exporter.yaml
    │   │   │   │   ├── metrics-server/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       └── hr.yaml
    │   │   │   │   ├── node-exporter/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── ns.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       └── hr.yaml
    │   │   │   │   ├── smartctl-exporter/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── ns.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       └── hr.yaml
    │   │   │   │   └── victoria/
    │   │   │   │       ├── ks.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       ├── app/
    │   │   │   │       │   └── hr.yaml
    │   │   │   │       ├── cluster/
    │   │   │   │       │   ├── ingress.yaml
    │   │   │   │       │   ├── netpol.yaml
    │   │   │   │       │   ├── vmagent.yaml
    │   │   │   │       │   ├── vmalert.yaml
    │   │   │   │       │   └── vmsingle.yaml
    │   │   │   │       └── logs/
    │   │   │   │           ├── hr.yaml
    │   │   │   │           └── netpol.yaml
    │   │   │   ├── reloader/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ns.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── hr.yaml
    │   │   │   │       └── secrets.yaml
    │   │   │   ├── secrets/
    │   │   │   │   ├── external-secrets/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── ns.yaml
    │   │   │   │   │   ├── app/
    │   │   │   │   │   │   ├── externalsecret-1password-credentials.yaml
    │   │   │   │   │   │   ├── hr.yaml
    │   │   │   │   │   │   ├── netpol.yaml
    │   │   │   │   │   │   └── dashboards/
    │   │   │   │   │   │       └── kustomization.yaml
    │   │   │   │   │   └── stores/
    │   │   │   │   │       ├── 1password/
    │   │   │   │   │       │   ├── clustersecretstore.yaml
    │   │   │   │   │       │   └── externalsecret-token.yaml
    │   │   │   │   │       └── k8s/
    │   │   │   │   │           ├── clustersecretstore.yaml
    │   │   │   │   │           └── rbac.yaml
    │   │   │   │   ├── onepassword-connect/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── ns.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       ├── externalsecret-1password-credentials.yaml
    │   │   │   │   │       ├── hr.yaml
    │   │   │   │   │       ├── netpol.yaml
    │   │   │   │   │       └── tls.yaml
    │   │   │   │   └── reflector/
    │   │   │   │       ├── ks.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       ├── ns.yaml
    │   │   │   │       └── app/
    │   │   │   │           └── hr.yaml
    │   │   │   ├── spegel/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── app/
    │   │   │   │       └── hr.yaml
    │   │   │   ├── storage/
    │   │   │   │   ├── _csi-addons/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── ns.yaml
    │   │   │   │   │   └── repo.yaml
    │   │   │   │   ├── _external-snapshotter/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── democratic-csi/
    │   │   │   │   │   ├── _deps/
    │   │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   │   └── ns.yaml
    │   │   │   │   │   ├── local-hostpath/
    │   │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   │   └── app/
    │   │   │   │   │   │       └── hr.yaml
    │   │   │   │   │   ├── manual/
    │   │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   │   └── app/
    │   │   │   │   │   │       └── hr.yaml
    │   │   │   │   │   └── nas-zfs-local/
    │   │   │   │   │       ├── ks.yaml
    │   │   │   │   │       ├── kustomization.yaml
    │   │   │   │   │       └── app/
    │   │   │   │   │           ├── dataset.yaml
    │   │   │   │   │           └── zvol.yaml
    │   │   │   │   ├── fstrim/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── ns.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       └── hr.yaml
    │   │   │   │   ├── minio-nas/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── ns.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       ├── es.yaml
    │   │   │   │   │       ├── hr.yaml
    │   │   │   │   │       ├── netpol.yaml
    │   │   │   │   │       └── pvc.yaml
    │   │   │   │   ├── rook-ceph/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── ns.yaml
    │   │   │   │   │   ├── app/
    │   │   │   │   │   │   ├── csi-addons-netpol.yaml
    │   │   │   │   │   │   ├── hr.yaml
    │   │   │   │   │   │   ├── netpol.yaml
    │   │   │   │   │   │   └── dashboards/
    │   │   │   │   │   │       └── kustomization.yaml
    │   │   │   │   │   └── cluster/
    │   │   │   │   │       ├── ks.yaml
    │   │   │   │   │       ├── kustomization.yaml
    │   │   │   │   │       └── biohazard/
    │   │   │   │   │           ├── caddy.yaml
    │   │   │   │   │           ├── hr.yaml
    │   │   │   │   │           ├── ingress.yaml
    │   │   │   │   │           ├── netpol.yaml
    │   │   │   │   │           ├── rgw-admin.yaml
    │   │   │   │   │           └── storageclass.yaml
    │   │   │   │   ├── snapscheduler/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── ns.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       └── hr.yaml
    │   │   │   │   └── volsync/
    │   │   │   │       ├── ks.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       ├── ns.yaml
    │   │   │   │       ├── app/
    │   │   │   │       │   ├── hr.yaml
    │   │   │   │       │   ├── netpol.yaml
    │   │   │   │       │   ├── prometheusrule.yaml
    │   │   │   │       │   └── rgw.yaml
    │   │   │   │       ├── component/
    │   │   │   │       │   └── kustomization.yaml
    │   │   │   │       └── template/
    │   │   │   │           ├── externalsecret-r2.yaml
    │   │   │   │           ├── externalsecret-rgw.yaml
    │   │   │   │           ├── kustomization.yaml
    │   │   │   │           ├── pvc.yaml
    │   │   │   │           ├── rdst.yaml
    │   │   │   │           ├── rsrc-r2.yaml
    │   │   │   │           ├── rsrc-rgw.yaml
    │   │   │   │           └── secrets-restic.yaml
    │   │   │   └── tls/
    │   │   │       ├── .sops.yaml
    │   │   │       └── cert-manager/
    │   │   │           ├── ks.yaml
    │   │   │           ├── kustomization.yaml
    │   │   │           ├── app/
    │   │   │           │   ├── hr.yaml
    │   │   │           │   ├── netpol.yaml
    │   │   │           │   └── ns.yaml
    │   │   │           ├── certs/
    │   │   │           │   └── cert.yaml
    │   │   │           ├── issuer/
    │   │   │           │   ├── es.yaml
    │   │   │           │   └── issuer.yaml
    │   │   │           └── sync/
    │   │   │               ├── clusterexternalsecret.yaml
    │   │   │               ├── pull.yaml
    │   │   │               └── push.yaml
    │   │   └── vm/
    │   │       ├── _kubevirt/
    │   │       │   ├── ks.yaml
    │   │       │   ├── kustomization.yaml
    │   │       │   ├── ns.yaml
    │   │       │   └── repo.yaml
    │   │       ├── ad/
    │   │       │   ├── ks.yaml
    │   │       │   ├── kustomization.yaml
    │   │       │   ├── _deps/
    │   │       │   │   ├── multus.yaml
    │   │       │   │   ├── netpol.yaml
    │   │       │   │   ├── ns.yaml
    │   │       │   │   ├── preference.yaml
    │   │       │   │   ├── svc.yaml
    │   │       │   │   └── type.yaml
    │   │       │   └── template-dc/
    │   │       │       ├── svc.yaml
    │   │       │       └── vm.yaml
    │   │       └── jj/
    │   │           ├── ks.yaml
    │   │           ├── kustomization.yaml
    │   │           ├── _deps/
    │   │           │   ├── netpol.yaml
    │   │           │   ├── ns.yaml
    │   │           │   ├── preference.yaml
    │   │           │   ├── svc.yaml
    │   │           │   └── type.yaml
    │   │           └── template/
    │   │               ├── svc.yaml
    │   │               └── vm.yaml
    │   ├── repos/
    │   │   └── flux/
    │   │       ├── ks.yaml
    │   │       ├── kustomization.yaml
    │   │       └── helm/
    │   │           ├── bjw-s.yaml
    │   │           ├── cert-manager.yaml
    │   │           ├── cilium.yaml
    │   │           ├── crunchydata.yaml
    │   │           ├── csi-driver-nfs.yaml
    │   │           ├── democratic-csi.yaml
    │   │           ├── emberstack.yaml
    │   │           ├── emqx.yaml
    │   │           ├── external-dns.yaml
    │   │           ├── external-secrets.yaml
    │   │           ├── grafana.yaml
    │   │           ├── haproxy.yaml
    │   │           ├── ingress-nginx.yaml
    │   │           ├── intel.yaml
    │   │           ├── k8s-gateway.yaml
    │   │           ├── keda.yaml
    │   │           ├── kyverno.yaml
    │   │           ├── metrics-server.yaml
    │   │           ├── multus.yaml
    │   │           ├── node-feature-discovery.yaml
    │   │           ├── prometheus-community.yaml
    │   │           ├── rook-ceph.yaml
    │   │           ├── spegel.yaml
    │   │           ├── stakater.yaml
    │   │           ├── tailscale.yaml
    │   │           ├── victoria.yaml
    │   │           └── volsync.yaml
    │   └── templates/
    │       └── test/
    │           ├── ks.yaml
    │           ├── kustomization.yaml
    │           └── app/
    │               ├── es.yaml
    │               ├── hr.yaml
    │               └── ns.yaml
    ├── ostree/
    │   ├── build.sh
    │   ├── repos.repo
    │   ├── repos.sh
    │   └── router.yaml
    ├── .archive/
    │   └── kube/
    │       ├── authentik-renovate-cve-test.yaml
    │       ├── clusters/
    │       │   ├── biohazard/
    │       │   │   └── flux/
    │       │   │       └── flux-install.yaml
    │       │   ├── hercules/
    │       │   │   ├── README.md
    │       │   │   ├── config/
    │       │   │   │   └── kustomization.yaml
    │       │   │   ├── kairos/
    │       │   │   │   ├── cloud-config.yaml
    │       │   │   │   ├── install-from-workstation-over-ssh.sh
    │       │   │   │   └── kairos-takeover.sh
    │       │   │   └── talos/
    │       │   │       └── install-from-rescue.sh
    │       │   ├── nuclear/
    │       │   │   ├── config/
    │       │   │   │   ├── kustomization.yaml
    │       │   │   │   └── versions.env
    │       │   │   ├── flux/
    │       │   │   │   ├── flux-install.yaml
    │       │   │   │   ├── flux-repo.yaml
    │       │   │   │   └── kustomization.yaml
    │       │   │   └── talos/
    │       │   │       └── talconfig.yaml
    │       │   └── sinon/
    │       │       ├── README.md
    │       │       ├── config/
    │       │       │   ├── externalsecret-secrets.yaml
    │       │       │   ├── externalsecret-vars.yaml
    │       │       │   └── kustomization.yaml
    │       │       ├── flux/
    │       │       │   ├── externalsecret.yaml
    │       │       │   ├── flux-repo.yaml
    │       │       │   └── kustomization.yaml
    │       │       └── talos/
    │       │           ├── talconfig.yaml
    │       │           └── talsecret.yaml
    │       └── deploy/
    │           ├── apps/
    │           │   ├── collabora/
    │           │   │   ├── ks.yaml
    │           │   │   ├── kustomization.yaml
    │           │   │   └── app/
    │           │   │       ├── es.yaml
    │           │   │       ├── hr.yaml
    │           │   │       └── ns.yaml
    │           │   ├── default/
    │           │   │   ├── ks.yaml
    │           │   │   ├── kustomization.yaml
    │           │   │   └── deps/
    │           │   │       ├── fuck-off.yaml
    │           │   │       ├── namespace.yaml
    │           │   │       └── tls.yaml
    │           │   ├── findmydeviceserver/
    │           │   │   ├── ks.yaml
    │           │   │   ├── kustomization.yaml
    │           │   │   ├── ns.yaml
    │           │   │   └── app/
    │           │   │       ├── hr.yaml
    │           │   │       └── secrets.yaml
    │           │   ├── grocy/
    │           │   │   ├── ks.yaml
    │           │   │   ├── kustomization.yaml
    │           │   │   ├── ns.yaml
    │           │   │   └── app/
    │           │   │       ├── authentik.yaml
    │           │   │       ├── hr.yaml
    │           │   │       └── volsync.yaml
    │           │   ├── headscale/
    │           │   │   ├── ks.yaml
    │           │   │   ├── kustomization.yaml
    │           │   │   ├── ns.yaml
    │           │   │   └── app/
    │           │   │       ├── external-dns.yaml
    │           │   │       ├── hr.yaml
    │           │   │       ├── netpol.yaml
    │           │   │       ├── secrets.yaml
    │           │   │       └── tls.yaml
    │           │   ├── joplin/
    │           │   │   ├── ks.yaml
    │           │   │   ├── kustomization.yaml
    │           │   │   ├── ns.yaml
    │           │   │   └── app/
    │           │   │       ├── externalsecret.yaml
    │           │   │       ├── hr.yaml
    │           │   │       ├── kyverno-pgo-add-sslmode.yaml
    │           │   │       └── secrets.yaml
    │           │   ├── livestream/
    │           │   │   ├── ks.yaml
    │           │   │   ├── kustomization.yaml
    │           │   │   ├── deps/
    │           │   │   │   ├── namespace.yaml
    │           │   │   │   └── tls.yaml
    │           │   │   └── oven/
    │           │   │       ├── ks.yaml
    │           │   │       ├── kustomization.yaml
    │           │   │       ├── engine/
    │           │   │       │   ├── hr.yaml
    │           │   │       │   └── netpol.yaml
    │           │   │       └── player/
    │           │   │           ├── hr.yaml
    │           │   │           └── netpol.yaml
    │           │   ├── media-edit/
    │           │   │   ├── ks.yaml
    │           │   │   ├── kustomization.yaml
    │           │   │   ├── ns.yaml
    │           │   │   └── app/
    │           │   │       ├── es.yaml
    │           │   │       └── hr.yaml
    │           │   ├── neko/
    │           │   │   ├── ks.yaml
    │           │   │   ├── kustomization.yaml
    │           │   │   ├── ns.yaml
    │           │   │   └── xfce/
    │           │   │       ├── hr.yaml
    │           │   │       ├── netpol.yaml
    │           │   │       ├── pvc.yaml
    │           │   │       ├── secrets.yaml
    │           │   │       └── volsync.yaml
    │           │   ├── nextcloud/
    │           │   │   ├── ks.yaml
    │           │   │   ├── kustomization.yaml
    │           │   │   ├── ns.yaml
    │           │   │   └── app/
    │           │   │       ├── hr.yaml
    │           │   │       ├── netpol.yaml
    │           │   │       ├── nfs.yaml
    │           │   │       ├── secrets.yaml
    │           │   │       └── volsync.yaml
    │           │   ├── ollama/
    │           │   │   ├── ks.yaml
    │           │   │   ├── kustomization.yaml
    │           │   │   ├── ns.yaml
    │           │   │   └── app/
    │           │   │       ├── es.yaml
    │           │   │       ├── hr.yaml
    │           │   │       └── pvc.yaml
    │           │   ├── psono/
    │           │   │   ├── ks.yaml
    │           │   │   ├── kustomization.yaml
    │           │   │   ├── ns.yaml
    │           │   │   └── app/
    │           │   │       ├── cm-client.yaml
    │           │   │       ├── hr.yaml
    │           │   │       ├── netpol.yaml
    │           │   │       └── secrets.yaml
    │           │   ├── readeck/
    │           │   │   ├── ks.yaml
    │           │   │   ├── kustomization.yaml
    │           │   │   ├── ns.yaml
    │           │   │   └── app/
    │           │   │       ├── externalsecret.yaml
    │           │   │       └── hr.yaml
    │           │   ├── renovate/
    │           │   │   ├── ks.yaml
    │           │   │   ├── kustomization.yaml
    │           │   │   ├── ns.yaml
    │           │   │   └── app/
    │           │   │       ├── hr.yaml
    │           │   │       └── secrets.yaml
    │           │   ├── syncthing/
    │           │   │   ├── ks.yaml
    │           │   │   ├── kustomization.yaml
    │           │   │   ├── deps/
    │           │   │   │   ├── kustomization.yaml
    │           │   │   │   └── namespace.yaml
    │           │   │   └── user1/
    │           │   │       ├── hr.yaml
    │           │   │       ├── netpol.yaml
    │           │   │       └── volsync.yaml
    │           │   ├── tetragon/
    │           │   │   ├── ks.yaml
    │           │   │   ├── kustomization.yaml
    │           │   │   └── app/
    │           │   │       └── hr.yaml
    │           │   ├── yagpdb/
    │           │   │   ├── ks.yaml
    │           │   │   ├── kustomization.yaml
    │           │   │   ├── ns.yaml
    │           │   │   └── app/
    │           │   │       ├── hr.yaml
    │           │   │       └── secrets.yaml
    │           │   └── zerotier/
    │           │       ├── 1-namespace.yaml
    │           │       ├── 2-certs.yaml
    │           │       ├── 3-pvc.yaml
    │           │       ├── 4-controller.yaml
    │           │       ├── 5-ui.yaml
    │           │       ├── ks-unfinished.yaml
    │           │       ├── kustomization.yaml
    │           │       └── .sops.yaml
    │           └── core/
    │               ├── _networking/
    │               │   ├── cilium/
    │               │   │   └── app/
    │               │   │       └── bootstrap-install/
    │               │   │           ├── install.sh
    │               │   │           └── kustomization.yaml
    │               │   ├── frr/
    │               │   │   ├── ks.yaml
    │               │   │   ├── kustomization.yaml
    │               │   │   ├── ns.yaml
    │               │   │   └── app/
    │               │   │       └── hr.yaml
    │               │   └── tailscale/
    │               │       ├── ks.yaml
    │               │       ├── kustomization.yaml
    │               │       ├── ns.yaml
    │               │       ├── app/
    │               │       │   ├── clusterrolebinding.yaml
    │               │       │   ├── hr.yaml
    │               │       │   ├── netpol.yaml
    │               │       │   └── secrets-oauth.yaml
    │               │       └── router/
    │               │           ├── hr.yaml
    │               │           ├── netpol.yaml
    │               │           ├── rbac.yaml
    │               │           └── secrets.yaml
    │               ├── db/
    │               │   └── pg/
    │               │       ├── app/
    │               │       │   └── grafana.yaml
    │               │       └── clusters/
    │               │           ├── default/
    │               │           │   ├── cluster.yaml
    │               │           │   ├── crunchy.yaml
    │               │           │   ├── dump-local.yaml
    │               │           │   ├── kustomization.yaml
    │               │           │   ├── netpol.yaml
    │               │           │   ├── nfs.yaml
    │               │           │   ├── s3.yaml
    │               │           │   ├── scheduledbackup.yaml
    │               │           │   ├── secrets-sync.kyverno.yaml
    │               │           │   ├── superuser.sops.yaml
    │               │           │   └── .sops.yaml
    │               │           └── enc/
    │               │               ├── cluster.yaml
    │               │               ├── dump-local.yaml
    │               │               ├── kustomization.yaml
    │               │               ├── netpol.yaml
    │               │               ├── s3.yaml
    │               │               ├── scheduledbackup.yaml
    │               │               ├── superuser.sops.yaml
    │               │               └── .sops.yaml
    │               ├── ingress/
    │               │   └── external/
    │               │       └── install.yaml
    │               ├── kyverno/
    │               │   ├── ks.yaml
    │               │   ├── kustomization.yaml
    │               │   ├── ns.yaml
    │               │   ├── _deps/
    │               │   │   ├── _crds-kyverno.yaml
    │               │   │   └── kustomization.yaml
    │               │   ├── app/
    │               │   │   ├── hr.yaml
    │               │   │   └── netpol.yaml
    │               │   └── policies/
    │               │       ├── anti-delete-all-persistence.yaml
    │               │       ├── cnp-within-ns.yaml
    │               │       ├── flux-system.yaml
    │               │       ├── jellyfin-gpu-patch.yaml
    │               │       └── pod-reloader.yaml
    │               ├── monitoring/
    │               │   ├── _deps/
    │               │   │   └── kube-prometheus.yaml
    │               │   ├── fortigate-exporter/
    │               │   │   ├── ks.yaml
    │               │   │   ├── kustomization.yaml
    │               │   │   ├── ns.yaml
    │               │   │   └── app/
    │               │   │       ├── es.yaml
    │               │   │       └── hr.yaml
    │               │   ├── kps/
    │               │   │   └── app/
    │               │   │       ├── alertmanager/
    │               │   │       │   ├── config.yaml
    │               │   │       │   ├── kustomization.yaml
    │               │   │       │   └── secrets.yaml
    │               │   │       ├── config/
    │               │   │       │   └── node-exporter.yaml
    │               │   │       └── helm-values/
    │               │   │           └── alertmanager.yaml
    │               │   ├── kube-state-metrics/
    │               │   │   ├── ks.yaml
    │               │   │   ├── kustomization.yaml
    │               │   │   └── app/
    │               │   │       └── hr.yaml
    │               │   ├── snmp-exporter/
    │               │   │   ├── ks.yaml
    │               │   │   ├── kustomization.yaml
    │               │   │   ├── ns.yaml
    │               │   │   └── app/
    │               │   │       ├── es.yaml
    │               │   │       └── hr.yaml
    │               │   └── victoria/
    │               │       ├── README.md
    │               │       ├── crds.yaml
    │               │       ├── ks.yaml
    │               │       ├── kustomization.yaml
    │               │       ├── repo.yaml
    │               │       ├── agent/
    │               │       │   └── vmagent.yaml
    │               │       ├── cluster/
    │               │       │   └── vmcluster.yaml
    │               │       └── operator/
    │               │           └── install.yaml
    │               ├── secrets/
    │               │   └── external-secrets/
    │               │       └── stores/
    │               │           └── aws-ssm/
    │               │               ├── clustersecretstore.yaml
    │               │               └── secrets.yaml
    │               ├── storage/
    │               │   ├── csi-driver-nfs/
    │               │   │   ├── ks.yaml
    │               │   │   ├── kustomization.yaml
    │               │   │   └── app/
    │               │   │       └── hr.yaml
    │               │   └── rook-ceph/
    │               │       ├── cluster/
    │               │       │   └── sinon/
    │               │       │       ├── hr.yaml
    │               │       │       ├── netpol.yaml
    │               │       │       └── svc.yaml
    │               │       └── pve/
    │               │           ├── ks.yaml
    │               │           ├── kustomization.yaml
    │               │           └── app/
    │               │               ├── ceph-cluster.sops.yaml
    │               │               ├── ceph-monitor.yaml
    │               │               ├── ceph-prometheus.yaml
    │               │               ├── create-secrets.sh
    │               │               ├── kustomization.yaml
    │               │               ├── object-radosgw-certs.yaml
    │               │               ├── object.yaml
    │               │               ├── pveceph-object.sh
    │               │               ├── secret.sops.yaml
    │               │               ├── storage-class.yaml
    │               │               ├── volume-snapshot-class.yaml
    │               │               └── .sops.yaml
    │               └── system-upgrade-controller/
    │                   ├── ks.yaml
    │                   ├── kustomization.yaml
    │                   ├── ns.yaml
    │                   ├── app/
    │                   │   ├── hr.yaml
    │                   │   ├── netpol.yaml
    │                   │   └── rbac.yaml
    │                   └── plans/
    │                       └── talos/
    │                           ├── ks.yaml
    │                           ├── kustomization.yaml
    │                           └── app/
    │                               ├── k8s.yaml
    │                               ├── rbac.yaml
    │                               └── talos.yaml
    ├── .github/
    │   ├── CODEOWNERS-disabled
    │   └── workflows/
    │       ├── flux-localhost-build.yaml
    │       ├── kube-flux-diff.yaml
    │       ├── ostree-build.yaml
    │       ├── purge-readme-badge-cache.yaml
    │       ├── renovate-rebase.yaml
    │       ├── renovate-sort-prs.py
    │       └── renovate.yaml
    ├── .renovate/
    │   ├── clusters.json5
    │   ├── commitMessage.json5
    │   ├── grafanaDashboards.json5
    │   ├── groups.json5
    │   ├── labels.json5
    │   ├── mise.json5
    │   └── security.json5
    └── .taskfiles/
        ├── README.md
        ├── 1p/
        │   └── Taskfile.dist.yaml
        ├── bootstrap/
        │   └── Taskfile.dist.yaml
        ├── cluster/
        │   ├── cluster-init-sops-apply-configmap-kustomization.tmpl.yaml
        │   ├── cluster-init-sops-apply-secret-kustomization.tmpl.yaml
        │   ├── kustomizeconfig.yaml
        │   └── Taskfile.dist.yaml
        ├── flux/
        │   ├── cantWait.yaml
        │   └── Taskfile.dist.yaml
        ├── k8s/
        │   ├── Taskfile.dist.yaml
        │   └── template/
        │       ├── host-privileged/
        │       │   └── priv-pod.yaml
        │       └── iperf2/
        │           ├── client.yaml
        │           └── server.yaml
        ├── pg/
        │   └── Taskfile.dist.yaml
        ├── pulumi/
        │   └── Taskfile.dist.yaml
        ├── rook/
        │   ├── Taskfile.dist.yaml
        │   ├── wipe-rook-state-job.tmpl.yaml
        │   └── zap-disk-job.tmpl.yaml
        ├── talos/
        │   ├── talhelper-secrets-1p.env
        │   └── Taskfile.dist.yaml
        ├── truenas/
        │   └── Taskfile.dist.yaml
        └── volsync/
            ├── Taskfile.dist.yaml
            └── template/
                ├── ReplicationDestination.tmpl.yaml
                ├── rsrc.tmp.yaml
                └── wipe-pvc.tmpl.yaml


Files Content:

(Files content cropped to 300k characters, download full ingest to see more)
================================================
FILE: README.md
================================================
# Biohazard - JJ's Homelab Monorepo

**<ins>Glorifying jank that *works*.</ins>**

Powered by Flux, Kubernetes, Cilium, Talos, and jank. Amongst others.

<!--![Biohazard - CPU](https://img.shields.io/endpoint?url=https%3A%2F%2Fbiohazard-metrics.jjgadgets.tech%2Fquery%3Fformat%3Dendpoint%26metric%3Dcluster_cpu_usage&style=flat&label=Biohazard%20-%20CPU)
![Biohazard - Memory](https://img.shields.io/endpoint?url=https%3A%2F%2Fbiohazard-metrics.jjgadgets.tech%2Fquery%3Fformat%3Dendpoint%26metric%3Dcluster_memory_usage&style=flat&label=Biohazard%20-%20Memory)
![Blackhawk - Battery Charge](https://img.shields.io/endpoint?url=https%3A%2F%2Fbiohazard-metrics.jjgadgets.tech%2Fquery%3Fformat%3Dendpoint%26metric%3Dblackhawk_battery_percent&style=flat&label=Blackhawk%20-%20Battery%20Charge&link=https%3A%2F%2Fgithub.com%2Fkashalls%2Fkromgo)
![Blackhawk - Battery Health](https://img.shields.io/endpoint?url=https%3A%2F%2Fbiohazard-metrics.jjgadgets.tech%2Fquery%3Fformat%3Dendpoint%26metric%3Dblackhawk_battery_health&style=flat&label=Blackhawk%20-%20Battery%20Health&link=https%3A%2F%2Fgithub.com%2Fkashalls%2Fkromgo)
![Blackhawk - Battery Cycles](https://img.shields.io/endpoint?url=https%3A%2F%2Fbiohazard-metrics.jjgadgets.tech%2Fquery%3Fformat%3Dendpoint%26metric%3Dblackhawk_battery_cycles&style=flat&label=Blackhawk%20-%20Battery%20Health&link=https%3A%2F%2Fgithub.com%2Fkashalls%2Fkromgo)-->
<div align="center">

![Biohazard - Talos](https://biohazard-metrics.jjgadgets.tech/talos_build_version?format=badge)
![Biohazard - Kubernetes](https://biohazard-metrics.jjgadgets.tech/kubernetes_build_version?format=badge)
![Biohazard - Cilium](https://biohazard-metrics.jjgadgets.tech/cilium_version?format=badge)
<br><br>
![Biohazard - CPU](https://biohazard-metrics.jjgadgets.tech/cluster_cpu_usage?format=badge)
![Biohazard - Memory](https://biohazard-metrics.jjgadgets.tech/cluster_memory_usage?format=badge)
![Biohazard - Net TX](https://biohazard-metrics.jjgadgets.tech/cluster_network_transmit_usage?format=badge)
![Biohazard - Net RX](https://biohazard-metrics.jjgadgets.tech/cluster_network_receive_usage?format=badge)
<br><br>
![Biohazard - Cluster Age](https://biohazard-metrics.jjgadgets.tech/cluster_age_days?format=badge)
![Biohazard - Uptime](https://biohazard-metrics.jjgadgets.tech/cluster_uptime_days?format=badge)
![Biohazard - Nodes](https://biohazard-metrics.jjgadgets.tech/cluster_node_count?format=badge)
![Biohazard - Pods Running](https://biohazard-metrics.jjgadgets.tech/cluster_pods_running?format=badge)
![Biohazard - Pods Unhealthy](https://biohazard-metrics.jjgadgets.tech/cluster_pods_unhealthy?format=badge)
![Biohazard - Active Alerts](https://biohazard-metrics.jjgadgets.tech/prometheus_active_alerts?format=badge)
![Biohazard - Cilium Endpoints Unhealthy](https://biohazard-metrics.jjgadgets.tech/cilium_endpoints_unhealthy?format=badge)
![Biohazard - Cilium BPF Map Pressure](https://biohazard-metrics.jjgadgets.tech/cilium_bpf_map_pressure?format=badge)<br><br>
![Darkhawk - Battery](https://biohazard-metrics.jjgadgets.tech/darkhawk_battery_percent?format=badge)

</div>

---

## Overview

This is a mono repository for all the machines in my home infrasturcture, mainly focused around Kubernetes. The main goal is automation and being as hands-off as possible in manual labour and repeated tasks, while remaining agile in making changes to the cluster.

I also explore security solutions within my homelab, due to having my own PII and personal data on my infrastructure, as well as implementing security practices in a practical home "production" environment so that I can understand how things work and how each "security positive" change may impact the end user experience, resource usage, maintenance burden and other factors.

---

## Kubernetes

### Biohazard

This is my production home Kubernetes cluster. It is powered by Talos Linux, which allows for a Kubernetes-centric and appliance-like admin experience. This is a hyperconverged setup, with most of the compute handled here, as well as highly available (HA) application storage and critical data storage in the form of Rook-Ceph, backed up in a 3-2-1 fashion using VolSync running Restic and rclone. Network routing and security is handled by Cilium, which provides powerful NetworkPolicy capabilities while having relatively low maintenance burden.

Some VMs are also run in Biohazard using KubeVirt, which allows integration of Kubernetes-centric abstractions and principles such as NetworkPolicy, DNS service discovery and GitOps, and allows Kubernetes and Rook to manage failover and lifecycle of the VMs.

### Nuclear

This is my test cluster, however it is currently not running. This cluster is used when I want to test a major change involving mass migrations and/or potential prolonged outage, such as moving from Talos VMs on Proxmox VE consuming Proxmox-managed Ceph for storage to baremetal Talos + Rook-managed Ceph.

### GitOps

Flux and Renovate provide a mostly hands-off GitOps experience, where I can push the Kubernetes resources needed to deploy a new app to this Git repo as well as update the Kustomization.yaml used by Flux to control what a given cluster should deploy. From there, Flux will automatically reconcile the changes, and Renovate will ensure updates are either automerged or proposed in Pull Requests for me to review.

## Core Components

These can be found under the `./kube/deploy/core` folder, allowing for clear separation of components that are essential for the cluster to operate to serve apps.

- **Cilium**: Provides network routing, network security, exposing apps via LoadBalancers and other networking functionality.
- **Multus**: Provides secondary network connectivity aside from Cilium, such as connecting pods and KubeVirt VMs to specific VLANs' L2 domains directly.
- **Rook-Ceph**: Provides and manages highly available networked persistent storage within the Kubernetes cluster itself.
- **VolSync**: Provides and manages automated backups and restores of persistent storage.
- **democratic-csi**: Wildcard storage CSI driver supporting multiple backends like local-hostpath.
- **Flux**: Provides GitOps automation for syncing desired state of resources.
- **external-secrets**: Syncs secrets from external sources like 1Password as Kubernetes secrets, with a templating engine.
- **k8s-gateway**: Internal DNS resolver for exposing apps via Ingress, Gateway API and LoadBalancer Services.
- **external-dns**: Syncs DNS records against upstream resolvers' records, such as Cloudflare DNS.
- **cert-manager**: Automated TLS management for generating and rotating signed and trusted TLS certificates stored as Kubernetes secrets.
- **Ingress-NGINX**: Kubernetes Ingress controller for automated configuration of NGINX to reverse proxy HTTP/S apps with automated TLS from cert-manager.
- **cloudflared**: Expose specific apps publicly via Cloudflare Zero Trust tunnel.
- **Crunchy Postgres Operator**: Automated HA Postgres cluster and backups management.
- **VictoriaMetrics**: Pull-based monitoring platform.
- **kube-prometheus-stack + prometheus-operator**: Automated configuration and service discovery for Prometheus (and thus VictoriaMetrics), with shipped defaults for Kubernetes-focused monitoring and alerting.
- **Kyverno**: Kubernetes API webhook policy engine, for validating, mutating and generating resources. Also abused as The Jank Engine.
- **Spegel**: Transparent container registry cache mirror within cluster.
- **system-upgrade-controller**: Auto-update of cluster components' versions such as Talos OS and Kubernetes versions. Combined with GitOps + Renovate for a PR-based auto-updating workflow.

## Networking

My "production" home network is currently primarily powered by Fortinet.

- Firewall: **FortiGate 40F**
- 1GbE switch: **FortiSwitch 108E**, managed, using NAC for VLAN assignment.
- 10GbE switch: **TP-Link TL-ST1008F**, unmanaged, downstream of FortiSwitch so its NAC handles VLAN assignment.
- WiFi Access Point: **FortiAP 221E**

I also tinker with and have previously used other platforms, such as OPNsense firewall, Brocade ICX6450 switch, Aruba S1500-12p switch, Cisco Catalyst 3750G, etc.



================================================
FILE: _redirects
================================================
/ https://github.com/JJGadgets/Biohazard 301


================================================
FILE: LICENSE
================================================
                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.



================================================
FILE: Taskfile.dist.yaml
================================================
---
version: "3"

includes:
  bootstrap:
    aliases: [bs]
    taskfile: .taskfiles/bootstrap/Taskfile.dist.yaml
  # cluster:
  #   aliases: [c]
  #   taskfile: .taskfiles/cluster/Taskfile.dist.yaml
  flux:
    aliases: [f]
    taskfile: .taskfiles/flux/Taskfile.dist.yaml
  k8s:
    aliases: [k]
    taskfile: .taskfiles/k8s/Taskfile.dist.yaml
  pulumi:
    aliases: [pl]
    taskfile: .taskfiles/pulumi/Taskfile.dist.yaml
  talos:
    aliases: [t]
    taskfile: .taskfiles/talos/Taskfile.dist.yaml
  volsync:
    aliases: [vs]
    taskfile: .taskfiles/volsync/Taskfile.dist.yaml
  # cnpg:
  #   aliases: [pg]
  #   taskfile: .taskfiles/cnpg/Taskfile.dist.yaml
  pg:
    taskfile: .taskfiles/pg/Taskfile.dist.yaml
  rook:
    aliases: [r]
    taskfile: .taskfiles/rook
  truenas:
    aliases: [nas]
    taskfile: .taskfiles/truenas/Taskfile.dist.yaml


tasks:
  default:
    silent: true
    cmds: ["task -l"]

  gitconfig:
    desc: Configure Git.
    dir: '{{.USER_WORKING_DIR}}'
    cmds:
      - git config commit.gpgSign true
      - git config pull.rebase true
      - git config rebase.autostash true
      - git config push.autoSetupRemote true
      - git config remote.origin.pushurl git@github.com:JJGadgets/Biohazard.git
      - test -d $HOME/../usr/etc/termux/ && git config gpg.program $HOME/../usr/bin/okc-gpg || true

  mise:
    desc: Use this repo's Mise config for the whole Linux user, via symlink.
    dir: '{{.USER_WORKING_DIR}}'
    cmds:
      - mv ~/.config/mise/config.toml ~/.config/mise/config.toml.old$(date +%Y-%m-%d) || true
      - ln -s $(pwd)/.mise.toml ~/.config/mise/config.toml

  n:
    desc: Create new folder and file within new folder at the same time.
    vars:
      d: '{{ or .d (fail "Dirname is required!") }}'
      f: '{{ or .f (fail "Filename is required!") }}'
    cmds:
      - mkdir -p {{.d}}
      - touch {{.d}}/{{.f}}

  ne:
    desc: Same as `n` task, but edits file as well.
    vars:
      d: '{{ or .d (fail "Dirname is required!") }}'
      f: '{{ or .f (fail "Filename is required!") }}'
    cmds:
      - task: new
      - $EDITOR {{.d}}/{{.f}}

  pwgen:
    vars:
      B: '{{ .B | default "128" }}'
      BCRYPT: '{{ .BCRYPT | default "n" }}'
      SHA256: '{{ .SHA256 | default "n" }}'
    cmds:
      # - USERPW=$(head -c {{.B}} /dev/urandom | base64 -w 0) [[ $BCRYPT == "y" ]] && (echo $USERPW && task pw-bcrypt) || [[ $SHA256 == "y" ]] && (echo $USERPW && echo $USERPW | pw-sha256sum) || (echo $USERPW)
      - |
        export USERPW=$(head -c {{.B}} /dev/urandom | base64 -w 0)
        echo "Your password is:"
        echo "${USERPW}"
        if [[ {{.BCRYPT}} == "y" ]]; then
          echo "Your BCrypt hash is:"
          echo "${USERPW}" | htpasswd -niBC 10 REMOVEME
        fi
        if [[ {{.SHA256}} == "y" ]]; then
          echo "Your SHA256 hash is:"
          echo "${USERPW}" | sha256sum
        fi
        unset USERPW

  pw-bcrypt:
    vars:
      USERPW: '{{ or .USERPW (fail "Missing `USERPW` variable, this Task should be run from the `pwgen` Task!") }}'
    cmds:
      - htpasswd -bnBC 10 REMOVEME {{.USERPW}}

  kubectl-sops:
    silent: true
    desc: Run kubectl commands with a SOPS encrypted $KUBECONFIG file
    preconditions:
      - sh: command -v sops
    vars: &vars
      KUBECONFIGSOPS: '{{ .KUBECONFIG | default "~/.kube/config.sops.yaml" }}'
      KCMD:
        sh: |-
          [[ -n "{{.KCMD}}" ]] && echo "{{.KCMD}}" || [[ -n $(command -v kubecolor) ]] && command -v kubecolor && exit || [[ -n $(command -v kubectl) ]] && command -v kubectl && exit || exit 1
      KUBETMPDIR:
        sh: "mktemp -d"
      KUBECONFIG: "{{.KUBETMPDIR}}/decrypted.yaml"
    cmds:
      # - echo "{{.KUBECTL_CMD}}"
      - defer: "rm {{.KUBECONFIG}} && rmdir {{.KUBETMPDIR}}"
      - |
        mkfifo {{.KUBECONFIG}}
        KUBECONFIG={{.KUBECONFIG}} {{.KCMD}} {{.CLI_ARGS}} &
        KUBECTL_PID=$!
        sops --decrypt --output {{.KUBECONFIG}} {{.KUBECONFIGSOPS}} >/dev/null 2>/dev/null
        wait $KUBECTL_PID



================================================
FILE: .mise.toml
================================================
[env]
_.path = ["{{env.HOME}}/.krew/bin"]
KUBECTL_INTERACTIVE_DELETE = "true"
KUBECTL_COMMAND_HEADERS = "true"
K9S_CONFIG_DIR = "{{config_root}}/dots/k9s"
K9S_DEFAULT_PF_ADDRESS = "[::]"
K9S_FG_NODE_SHELL = "true"
#SSH_AUTH_SOCK = $(gpgconf --list-dirs agent-ssh-socket)
UV_PYTHON = "3.11"
_.python.venv = { path = ".venv", create = true } # create the venv if it doesn't exist
CARAPACE_BRIDGES = "zsh,fish,bash,inshellisense"

[settings]
experimental = true # Cargo backend
python_venv_auto_create = true
python_default_packages_file = "{{config_root}}/.venv/.mise-py-pkg"
pipx_uvx = true

[tools]
"aqua:jdx/mise" = ["2025.1.6"]
"aqua:neovim" = ["0.10.1"]
"aqua:kubernetes/kubectl" = ["1.30.1"]
"aqua:kubecolor" = ["0.0.25"]
"aqua:kubernetes-sigs/krew" = ["0.4.4"]
"ubi:brumhard/krewfile" = ["0.6.3"]
"aqua:ahmetb/kubectx" = ["0.9.5"]
"aqua:junegunn/fzf" = ["0.52.1"] # used by kubectx interactive mode
"aqua:BurntSushi/ripgrep" = ["14.1.1"]
"aqua:kubernetes-sigs/kustomize" = ["5.3.0"]
helm = ["3.16.3"]
"aqua:fluxcd/flux2" = ["2.4.0"]
"aqua:siderolabs/talos" = ["1.9.1"]
talhelper = ["3.0.21"]
"aqua:go-task/task" = ["3.39.2"]
"aqua:cilium/cilium-cli"= ["0.18.3"]
"aqua:1password/cli" = ["2.24.0"]
"aqua:restic" = ["0.18.0"]
"aqua:derailed/k9s" = ["0.32.7"]
soft-serve = ["0.7.4"]
#pulumi = ["3.95.0"]
"aqua:mikefarah/yq" = ["4.44.6"]
"aqua:jq" = ["1.7.1"]
"aqua:cli/cli" = ["2.69.0"]
"aqua:termkit/gama" = ["1.2.1"]
"ubi:CrunchyData/postgres-operator-client" = ["0.5.1"]
"aqua:bloznelis/typioca" = ["3.1.0"] # typing test
"ubi:jkulzer/kubefetch" = ["0.8.1"]
# experimental backends, use `mise up` to install because `mise install` is currently broken for these https://github.com/jdx/mise/issues/2458
python = ["3.11"]
"aqua:astral-sh/uv" = ["0.5.27"] # faster than pipx, and can be installed with mise directly
"pipx:flux-local" = ["6.0.2", "5.5.1"]
"pipx:robusta-dev/krr" = ["v1.17.0"]
"pipx:markitdown" = "latest"
# rust = ["1.80.1"]
# "cargo:cargo-binstall" = ["1.10.3"]
"aqua:cargo-bins/cargo-binstall" = ["1.10.3"]
"cargo:atac" = ["0.17.0"]
"cargo:viddy" = ["1.1.6"]
"cargo:himalaya" = ["1.0.0"]
go = ["1.22.6"]
"go:src.elv.sh/cmd/elvish" = ["0.18.0"]
"go:github.com/aymanbagabas/shcopy" = ["0.1.5"]
"go:github.com/gcla/termshark/v2/cmd/termshark" = ["2.4.0"]
# "go:github.com/go-task/task/v3/cmd/task" = ["3.39.2"]
node = ["23.4.0"]
"npm:renovate" = ["40.13.0"]

[hooks]
postinstall = [
  "krr --install-completion",
  "krew install krew",
  "krewfile -file {{config_root}}/.krewfile",
]

[[hooks.enter]]
shell = "fish"
script = [
  "kubectl completion fish | source",
  "talosctl completion fish | source",
  "flux completion fish | source",
  "yq completion fish | source",
  "flux completion fish | source",
]




================================================
FILE: .pre-commit-config.yaml
================================================
# - repo: https://github.com/onedr0p/sops-pre-commit
#   rev: v2.1.0
#   hooks:
#     - id: forbid-secrets



================================================
FILE: .renovaterc.json5
================================================
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended", // config:base predates config:recommended
    "docker:enableMajor",
    "docker:pinDigests",
    "group:kubernetes",
    "replacements:k8s-registry-move",
    ":disableRateLimiting",
    ":dependencyDashboard",
    ":semanticCommits",
    ":automergeDigest",
    ":automergeBranch",
    ":timezone(Asia/Singapore)",
    "security:openssf-scorecard",
    "helpers:pinGitHubActionDigests",
    //"github>JJGadgets/Biohazard//.renovate/grafanaDashboards.json5",
    "github>buroa/k8s-gitops//.renovate/grafanaDashboards.json5#1b97193da1d11d80918f02de13840aa9f28ef06f",
    "github>JJGadgets/Biohazard//.renovate/mise.json5",
    "github>JJGadgets/Biohazard//.renovate/groups.json5",
    "github>JJGadgets/Biohazard//.renovate/clusters.json5",
    "github>JJGadgets/Biohazard//.renovate/commitMessage.json5",
    "github>JJGadgets/Biohazard//.renovate/labels.json5",
    "github>JJGadgets/Biohazard//.renovate/security.json5"
    //"github>mirceanton/renovate-config//custom-manager-mise.json5#563f485db859084f436e7ce9ff30587263fdec12"
  ],
  "dependencyDashboard": true,
  "dependencyDashboardTitle": "Renovate Dashboard 🤖",
  "suppressNotifications": ["prIgnoreNotification"],
  "rebaseWhen": "behind-base-branch", // automerge needs this, and because I keep breaking my shit lol
  // "schedule": ["on saturday"], // TODO: re-add it when I stop being a shut-in NEET
  // NOTE: forward slashes do not need escaping on Renovate, and a proper escape backslash needs double backslashes because JSON moment
  "ignorePaths": ["**/archive/**", "**/.archive/**", "**/**.sops.**", "./.git", "**/ignore/**"],
  "flux": {
    "fileMatch": ["^kube/.+\\.ya?ml$"]
  },
  "helm-values": {
    "fileMatch": ["^kube/.+\\.ya?ml$"]
  },
  "kubernetes": {
    "fileMatch": ["^kube/.+\\.ya?ml$"]
  },
  "kustomize": {
    "fileMatch": ["^kube/.+\\.ya?ml$"]
  },
  "customManagers": [
    {
      "description": ["Process various other dependencies"],
      "customType": "regex",
      // "fileMatch": ["^kube/.+\\.ya?ml$", "vyos/], // process regex from everywhere
      "fileMatch": [".*"], // process regex from everywhere
      "matchStrings": [
        // Example: `k3s_release_version: "v1.27.3+k3s1"` (general regex matcher)
        "datasource=(?<datasource>\\S+) depName=(?<depName>\\S+)( versioning=(?<versioning>\\S+))?\n.*?\"(?<currentValue>.*)\"\n",
        // Example: `- https://github.com/rancher/system-upgrade-controller/releases/download/v0.11.0/crd.yaml` (e.g. kustomization.yaml lists)
        "datasource=(?<datasource>\\S+) depName=(?<depName>\\S+)( versioning=(?<versioning>\\S+))?\n.*?-\\s(.*?)\/(?<currentValue>[^/]+)\/[^/]+\n",
        // for: apiVersion=helm.cattle.io/v1 kind=HelmChart
        "datasource=(?<datasource>\\S+)\n.*?repo: (?<registryUrl>\\S+)\n.*?chart: (?<depName>\\S+)\n.*?version: (?<currentValue>\\S+)\n"
      ],
      "datasourceTemplate": "{{#if datasource}}{{{datasource}}}{{else}}github-releases{{/if}}",
      "versioningTemplate": "{{#if versioning}}{{{versioning}}}{{else}}semver{{/if}}"
    },
    {
      "description": ["app-template schemas"],
      "customType": "regex",
      "fileMatch": ["^kube/.+\\.ya?ml$"],
      "matchStrings": [
        "\\# yaml\\-language\\-server\\: \\$schema\\=https\\:\\/\\/raw\\.githubusercontent\\.com\\/(?<packageName>[\\w\\-]+\\/[\\w\\-]+)\\/(?<currentValue>app\\-template\\-[\\d\\.]+)"
      ],
      "datasourceTemplate": "github-tags",
      "versioningTemplate": "semver",
      "extractVersionTemplate": "^app-template-(?<version>.*)$"
    }
    //{
    //  "description": "app-template schemas Flux API",
    //  "customType": "regex",
    //  "fileMatch": ["^kube/.+\\.ya?ml$"],
    //  "matchStrings": [
    //    "\\# yaml\\-language\\-server\\: \\$schema\\=https\\:\\/\\/raw\\.githubusercontent\\.com\\/bjw-s\\/helm-charts\\/app-template-[\\S](?<packageName>[\\w\\-]+\\/[\\w\\-]+)\\-(?<currentValue>v[\\w\\d]+).yaml$" // incomplete
    //  ],
    //  "datasourceTemplate": "kubernetes-api",
    //  "versioningTemplate": "kubernetes-api",
    //  "extractVersionTemplate": "^app-template-(?<version>.*)$"
    //}
//# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/app-template-3.7.3/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
//Renovate	Renovate	2025-05-09T23:08:51.9345050Z              {
//Renovate	Renovate	2025-05-09T23:08:51.9345185Z                "datasource": "kubernetes-api",
//Renovate	Renovate	2025-05-09T23:08:51.9345318Z                "depName": "HelmRelease",
//Renovate	Renovate	2025-05-09T23:08:51.9345442Z                "displayPending": "",
//Renovate	Renovate	2025-05-09T23:08:51.9345610Z                "fixedVersion": "helm.toolkit.fluxcd.io/v2beta2",
//Renovate	Renovate	2025-05-09T23:08:51.9345785Z                "currentVersion": "helm.toolkit.fluxcd.io/v2beta2",
//Renovate	Renovate	2025-05-09T23:08:51.9345946Z                "currentValue": "helm.toolkit.fluxcd.io/v2beta2",
//Renovate	Renovate	2025-05-09T23:08:51.9346173Z                "newValue": "helm.toolkit.fluxcd.io/v2",
//Renovate	Renovate	2025-05-09T23:08:51.9346324Z                "newVersion": "helm.toolkit.fluxcd.io/v2",
//Renovate	Renovate	2025-05-09T23:08:51.9346537Z                "packageFile": "kube/deploy/core/_networking/bird/app/hr.yaml",
//Renovate	Renovate	2025-05-09T23:08:51.9346672Z                "updateType": "patch",
//Renovate	Renovate	2025-05-09T23:08:51.9346804Z                "packageName": "HelmRelease"
//Renovate	Renovate	2025-05-09T23:08:51.9346919Z              }
  ]
}



================================================
FILE: .sops-stdin.yaml
================================================
creation_rules:
  - path_regex: \/dev\/stdin
    pgp: >-
      31E70E5BC80C58AFF5DD649921AC5A1AC6E5B7F2



================================================
FILE: .sops.yaml
================================================
creation_rules:
  - path_regex: ((.local|pulumi|terraform)\/.*|(k8s|kube|kubernetes)\/.*tal.*)\.sops\.ya?ml
    pgp: >-
      31E70E5BC80C58AFF5DD649921AC5A1AC6E5B7F2
  - path_regex: (k8s|kube|kubernetes)\/.*\.sops\.ya?ml
    encrypted_regex: "^(data|stringData)$"
    age: >-
      age1u57l4s400gqstc0p485j4646cemntufr0pcyp32yudklsp90xpmszxvnkj
    pgp: >-
      31E70E5BC80C58AFF5DD649921AC5A1AC6E5B7F2
  - path_regex: (k8s|kube|kubernetes)/.*\.ya?ml
    encrypted_regex: ^(data|stringData)$
    age: >-
      age1u57l4s400gqstc0p485j4646cemntufr0pcyp32yudklsp90xpmszxvnkj
    pgp: >-
      31E70E5BC80C58AFF5DD649921AC5A1AC6E5B7F2
  - path_regex: (k8s|kube|kubernetes)/.*\.sops\.env
    age: >-
      age1u57l4s400gqstc0p485j4646cemntufr0pcyp32yudklsp90xpmszxvnkj
    pgp: >-
      31E70E5BC80C58AFF5DD649921AC5A1AC6E5B7F2



================================================
FILE: dots/starship.toml
================================================
add_newline = false
format = "$all"

[time]
disabled = false
format = '[$time]($style) '

[directory]
truncation_length = 0
read_only = " "

[custom.kubectx]
command = "kubectx --current"
when = "test -x $(which kubectx)"
symbol = "🐦"
style = "yellow"
format = '\[[$symbol $output]($style)\] '
shell = ["bash", "--noprofile", "--norc"]

[custom.kubens]
command = "kubens --current"
when = "test -x $(which kubens)"
symbol = ""
style = "green"
format = '\[[$symbol $output]($style)\] '
shell = ["bash", "--noprofile", "--norc"]

[hostname]
ssh_only = false

## Bracketed Segments Preset & Nerd Fonts Symbols Preset
[aws]
format = '\[[$symbol($profile)(\($region\))(\[$duration\])]($style)\]'
symbol = "  "

#[c]
#format = '\[[$symbol($version(-$name))]($style)\]'
#symbol = " "

[cmake]
format = '\[[$symbol($version)]($style)\]'

[cmd_duration]
format = '\[[ $duration]($style)\]'

[cobol]
format = '\[[$symbol($version)]($style)\]'

[conda]
format = '\[[$symbol$environment]($style)\]'
symbol = " "

[crystal]
format = '\[[$symbol($version)]($style)\]'

[dart]
format = '\[[$symbol($version)]($style)\]'

[deno]
format = '\[[$symbol($version)]($style)\]'

[docker_context]
format = '\[[$symbol$context]($style)\]'
symbol = " "

[dotnet]
format = '\[[$symbol($version)(🎯 $tfm)]($style)\]'

[elixir]
format = '\[[$symbol($version \(OTP $otp_version\))]($style)\]'

[elm]
format = '\[[$symbol($version)]($style)\]'

[erlang]
format = '\[[$symbol($version)]($style)\]'

[gcloud]
format = '\[[$symbol$account(@$domain)(\($region\))]($style)\]'

[git_branch]
format = '\[[$symbol$branch]($style)\]'
symbol = " "

[git_commit]
disabled = false

[git_status]
format = '([\[$all_status$ahead_behind\]]($style))'

[golang]
format = '\[[$symbol($version)]($style)\]'
symbol = " "

#[haskell]
#format = '\[[$symbol($version)]($style)\]'
#symbol = " "

[helm]
format = '\[[$symbol($version)]($style)\]'

[hg_branch]
format = '\[[$symbol$branch]($style)\]'
symbol = " "

[java]
format = '\[[$symbol($version)]($style)\]'

[julia]
format = '\[[$symbol($version)]($style)\]'

[kotlin]
format = '\[[$symbol($version)]($style)\]'

[kubernetes]
format = '\[[$symbol$context( \($namespace\))]($style)\]'

[lua]
format = '\[[$symbol($version)]($style)\]'

[memory_usage]
format = '\[$symbol[$ram( | $swap)]($style)\]'
symbol = " "

[nim]
format = '\[[$symbol($version)]($style)\]'

[nix_shell]
format = '\[[$symbol$state( \($name\))]($style)\]'
symbol = " "

[nodejs]
format = '\[[$symbol($version)]($style)\]'
symbol = " "

[ocaml]
format = '\[[$symbol($version)(\($switch_indicator$switch_name\))]($style)\]'

[openstack]
format = '\[[$symbol$cloud(\($project\))]($style)\]'

[package]
format = '\[[$symbol$version]($style)\]'
symbol = " "

[perl]
format = '\[[$symbol($version)]($style)\]'

[php]
format = '\[[$symbol($version)]($style)\]'

[pulumi]
format = '\[[$symbol$stack]($style)\]'

[purescript]
format = '\[[$symbol($version)]($style)\]'

[python]
format = '\[[${symbol}${pyenv_prefix}(${version})(\($virtualenv\))]($style)\]'
symbol = " "

[red]
format = '\[[$symbol($version)]($style)\]'

[ruby]
format = '\[[$symbol($version)]($style)\]'

[rust]
format = '\[[$symbol($version)]($style)\]'
symbol = " "

[scala]
format = '\[[$symbol($version)]($style)\]'

[sudo]
format = '\[[as $symbol]\]'

[swift]
format = '\[[$symbol($version)]($style)\]'

[terraform]
format = '\[[$symbol$workspace]($style)\]'

[username]
format = '\[[$user]($style)\]'

[vagrant]
format = '\[[$symbol($version)]($style)\]'

[vlang]
format = '\[[$symbol($version)]($style)\]'

[zig]
format = '\[[$symbol($version)]($style)\]'



================================================
FILE: dots/vimrc
================================================
" ---
" JJGadgets Vim Configuration - Vim Compatibility
" ---
" Simple text editing configuration for Vim, only core configs like syntax
" highlighting and indents
" All plugins and stuff are handled by Neovim whose init.lua will source .vimrc
" ---
" CREDITS:
"   https://github.com/amix/vimrc - Basic Config
"

" nocompatible, placed first so all others below follow this
set nocompatible

" Prepend mise shims to PATH # TODO: disabled due to `gopls` failing to install
"if has('mac') || has('unix')
"    let $PATH = $HOME . '/.local/share/mise/shims:' . $PATH
"endif

" set vim tmp files (https://stackoverflow.com/a/61585014)
if has('win32')
    set noundofile
    set nobackup
    set noswapfile
    set undodir=
    set backupdir=
    set directory=
elseif has('mac') || has('unix')
    set undofile
    set undolevels=1000         " How many undos
    set undoreload=10000        " number of lines to save for undo

    set backup                        " enable backups
    set swapfile                      " enable swaps

    set undodir=/tmp/.vim/tmp/undo"     " undo files
    set backupdir=/tmp/.vim/tmp/backup " backups
    set directory=/tmp/.vim/tmp/swap   " swap files
endif

" Make those folders automatically if they don't already exist.
if !isdirectory(expand(&undodir))
    call mkdir(expand(&undodir), "p")
endif
if !isdirectory(expand(&backupdir))
    call mkdir(expand(&backupdir), "p")
endif
if !isdirectory(expand(&directory))
    call mkdir(expand(&directory), "p")
endif

" set yank to: remember last 100 files' marks, yank across files if <10k lines
" and <5MB, and disable search highlighting on startup
set viminfo='100,<10000,s5000,h

" set clipboard to work across OS
set clipboard+=unnamedplus

" Sets how many lines of history VIM has to remember
set history=500

" Enable filetype plugins
filetype plugin on
filetype indent on
autocmd BufNewFile,BufRead *.json5 set filetype=jsonc
function DetectGoHtmlTmpl()
    if expand('%:e') == "html" && search("{{") != 0
        setfiletype gohtmltmpl
    endif
endfunction
augroup filetypedetect
    " gohtmltmpl
    au BufRead,BufNewFile *.html call DetectGoHtmlTmpl()
augroup END

" Set to auto read when a file is changed from the outside
set autoread
au FocusGained,BufEnter * silent! checktime

" With a map leader it's possible to do extra key combinations
" let mapleader = " "
map <SPACE> <Leader>
map "," <LocalLeader>

" Fast saving
nmap <SPACE><SPACE> :w<cr>

" Fast quitting
nmap <SPACE>q<SPACE> :q<cr>

" :ww mkdirs the file dir
let cwdmkdir=fnamemodify(expand('<afile>'), ':h')
let cwfmkdir=expand('<afile>')
let mkdircommand="mkdir -p '" . cwdmkdir . "'" " TODO: cleanup
" command! ww call mkdir(cwdmkdir, 'p') execute 'w'
command! W call system(mkdircommand) execute 'w'
" command! WW # TODO: setup sudo mkdir then sudo write
" :W sudo saves the file
" (useful for handling the permission-denied error)
command! WS execute 'w !sudo tee % > /dev/null' <bar> edit!

" open file
nmap <leader>ff :Explore<cr>

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" => VIM user interface
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Avoid garbled characters in Chinese language windows OS
let $LANG='en'
set langmenu=en
source $VIMRUNTIME/delmenu.vim
source $VIMRUNTIME/menu.vim

" Turn on the Wild menu
set wildmenu
set wildmode=longest:list,full

" Ignore compiled files
set wildignore=*.o,*~,*.pyc
if has("win16") || has("win32")
    set wildignore+=.git\*,.hg\*,.svn\*
else
    set wildignore+=*/.git/*,*/.hg/*,*/.svn/*,*/.DS_Store
endif

" Always show current position
set ruler

" Height of the command bar
set cmdheight=1

" A buffer becomes hidden when it is abandoned
set hid

" Configure backspace so it acts as it should act
set backspace=eol,start,indent
" set whichwrap+=<,>,h,l

" Ignore case when searching
set ignorecase

" When searching try to be smart about cases
set smartcase

" Highlight search results
set hlsearch

" Makes search act like search in modern browsers
set incsearch

" Don't redraw while executing macros (good performance config)
if !has('nvim')
  set lazyredraw
endif

" For regular expressions turn magic on
set magic

" Show matching brackets when text indicator is over them
set showmatch

" How many tenths of a second to blink when matching brackets
set mat=2

" No annoying sound on errors
set noerrorbells
set novisualbell
set t_vb=
set tm=500

" Properly disable sound on errors on MacVim
if has("gui_macvim")
    autocmd GUIEnter * set vb t_vb=
endif

" folding/collapse
set foldenable
set foldcolumn=1 " minimum column width
nnoremap <Tab> za
augroup remember_folds " https://github.com/kevinhwang91/nvim-ufo/issues/115 https://github.com/neovim/neovim/blob/bfe6b49447744cea1cd941660b2a3a501a0701cb/runtime/doc/fold.txt#L42-L43
  autocmd!
  autocmd BufWinLeave *.* mkview
  autocmd BufWinEnter *.* silent! loadview
  autocmd BufWinEnter *.* set viewoptions-=curdir
augroup END


"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" => Colors and Fonts
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Enable line numbers
set number relativenumber

" Enable syntax highlighting
syntax enable

" Set regular expression engine automatically
set regexpengine=0

" Enable 256 colors palette in Gnome Terminal
if $COLORTERM == 'gnome-terminal'
    set t_Co=256
endif

" Set colorscheme based on availability, from Neovim-only, to Vim custom/plugin, to Vim preinstalled
try
  colorscheme catppuccin
  catch
  try
    colorscheme tokyonight
    catch
    try
      colorscheme dracula
      catch
      try
        colorscheme slate
        catch
      endtry
    endtry
  endtry
endtry

set background=dark

" Set extra options when running in GUI mode
if has("gui_running")
    set guioptions-=T
    set guioptions-=e
    set t_Co=256
    set guitablabel=%M\ %t
endif

" Set utf8 as standard encoding and en_US as the standard language
set encoding=utf8

" Use Unix as the standard file type
set ffs=unix,dos,mac


"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" => Files, backups and undo
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Turn backup off, since most stuff is in SVN, git etc. anyway...
set nobackup
set nowb
set noswapfile


"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" => Text, tab and indent related
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Use spaces instead of tabs
set expandtab

" Be smart when using tabs ;)
set smarttab

" 1 tab == 4 spaces
set shiftwidth=2
set tabstop=2

set ai "Auto indent
set si "Smart indent
set wrap "Wrap lines

" Fix auto-indentation for YAML files
autocmd FileType yaml,yml setlocal ts=2 sts=2 sw=2 expandtab indentkeys-=0# indentkeys-=<:>

""""""""""""""""""""""""""""""
" => Visual mode related
""""""""""""""""""""""""""""""
" Visual mode pressing * or # searches for the current selection
" Super useful! From an idea by Michael Naumann
vnoremap <silent> * :<C-u>call VisualSelection('', '')<CR>/<C-R>=@/<CR><CR>
vnoremap <silent> # :<C-u>call VisualSelection('', '')<CR>?<C-R>=@/<CR><CR>


"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" => Moving around, tabs, windows and buffers
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Smart way to move between windows
nmap <leader>w<Left> <C-W><Left>
nmap <leader>w<Down> <C-W><Down>
nmap <leader>w<Up> <C-W><Up>
nmap <leader>w<Right> <C-W><Right>

" Close the current buffer
map <leader>bd :Bclose<cr>:tabclose<cr>gT

" Close all the buffers
map <leader>bc :bufdo bd<cr>

map <leader>b<Right> :bnext<cr>
map <leader>b<Left> :bprevious<cr>

" Useful mappings for managing tabs
map <C-t> :tabnew<cr>
map <leader>tn :tabnew<cr>
map <leader>to :tabonly<cr>
map <leader>tc :tabclose<cr>
map <leader>tm :tabmove
map <leader>t<leader> :tabnext<cr>

" Let 'tl' toggle between this and the last accessed tab
let g:lasttab = 1
nmap <leader>tl :exe "tabn ".g:lasttab<CR>
au TabLeave * let g:lasttab = tabpagenr()


" Opens a new tab with the current buffer's path
" Super useful when editing files in the same directory
map <leader>tt :tabedit <C-r>=escape(expand("%:p:h"), " ")<cr>/

" Switch CWD to the directory of the open buffer
map <leader>cd :cd %:p:h<cr>:pwd<cr>

" Specify the behavior when switching between buffers
try
  set switchbuf=useopen,usetab,newtab
  set stal=2
catch
endtry

" Return to last edit position when opening files (You want this!)
au BufReadPost * if line("'\"") > 1 && line("'\"") <= line("$") | exe "normal! g'\"" | endif


""""""""""""""""""""""""""""""
" => Status line
""""""""""""""""""""""""""""""
" Always show the status line
set laststatus=2

" Format the status line
""if !has('nvim')
if ! empty(globpath(&rtp, 'lazy/lualine.nvim/lua/lualine.lua'))
  set statusline=\ %{HasPaste()}%F%m%r%h\ %w\ \ CWD:\ %r%{getcwd()}%h\ \ \ L:%l,C:%c
endif


"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" => Editing mappings
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

" Delete trailing white space on save, useful for some filetypes ;)
fun! CleanExtraSpaces()
    let save_cursor = getpos(".")
    let old_query = getreg('/')
    silent! %s/\s\+$//e
    call setpos('.', save_cursor)
    call setreg('/', old_query)
endfun

if has("autocmd")
    autocmd BufWritePre *.txt,*.js,*.py,*.wiki,*.sh,*.coffee,*.yaml :call CleanExtraSpaces()
endif

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" => Spell checking
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
set nospell
" " Pressing ,ss will toggle and untoggle spell checking
" map <leader>ss :setlocal spell!<cr>
"
" " Shortcuts using <leader>
" map <leader>sn ]s
" map <leader>sp [s
" map <leader>sa zg
" map <leader>s? z=


"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" => Misc
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Remove the Windows ^M - when the encodings gets messed up
noremap <Leader>m mmHmt:%s/<C-V><cr>//ge<cr>'tzt'm

" Quickly open a markdown buffer for scribble
map <leader>x :e ~/buffer.md<cr>

" Toggle paste mode on and off
map <leader>pp :setlocal paste!<cr>


"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" => Helper functions
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Returns true if paste mode is enabled
function! HasPaste()
    if &paste
        return 'PASTE MODE  '
    endif
    return ''
endfunction

" Don't close window, when deleting a buffer
command! Bclose call <SID>BufcloseCloseIt()
function! <SID>BufcloseCloseIt()
    let l:currentBufNum = bufnr("%")
    let l:alternateBufNum = bufnr("#")

    if buflisted(l:alternateBufNum)
        buffer #
    else
        bnext
    endif

    if bufnr("%") == l:currentBufNum
        new
    endif

    if buflisted(l:currentBufNum)
        execute("bdelete! ".l:currentBufNum)
    endif
endfunction

function! CmdLine(str)
    call feedkeys(":" . a:str)
endfunction

function! VisualSelection(direction, extra_filter) range
    let l:saved_reg = @"
    execute "normal! vgvy"

    let l:pattern = escape(@", "\\/.*'$^~[]")
    let l:pattern = substitute(l:pattern, "\n$", "", "")

    if a:direction == 'gv'
        call CmdLine("Ack '" . l:pattern . "' " )
    elseif a:direction == 'replace'
        call CmdLine("%s" . '/'. l:pattern . '/')
    endif

    let @/ = l:pattern
    let @" = l:saved_reg
endfunction



================================================
FILE: dots/k9s/aliases.yaml
================================================
aliases:
  # k9s defaults
  sec: v1/secrets
  jo: jobs
  cr: clusterroles
  crb: clusterrolebindings
  ro: roles
  rb: rolebindings
  np: networkpolicies
  # mine
  dp: deployments
  rsrc: ReplicationSource
  rdst: ReplicationDestination
  cron: cronjob



================================================
FILE: dots/k9s/config.yaml
================================================
---
k9s:
  #skin: dracula
  skin: transparent
  liveViewAutoRefresh: true
  ui:
    enableMouse: true
    reactive: true
  #imageScans:
  #  enable: false
  #  exclusions:
  #    namespaces: []
  #    labels: {}
  logger:
    tail: -1
    sinceSeconds: -1
    fullScreen: true
    textWrap: true
  thresholds:
    cpu:
      critical: 90
      warn: 70
    memory:
      critical: 90
      warn: 70
  namespace:
    active: all
    lockFavorites: true
    favorites: [all, kube-system, rook-ceph, monitoring, dns, flux-system, ingress, pg]



================================================
FILE: dots/k9s/.gitignore
================================================
clusters/**/benchmarks.yaml
benchmarks/**
screen-dumps/**
**/k9s.log




================================================
FILE: dots/k9s/clusters/biohazard/biohazard/config.yaml
================================================
k9s:
  cluster: biohazard
  skin: transparent
  namespace:
    active: all
    lockFavorites: true
    favorites:
    - all
    - kube-system
    - rook-ceph
    - monitoring
    - dns
    - flux-system
    - ingress
    - pg
    - minio-nas
    - authentik
    - media
    - apps
    - vm-ad
    - system-upgrade-controller
  view:
    active: pods
  featureGates:
    nodeShell: true
  portForwardAddress: '[::]'



================================================
SYMLINK: dots/k9s/skins -> skins
================================================




================================================
FILE: dots/kanshi/blackhawk
================================================
profile default{
    output eDP-1 mode 1920x1080
}

profile HomePiKVM {
    output eDP-1 mode 1920x1080 position 0,0 transform normal
    output "The Linux Foundation PiKVM 0x00008800" mode 1920x1080@60Hz transform normal position 0,-1080 adaptive_sync off
}

profile iPad {
    output eDP-1 mode 1920x1080 position 0,0 transform normal
    output HEADLESS-1 mode 2224x1668 transform normal position -1668,0 scale 1.5
    #output HDMI-A-1 mode 2224x1668@100Hz scale 1.5
}

profile HomeLenovo {
    output eDP-1 mode 1920x1080 position 0,0 transform normal
    output "Lenovo Group Limited P27h-20 V906DGZN" mode 2560x1440 transform 90 position -1440,-1480
#    output "Lenovo Group Limited P27h-20 V906DGZN" mode 2560x1440 transform 90 position 1920,-1480
}

profile HomeCaptureCard {
    output eDP-1 mode 1920x1080 position 0,0 transform normal
    output "HJW HDMI TO USB 0x00000001" mode 1920x1080 transform normal position 0,-1080
}

profile HomeTripleCaptureCard {
    output eDP-1 mode 1920x1080 position 0,0 transform normal
    output "Lenovo Group Limited P27h-20 V906DGZN" mode 2560x1440 transform 90 position -1440,-1480
    output "HJW HDMI TO USB 0x00000001" mode 1920x1080 transform normal position 0,-1080
}

profile HomeTriple {
    output eDP-1 mode 1920x1080 position 0,0 transform normal
    output "Lenovo Group Limited P27h-20 V906DGZN" mode 2560x1440 transform 90 position -1440,-1480
    output "AOC 24G2W1G4 0x00000024" mode 1920x1080@144Hz transform normal position 0,-1080 adaptive_sync off
    #adaptive_sync on # TODO: cannot enable adaptive sync on 24G2 over HDMI yet
}

profile HomeAOC {
    output eDP-1 mode 1920x1080 position 0,0 transform normal
    output "AOC 24G2W1G4 0x00000024" mode 1920x1080@144Hz transform normal position 0,-1080 adaptive_sync off
    #adaptive_sync on # TODO: cannot enable adaptive sync on 24G2 over HDMI yet
}

profile iPadHome {
    output eDP-1 mode 1920x1080 position 0,0 transform normal
    output "Lenovo Group Limited P27h-20 V906DGZN" mode 2560x1440 transform 90 position -1920,-1480
    output HEADLESS-1 mode 2224x1668@120Hz transform normal scale 1.5 position 3360,-892
    #output "Unknown fitHeadlessGS 0x0000DFDB" mode 2224x1668@108Hz scale 1.5 position 3360,0
}

profile TV {
    output eDP-1 mode 1920x1080 position 0,0 transform normal
    output "LG Electronics LG TV 0x00000101" mode 3840x2160@60Hz scale 1.0 position -960,-2160
}



================================================
FILE: dots/nvim/init.lua
================================================
-- Vim setup here
--- Basic highly and backwards compatible plugin-less vimrc, including leader mappings for Lazy
if vim.fn.has('win32') and os.getenv("LOCALAPPDATA") then vim.cmd("source " .. os.getenv("LOCALAPPDATA") .. "/.vimrc") else vim.cmd("source ~/.vimrc") end


--- Clipboard via OSC 52
local function normalPaste() -- restore non-OSC 52 paste
  return {
    vim.fn.split(vim.fn.getreg(""), "\n"),
    vim.fn.getregtype(""),
  }
end
vim.o.clipboard = "unnamedplus"
vim.g.clipboard = {
  name = 'OSC 52',
  cache_enabled = 1,
  copy = {
    ['+'] = require('vim.ui.clipboard.osc52').copy('+'),
    ['*'] = require('vim.ui.clipboard.osc52').copy('*'),
  },
  paste = {
    --['+'] = require('vim.ui.clipboard.osc52').paste('+'),
    --['*'] = require('vim.ui.clipboard.osc52').paste('*'),
    ['+'] = normalPaste,
    ['*'] = normalPaste,
  },
}

-- Bootstrap lazy.nvim (https://github.com/folke/lazy.nvim/blob/09d4f0db23d0391760c9e1a0501e95e21678c11a/docs/installation.mdx?plain=1#L100-L144)
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not (vim.uv or vim.loop).fs_stat(lazypath) then
  local lazyrepo = "https://github.com/folke/lazy.nvim.git"
  local out = vim.fn.system({ "git", "clone", "--filter=blob:none", "--branch=stable", lazyrepo, lazypath })
  if vim.v.shell_error ~= 0 then
    vim.api.nvim_echo({
      { "Failed to clone lazy.nvim:\n", "ErrorMsg" },
      { out, "WarningMsg" },
      { "\nPress any key to exit..." },
    }, true, {})
    vim.fn.getchar()
    os.exit(1)
  end
end
vim.opt.rtp:prepend(lazypath)

-- Setup lazy.nvim
require("lazy").setup({
  -- default to latest stable semver
  --defaults = { version = "*" },
  -- check updates but don't notify
  checker = { enabled = true, notify = false },
  -- # Plugins
  spec = {
    --- colorscheme
    { "catppuccin/nvim", name = "catppuccin", lazy = false, priority = 1000, opts = {
      flavour = "mocha",
      highlight_overrides = { all = function(colors) return {
        GitSignsAddLnInline = { fg = colors.teal, style = { "underdotted" } },
        GitSignsChangeLnInline = { fg = colors.yellow, style = { "underdotted" } },
      } end }, -- without this, word_diff inline changes become dark/light text no background https://github.com/lewis6991/gitsigns.nvim/issues/731
      integrations = {
        navic = { enabled = true },
        mason = true,
      },
    }},
    -- { "folke/tokyonight.nvim", lazy = false, priority = 1000, opts = { style = "night" }, },
    --- on-screen key prompts
    { "folke/which-key.nvim", event = "VeryLazy", opts = {} },
    --- visually view Vim marks
    { "chentoast/marks.nvim", event = "VeryLazy", opts = {} },
    -- --- visually view Vim motion destinations
    -- { "tris203/precognition.nvim", event = "VeryLazy", opts = {} },
    -- fancy
    -- { 'rasulomaroff/reactive.nvim' },
    --- rainbow indents
    { "HiPhish/rainbow-delimiters.nvim", event = { "BufReadPre", "BufNewFile" }, },
    { "lukas-reineke/indent-blankline.nvim",
      event = { "BufReadPre", "BufNewFile" },
    	dependencies = { "TheGLander/indent-rainbowline.nvim", },
      main = "ibl",
    	opts = function(_, opts)
    		-- Other blankline configuration here
        -- Load indent-rainbowline
    		return require("indent-rainbowline").make_opts(opts)
    	end,
    },
    --- Git UI
    { "lewis6991/gitsigns.nvim", event = { "BufReadPre", "BufNewFile" }, opts = {
      signs_staged_enable = true,
      signcolumn = true,
      numhl      = true,
      linehl     = true,
      word_diff  = true,
      current_line_blame = true,
      watch_gitdir = { follow_files = true },
    }},
    --- notifications
    { "rcarriga/nvim-notify", event = "VeryLazy", opts = { stages = "static", render = "compact" } }, -- any animations will cause lag over remote connections, especially SSH via iSH on iOS
    --- UI stuff
    --{ "folke/noice.nvim",
    --  dependencies = { "MunifTanjim/nui.nvim", "rcarriga/nvim-notify", },
    --  event = "VeryLazy",
    --  opts = {
    --    -- override markdown rendering so that **cmp** and other plugins use **Treesitter**
    --    lsp = { override = { ["vim.lsp.util.convert_input_to_markdown_lines"] = true, ["vim.lsp.util.stylize_markdown"] = true, ["cmp.entry.get_documentation"] = true, }, }, -- cmp option requires nvim_cmp
    --    -- suggested presets
    --    presets = {
    --      command_palette = true,
    --      long_message_to_split = true,
    --    },
    --  },
    --},
    --- TreeSitter
    { "nvim-treesitter/nvim-treesitter",
      --branch = "master",
      --event = "VeryLazy", -- causes syntax highlighting to be slower to init
      build = ":TSUpdate",
      config = function()
        require("nvim-treesitter.configs").setup({
          ensure_installed = { "c", "lua", "vim", "vimdoc", "yaml", "json", "json5", "go", "dockerfile", "fish", "bash", "python", "javascript", "typescript", "html", "css", "nix" },
          --ensure_installed = 'all',
          ignore_install = { 'org' }, -- nvim-orgmode compatibility
          sync_install = false,
          highlight = {
            enable = true,
            --disable = { "yaml", },
          },
          indent = { enable = true },
        })
      end
    },
    --- telescope
    { "nvim-telescope/telescope.nvim", event = "VeryLazy", },
    --- auto brackets
    { 'windwp/nvim-autopairs', event = "InsertEnter", opts = {}, },
    --- folding
    { "kevinhwang91/nvim-ufo", dependencies = { "kevinhwang91/promise-async" }, event = { "BufReadPre", "BufNewFile" }, opts = {
      provider_selector = function(bufnr, filetype, buftype)
        return { "treesitter", "indent" } -- LSP takes too long to init
      end
    }},
    --- Autocomplete
    { "hrsh7th/nvim-cmp",
      version = false, -- last release is way too old
      event = "InsertEnter",
      dependencies = {
        "hrsh7th/cmp-nvim-lsp",
        "hrsh7th/cmp-buffer",
        "hrsh7th/cmp-path",
        "hrsh7th/cmp-nvim-lsp-signature-help",
        "FelipeLema/cmp-async-path",
        "rasulomaroff/cmp-bufname",
      },
      opts = function()
        vim.api.nvim_set_hl(0, "CmpGhostText", { link = "Comment", default = true })
        local cmp = require("cmp")
        -- autopairs
        cmp.event:on('confirm_done', require('nvim-autopairs.completion.cmp').on_confirm_done())
        -- actual cmp config
        local defaults = require("cmp.config.default")()
        local auto_select = true
        cmp.setup.filetype('gitcommit', {
          sources = cmp.config.sources({
            { name = 'conventionalcommits' },
            { name = 'commit' },
            { name = 'git' },
          }, {
            { name = "async_path" },
            { name = 'buffer' },
          })
        })
        cmp.setup.filetype('org', {
          sources = cmp.config.sources({
            { name = "orgmode" },
            { name = "async_path" },
            { name = 'buffer' },
          })
        })
        return {
          snippet = { expand = function(args) vim.snippet.expand(args.body); end, }, -- REQUIRED to specify snippet engine -- `vim.snippet` for native neovim snippets (Neovim v0.10+)
          sources = cmp.config.sources({ -- multiple tables is so the first table must have no results before the second table is shown, etc
          -- TODO: git sources
            { name = "nvim_lsp_signature_help" },
            { name = "nvim_lsp" },
            { name = "bufname" },
            { name = "async_path" },
            { name = "fish" },
          }, {
            { name = "buffer" },
          }),
          completion = { completeopt = "menu,menuone,noinsert" .. (auto_select and "" or ",noselect"), }, -- suggested config
          preselect = auto_select and cmp.PreselectMode.Item or cmp.PreselectMode.None, -- suggested config
          mapping = cmp.mapping.preset.insert({
            ['<C-b>'] = cmp.mapping.scroll_docs(-4),
            ['<C-f>'] = cmp.mapping.scroll_docs(4),
            ['<C-Space>'] = function()
              if cmp.visible() then cmp.abort(); else cmp.complete(); end
            end,
            ['<C-esc>'] = cmp.mapping.abort(),
            ['<C-c>'] = cmp.mapping.abort(),
            ['<CR>'] = cmp.mapping.confirm({ select = false }),
          }),
          experimental = { ghost_text = { hl_group = "CmpGhostText", }, }, -- suggested config
          sorting = defaults.sorting, -- suggested config
        }
      end,
    },
    { "mtoohey31/cmp-fish", ft = "fish" },
    { "davidsierradz/cmp-conventionalcommits", ft = "gitcommit", },
    { "Dosx001/cmp-commit", ft = "gitcommit", },
    { "petertriho/cmp-git", ft = "gitcommit", },
    { "ray-x/lsp_signature.nvim", event = "LspAttach", opts = {}, },
    --- diagnostics
    { "folke/trouble.nvim", event = "VeryLazy", cmd = "Trouble", opts = {} },
    { "rachartier/tiny-inline-diagnostic.nvim", event = "LspAttach", opts = {
      options = {
        show_source = true,
        multilines = false, -- Neovim native inline diagnostics virtual text takes care of multilines
      },
    } },
    --- LSP
    { "williamboman/mason.nvim", lazy = true },
    { "williamboman/mason-lspconfig.nvim", lazy = true, opts = { automatic_installation = true } },
    { "b0o/schemastore.nvim", lazy = true },
    { "diogo464/kubernetes.nvim", lazy = true, opts = {}, },
    { "someone-stole-my-name/yaml-companion.nvim",
    --{ "msvechla/yaml-companion.nvim",
    --  branch = "kubernetes_crd_detection",
      --event = "VeryLazy",
      ft = { "yaml" },
      dependancies = { "nvim-lua/plenary.nvim" },
      config = function()
        require("telescope").load_extension("yaml_schema")
      end,
    },
    --{ "cenk1cenk2/schema-companion.nvim",
    --  dependencies = { "nvim-lua/plenary.nvim", "nvim-telescope/telescope.nvim" },
    --  ft = "yaml",
    --  --opts = {
    --  config = function()
    --    require("schema-companion").setup({
    --      enable_telescope = true,
    --      matchers = {
    --        require("schema-companion.matchers.kubernetes").setup({ version = "v1.30.1" }),
    --      },
    --    })
    --  end
    --},
    { "neovim/nvim-lspconfig",
      event = { "FileType" },
      --- run lspconfig setup outside lazy stuff
      config = function(_, opts)
        --- Mason must load first? I know it's not the best way, but it's the simplest config lol
        require('mason').setup()
        if vim.fn.isdirectory(vim.fs.normalize('~/.local/share/nvim/mason/registries')) == 0 then vim.cmd('MasonUpdate'); end -- lazy.nvim build not working for this, only run on first init
        require('mason-lspconfig').setup{ automatic_installation = true }
        local lsp = require('lspconfig')
        local caps = function()
          local default_caps = vim.lsp.protocol.make_client_capabilities()
          default_caps.textDocument.completion = require('cmp_nvim_lsp').default_capabilities()['textDocument'].completion --- nvim-cmp completion
          --local default_caps = require('cmp_nvim_lsp').default_capabilities() --- nvim-cmp completion
          default_caps.textDocument.foldingRange = { dynamicRegistration = false, lineFoldingOnly = true } --- nvim-ufo folding
          return default_caps
        end
        --- lazy load Kubernetes.nvim
        local kubernetes_nvim_load = function()
          if vim.bo.filetype == "yaml" then return require('kubernetes').yamlls_schema(); else return ""; end
        end
        local yaml_schemas = {
          {
            name = 'Kubernetes.nvim',
            description = 'Kubernetes schemas extracted from cluster by kubernetes.nvim',
            --url = vim.fn.stdpath("data") .. "/kubernetes.nvim/schema.json",
            -- fileMatch = '**.yaml',
            fileMatch = { '**{kube,k8s,kubernetes}/**/*.yaml', '/tmp/kubectl-edit**.yaml' },
            url = kubernetes_nvim_load(),
          },
          -- {
          --   name = 'Kubernetes',
          --   fileMatch = { 'kube/deploy/**/*.yaml', 'kube/clusters/*/flux/*.yaml', 'kube/clusters/*/config/*.yaml', 'k8s/*.yaml', 'kubernetes/*.yaml', '/tmp/kubectl-edit**.yaml', },
          --   url = "https://raw.githubusercontent.com/yannh/kubernetes-json-schema/master/v1.30.1/all.json",
          -- },
          {
            name = 'Flux Kustomization',
            --description = 'Kubernetes CRD - Flux Kustomization v1',
            fileMatch = 'ks.yaml',
            url = "https://flux.jank.ing/kustomization-kustomize-v1.json",
          },
          {
            name = 'Flux HelmRelease',
            --description = 'Kubernetes CRD - Flux HelmRelease v2beta2',
            fileMatch = 'hr.yaml',
            url = "https://flux.jank.ing/helmrelease-helm-v2beta2.json",
          },
          {
            name = 'Talos Linux MachineConfig',
            fileMatch = '{**/clusterconfig/,/tmp/MachineConfigs.config.talos.dev-v1alpha1}*.yaml',
            url = "https://www.talos.dev/v1.9/schemas/v1alpha1_config.schema.json",
          },
        }
        local schemaStoreCatalog = {
          --- select subset from the JSON schema catalog
          'Talhelper',
          'kustomization.yaml',
          'Taskfile config',
          'Helm Chart.yaml',
          'Helm Chart.lock',
          'docker-compose.yml',
          'GitHub Workflow',
          'GitHub automatically generated release notes configuration',
        }
        local schemaStoreSelect = function(catalog)
          local schemaStoreSchemas = {}
          for k, v in pairs(catalog) do
            schemaStoreSchemas[k] = v
          end
          for _, v in ipairs(yaml_schemas) do
            table.insert(schemaStoreSchemas, v['name'])
          end
          return schemaStoreSchemas
        end
        local yamlCompanionSchemas = function()
          local ycSchemas = {}
          for _, v in ipairs(yaml_schemas) do
            table.insert(ycSchemas, {name = v['name'], uri = v['url']})
          end
          for _, v in ipairs(schemaStoreCatalog) do -- assumes 1 entry per catalog item
            local schemaUrl
            for k, _ in pairs(require('schemastore').yaml.schemas({select={v}})) do
              schemaUrl = k
              break
            end
            table.insert(ycSchemas, {name = v, uri = schemaUrl})
          end
          return ycSchemas
        end
        --- LSP servers config
        local yamlls_config = {
          capabilities = caps(),
          settings = {
            redhat = { telemetry = { enabled = false } },
            yaml = {
              format = {
                enable = true,
                singleQuote = false,
              },
              keyOrdering = false,
              completion = true,
              hover = true,
              validate = true,
              schemaStore = { enable = false, url = "" }, -- disable and set URL to null value to manually choose which SchemaStore, Kubernetes and custom schemas to use
              schemas = require('schemastore').yaml.schemas({
                extra = yaml_schemas,
                select = schemaStoreSelect(schemaStoreCatalog),
              }),
            },
          },
        }
        --- Run LSP server setup
        --- IMPORTANT: if the return of the args passed to setup has a parent {}, use `setup(arg)` where `arg = {...}` so the result is `setup{...}`, rather than `setup{arg}` which becomes `setup{{...}}`
        if vim.bo.filetype == "yaml" then lsp.yamlls.setup( require("yaml-companion").setup { builtin_matchers = { kubernetes = { enabled = true }, }, lspconfig = yamlls_config, schemas = yamlCompanionSchemas() } ); end
        --if vim.bo.filetype == "yaml" then lsp.yamlls.setup( require("schema-companion").setup_client(yamlls_config) ); end
        lsp.taplo.setup { capabilities = caps(), settings = { evenBetterToml = { schema = { associations = {
          ['^\\.mise\\.toml$'] = 'https://mise.jdx.dev/schema/mise.json',
        }}}}}
        local jsonls_config = {
        -- lsp.jsonls.setup {
          filetypes = {"json", "jsonc", "json5"},
          capabilities = caps(),
          settings = {
            json = {
              validate = { enable = true },
              schemas = require('schemastore').json.schemas({
                select = {
                  'Renovate',
                  'GitHub Workflow Template Properties'
                }
              }),
            }
          }
        }
        if vim.bo.filetype == "json" then lsp.jsonls.setup(jsonls_config); end
        if vim.bo.filetype == "json5" then lsp.jsonls.setup(jsonls_config); end
        -- lsp.jsonls.setup(jsonls_config)
        lsp.helm_ls.setup{capabilities = caps(),}
        lsp.lua_ls.setup{capabilities = caps(),}
        lsp.dockerls.setup{capabilities = caps(),}
        lsp.vtsls.setup{capabilities = caps(),}
        lsp.ruff.setup{capabilities = caps(),}
        lsp.basedpyright.setup{capabilities = caps(),}
        if vim.fn.executable('cargo') then lsp.nil_ls.setup{capabilities = caps(),} end
        if vim.fn.executable('nixd') == 1 and vim.fn.executable('nixfmt') then lsp.nixd.setup{capabilities = caps(),} end
        --- show filetype on buffer switch
        vim.api.nvim_create_autocmd('BufEnter', { pattern = '*', callback = function() vim.notify(vim.bo.filetype); end } )
        --- golang
        if vim.fn.executable('go') == 1 then lsp.gopls.setup({capabilities = caps(), settings = { gopls = {
          staticcheck = true,
          gofumpt = true,
          analyses = { unusedparams = true }
        }}}) end
        --- golang formatting on save
        vim.api.nvim_create_autocmd("LspAttach", {
          pattern = '*.go',
          group = vim.api.nvim_create_augroup("lsp_format", { clear = true }),
          callback = function(args)
            vim.api.nvim_create_autocmd("BufWritePre", {
              buffer = args.buf,
              callback = function()
                vim.lsp.buf.format {async = false, id = args.data.client_id }
              end,
            })
          end
        })
        -- keymap to show LSP info
        --:lua vim.notify(vim.inspect(require('lspconfig').util.get_config_by_ft(vim.bo.filetype)))
      end
    },
    --- LSP Context Breadcrumbs
    { "SmiteshP/nvim-navic", lazy = true, opts = { highlight = true, click = true, lsp = { auto_attach = true } } },
    { "utilyre/barbecue.nvim", name = "barbecue", version = "*", event = { "LspAttach" }, dependencies = { "SmiteshP/nvim-navic", }, opts = { theme = "catppuccin", } },
    { "SmiteshP/nvim-navbuddy", dependencies = { "MunifTanjim/nui.nvim", "SmiteshP/nvim-navic" }, event = { "LspAttach" }, opts = { lsp = { auto_attach = true } } },
    --- Golang
    { "ray-x/go.nvim", ft = {"go", 'gomod'}, build = ':lua require("go.install").update_all_sync()', opts = {} },
    --- Org
    { 'nvim-orgmode/orgmode', ft = { 'org' }, opts = {
      org_agenda_files = '~/notes/**/*',
      org_default_notes_file = '~/notes/_inbox.org',
    }},
    --{ "chipsenkbeil/org-roam.nvim", ft = { "org" }, opts = {
    --  directory = "~/notes/Org/Roam",
    --  -- optional
    --  org_files = {"~/notes/**/*.org"}
    --}},
    { "akinsho/org-bullets.nvim", ft = { "org" }, opts = {} },
    { "lukas-reineke/headlines.nvim", ft = { "org" }, opts = {} }, -- uses treesitter
    --- Caddyfile
    { 'isobit/vim-caddyfile', config = function()
    end },
    --- something
    -- { "SmiteshP/nvim-navic" },
    -- { "utilyre/barbecue.nvim" },
    { "pimalaya/himalaya-vim", cmd = "Himalaya" },
  },
})

-- colorscheme
vim.cmd.colorscheme "catppuccin"
-- start rainbow_delimiters
vim.g.rainbow_delimiters = {}
-- use nvim-notify for notifications
vim.notify = require("notify")
-- nvim-ufo
vim.o.foldmethod = "manual" -- override vimrc value as that is meant for pluginless
vim.o.foldlevel = 99
vim.o.foldlevelstart = 99
vim.keymap.set('n', 'zR', require('ufo').openAllFolds)
vim.keymap.set('n', 'zM', require('ufo').closeAllFolds)

-- exrc
vim.o.exrc = true



================================================
FILE: dots/nvim/lazy-lock.json
================================================
{
  "barbecue": { "branch": "main", "commit": "cd7e7da622d68136e13721865b4d919efd6325ed" },
  "catppuccin": { "branch": "main", "commit": "faf15ab0201b564b6368ffa47b56feefc92ce3f4" },
  "cmp-async-path": { "branch": "main", "commit": "9d581eec5acf812316913565c135b0d1ee2c9a71" },
  "cmp-buffer": { "branch": "main", "commit": "3022dbc9166796b644a841a02de8dd1cc1d311fa" },
  "cmp-bufname": { "branch": "main", "commit": "e6ea451b13ff0942232bad19ea6f2bd8929aa86c" },
  "cmp-commit": { "branch": "main", "commit": "5f7d19957012ba114da59f06c7e6a3adafb1751d" },
  "cmp-conventionalcommits": { "branch": "master", "commit": "a4dfacf0601130b7f8afa7c948d735c27802fb7f" },
  "cmp-fish": { "branch": "main", "commit": "3a23492e2aead05522a9887ec685d70e8c987323" },
  "cmp-git": { "branch": "main", "commit": "ec049036e354ed8ed0215f2427112882e1ea7051" },
  "cmp-nvim-lsp": { "branch": "main", "commit": "39e2eda76828d88b773cc27a3f61d2ad782c922d" },
  "cmp-nvim-lsp-signature-help": { "branch": "main", "commit": "031e6ba70b0ad5eee49fd2120ff7a2e325b17fa7" },
  "cmp-path": { "branch": "main", "commit": "91ff86cd9c29299a64f968ebb45846c485725f23" },
  "gitsigns.nvim": { "branch": "main", "commit": "5f808b5e4fef30bd8aca1b803b4e555da07fc412" },
  "go.nvim": { "branch": "master", "commit": "c6d5ca26377d01c4de1f7bff1cd62c8b43baa6bc" },
  "headlines.nvim": { "branch": "master", "commit": "bf17c96a836ea27c0a7a2650ba385a7783ed322e" },
  "himalaya-vim": { "branch": "master", "commit": "0e5d3395441301538c1830366f3212ed55b1d315" },
  "indent-blankline.nvim": { "branch": "master", "commit": "7871a88056f7144defca9c931e311a3134c5d509" },
  "indent-rainbowline.nvim": { "branch": "master", "commit": "572e8157de85d7af3f0085b5c74c059518900649" },
  "kubernetes.nvim": { "branch": "main", "commit": "101e63f8f92b2ae9cf6a78560bc2b2321d1264af" },
  "lazy.nvim": { "branch": "main", "commit": "56ead98e05bb37a4ec28930a54d836d033cf00f2" },
  "lsp_signature.nvim": { "branch": "master", "commit": "fc38521ea4d9ec8dbd4c2819ba8126cea743943b" },
  "marks.nvim": { "branch": "master", "commit": "bb25ae3f65f504379e3d08c8a02560b76eaf91e8" },
  "mason-lspconfig.nvim": { "branch": "main", "commit": "8e46de9241d3997927af12196bd8faa0ed08c29a" },
  "mason.nvim": { "branch": "main", "commit": "e2f7f9044ec30067bc11800a9e266664b88cda22" },
  "nui.nvim": { "branch": "main", "commit": "b58e2bfda5cea347c9d58b7f11cf3012c7b3953f" },
  "nvim-autopairs": { "branch": "master", "commit": "b464658e9b880f463b9f7e6ccddd93fb0013f559" },
  "nvim-cmp": { "branch": "main", "commit": "ca4d3330d386e76967e53b85953c170658255ecb" },
  "nvim-lspconfig": { "branch": "master", "commit": "1aa9f36b6d542dafc0b4a38c48969d036003b00a" },
  "nvim-navbuddy": { "branch": "master", "commit": "f22bac988f2dd073601d75ba39ea5636ab6e38cb" },
  "nvim-navic": { "branch": "master", "commit": "8649f694d3e76ee10c19255dece6411c29206a54" },
  "nvim-notify": { "branch": "master", "commit": "fbef5d32be8466dd76544a257d3f3dce20082a07" },
  "nvim-treesitter": { "branch": "master", "commit": "b31188671d8a060022dbbeb6905019e69e310108" },
  "nvim-ufo": { "branch": "main", "commit": "95cbe2e99901135704aabdc8732d722cf68b12c9" },
  "org-bullets.nvim": { "branch": "main", "commit": "46ae687e22192fb806b5977d664ec98af9cf74f6" },
  "orgmode": { "branch": "master", "commit": "1d8c9b9417f8c8e9fb146d4f54fb1e90a4f7e534" },
  "plenary.nvim": { "branch": "master", "commit": "2d9b06177a975543726ce5c73fca176cedbffe9d" },
  "precognition.nvim": { "branch": "main", "commit": "24f2cc51dccecec4cf3de04bfbd14f5b9e79df0b" },
  "promise-async": { "branch": "main", "commit": "119e8961014c9bfaf1487bf3c2a393d254f337e2" },
  "rainbow-delimiters.nvim": { "branch": "master", "commit": "d803ba7668ba390aa4cfd3580183c982cac36fd8" },
  "schemastore.nvim": { "branch": "main", "commit": "80b0243371163258e6eb3f0932f717b2d732b64e" },
  "telescope.nvim": { "branch": "master", "commit": "2eca9ba22002184ac05eddbe47a7fe2d5a384dfc" },
  "tiny-inline-diagnostic.nvim": { "branch": "main", "commit": "cec1cee1e25bbb2cbc588d40a460953012595479" },
  "trouble.nvim": { "branch": "main", "commit": "46cf952fc115f4c2b98d4e208ed1e2dce08c9bf6" },
  "vim-caddyfile": { "branch": "master", "commit": "24fe0720551883e407cb70ae1d7c03f162d1d5a0" },
  "which-key.nvim": { "branch": "main", "commit": "9b365a6428a9633e3eeb34dbef1b791511c54f70" },
  "yaml-companion.nvim": { "branch": "main", "commit": "131b0d67bd2e0f1a02e0daf2f3460482221ce3c0" }
}



================================================
FILE: dots/nvim/setup.sh
================================================
ln -s $(git rev-parse --show-toplevel)/dots/vimrc ~/.vimrc
ln -s $(git rev-parse --show-toplevel)/dots/nvim ~/.config/nvim



================================================
FILE: kube/bootstrap/README.md
================================================
# Bootstrap Kubernetes cluster

1. Install Flux in hostNetwork mode binded to localhost
2. Load `${CLUSTER_NAME}-vars` (including 1Password and Hubble Vars) and 1Password Connect secrets (Connect credentials and ESO client token) from 1Password
3. Load root ks (flux-repo.yaml) which installs Cilium


================================================
FILE: kube/bootstrap/flux/flux-install-localhost.yaml
================================================
---
# downloads and installs Flux manifests to cluster
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: flux-manifests
  namespace: flux-system
spec:
  interval: 10m
  url: oci://ghcr.io/fluxcd/flux-manifests
  ref:
    tag: "${FLUXCD_VERSION:=v2.2.3}"
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: zzz-flux
  # I don't wanna see it on the top lol
  namespace: flux-system
  labels:
    kustomization.flux.home.arpa/name: "flux"
    kustomization.flux.home.arpa/default: "false"
    kustomization.flux.home.arpa/helmpatches: "false"
    kustomization.flux.home.arpa/prunepatches: "false"
spec:
  interval: 10m
  path: ./
  prune: true
  wait: true
  sourceRef:
    kind: OCIRepository
    name: flux-manifests
  patches:
    # localhost stuff
    - patch: |
        apiVersion: v1
        kind: Namespace
        metadata:
          name: flux-system
          labels:
            pod-security.kubernetes.io/enforce: privileged
            pod-security.kubernetes.io/enforce-version: latest
            pod-security.kubernetes.io/warn: privileged
            pod-security.kubernetes.io/warn-version: latest
            pod-security.kubernetes.io/audit: privileged
            pod-security.kubernetes.io/audit-version: latest
      target:
        kind: Namespace
        name: flux-system
    - patch: |
        - op: add
          path: /spec/template/spec/hostNetwork
          value: true
        - op: remove
          path: /spec/template/spec/containers/0/livenessProbe
        - op: remove
          path: /spec/template/spec/containers/0/readinessProbe
        - op: remove
          path: /spec/template/spec/containers/0/ports
        - op: add
          path: /spec/template/spec/containers/0/env/-
          value:
            name: KUBERNETES_SERVICE_HOST
            value: "127.0.0.1"
        - op: add
          path: /spec/template/spec/containers/0/env/-
          value:
            name: KUBERNETES_SERVICE_PORT
            value: "7445" # Talos KubePrism
        - op: add
          path: /spec/template/spec/containers/0/env/-
          value:
            name: SOURCE_CONTROLLER_LOCALHOST
            value: 127.0.0.1:9790
        - op: add
          path: /spec/template/spec/containers/0/env/-
          value:
            name: POD_IP
            valueFrom:
              fieldRef:
                apiVersion: v1
                fieldPath: status.podIP
        - op: replace
          path: /spec/template/spec/containers/0/args
          value:
            - --watch-all-namespaces=true
            - --log-level=debug
            - --log-encoding=json
            - --enable-leader-election=false
            - --metrics-addr=$(POD_IP):$(METRICS_PORT)
            - --health-addr=127.0.0.1:$(HEALTH_PORT) # hopefully your pod IP uses InternalIP and isn't a public IP, none of mine are at least
        - op: add
          path: /spec/template/metadata/labels/flux
          value: localhost
        - op: add
          path: /spec/template/spec/affinity
          value:
            podAffinity:
              requiredDuringSchedulingIgnoredDuringExecution:
                - topologyKey: kubernetes.io/hostname
                  labelSelector:
                    matchLabels:
                      flux: localhost # schedule all Flux pods on the same node
            nodeAffinity:
              requiredDuringSchedulingIgnoredDuringExecution:
                nodeSelectorTerms:
                  - matchExpressions:
                      - key: node-role.kubernetes.io/control-plane # only schedule on control plane nodes
                        operator: Exists
                      - key: fuckoff.home.arpa/flux # don't schedule on this node
                        operator: DoesNotExist
      target:
        kind: Deployment
    - patch: |
        - op: add
          path: /spec/template/spec/containers/0/args/-
          value: --storage-addr=127.0.0.1:9790
        - op: add
          path: /spec/template/spec/containers/0/args/-
          value: --storage-path=/data
        - op: add
          path: /spec/template/spec/containers/0/args/-
          value: --storage-adv-addr=127.0.0.1:9790
        - op: add
          path: /spec/template/spec/containers/0/env/-
          value:
            name: METRICS_PORT
            value: "9791"
        - op: add
          path: /spec/template/spec/containers/0/env/-
          value:
            name: HEALTH_PORT
            value: "9792"
      target:
        kind: Deployment
        name: source-controller
    - patch: |
        - op: add
          path: /spec/template/spec/containers/0/env/-
          value:
            name: METRICS_PORT
            value: "9793"
        - op: add
          path: /spec/template/spec/containers/0/env/-
          value:
            name: HEALTH_PORT
            value: "9794"
      target:
        kind: Deployment
        name: kustomize-controller
    - patch: |
        - op: add
          path: /spec/template/spec/containers/0/env/-
          value:
            name: METRICS_PORT
            value: "9795"
        - op: add
          path: /spec/template/spec/containers/0/env/-
          value:
            name: HEALTH_PORT
            value: "9796"
      target:
        kind: Deployment
        name: helm-controller
    - patch: |
        - op: add
          path: /spec/template/spec/containers/0/args/-
          value: --events-addr=http://127.0.0.1:9690/
      target:
        kind: Deployment
        name: "(kustomize-controller|helm-controller|source-controller)"
    - patch: |
        - op: add
          path: /spec/template/spec/containers/0/args/-
          value: --events-addr=127.0.0.1:9690
        - op: add
          path: /spec/template/spec/containers/0/args/-
          value: --receiverAddr=:59292
        - op: add
          path: /spec/template/spec/containers/0/env/-
          value:
            name: METRICS_PORT
            value: "9798"
        - op: add
          path: /spec/template/spec/containers/0/env/-
          value:
            name: HEALTH_PORT
            value: "9799"
      target:
        kind: Deployment
        name: notification-controller
    - patch: |
        - op: replace
          path: /spec/ports
          value:
            - name: http
              port: 80
              protocol: TCP
              targetPort: 59292 # use number since we removed containerPorts
      target:
        kind: Service
        name: webhook-receiver
    # scheduling
    - patch: |
        - op: add
          path: /spec/template/spec/tolerations
          value:
            - key: node.cilium.io/agent-not-ready
              operator: Exists
        - op: replace
          path: /spec/strategy
          value:
            type: Recreate # avoid new pods stuck on CrashLoop because localhost is already binded
        - op: add
          path: /spec/strategy
          value:
            type: Recreate # avoid new pods stuck on CrashLoop because localhost is already binded
      target:
        kind: Deployment
    # Increase the number of reconciliations that can be performed in parallel and bump the resources limits
    # https://fluxcd.io/flux/cheatsheets/bootstrap/#increase-the-number-of-workers
    - patch: |
        - op: add
          path: /spec/template/spec/containers/0/args/-
          value: --concurrent=100
        - op: add
          path: /spec/template/spec/containers/0/args/-
          value: --kube-api-qps=5000
        - op: add
          path: /spec/template/spec/containers/0/args/-
          value: --kube-api-burst=10000
        - op: add
          path: /spec/template/spec/containers/0/args/-
          value: --requeue-dependency=5s
        - op: add
          path: /spec/template/spec/volumes/0/emptyDir
          value:
            medium: Memory
      target:
        kind: Deployment
        name: "(kustomize-controller|helm-controller|source-controller)"
    - patch: |
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: not-used
        spec:
          template:
            spec:
              containers:
                - name: manager
                  resources:
                    limits:
                      cpu: 2000m
                      memory: 2Gi
      target:
        kind: Deployment
        name: "(kustomize-controller|helm-controller|source-controller)"
    # Enable Helm near OOM detection
    # Enable drift detection for HelmReleases and set the log level to debug
    # https://fluxcd.io/flux/cheatsheets/bootstrap/#enable-helm-near-oom-detection
    - patch: |
        - op: add
          path: /spec/template/spec/containers/0/args/-
          value: --feature-gates=OOMWatch=true,DetectDrift=true,CorrectDrift=false
        - op: add
          path: /spec/template/spec/containers/0/args/-
          value: --oom-watch-memory-threshold=95
        - op: add
          path: /spec/template/spec/containers/0/args/-
          value: --oom-watch-interval=500ms
      target:
        kind: Deployment
        name: helm-controller
    - patch: | # Reloader reloads Flux kustomize-controller to force re-envsubst with new values
        - op: add
          path: /metadata/annotations
          value:
            secret.reloader.stakater.com/reload: biohazard-vars,biohazard-secrets,nuclear-vars,nuclear-secrets,herclues-vars,hercules-secrets,sinon-vars,sinon-secrets
      target:
        kind: Deployment
        name: kustomize-controller
    # delete image-* deployments
    - patch: |
        $patch: delete
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: not-used
      target:
        kind: Deployment
        labelSelector: app.kubernetes.io/component in (image-reflector-controller, image-automation-controller)



================================================
FILE: kube/bootstrap/flux/svc-metrics.yaml
================================================
---
apiVersion: v1
kind: Service
metadata:
  name: &app source-controller-metrics
  namespace: flux-system
  labels: &labels
    app: source-controller
    flux: localhost
spec:
  type: ClusterIP
  selector: *labels
  ports:
    - name: metrics
      port: 9791
      protocol: TCP
---
apiVersion: v1
kind: Service
metadata:
  name: &app kustomize-controller-metrics
  namespace: flux-system
  labels: &labels
    app: kustomize-controller
    flux: localhost
spec:
  type: ClusterIP
  selector: *labels
  ports:
    - name: metrics
      port: 9793
      protocol: TCP
---
apiVersion: v1
kind: Service
metadata:
  name: &app helm-controller-metrics
  namespace: flux-system
  labels: &labels
    app: helm-controller
    flux: localhost
spec:
  type: ClusterIP
  selector: *labels
  ports:
    - name: metrics
      port: 9795
      protocol: TCP
---
apiVersion: v1
kind: Service
metadata:
  name: &app notification-controller-metrics
  namespace: flux-system
  labels: &labels
    app: notification-controller
    flux: localhost
spec:
  type: ClusterIP
  selector: *labels
  ports:
    - name: metrics
      port: 9798
      protocol: TCP



================================================
FILE: kube/clusters/biohazard/config/externalsecret-secrets.yaml
================================================
---
# yaml-language-server: $schema=https://crds.jank.ing/external-secrets.io/externalsecret_v1beta1.json
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: &name biohazard-secrets
  namespace: flux-system
spec:
  refreshInterval: "1m"
  secretStoreRef:
    kind: ClusterSecretStore
    name: 1p
  target:
    name: *name
    creationPolicy: Merge
  dataFrom:
    - extract:
        key: ".biohazard-vars"
    - find:
        name:
          regexp: "^SECRET_*"



================================================
FILE: kube/clusters/biohazard/config/externalsecret-vars.yaml
================================================
---
# yaml-language-server: $schema=https://crds.jank.ing/external-secrets.io/externalsecret_v1beta1.json
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: &name biohazard-vars
  namespace: flux-system
spec:
  refreshInterval: "1m"
  secretStoreRef:
    kind: ClusterSecretStore
    name: 1p
  target:
    name: *name
    creationPolicy: Merge
  dataFrom:
    - extract:
        key: ".Biohazard-Vars"
    - extract:
        key: ".biohazard-vars"
    - find:
        name:
          #regexp: "^(CLUSTER|DNS|IP|UID|PATH|VM|OSPF|ASN|APP_DNS|APP_IP|APP_UID|CONFIG|USERS|ADMIN)_*"
          regexp: "(^(?:CLUSTER|DNS|IP|UID|PATH|VM|OSPF|ASN|APP_DNS|APP_IP|APP_UID|APP_MAC|CONFIG|USERS|ADMIN)_.*)"



================================================
FILE: kube/clusters/biohazard/config/gvisor.yaml
================================================
---
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: gvisor
handler: runsc-kvm
scheduling:
  nodeSelector:
    feature.node.kubernetes.io/baremetal: "true"
---
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: gvisor-non-vm
handler: runsc



================================================
FILE: kube/clusters/biohazard/config/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret-secrets.yaml
  - ./externalsecret-vars.yaml
  - ./gvisor.yaml
#secretGenerator:
#  - name: biohazard-secrets
#    namespace: flux-system
#    envs:
#      - ./secrets.sops.env
#  - name: biohazard-vars
#    namespace: flux-system
#    envs:
#      - ./vars.sops.env
generatorOptions:
  disableNameSuffixHash: true
  labels:
    kustomize.toolkit.fluxcd.io/ssa: "merge"
    kustomize.toolkit.fluxcd.io/prune: "disabled"



================================================
FILE: kube/clusters/biohazard/flux/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://crds.jank.ing/external-secrets.io/externalsecret_v1beta1.json
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: &name agekey
  namespace: flux-system
spec:
  refreshInterval: 1m
  secretStoreRef:
    kind: ClusterSecretStore
    name: 1p
  dataFrom:
    - extract:
        key: "Flux"
  target:
    creationPolicy: Owner
    deletionPolicy: Retain
    name: *name
    template:
      type: Opaque
      data:
        age.agekey: '{{ .agekey }}'
---
# yaml-language-server: $schema=https://crds.jank.ing/external-secrets.io/externalsecret_v1beta1.json
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: &name github-ssh
  namespace: flux-system
spec:
  refreshInterval: 1m
  secretStoreRef:
    kind: ClusterSecretStore
    name: 1p
  dataFrom:
    - extract:
        key: "Flux"
  target:
    creationPolicy: Owner
    deletionPolicy: Retain
    name: *name
    template:
      type: Opaque
      data:
        identity: '{{ .identity_b64 | b64dec }}'
        identity.pub: '{{ .identity_pub_b64 | b64dec }}'
        known_hosts: '{{ .known_hosts_b64 | b64dec }}'
---
# yaml-language-server: $schema=https://crds.jank.ing/external-secrets.io/externalsecret_v1beta1.json
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: &name soft-serve-ssh
  namespace: flux-system
spec:
  refreshInterval: 1m
  secretStoreRef:
    kind: ClusterSecretStore
    name: 1p
  dataFrom:
    - extract:
        key: "Flux"
  target:
    creationPolicy: Owner
    deletionPolicy: Retain
    name: *name
    template:
      type: Opaque
      data:
        identity: '{{ .identity_b64 | b64dec }}'
        identity.pub: '{{ .identity_pub_b64 | b64dec }}'
        known_hosts: '{{ .softserve_known_hosts_b64 | b64dec }}'



================================================
FILE: kube/clusters/biohazard/flux/flux-repo.yaml
================================================
---
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: flux-system
  namespace: flux-system
spec:
  interval: 10m0s
  #url: ssh://git@github.com/JJGadgets/Biohazard
  url: https://github.com/JJGadgets/Biohazard
  ref:
    branch: main
  #secretRef:
  #  name: github-ssh
  ignore: |
    # exclude all to whitelist
    /*
    # include Kubernetes
    !/kube
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: 0-biohazard-config
  # I wanna see it on the top lol
  namespace: flux-system
  labels:
    kustomization.flux.home.arpa/name: "flux"
    kustomization.flux.home.arpa/default: "false"
    wait.flux.home.arpa/disabled: "true"
    kustomization.flux.home.arpa/helmpatches: "false"
spec:
  interval: 5m0s
  path: ./kube/clusters/biohazard/flux
  prune: false
  wait: false
  sourceRef:
    kind: GitRepository
    name: flux-system
  decryption:
    provider: sops
    secretRef:
      name: agekey
  postBuild:
    substitute:
      CLUSTER_NAME: "biohazard"
      # renovate: datasource=docker depName=ghcr.io/fluxcd/flux-manifests
      FLUXCD_VERSION: "v2.5.1"
    substituteFrom:
      - kind: Secret
        name: biohazard-vars
        optional: false
      - kind: Secret
        name: biohazard-secrets
        optional: false
      # - kind: ConfigMap
      #   name: biohazard-versions
      #   optional: false
  patches:
    - patch: |-
        apiVersion: kustomize.toolkit.fluxcd.io/v1
        kind: Kustomization
        metadata:
          name: not-used
        spec:
          interval: 5m0s
          timeout: 10m0s
          decryption:
            provider: sops
            secretRef:
              name: agekey
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
    - patch: |-
        apiVersion: kustomize.toolkit.fluxcd.io/v1
        kind: Kustomization
        metadata:
          name: not-used
        spec:
          sourceRef:
            kind: GitRepository
            name: flux-system
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: kustomization.flux.home.arpa/default notin (false)
    - patch: |
        - op: add
          path: /spec/dependsOn/-
          value:
            name: 0-biohazard-config
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: kustomization.flux.home.arpa/default notin (false, no-deps)
    # - patch: |
    #     - op: add
    #       path: /spec/dependsOn/-
    #       value:
    #         name: 1-core-1-networking-cilium-app
    #   target:
    #     group: kustomize.toolkit.fluxcd.io
    #     version: v1
    #     kind: Kustomization
    #     labelSelector: kustomization.flux.home.arpa/name notin (cilium, flux, kubevirt)
    - patch: |
        - op: add
          path: /spec/dependsOn/-
          value:
            name: zzz-flux-repos-helm
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: kustomization.flux.home.arpa/default notin (false, no-deps)
    - patch: |-
        apiVersion: kustomize.toolkit.fluxcd.io/v1
        kind: Kustomization
        metadata:
          name: not-used
        spec:
          postBuild:
            substitute:
              CLUSTER_NAME: "biohazard"
            substituteFrom:
              - kind: Secret
                name: biohazard-vars
                optional: false
              - kind: Secret
                name: biohazard-secrets
                optional: false
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: substitution.flux.home.arpa/disabled notin (true)
    - patch: |-
        apiVersion: kustomize.toolkit.fluxcd.io/v1
        kind: Kustomization
        metadata:
          name: not-used
        spec:
          prune: true
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: prune.flux.home.arpa/disabled notin (true) # default
    - patch: |-
        apiVersion: kustomize.toolkit.fluxcd.io/v1
        kind: Kustomization
        metadata:
          name: not-used
        spec:
          prune: false
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: prune.flux.home.arpa/disabled=true
    - patch: |-
        apiVersion: kustomize.toolkit.fluxcd.io/v1
        kind: Kustomization
        metadata:
          name: not-used
        spec:
          prune: true
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: prune.flux.home.arpa/enabled=true
    - patch: |-
        apiVersion: kustomize.toolkit.fluxcd.io/v1
        kind: Kustomization
        metadata:
          name: not-used
        spec:
          wait: true
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: wait.flux.home.arpa/disabled notin (true) # default
    - patch: |-
        apiVersion: kustomize.toolkit.fluxcd.io/v1
        kind: Kustomization
        metadata:
          name: not-used
        spec:
          wait: false
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: wait.flux.home.arpa/disabled=true
    - patch: |-
        apiVersion: kustomize.toolkit.fluxcd.io/v1
        kind: Kustomization
        metadata:
          name: not-used
        spec:
          patches:
            - patch: |-
                apiVersion: helm.toolkit.fluxcd.io/v2beta1
                kind: HelmRelease
                metadata:
                  name: not-used
                spec:
                  interval: 5m
                  timeout: 15m
                  maxHistory: 10
                  install:
                    crds: CreateReplace
                    createNamespace: true
                    remediation:
                      retries: 5
                  upgrade:
                    crds: CreateReplace
                    cleanupOnFail: true
                    remediation:
                      retries: 5
                      strategy: rollback
                  rollback:
                    recreate: true
                    cleanupOnFail: true
                  uninstall:
                    keepHistory: false
              target:
                group: helm.toolkit.fluxcd.io
                version: v2beta1
                kind: HelmRelease
                labelSelector: helm.flux.home.arpa/default notin (false)
            - patch: |-
                apiVersion: helm.toolkit.fluxcd.io/v2beta1
                kind: HelmRelease
                metadata:
                  name: not-used
                spec:
                  chart:
                    spec:
                      chart: app-template
                      version: 1.2.1
                      sourceRef:
                        name: bjw-s
              target:
                group: helm.toolkit.fluxcd.io
                version: v2beta1
                kind: HelmRelease
                labelSelector: helm.flux.home.arpa/app-template=true
            - patch: |-
                apiVersion: helm.toolkit.fluxcd.io/v2beta1
                kind: HelmRelease
                metadata:
                  name: not-used
                spec:
                  values:
                    ingress:
                      main:
                        annotations:
                          nginx.ingress.kubernetes.io/auth-url: |-
                              http://authentik.authentik.svc.cluster.local:9000/outpost.goauthentik.io/auth/nginx
                          nginx.ingress.kubernetes.io/auth-response-headers: |-
                              Set-Cookie,X-authentik-username,X-authentik-groups,X-authentik-email,X-authentik-name,X-authentik-uid
                          nginx.ingress.kubernetes.io/auth-snippet: |
                              proxy_set_header X-Forwarded-Host $http_host;
              target:
                group: helm.toolkit.fluxcd.io
                version: v2beta1
                kind: HelmRelease
                labelSelector: nginx.ingress.home.arpa/type in (auth, auth-external, auth-external-only)
            - patch: |-
                apiVersion: helm.toolkit.fluxcd.io/v2beta1
                kind: HelmRelease
                metadata:
                  name: not-used
                spec:
                  values:
                    ingress:
                      main:
                        annotations:
                          nginx.ingress.kubernetes.io/satisfy: "any"
                          nginx.ingress.kubernetes.io/whitelist-source-range: |
                            10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,100.64.0.0/10
              target:
                group: helm.toolkit.fluxcd.io
                version: v2beta1
                kind: HelmRelease
                labelSelector: nginx.ingress.home.arpa/type in (auth-external-only)
            - patch: |-
                apiVersion: helm.toolkit.fluxcd.io/v2beta2
                kind: HelmRelease
                metadata:
                  name: not-used
                spec:
                  interval: 5m
                  timeout: 15m
                  maxHistory: 10
                  install:
                    crds: CreateReplace
                    createNamespace: true
                    remediation:
                      retries: 5
                  upgrade:
                    crds: CreateReplace
                    cleanupOnFail: true
                    remediation:
                      retries: 5
                      strategy: uninstall
                  rollback:
                    recreate: true
                    cleanupOnFail: true
                  uninstall:
                    keepHistory: false
                  driftDetection:
                    mode: warn # TODO: verify all running apps don't have drift, and enable
                    ignore:
                      - paths: ["/spec/replicas"] # helpful for scaling things down during debugging/troubleshooting without Helm interfering
              target:
                group: helm.toolkit.fluxcd.io
                version: v2beta2
                kind: HelmRelease
                labelSelector: helm.flux.home.arpa/default notin (false)
            - patch: |-
                apiVersion: helm.toolkit.fluxcd.io/v2beta2
                kind: HelmRelease
                metadata:
                  name: not-used
                spec:
                  values:
                    ingress:
                      main:
                        annotations:
                          nginx.ingress.kubernetes.io/auth-url: |-
                              http://authentik.authentik.svc.cluster.local:9000/outpost.goauthentik.io/auth/nginx
                          nginx.ingress.kubernetes.io/auth-response-headers: |-
                              Set-Cookie,X-authentik-username,X-authentik-groups,X-authentik-email,X-authentik-name,X-authentik-uid
                          nginx.ingress.kubernetes.io/auth-snippet: |
                              proxy_set_header X-Forwarded-Host $http_host;
              target:
                group: helm.toolkit.fluxcd.io
                version: v2beta2
                kind: HelmRelease
                labelSelector: nginx.ingress.home.arpa/type in (auth, auth-external, auth-external-only)
            - patch: |-
                apiVersion: helm.toolkit.fluxcd.io/v2beta2
                kind: HelmRelease
                metadata:
                  name: not-used
                spec:
                  values:
                    ingress:
                      main:
                        annotations:
                          nginx.ingress.kubernetes.io/satisfy: "any"
                          nginx.ingress.kubernetes.io/whitelist-source-range: |
                            10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,100.64.0.0/10
              target:
                group: helm.toolkit.fluxcd.io
                version: v2beta2
                kind: HelmRelease
                labelSelector: nginx.ingress.home.arpa/type in (auth-external-only)
            - patch: |-
                apiVersion: helm.toolkit.fluxcd.io/v2
                kind: HelmRelease
                metadata:
                  name: not-used
                spec:
                  interval: 5m
                  timeout: 15m
                  maxHistory: 10
                  install:
                    crds: CreateReplace
                    createNamespace: true
                    remediation:
                      retries: 5
                  upgrade:
                    crds: CreateReplace
                    cleanupOnFail: true
                    remediation:
                      retries: 5
                      strategy: uninstall
                  rollback:
                    recreate: true
                    cleanupOnFail: true
                  uninstall:
                    keepHistory: false
                  driftDetection:
                    mode: warn # TODO: verify all running apps don't have drift, and enable
                    ignore:
                      - paths: ["/spec/replicas"] # helpful for scaling things down during debugging/troubleshooting without Helm interfering
              target:
                group: helm.toolkit.fluxcd.io
                version: v2
                kind: HelmRelease
                labelSelector: helm.flux.home.arpa/default notin (false)
            - patch: |-
                apiVersion: helm.toolkit.fluxcd.io/v2
                kind: HelmRelease
                metadata:
                  name: not-used
                spec:
                  values:
                    ingress:
                      main:
                        annotations:
                          nginx.ingress.kubernetes.io/auth-url: |-
                              http://authentik.authentik.svc.cluster.local:9000/outpost.goauthentik.io/auth/nginx
                          nginx.ingress.kubernetes.io/auth-response-headers: |-
                              Set-Cookie,X-authentik-username,X-authentik-groups,X-authentik-email,X-authentik-name,X-authentik-uid
                          nginx.ingress.kubernetes.io/auth-snippet: |
                              proxy_set_header X-Forwarded-Host $http_host;
              target:
                group: helm.toolkit.fluxcd.io
                version: v2
                kind: HelmRelease
                labelSelector: nginx.ingress.home.arpa/type in (auth, auth-external, auth-external-only)
            - patch: |-
                apiVersion: helm.toolkit.fluxcd.io/v2
                kind: HelmRelease
                metadata:
                  name: not-used
                spec:
                  values:
                    ingress:
                      main:
                        annotations:
                          nginx.ingress.kubernetes.io/satisfy: "any"
                          nginx.ingress.kubernetes.io/whitelist-source-range: |
                            10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,100.64.0.0/10
              target:
                group: helm.toolkit.fluxcd.io
                version: v2
                kind: HelmRelease
                labelSelector: nginx.ingress.home.arpa/type in (auth-external-only)
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: kustomization.flux.home.arpa/helmpatches notin (false)
---
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: soft-serve
  namespace: flux-system
spec:
  interval: 10m0s
  url: ssh://git@${APP_IP_SOFT_SERVE}/Biohazard-apps
  ref:
    branch: main
  secretRef:
    name: soft-serve-ssh
  ignore: |
    # exclude all to whitelist
    /*
    # include Kubernetes
    !/kube
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: 0-biohazard-soft-serve
  # I wanna see it on the top lol
  namespace: flux-system
  labels:
    kustomization.flux.home.arpa/name: "flux"
    kustomization.flux.home.arpa/default: "false"
    wait.flux.home.arpa/disabled: "true"
    kustomization.flux.home.arpa/helmpatches: "false"
spec:
  interval: 5m0s
  path: ./kube/clusters/biohazard/flux
  prune: false
  wait: false
  sourceRef:
    kind: GitRepository
    name: soft-serve
  decryption:
    provider: sops
    secretRef:
      name: agekey
  postBuild:
    substitute:
      CLUSTER_NAME: "biohazard"
    substituteFrom:
      - kind: Secret
        name: biohazard-vars
        optional: false
      - kind: Secret
        name: biohazard-secrets
        optional: false
      # - kind: ConfigMap
      #   name: biohazard-versions
      #   optional: false
  patches:
    - patch: |-
        apiVersion: kustomize.toolkit.fluxcd.io/v1
        kind: Kustomization
        metadata:
          name: not-used
        spec:
          interval: 5m0s
          timeout: 10m0s
          decryption:
            provider: sops
            secretRef:
              name: agekey
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
    - patch: |-
        apiVersion: kustomize.toolkit.fluxcd.io/v1
        kind: Kustomization
        metadata:
          name: not-used
        spec:
          sourceRef:
            kind: GitRepository
            name: soft-serve
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: kustomization.flux.home.arpa/default notin (false)
    - patch: |-
        apiVersion: kustomize.toolkit.fluxcd.io/v1
        kind: Kustomization
        metadata:
          name: not-used
        spec:
          sourceRef:
            kind: GitRepository
            name: flux-system
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: pvc.home.arpa/volsync=true
    - patch: &dependsOn |
        - op: add
          path: /spec/dependsOn/-
          value:
            name: 0-biohazard-config
        - op: add
          path: /spec/dependsOn/-
          value:
            name: zzz-flux-repos-helm
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: kustomization.flux.home.arpa/default notin (false, no-deps)
    - patch: *dependsOn
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: pvc.home.arpa/volsync=true
    - patch: |
        - op: add
          path: /spec/dependsOn/-
          value:
            name: 1-core-1-networking-cilium-app
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: kustomization.flux.home.arpa/name notin (cilium, flux, kubevirt)
    - patch: |-
        apiVersion: kustomize.toolkit.fluxcd.io/v1
        kind: Kustomization
        metadata:
          name: not-used
        spec:
          postBuild:
            substitute:
              CLUSTER_NAME: "biohazard"
            substituteFrom:
              - kind: Secret
                name: biohazard-vars
                optional: false
              - kind: Secret
                name: biohazard-secrets
                optional: false
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: substitution.flux.home.arpa/disabled notin (true)
    - patch: |-
        apiVersion: kustomize.toolkit.fluxcd.io/v1
        kind: Kustomization
        metadata:
          name: not-used
        spec:
          prune: true
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: prune.flux.home.arpa/disabled notin (true) # default
    - patch: |-
        apiVersion: kustomize.toolkit.fluxcd.io/v1
        kind: Kustomization
        metadata:
          name: not-used
        spec:
          prune: false
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: prune.flux.home.arpa/disabled=true
    - patch: |-
        apiVersion: kustomize.toolkit.fluxcd.io/v1
        kind: Kustomization
        metadata:
          name: not-used
        spec:
          prune: true
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: prune.flux.home.arpa/enabled=true
    - patch: |-
        apiVersion: kustomize.toolkit.fluxcd.io/v1
        kind: Kustomization
        metadata:
          name: not-used
        spec:
          wait: true
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: wait.flux.home.arpa/disabled notin (true) # default
    - patch: |-
        apiVersion: kustomize.toolkit.fluxcd.io/v1
        kind: Kustomization
        metadata:
          name: not-used
        spec:
          wait: false
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: wait.flux.home.arpa/disabled=true
    - patch: |-
        apiVersion: kustomize.toolkit.fluxcd.io/v1
        kind: Kustomization
        metadata:
          name: not-used
        spec:
          patches:
            - patch: |-
                apiVersion: helm.toolkit.fluxcd.io/v2beta1
                kind: HelmRelease
                metadata:
                  name: not-used
                spec:
                  interval: 5m
                  timeout: 15m
                  maxHistory: 10
                  install:
                    crds: CreateReplace
                    createNamespace: true
                    remediation:
                      retries: 5
                  upgrade:
                    crds: CreateReplace
                    cleanupOnFail: true
                    remediation:
                      retries: 5
                      strategy: rollback
                  rollback:
                    recreate: true
                    cleanupOnFail: true
                  uninstall:
                    keepHistory: false
              target:
                group: helm.toolkit.fluxcd.io
                version: v2beta1
                kind: HelmRelease
                labelSelector: helm.flux.home.arpa/default notin (false)
            - patch: |-
                apiVersion: helm.toolkit.fluxcd.io/v2beta1
                kind: HelmRelease
                metadata:
                  name: not-used
                spec:
                  values:
                    ingress:
                      main:
                        annotations:
                          nginx.ingress.kubernetes.io/auth-url: |-
                              http://authentik.authentik.svc.cluster.local:9000/outpost.goauthentik.io/auth/nginx
                          nginx.ingress.kubernetes.io/auth-response-headers: |-
                              Set-Cookie,X-authentik-username,X-authentik-groups,X-authentik-email,X-authentik-name,X-authentik-uid
                          nginx.ingress.kubernetes.io/auth-snippet: |
                              proxy_set_header X-Forwarded-Host $http_host;
              target:
                group: helm.toolkit.fluxcd.io
                version: v2beta1
                kind: HelmRelease
                labelSelector: nginx.ingress.home.arpa/type in (auth, auth-external, auth-external-only)
            - patch: |-
                apiVersion: helm.toolkit.fluxcd.io/v2beta1
                kind: HelmRelease
                metadata:
                  name: not-used
                spec:
                  values:
                    ingress:
                      main:
                        annotations:
                          nginx.ingress.kubernetes.io/satisfy: "any"
                          nginx.ingress.kubernetes.io/whitelist-source-range: |
                            10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,100.64.0.0/10
              target:
                group: helm.toolkit.fluxcd.io
                version: v2beta1
                kind: HelmRelease
                labelSelector: nginx.ingress.home.arpa/type in (auth-external-only)
            - patch: |-
                apiVersion: helm.toolkit.fluxcd.io/v2beta2
                kind: HelmRelease
                metadata:
                  name: not-used
                spec:
                  interval: 5m
                  timeout: 15m
                  maxHistory: 10
                  install:
                    crds: CreateReplace
                    createNamespace: true
                    remediation:
                      retries: 5
                  upgrade:
                    crds: CreateReplace
                    cleanupOnFail: true
                    remediation:
                      retries: 5
                      strategy: uninstall
                  rollback:
                    recreate: true
                    cleanupOnFail: true
                  uninstall:
                    keepHistory: false
                  driftDetection:
                    mode: warn # TODO: verify all running apps don't have drift, and enable
                    ignore:
                      - paths: ["/spec/replicas"] # helpful for scaling things down during debugging/troubleshooting without Helm interfering
              target:
                group: helm.toolkit.fluxcd.io
                version: v2beta2
                kind: HelmRelease
                labelSelector: helm.flux.home.arpa/default notin (false)
            - patch: |-
                apiVersion: helm.toolkit.fluxcd.io/v2beta2
                kind: HelmRelease
                metadata:
                  name: not-used
                spec:
                  values:
                    ingress:
                      main:
                        annotations:
                          nginx.ingress.kubernetes.io/auth-url: |-
                              http://authentik.authentik.svc.cluster.local:9000/outpost.goauthentik.io/auth/nginx
                          nginx.ingress.kubernetes.io/auth-response-headers: |-
                              Set-Cookie,X-authentik-username,X-authentik-groups,X-authentik-email,X-authentik-name,X-authentik-uid
                          nginx.ingress.kubernetes.io/auth-snippet: |
                              proxy_set_header X-Forwarded-Host $http_host;
              target:
                group: helm.toolkit.fluxcd.io
                version: v2beta2
                kind: HelmRelease
                labelSelector: nginx.ingress.home.arpa/type in (auth, auth-external, auth-external-only)
            - patch: |-
                apiVersion: helm.toolkit.fluxcd.io/v2beta2
                kind: HelmRelease
                metadata:
                  name: not-used
                spec:
                  values:
                    ingress:
                      main:
                        annotations:
                          nginx.ingress.kubernetes.io/satisfy: "any"
                          nginx.ingress.kubernetes.io/whitelist-source-range: |
                            10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,100.64.0.0/10
              target:
                group: helm.toolkit.fluxcd.io
                version: v2beta2
                kind: HelmRelease
                labelSelector: nginx.ingress.home.arpa/type in (auth-external-only)
            - patch: |-
                apiVersion: helm.toolkit.fluxcd.io/v2
                kind: HelmRelease
                metadata:
                  name: not-used
                spec:
                  interval: 5m
                  timeout: 15m
                  maxHistory: 10
                  install:
                    crds: CreateReplace
                    createNamespace: true
                    remediation:
                      retries: 5
                  upgrade:
                    crds: CreateReplace
                    cleanupOnFail: true
                    remediation:
                      retries: 5
                      strategy: uninstall
                  rollback:
                    recreate: true
                    cleanupOnFail: true
                  uninstall:
                    keepHistory: false
                  driftDetection:
                    mode: warn # TODO: verify all running apps don't have drift, and enable
                    ignore:
                      - paths: ["/spec/replicas"] # helpful for scaling things down during debugging/troubleshooting without Helm interfering
              target:
                group: helm.toolkit.fluxcd.io
                version: v2
                kind: HelmRelease
                labelSelector: helm.flux.home.arpa/default notin (false)
            - patch: |-
                apiVersion: helm.toolkit.fluxcd.io/v2
                kind: HelmRelease
                metadata:
                  name: not-used
                spec:
                  values:
                    ingress:
                      main:
                        annotations:
                          nginx.ingress.kubernetes.io/auth-url: |-
                              http://authentik.authentik.svc.cluster.local:9000/outpost.goauthentik.io/auth/nginx
                          nginx.ingress.kubernetes.io/auth-response-headers: |-
                              Set-Cookie,X-authentik-username,X-authentik-groups,X-authentik-email,X-authentik-name,X-authentik-uid
                          nginx.ingress.kubernetes.io/auth-snippet: |
                              proxy_set_header X-Forwarded-Host $http_host;
              target:
                group: helm.toolkit.fluxcd.io
                version: v2
                kind: HelmRelease
                labelSelector: nginx.ingress.home.arpa/type in (auth, auth-external, auth-external-only)
            - patch: |-
                apiVersion: helm.toolkit.fluxcd.io/v2
                kind: HelmRelease
                metadata:
                  name: not-used
                spec:
                  values:
                    ingress:
                      main:
                        annotations:
                          nginx.ingress.kubernetes.io/satisfy: "any"
                          nginx.ingress.kubernetes.io/whitelist-source-range: |
                            10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,100.64.0.0/10
              target:
                group: helm.toolkit.fluxcd.io
                version: v2
                kind: HelmRelease
                labelSelector: nginx.ingress.home.arpa/type in (auth-external-only)
      target:
        group: kustomize.toolkit.fluxcd.io
        version: v1
        kind: Kustomization
        labelSelector: kustomization.flux.home.arpa/helmpatches notin (false)



================================================
FILE: kube/clusters/biohazard/flux/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - externalsecret.yaml
  - ../config/
  #- flux-install.yaml
  - ../../../bootstrap/flux/flux-install-localhost.yaml
  - ../../../bootstrap/flux/svc-metrics.yaml
  - flux-repo.yaml
  - ../../../repos/flux/
  - ../../../deploy/core/_networking/cilium/
  - ../../../deploy/core/_networking/multus/
  #- ../../../deploy/core/_networking/tailscale/
  # - ../../../deploy/core/_networking/frr/
  - ../../../deploy/core/_networking/bird/
  - ../../../deploy/core/_networking/e1000e-fix/
  - ../../../deploy/core/spegel/
  # - ../../../deploy/core/kyverno/_deps/
  # - ../../../deploy/core/kyverno/
  - ../../../deploy/core/monitoring/_deps/
  - ../../../deploy/core/secrets/onepassword-connect/
  - ../../../deploy/core/secrets/external-secrets/
  - ../../../deploy/core/secrets/reflector/
  - ../../../deploy/core/storage/fstrim/
  - ../../../deploy/core/storage/minio-nas/
  - ../../../deploy/core/storage/_external-snapshotter/
  - ../../../deploy/core/storage/_csi-addons/
  - ../../../deploy/core/storage/rook-ceph/
  - ../../../deploy/core/storage/rook-ceph/cluster/
  - ../../../deploy/core/storage/democratic-csi/_deps/
  - ../../../deploy/core/storage/democratic-csi/local-hostpath/
  - ../../../deploy/core/storage/democratic-csi/manual/
  # - ../../../deploy/core/storage/csi-driver-nfs/
  - ../../../deploy/core/storage/snapscheduler/
  - ../../../deploy/core/storage/volsync/
  - ../../../deploy/core/tls/cert-manager/
  - ../../../deploy/core/dns/internal/_deps/
  - ../../../deploy/core/dns/internal/k8s-gateway/
  - ../../../deploy/core/dns/external-dns/
  - ../../../deploy/core/ingress/_deps/
  - ../../../deploy/core/ingress/secrets-sync/
  - ../../../deploy/core/ingress/ingress-nginx/
  - ../../../deploy/core/ingress/cloudflare/
  - ../../../deploy/core/ingress/external-proxy-x/
  - ../../../deploy/core/db/pg/
  - ../../../deploy/core/db/pg/clusters/default/
  - ../../../deploy/core/db/pg/clusters/home/
  - ../../../deploy/core/db/emqx/
  - ../../../deploy/core/monitoring/metrics-server/
  - ../../../deploy/core/monitoring/kps/
  - ../../../deploy/core/monitoring/victoria/
  - ../../../deploy/core/monitoring/grafana/
  - ../../../deploy/core/monitoring/alertmanager/
  - ../../../deploy/core/monitoring/karma/
  - ../../../deploy/core/monitoring/fluentbit/
  - ../../../deploy/core/monitoring/node-exporter/
  - ../../../deploy/core/monitoring/smartctl-exporter/
  - ../../../deploy/core/monitoring/intel-gpu-exporter/
  # - ../../../deploy/core/monitoring/snmp-exporter/
  # - ../../../deploy/core/monitoring/fortigate-exporter/
  - ../../../deploy/core/hardware/node-feature-discovery/
  - ../../../deploy/core/hardware/intel-device-plugins/
  - ../../../deploy/core/flux-system/
  - ../../../deploy/core/flux-system/healthcheck/
  - ../../../deploy/core/reloader/
  # - ../../../deploy/core/system-upgrade-controller/
  # - ../../../deploy/core/system-upgrade-controller/plans/talos/
  - ../../../deploy/apps/ # for the namespace
  #- ../../../deploy/apps/tetragon/
  # - ../../../deploy/apps/renovate/
  # - ../../../deploy/apps/kubevirt/
  # - ../../../deploy/apps/default/
  - ../../../deploy/apps/authentik/
  - ../../../deploy/apps/whoogle/
  - ../../../deploy/apps/searxng/
  - ../../../deploy/apps/cyberchef/
  - ../../../deploy/apps/gokapi/
  - ../../../deploy/apps/minecraft/
  - ../../../deploy/apps/minecraft2/
  - ../../../deploy/apps/insurgency-sandstorm/
  - ../../../deploy/apps/media/_deps/
  - ../../../deploy/apps/media/jellyfin/
  - ../../../deploy/apps/media/plex/
  - ../../../deploy/apps/media/kavita/
  - ../../../deploy/apps/media/komga/
  - ../../../deploy/apps/media/navidrome/
  # - ../../../deploy/apps/kanidm/
  #- ../../../deploy/apps/syncthing/ # TODO: re-add once fixed up
  - ../../../deploy/apps/excalidraw/
  - ../../../deploy/apps/velociraptor/
  - ../../../deploy/apps/gotosocial/
  - ../../../deploy/apps/gts-robo/
  - ../../../deploy/apps/ntfy/
  - ../../../deploy/apps/satisfactory/
  # - ../../../deploy/apps/headscale/
  - ../../../deploy/apps/zipline/
  - ../../../deploy/apps/kah/
  - ../../../deploy/apps/thelounge/
  - ../../../deploy/apps/atuin/
  - ../../../deploy/apps/miniflux/
  - ../../../deploy/apps/elk/
  - ../../../deploy/apps/firefly/
  - ../../../deploy/apps/redlib/
  #- ../../../deploy/apps/livestream/
  #- ../../../deploy/apps/livestream/oven
  - ../../../deploy/apps/soft-serve/
  #- ../../../deploy/apps/neko/
  # - ../../../deploy/apps/joplin/
  - ../../../deploy/apps/piped/
  - ../../../deploy/apps/phanpy/
  #- ../../../deploy/apps/psono/
  - ../../../deploy/apps/audiobookshelf/
  - ../../../deploy/apps/paperless-ngx/
  # - ../../../deploy/apps/grocy/
  #- ../../../deploy/apps/nextcloud/
  - ../../../deploy/apps/nfs-web/
  # - ../../../deploy/apps/readeck/
  - ../../../deploy/apps/k8s-schemas/
  # - ../../../deploy/apps/restic-rest-nfs/
  - ../../../deploy/apps/home-assistant/
  - ../../../deploy/apps/zigbee2mqtt/
  # - ../../../deploy/apps/go-discord-modtools/
  # - ../../../deploy/apps/findmydeviceserver/
  - ../../../deploy/apps/redbot/
  - ../../../deploy/apps/code-server/
  # - ../../../deploy/apps/media-edit/
  # - ../../../deploy/apps/homebox/
  - ../../../deploy/apps/vikunja/
  - ../../../deploy/apps/reactive-resume/
  - ../../../deploy/apps/linkding/
  # - ../../../deploy/apps/collabora/
  - ../../../deploy/apps/ocis/
  - ../../../deploy/apps/goatcounter/
  # - ../../../deploy/apps/ollama/
  - ../../../deploy/apps/davis/
  - ../../../deploy/apps/radicale/
  - ../../../deploy/apps/immich/
  - ../../../deploy/apps/kromgo/
  # - ../../../deploy/apps/blocky/
  - ../../../deploy/apps/cryptpad/
  - ../../../deploy/apps/languagetool/
  - ../../../deploy/apps/mlc-llm/
  - ../../../deploy/apps/open-webui/
  - ../../../deploy/apps/sillytavern/
  - ../../../deploy/apps/morphos/
  - ../../../deploy/apps/actual/
  - ../../../deploy/apps/librespeed/
  - ../../../deploy/apps/flatnotes/
  - ../../../deploy/apps/stirling-pdf/
  - ../../../deploy/apps/fortidynasync/
  - ../../../deploy/apps/fava/
  - ../../../deploy/apps/maloja/
  - ../../../deploy/apps/silverbullet/
  - ../../../deploy/apps/rimgo/
  - ../../../deploy/vm/_kubevirt/
  #- ../../../deploy/vm/_base/
  - ../../../deploy/vm/ad/
  - ../../../deploy/vm/jj/



================================================
FILE: kube/clusters/biohazard/talos/talconfig.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/budimanjojo/talhelper/master/pkg/config/schemas/talconfig.json
clusterName: biohazard
talosVersion: v1.9.5
kubernetesVersion: v1.32.0
endpoint: "https://c.${DNS_CLUSTER}:6443"
allowSchedulingOnMasters: true
allowSchedulingOnControlPlanes: true

cniConfig:
  name: none

clusterPodNets:
  - "${IP_POD_CIDR_V4}"
clusterSvcNets:
  - "${IP_SVC_CIDR_V4}"

additionalApiServerCertSans: &san
  - "${IP_CLUSTER_VIP}"
  - "${IP_ROUTER_VLAN_K8S}"
  - "c.${DNS_CLUSTER}"
  - "127.0.0.1" # KubePrism
  - "tailscale-operator-k8s"
  - "tailscale-operator-k8s.${DNS_TS}"

additionalMachineCertSans: *san

nodes:

  - &m720q
    hostname: "ange.${DNS_CLUSTER}" # M720q, i5-8500T 6C6T, 64GB RAM, 256GB OS NVMe
    ipAddress: "${IP_ROUTER_VLAN_K8S_PREFIX}1"
    controlPlane: true
    installDiskSelector:
      size: "<= 600GB"
      type: "nvme"
    nodeLabels:
      cpu-scaler.internal/multiplier: "1"
    nameservers: ["${IP_ROUTER_VLAN_K8S}"]
    disableSearchDomain: true
    networkInterfaces:
      - &m720q-net
        interface: br0
        mtu: 1500
        dhcp: true # for other IPs, IPv6 and dynamic DHCP DNS
        bridge:
          interfaces: [bond0]
          stp: {enabled: true}
        addresses: ["${IP_ROUTER_VLAN_K8S_PREFIX}1/28"]
        routes: &routes
          - network: "${IP_ROUTER_VLAN_K8S_CIDR}"
            metric: 1
          - network: "${IP_ROUTER_VLAN_K8S_LEGACY_PVE_CIDR}"
          - network: "0.0.0.0/0"
            gateway: "${IP_ROUTER_VLAN_K8S}"
        vip:
          ip: "${IP_CLUSTER_VIP}"
      - &m720q-bond0
        interface: bond0
        mtu: 1500
        bond: &bond0
          mode: active-backup
          miimon: 100
          primary: eno1
          primaryReselect: better
          deviceSelectors:
            # Onboard Intel 1GbE (eno1)
            - driver: e1000e
              physical: true
            # Mellanox ConnectX (enp1s0)
            - driver: "mlx4_core"
              physical: true
    machineSpec:
      secureboot: true
    schematic:
      customization:
        extraKernelArgs:
          - intel_iommu=on
          - iommu=pt
          - apparmor=1
          - security=apparmor
        systemExtensions:
          officialExtensions:
            - siderolabs/gvisor
            - siderolabs/gvisor-debug
            - siderolabs/i915
            - siderolabs/intel-ucode
            - siderolabs/iscsi-tools
            - siderolabs/kata-containers
            - siderolabs/lldpd
    extensionServices:
      - &lldpd
        name: lldpd
        configFiles:
          - mountPath: /usr/local/etc/lldpd/lldpd.conf
            content: |
              configure lldpd portidsubtype ifname
              configure system description "Talos Node"
    extraManifests:
      - ./watchdog.yaml
    patches:
      - |
        machine:
          sysfs:
            module.i915.parameters.enable_hangcheck: "N"
            module.i915.parameters.request_timeout_ms: "600000"
      # - |
      #   machine:
      #     sysfs:
      #       devices.system.cpu.intel_pstate.max_perf_pct: "80" # limit max frequency to 2.8GHz
      #       devices.system.cpu.intel_pstate.hwp_dynamic_boost: "1"

  - <<: *m720q
    hostname: "charlotte.${DNS_CLUSTER}" # M720q, i5-8500T 6C6T, 64GB RAM, 256GB OS NVMe, WiFi M.2 screw stuck LOL
    ipAddress: "${IP_ROUTER_VLAN_K8S_PREFIX}2"
    networkInterfaces:
      - <<: *m720q-net
        addresses: ["${IP_ROUTER_VLAN_K8S_PREFIX}2/28"]
      - *m720q-bond0

  - <<: *m720q
    hostname: "chise.${DNS_CLUSTER}" # M720q, i3-8100T 4C4T, 32GB RAM, 512GB OS NVMe
    ipAddress: "${IP_ROUTER_VLAN_K8S_PREFIX}3"
    networkInterfaces:
      - <<: *m720q-net
        addresses: ["${IP_ROUTER_VLAN_K8S_PREFIX}3/28"]
      - *m720q-bond0
    # patches:
    #   - |
    #     machine:
    #       sysfs:
    #         devices.system.cpu.intel_pstate.max_perf_pct: "90" # limit max frequency to 2.8GHz
    #         devices.system.cpu.intel_pstate.hwp_dynamic_boost: "1"

  - &ms01
    hostname: "dorothy.${DNS_CLUSTER}" # ms01, i5-8500T 6C6T, 64GB RAM, 256GB OS NVMe
    ipAddress: "${IP_ROUTER_VLAN_K8S_PREFIX}5"
    controlPlane: false
    installDiskSelector:
      # size: "<= 600GB"
      type: "nvme"
    nodeLabels:
      cpu-scaler.internal/multiplier: "0.5"
    nameservers: ["${IP_ROUTER_VLAN_K8S}"]
    disableSearchDomain: true
    networkInterfaces:
      - &ms01-net
        interface: br0
        mtu: 1500
        dhcp: true # for other IPs, IPv6 and dynamic DHCP DNS
        bridge:
          interfaces: [bond0]
          stp: {enabled: true}
        addresses: ["${IP_ROUTER_VLAN_K8S_PREFIX}5/28"]
        routes: *routes
        # vip:
        #   ip: "${IP_CLUSTER_VIP}"
      - &ms01-bond0
        interface: bond0
        mtu: 1500
        bond: &bond0
          mode: active-backup
          miimon: 100
          # primary: eno1
          primaryReselect: better
          deviceSelectors:
            # Onboard Intel i226-{LM|V} 2.5GbE
            - driver: igc
              physical: true
            # Intel X710 10Gbe
            - driver: i40e
              physical: true
    machineSpec:
      secureboot: true
    schematic:
      customization:
        extraKernelArgs:
          - intel_iommu=on
          - iommu=pt
          - apparmor=1
          - security=apparmor
          - i915.enable_hangcheck=0
          - i915.request_timeout_ms=600000
        systemExtensions:
          officialExtensions:
            - siderolabs/iscsi-tools
            - siderolabs/lldpd
            - siderolabs/kata-containers
            - siderolabs/gvisor
            - siderolabs/gvisor-debug
            - siderolabs/intel-ucode
            - siderolabs/i915
            - siderolabs/intel-ice-firmware
            - siderolabs/mei # Intel 12 gen & newer
            - siderolabs/thunderbolt
    extensionServices:
      - &lldpd
        name: lldpd
        configFiles:
          - mountPath: /usr/local/etc/lldpd/lldpd.conf
            content: |
              configure lldpd portidsubtype ifname
              configure system description "Talos Node"
    extraManifests:
      - ./watchdog.yaml

  - hostname: "thunderscreech.${DNS_CLUSTER}" # R730xd Proxmox VM
    ipAddress: "${IP_ROUTER_VLAN_K8S_PREFIX}4"
    controlPlane: false
    installDisk: /dev/vda
    nameservers: ["${IP_ROUTER_VLAN_K8S}"]
    disableSearchDomain: true
    # nodeLabels: # no RBAC lol
    #   node-role.kubernetes.io/vm: ""
    #   node-role.kubernetes.io/pve: ""
    #   node-role.kubernetes.io/worker: ""
    networkInterfaces:
      - interface: br0
        mtu: 1500
        dhcp: false
        bridge:
          interfaces: [bond0]
          stp: {enabled: true}
        addresses: ["${IP_ROUTER_VLAN_K8S_PREFIX}4/28"]
        routes: *routes
      - interface: bond0
        mtu: 1500
        bond:
          mode: active-backup
          miimon: 100
          deviceSelectors:
            # VirtIO NIC
            - driver: virtio_net
              physical: true
    machineSpec:
      secureboot: true
    schematic:
      customization:
        extraKernelArgs:
          - apparmor=1
          - security=apparmor
        systemExtensions:
          officialExtensions:
            - siderolabs/gvisor
            - siderolabs/intel-ucode
            - siderolabs/iscsi-tools
            - siderolabs/lldpd
            # - siderolabs/nvidia-open-gpu-kernel-modules
    extensionServices:
      - *lldpd

patches:
  # set all disks to no scheduler
  - |-
    machine:
      udev:
        rules:
          # set all disks to `none` scheduler (optimal setting for Ceph and ZFS)
          - SUBSYSTEM=="block", ENV{DEVTYPE}=="disk", KERNEL!="rbd*", ATTR{queue/scheduler}="none"
          # allow GID 44 (video) to use Intel GPU
          - SUBSYSTEM=="drm", GROUP="44", MODE="0660"

  - &hugepages |-
    machine:
      sysfs:
        kernel.mm.hugepages.hugepages-1048576kB.nr_hugepages: 4
        kernel.mm.hugepages.hugepages-2048kB.nr_hugepages: 1024

  - &machinePatch |-
    machine:
      install:
        bootloader: true
      network:
        extraHostEntries:
          - ip: "${IP_CLUSTER_VIP}"
            aliases: ["c.${DNS_CLUSTER}"]
          - ip: "${IP_ROUTER_VLAN_K8S_PREFIX}1"
            aliases: ["c.${DNS_CLUSTER}"]
          - ip: "${IP_ROUTER_VLAN_K8S_PREFIX}2"
            aliases: ["c.${DNS_CLUSTER}"]
          - ip: "${IP_ROUTER_VLAN_K8S_PREFIX}3"
            aliases: ["c.${DNS_CLUSTER}"]
          - ip: "${IP_HERCULES}"
            aliases: ["hercules.mesh.cilium.io"]
          - ip: "${IP_TRUENAS}"
            aliases: ["nas.${DNS_MAIN}"]
      time:
        disabled: false
        servers: ["${IP_ROUTER_VLAN_K8S}"]
        bootTimeout: 2m0s
      kernel:
        modules:
          - name: nbd # Ceph RBD CSI gets noisy without this, probably fine without though?
#          - name: nct6683
#            parameters: ["force=on"]
#          - name: e1000e
#            parameters: ["Node=0"]

  - &LUKS |
    machine:
      systemDiskEncryption:
        ephemeral: &fde
          provider: luks2
          keys:
            - slot: 0
              tpm: {}
        state: *fde

  - &clusterPatch |-
    cluster:
      allowSchedulingOnMasters: true
      allowSchedulingOnControlPlanes: true
      discovery:
        enabled: true
        registries:
          kubernetes:
            disabled: false
          service:
            disabled: true
      proxy:
        disabled: true

  - &kubePrism |-
    machine:
      features:
        kubePrism:
          enabled: true
          port: 7445

  - &hostDNS |
    machine:
      features:
        hostDNS:
          enabled: true
          resolveMemberNames: true
          forwardKubeDNSToHost: false

  - &kubeletSubnet |-
    machine:
      kubelet:
        nodeIP:
          validSubnets:
            - "${IP_ROUTER_VLAN_K8S_CIDR}"

  - &kubeletConfig |-
    machine:
      kubelet:
        extraConfig:
          maxPods: 200

  - &userNamespaces |-
    machine:
      sysctls:
        user.max_user_namespaces: "11255" # also allows gvisor
      kubelet:
        extraConfig:
          featureGates:
            UserNamespacesSupport: true
            UserNamespacesPodSecurityStandards: true

  - &PodLevelResources |-
    machine:
      kubelet:
        extraConfig:
          featureGates:
            PodLevelResources: true

  - &kubeletNodePressure |
    machine:
      kubelet:
        extraConfig:
          imageGCLowThresholdPercent: 70
          imageGCHighThresholdPercent: 90
          kubeReserved:
            cpu: 50m
            memory: 1Gi
            ephemeral-storage: 512Mi
          systemReserved:
            cpu: 50m
            memory: 1Gi
            ephemeral-storage: 512Mi
          evictionHard:
            nodefs.available: "5%"
          evictionMinimumReclaim:
            memory.available: "1Gi"
            nodefs.available: "1Gi"

  # patch containerd for spegel (discard)
  - &spegel |
    machine:
      files:
        - op: create
          path: /etc/cri/conf.d/20-customization.part
          permissions: 0o644
          content: |
            [plugins."io.containerd.cri.v1.images"]
              discard_unpacked_layers = false

  - &nfsMountOptions |
    machine:
      files:
        - op: overwrite
          path: /etc/nfsmount.conf
          permissions: 420
          content: |
            [ NFSMount_Global_Options ]
            nfsvers=4.2
            hard=True
            noatime=True
            nodiratime=True
            nconnect=8

  - &kubeletLogs |
    machine:
      kubelet:
        extraMounts:
          - type: bind
            options: [bind, rw, exec, suid]
            source: /run/kubelet-logs-pods
            destination: /var/log/pods

  - &netjank |
    machine:
      pods:
        - apiVersion: v1
          kind: Pod
          metadata:
            name: &name "net-jank"
            namespace: "kube-system"
          spec:
            hostNetwork: true
            hostPID: true
            restartPolicy: OnFailure
            containers:
              - &ct
                name: bridge-mac-set
                image: "public.ecr.aws/docker/library/alpine:latest"
                command: ["/bin/sh", "-c"]
                args:
                  - |
                    duration=600
                    endTime=$(( $(date +%s) + duration ))
                    while [ $(date +%s) -lt $$endTime ]; do
                      for br in $(brctl show | awk '!/bridge name/' | awk '/^[[:alnum:]]/{print $$1}'); do
                        ip link show dev $$br
                        ip link set $$br address $(brctl showmacs $$br | grep "0.00" | grep "  1" | grep "yes" | head -n 1 | awk '{print $$2}')
                        ip link show dev $$br
                      done
                      sleep 5
                    done
                securityContext:
                  privileged: true
                resources:
                  requests:
                    cpu: "0m"
                    memory: "0Mi"
                  limits:
                    cpu: "500m"
                    memory: "128Mi"
              - <<: *ct
                name: e1000e-fix
                args:
                  - |
                    find /sys/class/net/*/device/driver/module/drivers -maxdepth 1 -path "*e1000e*" | awk -F'/' '{print $$5}' | xargs -I% nsenter --mount=/host/proc/$(pidof /usr/local/bin/kubelet)/ns/mnt --net=/host/proc/$(pidof /usr/local/bin/kubelet)/ns/net -- sh -c "
                    echo '% - BEFORE' &&
                    echo '==========' &&
                    ethtool -k % &&
                    echo '==========' &&
                    echo 'Disabling offloads for %...' &&
                    ethtool -K % tso off gso off gro off &&
                    echo '==========' &&
                    echo '% - AFTER' &&
                    echo '==========' &&
                    ethtool -k % &&
                    echo '=========='"
                volumeMounts:
                  - name: netfs
                    mountPath: /host/net
                    readOnly: true
                  - name: procfs
                    mountPath: /host/proc
                    readOnly: true
            volumes:
              - name: netfs
                hostPath:
                  type: Directory
                  path: /sys
                  readOnly: true
              - name: procfs
                hostPath:
                  type: Directory
                  path: /proc
                  readOnly: true

controlPlane:
  patches:
    - &apiServerResources |-
      cluster:
        apiServer:
          resources:
            requests:
              cpu: 200m
              memory: 4Gi
            limits:
              memory: 4Gi

    - &apiServerLogs |
      cluster:
        apiServer:
          extraArgs:
            audit-log-path: "/dev/null" # disk health
          auditPolicy:
            apiVersion: audit.k8s.io/v1
            kind: Policy
            rules:
              - level: None

    - &nodeCidrSize |-
      - op: add
        path: /cluster/controllerManager/extraArgs
        value:
          node-cidr-mask-size: 23

    - &etcdSubnet |-
      cluster:
        etcd:
          advertisedSubnets:
            - "${IP_ROUTER_VLAN_K8S_CIDR}"

    - &etcdQuota |-
      cluster:
        etcd:
          extraArgs:
            quota-backend-bytes: 4294967296 # 4 GiB
    # https://www.talos.dev/v1.5/advanced/etcd-maintenance/#space-quota
    # maximum recommended is 8GiB, will resize to 4GiB for now so etcd won't shoot its load all at once

    - &metrics |-
      cluster:
        etcd:
          extraArgs:
            listen-metrics-urls: "http://0.0.0.0:2381"

    - &scheduler |-
      cluster:
        scheduler:
          config:
            apiVersion: kubescheduler.config.k8s.io/v1
            kind: KubeSchedulerConfiguration
            profiles:
              - schedulerName: default-scheduler
                pluginConfig:
                  - name: PodTopologySpread
                    args:
                      defaultingType: List
                      defaultConstraints:
                        - maxSkew: 1
                          topologyKey: "kubernetes.io/hostname"
                          whenUnsatisfiable: DoNotSchedule
                        - maxSkew: 3
                          topologyKey: "topology.kubernetes.io/zone"
                          whenUnsatisfiable: ScheduleAnyway

    - &talosAPI |
      machine:
        features:
          kubernetesTalosAPIAccess:
            enabled: true
            allowedRoles:
              - os:admin
              - os:operator
            allowedKubernetesNamespaces:
              - system-upgrade-controller
              - talos-backup
              - code-server
              - talosctl-image-pull-agent

    - &MutatingAdmissionPolicy |
      cluster:
        apiServer:
          extraArgs:
            runtime-config: admissionregistration.k8s.io/v1alpha1=true

    - &PodLevelResourcesCluster |
      cluster:
        apiServer:
          extraArgs:
            feature-gates: AuthorizeNodeWithSelectors=false,UserNamespacesSupport=true,UserNamespacesPodSecurityStandards=true,PodLevelResources=true,MutatingAdmissionPolicy=true # K8s 1.32 authz breaks Talos node discovery via Kubernetes, K8s 1.32+ user namespaces, K8s 1.32+ pod level resources, K8s 1.32+ mutating admission policy to avoid Kyverno
        controllerManager:
          extraArgs:
            feature-gates: PodLevelResources=true
        scheduler:
          extraArgs:
            feature-gates: PodLevelResources=true



================================================
FILE: kube/clusters/biohazard/talos/talsecret.yaml
================================================
cluster:
  id: '${cluster_id}'
  secret: '${cluster_secret}'
secrets:
  bootstraptoken: '${secrets_bootstraptoken}'
  secretboxencryptionsecret: '${secrets_secretboxencryptionsecret}'
trustdinfo:
  token: '${trustdinfo_token}'
certs:
  etcd:
    crt: '${certs_etcd_crt}'
    key: '${certs_etcd_key}'
  k8s:
    crt: '${certs_k8s_crt}'
    key: '${certs_k8s_key}'
  k8saggregator:
    crt: '${certs_k8saggregator_crt}'
    key: '${certs_k8saggregator_key}'
  k8sserviceaccount:
    key: '${certs_k8sserviceaccount_key}'
  os:
    crt: '${certs_os_crt}'
    key: '${certs_os_key}'



================================================
FILE: kube/clusters/biohazard/talos/watchdog.yaml
================================================
---
# watchdog.yaml
apiVersion: v1alpha1
kind: WatchdogTimerConfig
device: /dev/watchdog0
timeout: 5m



================================================
FILE: kube/deploy/apps/README.md
================================================
# Apps
These are the actual applications or services that the cluster will host.



================================================
FILE: kube/deploy/apps/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ns.yaml



================================================
FILE: kube/deploy/apps/ns.yaml
================================================
---
apiVersion: v1
kind: Namespace
metadata:
  name: apps



================================================
FILE: kube/deploy/apps/actual/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: actual-app
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "actual"
spec:
  commonMetadata:
    labels: *l
  path: ./kube/deploy/apps/actual/app
  targetNamespace: "actual"
  dependsOn:
    - name: actual-pvc
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: actual-pvc
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "actual"
    pvc.home.arpa/volsync: "true"
spec:
  commonMetadata:
    labels: *l
  path: ./kube/deploy/core/storage/volsync/template
  targetNamespace: "actual"
  dependsOn:
    - name: 1-core-storage-volsync-app
    - name: 1-core-storage-snapscheduler-app
    - name: 1-core-storage-rook-ceph-cluster
  postBuild:
    substitute:
      PVC: "actual-data"
      SIZE: "10Gi"
      SC: &sc "file"
      SNAP: *sc
      ACCESSMODE: "ReadWriteMany"
      SNAP_ACCESSMODE: "ReadOnlyMany"
      RUID: !!str &uid |
        ${APP_UID_ACTUAL:=1000}
      RGID: !!str |
        ${APP_UID_ACTUAL:=1000}
      RFSG: !!str |
        ${APP_UID_ACTUAL:=1000}



================================================
FILE: kube/deploy/apps/actual/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ns.yaml
  - ks.yaml



================================================
FILE: kube/deploy/apps/actual/ns.yaml
================================================
---
apiVersion: v1
kind: Namespace
metadata:
  name: actual
  labels:
    kustomize.toolkit.fluxcd.io/prune: disabled
    pod-security.kubernetes.io/enforce: &ps restricted
    pod-security.kubernetes.io/audit: *ps
    pod-security.kubernetes.io/warn: *ps



================================================
FILE: kube/deploy/apps/actual/app/es.yaml
================================================
---
# yaml-language-server: $schema=https://crds.jank.ing/external-secrets.io/externalsecret_v1beta1.json
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: &name actual-secrets
  namespace: actual
spec:
  refreshInterval: 1m
  secretStoreRef:
    kind: ClusterSecretStore
    name: 1p
  dataFrom:
    - extract:
        key: "Actual - ${CLUSTER_NAME}"
  target:
    creationPolicy: Owner
    deletionPolicy: Retain
    name: *name
    # template:
    #   type: Opaque
    #   data:
    #     age.agekey: '{{ .agekey }}'



================================================
FILE: kube/deploy/apps/actual/app/hr.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/app-template-3.6.1/charts/other/app-template/schemas/helmrelease-helm-v2beta2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app actual
  namespace: *app
spec:
  interval: 5m
  chart:
    spec:
      chart: app-template
      version: 3.7.3
      sourceRef:
        name: bjw-s
        kind: HelmRepository
        namespace: flux-system
  values:
    controllers:
      actual:
        type: deployment
        replicas: 1
        pod:
          labels:
            ingress.home.arpa/nginx-internal: allow
            authentik.home.arpa/https: allow
            # egress.home.arpa/internet: allow
        containers:
          main:
            image: &img
              repository: ghcr.io/actualbudget/actual-server
              tag: 25.5.0@sha256:3b486fbc0db02839917f65ed277aa509980f710b6e96dde966f5219983978179
              # tag: sha-4bb59fd@sha256:48978b9941b8d51fc09e9211e1e07bb1c253cf9efdb79b2cf43ef66fe362bd7f
            env: &env
              TZ: "${CONFIG_TZ}"
              ACTUAL_PORT: &http 5006
              ACTUAL_DATA_DIR: &pvc /data
              ACTUAL_MULTIUSER: "true"
              ACTUAL_LOGIN_METHOD: openid
              ACTUAL_ALLOWED_LOGIN_METHODS: openid
              ACTUAL_OPENID_PROVIDER_NAME: "JJGadgets Auth"
              ACTUAL_OPENID_SERVER_HOSTNAME: "https://${APP_DNS_ACTUAL}"
              ACTUAL_TRUSTED_PROXIES: "${IP_POD_CIDR_V4}"
            envFrom: &envFrom
              - secretRef:
                  name: actual-secrets
            securityContext: &sc
              readOnlyRootFilesystem: true
              allowPrivilegeEscalation: false
              capabilities:
                drop: ["ALL"]
            resources:
              requests:
                cpu: "10m"
              limits:
                cpu: "1"
                memory: "512Mi"
            probes:
              liveness:
                enabled: true
              readiness:
                enabled: true
        initContainers:
          01-enable-openid:
            image: *img
            env: *env
            envFrom: *envFrom
            securityContext: *sc
            # command: ["npm", "run", "enable-openid", "--prefix", "/app"]
            command: ["tini", "-g", "--", "/bin/sh", "-c"]
            args: ["npm run enable-openid --prefix /app || true"]
    service:
      actual:
        controller: actual
        ports:
          http:
            port: *http
            protocol: HTTP
            appProtocol: http
    ingress:
      main:
        className: nginx-internal
        annotations:
          nginx.ingress.kubernetes.io/configuration-snippet: |
            proxy_set_header X-Forwarded-For "";
        hosts:
          - host: &host "${APP_DNS_ACTUAL:=actual}"
            paths: &paths
              - path: /
                pathType: Prefix
                service:
                  identifier: actual
                  port: http
        tls:
          - hosts: [*host]
    persistence:
      data:
        existingClaim: actual-data
        globalMounts:
          - subPath: data
            path: *pvc
    defaultPodOptions:
      automountServiceAccountToken: false
      enableServiceLinks: false
      hostAliases:
        - ip: "${APP_IP_AUTHENTIK:=127.0.0.1}"
          hostnames: ["${APP_DNS_AUTHENTIK:=authentik}"]
      dnsConfig:
        options:
          - name: ndots
            value: "1"
      hostUsers: false
      securityContext:
        runAsNonRoot: true
        runAsUser: &uid 1000
        runAsGroup: *uid
        fsGroup: *uid
        fsGroupChangePolicy: Always
        seccompProfile: { type: "RuntimeDefault" }
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: *app
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: fuckoff.home.arpa/actual
                    operator: DoesNotExist



================================================
FILE: kube/deploy/apps/atuin/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: atuin-app
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "atuin"
spec:
  commonMetadata:
    labels: *l
  path: ./kube/deploy/apps/atuin/app
  targetNamespace: "atuin"
  dependsOn:
    - name: atuin-db
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: atuin-db
  namespace: flux-system
  labels: &l
    prune.flux.home.arpa/enabled: "true"
    db.home.arpa/pg: "pg-default"
    app.kubernetes.io/name: "atuin"
spec:
  commonMetadata:
    labels: *l
  path: ./kube/deploy/core/db/pg/clusters/template/pguser
  targetNamespace: "pg"
  dependsOn:
    - name: 1-core-db-pg-clusters-default
    - name: 1-core-secrets-es-k8s
  postBuild:
    substitute:
      PG_NAME: "default"
      PG_DB_USER: &app "atuin"
      PG_APP_NS: *app



================================================
FILE: kube/deploy/apps/atuin/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ns.yaml
  - ks.yaml



================================================
FILE: kube/deploy/apps/atuin/ns.yaml
================================================
---
apiVersion: v1
kind: Namespace
metadata:
  name: atuin
  labels:
    kustomize.toolkit.fluxcd.io/prune: disabled
    pod-security.kubernetes.io/enforce: &ps restricted
    pod-security.kubernetes.io/audit: *ps
    pod-security.kubernetes.io/warn: *ps



================================================
FILE: kube/deploy/apps/atuin/app/hr.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/common-3.4.0/charts/other/app-template/schemas/helmrelease-helm-v2beta2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app atuin
  namespace: *app
spec:
  interval: 5m
  chart:
    spec:
      chart: app-template
      version: 3.7.3
      sourceRef:
        name: bjw-s
        kind: HelmRepository
        namespace: flux-system
  values:
    controllers:
      atuin:
        type: deployment
        replicas: 1
        pod:
          labels:
            ingress.home.arpa/nginx-internal: allow
            db.home.arpa/pg: pg-default
        containers:
          main:
            image: &img
              repository: ghcr.io/atuinsh/atuin
              tag: v18.6.1@sha256:869a85bcc169ae9a3ea65dcf32a99dae982d28d8562172e2712d3313d7349203
            command: ["atuin", "server", "start"]
            env: &env
              TZ: "${CONFIG_TZ}"
              ATUIN_HOST: "0.0.0.0"
              ATUIN_PORT: &port 8888
              ATUIN_OPEN_REGISTRATION: "true"
              ATUIN_DB_URI:
                valueFrom:
                  secretKeyRef:
                    name: pg-default-pguser-atuin
                    key: pgbouncer-uri
            securityContext: &sc
              readOnlyRootFilesystem: true
              allowPrivilegeEscalation: false
              capabilities:
                drop: ["ALL"]
            resources:
              requests:
                cpu: "10m"
                memory: "128Mi"
              limits:
                cpu: "1"
                memory: "512Mi"
            probes:
              liveness:
                enabled: true
              readiness:
                enabled: true
    service:
      atuin:
        controller: atuin
        ports:
          http:
            port: *port
            protocol: HTTP
            appProtocol: http
    ingress:
      main:
        className: nginx-internal
        hosts:
          - host: &host "${APP_DNS_ATUIN:=atuin}"
            paths: &paths
              - path: /
                pathType: Prefix
                service:
                  identifier: atuin
                  port: http
        tls:
          - hosts: [*host]
    persistence:
      config:
        type: emptyDir
        medium: Memory
        sizeLimit: 64Mi
    defaultPodOptions:
      automountServiceAccountToken: false
      enableServiceLinks: false
      hostAliases:
        - ip: "${APP_IP_AUTHENTIK:=127.0.0.1}"
          hostnames: ["${APP_DNS_AUTHENTIK:=authentik}"]
      securityContext:
        runAsNonRoot: true
        runAsUser: &uid ${APP_UID_ATUIN:=1000}
        runAsGroup: *uid
        fsGroup: *uid
        fsGroupChangePolicy: Always
        seccompProfile: { type: "RuntimeDefault" }
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: fuckoff.home.arpa/atuin
                    operator: DoesNotExist



================================================
FILE: kube/deploy/apps/audiobookshelf/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: audiobookshelf-app
  namespace: flux-system
  labels:
    prune.flux.home.arpa/enabled: "true"
    wait.flux.home.arpa/disabled: "true"
spec:
  path: ./kube/deploy/apps/audiobookshelf/app
  dependsOn:
    - name: 1-core-storage-rook-ceph-cluster
    - name: 1-core-storage-volsync-app


================================================
FILE: kube/deploy/apps/audiobookshelf/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ns.yaml
  - ks.yaml



================================================
FILE: kube/deploy/apps/audiobookshelf/ns.yaml
================================================
---
apiVersion: v1
kind: Namespace
metadata:
  name: audiobookshelf



================================================
FILE: kube/deploy/apps/audiobookshelf/app/hr.yaml
================================================
---
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app audiobookshelf
  namespace: *app
spec:
  chart:
    spec:
      chart: app-template
      version: 2.6.0
      sourceRef:
        name: bjw-s
        kind: HelmRepository
        namespace: flux-system
  values:
    controllers:
      main:
        type: deployment
        replicas: 1
        pod:
          labels:
            ingress.home.arpa/nginx-internal: "allow"
            egress.home.arpa/world: "allow"
        containers:
          main:
            image:
              repository: "ghcr.io/advplyr/audiobookshelf"
              tag: "2.22.0@sha256:af827f25120c7a76c5b20bfb34f230353d44920ef7c55a9d7f3ae2aac9c51c94"
            env:
              TZ: "${CONFIG_TZ}"
              PORT: &http "8080"
              CONFIG_PATH: &config "/config"
              METADATA_PATH: &meta "/metadata"
            resources:
              requests:
                cpu: 10m
                memory: 128Mi
              limits:
                memory: 6000Mi
    service:
      main:
        ports:
          http:
            port: *http
    ingress:
      main:
        enabled: true
        primary: true
        className: "nginx-internal"
        hosts:
          - host: &host "${APP_DNS_AUDIOBOOKSHELF:=audiobookshelf}"
            paths:
              - path: /
                pathType: Prefix
                service:
                  name: main
                  port: http
        tls:
          - hosts:
              - *host
    persistence:
      config:
        enabled: true
        existingClaim: "audiobookshelf-config"
        advancedMounts:
          main:
            main:
              - path: *config
      nfs:
        enabled: true
        type: nfs
        server: "${IP_TRUENAS:=127.0.0.1}"
        path: "${PATH_NAS_MEDIA:=/media}"
        advancedMounts:
          main:
            main:
              - subPath: ".audiobookshelf-metadata"
                path: *meta
              - subPath: "Podcasts"
                path: "/podcasts"
              - subPath: "Audiobooks"
                path: "/audiobooks"
    defaultPodOptions:
      automountServiceAccountToken: false
      securityContext:
        runAsUser: &uid ${APP_UID_AUDIOBOOKSHELF:=1000}
        runAsGroup: *uid
        fsGroup: *uid
        fsGroupChangePolicy: Always



================================================
FILE: kube/deploy/apps/audiobookshelf/app/pvc.yaml
================================================
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: "audiobookshelf-config"
  namespace: &app "audiobookshelf"
  labels:
    app.kubernetes.io/name: *app
    app.kubernetes.io/instance: *app
    snapshot.home.arpa/enabled: "true"
    kustomize.toolkit.fluxcd.io/prune: "Disabled"
spec:
  storageClassName: "file"
  accessModes: ["ReadWriteMany"]
  resources:
    requests:
      storage: "50Gi"
  dataSourceRef:
    apiGroup: "volsync.backube"
    kind: "ReplicationDestination"
    name: "audiobookshelf-bootstrap"



================================================
FILE: kube/deploy/apps/audiobookshelf/app/volsync.yaml
================================================
---
apiVersion: v1
kind: Secret
metadata:
  name: "audiobookshelf-config-restic"
  namespace: "audiobookshelf"
type: Opaque
stringData:
  RESTIC_REPOSITORY: "${SECRET_VOLSYNC_R2_REPO}/audiobookshelf/config"
  RESTIC_PASSWORD: "${SECRET_VOLSYNC_PASSWORD}"
  AWS_ACCESS_KEY_ID: "${SECRET_VOLSYNC_R2_ID}"
  AWS_SECRET_ACCESS_KEY: "${SECRET_VOLSYNC_R2_KEY}"
---
apiVersion: volsync.backube/v1alpha1
kind: ReplicationSource
metadata:
  name: "audiobookshelf-config-restic"
  namespace: "audiobookshelf"
spec:
  sourcePVC: "audiobookshelf-config"
  trigger:
    schedule: "0 22 * * *" # 6am GMT+8
  restic:
    copyMethod: "Snapshot"
    pruneIntervalDays: 14
    repository: "audiobookshelf-config-restic"
    cacheCapacity: "2Gi"
    volumeSnapshotClassName: "file"
    storageClassName: "file"
    moverSecurityContext:
      runAsUser: &uid ${APP_UID_AUDIOBOOKSHELF}
      runAsGroup: *uid
      fsGroup: *uid
    retain:
      daily: 14
      within: 7d
---
apiVersion: volsync.backube/v1alpha1
kind: ReplicationDestination
metadata:
  name: "audiobookshelf-bootstrap"
  namespace: "audiobookshelf"
spec:
  trigger:
    manual: "restore-once-bootstrap"
  restic:
    repository: "audiobookshelf-config-restic"
    copyMethod: "Snapshot"
    volumeSnapshotClassName: "file"
    storageClassName: "file"
    capacity: "50Gi"
    accessModes: ["ReadWriteMany"]
    moverSecurityContext:
      runAsUser: &uid ${APP_UID_AUDIOBOOKSHELF}
      runAsGroup: *uid
      fsGroup: *uid



================================================
FILE: kube/deploy/apps/authentik/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: authentik-app
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "authentik"
spec:
  commonMetadata:
    labels: *l
  path: ./kube/deploy/apps/authentik/app
  targetNamespace: "authentik"
  dependsOn:
    - name: authentik-db
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: authentik-db
  namespace: flux-system
spec:
  path: ./kube/deploy/core/db/pg/clusters/template
  dependsOn:
    - name: 1-core-db-pg-app
    - name: 1-core-storage-democratic-csi-local-hostpath
    - name: 1-core-secrets-es-k8s
  postBuild:
    substitute:
      PG_APP_NAME: &app "authentik"
      PG_APP_NS: *app
      PG_DB_NAME: *app
      PG_DB_USER: *app
      PG_REPLICAS: "3"
      PG_SC: "local"
      PG_CONFIG_VERSION: "15.2-11"
      PG_CONFIG_SIZE: "20Gi"



================================================
FILE: kube/deploy/apps/authentik/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ns.yaml
  - ks.yaml



================================================
FILE: kube/deploy/apps/authentik/ns.yaml
================================================
---
apiVersion: v1
kind: Namespace
metadata:
  name: authentik
  labels:
    kustomize.toolkit.fluxcd.io/prune: disabled
    pod-security.kubernetes.io/enforce: &ps baseline # Crunchy-PGO can't set seccompProfile on the instance containers
    pod-security.kubernetes.io/audit: *ps
    pod-security.kubernetes.io/warn: *ps



================================================
FILE: kube/deploy/apps/authentik/app/es.yaml
================================================
---
# yaml-language-server: $schema=https://crds.jank.ing/external-secrets.io/externalsecret_v1beta1.json
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: &name authentik-secrets
  namespace: authentik
spec:
  refreshInterval: 1m
  secretStoreRef:
    kind: ClusterSecretStore
    name: 1p
  dataFrom:
    - extract:
        key: "authentik - ${CLUSTER_NAME}"
  target:
    creationPolicy: Owner
    deletionPolicy: Retain
    name: *name
    template:
      type: "Opaque"
      data:
        AUTHENTIK_SECRET_KEY: '{{ .AUTHENTIK_SECRET_KEY }}'
        AUTHENTIK_REDIS__PASSWORD: '{{ .AUTHENTIK_REDIS__PASSWORD }}'
        AUTHENTIK_EMAIL__FROM: '{{ .AUTHENTIK_EMAIL__FROM }}'
        AUTHENTIK_EMAIL__HOST: '{{ .AUTHENTIK_EMAIL__HOST }}'
        AUTHENTIK_EMAIL__PORT: '{{ .AUTHENTIK_EMAIL__PORT }}'
        AUTHENTIK_EMAIL__USE_TLS: '{{ .AUTHENTIK_EMAIL__USE_TLS }}'
        AUTHENTIK_EMAIL__USE_SSL: '{{ .AUTHENTIK_EMAIL__USE_SSL }}'
        AUTHENTIK_EMAIL__USERNAME: '{{ .AUTHENTIK_EMAIL__USERNAME }}'
        AUTHENTIK_EMAIL__PASSWORD: '{{ .AUTHENTIK_EMAIL__PASSWORD }}'
        AUTHENTIK_STORAGE__MEDIA__S3__ENDPOINT: '{{ .AUTHENTIK_STORAGE__MEDIA__S3__ENDPOINT }}'
        AUTHENTIK_STORAGE__MEDIA__S3__BUCKET_NAME: '{{ .AUTHENTIK_STORAGE__MEDIA__S3__BUCKET_NAME }}'
        AUTHENTIK_STORAGE__MEDIA__S3__CUSTOM_DOMAIN: '{{ .AUTHENTIK_STORAGE__MEDIA__S3__CUSTOM_DOMAIN }}'
        AUTHENTIK_STORAGE__MEDIA__S3__ACCESS_KEY: '{{ .AUTHENTIK_STORAGE__MEDIA__S3__ACCESS_KEY }}'
        AUTHENTIK_STORAGE__MEDIA__S3__SECRET_KEY: '{{ .AUTHENTIK_STORAGE__MEDIA__S3__SECRET_KEY }}'
---
# yaml-language-server: $schema=https://crds.jank.ing/external-secrets.io/externalsecret_v1beta1.json
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: &name authentik-tokens
  namespace: authentik
spec:
  refreshInterval: 1m
  secretStoreRef:
    kind: ClusterSecretStore
    name: 1p
  dataFrom:
    - extract:
        key: "authentik - ${CLUSTER_NAME}"
  target:
    creationPolicy: Owner
    deletionPolicy: Retain
    name: *name
    template:
      type: "Opaque"
      data:
        AUTHENTIK_TOKEN_LDAP: '{{ .AUTHENTIK_TOKEN_LDAP }}'
        AUTHENTIK_TOKEN_RADIUS: '{{ .AUTHENTIK_TOKEN_RADIUS }}'



================================================
FILE: kube/deploy/apps/authentik/app/hr.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/app-template-3.6.1/charts/other/app-template/schemas/helmrelease-helm-v2beta2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app authentik
  namespace: *app
spec:
  interval: 5m
  chart:
    spec:
      chart: app-template
      version: 3.7.3
      sourceRef:
        name: bjw-s
        kind: HelmRepository
        namespace: flux-system
  values:
    controllers:
      authentik:
        type: deployment
        replicas: 2
        strategy: RollingUpdate
        rollingUpdate:
          unavailable: "90%"
        pod:
          labels:
            ingress.home.arpa/nginx-external: allow
            ingress.home.arpa/nginx-internal: allow
            ingress.home.arpa/nginx-public: allow
            egress.home.arpa/nginx-external: allow
            egress.home.arpa/nginx-internal: allow
            egress.home.arpa/nginx-public: allow
            db.home.arpa/pg: pg-authentik
            s3.home.arpa/store: "rgw-${CLUSTER_NAME}"
            prom.home.arpa/kps: allow
            # for OIDC sources
            egress.home.arpa/discord: allow
            egress.home.arpa/github: allow
          topologySpreadConstraints:
            - &tsc
              maxSkew: 1
              topologyKey: kubernetes.io/hostname
              whenUnsatisfiable: DoNotSchedule
              labelSelector:
                matchLabels:
                  app.kubernetes.io/name: *app
                  app.kubernetes.io/component: *app
        containers:
          main:
            image: &img
              repository: ghcr.io/goauthentik/server
              tag: 2025.2.4@sha256:36233579415aa2e2e52a6b0c45736cb871fe71460bfe0cf95d83f67528fb1182
            args: [server]
            env: &env
              TZ: "${CONFIG_TZ}"
              # PostgreSQL
              AUTHENTIK_POSTGRESQL__HOST:
                valueFrom:
                  secretKeyRef:
                    name: pg-authentik-pguser-authentik
                    key: pgbouncer-host
                    # key: host
              AUTHENTIK_POSTGRESQL__PORT:
                valueFrom:
                  secretKeyRef:
                    name: pg-authentik-pguser-authentik
                    #key: pgbouncer-port
                    key: port
              AUTHENTIK_POSTGRESQL__NAME:
                valueFrom:
                  secretKeyRef:
                    name: pg-authentik-pguser-authentik
                    key: dbname
              AUTHENTIK_POSTGRESQL__USER:
                valueFrom:
                  secretKeyRef:
                    name: pg-authentik-pguser-authentik
                    key: user
              AUTHENTIK_POSTGRESQL__PASSWORD:
                valueFrom:
                  secretKeyRef:
                    name: pg-authentik-pguser-authentik
                    key: password
              AUTHENTIK_POSTGRESQL__SSLMODE: verify-ca
              AUTHENTIK_POSTGRESQL__SSLROOTCERT: &pgca /secrets/pg/ca.crt
              AUTHENTIK_SESSION_STORAGE: "db" # store sessions in PG than Redis
              # pgBouncer
              AUTHENTIK_POSTGRESQL__CONN_MAX_AGE: "0" # if not using pgBouncer, maybe setting this to null for unlimited persistent connections is a good idea: connection slots limit can be reached with authentik
              AUTHENTIK_POSTGRESQL__CONN_HEALTH_CHECKS: "true"
              AUTHENTIK_POSTGRESQL__DISABLE_SERVER_SIDE_CURSORS: "true"
              # KV cache
              AUTHENTIK_REDIS__HOST: authentik-redis.authentik.svc.cluster.local
              # media storage
              AUTHENTIK_STORAGE__MEDIA__BACKEND: "s3"
              AUTHENTIK_STORAGE__MEDIA__S3__USE_SSL: "true"
              AUTHENTIK_STORAGE__MEDIA__S3__SECURE_URLS: "true"
              # misc
              AUTHENTIK_LISTEN__TRUSTED_PROXY_CIDRS: "${IP_POD_CIDR_V4:=127.0.0.1/32}"
              AUTHENTIK_OUTPOSTS__DISCOVER: "false"
              # error reporting
              AUTHENTIK_ERROR_REPORTING__ENABLED: "false"
              AUTHENTIK_ERROR_REPORTING__SEND_PII: "false"
            envFrom: &envFrom
              - secretRef:
                  name: authentik-secrets
            securityContext: &sc
              readOnlyRootFilesystem: true
              allowPrivilegeEscalation: false
              capabilities:
                drop: ["ALL"]
            resources:
              requests:
                cpu: "30m"
                memory: "600Mi"
              limits:
                cpu: "1"
                memory: "2Gi"
            ports:
              - name: http
                containerPort: &http 9000
              - name: https
                containerPort: &https 9443
              - name: metrics
                containerPort: &metrics 9300
            probes:
              liveness: &probe
                enabled: true
                type: HTTP
                port: http
                path: "/-/health/live/"
              readiness:
                enabled: true
                type: HTTP
                port: http
                path: "/-/health/ready/"
              startup:
                <<: *probe
                enabled: true
                spec: &startup
                  periodSeconds: 1
                  failureThreshold: 300
                  initialDelaySeconds: 15
          anubis:
            image:
              repository: ghcr.io/xe/x/anubis
              tag: latest@sha256:a7b24490df79512a18a198dc44cd3d8a4ac3389ec91866ec9720d6293c2bdde7
            env:
              TZ: "${CONFIG_TZ}"
              BIND: ":8923"
              DIFFICULTY: "5"
              SERVE_ROBOTS_TXT: "true"
              TARGET: "http://127.0.0.1:9000"
            securityContext: *sc
            resources:
              requests:
                cpu: "5m"
                memory: "32Mi"
              limits:
                cpu: "1"
                memory: "128Mi"
            ports:
              - name: anubis
                containerPort: &anubis 8923
            probes:
              liveness:
                enabled: true
              readiness:
                enabled: true
      worker:
        type: deployment
        replicas: 2
        strategy: RollingUpdate
        rollingUpdate:
          unavailable: "90%"
        pod:
          labels:
            db.home.arpa/pg: pg-authentik
            s3.home.arpa/store: "rgw-${CLUSTER_NAME}"
            authentik.home.arpa/https: allow
            prom.home.arpa/kps: allow
            # egress.home.arpa/internet: allow
          topologySpreadConstraints:
            - <<: *tsc
              labelSelector:
                matchLabels:
                  app.kubernetes.io/name: *app
                  app.kubernetes.io/component: worker
        containers:
          main:
            image: *img
            args: [worker]
            env: *env
            envFrom: *envFrom
            securityContext: *sc
            resources:
              requests:
                cpu: "20m"
                memory: "512Mi"
              limits:
                cpu: "1000m"
                memory: "2Gi"
            probes:
              liveness: &worker-probe
                enabled: true
                custom: true
                spec: &wps
                  exec:
                    command: ["ak", "healthcheck"]
              readiness: *worker-probe
              startup:
                <<: *worker-probe
                spec:
                  <<: [*startup, *wps]
      ldap:
        type: deployment
        replicas: 2
        strategy: RollingUpdate
        rollingUpdate:
          unavailable: "90%"
        pod:
          labels:
            authentik.home.arpa/https: allow
          topologySpreadConstraints:
            - <<: *tsc
              labelSelector:
                matchLabels:
                  app.kubernetes.io/name: *app
                  app.kubernetes.io/component: ldap
        containers:
          main:
            image:
              <<: *img
              repository: ghcr.io/goauthentik/ldap
              tag: 2025.2.4@sha256:cc98bc43e3713095097ae322df1ebd3b0ae76ecd0bd67ae7cd1e0375cce51b1b
            env:
              AUTHENTIK_HOST: "https://${APP_DNS_AUTHENTIK}"
              AUTHENTIK_TOKEN:
                valueFrom:
                  secretKeyRef:
                    name: authentik-tokens
                    key: AUTHENTIK_TOKEN_LDAP
            securityContext: *sc
            resources:
              requests:
                cpu: "10m"
                memory: "128Mi"
              limits:
                cpu: "1000m"
                memory: "512Mi"
            probes:
              liveness: &ldap-probe
                enabled: true
                custom: true
                spec: &lps
                  exec:
                    command: ["/ldap", "healthcheck"]
              readiness: *ldap-probe
              startup:
                <<: *ldap-probe
                spec:
                  <<: [*startup, *lps]
      radius:
        type: deployment
        replicas: 2
        strategy: RollingUpdate
        rollingUpdate:
          unavailable: "90%"
        pod:
          labels:
            authentik.home.arpa/https: allow
          topologySpreadConstraints:
            - <<: *tsc
              labelSelector:
                matchLabels:
                  app.kubernetes.io/name: *app
                  app.kubernetes.io/component: radius
        containers:
          main:
            image:
              <<: *img
              repository: ghcr.io/goauthentik/radius
              tag: 2025.2.4@sha256:a730e2912dfced9dce4f76fab9543857ce2d3b572c966738a4529530ce86e855
            env:
              AUTHENTIK_HOST: "https://${APP_DNS_AUTHENTIK}"
              AUTHENTIK_TOKEN:
                valueFrom:
                  secretKeyRef:
                    name: authentik-tokens
                    key: AUTHENTIK_TOKEN_RADIUS
            securityContext: *sc
            resources:
              requests:
                cpu: "10m"
                memory: "128Mi"
              limits:
                cpu: "1000m"
                memory: "512Mi"
            probes:
              liveness: &radius-probe
                enabled: true
                custom: true
                spec: &rps
                  exec:
                    command: ["/radius", "healthcheck"]
              readiness: *radius-probe
              startup:
                <<: *radius-probe
                spec:
                  <<: [*startup, *rps]
      redis:
        type: deployment
        replicas: 1
        containers:
          redis:
            image:
              repository: "public.ecr.aws/docker/library/redis"
              tag: "7.4.3@sha256:7df1eeff67eb0ba84f6b9d2940765a6bb1158081426745c185a03b1507de6a09"
            command: ["redis-server", "--save", "''", "--appendonly", "no", "--requirepass", "$(AUTHENTIK_REDIS__PASSWORD)"] # save and appendonly options forcibly disable RDB and AOF persistence entirely
            envFrom: *envFrom
            securityContext: *sc
            resources:
              requests:
                cpu: "10m"
                memory: "32Mi"
              limits:
                cpu: "1000m"
                memory: "512Mi"
            probes:
              liveness:
                enabled: true
              readiness:
                enabled: true
      # renovate-test:
      #   enabled: false
      #   type: deployment
      #   replicas: 0
      #   strategy: RollingUpdate
      #   rollingUpdate:
      #     unavailable: "90%"
      #   containers:
      #     main:
      #       image: &img
      #         repository: ghcr.io/goauthentik/server
      #         tag: 2024.12.5@sha256:717323d68507fb76dd79f8958f42ce57f8ae0c10a55a7807efa1cfec5752b77c
      #       args: [server]
      #       env: &env
      #         TZ: "${CONFIG_TZ}"
      #       securityContext: &sc
      #         readOnlyRootFilesystem: true
      #         allowPrivilegeEscalation: false
      #         capabilities:
      #           drop: ["ALL"]
      #       resources:
      #         requests:
      #           cpu: "0"
      #           memory: "0"
      #         limits:
      #           cpu: "1000m"
      #           memory: "2Gi"
      #     anubis:
      #       image:
      #         repository: ghcr.io/xe/x/anubis
      #         tag: latest@sha256:a7b24490df79512a18a198dc44cd3d8a4ac3389ec91866ec9720d6293c2bdde7
      #       env:
      #         TZ: "${CONFIG_TZ}"
      #         BIND: ":8923"
      #         DIFFICULTY: "5"
      #         SERVE_ROBOTS_TXT: "true"
      #         TARGET: "http://127.0.0.1:9000"
      #       securityContext: *sc
      #       resources:
      #         requests:
      #           cpu: "5m"
      #           memory: "32Mi"
      #         limits:
      #           cpu: "1"
      #           memory: "128Mi"
      #       ports:
      #         - name: anubis
      #           containerPort: &anubis 8923
      #       probes:
      #         liveness:
      #           enabled: true
      #         readiness:
      #           enabled: true
    service:
      authentik:
        controller: authentik
        ports:
          http: &port
            port: *http
            protocol: HTTP
            appProtocol: http
          http-80:
            <<: *port
            port: 80
            targetPort: *http
          metrics:
            <<: *port
            port: *metrics
          anubis:
            <<: *port
            port: *anubis
      redis:
        primary: false
        controller: redis
        ports:
          redis:
            port: 6379
      expose:
        primary: false
        controller: authentik
        type: LoadBalancer
        annotations:
          io.cilium/internal: "true"
          io.cilium/lb-ipam-ips: "${APP_IP_AUTHENTIK:=127.0.0.1}"
        ports:
          http:
            port: 443
            targetPort: *https
            protocol: HTTPS
            appProtocol: https
      ldap:
        primary: false
        controller: ldap
        type: LoadBalancer
        annotations:
          coredns.io/hostname: "${APP_DNS_AUTHENTIK_LDAP:=authentik-ldap}"
          io.cilium/lb-ipam-ips: "${APP_IP_AUTHENTIK_LDAP:=127.0.0.1}"
        ports:
          ldap-tcp: &ldap
            port: 389
            targetPort: 3389
            protocol: TCP
            appProtocol: ldap
          ldap-udp:
            <<: *ldap
            protocol: UDP
          ldaps-tcp: &ldaps
            port: 636
            targetPort: 6636
            protocol: TCP
            appProtocol: ldaps
          ldaps-udp:
            <<: *ldaps
            protocol: UDP
      radius:
        primary: false
        controller: radius
        type: LoadBalancer
        annotations:
          coredns.io/hostname: "${APP_DNS_AUTHENTIK_RADIUS:=authentik-radius}"
          io.cilium/lb-ipam-ips: "${APP_IP_AUTHENTIK_RADIUS:=127.0.0.1}"
        ports:
          radius-tcp: &radius
            port: 1812
            protocol: TCP
            appProtocol: radius
          radius-udp:
            <<: *radius
            protocol: UDP
    ingress:
      internal: &ingress
        className: nginx-external
        annotations:
          nginx.ingress.kubernetes.io/whitelist-source-range: "10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 100.64.0.0/10"
        hosts:
          - host: &host "${APP_DNS_AUTHENTIK:=authentik}"
            paths:
              - &path
                path: /
                pathType: Prefix
                service:
                  identifier: authentik
                  port: http
        tls: &tls
          - hosts: [*host]
            secretName: authentik-tls
      external:
        <<: *ingress
        annotations:
          external-dns.alpha.kubernetes.io/target: "${DNS_CF:=cf}"
          external-dns.alpha.kubernetes.io/cloudflare-proxied: "true"
        hosts:
          - host: *host
            paths:
              - <<: *path
                service:
                  identifier: authentik
                  port: anubis
      harden:
        <<: *ingress
        annotations:
          nginx.ingress.kubernetes.io/whitelist-source-range: "${IP_JJ_V4:=127.0.0.1/32}"
        hosts:
          - host: *host
            paths:
              - <<: *path
                path: /api/v3/policies/expression
              - <<: *path
                path: /api/v3/propertymappings
              - <<: *path
                path: /api/v3/managed/blueprints
    persistence:
      pg-ca:
        type: secret
        #name: pg-authentik-pgbouncer
        name: pg-authentik-cluster-cert
        defaultMode: 0400
        globalMounts:
          - subPath: ca.crt
            #subPath: pgbouncer-frontend.ca-roots
            path: *pgca
      tls:
        type: secret
        name: authentik-tls
        defaultMode: 0400
        globalMounts:
          - path: "/certs/${APP_DNS_AUTHENTIK}-k8s"
      tmp:
        type: emptyDir
        medium: Memory
        globalMounts:
          - path: "/media/public"
    defaultPodOptions:
      automountServiceAccountToken: false
      enableServiceLinks: false
      hostAliases:
        - ip: "${APP_IP_AUTHENTIK:=127.0.0.1}"
          hostnames: ["${APP_DNS_AUTHENTIK:=authentik}"]
      securityContext:
        runAsNonRoot: true
        runAsUser: &uid 1000
        runAsGroup: *uid
        fsGroup: *uid
        fsGroupChangePolicy: Always
        seccompProfile: { type: "RuntimeDefault" }
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: fuckoff.home.arpa/authentik
                    operator: DoesNotExist
    networkpolicies:
      same-ns:
        podSelector: {}
        policyTypes: [Ingress, Egress]
        rules:
          ingress: [from: [{podSelector: {}}]]
          egress: [to: [{podSelector: {}}]]
      vm-ad:
        nameOverride: vm-ad
        controller: worker
        policyTypes: [Egress]
        rules:
          egress: [to: [{ipBlock: {cidr: "${IP_AD_CIDR:=127.0.0.1/32}"}}]]
    serviceMonitor:
      authentik:
        serviceName: authentik
        endpoints:
          - port: metrics
            scheme: http
            path: /metrics
            interval: 1m
            scrapeTimeout: 30s



================================================
FILE: kube/deploy/apps/authentik/app/netpol.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/cilium.io/ciliumnetworkpolicy_v2.json
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: &app authentik
  namespace: *app
spec:
  endpointSelector: {}
  ingress:
    # allow HTTP traffic in-cluster
    - fromEndpoints:
        - matchLabels:
            authentik.home.arpa/http: allow
          matchExpressions:
            - key: io.kubernetes.pod.namespace
              operator: Exists
      toPorts:
        - ports:
            - port: "9000"
    # allow HTTPS traffic in-cluster
    - fromEndpoints:
        - matchLabels:
            authentik.home.arpa/https: allow
          matchExpressions:
            - key: io.kubernetes.pod.namespace
              operator: Exists
      toPorts:
        - ports:
            - port: "9443"
  egress:
    # same namespace
    - toEndpoints:
        - matchLabels:
            io.kubernetes.pod.namespace: *app
    # allow Duo
    - toFQDNs:
        - &duo { matchPattern: "api-*.duosecurity.com" }
      toPorts:
        - ports:
            - port: "443"
    # allow AWS SES
    - toFQDNs:
        - &smtp { matchPattern: "email-smtp.*.amazonaws.com" }
      toPorts:
        - ports:
            - port: "587"
    # toFQDNs
    - toEndpoints:
        - matchLabels:
            "k8s:io.kubernetes.pod.namespace": kube-system
            "k8s:k8s-app": kube-dns
        - matchLabels:
            io.kubernetes.pod.namespace: kube-system
            k8s-app: kube-dns
      toPorts:
        - ports:
            - port: "53"
              protocol: "ANY"
          rules:
            dns:
              - *duo
              - *smtp
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/cilium.io/ciliumclusterwidenetworkpolicy_v2.json
apiVersion: cilium.io/v2
kind: CiliumClusterwideNetworkPolicy
metadata:
  name: &app authentik-http-in-cluster
spec:
  endpointSelector:
    matchLabels:
      authentik.home.arpa/http: allow
  egress:
    - toEndpoints:
        - matchLabels:
            io.kubernetes.pod.namespace: authentik
            app.kubernetes.io/name: authentik
            app.kubernetes.io/component: authentik
      toPorts:
        - ports:
            - port: "9000"
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/cilium.io/ciliumclusterwidenetworkpolicy_v2.json
apiVersion: cilium.io/v2
kind: CiliumClusterwideNetworkPolicy
metadata:
  name: &app authentik-https-in-cluster
spec:
  endpointSelector:
    matchLabels:
      authentik.home.arpa/https: allow
  egress:
    - toEndpoints:
        - matchLabels:
            io.kubernetes.pod.namespace: authentik
            app.kubernetes.io/name: authentik
            app.kubernetes.io/component: authentik
      toPorts:
        - ports:
            - port: "9443"
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/cilium.io/ciliumnetworkpolicy_v2.json
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: authentik-ldap
  namespace: &app authentik
spec:
  endpointSelector:
    matchLabels:
      app.kubernetes.io/name: *app
      app.kubernetes.io/component: ldap
  ingress:
    # allow LDAP traffic
    - fromEndpoints:
        - matchLabels:
            authentik.home.arpa/ldap: allow
          matchExpressions:
            - key: io.kubernetes.pod.namespace
              operator: Exists
      toPorts: &port
        - ports:
            - port: "6636"
    - fromCIDRSet:
        - cidr: "${IP_ROUTER_VLAN_K8S}/32"
      toPorts: *port
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/cilium.io/ciliumclusterwidenetworkpolicy_v2.json
apiVersion: cilium.io/v2
kind: CiliumClusterwideNetworkPolicy
metadata:
  name: &app authentik-ldap
spec:
  endpointSelector:
    matchLabels:
      authentik.home.arpa/ldap: allow
  egress:
    - toEndpoints:
        - matchLabels:
            io.kubernetes.pod.namespace: authentik
            app.kubernetes.io/name: authentik
            app.kubernetes.io/component: ldap
      toPorts:
        - ports:
            - port: "6636"
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/cilium.io/ciliumnetworkpolicy_v2.json
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: authentik-radius
  namespace: &app authentik
spec:
  endpointSelector:
    matchLabels:
      app.kubernetes.io/name: *app
      app.kubernetes.io/component: radius
  ingress:
    # allow radius traffic
    - fromCIDRSet:
        - cidr: "${IP_ROUTER_VLAN_K8S}/32"
      toPorts:
        - ports:
            - port: "1812"



================================================
FILE: kube/deploy/apps/authentik/app/tls.yaml
================================================
---
# yaml-language-server: $schema=https://crds.jank.ing/cert-manager.io/certificate_v1.json
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: &app authentik
  namespace: *app
spec:
  secretName: authentik-tls
  issuerRef:
    name: letsencrypt-production
    kind: ClusterIssuer
  privateKey:
    algorithm: ECDSA
    size: 384
  commonName: ${DNS_MAIN}
  dnsNames:
    - ${DNS_MAIN}
    - "*.${DNS_MAIN}"
    - "*.tinfoil.${DNS_MAIN}"



================================================
FILE: kube/deploy/apps/authentik/forward-auth/ingress.yaml
================================================
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${AUTHENTIK_PROXY_HOST//./-}-authentik
  namespace: authentik
spec:
  ingressClassName: "${INGRESS_CLASS:=nginx-internal}"
  rules:
    - host: &host "${AUTHENTIK_PROXY_HOST:=authentik}"
      http:
        paths:
          - pathType: Prefix
            path: "/outpost.goauthentik.io"
            backend:
              service:
                name: authentik
                port:
                  name: http
  tls:
    - hosts:
        - *host



================================================
FILE: kube/deploy/apps/authentik/forward-auth/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: authentik
resources:
  - ./ingress.yaml
transformers:
  - |-
    apiVersion: builtin
    kind: NamespaceTransformer
    metadata:
      name: not-used
      namespace: authentik
patches:
  - patch: |
      - op: replace
        path: /metadata/namespace
        value: authentik
    target:
      kind: Ingress



================================================
FILE: kube/deploy/apps/blocky/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: blocky-app
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "blocky"
spec:
  commonMetadata:
    labels: *l
  path: ./kube/deploy/apps/blocky/app
  targetNamespace: "blocky"
  dependsOn:
    - name: blocky-db
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: blocky-db
  namespace: flux-system
  labels: &l
    prune.flux.home.arpa/enabled: "true"
    db.home.arpa/pg: "pg-default"
    app.kubernetes.io/name: "blocky"
spec:
  commonMetadata:
    labels: *l
  path: ./kube/deploy/core/db/pg/clusters/template/pguser
  targetNamespace: "pg"
  dependsOn:
    - name: 1-core-db-pg-clusters-default
    - name: 1-core-secrets-es-k8s
  postBuild:
    substitute:
      PG_NAME: "default"
      PG_DB_USER: &app "blocky"
      PG_APP_NS: *app



================================================
FILE: kube/deploy/apps/blocky/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ns.yaml
  - ks.yaml



================================================
FILE: kube/deploy/apps/blocky/ns.yaml
================================================
---
apiVersion: v1
kind: Namespace
metadata:
  name: blocky
  labels:
    kustomize.toolkit.fluxcd.io/prune: disabled
    pod-security.kubernetes.io/enforce: &ps restricted
    pod-security.kubernetes.io/audit: *ps
    pod-security.kubernetes.io/warn: *ps



================================================
FILE: kube/deploy/apps/blocky/app/es.yaml
================================================
---
# yaml-language-server: $schema=https://crds.jank.ing/external-secrets.io/externalsecret_v1beta1.json
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: &name blocky-secrets
  namespace: blocky
spec:
  refreshInterval: 1m
  secretStoreRef:
    kind: ClusterSecretStore
    name: 1p
  dataFrom:
    - extract:
        key: "blocky - ${CLUSTER_NAME}"
  target:
    creationPolicy: Owner
    deletionPolicy: Retain
    name: *name
    # template:
    #   type: Opaque
    #   data:
    #     age.agekey: '{{ .agekey }}'



================================================
FILE: kube/deploy/apps/blocky/app/hr.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/common-3.4.0/charts/other/app-template/schemas/helmrelease-helm-v2beta2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app blocky
  namespace: *app
spec:
  interval: 5m
  chart:
    spec:
      chart: app-template
      version: 3.7.3
      sourceRef:
        name: bjw-s
        kind: HelmRepository
        namespace: flux-system
  values:
    controllers:
      blocky:
        type: deployment
        replicas: 2
        strategy: RollingUpdate
        rollingUpdate:
          unavailable: "90%"
        pod:
          labels:
            ingress.home.arpa/nginx-external: allow
            db.home.arpa/pg: pg-default
            egress.home.arpa/world: allow # TODO: tighten up
            prom.home.arpa/kps: allow
        containers:
          main:
            image: &img
              repository: ghcr.io/0xerr0r/blocky
              tag: v0.25@sha256:347f8c6addc1775ef74b83dfc609c28436a67f812ef0ee7e2602569dc0e56cd1
            #args: ["--config", &dir "/config"]
            env: &env
              TZ: "${CONFIG_TZ}"
            securityContext: &sc
              readOnlyRootFilesystem: true
              allowPrivilegeEscalation: false
              capabilities:
                drop: ["ALL"]
                add: ["NET_BIND_SERVICE"]
            resources:
              requests:
                cpu: "10m"
                memory: "1Gi"
              limits:
                cpu: "3000m"
                memory: "2Gi"
            probes:
              liveness:
                enabled: true
              readiness:
                enabled: true
      redis:
        type: deployment
        replicas: 1
        containers:
          redis:
            image:
              repository: "public.ecr.aws/docker/library/redis"
              tag: "7.4.3@sha256:7df1eeff67eb0ba84f6b9d2940765a6bb1158081426745c185a03b1507de6a09"
            command: ["redis-server", "--save", "''", "--appendonly", "no"] # save and appendonly options forcibly disable RDB and AOF persistence entirely
            securityContext:
              readOnlyRootFilesystem: true
              allowPrivilegeEscalation: false
              capabilities:
                drop: ["ALL"]
            resources:
              requests:
                cpu: "10m"
                memory: "32Mi"
              limits:
                cpu: "1000m"
                memory: "512Mi"
            probes:
              liveness:
                enabled: true
              readiness:
                enabled: true
    service:
      blocky:
        controller: blocky
        ports:
          http:
            port: 8080
            protocol: HTTP
            appProtocol: http
      redis:
        primary: false
        controller: redis
        ports:
          redis:
            port: 6379
            protocol: TCP
            appProtocol: redis
      expose:
        primary: false
        controller: blocky
        type: LoadBalancer
        annotations:
          "io.cilium/lb-ipam-ips": "${APP_IP_BLOCKY:=127.0.0.1}"
          tailscale.com/expose: "true"
          tailscale.com/tags: "tag:dns"
        labels:
          exposeSvc: dns
        ports:
          dns:
            port: 53
            targetPort: 8053
            protocol: UDP
            appProtocol: domain
          dns-tcp:
            port: 53
            targetPort: 8053
            protocol: TCP
            appProtocol: domain
    ingress:
      main:
        className: nginx-external
        hosts:
          - host: &host "${APP_DNS_BLOCKY:=blocky}"
            paths: &paths
              - path: /dns-query
                pathType: Prefix
                service:
                  identifier: blocky
                  port: http
        tls:
          - hosts: [*host]
    persistence:
      config:
        type: configMap
        name: blocky-config
        advancedMounts:
          blocky:
            main:
              - subPath: config.yml
                path: /app/config.yml
      secrets:
        type: secret
        name: blocky-secrets
        defaultMode: 0400
        advancedMounts:
          blocky:
            main:
              - subPath: allowlist
                path: /secrets/allowlist
              - subPath: blocklist
                path: /secrets/blocklist
    defaultPodOptions:
      automountServiceAccountToken: false
      enableServiceLinks: false
      securityContext:
        runAsNonRoot: true
        runAsUser: &uid 1000
        runAsGroup: *uid
        fsGroup: *uid
        fsGroupChangePolicy: Always
        seccompProfile: { type: "RuntimeDefault" }
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: *app
              app.kubernetes.io/instance: *app
              app.kubernetes.io/component: *app
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: fuckoff.home.arpa/blocky
                    operator: DoesNotExist
      dnsConfig:
        options:
          - name: ndots
            value: "1"
    networkpolicies:
      same-ns:
        podSelector: {}
        policyTypes: [Ingress, Egress]
        rules:
          ingress: [from: [{podSelector: {}}]]
          egress: [to: [{podSelector: {}}]]
    serviceMonitor:
      blocky:
        serviceName: blocky
        endpoints:
          - port: metrics
            scheme: http
            path: /metrics
            interval: 1m
            scrapeTimeout: 30s



================================================
FILE: kube/deploy/apps/blocky/app/netpol.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/cilium.io/ciliumnetworkpolicy_v2.json
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: &app blocky
  namespace: *app
spec:
  endpointSelector: {}
  ingress:
    - fromEntities:
        - world
        - cluster
      toPorts: &dns
        - ports:
            - port: "53"
              protocol: UDP
            - port: "53"
              protocol: TCP
            - port: "8053"
              protocol: UDP
            - port: "8053"
              protocol: TCP
  egress:
    - toCIDRSet:
        - cidr: "${IP_ROUTER_LAN}/32"
        - cidr: "194.242.2.0/24" # Mullvad
      toPorts: *dns
    - toEndpoints:
        - matchLabels:
            io.kubernetes.pod.namespace: dns



================================================
FILE: kube/deploy/apps/blocky/app/pg.yaml
================================================
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: "external-secrets-kubernetes-provider"
  namespace: "blocky"
rules:
  - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["*"]
  - apiGroups: ["authorization.k8s.io"]
    resources: ["selfsubjectrulesreviews"]
    verbs: ["create"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: &name "external-secrets-kubernetes-provider"
  namespace: "blocky"
roleRef:
  apiGroup: "rbac.authorization.k8s.io"
  kind: "Role"
  name: *name
subjects:
  - kind: "ServiceAccount"
    name: *name
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: "external-secrets-kubernetes-provider"
  namespace: "blocky"
---
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: "kubernetes-blocky"
  namespace: &ns "blocky"
spec:
  provider:
    kubernetes:
      remoteNamespace: *ns
      server:
        url: "https://kubernetes.default.svc"
        caProvider:
          type: "ConfigMap"
          name: "kube-root-ca.crt"
          key: "ca.crt"
      auth:
        serviceAccount:
          name: "external-secrets-kubernetes-provider"
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/external-secrets.io/externalsecret_v1beta1.json
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: &name "pg-default-pguser-blocky"
  namespace: "blocky"
spec:
  refreshInterval: "1m"
  secretStoreRef:
    kind: "SecretStore"
    name: "kubernetes-blocky"
  target:
    name: "pg-default-pguser-blocky-fixed"
    creationPolicy: "Owner"
    deletionPolicy: "Retain"
    template:
      type: "Opaque"
      data:
        pgbouncer-uri-sslmode: "{{ .uri }}?sslmode=require"
  data:
    - secretKey: "uri"
      remoteRef:
        key: *name
        property: "pgbouncer-uri"



================================================
FILE: kube/deploy/apps/blocky/app/config/config.yaml
================================================
---
upstreams:
  groups:
    default:
      - "${IP_ROUTER_LAN}"
      - &doh https://base.dns.mullvad.net/dns-query
  strategy: strict
  timeout: 2s
bootstrapDns:
  - "tcp+udp:${IP_ROUTER_LAN}"
  - "tcp+udp:${IP_ROUTER_VLAN_K8S}"
  - upstream: *doh
    ips: ["192.242.2.2", "192.242.2.3", "192.242.2.4", "192.242.2.5", "192.242.2.6", "192.242.2.9", "2a07:e340::2", "2a07:e340::3", "2a07:e340::4", "2a07:e340::5", "2a07:e340::6", "2a07:e340::9"]

#customDNS:
#  customTTL: 24h
#  mapping:
#    printer.lan: 192.168.178.3,2001:0db8:85a3:08d3:1319:8a2e:0370:7344

conditional:
  fallbackUpstream: true
  mapping:
    jank.ing: &k8s "${APP_IP_K8S_GATEWAY}"
    ${DNS_SHORT}: *k8s
    ${DNS_MAIN}: *k8s
    ${DNS_ME}: *k8s
    ${DNS_VPN}: https://one.one.one.one/dns-query
    ${DNS_AD}: "${IP_AD_CIDR_PREFIX}1,${IP_AD_CIDR_PREFIX}2"
    ts.net: 100.100.100.100

blocking:
  denylists:
    default: # mostly error free
      - https://big.oisd.nl/domainswild
      - https://v.firebog.net/hosts/AdguardDNS.txt
      - https://urlhaus.abuse.ch/downloads/hostfile
      - https://raw.githubusercontent.com/mullvad/dns-blocklists/main/output/doh/doh_privacy.txt
      - https://raw.githubusercontent.com/durablenapkin/scamblocklist/master/hosts.txt
      - https://raw.githubusercontent.com/hoshsadiq/adblock-nocoin-list/master/hosts.txt
      - https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/pro.txt
      - https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/tif.txt
      - https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/doh.txt # use DoH-only first rather than doh-vpn-proxy-bypass since I do use Mullvad
      - https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/gambling.txt
      - https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/anti.piracy.txt
      - https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/nosafesearch.txt
      - https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/hoster.txt
      - https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/dyndns.txt
      #- https://raw.githubusercontent.com/DandelionSprout/adfilt/master/GameConsoleAdblockList.txt # AGH list
      - https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/SmartTV.txt
      - /secrets/blocklist # mounted from ExternalSecret
      - |
        *.zip
        example.com
    safe:
      - https://nsfw.oisd.nl/domainswild
    extra: # might not be as error free but will definitely block more
      - https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts
      - http://sysctl.org/cameleon/hosts
      - https://adaway.org/hosts.txt
      - https://someonewhocares.org/hosts/zero/hosts
      - https://pgl.yoyo.org/adservers/serverlist.php?hostformat=nohtml&showintro=0&mimetype=plaintext
      # hardcore mode activated
      - https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/ultimate.txt
      - https://raw.githubusercontent.com/badmojr/1Hosts/master/Pro/wildcards.txt
    wifi:
      - | # Linksys home routers/APs be noisy
        heartbeat.belkin.com
        www.belkin.com
        *.belkin.com
        *.root-servers.net
  allowlists:
    extra:
      - /secrets/allowlist # mounted from ExternalSecret
    blackhole: # no `blackhole` entry in blocklists, thus "whitelist mode"
      - |
        *.jank.ing
  # definition: which groups should be applied for which client
  clientGroupsBlock:
    default: [default, nsfw]
    ${IP_JJ_V4}: [default, extra]
    ${IP_WIFI_V4}: [default, nsfw, wifi]
  blockType: zeroIp
  blockTTL: 5m
  loading:
    refreshPeriod: 1h
    downloads:
      cooldown: 10s

clientLookup:
  upstream: ${IP_ROUTER_LAN}
  #clients:
  #  jj: ["${IP_JJ_V4}"]

caching:
  minTime: 1h
  maxTime: 1h
  prefetching: true
  cacheTimeNegative: 1m

prometheus:
  enable: true
  path: /metrics

#queryLog:
#  type: postgresql
#  target: postgres://user:password@db_host_or_ip:5432/db_name
#  logRetentionDays: 7

redis:
  address: blocky-redis.redis.svc.cluster.local

minTlsServeVersion: 1.3

filtering:
  queryTypes: [AAAA]

fqdnOnly:
  enable: false

ports:
  dns: 8053
  http: 8080

log:
  level: info
  format: text
  timestamp: true
  privacy: false

ecs:
  useAsClient: true



================================================
FILE: kube/deploy/apps/blocky/app/config/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
configMapGenerator:
  - name: blocky-config
    namespace: blocky
    files:
      - config.yml=config.yaml
generatorOptions:
  disableNameSuffixHash: true



================================================
FILE: kube/deploy/apps/code-server/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: code-server-app
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "code-server"
    wait.flux.home.arpa/disabled: "true"
    wait.flux.home.arpa/enabled: "false"
spec:
  commonMetadata:
    labels: *l
  path: ./kube/deploy/apps/code-server/app
  targetNamespace: "code-server"
  dependsOn:
    - name: code-server-pvc
  wait: false
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: code-server-pvc
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "code-server"
spec:
  commonMetadata:
    labels: *l
  path: ./kube/deploy/core/storage/volsync/template
  targetNamespace: "code-server"
  dependsOn:
    - name: 1-core-storage-volsync-app
    - name: 1-core-storage-rook-ceph-cluster
  postBuild:
    substitute:
      PVC: "code-server-data"
      SIZE: "50Gi"
      CACHESIZE: "15Gi"
      RGW_CRON: "0 */12 * * *"
      SC: &sc "block"
      SNAP: *sc
      ACCESSMODE: &am "ReadWriteOnce"
      SNAP_ACCESSMODE: *am
      RUID: &uid "1000"
      RGID: *uid
      RFSG: *uid



================================================
FILE: kube/deploy/apps/code-server/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ns.yaml
  - ks.yaml



================================================
FILE: kube/deploy/apps/code-server/ns.yaml
================================================
---
apiVersion: v1
kind: Namespace
metadata:
  name: code-server
  labels:
    kustomize.toolkit.fluxcd.io/prune: disabled
    pod-security.kubernetes.io/enforce: &ps restricted
    pod-security.kubernetes.io/audit: *ps
    pod-security.kubernetes.io/warn: *ps



================================================
FILE: kube/deploy/apps/code-server/app/es.yaml
================================================
---
# yaml-language-server: $schema=https://crds.jank.ing/external-secrets.io/externalsecret_v1beta1.json
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: &name code-server-secrets
  namespace: code-server
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: 1p
  dataFrom:
    - extract:
        key: "Code Server - ${CLUSTER_NAME}"
  target:
    creationPolicy: Owner
    deletionPolicy: Retain
    template:
      mergePolicy: Replace
      engineVersion: v2
      type: Opaque
      data:
        # need that newline, can't figure out how to keep the newline other than YAML block with newline and base64 encoding the key with the newline in it
        ssh-privkey: |
          {{ .sshPrivKeyB64 | b64dec }}
        ssh-pubkey: "{{ .sshPubKey }}"
        age.agekey: "{{ .agekey }}"



================================================
FILE: kube/deploy/apps/code-server/app/hr.yaml
================================================
---
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app code-server
  namespace: *app
spec:
  interval: 5m
  chart:
    spec:
      chart: app-template
      version: "2.6.0"
      sourceRef:
        name: bjw-s
        kind: HelmRepository
        namespace: flux-system
  values:
    controllers:
      main:
        type: deployment
        replicas: 1
        annotations: &anno
          reloader.stakater.com/auto: "false"
          secret.reloader.stakater.com/reload: "code-server-secrets"
        pod:
          labels:
            tailscale.com/expose: "true"
            ingress.home.arpa/jjgadgets: "allow"
            ingress.home.arpa/nginx-internal: "allow"
            egress.home.arpa/apiserver: "allow"
            egress.home.arpa/world: "allow"
            egress.home.arpa/cluster: "allow"
        containers:
          main:
            image:
              repository: "ghcr.io/coder/code-server"
              tag: "4.100.2@sha256:0c31654f1125c3a685a42ed1f2946573f5ebaaf016c5bc0640c72f9f571267e0"
            command: ["dumb-init", "/bin/bash", "-c"]
            args: ["/home/linuxbrew/.linuxbrew/sbin/sshd -p 2222 || true; /usr/bin/code-server --auth none --disable-telemetry --user-data-dir /home/coder/.vscode --extensions-dir /home/coder/.vscode --bind-addr 0.0.0.0:8080 --port 8080 /home/coder"]
            env:
              TZ: "${CONFIG_TZ}"
              SSH_AUTH_SOCK: ""
              SOPS_AGE_KEY:
                valueFrom:
                  secretKeyRef:
                    name: "code-server-secrets"
                    key: "age.agekey"
            securityContext: &sc
              readOnlyRootFilesystem: true
              allowPrivilegeEscalation: false
              capabilities:
                drop: ["ALL"]
            resources:
              requests:
                cpu: "10m"
              limits:
                cpu: "1000m" # I previously had a code-server that would eat cores
                memory: "4Gi"
    service:
      main:
        ports:
          http:
            port: 8080
          hugo:
            port: 1313
          test:
            port: 8081
      ssh:
        enabled: true
        primary: false
        controller: main
        type: LoadBalancer
        externalTrafficPolicy: Cluster
        annotations:
          coredns.io/hostname: "vs-ssh.${DNS_SHORT:=internal}"
          io.cilium/lb-ipam-ips: "${APP_IP_CODE_SERVER_SSH:=127.0.0.1}"
          tailscale.com/expose: "true"
          tailscale.com/hostname: "vs-ssh"
        labels:
          io.cilium/l2: "true"
        ports:
          http:
            enabled: true
            port: 22
            targetPort: 2222
            protocol: TCP
          ssh2:
            port: 22222
    ingress:
      main:
        enabled: true
        primary: true
        className: "nginx-internal"
        annotations:
          nginx.ingress.kubernetes.io/whitelist-source-range: |
            ${IP_JJ_V4}
        hosts:
          - host: &host "vs.${DNS_SHORT:=internal}"
            paths:
              - &path
                path: /
                pathType: Prefix
                service: &http
                  name: main
                  port: http
          - host: &host "hugo.${DNS_SHORT:=internal}"
            paths:
              - <<: *path
                service: &hugo
                  name: main
                  port: hugo
          - host: &host "vs-test.${DNS_SHORT:=internal}"
            paths:
              - <<: *path
                service: &test
                  name: main
                  port: test
        tls:
          - hosts: [*host]
      tailscale:
        enabled: true
        primary: false
        className: "tailscale"
        annotations:
          tailscale.com/tags: "tag:jjgadgets-apps"
        hosts:
          - host: &host "vs.${DNS_TS:=ts.net}"
            paths:
              - <<: *path
                service: *http
              - <<: *path
                path: /hugo
                service: *http
              - <<: *path
                path: /test
                service: *http
        tls:
          - hosts: [*host]
    persistence:
      config:
        enabled: true
        existingClaim: "code-server-data"
        globalMounts:
          - subPath: "data"
            path: "/home/coder"
          - subPath: "ssh"
            path: "/home/coder/.ssh" # override secret mount perms
          - subPath: "nix-var"
            path: "/nix/var"
      misc: # not backed up
        enabled: true
        existingClaim: "code-server-misc"
        globalMounts:
          - subPath: "ignore"
            path: "/home/coder/ignore"
          - subPath: "brew"
            path: "/home/linuxbrew"
          - subPath: "nix"
            path: "/nix/store"
          - subPath: "cache"
            path: "/home/coder/.cache"
          - subPath: "mise"
            path: "/home/coder/.local/share/mise"
          - subPath: "go"
            path: "/home/coder/go"
      secrets:
        enabled: true
        type: secret
        name: "code-server-secrets"
        defaultMode: 0600
        advancedMounts:
          main:
            main:
              - subPath: "ssh-privkey"
                path: "/home/coder/.ssh/id_rsa"
                readOnly: true
              - subPath: "ssh-pubkey"
                path: "/home/coder/.ssh/id_rsa.pub"
                readOnly: true
      talos-admin:
        enabled: true
        type: secret
        name: "talos"
        defaultMode: 0400
        advancedMounts:
          main:
            main:
              - path: "/var/run/secrets/talos.dev"
                readOnly: true
              - path: "/home/coder/.talos"
                readOnly: true
      tmp:
        enabled: true
        type: emptyDir
        medium: Memory
        globalMounts:
          - subPath: "tmp"
            path: "/tmp"
            readOnly: false
    serviceAccount:
      name: "code-server"
      create: true
    defaultPodOptions:
      automountServiceAccountToken: true
      enableServiceLinks: true
      hostname: "${CLUSTER_NAME:=biohazard}-code-server"
      securityContext:
        runAsNonRoot: true
        runAsUser: &uid 1000 # `coder` user
        runAsGroup: *uid
        fsGroup: *uid
        fsGroupChangePolicy: "OnRootMismatch"
        seccompProfile: { type: "RuntimeDefault" }
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: "kubernetes.io/hostname"
          whenUnsatisfiable: "DoNotSchedule"
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: *app
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: "fuckoff.home.arpa/code-server"
                    operator: "DoesNotExist"



================================================
FILE: kube/deploy/apps/code-server/app/pvc.yaml
================================================
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: "code-server-misc"
  namespace: &app "code-server"
  annotations:
    description: "PVC for misc files that don't need to be backed up, like Homebrew or Nix Store."
  labels:
    app.kubernetes.io/name: *app
    snapshot.home.arpa/enabled: "true"
    kustomize.toolkit.fluxcd.io/prune: "Disabled"
spec:
  storageClassName: "block"
  accessModes: ["ReadWriteOnce"]
  resources:
    requests:
      storage: "100Gi"



================================================
FILE: kube/deploy/apps/code-server/app/rbac.yaml
================================================
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: &app code-server
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: *app
    namespace: *app
---
apiVersion: talos.dev/v1alpha1
kind: ServiceAccount
metadata:
  name: talos
spec:
  roles:
    - os:admin



================================================
FILE: kube/deploy/apps/code-server/app/talos-serviceaccount.yaml
================================================
apiVersion: v1
kind: Secret
metadata:
  name: talos
  namespace: code-server
  annotations:
    kustomize.toolkit.fluxcd.io/ssa: Merge
    reloader.stakater.com/match: "false"



================================================
FILE: kube/deploy/apps/cryptpad/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: cryptpad-app
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "cryptpad"
spec:
  commonMetadata:
    labels: *l
  path: ./kube/deploy/apps/cryptpad/app
  targetNamespace: "cryptpad"
  dependsOn:
    - name: cryptpad-pvc
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: cryptpad-pvc
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "cryptpad"
spec:
  commonMetadata:
    labels: *l
  path: ./kube/deploy/core/storage/volsync/template
  targetNamespace: "cryptpad"
  dependsOn:
    - name: 1-core-storage-volsync-app
    - name: 1-core-storage-snapscheduler-app
    - name: 1-core-storage-rook-ceph-cluster
  postBuild:
    substitute:
      PVC: "cryptpad-data"
      SIZE: "50Gi"
      SC: &sc "file"
      SNAP: *sc
      ACCESSMODE: "ReadWriteMany"
      RUID: !!str &uid |
        ${APP_UID_CRYPTPAD}
      RGID: !!str |
        ${APP_UID_CRYPTPAD}
      RFSG: !!str |
        ${APP_UID_CRYPTPAD}



================================================
FILE: kube/deploy/apps/cryptpad/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ns.yaml
  - ks.yaml



================================================
FILE: kube/deploy/apps/cryptpad/ns.yaml
================================================
---
apiVersion: v1
kind: Namespace
metadata:
  name: cryptpad
  labels:
    kustomize.toolkit.fluxcd.io/prune: disabled
    pod-security.kubernetes.io/enforce: &ps restricted
    pod-security.kubernetes.io/audit: *ps
    pod-security.kubernetes.io/warn: *ps



================================================
FILE: kube/deploy/apps/cryptpad/app/es.yaml
================================================
---
# yaml-language-server: $schema=https://crds.jank.ing/external-secrets.io/externalsecret_v1beta1.json
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: &name cryptpad-secrets
  namespace: cryptpad
spec:
  refreshInterval: 1m
  secretStoreRef:
    kind: ClusterSecretStore
    name: 1p
  dataFrom:
    - extract:
        key: "CryptPad - ${CLUSTER_NAME}"
  target:
    creationPolicy: Owner
    deletionPolicy: Retain
    name: *name
    template:
      type: Opaque
      data:
        config.js: |
          module.exports = {
              httpUnsafeOrigin: 'https://{{ .APP_DNS_CRYPTPAD }}',
              httpSafeOrigin: "https://{{ .APP_DNS_CRYPTPAD_SAFE }}",
              httpAddress: '0.0.0.0',
              httpPort: 3000,
              websocketPort: 3003,
              maxWorkers: 3,
              otpSessionExpiration: 7*24, // hours
              enforceMFA: false, // SSO
              logIP: true, // internal use only, so no public IPs logged
              adminKeys: [],
              inactiveTime: 180, // days
              archiveRetentionTime: 30, // days
              maxUploadSize: 100 * 1024 * 1024, // 100MB
              filePath: './datastore/',
              archivePath: './data/archive',
              pinPath: './data/pins',
              taskPath: './data/tasks',
              blockPath: './block',
              blobPath: './blob',
              blobStagingPath: './data/blobstage',
              decreePath: './data/decrees',
              logPath: '', // disable logging to disk
              logToStdout: true,
              logLevel: 'feedback', // feedback + info and below
              logFeedback: true,
              verbose: false,
          };
        sso.js: |
          module.exports = {
              enabled: true,
              enforced: true,
              cpPassword: true,
              forceCpPassword: false,
              list: [
              {
                  name: 'JJGadgets Auth',
                  type: 'oidc',
                  url: 'https://${APP_DNS_AUTHENTIK}/application/o/cryptpad/',
                  client_id: '{{ .AUTHENTIK_CLIENT_ID }}',
                  client_secret: '{{ .AUTHENTIK_CLIENT_SECRET }}',
                  jwt_alg: 'RS256',
                  username_scope: 'profile',
                  username_claim: 'preferred_username',
              }
              ]
          };



================================================
FILE: kube/deploy/apps/cryptpad/app/hr.yaml
================================================
---
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app cryptpad
  namespace: *app
spec:
  interval: 5m
  chart:
    spec:
      chart: app-template
      version: 3.7.3
      sourceRef:
        name: bjw-s
        kind: HelmRepository
        namespace: flux-system
  values:
    controllers:
      cryptpad:
        type: deployment
        replicas: 1
        pod:
          labels:
            ingress.home.arpa/nginx-internal: allow
            authentik.home.arpa/https: allow
            egress.home.arpa/github: allow
        containers:
          main:
            image: &img
              repository: docker.io/cryptpad/cryptpad
              tag: version-2024.6.1@sha256:601a3af0f7837de6683d6c25dca55597b4f2671ac0e9b51e70e5f8fd1c7aa981
            command: ["npm", "start"]
            env: &env
              TZ: "${CONFIG_TZ}"
              GIT_CONFIG_GLOBAL: &gitc "/tmp/.gitconfig"
              GIT_CONFIG_SYSTEM: *gitc
            securityContext: &sc
              readOnlyRootFilesystem: true
              allowPrivilegeEscalation: false
              capabilities:
                drop: ["ALL"]
            resources:
              requests:
                cpu: "10m"
                memory: "128Mi"
              limits:
                cpu: "3000m"
                memory: "6Gi"
            probes:
              liveness:
                enabled: true
              readiness:
                enabled: true
        initContainers:
          01-install-onlyoffice:
            image: *img
            env: *env
            command: ["/cryptpad/install-onlyoffice.sh", "--accept-license", "--trust-repository"]
            securityContext: *sc
          02-install-plugin-sso:
            image: *img
            env:
              # renovate: datasource=github-tags depName=cryptpad/sso
              SSO_VERSION: "0.2.0"
            command: ["/usr/bin/env", "bash", "-c"]
            args:
              - |
                cd /cryptpad/lib/plugins
                git clone --depth 1 --branch $(SSO_VERSION) https://github.com/cryptpad/sso || cd sso; git pull
            securityContext: *sc
          99-npm-build:
            image: *img
            env: *env
            command: ["npm", "run", "build"]
            securityContext: *sc
    service:
      cryptpad:
        controller: cryptpad
        ports:
          http:
            port: 3000
            protocol: HTTP
            appProtocol: http
          ws:
            port: 3003
            protocol: HTTP
            appProtocol: http
    ingress:
      main:
        className: nginx-internal
        hosts:
          - host: &host "${APP_DNS_CRYPTPAD:=cryptpad}"
            paths: &paths
              - path: /
                pathType: Prefix
                service:
                  identifier: cryptpad
                  port: http
              - path: /cryptpad_websocket
                pathType: Prefix
                service:
                  identifier: cryptpad
                  port: ws
          - host: &hostSafe "${APP_DNS_CRYPTPAD_SAFE:=cryptpad}"
            paths: *paths
        tls:
          - hosts: [*host, *hostSafe]
    persistence:
      config:
        type: secret
        name: cryptpad-secrets
        globalMounts:
          - subPath: config.js
            path: /cryptpad/config/config.js
          - subPath: sso.js
            path: /cryptpad/config/sso.js
      data:
        existingClaim: cryptpad-data
        globalMounts:
          - subPath: data
            path: /cryptpad/data
          - subPath: blob
            path: /cryptpad/blob
          - subPath: block
            path: /cryptpad/block
          - subPath: customize
            path: /cryptpad/customize
          - subPath: files
            path: /cryptpad/datastore
          - subPath: plugins
            path: /cryptpad/lib/plugins
          - subPath: onlyoffice-dist
            path: /cryptpad/www/common/onlyoffice/dist
          - subPath: onlyoffice-conf
            path: /cryptpad/onlyoffice-conf
      tmp:
        type: emptyDir
        medium: Memory
        globalMounts:
          - subPath: tmp
            path: /tmp
    defaultPodOptions:
      automountServiceAccountToken: false
      enableServiceLinks: false
      hostAliases:
        - ip: "${APP_IP_AUTHENTIK:=127.0.0.1}"
          hostnames: ["${APP_DNS_AUTHENTIK:=authentik}"]
      securityContext:
        runAsNonRoot: true
        runAsUser: &uid 4001 # upstream `cryptpad` user
        runAsGroup: *uid
        fsGroup: *uid
        fsGroupChangePolicy: Always
        seccompProfile: { type: "RuntimeDefault" }
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: *app
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: fuckoff.home.arpa/cryptpad
                    operator: DoesNotExist



================================================
FILE: kube/deploy/apps/cyberchef/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: cyberchef-app
  namespace: flux-system
spec:
  path: ./kube/deploy/apps/cyberchef/app
  dependsOn:
    - name: 1-core-ingress-nginx-app


================================================
FILE: kube/deploy/apps/cyberchef/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ns.yaml
  - ks.yaml



================================================
FILE: kube/deploy/apps/cyberchef/ns.yaml
================================================
---
apiVersion: v1
kind: Namespace
metadata:
  name: cyberchef



================================================
FILE: kube/deploy/apps/cyberchef/app/hr.yaml
================================================
---
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app cyberchef
  namespace: *app
spec:
  chart:
    spec:
      chart: app-template
      version: 1.5.1
      sourceRef:
        name: bjw-s
        kind: HelmRepository
        namespace: flux-system
  values:
    global:
      fullnameOverride: *app
    automountServiceAccountToken: false
    controller:
      type: deployment
      replicas: 1
    image:
      repository: docker.io/mpepping/cyberchef
      tag: v10.19.4@sha256:91e04eaaa1ba1eac6b8e410d6f7b340e1ea0450d48ccbb52ec67ce6faa3672c5
    podLabels:
      ingress.home.arpa/nginx-internal: "allow"
    env:
      TZ: "${CONFIG_TZ}"
    service:
      main:
        ports:
          http:
            port: 8000
    ingress:
      main:
        enabled: true
        primary: true
        ingressClassName: "nginx-internal"
        hosts:
          - host: &host "${APP_DNS_CYBERCHEF:=cyberchef}"
            paths:
              - path: /
                pathType: Prefix
        tls:
          - hosts:
              - *host
    podSecurityContext:
      runAsUser: &uid ${APP_UID_CYBERCHEF:=1000}
      runAsGroup: *uid
      fsGroup: *uid
      fsGroupChangePolicy: Always
    resources:
      requests:
        cpu: 10m
        memory: 128Mi
      limits:
        memory: 256Mi



================================================
FILE: kube/deploy/apps/davis/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: davis-app
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "davis"
spec:
  commonMetadata:
    labels: *l
  path: ./kube/deploy/apps/davis/app
  dependsOn:
    - name: davis-db
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: davis-db
  namespace: flux-system
  labels: &l
    prune.flux.home.arpa/enabled: "true"
    db.home.arpa/pg: "pg-home"
    app.kubernetes.io/name: "davis"
spec:
  commonMetadata:
    labels: *l
  path: ./kube/deploy/core/db/pg/clusters/template/pguser
  targetNamespace: "pg"
  dependsOn:
    - name: 1-core-db-pg-clusters-home
    - name: 1-core-secrets-es-k8s
  postBuild:
    substitute:
      PG_NAME: "home"
      PG_DB_USER: &app "davis"
      PG_APP_NS: *app



================================================
FILE: kube/deploy/apps/davis/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ns.yaml
  - ks.yaml



================================================
FILE: kube/deploy/apps/davis/ns.yaml
================================================
---
apiVersion: v1
kind: Namespace
metadata:
  name: davis
  labels:
    kustomize.toolkit.fluxcd.io/prune: disabled
    pod-security.kubernetes.io/enforce: &ps restricted
    pod-security.kubernetes.io/audit: *ps
    pod-security.kubernetes.io/warn: *ps



================================================
FILE: kube/deploy/apps/davis/app/authentik.yaml
================================================
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: davis-authentik
  namespace: authentik
spec:
  ingressClassName: "nginx-internal"
  rules:
    - host: &host "${APP_DNS_DAVIS}"
      http:
        paths:
          - pathType: Prefix
            path: "/outpost.goauthentik.io"
            backend:
              service:
                name: authentik
                port:
                  name: http
  tls:
    - hosts:
        - *host



================================================
FILE: kube/deploy/apps/davis/app/es.yaml
================================================
---
# yaml-language-server: $schema=https://crds.jank.ing/external-secrets.io/externalsecret_v1beta1.json
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: &name davis-secrets
  namespace: davis
spec:
  refreshInterval: 1m
  secretStoreRef:
    kind: ClusterSecretStore
    name: 1p
  dataFrom:
    - extract:
        key: "davis - ${CLUSTER_NAME}"
    - find:
        path: "AWS SES - ${CLUSTER_NAME}"
        name:
          regexp: "^SECRET_AWS_SES_*"
  target:
    creationPolicy: Owner
    deletionPolicy: Retain
    name: *name
    template:
      engineVersion: v2
      data:
        APP_SECRET: '{{ .APP_SECRET }}'
        ADMIN_LOGIN: '{{ .username }}'
        ADMIN_PASSWORD: '{{ .password }}'
        MAILER_DSN: 'smtps://{{ .SECRET_AWS_SES_USERNAME }}:{{ .SECRET_AWS_SES_PASSWORD_URLENCODE }}@{{ .SECRET_AWS_SES_HOST }}:465'
        INVITE_FROM_ADDRESS: '{{ .INVITE_FROM_ADDRESS }}'



================================================
FILE: kube/deploy/apps/davis/app/hr.yaml
================================================
---
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app davis
  namespace: *app
spec:
  interval: 5m
  chart:
    spec:
      chart: app-template
      version: "2.6.0"
      sourceRef:
        name: bjw-s
        kind: HelmRepository
        namespace: flux-system
  values:
    controllers:
      main:
        type: deployment
        replicas: 1
        pod:
          labels:
            ingress.home.arpa/nginx-internal: allow
            db.home.arpa/pg: pg-home
            authentik.home.arpa/ldap: allow
        containers:
          main:
            image: &img
              repository: ghcr.io/tchapi/davis
              tag: "4.4.4@sha256:bbdb3a34c87d82b28f1468f8ef1946d5a74f382740eb40b3215685fae26192fa"
            env: &env
              APP_TIMEZONE: "${CONFIG_TZ:=sample}"
              APP_ENV: prod
              DATABASE_DRIVER: postgresql
              DATABASE_URL:
                valueFrom:
                  secretKeyRef:
                    name: pg-home-pguser-davis
                    key: pgbouncer-uri
              WEBDAV_ENABLED: "false"
              CALDAV_ENABLED: "true"
              CARDDAV_ENABLED: "true"
              LOG_FILE_PATH: /tmp/davis.log
              #ADMIN_AUTH_BYPASS: "true" # forward-auth for /dashboard # TODO: fix forward auth for dashboard
              AUTH_METHOD: LDAP
              LDAP_AUTH_URL: "ldaps://${APP_DNS_AUTHENTIK_LDAP}:636"
              LDAP_DN_PATTERN: "cn=%U,ou=users,dc=ldap,dc=goauthentik,dc=io"
              LDAP_MAIL_ATTRIBUTE: mail
              LDAP_AUTH_USER_AUTOCREATE: "true"
              TRUSTED_PROXIES: "${IP_POD_CIDR_V4:=sample},127.0.0.1"
              TRUSTED_HOSTS: "${APP_DNS_DAVIS:=sample}"
            envFrom: &envFrom
              - secretRef:
                  name: davis-secrets
            securityContext: &sc
              readOnlyRootFilesystem: true
              allowPrivilegeEscalation: false
              capabilities:
                drop: ["ALL"]
            resources:
              requests:
                cpu: "5m"
                memory: "128Mi"
              limits:
                cpu: "3000m"
                memory: "6Gi"
          caddy:
            image:
              repository: jank.ing/jjgadgets/caddy-distroless-base
              tag: "2.9.1@sha256:651fac98c1794ce3bd2cef1a7dc3ff3e61157718ce3781aa218b6167cbfb182c"
            args: ["run", "--config", "/config/Caddyfile"]
            securityContext:
              readOnlyRootFilesystem: true
              allowPrivilegeEscalation: false
              capabilities:
                drop: ["ALL"]
                add: ["NET_BIND_SERVICE"]
            resources:
              requests:
                cpu: "5m"
                memory: "128Mi"
              limits:
                cpu: "1000m"
                memory: "512Mi"
        initContainers:
          01-public:
            image: *img
            command: ["/bin/sh", "-c", "cp -r /var/www/davis/public /web"]
            env: *env
            envFrom: *envFrom
            securityContext: *sc
            resources:
              requests:
                cpu: 5m
                memory: 10M
          02-db-migrate:
            image: *img
            command: ["/var/www/davis/bin/console", "doctrine:migrations:migrate", "--no-interaction"]
            env: *env
            envFrom: *envFrom
            securityContext: *sc
            resources:
              requests:
                cpu: 5m
                memory: 10M
    service:
      main:
        ports:
          http:
            port: 8080
    ingress:
      main:
        enabled: true
        primary: true
        className: nginx-internal
        hosts:
          - host: &host "${APP_DNS_DAVIS:=sample}"
            paths: &paths
              - path: /
                pathType: Prefix
                service:
                  name: main
                  port: http
        tls:
          - hosts: [*host]
    persistence:
      config:
        enabled: true
        type: configMap
        name: davis-config
        advancedMounts:
          main:
            caddy:
              - subPath: Caddyfile
                path: /config/Caddyfile
      tmp:
        enabled: true
        type: emptyDir
        medium: Memory
        globalMounts:
          - subPath: tmp
            path: /tmp
        advancedMounts:
          main:
            01-public:
              - path: /web
            caddy: &public
              - subPath: public
                path: /var/www/davis/public
            main: *public
            02-db-migrate: *public
    configMaps:
      config:
        enabled: true
        data:
          Caddyfile: |
            {
              log {
                level info
                output stderr
                format console
              }
              http_port 8080
              https_port 8443
              servers {
                trusted_proxies static ${IP_POD_CIDR_V4}
                trusted_proxies_strict
              }
            }
            ${APP_DNS_DAVIS:=sample}:8080 {
              log
              header -Server
              header -X-Powered-By
              header Referrer-Policy no-referrer-when-downgrade
              header X-Content-Type-Options nosniff
              header Strict-Transport-Security "max-age=15768000;preload"
              redir /.well-known/carddav /dav/ 301
              redir /.well-known/caldav /dav/ 301
              root * /var/www/davis/public
              encode zstd gzip
              php_fastcgi 127.0.0.1:9000 {
                trusted_proxies ${IP_POD_CIDR_V4:=sample}
              }
              file_server {
                hide .git .gitignore
              }
            }

    defaultPodOptions:
      automountServiceAccountToken: false
      enableServiceLinks: false
      securityContext:
        runAsNonRoot: true
        runAsUser: &uid 82 # php-fpm server
        runAsGroup: *uid
        fsGroup: *uid
        fsGroupChangePolicy: Always
        seccompProfile: { type: "RuntimeDefault" }
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: *app
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: fuckoff.home.arpa/davis
                    operator: DoesNotExist



================================================
FILE: kube/deploy/apps/dns/README.org
================================================
This folder will deploy my home DNS infrastructure. The order of DNS servers is as follows:

1. *dnsdist* will be the exposed user-facing DNS server. This routes DNS traffic to specific DNS servers based on certain rules.
2. *CoreDNS* will be the authoritative DNS server for my domains _only within my home_. This will do split DNS in my internal networks for hosts needing hostnames that can be queried via DNS.
3. *Blocky* will block domains matching blocklists, and forward any unblocked and non-authoritative hostnames to Unbound.
4. *Unbound* will recursively resolve public hostnames from well-known root DNS servers located on the Internet.



================================================
FILE: kube/deploy/apps/dns/dnsdist/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: dns-dnsdist-app
  namespace: flux-system
spec:
  path: ./kube/deploy/apps/dns/dnsdist/app
  dependsOn: []


================================================
FILE: kube/deploy/apps/dns/dnsdist/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ks.yaml



================================================
FILE: kube/deploy/apps/dns/dnsdist/app/hr.yaml
================================================
---
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: dnsdist
  namespace: dns
  labels:
    helm.flux.home.arpa/app-template: "true"
spec:
  values:
    controller:
      type: daemonset
    image:
      repository: docker.io/powerdns/dnsdist-17
      tag: 1.7.5
      pullPolicy: IfNotPresent
    # probes:
    #   liveness:
    #     enabled: false
    #   readiness:
    #     enabled: false
    #   startup:
    #     enabled: false
    dnsPolicy: ClusterFirstWithHostNet
    dnsConfig:
      options:
        - name: ndots
          value: "1"
    service:
      main:
        enabled: true
        primary: true
        type: LoadBalancer
        externalTrafficPolicy: Local
        labels:
          exposeSvc: dns
        annotations:
          "io.cilium/lb-ipam-ips": "${IP_LB_DNS}"
        ports:
          http:
            enabled: false
            primary: false
          dns:
            enabled: true
            primary: true
            protocol: UDP
            port: 53
            targetPort: 6953
    persistence:
      config:
        enabled: true
        type: configMap
        name: dnsdist-config
        mountPath: /etc/dnsdist
        readOnly: true
    configMaps:
      config:
        enabled: true
        data:
          dnsdist.conf: |
            -- udp/tcp dns listening
            setLocal("0.0.0.0:6953", {})

            -- OPNsense Unbound
            newServer({
              address = "${IP_ROUTER_LAN}:53",
              pool = "opnsense"
            })

            -- AdGuard Home (for transition)
            newServer({
              address = "${IP_HOME_DNS}:53",
              pool = "agh"
            })

            -- In-cluster k8s-gateway
            newServer({
              address = "${APP_IP_K8S_GATEWAY}:53",
              pool = "k8sgw"
            })

            -- Enable caching
            pc = newPacketCache(10000, {
              maxTTL = 86400,
              minTTL = 0,
              temporaryFailureTTL = 60,
              staleTTL = 60,
              dontAge = false
            })
            getPool(""):setCache(pc)

            -- Routing rules
            addAction('${DNS_MAIN}', PoolAction('opnsense'))
            addAction('${DNS_SHORT}', PoolAction('k8sgw'))
            addAction('10.0.0.0/8', PoolAction('agh'))
            addAction('172.16.0.0/12', PoolAction('agh'))
            addAction('192.168.0.0/16', PoolAction('agh'))
            addAction('100.64.0.0/10', PoolAction('agh'))
    resources:
      requests:
        memory: 100Mi
      limits:
        memory: 300Mi



================================================
FILE: kube/deploy/apps/elk/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: elk-app
  namespace: flux-system
  labels:
    wait.flux.home.arpa/disabled: "true"
spec:
  path: ./kube/deploy/apps/elk/app
  dependsOn:
    - name: 1-core-storage-rook-ceph-cluster
    - name: 1-core-ingress-nginx-app
    - name: 1-core-storage-volsync-app



================================================
FILE: kube/deploy/apps/elk/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ks.yaml



================================================
FILE: kube/deploy/apps/elk/app/hr.yaml
================================================
---
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app elk
  namespace: apps
spec:
  chart:
    spec:
      chart: app-template
      version: 1.5.1
      sourceRef:
        name: bjw-s
        kind: HelmRepository
        namespace: flux-system
  values:
    automountServiceAccountToken: false
    controller:
      type: deployment
      replicas: 1
    image:
      repository: "jank.ing/jjgadgets/elk"
      tag: "0.16.0@sha256:c16ee6249e539bfa4e5a45c27c04b59f9ff46b8d0077f8ce57a7971ad0afe8a6"
    podLabels:
      ingress.home.arpa/nginx-internal: "allow"
      egress.home.arpa/nginx-internal: "allow"
    env:
      TZ: "${CONFIG_TZ}"
      NUXT_PUBLIC_DEFAULT_SERVER: "social.jjgadgets.tech"
      NUXT_PUBLIC_PRIVACY_POLICY_URL: "https://jjgadgets.tech"
      NUXT_PUBLIC_SINGLE_INSTANCE: "true"
    envFrom:
      - secretRef:
          name: "elk-secrets"
    service:
      main:
        ports:
          http:
            port: 5314
    ingress:
      main:
        enabled: true
        primary: true
        ingressClassName: "nginx-internal"
        hosts:
          - host: &host "elk.${DNS_SHORT}"
            paths:
              - path: /
                pathType: Prefix
        tls:
          - hosts:
              - *host
    podSecurityContext:
      runAsUser: &uid 911
      runAsGroup: *uid
      fsGroup: *uid
      fsGroupChangePolicy: Always
    resources:
      requests:
        cpu: 10m
        memory: 128Mi
      limits:
        memory: 512Mi



================================================
FILE: kube/deploy/apps/elk/app/secrets.yaml
================================================
---
apiVersion: v1
kind: Secret
metadata:
  name: "elk-secrets"
  namespace: "apps"
type: Opaque
stringData:
  NUXT_STORAGE_DRIVER: "cloudflare"
  NUXT_CLOUDFLARE_ACCOUNT_ID: "${SECRET_ELK_CF_ID}"
  NUXT_CLOUDFLARE_API_TOKEN: "${SECRET_ELK_CF_TOKEN}"
  NUXT_CLOUDFLARE_NAMESPACE_ID: "${SECRET_ELK_CF_KV_NS}"



================================================
FILE: kube/deploy/apps/excalidraw/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: excalidraw-deps
  namespace: flux-system
spec:
  path: ./kube/deploy/apps/excalidraw/deps
  dependsOn:
    - name: 1-core-tls-cert-manager-config
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: excalidraw-app
  namespace: flux-system
spec:
  path: ./kube/deploy/apps/excalidraw/app
  dependsOn:
    - name: excalidraw-deps
    - name: 1-core-ingress-nginx-app
  healthChecks:
    - name: excalidraw
      namespace: excalidraw
      kind: HelmRelease
      apiVersion: helm.toolkit.fluxcd.io/v2beta1



================================================
FILE: kube/deploy/apps/excalidraw/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ks.yaml



================================================
FILE: kube/deploy/apps/excalidraw/app/hr.yaml
================================================
---
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app excalidraw
  namespace: *app
  labels:
    nginx.ingress.home.arpa/type: auth-external-only
spec:
  chart:
    spec:
      chart: app-template
      version: 1.5.1
      sourceRef:
        kind: HelmRepository
        name: bjw-s
        namespace: flux-system
  values:
    image:
      repository: ghcr.io/onedr0p/excalidraw
      tag: latest@sha256:900526e52e0555a481f1ad944b085a4bd982fa00f1e21d59658a7be4d7131864
    env:
      TZ: "${CONFIG_TZ}"
    service:
      main:
        ports:
          http:
            port: 80
    ingress:
      main:
        enabled: true
        primary: true
        ingressClassName: "nginx-internal"
        annotations:
          external-dns.alpha.kubernetes.io/target: "${IP_EC2_INGRESS}"
          nginx.ingress.kubernetes.io/auth-signin: |-
            https://${APP_DNS_EXCALIDRAW}/outpost.goauthentik.io/start?rd=$escaped_request_uri
        hosts:
          - host: &host "${APP_DNS_EXCALIDRAW}"
            paths:
              - path: /
                pathType: Prefix
        tls:
          - hosts:
              - *host
    resources:
      requests:
        cpu: 10m
        memory: 128Mi
      limits:
        memory: 6000Mi



================================================
FILE: kube/deploy/apps/excalidraw/deps/namespace.yaml
================================================
---
apiVersion: v1
kind: Namespace
metadata:
  name: excalidraw



================================================
FILE: kube/deploy/apps/fava/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: fava-app
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "fava"
spec:
  targetNamespace: "fava"
  commonMetadata:
    labels: *l
  path: ./kube/deploy/apps/fava/app
  components:
    - ../../../core/storage/volsync/component/
    - ../../../core/flux-system/alerts/template/
  dependsOn:
    - name: 1-core-storage-volsync-app
    - name: 1-core-storage-rook-ceph-cluster
  postBuild:
    substitute:
      PVC: "fava-data"
      SIZE: "10Gi"
      SC: &sc "file"
      SNAP: *sc
      ACCESSMODE: "ReadWriteMany"
      SNAP_ACCESSMODE: "ReadOnlyMany"
      RUID: &uid "1000"
      RGID: *uid
      RFSG: *uid



================================================
FILE: kube/deploy/apps/fava/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  # - ns.yaml
  - ks.yaml



================================================
FILE: kube/deploy/apps/fava/app/hr.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/app-template-3.7.1/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app fava
  namespace: *app
spec:
  interval: 5m
  chart:
    spec:
      chart: app-template
      version: 3.7.3
      sourceRef:
        name: bjw-s
        kind: HelmRepository
        namespace: flux-system
  values:
    controllers:
      fava:
        type: deployment
        replicas: 1
        pod:
          labels:
            ingress.home.arpa/nginx-internal: allow
        containers:
          main:
            image: &img
              repository: jank.ing/jjgadgets/fava
              tag: 1.30.2@sha256:fa4a09e99ca0c4cd486e37beac1adf5de8d423d8375b6a93f937a076dac9028b
            env: &env
              TZ: "${CONFIG_TZ}"
            securityContext: &sc
              readOnlyRootFilesystem: true
              allowPrivilegeEscalation: false
              capabilities:
                drop: ["ALL"]
            resources:
              requests:
                cpu: "10m"
                memory: "64Mi"
              limits:
                cpu: "1"
                memory: "512Mi"
            probes:
              liveness:
                enabled: true
              readiness:
                enabled: true
    service:
      fava:
        controller: fava
        ports:
          http:
            port: 5000
            protocol: HTTP
            appProtocol: http
    ingress:
      main:
        className: nginx-internal
        annotations:
          nginx.ingress.kubernetes.io/whitelist-source-range: "${IP_JJ_V4:=127.0.0.1/32}"
        hosts:
          - host: &host "${APP_DNS_FAVA:=fava}"
            paths: &paths
              - path: /
                pathType: Prefix
                service:
                  identifier: fava
                  port: http
        tls:
          - hosts: [*host]
    persistence:
      data:
        existingClaim: fava-data
        globalMounts:
          - subPath: data
            path: /data
    defaultPodOptions:
      automountServiceAccountToken: false
      enableServiceLinks: false
      dnsConfig:
        options:
          - name: ndots
            value: "1"
      hostUsers: false
      securityContext:
        runAsNonRoot: true
        runAsUser: &uid 1000
        runAsGroup: *uid
        fsGroup: *uid
        fsGroupChangePolicy: Always
        seccompProfile: { type: "RuntimeDefault" }
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: fuckoff.home.arpa/fava
                    operator: DoesNotExist



================================================
FILE: kube/deploy/apps/fava/app/ns.yaml
================================================
---
apiVersion: v1
kind: Namespace
metadata:
  name: fava
  labels:
    kustomize.toolkit.fluxcd.io/prune: disabled
    pod-security.kubernetes.io/enforce: &ps restricted
    pod-security.kubernetes.io/audit: *ps
    pod-security.kubernetes.io/warn: *ps



================================================
FILE: kube/deploy/apps/firefly/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: firefly-app
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "firefly"
spec:
  targetNamespace: "firefly"
  commonMetadata:
    labels: *l
  path: ./kube/deploy/apps/firefly/app
  components:
    - ../../../core/storage/volsync/component/
    - ../../../core/flux-system/alerts/template/
  dependsOn:
    - name: 1-core-storage-volsync-app
    - name: 1-core-storage-rook-ceph-cluster
  postBuild:
    substitute:
      PVC: "firefly-data"
      SIZE: "10Gi"
      SC: &sc "file"
      SNAP: *sc
      ACCESSMODE: "ReadWriteMany"
      SNAP_ACCESSMODE: "ReadOnlyMany"
      RUID: &uid "33"
      RGID: *uid
      RFSG: *uid
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: authentik-firefly
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "firefly"
spec:
  targetNamespace: "authentik"
  commonMetadata:
    labels: *l
  path: ./kube/deploy/apps/authentik/forward-auth
  dependsOn: []
  postBuild:
    substitute:
      AUTHENTIK_PROXY_HOST: "${APP_DNS_FIREFLY:=firefly}"



================================================
FILE: kube/deploy/apps/firefly/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  # - ns.yaml
  - ks.yaml



================================================
FILE: kube/deploy/apps/firefly/app/es.yaml
================================================
---
# yaml-language-server: $schema=https://crds.jank.ing/external-secrets.io/externalsecret_v1beta1.json
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: &name firefly-secrets
  namespace: firefly
spec:
  refreshInterval: 1m
  secretStoreRef:
    kind: ClusterSecretStore
    name: 1p
  dataFrom:
    - extract:
        key: "Firefly - ${CLUSTER_NAME}"
  target:
    creationPolicy: Owner
    deletionPolicy: Retain
    name: *name
    # template:
    #   type: Opaque
    #   data:
    #     age.agekey: '{{ .agekey }}'



================================================
FILE: kube/deploy/apps/firefly/app/hr.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/app-template-3.6.1/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app firefly
  namespace: *app
  labels:
    nginx.ingress.home.arpa/type: auth
spec:
  interval: 5m
  chart:
    spec:
      chart: app-template
      version: 3.7.3
      sourceRef:
        name: bjw-s
        kind: HelmRepository
        namespace: flux-system
  values:
    controllers:
      firefly:
        type: deployment
        replicas: 1
        pod:
          labels:
            ingress.home.arpa/nginx-internal: allow
        containers:
          main:
            image: &img
              repository: docker.io/fireflyiii/core
              tag: version-6.2.7@sha256:dc78dac2d3db78665e17c89f5075602ec8f7c84d10610a7888e633b83334a340
            env: &env
              TZ: "${CONFIG_TZ}"
              APP_ENV: "production"
              APP_DEBUG: "false"
              LOG_CHANNEL: "stdout"
              APP_LOG_LEVEL: "notice"
              AUDIT_LOG_LEVEL: "info"
              DEFAULT_LANGUAGE: "en_US"
              DEFAULT_LOCALE: "equal"
              SITE_OWNER: "JJGadgets"
              APP_URL: "https://${APP_DNS_FIREFLY}"
              TRUSTED_PROXIES: "*"
              COOKIE_PATH: "/"
              COOKIE_DOMAIN: "${APP_DNS_FIREFLY}"
              COOKIE_SECURE: "true"
              COOKIE_SAMESITE: "lax"
              DISABLE_FRAME_HEADER: "false" # just to be sure
              DISABLE_CSP_HEADER: "false" # just to be sure
              TRACKER_SITE_ID: "" # just to be sure
              TRACKER_URL: "" # just to be sure
              AUTHENTICATION_GUARD: "remote_user_guard"
              AUTHENTICATION_GUARD_HEADER: "HTTP_X_AUTHENTIK_USERNAME" # disabled username change ability for users
              AUTHENTICATION_GUARD_EMAIL: "HTTP_X_AUTHENTIK_EMAIL" # somehow doesn't work?
              DB_CONNECTION: "sqlite"
              DKR_CHECK_SQLITE: "false" # auto create?
              CACHE_DRIVER: "file"
              SESSION_DRIVER: "file"
              SEND_ERROR_MESSAGE: "true"
              SEND_REPORT_JOURNALS: "false"
              ENABLE_EXCHANGE_RATES: "false"
              # ENABLE_EXTERNAL_RATES: "true"
              ALLOW_WEBHOOKS: "false"
              APP_KEY:
                valueFrom:
                  secretKeyRef:
                    name: firefly-secrets
                    key: APP_KEY
            securityContext: &sc
              # readOnlyRootFilesystem: true # nginx init stuff
              allowPrivilegeEscalation: false
              capabilities:
                drop: ["ALL"]
            resources:
              requests:
                cpu: "10m"
                memory: "100Mi"
              limits:
                cpu: "1"
                memory: "512Mi"
            probes:
              liveness:
                enabled: true
              readiness:
                enabled: true
      data-importer:
        type: deployment
        replicas: 1
        pod:
          labels:
            ingress.home.arpa/nginx-internal: allow
        containers:
          main:
            image:
              repository: docker.io/fireflyiii/data-importer
              tag: version-1.6.1@sha256:40e10f996a7bf72285dd6475c49424a02255fb02437904fe2ee6c44bc07e1bfc
            env:
              TZ: "${CONFIG_TZ}"
              APP_ENV: "production"
              APP_DEBUG: "false"
              LOG_CHANNEL: "stdout"
              FIREFLY_III_URL: http://firefly.firefly.svc.cluster.local:8080
              VANITY_URL: "https://${APP_DNS_FIREFLY}"
              # FIREFLY_III_CLIENT_ID:
              #   valueFrom:
              #     secretKeyRef:
              #       name: firefly-secrets
              #       key: FIREFLY_III_CLIENT_ID
            securityContext: *sc
            resources:
              requests:
                cpu: "10m"
                memory: "100Mi"
              limits:
                cpu: "1"
                memory: "1Gi"
            probes:
              liveness:
                enabled: true
              readiness:
                enabled: true
    service:
      firefly:
        controller: firefly
        ports:
          http:
            port: 8080
            protocol: HTTP
            appProtocol: http
      data-importer:
        controller: data-importer
        ports:
          http:
            port: 8080
            protocol: HTTP
            appProtocol: http
    ingress:
      main:
        className: nginx-internal
        annotations:
          nginx.ingress.kubernetes.io/auth-signin: |-
            https://${APP_DNS_FIREFLY}/outpost.goauthentik.io/start?rd=$escaped_request_uri
        hosts:
          - host: &host "${APP_DNS_FIREFLY:=firefly}"
            paths:
              - &path
                path: /
                pathType: Prefix
                service:
                  identifier: firefly
                  port: http
        tls: &tls
          - hosts: [*host]
      api:
        className: nginx-internal
        hosts:
          - host: "${APP_DNS_FIREFLY:=firefly}"
            paths:
              - <<: *path
                path: /api
        tls: *tls
      data-importer:
        className: nginx-internal
        hosts:
          - host: "${APP_DNS_FIREFLY_DATA_IMPORTER:=firefly-data-importer}"
            paths:
              - path: /
                pathType: Prefix
                service:
                  identifier: data-importer
                  port: http
        tls: *tls
    persistence:
      data:
        existingClaim: firefly-data
        advancedMounts:
          firefly:
            main:
              - subPath: data
                path: /var/www/html/storage
              - subPath: upload
                path: /var/www/html/storage/upload
          data-importer:
            main:
              - subPath: importer
                path: /var/www/html/storage/uploads
    defaultPodOptions:
      automountServiceAccountToken: false
      enableServiceLinks: false
      hostAliases:
        - ip: "${APP_IP_AUTHENTIK:=127.0.0.1}"
          hostnames: ["${APP_DNS_AUTHENTIK:=authentik}"]
      dnsConfig:
        options:
          - name: ndots
            value: "1"
      hostUsers: false
      securityContext:
        runAsNonRoot: true
        runAsUser: &uid 33
        runAsGroup: *uid
        fsGroup: *uid
        fsGroupChangePolicy: Always
        seccompProfile: { type: "RuntimeDefault" }
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: fuckoff.home.arpa/firefly
                    operator: DoesNotExist
    networkpolicies:
      same-ns:
        podSelector: {}
        policyTypes: [Ingress, Egress]
        rules:
          ingress: [from: [{podSelector: {}}]]
          egress: [to: [{podSelector: {}}]]



================================================
FILE: kube/deploy/apps/firefly/app/ns.yaml
================================================
---
apiVersion: v1
kind: Namespace
metadata:
  name: firefly
  labels:
    kustomize.toolkit.fluxcd.io/prune: disabled
    pod-security.kubernetes.io/enforce: &ps restricted
    pod-security.kubernetes.io/audit: *ps
    pod-security.kubernetes.io/warn: *ps



================================================
FILE: kube/deploy/apps/flatnotes/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: flatnotes-app
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "flatnotes"
spec:
  targetNamespace: "flatnotes"
  commonMetadata:
    labels: *l
  path: ./kube/deploy/apps/flatnotes/app
  components:
    - ../../../core/flux-system/alerts/template/
    - ../../../core/storage/volsync/component/
  dependsOn:
    - name: 1-core-storage-volsync-app
    - name: 1-core-storage-rook-ceph-cluster
  postBuild:
    substitute:
      PVC: "flatnotes-data"
      SIZE: "10Gi"
      SC: &sc "file"
      SNAP: *sc
      ACCESSMODE: "ReadWriteMany"
      SNAP_ACCESSMODE: "ReadOnlyMany"
      RUID: &uid "1000"
      RGID: *uid
      RFSG: *uid



================================================
FILE: kube/deploy/apps/flatnotes/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ks.yaml



================================================
FILE: kube/deploy/apps/flatnotes/app/es.yaml
================================================
---
# yaml-language-server: $schema=https://crds.jank.ing/external-secrets.io/externalsecret_v1beta1.json
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: &name flatnotes-secrets
  namespace: flatnotes
spec:
  refreshInterval: 1m
  secretStoreRef:
    kind: ClusterSecretStore
    name: 1p
  dataFrom:
    - extract:
        key: "Flatnotes - ${CLUSTER_NAME}"
  target:
    creationPolicy: Owner
    deletionPolicy: Retain
    name: *name
    template:
      type: Opaque
      data:
        FLATNOTES_USERNAME: '{{ .username }}'
        FLATNOTES_PASSWORD: '{{ .password }}'
        FLATNOTES_TOTP_KEY: '{{ .FLATNOTES_TOTP_KEY }}'
        FLATNOTES_SECRET_KEY: '{{ .FLATNOTES_SECRET_KEY }}' # JWT
        # FLATNOTES_PATH_PREFIX: '/{{ .username }}'
        FLATNOTES_QUICK_ACCESS_TERM: '{{ .FLATNOTES_QUICK_ACCESS_TERM }}'
        FLATNOTES_QUICK_ACCESS_SORT: '{{ .FLATNOTES_QUICK_ACCESS_SORT }}'
        FLATNOTES_QUICK_ACCESS_LIMIT: '{{ .FLATNOTES_QUICK_ACCESS_LIMIT }}'



================================================
FILE: kube/deploy/apps/flatnotes/app/hr.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/app-template-3.6.1/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app flatnotes
  namespace: *app
spec:
  interval: 5m
  chart:
    spec:
      chart: app-template
      version: 3.7.3
      sourceRef:
        name: bjw-s
        kind: HelmRepository
        namespace: flux-system
  values:
    controllers:
      flatnotes:
        type: deployment
        replicas: 1
        strategy: RollingUpdate
        pod:
          labels:
            ingress.home.arpa/nginx-internal: allow
        containers:
          main:
            image: &img
              repository: docker.io/dullage/flatnotes
              tag: v5.5.1@sha256:ddc3aeac47869002b546a500fab2f9e1f43720eb011392b65cf03277f764a661
            env: &env
              TZ: "${CONFIG_TZ}"
              FLATNOTES_PORT: &http 8080
              FLATNOTES_PATH: &pvc /data
              FLATNOTES_AUTH_TYPE: totp
            envFrom: &envFrom
              - secretRef:
                  name: flatnotes-secrets
            securityContext: &sc
              # readOnlyRootFilesystem: true # init changes href in index.html
              allowPrivilegeEscalation: false
              capabilities:
                drop: ["ALL"]
            resources:
              requests:
                cpu: "10m"
              limits:
                cpu: "1"
                memory: "512Mi"
            probes:
              liveness:
                enabled: true
              readiness:
                enabled: true
    service:
      flatnotes:
        controller: flatnotes
        ports:
          http:
            port: *http
            protocol: HTTP
            appProtocol: http
    ingress:
      main:
        className: nginx-internal
        annotations:
          nginx.ingress.kubernetes.io/whitelist-source-range: "${IP_JJ_V4:=127.0.0.1/32}"
        hosts:
          - host: &host "${APP_DNS_FLATNOTES:=flatnotes}"
            paths: &paths
              - path: /
                pathType: Prefix
                service:
                  identifier: flatnotes
                  port: http
        tls:
          - hosts: [*host]
    persistence:
      data:
        existingClaim: flatnotes-data
        globalMounts:
          - subPath: data
            path: *pvc
      index:
        existingClaim: flatnotes-misc
        globalMounts:
          - subPath: index
            path: /data/.flatnotes
    defaultPodOptions:
      automountServiceAccountToken: false
      enableServiceLinks: false
      dnsConfig:
        options:
          - name: ndots
            value: "1"
      hostUsers: false
      securityContext:
        runAsNonRoot: true
        runAsUser: &uid 1000
        runAsGroup: *uid
        fsGroup: *uid
        fsGroupChangePolicy: Always
        seccompProfile: { type: "RuntimeDefault" }
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: *app
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: fuckoff.home.arpa/flatnotes
                    operator: DoesNotExist



================================================
FILE: kube/deploy/apps/flatnotes/app/ns.yaml
================================================
---
apiVersion: v1
kind: Namespace
metadata:
  name: flatnotes
  labels:
    kustomize.toolkit.fluxcd.io/prune: disabled
    pod-security.kubernetes.io/enforce: &ps restricted
    pod-security.kubernetes.io/audit: *ps
    pod-security.kubernetes.io/warn: *ps



================================================
FILE: kube/deploy/apps/flatnotes/app/pvc.yaml
================================================
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: "flatnotes-misc"
  namespace: &app "flatnotes"
  annotations:
    description: "PVC for Flatnotes search index."
  labels:
    app.kubernetes.io/name: *app
spec:
  storageClassName: "file-ec-2-1"
  accessModes: ["ReadWriteMany"]
  resources:
    requests:
      storage: "10Gi"



================================================
FILE: kube/deploy/apps/fortidynasync/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: fortidynasync-app
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "fortidynasync"
spec:
  targetNamespace: "fortidynasync"
  commonMetadata:
    labels: *l
  path: ./kube/deploy/apps/fortidynasync/app
  dependsOn: []
  components:
    - ../../../core/flux-system/alerts/template/



================================================
FILE: kube/deploy/apps/fortidynasync/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ns.yaml
  - ks.yaml



================================================
FILE: kube/deploy/apps/fortidynasync/ns.yaml
================================================
---
apiVersion: v1
kind: Namespace
metadata:
  name: fortidynasync
  labels:
    kustomize.toolkit.fluxcd.io/prune: disabled
    pod-security.kubernetes.io/enforce: &ps restricted
    pod-security.kubernetes.io/audit: *ps
    pod-security.kubernetes.io/warn: *ps



================================================
FILE: kube/deploy/apps/fortidynasync/app/es.yaml
================================================
---
# yaml-language-server: $schema=https://crds.jank.ing/external-secrets.io/externalsecret_v1beta1.json
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: &name fortidynasync-secrets
  namespace: fortidynasync
spec:
  refreshInterval: 1m
  secretStoreRef:
    kind: ClusterSecretStore
    name: 1p
  dataFrom:
    - extract:
        key: "FortiDynaSync - ${CLUSTER_NAME}"
  target:
    creationPolicy: Owner
    deletionPolicy: Retain
    name: *name
    # template:
    #   type: Opaque
    #   data:
    #     age.agekey: '{{ .agekey }}'



================================================
FILE: kube/deploy/apps/fortidynasync/app/hr.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/app-template-3.6.1/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app fortidynasync
  namespace: *app
spec:
  interval: 5m
  chart:
    spec:
      chart: app-template
      version: 3.7.3
      sourceRef:
        name: bjw-s
        kind: HelmRepository
        namespace: flux-system
  values:
    controllers:
      fortidynasync:
        type: cronjob
        cronjob:
          schedule: "@hourly"
        pod:
          labels:
            egress.home.arpa/router: "allow"
        containers:
          main:
            image: &img
              repository: ghcr.io/jjgadgets/fortidynasync
              tag: 0.0.1@sha256:96720b95efb82da4eabd1375061a28588fe0c9c60852c0946e585398b5715b95
            env: &env
              TZ: "${CONFIG_TZ}"
            envFrom: &envFrom
              - secretRef:
                  name: fortidynasync-secrets
            securityContext: &sc
              readOnlyRootFilesystem: true
              allowPrivilegeEscalation: false
              capabilities:
                drop: ["ALL"]
            resources:
              requests:
                cpu: "10m"
              limits:
                cpu: "1"
                memory: "128Mi"
    defaultPodOptions:
      automountServiceAccountToken: false
      enableServiceLinks: false
      dnsConfig:
        options:
          - name: ndots
            value: "1"
      hostUsers: false
      securityContext:
        runAsNonRoot: true
        runAsUser: &uid 1000
        runAsGroup: *uid
        fsGroup: *uid
        fsGroupChangePolicy: Always
        seccompProfile: { type: "RuntimeDefault" }
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: fuckoff.home.arpa/fortidynasync
                    operator: DoesNotExist



================================================
FILE: kube/deploy/apps/go-discord-modtools/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: go-discord-modtools-app
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "go-discord-modtools"
spec:
  commonMetadata:
    labels: *l
  path: ./kube/deploy/apps/go-discord-modtools/app
  targetNamespace: "go-discord-modtools"
  dependsOn:
    - name: go-discord-modtools-pvc
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: go-discord-modtools-pvc
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "go-discord-modtools"
spec:
  commonMetadata:
    labels: *l
  path: ./kube/deploy/core/storage/volsync/template
  targetNamespace: "go-discord-modtools"
  dependsOn:
    - name: 1-core-storage-volsync-app
    - name: 1-core-storage-snapscheduler-app
    - name: 1-core-storage-rook-ceph-cluster
  postBuild:
    substitute:
      PVC: "go-discord-modtools-data"
      SIZE: "2Gi"
      SC: &sc "file"
      SNAP: *sc
      ACCESSMODE: "ReadWriteMany"
      RUID: !!str &uid |
        ${APP_UID_GO_DISCORD_MODTOOLS:=1000}
      RGID: !!str |
        ${APP_UID_GO_DISCORD_MODTOOLS:=1000}
      RFSG: !!str |
        ${APP_UID_GO_DISCORD_MODTOOLS:=1000}



================================================
FILE: kube/deploy/apps/go-discord-modtools/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ns.yaml
  - ks.yaml



================================================
FILE: kube/deploy/apps/go-discord-modtools/ns.yaml
================================================
---
apiVersion: v1
kind: Namespace
metadata:
  name: go-discord-modtools
  labels:
    kustomize.toolkit.fluxcd.io/prune: disabled
    pod-security.kubernetes.io/enforce: &ps restricted
    pod-security.kubernetes.io/audit: *ps
    pod-security.kubernetes.io/warn: *ps



================================================
FILE: kube/deploy/apps/go-discord-modtools/app/es.yaml
================================================
---
# yaml-language-server: $schema=https://crds.jank.ing/external-secrets.io/externalsecret_v1beta1.json
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: &name go-discord-modtools-secrets
  namespace: go-discord-modtools
spec:
  refreshInterval: 1m
  secretStoreRef:
    kind: ClusterSecretStore
    name: 1p
  dataFrom:
    - extract:
        key: "go-discord-modtools - ${CLUSTER_NAME}"
  target:
    creationPolicy: Owner
    deletionPolicy: Retain
    name: *name
    # template:
    #   type: Opaque
    #   data:
    #     age.agekey: '{{ .agekey }}'


================================================
FILE: kube/deploy/apps/go-discord-modtools/app/hr.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/common-3.4.0/charts/other/app-template/schemas/helmrelease-helm-v2beta2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app go-discord-modtools
  namespace: *app
spec:
  interval: 5m
  chart:
    spec:
      chart: app-template
      version: 3.7.3
      sourceRef:
        name: bjw-s
        kind: HelmRepository
        namespace: flux-system
  values:
    controllers:
      go-discord-modtools:
        # type: statefulset
        type: deployment
        replicas: 1
        pod:
          labels:
            egress.home.arpa/discord: "allow"
        containers:
          main:
            image: &img
              repository: "ghcr.io/tyzbit/go-discord-modtools"
              tag: "v0.3.0@sha256:cff0e5d3b835f0701557ca239df642fa44a1ac207dc27c6d25b0dac689591f39"
            env: &env
              TZ: "${CONFIG_TZ}"
            envFrom: &envFrom
              - secretRef:
                  name: go-discord-modtools-secrets
            securityContext: &sc
              readOnlyRootFilesystem: true
              allowPrivilegeEscalation: false
              capabilities:
                drop: ["ALL"]
            resources:
              requests:
                cpu: "50m"
              limits:
                memory: "512Mi"
            probes:
              liveness:
                enabled: true
              readiness:
                enabled: true
    service:
      go-discord-modtools:
        controller: go-discord-modtools
        ports:
          http:
            port: 8080
            protocol: HTTP
            appProtocol: http
    persistence:
      data:
        existingClaim: go-discord-modtools-data
        globalMounts:
          - subPath: data
            path: /var/go-discord-modtools
    defaultPodOptions:
      automountServiceAccountToken: false
      enableServiceLinks: false
      hostAliases:
        - ip: "${APP_IP_AUTHENTIK:=127.0.0.1}"
          hostnames: ["${APP_DNS_AUTHENTIK:=authentik}"]
      securityContext:
        runAsNonRoot: true
        runAsUser: &uid ${APP_UID_GO_DISCORD_MODTOOLS:=1000}
        runAsGroup: *uid
        fsGroup: *uid
        fsGroupChangePolicy: Always
        seccompProfile: { type: "RuntimeDefault" }
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: *app
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: fuckoff.home.arpa/go-discord-modtools
                    operator: DoesNotExist



================================================
FILE: kube/deploy/apps/goatcounter/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: goatcounter-app
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "goatcounter"
spec:
  commonMetadata:
    labels: *l
  path: ./kube/deploy/apps/goatcounter/app
  targetNamespace: "goatcounter"
  dependsOn:
    - name: goatcounter-pvc
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: goatcounter-pvc
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "goatcounter"
spec:
  commonMetadata:
    labels: *l
  path: ./kube/deploy/core/storage/volsync/template
  targetNamespace: "goatcounter"
  dependsOn:
    - name: 1-core-storage-volsync-app
    - name: 1-core-storage-rook-ceph-cluster
  postBuild:
    substitute:
      PVC: "goatcounter-data"
      SIZE: "10Gi"
      SC: &sc "file"
      SNAP: *sc
      ACCESSMODE: "ReadWriteMany"
      RUID: !!str &uid |
        ${APP_UID_GOATCOUNTER}
      RGID: !!str |
        ${APP_UID_GOATCOUNTER}
      RFSG: !!str |
        ${APP_UID_GOATCOUNTER}



================================================
FILE: kube/deploy/apps/goatcounter/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ns.yaml
  - ks.yaml



================================================
FILE: kube/deploy/apps/goatcounter/ns.yaml
================================================
---
apiVersion: v1
kind: Namespace
metadata:
  name: goatcounter
  labels:
    kustomize.toolkit.fluxcd.io/prune: disabled
    pod-security.kubernetes.io/enforce: &ps restricted
    pod-security.kubernetes.io/audit: *ps
    pod-security.kubernetes.io/warn: *ps



================================================
FILE: kube/deploy/apps/goatcounter/app/es.yaml
================================================
---
# yaml-language-server: $schema=https://crds.jank.ing/external-secrets.io/externalsecret_v1beta1.json
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: &name goatcounter-secrets
  namespace: goatcounter
spec:
  refreshInterval: 1m
  secretStoreRef:
    kind: ClusterSecretStore
    name: 1p
  dataFrom:
    - extract:
        key: "goatcounter - ${CLUSTER_NAME}"
  target:
    creationPolicy: Owner
    deletionPolicy: Retain
    name: *name



================================================
FILE: kube/deploy/apps/goatcounter/app/hr.yaml
================================================
---
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app goatcounter
  namespace: *app
spec:
  interval: 5m
  chart:
    spec:
      chart: app-template
      version: "2.6.0"
      sourceRef:
        name: bjw-s
        kind: HelmRepository
        namespace: flux-system
  values:
    controllers:
      main:
        type: deployment
        replicas: 1
        pod:
          labels:
            ingress.home.arpa/nginx-internal: allow
            ingress.home.arpa/nginx-public: allow
        containers:
          main:
            image: &img
              repository: ghcr.io/jjgadgets/goatcounter
              tag: 2.5.0
            # runtime config already in image CMD as command args, not using PG because I don't really care about this data or having stuck PVC attachments
            env:
              TZ: "${CONFIG_TZ}"
            #envFrom:
            #  - secretRef:
            #      name: goatcounter-secrets
            securityContext: &sc
              readOnlyRootFilesystem: true
              allowPrivilegeEscalation: false
              capabilities:
                drop: ["ALL"]
            resources:
              requests:
                cpu: "10m"
                memory: "128Mi"
              limits:
                cpu: "3000m"
                memory: "1Gi"
    service:
      main:
        ports:
          http:
            port: 8080
    ingress:
      main:
        enabled: true
        primary: true
        className: nginx-public
        annotations:
          external-dns.alpha.kubernetes.io/target: "${DNS_CF:=cf}"
          external-dns.alpha.kubernetes.io/cloudflare-proxied: "true"
        hosts:
          - host: &host "goat-counter-privacy-respecting-tracking.jjgadgets.tech"
            paths: &paths
              - path: /
                pathType: Prefix
                service:
                  name: main
                  port: http
        tls:
          - hosts: [*host]
      short:
        enabled: true
        primary: false
        className: nginx-internal
        hosts:
          - host: &host "${APP_DNS_GOATCOUNTER:=goatcounter}"
            paths: *paths
        tls:
          - hosts: [*host]
    persistence:
      config:
        enabled: false
      data:
        enabled: true
        existingClaim: goatcounter-data
        globalMounts:
          - subPath: data
            path: /data
      tmp:
        enabled: true
        type: emptyDir
        medium: Memory
        globalMounts:
          - subPath: tmp
            path: /tmp
            readOnly: false
    defaultPodOptions:
      automountServiceAccountToken: false
      enableServiceLinks: false
      securityContext:
        runAsNonRoot: true
        runAsUser: &uid ${APP_UID_GOATCOUNTER:=1000}
        runAsGroup: *uid
        fsGroup: *uid
        fsGroupChangePolicy: Always
        seccompProfile: { type: "RuntimeDefault" }
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: *app
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: fuckoff.home.arpa/goatcounter
                    operator: DoesNotExist



================================================
FILE: kube/deploy/apps/gokapi/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: gokapi-app
  namespace: flux-system
spec:
  path: ./kube/deploy/apps/gokapi/app
  dependsOn:
    - name: 1-core-ingress-nginx-app
    - name: 1-core-storage-rook-ceph-cluster


================================================
FILE: kube/deploy/apps/gokapi/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ns.yaml
  - ks.yaml



================================================
FILE: kube/deploy/apps/gokapi/ns.yaml
================================================
---
apiVersion: v1
kind: Namespace
metadata:
  name: gokapi



================================================
FILE: kube/deploy/apps/gokapi/app/hr.yaml
================================================
---
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: gokapi
  namespace: gokapi
spec:
  chart:
    spec:
      chart: app-template
      version: 1.5.1
      sourceRef:
        name: bjw-s
        kind: HelmRepository
        namespace: flux-system
  values:
    controller:
      strategy: RollingUpdate
    image:
      repository: docker.io/f0rc3/gokapi
      tag: v1.9.6@sha256:ae9094a0ead891eef80499a072e680734bcb34892242f0e232223c65eb4c3af8
    service:
      main:
        ports:
          http:
            port: 53842
    env:
      GOKAPI_MAX_MEMORY_UPLOAD: "128"
      GOKAPI_PORT: 53842
    ingress:
      main:
        enabled: true
        ingressClassName: "nginx-external"
        hosts:
          - host: &host "${APP_DNS_GOKAPI:=gokapi}"
            paths:
            - path: /
              pathType: Prefix
        tls:
          - hosts: [*host]
            secretName: long-domain-tls
    persistence:
      config:
        enabled: true
        type: pvc
        mountPath: /app/config
        readOnly: false
        accessMode: ReadWriteOnce
        size: 1Gi
        storageClass: block
        retain: true



================================================
FILE: kube/deploy/apps/gokapi/app/netpol.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/cilium.io/ciliumnetworkpolicy_v2.json
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: &app gokapi
  namespace: *app
spec:
  endpointSelector: {}
  ingress:
    # same namespace
    - fromEndpoints:
        - matchLabels:
            io.kubernetes.pod.namespace: *app
    # ingress controller
    - fromEndpoints:
        - matchLabels:
            io.kubernetes.pod.namespace: ingress
            app.kubernetes.io/instance: ingress-nginx
            app.kubernetes.io/name: ingress-nginx
      toPorts:
        - ports:
            - port: "53842"
  egress:
    # same namespace
    - toEndpoints:
        - matchLabels:
            io.kubernetes.pod.namespace: *app
    # allow traffic to Authentik for OIDC
    - toFQDNs:
        - matchName: "${APP_DNS_AUTH}"
      toPorts:
        - ports:
            - port: "443"



================================================
FILE: kube/deploy/apps/gotosocial/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: gotosocial-app
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "gotosocial"
spec:
  commonMetadata:
    labels: *l
  path: ./kube/deploy/apps/gotosocial/app
  targetNamespace: "gotosocial"
  dependsOn:
    - name: gotosocial-db
    - name: gotosocial-pvc
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: gotosocial-pvc
  namespace: flux-system
  labels: &l
    app.kubernetes.io/name: "gotosocial"
spec:
  commonMetadata:
    labels: *l
  path: ./kube/deploy/core/storage/volsync/template
  targetNamespace: "gotosocial"
  dependsOn:
    - name: 1-core-storage-volsync-app
    - name: 1-core-storage-rook-ceph-cluster
  postBuild:
    substitute:
      PVC: "gotosocial-data"
      SIZE: "50Gi"
      SC: &sc "file"
      SNAP: *sc
      ACCESSMODE: "ReadWriteMany"
      RUID: "568"
      RGID: "568"
      RFSG: "568"
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: gotosocial-db
  na