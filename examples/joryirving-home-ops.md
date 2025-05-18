Directory structure:
└── joryirving-home-ops/
    ├── README.md
    ├── LICENSE
    ├── Taskfile.yaml
    ├── .editorconfig
    ├── .minijinja.toml
    ├── .mise.toml
    ├── .renovaterc.json5
    ├── .sops.yaml
    ├── bootstrap/
    │   ├── helmfile.yaml
    │   └── resources.yaml.j2
    ├── docs/
    │   └── src/
    │       ├── introduction.md
    │       ├── SUMMARY.md
    │       ├── assets/
    │       │   ├── bgp.conf
    │       │   ├── icons/
    │       │   ├── server-nut/
    │       │   │   ├── nut.conf
    │       │   │   ├── ups.conf
    │       │   │   ├── ups_shutdown.sh
    │       │   │   ├── upsd.conf
    │       │   │   ├── upsd.users
    │       │   │   └── upsmon.conf
    │       │   └── utility-nut/
    │       │       ├── nut.conf
    │       │       ├── ups.conf
    │       │       ├── upsd.conf
    │       │       ├── upsd.users
    │       │       └── upsmon.conf
    │       └── notes/
    │           ├── certs.md
    │           ├── pikvm.md
    │           └── rpi-nut.md
    ├── hack/
    │   ├── cert-extract.sh
    │   ├── delete-stuck-ns.sh
    │   ├── nas-restart.sh
    │   ├── node-labels.sh
    │   └── restart-all-pods.sh
    ├── kubernetes/
    │   ├── apps/
    │   │   ├── base/
    │   │   │   ├── actions-runner-system/
    │   │   │   │   └── actions-runner-controller/
    │   │   │   │       ├── app/
    │   │   │   │       │   ├── helmrelease.yaml
    │   │   │   │       │   └── kustomization.yaml
    │   │   │   │       └── runners/
    │   │   │   │           ├── externalsecret.yaml
    │   │   │   │           ├── helmrelease.yaml
    │   │   │   │           ├── kustomization.yaml
    │   │   │   │           └── rbac.yaml
    │   │   │   ├── cert-manager/
    │   │   │   │   └── cert-manager/
    │   │   │   │       ├── clusterissuer.yaml
    │   │   │   │       ├── externalsecret.yaml
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       ├── prometheusrule.yaml
    │   │   │   │       └── helm/
    │   │   │   │           ├── kustomizeconfig.yaml
    │   │   │   │           └── values.yaml
    │   │   │   ├── database/
    │   │   │   │   ├── crunchy-postgres/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   └── dragonfly/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       └── rbac.yaml
    │   │   │   ├── downloads/
    │   │   │   │   ├── bazarr/
    │   │   │   │   │   ├── app/
    │   │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   │   └── resources/
    │   │   │   │   │   │       └── subcleaner.sh
    │   │   │   │   │   └── whisper/
    │   │   │   │   │       ├── helmrelease.yaml
    │   │   │   │   │       ├── kustomization.yaml
    │   │   │   │   │       └── pvc.yaml
    │   │   │   │   ├── dashbrr/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── rbac.yaml
    │   │   │   │   │   └── resources/
    │   │   │   │   │       └── config.toml
    │   │   │   │   ├── flaresolverr/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── kapowarr/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── metube/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── mylar/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── prowlarr/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── qbittorrent/
    │   │   │   │   │   ├── app/
    │   │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   │   └── tools/
    │   │   │   │   │       ├── helmrelease.yaml
    │   │   │   │   │       └── kustomization.yaml
    │   │   │   │   ├── radarr/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── pvc.yaml
    │   │   │   │   ├── readarr/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── pvc.yaml
    │   │   │   │   ├── recyclarr/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── config/
    │   │   │   │   │       └── recyclarr.yml
    │   │   │   │   ├── sabnzbd/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── sonarr/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── pvc.yaml
    │   │   │   │   └── webhook/
    │   │   │   │       ├── externalsecret.yaml
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       └── resources/
    │   │   │   │           ├── hooks.yaml
    │   │   │   │           ├── sonarr-refresh-series.sh
    │   │   │   │           └── sonarr-tag-codecs.sh
    │   │   │   ├── external-secrets/
    │   │   │   │   ├── README.md
    │   │   │   │   ├── clustersecretstore.yaml
    │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── helm/
    │   │   │   │       ├── kustomizeconfig.yaml
    │   │   │   │       └── values.yaml
    │   │   │   ├── flux-system/
    │   │   │   │   ├── addons/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── httproute.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── receiver.yaml
    │   │   │   │   ├── flux-operator/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── helm/
    │   │   │   │   │       ├── kustomizeconfig.yaml
    │   │   │   │   │       └── values.yaml
    │   │   │   │   ├── headlamp/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── httproute.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── pushsecret.yaml
    │   │   │   │   │   └── rbac.yaml
    │   │   │   │   └── tofu-controller/
    │   │   │   │       ├── controller/
    │   │   │   │       │   ├── externalsecret.yaml
    │   │   │   │       │   ├── helmrelease.yaml
    │   │   │   │       │   └── kustomization.yaml
    │   │   │   │       └── terraform/
    │   │   │   │           ├── authentik.yaml
    │   │   │   │           ├── kustomization.yaml
    │   │   │   │           ├── minio.yaml
    │   │   │   │           └── ocirepository.yaml
    │   │   │   ├── games/
    │   │   │   │   ├── core-keeper/
    │   │   │   │   │   ├── dnsendpoint.yaml
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── pvc.yaml
    │   │   │   │   ├── minecraft/
    │   │   │   │   │   ├── create/
    │   │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   │   ├── mc-router/
    │   │   │   │   │   │   ├── dnsendpoint.yaml
    │   │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   │   ├── takocraft/
    │   │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   │   └── vibecraft/
    │   │   │   │   │       ├── externalsecret.yaml
    │   │   │   │   │       ├── helmrelease.yaml
    │   │   │   │   │       └── kustomization.yaml
    │   │   │   │   ├── palworld/
    │   │   │   │   │   ├── dnsendpoint.yaml
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── pvc.yaml
    │   │   │   │   └── vrising/
    │   │   │   │       ├── dnsendpoint.yaml
    │   │   │   │       ├── externalsecret.yaml
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       ├── pvc.yaml
    │   │   │   │       └── ServerHostSettings.json
    │   │   │   ├── home-automation/
    │   │   │   │   ├── home-assistant/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── mosquitto/
    │   │   │   │   │   ├── claim.yaml
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── config/
    │   │   │   │   │   │   └── mosquitto.conf
    │   │   │   │   │   └── patches/
    │   │   │   │   │       └── kustomizeconfig.yaml
    │   │   │   │   ├── rtlamr2mqtt/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   └── zigbee/
    │   │   │   │       ├── externalsecret.yaml
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── kube-system/
    │   │   │   │   ├── cilium/
    │   │   │   │   │   ├── README.md
    │   │   │   │   │   ├── app/
    │   │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   │   └── helm/
    │   │   │   │   │   │       ├── kustomizeconfig.yaml
    │   │   │   │   │   │       └── values.yaml
    │   │   │   │   │   └── gateway/
    │   │   │   │   │       ├── certificate.yaml
    │   │   │   │   │       ├── crds.yaml
    │   │   │   │   │       ├── external.yaml
    │   │   │   │   │       ├── internal.yaml
    │   │   │   │   │       ├── kustomization.yaml
    │   │   │   │   │       ├── pushsecret.yaml
    │   │   │   │   │       └── redirect.yaml
    │   │   │   │   ├── coredns/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── helm/
    │   │   │   │   │       ├── kustomizeconfig.yaml
    │   │   │   │   │       └── values.yaml
    │   │   │   │   ├── irqbalance/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   └── metrics-server/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── kube-tools/
    │   │   │   │   ├── descheduler/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── fstrim/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── intel-device-plugins/
    │   │   │   │   │   ├── gpu/
    │   │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   │   └── nodefeaturerule.yaml
    │   │   │   │   │   └── operator/
    │   │   │   │   │       ├── helmrelease.yaml
    │   │   │   │   │       └── kustomization.yaml
    │   │   │   │   ├── reloader/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── spegel/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   └── system-upgrade-controller/
    │   │   │   │       ├── kustomizeconfig.yaml
    │   │   │   │       ├── versions.env
    │   │   │   │       ├── app/
    │   │   │   │       │   ├── helmrelease.yaml
    │   │   │   │       │   ├── kustomization.yaml
    │   │   │   │       │   └── rbac.yaml
    │   │   │   │       └── plans/
    │   │   │   │           ├── kubernetes.yaml
    │   │   │   │           ├── kustomization.yaml
    │   │   │   │           └── talos.yaml
    │   │   │   ├── llm/
    │   │   │   │   ├── ollama/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── pvc.yaml
    │   │   │   │   ├── open-webui/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   └── searxng/
    │   │   │   │       ├── externalsecret.yaml
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       └── resources/
    │   │   │   │           ├── limiter.toml
    │   │   │   │           └── settings.yml
    │   │   │   ├── media/
    │   │   │   │   ├── ersatztv/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── jellyseerr/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── pvc.yaml
    │   │   │   │   ├── kavita/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── komga/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── kyoo/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── httproute.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── maintainerr/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── plex/
    │   │   │   │   │   ├── app/
    │   │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   │   └── pvc.yaml
    │   │   │   │   │   ├── kometa/
    │   │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   │   ├── configs/
    │   │   │   │   │   │   │   ├── config.yml
    │   │   │   │   │   │   │   └── Pre-rolls.yml
    │   │   │   │   │   │   └── custom/
    │   │   │   │   │   │       ├── Anime - Overlays - Charts.yml
    │   │   │   │   │   │       ├── Anime.yml
    │   │   │   │   │   │       ├── Movies - Holidays by Drazzizzi.yml
    │   │   │   │   │   │       ├── Movies - Overlays - Charts.yml
    │   │   │   │   │   │       ├── Movies - Overlays - Oscars.yml
    │   │   │   │   │   │       ├── Movies - Overlays - Ratings.yml
    │   │   │   │   │   │       ├── Movies - Overlays - Stand-up.yml
    │   │   │   │   │   │       ├── Movies - Overlays - Streaming Services.yml
    │   │   │   │   │   │       ├── Movies - Overlays - Studios.yml
    │   │   │   │   │   │       ├── Movies - Trakt (Unplayed) by Magic815.yml
    │   │   │   │   │   │       ├── Movies.yml
    │   │   │   │   │   │       ├── TV Shows - Overlays - Charts.yml
    │   │   │   │   │   │       ├── TV Shows - Overlays - Networks.yml
    │   │   │   │   │   │       ├── TV Shows - Overlays - Ratings.yml
    │   │   │   │   │   │       ├── TV Shows - Overlays - Statuses.yml
    │   │   │   │   │   │       ├── TV Shows - Overlays - Streaming Services.yml
    │   │   │   │   │   │       ├── TV Shows - Overlays - Studios.yml
    │   │   │   │   │   │       ├── TV Shows - Overlays.yml
    │   │   │   │   │   │       └── TV Shows.yml
    │   │   │   │   │   ├── movie-roulette/
    │   │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   │   ├── plex-auto-languages/
    │   │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   │   ├── plex-image-cleanup/
    │   │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   │   └── trakt-sync/
    │   │   │   │   │       ├── helmrelease.yaml
    │   │   │   │   │       ├── kustomization.yaml
    │   │   │   │   │       └── config/
    │   │   │   │   │           └── config.yml
    │   │   │   │   ├── tautulli/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── pvc.yaml
    │   │   │   │   ├── wizarr/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   └── your-spotify/
    │   │   │   │       ├── externalsecret.yaml
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── network/
    │   │   │   │   ├── cloudflare-dns/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── prometheusrule.yaml
    │   │   │   │   ├── cloudflare-tunnel/
    │   │   │   │   │   ├── dnsendpoint.yaml
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── resources/
    │   │   │   │   │       └── config.yaml
    │   │   │   │   ├── echo/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   └── unifi-dns/
    │   │   │   │       ├── externalsecret.yaml
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── observability/
    │   │   │   │   ├── exporters/
    │   │   │   │   │   ├── blackbox-exporter/
    │   │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   │   ├── httproute.yaml
    │   │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   │   ├── nut-exporter/
    │   │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   │   ├── prometheusrule.yaml
    │   │   │   │   │   │   ├── servicemonitor.yaml
    │   │   │   │   │   │   └── dashboard/
    │   │   │   │   │   │       ├── kustomization.yaml
    │   │   │   │   │   │       ├── nut-exporter.json
    │   │   │   │   │   │       └── ups-aggregate.json
    │   │   │   │   │   ├── smartctl-exporter/
    │   │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   │   └── prometheusrule.yaml
    │   │   │   │   │   ├── speedtest-exporter/
    │   │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   │   ├── prometheusrule.yaml
    │   │   │   │   │   │   └── servicemonitor.yaml
    │   │   │   │   │   └── unpoller/
    │   │   │   │   │       ├── externalsecret.yaml
    │   │   │   │   │       ├── helmrelease.yaml
    │   │   │   │   │       ├── kustomization.yaml
    │   │   │   │   │       └── dashboard/
    │   │   │   │   │           ├── kustomization.yaml
    │   │   │   │   │           └── pdu-insights.json
    │   │   │   │   ├── gatus/
    │   │   │   │   │   ├── grafana-dashboard.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── prometheusrule.yaml
    │   │   │   │   │   └── rbac.yaml
    │   │   │   │   ├── grafana/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── karma/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── config/
    │   │   │   │   │       └── config.yaml
    │   │   │   │   ├── kromgo/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── resources/
    │   │   │   │   │       └── config.yaml
    │   │   │   │   ├── kube-prometheus-stack/
    │   │   │   │   │   ├── alertmanagerconfig.yaml
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── network-ups-tools/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── servicemonitor.yaml
    │   │   │   │   └── silence-operator/
    │   │   │   │       ├── app/
    │   │   │   │       │   ├── helmrelease.yaml
    │   │   │   │       │   └── kustomization.yaml
    │   │   │   │       └── crds/
    │   │   │   │           ├── helmrelease.yaml
    │   │   │   │           └── kustomization.yaml
    │   │   │   ├── rook-ceph/
    │   │   │   │   └── rook-ceph/
    │   │   │   │       ├── app/
    │   │   │   │       │   ├── externalsecret.yaml
    │   │   │   │       │   ├── helmrelease.yaml
    │   │   │   │       │   └── kustomization.yaml
    │   │   │   │       └── cluster/
    │   │   │   │           ├── helmrelease.yaml
    │   │   │   │           ├── httproute.yaml
    │   │   │   │           └── kustomization.yaml
    │   │   │   ├── security/
    │   │   │   │   └── authentik/
    │   │   │   │       ├── externalsecret.yaml
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── httproute.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── self-hosted/
    │   │   │   │   ├── acars/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── actual/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── archiveteam/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── pvc.yaml
    │   │   │   │   ├── atuin/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── free-game-notifier/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── it-tools/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── lubelogger/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── rbac.yaml
    │   │   │   │   │   └── secretstore.yaml
    │   │   │   │   ├── meshcentral/
    │   │   │   │   │   ├── configmap.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── paperless/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── rss-forwarder/
    │   │   │   │   │   ├── externalsecret.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── thelounge/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   └── wyze-bridge/
    │   │   │   │       ├── externalsecret.yaml
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   └── storage/
    │   │   │       ├── csi-driver-nfs/
    │   │   │       │   ├── helmrelease.yaml
    │   │   │       │   └── kustomization.yaml
    │   │   │       ├── democratic-csi/
    │   │   │       │   ├── helmrelease.yaml
    │   │   │       │   └── kustomization.yaml
    │   │   │       ├── openebs/
    │   │   │       │   ├── helmrelease.yaml
    │   │   │       │   └── kustomization.yaml
    │   │   │       ├── snapshot-controller/
    │   │   │       │   ├── helmrelease.yaml
    │   │   │       │   └── kustomization.yaml
    │   │   │       └── volsync/
    │   │   │           ├── helmrelease.yaml
    │   │   │           ├── kustomization.yaml
    │   │   │           ├── mutatingadmissionpolicy.yaml
    │   │   │           └── prometheusrule.yaml
    │   │   ├── main/
    │   │   │   ├── actions-runner-system/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── actions-runner-controller/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── cert-manager/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── cert-manager/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── database/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── crunchy-postgres/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   └── dragonfly/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── default/
    │   │   │   │   └── kustomization.yaml
    │   │   │   ├── downloads/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── bazarr/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── dashbrr/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── flaresolverr/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── kapowarr/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── metube/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── mylar/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── prowlarr/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── qbittorrent/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── radarr/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── readarr/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── recyclarr/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── sabnzbd/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── sonarr/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   └── webhook/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── external-secrets/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── external-secrets/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── flux-system/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── addons/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── flux-operator/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   └── headlamp/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── games/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── core-keeper/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── minecraft/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── palworld/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   └── vrising/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── kube-system/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── cilium/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   └── config/
    │   │   │   │   │       ├── kustomization.yaml
    │   │   │   │   │       └── networks.yaml
    │   │   │   │   ├── coredns/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── irqbalance/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   └── metrics-server/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── kube-tools/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── descheduler/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── fstrim/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── intel-device-plugins/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── reloader/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── spegel/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   └── system-upgrade-controller/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── llm/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ollama/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── open-webui/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   └── searxng/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── media/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── ersatztv/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── jellyseerr/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── kavita/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── komga/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── kyoo/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── maintainerr/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── plex/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── tautulli/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── wizarr/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   └── your-spotify/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── network/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── cloudflare-dns/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── cloudflare-tunnel/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── echo/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   └── unifi-dns/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── observability/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── exporters/
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── blackbox-exporter/
    │   │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   │   └── probes.yaml
    │   │   │   │   │   ├── nut-exporter/
    │   │   │   │   │   │   └── ks.yaml
    │   │   │   │   │   ├── smartctl-exporter/
    │   │   │   │   │   │   └── ks.yaml
    │   │   │   │   │   ├── speedtest-exporter/
    │   │   │   │   │   │   └── ks.yaml
    │   │   │   │   │   └── unpoller/
    │   │   │   │   │       └── ks.yaml
    │   │   │   │   ├── gatus/
    │   │   │   │   │   ├── config.yaml
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── grafana/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── karma/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── kromgo/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── kube-prometheus-stack/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   └── scrapeconfig.yaml
    │   │   │   │   └── silence-operator/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── rook-ceph/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── rook-ceph/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── security/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── authentik/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── self-hosted/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── actual/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── archiveteam/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── atuin/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── lubelogger/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── paperless/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   └── wyze-bridge/
    │   │   │   │       └── ks.yaml
    │   │   │   └── storage/
    │   │   │       ├── kustomization.yaml
    │   │   │       ├── csi-driver-nfs/
    │   │   │       │   └── ks.yaml
    │   │   │       ├── openebs/
    │   │   │       │   └── ks.yaml
    │   │   │       ├── snapshot-controller/
    │   │   │       │   └── ks.yaml
    │   │   │       └── volsync/
    │   │   │           └── ks.yaml
    │   │   ├── test/
    │   │   │   ├── actions-runner-system/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── actions-runner-controller/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── cert-manager/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── cert-manager/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── external-secrets/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   └── external-secrets/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── flux-system/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── addons/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── flux-operator/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   └── headlamp/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── kube-system/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── cilium/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   └── config/
    │   │   │   │   │       ├── kustomization.yaml
    │   │   │   │   │       └── networks.yaml
    │   │   │   │   ├── coredns/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   └── metrics-server/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── kube-tools/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── reloader/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   └── system-upgrade-controller/
    │   │   │   │       └── ks.yaml
    │   │   │   ├── network/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── cloudflare-dns/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── cloudflare-tunnel/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   ├── echo/
    │   │   │   │   │   └── ks.yaml
    │   │   │   │   └── unifi-dns/
    │   │   │   │       └── ks.yaml
    │   │   │   └── storage/
    │   │   │       ├── kustomization.yaml
    │   │   │       ├── csi-driver-nfs/
    │   │   │       │   └── ks.yaml
    │   │   │       ├── democratic-csi/
    │   │   │       │   └── ks.yaml
    │   │   │       ├── snapshot-controller/
    │   │   │       │   └── ks.yaml
    │   │   │       └── volsync/
    │   │   │           └── ks.yaml
    │   │   └── utility/
    │   │       ├── actions-runner-system/
    │   │       │   ├── kustomization.yaml
    │   │       │   └── actions-runner-controller/
    │   │       │       └── ks.yaml
    │   │       ├── cert-manager/
    │   │       │   ├── kustomization.yaml
    │   │       │   └── cert-manager/
    │   │       │       └── ks.yaml
    │   │       ├── default/
    │   │       │   └── kustomization.yaml
    │   │       ├── external-secrets/
    │   │       │   ├── kustomization.yaml
    │   │       │   └── external-secrets/
    │   │       │       └── ks.yaml
    │   │       ├── flux-system/
    │   │       │   ├── kustomization.yaml
    │   │       │   ├── addons/
    │   │       │   │   └── ks.yaml
    │   │       │   ├── flux-operator/
    │   │       │   │   └── ks.yaml
    │   │       │   ├── headlamp/
    │   │       │   │   └── ks.yaml
    │   │       │   └── tofu-controller/
    │   │       │       └── ks.yaml
    │   │       ├── home-automation/
    │   │       │   ├── kustomization.yaml
    │   │       │   ├── home-assistant/
    │   │       │   │   └── ks.yaml
    │   │       │   ├── mosquitto/
    │   │       │   │   └── ks.yaml
    │   │       │   ├── rtlamr2mqtt/
    │   │       │   │   └── ks.yaml
    │   │       │   └── zigbee/
    │   │       │       └── ks.yaml
    │   │       ├── kube-system/
    │   │       │   ├── kustomization.yaml
    │   │       │   ├── cilium/
    │   │       │   │   ├── ks.yaml
    │   │       │   │   └── config/
    │   │       │   │       ├── kustomization.yaml
    │   │       │   │       └── networks.yaml
    │   │       │   ├── coredns/
    │   │       │   │   └── ks.yaml
    │   │       │   └── metrics-server/
    │   │       │       └── ks.yaml
    │   │       ├── kube-tools/
    │   │       │   ├── kustomization.yaml
    │   │       │   ├── descheduler/
    │   │       │   │   └── ks.yaml
    │   │       │   ├── fstrim/
    │   │       │   │   └── ks.yaml
    │   │       │   ├── reloader/
    │   │       │   │   └── ks.yaml
    │   │       │   └── system-upgrade-controller/
    │   │       │       └── ks.yaml
    │   │       ├── network/
    │   │       │   ├── kustomization.yaml
    │   │       │   ├── cloudflare-dns/
    │   │       │   │   └── ks.yaml
    │   │       │   ├── cloudflare-tunnel/
    │   │       │   │   └── ks.yaml
    │   │       │   ├── echo/
    │   │       │   │   └── ks.yaml
    │   │       │   └── unifi-dns/
    │   │       │       └── ks.yaml
    │   │       ├── observability/
    │   │       │   ├── kustomization.yaml
    │   │       │   ├── exporters/
    │   │       │   │   ├── kustomization.yaml
    │   │       │   │   ├── blackbox-exporter/
    │   │       │   │   │   ├── ks.yaml
    │   │       │   │   │   └── probes.yaml
    │   │       │   │   └── smartctl-exporter/
    │   │       │   │       └── ks.yaml
    │   │       │   ├── gatus/
    │   │       │   │   ├── config.yaml
    │   │       │   │   └── ks.yaml
    │   │       │   ├── grafana/
    │   │       │   │   └── ks.yaml
    │   │       │   └── kube-prometheus-stack/
    │   │       │       └── ks.yaml
    │   │       ├── self-hosted/
    │   │       │   ├── kustomization.yaml
    │   │       │   ├── acars/
    │   │       │   │   ├── externalsecret.yaml
    │   │       │   │   └── ks.yaml
    │   │       │   ├── free-game-notifier/
    │   │       │   │   └── ks.yaml
    │   │       │   ├── it-tools/
    │   │       │   │   └── ks.yaml
    │   │       │   ├── meshcentral/
    │   │       │   │   └── ks.yaml
    │   │       │   ├── rss-forwarder/
    │   │       │   │   └── ks.yaml
    │   │       │   └── thelounge/
    │   │       │       └── ks.yaml
    │   │       └── storage/
    │   │           ├── kustomization.yaml
    │   │           ├── csi-driver-nfs/
    │   │           │   └── ks.yaml
    │   │           ├── democratic-csi/
    │   │           │   └── ks.yaml
    │   │           ├── snapshot-controller/
    │   │           │   └── ks.yaml
    │   │           └── volsync/
    │   │               └── ks.yaml
    │   ├── clusters/
    │   │   ├── main/
    │   │   │   ├── apps.yaml
    │   │   │   ├── flux-instance.yaml
    │   │   │   └── flux-instance/
    │   │   │       ├── helmrelease.yaml
    │   │   │       ├── kustomization.yaml
    │   │   │       ├── prometheusrule.yaml
    │   │   │       └── helm/
    │   │   │           ├── kustomizeconfig.yaml
    │   │   │           └── values.yaml
    │   │   ├── test/
    │   │   │   ├── apps.yaml
    │   │   │   ├── flux-instance.yaml
    │   │   │   └── flux-instance/
    │   │   │       ├── helmrelease.yaml
    │   │   │       ├── kustomization.yaml
    │   │   │       ├── prometheusrule.yaml
    │   │   │       └── helm/
    │   │   │           ├── kustomizeconfig.yaml
    │   │   │           └── values.yaml
    │   │   └── utility/
    │   │       ├── apps.yaml
    │   │       ├── flux-instance.yaml
    │   │       └── flux-instance/
    │   │           ├── helmrelease.yaml
    │   │           ├── kustomization.yaml
    │   │           ├── prometheusrule.yaml
    │   │           └── helm/
    │   │               ├── kustomizeconfig.yaml
    │   │               └── values.yaml
    │   └── components/
    │       ├── kustomization.yaml
    │       ├── common/
    │       │   ├── kustomization.yaml
    │       │   ├── namespace.yaml
    │       │   ├── alerts/
    │       │   │   ├── kustomization.yaml
    │       │   │   ├── alertmanager/
    │       │   │   │   ├── alert.yaml
    │       │   │   │   ├── kustomization.yaml
    │       │   │   │   └── provider.yaml
    │       │   │   └── github-status/
    │       │   │       ├── alert.yaml
    │       │   │       ├── externalsecret.yaml
    │       │   │       ├── kustomization.yaml
    │       │   │       └── provider.yaml
    │       │   ├── repos/
    │       │   │   ├── kustomization.yaml
    │       │   │   └── ocirepository.yaml
    │       │   └── sops/
    │       │       ├── kustomization.yaml
    │       │       └── secret.sops.yaml
    │       ├── dragonfly/
    │       │   ├── cluster.yaml
    │       │   ├── kustomization.yaml
    │       │   └── podmonitor.yaml
    │       ├── gatus/
    │       │   ├── external/
    │       │   │   ├── config.yaml
    │       │   │   └── kustomization.yaml
    │       │   └── guarded/
    │       │       ├── config.yaml
    │       │       └── kustomization.yaml
    │       ├── postgres/
    │       │   ├── README.md
    │       │   ├── cluster.yaml
    │       │   ├── externalsecret.yaml
    │       │   ├── kustomization.yaml
    │       │   └── podmonitor.yaml
    │       └── volsync/
    │           ├── kustomization.yaml
    │           ├── pvc.yaml
    │           ├── local/
    │           │   ├── externalsecret.yaml
    │           │   ├── kustomization.yaml
    │           │   ├── replicationdestination.yaml
    │           │   └── replicationsource.yaml
    │           └── remote/
    │               ├── externalsecret.yaml
    │               ├── kustomization.yaml
    │               └── replicationsource.yaml
    ├── scripts/
    │   ├── bootstrap-apps.sh
    │   └── lib/
    │       └── common.sh
    ├── talos/
    │   ├── main/
    │   │   ├── machineconfig.yaml.j2
    │   │   ├── schematic.yaml
    │   │   └── controlplane/
    │   │       ├── ayaka.yaml
    │   │       ├── eula.yaml
    │   │       └── ganyu.yaml
    │   ├── test/
    │   │   ├── machineconfig.yaml.j2
    │   │   ├── schematic.yaml
    │   │   └── controlplane/
    │   │       └── citlali.yaml
    │   └── utility/
    │       ├── machineconfig.yaml.j2
    │       ├── schematic.yaml
    │       └── controlplane/
    │           └── celestia.yaml
    ├── terraform/
    │   ├── authentik/
    │   │   ├── applications.tf
    │   │   ├── backend.tf
    │   │   ├── customization.tf
    │   │   ├── directory.tf
    │   │   ├── flows.tf
    │   │   ├── main.tf
    │   │   ├── mappings.tf
    │   │   ├── scopes.tf
    │   │   ├── stages-prompt_fields.tf
    │   │   ├── stages.tf
    │   │   ├── system.tf
    │   │   └── variables.tf
    │   └── minio/
    │       ├── backend.tf
    │       ├── buckets.tf
    │       ├── main.tf
    │       ├── outputs.tf
    │       ├── secrets.tf
    │       ├── usernames.tf
    │       ├── variables.tf
    │       └── modules/
    │           ├── create-secret/
    │           │   ├── main.tf
    │           │   ├── output.tf
    │           │   ├── providers.tf
    │           │   └── variables.tf
    │           └── minio/
    │               ├── main.tf
    │               └── variables.tf
    ├── .github/
    │   ├── CODEOWNERS
    │   ├── FUNDING.yml
    │   ├── labeler.yaml
    │   ├── labels.yaml
    │   └── workflows/
    │       ├── codeql.yaml
    │       ├── flux-local.yaml
    │       ├── image-pull.yaml
    │       ├── label-sync.yaml
    │       ├── labeler.yaml
    │       ├── nas-restart.yaml
    │       ├── schemas.yaml
    │       ├── tag.yaml
    │       ├── terraform-diff.yaml
    │       └── terraform-publish.yaml
    ├── .renovate/
    │   ├── autoMerge.json5
    │   ├── customManagers.json5
    │   ├── grafanaDashboards.json5
    │   ├── groups.json5
    │   └── packageRules.json5
    └── .taskfiles/
        ├── bootstrap/
        │   └── Taskfile.yaml
        ├── kubernetes/
        │   ├── Taskfile.yaml
        │   └── resources/
        │       └── privileged-pod.tmpl.yaml
        ├── onepassword/
        │   └── Taskfile.yaml
        ├── sops/
        │   └── Taskfile.yaml
        ├── talos/
        │   └── Taskfile.yaml
        ├── volsync/
        │   ├── Taskfile.yaml
        │   └── resources/
        │       ├── list.yaml.j2
        │       ├── replicationdestination.yaml.j2
        │       └── unlock.yaml.j2
        └── workstation/
            ├── Taskfile.yaml
            └── resources/
                └── Brewfile


Files Content:

(Files content cropped to 300k characters, download full ingest to see more)
================================================
FILE: README.md
================================================
<div align="center">

<img src="https://avatars.githubusercontent.com/u/46251616?v=4" align="center" width="144px" height="144px"/>


### <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/512.gif" alt="🚀" width="16" height="16"> My Home Operations Repository <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f6a7/512.gif" alt="🚧" width="16" height="16">

