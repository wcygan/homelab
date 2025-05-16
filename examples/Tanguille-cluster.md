Directory structure:
└── tanguille-cluster/
    ├── README.md
    ├── LICENSE
    ├── makejinja.toml
    ├── Taskfile.yaml
    ├── .deepsource.toml
    ├── .editorconfig
    ├── .envrc
    ├── .mise.toml
    ├── .prettierignore
    ├── .shellcheckrc
    ├── .sops.yaml
    ├── bootstrap/
    │   └── helmfile.yaml
    ├── docs/
    │   └── useful_commands.md
    ├── kubernetes/
    │   ├── apps/
    │   │   ├── actions-runner-system/
    │   │   │   ├── kustomization.yaml
    │   │   │   └── actions-runner-controller/
    │   │   │       ├── ks.yaml
    │   │   │       ├── app/
    │   │   │       │   ├── helmrelease.yaml
    │   │   │       │   └── kustomization.yaml
    │   │   │       └── runners/
    │   │   │           ├── kustomization.yaml
    │   │   │           └── cluster/
    │   │   │               ├── helmrelease.yaml
    │   │   │               ├── kustomization.yaml
    │   │   │               ├── rbac.yaml
    │   │   │               └── secrets.sops.yaml
    │   │   ├── ai/
    │   │   │   ├── kustomization.yaml
    │   │   │   ├── k8sgpt/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── app/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   └── config/
    │   │   │   │       ├── k8sgpt.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── ollama/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       └── pvc.yaml
    │   │   │   ├── open-webui/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       └── secrets.sops.yaml
    │   │   │   └── perplexica/
    │   │   │       ├── ks.yaml
    │   │   │       └── app/
    │   │   │           ├── helmrelease.yaml
    │   │   │           └── kustomization.yaml
    │   │   ├── cert-manager/
    │   │   │   ├── kustomization.yaml
    │   │   │   └── cert-manager/
    │   │   │       ├── ks.yaml
    │   │   │       ├── app/
    │   │   │       │   ├── clusterissuer.yaml
    │   │   │       │   ├── helmrelease.yaml
    │   │   │       │   ├── kustomization.yaml
    │   │   │       │   ├── secret.sops.yaml
    │   │   │       │   └── helm/
    │   │   │       │       ├── kustomizeconfig.yaml
    │   │   │       │       └── values.yaml
    │   │   │       ├── issuers/
    │   │   │       │   └── secret.sops.yaml
    │   │   │       └── tls/
    │   │   │           ├── certificate.yaml
    │   │   │           └── kustomization.yaml
    │   │   ├── database/
    │   │   │   ├── kustomization.yaml
    │   │   │   ├── cloudnative-pg/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── app/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── monitoring-configmap.yaml
    │   │   │   │   │   └── secret.sops.yaml
    │   │   │   │   └── cluster/
    │   │   │   │       ├── cluster16.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       ├── prometheusrule.yaml
    │   │   │   │       ├── scheduledbackup.yaml
    │   │   │   │       └── service.yaml
    │   │   │   └── dragonfly/
    │   │   │       ├── ks.yaml
    │   │   │       ├── app/
    │   │   │       │   ├── helmrelease.yaml
    │   │   │       │   ├── kustomization.yaml
    │   │   │       │   └── rbac.yaml
    │   │   │       └── cluster/
    │   │   │           ├── cluster.yaml
    │   │   │           ├── kustomization.yaml
    │   │   │           └── podmonitor.yaml
    │   │   ├── default/
    │   │   │   ├── kustomization.yaml
    │   │   │   ├── changedetection/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── echo/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── homarr/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       └── secret.sops.yaml
    │   │   │   ├── it-tools/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── nextcloud/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       ├── nfs-pvc.yaml
    │   │   │   │       └── secret.sops.yaml
    │   │   │   ├── searxng/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       ├── limiter.toml
    │   │   │   │       └── settings.yml
    │   │   │   └── spoolman/
    │   │   │       ├── ks.yaml
    │   │   │       └── app/
    │   │   │           ├── helmrelease.yaml
    │   │   │           ├── kustomization.yaml
    │   │   │           └── secret.sops.yaml
    │   │   ├── flux-system/
    │   │   │   ├── kustomization.yaml
    │   │   │   ├── capacitor/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       └── rbac.yaml
    │   │   │   ├── flux-instance/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── ingress.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       ├── receiver.yaml
    │   │   │   │       ├── secret.sops.yaml
    │   │   │   │       └── helm/
    │   │   │   │           ├── kustomizeconfig.yaml
    │   │   │   │           └── values.yaml
    │   │   │   └── flux-operator/
    │   │   │       ├── ks.yaml
    │   │   │       ├── app/
    │   │   │       │   ├── helm-values.yaml
    │   │   │       │   ├── helmrelease.yaml
    │   │   │       │   ├── kustomization.yaml
    │   │   │       │   ├── kustomizeconfig.yaml
    │   │   │       │   └── helm/
    │   │   │       │       ├── kustomizeconfig.yaml
    │   │   │       │       └── values.yaml
    │   │   │       └── instance/
    │   │   │           ├── helm-values.yaml
    │   │   │           ├── helmrelease.yaml
    │   │   │           ├── kustomization.yaml
    │   │   │           ├── kustomizeconfig.yaml
    │   │   │           ├── prometheusrule.yaml
    │   │   │           └── github/
    │   │   │               ├── kustomization.yaml
    │   │   │               └── webhooks/
    │   │   │                   ├── ingress.yaml
    │   │   │                   ├── kustomization.yaml
    │   │   │                   ├── receiver.yaml
    │   │   │                   └── secret.sops.yaml
    │   │   ├── kube-system/
    │   │   │   ├── kustomization.yaml
    │   │   │   ├── cilium/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       ├── kustomizeconfig.yaml
    │   │   │   │       ├── networks.yaml
    │   │   │   │       └── helm/
    │   │   │   │           ├── kustomizeconfig.yaml
    │   │   │   │           └── values.yaml
    │   │   │   ├── coredns/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       ├── kustomizeconfig.yaml
    │   │   │   │       └── helm/
    │   │   │   │           ├── kustomizeconfig.yaml
    │   │   │   │           └── values.yaml
    │   │   │   ├── kubelet-csr-approver/
    │   │   │   │   └── app/
    │   │   │   │       ├── helm-values.yaml
    │   │   │   │       └── kustomizeconfig.yaml
    │   │   │   ├── metrics-server/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── node-feature-discovery/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── nvidia-plugin/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── class.yaml
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── reloader/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   └── snapshot-controller/
    │   │   │       ├── ks.yaml
    │   │   │       └── app/
    │   │   │           ├── helmrelease.yaml
    │   │   │           └── kustomization.yaml
    │   │   ├── media/
    │   │   │   ├── kustomization.yaml
    │   │   │   ├── bazarr/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── cross-seed/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       ├── secret.sops.yaml
    │   │   │   │       └── config/
    │   │   │   │           └── config.js
    │   │   │   ├── fileflows/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── flaresolverr/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── jellyfin/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── jellyseerr/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── jellystat/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       └── secret.sops.yaml
    │   │   │   ├── prowlarr/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── qbittorrent/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── qbitmanage/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── config/
    │   │   │   │   │       └── config.yaml
    │   │   │   │   ├── qbitrr/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── config/
    │   │   │   │   │       └── config.toml
    │   │   │   │   └── qbittorrent/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       └── config/
    │   │   │   │           └── dnsdist.conf
    │   │   │   ├── radarr/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── recyclarr/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       ├── config/
    │   │   │   │       │   └── recyclarr.yaml
    │   │   │   │       └── includes/
    │   │   │   │           ├── Radarr_Anime_Custom_Formats.yaml
    │   │   │   │           ├── Radarr_Standard_Custom_Formats.yaml
    │   │   │   │           ├── Sonarr_Anime_Custom_Formats.yaml
    │   │   │   │           └── Sonarr_Standard_Custom_Formats.yaml
    │   │   │   ├── sonarr/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── unpackerr/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   └── wizarr/
    │   │   │       ├── ks.yaml
    │   │   │       └── app/
    │   │   │           ├── helmrelease.yaml
    │   │   │           └── kustomization.yaml
    │   │   ├── network/
    │   │   │   ├── kustomization.yaml
    │   │   │   ├── external/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── cloudflared/
    │   │   │   │   │   ├── dnsendpoint.yaml
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   ├── secret.sops.yaml
    │   │   │   │   │   └── configs/
    │   │   │   │   │       └── config.yaml
    │   │   │   │   ├── external-dns/
    │   │   │   │   │   ├── helmrelease.yaml
    │   │   │   │   │   ├── kustomization.yaml
    │   │   │   │   │   └── secret.sops.yaml
    │   │   │   │   └── ingress-nginx/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── external-service/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   ├── avr/
    │   │   │   │   │   ├── ingress.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── homeassistant/
    │   │   │   │   │   ├── ingress.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── ipmi/
    │   │   │   │   │   ├── ingress.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── opnsense/
    │   │   │   │   │   ├── ingress.yaml
    │   │   │   │   │   └── kustomization.yaml
    │   │   │   │   ├── scrutiny/
    │   │   │   │   │   └── ingress.yaml
    │   │   │   │   └── truenas/
    │   │   │   │       ├── ingress.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   └── internal/
    │   │   │       ├── ks.yaml
    │   │   │       ├── ingress-nginx/
    │   │   │       │   ├── helmrelease.yaml
    │   │   │       │   └── kustomization.yaml
    │   │   │       └── k8s-gateway/
    │   │   │           ├── helmrelease.yaml
    │   │   │           └── kustomization.yaml
    │   │   ├── observability/
    │   │   │   ├── kustomization.yaml
    │   │   │   ├── cupdate/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── ingress.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   ├── exporters/
    │   │   │   │   ├── kustomization.yaml
    │   │   │   │   ├── dcgm-exporter/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       ├── alerts.yaml
    │   │   │   │   │       ├── helmrelease.yaml
    │   │   │   │   │       └── kustomization.yaml
    │   │   │   │   ├── nut-exporter/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       ├── helmrelease.yaml
    │   │   │   │   │       ├── kustomization.yaml
    │   │   │   │   │       └── secret.sops.yaml
    │   │   │   │   ├── prowlarr-exporter/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       ├── helmrelease.yaml
    │   │   │   │   │       └── kustomization.yaml
    │   │   │   │   ├── qbittorrent-exporter/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       ├── helmrelease.yaml
    │   │   │   │   │       ├── kustomization.yaml
    │   │   │   │   │       └── secret.sops.yaml
    │   │   │   │   ├── radarr-exporter/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       ├── helmrelease.yaml
    │   │   │   │   │       └── kustomization.yaml
    │   │   │   │   ├── smartctl-exporter/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       ├── helmrelease.yaml
    │   │   │   │   │       ├── kustomization.yaml
    │   │   │   │   │       ├── prometheusrule.yaml
    │   │   │   │   │       └── scrapeconfig.yaml
    │   │   │   │   ├── sonarr-exporter/
    │   │   │   │   │   ├── ks.yaml
    │   │   │   │   │   └── app/
    │   │   │   │   │       ├── helmrelease.yaml
    │   │   │   │   │       └── kustomization.yaml
    │   │   │   │   └── speedtest-exporter/
    │   │   │   │       ├── ks.yaml
    │   │   │   │       └── app/
    │   │   │   │           ├── helmrelease.yaml
    │   │   │   │           └── kustomization.yaml
    │   │   │   ├── gatus/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       ├── rbac.yaml
    │   │   │   │       ├── secret.sops.yaml
    │   │   │   │       └── resources/
    │   │   │   │           └── config.yaml
    │   │   │   ├── grafana/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       └── secret.sops.yaml
    │   │   │   ├── kromgo/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       └── resources/
    │   │   │   │           └── config.yaml
    │   │   │   ├── kube-prometheus-stack/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── discord-template.yaml
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       ├── kustomization.yaml
    │   │   │   │       ├── scrapeconfig.yaml
    │   │   │   │       └── secret.sops.yaml
    │   │   │   ├── loki/
    │   │   │   │   ├── ks.yaml
    │   │   │   │   └── app/
    │   │   │   │       ├── helmrelease.yaml
    │   │   │   │       └── kustomization.yaml
    │   │   │   └── promtail/
    │   │   │       ├── ks.yaml
    │   │   │       └── app/
    │   │   │           ├── helmrelease.yaml
    │   │   │           └── kustomization.yaml
    │   │   ├── openebs-system/
    │   │   │   ├── kustomization.yaml
    │   │   │   └── openebs/
    │   │   │       ├── ks.yaml
    │   │   │       └── app/
    │   │   │           ├── helmrelease.yaml
    │   │   │           ├── kustomization.yaml
    │   │   │           └── zfs-snapshotclass.yaml
    │   │   ├── volsync-system/
    │   │   │   ├── kustomization.yaml
    │   │   │   └── volsync/
    │   │   │       ├── ks.yaml
    │   │   │       └── app/
    │   │   │           ├── helmrelease.yaml
    │   │   │           ├── kustomization.yaml
    │   │   │           ├── mutatingadmissionpolicy.yaml
    │   │   │           └── prometheusrule.yaml
    │   │   └── zfs/
    │   │       ├── kustomization.yaml
    │   │       └── zfs-scrubber/
    │   │           ├── ks.yaml
    │   │           └── app/
    │   │               ├── helmrelease.yaml
    │   │               └── kustomization.yaml
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── cluster-secrets.sops.yaml
    │   │   │   ├── cluster-settings.yaml
    │   │   │   ├── kustomization.yaml
    │   │   │   ├── namespace.yaml
    │   │   │   └── sops-age.sops.yaml
    │   │   ├── gatus/
    │   │   │   ├── external/
    │   │   │   │   ├── config.yaml
    │   │   │   │   └── kustomization.yaml
    │   │   │   └── guarded/
    │   │   │       ├── config.yaml
    │   │   │       └── kustomization.yaml
    │   │   ├── repos/
    │   │   │   ├── kustomization.yaml
    │   │   │   └── app-template/
    │   │   │       ├── kustomization.yaml
    │   │   │       └── ocirepository.yaml
    │   │   └── volsync/
    │   │       ├── b2.yaml
    │   │       ├── claim.yaml
    │   │       ├── kustomization.yaml
    │   │       └── secret.sops.yaml
    │   └── flux/
    │       ├── cluster/
    │       │   └── ks.yaml
    │       └── meta/
    │           ├── kustomization.yaml
    │           └── repos/
    │               ├── actions-runner-controller.yaml
    │               ├── backube.yaml
    │               ├── bitnami.yaml
    │               ├── cloudnative-pg.yaml
    │               ├── controlplaneio.yaml
    │               ├── dcgm-exporter.yaml
    │               ├── external-dns.yaml
    │               ├── external-secrets.yaml
    │               ├── grafana.yaml
    │               ├── homarr-labs.yaml
    │               ├── ingress-nginx.yaml
    │               ├── k8sgpt.yaml
    │               ├── kustomization.yaml
    │               ├── nextcloud.yaml
    │               ├── node-feature-discovery.yaml
    │               ├── nvidia-plugin.yaml
    │               ├── piraeus.yaml
    │               └── prometheus-community.yaml
    ├── scripts/
    │   ├── bootstrap-apps.sh
    │   └── lib/
    │       └── common.sh
    ├── talos/
    │   ├── talconfig.yaml
    │   ├── talenv.yaml
    │   ├── talsecret.sops.yaml
    │   ├── clusterconfig/
    │   │   └── .gitignore
    │   └── patches/
    │       ├── README.md
    │       ├── controller/
    │       │   ├── admission-controller-patch.yaml
    │       │   └── cluster.yaml
    │       └── global/
    │           ├── gpu-worker-patch.yaml
    │           ├── machine-files.yaml
    │           ├── machine-kubelet.yaml
    │           ├── machine-network.yaml
    │           ├── machine-sysctls.yaml
    │           ├── machine-time.yaml
    │           └── zfs-patch.yaml
    ├── templates/
    │   ├── config/
    │   │   ├── .sops.yaml.j2
    │   │   ├── bootstrap/
    │   │   │   ├── github-deploy-key.sops.yaml.j2
    │   │   │   └── helmfile.yaml.j2
    │   │   ├── kubernetes/
    │   │   │   ├── apps/
    │   │   │   │   ├── cert-manager/
    │   │   │   │   │   ├── kustomization.yaml.j2
    │   │   │   │   │   └── cert-manager/
    │   │   │   │   │       ├── ks.yaml.j2
    │   │   │   │   │       ├── app/
    │   │   │   │   │       │   ├── clusterissuer.yaml.j2
    │   │   │   │   │       │   ├── helmrelease.yaml.j2
    │   │   │   │   │       │   ├── kustomization.yaml.j2
    │   │   │   │   │       │   ├── secret.sops.yaml.j2
    │   │   │   │   │       │   └── helm/
    │   │   │   │   │       │       ├── kustomizeconfig.yaml.j2
    │   │   │   │   │       │       └── values.yaml.j2
    │   │   │   │   │       └── tls/
    │   │   │   │   │           ├── certificate.yaml.j2
    │   │   │   │   │           └── kustomization.yaml.j2
    │   │   │   │   ├── default/
    │   │   │   │   │   ├── kustomization.yaml.j2
    │   │   │   │   │   └── echo/
    │   │   │   │   │       ├── ks.yaml.j2
    │   │   │   │   │       └── app/
    │   │   │   │   │           ├── helmrelease.yaml.j2
    │   │   │   │   │           └── kustomization.yaml.j2
    │   │   │   │   ├── flux-system/
    │   │   │   │   │   ├── kustomization.yaml.j2
    │   │   │   │   │   ├── flux-instance/
    │   │   │   │   │   │   ├── ks.yaml.j2
    │   │   │   │   │   │   └── app/
    │   │   │   │   │   │       ├── helmrelease.yaml.j2
    │   │   │   │   │   │       ├── ingress.yaml.j2
    │   │   │   │   │   │       ├── kustomization.yaml.j2
    │   │   │   │   │   │       ├── receiver.yaml.j2
    │   │   │   │   │   │       ├── secret.sops.yaml.j2
    │   │   │   │   │   │       └── helm/
    │   │   │   │   │   │           ├── kustomizeconfig.yaml.j2
    │   │   │   │   │   │           └── values.yaml.j2
    │   │   │   │   │   └── flux-operator/
    │   │   │   │   │       ├── ks.yaml.j2
    │   │   │   │   │       └── app/
    │   │   │   │   │           ├── helmrelease.yaml.j2
    │   │   │   │   │           ├── kustomization.yaml.j2
    │   │   │   │   │           └── helm/
    │   │   │   │   │               ├── kustomizeconfig.yaml.j2
    │   │   │   │   │               └── values.yaml.j2
    │   │   │   │   ├── kube-system/
    │   │   │   │   │   ├── kustomization.yaml.j2
    │   │   │   │   │   ├── cilium/
    │   │   │   │   │   │   ├── ks.yaml.j2
    │   │   │   │   │   │   └── app/
    │   │   │   │   │   │       ├── helmrelease.yaml.j2
    │   │   │   │   │   │       ├── kustomization.yaml.j2
    │   │   │   │   │   │       ├── networks.yaml.j2
    │   │   │   │   │   │       └── helm/
    │   │   │   │   │   │           ├── kustomizeconfig.yaml.j2
    │   │   │   │   │   │           └── values.yaml.j2
    │   │   │   │   │   ├── coredns/
    │   │   │   │   │   │   ├── ks.yaml.j2
    │   │   │   │   │   │   └── app/
    │   │   │   │   │   │       ├── helmrelease.yaml.j2
    │   │   │   │   │   │       ├── kustomization.yaml.j2
    │   │   │   │   │   │       └── helm/
    │   │   │   │   │   │           ├── kustomizeconfig.yaml.j2
    │   │   │   │   │   │           └── values.yaml.j2
    │   │   │   │   │   ├── metrics-server/
    │   │   │   │   │   │   ├── ks.yaml.j2
    │   │   │   │   │   │   └── app/
    │   │   │   │   │   │       ├── helmrelease.yaml.j2
    │   │   │   │   │   │       └── kustomization.yaml.j2
    │   │   │   │   │   ├── reloader/
    │   │   │   │   │   │   ├── ks.yaml.j2
    │   │   │   │   │   │   └── app/
    │   │   │   │   │   │       ├── helmrelease.yaml.j2
    │   │   │   │   │   │       └── kustomization.yaml.j2
    │   │   │   │   │   └── spegel/
    │   │   │   │   │       ├── ks.yaml.j2
    │   │   │   │   │       └── app/
    │   │   │   │   │           ├── helmrelease.yaml.j2
    │   │   │   │   │           ├── kustomization.yaml.j2
    │   │   │   │   │           └── helm/
    │   │   │   │   │               ├── kustomizeconfig.yaml.j2
    │   │   │   │   │               └── values.yaml.j2
    │   │   │   │   └── network/
    │   │   │   │       ├── kustomization.yaml.j2
    │   │   │   │       ├── external/
    │   │   │   │       │   ├── ks.yaml.j2
    │   │   │   │       │   ├── cloudflared/
    │   │   │   │       │   │   ├── dnsendpoint.yaml.j2
    │   │   │   │       │   │   ├── helmrelease.yaml.j2
    │   │   │   │       │   │   ├── kustomization.yaml.j2
    │   │   │   │       │   │   ├── secret.sops.yaml.j2
    │   │   │   │       │   │   └── configs/
    │   │   │   │       │   │       └── config.yaml.j2
    │   │   │   │       │   ├── external-dns/
    │   │   │   │       │   │   ├── helmrelease.yaml.j2
    │   │   │   │       │   │   ├── kustomization.yaml.j2
    │   │   │   │       │   │   └── secret.sops.yaml.j2
    │   │   │   │       │   └── ingress-nginx/
    │   │   │   │       │       ├── helmrelease.yaml.j2
    │   │   │   │       │       └── kustomization.yaml.j2
    │   │   │   │       └── internal/
    │   │   │   │           ├── ks.yaml.j2
    │   │   │   │           ├── ingress-nginx/
    │   │   │   │           │   ├── helmrelease.yaml.j2
    │   │   │   │           │   └── kustomization.yaml.j2
    │   │   │   │           └── k8s-gateway/
    │   │   │   │               ├── helmrelease.yaml.j2
    │   │   │   │               └── kustomization.yaml.j2
    │   │   │   ├── components/
    │   │   │   │   ├── common/
    │   │   │   │   │   ├── cluster-secrets.sops.yaml.j2
    │   │   │   │   │   ├── kustomization.yaml.j2
    │   │   │   │   │   ├── namespace.yaml.j2
    │   │   │   │   │   └── sops-age.sops.yaml.j2
    │   │   │   │   └── repos/
    │   │   │   │       └── app-template/
    │   │   │   │           ├── kustomization.yaml.j2
    │   │   │   │           └── ocirepository.yaml.j2
    │   │   │   └── flux/
    │   │   │       ├── cluster/
    │   │   │       │   └── ks.yaml.j2
    │   │   │       └── meta/
    │   │   │           ├── kustomization.yaml.j2
    │   │   │           └── repos/
    │   │   │               ├── external-dns.yaml.j2
    │   │   │               ├── ingress-nginx.yaml.j2
    │   │   │               └── kustomization.yaml.j2
    │   │   └── talos/
    │   │       ├── talconfig.yaml.j2
    │   │       ├── talenv.yaml.j2
    │   │       └── patches/
    │   │           ├── README.md.j2
    │   │           ├── controller/
    │   │           │   ├── admission-controller-patch.yaml.j2
    │   │           │   └── cluster.yaml.j2
    │   │           └── global/
    │   │               ├── machine-files.yaml.j2
    │   │               ├── machine-kubelet.yaml.j2
    │   │               ├── machine-network.yaml.j2
    │   │               ├── machine-sysctls.yaml.j2
    │   │               └── machine-time.yaml.j2
    │   ├── overrides/
    │   │   └── readme.partial.yaml.j2
    │   └── scripts/
    │       └── plugin.py
    ├── .github/
    │   ├── labeler.yaml
    │   ├── labels.yaml
    │   ├── renovate.json5
    │   ├── renovate/
    │   │   ├── allowedVersions.json5
    │   │   ├── autoMerge.json5
    │   │   ├── customManagers.json5
    │   │   ├── grafanaDashboards.json5
    │   │   ├── groups.json5
    │   │   ├── labels.json5
    │   │   ├── packageRules.json5
    │   │   └── semanticCommits.json5
    │   └── workflows/
    │       ├── flux-local.yaml
    │       ├── image-pull.yaml
    │       ├── kube-linter.yaml
    │       ├── label-sync.yaml
    │       ├── labeler.yaml
    │       ├── mise.yaml
    │       └── tag.yaml
    └── .taskfiles/
        ├── bootstrap/
        │   └── Taskfile.yaml
        ├── kubernetes/
        │   └── Taskfile.yaml
        ├── talos/
        │   └── Taskfile.yaml
        ├── template/
        │   ├── Taskfile.yaml
        │   └── resources/
        │       ├── cluster.schema.cue
        │       ├── kubeconform.sh
        │       └── nodes.schema.cue
        └── volsync/
            ├── taskfile.yaml
            └── resources/
                └── replicationdestination.yaml.j2


Files Content:

(Files content cropped to 300k characters, download full ingest to see more)
================================================
FILE: README.md
================================================
# Cluster

