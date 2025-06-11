# Phase 3: Analytics Engine

## Overview

Deploy Trino cluster for high-performance interactive analytics on Iceberg data. This phase enables sub-10 second query response times, multi-table joins, and concurrent analytical workloads while leveraging Ceph S3 Select for optimal performance.

## Objectives

### Objective 3.1: Trino Cluster Deployment
**Goal**: Deploy distributed Trino cluster with coordinator and worker nodes

**Prerequisites**:
- Hive Metastore operational (from Phase 1)
- Sufficient cluster resources (48GB RAM for workers)
- Helm repository access to Trino charts

**Deliverables**:
- [ ] Trino coordinator configuration
- [ ] Trino worker node deployment
- [ ] Iceberg catalog configuration
- [ ] JVM optimization settings

**Implementation Pattern**:
```yaml
# kubernetes/apps/data-platform/trino/app/helmrelease.yaml
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: trino
  namespace: data-platform
spec:
  interval: 15m
  chart:
    spec:
      chart: trino
      version: "0.18.0"
      sourceRef:
        kind: HelmRepository
        name: trino
        namespace: flux-system
  values:
    image:
      repository: trinodb/trino
      tag: "435"
    
    # Coordinator configuration
    coordinator:
      jvm:
        maxHeapSize: "8G"
        gcMethod:
          type: "UseG1GC"
          g1:
            heapRegionSize: "32M"
      
      resources:
        requests:
          memory: "8Gi"
          cpu: "500m"
        limits:
          memory: "10Gi"
          cpu: "2000m"
      
      nodeSelector:
        kubernetes.io/hostname: "k8s-1"  # Pin coordinator to specific node
    
    # Worker configuration
    worker:
      replicas: 2
      jvm:
        maxHeapSize: "24G"
        gcMethod:
          type: "UseG1GC"
          g1:
            heapRegionSize: "32M"
      
      resources:
        requests:
          memory: "24Gi"
          cpu: "2000m"
        limits:
          memory: "26Gi"
          cpu: "4000m"
      
      nodeSelector:
        kubernetes.io/hostname: "k8s-2|k8s-3"  # Distribute workers
      
      # Worker-specific configurations
      config:
        query.max-memory-per-node: "20GB"
        query.max-total-memory-per-node: "22GB"
    
    # Global Trino configuration
    server:
      config:
        query.max-memory: "50GB"
        query.max-memory-per-node: "20GB"
        discovery-server.enabled: true
        discovery.uri: "http://trino:8080"
    
    # Catalog configuration
    catalogs:
      iceberg.properties: |
        connector.name=iceberg
        hive.metastore.uri=thrift://hive-metastore:9083
        iceberg.catalog.type=hive_metastore
        hive.s3.endpoint=${CEPH_S3_ENDPOINT}
        hive.s3.access-key=${S3_ACCESS_KEY}
        hive.s3.secret-key=${S3_SECRET_KEY}
        hive.s3.path-style-access=true
        hive.s3.ssl.enabled=false
        # S3 Select optimization
        hive.s3select-pushdown.enabled=true
        hive.s3select-pushdown.max-connections=20
    
    # Service configuration
    service:
      type: ClusterIP
      port: 8080
    
    # Monitoring integration
    serviceMonitor:
      enabled: true
      labels:
        prometheus.io/operator: kube-prometheus
```

**Validation Criteria**:
```bash
# Check Trino cluster status
kubectl get pods -n data-platform -l app.kubernetes.io/name=trino

# Verify coordinator accessibility
kubectl port-forward -n data-platform svc/trino 8080:8080

# Test basic connectivity
curl http://localhost:8080/v1/info
```

**Estimated Duration**: 1-2 days

**Checkpoint & Integration Test Creation**:
After Trino deployment, introspect and validate:
- Connect to the Trino coordinator and execute basic queries
- Verify Iceberg catalog connectivity and table discovery
- Test worker node coordination and query distribution
- Monitor resource usage and JVM performance