_... managed with Flux, Renovate, and GitHub Actions_ <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f916/512.gif" alt="🤖" width="16" height="16">

</div>

<div align="center">

[![Discord](https://img.shields.io/discord/673534664354430999?style=for-the-badge&label&logo=discord&logoColor=white&color=blue)](https://discord.gg/home-operations)&nbsp;&nbsp;
[![Talos](https://img.shields.io/endpoint?url=https%3A%2F%2Fkromgo.jory.dev%2Ftalos_version&style=for-the-badge&logo=talos&logoColor=white&color=blue&label=%20)](https://talos.dev)&nbsp;&nbsp;
[![Kubernetes](https://img.shields.io/endpoint?url=https%3A%2F%2Fkromgo.jory.dev%2Fkubernetes_version&style=for-the-badge&logo=kubernetes&logoColor=white&color=blue&label=%20)](https://kubernetes.io)&nbsp;&nbsp;
[![Flux](https://img.shields.io/endpoint?url=https%3A%2F%2Fkromgo.jory.dev%2Fflux_version&style=for-the-badge&logo=flux&logoColor=white&color=blue&label=%20)](https://fluxcd.io)&nbsp;&nbsp;
[![Renovate](https://img.shields.io/github/actions/workflow/status/joryirving/admin/schedule-renovate.yaml?branch=main&label=&logo=renovatebot&style=for-the-badge&color=blue)](https://github.com/joryirving/joryirving/actions/workflows/scheduled-renovate.yaml)

</div>

<div align="center">

[![Home-Internet](https://img.shields.io/endpoint?url=https%3A%2F%2Fhealthchecks.io%2Fbadge%2Ff0288b6a-305e-4084-b492-bb0a54%2FKkxSOeO1-2.shields&style=for-the-badge&logo=ubiquiti&logoColor=white&label=Home%20Internet)](https://status.jory.dev)&nbsp;&nbsp;
[![Status-Page](https://img.shields.io/endpoint?url=https%3A%2F%2Fstatus.jory.dev%2Fapi%2Fv1%2Fendpoints%2Fmain-external_status%2Fhealth%2Fbadge.shields&style=for-the-badge&logo=statuspage&logoColor=white&label=Status%20Page)](https://status.jory.dev/endpoints/external_gatus)&nbsp;&nbsp;
[![Plex](https://img.shields.io/endpoint?url=https%3A%2F%2Fstatus.jory.dev%2Fapi%2Fv1%2Fendpoints%2Fmain-external_plex%2Fhealth%2Fbadge.shields&style=for-the-badge&logo=plex&logoColor=white&label=Plex)](https://status.jory.dev/endpoints/external_plex)

</div>

<div align="center">

[![Age-Days](https://img.shields.io/endpoint?url=https%3A%2F%2Fkromgo.jory.dev%2Fcluster_age_days&style=flat-square&label=Age)](https://github.com/kashalls/kromgo)&nbsp;&nbsp;
[![Uptime-Days](https://img.shields.io/endpoint?url=https%3A%2F%2Fkromgo.jory.dev%2Fcluster_uptime_days&style=flat-square&label=Uptime)](https://github.com/kashalls/kromgo)&nbsp;&nbsp;
[![Node-Count](https://img.shields.io/endpoint?url=https%3A%2F%2Fkromgo.jory.dev%2Fcluster_node_count&style=flat-square&label=Nodes)](https://github.com/kashalls/kromgo)&nbsp;&nbsp;
[![Pod-Count](https://img.shields.io/endpoint?url=https%3A%2F%2Fkromgo.jory.dev%2Fcluster_pod_count&style=flat-square&label=Pods)](https://github.com/kashalls/kromgo)&nbsp;&nbsp;
[![CPU-Usage](https://img.shields.io/endpoint?url=https%3A%2F%2Fkromgo.jory.dev%2Fcluster_cpu_usage&style=flat-square&label=CPU)](https://github.com/kashalls/kromgo)&nbsp;&nbsp;
[![Memory-Usage](https://img.shields.io/endpoint?url=https%3A%2F%2Fkromgo.jory.dev%2Fcluster_memory_usage&style=flat-square&label=Memory)](https://github.com/kashalls/kromgo)&nbsp;&nbsp;
[![Power-Usage](https://img.shields.io/endpoint?url=https%3A%2F%2Fkromgo.jory.dev%2Fcluster_power_usage&style=flat-square&label=Power)](https://github.com/kashalls/kromgo)&nbsp;&nbsp;
[![Alerts](https://img.shields.io/endpoint?url=https%3A%2F%2Fkromgo.jory.dev%2Fcluster_alert_count&style=flat-square&label=Alerts)](https://github.com/kashalls/kromgo)
</div>

---

## Overview

This is a monorepository is for my home kubernetes clusters.
I try to adhere to Infrastructure as Code (IaC) and GitOps practices using tools like [Terraform](https://www.terraform.io/), [Kubernetes](https://kubernetes.io/), [Flux](https://github.com/fluxcd/flux2), [Renovate](https://github.com/renovatebot/renovate), and [GitHub Actions](https://github.com/features/actions).

The purpose here is to learn k8s, while practicing Gitops.

---

## ⛵ Kubernetes

My Kubernetes clusters are deployed with [Talos](https://www.talos.dev). One is a low-power utility cluster, running important services, and the other is a semi-hyper-converged cluster, workloads and block storage are sharing the same available resources on my nodes while I have a separate NAS with ZFS for NFS/SMB shares, bulk file storage and backups.

There is a template over at [onedr0p/cluster-template](https://github.com/onedr0p/cluster-template) if you want to try and follow along with some of the practices I use here.

### Core Components

- [actions-runner-controller](https://github.com/actions/actions-runner-controller): self-hosted Github runners
- [cert-manager](https://cert-manager.io/docs/): creates SSL certificates for services in my cluster
- [cilium](https://github.com/cilium/cilium): eBPF-based networking for my workloads.
- [cloudflared](https://github.com/cloudflare/cloudflared): Enables Cloudflare secure access to my routes.
- [external-dns](https://github.com/kubernetes-sigs/external-dns): automatically syncs DNS records from my cluster ingresses to a DNS provider
- [external-secrets](https://github.com/external-secrets/external-secrets/): managed Kubernetes secrets using [1Password](https://1password.com/).
- [rook-ceph](https://rook.io/): Cloud native distributed block storage for Kubernetes
- [sops](https://toolkit.fluxcd.io/guides/mozilla-sops/): managed secrets for Talos, which are committed to Git
- [spegel](https://github.com/XenitAB/spegel): stateless cluster local OCI registry mirror
- [tofu-controller](https://github.com/weaveworks/tf-controller): additional Flux component used to run Terraform from within a Kubernetes cluster.
- [volsync](https://github.com/backube/volsync): backup and recovery of persistent volume claims

### GitOps

[Flux](https://github.com/fluxcd/flux2) watches the clusters in my [kubernetes](./kubernetes/) folder (see Directories below) and makes the changes to my clusters based on the state of my Git repository.

The way Flux works for me here is it will recursively search the `kubernetes/${cluster}/apps` folder until it finds the most top level `kustomization.yaml` per directory and then apply all the resources listed in it. That aforementioned `kustomization.yaml` will generally only have a namespace resource and one or many Flux kustomizations (`ks.yaml`). Under the control of those Flux kustomizations there will be a `HelmRelease` or other resources related to the application which will be applied.

[Renovate](https://github.com/renovatebot/renovate) watches my **entire** repository looking for dependency updates, when they are found a PR is automatically created. When some PRs are merged Flux applies the changes to my cluster.

### Directories

This Git repository contains the following directories under [Kubernetes](./kubernetes/).

```sh
📁 kubernetes
├── 📁 apps              # app configurations
│   ├── 📁 base          # base app configuration
│   ├── 📁 main          # cluster specific overlay
│   ├── 📁 utility
├── 📁 clusters          # Cluster flux configurations
│   ├── 📁 main
│   ├── 📁 utility
├── 📁 components        # re-useable components
```

### Networking

<details>
  <summary>Click to see a high-level network diagram</summary>

  <img src="https://raw.githubusercontent.com/joryirving/home-ops/main/docs/src/assets/network-topology.png" align="center" alt="dns"/>
</details>

---

## ☁️ Cloud Dependencies

While most of my infrastructure and workloads are self-hosted I do rely upon the cloud for certain key parts of my setup. This saves me from having to worry about two things. (1) Dealing with chicken/egg scenarios and (2) services I critically need whether my cluster is online or not.

The alternative solution to these two problems would be to host a Kubernetes cluster in the cloud and deploy applications like [HCVault](https://www.vaultproject.io/), [Vaultwarden](https://github.com/dani-garcia/vaultwarden), [ntfy](https://ntfy.sh/), and [Gatus](https://gatus.io/). However, maintaining another cluster and monitoring another group of workloads is a lot more time and effort than I am willing to put in.

| Service                                     | Use                                                               | Cost          |
|---------------------------------------------|-------------------------------------------------------------------|---------------|
| [1Password](https://1Password.com/)         | Secrets with [External Secrets](https://external-secrets.io/)     | Free via work |
| [Cloudflare](https://www.cloudflare.com/)   | Domain, DNS, WAF and R2 bucket (S3 Compatible endpoint)           | ~$30/yr       |
| [GitHub](https://github.com/)               | Hosting this repository and continuous integration/deployments    | Free          |
| [Healthchecks.io](https://healthchecks.io/) | Monitoring internet connectivity and external facing applications | Free          |
|                                             |                                                                   | Total: ~$3/mo |

---

## 🌐 DNS

In my cluster there are two instances of [ExternalDNS](https://github.com/kubernetes-sigs/external-dns) running. One for syncing private DNS records to my `UDM-SE` using [ExternalDNS webhook provider for UniFi](https://github.com/kashalls/external-dns-unifi-webhook), while another instance syncs public DNS to `Cloudflare`. This setup is managed by creating ingresses with two specific classes: `internal` for private DNS and `external` for public DNS. The `external-dns` instances then syncs the DNS records to their respective platforms accordingly.

---

## 🔧 Hardware

### Main Kubernetes Cluster

| Name  | Device | CPU       | OS Disk    | Local Disk | Rook Disk  | RAM   | OS    | Purpose           |
|-------|--------|-----------|------------|------------|------------|-------|-------|-------------------|
| Ayaka | MS-01  | i9-13900H | 960GB NVMe | 1TB NVMe   | 1.92TB U.2 | 128GB | Talos | k8s control-plane |
| Eula  | MS-01  | i9-13900H | 960GB NVMe | 1TB NVMe   | 1.92TB U.2 | 128GB | Talos | k8s control-plane |
| Ganyu | MS-01  | i9-13900H | 960GB NVMe | 1TB NVMe   | 1.92TB U.2 | 128GB | Talos | k8s control-plane |

Total CPU: 60 Cores/60 Threads
Total RAM: 384GB

### Utility Kubernetes Cluster

| Name     | Device     | CPU           | OS Disk   | Local Disk | RAM  | OS    | Purpose           |
|----------|------------|---------------|-----------|------------|------|-------|-------------------|
| Celestia | Bosgame P1 | Ryzen 7 5700U | 480GB SSD | 500GB NVME | 32GB | Talos | k8s control-plane |

Total CPU: 8 Cores/16 Threads
Total RAM: 32GB

### Supporting Hardware

| Name    | Device            | CPU        | OS Disk    | Data Disk      | RAM   | OS           | Purpose           |
|---------|-------------------|------------|------------|----------------|-------|--------------|-------------------|
| Voyager | MS-01             | i5-12600H  | 32GB USB   | 6x400GB Raidz2 | 96GB  | Unraid       | NAS/NFS/Backup    |
| DAS     | Lenovo SA120      | -          | -          | 6x14TB Raidz2  | -     | -            | ZFS               |
| Venti   | Raspberry Pi5     | Cortex A76 | 250GB NVMe | -              | 8GB   | Raspbian     | NUT/SSH (Main)    |
| Sayu    | Raspberry Pi5     | Cortex A76 | 500GB NVMe | -              | 8GB   | Raspbian     | NUT/SSH (Utility) |
| PiKVM   | Raspberry Pi4     | Cortex A72 | 64GB mSD   | -              | 4GB   | PiKVM (Arch) | KVM (Main)        |
| JetKVM  | JetKVM            | RV1106G3   | 8GB EMMC   | -              | 256MB | Linux 5.10   | KVM (Utility)     |
| PDU     | UniFi USP PDU Pro | -          | -          | -              | -     | -            | PDU               |
| TESmart | 8 port KVM        | -          | -          | -              | -     | -            | Network KVM       |

### Networking/UPS Hardware

| Device                      | Purpose              |
|-----------------------------|----------------------|
| Unifi UDM-SE                | Network - Router     |
| USW-Pro-24-POE              | Network - 1G Switch  |
| Back-UPS 600                | Network - UPS        |
| Unifi USW-Enterprise-24-PoE | Server - 2.5G Switch |
| Unifi USW-Aggregation       | Server - 10G Switch  |
| Tripp Lite 1500             | Server - UPS         |

---

## ⭐ Stargazers

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=joryirving/home-ops&type=Date)](https://star-history.com/#joryirving/home-ops&Date)

</div>

---

## 🤝 Thanks

Big shout out to the [cluster-template](https://github.com/onedr0p/cluster-template), and the [Home Operations](https://discord.gg/home-operations) Discord community. Be sure to check out [kubesearch.dev](https://kubesearch.dev/) for ideas on how to deploy applications or get ideas on what you may deploy.



================================================
FILE: LICENSE
================================================
            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

 Copyright (C) 2025 Jory Irving <jory@jory.dev>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.



================================================
FILE: Taskfile.yaml
================================================
---
# yaml-language-server: $schema=https://taskfile.dev/schema.json
version: "3"

set: [pipefail]
shopt: [globstar]

vars:
  BOOSTRAP_DIR: '{{.ROOT_DIR}}/bootstrap'
  CLUSTER: '{{.CLUSTER | default "main"}}'
  CLUSTER_APPS: '{{.ROOT_DIR}}/kubernetes/apps/{{.CLUSTER}}'
  CLUSTER_DIR: '{{.ROOT_DIR}}/kubernetes/clusters/{{.CLUSTER}}'
  SCRIPTS_DIR: '{{.ROOT_DIR}}/scripts'
  SHARED_APPS: '{{.ROOT_DIR}}/kubernetes/apps/base'
  TALOS_DIR: '{{.ROOT_DIR}}/talos/{{.CLUSTER}}'

dotenv:
  - '{{.ROOT_DIR}}/onepassword.env'
  - '{{.SHARED_APPS}}/kube-tools/system-upgrade/versions.env'

env:
  KUBECONFIG: '{{.CLUSTER_DIR}}/kubeconfig'
  MINIJINJA_CONFIG_FILE: '{{.ROOT_DIR}}/.minijinja.toml'
  SOPS_AGE_KEY_FILE: '{{.ROOT_DIR}}/age.key'
  TALOSCONFIG: '{{.TALOS_DIR}}/clusterconfig/talosconfig'

includes:
  bootstrap: .taskfiles/bootstrap
  kubernetes: .taskfiles/kubernetes
  op: .taskfiles/onepassword
  sops: .taskfiles/sops
  talos: .taskfiles/talos
  volsync: .taskfiles/volsync
  workstation: .taskfiles/workstation

tasks:

  default:
    cmd: task --list
    silent: true

  # Ref: https://github.com/go-task/task/issues/608
  noop:
    internal: true
    silent: true
    cmd: noop() { :; }



================================================
FILE: .editorconfig
================================================
; https://editorconfig.org/

root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[{Makefile,go.mod,go.sum,*.go,.gitmodules}]
indent_style = tab
indent_size = 4

[*.md]
indent_size = 4
trim_trailing_whitespace = false

[{Dockerfile,*.bash,*.sh}]
indent_style = space
indent_size = 4



================================================
FILE: .minijinja.toml
================================================
autoescape = "none"
newline = true
trim-blocks = true
lstrip-blocks = true
env = true



================================================
FILE: .mise.toml
================================================
[env]
# File paths
KUBECONFIG = "{{config_root}}/kubernetes/clusters/main/kubeconfig:{{config_root}}/kubernetes/clusters/test/kubeconfig:{{config_root}}/kubernetes/clusters/utility/kubeconfig"
MINIJINJA_CONFIG_FILE = "{{config_root}}/.minijinja.toml"
SOPS_AGE_KEY_FILE = "{{config_root}}/age.key"
#TALOSCONFIG = "{{config_root}}/talos/main/clusterconfig/talosconfig:{{config_root}}/talos/utility/clusterconfig/talosconfig"

# File paths
BOOTSTRAP_DIR = "{{config_root}}/bootstrap"
KUBERNETES_DIR = "{{config_root}}/kubernetes"
ROOT_DIR = "{{config_root}}"
SHARED_DIR = "{{config_root}}/components"
SCRIPTS_DIR = "{{config_root}}/scripts"
TALOS_DIR = "{{config_root}}/talos"

_.file = [
  "{{config_root}}/onepassword.env",
  "{{config_root}}/kubernetes/apps/base/kube-tools/system-upgrade-controller/versions.env"
]
#_.python.venv = { path = "{{config_root}}/.venv", create = true }

#[tools]
#"python" = "3.13"
#"uv" = "latest"
#"pipx:flux-local" = "latest"



================================================
FILE: .renovaterc.json5
================================================
{
  $schema: 'https://docs.renovatebot.com/renovate-schema.json',
  extends: [
    ':skipStatusChecks',
    'github>joryirving/renovate-config',
    'github>joryirving/home-ops//.renovate/autoMerge.json5',
    'github>joryirving/home-ops//.renovate/customManagers.json5',
    'github>joryirving/home-ops//.renovate/grafanaDashboards.json5',
    'github>joryirving/home-ops//.renovate/groups.json5',
    'github>joryirving/home-ops//.renovate/packageRules.json5',
    ':semanticCommits',
  ],
  ignorePaths: [
    '**/*.sops.*',
    '**/resources/**',
  ],
  flux: {
    managerFilePatterns: [
      '/(^|/)kubernetes/.+\\.ya?ml$/',
    ],
  },
  'helm-values': {
    managerFilePatterns: [
      '/(^|/)kubernetes/.+\\.ya?ml$/',
    ],
  },
  kubernetes: {
    managerFilePatterns: [
      '/(^|/)kubernetes/.+\\.ya?ml$/',
    ],
  },
}



================================================
FILE: .sops.yaml
================================================
---
creation_rules:
  - # IMPORTANT: This rule MUST be above the others
    path_regex: talos/.*\.sops\.ya?ml
    key_groups:
      - age:
          - "age12v9uw8k6myrr49z9aq6jmcwa79aepu0p6p462nrv968qcae72pcspwldec"
  - path_regex: kubernetes/.*\.sops\.ya?ml
    encrypted_regex: "^(data|stringData)$"
    key_groups:
      - age:
          - "age12v9uw8k6myrr49z9aq6jmcwa79aepu0p6p462nrv968qcae72pcspwldec"
  - path_regex: ansible/.*\.sops\.ya?ml
    key_groups:
      - age:
          - "age12v9uw8k6myrr49z9aq6jmcwa79aepu0p6p462nrv968qcae72pcspwldec"
stores:
  yaml:
    indent: 2



================================================
FILE: bootstrap/helmfile.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/helmfile

helmDefaults:
  cleanupOnFail: true
  wait: true
  waitForJobs: true
  # waitRetries: 3 # Not supported by Helm yet

releases:
  - name: cilium
    namespace: kube-system
    atomic: true
    chart: oci://ghcr.io/home-operations/charts-mirror/cilium
    version: 1.17.4
    values: ['{{ requiredEnv "SHARED_APPS" }}/kube-system/cilium/app/helm/values.yaml']
    hooks:
      - # Wait for cilium CRDs to be available
        events: ['postsync']
        command: bash
        args:
          - -c
          - until kubectl --context {{ requiredEnv "CLUSTER" }} get crd ciliumbgppeeringpolicies.cilium.io ciliuml2announcementpolicies.cilium.io ciliumloadbalancerippools.cilium.io &>/dev/null; do sleep 10; done
        showlogs: true
      - # Apply cilium network configuration
        events: ['postsync']
        command: kubectl
        args:
          - --context={{ requiredEnv "CLUSTER" }}
          - apply
          - --namespace=kube-system
          - --server-side
          - --field-manager=kustomize-controller
          - --filename={{ requiredEnv "CLUSTER_APPS" }}/kube-system/cilium/config/networks.yaml
        showlogs: true

  - name: coredns
    namespace: kube-system
    atomic: true
    chart: oci://ghcr.io/coredns/charts/coredns
    version: 1.42.1
    values: ['{{ requiredEnv "SHARED_APPS" }}/kube-system/coredns/helm/values.yaml']
    needs: ['kube-system/cilium']

  - name: cert-manager
    namespace: cert-manager
    atomic: true
    chart: oci://quay.io/jetstack/charts/cert-manager
    version: v1.17.2
    values: ['{{ requiredEnv "SHARED_APPS" }}/cert-manager/cert-manager/helm/values.yaml']
    needs: ['kube-system/coredns']

  - name: external-secrets
    namespace: external-secrets
    atomic: true
    chart: oci://ghcr.io/external-secrets/charts/external-secrets
    version: 0.17.0
    values: ['{{ requiredEnv "SHARED_APPS" }}/external-secrets/helm/values.yaml']
    hooks:
      - # Wait for external-secrets CRDs to be available
        events: ['postsync']
        command: bash
        args:
          - -c
          - until kubectl --context {{ requiredEnv "CLUSTER" }} get crd clustersecretstores.external-secrets.io &>/dev/null; do sleep 10; done
        showlogs: true
      - # Apply cluster secret store configuration
        events: ['postsync']
        command: kubectl
        args:
          - --context={{ requiredEnv "CLUSTER" }}
          - apply
          - --namespace=external-secrets
          - --server-side
          - --field-manager=kustomize-controller
          - --filename={{ requiredEnv "SHARED_APPS" }}/external-secrets/clustersecretstore.yaml
        showlogs: true
    needs: ['cert-manager/cert-manager']

  - name: flux-operator
    namespace: flux-system
    atomic: true
    chart: oci://ghcr.io/controlplaneio-fluxcd/charts/flux-operator
    version: 0.20.0
    values: ['{{ requiredEnv "SHARED_APPS" }}/flux-system/flux-operator/helm/values.yaml']
    needs: ['external-secrets/external-secrets']

  - name: flux-instance
    namespace: flux-system
    atomic: true
    chart: oci://ghcr.io/controlplaneio-fluxcd/charts/flux-instance
    version: 0.20.0
    values: ['{{ requiredEnv "CLUSTER_DIR" }}/flux-instance/helm/values.yaml']
    needs: ['flux-system/flux-operator']



================================================
FILE: bootstrap/resources.yaml.j2
================================================
{% for namespace in ["external-secrets", "flux-system"] %}
---
apiVersion: v1
kind: Namespace
metadata:
  name: {{ namespace }}
{% endfor %}
---
apiVersion: v1
kind: Secret
metadata:
  name: onepassword
  namespace: external-secrets
stringData:
  token: op://kubernetes/1password/OP_CONNECT_TOKEN
---
apiVersion: v1
kind: Secret
metadata:
  name: sops-age
  namespace: flux-system
stringData:
  age.agekey: op://kubernetes/sops/SOPS_PRIVATE_KEY
---
apiVersion: v1
kind: Secret
metadata:
  name: jory-dev-tls
  namespace: kube-system
  annotations:
    cert-manager.io/alt-names: '*.jory.dev,jory.dev'
    cert-manager.io/certificate-name: jory-dev
    cert-manager.io/common-name: jory.dev
    cert-manager.io/ip-sans: ""
    cert-manager.io/issuer-group: ""
    cert-manager.io/issuer-kind: ClusterIssuer
    cert-manager.io/issuer-name: letsencrypt-production
    cert-manager.io/uri-sans: ""
  labels:
    controller.cert-manager.io/fao: "true"
type: kubernetes.io/tls
data:
  tls.crt: op://kubernetes/$CLUSTER-cluster-tls/tls.crt
  tls.key: op://kubernetes/$CLUSTER-cluster-tls/tls.key



================================================
FILE: docs/src/introduction.md
================================================
# Introduction

```admonish warning
These docs contain information that relates to my setup. They may or may not work for you. This is heavily inspired by [onedr0p](https://github.com/onedr0p/home-ops/)
```

---
<br />

{{#include ../../README.md}}


================================================
FILE: docs/src/SUMMARY.md
================================================
# Summary

# Welcome

---

- [Introduction](introduction.md)

# Basement Notes

---

- [PiKVM](./notes/pikvm.md)



================================================
FILE: docs/src/assets/bgp.conf
================================================
router bgp 64513
  bgp router-id 192.168.1.1
  no bgp ebgp-requires-policy

  neighbor k8s.main peer-group
  neighbor k8s.main remote-as 64514

  neighbor k8s.utility peer-group
  neighbor k8s.utility remote-as 64515

  neighbor 10.69.1.21 peer-group k8s.main
  neighbor 10.69.1.22 peer-group k8s.main
  neighbor 10.69.1.23 peer-group k8s.main
  neighbor 10.69.1.121 peer-group k8s.utility

  address-family ipv4 unicast
    neighbor k8s.main next-hop-self
    neighbor k8s.main soft-reconfiguration inbound
    neighbor k8s.utility next-hop-self
    neighbor k8s.utility soft-reconfiguration inbound
  exit-address-family
exit




================================================
FILE: docs/src/assets/server-nut/nut.conf
================================================
MODE=netserver



================================================
FILE: docs/src/assets/server-nut/ups.conf
================================================
[serverups]
  driver = "usbhid-ups"
  port = "auto"
  desc = "TrippLite SMART1500LCD"
  vendorid = "09AE"
  productid = "2012"



================================================
FILE: docs/src/assets/server-nut/ups_shutdown.sh
================================================
#!/bin/bash

# Issue local Talos shutdown command
talosctl shutdown --context main

# Wait a few seconds to allow local shutdown to initiate (optional but recommended)
sleep 5

# Remotely shutdown the Linux server
ssh root@voyager "sudo shutdown -h now"

exit 0


================================================
FILE: docs/src/assets/server-nut/upsd.conf
================================================
MAXAGE 20
LISTEN 0.0.0.0



================================================
FILE: docs/src/assets/server-nut/upsd.users
================================================
[monuser]
  password = "bacon"
  actions = SET
  instcmds = ALL
  upsmon master



================================================
FILE: docs/src/assets/server-nut/upsmon.conf
================================================
MONITOR ups@localhost:3493 1 upsmon "bacon" master
SHUTDOWNCMD "/sbin/shutdown -h +0"
POWERDOWNFLAG /etc/killpower
POLLFREQ 15
POLLFREQALERT 5
HOSTSYNC 15



================================================
FILE: docs/src/assets/utility-nut/nut.conf
================================================
MODE=netserver



================================================
FILE: docs/src/assets/utility-nut/ups.conf
================================================
[networkups]
  driver = "usbhid-ups"
  port = "auto"
  desc = "Back-UPS ES 600M1"
  vendorid = "051D"
  productid = "0002"
  serial = "4B2217P19326"



================================================
FILE: docs/src/assets/utility-nut/upsd.conf
================================================
MAXAGE 20
LISTEN 0.0.0.0



================================================
FILE: docs/src/assets/utility-nut/upsd.users
================================================
[monuser]
  password = "bacon"
  actions = SET
  instcmds = ALL
  upsmon master



================================================
FILE: docs/src/assets/utility-nut/upsmon.conf
================================================
MONITOR ups@localhost:3493 1 upsmon "bacon" master
SHUTDOWNCMD "talosctl shutdown --context utility"
POWERDOWNFLAG /etc/killpower
POLLFREQ 15
POLLFREQALERT 5
HOSTSYNC 15



================================================
FILE: docs/src/notes/certs.md
================================================
# NAS

## Hardware notes
MS-01, i5-12500H, 96GB DDR5. Dell LSI 9300-e. Lenovo SA120. ZFS Raidz2.

## Caddyfile

```yaml
minio.jory.dev {
        reverse_proxy voyager.internal:9001
        tls /data/certificates/wildcard.crt /data/certificates/wildcard.key
}

nas.jory.dev {
        reverse_proxy voyager.internal:5000
        tls /data/certificates/wildcard.crt /data/certificates/wildcard.key
}

portainer.jory.dev {
        reverse_proxy voyager.internal:9090
        tls /data/certificates/wildcard.crt /data/certificates/wildcard.key
}

s3.jory.dev {
        reverse_proxy voyager.internal:9000
        tls /data/certificates/wildcard.crt /data/certificates/wildcard.key
}
```

## Script to copy certs:
```sh
./home-ops/hack/cert-extract.sh main caddy
```



================================================
FILE: docs/src/notes/pikvm.md
================================================
# NUTE

## Hardware notes
Raspberry Pi 5 w/ 8GM RAM
PoE Hat
NVMe Hat

## Setup Raspberry Pi

Assuming you have already installed Raspbian (or other), ssh into the Pi, update it, and install nut.

```sh
sudo apt update; sudo apt upgrade -y; sudo apt full-upgrade -y; sudo apt autoclean; sudo apt autoremove -y; sudo apt install nut -y
```

Then set the file permissions so they can be overwritten.
```sh
sudo chmod 777 -R /etc/nut
```

Then, copy the proper config to the Raspberry Pi locally
```sh
scp -r ./docs/src/assets/utility-nut/* vetrius@sayu:/etc/nut/
```
or
```sh
scp -r ./docs/src/assets/server-nut/* vetrius@venti:/etc/nut/
```

Change the permissions back
```sh
sudo chmod 755 -R /etc/nut
sudo chmod 640 /etc/nut/*
```

Restart the NUT service
```sh
sudo systemctl restart nut-server
sudo systemctl restart nut-monitor
```

You should now have a working PiNUT config that will also shutdown talos/the NAS when on battery power.



================================================
FILE: docs/src/notes/rpi-nut.md
================================================
# NUT

## Hardware notes
Raspberry Pi 5 w/ 8GM RAM
PoE Hat
NVMe Hat

## Setup Raspberry Pi

Assuming you have already installed Raspbian (or other), ssh into the Pi, update it, and install nut.

```sh
sudo apt update; sudo apt upgrade -y; sudo apt full-upgrade -y; sudo apt autoclean; sudo apt autoremove -y; sudo apt install nut -y
```

Then set the file permissions so they can be overwritten.
```sh
sudo chmod 777 -R /etc/nut
```

Then, copy the proper config to the Raspberry Pi locally
```sh
scp -r ./docs/src/assets/utility-nut/* vetrius@sayu:/etc/nut/
```
or
```sh
scp -r ./docs/src/assets/server-nut/* vetrius@venti:/etc/nut/
```

Change the permissions back
```sh
sudo chmod 755 -R /etc/nut
sudo chmod 640 /etc/nut/*
```

Restart the NUT service
```sh
sudo systemctl restart nut-server
sudo systemctl restart nut-monitor
```

You should now have a working PiNUT config that will also shutdown talos/the NAS when on battery power.

## Docker Compose for node_exporter/smartlctl_exporter

```yaml
services:
  node_exporter:
    image: quay.io/prometheus/node-exporter:latest
    container_name: node_exporter
    command:
      - '--path.rootfs=/host'
    network_mode: host
    pid: host
    restart: unless-stopped
    volumes:
      - '/:/host:ro,rslave'
  smartctl-exporter:
    image: ghcr.io/joryirving/smartctl_exporter:rolling
    container_name: smartctl-exporter
    ports:
      - "9633:9633"
    privileged: true
    restart: unless-stopped
```



================================================
FILE: hack/cert-extract.sh
================================================
#!/bin/bash

export TLS_CERT="jory.dev-tls"
export TLS_NAMESPACE="cert-manager"
CERT_DIR="/tmp/cert"
CERT_TMP="$CERT_DIR/tmp"
CERT_JSON="$CERT_DIR/certificate/certificate-tls.json"
CLUSTER="${1:-utility}"
DESTINATION="${2:-caddy}"

# Set default values based on DESTINATION
if [[ "$DESTINATION" == "caddy" ]]; then
  SERVER="root@voyager"
  DIR="/mnt/user/docker/CaddyV2/data/certificates"
elif [[ "$DESTINATION" == "unifi" ]]; then
  SERVER="root@192.168.1.1"
  DIR="/data/unifi-core/config"
elif [[ "$DESTINATION" == "pikvm" ]]; then
  SERVER="root@192.168.1.11"
  DIR="/etc/kvmd/nginx/ssl"
else
  echo "Unknown DESTINATION: $DESTINATION"
  exit 1
fi

mkdir -p "$CERT_DIR/certificate/"

# Ensure certificate JSON exists
if [[ ! -f "$CERT_JSON" ]]; then
    echo "{}" > "$CERT_JSON"
fi

kubectl --context "$CLUSTER" get secret "$TLS_CERT" -n "$TLS_NAMESPACE" -ojson > "$CERT_TMP"

if ! diff "$CERT_TMP" "$CERT_JSON" >/dev/null; then
  echo "New certificates extracted"
else
  echo "No change in certificates"
fi

kubectl --context "$CLUSTER" get secret "$TLS_CERT" -n "$TLS_NAMESPACE" -ojsonpath="{.data.tls\.crt}" | base64 -d > "$CERT_DIR/certificate.crt"
kubectl --context "$CLUSTER" get secret "$TLS_CERT" -n "$TLS_NAMESPACE" -ojsonpath="{.data.tls\.key}" | base64 -d > "$CERT_DIR/certificate.key"

cp "$CERT_TMP" "$CERT_JSON"
cat "$CERT_DIR/certificate.crt" "$CERT_DIR/certificate.key" > "$CERT_DIR/certificate.pem"

# Transfer certificate and key atomically
if [[ "$DESTINATION" == "caddy" ]]; then
scp "$CERT_DIR/certificate.crt" "$SERVER:$DIR/wildcard.crt"
scp "$CERT_DIR/certificate.key" "$SERVER:$DIR/wildcard.key"
elif [[ "$DESTINATION" == "pikvm" ]]; then
scp "$CERT_DIR/certificate.crt" "$SERVER:$DIR/server.crt"
scp "$CERT_DIR/certificate.key" "$SERVER:$DIR/server.key"
else
scp "$CERT_DIR/certificate.pem" "$SERVER:$DIR"
fi

echo "Certificate copied to $DESTINATION"

rm -f "$CERT_TMP"



================================================
FILE: hack/delete-stuck-ns.sh
================================================
#!/usr/bin/env bash

NAMESPACE=$1
CLUSTER=${2:-main}

function delete_namespace () {
    echo "Deleting namespace $NAMESPACE"
    kubectl --context $CLUSTER get namespace $NAMESPACE -o json > tmp.json
    sed -i 's/"kubernetes"//g' tmp.json
    kubectl --context $CLUSTER replace --raw "/api/v1/namespaces/$NAMESPACE/finalize" -f ./tmp.json
    rm ./tmp.json
}

TERMINATING_NS=$(kubectl --context $CLUSTER get ns | awk '$2=="Terminating" {print $1}')

for NAMESPACE in $TERMINATING_NS
do
    delete_namespace $NAMESPACE
done



================================================
FILE: hack/nas-restart.sh
================================================
#!/usr/bin/env bash
CLUSTER=${1:-main}
kubectl --context $CLUSTER get deployments --all-namespaces -l nfsMount=true -o custom-columns="NAMESPACE:.metadata.namespace,NAME:.metadata.name" --no-headers | awk '{print "kubectl --context $CLUSTER rollout restart deployment/"$2" -n "$1}' | sh



================================================
FILE: hack/node-labels.sh
================================================
# Label workers
kubectl --context main label nodes hutao navia yelan node-role.kubernetes.io/worker=true



================================================
FILE: hack/restart-all-pods.sh
================================================
### WARNING ###
## This will restart all pods in all namespaces! ##
## Use this carefully ##
CLUSTER=${1:-main}
for ns in $(kubectl get ns -o jsonpath='{.items[*].metadata.name}' --context $CLUSTER); do
  for kind in deploy daemonset statefulset; do
    kubectl get "${kind}" -n "${ns}" -o name  --context $CLUSTER | xargs -I {} kubectl rollout restart {} -n "${ns}" --context $CLUSTER
  done
done



================================================
FILE: kubernetes/apps/base/actions-runner-system/actions-runner-controller/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: gha-runner-scale-set-controller
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 0.11.0
  url: oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &name actions-runner-controller
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: gha-runner-scale-set-controller
  install:
    crds: CreateReplace
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    crds: CreateReplace
    remediation:
      retries: 3
  values:
    fullnameOverride: *name
    replicaCount: 1



================================================
FILE: kubernetes/apps/base/actions-runner-system/actions-runner-controller/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/actions-runner-system/actions-runner-controller/runners/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name home-ops-runner-secret
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        github_app_id: '{{ .github_app_id }}'
        github_app_installation_id: '{{ .github_app_installation_id }}'
        github_app_private_key: '{{ .github_app_private_key }}'
  dataFrom:
    - extract:
        key: actions-runner-controller



================================================
FILE: kubernetes/apps/base/actions-runner-system/actions-runner-controller/runners/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: gha-runner-scale-set
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 0.11.0
  url: oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &name home-ops-runner-${CLUSTER}
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: gha-runner-scale-set
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  dependsOn:
    - name: actions-runner-controller
      namespace: actions-runner-system
  values:
    githubConfigUrl: https://github.com/joryirving/home-ops
    githubConfigSecret: home-ops-runner-secret
    minRunners: ${minRunners:=1}
    maxRunners: ${maxRunners:=2} #Double total nodes
    containerMode:
      type: kubernetes
      kubernetesModeWorkVolumeClaim:
        accessModes: ["ReadWriteOnce"]
        storageClassName: local-hostpath
        resources:
          requests:
            storage: 25Gi
    controllerServiceAccount:
      name: actions-runner-controller
      namespace: actions-runner-system
    template:
      spec:
        containers:
          - name: runner
            image: ghcr.io/joryirving/actions-runner:2.324.0@sha256:a8efb0ee790e64d1a2ad5151c7d4b5a6dc0a0ec7916177b40c229ebeeb10ab71
            command: ["/home/runner/run.sh"]
            env:
              - name: ACTIONS_RUNNER_REQUIRE_JOB_CONTAINER
                value: "false"
              - name: NODE
                valueFrom:
                  fieldRef:
                    fieldPath: status.hostIP
            volumeMounts:
              - mountPath: /var/run/secrets/talos.dev
                name: talos
                readOnly: true
        serviceAccountName: *name
        volumes:
          - name: talos
            secret:
              secretName: *name



================================================
FILE: kubernetes/apps/base/actions-runner-system/actions-runner-controller/runners/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml
  - ./rbac.yaml



================================================
FILE: kubernetes/apps/base/actions-runner-system/actions-runner-controller/runners/rbac.yaml
================================================
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: home-ops-runner-${CLUSTER}
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: home-ops-runner-${CLUSTER}
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: home-ops-runner-${CLUSTER}
    namespace: actions-runner-system
---
apiVersion: talos.dev/v1alpha1
kind: ServiceAccount
metadata:
  name: home-ops-runner-${CLUSTER}
spec:
  roles: ["os:admin"]



================================================
FILE: kubernetes/apps/base/cert-manager/cert-manager/clusterissuer.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/cert-manager.io/clusterissuer_v1.json
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-production
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-production
    solvers:
      - dns01:
          cloudflare:
            apiTokenSecretRef:
              name: cloudflare
              key: CLOUDFLARE_DNS_TOKEN
        selector:
          dnsZones: ["jory.dev"]
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/cert-manager.io/clusterissuer_v1.json
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-staging
    solvers:
      - dns01:
          cloudflare:
            apiTokenSecretRef:
              name: cloudflare
              key: CLOUDFLARE_DNS_TOKEN
        selector:
          dnsZones: ["jory.dev"]



================================================
FILE: kubernetes/apps/base/cert-manager/cert-manager/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name cloudflare
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        CLOUDFLARE_DNS_TOKEN: "{{ .CLOUDFLARE_DNS_TOKEN }}"
  dataFrom:
    - extract:
        key: cloudflare



================================================
FILE: kubernetes/apps/base/cert-manager/cert-manager/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: cert-manager
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: v1.17.2
  url: oci://quay.io/jetstack/charts/cert-manager
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: cert-manager
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: cert-manager
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  valuesFrom:
    - kind: ConfigMap
      name: cert-manager-values



================================================
FILE: kubernetes/apps/base/cert-manager/cert-manager/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./clusterissuer.yaml
  - ./externalsecret.yaml
  - ./helmrelease.yaml
  - ./prometheusrule.yaml
configMapGenerator:
  - name: cert-manager-values
    files:
      - values.yaml=./helm/values.yaml
configurations:
  - ./helm/kustomizeconfig.yaml



================================================
FILE: kubernetes/apps/base/cert-manager/cert-manager/prometheusrule.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/monitoring.coreos.com/prometheusrule_v1.json
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: cert-manager-rules
spec:
  groups:
    - name: cert-manager.rules
      rules:
        - alert: CertManagerAbsent
          expr: |
            absent(up{job="cert-manager"})
          for: 5m
          annotations:
            summary: >-
              Cert Manager has dissapeared from Prometheus service discovery
          labels:
            severity: critical

    - name: certificates
      rules:
        - alert: CertManagerCertExpirySoon
          expr: |
            avg by (exported_namespace, namespace, name) (certmanager_certificate_expiration_timestamp_seconds - time()) < (21 * 24 * 3600)
          for: 5m
          annotations:
            summary: >-
              The cert {{ $labels.name }} is {{ $value | humanizeDuration }} from expiry, it should have renewed over a week ago
          labels:
            severity: critical

        - alert: CertManagerCertNotReady
          expr: |
            max by (name, exported_namespace, namespace, condition) (certmanager_certificate_ready_status{condition!="True"} == 1)
          for: 5m
          annotations:
            summary: >-
              The cert {{ $labels.name }} is not ready to serve traffic
          labels:
            severity: critical

        - alert: CertManagerHittingRateLimits
          expr: |
            sum by (host) (rate(certmanager_http_acme_client_request_count{status="429"}[5m])) > 0
          for: 5m
          annotations:
            summary: >-
              Cert manager hitting LetsEncrypt rate limits
          labels:
            severity: critical



================================================
FILE: kubernetes/apps/base/cert-manager/cert-manager/helm/kustomizeconfig.yaml
================================================
---
nameReference:
  - kind: ConfigMap
    version: v1
    fieldSpecs:
      - path: spec/valuesFrom/name
        kind: HelmRelease



================================================
FILE: kubernetes/apps/base/cert-manager/cert-manager/helm/values.yaml
================================================
---
crds:
  enabled: true
replicaCount: 1
dns01RecursiveNameservers: https://1.1.1.1:443/dns-query,https://1.0.0.1:443/dns-query
dns01RecursiveNameserversOnly: true
prometheus:
  enabled: true
  servicemonitor:
    enabled: true



================================================
FILE: kubernetes/apps/base/database/crunchy-postgres/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: pgo
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 5.8.2
  url: oci://registry.developers.crunchydata.com/crunchydata/pgo
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app crunchy-postgres-operator
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: pgo
  maxHistory: 2
  install:
    crds: CreateReplace
    remediation:
      retries: -1
  upgrade:
    crds: CreateReplace
    cleanupOnFail: true
    remediation:
      retries: 3
  uninstall:
    keepHistory: false
  values:
    monitoring: true
    install:
      clusterLabels:
        app.kubernetes.io/name: *app



================================================
FILE: kubernetes/apps/base/database/crunchy-postgres/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/database/dragonfly/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app dragonfly-operator
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      dragonfly-operator:
        strategy: RollingUpdate
        containers:
          app:
            image:
              repository: ghcr.io/dragonflydb/operator
              tag: v1.1.11@sha256:11cef45ec1079b9d97930fc99ecd08ba29d4eca55cdb45887cb0ac40ee4e4d24
            command: ["/manager"]
            args:
              - --health-probe-bind-address=:8081
              - --metrics-bind-address=:8080
            probes:
              liveness:
                enabled: true
                custom: true
                spec:
                  httpGet:
                    path: /healthz
                    port: &port 8081
                  initialDelaySeconds: 15
                  periodSeconds: 20
                  timeoutSeconds: 1
                  failureThreshold: 3
              readiness:
                enabled: true
                custom: true
                spec:
                  httpGet:
                    path: /readyz
                    port: *port
                  initialDelaySeconds: 5
                  periodSeconds: 10
                  timeoutSeconds: 1
                  failureThreshold: 3
            resources:
              requests:
                cpu: 10m
              limits:
                memory: 128Mi
            securityContext:
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities: { drop: ["ALL"] }
        serviceAccount:
          identifier: *app
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
        fsGroupChangePolicy: OnRootMismatch
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: *app
    service:
      app:
        controller: *app
        ports:
          http:
            port: *port
          metrics:
            port: 8080
    serviceAccount:
      dragonfly-operator: {}
    serviceMonitor:
      app:
        serviceName: *app
        endpoints:
          - port: metrics
            scheme: http
            path: /metrics
            interval: 1m
            scrapeTimeout: 10s



================================================
FILE: kubernetes/apps/base/database/dragonfly/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  # renovate: datasource=github-releases depName=dragonflydb/dragonfly-operator
  - https://raw.githubusercontent.com/dragonflydb/dragonfly-operator/v1.1.11/manifests/crd.yaml
  - ./helmrelease.yaml
  - ./rbac.yaml



================================================
FILE: kubernetes/apps/base/database/dragonfly/rbac.yaml
================================================
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: dragonfly-operator
rules:
  - apiGroups: ["coordination.k8s.io"]
    resources: ["leases"]
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
  - apiGroups: [""]
    resources: ["events"]
    verbs: ["create", "patch"]
  - apiGroups: [""]
    resources: ["pods", "services"]
    verbs: ["create", "delete", "get", "list", "patch", "update", "watch"]
  - apiGroups: ["apps"]
    resources: ["statefulsets"]
    verbs: ["create", "delete", "get", "list", "patch", "update", "watch"]
  - apiGroups: ["dragonflydb.io"]
    resources: ["dragonflies"]
    verbs: ["create", "delete", "get", "list", "patch", "update", "watch"]
  - apiGroups: ["dragonflydb.io"]
    resources: ["dragonflies/finalizers"]
    verbs: ["update"]
  - apiGroups: ["dragonflydb.io"]
    resources: ["dragonflies/status"]
    verbs: ["get", "patch", "update"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: dragonfly-operator
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: dragonfly-operator
subjects:
  - kind: ServiceAccount
    name: dragonfly-operator
    namespace: database



================================================
FILE: kubernetes/apps/base/downloads/bazarr/app/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name bazarr-secret
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        BAZARR__API_KEY: '{{ .BAZARR_API_KEY }}'
        PLEX_TOKEN: "{{ .PLEX_API_KEY }}"
  dataFrom:
  - extract:
      key: bazarr
  - extract:
      key: plex



================================================
FILE: kubernetes/apps/base/downloads/bazarr/app/helmrelease.yaml
================================================
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app bazarr
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      bazarr:
        labels:
          nfsMount: "true"
          postgres: "true"
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/joryirving/bazarr
              tag: 1.5.2@sha256:f717d75cbdfb1c6a76220f2b17e396cee4194356daa31159d119391a321662ad
            env:
              TZ: America/Edmonton
              POSTGRES_DATABASE: *app
              POSTGRES_ENABLED: "true"
              POSTGRES_HOST: bazarr-pgbouncer.downloads.svc
              POSTGRES_USERNAME: *app
              POSTGRES_PASSWORD:
                valueFrom:
                  secretKeyRef:
                    name: bazarr-pguser-bazarr
                    key: password
            envFrom:
              - secretRef:
                  name: bazarr-secret
            probes:
              liveness: &probes
                enabled: true
                custom: true
                spec:
                  httpGet:
                    path: /health
                    port: &port 6767
                  initialDelaySeconds: 0
                  periodSeconds: 10
                  timeoutSeconds: 1
                  failureThreshold: 3
              readiness: *probes
            securityContext: &securityContext
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities: { drop: ["ALL"] }
            resources:
              requests:
                cpu: 10m
              limits:
                memory: 4Gi
          subcleaner:
            image:
              repository: registry.k8s.io/git-sync/git-sync
              tag: v4.4.1@sha256:699b654e373f000c356756c24290a6dbb86500934b65ce6093fd92c434c61c6b
            env:
              GITSYNC_REPO: https://github.com/KBlixt/subcleaner
              GITSYNC_REF: master
              GITSYNC_PERIOD: 24h
              GITSYNC_ROOT: /add-ons
            resources:
              requests:
                cpu: 10m
              limits:
                memory: 128Mi
            securityContext: *securityContext
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
        fsGroup: 100
        fsGroupChangePolicy: OnRootMismatch
    service:
      app:
        controller: bazarr
        ports:
          http:
            port: *port
    route:
      app:
        annotations:
          gethomepage.dev/enabled: "true"
          gethomepage.dev/group: Downloads
          gethomepage.dev/name: Bazarr
          gethomepage.dev/icon: bazarr.png
          gethomepage.dev/description: Subtitle Downloads
          gethomepage.dev/widget.type: bazarr
          gethomepage.dev/widget.url: http://bazarr.downloads:6767
          gethomepage.dev/widget.key: "{{ `{{HOMEPAGE_VAR_BAZARR_TOKEN}}` }}"
        hostnames: ["{{ .Release.Name }}.jory.dev"]
        parentRefs:
          - name: internal
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      add-ons:
        type: emptyDir
      cache:
        type: emptyDir
        globalMounts:
          - path: /config/cache
      config:
        existingClaim: *app
      data:
        type: nfs
        server: voyager.internal
        path: /mnt/user/data
        globalMounts:
          - path: /data
      log:
        type: emptyDir
        globalMounts:
          - path: /config/log
      scripts:
        type: configMap
        name: bazarr-scripts
        defaultMode: 0775
        globalMounts:
          - readOnly: true
      tmp:
        type: emptyDir



================================================
FILE: kubernetes/apps/base/downloads/bazarr/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml
configMapGenerator:
  - name: bazarr-scripts
    files:
      - subcleaner.sh=./resources/subcleaner.sh
generatorOptions:
  disableNameSuffixHash: true



================================================
FILE: kubernetes/apps/base/downloads/bazarr/app/resources/subcleaner.sh
================================================
#!/usr/bin/env bash

printf "Cleaning subtitles for '%s' ...\n" "$1"
python3 /add-ons/subcleaner/subcleaner.py "$1" -s

case $1 in
    *anime*) section="1";;
    *movies*) section="2";;
    *shows*) section="3";;
esac

if [[ -n "$section" ]]; then
    printf "Refreshing Plex section '%s' for '%s' ...\n" "$section" "$(dirname "$1")"
    /usr/bin/curl -I -X GET -G \
        --data-urlencode "path=$(dirname "$1")" \
        --data-urlencode "X-Plex-Token=$PLEX_TOKEN" \
        --no-progress-meter \
            "http://plex.media.svc.cluster.local:32400/library/sections/$section/refresh"
fi



================================================
FILE: kubernetes/apps/base/downloads/bazarr/whisper/helmrelease.yaml
================================================
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app whisper
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      whisper:
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: onerahmet/openai-whisper-asr-webservice
              tag: v1.8.2@sha256:ce030954e4d0d6abad8f13e853b1c12745cc81f3e2ccef96d64fda927600f71a
            env:
              TZ: America/Edmonton
              ASR_MODEL: small # tiny, base, small, medium, large, large-v1, large-v2 and large-v3
              ASR_ENGINEL: faster_whisper # openai_whisper, faster_whisper
            resources:
              requests:
                cpu: 500m
                memory: 1Gi
              limits:
                memory: 12Gi
    # defaultPodOptions:
    #   securityContext:
    #     runAsNonRoot: true
    #     runAsUser: 1000
    #     runAsGroup: 100
    #     fsGroup: 100
    #     fsGroupChangePolicy: OnRootMismatch
    #     seccompProfile: { type: RuntimeDefault }
    service:
      app:
        controller: whisper
        ports:
          http:
            port: 9000
    persistence:
      cache:
        existingClaim: *app
        globalMounts:
          - path: /root/.cache/whisper



================================================
FILE: kubernetes/apps/base/downloads/bazarr/whisper/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml
  - ./pvc.yaml



================================================
FILE: kubernetes/apps/base/downloads/bazarr/whisper/pvc.yaml
================================================
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: whisper
spec:
  accessModes: ["ReadWriteOnce"]
  resources:
    requests:
      storage: 5Gi
  storageClassName: ceph-block



================================================
FILE: kubernetes/apps/base/downloads/dashbrr/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name dashbrr-secret
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        # App
        DASHBRR_RADARR_API_KEY: "{{ .RADARR_API_KEY }}"
        DASHBRR_SONARR_API_KEY: "{{ .SONARR_API_KEY }}"
        DASHBRR_PROWLARR_API_KEY: "{{ .PROWLARR_API_KEY }}"
        DASHBRR_JELLYSEERR_API_KEY: "{{ .JELLYSEERR_API_KEY }}"
        DASHBRR_MAINTAINERR_API_KEY: "{{ .MAINTAINERR_API_KEY }}"
        DASHBRR_PLEX_API_KEY: "{{ .PLEX_API_KEY }}"
        # OIDC
        OIDC_ISSUER: "https://sso.jory.dev/application/o/dashbrr/"
        OIDC_CLIENT_ID: "{{ .DASHBRR_CLIENT_ID }}"
        OIDC_CLIENT_SECRET: "{{ .DASHBRR_CLIENT_SECRET }}"
        OIDC_REDIRECT_URL: "https://dashbrr.jory.dev/api/auth/callback"
  dataFrom:
  - extract:
      key: radarr
  - extract:
      key: sonarr
  - extract:
      key: prowlarr
  - extract:
      key: jellyseerr
  - extract:
      key: maintainerr
  - extract:
      key: plex
  - extract:
      key: dashbrr



================================================
FILE: kubernetes/apps/base/downloads/dashbrr/helmrelease.yaml
================================================
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app dashbrr
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      dashbrr:
        labels:
          postgres: "true"
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/autobrr/dashbrr
              tag: pr-67
              # tag: v0.2.0@sha256:b3b898d4bf9b463bf802e7af188de45e6ca08eb96e828b4e9cbfde6e418441ad
            env:
              DASHBRR__CONFIG_PATH: /config/config.toml
              DASHBRR__DB_TYPE: postgres
              DASHBRR__DB_NAME: *app
              DASHBRR__DB_HOST: dashbrr-pgbouncer.downloads.svc
              DASHBRR__DB_USER: *app
              DASHBRR__DB_PASSWORD:
                valueFrom:
                  secretKeyRef:
                    name: dashbrr-pguser-dashbrr
                    key: password
              DASHBRR__DB_PORT: "5432"
              DASHBRR__DB_PATH: /cache/._ # cache path is derived from DASHBRR__DB_PATH
              DASHBRR__LISTEN_ADDR: 0.0.0.0:8080
              GIN_MODE: debug
              TZ: America/Edmonton
            envFrom:
              - secretRef:
                  name: dashbrr-secret
            probes:
              liveness: &probes
                enabled: true
                custom: true
                spec:
                  httpGet:
                    path: /health
                    port: &port 8080
                  initialDelaySeconds: 0
                  periodSeconds: 10
                  timeoutSeconds: 1
                  failureThreshold: 3
              readiness: *probes
            securityContext:
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities: { drop: ["ALL"] }
        serviceAccount:
          identifier: *app
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
        fsGroup: 100
        fsGroupChangePolicy: OnRootMismatch
    service:
      app:
        controller: *app
        ports:
          http:
            port: *port
    route:
      app:
        hostnames: ["{{ .Release.Name }}.jory.dev"]
        parentRefs:
          - name: internal
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    serviceAccount:
      dashbrr: {}
    persistence:
      cache:
        type: emptyDir
        sizeLimit: 1Gi
      config:
        type: configMap
        name: dashbrr-config



================================================
FILE: kubernetes/apps/base/downloads/dashbrr/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml
  - ./rbac.yaml
configMapGenerator:
  - name: dashbrr-config
    files:
      - ./resources/config.toml
    options:
      annotations:
        kustomize.toolkit.fluxcd.io/substitute: disabled
generatorOptions:
  disableNameSuffixHash: true



================================================
FILE: kubernetes/apps/base/downloads/dashbrr/rbac.yaml
================================================
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: dashbrr
rules:
  - apiGroups: [""]
    resources: ["services"]
    verbs: ["get", "watch", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: dashbrr
roleRef:
  kind: ClusterRole
  name: dashbrr
  apiGroup: rbac.authorization.k8s.io
subjects:
  - kind: ServiceAccount
    name: dashbrr
    namespace: downloads



================================================
FILE: kubernetes/apps/base/downloads/dashbrr/resources/config.toml
================================================



================================================
FILE: kubernetes/apps/base/downloads/flaresolverr/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app flaresolverr
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      flaresolverr:
        replicas: 2
        strategy: RollingUpdate
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/flaresolverr/flaresolverr
              tag: v3.3.21
            resources:
              requests:
                cpu: 15m
                memory: 150Mi
    service:
      app:
        controller: *app
        type: ClusterIP
        ports:
          http:
            port: 8191



================================================
FILE: kubernetes/apps/base/downloads/flaresolverr/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/downloads/kapowarr/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app kapowarr
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      kapowarr:
        labels:
          nfsMount: "true"
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: mrcas/kapowarr
              tag: v1.2.0@sha256:484f7decc7cc7af77542aba5516f48a62b17f72116ac7309d1709b72bb7d0ba2
            env:
              TZ: America/Edmonton
            resources:
              requests:
                cpu: 15m
                memory: 100M
              limits:
                memory: 1G
    service:
      app:
        controller: *app
        ports:
          http:
            port: &port 5656
    route:
      app:
        hostnames: ["{{ .Release.Name }}.jory.dev"]
        parentRefs:
          - name: internal
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      config:
        existingClaim: *app
        globalMounts:
          - path: /app/db
      data:
        type: nfs
        server: voyager.internal
        path: /mnt/user/data
        globalMounts:
          - path: /data



================================================
FILE: kubernetes/apps/base/downloads/kapowarr/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/downloads/metube/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app metube
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      metube:
        labels:
          nfsMount: "true"
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/alexta69/metube
              tag: "2024-01-26"
            env:
              DOWNLOAD_DIR: "/downloads"
              STATE_DIR: "/config"
              YTDL_OPTIONS: '{"http_headers":{"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0"}}'
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
        fsGroup: 100
        fsGroupChangePolicy: OnRootMismatch
    service:
      app:
        controller: *app
        ports:
          http:
            port: &port 8081
    route:
      app:
        hostnames: ["{{ .Release.Name }}.jory.dev"]
        parentRefs:
          - name: internal
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      config:
        existingClaim: *app
      downloads:
        type: nfs
        server: voyager.internal
        path: /mnt/user/data
        globalMounts:
          - path: /downloads
            subPath: metube



================================================
FILE: kubernetes/apps/base/downloads/metube/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/downloads/mylar/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app mylar
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      mylar:
        labels:
          nfsMount: "true"
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/linuxserver/mylar3
              tag: version-v0.8.2@sha256:6688b2beb3a48999bb7b6f63391a62d1e2620b2ddca9c6a371c18c42f826d51a
            env:
              TZ: America/Edmonton
              UID: 1000
              GID: 1000
            resources:
              requests:
                cpu: 15m
                memory: 700M
              limits:
                memory: 1200M
    # defaultPodOptions:
    #   securityContext:
    #     runAsNonRoot: true
    # runAsUser: 1000
    # runAsGroup: 100
    # fsGroup: 100
    #     fsGroupChangePolicy: OnRootMismatch
    #     seccompProfile: { type: RuntimeDefault }
    service:
      app:
        controller: *app
        ports:
          http:
            port: &port 8090
    route:
      app:
        hostnames: ["{{ .Release.Name }}.jory.dev"]
        parentRefs:
          - name: internal
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      config:
        existingClaim: *app
      data:
        type: nfs
        server: voyager.internal
        path: /mnt/user/data
        globalMounts:
          - path: /data



================================================
FILE: kubernetes/apps/base/downloads/mylar/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/downloads/prowlarr/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name prowlarr-secret
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        PROWLARR__AUTH__APIKEY: "{{ .PROWLARR_API_KEY }}"
  dataFrom:
  - extract:
      key: prowlarr



================================================
FILE: kubernetes/apps/base/downloads/prowlarr/helmrelease.yaml
================================================
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app prowlarr
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      prowlarr:
        labels:
          postgres: "true"
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/joryirving/prowlarr
              tag: 1.36.1.5049@sha256:a4a90d995908e38d14186d02441080a3122e54df184dacede7cc3880e5c80902
            env:
              TZ: America/Edmonton
              PROWLARR__APP__INSTANCENAME: Prowlarr
              PROWLARR__APP__THEME: dark
              PROWLARR__AUTH__METHOD: External
              PROWLARR__AUTH__REQUIRED: DisabledForLocalAddresses
              PROWLARR__LOG__DBENABLED: "False"
              PROWLARR__LOG__LEVEL: info
              PROWLARR__POSTGRES__HOST: prowlarr-pgbouncer.downloads.svc
              PROWLARR__POSTGRES__MAINDB: *app
              PROWLARR__POSTGRES__PASSWORD:
                valueFrom:
                  secretKeyRef:
                    name: prowlarr-pguser-prowlarr
                    key: password
              PROWLARR__POSTGRES__PORT: "5432"
              PROWLARR__POSTGRES__USER: *app
              PROWLARR__SERVER__PORT: &port 80
              PROWLARR__UPDATE__BRANCH: develop
            envFrom:
              - secretRef:
                  name: prowlarr-secret
            resources:
              requests:
                cpu: 100m
              limits:
                memory: 1Gi
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
        fsGroup: 100
        fsGroupChangePolicy: OnRootMismatch
    service:
      app:
        controller: *app
        ports:
          http:
            port: *port
    route:
      app:
        hostnames: ["{{ .Release.Name }}.jory.dev"]
        parentRefs:
          - name: internal
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      config:
        type: emptyDir
      tmp:
        type: emptyDir



================================================
FILE: kubernetes/apps/base/downloads/prowlarr/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/downloads/qbittorrent/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app qbittorrent
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      qbittorrent:
        labels:
          nfsMount: "true"
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/joryirving/qbittorrent
              tag: 5.1.0@sha256:0f5769e5f8e4e4d959265ba399d6077269ed3e084a5adb40c442e345a452151e
            env:
              TZ: America/Edmonton
              QBT_WEBUI_PORT: &port 80
              QBT_TORRENTING_PORT: &torrentPort 50413
            probes:
              liveness: &probes
                enabled: true
                # custom: true
                # spec:
                #   httpGet:
                #     path: /api/v2/app/version
                #     port: *port
                #   initialDelaySeconds: 0
                #   periodSeconds: 10
                #   timeoutSeconds: 1
                #   failureThreshold: 3
              readiness: *probes
              startup:
                enabled: true
                spec:
                  failureThreshold: 30
                  periodSeconds: 10
            securityContext:
              runAsUser: 1000
              runAsGroup: 100
              runAsNonRoot: true
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities: { drop: ["ALL"] }
            resources:
              requests:
                cpu: 25m
                memory: 1Gi
              limits:
                memory: 8Gi
    defaultPodOptions:
      terminationGracePeriodSeconds: 120
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: app.kubernetes.io/name
                      operator: In
                      values: ["sabnzbd"]
                topologyKey: kubernetes.io/hostname
    service:
      app:
        controller: *app
        type: LoadBalancer
        annotations:
          lbipam.cilium.io/ips: 10.69.10.36, ::ffff:10.69.10.36
        ports:
          http:
            primary: true
            port: *port
          bittorrent:
            enabled: true
            port: *torrentPort
            protocol: TCP
    route:
      app:
        hostnames:
          - "{{ .Release.Name }}.jory.dev"
          - qb.jory.dev
        parentRefs:
          - name: internal
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      config:
        existingClaim: *app
      downloads:
        type: nfs
        server: voyager.internal
        path: /mnt/user/data
        globalMounts:
          - path: /downloads
            subPath: torrents
      tmp:
        type: emptyDir



================================================
FILE: kubernetes/apps/base/downloads/qbittorrent/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/downloads/qbittorrent/tools/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app qbtools
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  dependsOn:
    - name: qbittorrent
  values:
    controllers:
      reannounce:
        containers:
          app: &container
            image:
              repository: ghcr.io/buroa/qbtools
              tag: v0.21.0@sha256:3a60f001c3f5fd068ff38960fbf9db726fa59edf135b18cd50294230366c284e
            env:
              TZ: America/Edmonton
              POD_NAMESPACE:
                valueFrom:
                  fieldRef:
                    fieldPath: metadata.namespace
            args:
              [
                "reannounce",
                "--process-seeding",
                "--server",
                "qbittorrent.$(POD_NAMESPACE).svc.cluster.local",
                "--port",
                "80",
              ]
            securityContext:
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities: { drop: ["ALL"] }
            resources:
              requests:
                cpu: 25m
              limits:
                memory: 256M
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
        fsGroupChangePolicy: OnRootMismatch



================================================
FILE: kubernetes/apps/base/downloads/qbittorrent/tools/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/downloads/radarr/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name radarr-secret
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        RADARR__AUTH__APIKEY: "{{ .RADARR_API_KEY }}"
  dataFrom:
  - extract:
      key: radarr



================================================
FILE: kubernetes/apps/base/downloads/radarr/helmrelease.yaml
================================================
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app radarr
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      radarr:
        labels:
          nfsMount: "true"
          postgres: "true"
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/joryirving/radarr
              tag: 5.23.1.9914@sha256:06a28388b537f95298ed2c7883793fe3abbf64a627c033c55b885ade67ba7c68
            env:
              RADARR__APP__INSTANCENAME: Radarr
              RADARR__APP__THEME: dark
              RADARR__AUTH__METHOD: External
              RADARR__AUTH__REQUIRED: DisabledForLocalAddresses
              RADARR__LOG__DBENABLED: "False"
              RADARR__LOG__LEVEL: info
              RADARR__POSTGRES__HOST: radarr-pgbouncer.downloads.svc
              RADARR__POSTGRES__MAINDB: *app
              RADARR__POSTGRES__PASSWORD:
                valueFrom:
                  secretKeyRef:
                    name: radarr-pguser-radarr
                    key: password
              RADARR__POSTGRES__PORT: "5432"
              RADARR__POSTGRES__USER: *app
              RADARR__SERVER__PORT: &port 80
              RADARR__UPDATE__BRANCH: develop
              TZ: America/Edmonton
            envFrom:
              - secretRef:
                  name: radarr-secret
            probes:
              liveness: &probes
                enabled: true
                custom: true
                spec:
                  httpGet:
                    path: /ping
                    port: *port
                  initialDelaySeconds: 0
                  periodSeconds: 10
                  timeoutSeconds: 1
                  failureThreshold: 3
              readiness: *probes
            securityContext:
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities: { drop: ["ALL"] }
            resources:
              requests:
                cpu: 100m
              limits:
                memory: 2Gi
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
        fsGroup: 100
        fsGroupChangePolicy: OnRootMismatch
    service:
      app:
        controller: *app
        ports:
          http:
            port: *port
    route:
      app:
        hostnames: ["{{ .Release.Name }}.jory.dev"]
        parentRefs:
          - name: internal
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      config:
        existingClaim: *app
      tmp:
        type: emptyDir
      data:
        type: nfs
        server: voyager.internal
        path: /mnt/user/data
        globalMounts:
          - path: /data



================================================
FILE: kubernetes/apps/base/downloads/radarr/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml
  - ./pvc.yaml



================================================
FILE: kubernetes/apps/base/downloads/radarr/pvc.yaml
================================================
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: radarr
spec:
  accessModes: ["ReadWriteMany"]
  resources:
    requests:
      storage: 5Gi
  storageClassName: ceph-filesystem



================================================
FILE: kubernetes/apps/base/downloads/readarr/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name readarr-secret
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        READARR__API_KEY: "{{ .READARR_API_KEY }}"
  dataFrom:
  - extract:
      key: readarr




================================================
FILE: kubernetes/apps/base/downloads/readarr/helmrelease.yaml
================================================
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app readarr
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      readarr:
        labels:
          nfsMount: "true"
          postgres: "true"
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/joryirving/readarr
              tag: 0.4.16.2793@sha256:d875350532daa77507e1edd20ff35c175b9331e50de59d28f3976e22ddea8855
            env:
              READARR__APP__INSTANCENAME: Readarr
              READARR__APP__THEME: dark
              READARR__AUTH__METHOD: External
              READARR__AUTH__REQUIRED: DisabledForLocalAddresses
              # READARR__LOG__DBENABLED: "False"
              READARR__LOG__LEVEL: info
              READARR__POSTGRES__CACHEDB: readarr_cache
              READARR__POSTGRES__HOST: readarr-pgbouncer.downloads.svc
              READARR__POSTGRES__LOGDB: readarr_log
              READARR__POSTGRES__MAINDB: *app
              READARR__POSTGRES__PASSWORD:
                valueFrom:
                  secretKeyRef:
                    name: readarr-pguser-readarr
                    key: password
              READARR__POSTGRES__PORT: "5432"
              READARR__POSTGRES__USER: *app
              READARR__SERVER__PORT: &port 80
              READARR__UPDATE__BRANCH: develop
              TZ: America/Edmonton
            envFrom:
              - secretRef:
                  name: readarr-secret
            resources:
              requests:
                cpu: 100m
              limits:
                memory: 1Gi
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
        fsGroup: 100
        fsGroupChangePolicy: OnRootMismatch
    service:
      app:
        controller: *app
        ports:
          http:
            port: *port
    route:
      app:
        hostnames: ["{{ .Release.Name }}.jory.dev"]
        parentRefs:
          - name: internal
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      config:
        existingClaim: *app
      tmp:
        type: emptyDir
      data:
        type: nfs
        server: voyager.internal
        path: /mnt/user/data
        globalMounts:
          - path: /data



================================================
FILE: kubernetes/apps/base/downloads/readarr/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml
  - ./pvc.yaml



================================================
FILE: kubernetes/apps/base/downloads/readarr/pvc.yaml
================================================
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: readarr
spec:
  accessModes: ["ReadWriteMany"]
  resources:
    requests:
      storage: 5Gi
  storageClassName: ceph-filesystem



================================================
FILE: kubernetes/apps/base/downloads/recyclarr/externalsecret.yaml
================================================
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name recyclarr-secret
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        # App
        RADARR_API_KEY: "{{ .RADARR_API_KEY }}"
        SONARR_API_KEY: "{{ .SONARR_API_KEY }}"
  dataFrom:
  - extract:
      key: radarr
  - extract:
      key: sonarr



================================================
FILE: kubernetes/apps/base/downloads/recyclarr/helmrelease.yaml
================================================
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app recyclarr
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      recyclarr:
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/recyclarr/recyclarr
              tag: 7.4.1@sha256:759540877f95453eca8a26c1a93593e783a7a824c324fbd57523deffb67f48e1
            env:
              TZ: America/Edmonton
            envFrom:
              - secretRef:
                  name: recyclarr-secret
            resources:
              requests:
                cpu: 10m
              limits:
                memory: 128Mi
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
        fsGroup: 100
        fsGroupChangePolicy: OnRootMismatch
    persistence:
      config:
        existingClaim: *app
      config-file:
        type: configMap
        name: recyclarr-configmap
        globalMounts:
          - path: /config/recyclarr.yml
            subPath: recyclarr.yml
            readOnly: true
      config-logs:
        type: emptyDir
        globalMounts:
          - path: /config/logs



================================================
FILE: kubernetes/apps/base/downloads/recyclarr/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml
configMapGenerator:
  - name: recyclarr-configmap
    files:
      - recyclarr.yml=./config/recyclarr.yml
generatorOptions:
  disableNameSuffixHash: true
  annotations:
    kustomize.toolkit.fluxcd.io/substitute: disabled



================================================
FILE: kubernetes/apps/base/downloads/recyclarr/config/recyclarr.yml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/recyclarr/recyclarr/master/schemas/config-schema.json
sonarr:
  sonarr:
    base_url: http://sonarr.downloads.svc.cluster.local
    api_key: !env_var SONARR_API_KEY

    # Custom Format Configuration
    delete_old_custom_formats: true
    replace_existing_custom_formats: true

    include:
      - template: sonarr-quality-definition-series
      - template: sonarr-v4-quality-profile-web-1080p
      - template: sonarr-v4-custom-formats-web-1080p
      - template: sonarr-v4-quality-profile-web-2160p
      - template: sonarr-v4-custom-formats-web-2160p
      - template: sonarr-v4-quality-profile-anime
      - template: sonarr-v4-custom-formats-anime

    quality_profiles:
      - name: WEB-1080p
      - name: ANY
        reset_unmatched_scores:
          enabled: true
        upgrade:
          allowed: true
          until_quality: WEB 1080p
          until_score: 10000
        quality_sort: top
        qualities:
          - name: WEB 1080p
            qualities: ["WEBDL-1080p", "WEBRip-1080p"]
          - name: HDTV-1080p
          - name: WEB 720p
            qualities: ["WEBDL-720p", "WEBRip-720p"]
          - name: HDTV-720p
          - name: WEB 480p
            qualities: ["WEBDL-480p", "WEBRip-480p"]
          - name: DVD
          - name: SDTV

    custom_formats:
      - trash_ids:
          - 32b367365729d530ca1c124a0b180c64 # Bad Dual Groups
          - 82d40da2bc6923f41e14394075dd4b03 # No-RlsGroup
          - e1a997ddb54e3ecbfe06341ad323c458 # Obfuscated
          - 06d66ab109d4d2eddb2794d21526d140 # Retags
        assign_scores_to:
          - name: WEB-2160p
          - name: WEB-1080p
          - name: ANY

      - trash_ids:
          - 1b3994c551cbb92a2c781af061f4ab44 # Scene
        assign_scores_to:
          - name: WEB-2160p
          - name: WEB-1080p
          - name: ANY
            score: 0

     # HDR Formats
      - trash_ids:
          - 9b27ab6498ec0f31a3353992e19434ca # DV (WEBDL)
          - 0dad0a507451acddd754fe6dc3a7f5e7 # HDR10+ Boost
          - 385e9e8581d33133c3961bdcdeffb7b4 # DV HDR10+ Boost
        assign_scores_to:
          - name: WEB-2160p

      - trash_ids:
          - 026d5aadd1a6b4e550b134cb6c72b3ca # Uncensored
        assign_scores_to:
          - name: Remux-1080p - Anime
            score: 0 # Adjust scoring as desired

      - trash_ids:
          - b2550eb333d27b75833e25b8c2557b38 # 10bit
        assign_scores_to:
          - name: Remux-1080p - Anime
            score: 0 # Adjust scoring as desired

      - trash_ids:
          - 418f50b10f1907201b6cfdf881f467b7 # Anime Dual Audio
        assign_scores_to:
          - name: Remux-1080p - Anime
            score: 0 # Adjust scoring as desired

radarr:
  radarr:
    base_url: http://radarr.downloads.svc.cluster.local
    api_key: !env_var RADARR_API_KEY

    # Custom Format Configuration
    delete_old_custom_formats: true
    replace_existing_custom_formats: true

    quality_definition:
      type: movie

    quality_profiles:
      - name: SQP-1 (1080p)
      - name: SQP-1 (2160p)

    include:
      - template: radarr-quality-definition-sqp-streaming
      - template: radarr-quality-profile-sqp-1-1080p
      - template: radarr-custom-formats-sqp-1-1080p
      - template: radarr-quality-profile-sqp-1-2160p-default
      - template: radarr-custom-formats-sqp-1-2160p
      - template: radarr-quality-profile-anime
      - template: radarr-custom-formats-anime

    custom_formats:
      - trash_ids:
          - 7a0d1ad358fee9f5b074af3ef3f9d9ef # HALLOWED
          - b6832f586342ef70d9c128d40c07b872 # Bad Dual Groups
          - 90cedc1fea7ea5d11298bebd3d1d3223 # EVO (no WEBDL)
          - ae9b7c9ebde1f3bd336a8cbd1ec4c5e5 # No-RlsGroup
          - 7357cf5161efbf8c4d5d0c30b4815ee2 # Obfuscated
          - 5c44f52a8714fdd79bb4d98e2673be1f # Retags
          - f537cf427b64c38c8e36298f657e4828 # Scene
        assign_scores_to:
          - name: SQP-1 (1080p)
          - name: SQP-1 (2160p)

      - trash_ids:
          - 839bea857ed2c0a8e084f3cbdbd65ecb # x265 (no HDR/DV)
        assign_scores_to:
          - name: SQP-1 (1080p)
          - name: SQP-1 (2160p)
            score: 0

      - trash_ids:
          - 064af5f084a0a24458cc8ecd3220f93f # Uncensored
        assign_scores_to:
          - name: Remux-1080p - Anime
            score: 0 # Adjust scoring as desired

      - trash_ids:
          - a5d148168c4506b55cf53984107c396e # 10bit
        assign_scores_to:
          - name: Remux-1080p - Anime
            score: 0 # Adjust scoring as desired

      - trash_ids:
          - 4a3b087eea2ce012fcc1ce319259a3be # Anime Dual Audio
        assign_scores_to:
          - name: Remux-1080p - Anime
            score: 0 # Adjust scoring as desired



================================================
FILE: kubernetes/apps/base/downloads/sabnzbd/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name sabnzbd-secret
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        # App
        SABNZBD__API_KEY: "{{ .SABNZBD_API_KEY }}"
        SABNZBD__NZB_KEY: "{{ .SABNZBD_NZB_KEY }}"
  dataFrom:
  - extract:
      key: sabnzbd




================================================
FILE: kubernetes/apps/base/downloads/sabnzbd/helmrelease.yaml
================================================
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app sabnzbd
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      sabnzbd:
        labels:
          nfsMount: "true"
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/joryirving/sabnzbd
              tag: 4.5.1@sha256:fcc2018550c061be2d6a539867e0b105c518d2743593f098efb91079663903ba
            env:
              TZ: America/Edmonton
              SABNZBD__PORT: &port 8080
              SABNZBD__HOST_WHITELIST_ENTRIES: >-
                sabnzbd,
                sabnzbd.downloads,
                sabnzbd.downloads.svc,
                sabnzbd.downloads.svc.cluster,
                sabnzbd.downloads.svc.cluster.local,
                sab.jory.dev,
                sabnzbd.jory.dev
            envFrom:
              - secretRef:
                  name: sabnzbd-secret
            probes:
              liveness: &probes
                enabled: true
                custom: true
                spec:
                  httpGet:
                    path: /api?mode=version
                    port: *port
                  initialDelaySeconds: 0
                  periodSeconds: 10
                  timeoutSeconds: 1
                  failureThreshold: 3
              readiness: *probes
            resources:
              requests:
                cpu: 10m
                memory: 100Mi
              limits:
                memory: 12Gi
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
        fsGroup: 100
        fsGroupChangePolicy: OnRootMismatch
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: app.kubernetes.io/name
                      operator: In
                      values: ["qbittorrent"]
                topologyKey: kubernetes.io/hostname
    service:
      app:
        controller: *app
        ports:
          http:
            port: *port
    route:
      app:
        hostnames:
          - "{{ .Release.Name }}.jory.dev"
          - sab.jory.dev
        parentRefs:
          - name: internal
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      config:
        existingClaim: *app
      downloads:
        type: nfs
        server: voyager.internal
        path: /mnt/user/data
        globalMounts:
          - path: /downloads
            subPath: usenet



================================================
FILE: kubernetes/apps/base/downloads/sabnzbd/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/downloads/sonarr/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name sonarr-secret
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        SONARR__AUTH__APIKEY: "{{ .SONARR_API_KEY }}"
  dataFrom:
  - extract:
      key: sonarr



================================================
FILE: kubernetes/apps/base/downloads/sonarr/helmrelease.yaml
================================================
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app sonarr
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      sonarr:
        labels:
          nfsMount: "true"
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/joryirving/sonarr
              tag: 4.0.14.2939@sha256:ee146b26b14f58ef235c74ff29ba95f20b632d903c75b7f567930b5421997775
            env:
              SONARR__APP__INSTANCENAME: Sonarr
              SONARR__APP__THEME: dark
              SONARR__AUTH__METHOD: External
              SONARR__AUTH__REQUIRED: DisabledForLocalAddresses
              SONARR__LOG__DBENABLED: "False"
              SONARR__LOG__LEVEL: info
              SONARR__POSTGRES__HOST: sonarr-pgbouncer.downloads.svc
              SONARR__POSTGRES__MAINDB: *app
              SONARR__POSTGRES__PASSWORD:
                valueFrom:
                  secretKeyRef:
                    name: sonarr-pguser-sonarr
                    key: password
              SONARR__POSTGRES__PORT: "5432"
              SONARR__POSTGRES__USER: *app
              SONARR__SERVER__PORT: &port 80
              SONARR__UPDATE__BRANCH: develop
              TZ: America/Edmonton
            envFrom:
              - secretRef:
                  name: sonarr-secret
            probes:
              liveness: &probes
                enabled: true
                custom: true
                spec:
                  httpGet:
                    path: /ping
                    port: *port
                  initialDelaySeconds: 0
                  periodSeconds: 10
                  timeoutSeconds: 1
                  failureThreshold: 3
              readiness: *probes
            securityContext:
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities: { drop: ["ALL"] }
            resources:
              requests:
                cpu: 100m
              limits:
                memory: 2Gi
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
        fsGroup: 100
        fsGroupChangePolicy: OnRootMismatch
    service:
      app:
        controller: *app
        ports:
          http:
            port: *port
    route:
      app:
        hostnames: ["{{ .Release.Name }}.jory.dev"]
        parentRefs:
          - name: internal
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      config:
        existingClaim: *app
      tmp:
        type: emptyDir
      data:
        type: nfs
        server: voyager.internal
        path: /mnt/user/data
        globalMounts:
          - path: /data



================================================
FILE: kubernetes/apps/base/downloads/sonarr/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml
  - ./pvc.yaml



================================================
FILE: kubernetes/apps/base/downloads/sonarr/pvc.yaml
================================================
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: sonarr
spec:
  accessModes: ["ReadWriteMany"]
  resources:
    requests:
      storage: 5Gi
  storageClassName: ceph-filesystem



================================================
FILE: kubernetes/apps/base/downloads/webhook/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name webhook
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        SONARR_API_KEY: "{{ .SONARR_API_KEY }}"
  dataFrom:
    - extract:
        key: sonarr



================================================
FILE: kubernetes/apps/base/downloads/webhook/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app webhook
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      webhook:
        replicas: 2
        strategy: RollingUpdate
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/home-operations/webhook
              tag: 2.8.2@sha256:a83bc6517267db655efdef8ebd4a9e6719558f6dadb9bc1e325b7083a83119c7
            env:
              WEBHOOK__PORT: &port 80
              TZ: America/Edmonton
            envFrom:
              - secretRef:
                  name: *app
            securityContext:
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities: { drop: ["ALL"] }
            resources:
              requests:
                cpu: 100m
              limits:
                memory: 256Mi
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 1000
        fsGroup: 1000
        fsGroupChangePolicy: OnRootMismatch
    service:
      app:
        controller: webhook
        ports:
          http:
            port: *port
    route:
      app:
        hostnames: ["{{ .Release.Name }}.jory.dev"]
        parentRefs:
          - name: internal
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      config:
        type: configMap
        name: webhook-configmap
        defaultMode: 0775
        globalMounts:
          - readOnly: true



================================================
FILE: kubernetes/apps/base/downloads/webhook/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml
configMapGenerator:
  - name: webhook-configmap
    files:
      - hooks.yaml=./resources/hooks.yaml
      - sonarr-refresh-series.sh=./resources/sonarr-refresh-series.sh
      - sonarr-tag-codecs.sh=./resources/sonarr-tag-codecs.sh
generatorOptions:
  disableNameSuffixHash: true
  annotations:
    kustomize.toolkit.fluxcd.io/substitute: disabled



================================================
FILE: kubernetes/apps/base/downloads/webhook/resources/hooks.yaml
================================================
---
- id: sonarr-refresh-series
  execute-command: /config/sonarr-refresh-series.sh
  command-working-directory: /config
  pass-environment-to-command:
    - envname: SONARR_REMOTE_ADDR
      source: request
      name: remote-addr
    - envname: SONARR_API_KEY
      source: string
      name: '{{ getenv "SONARR_API_KEY" }}'
    - envname: SONARR_EVENT_TYPE
      source: payload
      name: eventType
    - envname: SONARR_SERIES_ID
      source: payload
      name: series.id
    - envname: SONARR_SERIES_TITLE
      source: payload
      name: series.title

- id: sonarr-tag-codecs
  execute-command: /config/sonarr-tag-codecs.sh
  command-working-directory: /config
  pass-environment-to-command:
    - envname: SONARR_REMOTE_ADDR
      source: request
      name: remote-addr
    - envname: SONARR_API_KEY
      source: string
      name: '{{ getenv "SONARR_API_KEY" }}'
    - envname: SONARR_EVENT_TYPE
      source: payload
      name: eventType
    - envname: SONARR_SERIES_ID
      source: payload
      name: series.id
    - envname: SONARR_SERIES_TITLE
      source: payload
      name: series.title



================================================
FILE: kubernetes/apps/base/downloads/webhook/resources/sonarr-refresh-series.sh
================================================
#!/usr/bin/env bash
set -Eeuo pipefail

# Remove the port from the IP address since Sonarr listens on port 80
SONARR_REMOTE_ADDR=${SONARR_REMOTE_ADDR%%:*}

function refresh() {
    if [[ "${SONARR_EVENT_TYPE}" == "Test" ]]; then
        echo "[DEBUG] test event received from ${SONARR_REMOTE_ADDR}, nothing to do ..."
    elif [[ "${SONARR_EVENT_TYPE}" == "Grab" ]]; then
        episodes=$(
            curl -fsSL --header "X-Api-Key: ${SONARR_API_KEY}" "http://${SONARR_REMOTE_ADDR}/api/v3/episode?seriesId=${SERIES_ID}" |
                jq --raw-output '[.[] | select((.title == "TBA") or (.title == "TBD"))] | length'
        )
        if ((episodes > 0)); then
            echo "[INFO] episode titles found with TBA/TBD titles, refreshing series ${SONARR_SERIES_TITLE} ..."
            curl -fsSL --request POST \
                --header "X-Api-Key: ${SONARR_API_KEY}" \
                --header "Content-Type: application/json" \
                --data-binary "$(jo name=RefreshSeries seriesId="${SERIES_ID}")" \
                "http://${SONARR_REMOTE_ADDR}/api/v3/command" &>/dev/null
        fi
    fi
}

function main() {
    refresh
}

main "$@"



================================================
FILE: kubernetes/apps/base/downloads/webhook/resources/sonarr-tag-codecs.sh
================================================
#!/usr/bin/env bash
set -Eeuo pipefail

# Remove the port from the IP address since Sonarr listens on port 80
SONARR_REMOTE_ADDR=${SONARR_REMOTE_ADDR%%:*}

# Cache existing tags once at the start
declare -A TAG_CACHE

# Function to cache existing tags
function cache_existing_tags() {
    existing_tags_cache=$(curl -fsSL --header "X-Api-Key: ${SONARR_API_KEY}" "http://${SONARR_REMOTE_ADDR}/api/v3/tag")
    while IFS=":" read -r id label; do
        TAG_CACHE["$id"]="$label"
    done < <(echo "${existing_tags_cache}" | jq --raw-output '.[] | "\(.id):\(.label)"')
}

# Function to get codec tags for a series
function get_codec_tags() {
    local series_id=$1

    # Extract and map codecs in one pass
    local codecs
    codecs=$(
        curl -fsSL --header "X-Api-Key: ${SONARR_API_KEY}" "http://${SONARR_REMOTE_ADDR}/api/v3/episodefile?seriesId=${series_id}" | jq --raw-output '
        [
            .[] |
            (.mediaInfo.videoCodec // "other" |
            gsub("x"; "h") | ascii_downcase |
            if test("hevc") then "h265"
            elif test("divx|mpeg2|xvid") then "h264"
            elif test("av1") then "av1"
            elif test("h264|h265") then . else "other" end
            ) | "codec:" + .
        ] | unique | .[]'
    )

    echo "${codecs[@]}"
}

# Function to check if a tag exists, if not create it and return the tag ID
function get_or_create_tag_id() {
    local tag_label=$1
    local tag_id

    # Search cached tags
    tag_id=$(echo "${existing_tags_cache}" | jq --raw-output ".[] | select(.label == \"${tag_label}\") | .id")

    # If tag doesn't exist, create it
    if [[ -z "${tag_id}" ]]; then
        local new_tag
        new_tag=$(curl -fsSL --request POST --header "X-Api-Key: ${SONARR_API_KEY}" --header "Content-Type: application/json" --data "$(jo label="${tag_label}")" "http://${SONARR_REMOTE_ADDR}/api/v3/tag")
        tag_id=$(echo "${new_tag}" | jq --raw-output '.id')

        # Update cache
        existing_tags_cache=$(echo "${existing_tags_cache}" | jq ". += [{\"id\": ${tag_id}, \"label\": \"${tag_label}\"}]")
        TAG_CACHE["$tag_id"]="${tag_label}"
    fi

    echo "${tag_id}"
}

# Function to update series tags in bulk
function update_series_tags() {
    local series_data="$1"
    local codecs="$2"

    # Get the current series tags
    local series_tags
    series_tags=$(echo "$series_data" | jq --raw-output '.tags')

    # Track tags to add/remove
    local tags_to_add=()
    local tags_to_remove=()

    # Identify tags to add
    for codec in $codecs; do
        local tag_id
        tag_id=$(get_or_create_tag_id "${codec}")
        if ! echo "${series_tags}" | jq --exit-status ". | index(${tag_id})" &>/dev/null; then
            tags_to_add+=("$tag_id")
        fi
    done

    # Identify tags to remove
    for tag_id in $(echo "${series_tags}" | jq --raw-output '.[]'); do
        local tag_label="${TAG_CACHE[$tag_id]}"
        if [[ -n "${tag_label}" && ! " ${codecs} " =~ ${tag_label} ]] && [[ "${tag_label}" =~ codec:.* ]]; then
            tags_to_remove+=("$tag_id")
        fi
    done

    if [[ ${#tags_to_add[@]} -gt 0 ]]; then
        series_data=$(echo "${series_data}" | jq --argjson add_tags "$(printf '%s\n' "${tags_to_add[@]}" | jq --raw-input . | jq --slurp 'map(tonumber)')" '.tags = (.tags + $add_tags | unique)')
    fi

    if [[ ${#tags_to_remove[@]} -gt 0 ]]; then
        series_data=$(echo "${series_data}" | jq --argjson remove_tags "$(printf '%s\n' "${tags_to_remove[@]}" | jq --raw-input . | jq --slurp 'map(tonumber)')" '.tags |= map(select(. as $tag | $remove_tags | index($tag) | not))')
    fi

    echo "${series_data}"
}

function tag() {
    if [[ "${SONARR_EVENT_TYPE}" == "Test" ]]; then
        echo "[DEBUG] test event received from ${SONARR_REMOTE_ADDR}, nothing to do ..."
    elif [[ "${SONARR_EVENT_TYPE}" == "Download" ]]; then
        cache_existing_tags

        local orig_series_data
        orig_series_data=$(curl -fsSL --header "X-Api-Key: ${SONARR_API_KEY}" "http://${SONARR_REMOTE_ADDR}/api/v3/series/${SONARR_SERIES_ID}")

        local series_episode_file_count
        series_episode_file_count=$(echo "${orig_series_data}" | jq --raw-output '.statistics.episodeFileCount')

        if [[ "${series_episode_file_count}" == "null" || "${series_episode_file_count}" -eq 0 ]]; then
            echo "Skipping ${SONARR_SERIES_TITLE} (ID: ${SONARR_SERIES_ID}) due to no episode files"
            exit 0
        fi

        # Get unique codecs for the series
        local codecs
        codecs=$(get_codec_tags "${SONARR_SERIES_ID}")

        # Update the series tags
        local updated_series_data
        updated_series_data=$(update_series_tags "${orig_series_data}" "${codecs}")

        local orig_tags updated_tags
        orig_tags=$(echo "${orig_series_data}" | jq --compact-output '.tags')
        updated_tags=$(echo "${updated_series_data}" | jq --compact-output '.tags')

        if [[ "${orig_tags}" == "${updated_tags}" ]]; then
            echo "[INFO] skipping ${SONARR_SERIES_TITLE} (ID: ${SONARR_SERIES_ID}, Tags: [${codecs//$'\n'/,}]) due to no changes"
            exit 0
        fi

        echo "[INFO] updating ${SONARR_SERIES_TITLE} (ID: ${SONARR_SERIES_ID}, Tags: [${codecs//$'\n'/,}])"

        curl -fsSL --header "X-Api-Key: ${SONARR_API_KEY}" \
            --request PUT \
            --header "Content-Type: application/json" \
            --data "${updated_series_data}" "http://${SONARR_REMOTE_ADDR}/api/v3/series" &>/dev/null
    fi
}

function main() {
    tag
}

main "$@"



================================================
FILE: kubernetes/apps/base/external-secrets/README.md
================================================
# external-secrets

## NAS Deployments

### onepassword-connect

```yaml
services:
  onepassword-connect-api:
    container_name: onepassword-connect-api
    environment:
      OP_HTTP_PORT: 7070
      OP_SESSION: <credentials.json>
      XDG_DATA_HOME: /config
    image: docker.io/1password/connect-api:1.7.3
    network_mode: host
    restart: unless-stopped
    volumes:
      - data:/config
  onepassword-connect-sync:
    container_name: onepassword-connect-sync
    environment:
      OP_HTTP_PORT: 7071
      OP_SESSION: <credentials.json>
      XDG_DATA_HOME: /config
    image: docker.io/1password/connect-sync:1.7.3
    network_mode: host
    restart: unless-stopped
    volumes:
      - data:/config
volumes:
  data:
    driver: local
    driver_opts:
      device: tmpfs
      o: uid=999,gid=999
      type: tmpfs
```



================================================
FILE: kubernetes/apps/base/external-secrets/clustersecretstore.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/clustersecretstore_v1.json
apiVersion: external-secrets.io/v1
kind: ClusterSecretStore
metadata:
  name: &app onepassword
spec:
  provider:
    onepassword:
      connectHost: http://voyager.internal:7070
      vaults:
        Kubernetes: 1
      auth:
        secretRef:
          connectTokenSecretRef:
            name: *app
            key: token
            namespace: external-secrets



================================================
FILE: kubernetes/apps/base/external-secrets/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: external-secrets
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 0.17.0
  url: oci://ghcr.io/external-secrets/charts/external-secrets
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: external-secrets
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: external-secrets
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  valuesFrom:
    - kind: ConfigMap
      name: external-secrets-values



================================================
FILE: kubernetes/apps/base/external-secrets/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./clustersecretstore.yaml
  - ./helmrelease.yaml
configMapGenerator:
  - name: external-secrets-values
    files:
      - values.yaml=./helm/values.yaml
configurations:
  - ./helm/kustomizeconfig.yaml



================================================
FILE: kubernetes/apps/base/external-secrets/helm/kustomizeconfig.yaml
================================================
---
nameReference:
  - kind: ConfigMap
    version: v1
    fieldSpecs:
      - path: spec/valuesFrom/name
        kind: HelmRelease



================================================
FILE: kubernetes/apps/base/external-secrets/helm/values.yaml
================================================
---
installCRDs: true
crds:
  conversion:
    enabled: false
replicaCount: 1
leaderElect: true
image:
  repository: ghcr.io/external-secrets/external-secrets
webhook:
  image:
    repository: ghcr.io/external-secrets/external-secrets
  serviceMonitor:
    enabled: true
    interval: 1m
certController:
  image:
    repository: ghcr.io/external-secrets/external-secrets
  serviceMonitor:
    enabled: true
    interval: 1m
serviceMonitor:
  enabled: true
  interval: 1m
grafanaDashboard:
  enabled: true



================================================
FILE: kubernetes/apps/base/flux-system/addons/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name github-webhook-token
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        token: "{{ .FLUX_${CLUSTER^^}_GITHUB_WEBHOOK_TOKEN }}"
  dataFrom:
    - extract:
        key: flux



================================================
FILE: kubernetes/apps/base/flux-system/addons/httproute.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/gateway.networking.k8s.io/httproute_v1.json
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: github-webhook
spec:
  hostnames: ["${SUBDOMAIN}.jory.dev"]
  parentRefs:
    - name: external
      namespace: kube-system
      sectionName: https
  rules:
    - backendRefs:
        - name: webhook-receiver
          namespace: flux-system
          port: 80
      matches:
        - path:
            type: PathPrefix
            value: /hook/



================================================
FILE: kubernetes/apps/base/flux-system/addons/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./httproute.yaml
  - ./receiver.yaml



================================================
FILE: kubernetes/apps/base/flux-system/addons/receiver.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/notification.toolkit.fluxcd.io/receiver_v1.json
apiVersion: notification.toolkit.fluxcd.io/v1
kind: Receiver
metadata:
  name: github-webhook
spec:
  type: github
  events: ["ping", "push"]
  secretRef:
    name: github-webhook-token
  resources:
    - apiVersion: source.toolkit.fluxcd.io/v1
      kind: GitRepository
      name: flux-system
    - apiVersion: kustomize.toolkit.fluxcd.io/v1
      kind: Kustomization
      name: flux-system



================================================
FILE: kubernetes/apps/base/flux-system/flux-operator/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: flux-operator
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 0.20.0
  url: oci://ghcr.io/controlplaneio-fluxcd/charts/flux-operator
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: flux-operator
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: flux-operator
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  valuesFrom:
    - kind: ConfigMap
      name: flux-operator-values



================================================
FILE: kubernetes/apps/base/flux-system/flux-operator/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml
configMapGenerator:
  - name: flux-operator-values
    files:
      - values.yaml=./helm/values.yaml
configurations:
  - ./helm/kustomizeconfig.yaml



================================================
FILE: kubernetes/apps/base/flux-system/flux-operator/helm/kustomizeconfig.yaml
================================================
---
nameReference:
  - kind: ConfigMap
    version: v1
    fieldSpecs:
      - path: spec/valuesFrom/name
        kind: HelmRelease



================================================
FILE: kubernetes/apps/base/flux-system/flux-operator/helm/values.yaml
================================================
---
serviceMonitor:
  create: true



================================================
FILE: kubernetes/apps/base/flux-system/headlamp/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name headlamp-secret
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        # OIDC
        OIDC_ISSUER_URL: "https://sso.jory.dev/application/o/headlamp/"
        OIDC_CLIENT_ID: "{{ .HEADLAMP_CLIENT_ID }}"
        OIDC_CLIENT_SECRET: "{{ .HEADLAMP_CLIENT_SECRET }}"
        OIDC_SCOPES: "openid email profile"
  dataFrom:
  - extract:
      key: headlamp



================================================
FILE: kubernetes/apps/base/flux-system/headlamp/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: headlamp
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 0.30.1
  url: oci://ghcr.io/home-operations/charts-mirror/headlamp
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app headlamp
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: headlamp
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    podAnnotations:
      reloader.stakater.com/auto: "true"
    fullnameOverride: headlamp
    initContainers:
      - image: ghcr.io/headlamp-k8s/headlamp-plugin-flux:v0.2.0@sha256:6727bb58c95feef9f62f8fe125c244601d31ca62eab546b0f88c045560ed33de
        command:
          - /bin/sh
          - -c
          - mkdir -p /build/plugins && cp -r /plugins/* /build/plugins/
        name: headlamp-plugins
        volumeMounts:
          - mountPath: /build/plugins
            name: headlamp-plugins
    config:
      pluginsDir: /build/plugins
    serviceAccount:
      create: false
      name: headlamp-admin
    clusterRoleBinding:
      create: false
    volumeMounts:
      - mountPath: /build/plugins
        name: headlamp-plugins
    volumes:
      - name: headlamp-plugins
        emptyDir: {}



================================================
FILE: kubernetes/apps/base/flux-system/headlamp/httproute.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/gateway.networking.k8s.io/httproute_v1.json
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: headlamp
spec:
  hostnames: ["${GATUS_SUBDOMAIN}.jory.dev"]
  parentRefs:
    - name: internal
      namespace: kube-system
      sectionName: https
  rules:
    - backendRefs:
        - name: headlamp
          namespace: flux-system
          port: 80



================================================
FILE: kubernetes/apps/base/flux-system/headlamp/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml
  - ./httproute.yaml
  - ./pushsecret.yaml
  - ./rbac.yaml



================================================
FILE: kubernetes/apps/base/flux-system/headlamp/pushsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/pushsecret_v1alpha1.json
apiVersion: external-secrets.io/v1alpha1
kind: PushSecret
metadata:
  name: &name ${CLUSTER}-headlamp-admin
spec:
  secretStoreRefs:
    - name: onepassword
      kind: ClusterSecretStore
  selector:
    secret:
      name: headlamp-admin
  template:
    engineVersion: v2
    data:
      password: '{{.token}}'
  data:
    - match:
        secretKey: token
        remoteRef:
          remoteKey: *name
          property: password



================================================
FILE: kubernetes/apps/base/flux-system/headlamp/rbac.yaml
================================================
---
### Token Auth
apiVersion: v1
kind: ServiceAccount
metadata:
  name: headlamp-admin
  namespace: flux-system
automountServiceAccountToken: true
---
apiVersion: v1
kind: Secret
metadata:
  name: &name headlamp-admin
  namespace: flux-system
  annotations:
    kubernetes.io/service-account.name: *name
type: kubernetes.io/service-account-token
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: &name headlamp-admin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: *name
    namespace: flux-system



================================================
FILE: kubernetes/apps/base/flux-system/tofu-controller/controller/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name terraform-backend-secret
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        access_key: "{{ .MINIO_ACCESS_KEY }}"
        secret_key: "{{ .MINIO_SECRET_KEY }}"
  dataFrom:
  - extract:
      key: minio
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name terraform-secret
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        OP_CONNECT_TOKEN: "{{ .OP_CONNECT_TOKEN }}"
        OP_CONNECT_HOST: "http://voyager.internal:7070"
  dataFrom:
  - extract:
      key: 1password



================================================
FILE: kubernetes/apps/base/flux-system/tofu-controller/controller/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: tofu-controller
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 0.16.0-rc.5
  url: oci://ghcr.io/flux-iac/charts/tofu-controller
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: tofu-controller
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: tofu-controller
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    runner:
      image:
        repository: ghcr.io/joryirving/opentofu-runner
        tag: 1.9.1@sha256:eda3c7de95b5208ebc9f349b3a7d0edb4551cf43eca3203d5abf973a101f31e7
    metrics:
      enabled: true
      serviceMonitor:
        enabled: true
        interval: 1m



================================================
FILE: kubernetes/apps/base/flux-system/tofu-controller/controller/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/flux-system/tofu-controller/terraform/authentik.yaml
================================================
apiVersion: infra.contrib.fluxcd.io/v1alpha2
kind: Terraform
metadata:
  name: authentik
spec:
  interval: 12h
  approvePlan: auto
  backendConfig:
    customConfiguration: |
      backend "s3" {
        bucket   = "terraform-state"
        key      = "authentik/authentik.tfstate"
        region   = "main"
        endpoints = {
          s3 = "https://s3.jory.dev"
        }

        skip_credentials_validation = true
        skip_requesting_account_id  = true
        skip_metadata_api_check     = true
        skip_region_validation      = true
        use_path_style              = true
      }
  backendConfigsFrom:
  - kind: Secret
    name: terraform-backend-secret
  path: ./authentik
  sourceRef:
    kind: OCIRepository
    name: terraform
  varsFrom:
  - kind: Secret
    name: terraform-secret



================================================
FILE: kubernetes/apps/base/flux-system/tofu-controller/terraform/kustomization.yaml
================================================
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
- ./authentik.yaml
- ./minio.yaml
- ./ocirepository.yaml



================================================
FILE: kubernetes/apps/base/flux-system/tofu-controller/terraform/minio.yaml
================================================
apiVersion: infra.contrib.fluxcd.io/v1alpha2
kind: Terraform
metadata:
  name: minio
spec:
  interval: 12h
  approvePlan: auto
  backendConfig:
    customConfiguration: |
      backend "s3" {
        bucket = "terraform-state"
        key    = "minio/minio.tfstate"
        region   = "main"
        endpoints = {
          s3 = "https://s3.jory.dev"
        }

        skip_credentials_validation = true
        skip_requesting_account_id  = true
        skip_metadata_api_check     = true
        skip_region_validation      = true
        use_path_style              = true
      }
  backendConfigsFrom:
  - kind: Secret
    name: terraform-backend-secret
  path: ./minio
  sourceRef:
    kind: OCIRepository
    name: terraform
  varsFrom:
  - kind: Secret
    name: terraform-secret



================================================
FILE: kubernetes/apps/base/flux-system/tofu-controller/terraform/ocirepository.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: terraform
spec:
  interval: 1m
  url: oci://ghcr.io/joryirving/manifests/terraform
  ref:
    tag: main



================================================
FILE: kubernetes/apps/base/games/core-keeper/dnsendpoint.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/externaldns.k8s.io/dnsendpoint_v1alpha1.json
apiVersion: externaldns.k8s.io/v1alpha1
kind: DNSEndpoint
metadata:
  name: core-keeper
spec:
  endpoints:
    - dnsName: "core-keeper.jory.dev"
      recordType: CNAME
      targets: ["ipv4.jory.dev"]
      providerSpecific:
        - name: external-dns.alpha.kubernetes.io/cloudflare-proxied
          value: 'false'



================================================
FILE: kubernetes/apps/base/games/core-keeper/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name core-keeper-secret
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        DISCORD_HOOK: "{{ .DISCORD_WEBHOOK }}"
        GAME_ID: "{{ .GAME_ID }}" # Game ID to use for the server. Need to be at least 23 characters and alphanumeric, excluding Y,y,x,0,O. Empty or not valid means a new ID will be generated at start.
  dataFrom:
  - extract:
      key: core-keeper



================================================
FILE: kubernetes/apps/base/games/core-keeper/helmrelease.yaml
================================================
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app core-keeper
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      core-keeper:
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: escaping/core-keeper-dedicated
              tag: latest #yuck
            env:
              ## Container Settings
              TZ: America/Edmonton
              # WORLD_INDEX: "0" # Which world index to use.
              WORLD_NAME: Noods Core Keeper # The name to use for the server.
              # WORLD_SEED: "0" # The seed to use for a new world. Set to 0 to generate random seed.
              DATA_PATH: &datapath /home/steam/core-keeper-data # Save file location. If not set it defaults to a sub-folder named "DedicatedServer" at the default Core Keeper save location.
              MAX_PLAYERS: "8" # Maximum number of players that will be allowed to connect to server.
              DISCORD: "1" # Enables discord webhook features witch sends GameID to a channel.
              SEASON: "0" # Enables Seasonal Events. 0 is default, 1 is Easter, 2 is Halloween, 3 is Christmas.
              # SERVER_IP: 0.0.0.0 # Only used if port is set. Sets the address that the server will bind to.
              # SERVER_PORT: &port "27015" # What port to bind to. If not set, then the server will use the Steam relay network. If set the clients will connect to the server directly and the port needs to be open.
            envFrom:
              - secretRef:
                  name: core-keeper-secret
            probes:
              liveness: &disabled
                enabled: false
              readiness: *disabled
              startup: *disabled
            resources:
              requests:
                cpu: 1000m
              limits:
                memory: 8Gi
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 1000
        fsGroup: 1000
        fsGroupChangePolicy: OnRootMismatch
    # service:
    #   app:
    #     controller: *app
    #     type: LoadBalancer
    #     annotations:
    #       lbipam.cilium.io/ips: 10.69.10.37, ::ffff:10.69.10.37
    #     ports:
    #       game:
    #         protocol: UDP
    #         port: *port
    # route:
    #   app:
    #     hostnames: ["{{ .Release.Name }}.jory.dev"]
    #     parentRefs:
    #       - name: external
    #         namespace: kube-system
    #         sectionName: https
    #     rules:
    #       - backendRefs:
    #           - name: *app
    #             port: *port
    persistence:
      config:
        existingClaim: *app
        globalMounts:
          - path: *datapath
      files:
        existingClaim: core-keeper-server-files
        globalMounts:
          - path: /home/steam/core-keeper-dedicated



================================================
FILE: kubernetes/apps/base/games/core-keeper/kustomization.yaml
================================================
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./dnsendpoint.yaml
  - ./externalsecret.yaml
  - ./helmrelease.yaml
  - ./pvc.yaml



================================================
FILE: kubernetes/apps/base/games/core-keeper/pvc.yaml
================================================
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: core-keeper-server-files
spec:
  accessModes: ["ReadWriteOnce"]
  resources:
    requests:
      storage: 5Gi
  storageClassName: ceph-block



================================================
FILE: kubernetes/apps/base/games/minecraft/create/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name minecraft-create
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        RCON_PASSWORD: "{{ .RCON_PASSWORD }}"
  dataFrom:
  - extract:
      key: minecraft



================================================
FILE: kubernetes/apps/base/games/minecraft/create/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: minecraft
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 4.26.3
  url: oci://ghcr.io/itzg/minecraft-server-charts/minecraft
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app minecraft-create
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: minecraft
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    fullnameOverride: *app
    image:
      repository: ghcr.io/itzg/minecraft-server
      tag: 2025.4.2@sha256:b4b149e64bfec97dd61fcbf2269643344691898e16a328b71492e79a571392a9
    resources:
      requests:
        cpu: 200m
      limits:
        cpu: 2000m
        memory: 4Gi
    securityContext:
      runAsUser: 1000
      fsGroup: 100
    livenessProbe:
      initialDelaySeconds: 30
    readinessProbe:
      initialDelaySeconds: 30
    startupProbe:
        enabled: true
    extraEnv:
      TZ: America/Edmonton
    persistence:
      dataDir:
        enabled: true
        existingClaim: *app
    serviceAnnotations:
      mc-router.itzg.me/externalServerName: create.jory.dev
    minecraftServer:
      eula: true
      version: 1.20.1
      type: FORGE
      overrideServerProperties: true
      jvmXXOpts: "-XX:MaxRAMPercentage=75"
      difficulty: normal
      spawnProtection: 0
      gameMode: survival
      pvp: false
      onlineMode: true
      #whitelist: "LilDrunkenSmurf"
      ops: "LilDrunkenSmurf"
      motd: "Create Server test"
      worldSaveName: create
      viewDistance: 12
      modUrls:
      - "https://edge.forgecdn.net/files/4835/191/create-1.20.1-0.5.1.f.jar?api-key=267C6CA3"
      # spigetResources:
      # - 36618 #Prom Exporter
      rcon:
        enabled: true
  valuesFrom:
  - kind: Secret
    name: *app
    valuesKey: RCON_PASSWORD
    targetPath: minecraftServer.rcon.password



================================================
FILE: kubernetes/apps/base/games/minecraft/create/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/games/minecraft/mc-router/dnsendpoint.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/externaldns.k8s.io/dnsendpoint_v1alpha1.json
apiVersion: externaldns.k8s.io/v1alpha1
kind: DNSEndpoint
metadata:
  name: mc-router
spec:
  endpoints:
    - dnsName: "mc.jory.dev"
      recordType: CNAME
      targets: ["ipv4.jory.dev"]
      providerSpecific:
        - name: external-dns.alpha.kubernetes.io/cloudflare-proxied
          value: 'false'



================================================
FILE: kubernetes/apps/base/games/minecraft/mc-router/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: mc-router
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 1.4.0
  url: oci://ghcr.io/itzg/minecraft-server-charts/mc-router
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: mc-router
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: mc-router
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    image:
      repository: ghcr.io/itzg/mc-router
      tag: 1.31.0@sha256:9fd018170e5717aace41b34a8c74841ec2e1f46214472dc281142e2436a6514d
      pullPolicy: IfNotPresent
    services:
      minecraft:
        type: LoadBalancer
        annotations:
          lbipam.cilium.io/ips: 10.69.10.40, ::ffff:10.69.10.40
          external-dns.alpha.kubernetes.io/hostname: mc.jory.dev



================================================
FILE: kubernetes/apps/base/games/minecraft/mc-router/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./dnsendpoint.yaml
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/games/minecraft/takocraft/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name minecraft-takocraft
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        RCON_PASSWORD: "{{ .RCON_PASSWORD }}"
  dataFrom:
  - extract:
      key: minecraft



================================================
FILE: kubernetes/apps/base/games/minecraft/takocraft/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: minecraft-takocraft
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 4.26.3
  url: oci://ghcr.io/itzg/minecraft-server-charts/minecraft
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app minecraft-takocraft
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: minecraft-takocraft
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    fullnameOverride: *app
    image:
      repository: ghcr.io/itzg/minecraft-server
      tag: 2025.4.2@sha256:b4b149e64bfec97dd61fcbf2269643344691898e16a328b71492e79a571392a9
    resources:
      requests:
        cpu: 200m
      limits:
        cpu: 2000m
        memory: 4Gi
    securityContext:
      runAsUser: 1000
      fsGroup: 100
    livenessProbe:
      initialDelaySeconds: 30
    readinessProbe:
      initialDelaySeconds: 30
    startupProbe:
        enabled: true
    extraEnv:
      TZ: America/Edmonton
    persistence:
      dataDir:
        enabled: true
        existingClaim: *app
    serviceAnnotations:
      mc-router.itzg.me/externalServerName: takocraft.jory.dev
    minecraftServer:
      eula: true
      version: 1.21.4
      type: PAPER
      overrideServerProperties: true
      jvmXXOpts: "-XX:MaxRAMPercentage=75"
      difficulty: normal
      spawnProtection: 0
      gameMode: survival
      pvp: false
      onlineMode: true
      #whitelist: "LilDrunkenSmurf"
      ops: "LilDrunkenSmurf"
      motd: "Takocraft. This is the old Vibecraft"
      worldSaveName: takocraft
      viewDistance: 12
      spigetResources:
      - 36618 #Prom Exporter
      rcon:
        enabled: true
  valuesFrom:
  - kind: Secret
    name: *app
    valuesKey: RCON_PASSWORD
    targetPath: minecraftServer.rcon.password



================================================
FILE: kubernetes/apps/base/games/minecraft/takocraft/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/games/minecraft/vibecraft/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name minecraft-vibecraft
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        RCON_PASSWORD: "{{ .RCON_PASSWORD }}"
  dataFrom:
  - extract:
      key: minecraft



================================================
FILE: kubernetes/apps/base/games/minecraft/vibecraft/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: minecraft
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 4.26.3
  url: oci://ghcr.io/itzg/minecraft-server-charts/minecraft
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app minecraft-vibecraft
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: minecraft
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    fullnameOverride: *app
    image:
      repository: ghcr.io/itzg/minecraft-server
      tag: 2025.4.2@sha256:b4b149e64bfec97dd61fcbf2269643344691898e16a328b71492e79a571392a9
    resources:
      requests:
        cpu: 200m
      limits:
        cpu: 2000m
        memory: 4Gi
    securityContext:
      runAsUser: 1000
      fsGroup: 100
    livenessProbe:
      initialDelaySeconds: 30
    readinessProbe:
      initialDelaySeconds: 30
    startupProbe:
        enabled: true
    extraEnv:
      TZ: America/Edmonton
    persistence:
      dataDir:
        enabled: true
        existingClaim: *app
    serviceAnnotations:
      mc-router.itzg.me/externalServerName: vibecraft.jory.dev
    minecraftServer:
      eula: true
      version: 1.21
      type: SPIGOT
      overrideServerProperties: true
      jvmXXOpts: "-XX:MaxRAMPercentage=75"
      difficulty: normal
      spawnProtection: 0
      gameMode: survival
      pvp: false
      onlineMode: true
      #whitelist: "LilDrunkenSmurf"
      ops: "LilDrunkenSmurf"
      motd: "Vibecraft. Come hang out and Vibe"
      worldSaveName: Vibecraft
      viewDistance: 12
      spigetResources:
      - 36618 #Prom Exporter
      rcon:
        enabled: true
  valuesFrom:
  - kind: Secret
    name: *app
    valuesKey: RCON_PASSWORD
    targetPath: minecraftServer.rcon.password



================================================
FILE: kubernetes/apps/base/games/minecraft/vibecraft/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/games/palworld/dnsendpoint.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/externaldns.k8s.io/dnsendpoint_v1alpha1.json
apiVersion: externaldns.k8s.io/v1alpha1
kind: DNSEndpoint
metadata:
  name: palworld
spec:
  endpoints:
    - dnsName: "palworld.jory.dev"
      recordType: CNAME
      targets: ["ipv4.jory.dev"]
      providerSpecific:
        - name: external-dns.alpha.kubernetes.io/cloudflare-proxied
          value: 'false'



================================================
FILE: kubernetes/apps/base/games/palworld/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name palworld-secret
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        SERVER_PASSWORD: "{{ .SERVER_PASSWORD }}"
        ADMIN_PASSWORD: &rcon-password "{{ .ADMIN_PASSWORD }}"
        RCON_PASSWORD: *rcon-password
        WEBHOOK_URL: "{{ .DISCORD_WEBHOOK }}"
  dataFrom:
  - extract:
      key: palworld



================================================
FILE: kubernetes/apps/base/games/palworld/helmrelease.yaml
================================================
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app palworld
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      palworld:
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/jammsen/docker-palworld-dedicated-server
              tag: master@sha256:cbf760546bce4e40d195029ccb3ca3357e8074424d53ebe3cb81744a7c15467e
            env:
              ## Container Settings
              TZ: America/Edmonton
              ALWAYS_UPDATE_ON_START: true
              BACKUP_ENABLED: false #volsync is backing up the PVC
              RESTART_ENABLED: false #no one is playing right now.
              RESTART_CRON_EXPRESSION: 0 5 * * * #5am daily
              MULTITHREAD_ENABLED: true
              COMMUNITY_SERVER: false
              SERVER_SETTINGS_MODE: auto
              ## Server Gameplay Settings
              DEATH_PENALTY: None
              BASE_CAMP_WORKER_MAXNUM: 20
              PAL_EGG_DEFAULT_HATCHING_TIME: "2.000000" #Default for Normal Mode
              ENABLE_NON_LOGIN_PENALTY: false
              ## Server Settings
              SERVER_NAME: Platonically Pals
              SERVER_DESCRIPTION: Smurf's Palworld. Come in, have a tako!
              PUBLIC_PORT: &port 8211
              RCON_ENABLED: true
              RCON_PORT: &rcon-port 25575
              PUBLIC_IP: palworld.jory.dev
              ## Webhook Settings
              WEBHOOK_ENABLED: true
            envFrom:
              - secretRef:
                  name: palworld-secret
            probes:
              liveness: &disabled
                enabled: false
              readiness: *disabled
              startup: *disabled
            resources:
              requests:
                cpu: 1000m
              limits:
                memory: 24Gi
          exporter:
            image:
              repository: docker.io/bostrt/palworld-exporter
              tag: v1.3.1
            env:
              ## Container Settings
              TZ: America/Edmonton
              RCON_HOST: localhost
              RCON_PORT: *rcon-port
              SAVE_DIRECTORY: /palworld
            envFrom:
              - secretRef:
                  name: palworld-secret
            resources:
              limits:
                memory: 256Mi
              requests:
                cpu: 5m
            securityContext:
              allowPrivilegeEscalation: false
              capabilities: { drop: ["ALL"] }
        # pod:
        #   securityContext:
        #     runAsUser: 1000
        #     runAsGroup: 1000
        #     fsGroup: 1000
        #     fsGroupChangePolicy: OnRootMismatch
    service:
      app:
        controller: *app
        type: LoadBalancer
        annotations:
          lbipam.cilium.io/ips: 10.69.10.39, ::ffff:10.69.10.39
        ports:
          http:
            port: 9877
          game:
            protocol: UDP
            port: *port
          rcon:
            port: *rcon-port
    serviceMonitor:
      app:
        serviceName: *app
        endpoints:
          - port: http
            scheme: http
            path: /metrics
            interval: 1m
            scrapeTimeout: 10s
    route:
      app:
        annotations:
          external-dns.alpha.kubernetes.io/target: ipv4.jory.dev
        hostnames: ["{{ .Release.Name }}.jory.dev"]
        parentRefs:
          - name: external
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      config:
        existingClaim: *app
        globalMounts:
          - path: /palworld
      cache:
        existingClaim: palworld-cache
        globalMounts:
          - path: /palworld/Pal/Binaries
            subPath: binaries
          - path: /palworld/Pal/Content
            subPath: content
      tmp:
        type: emptyDir



================================================
FILE: kubernetes/apps/base/games/palworld/kustomization.yaml
================================================
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./dnsendpoint.yaml
  - ./externalsecret.yaml
  - ./helmrelease.yaml
  - ./pvc.yaml



================================================
FILE: kubernetes/apps/base/games/palworld/pvc.yaml
================================================
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: palworld-cache
spec:
  accessModes: ["ReadWriteOnce"]
  resources:
    requests:
      storage: 15Gi
  storageClassName: ceph-block



================================================
FILE: kubernetes/apps/base/games/vrising/dnsendpoint.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/externaldns.k8s.io/dnsendpoint_v1alpha1.json
apiVersion: externaldns.k8s.io/v1alpha1
kind: DNSEndpoint
metadata:
  name: vrising
spec:
  endpoints:
    - dnsName: "vrising.jory.dev"
      recordType: CNAME
      targets: ["ipv4.jory.dev"]
      providerSpecific:
        - name: external-dns.alpha.kubernetes.io/cloudflare-proxied
          value: 'false'



================================================
FILE: kubernetes/apps/base/games/vrising/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name vrising-secret
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        VR_DESCRIPTION: "{{ .VR_DESCRIPTION }}"
        VR_LOWER_FPS_WHEN_EMPTY: "{{ .VR_LOWER_FPS_WHEN_EMPTY }}"
        VR_PASSWORD: "{{ .VR_PASSWORD }}"
        VR_SERVER_NAME: "{{ .VR_SERVER_NAME }}"
        VR_SECURE: "{{ .VR_SECURE }}"
        SERVERNAME: "{{ .VR_SERVER_NAME }}"
  dataFrom:
  - extract:
      key: vrising



================================================
FILE: kubernetes/apps/base/games/vrising/helmrelease.yaml
================================================
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app vrising
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      vrising:
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: trueosiris/vrising
              tag: 2.1
            env:
              ## Container Settings
              TZ: America/Edmonton
              SERVERNAME: "Smurf-Rising"
              GAMEPORT: &game 9876
              QUERYPORT: &query 9877
              MAX_USERS: 4
              MAX_ADMIN: 2
              UID: &uid 1000
              GID: &gid 1000
            # envFrom:
            # - secretRef:
            #     name: vrising-secret
            probes:
              liveness:
                enabled: false
              readiness:
                enabled: false
              startup:
                enabled: false
            resources:
              requests:
                cpu: 1
              limits:
                memory: 10Gi
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: *uid
        runAsGroup: *gid
        fsGroup: *gid
        fsGroupChangePolicy: OnRootMismatch
    service:
      app:
        controller: *app
        type: LoadBalancer
        annotations:
          lbipam.cilium.io/ips: 10.69.10.33, ::ffff:10.69.10.33
        ports:
          game:
            enabled: true
            port: *game
            protocol: UDP
          query:
            enabled: true
            port: *query
            protocol: UDP
    persistence:
      config:
        existingClaim: *app
        globalMounts:
          - path: /mnt/vrising/persistentdata
      server:
        existingClaim: vrising-server-files
        globalMounts:
          - path: /mnt/vrising/server



================================================
FILE: kubernetes/apps/base/games/vrising/kustomization.yaml
================================================
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./dnsendpoint.yaml
  # - ./externalsecret.yaml
  - ./helmrelease.yaml
  - ./pvc.yaml



================================================
FILE: kubernetes/apps/base/games/vrising/pvc.yaml
================================================
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: vrising-server-files
spec:
  accessModes: ["ReadWriteOnce"]
  resources:
    requests:
      storage: 5Gi
  storageClassName: ceph-block



================================================
FILE: kubernetes/apps/base/games/vrising/ServerHostSettings.json
================================================
﻿{
  "Name": "V Rising Server",
  "Description": "",
  "Port": 9876,
  "QueryPort": 9877,
  "MaxConnectedUsers": 40,
  "MaxConnectedAdmins": 4,
  "ServerFps": 30,
  "SaveName": "world1",
  "Password": "",
  "Secure": true,
  "ListOnSteam": false,
  "ListOnEOS": false,
  "AutoSaveCount": 20,
  "AutoSaveInterval": 120,
  "CompressSaveFiles": true,
  "GameSettingsPreset": "",
  "GameDifficultyPreset": "",
  "AdminOnlyDebugEvents": true,
  "DisableDebugEvents": false,
  "API": {
    "Enabled": false
  },
  "Rcon": {
    "Enabled": false,
    "Port": 25575,
    "Password": ""
  }



================================================
FILE: kubernetes/apps/base/home-automation/home-assistant/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app home-assistant
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      home-assistant:
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/joryirving/home-assistant
              tag: 2025.5.1@sha256:76582e21c038e6182771d40e825ffc5e7234a63c59296afdc1bef22597f6fac9
            env:
              TZ: America/Edmonton
            securityContext:
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities: { drop: ["ALL"] }
            resources:
              requests:
                cpu: 10m
                memory: 250Mi
              limits:
                memory: 2Gi
          codeserver:
            image:
              repository: ghcr.io/coder/code-server
              tag: 4.100.2@sha256:0c31654f1125c3a685a42ed1f2946573f5ebaaf016c5bc0640c72f9f571267e0
            env:
              TZ: America/Edmonton
            args:
              [
                "--auth",
                "none",
                "--user-data-dir",
                "/config/.vscode",
                "--extensions-dir",
                "/config/.vscode",
                "--port",
                "12321",
                "/config",
              ]
            resources:
              requests:
                cpu: 10m
              limits:
                memory: 512Mi
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
        fsGroup: 100
        fsGroupChangePolicy: OnRootMismatch
    service:
      app:
        controller: *app
        type: LoadBalancer
        annotations:
          lbipam.cilium.io/ips: 10.69.10.133, ::ffff:10.69.10.133
        ports:
          http:
            port: &port 8123
          codeserver:
            port: &codeserverPort 12321
    route:
      app:
        hostnames:
          - "{{ .Release.Name }}.jory.dev"
          - hass.jory.dev
        parentRefs:
          - name: external
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
      codeserver:
        hostnames: ["hass-code.jory.dev"]
        parentRefs:
          - name: internal
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *codeserverPort
    persistence:
      config:
        existingClaim: *app
        globalMounts:
          - path: /config
      logs:
        type: emptyDir
        globalMounts:
          - path: /config/logs
      tts:
        type: emptyDir
        globalMounts:
          - path: /config/tts
      tmp:
        type: emptyDir
        globalMounts:
          - path: /tmp
      venv:
        type: emptyDir
        globalMounts:
          - path: /config/.venv



================================================
FILE: kubernetes/apps/base/home-automation/home-assistant/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/home-automation/mosquitto/claim.yaml
================================================
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mosquitto
spec:
  accessModes: ["ReadWriteOnce"]
  resources:
    requests:
      storage: 1Gi
  storageClassName: local-hostpath



================================================
FILE: kubernetes/apps/base/home-automation/mosquitto/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name mosquitto
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        username: "{{ .MQTT_USERNAME }}"
        password: "{{ .MQTT_PASSWORD }}"
        mosquitto_pwd: |
          {{ .MQTT_USERNAME }}:{{ .MQTT_PASSWORD }}
  dataFrom:
  - extract:
      key: mqtt



================================================
FILE: kubernetes/apps/base/home-automation/mosquitto/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app mosquitto
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      mosquitto:
        annotations:
          reloader.stakater.com/auto: "true"
        initContainers:
          init-config:
            image:
              repository: public.ecr.aws/docker/library/eclipse-mosquitto
              tag: 2.0.21
              pullPolicy: IfNotPresent
            command: ["/bin/sh", "-c"]
            args:
              [
                "cp /tmp/secret/* /mosquitto/external_config/ && mosquitto_passwd -U /mosquitto/external_config/mosquitto_pwd",
              ]
        containers:
          app:
            image:
              repository: public.ecr.aws/docker/library/eclipse-mosquitto
              tag: 2.0.21
            resources:
              requests:
                cpu: 5m
              limits:
                memory: 16Mi
            securityContext:
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities: { drop: ["ALL"] }
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
        fsGroup: 100
        fsGroupChangePolicy: OnRootMismatch
    service:
      app:
        controller: *app
        type: LoadBalancer
        annotations:
          external-dns.alpha.kubernetes.io/hostname: mqtt.jory.dev
          lbipam.cilium.io/ips: 10.69.10.134, ::ffff:10.69.10.134
        ports:
          http:
            port: 1883
    persistence:
      data:
        existingClaim: mosquitto
      config-file:
        type: configMap
        name: mosquitto-configmap # overriden by kustomizeconfig
        advancedMounts:
          mosquitto:
            app:
              - path: /mosquitto/config/mosquitto.conf
                subPath: mosquitto.conf
      secret-file:
        type: secret
        name: mosquitto
        advancedMounts:
          mosquitto:
            init-config:
              - path: /tmp/secret
      external-config:
        type: emptyDir
        globalMounts:
          - path: /mosquitto/external_config



================================================
FILE: kubernetes/apps/base/home-automation/mosquitto/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./claim.yaml
  - ./externalsecret.yaml
  - ./helmrelease.yaml
configMapGenerator:
  - name: mosquitto-configmap
    files:
      - mosquitto.conf=./config/mosquitto.conf
configurations:
  - ./patches/kustomizeconfig.yaml



================================================
FILE: kubernetes/apps/base/home-automation/mosquitto/config/mosquitto.conf
================================================
per_listener_settings false
listener 1883
allow_anonymous false
persistence true
persistence_location /data
autosave_interval 1800
connection_messages false
autosave_interval 60
password_file /mosquitto/external_config/mosquitto_pwd



================================================
FILE: kubernetes/apps/base/home-automation/mosquitto/patches/kustomizeconfig.yaml
================================================
---
nameReference:
  - kind: ConfigMap
    version: v1
    fieldSpecs:
      - path: spec/values/persistence/config-file/name
        kind: HelmRelease



================================================
FILE: kubernetes/apps/base/home-automation/rtlamr2mqtt/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name rtlamr2mqtt
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        rtlamr2mqtt.yaml: |
          general:
            sleep_for: 0
            verbosity: debug
            tickle_rtl_tcp: false
            device_id: 0bda:2838
          mqtt:
            host: mosquitto.home-automation.svc.cluster.local
            port: 1883
            tls_enabled: false
            user: "{{ .MQTT_USERNAME }}"
            password: "{{ .MQTT_PASSWORD }}"
            ha_autodiscovery: true
            ha_autodiscovery_topic: homeassistant
            base_topic: rtlamr
          custom_parameters:
            rtltcp: -s 2048000
            rtlamr: -unique=true -symbollength=32
          meters:
            - id: "{{ .RTLAMR2MQTT_METER_ID }}"
              protocol: scm
              name: home_energy_meter
              format: "######"
              unit_of_measurement: kWh
              icon: mdi:gauge
              device_class: energy
  dataFrom:
    - extract:
        key: mqtt
    - extract:
        key: rtlamr2mqtt



================================================
FILE: kubernetes/apps/base/home-automation/rtlamr2mqtt/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app rtlamr2mqtt
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  dependsOn:
    - name: mosquitto
      namespace: home-automation
  values:
    controllers:
      rtlamr2mqtt:
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: docker.io/allangood/rtlamr2mqtt
              tag: 2.3.4@sha256:101b036a73f48e55ddfaf40762f83696a059db3dbaf00ebbd387e72a1c9eeb54
            securityContext:
              privileged: true
            resources:
              requests:
                cpu: 10m
              limits:
                memory: 256Mi
    defaultPodOptions:
      nodeSelector:
        kubernetes.io/hostname: celestia
    persistence:
      config-file:
        type: secret
        name: *app
        globalMounts:
          - path: /etc/rtlamr2mqtt.yaml
            subPath: rtlamr2mqtt.yaml
            readOnly: true



================================================
FILE: kubernetes/apps/base/home-automation/rtlamr2mqtt/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/home-automation/zigbee/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name zigbee
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        # App
        ZIGBEE2MQTT_CONFIG_ADVANCED_EXT_PAN_ID: "{{ .ZIGBEE2MQTT_CONFIG_ADVANCED_EXT_PAN_ID }}"
        ZIGBEE2MQTT_CONFIG_ADVANCED_PAN_ID: "{{ .ZIGBEE2MQTT_CONFIG_ADVANCED_PAN_ID }}"
        ZIGBEE2MQTT_CONFIG_ADVANCED_NETWORK_KEY: "{{ .ZIGBEE2MQTT_CONFIG_ADVANCED_NETWORK_KEY }}"
        # Mosquitto
        ZIGBEE2MQTT_CONFIG_MQTT_USER: "{{ .MQTT_USERNAME }}"
        ZIGBEE2MQTT_CONFIG_MQTT_PASSWORD: "{{ .MQTT_PASSWORD }}"
  dataFrom:
    - extract:
        key: mqtt
    - extract:
        key: zigbee2mqtt



================================================
FILE: kubernetes/apps/base/home-automation/zigbee/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app zigbee
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  dependsOn:
    - name: mosquitto
      namespace: home-automation
  values:
    controllers:
      zigbee:
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/koenkk/zigbee2mqtt
              tag: 2.3.0@sha256:42de8c55dc578a8404a18c43aeb2b7c75be7988179abe9a8195d99a9e7ebb917
            env:
              TZ: America/Edmonton
              ZIGBEE2MQTT_DATA: /config
              ZIGBEE2MQTT_CONFIG_ADVANCED_LAST_SEEN: ISO_8601
              ZIGBEE2MQTT_CONFIG_ADVANCED_LOG_LEVEL: info # debug
              ZIGBEE2MQTT_CONFIG_ADVANCED_LOG_OUTPUT: '["console"]'
              ZIGBEE2MQTT_CONFIG_ADVANCED_TRANSMIT_POWER: 20
              ZIGBEE2MQTT_CONFIG_AVAILABILITY_ACTIVE_TIMEOUT: 60
              ZIGBEE2MQTT_CONFIG_AVAILABILITY_PASSIVE_TIMEOUT: 2000
              ZIGBEE2MQTT_CONFIG_DEVICE_OPTIONS_RETAIN: true
              ZIGBEE2MQTT_CONFIG_EXPERIMENTAL_NEW_API: true
              ZIGBEE2MQTT_CONFIG_FRONTEND_PORT: &port 8080
              ZIGBEE2MQTT_CONFIG_HOMEASSISTANT_DISCOVERY_TOPIC: homeassistant
              ZIGBEE2MQTT_CONFIG_HOMEASSISTANT_ENABLED: true
              ZIGBEE2MQTT_CONFIG_HOMEASSISTANT_STATUS_TOPIC: homeassistant/status
              ZIGBEE2MQTT_CONFIG_MQTT_INCLUDE_DEVICE_INFORMATION: true
              ZIGBEE2MQTT_CONFIG_MQTT_KEEPALIVE: 60
              ZIGBEE2MQTT_CONFIG_MQTT_REJECT_UNAUTHORIZED: true
              ZIGBEE2MQTT_CONFIG_MQTT_SERVER: mqtt://mosquitto
              ZIGBEE2MQTT_CONFIG_MQTT_VERSION: 5
              ZIGBEE2MQTT_CONFIG_PERMIT_JOIN: false
              ZIGBEE2MQTT_CONFIG_SERIAL_BAUDRATE: 115200
              ZIGBEE2MQTT_CONFIG_SERIAL_DISABLE_LED: false
              ZIGBEE2MQTT_CONFIG_SERIAL_PORT: tcp://slzb.internal:6638
              ZIGBEE2MQTT_CONFIG_SERIAL_ADAPTER: ember
            envFrom:
              - secretRef:
                  name: zigbee
            probes:
              liveness:
                enabled: true
              readiness:
                enabled: true
              startup:
                enabled: true
                spec:
                  failureThreshold: 30
                  periodSeconds: 10
            resources:
              requests:
                cpu: 10m
              limits:
                memory: 256Mi
            securityContext:
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities: { drop: ["ALL"] }
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
        fsGroup: 100
        fsGroupChangePolicy: OnRootMismatch
    service:
      app:
        controller: *app
        ports:
          http:
            port: *port
    route:
      app:
        hostnames: ["{{ .Release.Name }}.jory.dev"]
        parentRefs:
          - name: internal
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      config:
        existingClaim: *app
      logs:
        type: emptyDir
        globalMounts:
          - path: /config/log



================================================
FILE: kubernetes/apps/base/home-automation/zigbee/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/kube-system/cilium/README.md
================================================
# Cilium

## UniFi BGP

```sh
router bgp 64513
  bgp router-id 192.168.1.1
  no bgp ebgp-requires-policy

  neighbor k8s.main peer-group
  neighbor k8s.main remote-as 64514

  neighbor k8s.utility peer-group
  neighbor k8s.utility remote-as 64515

  neighbor 10.69.1.21 peer-group k8s.main
  neighbor 10.69.1.22 peer-group k8s.main
  neighbor 10.69.1.23 peer-group k8s.main
  neighbor 10.69.1.121 peer-group k8s.utility

  address-family ipv4 unicast
    neighbor k8s.main next-hop-self
    neighbor k8s.main soft-reconfiguration inbound
    neighbor k8s.utility next-hop-self
    neighbor k8s.utility soft-reconfiguration inbound
  exit-address-family
exit
```



================================================
FILE: kubernetes/apps/base/kube-system/cilium/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: cilium
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 1.17.4
  url: oci://ghcr.io/home-operations/charts-mirror/cilium
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: cilium
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: cilium
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  uninstall:
    keepHistory: false
  valuesFrom:
    - kind: ConfigMap
      name: cilium-values
  values:
    cluster:
      id: 1
      name: ${CLUSTER}
    hubble:
      enabled: true
      metrics:
        enabled:
          - dns:query
          - drop
          - tcp
          - flow
          - port-distribution
          - icmp
          - http
        serviceMonitor:
          enabled: true
        dashboards:
          enabled: true
      relay:
        enabled: true
        rollOutPods: true
        prometheus:
          serviceMonitor:
            enabled: true
      ui:
        enabled: true
        rollOutPods: true
    operator:
      tolerations: []



================================================
FILE: kubernetes/apps/base/kube-system/cilium/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml
configMapGenerator:
  - name: cilium-values
    files:
      - values.yaml=./helm/values.yaml
configurations:
  - ./helm/kustomizeconfig.yaml



================================================
FILE: kubernetes/apps/base/kube-system/cilium/app/helm/kustomizeconfig.yaml
================================================
---
nameReference:
  - kind: ConfigMap
    version: v1
    fieldSpecs:
      - path: spec/valuesFrom/name
        kind: HelmRelease



================================================
FILE: kubernetes/apps/base/kube-system/cilium/app/helm/values.yaml
================================================
---
autoDirectNodeRoutes: true
bandwidthManager:
  enabled: false
  bbr: true
bpf:
  datapathMode: netkit
  masquerade: true
  preallocateMaps: true
  # tproxy: true
bpfClockProbe: true
bgpControlPlane:
  enabled: true
cgroup:
  automount:
    enabled: false
  hostRoot: /sys/fs/cgroup
cluster:
  id: 1
  name: main
cni:
  exclusive: false
dashboards:
  enabled: true
devices: en+
# enableIPv4BIGTCP: true
endpointRoutes:
  enabled: true
envoy:
  rollOutPods: true
  prometheus:
     serviceMonitor:
       enabled: true
gatewayAPI:
  enabled: true
  enableAlpn: true
  xffNumTrustedHops: 1
hubble:
  enabled: false
ipam:
  mode: kubernetes
ipv4NativeRoutingCIDR: 10.42.0.0/16
k8sServiceHost: 127.0.0.1
k8sServicePort: 7445
kubeProxyReplacement: true
kubeProxyReplacementHealthzBindAddr: 0.0.0.0:10256
l2announcements:
  enabled: true
loadBalancer:
  algorithm: maglev
  mode: dsr
localRedirectPolicy: true
operator:
  dashboards:
    enabled: true
    annotations:
      grafana_folder: Network
  prometheus:
    enabled: true
    serviceMonitor:
      enabled: true
  replicas: 1
  rollOutPods: true
prometheus:
  enabled: true
  serviceMonitor:
    enabled: true
    trustCRDsExist: true
  annotations:
    grafana_folder: Network
rollOutCiliumPods: true
routingMode: native
securityContext:
  capabilities:
    ciliumAgent:
      - CHOWN
      - KILL
      - NET_ADMIN
      - NET_RAW
      - IPC_LOCK
      - SYS_ADMIN
      - SYS_RESOURCE
      - PERFMON
      - BPF
      - DAC_OVERRIDE
      - FOWNER
      - SETGID
      - SETUID
    cleanCiliumState:
      - NET_ADMIN
      - SYS_ADMIN
      - SYS_RESOURCE



================================================
FILE: kubernetes/apps/base/kube-system/cilium/gateway/certificate.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/cert-manager.io/certificate_v1.json
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: jory-dev
spec:
  secretName: jory-dev-tls
  issuerRef:
    name: letsencrypt-production
    kind: ClusterIssuer
  commonName: jory.dev
  dnsNames: ["jory.dev", "*.jory.dev"]



================================================
FILE: kubernetes/apps/base/kube-system/cilium/gateway/crds.yaml
================================================
---
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: gateway-api-crd
spec:
  interval: 30m
  url: https://github.com/kubernetes-sigs/gateway-api
  ref:
  # renovate: datasource=github-releases depName=kubernetes-sigs/gateway-api
    tag: v1.3.0
  ignore: |
    # exclude
    /*
    # include
    !config/crd/experimental
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: gateway-api
spec:
  prune: true
  sourceRef:
    kind: GitRepository
    name: gateway-api-crd
  wait: true
  interval: 15m
  retryInterval: 1m
  timeout: 5m



================================================
FILE: kubernetes/apps/base/kube-system/cilium/gateway/external.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/gateway.networking.k8s.io/gateway_v1.json
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: external
  annotations:
    external-dns.alpha.kubernetes.io/target: &hostname ${EXTERNAL_DOMAIN}.jory.dev
spec:
  gatewayClassName: cilium
  addresses:
    - type: IPAddress
      value: ${SVC_GATEWAY_EXTERNAL}
    - type: IPAddress
      value: ::ffff:${SVC_GATEWAY_EXTERNAL}
  infrastructure:
    annotations:
      external-dns.alpha.kubernetes.io/hostname: *hostname
  listeners:
    - name: http
      protocol: HTTP
      port: 80
      hostname: "*.jory.dev"
      allowedRoutes:
        namespaces:
          from: Same
    - name: https
      protocol: HTTPS
      port: 443
      hostname: "*.jory.dev"
      allowedRoutes:
        namespaces:
          from: All
      tls:
        certificateRefs:
          - kind: Secret
            name: jory-dev-tls



================================================
FILE: kubernetes/apps/base/kube-system/cilium/gateway/internal.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/gateway.networking.k8s.io/gateway_v1.json
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: internal
  annotations:
    external-dns.alpha.kubernetes.io/target: &hostname ${INTERNAL_DOMAIN}.jory.dev
spec:
  gatewayClassName: cilium
  addresses:
    - type: IPAddress
      value: ${SVC_GATEWAY_INTERNAL}
    - type: IPAddress
      value: ::ffff:${SVC_GATEWAY_INTERNAL}
  infrastructure:
    annotations:
      external-dns.alpha.kubernetes.io/hostname: *hostname
  listeners:
    - name: http
      protocol: HTTP
      port: 80
      hostname: "*.jory.dev"
      allowedRoutes:
        namespaces:
          from: Same
    - name: https
      protocol: HTTPS
      port: 443
      hostname: "*.jory.dev"
      allowedRoutes:
        namespaces:
          from: All
      tls:
        certificateRefs:
          - kind: Secret
            name: jory-dev-tls



================================================
FILE: kubernetes/apps/base/kube-system/cilium/gateway/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./certificate.yaml
  - ./crds.yaml
  - ./external.yaml
  - ./internal.yaml
  - ./redirect.yaml
  - ./pushsecret.yaml



================================================
FILE: kubernetes/apps/base/kube-system/cilium/gateway/pushsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/pushsecret_v1alpha1.json
apiVersion: external-secrets.io/v1alpha1
kind: PushSecret
metadata:
  name: &name ${CLUSTER}-cluster-tls
spec:
  secretStoreRefs:
    - name: onepassword
      kind: ClusterSecretStore
  selector:
    secret:
      name: jory-dev-tls
  template:
    engineVersion: v2
    data:
      tls.crt: '{{ index . "tls.crt" | b64enc }}'
      tls.key: '{{ index . "tls.key" | b64enc }}'
  data:
    - match:
        secretKey: &key tls.crt
        remoteRef:
          remoteKey: *name
          property: *key
    - match:
        secretKey: &key tls.key
        remoteRef:
          remoteKey: *name
          property: *key



================================================
FILE: kubernetes/apps/base/kube-system/cilium/gateway/redirect.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/gateway.networking.k8s.io/httproute_v1.json
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: httpsredirect
  annotations:
    external-dns.alpha.kubernetes.io/controller: none
spec:
  parentRefs:
    - name: internal
      namespace: kube-system
      sectionName: http
    - name: external
      namespace: kube-system
      sectionName: http
  rules:
    - filters:
        - requestRedirect:
            scheme: https
            statusCode: 301
          type: RequestRedirect




================================================
FILE: kubernetes/apps/base/kube-system/coredns/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: coredns
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 1.42.1
  url: oci://ghcr.io/coredns/charts/coredns
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: coredns
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: coredns
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  uninstall:
    keepHistory: false
  valuesFrom:
    - kind: ConfigMap
      name: coredns-values
  values:
    replicaCount: ${REPLICAS:=1}



================================================
FILE: kubernetes/apps/base/kube-system/coredns/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml
configMapGenerator:
  - name: coredns-values
    files:
      - values.yaml=./helm/values.yaml
configurations:
  - ./helm/kustomizeconfig.yaml



================================================
FILE: kubernetes/apps/base/kube-system/coredns/helm/kustomizeconfig.yaml
================================================
---
nameReference:
  - kind: ConfigMap
    version: v1
    fieldSpecs:
      - path: spec/valuesFrom/name
        kind: HelmRelease



================================================
FILE: kubernetes/apps/base/kube-system/coredns/helm/values.yaml
================================================
---
fullnameOverride: coredns
image:
  repository: mirror.gcr.io/coredns/coredns
replicaCount: 2
k8sAppLabelOverride: kube-dns
serviceAccount:
  create: true
service:
  name: kube-dns
  clusterIP: 10.43.0.10
servers:
  - zones:
      - zone: .
        scheme: dns://
        use_tcp: true
    port: 53
    plugins:
      - name: errors
      - name: health
        configBlock: |-
          lameduck 5s
      - name: ready
      - name: kubernetes
        parameters: cluster.local in-addr.arpa ip6.arpa
        configBlock: |-
          pods verified
          fallthrough in-addr.arpa ip6.arpa
      - name: autopath
        parameters: "@kubernetes"
      - name: forward
        parameters: . /etc/resolv.conf
      - name: cache
        configBlock: |-
          prefetch 20
          serve_stale
      - name: loop
      - name: reload
      - name: loadbalance
      - name: prometheus
        parameters: 0.0.0.0:9153
      - name: log
        configBlock: |-
          class error
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
        - matchExpressions:
            - key: node-role.kubernetes.io/control-plane
              operator: Exists
tolerations:
  - key: CriticalAddonsOnly
    operator: Exists
  - key: node-role.kubernetes.io/control-plane
    operator: Exists
    effect: NoSchedule



================================================
FILE: kubernetes/apps/base/kube-system/irqbalance/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app irqbalance
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      irqbalance:
        type: daemonset
        containers:
          app:
            image:
              repository: ghcr.io/home-operations/irqbalance
              tag: 1.9.4@sha256:d3c5a0221dc688593e78b14e10beb971d9717cc9381d4b1e065b8982f424fadb
            env:
              IRQBALANCE_BANNED_CPULIST: 12-19 # 12-19 are E-cores
            resources:
              requests:
                cpu: 10m
              limits:
                memory: 32Mi
            securityContext:
              privileged: true
    defaultPodOptions:
      hostIPC: true
      hostPID: true
    persistence:
      run:
        type: emptyDir
        globalMounts:
          - path: /run/irqbalance



================================================
FILE: kubernetes/apps/base/kube-system/irqbalance/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - helmrelease.yaml



================================================
FILE: kubernetes/apps/base/kube-system/metrics-server/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: metrics-server
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 3.12.2
  url: oci://ghcr.io/home-operations/charts-mirror/metrics-server
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: metrics-server
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: metrics-server
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    replicas: ${REPLICAS:=1}
    args:
      - --kubelet-insecure-tls
      - --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname
      - --kubelet-use-node-status-port
      - --metric-resolution=10s
      - --kubelet-request-timeout=2s
    metrics:
      enabled: true
    serviceMonitor:
      enabled: true



================================================
FILE: kubernetes/apps/base/kube-system/metrics-server/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/kube-tools/descheduler/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: descheduler
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 0.33.0
  url: oci://ghcr.io/home-operations/charts-mirror/descheduler
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: descheduler
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: descheduler
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    replicas: ${REPLICAS:=1}
    kind: Deployment
    deschedulerPolicyAPIVersion: descheduler/v1alpha2
    deschedulerPolicy:
      profiles:
        - name: Default
          pluginConfig:
            - name: DefaultEvictor
              args:
                evictFailedBarePods: true
                evictLocalStoragePods: true
                evictSystemCriticalPods: true
            - name: RemoveFailedPods
              args:
                reasons:
                  - ContainerStatusUnknown
                  - NodeAffinity
                  - NodeShutdown
                  - Terminated
                  - UnexpectedAdmissionError
                includingInitContainers: true
                excludeOwnerKinds:
                  - Job
                minPodLifetimeSeconds: 1800
            - name: RemovePodsViolatingInterPodAntiAffinity
            - name: RemovePodsViolatingNodeAffinity
              args:
                nodeAffinityType:
                  - requiredDuringSchedulingIgnoredDuringExecution
            - name: RemovePodsViolatingNodeTaints
            - name: RemovePodsViolatingTopologySpreadConstraint
          plugins:
            balance:
              enabled:
                - RemovePodsViolatingTopologySpreadConstraint
            deschedule:
              enabled:
                - RemoveFailedPods
                - RemovePodsViolatingInterPodAntiAffinity
                - RemovePodsViolatingNodeAffinity
                - RemovePodsViolatingNodeTaints
    service:
      enabled: true
    serviceMonitor:
      enabled: true
    leaderElection:
      enabled: true



================================================
FILE: kubernetes/apps/base/kube-tools/descheduler/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/kube-tools/fstrim/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app fstrim
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      fstrim:
        type: cronjob
        cronjob:
          schedule: "@weekly"
          parallelism: ${PARALLELISM:=1} # Set to my total number of nodes
          successfulJobsHistory: 1
          failedJobsHistory: 1
        containers:
          app:
            image:
              repository: ghcr.io/onedr0p/kubanetics
              tag: 2025.3.2@sha256:309a7587c2aa7ce6a99812a61c5024240a21b708f94802a09105c61513572164
            env:
              SCRIPT_NAME: fstrim.sh
            resources:
              requests:
                cpu: 25m
              limits:
                memory: 128Mi
            securityContext:
              privileged: true
    defaultPodOptions:
      hostNetwork: true
      hostPID: true
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: *app
    persistence:
      procfs:
        type: hostPath
        hostPath: /proc
        hostPathType: Directory
        globalMounts:
          - path: /host/proc
            readOnly: true
      netfs:
        type: hostPath
        hostPath: /sys
        hostPathType: Directory
        globalMounts:
          - path: /host/net
            readOnly: true



================================================
FILE: kubernetes/apps/base/kube-tools/fstrim/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/kube-tools/intel-device-plugins/gpu/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: intel-device-plugins-gpu
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 0.32.1
  url: oci://ghcr.io/home-operations/charts-mirror/intel-device-plugins-gpu
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: intel-device-plugin-gpu
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: intel-device-plugins-gpu
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  uninstall:
    keepHistory: false
  dependsOn:
    - name: intel-device-plugin-operator
      namespace: kube-tools
  values:
    name: intel-device-plugin-gpu
    sharedDevNum: 99
    nodeFeatureRule: true



================================================
FILE: kubernetes/apps/base/kube-tools/intel-device-plugins/gpu/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml
  - ./nodefeaturerule.yaml



================================================
FILE: kubernetes/apps/base/kube-tools/intel-device-plugins/gpu/nodefeaturerule.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/nfd.k8s-sigs.io/nodefeaturerule_v1alpha1.json
apiVersion: nfd.k8s-sigs.io/v1alpha1
kind: NodeFeatureRule
metadata:
  name: intel-gpu-plugin
spec:
  rules:
    - name: intel.gpu
      labels:
        intel.feature.node.kubernetes.io/gpu: "true"
      matchFeatures:
        - feature: pci.device
          matchExpressions:
            vendor: {op: In, value: ["8086"]}
            class: {op: In, value: ["0300", "0380"]}



================================================
FILE: kubernetes/apps/base/kube-tools/intel-device-plugins/operator/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: intel-device-plugins-operator
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 0.32.1
  url: oci://ghcr.io/home-operations/charts-mirror/intel-device-plugins-operator
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: intel-device-plugin-operator
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: intel-device-plugins-operator
  install:
    crds: CreateReplace
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    crds: CreateReplace
    remediation:
      retries: 3
  uninstall:
    keepHistory: false
  values:
    manager:
      devices:
        gpu: true



================================================
FILE: kubernetes/apps/base/kube-tools/intel-device-plugins/operator/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/kube-tools/reloader/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: reloader
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 2.1.3
  url: oci://ghcr.io/stakater/charts/reloader
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: reloader
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: reloader
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    fullnameOverride: reloader
    reloader:
      readOnlyRootFileSystem: true
      podMonitor:
        enabled: true
        namespace: "{{ .Release.Namespace }}"



================================================
FILE: kubernetes/apps/base/kube-tools/reloader/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/kube-tools/spegel/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: spegel
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 0.2.0
  url: oci://ghcr.io/spegel-org/helm-charts/spegel
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: spegel
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: spegel
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    spegel:
      containerdSock: /run/containerd/containerd.sock
      containerdRegistryConfigPath: /etc/cri/conf.d/hosts
    service:
      registry:
        hostPort: 29999
    serviceMonitor:
      enabled: true
    grafanaDashboard:
      enabled: true



================================================
FILE: kubernetes/apps/base/kube-tools/spegel/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/kube-tools/system-upgrade-controller/kustomizeconfig.yaml
================================================
---
nameReference:
  - kind: ConfigMap
    version: v1
    fieldSpecs:
      - path: spec/postBuild/substituteFrom/name
        kind: Kustomization



================================================
FILE: kubernetes/apps/base/kube-tools/system-upgrade-controller/versions.env
================================================
# renovate: datasource=docker depName=ghcr.io/siderolabs/kubelet
KUBERNETES_VERSION=v1.33.1
# renovate: datasource=docker depName=ghcr.io/siderolabs/installer
TALOS_VERSION=v1.10.2



================================================
FILE: kubernetes/apps/base/kube-tools/system-upgrade-controller/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app system-upgrade-controller
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      system-upgrade-controller:
        strategy: RollingUpdate
        replicas: ${REPLICAS:=1}
        containers:
          app:
            image:
              repository: docker.io/rancher/system-upgrade-controller
              tag: v0.15.2@sha256:3e899833afcea9a8788d384ce976df9a05be84636fe5c01ec2307b5bd8fe9810
            env:
              SYSTEM_UPGRADE_CONTROLLER_LEADER_ELECT: true
              SYSTEM_UPGRADE_CONTROLLER_NAME: *app
              SYSTEM_UPGRADE_CONTROLLER_NAMESPACE:
                valueFrom:
                  fieldRef:
                    fieldPath: metadata.namespace
              SYSTEM_UPGRADE_CONTROLLER_NODE_NAME:
                valueFrom:
                  fieldRef:
                    fieldPath: spec.nodeName
              SYSTEM_UPGRADE_JOB_BACKOFF_LIMIT: "99"
              SYSTEM_UPGRADE_JOB_PRIVILEGED: false
            securityContext:
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities: { drop: ["ALL"] }
        serviceAccount:
          identifier: *app
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
    serviceAccount:
      system-upgrade-controller: {}



================================================
FILE: kubernetes/apps/base/kube-tools/system-upgrade-controller/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - helmrelease.yaml
  - rbac.yaml



================================================
FILE: kubernetes/apps/base/kube-tools/system-upgrade-controller/app/rbac.yaml
================================================
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: system-upgrade-controller
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: system-upgrade-controller
    namespace: kube-tools
---
apiVersion: talos.dev/v1alpha1
kind: ServiceAccount
metadata:
  name: system-upgrade-controller
spec:
  roles: ["os:admin"]



================================================
FILE: kubernetes/apps/base/kube-tools/system-upgrade-controller/plans/kubernetes.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/upgrade.cattle.io/plan_v1.json
apiVersion: upgrade.cattle.io/v1
kind: Plan
metadata:
  name: kubernetes
spec:
  version: ${KUBERNETES_VERSION}
  concurrency: 1
  exclusive: true
  serviceAccountName: system-upgrade-controller
  secrets:
    - name: system-upgrade-controller
      path: /var/run/secrets/talos.dev
      ignoreUpdates: true
  nodeSelector:
    matchExpressions:
      - key: node-role.kubernetes.io/control-plane
        operator: Exists
  upgrade:
    image: ghcr.io/siderolabs/talosctl:${TALOS_VERSION}
    args:
      - --nodes=$(SYSTEM_UPGRADE_NODE_NAME)
      - upgrade-k8s
      - --to=$(SYSTEM_UPGRADE_PLAN_LATEST_VERSION)



================================================
FILE: kubernetes/apps/base/kube-tools/system-upgrade-controller/plans/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./kubernetes.yaml
  - ./talos.yaml



================================================
FILE: kubernetes/apps/base/kube-tools/system-upgrade-controller/plans/talos.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/upgrade.cattle.io/plan_v1.json
apiVersion: upgrade.cattle.io/v1
kind: Plan
metadata:
  name: talos
spec:
  version: ${TALOS_VERSION}
  concurrency: 1
  postCompleteDelay: 2m
  exclusive: true
  serviceAccountName: system-upgrade-controller
  secrets:
    - name: system-upgrade-controller
      path: /var/run/secrets/talos.dev
      ignoreUpdates: true
  nodeSelector:
    matchExpressions:
      - key: kubernetes.io/hostname
        operator: Exists
  upgrade:
    image: ghcr.io/jfroy/tnu:0.4.2
    args:
      - --node=$(SYSTEM_UPGRADE_NODE_NAME)
      - --tag=$(SYSTEM_UPGRADE_PLAN_LATEST_VERSION)



================================================
FILE: kubernetes/apps/base/llm/ollama/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app ollama
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  dependsOn:
    - name: intel-device-plugin-gpu
      namespace: kube-tools
  values:
    controllers:
      ollama:
        replicas: 3 # 1 per node
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/joryirving/ollama-intel-gpu
              tag: latest
              # tag: ipex-llm-v.0.0.1-2
            securityContext:
              privileged: true
            env:
              OLLAMA_MODELS: &modelPath /models
              ONEAPI_DEVICE_SELECTOR: level_zero:0
              IPEX_LLM_NUM_CTX: 16384
            resources:
              requests:
                cpu: 200m
              limits:
                memory: 16Gi
                gpu.intel.com/i915: 1
        pod:
          affinity:
            podAntiAffinity:
              requiredDuringSchedulingIgnoredDuringExecution:
                - topologyKey: "kubernetes.io/hostname"
                  labelSelector:
                    matchExpressions:
                      - key: app.kubernetes.io/name
                        operator: In
                        values:
                          - *app
    service:
      app:
        controller: *app
        ports:
          http:
            port: &port 11434
    route:
      app:
        hostnames: ["{{ .Release.Name }}.jory.dev"]
        parentRefs:
          - name: internal
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      ollama:
        existingClaim: *app
        globalMounts:
          - path: *modelPath
            subPath: models
          - path: /root/.ollama
            subPath: config
      dri:
        type: hostPath
        hostPath: /dev/dri



================================================
FILE: kubernetes/apps/base/llm/ollama/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml
  - ./pvc.yaml



================================================
FILE: kubernetes/apps/base/llm/ollama/pvc.yaml
================================================
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ollama
spec:
  accessModes: ["ReadWriteMany"]
  resources:
    requests:
      storage: 100Gi
  storageClassName: ceph-filesystem



================================================
FILE: kubernetes/apps/base/llm/open-webui/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name open-webui
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        # OAUTH
        ENABLE_OAUTH_SIGNUP: "true"
        OAUTH_MERGE_ACCOUNTS_BY_EMAIL: "true"
        OAUTH_PROVIDER_NAME: Authentik
        OPENID_PROVIDER_URL: https://sso.jory.dev/application/o/open-webui/.well-known/openid-configuration
        OAUTH_SCOPES: openid email profile
        OPENID_REDIRECT_URI: https://chat.jory.dev/oauth/oidc/callback
        OAUTH_CLIENT_ID: "{{ .OPEN_WEBUI_CLIENT_ID }}"
        OAUTH_CLIENT_SECRET: "{{ .OPEN_WEBUI_CLIENT_SECRET }}"
  dataFrom:
    - extract:
        key: open-webui



================================================
FILE: kubernetes/apps/base/llm/open-webui/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app open-webui
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      open-webui:
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/open-webui/open-webui
              tag: v0.6.9@sha256:2b1758ce5e4874c69baa1a91c6ff8dfc185c9f59eeb52f3a897f85276fc70de7
            env:
              OLLAMA_BASE_URL: http://ollama:11434
              ENABLE_RAG_WEB_SEARCH: true
              ENABLE_SEARCH_QUERY: true
              RAG_WEB_SEARCH_ENGINE: searxng
              SEARXNG_QUERY_URL: http://searxng:8080/search?q=<query>
              ENABLE_WEBSOCKET_SUPPORT: "true"
              WEBSOCKET_MANAGER: "redis"
              WEBSOCKET_REDIS_URL: redis://open-webui-dragonfly:6379
              DATABASE_URL:
                valueFrom:
                  secretKeyRef:
                    name: open-webui-pguser-open-webui
                    key: pgbouncer-uri
            envFrom:
              - secretRef:
                  name: *app
            resources:
              requests:
                cpu: 500m
              limits:
                memory: 2Gi
    service:
      app:
        controller: *app
        ports:
          http:
            port: &port 8080
    route:
      app:
        hostnames: ["chat.jory.dev"]
        parentRefs:
          - name: internal
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      config:
        enabled: true
        existingClaim: *app
        globalMounts:
          - path: /app/backend/data



================================================
FILE: kubernetes/apps/base/llm/open-webui/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/llm/searxng/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name searxng
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        SEARXNG_SECRET: "{{ .SEARXNG_SECRET_KEY }}"
  dataFrom:
    - extract:
        key: searxng



================================================
FILE: kubernetes/apps/base/llm/searxng/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app searxng
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      searxng:
        strategy: RollingUpdate
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          main:
            image:
              repository: docker.io/searxng/searxng
              tag: 2024.6.30-39aaac40d
            env:
              SEARXNG_BASE_URL: https://search.jory.dev
              SEARXNG_URL: https://search.jory.dev
              SEARXNG_PORT: &port 8080
              SEARXNG_REDIS_URL: redis://searxng-dragonfly:6379
            envFrom:
              - secretRef:
                  name: *app
            probes:
              liveness: &probes
                enabled: true
                custom: true
                spec:
                  httpGet:
                    path: /stats
                    port: *port
                  initialDelaySeconds: 0
                  periodSeconds: 10
                  timeoutSeconds: 1
                  failureThreshold: 3
              readiness: *probes
            resources:
              requests:
                cpu: 10m
                memory: 256Mi
              limits:
                memory: 2Gi
            securityContext:
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities:
                drop:
                  - ALL
                add:
                  - CHOWN
                  - SETGID
                  - SETUID
                  - DAC_OVERRIDE
    service:
      app:
        controller: searxng
        ports:
          http:
            port: *port
    route:
      app:
        hostnames: ["search.jory.dev"]
        parentRefs:
          - name: internal
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      config:
        type: configMap
        name: searxng-configmap
        globalMounts:
          - path: /etc/searxng/settings.yml
            subPath: settings.yml
            readOnly: true
          - path: /etc/searxng/limiter.toml
            subPath: limiter.toml
            readOnly: true
      tmpfs:
        enabled: true
        type: emptyDir
        globalMounts:
          - path: /etc/searxng



================================================
FILE: kubernetes/apps/base/llm/searxng/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml
configMapGenerator:
  - name: searxng-configmap
    files:
      - ./resources/limiter.toml
      - ./resources/settings.yml
generatorOptions:
  disableNameSuffixHash: true



================================================
FILE: kubernetes/apps/base/llm/searxng/resources/limiter.toml
================================================
[real_ip]

# Number of values to trust for X-Forwarded-For.

x_for = 1

# The prefix defines the number of leading bits in an address that are compared
# to determine whether or not an address is part of a (client) network.

ipv4_prefix = 32
ipv6_prefix = 48

[botdetection.ip_limit]

# To get unlimited access in a local network, by default link-lokal addresses
# (networks) are not monitored by the ip_limit
filter_link_local = true

# activate link_token method in the ip_limit method
link_token = false

[botdetection.ip_lists]

# In the limiter, the ip_lists method has priority over all other methods -> if
# an IP is in the pass_ip list, it has unrestricted access and it is also not
# checked if e.g. the "user agent" suggests a bot (e.g. curl).

block_ip = [
]

pass_ip = [
  '192.168.0.0/16',      # IPv4 private network
  '10.0.0.0/8',          # IPv4 private network
]

# Activate passlist of (hardcoded) IPs from the SearXNG organization,
# e.g. `check.searx.space`.
pass_searxng_org = false



================================================
FILE: kubernetes/apps/base/llm/searxng/resources/settings.yml
================================================
---
use_default_settings: true

server:
  limiter: true
  image_proxy: true
  method: GET # https://github.com/searxng/searxng/pull/3619
  public_instance: false

search:
  autocomplete: duckduckgo
  favicon_resolver: duckduckgo
  languages:
    - all
    - en
    - en-US
  formats:
    - html
    - json

general:
  instance_name: LDS Search

ui:
  default_theme: simple
  infinite_scroll: true
  query_in_title: true
  results_on_new_tab: true
  static_use_hash: true
  theme_args:
    simple_style: auto

categories_as_tabs:
  general:
  images:
  videos:
  map:

enabled_plugins:
  - Basic Calculator
  - Hash plugin
  - Open Access DOI rewrite
  - Self Informations
  - Tracker URL remover
  - Unit converter plugin

hostnames:
  high_priority:
    - (.*)\/blog\/(.*)
    - (.*\.)?wikipedia.org$
    - (.*\.)?github.com$
    - (.*\.)?reddit.com$
    - (.*\.)?docker.com$
    - (.*\.)?archlinux.org$
    - (.*\.)?stackoverflow.com$
    - (.*\.)?askubuntu.com$
    - (.*\.)?superuser.com$



================================================
FILE: kubernetes/apps/base/media/ersatztv/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app ersatztv
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  dependsOn:
    - name: intel-device-plugin-gpu
      namespace: kube-tools
  values:
    controllers:
      ersatztv:
        labels:
          nfsMount: "true"
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: jasongdove/ersatztv
              tag: v25.1.0-vaapi@sha256:f845dc4d4d458cdeac89f97b2331fe02bb5877e4772ab9cef0e71b776382a657
            env:
              TZ: America/Edmonton
              XDG_DATA_HOME: /config # https://github.com/ErsatzTV/ErsatzTV/issues/327
            probes:
              liveness:
                enabled: true
              readiness:
                enabled: true
              startup:
                enabled: true
            securityContext:
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities: { drop: ["ALL"] }
            resources:
              requests:
                cpu: 10m
              limits:
                gpu.intel.com/i915: 1
                memory: 4G
    defaultPodOptions:
      automountServiceAccountToken: false
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
        fsGroup: 100
        fsGroupChangePolicy: OnRootMismatch
        supplementalGroups: [44]
    service:
      app:
        controller: *app
        ports:
          http:
            port: &port 8409
    route:
      app:
        hostnames:
          - "{{ .Release.Name }}.jory.dev"
          - tv.jory.dev
        parentRefs:
          - name: internal
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      config:
        existingClaim: *app
      cache:
        type: emptyDir
      tmp:
        type: emptyDir
      transcode:
        type: emptyDir
      media:
        type: nfs
        server: voyager.internal
        path: /mnt/user/data
        globalMounts:
          - path: /data
            subPath: media
            readOnly: true



================================================
FILE: kubernetes/apps/base/media/ersatztv/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/media/jellyseerr/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name jellyseerr-secret
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        API_KEY: "{{ .JELLYSEERR_API_KEY }}"
  dataFrom:
  - extract:
      key: jellyseerr



================================================
FILE: kubernetes/apps/base/media/jellyseerr/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app jellyseerr
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      jellyseerr:
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/fallenbagel/jellyseerr
              tag: 2.5.2@sha256:2a611369ad1d0d501c2d051fc89b6246ff081fb4a30879fdc75642cf6a37b1a6
            env:
              DB_TYPE: "postgres"
              DB_HOST: jellyseerr-pgbouncer.media.svc
              DB_PORT: "5432"
              DB_USER: *app
              DB_PASS:
                valueFrom:
                  secretKeyRef:
                    name: jellyseerr-pguser-jellyseerr
                    key: password
              DB_NAME: *app
              LOG_LEVEL: "info"
              PORT: &port 80
              TZ: America/Edmonton
            envFrom:
              - secretRef:
                  name: jellyseerr-secret
            resources:
              requests:
                cpu: 10m
                memory: 350Mi
              limits:
                memory: 600Mi
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
        fsGroup: 100
        fsGroupChangePolicy: OnRootMismatch
    service:
      app:
        controller: *app
        ports:
          http:
            port: *port
    route:
      app:
        hostnames:
          - "{{ .Release.Name }}.jory.dev"
          - requests.jory.dev
        parentRefs:
          - name: external
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      config:
        existingClaim: *app
        globalMounts:
          - path: /app/config
      cache:
        existingClaim: jellyseerr-cache
        globalMounts:
          - path: /app/config/cache
      logs:
        type: emptyDir
        globalMounts:
          - path: /app/config/logs
      tmp:
        type: emptyDir



================================================
FILE: kubernetes/apps/base/media/jellyseerr/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml
  - ./pvc.yaml



================================================
FILE: kubernetes/apps/base/media/jellyseerr/pvc.yaml
================================================
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: jellyseerr-cache
spec:
  accessModes: ["ReadWriteOnce"]
  resources:
    requests:
      storage: 15Gi
  storageClassName: ceph-block



================================================
FILE: kubernetes/apps/base/media/kavita/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app kavita
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      kavita:
        labels:
          nfsMount: "true"
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/kareadita/kavita
              tag: 0.8.6@sha256:cdd6abc6e5c3d337c5bb68d4a29bc490456af2a550b3a031374e46dbfac291ce
            env:
              TZ: America/Edmonton
            resources:
              requests:
                cpu: 15m
                memory: 300Mi
              limits:
                memory: 1Gi
    service:
      app:
        controller: *app
        ports:
          http:
            port: &port 5000
    route:
      app:
        hostnames:
          - "{{ .Release.Name }}.jory.dev"
          - comics.jory.dev
        parentRefs:
          - name: external
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      config:
        existingClaim: *app
        globalMounts:
          - path: /kavita/config
      media:
        type: nfs
        server: voyager.internal
        path: /mnt/user/data
        globalMounts:
          - path: /data
            subPath: media



================================================
FILE: kubernetes/apps/base/media/kavita/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/media/komga/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app komga
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      komga:
        labels:
          nfsMount: "true"
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/gotson/komga
              tag: 1.21.3@sha256:72dc9f81a0a528752e953028a7d3ca6a83f8eabe2a617e3c7e53cfa594c84256
            env:
              TZ: America/Edmonton
              SERVER_PORT: &port 8080
            resources:
              requests:
                cpu: 15m
                memory: 1Gi
              limits:
                memory: 4Gi
    service:
      app:
        controller: *app
        ports:
          http:
            port: *port
    route:
      app:
        hostnames: ["{{ .Release.Name }}.jory.dev"]
        parentRefs:
          - name: external
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      config:
        existingClaim: *app
      media:
        type: nfs
        server: voyager.internal
        path: /mnt/user/data
        globalMounts:
          - path: /data
            subPath: media



================================================
FILE: kubernetes/apps/base/media/komga/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/media/kyoo/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name kyoo-secret
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        # App
        KYOO_API_KEY: '{{ .KYOO_API_KEY }}'
        TMDB_API_KEY: '{{ .TMDB_API_KEY }}'
        TVDB_APIKEY: ""
        TVDB_PIN: ""
        #Meili
        MEILI_MASTER_KEY: '{{ .MEILI_MASTER_KEY }}'
        #RabbitMQ
        RABBITMQ_USER: kyoo_all
        RABBITMQ_COOKIE: '{{ .RABBITMQ_COOKIE }}'
        RABBITMQ_PASS: '{{ .RABBITMQ_PASS }}'
        # OIDC
        OIDC_AUTHENTIK_CLIENTID: '{{ .KYOO_CLIENT_ID }}'
        OIDC_AUTHENTIK_SECRET: '{{ .KYOO_CLIENT_SECRET }}'
  dataFrom:
  - extract:
      key: kyoo
  - extract:
      key: kometa



================================================
FILE: kubernetes/apps/base/media/kyoo/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: kyoo
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 4.7.1
  url: oci://ghcr.io/zoriya/helm-charts/kyoo
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app kyoo
spec:
  interval: 15m
  chartRef:
    kind: OCIRepository
    name: kyoo
  install:
    createNamespace: true
    remediation:
      retries: -1
  upgrade:
    remediation:
      retries: 3
  values:
    global:
      meilisearch:
        infra:
          existingSecret: &secret kyoo-secret
        kyoo_back:
          masterkeyKey: MEILI_MASTER_KEY
          existingSecret: *secret
      postgres:
        infra:
          user: kyoo-all
        kyoo_back:
          host: &host kyoo-primary.media.svc
          port: &port 5432
          database: kyoo_back
          kyoo_migrations: &psql_secret
            userKey: user
            passwordKey: password
            existingSecret: kyoo-pguser-kyoo-all
          kyoo_back: *psql_secret
        kyoo_transcoder:
          host: *host
          port: *port
          database: kyoo_transcoder
          sslmode: require
          kyoo_transcoder: *psql_secret
      rabbitmq:
        infra:
          passwordKey: RABBITMQ_PASS
          keyErlangCookie: RABBITMQ_COOKIE
          existingSecret: *secret
        kyoo_autosync: &rabbit
          userKey: RABBITMQ_USER
          passwordKey: RABBITMQ_PASS
          existingSecret: *secret
        kyoo_back: *rabbit
        kyoo_matcher: *rabbit
        kyoo_scanner: *rabbit
    kyoo:
      address: https://kyoo.jory.dev
      transcoderAcceleration: vaapi # hardware acceleration profile (valid values: disabled, vaapi, qsv, nvidia)
      apikey:
        existingSecret: *secret
        apikeyKey: KYOO_API_KEY
      oidc_providers:
        - name: Authentik
          existingSecret: *secret
          clientIdKey: OIDC_AUTHENTIK_CLIENTID
          clientSecretKey: OIDC_AUTHENTIK_SECRET
          logo: https://sso.jory.dev/static/dist/assets/icons/icon.png
          authorizationAddress: https://sso.jory.dev/application/o/authorize/
          tokenAddress: https://sso.jory.dev/application/o/token/
          profileAddress: https://sso.jory.dev/application/o/userinfo/
          scope: "openid email profile"
          authMethod: ClientSecretBasic
    media:
      volumes:
        - name: media
          nfs:
            server: voyager.internal
            path: /mnt/user/data
      volumeMounts:
        - mountPath: &path /media
          name: media
          readOnly: true
      baseMountPath: *path

    contentdatabase:
      tmdb:
        apikeyKey: TMDB_API_KEY
        existingSecret: *secret
      tvdb:
        apikeyKey: TVDB_APIKEY
        pinKey: TVDB_PIN
        existingSecret: *secret

    autosync:
      kyoo_autosync:
        resources:
          requests:
            cpu: 5m
            memory: 20Mi
          limits:
            cpu: 100m
            memory: 100Mi

    back:
      kyoo_back:
        resources:
          requests:
            cpu: 10m
            memory: 1Gi
          limits:
            cpu: 4000m
            memory: 8Gi
      persistence:
        existingClaim: *app

    front:
      kyoo_front:
        resources:
          requests:
            cpu: 20m
            memory: 50Mi
          limits:
            cpu: 1
            memory: 500Mi

    matcher:
      kyoo_matcher:
        resources:
          requests:
            cpu: 50m
            memory: 50Mi
          limits:
            cpu: 1
            memory: 500Mi

    scanner:
      kyoo_scanner:
        resources:
          requests:
            cpu: 5m
            memory: 100Mi
          limits:
            cpu: 100m
            memory: 1Gi

    transcoder:
      kyoo_transcoder:
        resources:
          requests:
            cpu: 100m
            memory: 500Mi
          limits:
            cpu: 1
            gpu.intel.com/i915: 1
            memory: 8Gi

    meilisearch:
      enabled: true
    rabbitmq:
      enabled: true



================================================
FILE: kubernetes/apps/base/media/kyoo/httproute.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/gateway.networking.k8s.io/httproute_v1.json
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: kyoo
spec:
  hostnames: ["kyoo.jory.dev"]
  parentRefs:
    - name: external
      namespace: kube-system
      sectionName: https
  rules:
    - backendRefs:
        - name: kyoo-front
          namespace: media
          port: 8901



================================================
FILE: kubernetes/apps/base/media/kyoo/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml
  - ./httproute.yaml



================================================
FILE: kubernetes/apps/base/media/maintainerr/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app maintainerr
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      maintainerr:
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/jorenn92/maintainerr
              tag: 2.14.0@sha256:61ed94bec0ea71b6b289b45ee82acc2c5d94b954026e6cbb1d5262aad6811b59
            env:
              TZ: America/Edmonton
            probes:
              liveness:
                enabled: true
              readiness:
                enabled: true
              startup:
                enabled: true
                spec:
                  failureThreshold: 30
                  periodSeconds: 5
            resources:
              requests:
                cpu: 5m
                memory: 128Mi
              limits:
                memory: 512Mi
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
        fsGroup: 100
        fsGroupChangePolicy: OnRootMismatch
    service:
      app:
        controller: *app
        ports:
          http:
            port: &port 6246
    route:
      app:
        hostnames: ["{{ .Release.Name }}.jory.dev"]
        parentRefs:
          - name: internal
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      data:
        existingClaim: *app
        globalMounts:
          - path: /opt/data



================================================
FILE: kubernetes/apps/base/media/maintainerr/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/base/media/plex/app/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name plex-secret
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        PLEX_TOKEN: "{{ .PLEX_API_KEY }}"
  dataFrom:
  - extract:
      key: plex



================================================
FILE: kubernetes/apps/base/media/plex/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app plex
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  dependsOn:
    - name: intel-device-plugin-gpu
      namespace: kube-tools
  values:
    controllers:
      plex:
        labels:
          nfsMount: "true"
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/joryirving/plex
              tag: 1.41.6.9685@sha256:a981ce05b13d9541bdb060d20693e02500a99ed1abd13e7afe0b201824870f56
            env:
              TZ: America/Edmonton
              PLEX_ADVERTISE_URL: https://plex.jory.dev:443,http://10.69.10.35:32400
              PLEX_NO_AUTH_NETWORKS: 10.42.0.0/16,192.168.30.0/24
            probes:
              liveness: &probes
                enabled: true
                custom: true
                spec:
                  httpGet:
                    path: /identity
                    port: &port 32400
                  initialDelaySeconds: 0
                  periodSeconds: 10
                  timeoutSeconds: 1
                  failureThreshold: 3
              readiness: *probes
              startup:
                enabled: true
                spec:
                  failureThreshold: 30
                  periodSeconds: 10
            securityContext:
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities: { drop: ["ALL"] }
            resources:
              requests:
                cpu: 100m
              limits:
                gpu.intel.com/i915: 1
                memory: 16G
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
        fsGroup: 100
        fsGroupChangePolicy: OnRootMismatch
        supplementalGroups: [44]
    service:
      app:
        controller: *app
        type: LoadBalancer
        annotations:
          lbipam.cilium.io/ips: 10.69.10.35, ::ffff:10.69.10.35
        ports:
          http:
            port: *port
    route:
      app:
        hostnames:
          - "{{ .Release.Name }}.jory.dev"
        parentRefs:
          - name: external
            namespace: kube-system
            sectionName: https
        rules:
          - backendRefs:
              - name: *app
                port: *port
            filters:
              - type: RequestHeaderModifier
                requestHeaderModifier:
                  remove: ["Range"]
            matches:
              - path:
                  type: PathPrefix
                  value: /library/streams
          - backendRefs:
              - name: *app
                port: *port
    persistence:
      config:
        existingClaim: *app
      # Separate PVC for cache to avoid backing up cache files
      plex-cache:
        existingClaim: plex-cache
        globalMounts:
          - path: /config/Library/Application Support/Plex Media Server/Cache
      logs:
        type: emptyDir
        globalMounts:
          - path: /config/Library/Application Support/Plex Media Server/Logs
      tmp:
        type: emptyDir
      transcode:
        type: emptyDir
      media:
        type: nfs
        server: voyager.internal
        path: /mnt/user/data
        globalMounts:
          - path: /data
            subPath: media
            readOnly: true



================================================
FILE: kubernetes/apps/base/media/plex/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml
  - ./pvc.yaml



================================================
FILE: kubernetes/apps/base/media/plex/app/pvc.yaml
================================================
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: plex-cache
spec:
  accessModes: ["ReadWriteOnce"]
  resources:
    requests:
      storage: 50Gi
  storageClassName: ceph-block



================================================
FILE: kubernetes/apps/base/media/plex/kometa/externalsecret.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/external-secrets.io/externalsecret_v1.json
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: &name kometa-secret
spec:
  secretStoreRef:
    kind: ClusterSecretStore
    name: onepassword
  target:
    name: *name
    template:
      data:
        KOMETA_MDBLIST_API_KEY: "{{ .MDBLIST_API_KEY }}"
        KOMETA_MYANIMELIST_ACCESS_TOKEN: "{{ .MYANIMELIST_ACCESS_TOKEN }}"
        KOMETA_MYANIMELIST_CLIENT_ID: "{{ .MYANIMELIST_CLIENT_ID }}"
        KOMETA_MYANIMELIST_CLIENT_SECRET: "{{ .MYANIMELIST_CLIENT_SECRET }}"
        KOMETA_MYANIMELIST_EXPIRES_IN: "{{ .MYANIMELIST_EXPIRES_IN }}"
        KOMETA_MYANIMELIST_LOCALHOST_URL: "{{ .MYANIMELIST_LOCALHOST_URL }}"
        KOMETA_MYANIMELIST_REFRESH_TOKEN: "{{ .MYANIMELIST_REFRESH_TOKEN }}"
        KOMETA_OMDB_API_KEY: "{{ .OMDB_API_KEY }}"
        KOMETA_PLEX_API_KEY: "{{ .PLEX_API_KEY }}"
        KOMETA_RADARR_API_KEY: "{{ .RADARR_API_KEY }}"
        KOMETA_SONARR_API_KEY: "{{ .SONARR_API_KEY }}"
        KOMETA_TAUTULLI_API_KEY: "{{ .TAUTULLI_API_KEY }}"
        KOMETA_TMDB_API_KEY: "{{ .TMDB_API_KEY }}"
        KOMETA_TRAKT_ACCESS_TOKEN: "{{ .TRAKT_ACCESS_TOKEN }}"
        KOMETA_TRAKT_CREATED_AT: "{{ .TRAKT_CREATED_AT }}"
        KOMETA_TRAKT_CLIENT_ID: "{{ .TRAKT_CLIENT_ID }}"
        KOMETA_TRAKT_CLIENT_SECRET: "{{ .TRAKT_CLIENT_SECRET }}"
        KOMETA_TRAKT_EXPIRES_IN: "{{ .TRAKT_EXPIRES_IN }}"
        KOMETA_TRAKT_REFRESH_TOKEN: "{{ .TRAKT_REFRESH_TOKEN }}"
  dataFrom:
  - extract:
      key: kometa
  - extract:
      key: plex
  - extract:
      key: tautulli
  - extract:
      key: radarr
  - extract:
      key: sonarr



================================================
FILE: kubernetes/apps/base/media/plex/kometa/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s-labs/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app kometa
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
    controllers:
      kometa:
        type: cronjob
        annotations:
          reloader.stakater.com/auto: "true"
        cronjob:
          schedule: "@daily"
          timeZone: &timeZone America/Edmonton
          concurrencyPolicy: Forbid
          successfulJobsHistory: 1
          failedJobsHistory: 1
        containers:
          app:
            image:
              repository: kometateam/kometa
              tag: v2.2.0@sha256:e8bf350bcdf7e16fc3ab0f128e2ef43a447bd1c4d3352a2f521fcf2b3b421d39
            command:
              - /bin/sh
              - -c
            args:
              - |
                python3 kometa.py --run --read-only-config --run-libraries "Anime";
                python3 kometa.py --run --read-only-config --run-libraries "Movies";
                python3 kometa.py --run --read-only-config --run-libraries "TV Shows";
            env:
              TZ: *timeZone
            envFrom:
              - secretRef:
                  name: kometa-secret
            resources:
              requests:
                cpu: 10m
                memory: 4096M
              limits:
                memory: 8192M
            securityContext:
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities: { drop: ["ALL"] }
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 100
        fsGroup: 100
        fsGroupChangePolicy: OnRootMismatch
    persistence:
      config:
        existingClaim: *app
      config-file:
        type: configMap
        name: kometa-configmap
        globalMounts:
          - path: /config/config.yml
            subPath: config.yml
            readOnly: true
      logs:
        type: emptyDir
        globalMounts:
          - path: /config/logs



================================================
FILE: kubernetes/apps/base/media/plex/kometa/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./externalsecret.yaml
  - ./helmrelease.yaml
configMapGenerator:
  - name: kometa-configmap
    files:
      - ./configs/config.yml
generatorOptions:
  disableNameSuffixHash: true



================================================
FILE: kubernetes/apps/base/media/plex/kometa/configs/config.yml
================================================
---
libraries:
  Anime:     # this library overrides sonarr root path and profile
    run_order:
      - collections
      - metadata
      - operations
      - overlays
    collection_files:
      - repo: Anime.yml
      - default: basic
      - default: anilist
    overlay_files:
      - remove_overlays: false
      - repo: Anime - Overlays - Charts.yml
      - repo: TV Shows - Overlays - Networks.yml
      - repo: TV Shows - Overlays - Ratings.yml
      - repo: TV Shows - Overlays - Statuses.yml
      - repo: TV Shows - Overlays - Streaming Services.yml
      - repo: TV Shows - Overlays - Studios.yml
    operations:
      mass_genre_update: tmdb
      mass_content_rating_update: omdb
      mass_audience_rating_update: mdb_tomatoesaudience
      mass_critic_rating_update: mdb_metacritic
      mass_user_rating_update: imdb
    sonarr:
      root_folder_path: /data/media/anime
      quality_profile: HD - Anime
      series_type: anime

  Movies:
    run_order:
      - collections
      - metadata
      - operations
      - overlays
    collection_files:
      # - file: config/Pre-rolls.yml #Mounted by Kustomization
      - repo: Movies.yml
      - repo: Movies - Holidays by Drazzizzi.yml
      - repo: Movies - Trakt (Unplayed) by Magic815.yml
      - default: basic
      - default: imdb
    overlay_files:
      - remove_overlays: false
      - repo: Movies - Overlays - Charts.yml
      - repo: Movies - Overlays - Oscars.yml
      - repo: Movies - Overlays - Ratings.yml
      - repo: Movies - Overlays - Stand-up.yml
      - repo: Movies - Overlays - Streaming Services.yml
      - repo: Movies - Overlays - Studios.yml
    operations:
      mass_genre_update: imdb
      mass_content_rating_update: omdb
      mass_audience_rating_update: mdb_tomatoesaudience
      mass_critic_rating_update: mdb_metacritic
      mass_user_rating_update: imdb

  TV Shows:
    run_order:
      - collections
      - metadata
      - operations
      - overlays
    collection_files:
      - repo: TV Shows.yml
      - pmm: basic
      - pmm: imdb
    overlay_files:
      - remove_overlays: false
      - repo: TV Shows - Overlays - Charts.yml
      - repo: TV Shows - Overlays - Networks.yml
      - repo: TV Shows - Overlays - Ratings.yml
      - repo: TV Shows - Overlays - Statuses.yml
      - repo: TV Shows - Overlays - Streaming Services.yml
      - repo: TV Shows - Overlays - Studios.yml
    operations:
      mass_genre_update: tmdb
      mass_content_rating_update: omdb
      mass_audience_rating_update: mdb_tomatoesaudience
      mass_critic_rating_update: mdb_metacritic
      mass_user_rating_update: imdb

settings:
  cache: true
  cache_expiration: 60
  asset_directory: config/assets
  asset_folders: false
  asset_depth: 0
  create_asset_folders: false
  prioritize_assets: false
  dimensional_asset_rename: false
  download_url_assets: true
  show_missing_season_assets: false
  show_missing_episode_assets: false
  show_asset_not_needed: true
  sync_mode: sync
  minimum_items: 1
  default_collection_order:
  delete_below_minimum: true
  delete_not_scheduled: false
  run_again_delay: 2
  missing_only_released: false
  only_filter_missing: false
  show_unmanaged: false
  show_filtered: false
  show_options: false
  show_missing: false
  show_missing_assets: false
  save_report: false
  tvdb_language: eng
  ignore_ids:
  ignore_imdb_ids:
  item_refresh_delay: 0
  playlist_sync_to_user: all
  playlist_exclude_user:
  playlist_report: false
  verify_ssl: true
  custom_repo: https://github.com/joryirving/home-ops/tree/main/kubernetes/apps/base/media/plex/kometa/custom/
  check_nightly: false
  show_unconfigured: true
  playlist_exclude_users:

mal:
  client_id: <<MYANIMELIST_CLIENT_ID>>
  client_secret: <<MYANIMELIST_CLIENT_SECRET>>
  localhost_url: <<MYANIMELIST_LOCALHOST_URL>>
  authorization:
    access_token: <<MYANIMELIST_ACCESS_TOKEN>>
    token_type: Bearer
    expires_in: <<MYANIMELIST_EXPIRES_IN>>
    refresh_token: <<MYANIMELIST_REFRESH_TOKEN>>

mdblist:
  apikey: <<MDBLIST_API_KEY>>
  cache_expiration: 60

omdb:
  apikey: <<OMDB_API_KEY>>
  cache_expiration: 60

plex:
  url: http://plex.media:32400
  token: <<PLEX_API_KEY>>
  timeout: 60
  clean_bundles: false
  empty_trash: false
  optimize: false

radarr:
  url: http://radarr.downloads
  token: <<RADARR_API_KEY>>
  add_missing: false
  add_existing: false
  root_folder_path: /data/media/movies
  monitor: true
  availability: announced
  quality_profile: HD
  tag:
  search: false
  radarr_path:
  plex_path:
  upgrade_existing: false

sonarr:
  url: http://sonarr.downloads
  token: <<SONARR_API_KEY>>
  add_missing: false
  add_existing: false
  root_folder_path: /data/media/tv
  monitor: all
  quality_profile: HD
  language_profile: English
  series_type: standard
  season_folder: true
  tag:
  search: false
  cutoff_search: false
  sonarr_path:
  plex_path:
  upgrade_existing: false

tautulli:
  url: http://tautulli.media
  apikey: <<TAUTULLI_API_KEY>>

tmdb:
  apikey: <<TMDB_API_KEY>>
  language: en
  cache_expiration: 60
  region:

trakt:
  client_id: <<TRAKT_CLIENT_ID>>
  client_secret: <<TRAKT_CLIENT_SECRET>>
  authorization:
    access_token: <<TRAKT_ACCESS_TOKEN>>
    token_type: Bearer
    expires_in: <<TRAKT_EXPIRES_IN>>
    refresh_token: <<TRAKT_REFRESH_TOKEN>>
    scope: public
    created_at: <<TRAKT_CREATED_AT>>
  pin:






================================================
FILE: kubernetes/apps/base/media/plex/kometa/configs/Pre-rolls.yml
================================================
---
collections:
  ############################
  #          MONTHS          #
  ############################

  Regular:
    build_collection: false
    server_preroll: /data/prerolls/Regular/Piracy by Netflix.mp4;/data/prerolls/Regular/Netflix Love is Sharing.mp4;/data/prerolls/Regular/Netflix Colorful Lines Plex Pre-roll.mp4
    schedule:
      - range(01/01-01/31) # January
      - range(03/01-03/31) # March
      - range(04/01-04/30) # April
      - range(05/01-05/31) # May
      - range(07/01-07/31) # July
      - range(08/01-08/31) # August
      - range(09/01-09/30) # September
      - range(11/01-11/30) # November
      - range(12/01-12/31) # December

  Black History:
    build_collection: false
    server_preroll: /data/prerolls/Black History/Black History Plex Pre-roll.mp4
    schedule: range(02/01-02/28) # February

  Pride:
    build_collection: false
    server_preroll: /data/prerolls/Pride/Netflix Pride Colors Pre-roll.mp4
    schedule: range(06/01-06/30) # June

  Halloween:
    build_collection: false
    server_preroll: /data/prerolls/Halloween/Halloween Pack V01 Plex Pre-roll.mp4;/data/prerolls/Halloween/Halloween Pack V02 Plex Pre-roll.mp4;/data/prerolls/Halloween/Halloween Pack V03 Plex Pre-roll.mp4;/data/prerolls/Halloween/Halloween Pack V04 Plex Pre-roll.mp4;/data/prerolls/Halloween/Halloween Pack V05 Plex Pre-roll.mp4;/data/prerolls/Halloween/Halloween Pack V06 Plex Pre-roll.mp4;/data/prerolls/Halloween/Halloween Pack V07 Plex Pre-roll.mp4;/data/prerolls/Halloween/Halloween Pack V08 Plex Pre-roll.mp4;/data/prerolls/Halloween/Halloween Pack V09 Plex Pre-roll.mp4
    schedule: range(10/01-10/31) # October

  ############################
  #         SPECIALS         #                                            # https://www.timeanddate.com/holidays/fun
  ############################

  Valentine's Day:
    build_collection: false
    server_preroll: /data/prerolls/Valentines/Valentine's Day Flowers Plex Pre-roll.mp4; /data/prerolls/Valentines/Valentine's Day Hearts Plex Pre-roll.mp4
    schedule: yearly(02/14) # This changes yearly

  Easter:
    build_collection: false
    server_preroll: /data/prerolls/Easter/Happy Easter Plex Pre-roll.mp4
    schedule: yearly(04/09) # This changes yearly

  Thanksgiving:
    build_collection: false
    server_preroll: /data/prerolls/Thanksgiving/Happy Thanksgiving Plex Pre-roll.mp4
    schedule: yearly(10/09) # This changes yearly

  Christmas:
    build_collection: false
    server_preroll: /data/prerolls/Christmas/Magic Christmas Tree Plex Pre-roll.mp4
    schedule: range(12/20-12/25)

  New Years:
    build_collection: false
    server_preroll: /data/prerolls/New Years/New Years Fireworks Plex Pre-roll.mp4
    schedule: range(12/31-01/07)



================================================
FILE: kubernetes/apps/base/media/plex/kometa/custom/Anime - Overlays - Charts.yml
================================================
######################################################
#                Chart Collections                   #
######################################################
templates:
  Chart:
    sort_title: +1_<<num>><<collection_name>>
    sync_mode: sync
    smart_label: random
collections:
  Plex Popular:
    template: { name: Chart, num: 1 }
    tautulli_popular:
      list_days: 30
      list_size: 20
      list_buffer: 20
    tautulli_watched:
      list_days: 30
      list_size: 20
      list_buffer: 20
    summary: Shows Popular on Plex
  Popular:
    template: { name: Chart, num: 3 }
    anidb_popular: 30
    anilist_popular: 30
    summary: Popular Anime across the internet
  Top Rated:
    template: { name: Chart, num: 4 }
    anilist_top_rated: 50
    summary: Top Rated Anime across the internet
  Current Anime Season:
    anilist_season:
      sort_by: popular
      limit: 100
    sync_mode: sync



================================================
FILE: kubernetes/apps/base/media/plex/kometa/custom/Anime.yml
================================================
##############################################################
##                  Anime Collections                       ##
##                Created by JJJonesJr33                    ##
##                      Version 2.0                         ##
##############################################################
##############################################################
##                                                          ##
##            User/Config Credits - Special Thanks          ##
##                                                          ##
##               Yozora, Bullmoose20, & Sohjiro             ##
##   Glasti1, Hiren-Z, OhMyBahGosh, tuxpeople, cpt-kuesel   ##
##      meisnate12, TheUnchainedZebra, Evil Tacctician      ##
##                                                          ##
##############################################################

#######################
##     Templates     ##
#######################

templates:
  Anime:
    mal_search:
      genre: <<mal_id>>
      limit: 0
    url_poster: https://theposterdb.com/api/assets/<<poster>>
    collection_order: alpha
    collection_mode: hide
    sync_mode: sync
  User:
    sort_title: ~<<collection_name>>
    url_poster: <<poster>>
    mal_userlist:
      username: <<username>>
      status: plan_to_watch
      sort_by: title
      limit: 0
    collection_order: alpha
    collection_mode: hide
    sync_mode: sync

#############################
##       Collections       ##
#############################

collections:

  Top Airing Anime:
    mal_airing: 10
    collection_order: custom
    sort_title: ++++++++_Top_Airing
    sync_mode: sync

  Most Popular Anime:
    mal_popular: 20
    collection_order: custom
    sort_title: ++++++++_Most_Popular
    sync_mode: sync

  Most Favorited Anime:
    mal_favorite: 20
    collection_order: custom
    sort_title: ++++++++_Most_Favorited
    sync_mode: sync

  Seasonal Winter:
    mal_season:
      season: winter
    collection_order: custom
    sort_title: +++++++_Winter
    sync_mode: sync

  Seasonal Spring:
    mal_season:
      season: spring
    collection_order: custom
    sort_title: +++++++_Spring
    sync_mode: sync

  Seasonal Summer:
    mal_season:
      season: summer
    collection_order: custom
    sort_title: +++++++_Summer
    sync_mode: sync

  Seasonal Fall:
    mal_season:
      season: fall
    collection_order: custom
    sort_title: +++++++_Fall
    sync_mode: sync

#############################
##       MyAnimeList       ##
#############################

  Action:
    template: { name: Anime, mal_id: 1, poster: 213642}
  Adventure:
    template: { name: Anime, mal_id: 2, poster: 213632}
  Avant Garde:
    template: { name: Anime, mal_id: 5, poster: 240144}
  Award Winning:
    template: { name: Anime, mal_id: 46, poster: }
  Boys Love:
    template: { name: Anime, mal_id: 28, poster: 240145}
  Comedy:
    template: { name: Anime, mal_id: 4, poster: 213629}
  Drama:
    template: { name: Anime, mal_id: 8, poster: 213630}
  Fantasy:
    template: { name: Anime, mal_id: 10, poster: 213631}
  Girls Love:
    template: { name: Anime, mal_id: 26, poster: 240152}
  Gourmet:
    template: { name: Anime, mal_id: 47, poster: 240874}
  Horror:
    template: { name: Anime, mal_id: 14, poster: 240855}
  Mystery:
    template: { name: Anime, mal_id: 7, poster: 240863}
  Romance:
    template: { name: Anime, mal_id: 22, poster: 213637}
  Sci-Fi:
    template: { name: Anime, mal_id: 24, poster: 213635}
  Slice of Life:
    template: { name: Anime, mal_id: 36, poster: 213663}
  Sports:
    template: { name: Anime, mal_id: 30, poster: 213634}
  Supernatural:
    template: { name: Anime, mal_id: 37, poster: 213670}
  Suspense:
    template: { name: Anime, mal_id: 41, poster: 240217}
  Ecchi:
    template: { name: Anime, mal_id: 9, poster: 240150}
  Erotica:
    template: { name: Anime, mal_id: 49, poster: }
  Hentai:
    template: { name: Anime, mal_id: 12, poster: }
  Adult Cast:
    template: { name: Anime, mal_id: 50, poster: 240849}
  Anthropomorphic:
    template: { name: Anime, mal_id: 51, poster: 240850}
  CGDCT:
    template: { name: Anime, mal_id: 52, poster: 240146}
  Childcare:
    template: { name: Anime, mal_id: 53, poster: 240871}
  Combat Sports:
    template: { name: Anime, mal_id: 54, poster: 240851}
  Crossdressing:
    template: { name: Anime, mal_id: 81, poster: 240852}
  Delinquents:
    template: { name: Anime, mal_id: 55, poster: 240148}
  Detective:
    template: { name: Anime, mal_id: 39, poster: 240149}
  Educational:
    template: { name: Anime, mal_id: 56, poster: 240854}
  Gag Humor:
    template: { name: Anime, mal_id: 57, poster: 240151}
  Gore:
    template: { name: Anime, mal_id: 58, poster: 240153}
  Harem:
    template: { name: Anime, mal_id: 35, poster: 240848}
  High Stakes Game:
    template: { name: Anime, mal_id: 59, poster: 240155}
  Historical:
    template: { name: Anime, mal_id: 13, poster: 213640}
  Idols Female:
    template: { name: Anime, mal_id: 60, poster: 240856}
  Idols Male:
    template: { name: Anime, mal_id: 61, poster: 240857}
  Isekai:
    template: { name: Anime, mal_id: 62, poster: 240156}
  Iyashikei:
    template: { name: Anime, mal_id: 63, poster: 240157}
  Love Polygon:
    template: { name: Anime, mal_id: 64, poster: 240860}
  Magical Sex Shift:
    template: { name: Anime, mal_id: 65, poster: 240861}
  Mahou Shoujo:
    template: { name: Anime, mal_id: 66, poster: 240158}
  Martial Arts:
    template: { name: Anime, mal_id: 17, poster: 213628}
  Mecha:
    template: { name: Anime, mal_id: 18, poster: 213668}
  Medical:
    template: { name: Anime, mal_id: 67, poster: 240159}
  Military:
    template: { name: Anime, mal_id: 38, poster: 240160}
  Music:
    template: { name: Anime, mal_id: 19, poster: 213639}
  Mythology:
    template: { name: Anime, mal_id: 6, poster: 240161}
  Organized Crime:
    template: { name: Anime, mal_id: 68, poster: 240865}
  Otaku Culture:
    template: { name: Anime, mal_id: 69, poster: 240868}
  Parody:
    template: { name: Anime, mal_id: 20, poster: 240193}
  Performing Arts:
    template: { name: Anime, mal_id: 70, poster: 240870}
  Pets:
    template: { name: Anime, mal_id: 71, poster: 240869}
  Psychological:
    template: { name: Anime, mal_id: 40, poster: 240212}
  Racing:
    template: { name: Anime, mal_id: 3, poster: 240213}
  Reincarnation:
    template: { name: Anime, mal_id: 72, poster: 240867}
  Reverse Harem:
    template: { name: Anime, mal_id: 73, poster: }
  Romantic Subtext:
    template: { name: Anime, mal_id: 74, poster: }
  Samurai:
    template: { name: Anime, mal_id: 21, poster: 213669}
  School:
    template: { name: Anime, mal_id: 23, poster: }
  Showbiz:
    template: { name: Anime, mal_id: 75, poster: }
  Space:
    template: { name: Anime, mal_id: 29, poster: 213661}
  Strategy Game:
    template: { name: Anime, mal_id: 11, poster: }
  Super Power:
    template: { name: Anime, mal_id: 31, poster: 213659}
  Survival:
    template: { name: Anime, mal_id: 76, poster: }
  Team Sports:
    template: { name: Anime, mal_id: 77, poster: }
  Time Travel:
    template: { name: Anime, mal_id: 78, poster: }
  Vampire:
    template: { name: Anime, mal_id: 32, poster: 213671}
  Video Game:
    template: { name: Anime, mal_id: 79, poster: 213657}
  Visual Arts:
    template: { name: Anime, mal_id: 80, poster: }
  Workplace:
    template: { name: Anime, mal_id: 48, poster: }
  Josei:
    template: { name: Anime, mal_id: 43, poster: 240858}
  Kids:
    template: { name: Anime, mal_id: 15, poster: 240859}
  Seinen:
    template: { name: Anime, mal_id: 42, poster: 240866}
  Shoujo:
    template: { name: Anime, mal_id: 25, poster: 240214}
  Shounen:
    template: { name: Anime, mal_id: 27, poster: 240215}

  # Collection1: # Replace Username1 with a valid MAL Username
    # template: { name: User, username: Username1, poster:  }
  # Collection2: # Replace Username2 with a valid MAL Username
    # template: { name: User, username: Username2, poster:  }



================================================
FILE: kubernetes/apps/base/media/plex/kometa/custom/Movies - Holidays by Drazzizzi.yml
================================================
# Made by Drazzizzi                                                     # Slightly modified by me

templates:
  Holiday:
    smart_label: title.asc
    delete_not_scheduled: true
    visible_library: false
    visible_home: true
    visible_shared: true
    sort_title: "!12_<<collection_name>>"
    sync_mode: sync
    collection_order: release
    summary: A timed collection of <<holiday>> movies and other movies that may relate to the holiday. This collection will automatically disappear once the holiday period is over.

collections:
  Valentines Day Movies:
    schedule: range(02/01-02/14)
    template: {name: Holiday, holiday: "Valentine's Day"}
    imdb_list:
      - https://www.imdb.com/list/ls000094398
      - https://www.imdb.com/list/ls057783436
      - https://www.imdb.com/list/ls064427905
  St. Patricks Day Movies:
    schedule: range(03/01-03/17)
    template: {name: Holiday, holiday: "St. Patrick's Day"}
    imdb_list: https://www.imdb.com/list/ls063934595
  Thanksgiving Movies:
    schedule: range(10/01-10/14)
    template: {name: Holiday, holiday: Thanksgiving}
    imdb_list:
      - https://www.imdb.com/list/ls000835734
      - https://www.imdb.com/list/ls091597850
  Halloween Movies (Big List):                                          # Named Big List because I already have one named Halloween Movies
    schedule: range(10/01-10/31)
    template: {name: Holiday, holiday: Halloween}
    imdb_list:
      - https://www.imdb.com/list/ls023118929
      - https://www.imdb.com/list/ls000099714
      - https://www.imdb.com/list/ls000058693
    imdb_search:
      genre: horror
      keyword: haunted-hous
      sort_by: popularity.asc
    tmdb_collection:
      - 91361    # Halloween Collection
      - 8581     # A Nightmare on Elm Street Collection
      - 1733     # The Mummy Collection
      - 8091     # Alien Collection
    tmdb_movie:                                                         # Added by me
      - 23437    # A Nightmare on Elm Street (2010)
  Christmas Movies (Big List):                                          # Named Big List because I already have one named Christmas Movies
    schedule: range(12/01-12/31)
    template: {name: Holiday, holiday: Christmas}
    imdb_list:
      - https://www.imdb.com/list/ls000096828
      - https://www.imdb.com/list/ls097394442
      - https://www.imdb.com/list/ls068976997
      - https://www.imdb.com/list/ls027567380
  New Years Eve Movies:
    schedule: range(12/26-01/05)
    template: {name: Holiday, holiday: "New Year's Eve"}
    imdb_list: https://www.imdb.com/list/ls066838460



================================================
FILE: kubernetes/apps/base/media/plex/kometa/custom/Movies - Overlays - Charts.yml
================================================
overlays:

############################
#          CHARTS          #
############################

  IMDb Top 250:
    overlay: IMDb Top 250
    plex_search:
      all:
        collection: IMDb Top 250
  TMDb Trending:
    overlay: TMDb Trending Alt
    plex_search:
      all:
        collection: TMDb Weekly Trending
  Trakt Trending:
    overlay: Trakt Trending
    trakt_chart:                                                        # For some reason it said the collection "Trakt Trending Now (Unplayed)" is not found, so I put this
      chart: trending
      limit: 100


================================================
FILE: kubernetes/apps/base/media/plex/kometa/custom/Movies - Overlays - Oscars.yml
================================================
overlays:

############################
#          OSCARS          #
############################

  Oscars:
    overlay: Oscars
    plex_search:
      any:
        collection:
          - Best Animated Feature Film
          - Best Cinematography
          - Best Film Editing
          - Best Picture
          - Best Sound
          - Best Visual Effects


================================================
FILE: kubernetes/apps/base/media/plex/kometa/custom/Movies - Overlays - Ratings.yml
================================================
overlays:

############################
#         RATINGS          #
############################

  IMDb Rating:
    overlay:
      name: text(user_rating)
      horizontal_offset: 780
      horizontal_align: left
      vertical_offset: 421
      vertical_align: top
      font: /config/overlays/Fonts/Impact.ttf
      font_size: 70
      font_color: "#FFFFFF"
      back_color: "#000000B3"
      back_radius: 25
      back_width: 190
      back_height: 185
      file: /config/overlays/IMDb Rating.png
      addon_offset: 20
      addon_position: top
    plex_all: true
  Metacritic:
    overlay:
      name: text(critic_rating)
      horizontal_offset: 780
      horizontal_align: left
      vertical_offset: 863
      vertical_align: top
      font: /config/overlays/Fonts/Myriad Pro Bold.otf
      font_size: 70
      font_color: "#FFFFFF"
      back_color: "#000000B3"
      back_radius: 25
      back_width: 190
      back_height: 216
      file: /config/overlays/Metacritic.png
      addon_offset: 20
      addon_position: top
    plex_all: true
  Rotten Tomatoes Audience Bad:
    overlay:
      name: text(audience_rating%)
      horizontal_offset: 780
      horizontal_align: left
      vertical_offset: 626
      vertical_align: top
      font: /config/overlays/Fonts/Franklin Gothic Demi.ttf
      font_size: 70
      font_color: "#FFFFFF"
      back_color: "#000000B3"
      back_radius: 25
      back_width: 190
      back_height: 217
      file: /config/overlays/Rotten Tomatoes Popcorn Spilled.png
      addon_offset: 20
      addon_position: top
    plex_search:
      audience_rating.gt: 0.0
      audience_rating.lte: 5.9
  Rotten Tomatoes Audience Good:
    overlay:
      name: text(audience_rating%)
      horizontal_offset: 780
      horizontal_align: left
      vertical_offset: 626
      vertical_align: top
      font: /config/overlays/Fonts/Franklin Gothic Demi.ttf
      font_size: 70
      font_color: "#FFFFFF"
      back_color: "#000000B3"
      back_radius: 25
      back_width: 190
      back_height: 217
      file: /config/overlays/Rotten Tomatoes Popcorn Upright.png
      addon_offset: 20
      addon_position: top
    plex_search:
      audience_rating.gte: 6.0
      audience_rating.lt: 10.0
# TMDb Rating:
#   overlay:
#     name: text(user_rating)
#     horizontal_offset: 780
#     horizontal_align: left
#     vertical_offset: 421
#     vertical_align: top
#     font: /config/overlays/Fonts/Avenir Black.ttf
#     font_size: 70
#     font_color: "#FFFFFF"
#     back_color: "#000000B3"
#     back_radius: 25
#     back_width: 190
#     back_height: 185
#     file: /config/overlays/TMDb Rating.png
#     addon_offset: 20
#     addon_position: top
#   plex_all: true


================================================
FILE: kubernetes/apps/base/media/plex/kometa/custom/Movies - Overlays - Stand-up.yml
================================================
overlays:

############################
#     STAND-UP COMEDY      #
############################

  Stand-up Comedy:
    overlay: Stand-up Comedy
    plex_search:
      all:
        collection: Stand-up Comedy


================================================
FILE: kubernetes/apps/base/media/plex/kometa/custom/Movies - Overlays - Streaming Services.yml
================================================
overlays:

############################
#    STREAMING SERVICES    #
############################

  Apple TV+:
    overlay: Apple TV+
    plex_search:
      all:
        collection: Apple TV+
  HBO Max:
    overlay: HBO Max
    plex_search:
      all:
        collection: HBO Max
  Hulu:
    overlay: Hulu
    plex_search:
      all:
        collection: Hulu
  Netflix Film:
    overlay: Netflix Film
    plex_search:
      all:
        collection: Netflix
  Netflix Stand-up:
    overlay: Netflix Stand-up
    plex_search:
      all:
        collection: Netflix Stand-up
  Paramount+:
    overlay: Paramount+
    plex_search:
      all:
        collection: Paramount+
  Prime Video:
    overlay: Prime Video
    plex_search:
      all:
        collection: Prime Video


================================================
FILE: kubernetes/apps/base/media/plex/kometa/custom/Movies - Overlays - Studios.yml
================================================
overlays:

############################
#         STUDIOS          #
############################

  20th Century Fox:
    overlay: 20th Century Fox
    plex_search:
      any:
        studio.is:
          - 20th Century Animation
          - 20th Century Fox
          - 20th Century Fox Animation
          - 20th Century Fox Television
  Amazon Studios:
    overlay: Amazon Studios
    plex_search:
      all:
        studio.is: Amazon Studios
  Amblin Entertainment:
    overlay: Amblin Entertainment
    plex_search:
      all:
        studio.is: Amblin Entertainment
  Bad Robot:
    overlay: Bad Robot
    plex_search:
      all:
        studio.is: Bad Robot
  Blue Sky Studios:
    overlay: Blue Sky Studios
    plex_search:
      all:
        studio.is: Blue Sky Studios
  Castle Rock Entertainment:
    overlay: Castle Rock Entertainment
    plex_search:
      all:
        studio.is: Castle Rock Entertainment
  Chernin Entertainment:
    overlay: Chernin Entertainment
    plex_search:
      all:
        studio.is: Chernin Entertainment
  Columbia Pictures:
    overlay: Columbia Pictures
    plex_search:
      all:
        studio.is: Columbia Pictures
  Davis Entertainment:
    overlay: Davis Entertainment
    plex_search:
      all:
        studio.is: Davis Entertainment
  DC:
    overlay: DC
    plex_search:
      any:
        studio.is:
          - DC Comics
          - DC Entertainment
  Dimension Films:
    overlay: Dimension Films
    plex_search:
      all:
        studio.is: Dimension Films
  Disney Channel:
    overlay: Disney Channel
    plex_search:
      all:
        studio.is: Disney Channel
  DreamWorks Pictures:
    overlay: DreamWorks Pictures
    plex_search:
      all:
        studio.is: DreamWorks Pictures
  DreamWorks Animation:
    overlay: DreamWorks Animation
    plex_search:
      all:
        studio.is: DreamWorks Animation
  Eon Productions:
    overlay: Eon Productions
    plex_search:
      all:
        studio.is: Eon Productions
  Focus Features:
    overlay: Focus Features
    plex_search:
      all:
        studio.is: Focus Features
  Fox 2000 Pictures:
    overlay: Fox 2000 Pictures
    plex_search:
      all:
        studio.is: Fox 2000 Pictures
  Fox Searchlight Pictures:
    overlay: Fox Searchlight Pictures
    plex_search:
      all:
        studio.is: Fox Searchlight Pictures
  Happy Madison Productions:
    overlay: Happy Madison Productions
    plex_search:
      all:
        studio.is: Happy Madison Productions
  HBO:
    overlay: HBO
    plex_search:
      all:
        studio.is: HBO
  Illumination:
    overlay: Illumination
    plex_search:
      any:
        studio.is:
          - Illumination
          - Illumination Entertainment
  Legendary Pictures:
    overlay: Legendary Pictures
    plex_search:
      all:
        studio.is: Legendary Pictures
  Lionsgate:
    overlay: Lionsgate
    plex_search:
      any:
        studio.is:
          - Lions Gate Films
          - Lionsgate
  Lucasfilm:
    overlay: Lucasfilm
    plex_search:
      all:
        studio.is: Lucasfilm
  Marvel:
    overlay: Marvel
    plex_search:
      any:
        studio.is:
          - Marvel Enterprises
          - Marvel Entertainment
  Marvel Studios:
    overlay: Marvel Studios
    plex_search:
      any:
        studio.is: Marvel Studios
        title.is: "Marvel's Infinity Saga: The Sacred Timeline"
  Metro-Goldwyn-Mayer:
    overlay: Metro-Goldwyn-Mayer
    plex_search:
      any:
        studio.is:
          - Metro-Goldwyn-Mayer
          - Metro-Goldwyn-Mayer (MGM)
          - MGM Home Entertainment
  Miramax:
    overlay: Miramax
    plex_search:
      all:
        studio.is: Miramax
  NBC:
    overlay: NBC-2                                                      # 2 because the regular one is a netwwork for TV Shows
    plex_search:
      all:
        studio.is: NBC
  New Line Cinema:
    overlay: New Line Cinema
    plex_search:
      all:
        studio.is: New Line Cinema
  Original Film:
    overlay: Original Film
    plex_search:
      all:
        studio.is: Original Film
  Orion Pictures:
    overlay: Orion Pictures
    plex_search:
      all:
        studio.is: Orion Pictures
  Paramount:
    overlay: Paramount
    plex_search:
      any:
        studio.is:
          - Paramount
          - Paramount Animation
          - Paramount Famous Lasky Corporation
          - Paramount Pictures Digital Entertainment
          - Paramount Vantage
  Pixar:
    overlay: Pixar
    suppress_overlays:
      