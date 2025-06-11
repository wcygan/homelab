# Phase 2: Compute Platform

## Overview

Deploy and configure Apache Spark Operator for distributed data processing capabilities. This phase enables ETL workloads, batch processing, and integration with existing Airflow orchestration while building on the metadata foundation from Phase 1.

## Objectives

### Objective 2.1: Spark Operator Installation
**Goal**: Deploy Kubeflow Spark Operator for managing Spark application lifecycle

**Prerequisites**:
- Kubernetes cluster with sufficient resources (24GB RAM available)
- Helm repository access to Kubeflow charts
- RBAC permissions for operator deployment

**Deliverables**:
- [ ] Spark Operator Helm configuration
- [ ] Webhook and admission controller setup
- [ ] RBAC and service account configuration
- [ ] Monitoring integration with Prometheus

**Implementation Pattern**:
```yaml
# kubernetes/apps/data-platform/spark-operator/app/helmrelease.yaml
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: spark-operator
  namespace: data-platform
spec:
  interval: 15m
  chart:
    spec:
      chart: spark-operator
      version: "1.1.27"
      sourceRef:
        kind: HelmRepository
        name: kubeflow
        namespace: flux-system
  values:
    image:
      repository: ghcr.io/kubeflow/spark-operator
      tag: v1.1.27
    
    # Enable monitoring
    metrics:
      enable: true
      port: 10254
    
    # Webhook configuration
    webhook:
      enable: true
      port: 8080
    
    # Resource allocation
    resources:
      requests:
        cpu: 100m
        memory: 300Mi
      limits:
        cpu: 200m
        memory: 512Mi
    
    # ServiceMonitor for Prometheus
    serviceMonitor:
      enable: true
      labels:
        prometheus.io/operator: kube-prometheus
```

**Validation Criteria**:
```bash
# Check operator deployment
kubectl get deployment -n data-platform spark-operator

# Verify CRDs installation
kubectl get crd | grep spark

# Test webhook functionality
kubectl get validatingwebhookconfiguration spark-operator-webhook
```

**Estimated Duration**: 1 day

**Checkpoint & Integration Test Creation**:
After Spark Operator deployment, introspect and validate:
- Submit a simple SparkApplication CRD and watch its lifecycle
- Verify operator webhook functionality with invalid submissions
- Check metrics endpoint and Prometheus integration
- Document actual resource usage and scaling behavior

```bash
# At this checkpoint, test the operator with a simple job:
kubectl apply -f - <<EOF
apiVersion: sparkoperator.k8s.io/v1beta2
kind: SparkApplication
metadata:
  name: spark-pi-test
  namespace: data-platform
spec:
  type: Scala
  mode: cluster
  image: apache/spark:v3.4.0
  mainClass: org.apache.spark.examples.SparkPi
  driver:
    cores: 1
    memory: 512m
  executor:
    cores: 1
    instances: 1
    memory: 512m
  timeToLiveSeconds: 300
EOF

# Watch the job lifecycle:
kubectl get sparkapplication spark-pi-test -n data-platform -w

# Verify operator metrics:
kubectl port-forward -n data-platform svc/spark-operator-metrics 10254:10254 &
curl http://localhost:10254/metrics | grep spark_

# Create integration test based on actual operator behavior:
./scripts/test-data-platform-spark-operator.ts --create-integration-test
```

---

### Objective 2.2: Basic Spark Job Execution
**Goal**: Execute sample PySpark applications via SparkApplication CRDs

**Prerequisites**:
- Spark Operator operational
- S3 credentials configured
- Container image registry access

**Deliverables**:
- [ ] Sample PySpark application manifests
- [ ] S3 integration test jobs
- [ ] Resource allocation examples
- [ ] Job monitoring and logging setup

