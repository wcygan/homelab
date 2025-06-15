# Nessie Catalog Deployment for Data Platform

## Overview

Project Nessie is deployed as the Iceberg catalog service for the Data Platform, providing Git-like version control for data lake tables. This document covers the deployment configuration and integration with the homelab cluster.

## Current Deployment Status

- **Status**: ✅ Operational
- **Namespace**: `data-platform`
- **Version**: 0.104.1
- **Backend**: PostgreSQL (CloudNativePG cluster)
- **API Endpoint**: `http://nessie:19120` (internal)
- **Port**: 19120

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Spark Jobs    │────▶│  Nessie Catalog  │────▶│  PostgreSQL     │
│  (Iceberg API)  │     │   (REST API)     │     │   (Metadata)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │   Ceph S3       │
                        │  (Data Files)   │
                        └─────────────────┘
```

## Configuration Details

### Nessie Service Configuration

- **API Version**: v2 (supports v1 and v2)
- **Default Branch**: `main`
- **Storage Type**: JDBC2 (PostgreSQL)
- **Authentication**: Currently disabled (development mode)
- **Cache Configuration**: 41GB with distributed invalidations

### PostgreSQL Backend

- **Database**: `nessie`
- **Schema**: `nessie`
- **Tables**: `refs2`, `objs2` (version 2 schema)
- **Connection**: Via CloudNativePG cluster service

## API Endpoints

### Core Endpoints

- **Configuration**: `GET /api/v2/config`
- **List Branches**: `GET /api/v2/trees`
- **Branch Details**: `GET /api/v2/trees/branch/{branch}`
- **Commit Operations**: `POST /api/v2/trees/branch/{branch}/commit`

### Health Monitoring

- **Health Check**: `GET /q/health`
- **Management Port**: 9000 (internal metrics)

## Integration with Iceberg

### Spark Configuration

```properties
spark.sql.catalog.nessie = org.apache.iceberg.spark.SparkCatalog
spark.sql.catalog.nessie.catalog-impl = org.apache.iceberg.nessie.NessieCatalog
spark.sql.catalog.nessie.uri = http://nessie:19120/api/v2
spark.sql.catalog.nessie.ref = main
spark.sql.catalog.nessie.warehouse = s3a://iceberg-test
```

### Example Usage

```sql
-- Use Nessie catalog
USE nessie;

-- Create namespace
CREATE NAMESPACE IF NOT EXISTS lakehouse;

-- Create Iceberg table
CREATE TABLE nessie.lakehouse.events (
  id BIGINT,
  event_time TIMESTAMP,
  event_type STRING,
  payload STRING
) USING iceberg
LOCATION 's3a://iceberg-test/lakehouse/events'
PARTITIONED BY (days(event_time));
```

## Operational Procedures

### Port Forwarding for Local Access

```bash
kubectl port-forward -n data-platform svc/nessie 19120:19120
```

### Check Service Health

```bash
# Via kubectl
kubectl get pods -n data-platform -l app.kubernetes.io/name=nessie

# Via API
curl http://localhost:19120/api/v2/config
```

### View Logs

```bash
kubectl logs -n data-platform deployment/nessie -f
```

### PostgreSQL Maintenance

```bash
# Access PostgreSQL
kubectl exec -n data-platform nessie-postgres-1 -c postgres -- psql -U postgres -d nessie

# Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'nessie'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Troubleshooting

### Common Issues

1. **PostgreSQL Connection Failures**
   - Check PostgreSQL cluster status: `kubectl get cluster -n data-platform`
   - Verify credentials in secret: `kubectl get secret -n data-platform nessie-postgres-app -o yaml`

2. **API 404 Errors**
   - Nessie v2 API has different endpoints than v1
   - Use `/api/v2/` prefix for all operations
   - Some operations require specific content types

3. **Memory Issues**
   - Default heap: 80% of container memory
   - Current allocation: Sufficient for production use
   - Monitor via management port metrics

## Security Considerations

⚠️ **Current Configuration**: Authentication and authorization are disabled for development. Before production use:

1. Enable authentication (OIDC recommended)
2. Configure authorization rules
3. Set up TLS termination
4. Implement network policies

## Next Steps

1. ✅ Nessie deployment operational
2. ⏳ Configure Spark integration (Objective 1.3)
3. ⏳ Implement backup procedures (Objective 1.4)
4. ⏳ Enable security features before production

## References

- [Nessie Documentation](https://projectnessie.org/)
- [Nessie REST API](https://projectnessie.org/nessie-latest/api/)
- [Iceberg Nessie Integration](https://iceberg.apache.org/docs/latest/nessie/)