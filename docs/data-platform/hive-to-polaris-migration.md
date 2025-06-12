# Hive Metastore to Apache Polaris Migration Plan

**Date**: January 12, 2025  
**Status**: Planning  
**Impact**: Major - Complete replacement of metadata catalog technology

## Executive Summary

This document outlines the complete migration plan from Hive Metastore to Apache Polaris for the Anton Kubernetes cluster's data platform. The migration involves removing all Hive-related components and implementing Apache Polaris as the modern, cloud-native catalog for Apache Iceberg.

## Background

### Current State
- **Problem**: GetInData Hive Metastore Helm chart v0.1.0 has a critical bug with duplicate labels
- **Blocker**: Cannot deploy Hive Metastore due to Helm rendering errors
- **Infrastructure**: PostgreSQL cluster already deployed and healthy

### Decision Rationale
After investigation of modern alternatives (see investigation results below), Apache Polaris was selected because:
1. Purpose-built for Apache Iceberg (not a legacy adaptation)
2. Lightweight, cloud-native architecture
3. Active development under Apache incubation
4. Kubernetes-native with official Helm charts
5. Implements Iceberg REST API standard

## Investigation Results

### Catalog Options Evaluated

#### 1. Apache Polaris (Selected)
- **Pros**: Open-source, Iceberg-native, Kubernetes support, REST API standard
- **Cons**: Iceberg-only (no Delta/Hudi), newer project
- **Deployment**: Official Helm chart available

#### 2. Project Nessie
- **Pros**: Git-like versioning, mature project, multi-table transactions
- **Cons**: More complex setup, additional overhead for simple use cases
- **Deployment**: Helm chart available

#### 3. Unity Catalog OSS
- **Pros**: Multi-format support (Iceberg, Delta, Hudi)
- **Cons**: Limited Kubernetes support, not equivalent to Databricks product
- **Deployment**: Better suited for Databricks environments

#### 4. Traditional Hive Metastore
- **Pros**: Mature, widely supported
- **Cons**: Heavy, legacy architecture, current Helm chart broken
- **Status**: Rejected due to bugs and legacy nature

## Migration Strategy

### Approach
Complete replacement strategy - no migration of existing data:
1. Remove all Hive components
2. Deploy Polaris fresh
3. Update all references and documentation
4. Validate with new Iceberg tables

### Timeline
- **Total Duration**: 5-6 days
- **Phase 1**: Hive Removal (1 day)
- **Phase 2**: Polaris Deployment (2-3 days)
- **Phase 3**: Documentation Update (1 day)
- **Phase 4**: Validation & Testing (1-2 days)

## Detailed Migration Plan

### Phase 1: Hive Removal

#### Files to Delete
```
/kubernetes/apps/data-platform/hive-metastore/
├── app/
│   ├── helmrelease.yaml
│   ├── kustomization.yaml
│   ├── postgres-backup-s3.yaml
│   ├── postgres-cluster.yaml
│   ├── postgres-credentials.yaml
│   └── servicemonitor.yaml
├── ks.yaml
└── ks-nodeps.yaml

/scripts/validate-hive-metastore.ts
/kubernetes/flux/meta/repos/getindata.yaml
```

#### Files to Modify
- `/docs/milestones/2025-06-11-data-platform-phase-1-foundation.md`
  - Update objectives to replace Hive with Polaris
  - Update progress tracking
  
- `/docs/data-platform/bootstrap/goals.json`
  - Update objective 1.2 from Hive to Polaris
  
- `/docs/data-platform/bootstrap/01-foundation.md`
  - Replace Hive Metastore references with Polaris
  
- `/kubernetes/apps/data-platform/kustomization.yaml`
  - Remove hive-metastore, add polaris

#### Search Commands
```bash
# Find all Hive references
rg -i "hive|metastore" --type-add 'config:*.{yaml,yml,json}' -t config

# Find in documentation
rg -i "hive|metastore" docs/

# Find in scripts
rg -i "hive|metastore" scripts/
```

### Phase 2: Polaris Deployment

#### New Files to Create

##### 1. Helm Repository
`/kubernetes/flux/meta/repos/apache-polaris.yaml`:
```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: HelmRepository
metadata:
  name: apache-polaris
  namespace: flux-system
spec:
  interval: 30m
  url: https://apache.github.io/polaris
```

##### 2. Kustomization
`/kubernetes/apps/data-platform/polaris/ks.yaml`:
```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: &app polaris
  namespace: flux-system
spec:
  targetNamespace: data-platform
  commonMetadata:
    labels:
      app.kubernetes.io/name: *app
  interval: 30m
  timeout: 10m
  prune: true
  wait: true
  path: ./kubernetes/apps/data-platform/polaris/app
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  dependsOn:
    - name: cnpg-operator
      namespace: cnpg-system
```

##### 3. HelmRelease
`/kubernetes/apps/data-platform/polaris/app/helmrelease.yaml`:
```yaml
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: polaris
  namespace: data-platform
spec:
  interval: 30m
  timeout: 15m
  chart:
    spec:
      chart: polaris
      version: 0.1.0  # Check for latest
      sourceRef:
        kind: HelmRepository
        name: apache-polaris
        namespace: flux-system
  values:
    # PostgreSQL backend configuration
    persistence:
      type: postgres
      postgres:
        host: hive-metastore-postgres-rw.data-platform.svc.cluster.local
        port: 5432
        database: polaris_catalog
        username: polaris
        existingSecret: polaris-postgres-credentials
    
    # Service configuration
    service:
      type: ClusterIP
      port: 8181
    
    # Resource allocation
    resources:
      requests:
        memory: "1Gi"
        cpu: "500m"
      limits:
        memory: "2Gi"
        cpu: "1000m"
```