Welcome to my fluxcd kubernetes cluster running on talos. This is based on the [cluster-template](https://github.com/onedr0p/cluster-template) project where I want to express my gratitude to the community for all the amazing work they have done.

## 💥 Reset

> [!WARNING] > **Resetting** the cluster **multiple times in a short period of time** could lead to being **rate limited by DockerHub or Let's Encrypt**.

There might be a situation where you want to destroy your Kubernetes cluster. The following command will reset your nodes back to maintenance mode.

```sh
task talos:reset
```

## 🛠️ Talos and Kubernetes Maintenance

### ⚙️ Updating Talos node configuration

> [!TIP]
> Ensure you have updated `talconfig.yaml` and any patches with your updated configuration. In some cases you **not only need to apply the configuration but also upgrade talos** to apply new configuration.

```sh
# (Re)generate the Talos config
task talos:generate-config
# Apply the config to the node
task talos:apply-node IP=? MODE=?
# e.g. task talos:apply-node IP=10.10.10.10 MODE=auto
```

### ⬆️ Updating Talos and Kubernetes versions

> [!TIP]
> Ensure the `talosVersion` and `kubernetesVersion` in `talenv.yaml` are up-to-date with the version you wish to upgrade to.

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

## 🐛 Debugging

Below is a general guide on trying to debug an issue with an resource or application. For example, if a workload/resource is not showing up or a pod has started but in a `CrashLoopBackOff` or `Pending` state. These steps do not include a way to fix the problem as the problem could be one of many different things.

1. Check if the Flux resources are up-to-date and in a ready state:

    📍 _Run `task reconcile` to force Flux to sync your Git repository state_

    ```sh
    flux get sources oci -A
    flux get sources git -A
    flux get ks -A
    ```

2. Then check all the Flux Helm Releases and verify they are healthy.

    ```sh
    flux get hr -A
    ```

3. Do you see the pod of the workload you are debugging:

    ```sh
    kubectl -n <namespace> get pods -o wide
    ```

4. Check the logs of the pod if its there:

    ```sh
    kubectl -n <namespace> logs <pod-name> -f
    ```

5. If a resource exists try to describe it to see what problems it might have:

    ```sh
    kubectl -n <namespace> describe <resource> <name>
    ```

6. Check the namespace events:

    ```sh
    kubectl -n <namespace> get events --sort-by='.metadata.creationTimestamp'
    ```

Resolving problems that you have could take some tweaking of your YAML manifests in order to get things working, other times it could be a external factor like permissions on NFS.

## ❔ What's next

The cluster is your oyster (or something like that). Below are some optional considerations you might want to review.

### Ship it

To browse or get ideas on applications people are running, community member [@whazor](https://github.com/whazor) created [Kubesearch](https://kubesearch.dev) as a creative way to search Flux HelmReleases across Github and Gitlab.

### DNS

Instead of using [k8s_gateway](https://github.com/ori-edge/k8s_gateway) to provide DNS for your applications you might want to check out [external-dns](https://github.com/kubernetes-sigs/external-dns), it has wide support for many different providers such as [Pi-hole](https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/pihole.md), [UniFi](https://github.com/kashalls/external-dns-unifi-webhook), [Adguard Home](https://github.com/muhlba91/external-dns-provider-adguard), [Bind](https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/rfc2136.md) and more.

### Storage

The included CSI (openebs in local-hostpath mode) is a great start for storage but soon you might find you need more features like replicated block storage, or to connect to a NFS/SMB/iSCSI server. If you need any of those features be sure to check out the projects like [rook-ceph](https://github.com/rook/rook), [longhorn](https://github.com/longhorn/longhorn), [openebs](https://github.com/openebs/openebs), [democratic-csi](https://github.com/democratic-csi/democratic-csi), [csi-driver-nfs](https://github.com/kubernetes-csi/csi-driver-nfs),
and [synology-csi](https://github.com/SynologyOpenSource/synology-csi).

## 🙌 Related Projects

If this repo is too hot to handle or too cold to hold check out these following projects.

-   [ajaykumar4/cluster-template](https://github.com/ajaykumar4/cluster-template) - _A template for deploying a Talos Kubernetes cluster including Argo for GitOps_
-   [khuedoan/homelab](https://github.com/khuedoan/homelab) - _Fully automated homelab from empty disk to running services with a single command._
-   [ricsanfre/pi-cluster](https://github.com/ricsanfre/pi-cluster) - _Pi Kubernetes Cluster. Homelab kubernetes cluster automated with Ansible and FluxCD_
-   [techno-tim/k3s-ansible](https://github.com/techno-tim/k3s-ansible) - _The easiest way to bootstrap a self-hosted High Availability Kubernetes cluster. A fully automated HA k3s etcd install with kube-vip, MetalLB, and more. Build. Destroy. Repeat._

## 🤝 Thanks

Big shout out to all the contributors, sponsors and everyone else who has helped on this project.



================================================
FILE: LICENSE
================================================
MIT License

Copyright (c) 2025 onedr0p

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



================================================
FILE: makejinja.toml
================================================
[makejinja]
inputs = ["./templates/overrides","./templates/config"]
output = "./"
exclude_patterns = ["*.partial.yaml.j2"]
data = ["./cluster.yaml", "./nodes.yaml"]
import_paths = ["./templates/scripts"]
loaders = ["plugin:Plugin"]
jinja_suffix = ".j2"
copy_metadata = true
force = true
undefined = "chainable"

[makejinja.delimiter]
block_start = "#%"
block_end = "%#"
comment_start = "#|"
comment_end = "#|"
variable_start = "#{"
variable_end = "}#"



================================================
FILE: Taskfile.yaml
================================================
---
# yaml-language-server: $schema=https://taskfile.dev/schema.json
version: "3"

set: [pipefail]
shopt: [globstar]

vars:
  BOOTSTRAP_DIR: "{{.ROOT_DIR}}/bootstrap"
  KUBERNETES_DIR: "{{.ROOT_DIR}}/kubernetes"
  SCRIPTS_DIR: "{{.ROOT_DIR}}/scripts"
  TALOS_DIR: "{{.ROOT_DIR}}/talos"
  PRIVATE_DIR: "{{.ROOT_DIR}}/.private"
  TALOSCONFIG: "{{.ROOT_DIR}}/talos/clusterconfig/talosconfig"

env:
  KUBECONFIG: "{{.ROOT_DIR}}/kubeconfig"
  SOPS_AGE_KEY_FILE: "{{.ROOT_DIR}}/age.key"
  TALOSCONFIG: "{{.TALOSCONFIG}}"

includes:
  bootstrap: .taskfiles/bootstrap
  talos: .taskfiles/talos
  volsync: .taskfiles/volsync
  template: .taskfiles/template

tasks:
  default: task --list

  reconcile:
    desc: Force Flux to pull in changes from your Git repository
    cmd: flux --namespace flux-system reconcile kustomization flux-system --with-source
    preconditions:
      - test -f {{.KUBECONFIG}}
      - which flux



================================================
FILE: .deepsource.toml
================================================
version = 1

[[analyzers]]
name = "javascript"

[[analyzers]]
name = "shell"

[[analyzers]]
name = "kube-linter"
type = "community"

[[transformers]]
name = "prettier"


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

[*.cue]
indent_style = tab
indent_size = 4

[*.md]
indent_size = 4
trim_trailing_whitespace = false

[*.sh]
indent_size = 4



================================================
FILE: .envrc
================================================
#shellcheck disable=SC2148,SC2155

# Directory paths
export ROOT_DIR="$PWD"
export KUBERNETES_DIR="$ROOT_DIR/kubernetes"
export SCRIPTS_DIR="$ROOT_DIR/scripts"

# Kubeconfig
export KUBECONFIG="$(expand_path ./kubeconfig)"

# Sops configuration
export SOPS_AGE_KEY_FILE="$(expand_path ./age.key)"
export SOPS_CONFIG_FILE="$ROOT_DIR/.sops.yaml"

# Bootstrap configuration
export BOOTSTRAP_CONFIG_FILE="$ROOT_DIR/config.yaml"

# Venv
PATH_add "$(expand_path ./.venv/bin)"
export VIRTUAL_ENV="$(expand_path ./.venv)"
export PYTHONDONTWRITEBYTECODE="1"

# Talos
export TALOSCONFIG="$(expand_path ./kubernetes/bootstrap/talos/clusterconfig/talosconfig)"

# Bin
PATH_add "$(expand_path ./.bin)"

# Taskfile
export TASK_X_ENV_PRECEDENCE=1
export TASK_X_MAP_VARIABLES=0



================================================
FILE: .mise.toml
================================================
[env]
_.python.venv = { path = "{{config_root}}/.venv", create = true }
KUBECONFIG = "{{config_root}}/kubeconfig"
SOPS_AGE_KEY_FILE = "{{config_root}}/age.key"
TALOSCONFIG = "{{config_root}}/talos/clusterconfig/talosconfig"
BOOTSTRAP_DIR = "{{config_root}}/bootstrap"
KUBERNETES_DIR = "{{config_root}}/kubernetes"
ROOT_DIR = "{{config_root}}"
SCRIPTS_DIR = "{{config_root}}/scripts"
TALOS_DIR = "{{config_root}}/talos"

[tools]
"python" = "3.13"
"pipx:makejinja" = "2.7.2"
# "aqua:budimanjojo/talhelper" = "3.0.21"
# "aqua:cilium/cilium-cli" = "0.18.3"
# "aqua:cli/cli" = "2.71.2"
# "aqua:cloudflare/cloudflared" = "2025.4.0"
# "aqua:cue-lang/cue" = "0.12.1"
# "aqua:FiloSottile/age" = "1.2.1"
# "aqua:fluxcd/flux2" = "2.5.1"
# "aqua:getsops/sops" = "3.10.2"
# "aqua:go-task/task" = "3.43.2"
# "aqua:helm/helm" = "3.17.3"
# "aqua:helmfile/helmfile" = "0.171.0"
# "aqua:jqlang/jq" = "1.7.1"
# "aqua:kubernetes-sigs/kustomize" = "5.6.0"
# "aqua:kubernetes/kubectl" = "1.33.0"
# "aqua:mikefarah/yq" = "4.45.1"
# "aqua:siderolabs/talos" = "1.9.5"
# "aqua:yannh/kubeconform" = "0.6.7"



================================================
FILE: .prettierignore
================================================
**/*.sops.yaml



================================================
FILE: .shellcheckrc
================================================
disable=SC1091
disable=SC2155



================================================
FILE: .sops.yaml
================================================
---
creation_rules:
  - path_regex: talos/.*\.sops\.ya?ml
    mac_only_encrypted: true
    age: "age12gul5m0dg9nn2gk69uvzwdxyluh5xt02m8wvyg9hn7c93nz7xehswmdenq"
  - path_regex: (bootstrap|kubernetes)/.*\.sops\.ya?ml
    encrypted_regex: "^(data|stringData)$"
    mac_only_encrypted: true
    age: "age12gul5m0dg9nn2gk69uvzwdxyluh5xt02m8wvyg9hn7c93nz7xehswmdenq"
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

repositories:
  - name: cilium
    url: https://helm.cilium.io

releases:
  - name: cilium
    namespace: kube-system
    atomic: true
    chart: cilium/cilium
    version: 1.17.3
    values:
      [
        '{{ requiredEnv "ROOT_DIR" }}/kubernetes/apps/kube-system/cilium/app/helm/values.yaml',
      ]

  - name: coredns
    namespace: kube-system
    atomic: true
    chart: oci://ghcr.io/coredns/charts/coredns
    version: 1.42.1
    values:
      [
        '{{ requiredEnv "ROOT_DIR" }}/kubernetes/apps/kube-system/coredns/app/helm/values.yaml',
      ]
    needs: ["kube-system/cilium"]

  - name: cert-manager
    namespace: cert-manager
    atomic: true
    chart: oci://quay.io/jetstack/charts/cert-manager
    version: v1.17.2
    values:
      [
        '{{ requiredEnv "ROOT_DIR" }}/kubernetes/apps/cert-manager/cert-manager/app/helm/values.yaml',
      ]
    needs: ["kube-system/coredns"]

  - name: flux-operator
    namespace: flux-system
    atomic: true
    chart: oci://ghcr.io/controlplaneio-fluxcd/charts/flux-operator
    version: 0.20.0
    values:
      [
        '{{ requiredEnv "ROOT_DIR" }}/kubernetes/apps/flux-system/flux-operator/app/helm/values.yaml',
      ]
    needs: ["cert-manager/cert-manager"]

  - name: flux-instance
    namespace: flux-system
    atomic: true
    chart: oci://ghcr.io/controlplaneio-fluxcd/charts/flux-instance
    version: 0.20.0
    values:
      [
        '{{ requiredEnv "ROOT_DIR" }}/kubernetes/apps/flux-system/flux-instance/app/helm/values.yaml',
      ]
    needs: ["flux-system/flux-operator"]



================================================
FILE: docs/useful_commands.md
================================================
# Useful Commands to Debug Kubernetes

# QOL

<https://github.com/ragrag/kubectl-autons>

```bash
# Auto-namespace
kubectl autons <command>
```

## Pod management

```bash
# Restart a deployment
kubectl rollout restart deployment -n <namespace> <deployment-name>

# Scale a deployment
kubectl scale deployment -n <namespace> <deployment-name> --replicas=<replicas>

# Create a debugging pod with networking tools
kubectl run tmp-shell --rm -i --tty --image nicolaka/netshoot -- /bin/bash

# Delete a pod
kubectl delete pod <pod-name>
```

## Logs

```bash
# Stream logs from a deployment
kubectl logs -n <namespace> deployment/<deployment-name> -f

# View deployment logs
kubectl logs -n <namespace> deployment/<deployment-name>

# Get detailed information about a deployment
kubectl describe -n <namespace> deployment/<deployment-name>
```

## Networking

```bash
# List all network policies in a namespace
kubectl get networkpolicies -n <namespace>

# Get all ingress resources across namespaces
kubectl get ingress -A

# List all services in a namespace
kubectl get services -n <namespace>

# Get endpoints across all namespaces
kubectl get -A endpoints

# Test internal service connectivity from debug pod
curl http://<service-name>.<namespace>.svc.cluster.local
```

## Storage

<https://github.com/clbx/kubectl-browse-pvc>

```bash
# Browse PVCs
kubectl browse-pvc

# Check mounted storage usage
kubectl exec -it -n <namespace> deployment/<deployment-name> -- df -h /path

# List persistent volume claims
kubectl get pvc --all-namespaces

# Execute commands in a pod
kubectl exec -it -n <namespace> deployment/<deployment-name> -- <command>
```

## Troubleshooting Failed HelmReleases

When a HelmRelease is stuck or failing to deploy (e.g., qBittorrent case):

```bash
# 1. Check HelmRelease status and events
kubectl describe helmrelease <release-name> -n <namespace>

# 2. Delete the failed HelmRelease to allow Flux to redeploy
kubectl delete helmrelease <release-name> -n <namespace>

# 3. Clean up any lingering resources
kubectl delete deployment <deployment-name> -n <namespace>
kubectl delete service <service-name> -n <namespace>

# 4. Force Flux to reconcile and redeploy
flux reconcile kustomization <kustomization-name> --with-source

# 5. Monitor the new deployment
kubectl get pods -n <namespace> -w
```

## Connecting Manually to a PostgreSQL Database

To connect manually to a CNPG PostgreSQL database using the secrets generated by the PostgreSQL operator, follow these steps:

1. **Retrieve the Application Credentials:**
   Get the username and password from the `-app` secret:

   ```bash
   # Get the username
   kubectl get secret -n database <cluster-name>-app -o jsonpath='{.data.username}' | base64 -d

   # Get the password
   kubectl get secret -n database <cluster-name>-app -o jsonpath='{.data.password}' | base64 -d
   ```

2. **Connect to the Database:**
   Use the retrieved credentials to connect to the PostgreSQL database using `psql`. Replace `<app-username>` and `<app-database-name>` with the actual values:

   ```bash
   psql -h <cluster-name>-rw.database.svc.cluster.local -U <app-username> -d <app-database-name> -W
   ```

   You will be prompted to enter the password.

### Notes:

- The `-app` credentials should be used for application-level access, while the `-superuser` credentials are for administrative tasks only.

## Nextcloud Database Restore Process

When restoring a Nextcloud PostgreSQL database in Kubernetes:

1. **Create a debugging pod with database access:**

```bash
kubectl run tmp-shell --rm -i --tty --image nicolaka/netshoot -- /bin/bash
```

2. **Connect to PostgreSQL as postgres user:**

```bash
# Connect to the database
psql -h postgres16-rw.database.svc.cluster.local -U postgres -d nextcloud

# Grant all necessary permissions to nextcloud user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nextcloud;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO nextcloud;
GRANT ALL PRIVILEGES ON SCHEMA public TO nextcloud;
ALTER USER nextcloud CREATEDB;
GRANT CONNECT ON DATABASE nextcloud TO nextcloud;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO nextcloud;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO nextcloud;
```

3. **Restore database backup:**

```bash
# Drop and recreate database if needed
PGPASSWORD="password" psql -h [server] -U [username] -d template1 -c "DROP DATABASE \"nextcloud\";"
PGPASSWORD="password" psql -h [server] -U [username] -d template1 -c "CREATE DATABASE \"nextcloud\";"

# Restore from backup
pg_restore -h postgres16-rw.database.svc.cluster.local \
    -U nextcloud \
    -d nextcloud \
    --clean \
    --if-exists \
    --no-owner \
    --no-privileges \
    --no-tablespaces \
    --no-comments \
    <backup-file>.sql
```

4. **After restore is complete, update Nextcloud data fingerprint:**

```bash
kubectl exec -it nextcloud-[pod-id] -c nextcloud -- \
    su -s /bin/sh www-data -c "php occ maintenance:data-fingerprint"
```

### Important Notes:

- Always verify database permissions after restore
- The nextcloud user needs full privileges on the database
- Run maintenance:data-fingerprint after restore to help clients recover
- Consider putting Nextcloud in maintenance mode during restore:

```bash
# Enable maintenance mode
kubectl exec -it nextcloud-[pod-id] -c nextcloud -- \
    su -s /bin/sh www-data -c "php occ maintenance:mode --on"

# Disable maintenance mode
kubectl exec -it nextcloud-[pod-id] -c nextcloud -- \
    su -s /bin/sh www-data -c "php occ maintenance:mode --off"
```

## Talos Upgrades

When upgrading a single-node Talos cluster, you may encounter permission issues with node draining. The solution is to use the `--stage` flag which stages the upgrade to be performed after a reboot, avoiding the drain operation:

```bash
# Stage a Talos upgrade for single-node clusters
talosctl --nodes <node-name> upgrade \
  --image="factory.talos.dev/installer/<schematic-id>:<version>" \
  --stage \
  --force

# Example:
talosctl --nodes control-1 upgrade \
  --image="factory.talos.dev/installer/42dcbb7542e7f2d53beec866d4687f9306cd2b2da3b049fb4872cfc41942723e:v1.9.1" \
  --stage \
  --force
```

### Notes:

- The `--stage` flag is helpful for single-node clusters to avoid drain permission issues
- `--force` is needed to skip etcd health checks which would fail on single-node setups
- Don't use `--timeout` as it only applies to `--debug` or `--wait` operations
- Always ensure you have proper backups before upgrading



================================================
FILE: kubernetes/apps/actions-runner-system/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: actions-runner-system
components:
  - ../../components/common
resources:
  - ./actions-runner-controller/ks.yaml



================================================
FILE: kubernetes/apps/actions-runner-system/actions-runner-controller/ks.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app actions-runner-controller
  namespace: &namespace actions-runner-system
spec:
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  healthChecks:
    - apiVersion: helm.toolkit.fluxcd.io/v2
      kind: HelmRelease
      name: *app
      namespace: *namespace
  interval: 1h
  path: ./kubernetes/apps/actions-runner-system/actions-runner-controller/app
  prune: true
  retryInterval: 2m
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  targetNamespace: *namespace
  timeout: 5m
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app actions-runner-controller-runners
  namespace: &namespace actions-runner-system
spec:
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  dependsOn:
    - name: actions-runner-controller
      namespace: *namespace
    - name: openebs
      namespace: openebs-system
  interval: 1h
  path: ./kubernetes/apps/actions-runner-system/actions-runner-controller/runners
  prune: true
  retryInterval: 2m
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  targetNamespace: *namespace
  timeout: 5m
  wait: false



================================================
FILE: kubernetes/apps/actions-runner-system/actions-runner-controller/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
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
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
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
FILE: kubernetes/apps/actions-runner-system/actions-runner-controller/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/actions-runner-system/actions-runner-controller/runners/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./cluster



================================================
FILE: kubernetes/apps/actions-runner-system/actions-runner-controller/runners/cluster/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
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
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &name cluster-runner
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
  values:
    githubConfigUrl: https://github.com/tanguille/cluster
    githubConfigSecret: cluster-runner-secret
    minRunners: 1
    maxRunners: 3
    containerMode:
      type: kubernetes
      kubernetesModeWorkVolumeClaim:
        accessModes: ["ReadWriteOnce"]
        storageClassName: openebs-hostpath
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
            image: ghcr.io/home-operations/actions-runner:2.324.0@sha256:a8a54cd667ca1e12d05a3933b6c8b56dc84b35cdb1538db37a6623ef93ed789c
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
FILE: kubernetes/apps/actions-runner-system/actions-runner-controller/runners/cluster/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./secrets.sops.yaml
  - ./helmrelease.yaml
  - ./rbac.yaml



================================================
FILE: kubernetes/apps/actions-runner-system/actions-runner-controller/runners/cluster/rbac.yaml
================================================
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: cluster-runner
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cluster-runner
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: cluster-runner
    namespace: actions-runner-system
---
apiVersion: talos.dev/v1alpha1
kind: ServiceAccount
metadata:
  name: cluster-runner
spec:
  roles: ["os:admin"]



================================================
FILE: kubernetes/apps/actions-runner-system/actions-runner-controller/runners/cluster/secrets.sops.yaml
================================================
apiVersion: v1
kind: Secret
metadata:
    name: cluster-runner-secret
    namespace: actions-runner-system
stringData:
    github_app_id: ENC[AES256_GCM,data:veyJGGbnbg==,iv:GLaY6ZxmVl9pIcBYBCbcrurecDDxWvnxa13MDGF/lUY=,tag:svHcYkbSgK1Tgsp0RxBfAw==,type:str]
    github_app_installation_id: ENC[AES256_GCM,data:hJV5nfK2e8I=,iv:2l/gEAbhVb561CNDFGfKKEQ01bgpL5rhnkjtUBrm5LY=,tag:4tyQO6XV8yj+cUoLSU5ypQ==,type:str]
    github_app_private_key: ENC[AES256_GCM,data:uOQStinc8jnncaYZCrWsYbvsI88DdYZpnbkACVMzTOF46ILeQHkFWse1ZcBQ0Sp8ef0SvNT7HwG7cSFsrmjCJlsHa1NeLWNjAwdv589QVGsg2pmqNZ9UIiwXljTmlpZkOKRyJI7iqBH3ZpiYqtIGlg5FiQbfWDbHGH6eH7phjbV0YJzkIZu7ojcrqPztzd9AaX1OmdNy833IFDMJfrhmCDG1WLnz3ilxEgKY8lfrMOiOxu1FsTY+zckzOccydWOmGhmiz8MLv05D+PWGkOCe/prMUuBYi3OfgFOrWe/82yw//n4m2Vfm+FPYxmDIWfVMYB2Ktt63UFV5qpFnAdyTgYCKz2Eu8b6ifmDhkj5iZvJcBBZxl+dHudrExG6r0yIcV/ch/2RwuwB0JqrvEd1JNBiOcHxe4XTnjKJNy6atJPkqrT2s9AEFBi/O09zSfGEFV1X+SkuhMbPsr/2XFAlgDnu5dRfu176DR6U5Ue9zL7CNwoTGwPH79Hrf/W+8SMk8Y3y5zDMdsekWyacHCx9j1qVoyME65DftDuSM9wguDbhq1xABrJ/HVK+GSedPNotAfsvQAS21dQxId3L4nDbpTbslh7xaZfYpkZrwgxG4AqCfx0OiFmX4JqXFidzBcen9S4YRvoK1rOvIMzJoy1EDPUNSMjGyWOj7OksAJ9HZDkbijz5f5gkvGt1h/AsRtXjOFy9St9wrNT3eJnzpF5U+A7ziivFdpcPdh1xQMArrDVAFjuYyG+fhret9gH3BZ4CaUvESsqtBBZ7CQDQxM/xp0FISxvu42zPtQEQ4rF5z593y7hk5RZ6kbKHrfThvozIRWQcLaUVlMGCGU0KA0+6KlykVndFSddaLmvma4rID/ug7U6rCleSHRLQ8kplNhxKlPHTaAW93S/Y/px8r1clk7k7MOGk44UMOH8BvQKZ2RKG816Zo4S90jwxP+BMSYAg+zFBRHu2X768LjC9zzAB+WRb54jurWRgbZrw/OwkEMijjjWWJ59PcvImBBS9e7dxGcPtqOIHBOf2CJ1KHyVt/DuWXPdI3DPkeSAXDvatbk4WxtJ6GKCCnm6/xwcLUnVS8wEuhkNU7WxfI9MoIFxfEOLubyaKMPHXvoOQJ/+2Z+25a5o26kbtSqgdZdJSnJA1nIJAr5JJKQgisWanpsVgsPzff3vOaSlrXIbh5Yzs0NUq0lAOxDBYeAYMEMVnCKt0qNhEOC9UDhrKclkCcThTJ6XxFN4Tn/Yjyfi/HG3hqHUW5N+47dLQ8K4yzH6dO/jOMTxNkf5wf/k8a31zHLTG615ABEuO8R9ZTSJdQoetlRJzkrS+c0z2DcU+srvnxH6d80PkC1YAjpub+aex+jtDYw2lDBliMh5hpNFi/Tw6bLvXIehfdeQad3dfFOIgQwPcXRKLvbZ7RKc0t0RVSui6PlFdkDrcthc9s39VU8dI8QXu/RVxv1vzA9aPKLqX0VogkBuleHjq9t9rKvTsSa+98Rp1DxzxnPNDbB9G+d278rLYVvd95pQzTPiceyZ39wDVTJwjyvSg3+2TddWmRYoYx7svah0eEJ9UbygG0rXoEYA/44/HRDTomDK3OLAEZtGKlxCYr/Ounxeo9Xhzm6Hc5BVIqKMAMelUMN2esu6Xvg93rml5qCW8plKN3xXKe0NoQVwuSbI75HxVQY/+AZDqKocVx8V1QR7W87SN19DwVRwCA6Zf8uRuL/up9pxKGhgRzdSn/MARct4ZTXPfmjB0VRh18tWdjhc5Ap85ULs1PATaf1lbYdGgs5/WRYEUvbbiU5mbNkTvP69AToeQ/70dC3Oxos7h9XGfsqlsStdlcKt7aX1WdJyFgzyVkJfwCTbgt9ZwIZJXCT+7W63Jan6AXyIPRhkkz9iUQzaUabBrVue1kYYn/9c8QwhBViL9G/ZLr5gn36IuyXGky06Yc55X1FaFMKmlZthKpcbtC/eTUCFkztJIdIPe0VbNt9j+0UlEVQlzuGQOoRjhoRwu+07C62y4yBKoRcFq0+l1GuvJdXQ5uKIwPSdLtkTgOWeUjHEcABNQiXEdKfttcLxtMVjrh5rQKBs2o37K81T6gJcqdfAvhs6+8wMYFUYj4pgs07YNzQH99Zv6YgTTT2IRDUJ7X1XIWZB3patws7esZpadapdnsaRGakGBkePjWkSms/MNhFqgtyOgF4KDmc0ewcGh8A58O+wg/wJ36fgDTzBSNBrcVRyr8j39aC/J7UX7p,iv:agPoXlzWenKFdfuT/Gz4muc9uAlsx8PeHadi1VczLWc=,tag:jst9E06996F57VxTLUKn2g==,type:str]
sops:
    age:
        - recipient: age12gul5m0dg9nn2gk69uvzwdxyluh5xt02m8wvyg9hn7c93nz7xehswmdenq
          enc: |
            -----BEGIN AGE ENCRYPTED FILE-----
            YWdlLWVuY3J5cHRpb24ub3JnL3YxCi0+IFgyNTUxOSBxTEpnRkQ2MloxekgrWFND
            L1k5UVJldEZJUEJwaEYzU0FBRDdlZDhHWlJFCk5wQk95UkVBZ0grS3IyaHU0eFhW
            NXVkdy9uYXRWdEJCck0zNmdVYmZ5YXMKLS0tIDVybEFxNDAzSUROckY4WEwzaVB3
            empzRFA2SVNraXVyMlY0OTdxWlQrRVUKb6Guhftar2p0qd/fp6LsLdf2t23Nsorn
            BXW71AEdnGZStU7FNI8e1+BAKoCeYGHuuoDpE6n7YN8zKhoObSZJTQ==
            -----END AGE ENCRYPTED FILE-----
    lastmodified: "2025-04-12T21:10:32Z"
    mac: ENC[AES256_GCM,data:RPlzNeiS2QBY0wXUoGvI2nZwPd50HRwWM6vc7T60aLQhT4GGmoiKyFmlqWO0vdmjtjHHE8kwAHjS8TF3GzMW1HhmzrLaOE8X2H0tWVgsc1rV0cZ8OJ/EIi9ml4zNHfc9iYQ4lfbCWQ3qL/wov4vB8DVWJu+dsJHR/5UU7TgEmWE=,iv:TEJZAYtIJKtl8JGvU8dNWc+0KloL9nbA//0RBJdrju0=,tag:QgEFm/8sn02He0yyc8+fyQ==,type:str]
    encrypted_regex: ^(data|stringData)$
    version: 3.10.1



================================================
FILE: kubernetes/apps/ai/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: ai
components:
  - ../../components/common
resources:
  - ./k8sgpt/ks.yaml
  - ./ollama/ks.yaml
  - ./open-webui/ks.yaml
  # - ./paperless-ai/ks.yaml
  # - ./stable-diffusion/ks.yaml



================================================
FILE: kubernetes/apps/ai/k8sgpt/ks.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/kustomization-kustomize-v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: k8sgpt-operator
  namespace: &namespace ai
spec:
  targetNamespace: *namespace
  path: ./kubernetes/apps/ai/k8sgpt/app
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: true
  interval: 30m
  retryInterval: 1m
  timeout: 3m
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: k8sgpt-config
  namespace: &namespace ai
spec:
  targetNamespace: *namespace
  path: ./kubernetes/apps/ai/k8sgpt/config
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  dependsOn:
    - name: k8sgpt-operator
  interval: 30m
  retryInterval: 1m
  timeout: 3m



================================================
FILE: kubernetes/apps/ai/k8sgpt/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/helmrelease-helm-v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: k8sgpt-operator
  namespace: ai
spec:
  interval: 30m
  chart:
    spec:
      chart: k8sgpt-operator
      version: 0.2.17
      sourceRef:
        kind: HelmRepository
        name: k8sgpt
        namespace: flux-system

  maxHistory: 3

  install:
    remediation:
      retries: 3

  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3

  uninstall:
    keepHistory: false



================================================
FILE: kubernetes/apps/ai/k8sgpt/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/ai/k8sgpt/config/k8sgpt.yaml
================================================
---
apiVersion: core.k8sgpt.ai/v1alpha1
kind: K8sGPT
metadata:
  name: k8sgpt-ollama
  namespace: ai
spec:
  ai:
    backend: localai
    baseUrl: http://ollama.ai.svc.cluster.local:11434/v1
    model: deepseek-r1:8b
  noCache: false
  repository: ghcr.io/k8sgpt-ai/k8sgpt
  version: v0.3.48



================================================
FILE: kubernetes/apps/ai/k8sgpt/config/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./k8sgpt.yaml



================================================
FILE: kubernetes/apps/ai/ollama/ks.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/ishioni/CRDs-catalog/main/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app ollama
  namespace: &namespace ai
spec:
  path: ./kubernetes/apps/ai/ollama/app
  targetNamespace: *namespace
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  prune: true
  wait: false
  interval: 10m



================================================
FILE: kubernetes/apps/ai/ollama/app/helmrelease.yaml
================================================
---
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app ollama
  namespace: ai
spec:
  interval: 30m
  chartRef:
    kind: OCIRepository
    name: app-template
  maxHistory: 2
  install:
    remediation:
      retries: 3
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  uninstall:
    keepHistory: false
  values:
    defaultPodOptions:
      runtimeClassName: nvidia
    controllers:
      main:
        type: deployment
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          main:
            image:
              repository: docker.io/ollama/ollama
              tag: 0.6.5
            env:
              TZ: ${TIMEZONE}
              LIBVA_DRIVER_NAME: nvidia
              OLLAMA_HOST: 0.0.0.0
              OLLAMA_ORIGINS: "*"
              OLLAMA_MODELS: /models
            securityContext:
              privileged: true
            resources:
              requests:
                cpu: 200m
                memory: 2Gi
                nvidia.com/gpu: 1
              limits:
                cpu: 4
                memory: 16Gi
                nvidia.com/gpu: 1
    service:
      main:
        controller: main
        ports:
          http:
            port: &port 11434

    persistence:
      config:
        enabled: true
        existingClaim: ollama
        globalMounts:
          - path: /models



================================================
FILE: kubernetes/apps/ai/ollama/app/kustomization.yaml
================================================
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml
  - ./pvc.yaml



================================================
FILE: kubernetes/apps/ai/ollama/app/pvc.yaml
================================================
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ollama
  namespace: ai
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: openebs-zfs
  resources:
    requests:
      storage: 50Gi



================================================
FILE: kubernetes/apps/ai/open-webui/ks.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/ishioni/CRDs-catalog/main/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app open-webui
  namespace: &namespace ai
spec:
  path: ./kubernetes/apps/ai/open-webui/app
  targetNamespace: *namespace
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  prune: true
  wait: false
  interval: 10m
  dependsOn:
    - name: volsync
      namespace: volsync-system
  postBuild:
    substitute:
      APP: *app
      VOLSYNC_CAPACITY: 1Gi



================================================
FILE: kubernetes/apps/ai/open-webui/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app open-webui
  namespace: ai
spec:
  interval: 30m
  timeout: 10m
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: 3
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
      strategy: rollback
  values:
    controllers:
      open-webui:
        annotations:
          reloader.stakater.com/auto: "true"
        initContainers:
          init-db:
            image:
              repository: ghcr.io/rafaribe/postgres-init
              tag: 16
            envFrom: &envFrom
              - secretRef:
                  name: openwebui-secret
        containers:
          app:
            image:
              repository: ghcr.io/open-webui/open-webui
              tag: 0.6.4
            env:
              OLLAMA_BASE_URL: http://ollama.ai.svc.cluster.local:11434
            envFrom: *envFrom
            resources:
              requests:
                cpu: 500m
                memory: 2Gi
              limits:
                memory: 2Gi
    service:
      app:
        controller: *app
        ports:
          http:
            port: 8080
    ingress:
      app:
        className: external
        annotations:
          external-dns.alpha.kubernetes.io/target: "external.${SECRET_DOMAIN}"
        hosts:
          - host: "ollama.${SECRET_DOMAIN}"
            paths:
              - path: /
                pathType: Prefix
                service:
                  identifier: app
                  port: http
    persistence:
      config:
        existingClaim: *app
        globalMounts:
          - path: /app/backend/data



================================================
FILE: kubernetes/apps/ai/open-webui/app/kustomization.yaml
================================================
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
components:
  - ../../../../components/volsync
resources:
  - ./helmrelease.yaml
  - ./secrets.sops.yaml



================================================
FILE: kubernetes/apps/ai/open-webui/app/secrets.sops.yaml
================================================
apiVersion: v1
kind: Secret
metadata:
    name: openwebui-secret
    namespace: ai
stringData:
    #ENC[AES256_GCM,data:uVsv1EklR2yR8a1JIZA/7iWvwuZwhjZE3DneYpzfDFcu,iv:i6RdUbwONFRQ0+6pIRkMFe2e3WeMhSoPvXJji8Y2HEI=,tag:PNRx/AtpasIDyqLWZ2VLAw==,type:comment]
    INIT_POSTGRES_HOST: ENC[AES256_GCM,data:RLz8GXFQnFE7PjHSl+9UiKQjTpsiSXT67feSETRX84xj26MH/wiawA==,iv:zimUXBb7p9T3RSqDQSkcWMrmd1nxwpAhh1/cFl/dFJ8=,tag:xotH9W5wra3s/lsheRyDMg==,type:str]
    INIT_POSTGRES_DBNAME: ENC[AES256_GCM,data:9zcKtceAIsIg,iv:D6+ynq/5iRXrKORnRhRBfpVcebICUGxbgccLiMgivOo=,tag:PcYPoRm5n/Bi4KFEIsLXRA==,type:str]
    INIT_POSTGRES_USER: ENC[AES256_GCM,data:7ypf/dZ4Miaf,iv:3qD/kRn0AiDYYImTDgInb9gyoAXWWg92WxJKfnV6KaU=,tag:s58/v/I4z7cx30PBLnekJQ==,type:str]
    INIT_POSTGRES_PASS: ENC[AES256_GCM,data:QYymxNU6e8E=,iv:QPhje7jhV0Jdl9LcgxMdF3dZSCNonqPOl9+nKUU639I=,tag:apA1KqaP5MybLbToILH62Q==,type:str]
    INIT_POSTGRES_SUPER_USER: ENC[AES256_GCM,data:5V/BATEqXn0=,iv:e4yVG3zwCv0BrKKo6E8rFJH8VAf9Ah3pQUOLGo0/sMw=,tag:NygAbIuBIZuim4qDPn7MSA==,type:str]
    INIT_POSTGRES_SUPER_PASS: ENC[AES256_GCM,data:jRLEG5FM8uY=,iv:3z6i79gDo/nc7laLqDXUVW8tZAuQaGAL4bmOSTWAtFs=,tag:0OQy7Fb8q1zq4/im3dH8sQ==,type:str]
    #ENC[AES256_GCM,data:6biidVXNxBmfrRBjNFS3XX4Z3Sdqmnjp,iv:PREirDjgq3s4Ph0UaJzI3WWFWA95PCXxRKyZKeJanvM=,tag:XsyytL5DTaUGKPWFQlgWPQ==,type:comment]
    DATABASE_URL: ENC[AES256_GCM,data:muOhYG+S97wlounBLG4ZBMDWump1L/AjqaH2l/YlbvEgvwfF4VxCOml31DbSEZYy8lKxSKn/o5cTFgvh8BURIgeSuKg657GKsGmqL8oa/OCl4IPQh3uumNLibUYCkuo/,iv:fngOfK0/iORagUdReXAAfm5BKM3LaMc+4smRroQ3xjE=,tag:EqTNv9AqqgFN/xmkKNrZZA==,type:str]
    #ENC[AES256_GCM,data:Bb1JZWNSBGCZDQzPlrJG30Gvf3g=,iv:cu9M+jXMFEwWtlDWawfQjbxWGdsdpmp+O8IPAWdu810=,tag:2km6GDNr5H6Nwk+SIO19HA==,type:comment]
    ENABLE_WEBSOCKET_SUPPORT: ENC[AES256_GCM,data:tVsT4w==,iv:9YjvvstIwNevoU1fk/g+uG7fkKemf5a3QZXksc9oA4Q=,tag:XNP2GDEL4WwSOcGwZ8mIDw==,type:str]
    WEBSOCKET_MANAGER: ENC[AES256_GCM,data:KdQ1KQ0=,iv:2kD2pJhyoittkXTHyhhkmlfwS9/uHbRPUmRukGyWTvE=,tag:LY5268KmrqPKlpu9ZUFOxg==,type:str]
    WEBSOCKET_REDIS_URL: ENC[AES256_GCM,data:1t0cnLFRYZ4863uAk4fM61uhh9JB47rz2Qjy69PbdUE/Z+EncjiL8Gnsj3wA4pyqZg==,iv:CXgugvbnjLdTG2YhKi08RPaAyaiN0Kps0Fmwxilg3hw=,tag:12i09ULE/vBpOlos268u9g==,type:str]
sops:
    kms: []
    gcp_kms: []
    azure_kv: []
    hc_vault: []
    age:
        - recipient: age12gul5m0dg9nn2gk69uvzwdxyluh5xt02m8wvyg9hn7c93nz7xehswmdenq
          enc: |
            -----BEGIN AGE ENCRYPTED FILE-----
            YWdlLWVuY3J5cHRpb24ub3JnL3YxCi0+IFgyNTUxOSBRRFpIMFlndWJrVXZ6R0xZ
            SUpyODExaXNJb0lZa0toNVpVZ0VNRmZpeUJrCnhBLzhUMXRyRStTMmVtM0QrTkhG
            T1FLbDNOYmJvQUtqend3Q285Tzh1SlEKLS0tIFpsMWhaRkJ6TnVva3MzNUpnMVgw
            MXkzYjZsNzFrb2VMaTgvWTlNZzVKd28KrKPlWlJuo2gwrxFnWxjMG+6lMKzNWJ/9
            nbkS+CFFtNB+NcCniL0uix1YqP5UFwYIOWnxEFQXGnmvCT2trwJYQw==
            -----END AGE ENCRYPTED FILE-----
    lastmodified: "2025-03-02T20:18:48Z"
    mac: ENC[AES256_GCM,data:LDgFhKsCdiWku+2gcVUvGXGH2kBFSQY8rZH+jJCdaxiaf6VPggXgqswTuYQYe7jIc/pBkFtkLlDl9vYJS5jlvAtfhGmJXBi2IFs+YCNi8r6Ddl71+TcByXEsEY2/kb5SejfleY7UrYrcTzgiHuiTfTeAQuwpzwyi3v6YhF82T6o=,iv:TtSACqDf/HsVeO72v7pzD+mgYX4xW2GyxyKqLVVoryw=,tag:CHmUnsWNJ3UYc1fKXCCW6w==,type:str]
    pgp: []
    encrypted_regex: ^(data|stringData)$
    version: 3.9.4



================================================
FILE: kubernetes/apps/ai/perplexica/ks.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/ishioni/CRDs-catalog/main/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app perplexica
  namespace: &namespace ai
spec:
  path: ./kubernetes/apps/ai/perplexica/app
  targetNamespace: *namespace
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  prune: true
  wait: false
  interval: 10m



================================================
FILE: kubernetes/apps/ai/perplexica/app/helmrelease.yaml
================================================
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app perplexica
  namespace: ai
spec:
  interval: 15m
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    createNamespace: true
    remediation:
      retries: 3
  upgrade:
    remediation:
      strategy: rollback
      retries: 3
  values:
    controllers:
      frontend:
        replicas: 1
        strategy: RollingUpdate
        containers:
          app:
            image:
              repository: bfenski/perplexica-frontend
              tag: latest
            env:
              NEXT_PUBLIC_API_URL: "https://perplexica.${SECRET_DOMAIN}/api"
              NEXT_PUBLIC_WS_URL: "ws://perplexica.${SECRET_DOMAIN}"

            resources:
              requests:
                cpu: 10m
                memory: 128Mi
              limits:
                cpu: 1
                memory: 1Gi
      api:
        replicas: 1
        strategy: RollingUpdate
        containers:
          app:
            image:
              repository: bfenski/perplexica-backend
              tag: latest
            env:
              SEARXNG_API_URL: http://searxng:8080
              LOG_LEVEL: "debug"
              DEBUG: "*"
            command: ["/bin/sh", "-c"]
            args:
              - |
                cat > /app/config.toml << 'EOF'
                [SIMILARITY_MEASURE]
                MEASURE = "cosine"

                [SEARXNG]
                URL = "http://searxng:8080"

                [OLLAMA]
                URL = "http://ollama.ai.svc.cluster.local:11434"

                [MODELS]
                DEFAULT = "dolphin3"
                AVAILABLE = ["dolphin3"]
                EOF
                yarn start
            resources:
              requests:
                cpu: 10m
                memory: 128Mi
              limits:
                cpu: 1
                memory: 1Gi
    service:
      api:
        controller: api
        ports:
          http:
            port: 3001
      frontend:
        controller: frontend
        ports:
          http:
            port: 3000
    ingress:
      main:
        className: internal
        annotations:
          external-dns.alpha.kubernetes.io/target: "internal.${SECRET_DOMAIN}"
          nginx.ingress.kubernetes.io/proxy-read-timeout: "604800"
          nginx.ingress.kubernetes.io/proxy-http-version: "1.1"
          nginx.ingress.kubernetes.io/configuration-snippet: |
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            sub_filter "http://127.0.0.1:3001" "http://perplexica.${SECRET_DOMAIN}";
            sub_filter "ws://127.0.0.1:3001" "ws://perplexica.${SECRET_DOMAIN}";
            sub_filter_once off;
            sub_filter_types application/javascript;
        hosts:
          - host: perplexica.${SECRET_DOMAIN}
            paths:
              - path: /
                pathType: Prefix
                service:
                  identifier: frontend
                  port: http
              - path: /api
                pathType: Prefix
                service:
                  identifier: api
                  port: http



================================================
FILE: kubernetes/apps/ai/perplexica/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/cert-manager/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: cert-manager
components:
  - ../../components/common
resources:
  - ./cert-manager/ks.yaml



================================================
FILE: kubernetes/apps/cert-manager/cert-manager/ks.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/kustomization-kustomize-v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app cert-manager
  namespace: &namespace cert-manager
spec:
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  healthCheckExprs:
    - apiVersion: cert-manager.io/v1
      kind: ClusterIssuer
      failed: status.conditions.filter(e, e.type == 'Ready').all(e, e.status == 'False')
      current: status.conditions.filter(e, e.type == 'Ready').all(e, e.status == 'True')
  interval: 1h
  path: ./kubernetes/apps/cert-manager/cert-manager/app
  postBuild:
    substituteFrom:
      - name: cluster-secrets
        kind: Secret
  prune: true
  retryInterval: 2m
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  targetNamespace: *namespace
  timeout: 15m
  wait: true
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/kustomization-kustomize-v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app cert-manager-tls
  namespace: &namespace cert-manager
spec:
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  dependsOn:
    - name: cert-manager
      namespace: cert-manager
  healthCheckExprs:
    - apiVersion: cert-manager.io/v1
      kind: Certificate
      failed: status.conditions.filter(e, e.type == 'Ready').all(e, e.status == 'False')
      current: status.conditions.filter(e, e.type == 'Ready').all(e, e.status == 'True')
  interval: 1h
  path: ./kubernetes/apps/cert-manager/cert-manager/tls
  postBuild:
    substituteFrom:
      - name: cluster-secrets
        kind: Secret
  prune: true
  retryInterval: 2m
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  targetNamespace: *namespace
  timeout: 15m
  wait: true



================================================
FILE: kubernetes/apps/cert-manager/cert-manager/app/clusterissuer.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/cert-manager.io/clusterissuer_v1.json
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
              name: cert-manager-secret
              key: api-token
        selector:
          dnsZones: ["${SECRET_DOMAIN}"]



================================================
FILE: kubernetes/apps/cert-manager/cert-manager/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/ocirepository-source-v1beta2.json
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
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/helmrelease-helm-v2.json
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
FILE: kubernetes/apps/cert-manager/cert-manager/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./clusterissuer.yaml
  - ./helmrelease.yaml
  - ./secret.sops.yaml
configMapGenerator:
  - name: cert-manager-values
    files:
      - values.yaml=./helm/values.yaml
configurations:
  - ./helm/kustomizeconfig.yaml



================================================
FILE: kubernetes/apps/cert-manager/cert-manager/app/secret.sops.yaml
================================================
# yaml-language-server: $schema=https://kubernetesjsonschema.dev/v1.18.1-standalone-strict/secret-v1.json
apiVersion: v1
kind: Secret
metadata:
  name: cert-manager-secret
stringData:
  api-token: ENC[AES256_GCM,data:Au5C1YaOAwcui/xX8pCDmV8ARBvm4TNwnYgR+GEVslfO9Tes5oIxwg==,iv:wdtvV9OWKPD2sRdKiN1BMUtEiLjZS25d1DsVIR5px44=,tag:ET2ztoMcbe+Ss93t04Ka0w==,type:str]
sops:
  age:
    - recipient: age12gul5m0dg9nn2gk69uvzwdxyluh5xt02m8wvyg9hn7c93nz7xehswmdenq
      enc: |
        -----BEGIN AGE ENCRYPTED FILE-----
        YWdlLWVuY3J5cHRpb24ub3JnL3YxCi0+IFgyNTUxOSBNeDZ6UEZod3RNWUpLY0Vr
        bmwzMnByWmRYN1h3Rkh1azBiOGo3TVVaOVE4CkJjeUJzN2lFSTI4VTBFTUFGODVX
        OXdFUTFFL3padjBlRXlkZEQ0K3RwR0UKLS0tIGRyS0d3SGVPU2NpRGkvZWJDaEdY
        WWlLWVduUnFDT2tkTnZXOTJnenEra28K1YWnUZZ6FZs9PSvSgWM24Q3ZWzD1SXGU
        UuADbsB8R8pd14AatDTXG8W5B2EttPaFdeFYje49e/6JcnFKlJrRdw==
        -----END AGE ENCRYPTED FILE-----
  lastmodified: "2025-05-03T13:31:13Z"
  mac: ENC[AES256_GCM,data:qIWNblNL3q1zpeNSZ7D7V5F2q0ASwZy0gt9EtVOko1cegaZOisLqDMIa4i9+MF2TsbchzX7Me1uc8YicR4aldayc5itqEtFsPXN4Itg1r4NmOLRuZNGwf6WbFQTX7IPP2lvcEV38Um3b7T5eAWs1iTND01F1RXTzIA0W9ocSD9s=,iv:K+oMJ8UkoUw4+7pYrVXVyD/6hdDl7YU5kKQbnnSTryA=,tag:9yTLrQPZHFOrYjc071LQqA==,type:str]
  encrypted_regex: ^(data|stringData)$
  mac_only_encrypted: true
  version: 3.10.2



================================================
FILE: kubernetes/apps/cert-manager/cert-manager/app/helm/kustomizeconfig.yaml
================================================
---
nameReference:
  - kind: ConfigMap
    version: v1
    fieldSpecs:
      - path: spec/valuesFrom/name
        kind: HelmRelease



================================================
FILE: kubernetes/apps/cert-manager/cert-manager/app/helm/values.yaml
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
FILE: kubernetes/apps/cert-manager/cert-manager/issuers/secret.sops.yaml
================================================
apiVersion: v1
kind: Secret
metadata:
    name: cert-manager-secret
stringData:
    api-token: ENC[AES256_GCM,data:bxwGs+aDvPup3vfN9lDXf0RcDVn23vkOG5mL0J05TO8ZFNoE5Ralog==,iv:epN1rnxc7ADiqNWdxfdc8hg2zEAjMOpN4FzrT0IpF6Q=,tag:7t8lisU+bP+A7w2nDXHenA==,type:str]
sops:
    kms: []
    gcp_kms: []
    azure_kv: []
    hc_vault: []
    age:
        - recipient: age12gul5m0dg9nn2gk69uvzwdxyluh5xt02m8wvyg9hn7c93nz7xehswmdenq
          enc: |
            -----BEGIN AGE ENCRYPTED FILE-----
            YWdlLWVuY3J5cHRpb24ub3JnL3YxCi0+IFgyNTUxOSA0MGpJaFcxbmZQUVBXNUp2
            SW1uZGFURkgwU0NkcVpGTlN3cUFKTWswMXhRClU3Rnh5bEpZTmwwWVRVYmRhTzdn
            OVI0QlM5c0hTNTAwVUFNRHFkeVpZZVkKLS0tIFppNkRsT29FV2dVZVlDR1F6YkdO
            VndrZXppaFJrbG8va1hDWjdXVFYxc2MK/E3xSV1DESfkojSTNwQ8RjtdpcW/Xt8y
            so/3DDeQxIwhg/UZGhZTEhppWswFrPaA83zkbheA9IOVGm3Ax00Cbw==
            -----END AGE ENCRYPTED FILE-----
    lastmodified: "2024-10-06T09:55:38Z"
    mac: ENC[AES256_GCM,data:MgP8rq8SSKAR04q5qs9XY9XQ/2PFWF94bqSOaYTmHycm4L+lkBg5AjJf9WBB6wctmpzKD7kZoAUWQxGOHut1BGteC6v84Wc8O0ismJKmWCa9QwACW/wfOYeIpfz8ohxJW1xWB7WYC/NDl4z8UeJsjpaAI3DsCUnd0AwyLErMdSc=,iv:kOLftNeSEWE0IJSGy9uJ3y3kNqKxAaL+hN3uJPJ6/K0=,tag:skxXOoYW98queSc5QxW1Bg==,type:str]
    pgp: []
    encrypted_regex: ^(data|stringData)$
    version: 3.9.0



================================================
FILE: kubernetes/apps/cert-manager/cert-manager/tls/certificate.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/cert-manager.io/certificate_v1.json
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: "${SECRET_DOMAIN/./-}-production"
spec:
  secretName: "${SECRET_DOMAIN/./-}-production-tls"
  issuerRef:
    name: letsencrypt-production
    kind: ClusterIssuer
  commonName: "${SECRET_DOMAIN}"
  dnsNames: ["${SECRET_DOMAIN}", "*.${SECRET_DOMAIN}"]



================================================
FILE: kubernetes/apps/cert-manager/cert-manager/tls/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./certificate.yaml



================================================
FILE: kubernetes/apps/database/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: database
components:
  - ../../components/common
resources:
  - ./cloudnative-pg/ks.yaml
  - ./dragonfly/ks.yaml



================================================
FILE: kubernetes/apps/database/cloudnative-pg/ks.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app cloudnative-pg
  namespace: &namespace database
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  path: ./kubernetes/apps/database/cloudnative-pg/app
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: true
  interval: 30m
  timeout: 15m
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app cloudnative-pg-cluster
  namespace: &namespace database
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  dependsOn:
    - name: cloudnative-pg
  path: ./kubernetes/apps/database/cloudnative-pg/cluster
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: true
  interval: 30m
  timeout: 15m



================================================
FILE: kubernetes/apps/database/cloudnative-pg/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: cloudnative-pg
spec:
  interval: 30m
  chart:
    spec:
      chart: cloudnative-pg
      version: 0.23.2
      sourceRef:
        kind: HelmRepository
        name: cloudnative-pg
        namespace: flux-system
  install:
    remediation:
      retries: 3
  upgrade:
    cleanupOnFail: true
    remediation:
      strategy: rollback
      retries: 3
  dependsOn:
    - name: openebs
      namespace: openebs-system
  values:
    crds:
      create: true
    configMap:
      data:
        MONITORING_QUERIES_CONFIGMAP: cnpg-monitoring-queries



================================================
FILE: kubernetes/apps/database/cloudnative-pg/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./secret.sops.yaml
  - ./helmrelease.yaml
  - ./monitoring-configmap.yaml



================================================
FILE: kubernetes/apps/database/cloudnative-pg/app/monitoring-configmap.yaml
================================================
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: cnpg-monitoring-queries
  namespace: database
data:
  queries: |
    pg_stat_bgwriter:
      query: |
        SELECT checkpoints_timed, checkpoints_req, checkpoint_write_time,
               checkpoint_sync_time, buffers_checkpoint, buffers_clean,
               maxwritten_clean, buffers_backend, buffers_backend_fsync,
               buffers_alloc
        FROM pg_stat_bgwriter;
      metrics:
        - checkpoints_timed
        - checkpoints_req
        - checkpoint_write_time
        - checkpoint_sync_time
        - buffers_checkpoint
        - buffers_clean
        - maxwritten_clean
        - buffers_backend
        - buffers_backend_fsync
        - buffers_alloc
      target_databases:
        - postgres
    pg_replication:
      query: |
        SELECT CASE WHEN NOT pg_is_in_recovery() THEN 0 ELSE GREATEST (0, EXTRACT(EPOCH FROM (now() - pg_last_xact_replay_timestamp()))) END AS lag,
               client_addr,
               state
        FROM pg_stat_replication;
      metrics:
        - lag
        - client_addr
        - state
      target_databases:
        - postgres
    pg_postmaster:
      query: |
        SELECT pg_postmaster_start_time as start_time_seconds from pg_postmaster_start_time();
      metrics:
        - start_time_seconds
      target_databases:
        - postgres
    pg_database:
      query: |
        SELECT datname as name,
               pg_database_size(datname) as size_bytes,
               datistemplate as is_template,
               datallowconn as allows_connection,
               datconnlimit as connection_limit,
               age(datfrozenxid) as frozen_xid_age
        FROM pg_database;
      metrics:
        - name
        - size_bytes
        - is_template
        - allows_connection
        - connection_limit
        - frozen_xid_age
      target_databases:
        - postgres



================================================
FILE: kubernetes/apps/database/cloudnative-pg/app/secret.sops.yaml
================================================
apiVersion: v1
kind: Secret
metadata:
    name: cloudnative-pg-secret
    namespace: database
type: Opaque
stringData:
    username: ENC[AES256_GCM,data:c4mnuHVRP2E=,iv:L7bwCXUE1fs+YO00EIBwo6AaJCYeO6QdYf/RFz3J8+M=,tag:WKUD/2HGY8AUsAfqDWLI4w==,type:str]
    password: ENC[AES256_GCM,data:wlijQvmJY1I=,iv:Bwibc5nfrmnXE3BxpN5dV0jU8AhWxuaSzyC398bqNnY=,tag:r3kJ3ylz0ktvdByTZW7BxA==,type:str]
    aws-access-key-id: ENC[AES256_GCM,data:j1GGxDwYRsPx1dj93ioSVouW6CKQkUYzLQ==,iv:EMRuk8th9gcTMdHlFVrCO25hvBnZ63mGR+IxCLzHWAI=,tag:I1u2Pu2wx4O3hA7uXil2IA==,type:str]
    aws-secret-access-key: ENC[AES256_GCM,data:gTUT4zZ0KkXPGS+ZIQqMbObmMI3ydMwxmzGNnd4VRg==,iv:5VBi2C445+WjmGvGy3QHFGeQskKAhHSqocwJ7OY9lm0=,tag:6qRN7p7Qqq8MEtsedMmlGg==,type:str]
sops:
    kms: []
    gcp_kms: []
    azure_kv: []
    hc_vault: []
    age:
        - recipient: age12gul5m0dg9nn2gk69uvzwdxyluh5xt02m8wvyg9hn7c93nz7xehswmdenq
          enc: |
            -----BEGIN AGE ENCRYPTED FILE-----
            YWdlLWVuY3J5cHRpb24ub3JnL3YxCi0+IFgyNTUxOSBRZjBnMk1Ib0VjYk4wWEFX
            UzFzWkVId00rUkM2dXZKYzdUSC81TWE5TVhRCmkvOUdmcldyNHRPVXlNY29teGlp
            THlna2NWNTNyWlFmYnkxeERoTWc3S0EKLS0tIGJIRE9LNGowd0tJZVQyVzlHanhx
            bFJWZGNQK1NJWjQ3TzhaL2lVY0NPUUEKpRxKjyTQpf+j7U4CiiOxV0FcdiI5VR1x
            RpMOe+JBnJvTIOiEZlvv/jhJF3Fs5p67V6/sPZSJru5hS3pk62lliw==
            -----END AGE ENCRYPTED FILE-----
    lastmodified: "2024-11-05T20:58:13Z"
    mac: ENC[AES256_GCM,data:kMSBQ3caMLlQigs2VOPX6qKq2II1qyZ6jrUQ11YKCoPtiO7/H7avuyxSaRfMN4dVKIDq/8OTfxa5+k7XZpZH+Xx+L/A1tkORD9PHuV+IxQn6oL8J8FtfuqGbvlm8BVAhGaAPYwrtufaYGkaU/VuJIzMu/O8BzQpJay/pt8KRmww=,iv:WHFFl/ZfHR8lnVONxmUAsdPSuPfgWR7dmoIcfRcvIl4=,tag:KzvypdzbfYsIpy+mGGe4KQ==,type:str]
    pgp: []
    encrypted_regex: ^(data|stringData)$
    version: 3.9.1



================================================
FILE: kubernetes/apps/database/cloudnative-pg/cluster/cluster16.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/postgresql.cnpg.io/cluster_v1.json
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: postgres16
spec:
  instances: 3
  imageName: ghcr.io/cloudnative-pg/postgresql:16.8-6
  primaryUpdateStrategy: unsupervised
  storage:
    size: 20Gi
    storageClass: openebs-hostpath
  superuserSecret:
    name: cloudnative-pg-secret
  enableSuperuserAccess: true
  postgresql:
    parameters:
      max_connections: "400"
      shared_buffers: 256MB
  nodeMaintenanceWindow:
    inProgress: false
    reusePVC: true
  resources:
    requests:
      cpu: 500m
    limits:
      memory: 4Gi
  monitoring:
    enablePodMonitor: true
  backup:
    retentionPolicy: 30d
    barmanObjectStore: &barmanObjectStore
      data:
        compression: bzip2
      wal:
        compression: bzip2
        maxParallel: 8
      destinationPath: s3://TanguilleServer-cloudnative-pg/
      endpointURL: "${SECRET_B2_HOST}"
      # Note: serverName version needs to be inclemented
      # when recovering from an existing cnpg cluster
      serverName: &currentCluster postgres16
      s3Credentials:
        accessKeyId:
          name: cloudnative-pg-secret
          key: aws-access-key-id
        secretAccessKey:
          name: cloudnative-pg-secret
          key: aws-secret-access-key
#   # Note: previousCluster needs to be set to the name of the previous
#   # cluster when recovering from an existing cnpg cluster
# bootstrap:
#   recovery:
#     source: &previousCluster postgres16
#   # Note: externalClusters is needed when recovering from an existing cnpg cluster
#   externalClusters:
#     - name: *previousCluster
#       barmanObjectStore:
#         <<: *barmanObjectStore
#         serverName: *previousCluster



================================================
FILE: kubernetes/apps/database/cloudnative-pg/cluster/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./cluster16.yaml
  - ./scheduledbackup.yaml
  - ./prometheusrule.yaml
  - ./service.yaml



================================================
FILE: kubernetes/apps/database/cloudnative-pg/cluster/prometheusrule.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/monitoring.coreos.com/prometheusrule_v1.json
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: cloudnative-pg-rules
  labels:
    prometheus: k8s
    role: alert-rules
spec:
  groups:
    - name: cloudnative-pg.rules
      rules:
        - alert: LongRunningTransaction
          annotations:
            description: Pod {{ $labels.pod }} is taking more than 5 minutes (300 seconds) for a query.
            summary: A query is taking longer than 5 minutes.
          expr: |-
            cnpg_backends_max_tx_duration_seconds > 300
          for: 1m
          labels:
            severity: warning
        - alert: BackendsWaiting
          annotations:
            description: Pod {{ $labels.pod }} has been waiting for longer than 5 minutes
            summary: If a backend is waiting for longer than 5 minutes
          expr: |-
            cnpg_backends_waiting_total > 300
          for: 1m
          labels:
            severity: warning
        - alert: PGDatabase
          annotations:
            description: Over 150,000,000 transactions from frozen xid on pod {{ $labels.pod }}
            summary: Number of transactions from the frozen XID to the current one
          expr: |-
            cnpg_pg_database_xid_age > 150000000
          for: 1m
          labels:
            severity: warning
        - alert: PGReplication
          annotations:
            description: Standby is lagging behind by over 300 seconds (5 minutes)
            summary: The standby is lagging behind the primary
          expr: |-
            cnpg_pg_replication_lag > 300
          for: 1m
          labels:
            severity: warning
        - alert: LastFailedArchiveTime
          annotations:
            description: Archiving failed for {{ $labels.pod }}
            summary: Checks the last time archiving failed. Will be < 0 when it has not failed.
          expr: |-
            (cnpg_pg_stat_archiver_last_failed_time - cnpg_pg_stat_archiver_last_archived_time) > 1
          for: 1m
          labels:
            severity: warning
        - alert: DatabaseDeadlockConflicts
          annotations:
            description: There are over 10 deadlock conflicts in {{ $labels.pod }}
            summary: Checks the number of database conflicts
          expr: |-
            cnpg_pg_stat_database_deadlocks > 10
          for: 1m
          labels:
            severity: warning



================================================
FILE: kubernetes/apps/database/cloudnative-pg/cluster/scheduledbackup.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/postgresql.cnpg.io/scheduledbackup_v1.json
apiVersion: postgresql.cnpg.io/v1
kind: ScheduledBackup
metadata:
  name: postgres
spec:
  schedule: "@daily"
  immediate: true
  backupOwnerReference: self
  cluster:
    name: postgres16



================================================
FILE: kubernetes/apps/database/cloudnative-pg/cluster/service.yaml
================================================
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-lb
  annotations:
    external-dns.alpha.kubernetes.io/hostname: "postgres.${SECRET_DOMAIN}"
    lbipam.cilium.io/ips: "${CLOUDNATIVE_PG_IP}"
spec:
  type: LoadBalancer
  ports:
    - name: postgres
      port: 5432
      protocol: TCP
      targetPort: 5432
  selector:
    cnpg.io/cluster: postgres16
    cnpg.io/instanceRole: primary



================================================
FILE: kubernetes/apps/database/dragonfly/ks.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app dragonfly
  namespace: &namespace database
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  path: ./kubernetes/apps/database/dragonfly/app
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: true
  interval: 30m
  timeout: 5m
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app dragonfly-cluster
  namespace: &namespace database
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  dependsOn:
    - name: dragonfly
      namespace: database
  path: ./kubernetes/apps/database/dragonfly/cluster
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: true
  interval: 30m
  timeout: 5m



================================================
FILE: kubernetes/apps/database/dragonfly/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app dragonfly-operator
spec:
  interval: 30m
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: 3
  upgrade:
    cleanupOnFail: true
    remediation:
      strategy: rollback
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

    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 65534
        runAsGroup: 65534

    service:
      app:
        controller: *app
        ports:
          http:
            port: *port
          metrics:
            port: 8080

    serviceMonitor:
      app:
        serviceName: *app
        endpoints:
          - port: metrics
            scheme: http
            path: /metrics
            interval: 1m
            scrapeTimeout: 10s

    serviceAccount:
      create: true
      name: *app



================================================
FILE: kubernetes/apps/database/dragonfly/app/kustomization.yaml
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
FILE: kubernetes/apps/database/dragonfly/app/rbac.yaml
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
FILE: kubernetes/apps/database/dragonfly/cluster/cluster.yaml
================================================
---
# yaml-language-server: $schema=https://lds-schemas.pages.dev/dragonflydb.io/dragonfly_v1alpha1.json
apiVersion: dragonflydb.io/v1alpha1
kind: Dragonfly
metadata:
  name: dragonfly
spec:
  image: ghcr.io/dragonflydb/dragonfly:v1.30.0
  replicas: 3
  env:
    - name: MAX_MEMORY
      valueFrom:
        resourceFieldRef:
          resource: limits.memory
          divisor: 1Mi
  args:
    - --maxmemory=$(MAX_MEMORY)Mi
    - --proactor_threads=2
    - --cluster_mode=emulated
    - --lock_on_hashtags
    - --default_lua_flags=allow-undeclared-keys
  resources:
    requests:
      cpu: 100m
    limits:
      memory: 5Gi



================================================
FILE: kubernetes/apps/database/dragonfly/cluster/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./cluster.yaml
  - ./podmonitor.yaml



================================================
FILE: kubernetes/apps/database/dragonfly/cluster/podmonitor.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/monitoring.coreos.com/podmonitor_v1.json
apiVersion: monitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: dragonfly
spec:
  selector:
    matchLabels:
      app: dragonfly
  podTargetLabels: ["app"]
  podMetricsEndpoints:
    - port: admin
  fallbackScrapeProtocol: PrometheusText0.0.4



================================================
FILE: kubernetes/apps/default/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: default
components:
  - ../../components/common
resources:
  - ./changedetection/ks.yaml
  - ./echo/ks.yaml
  - ./homarr/ks.yaml
  - ./it-tools/ks.yaml
  - ./nextcloud/ks.yaml
  - ./searxng/ks.yaml
  - ./spoolman/ks.yaml



================================================
FILE: kubernetes/apps/default/changedetection/ks.yaml
================================================
---
# yaml-language-server: $schema=https://kube-schemas.pages.dev/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app changedetection
  namespace: &namespace default
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  path: ./kubernetes/apps/default/changedetection/app
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: false # no flux ks dependents
  interval: 30m
  timeout: 5m
  postBuild:
    substitute:
      APP: *app
      VOLSYNC_CAPACITY: 2Gi



================================================
FILE: kubernetes/apps/default/changedetection/app/helmrelease.yaml
================================================
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app changedetection
spec:
  interval: 30m
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: 3
  upgrade:
    cleanupOnFail: true
    remediation:
      strategy: rollback
      retries: 3
  values:
    controllers:
      *app :
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/dgtlmoon/changedetection.io
              tag: "0.49.13"
            env:
              PORT: &port 5000
            resources:
              requests:
                cpu: 10m
                memory: 100Mi
              limits:
                memory: 250Mi
    service:
      app:
        controller: *app
        ports:
          http:
            port: *port

    ingress:
      app:
        className: internal
        annotations:
          external-dns.alpha.kubernetes.io/target: internal.${SECRET_DOMAIN}
        hosts:
          - host: changedetection.${SECRET_DOMAIN}
            paths:
              - path: /
                pathType: Prefix
                service:
                  identifier: app
                  port: http
    persistence:
      datastore:
        existingClaim: *app



================================================
FILE: kubernetes/apps/default/changedetection/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
components:
  - ../../../../components/volsync
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/default/echo/ks.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/kustomization-kustomize-v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app echo
  namespace: &namespace default
spec:
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  interval: 1h
  path: ./kubernetes/apps/default/echo/app
  postBuild:
    substituteFrom:
      - name: cluster-secrets
        kind: Secret
  prune: true
  retryInterval: 2m
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  targetNamespace: *namespace
  timeout: 5m
  wait: false



================================================
FILE: kubernetes/apps/default/echo/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/helmrelease-helm-v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: echo
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
    - name: cloudflared
      namespace: network
  values:
    controllers:
      echo:
        strategy: RollingUpdate
        containers:
          app:
            image:
              repository: ghcr.io/mendhak/http-https-echo
              tag: 36
            env:
              HTTP_PORT: &port 80
              LOG_WITHOUT_NEWLINE: true
              LOG_IGNORE_PATH: /healthz
              PROMETHEUS_ENABLED: true
            probes:
              liveness: &probes
                enabled: true
                custom: true
                spec:
                  httpGet:
                    path: /healthz
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
                cpu: 10m
              limits:
                memory: 64Mi
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 65534
        runAsGroup: 65534
        seccompProfile: { type: RuntimeDefault }
    service:
      app:
        controller: echo
        ports:
          http:
            port: *port
    serviceMonitor:
      app:
        serviceName: echo
        endpoints:
          - port: http
            scheme: http
            path: /metrics
            interval: 1m
            scrapeTimeout: 10s
    ingress:
      app:
        className: external
        annotations:
          external-dns.alpha.kubernetes.io/target: "external.${SECRET_DOMAIN}"
        hosts:
          - host: "{{ .Release.Name }}.${SECRET_DOMAIN}"
            paths:
              - path: /
                service:
                  identifier: app
                  port: http



================================================
FILE: kubernetes/apps/default/echo/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/default/homarr/ks.yaml
================================================
---
# yaml-language-server: $schema=https://github.com/fluxcd-community/flux2-schemas/raw/main/kustomization-kustomize-v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app homarr
  namespace: &namespace default
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  path: ./kubernetes/apps/default/homarr/app
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: false
  interval: 30m
  timeout: 15m
  postBuild:
    substitute:
      APP: *app
      # TODO: Implement volsync
      # VOLSYNC_CAPACITY: 1Gi
      # VOLSYNC_RECORD_SIZE: 1m



================================================
FILE: kubernetes/apps/default/homarr/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2beta2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app homarr
spec:
  interval: 30m
  chart:
    spec:
      chart: homarr
      version: 3.8.0
      sourceRef:
        kind: HelmRepository
        name: homarr-labs
        namespace: flux-system
  install:
    remediation:
      retries: 3
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  uninstall:
    keepHistory: false
  values:
    env:
      TZ: ${TIMEZONE}
    ingress:
      enabled: true
      ingressClassName: "internal"
      annotations:
        external-dns.alpha.kubernetes.io/target: internal.${SECRET_DOMAIN}
      hosts:
        - host: apps.${SECRET_DOMAIN}
          paths:
            - path: /
              pathType: Prefix

    envSecrets:
      dbCredentials:
        existingSecret: homarr-secret

    persistence:
      homarrDatabase:
        enabled: true
        name: homarr-database
        storageClassName: openebs-zfs
        accessMode: ReadWriteOnce
        size: 1Gi
        mountPath: /app/data/configs
      homarrImages:
        enabled: true
        name: homarr-images
        storageClassName: openebs-zfs
        accessMode: ReadWriteOnce
        size: 1Gi
        mountPath: /images



================================================
FILE: kubernetes/apps/default/homarr/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/kustomization.json
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml
  - ./secret.sops.yaml



================================================
FILE: kubernetes/apps/default/homarr/app/secret.sops.yaml
================================================
apiVersion: v1
kind: Secret
metadata:
    name: homarr-secret
    namespace: default
stringData:
    db-encryption-key: ENC[AES256_GCM,data:PupvW93s1OdPIkzFdgnizWAtpHl2IPq2jFOuqGye4418QwJHDnEvQGePySwltS0TcZ+AfnoHFqC0Do5LCq7Thw==,iv:kE5ooWlUcBXBRzlCwklHtCMzszJukEpE2sIOTcQneqA=,tag:ZreruHSOnD3kigkGpwl5GA==,type:str]
    db-url: ENC[AES256_GCM,data:5VrTWduLRDAGsJVw3n0S+zu+bNg/1milUiXEp8xXj9vXHHQW,iv:DSIM9UFp09K569cXW/39qE+JkrqYFyvU/Z8H/2nGj4k=,tag:RNEfkyscuVou7Oo5+PCXWA==,type:str]
sops:
    kms: []
    gcp_kms: []
    azure_kv: []
    hc_vault: []
    age:
        - recipient: age12gul5m0dg9nn2gk69uvzwdxyluh5xt02m8wvyg9hn7c93nz7xehswmdenq
          enc: |
            -----BEGIN AGE ENCRYPTED FILE-----
            YWdlLWVuY3J5cHRpb24ub3JnL3YxCi0+IFgyNTUxOSB4SVNLOTBoTklWdXBGdmFN
            YkoyV2ltdHduRkpIZHFRL0VQZ095M3RiZ1FzClRobUpENHhrNHVTN1pEc2c0dGIr
            aDJzOGRMTnlBdFc1K21ya3dKMjVuK3cKLS0tIHlmbkNwZ1pDdzU2aUV3YmhjMThO
            WnRYSmJaOUFkZWk1SVhCRTI3V0NCTEkKgaxFd2WDa5Jhwa+6cZpy4/DapgbWopGF
            G5ZGq7FOzp8Z/dFMyXCzM0JtgCPaUkJ+K1Em/0/VlAvP8gpVNBDhdw==
            -----END AGE ENCRYPTED FILE-----
    lastmodified: "2025-02-25T21:13:29Z"
    mac: ENC[AES256_GCM,data:0zZFS7+pSWKC36U6rPKlLw3DM3A5uOw1oy5FFCfnuhFf9AZrAy1qmsq2xxi8Nf/mRZSeC+6++0jLiOV7UF/FAg5cAtBVcAVDITfXwqki7DDndSKWviJ4FCho4vU6VSy+KrZMlevvZlvuBCLLo0DU0ee610IyjA7vcnadNtciPcM=,iv:npnoVT4P8Z10iYbF6LY9IASMCzTFzJyF7ARWlJLeuaM=,tag:ahpKFnDABfBVrXGXZ0iYXw==,type:str]
    pgp: []
    encrypted_regex: ^(data|stringData)$
    version: 3.9.4



================================================
FILE: kubernetes/apps/default/it-tools/ks.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/kustomization-kustomize-v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &appname it-tools
  namespace: &namespace default
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *appname
  interval: 30m
  timeout: 5m
  path: "./kubernetes/apps/default/it-tools/app"
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: false



================================================
FILE: kubernetes/apps/default/it-tools/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: it-tools
spec:
  interval: 30m
  chartRef:
    kind: OCIRepository
    name: app-template

  values:
    controllers:
      it-tools:
        replicas: 1
        strategy: RollingUpdate

        annotations:
          reloader.stakater.com/auto: "true"

        pod:
          securityContext:
            runAsUser: 1000
            runAsGroup: 1000
            fsGroup: 1000
            fsGroupChangePolicy: "OnRootMismatch"

        containers:
          app:
            image:
              repository: ghcr.io/bjw-s-labs/it-tools
              tag: 2024.10.22@sha256:4dfe650a4be1e13d59e37f2b2aa6b8faf915c8afb53a379ea5eaaba679a0a456
            resources:
              requests:
                cpu: 5m
                memory: 32Mi
              limits:
                memory: 256Mi
            securityContext:
              allowPrivilegeEscalation: false
              capabilities:
                drop:
                  - ALL
              readOnlyRootFilesystem: true

    service:
      app:
        controller: it-tools
        ports:
          http:
            port: 8080

    ingress:
      app:
        className: internal
        annotations:
          external-dns.alpha.kubernetes.io/target: "internal.${SECRET_DOMAIN}"
        hosts:
          - host: "it-tools.${SECRET_DOMAIN}"
            paths:
              - path: /
                pathType: Prefix
                service:
                  identifier: app
                  port: http

    persistence:
      tmp:
        type: emptyDir



================================================
FILE: kubernetes/apps/default/it-tools/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/default/nextcloud/ks.yaml
================================================
---
# yaml-language-server: $schema=https://github.com/fluxcd-community/flux2-schemas/raw/main/kustomization-kustomize-v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app nextcloud
  namespace: &namespace default
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  dependsOn:
    - name: dragonfly-cluster
      namespace: database
  path: ./kubernetes/apps/default/nextcloud/app
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: false
  interval: 30m
  timeout: 15m
  postBuild:
    substitute:
      APP: *app
      VOLSYNC_CAPACITY: 50Gi
      VOLSYNC_RECORD_SIZE: 1m



================================================
FILE: kubernetes/apps/default/nextcloud/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://github.com/fluxcd-community/flux2-schemas/raw/main/helmrelease-helm-v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app nextcloud
spec:
  timeout: 15m
  interval: 30m
  chart:
    spec:
      chart: nextcloud
      version: 6.6.9
      sourceRef:
        kind: HelmRepository
        name: nextcloud
        namespace: flux-system
  install:
    remediation:
      retries: 3
  upgrade:
    cleanupOnFail: true
    remediation:
      strategy: rollback
      retries: 3
  values:
    image:
      flavor: fpm-alpine
    nginx:
      enabled: true

    nextcloud:
      extraInitContainers:
        - name: init-db
          image:
            repository: ghcr.io/onedr0p/postgres-init
            tag: 16
          envFrom:
            - secretRef:
                name: nextcloud-secret

      extraEnv:
        - name: REDIS_HOST
          value: dragonfly.database.svc.cluster.local
        - name: REDIS_HOST_PORT
          value: "6379"
        - name: PHP_MEMORY_LIMIT
          value: "11G"
        - name: PHP_UPLOAD_LIMIT
          value: "10G"
        - name: PHP_POST_MAX_SIZE
          value: "10G"

      existingSecret:
        enabled: true
        secretName: nextcloud-secret
        usernameKey: NEXTCLOUD_USERNAME
        passwordKey: NEXTCLOUD_PASSWORD
        smtpUsernameKey: SMTP_USERNAME
        smtpPasswordKey: SMTP_PASSWORD
        smtpHostKey: SMTP_HOST

      host: nextcloud.${SECRET_DOMAIN}

      mail:
        enabled: true
        fromAddress: ${FROM_ADDRESS}
        domain: gmail.com
        smtp:
          host: ${SMTP_HOST}
          port: 465
          authtype: LOGIN
          secure: starttls

      configs:
        proxy.config.php: |-
          <?php
          $CONFIG = array (
            'trusted_proxies' => array(
              0 => '127.0.0.1',
              1 => '10.0.0.0/8',
              2 => '172.16.0.0/12',
              3 => '192.168.0.0/16',
            ),
            'trusted_domains' => array(
              0 => 'nextcloud.${SECRET_DOMAIN}',
              1 => 'localhost',
              2 => '127.0.0.1',
            ),
            'forwarded_for_headers' => array('HTTP_X_FORWARDED_FOR'),
          );
        ingress.config.php: |-
          <?php
          $CONFIG = array (
            'overwrite.cli.url' => 'https://nextcloud.${SECRET_DOMAIN}',
            'overwriteprotocol' => 'https',
          );
        misc.config.php: |-
          <?php
          $CONFIG = array (
            'default_phone_region' => 'BE',
            'maintenance_window_start' => 2,
          );
        logging.config.php: |-
          <?php
          $CONFIG = array (
            'log_type' => 'errorlog',
            'loglevel' => 1,
            'logdateformat' => 'F d, Y H:i:s'
            );

      datadir: /var/www/data

      phpConfigs:
        custom.ini: |
          memory_limit=512M
          upload_max_filesize=16G
          post_max_size=16G
          max_execution_time=3600
          max_input_time=3600

    deploymentAnnotations:
      reloader.stakater.com/auto: "true"

    internalDatabase:
      enabled: false

    externalDatabase:
      enabled: true
      type: postgresql
      host: postgres16-rw.database.svc.cluster.local:5432
      database: *app
      existingSecret:
        enabled: true
        secretName: nextcloud-secret
        usernameKey: INIT_POSTGRES_USER
        passwordKey: INIT_POSTGRES_PASS

    ingress:
      enabled: true
      className: external
      annotations:
        external-dns.alpha.kubernetes.io/target: "external.${SECRET_DOMAIN}"
        nginx.ingress.kubernetes.io/proxy-body-size: "10G"
        nginx.ingress.kubernetes.io/proxy-buffering: "off"
        nginx.ingress.kubernetes.io/proxy-request-buffering: "off"
        nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
        nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
        nginx.ingress.kubernetes.io/fastcgi-read-timeout: "600"
        nginx.ingress.kubernetes.io/fastcgi-send-timeout: "600"
        nginx.ingress.kubernetes.io/fastcgi-connect-timeout: "60"
        nginx.ingress.kubernetes.io/configuration-snippet: |
          rewrite ^/.well-known/webfinger /index.php/.well-known/webfinger last;
          rewrite ^/.well-known/nodeinfo /index.php/.well-known/nodeinfo last;
          rewrite ^/.well-known/host-meta /public.php?service=host-meta last;
          rewrite ^/.well-known/host-meta.json /public.php?service=host-meta-json;
          location = /.well-known/carddav {
            return 301 $scheme://$host/remote.php/dav;
          }
          location = /.well-known/caldav {
            return 301 $scheme://$host/remote.php/dav;
          }
          location /.well-known/nodeinfo {
            return 301 $scheme://$host/index.php/.well-known/nodeinfo;
          }
          location ~ ^/(?:build|tests|config|lib|3rdparty|templates|data)/ {
            deny all;
          }
          location ~ ^/(?:\.|autotest|occ|issue|indie|db_|console) {
            deny all;
          }
          location ~ ^/(?:index|remote|public|cron|core/ajax/update|status|ocs/v[12]|updater/.+|ocs-provider/.+)\.php(?:$|/) {
            fastcgi_split_path_info ^(.+\.php)(/.*)$;
            try_files $fastcgi_script_name =404;
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            fastcgi_param PATH_INFO $fastcgi_path_info;
            fastcgi_param modHeadersAvailable true;
            fastcgi_param front_controller_active true;
            fastcgi_read_timeout 180;
            fastcgi_pass php-handler;
            fastcgi_intercept_errors on;
            fastcgi_request_buffering off;
          }
      path: /
      pathType: Prefix

    persistence:
      # Config storage using volsync template PVC (local)
      enabled: true
      existingClaim: *app

      # Data directory using NFS
      nextcloudData:
        enabled: true
        existingClaim: nextcloud-pvc

    cronjob:
      enabled: true

    startupProbe:
      enabled: true
      initialDelaySeconds: 30
      periodSeconds: 20
      timeoutSeconds: 5
      failureThreshold: 30
      successThreshold: 1

    resources:
      requests:
        cpu: 500m
        memory: 1Gi
      limits:
        cpu: 4
        memory: 5Gi

    strategy:
      type: Recreate



================================================
FILE: kubernetes/apps/default/nextcloud/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/kustomization.json
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml
  - ./secret.sops.yaml
  - ./nfs-pvc.yaml



================================================
FILE: kubernetes/apps/default/nextcloud/app/nfs-pvc.yaml
================================================
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nextcloud-pv
spec:
  storageClassName: nextcloud-nfs
  accessModes: ["ReadWriteMany"]
  capacity:
    storage: 500Gi
  persistentVolumeReclaimPolicy: Retain
  nfs:
    server: "${TRUENAS_IP}"
    path: "/mnt/TanguilleServer/TanguilleSMB/Shared"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nextcloud-pvc
spec:
  storageClassName: nextcloud-nfs
  accessModes: ["ReadWriteMany"]
  resources:
    requests:
      storage: 500Gi



================================================
FILE: kubernetes/apps/default/nextcloud/app/secret.sops.yaml
================================================
apiVersion: v1
kind: Secret
metadata:
    name: nextcloud-secret
    namespace: default
stringData:
    NEXTCLOUD_USERNAME: ENC[AES256_GCM,data:wYeTpnGSQEG/smACH7JAkMN9fkA=,iv:G2SbHwnM9dG43Wc3rjFoA4orPrgMg7VcPfXQPNS2CW4=,tag:ZrKd9fLvEsMJY3hp+tF8KA==,type:str]
    NEXTCLOUD_PASSWORD: ENC[AES256_GCM,data:jiV/ySPm3GBShCgnpsNh,iv:niQ5RI50Tm/8w3yGs1znDd4I6tGFreABob44MQg3u7E=,tag:owhtlgy6wBS3wH9eIqN5kw==,type:str]
    SMTP_USERNAME: ENC[AES256_GCM,data:fwU5E/rPk/olYmGV7Rv9sea/CJ0K3rCixHlGSyc=,iv:wnT9+/aiarWsFip4RH7Ew3IAODLwlxJLqJkmfEcYDdo=,tag:ltnko5QVQp49cmmo0NUAcQ==,type:str]
    SMTP_PASSWORD: ENC[AES256_GCM,data:R5+XHpgBkb4=,iv:W9R8/xHQrvEnfOntfRdpW9Rmwrd7L6ePHTyca3Gi7j8=,tag:rPYeoCs9dlHMsDDjL2mh9g==,type:str]
    SMTP_HOST: ENC[AES256_GCM,data:pQRFpleBDIGcmWDJcqo=,iv:AcucEk3HZPhDy8P2A0hh9ZAiXSs/QizjUy+kMIszNLU=,tag:90/AEiBFAEds3/3HTnkh7Q==,type:str]
    FROM_ADDRESS: ENC[AES256_GCM,data:IbnpRogDqNaa9SO4FZe7D/FQCQ==,iv:BCo1YhdDEdzq2/I7QOv+SpxXHmIJ9fNGb/JsrhFkK7w=,tag:+diMpCJRbPuEbx6hzPkYhQ==,type:str]
    INIT_POSTGRES_DBNAME: ENC[AES256_GCM,data:SkMlfoJvruoM,iv:h3ru6PPcCrqbLa/B20+gxLBcUzWSS/03Ga7DdOd1Nd8=,tag:arAIWPDjBh2yPZ0Sc22VzQ==,type:str]
    INIT_POSTGRES_HOST: ENC[AES256_GCM,data:gNHkvfBrRaczNCt8LQmoCgtxp3+EV5WlHKt3mfJhm0uihbSLyxw59A==,iv:LrLPfBd/HZtydVIqFsu89fgnJrAzB0adghZ+SGASOyM=,tag:TXewSHUWkQA9aGAHJk8P2g==,type:str]
    INIT_POSTGRES_USER: ENC[AES256_GCM,data:Tfj44gXzF24W,iv:HSSqrUuTo6HPhMOYR4NZ30yFhuOx8CVrFizJrYTVB3w=,tag:wcddSf/JaJzndPjL8GD+1Q==,type:str]
    INIT_POSTGRES_PASS: ENC[AES256_GCM,data:LGbrhnlYil8=,iv:DjDlqOaCuN78xDS/PfKCF62A2+il2oHLnHKpFc/koBI=,tag:HI175tfBJqFaP1znQQKOWQ==,type:str]
    INIT_POSTGRES_SUPER_PASS: ENC[AES256_GCM,data:mNPjy5NvHxg=,iv:EWI8qwDDYm+nHsyw6KJ573cF+Yy2OmYo8vLfS02TIxg=,tag:UEIJtJklHMAjHOR/Essz3g==,type:str]
sops:
    kms: []
    gcp_kms: []
    azure_kv: []
    hc_vault: []
    age:
        - recipient: age12gul5m0dg9nn2gk69uvzwdxyluh5xt02m8wvyg9hn7c93nz7xehswmdenq
          enc: |
            -----BEGIN AGE ENCRYPTED FILE-----
            YWdlLWVuY3J5cHRpb24ub3JnL3YxCi0+IFgyNTUxOSBwWEVMYkFjNWRhU0hPSVNl
            WEVwTWxDQlE2MmVkanQvQ3Z6aUs4d1VyVUVjClhwRVRaZWJPcEs0am5ZSnVZSm9n
            NU80RjFuK3JHdmtPcCt5bHNIQnB5RDQKLS0tIDVCOEdXVWRWeGFiZU9QcThZeGtZ
            SzNEMGQvKzVsZVVNYTZZdWQvMnh1R2cKJ6MTlhKcLXJZt0UKx0iTQDpxQJBUNnoL
            chP9QhTdIDtqYBRsi8xsfkyvDtCsZSC4v5Qi1NklelcP7G/LPfv/sQ==
            -----END AGE ENCRYPTED FILE-----
    lastmodified: "2024-11-10T19:27:46Z"
    mac: ENC[AES256_GCM,data:RSd/TWo6aF02Bd4r9OEUFf/PZR574Muvc5+hSTvepz6X5lwPoUAcqDzDngQ7IWWbCdzpsHK69cbSF2F8bKGyuBqQ7ToWwxOR0KBlhbpVZ1DB522fwyBAkE+0wQXDiqaxc1ejIxNV/qPIxEXdGX+GDqSDa6IPuRzW1a4t/XadnPs=,iv:1Y90Ya1J9OUQVKwVAuwNCTeAFR7Y3Rmi9dwMUqwgj6o=,tag:EuPldBJog0XOjYfIZTkPow==,type:str]
    pgp: []
    encrypted_regex: ^(data|stringData)$
    version: 3.9.1



================================================
FILE: kubernetes/apps/default/searxng/ks.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/ishioni/CRDs-catalog/main/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app searxng
  namespace: &namespace default
spec:
  path: ./kubernetes/apps/default/searxng/app
  targetNamespace: *namespace
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  prune: true
  wait: false
  interval: 10m



================================================
FILE: kubernetes/apps/default/searxng/app/helmrelease.yaml
================================================
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app searxng
spec:
  interval: 15m
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    createNamespace: true
    remediation:
      retries: 3
  upgrade:
    remediation:
      strategy: rollback
      retries: 3
  values:
    controllers:
      searxng:
        strategy: Recreate
        containers:
          app:
            image:
              repository: docker.io/searxng/searxng
              tag: latest
            resources:
              requests:
                cpu: 10m
                memory: 128Mi
              limits:
                cpu: 500m
                memory: 1Gi
    service:
      app:
        controller: *app
        ports:
          http:
            port: 8080
    ingress:
      app:
        className: internal
        annotations:
          external-dns.alpha.kubernetes.io/target: "internal.${SECRET_DOMAIN}"
        hosts:
          - host: "searxng.${SECRET_DOMAIN}"
            paths:
              - path: /
                pathType: Prefix
                service:
                  identifier: app
                  port: http
    persistence:
      config:
        type: configMap
        name: searxng-config
        advancedMounts:
          searxng:
            app:
              - path: /etc/searxng/settings.yml
                subPath: settings.yml
                readOnly: true
              - path: /etc/searxng/limiter.toml
                subPath: limiter.toml
                readOnly: true



================================================
FILE: kubernetes/apps/default/searxng/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml
configMapGenerator:
  - name: searxng-config
    files:
      - settings.yml=./settings.yml
      - limiter.toml=./limiter.toml
generatorOptions:
  disableNameSuffixHash: true



================================================
FILE: kubernetes/apps/default/searxng/app/limiter.toml
================================================
[botdetection.ip_limit]
# activate link_token method in the ip_limit method
link_token = true


================================================
FILE: kubernetes/apps/default/searxng/app/settings.yml
================================================
general:
  # Debug mode, only for development. Is overwritten by ${SEARXNG_DEBUG}
  debug: false
  # displayed name
  instance_name: "searxng"
  # For example: https://example.com/privacy
  privacypolicy_url: false
  # use true to use your own donation page written in searx/info/en/donate.md
  # use false to disable the donation link
  donation_url: false
  # mailto:contact@example.com
  contact_url: false
  # record stats
  enable_metrics: true

brand:
  new_issue_url: https://github.com/searxng/searxng/issues/new
  docs_url: https://docs.searxng.org/
  public_instances: https://searx.space
  wiki_url: https://github.com/searxng/searxng/wiki
  issue_url: https://github.com/searxng/searxng/issues
  # custom:
  #   maintainer: "Jon Doe"
  #   # Custom entries in the footer: [title]: [link]
  #   links:
  #     Uptime: https://uptime.searxng.org/history/darmarit-org
  #     About: "https://searxng.org"

search:
  # Filter results. 0: None, 1: Moderate, 2: Strict
  safe_search: 0
  # Existing autocomplete backends: "dbpedia", "duckduckgo", "google", "yandex", "mwmbl",
  # "seznam", "startpage", "stract", "swisscows", "qwant", "wikipedia" - leave blank to turn it off
  # by default.
  autocomplete: "google"
  # minimun characters to type before autocompleter starts
  autocomplete_min: 4
  # Default search language - leave blank to detect from browser information or
  # use codes from 'languages.py'
  default_lang: "auto"
  # max_page: 0  # if engine supports paging, 0 means unlimited numbers of pages
  # Available languages
  # languages:
  #   - all
  #   - en
  #   - en-US
  #   - de
  #   - it-IT
  #   - fr
  #   - fr-BE
  # ban time in seconds after engine errors
  ban_time_on_fail: 5
  # max ban time in seconds after engine errors
  max_ban_time_on_fail: 120
  suspended_times:
    # Engine suspension time after error (in seconds; set to 0 to disable)
    # For error "Access denied" and "HTTP error [402, 403]"
    SearxEngineAccessDenied: 86400
    # For error "CAPTCHA"
    SearxEngineCaptcha: 86400
    # For error "Too many request" and "HTTP error 429"
    SearxEngineTooManyRequests: 3600
    # Cloudflare CAPTCHA
    cf_SearxEngineCaptcha: 1296000
    cf_SearxEngineAccessDenied: 86400
    # ReCAPTCHA
    recaptcha_SearxEngineCaptcha: 604800

  # remove format to deny access, use lower case.
  # formats: [html, csv, json, rss]
  formats:
    - html
    - json

server:
  # Is overwritten by ${SEARXNG_PORT} and ${SEARXNG_BIND_ADDRESS}
  port: 8888
  bind_address: "127.0.0.1"
  # public URL of the instance, to ensure correct inbound links. Is overwritten
  # by ${SEARXNG_URL}.
  base_url: / # "http://example.com/location"
  limiter: false # rate limit the number of request on the instance, block some bots
  public_instance: false # enable features designed only for public instances

  # If your instance owns a /etc/searxng/settings.yml file, then set the following
  # values there.

  secret_key: "a2fb23f1b02e6ee83875b09826990de0f6bd908b6638e8c10277d415f6ab852b" # Is overwritten by ${SEARXNG_SECRET}
  # Proxying image results through searx
  image_proxy: false
  # 1.0 and 1.1 are supported
  http_protocol_version: "1.0"
  # POST queries are more secure as they don't show up in history but may cause
  # problems when using Firefox containers
  method: "POST"
  default_http_headers:
    X-Content-Type-Options: nosniff
    X-Download-Options: noopen
    X-Robots-Tag: noindex, nofollow
    Referrer-Policy: no-referrer

redis:
  # URL to connect redis database. Is overwritten by ${SEARXNG_REDIS_URL}.
  # https://docs.searxng.org/admin/settings/settings_redis.html#settings-redis
  url: false

ui:
  # Custom static path - leave it blank if you didn't change
  static_path: ""
  static_use_hash: false
  # Custom templates path - leave it blank if you didn't change
  templates_path: ""
  # query_in_title: When true, the result page's titles contains the query
  # it decreases the privacy, since the browser can records the page titles.
  query_in_title: false
  # infinite_scroll: When true, automatically loads the next page when scrolling to bottom of the current page.
  infinite_scroll: false
  # ui theme
  default_theme: simple
  # center the results ?
  center_alignment: false
  # URL prefix of the internet archive, don't forget trailing slash (if needed).
  # cache_url: "https://webcache.googleusercontent.com/search?q=cache:"
  # Default interface locale - leave blank to detect from browser information or
  # use codes from the 'locales' config section
  default_locale: ""
  # Open result links in a new tab by default
  # results_on_new_tab: false
  theme_args:
    # style of simple theme: auto, light, dark
    simple_style: auto
  # Perform search immediately if a category selected.
  # Disable to select multiple categories at once and start the search manually.
  search_on_category_select: true
  # Hotkeys: default or vim
  hotkeys: default

# Lock arbitrary settings on the preferences page.  To find the ID of the user
# setting you want to lock, check the ID of the form on the page "preferences".
#
# preferences:
#   lock:
#     - language
#     - autocomplete
#     - method
#     - query_in_title

# searx supports result proxification using an external service:
# https://github.com/asciimoo/morty uncomment below section if you have running
# morty proxy the key is base64 encoded (keep the !!binary notation)
# Note: since commit af77ec3, morty accepts a base64 encoded key.
#
# result_proxy:
#   url: http://127.0.0.1:3000/
#   # the key is a base64 encoded string, the YAML !!binary prefix is optional
#   key: !!binary "your_morty_proxy_key"
#   # [true|false] enable the "proxy" button next to each result
#   proxify_results: true

# communication with search engines
#
outgoing:
  # default timeout in seconds, can be override by engine
  request_timeout: 3.0
  # the maximum timeout in seconds
  # max_request_timeout: 10.0
  # suffix of searx_useragent, could contain information like an email address
  # to the administrator
  useragent_suffix: ""
  # The maximum number of concurrent connections that may be established.
  pool_connections: 100
  # Allow the connection pool to maintain keep-alive connections below this
  # point.
  pool_maxsize: 20
  # See https://www.python-httpx.org/http2/
  enable_http2: true
  # uncomment below section if you want to use a custom server certificate
  # see https://www.python-httpx.org/advanced/#changing-the-verification-defaults
  # and https://www.python-httpx.org/compatibility/#ssl-configuration
  #  verify: ~/.mitmproxy/mitmproxy-ca-cert.cer
  #
  # uncomment below section if you want to use a proxyq see: SOCKS proxies
  #   https://2.python-requests.org/en/latest/user/advanced/#proxies
  # are also supported: see
  #   https://2.python-requests.org/en/latest/user/advanced/#socks
  #
  #  proxies:
  #    all://:
  #      - http://proxy1:8080
  #      - http://proxy2:8080
  #
  #  using_tor_proxy: true
  #
  # Extra seconds to add in order to account for the time taken by the proxy
  #
  #  extra_proxy_timeout: 10.0
  #
  # uncomment below section only if you have more than one network interface
  # which can be the source of outgoing search requests
  #
  #  source_ips:
  #    - 1.1.1.1
  #    - 1.1.1.2
  #    - fe80::/126

# External plugin configuration, for more details see
#   https://docs.searxng.org/dev/plugins.html
#
# plugins:
#   - plugin1
#   - plugin2
#   - ...

# Comment or un-comment plugin to activate / deactivate by default.
#
# enabled_plugins:
#   # these plugins are enabled if nothing is configured ..
#   - 'Hash plugin'
#   - 'Self Information'
#   - 'Tracker URL remover'
#   - 'Ahmia blacklist'  # activation depends on outgoing.using_tor_proxy
#   # these plugins are disabled if nothing is configured ..
#   - 'Hostname replace'  # see hostname_replace configuration below
#   - 'Open Access DOI rewrite'
#   - 'Tor check plugin'
#   # Read the docs before activate: auto-detection of the language could be
#   # detrimental to users expectations / users can activate the plugin in the
#   # preferences if they want.
#   - 'Autodetect search language'

# Configuration of the "Hostname replace" plugin:
#
# hostname_replace:
#   '(.*\.)?youtube\.com$': 'invidious.example.com'
#   '(.*\.)?youtu\.be$': 'invidious.example.com'
#   '(.*\.)?youtube-noocookie\.com$': 'yotter.example.com'
#   '(.*\.)?reddit\.com$': 'teddit.example.com'
#   '(.*\.)?redd\.it$': 'teddit.example.com'
#   '(www\.)?twitter\.com$': 'nitter.example.com'
#   # to remove matching host names from result list, set value to false
#   'spam\.example\.com': false

checker:
  # disable checker when in debug mode
  off_when_debug: true

  # use "scheduling: false" to disable scheduling
  # scheduling: interval or int

  # to activate the scheduler:
  # * uncomment "scheduling" section
  # * add "cache2 = name=searxngcache,items=2000,blocks=2000,blocksize=4096,bitmap=1"
  #   to your uwsgi.ini

  # scheduling:
  #   start_after: [300, 1800]  # delay to start the first run of the checker
  #   every: [86400, 90000]     # how often the checker runs

  # additional tests: only for the YAML anchors (see the engines section)
  #
  additional_tests:
    rosebud: &test_rosebud
      matrix:
        query: rosebud
        lang: en
      result_container:
        - not_empty
        - ["one_title_contains", "citizen kane"]
      test:
        - unique_results

    android: &test_android
      matrix:
        query: ["android"]
        lang: ["en", "de", "fr", "zh-CN"]
      result_container:
        - not_empty
        - ["one_title_contains", "google"]
      test:
        - unique_results

  # tests: only for the YAML anchors (see the engines section)
  tests:
    infobox: &tests_infobox
      infobox:
        matrix:
          query: ["linux", "new york", "bbc"]
        result_container:
          - has_infobox

categories_as_tabs:
  general:
  images:
  videos:
  news:
  map:
  music:
  it:
  science:
  files:
  social media:

engines:
  - name: 9gag
    engine: 9gag
    shortcut: 9g
    disabled: true

  - name: apk mirror
    engine: apkmirror
    timeout: 4.0
    shortcut: apkm

  - name: anaconda
    engine: xpath
    paging: true
    first_page_num: 0
    search_url: https://anaconda.org/search?q={query}&page={pageno}
    results_xpath: //tbody/tr
    url_xpath: ./td/h5/a[last()]/@href
    title_xpath: ./td/h5
    content_xpath: ./td[h5]/text()
    categories: it
    timeout: 6.0
    shortcut: conda
    disabled: true

  - name: arch linux wiki
    engine: archlinux
    shortcut: al

  - name: artic
    engine: artic
    shortcut: arc
    timeout: 4.0

  - name: arxiv
    engine: arxiv
    shortcut: arx
    timeout: 4.0

  - name: ask
    engine: ask
    shortcut: ask
    disabled: true

  # tmp suspended:  dh key too small
  # - name: base
  #   engine: base
  #   shortcut: bs

  - name: bandcamp
    engine: bandcamp
    shortcut: bc
    categories: music

  - name: wikipedia
    engine: wikipedia
    shortcut: wp
    # add "list" to the array to get results in the results list
    display_type: ["infobox"]
    base_url: "https://{language}.wikipedia.org/"
    categories: [general]

  - name: bilibili
    engine: bilibili
    shortcut: bil
    disabled: true

  - name: bing
    engine: bing
    shortcut: bi
    disabled: true

  - name: bing images
    engine: bing_images
    shortcut: bii

  - name: bing news
    engine: bing_news
    shortcut: bin

  - name: bing videos
    engine: bing_videos
    shortcut: biv

  - name: bitbucket
    engine: xpath
    paging: true
    search_url: https://bitbucket.org/repo/all/{pageno}?name={query}
    url_xpath: //article[@class="repo-summary"]//a[@class="repo-link"]/@href
    title_xpath: //article[@class="repo-summary"]//a[@class="repo-link"]
    content_xpath: //article[@class="repo-summary"]/p
    categories: [it, repos]
    timeout: 4.0
    disabled: true
    shortcut: bb
    about:
      website: https://bitbucket.org/
      wikidata_id: Q2493781
      official_api_documentation: https://developer.atlassian.com/bitbucket
      use_official_api: false
      require_api_key: false
      results: HTML

  - name: bpb
    engine: bpb
    shortcut: bpb
    disabled: true

  - name: btdigg
    engine: btdigg
    shortcut: bt
    disabled: true

  - name: ccc-tv
    engine: xpath
    paging: false
    search_url: https://media.ccc.de/search/?q={query}
    url_xpath: //div[@class="caption"]/h3/a/@href
    title_xpath: //div[@class="caption"]/h3/a/text()
    content_xpath: //div[@class="caption"]/h4/@title
    categories: videos
    disabled: true
    shortcut: c3tv
    about:
      website: https://media.ccc.de/
      wikidata_id: Q80729951
      official_api_documentation: https://github.com/voc/voctoweb
      use_official_api: false
      require_api_key: false
      results: HTML
      # We don't set language: de here because media.ccc.de is not just
      # for a German audience. It contains many English videos and many
      # German videos have English subtitles.

  - name: openverse
    engine: openverse
    categories: images
    shortcut: opv

  - name: chefkoch
    engine: chefkoch
    shortcut: chef
    # to show premium or plus results too:
    # skip_premium: false

  # - name: core.ac.uk
  #   engine: core
  #   categories: science
  #   shortcut: cor
  #   # get your API key from: https://core.ac.uk/api-keys/register/
  #   api_key: 'unset'

  - name: crossref
    engine: crossref
    shortcut: cr
    timeout: 30
    disabled: true

  - name: crowdview
    engine: json_engine
    shortcut: cv
    categories: general
    paging: false
    search_url: https://crowdview-next-js.onrender.com/api/search-v3?query={query}
    results_query: results
    url_query: link
    title_query: title
    content_query: snippet
    disabled: true
    about:
      website: https://crowdview.ai/

  - name: yep
    engine: yep
    shortcut: yep
    categories: general
    search_type: web
    disabled: true

  - name: yep images
    engine: yep
    shortcut: yepi
    categories: images
    search_type: images
    disabled: true

  - name: yep news
    engine: yep
    shortcut: yepn
    categories: news
    search_type: news
    disabled: true

  - name: curlie
    engine: xpath
    shortcut: cl
    categories: general
    disabled: true
    paging: true
    lang_all: ""
    search_url: https://curlie.org/search?q={query}&lang={lang}&start={pageno}&stime=92452189
    page_size: 20
    results_xpath: //div[@id="site-list-content"]/div[@class="site-item"]
    url_xpath: ./div[@class="title-and-desc"]/a/@href
    title_xpath: ./div[@class="title-and-desc"]/a/div
    content_xpath: ./div[@class="title-and-desc"]/div[@class="site-descr"]
    about:
      website: https://curlie.org/
      wikidata_id: Q60715723
      use_official_api: false
      require_api_key: false
      results: HTML

  - name: currency
    engine: currency_convert
    categories: general
    shortcut: cc

  - name: bahnhof
    engine: json_engine
    search_url: https://www.bahnhof.de/api/stations/search/{query}
    url_prefix: https://www.bahnhof.de/
    url_query: slug
    title_query: name
    content_query: state
    shortcut: bf
    disabled: true
    about:
      website: https://www.bahn.de
      wikidata_id: Q22811603
      use_official_api: false
      require_api_key: false
      results: JSON
      language: de

  - name: deezer
    engine: deezer
    shortcut: dz
    disabled: true

  - name: destatis
    engine: destatis
    shortcut: destat
    disabled: true

  - name: deviantart
    engine: deviantart
    shortcut: da
    timeout: 3.0

  - name: ddg definitions
    engine: duckduckgo_definitions
    shortcut: ddd
    weight: 2
    disabled: true
    tests: *tests_infobox

  # cloudflare protected
  # - name: digbt
  #   engine: digbt
  #   shortcut: dbt
  #   timeout: 6.0
  #   disabled: true

  - name: docker hub
    engine: docker_hub
    shortcut: dh
    categories: [it, packages]

  - name: erowid
    engine: xpath
    paging: true
    first_page_num: 0
    page_size: 30
    search_url: https://www.erowid.org/search.php?q={query}&s={pageno}
    url_xpath: //dl[@class="results-list"]/dt[@class="result-title"]/a/@href
    title_xpath: //dl[@class="results-list"]/dt[@class="result-title"]/a/text()
    content_xpath: //dl[@class="results-list"]/dd[@class="result-details"]
    categories: []
    shortcut: ew
    disabled: true
    about:
      website: https://www.erowid.org/
      wikidata_id: Q1430691
      official_api_documentation:
      use_official_api: false
      require_api_key: false
      results: HTML

  # - name: elasticsearch
  #   shortcut: es
  #   engine: elasticsearch
  #   base_url: http://localhost:9200
  #   username: elastic
  #   password: changeme
  #   index: my-index
  #   # available options: match, simple_query_string, term, terms, custom
  #   query_type: match
  #   # if query_type is set to custom, provide your query here
  #   #custom_query_json: {"query":{"match_all": {}}}
  #   #show_metadata: false
  #   disabled: true

  # - name: wikidata
  #   engine: wikidata
  #   shortcut: wd
  #   timeout: 3.0
  #   weight: 2
  #   # add "list" to the array to get results in the results list
  #   display_type: ["infobox"]
  #   tests: *tests_infobox
  #   categories: [general]

  - name: duckduckgo
    engine: duckduckgo
    shortcut: ddg

  - name: duckduckgo images
    engine: duckduckgo_extra
    categories: [images, web]
    ddg_category: images
    shortcut: ddi
    disabled: true

  - name: duckduckgo videos
    engine: duckduckgo_extra
    categories: [videos, web]
    ddg_category: videos
    shortcut: ddv
    disabled: true

  - name: duckduckgo news
    engine: duckduckgo_extra
    categories: [news, web]
    ddg_category: news
    shortcut: ddn
    disabled: true

  - name: duckduckgo weather
    engine: duckduckgo_weather
    shortcut: ddw
    disabled: true

  - name: apple maps
    engine: apple_maps
    shortcut: apm
    disabled: true
    timeout: 5.0

  - name: emojipedia
    engine: emojipedia
    timeout: 4.0
    shortcut: em
    disabled: true

  - name: tineye
    engine: tineye
    shortcut: tin
    timeout: 9.0
    disabled: true

  - name: etymonline
    engine: xpath
    paging: true
    search_url: https://etymonline.com/search?page={pageno}&q={query}
    url_xpath: //a[contains(@class, "word__name--")]/@href
    title_xpath: //a[contains(@class, "word__name--")]
    content_xpath: //section[contains(@class, "word__defination")]
    first_page_num: 1
    shortcut: et
    categories: [dictionaries]
    about:
      website: https://www.etymonline.com/
      wikidata_id: Q1188617
      official_api_documentation:
      use_official_api: false
      require_api_key: false
      results: HTML

  # - name: ebay
  #   engine: ebay
  #   shortcut: eb
  #   base_url: 'https://www.ebay.com'
  #   disabled: true
  #   timeout: 5

  - name: 1x
    engine: www1x
    shortcut: 1x
    timeout: 3.0
    disabled: true

  - name: fdroid
    engine: fdroid
    shortcut: fd
    disabled: true

  - name: flickr
    categories: images
    shortcut: fl
    # You can use the engine using the official stable API, but you need an API
    # key, see: https://www.flickr.com/services/apps/create/
    # engine: flickr
    # api_key: 'apikey' # required!
    # Or you can use the html non-stable engine, activated by default
    engine: flickr_noapi

  - name: free software directory
    engine: mediawiki
    shortcut: fsd
    categories: [it, software wikis]
    base_url: https://directory.fsf.org/
    search_type: title
    timeout: 5.0
    disabled: true
    about:
      website: https://directory.fsf.org/
      wikidata_id: Q2470288

  # - name: freesound
  #   engine: freesound
  #   shortcut: fnd
  #   disabled: true
  #   timeout: 15.0
  # API key required, see: https://freesound.org/docs/api/overview.html
  #   api_key: MyAPIkey

  - name: frinkiac
    engine: frinkiac
    shortcut: frk
    disabled: true

  - name: fyyd
    engine: fyyd
    shortcut: fy
    timeout: 8.0
    disabled: true

  - name: genius
    engine: genius
    shortcut: gen

  # - name: gentoo
  #   engine: gentoo
  #   shortcut: ge
  #   timeout: 10.0

  - name: gitlab
    engine: json_engine
    paging: true
    search_url: https://gitlab.com/api/v4/projects?search={query}&page={pageno}
    url_query: web_url
    title_query: name_with_namespace
    content_query: description
    page_size: 20
    categories: [it, repos]
    shortcut: gl
    timeout: 10.0
    disabled: true
    about:
      website: https://about.gitlab.com/
      wikidata_id: Q16639197
      official_api_documentation: https://docs.gitlab.com/ee/api/
      use_official_api: false
      require_api_key: false
      results: JSON

  - name: github
    engine: github
    shortcut: gh

    # This a Gitea service. If you would like to use a different instance,
    # change codeberg.org to URL of the desired Gitea host. Or you can create a
    # new engine by copying this and changing the name, shortcut and search_url.

  - name: codeberg
    engine: json_engine
    search_url: https://codeberg.org/api/v1/repos/search?q={query}&limit=10
    url_query: html_url
    title_query: name
    content_query: description
    categories: [it, repos]
    shortcut: cb
    disabled: true
    about:
      website: https://codeberg.org/
      wikidata_id:
      official_api_documentation: https://try.gitea.io/api/swagger
      use_official_api: false
      require_api_key: false
      results: JSON

  - name: goodreads
    engine: goodreads
    shortcut: good
    timeout: 4.0
    disabled: true

  - name: google
    engine: google
    shortcut: go
    # additional_tests:
    #   android: *test_android

  - name: google images
    engine: google_images
    shortcut: goi
    # additional_tests:
    #   android: *test_android
    #   dali:
    #     matrix:
    #       query: ['Dali Christ']
    #       lang: ['en', 'de', 'fr', 'zh-CN']
    #     result_container:
    #       - ['one_title_contains', 'Salvador']

  - name: google news
    engine: google_news
    shortcut: gon
    # additional_tests:
    #   android: *test_android

  - name: google videos
    engine: google_videos
    shortcut: gov
    # additional_tests:
    #   android: *test_android

  - name: google scholar
    engine: google_scholar
    shortcut: gos

  - name: google play apps
    engine: google_play
    categories: [files, apps]
    shortcut: gpa
    play_categ: apps
    disabled: true

  - name: google play movies
    engine: google_play
    categories: videos
    shortcut: gpm
    play_categ: movies
    disabled: true

  - name: material icons
    engine: material_icons
    categories: images
    shortcut: mi
    disabled: true

  - name: gpodder
    engine: json_engine
    shortcut: gpod
    timeout: 4.0
    paging: false
    search_url: https://gpodder.net/search.json?q={query}
    url_query: url
    title_query: title
    content_query: description
    page_size: 19
    categories: music
    disabled: true
    about:
      website: https://gpodder.net
      wikidata_id: Q3093354
      official_api_documentation: https://gpoddernet.readthedocs.io/en/latest/api/
      use_official_api: false
      requires_api_key: false
      results: JSON

  - name: habrahabr
    engine: xpath
    paging: true
    search_url: https://habr.com/en/search/page{pageno}/?q={query}
    results_xpath: //article[contains(@class, "tm-articles-list__item")]
    url_xpath: .//a[@class="tm-title__link"]/@href
    title_xpath: .//a[@class="tm-title__link"]
    content_xpath: .//div[contains(@class, "article-formatted-body")]
    categories: it
    timeout: 4.0
    disabled: true
    shortcut: habr
    about:
      website: https://habr.com/
      wikidata_id: Q4494434
      official_api_documentation: https://habr.com/en/docs/help/api/
      use_official_api: false
      require_api_key: false
      results: HTML

  - name: hackernews
    engine: hackernews
    shortcut: hn
    disabled: true

  - name: hoogle
    engine: xpath
    paging: true
    search_url: https://hoogle.haskell.org/?hoogle={query}&start={pageno}
    results_xpath: '//div[@class="result"]'
    title_xpath: './/div[@class="ans"]//a'
    url_xpath: './/div[@class="ans"]//a/@href'
    content_xpath: './/div[@class="from"]'
    page_size: 20
    categories: [it, packages]
    shortcut: ho
    about:
      website: https://hoogle.haskell.org/
      wikidata_id: Q34010
      official_api_documentation: https://hackage.haskell.org/api
      use_official_api: false
      require_api_key: false
      results: JSON

  - name: imdb
    engine: imdb
    shortcut: imdb
    timeout: 6.0
    disabled: true

  - name: imgur
    engine: imgur
    shortcut: img
    disabled: true

  - name: ina
    engine: ina
    shortcut: in
    timeout: 6.0
    disabled: true

  - name: invidious
    engine: invidious
    # Instanes will be selected randomly, see https://api.invidious.io/ for
    # instances that are stable (good uptime) and close to you.
    base_url:
      - https://invidious.io.lol
      - https://invidious.fdn.fr
      - https://yt.artemislena.eu
      - https://invidious.tiekoetter.com
      - https://invidious.flokinet.to
      - https://vid.puffyan.us
      - https://invidious.privacydev.net
      - https://inv.tux.pizza
    shortcut: iv
    timeout: 3.0
    disabled: true

  - name: jisho
    engine: jisho
    shortcut: js
    timeout: 3.0
    disabled: true

  - name: kickass
    engine: kickass
    base_url:
      - https://kickasstorrents.to
      - https://kickasstorrents.cr
      - https://kickasstorrent.cr
      - https://kickass.sx
      - https://kat.am
    shortcut: kc
    timeout: 4.0

  - name: lemmy communities
    engine: lemmy
    lemmy_type: Communities
    shortcut: leco

  - name: lemmy users
    engine: lemmy
    network: lemmy communities
    lemmy_type: Users
    shortcut: leus

  - name: lemmy posts
    engine: lemmy
    network: lemmy communities
    lemmy_type: Posts
    shortcut: lepo

  - name: lemmy comments
    engine: lemmy
    network: lemmy communities
    lemmy_type: Comments
    shortcut: lecom

  - name: library genesis
    engine: xpath
    # search_url: https://libgen.is/search.php?req={query}
    search_url: https://libgen.rs/search.php?req={query}
    url_xpath: //a[contains(@href,"book/index.php?md5")]/@href
    title_xpath: //a[contains(@href,"book/")]/text()[1]
    content_xpath: //td/a[1][contains(@href,"=author")]/text()
    categories: files
    timeout: 7.0
    disabled: true
    shortcut: lg
    about:
      website: https://libgen.fun/
      wikidata_id: Q22017206
      official_api_documentation:
      use_official_api: false
      require_api_key: false
      results: HTML

  - name: z-library
    engine: zlibrary
    shortcut: zlib
    categories: files
    timeout: 7.0

  - name: library of congress
    engine: loc
    shortcut: loc
    categories: images

  - name: lingva
    engine: lingva
    shortcut: lv
    # set lingva instance in url, by default it will use the official instance
    # url: https://lingva.thedaviddelta.com

  - name: lobste.rs
    engine: xpath
    search_url: https://lobste.rs/search?utf8=%E2%9C%93&q={query}&what=stories&order=relevance
    results_xpath: //li[contains(@class, "story")]
    url_xpath: .//a[@class="u-url"]/@href
    title_xpath: .//a[@class="u-url"]
    content_xpath: .//a[@class="domain"]
    categories: it
    shortcut: lo
    timeout: 5.0
    disabled: true
    about:
      website: https://lobste.rs/
      wikidata_id: Q60762874
      official_api_documentation:
      use_official_api: false
      require_api_key: false
      results: HTML

  - name: mastodon users
    engine: mastodon
    mastodon_type: accounts
    base_url: https://mastodon.social
    shortcut: mau

  - name: mastodon hashtags
    engine: mastodon
    mastodon_type: hashtags
    base_url: https://mastodon.social
    shortcut: mah

  # - name: matrixrooms
  #   engine: mrs
  #   # https://docs.searxng.org/dev/engines/online/mrs.html
  #   # base_url: https://mrs-api-host
  #   shortcut: mtrx
  #   disabled: true

  - name: mdn
    shortcut: mdn
    engine: json_engine
    categories: [it]
    paging: true
    search_url: https://developer.mozilla.org/api/v1/search?q={query}&page={pageno}
    results_query: documents
    url_query: mdn_url
    url_prefix: https://developer.mozilla.org
    title_query: title
    content_query: summary
    about:
      website: https://developer.mozilla.org
      wikidata_id: Q3273508
      official_api_documentation: null
      use_official_api: false
      require_api_key: false
      results: JSON

  - name: metacpan
    engine: metacpan
    shortcut: cpan
    disabled: true
    number_of_results: 20

  # - name: meilisearch
  #   engine: meilisearch
  #   shortcut: mes
  #   enable_http: true
  #   base_url: http://localhost:7700
  #   index: my-index

  - name: mixcloud
    engine: mixcloud
    shortcut: mc

  # MongoDB engine
  # Required dependency: pymongo
  # - name: mymongo
  #   engine: mongodb
  #   shortcut: md
  #   exact_match_only: false
  #   host: '127.0.0.1'
  #   port: 27017
  #   enable_http: true
  #   results_per_page: 20
  #   database: 'business'
  #   collection: 'reviews'  # name of the db collection
  #   key: 'name'  # key in the collection to search for

  - name: mozhi
    engine: mozhi
    base_url:
      - https://mozhi.aryak.me
      - https://translate.bus-hit.me
      - https://nyc1.mz.ggtyler.dev
    # mozhi_engine: google - see https://mozhi.aryak.me for supported engines
    timeout: 4.0
    shortcut: mz
    disabled: true

  - name: mwmbl
    engine: mwmbl
    # api_url: https://api.mwmbl.org
    shortcut: mwm
    disabled: true

  - name: npm
    engine: json_engine
    paging: true
    first_page_num: 0
    search_url: https://api.npms.io/v2/search?q={query}&size=25&from={pageno}
    results_query: results
    url_query: package/links/npm
    title_query: package/name
    content_query: package/description
    page_size: 25
    categories: [it, packages]
    disabled: true
    timeout: 5.0
    shortcut: npm
    about:
      website: https://npms.io/
      wikidata_id: Q7067518
      official_api_documentation: https://api-docs.npms.io/
      use_official_api: false
      require_api_key: false
      results: JSON

  - name: nyaa
    engine: nyaa
    shortcut: nt
    disabled: true

  - name: mankier
    engine: json_engine
    search_url: https://www.mankier.com/api/v2/mans/?q={query}
    results_query: results
    url_query: url
    title_query: name
    content_query: description
    categories: it
    shortcut: man
    about:
      website: https://www.mankier.com/
      official_api_documentation: https://www.mankier.com/api
      use_official_api: true
      require_api_key: false
      results: JSON

  - name: odysee
    engine: odysee
    shortcut: od
    disabled: true

  - name: openairedatasets
    engine: json_engine
    paging: true
    search_url: https://api.openaire.eu/search/datasets?format=json&page={pageno}&size=10&title={query}
    results_query: response/results/result
    url_query: metadata/oaf:entity/oaf:result/children/instance/webresource/url/$
    title_query: metadata/oaf:entity/oaf:result/title/$
    content_query: metadata/oaf:entity/oaf:result/description/$
    content_html_to_text: true
    categories: "science"
    shortcut: oad
    timeout: 5.0
    about:
      website: https://www.openaire.eu/
      wikidata_id: Q25106053
      official_api_documentation: https://api.openaire.eu/
      use_official_api: false
      require_api_key: false
      results: JSON

  - name: openairepublications
    engine: json_engine
    paging: true
    search_url: https://api.openaire.eu/search/publications?format=json&page={pageno}&size=10&title={query}
    results_query: response/results/result
    url_query: metadata/oaf:entity/oaf:result/children/instance/webresource/url/$
    title_query: metadata/oaf:entity/oaf:result/title/$
    content_query: metadata/oaf:entity/oaf:result/description/$
    content_html_to_text: true
    categories: science
    shortcut: oap
    timeout: 5.0
    about:
      website: https://www.openaire.eu/
      wikidata_id: Q25106053
      official_api_documentation: https://api.openaire.eu/
      use_official_api: false
      require_api_key: false
      results: JSON

  # - name: opensemanticsearch
  #   engine: opensemantic
  #   shortcut: oss
  #   base_url: 'http://localhost:8983/solr/opensemanticsearch/'

  - name: openstreetmap
    engine: openstreetmap
    shortcut: osm

  - name: openrepos
    engine: xpath
    paging: true
    search_url: https://openrepos.net/search/node/{query}?page={pageno}
    url_xpath: //li[@class="search-result"]//h3[@class="title"]/a/@href
    title_xpath: //li[@class="search-result"]//h3[@class="title"]/a
    content_xpath: //li[@class="search-result"]//div[@class="search-snippet-info"]//p[@class="search-snippet"]
    categories: files
    timeout: 4.0
    disabled: true
    shortcut: or
    about:
      website: https://openrepos.net/
      wikidata_id:
      official_api_documentation:
      use_official_api: false
      require_api_key: false
      results: HTML

  - name: packagist
    engine: json_engine
    paging: true
    search_url: https://packagist.org/search.json?q={query}&page={pageno}
    results_query: results
    url_query: url
    title_query: name
    content_query: description
    categories: [it, packages]
    disabled: true
    timeout: 5.0
    shortcut: pack
    about:
      website: https://packagist.org
      wikidata_id: Q108311377
      official_api_documentation: https://packagist.org/apidoc
      use_official_api: true
      require_api_key: false
      results: JSON

  - name: pdbe
    engine: pdbe
    shortcut: pdb
    # Hide obsolete PDB entries.  Default is not to hide obsolete structures
    #  hide_obsolete: false

  - name: photon
    engine: photon
    shortcut: ph

  - name: pinterest
    engine: pinterest
    shortcut: pin

  - name: piped
    engine: piped
    shortcut: ppd
    categories: videos
    piped_filter: videos
    timeout: 3.0

    # URL to use as link and for embeds
    frontend_url: https://srv.piped.video
    # Instance will be selected randomly, for more see https://piped-instances.kavin.rocks/
    backend_url:
      - https://pipedapi.kavin.rocks
      - https://pipedapi-libre.kavin.rocks
      - https://pipedapi.adminforge.de

  - name: piped.music
    engine: piped
    network: piped
    shortcut: ppdm
    categories: music
    piped_filter: music_songs
    timeout: 3.0

  - name: piratebay
    engine: piratebay
    shortcut: tpb
    # You may need to change this URL to a proxy if piratebay is blocked in your
    # country
    url: https://thepiratebay.org/
    timeout: 3.0

  - name: podcastindex
    engine: podcastindex
    shortcut: podcast

  # Required dependency: psychopg2
  #  - name: postgresql
  #    engine: postgresql
  #    database: postgres
  #    username: postgres
  #    password: postgres
  #    limit: 10
  #    query_str: 'SELECT * from my_table WHERE my_column = %(query)s'
  #    shortcut : psql

  - name: presearch
    engine: presearch
    search_type: search
    categories: [general, web]
    shortcut: ps
    timeout: 4.0
    disabled: true

  - name: presearch images
    engine: presearch
    network: presearch
    search_type: images
    categories: [images, web]
    timeout: 4.0
    shortcut: psimg
    disabled: true

  - name: presearch videos
    engine: presearch
    network: presearch
    search_type: videos
    categories: [general, web]
    timeout: 4.0
    shortcut: psvid
    disabled: true

  - name: presearch news
    engine: presearch
    network: presearch
    search_type: news
    categories: [news, web]
    timeout: 4.0
    shortcut: psnews
    disabled: true

  - name: pub.dev
    engine: xpath
    shortcut: pd
    search_url: https://pub.dev/packages?q={query}&page={pageno}
    paging: true
    results_xpath: //div[contains(@class,"packages-item")]
    url_xpath: ./div/h3/a/@href
    title_xpath: ./div/h3/a
    content_xpath: ./div/div/div[contains(@class,"packages-description")]/span
    categories: [packages, it]
    timeout: 3.0
    disabled: true
    first_page_num: 1
    about:
      website: https://pub.dev/
      official_api_documentation: https://pub.dev/help/api
      use_official_api: false
      require_api_key: false
      results: HTML

  - name: pubmed
    engine: pubmed
    shortcut: pub
    timeout: 3.0

  - name: pypi
    shortcut: pypi
    engine: xpath
    paging: true
    search_url: https://pypi.org/search/?q={query}&page={pageno}
    results_xpath: /html/body/main/div/div/div/form/div/ul/li/a[@class="package-snippet"]
    url_xpath: ./@href
    title_xpath: ./h3/span[@class="package-snippet__name"]
    content_xpath: ./p
    suggestion_xpath: /html/body/main/div/div/div/form/div/div[@class="callout-block"]/p/span/a[@class="link"]
    first_page_num: 1
    categories: [it, packages]
    about:
      website: https://pypi.org
      wikidata_id: Q2984686
      official_api_documentation: https://warehouse.readthedocs.io/api-reference/index.html
      use_official_api: false
      require_api_key: false
      results: HTML

  - name: qwant
    qwant_categ: web
    engine: qwant
    shortcut: qw
    categories: [general, web]
    additional_tests:
      rosebud: *test_rosebud

  - name: qwant news
    qwant_categ: news
    engine: qwant
    shortcut: qwn
    categories: news
    network: qwant

  - name: qwant images
    qwant_categ: images
    engine: qwant
    shortcut: qwi
    categories: [images, web]
    network: qwant

  - name: qwant videos
    qwant_categ: videos
    engine: qwant
    shortcut: qwv
    categories: [videos, web]
    network: qwant

  # - name: library
  #   engine: recoll
  #   shortcut: lib
  #   base_url: 'https://recoll.example.org/'
  #   search_dir: ''
  #   mount_prefix: /export
  #   dl_prefix: 'https://download.example.org'
  #   timeout: 30.0
  #   categories: files
  #   disabled: true

  # - name: recoll library reference
  #   engine: recoll
  #   base_url: 'https://recoll.example.org/'
  #   search_dir: reference
  #   mount_prefix: /export
  #   dl_prefix: 'https://download.example.org'
  #   shortcut: libr
  #   timeout: 30.0
  #   categories: files
  #   disabled: true

  - name: radio browser
    engine: radio_browser
    shortcut: rb

  - name: reddit
    engine: reddit
    shortcut: re
    page_size: 25

  - name: rottentomatoes
    engine: rottentomatoes
    shortcut: rt
    disabled: true

  # Required dependency: redis
  # - name: myredis
  #   shortcut : rds
  #   engine: redis_server
  #   exact_match_only: false
  #   host: '127.0.0.1'
  #   port: 6379
  #   enable_http: true
  #   password: ''
  #   db: 0

  # tmp suspended: bad certificate
  #  - name: scanr structures
  #    shortcut: scs
  #    engine: scanr_structures
  #    disabled: true

  - name: sepiasearch
    engine: sepiasearch
    shortcut: sep

  - name: soundcloud
    engine: soundcloud
    shortcut: sc

  - name: stackoverflow
    engine: stackexchange
    shortcut: st
    api_site: "stackoverflow"
    categories: [it, q&a]

  - name: askubuntu
    engine: stackexchange
    shortcut: ubuntu
    api_site: "askubuntu"
    categories: [it, q&a]

  - name: internetarchivescholar
    engine: internet_archive_scholar
    shortcut: ias
    timeout: 5.0

  - name: superuser
    engine: stackexchange
    shortcut: su
    api_site: "superuser"
    categories: [it, q&a]

  - name: searchcode code
    engine: searchcode_code
    shortcut: scc
    disabled: true

  # - name: searx
  #   engine: searx_engine
  #   shortcut: se
  #   instance_urls :
  #       - http://127.0.0.1:8888/
  #       - ...
  #   disabled: true

  - name: semantic scholar
    engine: semantic_scholar
    disabled: true
    shortcut: se

  # Spotify needs API credentials
  # - name: spotify
  #   engine: spotify
  #   shortcut: stf
  #   api_client_id: *******
  #   api_client_secret: *******

  # - name: solr
  #   engine: solr
  #   shortcut: slr
  #   base_url: http://localhost:8983
  #   collection: collection_name
  #   sort: '' # sorting: asc or desc
  #   field_list: '' # comma separated list of field names to display on the UI
  #   default_fields: '' # default field to query
  #   query_fields: '' # query fields
  #   enable_http: true

  # - name: springer nature
  #   engine: springer
  #   # get your API key from: https://dev.springernature.com/signup
  #   # working API key, for test & debug: "a69685087d07eca9f13db62f65b8f601"
  #   api_key: 'unset'
  #   shortcut: springer
  #   timeout: 15.0

  - name: startpage
    engine: startpage
    shortcut: sp
    timeout: 6.0
    disabled: true
    additional_tests:
      rosebud: *test_rosebud

  - name: tokyotoshokan
    engine: tokyotoshokan
    shortcut: tt
    timeout: 6.0
    disabled: true

  - name: solidtorrents
    engine: solidtorrents
    shortcut: solid
    timeout: 4.0
    base_url:
      - https://solidtorrents.to
      - https://bitsearch.to

  # For this demo of the sqlite engine download:
  #   https://liste.mediathekview.de/filmliste-v2.db.bz2
  # and unpack into searx/data/filmliste-v2.db
  # Query to test: "!demo concert"
  #
  # - name: demo
  #   engine: sqlite
  #   shortcut: demo
  #   categories: general
  #   result_template: default.html
  #   database: searx/data/filmliste-v2.db
  #   query_str:  >-
  #     SELECT title || ' (' || time(duration, 'unixepoch') || ')' AS title,
  #            COALESCE( NULLIF(url_video_hd,''), NULLIF(url_video_sd,''), url_video) AS url,
  #            description AS content
  #       FROM film
  #      WHERE title LIKE :wildcard OR description LIKE :wildcard
  #      ORDER BY duration DESC

  - name: tagesschau
    engine: tagesschau
    # when set to false, display URLs from Tagesschau, and not the actual source
    # (e.g. NDR, WDR, SWR, HR, ...)
    use_source_url: true
    shortcut: ts
    disabled: true

  - name: tmdb
    engine: xpath
    paging: true
    categories: movies
    search_url: https://www.themoviedb.org/search?page={pageno}&query={query}
    results_xpath: //div[contains(@class,"movie") or contains(@class,"tv")]//div[contains(@class,"card")]
    url_xpath: .//div[contains(@class,"poster")]/a/@href
    thumbnail_xpath: .//img/@src
    title_xpath: .//div[contains(@class,"title")]//h2
    content_xpath: .//div[contains(@class,"overview")]
    shortcut: tm
    disabled: true

  # Requires Tor
  - name: torch
    engine: xpath
    paging: true
    search_url: http://xmh57jrknzkhv6y3ls3ubitzfqnkrwxhopf5aygthi7d6rplyvk3noyd.onion/cgi-bin/omega/omega?P={query}&DEFAULTOP=and
    results_xpath: //table//tr
    url_xpath: ./td[2]/a
    title_xpath: ./td[2]/b
    content_xpath: ./td[2]/small
    categories: onions
    enable_http: true
    shortcut: tch

  # torznab engine lets you query any torznab compatible indexer.  Using this
  # engine in combination with Jackett opens the possibility to query a lot of
  # public and private indexers directly from SearXNG. More details at:
  # https://docs.searxng.org/dev/engines/online/torznab.html
  #
  # - name: Torznab EZTV
  #   engine: torznab
  #   shortcut: eztv
  #   base_url: http://localhost:9117/api/v2.0/indexers/eztv/results/torznab
  #   enable_http: true  # if using localhost
  #   api_key: xxxxxxxxxxxxxxx
  #   show_magnet_links: true
  #   show_torrent_files: false
  #   # https://github.com/Jackett/Jackett/wiki/Jackett-Categories
  #   torznab_categories:  # optional
  #     - 2000
  #     - 5000

  # tmp suspended - too slow, too many errors
  #  - name: urbandictionary
  #    engine      : xpath
  #    search_url  : https://www.urbandictionary.com/define.php?term={query}
  #    url_xpath   : //*[@class="word"]/@href
  #    title_xpath : //*[@class="def-header"]
  #    content_xpath: //*[@class="meaning"]
  #    shortcut: ud

  - name: unsplash
    engine: unsplash
    shortcut: us

  - name: yandex music
    engine: yandex_music
    shortcut: ydm
    disabled: true
    # https://yandex.com/support/music/access.html
    inactive: true

  - name: yahoo
    engine: yahoo
    shortcut: yh
    disabled: true

  - name: yahoo news
    engine: yahoo_news
    shortcut: yhn

  - name: youtube
    shortcut: yt
    # You can use the engine using the official stable API, but you need an API
    # key See: https://console.developers.google.com/project
    #
    # engine: youtube_api
    # api_key: 'apikey' # required!
    #
    # Or you can use the html non-stable engine, activated by default
    engine: youtube_noapi

  - name: dailymotion
    engine: dailymotion
    shortcut: dm

  - name: vimeo
    engine: vimeo
    shortcut: vm

  - name: wiby
    engine: json_engine
    paging: true
    search_url: https://wiby.me/json/?q={query}&p={pageno}
    url_query: URL
    title_query: Title
    content_query: Snippet
    categories: [general, web]
    shortcut: wib
    disabled: true
    about:
      website: https://wiby.me/

  - name: alexandria
    engine: json_engine
    shortcut: alx
    categories: general
    paging: true
    search_url: https://api.alexandria.org/?a=1&q={query}&p={pageno}
    results_query: results
    title_query: title
    url_query: url
    content_query: snippet
    timeout: 1.5
    disabled: true
    about:
      website: https://alexandria.org/
      official_api_documentation: https://github.com/alexandria-org/alexandria-api/raw/master/README.md
      use_official_api: true
      require_api_key: false
      results: JSON

  - name: wikibooks
    engine: mediawiki
    weight: 0.5
    shortcut: wb
    categories: [general, wikimedia]
    base_url: "https://{language}.wikibooks.org/"
    search_type: text
    disabled: true
    about:
      website: https://www.wikibooks.org/
      wikidata_id: Q367

  - name: wikinews
    engine: mediawiki
    shortcut: wn
    categories: [news, wikimedia]
    base_url: "https://{language}.wikinews.org/"
    search_type: text
    srsort: create_timestamp_desc
    about:
      website: https://www.wikinews.org/
      wikidata_id: Q964

  - name: wikiquote
    engine: mediawiki
    weight: 0.5
    shortcut: wq
    categories: [general, wikimedia]
    base_url: "https://{language}.wikiquote.org/"
    search_type: text
    disabled: true
    additional_tests:
      rosebud: *test_rosebud
    about:
      website: https://www.wikiquote.org/
      wikidata_id: Q369

  - name: wikisource
    engine: mediawiki
    weight: 0.5
    shortcut: ws
    categories: [general, wikimedia]
    base_url: "https://{language}.wikisource.org/"
    search_type: text
    disabled: true
    about:
      website: https://www.wikisource.org/
      wikidata_id: Q263

  - name: wikispecies
    engine: mediawiki
    shortcut: wsp
    categories: [general, science, wikimedia]
    base_url: "https://species.wikimedia.org/"
    search_type: text
    disabled: true
    about:
      website: https://species.wikimedia.org/
      wikidata_id: Q13679

  - name: wiktionary
    engine: mediawiki
    shortcut: wt
    categories: [dictionaries, wikimedia]
    base_url: "https://{language}.wiktionary.org/"
    search_type: text
    about:
      website: https://www.wiktionary.org/
      wikidata_id: Q151

  - name: wikiversity
    engine: mediawiki
    weight: 0.5
    shortcut: wv
    categories: [general, wikimedia]
    base_url: "https://{language}.wikiversity.org/"
    search_type: text
    disabled: true
    about:
      website: https://www.wikiversity.org/
      wikidata_id: Q370

  - name: wikivoyage
    engine: mediawiki
    weight: 0.5
    shortcut: wy
    categories: [general, wikimedia]
    base_url: "https://{language}.wikivoyage.org/"
    search_type: text
    disabled: true
    about:
      website: https://www.wikivoyage.org/
      wikidata_id: Q373

  - name: wikicommons.images
    engine: wikicommons
    shortcut: wc
    categories: images
    number_of_results: 10

  - name: wolframalpha
    shortcut: wa
    # You can use the engine using the official stable API, but you need an API
    # key.  See: https://products.wolframalpha.com/api/
    #
    # engine: wolframalpha_api
    # api_key: ''
    #
    # Or you can use the html non-stable engine, activated by default
    engine: wolframalpha_noapi
    timeout: 6.0
    categories: general
    disabled: false

  - name: dictzone
    engine: dictzone
    shortcut: dc

  - name: mymemory translated
    engine: translated
    shortcut: tl
    timeout: 5.0
    # You can use without an API key, but you are limited to 1000 words/day
    # See: https://mymemory.translated.net/doc/usagelimits.php
    # api_key: ''

  # Required dependency: mysql-connector-python
  #  - name: mysql
  #    engine: mysql_server
  #    database: mydatabase
  #    username: user
  #    password: pass
  #    limit: 10
  #    query_str: 'SELECT * from mytable WHERE fieldname=%(query)s'
  #    shortcut: mysql

  - name: 1337x
    engine: 1337x
    shortcut: 1337x
    disabled: true

  - name: duden
    engine: duden
    shortcut: du
    disabled: true

  - name: seznam
    shortcut: szn
    engine: seznam
    disabled: true

  # - name: deepl
  #   engine: deepl
  #   shortcut: dpl
  #   # You can use the engine using the official stable API, but you need an API key
  #   # See: https://www.deepl.com/pro-api?cta=header-pro-api
  #   api_key: ''  # required!
  #   timeout: 5.0
  #   disabled: true

  - name: mojeek
    shortcut: mjk
    engine: xpath
    paging: true
    categories: [general, web]
    search_url: https://www.mojeek.com/search?q={query}&s={pageno}&lang={lang}&lb={lang}
    results_xpath: //ul[@class="results-standard"]/li/a[@class="ob"]
    url_xpath: ./@href
    title_xpath: ../h2/a
    content_xpath: ..//p[@class="s"]
    suggestion_xpath: //div[@class="top-info"]/p[@class="top-info spell"]/em/a
    first_page_num: 0
    page_size: 10
    max_page: 100
    disabled: true
    about:
      website: https://www.mojeek.com/
      wikidata_id: Q60747299
      official_api_documentation: https://www.mojeek.com/services/api.html/
      use_official_api: false
      require_api_key: false
      results: HTML

  - name: moviepilot
    engine: moviepilot
    shortcut: mp
    disabled: true

  - name: naver
    shortcut: nvr
    categories: [general, web]
    engine: xpath
    paging: true
    search_url: https://search.naver.com/search.naver?where=webkr&sm=osp_hty&ie=UTF-8&query={query}&start={pageno}
    url_xpath: //a[@class="link_tit"]/@href
    title_xpath: //a[@class="link_tit"]
    content_xpath: //a[@class="total_dsc"]/div
    first_page_num: 1
    page_size: 10
    disabled: true
    about:
      website: https://www.naver.com/
      wikidata_id: Q485639
      official_api_documentation: https://developers.naver.com/docs/nmt/examples/
      use_official_api: false
      require_api_key: false
      results: HTML
      language: ko

  - name: rubygems
    shortcut: rbg
    engine: xpath
    paging: true
    search_url: https://rubygems.org/search?page={pageno}&query={query}
    results_xpath: /html/body/main/div/a[@class="gems__gem"]
    url_xpath: ./@href
    title_xpath: ./span/h2
    content_xpath: ./span/p
    suggestion_xpath: /html/body/main/div/div[@class="search__suggestions"]/p/a
    first_page_num: 1
    categories: [it, packages]
    disabled: true
    about:
      website: https://rubygems.org/
      wikidata_id: Q1853420
      official_api_documentation: https://guides.rubygems.org/rubygems-org-api/
      use_official_api: false
      require_api_key: false
      results: HTML

  - name: peertube
    engine: peertube
    shortcut: ptb
    paging: true
    # alternatives see: https://instances.joinpeertube.org/instances
    # base_url: https://tube.4aem.com
    categories: videos
    disabled: true
    timeout: 6.0

  - name: mediathekviewweb
    engine: mediathekviewweb
    shortcut: mvw
    disabled: true

  - name: yacy
    engine: yacy
    categories: general
    search_type: text
    base_url: https://yacy.searchlab.eu
    shortcut: ya
    disabled: true
    # required if you aren't using HTTPS for your local yacy instance
    # https://docs.searxng.org/dev/engines/online/yacy.html
    # enable_http: true
    # timeout: 3.0
    # search_mode: 'global'

  - name: yacy images
    engine: yacy
    categories: images
    search_type: image
    base_url: https://yacy.searchlab.eu
    shortcut: yai
    disabled: true

  - name: rumble
    engine: rumble
    shortcut: ru
    base_url: https://rumble.com/
    paging: true
    categories: videos
    disabled: true

  - name: livespace
    engine: livespace
    shortcut: ls
    categories: videos
    disabled: true
    timeout: 5.0

  - name: wordnik
    engine: wordnik
    shortcut: def
    base_url: https://www.wordnik.com/
    categories: [dictionaries]
    timeout: 5.0

  - name: woxikon.de synonyme
    engine: xpath
    shortcut: woxi
    categories: [dictionaries]
    timeout: 5.0
    disabled: true
    search_url: https://synonyme.woxikon.de/synonyme/{query}.php
    url_xpath: //div[@class="upper-synonyms"]/a/@href
    content_xpath: //div[@class="synonyms-list-group"]
    title_xpath: //div[@class="upper-synonyms"]/a
    no_result_for_http_status: [404]
    about:
      website: https://www.woxikon.de/
      wikidata_id: # No Wikidata ID
      use_official_api: false
      require_api_key: false
      results: HTML
      language: de

  - name: seekr news
    engine: seekr
    shortcut: senews
    categories: news
    seekr_category: news
    disabled: true

  - name: seekr images
    engine: seekr
    network: seekr news
    shortcut: seimg
    categories: images
    seekr_category: images
    disabled: true

  - name: seekr videos
    engine: seekr
    network: seekr news
    shortcut: sevid
    categories: videos
    seekr_category: videos
    disabled: true

  - name: sjp.pwn
    engine: sjp
    shortcut: sjp
    base_url: https://sjp.pwn.pl/
    timeout: 5.0
    disabled: true

  - name: stract
    engine: stract
    shortcut: str
    disabled: true

  - name: svgrepo
    engine: svgrepo
    shortcut: svg
    timeout: 10.0
    disabled: true

  - name: tootfinder
    engine: tootfinder
    shortcut: toot

  - name: wallhaven
    engine: wallhaven
    # api_key: abcdefghijklmnopqrstuvwxyz
    shortcut: wh

    # wikimini: online encyclopedia for children
    # The fulltext and title parameter is necessary for Wikimini because
    # sometimes it will not show the results and redirect instead
  - name: wikimini
    engine: xpath
    shortcut: wkmn
    search_url: https://fr.wikimini.org/w/index.php?search={query}&title=Sp%C3%A9cial%3ASearch&fulltext=Search
    url_xpath: //li/div[@class="mw-search-result-heading"]/a/@href
    title_xpath: //li//div[@class="mw-search-result-heading"]/a
    content_xpath: //li/div[@class="searchresult"]
    categories: general
    disabled: true
    about:
      website: https://wikimini.org/
      wikidata_id: Q3568032
      use_official_api: false
      require_api_key: false
      results: HTML
      language: fr

  - name: wttr.in
    engine: wttr
    shortcut: wttr
    timeout: 9.0

  - name: yummly
    engine: yummly
    shortcut: yum
    disabled: true

  - name: brave
    engine: brave
    shortcut: br
    time_range_support: true
    paging: true
    categories: [general, web]
    brave_category: search
    # brave_spellcheck: true

  - name: brave.images
    engine: brave
    network: brave
    shortcut: brimg
    categories: [images, web]
    brave_category: images

  - name: brave.videos
    engine: brave
    network: brave
    shortcut: brvid
    categories: [videos, web]
    brave_category: videos

  - name: brave.news
    engine: brave
    network: brave
    shortcut: brnews
    categories: news
    brave_category: news

  # - name: brave.goggles
  #   engine: brave
  #   network: brave
  #   shortcut: brgog
  #   time_range_support: true
  #   paging: true
  #   categories: [general, web]
  #   brave_category: goggles
  #   Goggles: # required! This should be a URL ending in .goggle

  - name: lib.rs
    shortcut: lrs
    engine: xpath
    search_url: https://lib.rs/search?q={query}
    results_xpath: /html/body/main/div/ol/li/a
    url_xpath: ./@href
    title_xpath: ./div[@class="h"]/h4
    content_xpath: ./div[@class="h"]/p
    categories: [it, packages]
    disabled: true
    about:
      website: https://lib.rs
      wikidata_id: Q113486010
      use_official_api: false
      require_api_key: false
      results: HTML

  - name: sourcehut
    shortcut: srht
    engine: xpath
    paging: true
    search_url: https://sr.ht/projects?page={pageno}&search={query}
    results_xpath: (//div[@class="event-list"])[1]/div[@class="event"]
    url_xpath: ./h4/a[2]/@href
    title_xpath: ./h4/a[2]
    content_xpath: ./p
    first_page_num: 1
    categories: [it, repos]
    disabled: true
    about:
      website: https://sr.ht
      wikidata_id: Q78514485
      official_api_documentation: https://man.sr.ht/
      use_official_api: false
      require_api_key: false
      results: HTML

  - name: goo
    shortcut: goo
    engine: xpath
    paging: true
    search_url: https://search.goo.ne.jp/web.jsp?MT={query}&FR={pageno}0
    url_xpath: //div[@class="result"]/p[@class='title fsL1']/a/@href
    title_xpath: //div[@class="result"]/p[@class='title fsL1']/a
    content_xpath: //p[contains(@class,'url fsM')]/following-sibling::p
    first_page_num: 0
    categories: [general, web]
    disabled: true
    timeout: 4.0
    about:
      website: https://search.goo.ne.jp
      wikidata_id: Q249044
      use_official_api: false
      require_api_key: false
      results: HTML
      language: ja

  - name: bt4g
    engine: bt4g
    shortcut: bt4g

  - name: pkg.go.dev
    engine: xpath
    shortcut: pgo
    search_url: https://pkg.go.dev/search?limit=100&m=package&q={query}
    results_xpath: /html/body/main/div[contains(@class,"SearchResults")]/div[not(@class)]/div[@class="SearchSnippet"]
    url_xpath: ./div[@class="SearchSnippet-headerContainer"]/h2/a/@href
    title_xpath: ./div[@class="SearchSnippet-headerContainer"]/h2/a
    content_xpath: ./p[@class="SearchSnippet-synopsis"]
    categories: [packages, it]
    timeout: 3.0
    disabled: true
    about:
      website: https://pkg.go.dev/
      use_official_api: false
      require_api_key: false
      results: HTML

# Doku engine lets you access to any Doku wiki instance:
# A public one or a privete/corporate one.
#  - name: ubuntuwiki
#    engine: doku
#    shortcut: uw
#    base_url: 'https://doc.ubuntu-fr.org'

# Be careful when enabling this engine if you are
# running a public instance. Do not expose any sensitive
# information. You can restrict access by configuring a list
# of access tokens under tokens.
#  - name: git grep
#    engine: command
#    command: ['git', 'grep', '{{QUERY}}']
#    shortcut: gg
#    tokens: []
#    disabled: true
#    delimiter:
#        chars: ':'
#        keys: ['filepath', 'code']

# Be careful when enabling this engine if you are
# running a public instance. Do not expose any sensitive
# information. You can restrict access by configuring a list
# of access tokens under tokens.
#  - name: locate
#    engine: command
#    command: ['locate', '{{QUERY}}']
#    shortcut: loc
#    tokens: []
#    disabled: true
#    delimiter:
#        chars: ' '
#        keys: ['line']

# Be careful when enabling this engine if you are
# running a public instance. Do not expose any sensitive
# information. You can restrict access by configuring a list
# of access tokens under tokens.
#  - name: find
#    engine: command
#    command: ['find', '.', '-name', '{{QUERY}}']
#    query_type: path
#    shortcut: fnd
#    tokens: []
#    disabled: true
#    delimiter:
#        chars: ' '
#        keys: ['line']

# Be careful when enabling this engine if you are
# running a public instance. Do not expose any sensitive
# information. You can restrict access by configuring a list
# of access tokens under tokens.
#  - name: pattern search in files
#    engine: command
#    command: ['fgrep', '{{QUERY}}']
#    shortcut: fgr
#    tokens: []
#    disabled: true
#    delimiter:
#        chars: ' '
#        keys: ['line']

# Be careful when enabling this engine if you are
# running a public instance. Do not expose any sensitive
# information. You can restrict access by configuring a list
# of access tokens under tokens.
#  - name: regex search in files
#    engine: command
#    command: ['grep', '{{QUERY}}']
#    shortcut: gr
#    tokens: []
#    disabled: true
#    delimiter:
#        chars: ' '
#        keys: ['line']

doi_resolvers:
  oadoi.org: "https://oadoi.org/"
  doi.org: "https://doi.org/"
  doai.io: "https://dissem.in/"
  sci-hub.se: "https://sci-hub.se/"
  sci-hub.st: "https://sci-hub.st/"
  sci-hub.ru: "https://sci-hub.ru/"

default_doi_resolver: "oadoi.org"



================================================
FILE: kubernetes/apps/default/spoolman/ks.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/ishioni/CRDs-catalog/main/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app spoolman
  namespace: &namespace default
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  dependsOn:
    - name: cloudnative-pg-cluster
      namespace: database
  path: ./kubernetes/apps/default/spoolman/app
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: true
  interval: 30m
  timeout: 5m



================================================
FILE: kubernetes/apps/default/spoolman/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/helmrelease-helm-v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app spoolman
  namespace: default
spec:
  interval: 30m
  chartRef:
    kind: OCIRepository
    name: app-template

  values:
    controllers:
      spoolman:
        annotations:
          reloader.stakater.com/auto: "true"
        initContainers:
          init-db:
            image:
              repository: ghcr.io/onedr0p/postgres-init
              tag: 16
            envFrom:
              - secretRef:
                  name: spoolman-secret
        containers:
          app:
            image:
              repository: ghcr.io/donkie/spoolman
              tag: 0.22.1
            env:
              SPOOLMAN_DB_TYPE: postgres
              SPOOLMAN_DB_HOST:
                valueFrom:
                  secretKeyRef:
                    name: spoolman-secret
                    key: INIT_POSTGRES_HOST
              SPOOLMAN_DB_NAME:
                valueFrom:
                  secretKeyRef:
                    name: spoolman-secret
                    key: INIT_POSTGRES_DBNAME
              SPOOLMAN_DB_USERNAME:
                valueFrom:
                  secretKeyRef:
                    name: spoolman-secret
                    key: INIT_POSTGRES_USER
              SPOOLMAN_DB_PASSWORD:
                valueFrom:
                  secretKeyRef:
                    name: spoolman-secret
                    key: INIT_POSTGRES_PASS
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
                cpu: 25m
                memory: 500M

    service:
      app:
        controller: *app
        ports:
          http:
            port: 8000

    ingress:
      app:
        className: internal
        annotations:
          external-dns.alpha.kubernetes.io/target: "internal.${SECRET_DOMAIN}"
        hosts:
          - host: spoolman.${SECRET_DOMAIN}
            paths:
              - path: /
                pathType: Prefix
                service:
                  identifier: app
                  port: http



================================================
FILE: kubernetes/apps/default/spoolman/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/kustomization.json
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml
  - ./secret.sops.yaml



================================================
FILE: kubernetes/apps/default/spoolman/app/secret.sops.yaml
================================================
apiVersion: v1
kind: Secret
metadata:
    name: spoolman-secret
    namespace: default
stringData:
    INIT_POSTGRES_DBNAME: ENC[AES256_GCM,data:10oMF0zrsvI=,iv:0ggkCSPuk+ewPN7Z1NfSjbMqgt+QF6qS/VS6c4uE8ZM=,tag:0zjfTWZv4C1i3JbPUdgbuw==,type:str]
    INIT_POSTGRES_HOST: ENC[AES256_GCM,data:SPH6mAB8o6ELFHm+bGMRKSiC8ULQefTLoS+rLlsqIboBCoUolMdPVA==,iv:ynYP1Oam6pZM0L2fmmWxxx+84RwEfFvfTMuyqk5R8TY=,tag:qd39Lp8ITWcrNVgpVeLwvg==,type:str]
    INIT_POSTGRES_USER: ENC[AES256_GCM,data:i6aLJVxKUzg=,iv:gh8Vs2O3suIIUsXrEQ+3QnmzTdVOwABh2E8rVzfneeA=,tag:QYrveLEox1VVd9HqEhgUGA==,type:str]
    INIT_POSTGRES_PASS: ENC[AES256_GCM,data:s8Eu6IhcH3U=,iv:T6UMnMuIwOtU28oYsrGcfLWF7oK9hXfz9WYNJoY4K78=,tag:nZ/lmsajKKrkRzAcDyp5FQ==,type:str]
    INIT_POSTGRES_SUPER_PASS: ENC[AES256_GCM,data:9Gv6aPx+p4w=,iv:ImBWnntn8ZCi8Zy8BKJX21+VCni7RgymQ8z4IzSJnkY=,tag:XhFWcxQjLHUZ1qAKJI87+g==,type:str]
sops:
    kms: []
    gcp_kms: []
    azure_kv: []
    hc_vault: []
    age:
        - recipient: age12gul5m0dg9nn2gk69uvzwdxyluh5xt02m8wvyg9hn7c93nz7xehswmdenq
          enc: |
            -----BEGIN AGE ENCRYPTED FILE-----
            YWdlLWVuY3J5cHRpb24ub3JnL3YxCi0+IFgyNTUxOSBlTzBGdlFydDNoZ2o5QlR1
            Y2N4eGhYT3ZQQmo4ZnVTSDlZbTRNOU9tdm1rCll0YVpBaXVsVThHc1ZENWkwbnBN
            OEZLOExIS05qcm0yRzc4UER1OFBSaTgKLS0tIDhMSzU4ci8rNldqdjRBVUdSd0c5
            bVY0ZjdKUlhXUTlsVUlaTks2S0FYUW8KVpTp2aFV8VcIs4UV6rD8wxngoawV6kk2
            Ax2W2FVikNQzYxgM5gVnM22xGnC50Cx1kSEZoI6DPF1RC3r8fW6wPA==
            -----END AGE ENCRYPTED FILE-----
    lastmodified: "2025-01-12T15:40:48Z"
    mac: ENC[AES256_GCM,data:+DnaPKwO2hSB3F26wClFSV8527tzGFUzR35dTlzgTmM8Sv+nDhIflpGNwNGQEgNRrBMxs+RHmCT9gQgpsVnEfGUml4f39R8RSssLfnhfunOxt6SGb1zvETEaPgxu5yShM18RgUL/8hPFeXd11UdhVNJmGDN7kMyEepuG4LsH2xE=,iv:px36HlWLlWnnagSYI6KSuVvOiBcOsX4lUxCDWQoHhe8=,tag:o0GkG1da3CUjSTpk+VzOQA==,type:str]
    pgp: []
    encrypted_regex: ^(data|stringData)$
    version: 3.9.3



================================================
FILE: kubernetes/apps/flux-system/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: flux-system
components:
  - ../../components/common
resources:
  - ./capacitor/ks.yaml
  - ./flux-instance/ks.yaml
  - ./flux-operator/ks.yaml



================================================
FILE: kubernetes/apps/flux-system/capacitor/ks.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app flux-addons
  namespace: &namespace flux-system
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  path: ./kubernetes/apps/flux-system/capacitor/app
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: false
  interval: 30m
  timeout: 5m



================================================
FILE: kubernetes/apps/flux-system/capacitor/app/helmrelease.yaml
================================================
---
## yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/ocirepository-source-v1beta2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app capacitor
spec:
  interval: 30m
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: 3
  upgrade:
    cleanupOnFail: true
    remediation:
      strategy: rollback
      retries: 3
  uninstall:
    keepHistory: false
  values:
    controllers:
      capacitor:
        strategy: RollingUpdate
        containers:
          app:
            image:
              repository: ghcr.io/gimlet-io/capacitor
              tag: v0.4.8@sha256:c999a42cccc523b91086547f890466d09be4755bf05a52763b0d14594bf60782
            resources:
              requests:
                cpu: 50m
                memory: 100Mi
                ephemeral-storage: 1Gi
              limits:
                memory: 2Gi
                ephemeral-storage: 2Gi

    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 568
        runAsGroup: 568
        seccompProfile: { type: RuntimeDefault }

    serviceAccount:
      create: true
      name: "capacitor"

    service:
      app:
        controller: *app
        ports:
          http:
            enabled: true
            port: 9000

    ingress:
      app:
        enabled: true
        className: internal
        annotations:
          external-dns.alpha.kubernetes.io/target: "internal.${SECRET_DOMAIN}"
        hosts:
          - host: "capacitor.${SECRET_DOMAIN}"
            paths:
              - path: /
                service:
                  identifier: app
                  port: http



================================================
FILE: kubernetes/apps/flux-system/capacitor/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml
  - ./rbac.yaml



================================================
FILE: kubernetes/apps/flux-system/capacitor/app/rbac.yaml
================================================
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: capacitor
rules:
  - apiGroups:
      - networking.k8s.io
      - apps
      - ""
    resources:
      - pods
      - pods/log
      - ingresses
      - deployments
      - services
      - secrets
      - events
      - configmaps
    verbs:
      - get
      - watch
      - list
  - apiGroups:
      - source.toolkit.fluxcd.io
      - kustomize.toolkit.fluxcd.io
      - helm.toolkit.fluxcd.io
      - infra.contrib.fluxcd.io
    resources:
      - gitrepositories
      - helmrepositories
      - helmcharts
      - ocirepositories
      - buckets
      - terraforms
      - kustomizations
      - helmreleases
    verbs:
      - get
      - watch
      - list
      - patch # to allow force reconciling by adding an annotation
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: capacitor
subjects:
  - kind: ServiceAccount
    name: capacitor
    namespace: flux-system
roleRef:
  kind: ClusterRole
  name: capacitor
  apiGroup: rbac.authorization.k8s.io



================================================
FILE: kubernetes/apps/flux-system/flux-instance/ks.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/kustomization-kustomize-v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app flux-instance
  namespace: &namespace flux-system
spec:
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  dependsOn:
    - name: flux-operator
      namespace: *namespace
  interval: 1h
  path: ./kubernetes/apps/flux-system/flux-instance/app
  postBuild:
    substituteFrom:
      - name: cluster-secrets
        kind: Secret
  prune: true
  retryInterval: 2m
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  targetNamespace: *namespace
  timeout: 5m
  wait: false



================================================
FILE: kubernetes/apps/flux-system/flux-instance/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/ocirepository-source-v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: flux-instance
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 0.20.0
  url: oci://ghcr.io/controlplaneio-fluxcd/charts/flux-instance
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/helmrelease-helm-v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: flux-instance
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: flux-instance
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      strategy: rollback
      retries: 3
  dependsOn:
    - name: flux-operator
      namespace: flux-system
  valuesFrom:
    - kind: ConfigMap
      name: flux-instance-values



================================================
FILE: kubernetes/apps/flux-system/flux-instance/app/ingress.yaml
================================================
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: flux-webhook
  annotations:
    external-dns.alpha.kubernetes.io/target: "external.${SECRET_DOMAIN}"
spec:
  ingressClassName: external
  rules:
    - host: "flux-webhook.${SECRET_DOMAIN}"
      http:
        paths:
          - path: /hook/
            pathType: Prefix
            backend:
              service:
                name: webhook-receiver
                port:
                  number: 80



================================================
FILE: kubernetes/apps/flux-system/flux-instance/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml
  - ./secret.sops.yaml
  - ./ingress.yaml
  - ./receiver.yaml
configMapGenerator:
  - name: flux-instance-values
    files:
      - values.yaml=./helm/values.yaml
configurations:
  - ./helm/kustomizeconfig.yaml



================================================
FILE: kubernetes/apps/flux-system/flux-instance/app/receiver.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/receiver-notification-v1.json
apiVersion: notification.toolkit.fluxcd.io/v1
kind: Receiver
metadata:
  name: github-webhook
spec:
  type: github
  events: ["ping", "push"]
  secretRef:
    name: github-webhook-token-secret
  resources:
    - apiVersion: source.toolkit.fluxcd.io/v1
      kind: GitRepository
      name: flux-system
      namespace: flux-system
    - apiVersion: kustomize.toolkit.fluxcd.io/v1
      kind: Kustomization
      name: flux-system
      namespace: flux-system



================================================
FILE: kubernetes/apps/flux-system/flux-instance/app/secret.sops.yaml
================================================
# yaml-language-server: $schema=https://kubernetesjsonschema.dev/v1.18.1-standalone-strict/secret-v1.json
apiVersion: v1
kind: Secret
metadata:
  name: github-webhook-token-secret
stringData:
  token: ENC[AES256_GCM,data:UM1E3U0oNy5V3Y0KB3NWJZ8cvK7eLaTW5AgZRIKQWwU=,iv:qOTIampY29UXnLWvRHnhAGUJVEiljN73elkhBCpnEho=,tag:fxNmAshpQm/s84PWad6bYw==,type:str]
sops:
  age:
    - recipient: age12gul5m0dg9nn2gk69uvzwdxyluh5xt02m8wvyg9hn7c93nz7xehswmdenq
      enc: |
        -----BEGIN AGE ENCRYPTED FILE-----
        YWdlLWVuY3J5cHRpb24ub3JnL3YxCi0+IFgyNTUxOSA2THdCUkVSM052Y1VGb2ti
        T3haM2xQb05RdDdWR3pNd1F4bTY1RS9MSVVJCksrTnFHN0syKzhMajNtZ3FvQWEz
        b29FL0o1dENGbGtTaWY0Q1UxVEVuTVUKLS0tIENRVWtBNllwU1kzT2JVcSsvRGxi
        ZEg5NVFOUFBpT3UyaFc4cm5NNm9CTzgKKn3QrlmsbfXWha2gL5D5Wc4eSYCSjo8B
        swR6vtrqgbMF5+Qiwvd+Wzfh7zzPyfOQj/NAE3q3e8cfrMJHioIoMw==
        -----END AGE ENCRYPTED FILE-----
  lastmodified: "2025-05-03T13:31:13Z"
  mac: ENC[AES256_GCM,data:D4OTA085YFFI4TIMgUux5O2eV3dh3mR454KN/FsgmaiCeI+YBgWSkCEq+8vwjmTHHv98O5/4XX4kfydeBTPJsWlCv143YeXOLZlbe9bKHnjtRSuH+ilG/fgdCZjdcYpgaA3G3cam68kX5dzyGucQSUnMR6bCroqVOvfbNfszSYo=,iv:O1dt63O7xlLVAaXAa0Fm4z+oRhTxUiQEWH+XGI/llLw=,tag:a4IRyVyiuiE7kRk9Z1zGrA==,type:str]
  encrypted_regex: ^(data|stringData)$
  mac_only_encrypted: true
  version: 3.10.2



================================================
FILE: kubernetes/apps/flux-system/flux-instance/app/helm/kustomizeconfig.yaml
================================================
---
nameReference:
  - kind: ConfigMap
    version: v1
    fieldSpecs:
      - path: spec/valuesFrom/name
        kind: HelmRelease



================================================
FILE: kubernetes/apps/flux-system/flux-instance/app/helm/values.yaml
================================================
---
instance:
  distribution:
    # renovate: datasource=github-releases depName=controlplaneio-fluxcd/distribution
    version: 2.5.1
  cluster:
    networkPolicy: false
  components:
    - source-controller
    - kustomize-controller
    - helm-controller
    - notification-controller
  sync:
    kind: GitRepository
    url: "https://github.com/tanguille/cluster.git"
    ref: "refs/heads/main"
    path: kubernetes/flux/cluster



================================================
FILE: kubernetes/apps/flux-system/flux-operator/ks.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/kustomization-kustomize-v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app flux-operator
  namespace: &namespace flux-system
spec:
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  healthChecks:
    - apiVersion: helm.toolkit.fluxcd.io/v2
      kind: HelmRelease
      name: *app
      namespace: *namespace
  interval: 1h
  path: ./kubernetes/apps/flux-system/flux-operator/app
  postBuild:
    substituteFrom:
      - name: cluster-secrets
        kind: Secret
  prune: true
  retryInterval: 2m
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  targetNamespace: *namespace
  timeout: 5m
  wait: false



================================================
FILE: kubernetes/apps/flux-system/flux-operator/app/helm-values.yaml
================================================
---
serviceMonitor:
  create: true



================================================
FILE: kubernetes/apps/flux-system/flux-operator/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/ocirepository-source-v1beta2.json
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
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/helmrelease-helm-v2.json
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
      strategy: rollback
      retries: 3
  valuesFrom:
    - kind: ConfigMap
      name: flux-operator-values



================================================
FILE: kubernetes/apps/flux-system/flux-operator/app/kustomization.yaml
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
FILE: kubernetes/apps/flux-system/flux-operator/app/kustomizeconfig.yaml
================================================
---
nameReference:
  - kind: ConfigMap
    version: v1
    fieldSpecs:
      - path: spec/valuesFrom/name
        kind: HelmRelease



================================================
FILE: kubernetes/apps/flux-system/flux-operator/app/helm/kustomizeconfig.yaml
================================================
---
nameReference:
  - kind: ConfigMap
    version: v1
    fieldSpecs:
      - path: spec/valuesFrom/name
        kind: HelmRelease



================================================
FILE: kubernetes/apps/flux-system/flux-operator/app/helm/values.yaml
================================================
---
serviceMonitor:
  create: true



================================================
FILE: kubernetes/apps/flux-system/flux-operator/instance/helm-values.yaml
================================================
---
instance:
  cluster:
    networkPolicy: false
  components:
    - source-controller
    - kustomize-controller
    - helm-controller
    - notification-controller
  sync:
    kind: GitRepository
    name: flux-system
    url: "ssh://git@github.com/Tanguille/cluster"
    ref: refs/heads/main
    path: kubernetes/flux/cluster
    pullSecret: github-deploy-key
  kustomize:
    patches:
      # Increase the number of workers and limits
      # Ref: https://fluxcd.io/flux/installation/configuration/vertical-scaling/#increase-the-number-of-workers-and-limits
      - patch: |
          - op: add
            path: /spec/template/spec/containers/0/args/-
            value: --concurrent=10
          - op: add
            path: /spec/template/spec/containers/0/args/-
            value: --requeue-dependency=5s
        target:
          kind: Deployment
          name: (kustomize-controller|helm-controller|source-controller)
      - patch: |
          apiVersion: apps/v1
          kind: Deployment
          metadata:
            name: all
          spec:
            template:
              spec:
                containers:
                  - name: manager
                    resources:
                      limits:
                        memory: 4Gi
        target:
          kind: Deployment
          name: (kustomize-controller|helm-controller|source-controller)
      # Enable in-memory kustomize builds
      # Ref: https://fluxcd.io/flux/installation/configuration/vertical-scaling/#enable-in-memory-kustomize-builds
      - patch: |
          - op: add
            path: /spec/template/spec/containers/0/args/-
            value: --concurrent=20
          - op: replace
            path: /spec/template/spec/volumes/0
            value:
              name: temp
              emptyDir:
                medium: Memory
        target:
          kind: Deployment
          name: kustomize-controller
      # Enable Helm repositories caching
      # Ref: https://fluxcd.io/flux/installation/configuration/vertical-scaling/#enable-helm-repositories-caching
      - patch: |
          - op: add
            path: /spec/template/spec/containers/0/args/-
            value: --helm-cache-max-size=10
          - op: add
            path: /spec/template/spec/containers/0/args/-
            value: --helm-cache-ttl=60m
          - op: add
            path: /spec/template/spec/containers/0/args/-
            value: --helm-cache-purge-interval=5m
        target:
          kind: Deployment
          name: source-controller
      # Flux near OOM detection for Helm
      # Ref: https://fluxcd.io/flux/installation/configuration/helm-oom-detection/
      - patch: |
          - op: add
            path: /spec/template/spec/containers/0/args/-
            value: --feature-gates=OOMWatch=true
          - op: add
            path: /spec/template/spec/containers/0/args/-
            value: --oom-watch-memory-threshold=95
          - op: add
            path: /spec/template/spec/containers/0/args/-
            value: --oom-watch-interval=500ms
        target:
          kind: Deployment
          name: helm-controller



================================================
FILE: kubernetes/apps/flux-system/flux-operator/instance/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: flux-instance
spec:
  interval: 30m
  chart:
    spec:
      chart: flux-instance
      version: 0.20.0
      sourceRef:
        kind: HelmRepository
        name: controlplaneio
        namespace: flux-system
  install:
    remediation:
      retries: 3
  upgrade:
    cleanupOnFail: true
    remediation:
      strategy: rollback
      retries: 3
  valuesFrom:
    - kind: ConfigMap
      name: flux-instance-helm-values



================================================
FILE: kubernetes/apps/flux-system/flux-operator/instance/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./github
  - ./helmrelease.yaml
  - ./prometheusrule.yaml
configMapGenerator:
  - name: flux-instance-helm-values
    files:
      - values.yaml=./helm-values.yaml
configurations:
  - kustomizeconfig.yaml



================================================
FILE: kubernetes/apps/flux-system/flux-operator/instance/kustomizeconfig.yaml
================================================
---
nameReference:
  - kind: ConfigMap
    version: v1
    fieldSpecs:
      - path: spec/valuesFrom/name
        kind: HelmRelease



================================================
FILE: kubernetes/apps/flux-system/flux-operator/instance/prometheusrule.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/monitoring.coreos.com/prometheusrule_v1.json
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: flux-rules
  namespace: flux-system
spec:
  groups:
    - name: flux.rules
      rules:
        - alert: FluxComponentAbsent
          annotations:
            summary: Flux component has disappeared from Prometheus target discovery.
          expr: |
            absent(up{job=~".*flux-system.*"} == 1)
          for: 15m
          labels:
            severity: critical
        - alert: FluxReconciliationFailure
          annotations:
            summary: >-
              {{ $labels.kind }} {{ $labels.namespace }}/{{ $labels.name }} reconciliation
              has been failing for more than 15 minutes.
          expr: |
            max(gotk_reconcile_condition{status="False",type="Ready"}) by (namespace, name, kind)
              +
            on(namespace, name, kind) (max(gotk_reconcile_condition{status="Deleted"})
              by (namespace, name, kind)) * 2 == 1
          for: 15m
          labels:
            severity: critical



================================================
FILE: kubernetes/apps/flux-system/flux-operator/instance/github/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./webhooks



================================================
FILE: kubernetes/apps/flux-system/flux-operator/instance/github/webhooks/ingress.yaml
================================================
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: flux-webhook
  annotations:
    external-dns.alpha.kubernetes.io/target: "external.${SECRET_DOMAIN}"
spec:
  ingressClassName: external
  rules:
    - host: "flux-webhook.${SECRET_DOMAIN}"
      http:
        paths:
          - path: /hook/
            pathType: Prefix
            backend:
              service:
                name: webhook-receiver
                port:
                  number: 80



================================================
FILE: kubernetes/apps/flux-system/flux-operator/instance/github/webhooks/kustomization.yaml
================================================
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - receiver.yaml
  - ingress.yaml
  - secret.sops.yaml



================================================
FILE: kubernetes/apps/flux-system/flux-operator/instance/github/webhooks/receiver.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/receiver-notification-v1.json
apiVersion: notification.toolkit.fluxcd.io/v1
kind: Receiver
metadata:
  name: github-webhook
spec:
  type: github
  events: ["ping", "push"]
  secretRef:
    name: github-webhook-token-secret
  resources:
    - apiVersion: source.toolkit.fluxcd.io/v1
      kind: GitRepository
      name: flux-system
      namespace: flux-system
    - apiVersion: kustomize.toolkit.fluxcd.io/v1
      kind: Kustomization
      name: flux-system
      namespace: flux-system



================================================
FILE: kubernetes/apps/flux-system/flux-operator/instance/github/webhooks/secret.sops.yaml
================================================
apiVersion: v1
kind: Secret
metadata:
    name: github-webhook-token-secret
stringData:
    token: ENC[AES256_GCM,data:DeAlH4nWm98kmuhBkVgGVU4yVtSymaUTJZquyODjIls=,iv:IRABcfwSFMznO2TP/RseWFRVRodOs3dPzW+sam2BS0s=,tag:GHZbTwDbcV6qkhzWWLzDcw==,type:str]
sops:
    kms: []
    gcp_kms: []
    azure_kv: []
    hc_vault: []
    age:
        - recipient: age12gul5m0dg9nn2gk69uvzwdxyluh5xt02m8wvyg9hn7c93nz7xehswmdenq
          enc: |
            -----BEGIN AGE ENCRYPTED FILE-----
            YWdlLWVuY3J5cHRpb24ub3JnL3YxCi0+IFgyNTUxOSBsbEphdFNLNHRkNnpHZnA5
            S2dSSDdLOUpVelhQcVllS0ZWNXZTVGhxS25NCnNldHE1Szg5c1NwZEt6UW9XWmZk
            WlByMExLZFVPT0M2bTBaMUFUT1UwOTAKLS0tIEJEejZoWC9EV2tjNHZWbzB5OXd0
            bG1qRjNCTk5WcDhsUHUzcXhkZ2FqZmcKFl8k70RWfFUbgYJ5gTFhC/3dtie5bJ2R
            +5uh20RrV8SN5NpBfE5a+fe/b6FcOD8xd1JHMSfUAzXUI3dXW1rkWQ==
            -----END AGE ENCRYPTED FILE-----
    lastmodified: "2024-10-06T09:55:38Z"
    mac: ENC[AES256_GCM,data:4Q5olAUFkK0kmCWJ9S9FJOdeGfktnnQfiBpKuDMK1KxXJ4eCXHArdp+yNb8itSSqxAEmmt8iWGVLgjKdjj6nXltxSPypBjIIUkCGZZA8X3veqB0IkA+csqZLg3nYwwDPgCAB2PKbYGc9cqPfHCIycewFmdkQ79v7ulGYmsSBNYs=,iv:bUmTyupUE94IstYb9d9G+YqzrxdVcOfG9jPbO7K79v0=,tag:WxPw7JV9G5VLu5KMmEl/dA==,type:str]
    pgp: []
    encrypted_regex: ^(data|stringData)$
    version: 3.9.0



================================================
FILE: kubernetes/apps/kube-system/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: kube-system
components:
  - ../../components/common
resources:
  - ./cilium/ks.yaml
  - ./coredns/ks.yaml
  - ./metrics-server/ks.yaml
  - ./node-feature-discovery/ks.yaml
  - ./nvidia-plugin/ks.yaml
  - ./reloader/ks.yaml
  - ./snapshot-controller/ks.yaml



================================================
FILE: kubernetes/apps/kube-system/cilium/ks.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/kustomization-kustomize-v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app cilium
  namespace: &namespace kube-system
spec:
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  interval: 1h
  path: ./kubernetes/apps/kube-system/cilium/app
  postBuild:
    substituteFrom:
      - name: cluster-secrets
        kind: Secret
  prune: true
  retryInterval: 2m
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  targetNamespace: *namespace
  timeout: 5m
  wait: false



================================================
FILE: kubernetes/apps/kube-system/cilium/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/helmrepository-source-v1.json
apiVersion: source.toolkit.fluxcd.io/v1
kind: HelmRepository
metadata:
  name: cilium
  namespace: kube-system # Required for Renovate lookups
spec:
  interval: 1h
  url: https://helm.cilium.io
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/helmrelease-helm-v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: cilium
spec:
  interval: 1h
  chart:
    spec:
      chart: cilium
      version: 1.17.3
      sourceRef:
        kind: HelmRepository
        name: cilium
        namespace: kube-system
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  valuesFrom:
    - kind: ConfigMap
      name: cilium-values
  values:
    operator:
      tolerations: []



================================================
FILE: kubernetes/apps/kube-system/cilium/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml
  - ./networks.yaml
configMapGenerator:
  - name: cilium-values
    files:
      - values.yaml=./helm/values.yaml
configurations:
  - ./helm/kustomizeconfig.yaml



================================================
FILE: kubernetes/apps/kube-system/cilium/app/kustomizeconfig.yaml
================================================
---
nameReference:
  - kind: ConfigMap
    version: v1
    fieldSpecs:
      - path: spec/valuesFrom/name
        kind: HelmRelease



================================================
FILE: kubernetes/apps/kube-system/cilium/app/networks.yaml
================================================
---
# yaml-language-server: $schema=https://datreeio.github.io/CRDs-catalog/cilium.io/ciliumloadbalancerippool_v2alpha1.json
apiVersion: cilium.io/v2alpha1
kind: CiliumLoadBalancerIPPool
metadata:
  name: pool
spec:
  allowFirstLastIPs: "No"
  blocks:
    - cidr: "192.168.0.0/24"
---
# yaml-language-server: $schema=https://datreeio.github.io/CRDs-catalog/cilium.io/ciliuml2announcementpolicy_v2alpha1.json
apiVersion: cilium.io/v2alpha1
kind: CiliumL2AnnouncementPolicy
metadata:
  name: l2-policy
spec:
  loadBalancerIPs: true
  # NOTE: interfaces might need to be set if you have more than one active NIC on your hosts
  # interfaces:
  #   - ^eno[0-9]+
  #   - ^eth[0-9]+
  nodeSelector:
    matchLabels:
      kubernetes.io/os: linux



================================================
FILE: kubernetes/apps/kube-system/cilium/app/helm/kustomizeconfig.yaml
================================================
---
nameReference:
  - kind: ConfigMap
    version: v1
    fieldSpecs:
      - path: spec/valuesFrom/name
        kind: HelmRelease



================================================
FILE: kubernetes/apps/kube-system/cilium/app/helm/values.yaml
================================================
---
autoDirectNodeRoutes: true
bpf:
  masquerade: true
  # Ref: https://github.com/siderolabs/talos/issues/10002
  hostLegacyRouting: true
cni:
  # Required for pairing with Multus CNI
  exclusive: false
cgroup:
  automount:
    enabled: false
  hostRoot: /sys/fs/cgroup
# NOTE: devices might need to be set if you have more than one active NIC on your hosts
# devices: eno+ eth+
endpointRoutes:
  enabled: true
envoy:
  enabled: false
dashboards:
  enabled: true
hubble:
  enabled: false
ipam:
  mode: kubernetes
ipv4NativeRoutingCIDR: "10.42.0.0/16"
k8sServiceHost: 127.0.0.1
k8sServicePort: 7445
kubeProxyReplacement: true
kubeProxyReplacementHealthzBindAddr: 0.0.0.0:10256
l2announcements:
  enabled: true
loadBalancer:
  algorithm: maglev
  mode: "dsr"
localRedirectPolicy: true
operator:
  dashboards:
    enabled: true
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
socketLB:
  hostNamespaceOnly: true



================================================
FILE: kubernetes/apps/kube-system/coredns/ks.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/kustomization-kustomize-v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app coredns
  namespace: &namespace kube-system
spec:
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  interval: 1h
  path: ./kubernetes/apps/kube-system/coredns/app
  postBuild:
    substituteFrom:
      - name: cluster-secrets
        kind: Secret
  prune: true
  retryInterval: 2m
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  targetNamespace: *namespace
  timeout: 5m
  wait: false



================================================
FILE: kubernetes/apps/kube-system/coredns/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/ocirepository-source-v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: coredns
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  url: oci://ghcr.io/coredns/charts/coredns
  ref:
    tag: 1.42.1
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/helmrelease-helm-v2.json
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
      strategy: rollback
      retries: 3
  valuesFrom:
    - kind: ConfigMap
      name: coredns-values



================================================
FILE: kubernetes/apps/kube-system/coredns/app/kustomization.yaml
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
FILE: kubernetes/apps/kube-system/coredns/app/kustomizeconfig.yaml
================================================
---
nameReference:
  - kind: ConfigMap
    version: v1
    fieldSpecs:
      - path: spec/valuesFrom/name
        kind: HelmRelease



================================================
FILE: kubernetes/apps/kube-system/coredns/app/helm/kustomizeconfig.yaml
================================================
---
nameReference:
  - kind: ConfigMap
    version: v1
    fieldSpecs:
      - path: spec/valuesFrom/name
        kind: HelmRelease



================================================
FILE: kubernetes/apps/kube-system/coredns/app/helm/values.yaml
================================================
---
fullnameOverride: coredns
image:
  repository: mirror.gcr.io/coredns/coredns
k8sAppLabelOverride: kube-dns
serviceAccount:
  create: true
service:
  name: kube-dns
  clusterIP: "10.43.0.10"
replicaCount: 2
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
      - name: log
        configBlock: |-
          class error
      - name: prometheus
        parameters: 0.0.0.0:9153
      - name: kubernetes
        parameters: cluster.local in-addr.arpa ip6.arpa
        configBlock: |-
          pods insecure
          fallthrough in-addr.arpa ip6.arpa
      - name: forward
        parameters: . /etc/resolv.conf
      - name: cache
        parameters: 30
      - name: loop
      - name: reload
      - name: loadbalance
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
FILE: kubernetes/apps/kube-system/kubelet-csr-approver/app/helm-values.yaml
================================================
---
providerRegex: ^(control-1)$
bypassDnsResolution: true



================================================
FILE: kubernetes/apps/kube-system/kubelet-csr-approver/app/kustomizeconfig.yaml
================================================
---
nameReference:
  - kind: ConfigMap
    version: v1
    fieldSpecs:
      - path: spec/valuesFrom/name
        kind: HelmRelease



================================================
FILE: kubernetes/apps/kube-system/metrics-server/ks.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/kustomization-kustomize-v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app metrics-server
  namespace: &namespace kube-system
spec:
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  interval: 1h
  path: ./kubernetes/apps/kube-system/metrics-server/app
  postBuild:
    substituteFrom:
      - name: cluster-secrets
        kind: Secret
  prune: true
  retryInterval: 2m
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  targetNamespace: *namespace
  timeout: 5m
  wait: false



================================================
FILE: kubernetes/apps/kube-system/metrics-server/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/helmrepository-source-v1.json
apiVersion: source.toolkit.fluxcd.io/v1
kind: HelmRepository
metadata:
  name: metrics-server
  namespace: kube-system # Required for Renovate lookups
spec:
  interval: 1h
  url: https://kubernetes-sigs.github.io/metrics-server
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/helmrelease-helm-v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: metrics-server
spec:
  interval: 1h
  chart:
    spec:
      chart: metrics-server
      version: 3.12.2
      sourceRef:
        kind: HelmRepository
        name: metrics-server
        namespace: kube-system
  install:
    remediation:
      retries: -1
  upgrade:
    cleanupOnFail: true
    remediation:
      retries: 3
  values:
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
FILE: kubernetes/apps/kube-system/metrics-server/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/kube-system/node-feature-discovery/ks.yaml
================================================
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app node-feature-discovery
  namespace: &namespace kube-system
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  path: ./kubernetes/apps/kube-system/node-feature-discovery/app
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: false
  interval: 30m
  retryInterval: 1m
  timeout: 5m



================================================
FILE: kubernetes/apps/kube-system/node-feature-discovery/app/helmrelease.yaml
================================================
---
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: node-feature-discovery
  namespace: kube-system
spec:
  interval: 30m
  chart:
    spec:
      chart: node-feature-discovery
      version: 0.17.3
      sourceRef:
        kind: HelmRepository
        name: node-feature-discovery
        namespace: flux-system
  values:
    worker:
      config:
        sources:
          sources: ["pci", "system", "usb"]
        prometheus:
          enable: true



================================================
FILE: kubernetes/apps/kube-system/node-feature-discovery/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/kube-system/nvidia-plugin/ks.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app nvidia-plugin
  namespace: &namespace kube-system
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  path: ./kubernetes/apps/kube-system/nvidia-plugin/app
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: false
  interval: 30m
  timeout: 5m



================================================
FILE: kubernetes/apps/kube-system/nvidia-plugin/app/class.yaml
================================================
---
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: nvidia
handler: nvidia



================================================
FILE: kubernetes/apps/kube-system/nvidia-plugin/app/helmrelease.yaml
================================================
---
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: nvidia-device-plugin
  namespace: kube-system
spec:
  interval: 15m
  chart:
    spec:
      chart: nvidia-device-plugin
      version: 0.17.1
      sourceRef:
        kind: HelmRepository
        name: nvidia-dvp
        namespace: flux-system
  install:
    remediation:
      retries: 3
  upgrade:
    cleanupOnFail: true
    remediation:
      strategy: rollback
      retries: 3
  values:
    image:
      repository: nvcr.io/nvidia/k8s-device-plugin
      tag: v0.17.2
    runtimeClassName: nvidia
    affinity:
      nodeAffinity:
        requiredDuringSchedulingIgnoredDuringExecution:
          nodeSelectorTerms:
            - matchExpressions:
                - key: feature.node.kubernetes.io/pci-0300_10de.present
                  operator: In
                  values:
                    - "true"
    config:
      map:
        default: |-
          version: v1
          sharing:
            timeSlicing:
              renameByDefault: false
              resources:
                - name: nvidia.com/gpu
                  replicas: 4



================================================
FILE: kubernetes/apps/kube-system/nvidia-plugin/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./class.yaml
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/kube-system/reloader/ks.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/kustomization-kustomize-v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app reloader
  namespace: &namespace kube-system
spec:
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  interval: 1h
  path: ./kubernetes/apps/kube-system/reloader/app
  postBuild:
    substituteFrom:
      - name: cluster-secrets
        kind: Secret
  prune: true
  retryInterval: 2m
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  targetNamespace: *namespace
  timeout: 5m
  wait: false



================================================
FILE: kubernetes/apps/kube-system/reloader/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/ocirepository-source-v1beta2.json
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
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/helmrelease-helm-v2.json
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
FILE: kubernetes/apps/kube-system/reloader/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/kube-system/snapshot-controller/ks.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app snapshot-controller
  namespace: &namespace kube-system
spec:
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  healthChecks:
    - apiVersion: helm.toolkit.fluxcd.io/v2
      kind: HelmRelease
      name: snapshot-controller
      namespace: *namespace
  interval: 1h
  path: ./kubernetes/apps/kube-system/snapshot-controller/app
  prune: true
  retryInterval: 2m
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  targetNamespace: *namespace
  timeout: 5m



================================================
FILE: kubernetes/apps/kube-system/snapshot-controller/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/source.toolkit.fluxcd.io/ocirepository_v1beta2.json
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: OCIRepository
metadata:
  name: snapshot-controller
spec:
  interval: 5m
  layerSelector:
    mediaType: application/vnd.cncf.helm.chart.content.v1.tar+gzip
    operation: copy
  ref:
    tag: 4.0.2
  url: oci://ghcr.io/piraeusdatastore/helm-charts/snapshot-controller
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/helm.toolkit.fluxcd.io/helmrelease_v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: snapshot-controller
spec:
  interval: 1h
  chartRef:
    kind: OCIRepository
    name: snapshot-controller
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
    controller:
      replicaCount: 2
      serviceMonitor:
        create: true



================================================
FILE: kubernetes/apps/kube-system/snapshot-controller/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/media/kustomization.yaml
================================================
---
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: media
components:
  - ../../components/common
resources:
  - ./bazarr/ks.yaml
  - ./cross-seed/ks.yaml
  - ./fileflows/ks.yaml
  - ./flaresolverr/ks.yaml
  - ./jellyfin/ks.yaml
  - ./jellyseerr/ks.yaml
  - ./jellystat/ks.yaml
  - ./prowlarr/ks.yaml
  - ./qbittorrent/ks.yaml
  - ./radarr/ks.yaml
  - ./recyclarr/ks.yaml
  - ./sonarr/ks.yaml
  - ./unpackerr/ks.yaml
  - ./wizarr/ks.yaml



================================================
FILE: kubernetes/apps/media/bazarr/ks.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app bazarr
  namespace: &namespace media
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  path: ./kubernetes/apps/media/bazarr/app
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: false
  interval: 30m
  timeout: 5m
  postBuild:
    substitute:
      APP: *app
      VOLSYNC_CAPACITY: 5Gi



================================================
FILE: kubernetes/apps/media/bazarr/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app bazarr
spec:
  interval: 30m
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: 3
  upgrade:
    cleanupOnFail: true
    remediation:
      strategy: rollback
      retries: 3
  dependsOn:
    - name: openebs
      namespace: openebs-system
    - name: volsync
      namespace: volsync-system
  values:
    controllers:
      bazarr:
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/home-operations/bazarr
              tag: 1.5.1@sha256:a1b0d3a4e6462adb448dbfe4bf466e1d1bc920c17ac97c705b6db6eeb02b37b9
            env:
              TZ: ${TIMEZONE}

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
                memory: 256Mi
              limits:
                cpu: 1
                memory: 1Gi

    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 568
        runAsGroup: 568
        fsGroup: 568
        fsGroupChangePolicy: OnRootMismatch
        supplementalGroups: [10000]
        seccompProfile: { type: RuntimeDefault }
    service:
      app:
        controller: *app
        ports:
          http:
            port: *port
    ingress:
      app:
        annotations:
          external-dns.alpha.kubernetes.io/target: internal.${SECRET_DOMAIN}
        className: internal
        hosts:
          - host: bazarr.${SECRET_DOMAIN}
            paths:
              - path: /
                service:
                  identifier: app
                  port: http
    persistence:
      add-ons:
        type: emptyDir
      cache:
        type: emptyDir
        globalMounts:
          - path: /config/cache
      config:
        existingClaim: *app
      log:
        type: emptyDir
        globalMounts:
          - path: /config/log
      media:
        type: nfs
        server: ${TRUENAS_IP}
        path: /mnt/BIGHDDZ1/Media
        globalMounts:
          - path: /media
            readOnly: false
      tmp:
        type: emptyDir



================================================
FILE: kubernetes/apps/media/bazarr/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
components:
  - ../../../../components/volsync
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/media/cross-seed/ks.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app cross-seed
  namespace: &namespace media
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  dependsOn:
    - name: qbittorrent
  wait: true
  path: ./kubernetes/apps/media/cross-seed/app
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  interval: 30m
  retryInterval: 1m
  timeout: 5m
  postBuild:
    substitute:
      APP: *app



================================================
FILE: kubernetes/apps/media/cross-seed/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app cross-seed
spec:
  interval: 30m
  chartRef:
    kind: OCIRepository
    name: app-template
  maxHistory: 2
  install:
    remediation:
      retries: 3
  upgrade:
    cleanupOnFail: true
    remediation:
      strategy: uninstall
      retries: 3
  uninstall:
    keepHistory: false
  values:
    controllers:
      cross-seed:
        annotations:
          reloader.stakater.com/auto: "true"

        pod:
          securityContext:
            runAsUser: 568
            runAsGroup: 568
            fsGroup: 568
            fsGroupChangePolicy: "OnRootMismatch"
            supplementalGroups:
              - 100

        containers:
          main:
            image:
              repository: ghcr.io/cross-seed/cross-seed
              tag: 6.11.2
            args:
              - daemon

            envFrom:
              - secretRef:
                  name: cross-seed-secret

            resources:
              requests:
                cpu: 10m
                memory: 128Mi
              limits:
                memory: 256Mi

    service:
      cross-seed:
        controller: cross-seed
        ports:
          http:
            port: 80

    persistence:
      config:
        enabled: true
        type: emptyDir
      config-file:
        enabled: true
        type: configMap
        name: cross-seed-config
        globalMounts:
          - path: /config/config.js
            subPath: config.js
            readOnly: true

      qbittorrent:
        existingClaim: qbittorrent
        globalMounts:
          - path: /qbittorrent

      media:
        type: nfs
        server: ${TRUENAS_IP}
        path: /mnt/BIGHDDZ1/Media
        globalMounts:
          - path: /media
            readOnly: false

    podSecurityContext:
      runAsUser: 568
      runAsGroup: 568
      fsGroup: 568
      fsGroupChangePolicy: "OnRootMismatch"
      supplementalGroups:
        - 100



================================================
FILE: kubernetes/apps/media/cross-seed/app/kustomization.yaml
================================================
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - helmrelease.yaml
  - secret.sops.yaml

configMapGenerator:
  - name: cross-seed-config
    files:
      - ./config/config.js
generatorOptions:
  disableNameSuffixHash: true



================================================
FILE: kubernetes/apps/media/cross-seed/app/secret.sops.yaml
================================================
apiVersion: v1
kind: Secret
metadata:
    name: cross-seed-secret
    namespace: media
stringData:
    PROWLARR_API_KEY: ENC[AES256_GCM,data:lB16PZ9MnHPcdOSOo5EwBGmtv5+gK8e2Z4BGxhVeJPo=,iv:l4jMUbP0Skjs8R8dZqplVMk7ceBlbA31/zddmsCNSJ4=,tag:vZXTayTfx8O/Scf5mcOIhg==,type:str]
    SONARR_API_KEY: ENC[AES256_GCM,data:NNWALOhEktWICpZxfjPhdYxTti3j6zu8fo7z71Tf3E4=,iv:MskFe7NFsgw7zMLMOKKabTc67NUhDoFoncQSoKDdsok=,tag:QQBf+TCjia+JBwbbLsEK/A==,type:str]
    RADARR_API_KEY: ENC[AES256_GCM,data:tYQGJURGO1mUN3etLPWsXcjEF6JOcAAWCftmreqpsHU=,iv:/NgnyYhUCHlj/vuIqFsOYRuytbNkeFfftLeTcjY5O7A=,tag:jwXL1GRClIyk5HorOy0evg==,type:str]
    QBITTORRENT_USERNAME: ENC[AES256_GCM,data:T8ViQhMdAcx4,iv:TS7uGKSSV6gTAh52oFSs9gwWX0wDp/ola/XwtxASM48=,tag:nZl/RsUf2hUEksMWt4yRZQ==,type:str]
    QBITTORRENT_PASSWORD: ENC[AES256_GCM,data:d/kpvu6Eu5E=,iv:4AJ5+m1aX6/HnZXpGgn2dqkQb7G41WfS4KZmutDTQmo=,tag:ItgeoL9UOMOx6vDXyJ6BBg==,type:str]
sops:
    kms: []
    gcp_kms: []
    azure_kv: []
    hc_vault: []
    age:
        - recipient: age12gul5m0dg9nn2gk69uvzwdxyluh5xt02m8wvyg9hn7c93nz7xehswmdenq
          enc: |
            -----BEGIN AGE ENCRYPTED FILE-----
            YWdlLWVuY3J5cHRpb24ub3JnL3YxCi0+IFgyNTUxOSBHdEt4ckx5YVdCZWQwL2Ry
            OE5IODdVVE16cmR0VGdGV01UM3J2VWhLOFN3CjJqMi94dnB0STN0NGs1eSs5V3VW
            S1RjSzBlaXVpWTFhdzk1cE0vK3JVTDgKLS0tIEdNaytGTDBNVkhGQk5zcmE4L3BP
            MGlzQ3FEcTlPLzlHVno2eEpmY21jRjAKwF2sr95+e7gwQoCiW0wkwTuaOrRbQznx
            l/i8KuWESJcPvR50bUsBieGpXBEvdQNl7klqcG2l4AJ4xayww0tCWg==
            -----END AGE ENCRYPTED FILE-----
    lastmodified: "2024-10-28T19:12:56Z"
    mac: ENC[AES256_GCM,data:edhjw/UxDHcr9VWJoyNNOiE70TdrMLL4mpQktvQkP83F4ynV9fqsSzq7HCYjipscZcFz+E33LExOzBQFai//l1n7g0ETh4uenw+dST44woIbGGaA4//VjgVg8nZL3/gppAML5HKfrivFobiwIPT2mcimiYfXzhAZhAA6n5PNRvs=,iv:1mZQp6hhE2nBgGon2IDMs1o3TaCeR7DcrNsTtRicJGQ=,tag:5C2V8A3/0VE/zahseSRydg==,type:str]
    pgp: []
    encrypted_regex: ^(data|stringData)$
    version: 3.9.1



================================================
FILE: kubernetes/apps/media/cross-seed/app/config/config.js
================================================
// If you find yourself always using the same command-line flag, you can set it
// here as a default.

module.exports = {
  /**
   * WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!
   *
   * THE NEXT 8 OPTIONS CONTAIN POTENTIALLY SENSITIVE INFORMATION
   * THERE IS A NOTE WHERE YOU WILL WANT TO START COPYING FROM
   * IF YOU ARE TRYING TO SHARE YOUR CONFIGURATION SETTINGS!
   *
   * WARNING! WARNING! WARNING! WARNING! WARNING! WARNING! WARNING!
   **/

  /**
   * Provide your own API key here to override the autogenerated one.
   * Not recommended - prefer using the autogenerated API key via
   * `cross-seed api-key`.
   * Must be 24+ characters.
   */
  apiKey: undefined,

  /**
   * List of Torznab URLs.
   * For Jackett, click "Copy RSS feed".
   * For Prowlarr, click on the indexer name and copy the Torznab Url, then
   * append "?apikey=YOUR_PROWLARR_API_KEY". Wrap each URL in quotation marks
   * and separate them with commas, and surround the entire set in brackets.
   */
  torznab: [47, 48, 58, 59, 62, 70, 113].map(
    (i) =>
      `http://prowlarr.media.svc.cluster.local/$${i}/api?apikey=$${process.env.PROWLARR_API_KEY}`,
  ),

  /**
   * URL(s) to your Sonarr instance(s), included in the same way as torznab
   * URLs but for your Sonarr: note that api is not at the end. see below.
   *
   * You should order these in most likely to match -> the least likely order.
   * They are searched sequentially as they are listed.
   *
   * This apikey parameter comes from Sonarr
   *
   * Example: sonarr: ["http://sonarr:8989/?apikey=12345"],
   *
   *      sonarr: ["http://sonarr:8989/?apikey=12345",
   *               "http://sonarr4k:8989/?apikey=12345"],
   */
  sonarr: [
    `http://sonarr.media.svc.cluster.local/?apikey=$${process.env.SONARR_API_KEY}`,
  ],

  /**
   * URL(s) to your Radarr instance(s), included in the same way as torznab
   * URLs but for your Radarr: note that api is not at the end. see below.
   *
   * You should order these in most likely to match -> the least likely order.
   * They are searched sequentially as they are listed.
   *
   * This apikey parameter comes from Radarr
   *
   * Example: radarr: ["http://radarr:7878/?apikey=12345"],
   *
   *       radarr: ["http://radarr:7878/?apikey=12345",
   *                "http://radarr4k:7878/?apikey=12345"],
   */
  radarr: [
    `http://radarr.media.svc.cluster.local/?apikey=$${process.env.RADARR_API_KEY}`,
  ],

  /**
   * Bind to a specific host address.
   * Example: "127.0.0.1"
   * Default is "0.0.0.0"
   */
  host: undefined,

  /**
   * The port you wish to listen on for daemon mode.
   */
  port: 2468,

  /**
   * cross-seed will send POST requests to this url with a JSON payload of
   * { title, body }. Conforms to the caronc/apprise REST API.
   */
  notificationWebhookUrl: undefined,

  /**
   * The url of your rtorrent XMLRPC interface.
   * Only relevant with action: "inject".
   * Could be something like "http://username:password@localhost:1234/RPC2
   */
  rtorrentRpcUrl: undefined,

  /**
   * The url of your qBittorrent webui.
   * Only relevant with action: "inject".
   *
   * If using Automatic Torrent Management, please read:
   * https://www.cross-seed.org/docs/v6-migration#qbittorrent
   *
   * Supply your username and password inside the url like so:
   * "http://username:password@localhost:8080"
   */
  qbittorrentUrl: `http://$${process.env.QBITTORRENT_USERNAME}:$${process.env.QBITTORRENT_PASSWORD}@qbittorrent.media.svc.cluster.local`,

  /**
   * The url of your Transmission RPC interface.
   * Usually ends with "/transmission/rpc".
   * Only relevant with action: "inject".
   * Supply your username and password inside the url like so:
   * "http://username:password@localhost:9091/transmission/rpc"
   */
  transmissionRpcUrl: undefined,

  /**
   * The url of your Deluge JSON-RPC interface.
   * Usually ends with "/json".
   * Only relevant with action: "inject".
   * Supply your WebUI password as well like so:
   * "http://:password@localhost:8112/json"
   */
  delugeRpcUrl: undefined,

  /**
   * END OF POTENTIALLY SENSITIVE CONFIGURATION OPTIONS
   */

  /**
   * Pause at least this many seconds in between each search. Higher is safer
   * for you and friendlier for trackers.
   * Minimum value of 30.
   */
  delay: 30,

  /**
   * To search with already downloaded data, you can enter the directories
   * to your downloaded torrent data to find matches, rather than relying
   * entirely on the .torrent files themselves for matching.
   *
   * If directories are entered, they must all be in a single option, and they
   * need to be surrounded by brackets.
   *
   * Windows users will need to use double backslash in all paths in this
   * config.
   *
   * example:
   *     dataDirs: ["/downloads/movies", "/downloads/packs"],
   * or for Windows users
   *     dataDirs: ["C:\\My Data\\Downloads\\Movies"],
   */
  dataDirs: ["/media/Downloads/tv-sonarr", "/media/Downloads/radarr"],

  /**
   * Defines what qBittorrent or Deluge category to set on linked torrents
   *
   * qBittorrent: If you have linking enabled, all torrents will be injected
   * to this category.
   *
   * Default is "cross-seed-link".
   */
  linkCategory: "cross-seed",

  /**
   * If this is specified, cross-seed will create links to matched files in
   * the specified directory.
   * It will create a different link for every changed file name or directory
   * structure.
   *
   * Unlike dataDirs, this is just a quoted string WITHOUT []'s around it.
   *
   * If you are a Windows user you need to put double '\' (e.g. "C:\\links")
   *
   * IF YOU ARE USING HARDLINKS, THIS MUST BE UNDER THE SAME VOLUME AS YOUR
   * DATADIRS. THIS PATH MUST ALSO BE ACCESSIBLE VIA YOUR TORRENT CLIENT
   * USING THE SAME PATH.
   *
   * We recommend reading the following FAQ entry:
   * https://www.cross-seed.org/docs/basics/faq-troubleshooting#what-linktype-should-i-use
   */
  linkDirs: ["/media/Downloads/cross-seed/hardlinks"],

  /**
   * cross-seed will use links of this type to inject data-based matches into
   * your client. We recommend reading the following FAQ entry:
   * https://www.cross-seed.org/docs/basics/faq-troubleshooting#what-linktype-should-i-use
   * Options: "symlink", "hardlink".
   */
  linkType: "hardlink",

  /**
   * Enabling this will link files using v5's flat folder style.
   *
   * Each individual Torznab tracker's cross-seeds, otherwise, will have its
   * own folder with the tracker's name and it's links within it.
   *
   * If using Automatic Torrent Management in qBittorrent, please read:
   * https://www.cross-seed.org/docs/v6-migration#qbittorrent
   *
   * Default: false.
   */
  flatLinking: false,

  /**
   * Determines flexibility of naming during matching.
   * "safe" will allow only perfect name/size matches using the standard
   * matching algorithm.
   * "risky" uses filesize as its only comparison point.
   * "partial" is like risky but allows matches if they are missing small
   * files like .nfo/.srt.
   * Options: "safe", "risky", "partial".
   *
   * We recommend reading the following FAQ entry:
   * https://www.cross-seed.org/docs/basics/faq-troubleshooting#what-linktype-should-i-use
   */
  matchMode: "safe",

  /**
   * Determines how deep into the specified dataDirs to go to generate new
   * searchees. Setting this to higher values will result in more searchees
   * and more API hits to your indexers.
   */
  maxDataDepth: 2,

  /**
   * Directory containing .torrent files.
   * For qBittorrent, this is BT_Backup.
   * For rtorrent, this is your session directory as configured in your
   * .rtorrent.rc file.
   * For Deluge, this is ~/.config/deluge/state.
   * For Transmission, this would be ~/.config/transmission/torrents.
   *
   * If you are a Windows user you need to put double '\' (e.g. "C:\\torrents")
   */
  torrentDir: "/qbittorrent/qBittorrent/BT_backup",

  /**
   * Where to save the torrent files that cross-seed finds for you.
   *
   * If you are a Windows user you need to put double '\' (e.g. "C:\\output")
   */
  outputDir: "/media/Downloads/cross-seed/torrents",

  /**
   * Whether to include single episode torrents in a search (not those from
   * season packs).
   *
   * This setting does not affect matching episodes from rss and
   * announce.
   */
  includeSingleEpisodes: false,

  /**
   * Include torrents which are comprised of non-video files.
   *
   * If this option is set to false, any folders or torrents whose
   * totalNonVideoFilesSize / totalSize > fuzzySizeThreshold
   * will be excluded.
   *
   * For example, if you have .srt or .nfo files inside a torrent, using
   * false will still allow the torrent to be considered for cross-seeding
   * while disallowing torrents that are music, games, books, etc.
   * For full disc based folders (not .ISO) you may wish to set this as true.
   *
   * To search for all video media except individual episodes, use:
   *
   *    includeSingleEpisodes: false
   *    includeNonVideos: false
   *
   * To search for all video media including individual episodes, use:
   *
   *    includeSingleEpisodes: true
   *    includeNonVideos: false
   *
   * To search for absolutely ALL types of content, including non-video, configure
   * your episode settings based on the above examples and use:
   *
   *     includeNonVideos: true
   */
  includeNonVideos: true,

  /**
   * You should NOT modify this unless you have good reason.
   * The following option is the preliminary value to compare sizes of
   * releases for further comparison.
   *
   * decimal value (0.02 = 2%)
   */
  fuzzySizeThreshold: 0.02,

  /**
   * Time based options below use the following format:
   * https://github.com/vercel/ms
   */

  /**
   * Exclude torrents first seen by cross-seed more than this long ago.
   * Examples:
   * "5 days"
   * "2 weeks"
   *
   * This value must be in the range of 2-5 times your excludeRecentSearch
   */
  excludeOlder: "6 days",

  /**
   * Exclude torrents which have been searched more recently than this long
   * ago.
   * Doesn't exclude previously failed searches.
   * Examples:
   * "2 days"
   * "5 days"
   *
   * This value must be 2-5x less than excludeOlder.
   */
  excludeRecentSearch: "3 days",

  /**
   * Which action to take upon a match being found.
   * Options: "save", "inject".
   */
  action: "inject",

  /**
   * qBittorrent and Deluge specific.
   * Whether to inject using the same labels/categories as the original
   * torrent.
   *
   * qBittorrent: This will apply the category's original category as a tag.
   *
   * Example: if you have an original label/category called "Movies", this will
   * automatically inject cross-seeds to "Movies.cross-seed".
   */
  duplicateCategories: false,

  /**
   * Run rss scans on a schedule.
   * Set to undefined or null to disable. Minimum of 10 minutes.
   * Examples:
   * "10 minutes"
   * "1 hour"
   */
  rssCadence: "30 minutes",

  /**
   * Run searches on a schedule.
   * Set to undefined or null to disable. Minimum of 1 day.
   * Examples:
   * "2 weeks"
   * "3 days"
   *
   * This value must be at least 3x less than your excludeRecentSearch
   */
  searchCadence: "1 day",

  /**
   * Fail snatch requests that haven't responded after this long.
   * Set to null for an infinite timeout.
   * Examples:
   * "30 seconds"
   * null
   */
  snatchTimeout: "1min",

  /**
   * Fail search requests that haven't responded after this long.
   * Set to null for an infinite timeout.
   * Examples:
   * "30 seconds"
   * null
   */
  searchTimeout: "2 minutes",

  /**
   * The number of searches to make in one run/batch.
   * If more than this many searches are queued,
   * "searchCadence" will determine how long until the next batch.
   *
   * Combine this with "excludeRecentSearch" and "searchCadence" to smooth
   * long-term API usage patterns.
   *
   * Set to null for no limit.
   */
  searchLimit: null,

  /**
   * The list of infohashes or strings which are contained in torrents that
   * you want to be excluded from cross-seed. This is the same format as
   * torznab, surround the entire set of quoted strings in square brackets
   * You can use any combination which must be entered on the one line.
   * Leave as undefined to disable.
   *
   * examples:
   *
   *    blockList: ["-excludedGroup", "-excludedGroup2"],
   *    blocklist: ["x265"],
   *    blocklist: ["Release.Name"],
   *    blocklist: ["3317e6485454354751555555366a8308c1e92093"],
   */
  blockList: undefined,
};



================================================
FILE: kubernetes/apps/media/fileflows/ks.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app fileflows
  namespace: &namespace media
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  dependsOn:
    - name: openebs
      namespace: openebs-system
  wait: true
  path: ./kubernetes/apps/media/fileflows/app
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  interval: 30m
  timeout: 5m
  postBuild:
    substitute:
      APP: *app
      VOLSYNC_CAPACITY: 2Gi



================================================
FILE: kubernetes/apps/media/fileflows/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app fileflows
spec:
  interval: 30m
  chartRef:
    kind: OCIRepository
    name: app-template
  maxHistory: 3
  install:
    remediation:
      retries: 3
  upgrade:
    cleanupOnFail: true
    remediation:
      strategy: rollback
      retries: 3

  values:
    annotations:
      reloader.stakater.com/auto: "true"
    defaultPodOptions:
      runtimeClassName: nvidia
      securityContext:
        runAsUser: 0
        runAsGroup: 0
        fsGroup: 0
        fsGroupChangePolicy: OnRootMismatch
        supplementalGroups: [10000]
        seccompProfile: { type: RuntimeDefault }

    controllers:
      fileflows:
        initContainers:
          init-dirs:
            image:
              repository: busybox
              tag: latest
            command:
              - sh
              - -c
              - |
                mkdir -p /app/Data /app/Logs /app/ManuallyAdded /temp
                chown -R 0:0 /app /temp
            securityContext:
              runAsUser: 0

        containers:
          app:
            image:
              repository: docker.io/revenz/fileflows
              tag: 25.04@sha256:a7e98f8f2b34c722652bf2209f835cde1883d4c6b05decec2e73eb864727295f
            env:
              TZ: ${TIMEZONE}
              PUID: "568"
              PGID: "568"
            resources:
              requests:
                cpu: 10m
                memory: 512Mi
                nvidia.com/gpu: 1
              limits:
                cpu: 1
                memory: 2Gi
                nvidia.com/gpu: 1

    service:
      fileflows:
        controller: *app
        ports:
          http:
            port: 5000

    ingress:
      fileflows:
        className: internal
        annotations:
          external-dns.alpha.kubernetes.io/target: "internal.${SECRET_DOMAIN}"
        hosts:
          - host: "fileflows.${SECRET_DOMAIN}"
            paths:
              - path: /
                pathType: Prefix
                service:
                  identifier: *app
                  port: http

    persistence:
      config:
        existingClaim: *app
        globalMounts:
          - path: /app/Data
            readOnly: false

      temp:
        type: emptyDir
        globalMounts:
          - path: /temp
            readOnly: false

      media:
        type: nfs
        server: ${TRUENAS_IP}
        path: /mnt/BIGHDDZ1/Media
        globalMounts:
          - path: /media
            readOnly: false



================================================
FILE: kubernetes/apps/media/fileflows/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
components:
  - ../../../../components/volsync
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/media/flaresolverr/ks.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/kustomization-kustomize-v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app flaresolverr
  namespace: &namespace media
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  wait: false
  path: ./kubernetes/apps/media/flaresolverr/app
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  interval: 30m
  timeout: 5m



================================================
FILE: kubernetes/apps/media/flaresolverr/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app flaresolverr
spec:
  interval: 30m
  chartRef:
    kind: OCIRepository
    name: app-template
  maxHistory: 2
  install:
    remediation:
      retries: 3
  upgrade:
    cleanupOnFail: true
    remediation:
      strategy: rollback
      retries: 3
  uninstall:
    keepHistory: false

  values:
    controllers:
      flaresolverr:
        containers:
          app:
            image:
              repository: ghcr.io/flaresolverr/flaresolverr
              tag: v3.3.21@sha256:f104ee51e5124d83cf3be9b37480649355d223f7d8f9e453d0d5ef06c6e3b31b
            resources:
              requests:
                cpu: 10m
                memory: 150Mi
              limits:
                memory: 1Gi

    service:
      app:
        controller: *app
        ports:
          http:
            port: 8191



================================================
FILE: kubernetes/apps/media/flaresolverr/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/media/jellyfin/ks.yaml
================================================
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app jellyfin
  namespace: &namespace media
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  path: ./kubernetes/apps/media/jellyfin/app
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  interval: 30m
  retryInterval: 1m
  timeout: 5m
  postBuild:
    substitute:
      APP: *app
      VOLSYNC_CAPACITY: 20Gi



================================================
FILE: kubernetes/apps/media/jellyfin/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/helmrelease-helm-v2.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app jellyfin
  namespace: media
spec:
  interval: 30m
  chartRef:
    kind: OCIRepository
    name: app-template
  upgrade:
    remediation:
      strategy: uninstall
  dependsOn:
    - name: openebs
      namespace: openebs-system
  values:
    annotations:
      reloader.stakater.com/auto: "true"
    defaultPodOptions:
      runtimeClassName: nvidia
      enableServiceLinks: false
      securityContext:
        runAsUser: 568
        runAsGroup: 568
        fsGroup: 568
        fsGroupChangePolicy: "OnRootMismatch"
        supplementalGroups:
          - 44
          - 109
          - 100

    controllers:
      jellyfin:
        type: statefulset

        containers:
          app:
            image:
              repository: registry.skysolutions.fi/docker.io/jellyfin/jellyfin
              tag: 10.10.7
            env:
              DOTNET_SYSTEM_IO_DISABLEFILELOCKING: "true"
              JELLYFIN_FFmpeg__probesize: 50000000
              JELLYFIN_FFmpeg__analyzeduration: 500000000
              NVIDIA_VISIBLE_DEVICES: all
              NVIDIA_DRIVER_CAPABILITIES: all
            resources:
              requests:
                memory: 2Gi
                nvidia.com/gpu: 1
              limits:
                memory: 8Gi
                nvidia.com/gpu: 1

    service:
      app:
        controller: *app
        ports:
          http:
            port: 8096

    ingress:
      app:
        className: external
        annotations:
          external-dns.alpha.kubernetes.io/target: "external.${SECRET_DOMAIN}"
        hosts:
          - host: "jellyfin.${SECRET_DOMAIN}"
            paths:
              - path: /
                pathType: Prefix
                service:
                  identifier: app
                  port: http

    persistence:
      config:
        existingClaim: *app
        advancedMounts:
          jellyfin:
            app:
              - path: /config

      media:
        type: nfs
        server: ${TRUENAS_IP}
        path: /mnt/BIGHDDZ1/Media
        globalMounts:
          - path: /ext_media
            readOnly: false

      library:
        type: hostPath
        hostPath: "/var/mnt/merged/"
        globalMounts:
          - path: /var/mnt/merged/

      transcode:
        type: emptyDir
        globalMounts:
          - path: /config/transcodes



================================================
FILE: kubernetes/apps/media/jellyfin/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
components:
  - ../../../../components/volsync
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/media/jellyseerr/ks.yaml
================================================
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app jellyseerr
  namespace: &namespace media
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  path: ./kubernetes/apps/media/jellyseerr/app
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: false
  interval: 30m
  retryInterval: 1m
  timeout: 5m
  postBuild:
    substitute:
      APP: *app
      VOLSYNC_CAPACITY: 5Gi



================================================
FILE: kubernetes/apps/media/jellyseerr/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app jellyseerr
spec:
  interval: 10m
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: 3
  upgrade:
    cleanupOnFail: true
    remediation:
      strategy: rollback
      retries: 3
  dependsOn:
    - name: openebs
      namespace: openebs-system
  values:
    controllers:
      jellyseerr:
        containers:
          app:
            image:
              repository: docker.io/fallenbagel/jellyseerr
              tag: "2.5.2"
            env:
              TZ: ${TIMEZONE}
              PORT: &port 5055
            probes:
              liveness: &probes
                enabled: true
                custom: true
                spec:
                  httpGet:
                    path: /status
                    port: *port
                  initialDelaySeconds: 0
                  periodSeconds: 10
                  timeoutSeconds: 1
                  failureThreshold: 3
            resources:
              requests:
                cpu: 10m
                memory: 256Mi
              limits:
                cpu: 2
                memory: 4Gi
    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 568
        runAsGroup: 568
        fsGroup: 568
        fsGroupChangePolicy: OnRootMismatch
        supplementalGroups: [10000]
        seccompProfile: { type: RuntimeDefault }
    service:
      app:
        controller: *app
        ports:
          http:
            port: *port
    ingress:
      app:
        className: external
        annotations:
          external-dns.alpha.kubernetes.io/target: "external.${SECRET_DOMAIN}"
        hosts:
          - host: "jellyseerr.${SECRET_DOMAIN}"
            paths:
              - path: /
                pathType: Prefix
                service:
                  identifier: app
                  port: http

    persistence:
      config:
        existingClaim: *app
        globalMounts:
          - path: /app/config
      logs:
        type: emptyDir
        globalMounts:
          - path: /app/config/logs
      tmp:
        type: emptyDir



================================================
FILE: kubernetes/apps/media/jellyseerr/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
components:
  - ../../../../components/volsync
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/media/jellystat/ks.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/kustomization-kustomize-v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app jellystat
  namespace: &namespace media
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  wait: false
  path: ./kubernetes/apps/media/jellystat/app
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  interval: 30m
  retryInterval: 1m
  timeout: 5m



================================================
FILE: kubernetes/apps/media/jellystat/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app jellystat
spec:
  interval: 30m
  chartRef:
    kind: OCIRepository
    name: app-template
  maxHistory: 3
  install:
    remediation:
      retries: 3
  upgrade:
    cleanupOnFail: true
    remediation:
      strategy: rollback
      retries: 3
  uninstall:
    keepHistory: false

  values:
    controllers:
      main:
        type: statefulset
        annotations:
          reloader.stakater.com/auto: "true"
        initContainers:
          01-init-db:
            image:
              repository: ghcr.io/onedr0p/postgres-init
              tag: 16
            envFrom:
              - secretRef:
                  name: jellystat-secret

        containers:
          main:
            image:
              repository: docker.io/cyfershepard/jellystat
              tag: 1.1.5@sha256:3cb35f261ae2581e90c64e00a5a310247cd886832e7ccd71f79a6205963de44e

            env:
              TZ: ${TIMEZONE}

            resources:
              requests:
                cpu: 10m
                memory: 1Gi
              limits:
                cpu: 1
                memory: 3Gi

            envFrom:
              - secretRef:
                  name: jellystat-secret

    service:
      main:
        controller: main
        ports:
          http:
            port: &httpPort 3000

    ingress:
      main:
        className: internal
        annotations:
          external-dns.alpha.kubernetes.io/target: "internal.${SECRET_DOMAIN}"
        hosts:
          - host: &host "jellystat.${SECRET_DOMAIN}"
            paths:
              - path: /
                pathType: Prefix
                service:
                  identifier: main
                  port: http
        tls:
          - hosts:
              - *host

    persistence:
      backup:
        type: emptyDir
        advancedMounts:
          main:
            main:
              - path: /app/backend/backup-data



================================================
FILE: kubernetes/apps/media/jellystat/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: media
resources:
  - ./helmrelease.yaml
  - ./secret.sops.yaml



================================================
FILE: kubernetes/apps/media/jellystat/app/secret.sops.yaml
================================================
apiVersion: v1
kind: Secret
metadata:
    name: jellystat-secret
    namespace: media
type: Opaque
stringData:
    #ENC[AES256_GCM,data:8r1ssg==,iv:qEftgyefyrZVNbTHJukOYhlGglcZabmbO8gLqYmNXWE=,tag:bew/54DheTRgpq660b7Jcw==,type:comment]
    #ENC[AES256_GCM,data:qwUgDScTRd3uMWzQgcvF1AQmzlRSt7iGkgdmWoY1in0=,iv:i3w8f1zOBBz6BBtLUzBdEU052XnA96XW+RK4d5iM6D0=,tag:VSc6ZVAUSwEbwn2Fxpp0Ig==,type:comment]
    JWT_SECRET: ENC[AES256_GCM,data:VaKuxZz9u3yhQmhwt3pFmUYu1vYXbAPOvMETkGa1E0C3PiCfj7RrDqSiOA==,iv:4Romsz584KpvdccqaXe2SpKwsNvB8R9uSgbSKUf5BU4=,tag:d9qQtx49j7nVWkD8ahRBjQ==,type:str]
    POSTGRES_IP: ENC[AES256_GCM,data:+VHcUB1CZBqM+31yL2Mzo13FfEAf+8yWeQumRCMPLzRU4zv31VYdsw==,iv:SjwR1OcCpTd0h9KzYVJ6dIF5sXuDUUxSjaTKkKFP2kg=,tag:TQ/FloLMCs5Ui9TFyetY+A==,type:str]
    POSTGRES_PORT: ENC[AES256_GCM,data:gkjXkA==,iv:IoM+H2AlNs02P20go+2jRAPOURIgx2xRU5WaIJSTQGw=,tag:a/msSbKaEoKwYQd+lml58Q==,type:str]
    POSTGRES_DB: ENC[AES256_GCM,data:V8GXli2o,iv:fxiGdEEzNdW3aAmGOF+27KcmYrUjSLwMU/hCeiI7HHU=,tag:M59Of1Fhkq5T88k4bmDRjQ==,type:str]
    #ENC[AES256_GCM,data:kV5uym5y4gmHXOMa5ZUIB1Cd3v7ax2gye2M0ZUX7WLNe,iv:gjdsaXxyhYaCUQuAde7YBh8q1bjC9XN+kw5N802DEjw=,tag:2CNOIDpDcE63efAIuj553w==,type:comment]
    POSTGRES_USER: ENC[AES256_GCM,data:xc6xo0Tx4tGc,iv:UARpuvzFdgGVbIeH6cgzIQyes0OMWH9gz0LCp8gIdHk=,tag:GuNeWPK60GEkeybdqJANwg==,type:str]
    #ENC[AES256_GCM,data:yBHV3tz0wx8rmmY516Q8KpNOMpMMetKDhw==,iv:4fE1q8sSA1MMYZVVL7muW1083UOkj7png6IrTBedcxk=,tag:vux2UJQIna6U5tZuqzEg4g==,type:comment]
    POSTGRES_PASSWORD: ENC[AES256_GCM,data:AxZq+tqqPmQ=,iv:xVZiEnfleGV3bf+f2QTAUBV5Fg2tK3Ey4AJihdai6HA=,tag:qEnHuxPtCy6+CV71JpuKDA==,type:str]
    #ENC[AES256_GCM,data:pAFhX7gEpZJ+1MfHMXI=,iv:I4cec79ndWOqhJTjjq3dQH7iplyk7ut3J1AogyjMYtQ=,tag:qj1REYJh+3Ocw+uhkXJ9bw==,type:comment]
    INIT_POSTGRES_DBNAME: ENC[AES256_GCM,data:3kMr4sEx,iv:r1gAD91GNgay1VC5OUlsWYZcbSsH/+C4OLvM7D7Ys8g=,tag:rQL1kWqLg9kB7AwWegbS+w==,type:str]
    INIT_POSTGRES_HOST: ENC[AES256_GCM,data:ASVAa6P8cYtALR1cr8JsWaHvp3kX4D6ddp1HRxpHrrqidfSzvO9FcA==,iv:RZlfmelfhWXOimqwcYlfk8nETtwiWSrvcVlGKRvyfrg=,tag:10mLi6gbh0xsXE157kZX+Q==,type:str]
    INIT_POSTGRES_USER: ENC[AES256_GCM,data:N98BEZzwYo+o,iv:K7P6yTKTR3/DCFvmEHepJzP2xu5nWT5l722Q+qOl/Ag=,tag:y4Qpdr/jJcG0e61m/OQJzA==,type:str]
    INIT_POSTGRES_PASS: ENC[AES256_GCM,data:gfSo4/0OUzo=,iv:L+0uFSUD40eoO4Y9P3dOA2Jwg6hmL3zwV0cMuupilj8=,tag:FmPuLN84I1cmIXaUoTFjEg==,type:str]
    #ENC[AES256_GCM,data:J77T9JqsrNkwxrHDitBlpu1a8KzUYVQ9lmmVI1x4L6rG,iv:FmFjT+j7Ec5Ixjed7Dx0qHDOrZyj73Za48iTUtZ3Apw=,tag:13m//R1NJEmrpbi9V/1jhw==,type:comment]
    INIT_POSTGRES_SUPER_PASS: ENC[AES256_GCM,data:5BXg1hc2N7w=,iv:HD5qFQOAZzPm8Mq4Z4/sHHCiF00ZnwzzA3v+PBBZbzQ=,tag:tMMWghMkPu8yFOIsWt8fAg==,type:str]
sops:
    kms: []
    gcp_kms: []
    azure_kv: []
    hc_vault: []
    age:
        - recipient: age12gul5m0dg9nn2gk69uvzwdxyluh5xt02m8wvyg9hn7c93nz7xehswmdenq
          enc: |
            -----BEGIN AGE ENCRYPTED FILE-----
            YWdlLWVuY3J5cHRpb24ub3JnL3YxCi0+IFgyNTUxOSBxWU5aMnVqMEhvdjE1YUhR
            cUpObWpUWlhubjhoODBMQUdGNzVrV3k2UmtZCit5Z3lhb3VkcGtFZmRIZ3lzQzcv
            Z25Kb3Qwd3I0VTlJbi91Qmp3Y1BQRHcKLS0tIHYwY0tpOXpaME8veUJIZ3BDQkZL
            Y0l1bmtEQWd0TkN3TnBuVkVoUnBkMW8Kla9B6f22JFtbeMBDGh2DoqzDYFOb5+/c
            259R0PrkbKlUdL/3FX4P7PHNjV8aHTDTPoGV6WI4y7+l8P/mgwM99w==
            -----END AGE ENCRYPTED FILE-----
    lastmodified: "2024-10-28T21:00:29Z"
    mac: ENC[AES256_GCM,data:1M8PZlqGwlkwfEFHlSvZZ2gVLCjurX39jcqqRvxJpbUORfPLVFL8Ai5tySt4GQNdM7tcBWzcuYdhE5S95lyWxhFVfoVRog6sl+kFIEMcrgcgn47+Z4hkDxBrnxoaYCHVF1DM25zCaqF+VTp9zPVbv9hWUfE1Q1rs2yJDkdxO7Vc=,iv:c7/cZ7Il6F5FCj7epeCmrrKn+2M3GE7yjJF/GSbh8hU=,tag:pq8SrADHb7QgqII5pLQCCA==,type:str]
    pgp: []
    encrypted_regex: ^(data|stringData)$
    version: 3.9.1



================================================
FILE: kubernetes/apps/media/prowlarr/ks.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/fluxcd-community/flux2-schemas/main/kustomization-kustomize-v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app prowlarr
  namespace: &namespace media
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  dependsOn:
    - name: volsync
      namespace: volsync-system
    - name: openebs
      namespace: openebs-system
  wait: true
  path: ./kubernetes/apps/media/prowlarr/app
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  interval: 30m
  timeout: 10m
  postBuild:
    substitute:
      APP: *app
      VOLSYNC_CAPACITY: 500Mi



================================================
FILE: kubernetes/apps/media/prowlarr/app/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: &app prowlarr
  namespace: media
spec:
  interval: 15m
  chartRef:
    kind: OCIRepository
    name: app-template
  maxHistory: 3
  install:
    remediation:
      retries: 3
  upgrade:
    cleanupOnFail: true
    remediation:
      strategy: rollback
      retries: 3

  values:
    defaultPodOptions:
      automountServiceAccountToken: false
      enableServiceLinks: false
      securityContext:
        runAsUser: 568
        runAsGroup: 568
        runAsNonRoot: true
        fsGroup: 568
        fsGroupChangePolicy: OnRootMismatch
        seccompProfile: { type: RuntimeDefault }

    controllers:
      prowlarr:
        annotations:
          reloader.stakater.com/auto: "true"
        containers:
          app:
            image:
              repository: ghcr.io/home-operations/prowlarr
              tag: 1.34.0.5016@sha256:a32029de92518c0b23ce94c5df90ccd693a111d9e0f3087c87b2bff1397309da
            env:
              PROWLARR__APP__INSTANCENAME: Prowlarr
              PROWLARR__APP__THEME: dark
              PROWLARR__AUTH__METHOD: External
              PROWLARR__AUTH__REQUIRED: DisabledForLocalAddresses
              PROWLARR__LOG__LEVEL: info
              PROWLARR__SERVER__PORT: &port 80
              PROWLARR__UPDATE__BRANCH: develop
              PROWLARR__AUTH__APIKEY: ${PROWLARR_API_KEY}
              TZ: ${TIMEZONE}

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
            resources:
              requests:
                cpu: 10m
                memory: 256Mi
              limits:
                cpu: 2
                memory: 4Gi
            securityContext:
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities: { drop: ["ALL"] }

    service:
      app:
        controller: *app
        ports:
          http:
            port: *port

    ingress:
      app:
        className: internal
        annotations:
          external-dns.alpha.kubernetes.io/target: "internal.${SECRET_DOMAIN}"
        hosts:
          - host: "{{ .Release.Name }}.${SECRET_DOMAIN}"
            paths:
              - path: /
                service:
                  identifier: app
                  port: http

    persistence:
      config:
        existingClaim: *app

      tmp:
        type: emptyDir
        medium: Memory



================================================
FILE: kubernetes/apps/media/prowlarr/app/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
components:
  - ../../../../components/volsync
resources:
  - ./helmrelease.yaml



================================================
FILE: kubernetes/apps/media/qbittorrent/ks.yaml
================================================
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app qbittorrent
  namespace: &namespace media
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  dependsOn:
    - name: openebs
      namespace: openebs-system
    - name: volsync
      namespace: volsync-system
  wait: true
  path: ./kubernetes/apps/media/qbittorrent/qbittorrent
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  interval: 30m
  timeout: 5m
  postBuild:
    substitute:
      APP: *app
      VOLSYNC_CAPACITY: 5Gi
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app qbitmanage
  namespace: &namespace flux-system
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  dependsOn:
    - name: qbittorrent
  wait: true
  path: ./kubernetes/apps/media/qbittorrent/qbitmanage
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  interval: 30m
  timeout: 5m
  postBuild:
    substitute:
      APP: *app
      VOLSYNC_CAPACITY: 5Gi
---
# yaml-language-server: $schema=https://kubernetes-schemas.pages.dev/kustomize.toolkit.fluxcd.io/kustomization_v1.json
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app qbitrr
  namespace: &namespace flux-system
spec:
  targetNamespace: *namespace
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  dependsOn:
    - name: qbittorrent
  wait: true
  path: ./kubernetes/apps/media/qbittorrent/qbitrr
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  interval: 30m
  timeout: 5m
  postBuild:
    substitute:
      APP: *app
      VOLSYNC_CAPACITY: 5Gi



================================================
FILE: kubernetes/apps/media/qbittorrent/qbitmanage/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: qbitmanage
spec:
  interval: 30m
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: 3
  upgrade:
    cleanupOnFail: true
    remediation:
      strategy: rollback
      retries: 3
  dependsOn:
    - name: qbittorrent

  values:
    controllers:
      qbitmanage:
        type: cronjob
        cronjob:
          schedule: "0 * * * *"
          timeZone: &timeZone ${TIMEZONE}
          concurrencyPolicy: Forbid
          successfulJobsHistory: 1
          failedJobsHistory: 1
        containers:
          app:
            image:
              repository: ghcr.io/stuffanthings/qbit_manage
              tag: v4.2.1@sha256:e9e7888df6f63fddc8d5326f7bd308d523c181ec28c67357f67167592c41b7b3
            env:
              TZ: *timeZone
              QBT_CONFIG: "/config/config.yaml"
              QBT_CAT_UPDATE: true
              QBT_CROSS_SEED: false
              QBT_DIVIDER: "="
              QBT_DRY_RUN: false
              QBT_LOG_LEVEL: INFO
              QBT_RECHECK: true
              QBT_REM_ORPHANED: true
              QBT_REM_UNREGISTERED: true
              QBT_RUN: true
              QBT_SHARE_LIMITS: false
              QBT_SKIP_CLEANUP: false
              QBT_SKIP_QB_VERSION_CHECK: true
              QBT_TAG_NOHARDLINKS: true
              QBT_TAG_TRACKER_ERROR: true
              QBT_TAG_UPDATE: true
              QBT_WIDTH: 100
            resources:
              requests:
                cpu: 10m
                memory: 128Mi
              limits:
                memory: 1Gi
            securityContext:
              allowPrivilegeEscalation: false
              readOnlyRootFilesystem: true
              capabilities: { drop: ["ALL"] }
            lifecycle:
              postStart:
                exec:
                  command:
                    [
                      "/bin/sh",
                      "-c",
                      "cp /secret/config.yaml /config/config.yaml",
                    ]

    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 568
        runAsGroup: 568
        fsGroup: 568
        fsGroupChangePolicy: OnRootMismatch

    persistence:
      app:
        type: emptyDir
        medium: Memory
        globalMounts:
          - path: /app/config
          - path: /config

      config-file:
        type: secret
        name: qbitmanage-secret
        globalMounts:
          - path: /secret/config.yaml
            subPath: config.yaml
            readOnly: true

      media:
        type: nfs
        server: ${TRUENAS_IP}
        path: /mnt/BIGHDDZ1/Media/Downloads
        globalMounts:
          - path: /media/Downloads

      qbittorrent:
        existingClaim: qbittorrent
        globalMounts:
          - path: /qbittorrent
            readOnly: true



================================================
FILE: kubernetes/apps/media/qbittorrent/qbitmanage/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
components:
  - ../../../../components/volsync
resources:
  - ./helmrelease.yaml
secretGenerator:
  - name: qbitmanage-secret
    files:
      - ./config/config.yaml
generatorOptions:
  disableNameSuffixHash: true



================================================
FILE: kubernetes/apps/media/qbittorrent/qbitmanage/config/config.yaml
================================================
# This is an example configuration file that documents all the options.
# It will need to be modified for your specific use case.
# Please refer to the link below for more details on how to set up the configuration file
# https: //github.com/StuffAnThings/qbit_manage/wiki/Config-Setup

qbt:
  host: qbittorrent.media.svc.cluster.local
  user: ${QBITTORRENT_USER}
  pass: ${QBITTORRENT_PWD}

settings:
  force_auto_tmm: true # Will force qBittorrent to enable Automatic Torrent Management for each torrent.
  tracker_error_tag: issue # Will set the tag of any torrents that do not have a working tracker.
  nohardlinks_tag: noHL # Will set the tag of any torrents with no hardlinks.
  share_limits_tag: ~share_limit # Will add this tag when applying share limits to provide an easy way to filter torrents by share limit group/priority for each torrent
  ignoreTags_OnUpdate: # When running tag-update function, it will update torrent tags for a given torrent even if the torrent has at least one or more of the tags defined here. Otherwise torrents will not be tagged if tags exist.
    - noHL
    - issue
    - cross-seed
  share_limits_min_seeding_time_tag: MinSeedTimeNotReached
  share_limits_min_num_seeds_tag: MinSeedsNotMet
  share_limits_last_active_tag: LastActiveLimitNotReached
  cross_seed_tag: cross-seed
  cat_filter_completed: true
  share_limits_filter_completed: true
  tag_nohardlinks_filter_completed: true
  cat_update_all: true
  force_retag_all: false
  force_auto_tmm_ignore_tags: []
  disable_qbt_default_share_limits: false

directory:
  root_dir: /media/Downloads/
  recycle_bin: /media/Downloads/.RecycleBin
  torrents_dir: /qbittorrent/qBittorrent/BT_backup/
  orphaned_dir: /media/Downloads/orphaned_data
  remote_dir: /media/Downloads/
  cross_seed:

exclude_patterns:
  - "**/.DS_Store"
  - "**/Thumbs.db"
  - "**/@eaDir"
  - /media/Downloads/temp/**
  - /media/Downloads/completed/**
  - /media/Downloads/cross-seed/**
  - /media/Downloads/links/**
  - /media/Downloads/BT_backup/**
  - "**/*.!qB"
  - "**/*_unpackerred"
  - "**/*.torrent"

tracker:
  # Mandatory
  # Tag Parameters
  # <Tracker URL Keyword>:    # <MANDATORY> This is the keyword in the tracker url. You can define multiple tracker urls by splitting with `|` delimiter
  # <MANDATORY> Set tag name. Can be a list of tags or a single tag
  #   tag: <Tag Name>
  # <OPTIONAL> Set this to the notifiarr react name. This is used to add indexer reactions to the notifications sent by Notifiarr
  #   notifiarr: <notifiarr indexer>
  animebytes.tv:
    tag: AnimeBytes
    notifiarr: animebytes
  animetorrents:
    tag: Animetorrents
  avistaz:
    tag:
      - Avistaz
      - qBitrr-allowed_seeding
    notifiarr: avistaz
  beyond-hd:
    tag: Beyond-HD
    notifiarr: beyondhd
  blutopia:
    tag: Blutopia
    notifiarr: blutopia
  cartoonchaos:
    tag: CartoonChaos
  digitalcore:
    tag:
      - DigitalCore
      - qBitrr-allowed_seeding
    notifiarr: digitalcore
  gazellegames:
    tag: GGn
  hdts:
    tag: HDTorrents
  landof.tv:
    tag: BroadcasTheNet
    notifiarr: broadcasthenet
  milkie:
    tag: Milkie
    notifiarr: Milkie
  myanonamouse:
    tag: MaM
  passthepopcorn:
    tag: PassThePopcorn
    notifiarr: passthepopcorn
  privatehd:
    tag: PrivateHD
    notifiarr:
  torrentdb:
    tag: TorrentDB
    notifiarr: torrentdb
  torrentleech|tleechreload:
    tag:
      - TorrentLeech
      - qBitrr-allowed_seeding
    notifiarr: torrentleech
  tv-vault:
    tag: TV-Vault
  iptorrents:
    tag:
      - IPTorrents
      - qBitrr-allowed_seeding
    notifiarr: IPTorrents
  alpharatio:
    tag:
      - AlphaRatio
      - qBitrr-allowed_seeding
    notifiarr: AlphaRatio
  hdspace|hd-space:
    tag:
      - HDSpace
      - qBitrr-allowed_seeding
    notifiarr: HDSpace
  fearnopeer:
    tag:
      - FearNoPeer
      - qBitrr-allowed_seeding
    notifiarr: FearNoPeer
  # The "other" key is a special keyword and if defined will tag any other trackers that don't match the above trackers into this tag
  other:
    tag: public

nohardlinks:
  - radarr
  - tv-sonarr
  - lidarr

share_limits:
  public_trackers:
    priority: 2
    include_any_tags:
      - public
    max_ratio: 1.0
    max_seeding_time: 86400 # 24 hours in seconds
    cleanup: true

  private_trackers:
    priority: 3
    include_any_tags:
      - AnimeBytes
      - Beyond-HD
      - Blutopia
      - PassThePopcorn
    max_ratio: 3.0
    max_seeding_time: 1209600 # 14 days in seconds
    cleanup: true

  unlimited:
    priority: 999
    include_any_tags:
      - unlimited
    max_ratio: -1
    max_seeding_time: -1
    cleanup: false

recyclebin:
  # Recycle Bin method of deletion will move files into the recycle bin (Located in /root_dir/.RecycleBin) instead of directly deleting them in qbittorrent
  # By default the Recycle Bin will be emptied on every run of the qbit_manage script if empty_after_x_days is defined.
  enabled: true
  # <OPTIONAL> empty_after_x_days var:
  # Will automatically remove all files and folders in recycle bin after x days. (Checks every script run)
  # If this variable is not defined it, the RecycleBin will never be emptied.
  # WARNING: Setting this variable to 0 will delete all files immediately upon script run!
  empty_after_x_days: 60
  # <OPTIONAL> save_torrents var:
  # If this option is set to true you MUST fill out the torrents_dir in the directory attribute.
  # This will save a copy of your .torrent and .fastresume file in the recycle bin before deleting it from qbittorrent
  save_torrents: true
  # <OPTIONAL> split_by_category var:
  # This will split the recycle bin folder by the save path defined in the `cat` attribute
  # and add the base folder name of the recycle bin that was defined in the `recycle_bin` sub-attribute under directory.  split_by_category: false
  split_by_category: false

orphaned:
  # Orphaned files are those in the root_dir download directory that are not referenced by any active torrents.
  # Will automatically remove all files and folders in orphaned data after x days. (Checks every script run)
  # If this variable is not defined it, the orphaned data will never be emptied.
  # WARNING: Setting this variable to 0 will delete all files immediately upon script run!
  empty_after_x_days: 30
  # File patterns that will not be considered orphaned files. Handy for generated files that aren't part of the torrent but belong with the torrent's files
  exclude_patterns:
    - "**/.DS_Store"
    - "**/Thumbs.db"
    - "**/@eaDir"
    - /media/Downloads/temp/**
    - /media/Downloads/BT_backup/**
    - /media/Downloads/completed/**
    - /media/Downloads/cross-seed/**
    - /media/Downloads/links/**
    - "**/*.!qB"
    - "**/*_unpackerred"
    - "**/*.torrent"
  max_orphaned_files_to_delete: 100

webhooks:
  error:
  run_start:
  run_end:
  function:
    cross_seed:
    recheck:
    cat_update:
    tag_update:
    rem_unregistered:
    tag_tracker_error:
    rem_orphaned:
    tag_nohardlinks:
    share_limits:
    cleanup_dirs:
cat:
  radarr: /media/Downloads/radarr/
  tv-sonarr: /media/Downloads/tv-sonarr/
  lidarr: /media/Downloads/lidarr/
  manual: /media/Downloads/manual/
  Downloads: /media/Downloads/



================================================
FILE: kubernetes/apps/media/qbittorrent/qbitrr/helmrelease.yaml
================================================
---
# yaml-language-server: $schema=https://raw.githubusercontent.com/bjw-s/helm-charts/main/charts/other/app-template/schemas/helmrelease-helm-v2.schema.json
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: qbitrr
spec:
  interval: 30m
  chartRef:
    kind: OCIRepository
    name: app-template
  install:
    remediation:
      retries: 3
  upgrade:
    cleanupOnFail: true
    remediation:
      strategy: rollback
      retries: 3
  dependsOn:
    - name: qbittorrent

  values:
    controllers:
      qbitrr:
        type: deployment
        containers:
          app:
            image:
              repository: docker.io/feramance/qbitrr
              tag: v4.10.20
            env:
              TZ: ${TIMEZONE}
            resources:
              requests:
                cpu: 10m
                memory: 128Mi
              limits:
                memory: 1Gi

    defaultPodOptions:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 1000
        fsGroup: 1000
        fsGroupChangePolicy: OnRootMismatch

    persistence:
      app:
        type: emptyDir
        medium: Memory
        globalMounts:
          - path: /app/config
          - path: /config/.config

      config-file:
        type: secret
        name: qbitrr-secret
        globalMounts:
          - path: /config/.config/config.toml
            subPath: config.toml
            readOnly: true

      downloads:
        type: nfs
        server: ${TRUENAS_IP}
        path: /mnt/BIGHDDZ1/Media/Downloads
        globalMounts:
          - path: /completed_downloads
            readOnly: false

      qbittorrent:
        existingClaim: qbittorrent
        globalMounts:
          - path: /qbittorrent
            readOnly: true



================================================
FILE: kubernetes/apps/media/qbittorrent/qbitrr/kustomization.yaml
================================================
---
# yaml-language-server: $schema=https://json.schemastore.org/kustomization
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
components:
  - ../../../../components/volsync
resources:
  - ./helmrelease.yaml
secretGenerator:
  - name: qbitrr-secret
    files:
      - ./config/config.toml
generatorOptions:
  disableNameSuffixHash: true



================================================
FILE: kubernetes/apps/media/qbittorrent/qbitrr/config/config.toml
================================================
[Settings]
# Level of logging; One of CRITICAL, ERROR, WARNING, NOTICE, INFO, DEBUG, TRACE
ConsoleLevel = "INFO"

# Enable logging to files
Logging = true

# Folder where your completed downloads are put into. Can be found in qBitTorrent -> Options -> Downloads -> Default Save Path
CompletedDownloadFolder = "/completed_downloads"

# Folder to check for free space. Usually the same as CompletedDownloadFolder
FreeSpaceFolder = "/completed_downloads"

#The desired amount of free space in the downloads directory [K=kilobytes, M=megabytes, G=gigabytes, T=terabytes] (set to -1 to disable)
FreeSpace = "300G"

# Time to sleep for if there is no internet (in seconds: 600 = 10 Minutes)
NoInternetSleepTimer = 15

# Time to sleep between reprocessing torrents (in seconds: 600 = 10 Minutes)
LoopSleepTimer = 10

# Add torrents to this category to mark them as failed
FailedCategory = "failed"

# Add torrents to this category to trigger them to be rechecked properly
RecheckCategory = "recheck"

# Ignore Torrents which are younger than this value (in seconds: 600 = 10 Minutes)
# Only applicable to Re-check and failed categories
IgnoreTorrentsYoungerThan = 180

# URL to be pinged to check if you have a valid internet connection
# These will be pinged a **LOT** make sure the service is okay with you sending all the continuous pings.
PingURLS = ["one.one.one.one", "dns.google.com"]

# FFprobe auto updates, binaries are downloaded from https://ffbinaries.com/downloads
# If this is disabled and you want ffprobe to work
# Ensure that you add the binary for your platform into ~/qBitrr/qBitManager
# By default this will always be on even if config does not have these key - to disable you need to explicitly set it to `False`
FFprobeAutoUpdate = true

[qBit]
# If this is enable qBitrr can run in a headless mode where it will only process searches.
# If media search is enabled in their individual categories
# This is useful if you use for example Sabnzbd/NZBGet for downloading content but still want the faster media searches provided by qbit
Disabled = false

# qBit WebUI Port - Can be found in Options > Web UI (called "IP Address")
Host = "http://qbittorrent.media.svc.cluster.local"

# qBit WebUI Port - Can be found in Options > Web UI (called "Port" on top right corner of the window)
Port = 80

# qBit WebUI Authentication - Can be found in Options > Web UI > Authentication
UserName = "$QBITTORRENT_USER"

# If you set "Bypass authentication on localhost or whitelisted IPs" remove this field.
Password = "$QBITTORRENT_PWD"

# Set to true to allow qbittorrent v5 (Some API calls will not work as expected due to qbittorrent API issues not qBitrr)
v5 = true

[Sonarr-TV]
# Toggle whether to manage the Servarr instance torrents.
Managed = true

# The URL used to access Servarr interface (if you use a domain enter the domain without a port)
URI = "http://sonarr.media.svc.cluster.local"

# The Servarr API Key, Can be found it Settings > General > Security
APIKey = "$SONARR_API_KEY"

# Category applied by Servarr to torrents in qBitTorrent, can be found in Settings > Download Clients > qBit > Category
Category = "tv-sonarr"

# Toggle whether to send a query to Servarr to search any failed torrents
ReSearch = true

# The Servarr's Import Mode(one of Move, Copy or Auto)
importMode = "Auto"

# Timer to call RSSSync (In minutes) - Set to 0 to disable (Values below 5 can cause errors for maximum retires)
RssSyncTimer = 1

# Timer to call RefreshDownloads to update the queue. (In minutes) - Set to 0 to disable (Values below 5 can cause errors for maximum retires)
RefreshDownloadsTimer = 1

# Error messages shown my the Arr instance which should be considered failures.
# This entry should be a list, leave it empty if you want to disable this error handling.
# If enabled qBitrr will remove the failed files and tell the Arr instance the download failed
ArrErrorCodesToBlocklist = [
  "Not an upgrade for existing episode file(s)",
  "Not a preferred word upgrade for existing episode file(s)",
  "Unable to determine if file is a sample",
]


[Sonarr-TV.EntrySearch]
# All these settings depends on SearchMissing being True and access to the Servarr database file.

# Should search for Missing files?
SearchMissing = true

# Should search for specials episodes? (Season 00)
AlsoSearchSpecials = false

# Maximum allowed Searches at any one points (I wouldn't recommend settings this too high)
# Sonarr has a hardcoded cap of 3 simultaneous tasks
SearchLimit = 2

# It will order searches by the year the EPISODE was first aired
SearchByYear = true

# Reverse search order (Start searching oldest to newest)
SearchInReverse = false

# Delay between request searches in seconds
SearchRequestsEvery = 600

# Search movies which already have a file in the database in hopes of finding a better quality version.
DoUpgradeSearch = true

# Do a quality unmet search for existing entries.
QualityUnmetSearch = true

# Once you have search all files on your specified year range restart the loop and search again.
SearchAgainOnSearchCompletion = true

# Search by series instead of by episode
SearchBySeries = true

# Prioritize Today's releases (Similar effect as RSS Sync, where it searches today's release episodes first, only works on Sonarr).
PrioritizeTodaysReleases = true

[Sonarr-TV.EntrySearch.Overseerr]
# Search Overseerr for pending requests (Will only work if 'SearchMissing' is enabled.)
# If this and Ombi are both enable, Ombi will be ignored
SearchOverseerrRequests = true

# Overseerr's URI
OverseerrURI = "http://jellyseerr.media.svc.cluster.local"

# Overseerr's API Key
OverseerrAPIKey = "$JELLYSEERR_API_KEY"

# Only process approved requests
ApprovedOnly = true

#Only for 4K Instances
Is4K = true


[Sonarr-TV.Torrent]
# Set it to regex matches to respect/ignore case.
CaseSensitiveMatches = false

# These regex values will match any folder where the full name matches the specified values here, comma separated strings.
# These regex need to be escaped, that's why you see so many backslashes.
FolderExclusionRegex = [
  "\\bextras?\\b",
  "\\bfeaturettes?\\b",
  "\\bsamples?\\b",
  "\\bscreens?\\b",
  "\\bnc(ed|op)?(\\\\d+)?\\b",
]

# These regex values will match any folder where the full name matches the specified values here, comma separated strings.
# These regex need to be escaped, that's why you see so many backslashes.
FileNameExclusionRegex = [
  "\\bncop\\\\d+?\\b",
  "\\bnced\\\\d+?\\b",
  "\\bsample\\b",
  "brarbg.com\\b",
  "\\btrailer\\b",
  "music video",
  "comandotorrents.com",
]

# Only files with these extensions will be allowed to be downloaded, comma separated strings or regex, leave it empty to allow all extensions
FileExtensionAllowlist = [
  ".mp4",
  ".mkv",
  ".sub",
  ".ass",
  ".srt",
  ".!qB",
  ".parts",
]


# Auto delete files that can't be playable (i.e .exe, .png)
AutoDelete = true

# Ignore Torrents which are younger than this value (in seconds: 600 = 10 Minutes)
IgnoreTorrentsYoungerThan = 180

# Maximum allowed remaining ETA for torrent completion (in seconds: 3600 = 1 Hour)
# Note that if you set the MaximumETA on a tracker basis that value is favoured over this value
MaximumETA = 604800

# Do not delete torrents with higher completion percentage than this setting (0.5 = 50%, 1.0 = 100%)
MaximumDeletablePercentage = 0.99

# Ignore slow torrents.
DoNotRemoveSlow = true

[Sonarr-TV.Torrent.SeedingMode]
# Set the maximum allowed download rate for torrents
# Set this value to -1 to disabled it
# Note that if you set the DownloadRateLimit on a tracker basis that value is favoured over this value
DownloadRateLimitPerTorrent = -1

# Set the maximum allowed upload rate for torrents
# Set this value to -1 to disabled it
# Note that if you set the UploadRateLimit on a tracker basis that value is favoured over this value
UploadRateLimitPerTorrent = -1

# Set the maximum allowed upload ratio for torrents
# Set this value to -1 to disabled it
# Note that if you set the MaxUploadRatio on a tracker basis that value is favoured over this value
MaxUploadRatio = -1

# Set the maximum seeding time for torrents
# Set this value to -1 to disabled it
# Note that if you set the MaxSeedingTime on a tracker basis that value is favoured over this value
MaxSeedingTime = -1

# Enable if you want to remove dead trackers
RemoveDeadTrackers = false
# If "RemoveDeadTrackers" is set to true then remove trackers with the following messages
RemoveTrackerWithMessage = [
  "skipping tracker announce (unreachable)",
  "No such host is known",
  "unsupported URL protocol",
  "info hash is not authorized with this tracker",
]

# You can have multiple trackers set here or none just add more subsections.

[Radarr]
# Toggle whether to manage the Servarr instance torrents.
Managed = true

# The URL used to access Servarr interface (if you use a domain enter the domain without a port)
URI = "http://radarr.media.svc.cluster.local"

# The Servarr API Key, Can be found it Settings > General > Security
APIKey = "$RADARR_API_KEY"

# Category applied by Servarr to torrents in qBitTorrent, can be found in Settings > Download Clients > qBit > Category
Category = "radarr"

# Toggle whether to send a query to Servarr to search any failed torrents
ReSearch = true

# The Servarr's Import Mode(one of Move, Copy or Auto)
importMode = "Auto"

# Timer to call RSSSync (In minutes) - Set to 0 to disable (Values below 5 can cause errors for maximum retires)
RssSyncTimer = 1

# Timer to call RefreshDownloads to update the queue. (In minutes) - Set to 0 to disable (Values below 5 can cause errors for maximum retires)
RefreshDownloadsTimer = 1

# Error messages shown my the Arr instance which should be considered failures.
# This entry should be a list, leave it empty if you want to disable this error handling.
# If enabled qBitrr will remove the failed files and tell the Arr instance the download failed
ArrErrorCodesToBlocklist = [
  "Not an upgrade for existing movie file(s)",
  "Not a preferred word upgrade for existing movie file(s)",
  "Unable to determine if file is a sample",
]

[Radarr.EntrySearch]
# All these settings depends on SearchMissing being True and access to the Servarr database file.

# Should search for Missing files?
SearchMissing = true

# Should search for specials episodes? (Season 00)
AlsoSearchSpecials = false

# Maximum allowed Searches at any one points (I wouldn't recommend settings this too high)
# Radarr has a default of 3 simultaneous tasks, which can be increased up to 10 tasks
# If you set the environment variable of "THREAD_LIMIT" to a number between and including 2-10
# Radarr devs have stated that this is an unsupported feature so you will not get any support for doing so from them.
# That being said I've been daily driving 10 simultaneous tasks for quite a while now with no issues.
SearchLimit = 2

# It will order searches by the year the EPISODE was first aired
SearchByYear = true

# Reverse search order (Start searching oldest to newest)
SearchInReverse = false

# Delay between request searches in seconds
SearchRequestsEvery = 600

# Search movies which already have a file in the database in hopes of finding a better quality version.
DoUpgradeSearch = false

# Do a quality unmet search for existing entries.
QualityUnmetSearch = true

# Do a minimum custom format score unmet search for existing entries.
CustomFormatUnmetSearch = true

# Once you have search all files on your specified year range restart the loop and search again.
SearchAgainOnSearchCompletion = true


[Radarr.EntrySearch.Overseerr]
# Search Overseerr for pending requests (Will only work if 'SearchMissing' is enabled.)
# If this and Ombi are both enable, Ombi will be ignored
SearchOverseerrRequests = true

# Overseerr's URI
OverseerrURI = "http://jellyseerr.media.svc.cluster.local"

# Overseerr's API Key
OverseerrAPIKey = "$JELLYSEERR_API_KEY"

# Only process approved requests
ApprovedOnly = true

#Only for 4K Instances
Is4K = true

[Radarr.Torrent]
# Set it to regex matches to respect/ignore case.
CaseSensitiveMatches = false

# These regex values will match any folder where the full name matches the specified values here, comma separated strings.
# These regex need to be escaped, that's why you see so many backslashes.
FolderExclusionRegex = [
  "\\bfeaturettes?\\b",
  "\\bsamples?\\b",
  "\\bscreens?\\b",
  "\\bspecials?\\b",
  "\\bova\\b",
  "\\bnc(ed|op)?(\\\\d+)?\\b",
]

# These regex values will match any folder where the full name matches the specified values here, comma separated strings.
# These regex need to be escaped, that's why you 