# Nessie Deployment

## Prerequisites

### 1Password Secret Setup

Create a new item in 1Password with the following:

1. **Item Name**: `nessie-postgres`
2. **Vault**: `Homelab` (or your configured vault)
3. **Fields**:
   - `username`: `nessie`
   - `password`: Generate a strong password

The ExternalSecret will sync these credentials to Kubernetes.

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
4. Nessie HelmRelease (to be added)

## Validation

After deployment, verify the PostgreSQL cluster:

```bash
kubectl get cluster -n data-platform nessie-postgres
kubectl get pods -n data-platform -l postgresql.cnpg.io/cluster=nessie-postgres
```