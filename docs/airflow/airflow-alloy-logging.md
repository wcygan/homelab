# Airflow Logging with Alloy and Loki

## Overview

This document describes the production logging solution for Apache Airflow in our Kubernetes cluster. We use a unified logging pipeline where Airflow logs flow through Alloy (log collector) to Loki (log aggregator) and are stored in S3-compatible Ceph storage.

## Architecture

```
[Airflow Pods] ── stdout/stderr ──► [Alloy DaemonSet] ──► [Loki] ──► [Ceph S3]
                                            │
                                            └──► [Grafana] (visualization)
```

### Key Benefits

- **Zero Airflow Changes**: Works with existing Airflow deployment
- **Unified Pipeline**: Same logging infrastructure as entire cluster
- **Persistent Storage**: Logs survive pod termination
- **Rich Metadata**: Automatic extraction of DAG ID, task ID, and execution date
- **Cost Effective**: Loki's label-based indexing minimizes storage costs

## Implementation

### 1. Alloy Configuration

The Alloy DaemonSet is configured to provide special processing for Airflow logs. The configuration extracts structured data from Airflow's log format.

**Location**: `kubernetes/apps/monitoring/alloy/app/helmrelease.yaml`

```hcl
// Special processing for Airflow logs
stage.match {
  selector = "{namespace=\"airflow\"}"
  
  // Extract Airflow-specific information from log messages
  stage.regex {
    expression = "\\[(?P<timestamp>[^\\]]+)\\] \\{(?P<source>[^}]+)\\}"
  }
  
  // Extract DAG ID from log content
  stage.regex {
    expression = "dag_id=(?P<dag_id>[\\w-]+)"
  }
  
  // Extract task ID from log content
  stage.regex {
    expression = "task_id=(?P<task_id>[\\w-]+)"
  }
  
  // Extract execution date from log content
  stage.regex {
    expression = "execution_date=(?P<execution_date>[\\d-]+T[\\d:+]+)"
  }
  
  // Add Airflow-specific labels if found
  stage.labels {
    values = {
      dag_id = "",
      task_id = "",
      execution_date = "",
    }
  }
}
```

### 2. Loki Storage

Loki stores logs in Ceph S3 with the following configuration:

- **Bucket**: `loki-logs` (manually configured)
- **Retention**: 30 days (720 hours)
- **Endpoint**: `http://rook-ceph-rgw-storage.storage.svc.cluster.local`

### 3. Airflow Configuration

No changes required to Airflow! The existing configuration works as-is:

```yaml
config:
  logging:
    remote_logging: "False"  # Local logging, collected by Alloy
    logging_level: "INFO"
```

## Querying Logs

### Using LogCLI

```bash
# All Airflow logs
./scripts/logcli-wrapper.ts query '{namespace="airflow"}' --limit=100

# Logs for specific DAG
./scripts/logcli-wrapper.ts query '{namespace="airflow"} |= "dag_id=hello_world"' --limit=50

# Failed tasks
./scripts/logcli-wrapper.ts query '{namespace="airflow"} |= "ERROR"' --limit=20

# Logs with extracted labels (once label extraction is working)
./scripts/logcli-wrapper.ts query '{namespace="airflow", dag_id="hello_world"}' --limit=10
```

### Using Grafana

1. Navigate to Grafana: `https://grafana.${SECRET_DOMAIN}`
2. Go to Explore → Select Loki datasource
3. Use the query builder or LogQL directly

### Common LogQL Queries

```logql
# All scheduler logs
{namespace="airflow", container="scheduler"}

# Worker logs for specific DAG
{namespace="airflow", app_kubernetes_io_component="worker"} |= "dag_id=hello_world"

# Extract and count errors by DAG
{namespace="airflow"} |= "ERROR" | pattern `dag_id=<dag_id>` | __error__="" | line_format "{{.dag_id}}" | count by (dag_id)

# Task execution timeline
{namespace="airflow"} |= "TaskInstance Finished" | pattern `dag_id=<dag_id>, task_id=<task_id>`
```

## Grafana Dashboard

A dedicated Airflow dashboard can be created with the following panels:

### Essential Panels