```bash
# At this checkpoint, test actual Trino connectivity:
kubectl port-forward -n data-platform svc/trino 8080:8080 &

# Test basic connectivity:
curl http://localhost:8080/v1/info | jq

# Install Trino CLI and test catalog:
kubectl exec -n data-platform deploy/trino-coordinator -- \
  trino --server http://localhost:8080 --catalog iceberg --schema lakehouse \
  --execute "SHOW TABLES;"

# Test basic query execution:
kubectl exec -n data-platform deploy/trino-coordinator -- \
  trino --server http://localhost:8080 --catalog iceberg --schema lakehouse \
  --execute "SELECT COUNT(*) FROM etl_test;"

# Check worker coordination:
kubectl logs -n data-platform -l app.kubernetes.io/component=worker --tail=50

# Monitor resource usage:
kubectl top pods -n data-platform -l app.kubernetes.io/name=trino

# Create integration test based on actual deployment:
./scripts/test-data-platform-trino-deployment.ts --create-integration-test
```

---

### Objective 3.2: Query Performance Validation
**Goal**: Validate analytical query performance and optimize configurations

**Prerequisites**:
- Trino cluster operational
- Sample Iceberg tables with data (from Phase 2)
- Query client (trino-cli or DBeaver)

**Deliverables**:
- [ ] Performance benchmark queries
- [ ] Response time measurements
- [ ] Concurrent query testing
- [ ] Configuration tuning documentation

**Benchmark Query Suite**:
```sql
-- 1. Simple aggregation (target: <2 seconds)
SELECT 
    COUNT(*) as total_records,
    AVG(value) as avg_value,
    MIN(created_at) as min_date,
    MAX(created_at) as max_date
FROM lakehouse.sample_data;

-- 2. Time-based filtering (target: <5 seconds)
SELECT 
    date_trunc('hour', created_at) as hour,
    COUNT(*) as record_count,
    AVG(value) as avg_value
FROM lakehouse.sample_data 
WHERE created_at >= current_timestamp - INTERVAL '7' DAY
GROUP BY date_trunc('hour', created_at)
ORDER BY hour;

-- 3. Multi-table join (target: <10 seconds)
SELECT 
    d.name,
    COUNT(p.id) as process_count,
    SUM(p.value) as total_value
FROM lakehouse.sample_data d
JOIN lakehouse.processed_data p ON d.id = p.source_id
WHERE d.created_at >= current_date - INTERVAL '1' DAY
GROUP BY d.name
ORDER BY total_value DESC;

-- 4. Complex analytics (target: <15 seconds)
WITH daily_stats AS (
    SELECT 
        date(created_at) as day,
        COUNT(*) as daily_count,
        AVG(value) as daily_avg
    FROM lakehouse.sample_data
    WHERE created_at >= current_date - INTERVAL '30' DAY
    GROUP BY date(created_at)
),
moving_avg AS (
    SELECT 
        day,
        daily_count,
        daily_avg,
        AVG(daily_avg) OVER (
            ORDER BY day 
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) as week_moving_avg
    FROM daily_stats
)
SELECT * FROM moving_avg ORDER BY day;
```

**Performance Testing Script**:
```bash
#!/bin/bash
# performance_test.sh - Automated query performance testing

TRINO_HOST="localhost:8080"
RESULTS_FILE="query_performance_$(date +%Y%m%d_%H%M%S).log"

echo "Starting Trino performance tests..." | tee $RESULTS_FILE

# Test queries with timing
for i in {1..4}; do
    echo "Executing benchmark query $i..." | tee -a $RESULTS_FILE
    start_time=$(date +%s.%N)
    
    kubectl exec -n data-platform deploy/trino-coordinator -- \
        trino --server http://localhost:8080 \
        --catalog iceberg \
        --schema lakehouse \
        --file /tmp/benchmark_query_${i}.sql
    
    end_time=$(date +%s.%N)
    duration=$(echo "$end_time - $start_time" | bc)
    echo "Query $i completed in ${duration}s" | tee -a $RESULTS_FILE
done

# Concurrent query test
echo "Testing concurrent queries..." | tee -a $RESULTS_FILE
for i in {1..5}; do
    (
        kubectl exec -n data-platform deploy/trino-coordinator -- \
            trino --server http://localhost:8080 \
            --catalog iceberg \
            --schema lakehouse \
            --execute "SELECT COUNT(*) FROM sample_data WHERE id % $i = 0;"
    ) &
done
wait
echo "Concurrent query test completed" | tee -a $RESULTS_FILE
```

