# Spark Application Monitoring Guide

## Overview

This guide covers monitoring and logging setup for Spark applications running on the Spark Operator.

## Monitoring Methods

### 1. Spark UI Access

For running jobs, access the Spark UI through port-forwarding:

```bash
# Get the driver pod name
DRIVER_POD=$(kubectl get pods -n data-platform -l spark-role=driver -o jsonpath='{.items[0].metadata.name}')

# Port-forward to access Spark UI
kubectl port-forward -n data-platform $DRIVER_POD 4040:4040

# Access at http://localhost:4040
```

### 2. Event Logging

All Spark applications are configured to write event logs to S3:

```yaml
sparkConf:
  spark.eventLog.enabled: "true"
  spark.eventLog.dir: "s3a://iceberg-test/spark-events"
```

View historical job data using Spark History Server:

```bash
# Deploy Spark History Server (one-time setup)
kubectl apply -f spark-history-server.yaml

# Access History Server
kubectl port-forward -n data-platform svc/spark-history-server 18080:18080
```

### 3. Application Logs

#### Driver Logs
```bash
# Get logs for a specific SparkApplication
kubectl logs -n data-platform -l sparkoperator.k8s.io/app-name=<app-name> -c spark-kubernetes-driver

# Follow logs in real-time
kubectl logs -n data-platform -l sparkoperator.k8s.io/app-name=<app-name> -c spark-kubernetes-driver -f
```

#### Executor Logs
```bash
# List executor pods
kubectl get pods -n data-platform -l spark-role=executor

# Get logs from specific executor
kubectl logs -n data-platform <executor-pod-name>
```

### 4. Prometheus Metrics

Spark applications expose metrics in Prometheus format:

```yaml
driver:
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "4040"
    prometheus.io/path: "/metrics/executors/prometheus"
```

Key metrics to monitor:
- `spark_executor_cpuTime` - CPU time used by executors
- `spark_executor_memoryUsed` - Memory usage
- `spark_executor_diskUsed` - Disk usage
- `spark_job_duration` - Job execution time
- `spark_stage_failedStages` - Failed stages count

### 5. SparkApplication Status

Check application status:

```bash
# Get all SparkApplications
kubectl get sparkapplication -n data-platform

# Describe specific application
kubectl describe sparkapplication -n data-platform <app-name>

# Watch application status
kubectl get sparkapplication -n data-platform -w
```

Status phases:
- `SUBMITTED` - Application submitted to cluster
- `RUNNING` - Application is executing
- `COMPLETED` - Application finished successfully
- `FAILED` - Application failed
- `SUBMISSION_FAILED` - Failed to submit application

## Common Issues and Debugging

### 1. Application Stuck in SUBMITTED

Check operator logs:
```bash
kubectl logs -n data-platform deployment/spark-operator-controller
```

### 2. Driver Pod Crash

Check driver pod events:
```bash
kubectl describe pod -n data-platform <driver-pod-name>
```

### 3. Executor Failures

Check executor logs and events:
```bash
# Get failed executor pods
kubectl get pods -n data-platform -l spark-role=executor --field-selector=status.phase=Failed

# Check events
kubectl get events -n data-platform --field-selector involvedObject.name=<executor-pod-name>
```

### 4. S3 Access Issues

Verify credentials:
```bash
# Check if secret is mounted
kubectl describe pod -n data-platform <driver-pod-name> | grep -A5 "Mounts:"

# Test S3 access from pod
kubectl exec -n data-platform <driver-pod-name> -- env | grep AWS
```

## Performance Tuning

### Memory Configuration
```yaml
sparkConf:
  spark.executor.memory: "4g"
  spark.executor.memoryOverhead: "1g"
  spark.driver.memory: "2g"
  spark.driver.memoryOverhead: "512m"
```

### Parallelism
```yaml
sparkConf:
  spark.default.parallelism: "100"
  spark.sql.shuffle.partitions: "200"
```

### Dynamic Allocation
```yaml
dynamicAllocation:
  enabled: true
  initialExecutors: 2
  minExecutors: 1
  maxExecutors: 10
```

## Logging Best Practices

1. **Structured Logging**: Use JSON format for easier parsing
2. **Log Levels**: Set appropriate log levels to avoid noise
3. **Log Retention**: Configure S3 lifecycle policies for event logs
4. **Correlation IDs**: Include job IDs in logs for tracing

Example logging configuration:
```yaml
sparkConf:
  spark.driver.extraJavaOptions: "-Dlog4j.configuration=file:///opt/spark/conf/log4j.properties"
  spark.executor.extraJavaOptions: "-Dlog4j.configuration=file:///opt/spark/conf/log4j.properties"
```