**Implementation Examples**:
```yaml
# kubernetes/apps/data-platform/examples/sample-spark-job.yaml
apiVersion: sparkoperator.k8s.io/v1beta2
kind: SparkApplication
metadata:
  name: sample-etl-job
  namespace: data-platform
spec:
  type: Python
  pythonVersion: "3"
  mode: cluster
  image: apache/spark-py:v3.4.0
  
  # Main application file from S3
  mainApplicationFile: s3a://iceberg-test/apps/sample_etl.py
  
  # Spark configuration
  sparkConf:
    "spark.sql.extensions": "org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions"
    "spark.sql.catalog.spark_catalog": "org.apache.iceberg.spark.SparkSessionCatalog"
    "spark.sql.catalog.spark_catalog.type": "hive"
    "spark.sql.catalog.spark_catalog.uri": "thrift://hive-metastore:9083"
    "spark.hadoop.fs.s3a.endpoint": "${CEPH_S3_ENDPOINT}"
    "spark.hadoop.fs.s3a.access.key": "${S3_ACCESS_KEY}"
    "spark.hadoop.fs.s3a.secret.key": "${S3_SECRET_KEY}"
    "spark.hadoop.fs.s3a.path.style.access": "true"
  
  # Driver configuration
  driver:
    cores: 1
    coreLimit: "1200m"
    memory: "2g"
    serviceAccount: spark-operator-spark
    
  # Executor configuration  
  executor:
    cores: 1
    instances: 2
    memory: "2g"
    
  # Monitoring
  monitoring:
    exposeDriverMetrics: true
    exposeExecutorMetrics: true
    prometheus:
      jmxExporterJar: "/opt/spark/examples/jars/jmx_prometheus_javaagent-0.17.0.jar"
```

**Sample PySpark Application**:
```python
# sample_etl.py - Simple ETL job for testing
from pyspark.sql import SparkSession

def main():
    spark = SparkSession.builder \
        .appName("SampleETLJob") \
        .getOrCreate()
    
    # Read from S3 or create sample data
    df = spark.range(1000).select(
        col("id"),
        (col("id") * 2).alias("value"),
        current_timestamp().alias("created_at")
    )
    
    # Write to Iceberg table
    df.write \
        .format("iceberg") \
        .mode("append") \
        .saveAsTable("lakehouse.sample_etl_output")
    
    print(f"Processed {df.count()} records")
    spark.stop()

if __name__ == "__main__":
    main()
```

**Validation Criteria**:
```bash
# Submit test job
kubectl apply -f sample-spark-job.yaml

# Monitor job execution
kubectl get sparkapplication -n data-platform
kubectl describe sparkapplication sample-etl-job -n data-platform

# Check driver and executor logs
kubectl logs -n data-platform sample-etl-job-driver
```

**Estimated Duration**: 2-3 days

**Checkpoint & Integration Test Creation**:
After basic Spark jobs are running, test and introspect:
- Execute a real PySpark job that reads/writes data to S3
- Monitor resource usage and job performance metrics
- Test job failure and restart scenarios
- Validate log collection and monitoring integration

```bash
# At this checkpoint, run a real data processing job:
kubectl apply -f - <<EOF
apiVersion: sparkoperator.k8s.io/v1beta2
kind: SparkApplication
metadata:
  name: data-processing-test
  namespace: data-platform
spec:
  type: Python
  mode: cluster
  image: apache/spark-py:v3.4.0
  mainApplicationFile: local:///opt/spark/examples/src/main/python/wordcount.py
  arguments:
    - "/opt/spark/README.md"
  driver:
    cores: 1
    memory: 1g
  executor:
    cores: 1
    instances: 2
    memory: 1g
  timeToLiveSeconds: 600
EOF

# Monitor job execution and resource usage:
kubectl get sparkapplication data-processing-test -n data-platform -o yaml
kubectl logs -n data-platform data-processing-test-driver

# Check executor scaling and resource allocation:
kubectl get pods -n data-platform -l spark-role=executor

# Create integration test based on actual job execution patterns:
./scripts/test-data-platform-spark-jobs.ts --create-integration-test
```

---

### Objective 2.3: Iceberg Integration
**Goal**: Configure Spark jobs to read/write Iceberg tables efficiently

**Prerequisites**:
- Hive Metastore operational (from Phase 1)
- S3 storage accessible
- Spark Operator managing jobs successfully

**Deliverables**:
- [ ] Iceberg-enabled Spark configuration
- [ ] Sample read/write operations
- [ ] Schema evolution examples
- [ ] Performance optimization settings

