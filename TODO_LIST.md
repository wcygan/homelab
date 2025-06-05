# Todo List

*** https://www.anthropic.com/engineering/claude-code-best-practices

## Stuff to install

- 6 x 1TB WD_BLACK 1TB SN7100 NVMe (2 per node)
- Object Storage: [Rook Ceph](https://rook.io/docs/rook/latest-release/Getting-Started/intro/)
- Log Aggregation: [Loki](https://github.com/grafana/loki)
  - Maybe this can be used for Kubernetes Pod logs (especially from Airflow)
  - Use with https://github.com/grafana/alloy
  - Docs:
    - https://grafana.com/docs/loki/latest/setup/install/helm/
    - https://grafana.com/docs/alloy/latest/set-up/install/kubernetes/
- Pi Hole: https://pi-hole.net/
- Message Queue: [RedPanda](https://docs.redpanda.com/current/deploy/deployment-option/self-hosted/kubernetes/get-started-dev/)
- Todo List: https://github.com/wcygan/simple-web-stack
- Immich: https://github.com/immich-app/immich
- Jellyfin: https://jellyfin.org/
- Sentry: https://github.com/getsentry/sentry
- Meilisearch: https://github.com/meilisearch/meilisearch
- Nextcloud: https://nextcloud.com/
- Fail2ban: https://github.com/fail2ban/fail2ban

## Backlog

- Airflow 3
  - https://github.com/apache/airflow/issues/50994
  - https://airflow.apache.org/blog/airflow-three-point-oh-is-here/
  - Better persistent logging + elasticsearch
- Huginn: https://github.com/huginn/huginn
- Supabase: https://github.com/supabase-community/supabase-kubernetes
- Cal.com: https://github.com/calcom/cal.com
- Paperless: https://github.com/paperless-ngx/paperless-ngx
- n8n: https://github.com/n8n-io/n8n
- [Homepage](https://github.com/gethomepage/homepage)
- DNS Server: https://github.com/NLnetLabs/unbound

## References

Search for new things on

- https://github.com/awesome-selfhosted/awesome-selfhosted
- https://kubesearch.dev/
- https://selfh.st/

## Deployment Strategy & Component Selection

### Phase 1: Core Infrastructure (Storage & Observability)

#### 1. Longhorn Distributed Block Storage
**Priority:** High  
**Why:** Foundation for persistent volumes; needed before stateful workloads  
**Use Cases:** PostgreSQL databases, stateful app storage, snapshots  
**Chosen over:** Rook Ceph (simpler setup, lower resource overhead for 3-node homelab)

#### 2. Garage Object Storage  
**Priority:** High  
**Why:** S3-compatible storage; chosen over MinIO due to better open source practices  
**Use Cases:** Airflow logs, KubeAI model artifacts, backup targets, Loki chunks  
**Chosen over:** MinIO (AGPL licensing concerns, gutted OSS features), Rook Ceph RGW (complexity)

#### 3. Loki + Alloy Logging Stack
**Priority:** High  
**Why:** Complete observability stack with existing Prometheus/Grafana  
**Dependencies:** Garage for chunk storage OR Longhorn PVCs  
**Use Cases:** Centralized logging, Kubernetes pod logs, Airflow debugging

### Phase 2: Operations & Reliability

#### 4. Velero Backup Solution
**Priority:** High  
**Why:** Disaster recovery for production homelab  
**Dependencies:** Garage as backup target  
**Use Cases:** Cluster backups, PostgreSQL backups via CNPG integration

#### 5. ArgoCD or Flux WebUI
**Priority:** Medium  
**Why:** Visual GitOps management to complement CLI-heavy Flux workflow  
**Use Cases:** Deployment visualization, easier troubleshooting

#### 6. Uptime Kuma
**Priority:** Medium  
**Why:** External service monitoring beyond internal Prometheus  
**Use Cases:** External endpoint monitoring, service health checks

### Phase 3: Applications

#### 7. Immich Photo Management
**Priority:** Medium  
**Why:** Self-hosted Google Photos; leverages powerful hardware (96GB RAM) for AI features  
**Dependencies:** PostgreSQL operator, Garage for storage

### Deployment Order Rationale

1. **Storage First:** Longhorn provides persistent volumes needed by stateful workloads
2. **Object Storage:** Garage enables log storage and backup targets
3. **Observability:** Loki completes monitoring stack, depends on storage
4. **Backup:** Velero protects investments, uses Garage backend
5. **Operations:** UI tools improve day-to-day management
6. **Applications:** Built on solid foundation of storage + monitoring