**Validation Criteria**:
```bash
# Run performance tests
./performance_test.sh

# Check query execution metrics
kubectl exec -n data-platform deploy/trino-coordinator -- \
    curl http://localhost:8080/v1/query | jq '.[] | select(.state=="FINISHED") | {queryId, elapsedTime}'

# Monitor resource usage during queries
kubectl top pods -n data-platform --sort-by=memory
```

**Estimated Duration**: 2 days

**Checkpoint & Integration Test Creation**:
After performance validation, test real analytical workloads:
- Execute the full benchmark query suite with real data
- Measure actual response times and compare to targets
- Test concurrent query execution with multiple users
- Monitor memory usage and query queue behavior

```bash
# At this checkpoint, run real performance benchmarks:
# First, create larger test datasets for meaningful benchmarks
kubectl exec -n data-platform deploy/trino-coordinator -- \
  trino --server http://localhost:8080 --catalog iceberg --schema lakehouse \
  --execute "
    CREATE TABLE benchmark_data AS
    SELECT 
      id,
      id % 100 as category,
      random() * 1000 as value,
      current_timestamp - (random() * 30) * INTERVAL '1' DAY as created_at
    FROM UNNEST(sequence(1, 100000)) AS t(id);
  "

# Run benchmark queries and measure performance:
time kubectl exec -n data-platform deploy/trino-coordinator -- \
  trino --server http://localhost:8080 --catalog iceberg --schema lakehouse \
  --execute "SELECT category, COUNT(*), AVG(value) FROM benchmark_data GROUP BY category;"

# Test concurrent queries:
for i in {1..5}; do
  kubectl exec -n data-platform deploy/trino-coordinator -- \
    trino --server http://localhost:8080 --catalog iceberg --schema lakehouse \
    --execute "SELECT COUNT(*) FROM benchmark_data WHERE category = $i;" &
done
wait

# Monitor cluster performance during load:
kubectl top pods -n data-platform --sort-by=memory

# Check query history and performance:
kubectl exec -n data-platform deploy/trino-coordinator -- \
  curl http://localhost:8080/v1/query | jq '.[] | {queryId, elapsedTime, state}'

# Create performance-based integration test:
./scripts/test-data-platform-trino-performance.ts --create-integration-test
```

---

### Objective 3.3: Ceph S3 Select Integration
**Goal**: Enable S3 Select optimization for 2.5x query performance improvement

**Prerequisites**:
- Ceph cluster with S3 Select capability
- Trino cluster with S3 Select configuration
- Parquet data files in S3 storage

**Deliverables**:
- [ ] Ceph S3 Select configuration
- [ ] Trino S3 Select optimization
- [ ] Performance comparison measurements
- [ ] Pushdown predicate validation

**Ceph Configuration Enhancement**:
```yaml
# Ceph configuration for S3 Select
# Add to existing CephObjectStore
apiVersion: ceph.rook.io/v1
kind: CephObjectStore
metadata:
  name: storage
  namespace: storage
spec:
  # ... existing configuration ...
  gateway:
    # Enhanced S3 Select configuration
    instances: 2
    resources:
      requests:
        cpu: "200m"
        memory: "2Gi"
      limits:
        cpu: "1000m"
        memory: "4Gi"
    
    # S3 Select specific settings
    placement:
      nodeAffinity:
        requiredDuringSchedulingIgnoredDuringExecution:
          nodeSelectorTerms:
          - matchExpressions:
            - key: node-role.kubernetes.io/worker
              operator: Exists
    
    # Additional gateway configuration for performance
    config:
      rgw_enable_ops_log: "false"
      rgw_enable_usage_log: "false"
      rgw_max_chunk_size: "4194304"  # 4MB chunks
```

