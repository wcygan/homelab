# Todo List

*** https://www.anthropic.com/engineering/claude-code-best-practices *** Setup
MCP servers with Claude Code

## Things I should do

- Backup all important files needed for recovery (See: Pre-Bootstrap Requirements)
- Add Tailscale to all Talos Linux nodes so that we can recover the cluster remotely if needed
- Introduce a rule to never delete the `cluster-apps` namespace as it causes destruction... lol stupid AI
- Investigate Ceph in other repos, document it here
- Invtestigate Rook Ceph Operator installation steps
- Have the AI reason about my cluster, ceph in other repos, and the rook + ceph installation to create steps for my cluster
- Get a test secret working through 1Password + External Secret
- Replace usages of local path storage with Ceph (probably block storage)

## Stuff to install

### Modern Data Platform Stack (Brief TLDR)

**What we could build:** Complete lakehouse architecture on existing K8s infrastructure
- **Spark Operator**: Declarative PySpark job management via Kubernetes CRDs
- **Hive Metastore**: Table catalog for Iceberg, backed by existing CNPG Postgres
- **Trino**: Interactive SQL queries on same data Spark processes
- **Result**: Airflow orchestrates Spark batch jobs → writes Iceberg tables to Ceph S3 → Trino provides ad-hoc analytics

Components needed:
- Apache Iceberg
- Apache Parquet  
- Apache Spark
- Trino
- Hive Metastore

### Others

- Pi Hole: https://pi-hole.net/
- Message Queue:
  [RedPanda](https://docs.redpanda.com/current/deploy/deployment-option/self-hosted/kubernetes/get-started-dev/)
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
  - ~~Better persistent logging + elasticsearch~~ ✅ Solved with Vector sidecar pattern
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

#### 1. Rook Ceph Unified Storage Platform

**Priority:** High\
**Why:** Comprehensive storage solution providing block, object, and file
storage in one platform\
**Use Cases:**

- Block storage (RBD): PostgreSQL databases, stateful app storage, snapshots
- Object storage (RGW): Airflow logs, KubeAI model artifacts, backup targets,
  Loki chunks
- File storage (CephFS): Shared volumes for applications requiring RWX access
  **Benefits:** Single storage platform, better resource utilization,
  production-grade reliability

#### 2. Loki + Alloy Logging Stack

**Priority:** High\
**Why:** Complete observability stack with existing Prometheus/Grafana\
**Dependencies:** Rook Ceph S3 for chunk storage\
**Use Cases:** Centralized logging, Kubernetes pod logs, Airflow debugging

### Phase 2: Operations & Reliability

#### 3. Velero Backup Solution

**Priority:** High\
**Why:** Disaster recovery for production homelab\
**Dependencies:** Rook Ceph S3 as backup target\
**Use Cases:** Cluster backups, PostgreSQL backups via CNPG integration

#### 4. ArgoCD or Flux WebUI

**Priority:** Medium\
**Why:** Visual GitOps management to complement CLI-heavy Flux workflow\
**Use Cases:** Deployment visualization, easier troubleshooting

#### 5. Uptime Kuma

**Priority:** Medium\
**Why:** External service monitoring beyond internal Prometheus\
**Use Cases:** External endpoint monitoring, service health checks

### Phase 3: Applications

#### 6. Immich Photo Management

**Priority:** Medium\
**Why:** Self-hosted Google Photos; leverages powerful hardware (96GB RAM) for
AI features\
**Dependencies:** PostgreSQL operator, Rook Ceph for storage

### Deployment Order Rationale

1. **Storage Foundation:** Rook Ceph provides unified block, object, and file
   storage
2. **Observability:** Loki completes monitoring stack, uses Ceph S3 backend
3. **Backup:** Velero protects investments, uses Ceph S3 backend
4. **Operations:** UI tools improve day-to-day management
5. **Applications:** Built on solid foundation of unified storage + monitoring
