# Nessie Deployment

## Prerequisites

### 1Password Secret Setup

Create the following items in 1Password:

#### 1. PostgreSQL Credentials
- **Item Name**: `nessie-postgres`
- **Vault**: `Homelab` (or your configured vault)
- **Fields**:
  - `username`: `nessie`
  - `password`: Generate a strong password

#### 2. S3 Credentials 
**Note**: The S3 credentials are automatically managed by Rook-Ceph. The existing `iceberg` CephObjectStoreUser provides access to S3 storage.

The ExternalSecrets will sync these credentials to Kubernetes.

## Architecture

- **PostgreSQL**: 3-instance CloudNativePG cluster for HA
- **Storage**: 10Gi per instance using Ceph block storage
- **Database**: Dedicated `nessie` database with `nessie` user
- **Monitoring**: Custom queries for Nessie-specific metrics

## Deployment

The deployment is managed by Flux and includes:
1. PostgreSQL cluster creation
2. Secret synchronization from 1Password
3. Monitoring configuration
4. Nessie HelmRelease with JDBC backend

### Post-Deployment Steps

After Flux deploys the resources, copy the S3 secret to the data-platform namespace:

```bash
./copy-s3-secret.sh
```

This is required because the S3 credentials are created in the storage namespace but Nessie needs them in data-platform.

## Validation

After deployment, verify the PostgreSQL cluster:

```bash
kubectl get cluster -n data-platform nessie-postgres
kubectl get pods -n data-platform -l postgresql.cnpg.io/cluster=nessie-postgres
```