# Phase 1: Data Platform Foundation

## Overview

Establish the foundational components for the data platform: S3 storage validation, Project Nessie catalog deployment, and basic Iceberg table operations. This phase provides immediate value through Git-like data versioning and S3-compatible data lake capabilities.

## Objectives

### Objective 1.1: S3 Storage Validation
**Goal**: Validate Ceph S3 compatibility with Apache Iceberg format

**Prerequisites**:
- Ceph cluster operational with RADOS Gateway
- S3 credentials available for testing
- kubectl access to storage namespace

**Deliverables**:
- [ ] S3 API compatibility test script
- [ ] Iceberg table format validation
- [ ] Performance baseline measurements
- [ ] S3 bucket lifecycle policies configured

**Validation Criteria**:
```bash
# Test S3 API connectivity
aws s3 --endpoint-url ${CEPH_S3_ENDPOINT} ls

# Create test bucket for Iceberg
aws s3 --endpoint-url ${CEPH_S3_ENDPOINT} mb s3://iceberg-test

# Validate write/read operations
aws s3 --endpoint-url ${CEPH_S3_ENDPOINT} cp test-file.parquet s3://iceberg-test/
aws s3 --endpoint-url ${CEPH_S3_ENDPOINT} ls s3://iceberg-test/
```

**Estimated Duration**: 1-2 days

**Checkpoint & Integration Test Creation**:
After S3 validation is complete, create an integration test script that:
- Tests actual S3 bucket operations with your Ceph cluster
- Validates Parquet file write/read cycles
- Measures baseline performance metrics
- Documents the specific S3 endpoint and credentials setup

```bash
# At this checkpoint, run:
./scripts/test-data-platform-s3.ts --create-integration-test
# This introspects your actual S3 setup and creates a permanent test
```

---

### Objective 1.2: Nessie Catalog Configuration
**Goal**: Configure Nessie as the Iceberg catalog service with Git-like version control

**Prerequisites**:
- Data platform namespace configured
- S3 storage accessible
- Helm repository access

**Deliverables**:
- [x] Nessie deployment with PostgreSQL backend
- [x] REST API endpoint configuration and validation
- [x] S3 integration readiness for Ceph object storage
- [x] Health checks and monitoring integration

**Implementation Details**:
```yaml
# Nessie is deployed with the following configuration:
# - Version: 0.104.1
# - Backend: PostgreSQL (CloudNativePG cluster)
# - API Port: 19120
# - Storage: JDBC2 schema with tables refs2 and objs2
```

**Validation Criteria**:
```bash
# Check Nessie pod status
kubectl get pods -n data-platform -l app.kubernetes.io/name=nessie

# Test catalog operations via REST API
kubectl port-forward -n data-platform svc/nessie 19120:19120 &
curl http://localhost:19120/api/v2/config
curl http://localhost:19120/api/v2/trees
```

**Estimated Duration**: 2-3 days

**Checkpoint & Integration Test Creation**:
After Nessie configuration, verify:
- Nessie REST API is accessible
- Default branch (main) exists
- Ready for Iceberg table operations
- Document actual connection strings and ports

```bash
# At this checkpoint, run:
./scripts/validate-nessie.ts

# Verify Nessie is ready for Iceberg integration:
curl http://localhost:19120/api/v2/config | jq .
curl http://localhost:19120/api/v2/trees | jq .
```

---

### Objective 1.3: Iceberg Table Operations
**Goal**: Create and manage Iceberg tables via Spark SQL

**Prerequisites**:
- Nessie catalog operational
- S3 storage accessible
- Spark client available for testing

**Deliverables**:
- [ ] Sample Iceberg table creation scripts
- [ ] Schema evolution examples
- [ ] Time travel feature validation
- [ ] Table maintenance procedures