##### 4. Kustomization
`/kubernetes/apps/data-platform/polaris/app/kustomization.yaml`:
```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: data-platform
resources:
  - helmrelease.yaml
  - postgres-credentials.yaml
```

##### 5. PostgreSQL Credentials
`/kubernetes/apps/data-platform/polaris/app/postgres-credentials.yaml`:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: polaris-postgres-credentials
  namespace: data-platform
type: Opaque
stringData:
  username: polaris
  password: changeme  # Use ExternalSecret in production
```

### Phase 3: Documentation Updates

#### New Documentation
`/docs/data-platform/polaris-setup.md`:
```markdown
# Apache Polaris Setup Guide

## Overview
Apache Polaris is the catalog implementation for Apache Iceberg tables in the Anton data platform.

## Architecture
- **Catalog**: Apache Polaris (REST API)
- **Backend**: PostgreSQL (CloudNativePG)
- **Storage**: Ceph S3
- **Namespace**: data-platform

## Endpoints
- REST API: `http://polaris.data-platform.svc.cluster.local:8181`
- Health: `http://polaris.data-platform.svc.cluster.local:8181/healthcheck`

## Configuration
Polaris is configured to use the existing PostgreSQL cluster with a dedicated database.

## Usage
Configure Spark/Trino to use Polaris:
```properties
spark.sql.catalog.polaris = org.apache.iceberg.spark.SparkCatalog
spark.sql.catalog.polaris.catalog-impl = org.apache.iceberg.rest.RESTCatalog
spark.sql.catalog.polaris.uri = http://polaris.data-platform.svc.cluster.local:8181
```
```

#### Validation Script
`/scripts/validate-polaris.ts`:
```typescript
#!/usr/bin/env -S deno run --allow-all

import { $ } from "jsr:@david/dax";

console.log("🔵 Apache Polaris Validation\n");

// Check PostgreSQL
console.log("🐘 Checking PostgreSQL cluster...");
const pgCluster = await $`kubectl get cluster -n data-platform polaris-postgres -o json`.json();
if (pgCluster.status?.phase === "Cluster in healthy state") {
  console.log("✅ PostgreSQL cluster is healthy");
} else {
  console.log("❌ PostgreSQL cluster is not healthy");
}

// Check Polaris pods
console.log("\n📦 Checking Polaris pods...");
const pods = await $`kubectl get pods -n data-platform -l app.kubernetes.io/name=polaris -o json`.json();
if (pods.items?.length > 0) {
  console.log(`✅ Found ${pods.items.length} Polaris pod(s)`);
} else {
  console.log("❌ No Polaris pods found");
}

// Check Polaris service
console.log("\n🌐 Checking Polaris service...");
const service = await $`kubectl get service -n data-platform polaris -o json`.json();
console.log(`✅ Service endpoint: ${service.spec?.clusterIP}:${service.spec?.ports?.[0]?.port}`);

// Test REST API
console.log("\n🔌 Testing Polaris REST API...");
const podName = pods.items?.[0]?.metadata?.name;
if (podName) {
  try {
    await $`kubectl exec -n data-platform ${podName} -- curl -s http://localhost:8181/healthcheck`;
    console.log("✅ REST API is responding");
  } catch {
    console.log("❌ REST API health check failed");
  }
}
```

### Phase 4: Testing & Validation

#### Test Checklist
- [ ] Polaris pods running successfully
- [ ] REST API responding to health checks
- [ ] PostgreSQL connection established
- [ ] Create test Iceberg namespace
- [ ] Create test Iceberg table
- [ ] Verify table metadata stored correctly
- [ ] Test table operations (schema evolution, time travel)
- [ ] Verify S3 integration working

#### Sample Test Commands
```bash
# Port forward for local testing
kubectl port-forward -n data-platform svc/polaris 8181:8181

# Test REST API
curl http://localhost:8181/api/catalog/v1/config

# Create namespace
curl -X POST http://localhost:8181/api/catalog/v1/namespaces \
  -H "Content-Type: application/json" \
  -d '{"name": "test", "properties": {}}'
```

## Rollback Plan

If issues arise during migration:
1. Delete Polaris deployment
2. Revert git commits
3. Investigate alternative solutions (Project Nessie, JDBC catalog)

## Success Criteria

- [ ] All Hive references removed from codebase
- [ ] Polaris successfully deployed and healthy
- [ ] Documentation updated to reflect Polaris
- [ ] Validation scripts passing
- [ ] Test Iceberg table created successfully
- [ ] Milestone documentation updated

## References

- [Apache Polaris GitHub](https://github.com/apache/polaris)
- [Apache Polaris Documentation](https://polaris.apache.org/)
- [Iceberg REST Catalog Spec](https://iceberg.apache.org/rest-catalog/)
- [Polaris Helm Chart](https://github.com/apache/polaris/tree/main/helm/polaris)