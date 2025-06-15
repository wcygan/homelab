# Data Platform GitOps Implementation Guide

This document describes the GitOps implementation for the Apache Iceberg + Spark + Trino data platform on Kubernetes, including both compliant patterns and areas requiring manual intervention.

## Overview

The data platform follows GitOps principles with all deployments managed through Flux and stored in Git. However, certain prerequisites and external dependencies require manual setup before the GitOps automation can succeed.

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitOps (Flux)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐       │
│  │   Nessie    │  │    Spark     │  │ Spark-Iceberg  │       │
│  │  (Catalog)  │  │   Operator   │  │    Client      │       │
│  └──────┬──────┘  └──────┬───────┘  └───────┬────────┘       │
│         │                 │                   │                 │
│  ┌──────┴──────┐  ┌──────┴───────┐  ┌───────┴────────┐       │
│  │ PostgreSQL  │  │     CRDs     │  │   Init JARs    │       │
│  │   (CNPG)    │  │ SparkApps    │  │  (Runtime DL)  │       │
│  └──────┬──────┘  └──────────────┘  └───────┬────────┘       │
│         │                                     │                 │
├─────────┴─────────────────────────────────────┴─────────────────┤
│                    External Dependencies                         │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐       │
│  │ Ceph S3     │  │  1Password   │  │ Maven Central  │       │
│  │  Storage    │  │   Secrets    │  │   (JARs)       │       │
│  └─────────────┘  └──────────────┘  └────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

## GitOps Compliant Components

### 1. Spark Operator ✅

**Location**: `kubernetes/apps/data-platform/spark-operator/`

```yaml
# ks.yaml - Flux Kustomization
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: spark-operator
  namespace: flux-system
spec:
  targetNamespace: data-platform
  interval: 30m
  path: ./kubernetes/apps/data-platform/spark-operator/app
  sourceRef:
    kind: GitRepository
    name: flux-system
  dependsOn:
    - name: data-platform
      namespace: flux-system
```

**Key Features**:
- Deployed via HelmRelease v2
- All configuration values in Git
- Proper dependency management
- No manual steps required

### 2. Nessie Backup ✅

**Location**: `kubernetes/apps/data-platform/nessie-backup/`

```yaml
# backup-cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: nessie-backup
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM UTC
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15-alpine
            command: ["/bin/sh", "-c"]
            args:
              - |
                pg_dump ... > /backup/nessie-backup-$(date +%Y%m%d-%H%M%S).sql
```

**Key Features**:
- Pure Kubernetes resources
- References existing secrets from CNPG
- No external dependencies

## Partially Compliant Components

### 1. Nessie (Iceberg Catalog) ⚠️

**Location**: `kubernetes/apps/nessie/`

**Issues**:
1. Manual 1Password item creation required
2. Hardcoded test credentials in repository

```yaml
# postgres-credentials-manual.yaml (ANTI-PATTERN)
apiVersion: v1
kind: Secret
metadata:
  name: nessie-postgres-manual
type: Opaque
data:
  username: bmVzc2ll  # Base64: nessie
  password: <hardcoded>  # Security risk!
```

**Recommended Fix**:
```yaml
# Use ExternalSecret instead
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: nessie-postgres
spec:
  secretStoreRef:
    name: onepassword-connect
    kind: ClusterSecretStore
  data:
    - secretKey: username
      remoteRef:
        key: nessie-postgres
        property: username
```

### 2. Spark-Iceberg Client ⚠️

**Location**: `kubernetes/apps/data-platform/spark-iceberg-client/`

**Issues**:
1. Uses Pod instead of Deployment
2. Runtime JAR downloads
3. Hardcoded endpoints

```yaml
# Current implementation (ANTI-PATTERN)
apiVersion: v1
kind: Pod
metadata:
  name: spark-iceberg-client
spec:
  initContainers:
  - name: download-jars
    image: curlimages/curl:8.11.0
    command: ["/bin/sh", "-c"]
    args:
      - |
        # Downloads JARs at runtime - not reproducible!
        curl -L -o /opt/spark/jars/iceberg-spark-runtime.jar \
          https://repo1.maven.org/maven2/org/apache/iceberg/...
```

**Recommended Fix**:
```dockerfile
# Build custom image with JARs
FROM apache/spark:3.5.5
COPY jars/*.jar /opt/spark/jars/
```

## Manual Prerequisites

### 1. S3 Bucket Creation 🔴

**Current State**: Manual bucket creation required

```bash
# Manual step currently required
aws s3 mb s3://iceberg-test --endpoint-url http://ceph-rgw:80
```

