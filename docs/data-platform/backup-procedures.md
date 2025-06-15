# Nessie Backup and Recovery Procedures

## Overview

This document covers the backup and recovery procedures for the Nessie catalog metadata in the Data Platform. Nessie stores its metadata in a PostgreSQL database, which requires regular backups for data protection and disaster recovery.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Nessie API    │───▶│   PostgreSQL     │───▶│  Backup Storage │
│   (Catalog)     │    │   (Metadata)     │    │     (PVC)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   Backup CronJob │
                       │  (Daily 2 AM)    │
                       └──────────────────┘
```

## Backup Components

### 1. Backup CronJob
- **Schedule**: Daily at 2:00 AM UTC
- **Resource**: `nessie-backup` CronJob in `data-platform` namespace
- **Image**: `postgres:15-alpine`
- **Method**: `pg_dump` with `--clean --if-exists` flags

### 2. Backup Storage
- **PVC**: `nessie-backup-pvc` (10Gi, `ceph-block` storage class)
- **Location**: `/backup` mount in backup containers
- **Retention**: Managed manually (3 successful jobs kept by CronJob)

### 3. Backup Contents
- **Database**: `nessie` 
- **Schema**: `nessie` (contains refs2, objs2 tables)
- **Format**: SQL dump with DDL and DML statements
- **Compression**: None (plain text for debugging)

## Backup Operations

### Automatic Backups

Backups run automatically via CronJob:

```yaml
schedule: "0 2 * * *"  # Daily at 2 AM UTC
concurrencyPolicy: Forbid
successfulJobsHistoryLimit: 3
failedJobsHistoryLimit: 3
```

### Manual Backup

Create an immediate backup:

```bash
# Create manual backup job
kubectl create job --from=cronjob/nessie-backup nessie-backup-manual -n data-platform

# Monitor backup progress
kubectl logs -n data-platform job/nessie-backup-manual -f

# Check backup completion
kubectl get job -n data-platform nessie-backup-manual
```

### List Available Backups

```bash
# List backup files
kubectl exec -n data-platform deploy/nessie -c nessie -- ls -la /backup/

# Check backup file details
kubectl exec -n data-platform deploy/nessie -c nessie -- \
  find /backup -name "*.sql" -exec ls -lh {} \; -exec head -10 {} \;
```

## Recovery Operations

### 1. Prepare for Recovery

**CRITICAL**: Always stop Nessie service before restoration to prevent data corruption:

```bash
# Scale Nessie deployment to 0
kubectl scale deployment -n data-platform nessie --replicas=0

# Verify Nessie is stopped
kubectl get pods -n data-platform -l app.kubernetes.io/name=nessie
```

### 2. Restore from Backup

```bash
# Create restore job from template
kubectl apply -f - <<EOF
apiVersion: batch/v1
kind: Job
metadata:
  name: nessie-restore-$(date +%Y%m%d-%H%M%S)
  namespace: data-platform
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: restore
        image: postgres:15-alpine
        command:
        - /bin/sh
        - -c
        - |
          set -e
          BACKUP_FILE="/backup/nessie-backup-YYYYMMDD-HHMMSS.sql"  # Replace with actual file
          echo "Restoring from: \${BACKUP_FILE}"
          
          PGPASSWORD="\${POSTGRES_PASSWORD}" psql \\
            -h "\${POSTGRES_HOST}" \\
            -U "\${POSTGRES_USER}" \\
            -d "\${POSTGRES_DB}" \\
            -v ON_ERROR_STOP=1 \\
            -f "\${BACKUP_FILE}"
          
          echo "Restore completed successfully"
        env:
        - name: POSTGRES_HOST
          value: "nessie-postgres-rw"
        - name: POSTGRES_DB
          value: "nessie"
        - name: POSTGRES_USER
          value: "nessie"
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: nessie-postgres-app
              key: password
        volumeMounts:
        - name: backup-storage
          mountPath: /backup
      volumes:
      - name: backup-storage
        persistentVolumeClaim:
          claimName: nessie-backup-pvc
EOF

# Monitor restore progress
kubectl logs -n data-platform job/nessie-restore-XXXXXX -f
```

### 3. Restart Nessie Service

```bash
# Scale Nessie deployment back to 1
kubectl scale deployment -n data-platform nessie --replicas=1

# Verify Nessie is running
kubectl get pods -n data-platform -l app.kubernetes.io/name=nessie

