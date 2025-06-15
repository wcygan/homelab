# Iceberg Table Operations Documentation

## Overview

This document covers the implementation of Objective 1.3: Iceberg Table Operations for the Data Platform bootstrap initiative.

## Implementation Status

### ✅ Completed Components

1. **Spark Iceberg Client Deployment**
   - Pod: `spark-iceberg-client` in `data-platform` namespace
   - Image: `apache/spark:3.5.0-scala2.12-java11-python3-ubuntu`
   - Resources: 2Gi memory, 500m CPU requests
   - Status: Running successfully

2. **Iceberg Dependencies**
   - Iceberg Spark Runtime 3.5 (1.5.2)
   - Nessie Spark Extensions (0.77.1) 
   - Hadoop AWS support (3.3.4)
   - AWS Java SDK bundle (1.12.367)
   - All jars downloaded and available in `/opt/spark/jars-iceberg/`

3. **Configuration**
   - Spark configuration with Iceberg and Nessie extensions
   - S3 credentials via ExternalSecret (using Ceph object user)
   - Nessie catalog configuration pointing to `http://nessie:19120/api/v2`

4. **Connectivity Validation**
   - ✅ Spark client pod running
   - ✅ Spark SQL engine functional
   - ✅ Nessie REST API accessible from pod
   - ✅ Required Iceberg jars present

### ⏳ In Progress Issues

1. **Catalog Registration**
   - Nessie catalog not appearing in `SHOW CATALOGS`
   - May require S3 bucket creation first
   - Configuration loading verification needed

2. **S3 Integration**
   - AWS CLI not available in Spark image
   - Need alternative approach for bucket operations
   - S3 credentials configured but not tested

### 🛠️ Troubleshooting Steps Attempted

1. **Jar Loading**: Verified all Iceberg/Nessie jars are present
2. **Configuration**: Tested both file-based and command-line configuration
3. **Connectivity**: Confirmed Nessie API accessible from pod
4. **Spark Engine**: Basic Spark SQL operations working

## Next Steps

### Short-term (Complete Objective 1.3)

1. **Resolve Catalog Registration**
   - Debug why Nessie catalog not appearing
   - Test minimal Nessie catalog configuration
   - Verify S3 warehouse path requirements

2. **Create S3 Bucket**
   - Use existing Ceph toolbox or alternative method
   - Create `iceberg-test` bucket for warehouse
   - Validate S3 credentials work

3. **Test Table Operations**
   - CREATE NAMESPACE in Nessie
   - CREATE TABLE with Iceberg format
   - INSERT sample data
   - Validate schema evolution

### Medium-term (Phase 1 Completion)

1. **Backup Procedures (Objective 1.4)**
   - PostgreSQL backup for Nessie metadata
   - S3 data backup strategies
   - Recovery testing

2. **Production Readiness**
   - Replace test credentials with proper secrets
   - Add resource limits and monitoring
   - Create maintenance procedures

## Configuration Reference

### Spark SQL with Nessie Catalog

```bash
kubectl exec -n data-platform spark-iceberg-client -- \
  /opt/spark/bin/spark-sql \
  --conf "spark.sql.extensions=org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions,org.projectnessie.spark.extensions.NessieSparkSessionExtensions" \
  --conf "spark.sql.catalog.nessie=org.apache.iceberg.spark.SparkCatalog" \
  --conf "spark.sql.catalog.nessie.catalog-impl=org.apache.iceberg.nessie.NessieCatalog" \
  --conf "spark.sql.catalog.nessie.uri=http://nessie:19120/api/v2" \
  --conf "spark.sql.catalog.nessie.ref=main" \
  --jars /opt/spark/jars-iceberg/*.jar
```

### Expected Table Operations

```sql
-- Use Nessie catalog
USE nessie;

-- Create namespace
CREATE NAMESPACE IF NOT EXISTS lakehouse;

-- Create Iceberg table
CREATE TABLE lakehouse.sample_data (
  id BIGINT,
  name STRING,
  created_at TIMESTAMP
) USING iceberg
LOCATION 's3a://iceberg-test/lakehouse/sample_data';

-- Insert data
INSERT INTO lakehouse.sample_data VALUES 
  (1, 'test', current_timestamp());

-- Query data
SELECT * FROM lakehouse.sample_data;
```

## Validation Commands

```bash
# Check pod status
kubectl get pods -n data-platform spark-iceberg-client

# Test Nessie connectivity
kubectl exec -n data-platform spark-iceberg-client -- \
  curl -s http://nessie:19120/api/v2/config

# Run Iceberg operations test
./scripts/test-iceberg-operations.ts

# Check S3 credentials
kubectl get secret -n data-platform s3-credentials
```

## Files Created

- `kubernetes/apps/data-platform/spark-iceberg-client/` - Deployment configuration
- `scripts/test-iceberg-operations.ts` - Automated testing script
- `docs/data-platform/nessie-deployment.md` - Nessie catalog documentation

## References

- [Apache Iceberg Documentation](https://iceberg.apache.org/)
- [Project Nessie Documentation](https://projectnessie.org/)
- [Iceberg Spark Integration](https://iceberg.apache.org/docs/latest/spark-quickstart/)