**GitOps Solution**:
```yaml
apiVersion: objectbucket.io/v1alpha1
kind: ObjectBucketClaim
metadata:
  name: iceberg-test
  namespace: data-platform
spec:
  generateBucketName: iceberg-test
  storageClassName: ceph-object-bucket
  additionalConfig:
    lifecycleConfiguration: |
      <LifecycleConfiguration>
        <Rule>
          <ID>delete-old-versions</ID>
          <Status>Enabled</Status>
          <NoncurrentVersionExpiration>
            <NoncurrentDays>30</NoncurrentDays>
          </NoncurrentVersionExpiration>
        </Rule>
      </LifecycleConfiguration>
```

### 2. 1Password Secret Setup 🔴

**Current State**: Manual 1Password item creation

**Required Items**:
- `nessie-postgres`: PostgreSQL credentials
- `nessie-s3-credentials`: S3 access credentials

**GitOps Solution**:
```yaml
# Create setup Job
apiVersion: batch/v1
kind: Job
metadata:
  name: onepassword-setup
spec:
  template:
    spec:
      serviceAccountName: onepassword-setup
      containers:
      - name: setup
        image: 1password/op:2
        env:
        - name: OP_SERVICE_ACCOUNT_TOKEN
          valueFrom:
            secretKeyRef:
              name: op-credentials
              key: token
        command: ["/bin/sh", "-c"]
        args:
          - |
            op item create \
              --category=database \
              --title="nessie-postgres" \
              --vault="Homelab" \
              username=nessie \
              password="$(openssl rand -base64 32)"
```

## Bootstrap Process Analysis

### Current Implementation

The bootstrap uses custom commands that generate GitOps manifests:

```bash
/project:data-platform-bootstrap-review
/project:data-platform-bootstrap-execute
```

**Issues**:
- Requires manual coordination
- Not repeatable in CI/CD
- Hidden dependencies

### GitOps Bootstrap Alternative

```yaml
# bootstrap-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: data-platform-bootstrap
  namespace: data-platform
data:
  phase: "2"
  objective: "2.2"
  status: |
    {
      "phases_completed": ["1.1", "1.2", "1.3", "1.4", "2.1"],
      "current": "2.2",
      "blockers": []
    }
```

```yaml
# bootstrap-job.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: bootstrap-phase-2-2
spec:
  template:
    spec:
      containers:
      - name: bootstrap
        image: bitnami/kubectl:latest
        command: ["/scripts/bootstrap.sh"]
        volumeMounts:
        - name: scripts
          mountPath: /scripts
      volumes:
      - name: scripts
        configMap:
          name: bootstrap-scripts
          defaultMode: 0755
```

## Full GitOps Compliance Checklist

### ✅ Already Compliant
- [x] All Kubernetes manifests in Git
- [x] Flux manages deployments
- [x] HelmRelease for complex apps
- [x] Kustomization for organization
- [x] Dependency management

### ❌ Needs Improvement
- [ ] Declarative S3 bucket creation
- [ ] Automated secret provisioning
- [ ] Pre-built container images
- [ ] Bootstrap automation
- [ ] Reproducible builds

## Migration Path to Full Compliance

### Phase 1: Eliminate Manual S3 Operations
1. Add ObjectBucketClaim resources
2. Update applications to reference claims
3. Remove manual bucket creation scripts

### Phase 2: Automate Secret Management
1. Create secret generation Job
2. Use ExternalSecrets everywhere
3. Remove hardcoded credentials
4. Document secret structure in Git

### Phase 3: Build Custom Images
1. Create Dockerfile for spark-iceberg
2. Pre-install all dependencies
3. Push to registry
4. Update Pod spec to use custom image

### Phase 4: Automate Bootstrap
1. Convert bootstrap scripts to Jobs
2. Use ConfigMaps for state tracking
3. Create proper sequencing with init containers
4. Add validation and rollback

## Validation Commands

```bash
# Verify all resources are managed by Flux
flux tree kustomization cluster-apps | grep data-platform

# Check for manual resources
kubectl get all -n data-platform -o json | \
  jq '.items[] | select(.metadata.labels."kustomize.toolkit.fluxcd.io/name" == null) | .metadata.name'

# Validate secret references
kubectl get externalsecret -n data-platform -o wide

# Check bucket claims
kubectl get objectbucketclaim -n data-platform
```

## Summary

The data platform is largely GitOps compliant with Flux managing all deployments from Git. However, achieving full compliance requires:

1. **Declarative Infrastructure**: Replace manual S3 and secret operations
2. **Reproducible Builds**: Pre-build images with dependencies
3. **Automated Bootstrap**: Convert manual processes to Kubernetes Jobs
4. **Documentation**: All prerequisites and dependencies in Git

These improvements would enable true "git clone && flux bootstrap" deployment without manual intervention.