**Advanced Spark Configuration**:
```yaml
# Enhanced SparkApplication with Iceberg optimizations
apiVersion: sparkoperator.k8s.io/v1beta2
kind: SparkApplication
metadata:
  name: iceberg-data-processing
spec:
  # ... (basic config from 2.2)
  
  sparkConf:
    # Iceberg optimizations
    "spark.sql.iceberg.handle-timestamp-without-timezone": "true"
    "spark.sql.iceberg.check-nullability": "false"
    "spark.sql.adaptive.enabled": "true"
    "spark.sql.adaptive.coalescePartitions.enabled": "true"
    
    # S3 optimizations
    "spark.hadoop.fs.s3a.multipart.size": "104857600"  # 100MB
    "spark.hadoop.fs.s3a.fast.upload": "true"
    "spark.hadoop.fs.s3a.block.size": "134217728"     # 128MB
    
    # Memory optimizations
    "spark.sql.execution.arrow.pyspark.enabled": "true"
    "spark.serializer": "org.apache.spark.serializer.KryoSerializer"
  
  # Dependencies for Iceberg
  deps:
    jars:
      - s3a://iceberg-test/jars/iceberg-spark-runtime-3.4_2.12-1.3.1.jar
      - s3a://iceberg-test/jars/hadoop-aws-3.3.4.jar
```

**Advanced PySpark Operations**:
```python
# iceberg_operations.py - Advanced Iceberg operations
from pyspark.sql import SparkSession
from pyspark.sql.functions import *

def main():
    spark = SparkSession.builder \
        .appName("IcebergOperations") \
        .getOrCreate()
    
    # Schema evolution example
    spark.sql("""
        ALTER TABLE lakehouse.sample_data 
        ADD COLUMNS (email STRING, status STRING DEFAULT 'active')
    """)
    
    # Time travel query
    df_v1 = spark.sql("""
        SELECT * FROM lakehouse.sample_data 
        VERSION AS OF 1
    """)
    
    # Incremental processing
    latest_df = spark.sql("""
        SELECT * FROM lakehouse.sample_data 
        WHERE created_at > current_timestamp() - INTERVAL 1 DAY
    """)
    
    # Write with partitioning
    processed_df = latest_df.withColumn("year", year("created_at"))
    processed_df.write \
        .format("iceberg") \
        .mode("append") \
        .partitionBy("year") \
        .saveAsTable("lakehouse.processed_data")
    
    # Table maintenance
    spark.sql("CALL system.rewrite_data_files('lakehouse.processed_data')")
    spark.sql("CALL system.expire_snapshots('lakehouse.processed_data', TIMESTAMP '2024-01-01 00:00:00')")

if __name__ == "__main__":
    main()
```

**Validation Criteria**:
```bash
# Test Iceberg operations
kubectl apply -f iceberg-operations-job.yaml

# Verify table updates
kubectl exec -n data-platform deploy/hive-metastore -- \
  beeline -u "jdbc:hive2://localhost:10000" -e "DESCRIBE lakehouse.sample_data;"

# Check performance metrics
kubectl logs -n data-platform iceberg-data-processing-driver | grep "Job.*completed"
```

**Estimated Duration**: 2 days

**Checkpoint & Integration Test Creation**:
After Iceberg integration, test real table operations:
- Execute Spark jobs that create and populate Iceberg tables
- Test schema evolution by modifying existing tables
- Verify time travel functionality with real data snapshots
- Measure performance with different data sizes and formats

```bash
# At this checkpoint, run real Iceberg operations:
kubectl apply -f - <<EOF
apiVersion: sparkoperator.k8s.io/v1beta2
kind: SparkApplication
metadata:
  name: iceberg-etl-test
  namespace: data-platform
spec:
  type: Python
  mode: cluster
  image: apache/spark-py:v3.4.0
  mainApplicationFile: |
    from pyspark.sql import SparkSession
    
    spark = SparkSession.builder.appName("IcebergTest").getOrCreate()
    
    # Create test data
    df = spark.range(1000).select(
        col("id"),
        (col("id") % 10).alias("category"),
        current_timestamp().alias("created_at")
    )
    
    # Write to Iceberg table
    df.write.format("iceberg").mode("overwrite").saveAsTable("lakehouse.etl_test")
    
    # Read back and verify
    result = spark.table("lakehouse.etl_test").count()
    print(f"Created table with {result} records")
    
    spark.stop()
  driver:
    cores: 1
    memory: 2g
  executor:
    cores: 1
    instances: 2
    memory: 2g
  sparkConf:
    "spark.sql.extensions": "org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions"
    "spark.sql.catalog.spark_catalog": "org.apache.iceberg.spark.SparkSessionCatalog"
    "spark.sql.catalog.spark_catalog.type": "hive"
    "spark.sql.catalog.spark_catalog.uri": "thrift://hive-metastore:9083"
EOF

# Monitor Iceberg table creation:
kubectl logs -n data-platform iceberg-etl-test-driver

# Verify table exists in metastore:
kubectl exec -n data-platform deploy/hive-metastore -- \
  beeline -u "jdbc:hive2://localhost:10000" -e "SHOW TABLES IN lakehouse;"

# Check S3 storage structure:
aws s3 --endpoint-url ${CEPH_S3_ENDPOINT} ls s3://iceberg-test/etl_test/ --recursive

# Create integration test for Iceberg operations:
./scripts/test-data-platform-iceberg-spark.ts --create-integration-test
```

