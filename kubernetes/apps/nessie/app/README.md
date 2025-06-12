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

#### 2. S3 Credentials for Nessie
- **Item Name**: `nessie-s3-credentials`
- **Vault**: `Homelab` (or your configured vault)
- **Fields**:
  - `access_key`: Your Ceph S3 access key (from the iceberg user)
  - `secret_key`: Your Ceph S3 secret key (from the iceberg user)

**Note**: You can find the existing credentials by running:
```bash
kubectl get secret rook-ceph-object-user-storage-iceberg -n storage -o jsonpath='{.data.AccessKey}' | base64 -d
kubectl get secret rook-ceph-object-user-storage-iceberg -n storage -o jsonpath='{.data.SecretKey}' | base64 -d
```

The ExternalSecrets will sync these credentials to Kubernetes.

## Architecture

- **PostgreSQL**: 3-instance CloudNativePG cluster for HA
- **Storage**: 10Gi per instance using Ceph block storage
- **Database**: Dedicated `nessie` database with `nessie` user
- **Monitoring**: Custom queries for Nessie-specific metrics

## Deployment

The deployment is managed by Flux and includes:
1. PostgreSQL cluster creation
2. Secret synchronization from 1Password (PostgreSQL and S3 credentials)
3. Monitoring configuration
4. Nessie HelmRelease with JDBC backend

### Prerequisites

Before deployment, ensure you have created both 1Password items:
- `nessie-postgres`: PostgreSQL credentials
- `nessie-s3-credentials`: S3 access credentials

The ExternalSecrets will automatically sync these to Kubernetes.

## Validation

After deployment, verify the PostgreSQL cluster:

```bash
kubectl get cluster -n data-platform nessie-postgres
kubectl get pods -n data-platform -l postgresql.cnpg.io/cluster=nessie-postgres
```