**Implementation Examples**:
```sql
-- Using Nessie catalog on main branch
USE nessie.main;
CREATE NAMESPACE IF NOT EXISTS lakehouse;

-- Create Iceberg table in Nessie
CREATE TABLE nessie.main.lakehouse.sample_data (
  id BIGINT,
  name STRING,
  created_at TIMESTAMP
) USING ICEBERG
LOCATION 's3a://iceberg-test/sample_data'
TBLPROPERTIES (
  'write.format.default' = 'parquet',
  'write.parquet.compression-codec' = 'snappy'
);

-- Insert sample data
INSERT INTO lakehouse.sample_data VALUES 
  (1, 'test_record', current_timestamp()),
  (2, 'another_record', current_timestamp());
```

**Validation Criteria**:
```bash
# Verify table creation
kubectl exec -n data-platform deploy/spark-client -- spark-sql \
  --conf spark.sql.catalog.nessie.uri=http://nessie:19120/api/v2 \
  -e "SHOW TABLES IN nessie.main.lakehouse;"

# Check S3 storage artifacts
aws s3 --endpoint-url ${CEPH_S3_ENDPOINT} ls s3://iceberg-test/sample_data/ --recursive
```

**Estimated Duration**: 2 days

**Checkpoint & Integration Test Creation**:
After creating your first Iceberg table, introspect and validate:
- Execute actual Iceberg table operations (CREATE, INSERT, SELECT)
- Test schema evolution by adding a column
- Perform time travel queries to previous table versions
- Verify S3 storage structure and metadata files

```bash
# At this checkpoint, create and test a real table:
kubectl exec -n data-platform deploy/spark-client -- spark-sql \
  --conf spark.sql.catalog.nessie=org.apache.iceberg.spark.SparkCatalog \
  --conf spark.sql.catalog.nessie.catalog-impl=org.apache.iceberg.nessie.NessieCatalog \
  --conf spark.sql.catalog.nessie.uri=http://nessie:19120/api/v2 \
  -e "CREATE TABLE lakehouse.checkpoint_test (id BIGINT, data STRING) USING ICEBERG; 
      INSERT INTO lakehouse.checkpoint_test VALUES (1, 'test data');
      SELECT * FROM lakehouse.checkpoint_test;"

# Verify S3 artifacts exist:
aws s3 --endpoint-url ${CEPH_S3_ENDPOINT} ls s3://iceberg-test/checkpoint_test/ --recursive

# Create integration test based on actual table structure:
./scripts/test-data-platform-iceberg.ts --create-integration-test
```

---

### Objective 1.4: Metadata Backup Procedures
**Goal**: Implement backup and recovery for Nessie catalog metadata

**Prerequisites**:
- Nessie catalog operational with PostgreSQL backend
- Backup storage available (S3 or PVC)
- Scheduled job execution capability

**Deliverables**:
- [ ] Automated metadata backup script
- [ ] Recovery procedure documentation
- [ ] Backup schedule configuration
- [ ] Disaster recovery testing

**Implementation Pattern**:
```yaml
# kubernetes/apps/data-platform/nessie/app/backup-cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: nessie-backup
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15
            command:
            - /bin/bash
            - -c
            - |
              pg_dump -h ${POSTGRES_HOST} -U ${POSTGRES_USER} \
                      ${POSTGRES_DB} > /backup/nessie-$(date +%Y%m%d).sql
              # Upload to S3 or persistent storage
```

**Validation Criteria**:
```bash
# Test backup creation
kubectl create job --from=cronjob/nessie-backup nessie-backup-test -n data-platform

# Verify backup files
kubectl logs job/nessie-backup-test -n data-platform

# Test recovery procedure
kubectl exec -n data-platform deploy/postgres -- \
  psql -U postgres -d nessie < /backup/nessie-backup.sql
```

**Estimated Duration**: 1 day

**Checkpoint & Integration Test Creation**:
After backup procedures are implemented, test and validate:
- Execute an actual backup of the Nessie database
- Perform a test restoration to verify backup integrity
- Test backup scheduling and retention policies
- Document backup verification procedures