---

### Objective 2.4: Airflow Integration
**Goal**: Integrate Spark jobs with existing Airflow orchestration

**Prerequisites**:
- Airflow deployment with KubernetesExecutor
- SparkKubernetesOperator available
- Spark Operator functional

**Deliverables**:
- [ ] SparkKubernetesOperator configuration
- [ ] Sample DAG with Spark job submission
- [ ] Error handling and retry logic
- [ ] Job monitoring integration

**Airflow DAG Example**:
```python
# dags/data_pipeline_dag.py
from datetime import datetime, timedelta
from airflow import DAG
from airflow.providers.cncf.kubernetes.operators.spark_kubernetes import SparkKubernetesOperator
from airflow.providers.cncf.kubernetes.sensors.spark_kubernetes import SparkKubernetesSensor

default_args = {
    'owner': 'data-platform',
    'depends_on_past': False,
    'start_date': datetime(2025, 1, 1),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'data_pipeline',
    default_args=default_args,
    description='Daily data processing pipeline',
    schedule_interval=timedelta(days=1),
    catchup=False,
)

# Extract data from source
extract_task = SparkKubernetesOperator(
    task_id='extract_data',
    namespace='data-platform',
    application_file='s3a://iceberg-test/dags/extract_job.yaml',
    dag=dag,
)

# Transform and load into Iceberg
transform_task = SparkKubernetesOperator(
    task_id='transform_data',
    namespace='data-platform',
    application_file='s3a://iceberg-test/dags/transform_job.yaml',
    dag=dag,
)

# Wait for completion and validate
validate_sensor = SparkKubernetesSensor(
    task_id='validate_completion',
    namespace='data-platform',
    application_name="{{ task_instance.xcom_pull(task_ids='transform_data') }}",
    dag=dag,
)

extract_task >> transform_task >> validate_sensor
```

**SparkApplication Template for Airflow**:
```yaml
# transform_job.yaml - Template for Airflow submission
apiVersion: sparkoperator.k8s.io/v1beta2
kind: SparkApplication
metadata:
  name: "transform-{{ ds_nodash }}"  # Date-based naming
  namespace: data-platform
spec:
  type: Python
  mode: cluster
  image: apache/spark-py:v3.4.0
  mainApplicationFile: s3a://iceberg-test/apps/transform.py
  
  # Parameterized execution
  arguments:
    - "--date={{ ds }}"
    - "--input-table=lakehouse.raw_data"
    - "--output-table=lakehouse.processed_data"
  
  # Resource allocation
  driver:
    cores: 1
    memory: "2g"
  executor:
    cores: 1
    instances: 3
    memory: "4g"
  
  # Auto-cleanup after completion
  timeToLiveSeconds: 3600
```

**Validation Criteria**:
```bash
# Deploy DAG to Airflow
kubectl cp data_pipeline_dag.py airflow-scheduler:/opt/airflow/dags/

# Trigger manual execution
kubectl exec -n airflow deploy/airflow-scheduler -- \
  airflow dags trigger data_pipeline

# Monitor execution
kubectl exec -n airflow deploy/airflow-webserver -- \
  airflow tasks list data_pipeline --tree
```

**Estimated Duration**: 1-2 days

**Checkpoint & Integration Test Creation**:
After Airflow integration, test end-to-end orchestration:
- Deploy and trigger a real Airflow DAG that submits Spark jobs
- Monitor DAG execution and Spark job lifecycle integration
- Test failure scenarios and retry mechanisms
- Validate Spark job monitoring within Airflow UI