# Test Nessie API
kubectl exec -n data-platform deploy/nessie -c nessie -- \
  curl -s http://localhost:19120/api/v2/config
```

### 4. Verify Recovery

```bash
# Check Nessie branches
kubectl exec -n data-platform deploy/nessie -c nessie -- \
  curl -s http://localhost:19120/api/v2/trees

# Verify PostgreSQL tables
kubectl exec -n data-platform nessie-postgres-1 -c postgres -- \
  psql -U postgres -d nessie -c "SELECT COUNT(*) FROM nessie.refs2;"
```

## Monitoring and Alerting

### Backup Job Monitoring

```bash
# Check recent backup job status
kubectl get job -n data-platform -l app.kubernetes.io/name=nessie-backup

# Check CronJob status
kubectl get cronjob -n data-platform nessie-backup

# View recent backup logs
kubectl logs -n data-platform -l app.kubernetes.io/name=nessie-backup --tail=100
```

### Backup Validation

```bash
# Run backup system test
./scripts/test-nessie-backup.ts

# Manual backup validation
kubectl exec -n data-platform deploy/nessie -c nessie -- \
  find /backup -name "*.sql" -mtime -1 -exec sh -c 'echo "File: {}"; grep -c "^CREATE TABLE" {}; grep -c "^INSERT INTO" {}' \;
```

## Troubleshooting

### Common Issues

1. **Backup Job Fails with Permission Error**
   ```bash
   # Check PostgreSQL secret
   kubectl get secret -n data-platform nessie-postgres-app -o yaml
   
   # Test PostgreSQL connectivity
   kubectl exec -n data-platform nessie-postgres-1 -c postgres -- \
     psql -U postgres -d nessie -c "SELECT current_user, current_database();"
   ```

2. **Backup PVC Not Mounting**
   ```bash
   # Check PVC status
   kubectl describe pvc -n data-platform nessie-backup-pvc
   
   # Check storage class
   kubectl get storageclass ceph-block
   ```

3. **Restore Fails with Syntax Errors**
   ```bash
   # Validate backup file
   kubectl exec -n data-platform deploy/nessie -c nessie -- \
     head -50 /backup/nessie-backup-YYYYMMDD.sql
   
   # Check PostgreSQL version compatibility
   kubectl exec -n data-platform nessie-postgres-1 -c postgres -- \
     psql -U postgres -c "SELECT version();"
   ```

### Emergency Recovery

If all backups fail, you can reset Nessie to initial state:

```bash
# DANGER: This removes all catalog metadata
kubectl exec -n data-platform nessie-postgres-1 -c postgres -- \
  psql -U postgres -d nessie -c "DROP SCHEMA nessie CASCADE; CREATE SCHEMA nessie;"

# Restart Nessie to recreate tables
kubectl rollout restart deployment -n data-platform nessie
```

## Backup Schedule and Retention

### Current Schedule
- **Frequency**: Daily
- **Time**: 2:00 AM UTC
- **Day of Week**: All days
- **Timezone**: UTC

### Retention Policy
- **Successful Jobs**: 3 (kept by Kubernetes)
- **Failed Jobs**: 3 (kept by Kubernetes)
- **Backup Files**: Manual cleanup required

### Recommended Retention
For production environments, consider:
- **Daily backups**: Keep 7 days
- **Weekly backups**: Keep 4 weeks  
- **Monthly backups**: Keep 12 months

## Security Considerations

1. **Access Control**: Backup files contain full database contents
2. **Encryption**: Consider encrypting backup files at rest
3. **Network**: Backups use internal cluster networking only
4. **Credentials**: PostgreSQL password stored in Kubernetes secret

## Integration with Disaster Recovery

This backup system provides:
- **RTO (Recovery Time Objective)**: ~10 minutes (restore + restart)
- **RPO (Recovery Point Objective)**: 24 hours (daily backups)

For shorter RPO, consider:
- More frequent backup schedule
- PostgreSQL streaming replication
- Real-time metadata replication to secondary cluster

## Testing and Validation

Regular testing is essential:

```bash
# Monthly backup test
./scripts/test-nessie-backup.ts

# Quarterly restore test (in staging environment)
# 1. Create test backup
# 2. Restore to separate database
# 3. Verify data integrity
# 4. Test Nessie functionality
```

## References

- [PostgreSQL Backup Documentation](https://www.postgresql.org/docs/current/backup.html)
- [Kubernetes CronJob Documentation](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/)
- [Project Nessie Documentation](https://projectnessie.org/)