**Enhanced Trino Catalog Configuration**:
```yaml
# Updated catalog configuration with S3 Select optimizations
catalogs:
  iceberg.properties: |
    connector.name=iceberg
    hive.metastore.uri=thrift://hive-metastore:9083
    iceberg.catalog.type=hive_metastore
    
    # S3 configuration
    hive.s3.endpoint=${CEPH_S3_ENDPOINT}
    hive.s3.access-key=${S3_ACCESS_KEY}
    hive.s3.secret-key=${S3_SECRET_KEY}
    hive.s3.path-style-access=true
    hive.s3.ssl.enabled=false
    
    # S3 Select optimization
    hive.s3select-pushdown.enabled=true
    hive.s3select-pushdown.max-connections=20
    hive.s3select-pushdown.experimental-textfile-pushdown-enabled=true
    
    # Performance tuning
    hive.s3.max-connections=500
    hive.s3.max-error-retries=10
    hive.s3.connect-timeout=5s
    hive.s3.socket-timeout=5s
    
    # Pushdown optimizations
    hive.pushdown-filter-enabled=true
    hive.projection-pushdown-enabled=true
    hive.limit-pushdown-enabled=true
```

**S3 Select Performance Test**:
```sql
-- Test queries that benefit from S3 Select pushdown

-- 1. Column projection (should reduce data transfer)
SELECT name, created_at 
FROM lakehouse.large_dataset 
WHERE created_at >= current_date - INTERVAL '1' DAY;

-- 2. Predicate pushdown (should reduce processing)
SELECT COUNT(*) 
FROM lakehouse.large_dataset 
WHERE value > 1000 AND status = 'active';

-- 3. Combined optimizations
SELECT 
    date_trunc('hour', created_at) as hour,
    COUNT(*) as count,
    AVG(value) as avg_value
FROM lakehouse.large_dataset 
WHERE created_at BETWEEN timestamp '2025-01-01' AND timestamp '2025-01-31'
  AND category IN ('A', 'B', 'C')
GROUP BY date_trunc('hour', created_at);
```

**Performance Validation**:
```bash
# Compare query performance with/without S3 Select
# Disable S3 Select temporarily
kubectl patch configmap trino-catalog-iceberg -n data-platform \
  --patch '{"data":{"iceberg.properties":"...\nhive.s3select-pushdown.enabled=false"}}'

# Run benchmark queries and measure
kubectl exec -n data-platform deploy/trino-coordinator -- \
  trino --server http://localhost:8080 --catalog iceberg --schema lakehouse \
  --execute "SELECT COUNT(*) FROM large_dataset WHERE value > 1000;"

# Re-enable S3 Select
kubectl patch configmap trino-catalog-iceberg -n data-platform \
  --patch '{"data":{"iceberg.properties":"...\nhive.s3select-pushdown.enabled=true"}}'

# Run same queries and compare timing
```

**Validation Criteria**:
- [ ] S3 Select operations working (check Ceph logs)
- [ ] Query performance improvement >50% for filtered queries
- [ ] Network transfer reduction visible in monitoring
- [ ] No regression in query correctness

**Estimated Duration**: 1-2 days

**Checkpoint & Integration Test Creation**:
After S3 Select integration, measure actual performance improvements:
- Run before/after performance comparisons with S3 Select
- Validate pushdown operations are working with real queries
- Test network bandwidth reduction during large queries
- Monitor Ceph gateway performance under query load