1. **Recent Task Executions**
   - Table showing latest task runs with status
   - Query: `{namespace="airflow"} |= "TaskInstance Finished"`

2. **Error Log Stream**
   - Live tail of ERROR level logs
   - Query: `{namespace="airflow"} |= "ERROR"`

3. **DAG Execution Overview**
   - Bar chart of executions by DAG
   - Query: `sum by (dag_id) (count_over_time({namespace="airflow"} |= "DagRun Finished" | pattern \`dag_id=<dag_id>\` [1h]))`

4. **Task Duration Trends**
   - Graph showing task execution times
   - Parse duration from "run_duration" in logs

### Dashboard Variables

- `dag_id`: Dynamic list from `{namespace="airflow"} | dag_id != ""`
- `task_id`: Filtered by selected DAG
- `time_range`: Standard Grafana time picker

## Troubleshooting

### Logs Not Appearing

1. **Check Alloy is running**:
   ```bash
   kubectl get pods -n monitoring -l app.kubernetes.io/name=alloy
   ```

2. **Verify Airflow is generating logs**:
   ```bash
   kubectl logs -n airflow deployment/airflow-webserver --tail=10
   ```

3. **Test Loki connectivity**:
   ```bash
   ./scripts/logcli-wrapper.ts query '{namespace="airflow"}' --limit=1
   ```

### Labels Not Extracted

The label extraction relies on specific log patterns. If labels aren't working:

1. Check log format matches the regex patterns
2. Verify Alloy configuration was applied correctly
3. Look for extraction errors in Alloy logs

### Performance Issues

If queries are slow:

1. Use time ranges to limit data scanned
2. Add more specific label selectors
3. Avoid using `|~` (regex match) when `|=` (contains) suffices

## Maintenance

### Log Retention

Logs are retained for 30 days by default. To modify:

1. Update Loki HelmRelease `limits_config.retention_period`
2. Consider storage capacity when extending retention

### Monitoring Alloy

```bash
# Check Alloy resource usage
kubectl top pods -n monitoring -l app.kubernetes.io/name=alloy

# View Alloy logs
kubectl logs -n monitoring daemonset/alloy --tail=50
```

### Updating Configuration

1. Edit `kubernetes/apps/monitoring/alloy/app/helmrelease.yaml`
2. Commit and push changes
3. Wait for Flux to reconcile or force it:
   ```bash
   flux reconcile kustomization alloy -n monitoring --with-source
   ```

## Migration from Previous Solutions

### From Persistent Volume Logging

The PVC-based approach is no longer needed. Logs are now:
- Collected automatically by Alloy
- Stored centrally in Loki
- Accessible even after pod deletion

### From Direct S3 Logging

We chose Alloy + Loki over direct S3 because:
- Unified logging pipeline for all services
- Real-time log streaming and analysis
- Better integration with Grafana
- No Airflow configuration required

## Best Practices

1. **Use structured logging** in your DAGs:
   ```python
   logger.info(f"Processing started", extra={
       "dag_id": context["dag"].dag_id,
       "task_id": context["task"].task_id,
       "execution_date": context["execution_date"].isoformat()
   })
   ```

2. **Include context in error messages**:
   ```python
   logger.error(f"Failed to process file: {file_path}", exc_info=True)
   ```

3. **Avoid excessive logging** in tight loops to prevent log spam

4. **Use appropriate log levels**:
   - DEBUG: Detailed diagnostic info
   - INFO: General informational messages
   - WARNING: Warning messages
   - ERROR: Error conditions
   - CRITICAL: Critical problems

## Future Enhancements

1. **Automated Alerting**: Create Loki recording rules for task failures
2. **SLA Monitoring**: Track task execution times against SLAs
3. **Log-based Metrics**: Export metrics from logs to Prometheus
4. **ML Anomaly Detection**: Identify unusual patterns in logs

## References

- [Alloy Documentation](https://grafana.com/docs/alloy/latest/)
- [Loki Documentation](https://grafana.com/docs/loki/latest/)
- [LogQL Query Language](https://grafana.com/docs/loki/latest/logql/)
- [Airflow Logging Architecture](https://airflow.apache.org/docs/apache-airflow/stable/administration-and-deployment/logging-monitoring/logging-architecture.html)