```bash
# At this checkpoint, test actual backup/restore:
kubectl create job --from=cronjob/nessie-backup nessie-backup-test -n data-platform
kubectl wait --for=condition=complete job/nessie-backup-test -n data-platform --timeout=300s
kubectl logs job/nessie-backup-test -n data-platform

# Test restoration to a test database:
kubectl exec -n data-platform deploy/postgres -- \
  psql -U postgres -c "CREATE DATABASE nessie_restore_test;"
  
# Restore from backup and verify:
# [restoration commands based on actual backup format]

# Create comprehensive integration test:
./scripts/test-data-platform-backup.ts --create-integration-test
```

**Phase 1 Completion Integration Test**:
At the end of Phase 1, create a comprehensive test that validates the entire foundation:

```bash
# Create end-to-end Phase 1 integration test:
./scripts/test-data-platform-phase1.ts --create-integration-test

# This test should validate:
# - S3 storage operations with real data
# - Nessie catalog connectivity and operations  
# - Iceberg table CRUD operations with real queries
# - Backup and recovery procedures with real data
# - Performance baselines for each component
```

## Phase 1 Success Criteria

### Technical Validation
- [ ] S3 API fully functional with Ceph storage
- [ ] Nessie catalog REST API responding to metadata queries
- [ ] Iceberg tables created, updated, and queried successfully
- [ ] Backup and recovery procedures validated

### Performance Metrics
- [ ] S3 operations complete within 5 seconds
- [ ] Metadata queries respond within 2 seconds
- [ ] Table creation completes within 30 seconds
- [ ] Backup operations complete within 10 minutes

### Operational Readiness
- [ ] Monitoring dashboards showing component health
- [ ] Log aggregation capturing all component logs
- [ ] Alert rules configured for critical failures
- [ ] Documentation updated with operational procedures

## Resource Allocation

### Memory Requirements
- Nessie catalog: 4GB RAM
- PostgreSQL backend: 2GB RAM
- Supporting services: 2GB RAM
- **Total Phase 1**: ~8GB RAM

### CPU Requirements
- Nessie catalog: 200m CPU
- PostgreSQL backend: 100m CPU
- Backup operations: 100m CPU burst
- **Total Phase 1**: ~400m CPU

### Storage Requirements
- Metastore database: 10GB
- Backup storage: 50GB
- Test data: 5GB
- **Total Phase 1**: ~65GB

## Troubleshooting Guide

### Common Issues

**Nessie Catalog Connection Failures**:
```bash
# Check PostgreSQL connectivity
kubectl exec -n data-platform deploy/nessie -- \
  nc -zv nessie-postgres-rw 5432

# Verify database schema
kubectl exec -n data-platform deploy/postgres -- \
  psql -U postgres -d nessie -c "\dt nessie.*"
```

**S3 Authentication Errors**:
```bash
# Verify S3 credentials
kubectl get secret -n data-platform s3-credentials -o yaml

# Test S3 connectivity
kubectl run s3-test --rm -it --image=amazon/aws-cli \
  --env="AWS_ACCESS_KEY_ID=${ACCESS_KEY}" \
  --env="AWS_SECRET_ACCESS_KEY=${SECRET_KEY}" \
  -- s3 --endpoint-url ${ENDPOINT} ls
```

**Iceberg Table Creation Failures**:
```bash
# Check Nessie logs
kubectl logs -n data-platform deploy/nessie --tail=100

# Verify S3 bucket permissions
aws s3api --endpoint-url ${CEPH_S3_ENDPOINT} get-bucket-acl --bucket iceberg-test
```

## Next Steps

Upon successful completion of Phase 1:

1. **Validate All Objectives**: Ensure all deliverables are complete
2. **Performance Testing**: Run load tests on metadata operations
3. **Documentation Update**: Record configuration decisions and lessons learned
4. **Phase 2 Preparation**: Begin Spark Operator deployment planning

**Next Phase**: `02-compute.md` - Deploy Spark Operator for distributed processing