```bash
# At this checkpoint, test S3 Select performance improvements:
# First, create a large dataset suitable for S3 Select testing
kubectl exec -n data-platform deploy/trino-coordinator -- \
  trino --server http://localhost:8080 --catalog iceberg --schema lakehouse \
  --execute "
    CREATE TABLE large_dataset AS
    SELECT 
      id,
      'category_' || (id % 20) as category,
      'status_' || (id % 5) as status,
      random() * 10000 as value,
      current_timestamp - (random() * 365) * INTERVAL '1' DAY as created_at
    FROM UNNEST(sequence(1, 1000000)) AS t(id);
  "

# Disable S3 Select temporarily and measure baseline:
kubectl patch configmap trino-catalog-iceberg -n data-platform \
  --patch '{"data":{"iceberg.properties":"...\nhive.s3select-pushdown.enabled=false"}}'

# Restart Trino to pick up config change:
kubectl rollout restart deployment/trino-coordinator -n data-platform
kubectl rollout restart deployment/trino-worker -n data-platform

# Run baseline performance test:
time kubectl exec -n data-platform deploy/trino-coordinator -- \
  trino --server http://localhost:8080 --catalog iceberg --schema lakehouse \
  --execute "SELECT category, COUNT(*) FROM large_dataset WHERE value > 5000 GROUP BY category;"

# Re-enable S3 Select:
kubectl patch configmap trino-catalog-iceberg -n data-platform \
  --patch '{"data":{"iceberg.properties":"...\nhive.s3select-pushdown.enabled=true"}}'

# Restart and test optimized performance:
kubectl rollout restart deployment/trino-coordinator -n data-platform
time kubectl exec -n data-platform deploy/trino-coordinator -- \
  trino --server http://localhost:8080 --catalog iceberg --schema lakehouse \
  --execute "SELECT category, COUNT(*) FROM large_dataset WHERE value > 5000 GROUP BY category;"

# Monitor network traffic reduction:
kubectl top pods -n storage -l app=rook-ceph-rgw

# Create S3 Select performance integration test:
./scripts/test-data-platform-s3-select.ts --create-integration-test
```

---

### Objective 3.4: Production Optimization
**Goal**: Fine-tune cluster for production workloads and establish monitoring

**Prerequisites**:
- Trino cluster processing queries successfully
- Performance baseline established
- Monitoring stack operational

**Deliverables**:
- [ ] Production JVM tuning
- [ ] Query queue configuration
- [ ] Resource isolation setup
- [ ] Comprehensive monitoring dashboards

**Production Trino Configuration**:
```yaml
# Production-optimized Trino values
values:
  # Enhanced coordinator configuration
  coordinator:
    jvm:
      maxHeapSize: "8G"
      gcMethod:
        type: "UseG1GC"
        g1:
          heapRegionSize: "32M"
      additionalJvmConfig:
        - "-XX:+UseStringDeduplication"
        - "-XX:+OptimizeStringConcat"
        - "-XX:+UseCompressedOops"
        - "-XX:ReservedCodeCacheSize=512M"
    
    config:
      # Query management
      query.max-queued-queries: 1000
      query.max-concurrent-queries: 100
      query.max-run-time: "24h"
      query.max-execution-time: "12h"
      
      # Memory management
      query.low-memory-killer.delay: "5m"
      query.low-memory-killer.policy: "total-reservation-on-blocked-nodes"
      
      # Fault tolerance
      retry-policy: "QUERY"
      query-retry-attempts: 3
  
  # Enhanced worker configuration
  worker:
    config:
      # Memory management
      query.max-memory-per-node: "20GB"
      memory.heap-headroom-per-node: "2GB"
      
      # Spilling configuration
      spill-enabled: true
      spiller-spill-path: "/tmp/spill"
      spill-compression-enabled: true
      
      # Exchange configuration
      exchange.max-buffer-size: "64MB"
      exchange.concurrent-request-multiplier: 3
      
      # Task configuration
      task.max-worker-threads: 64
      task.min-drivers: 8
```