```bash
# At this checkpoint, test real Airflow + Spark integration:
kubectl cp test-dag.py airflow-scheduler-pod:/opt/airflow/dags/

# Trigger the DAG:
kubectl exec -n airflow deploy/airflow-scheduler -- \
  airflow dags trigger spark_integration_test

# Monitor execution:
kubectl exec -n airflow deploy/airflow-scheduler -- \
  airflow tasks list spark_integration_test --tree

# Check Spark job was created and completed:
kubectl get sparkapplications -n data-platform

# Verify data pipeline results:
kubectl exec -n data-platform deploy/hive-metastore -- \
  beeline -u "jdbc:hive2://localhost:10000" -e "SELECT COUNT(*) FROM lakehouse.pipeline_output;"

# Create integration test for complete orchestration:
./scripts/test-data-platform-airflow-spark.ts --create-integration-test
```

**Phase 2 Completion Integration Test**:
At the end of Phase 2, create a comprehensive test validating the entire compute platform:

```bash
# Create end-to-end Phase 2 integration test:
./scripts/test-data-platform-phase2.ts --create-integration-test

# This test should validate:
# - Spark Operator managing complex job lifecycles
# - Real data processing with Iceberg table operations
# - Airflow orchestration of multi-step data pipelines
# - Resource management and performance under load
# - Error handling and recovery scenarios
```

## Phase 2 Success Criteria

### Technical Validation
- [ ] Spark Operator managing application lifecycle successfully
- [ ] PySpark jobs reading/writing Iceberg tables efficiently
- [ ] Airflow orchestrating Spark jobs with proper error handling
- [ ] Resource utilization within planned limits (50% cluster capacity)

### Performance Metrics
- [ ] Spark job startup time under 2 minutes
- [ ] Data processing throughput exceeds 100MB/minute
- [ ] Resource scaling working (executor auto-scaling)
- [ ] Job completion rates above 95%

### Integration Validation
- [ ] Hive Metastore integration functional
- [ ] S3 storage operations optimized
- [ ] Monitoring capturing all job metrics
- [ ] Airflow DAGs executing scheduled workloads

## Resource Allocation

### Memory Requirements
- Spark Operator: 512MB RAM
- Driver pods: 2GB each (max 3 concurrent)
- Executor pods: 4GB each (max 9 concurrent)
- **Total Phase 2**: ~42GB RAM (includes Phase 1)

### CPU Requirements
- Spark Operator: 200m CPU
- Driver pods: 1000m each
- Executor pods: 1000m each
- **Total Phase 2**: ~12 CPU cores (includes Phase 1)

### Storage Requirements
- Application artifacts: 20GB
- Temporary processing: 100GB
- **Additional Phase 2**: ~120GB

## Troubleshooting Guide

### Common Issues

**Spark Job Submission Failures**:
```bash
# Check operator logs
kubectl logs -n data-platform deploy/spark-operator

# Verify RBAC permissions
kubectl auth can-i create pods --as=system:serviceaccount:data-platform:spark-operator-spark

# Test resource availability
kubectl describe nodes | grep -A 10 "Allocated resources"
```

**S3 Connection Issues**:
```bash
# Test S3 connectivity from Spark pod
kubectl run s3-test --rm -it --image=apache/spark-py:v3.4.0 \
  -- python -c "
import boto3
s3 = boto3.client('s3', endpoint_url='${CEPH_S3_ENDPOINT}')
print(s3.list_buckets())
"
```

**Memory/Resource Constraints**:
```bash
# Monitor resource usage during jobs
kubectl top pods -n data-platform --sort-by=memory

# Check for OOMKilled pods
kubectl get events -n data-platform | grep OOMKilled

# Adjust resource allocations in SparkApplication
```

## Next Steps

Upon successful completion of Phase 2:

1. **Performance Validation**: Run benchmark jobs to validate throughput
2. **Resource Optimization**: Fine-tune executor configurations
3. **Monitoring Enhancement**: Add custom metrics and alerting
4. **Phase 3 Preparation**: Plan Trino cluster deployment

**Next Phase**: `03-analytics.md` - Deploy Trino for interactive analytics