**Monitoring Dashboard Configuration**:
```yaml
# Grafana dashboard for Trino monitoring
apiVersion: v1
kind: ConfigMap
metadata:
  name: trino-dashboard
  namespace: monitoring
data:
  trino-metrics.json: |
    {
      "dashboard": {
        "title": "Trino Analytics Platform",
        "panels": [
          {
            "title": "Query Performance",
            "targets": [
              {
                "expr": "trino_query_execution_time_seconds",
                "legendFormat": "Query Execution Time"
              }
            ]
          },
          {
            "title": "Memory Usage",
            "targets": [
              {
                "expr": "trino_memory_pool_total_bytes",
                "legendFormat": "Total Memory"
              },
              {
                "expr": "trino_memory_pool_reserved_bytes", 
                "legendFormat": "Reserved Memory"
              }
            ]
          },
          {
            "title": "Active Queries",
            "targets": [
              {
                "expr": "trino_query_manager_running_queries",
                "legendFormat": "Running Queries"
              },
              {
                "expr": "trino_query_manager_queued_queries",
                "legendFormat": "Queued Queries"
              }
            ]
          }
        ]
      }
    }
```

**Alert Rules**:
```yaml
# Prometheus alert rules for Trino
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: trino-alerts
  namespace: monitoring
spec:
  groups:
  - name: trino.rules
    rules:
    - alert: TrinoHighQueryLatency
      expr: trino_query_execution_time_seconds > 300
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "Trino query taking too long"
        description: "Query execution time exceeded 5 minutes"
    
    - alert: TrinoHighMemoryUsage
      expr: (trino_memory_pool_reserved_bytes / trino_memory_pool_total_bytes) > 0.9
      for: 2m
      labels:
        severity: critical
      annotations:
        summary: "Trino memory usage critical"
        description: "Memory usage exceeded 90%"
    
    - alert: TrinoWorkerDown
      expr: up{job="trino-worker"} == 0
      for: 1m
      labels:
        severity: critical
      annotations:
        summary: "Trino worker node down"
        description: "Worker node is not responding"
```

**Validation Criteria**:
```bash
# Test production configuration
kubectl apply -f production-trino-config.yaml

# Validate performance improvements
./performance_test.sh > production_results.log

# Check monitoring dashboard
kubectl port-forward -n monitoring svc/grafana 3000:80
# Access: http://localhost:3000/d/trino-dashboard

# Verify alerting
kubectl get prometheusrule -n monitoring trino-alerts
```

**Estimated Duration**: 2-3 days

**Checkpoint & Integration Test Creation**:
After production optimization, validate enterprise-ready deployment:
- Test production JVM settings under sustained load
- Verify monitoring dashboards show real metrics from query workloads
- Test alert rules by simulating failure conditions
- Validate query queue and resource isolation under pressure

```bash
# At this checkpoint, stress test the production configuration:
# Create sustained query workload
for i in {1..20}; do
  kubectl exec -n data-platform deploy/trino-coordinator -- \
    trino --server http://localhost:8080 --catalog iceberg --schema lakehouse \
    --execute "
      SELECT 
        category,
        status,
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as record_count,
        AVG(value) as avg_value,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value) as median_value
      FROM large_dataset 
      WHERE created_at >= current_timestamp - INTERVAL '90' DAY
      GROUP BY category, status, DATE_TRUNC('month', created_at)
      ORDER BY month, category, status;
    " &
done

# Monitor system under load:
kubectl top pods -n data-platform
kubectl top nodes

# Check query queue and memory management:
kubectl exec -n data-platform deploy/trino-coordinator -- \
  curl http://localhost:8080/v1/cluster | jq '.runningQueries, .blockedQueries, .queuedQueries'

# Verify monitoring dashboards have real data:
kubectl port-forward -n monitoring svc/grafana 3000:80 &
# Check Trino dashboard shows active queries and resource usage

# Test alert rules by creating resource pressure:
kubectl exec -n data-platform deploy/trino-coordinator -- \
  trino --server http://localhost:8080 --catalog iceberg --schema lakehouse \
  --execute "SELECT COUNT(*) FROM large_dataset, large_dataset;" # This should trigger memory alerts

# Wait for alerts to fire and verify alert manager:
kubectl get prometheusrule -n monitoring trino-alerts -o yaml

# Create production readiness integration test:
./scripts/test-data-platform-production-ready.ts --create-integration-test
```

**Phase 3 Completion Integration Test**:
At the end of Phase 3, create a comprehensive analytics platform test:

```bash
# Create end-to-end Phase 3 integration test:
./scripts/test-data-platform-phase3.ts --create-integration-test

# This test should validate:
# - Trino cluster handling concurrent analytical workloads
# - Real query performance meeting SLA targets
# - S3 Select optimization providing measurable improvements
# - Production monitoring and alerting working with real data
# - Resource management under sustained analytical load
```

## Phase 3 Success Criteria

### Technical Validation
- [ ] Trino cluster processing concurrent analytical queries
- [ ] Query response times meeting targets (<10s for 10GB datasets)
- [ ] S3 Select optimization achieving 2.5x performance improvement
- [ ] Production monitoring and alerting operational

### Performance Metrics
- [ ] Simple aggregations: <2 seconds
- [ ] Time-based filtering: <5 seconds  
- [ ] Multi-table joins: <10 seconds
- [ ] Complex analytics: <15 seconds
- [ ] Concurrent queries (5+) processing successfully

### Integration Validation
- [ ] Iceberg catalog fully functional
- [ ] Hive Metastore integration stable
- [ ] S3 storage operations optimized
- [ ] Monitoring capturing query metrics

## Resource Allocation

### Memory Requirements (Total for Phase 3)
- Trino coordinator: 10GB RAM
- Trino workers: 52GB RAM (26GB x 2)
- Enhanced Ceph gateways: 8GB RAM
- **Total Phase 3**: ~70GB RAM (Phase 1+2+3 total)

### CPU Requirements
- Trino coordinator: 2000m CPU
- Trino workers: 8000m CPU (4000m x 2)
- Enhanced Ceph gateways: 2000m CPU
- **Total Phase 3**: ~12 CPU cores

### Storage Requirements
- Query spilling: 200GB temporary storage
- Enhanced metadata: 50GB
- **Additional Phase 3**: ~250GB

## Troubleshooting Guide

### Common Issues

**Query Performance Problems**:
```bash
# Check worker resource utilization
kubectl top pods -n data-platform -l app.kubernetes.io/component=worker

# Analyze slow queries
kubectl exec -n data-platform deploy/trino-coordinator -- \
  curl http://localhost:8080/v1/query | jq '.[] | select(.elapsedTime > 10000)'

# Check for spilling
kubectl exec -n data-platform deploy/trino-worker-0 -- ls -la /tmp/spill/
```

**Memory Issues**:
```bash
# Monitor memory usage
kubectl exec -n data-platform deploy/trino-coordinator -- \
  curl http://localhost:8080/v1/memory

# Check for OOMKilled pods
kubectl get events -n data-platform | grep OOMKilled

# Adjust memory configuration
kubectl patch helmrelease trino -n data-platform --patch '...'
```

**S3 Select Problems**:
```bash
# Check Ceph gateway logs
kubectl logs -n storage -l app=rook-ceph-rgw --tail=100

# Verify S3 Select capability
kubectl exec -n storage deploy/rook-ceph-tools -- \
  radosgw-admin caps list --uid=trino-user

# Test S3 Select directly
aws s3api --endpoint-url ${CEPH_S3_ENDPOINT} \
  select-object-content --bucket iceberg-test \
  --key sample.parquet --expression "SELECT * FROM S3Object"
```

## Next Steps

Upon successful completion of Phase 3:

1. **End-to-End Validation**: Test complete data pipeline workflows
2. **Performance Optimization**: Fine-tune based on real workload patterns  
3. **Documentation**: Complete operational runbooks and user guides
4. **Production Readiness**: Implement backup/recovery and scaling procedures

**Next Phase**: `04-production.md` - Production readiness and optimization