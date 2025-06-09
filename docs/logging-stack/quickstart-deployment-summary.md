# Loki + Promtail Quickstart Deployment Summary

**Date**: January 9, 2025  
**Deployment Type**: Quickstart (Filesystem Storage)  
**Status**: ✅ Successfully Deployed

## Deployment Overview

Due to Ceph ObjectStore issues (multisite configuration errors), we deployed Loki using the quickstart approach with filesystem storage to address the immediate need for centralized logging.

## What Was Deployed

### 1. Loki (v5.47.2)
- **Mode**: SingleBinary (simplified deployment)
- **Storage**: Filesystem with 50Gi PVC (ceph-block)
- **Components**:
  - loki-0: Main Loki instance
  - loki-gateway: HTTP gateway for ingestion/queries
  - loki-canary: Synthetic log generation for testing

### 2. Promtail (v6.16.6)
- **Deployment**: DaemonSet (one per node)
- **Function**: Log collection agent
- **Target**: All pod logs across the cluster
- **Note**: Replaced Alloy due to chart availability issues

### 3. Grafana Integration
- **Data Source**: Configured automatically
- **URL**: http://loki-gateway.monitoring.svc.cluster.local
- **Access**: Via Explore tab in Grafana

## Key Files Created

### Configuration Files
- `/kubernetes/flux/meta/repos/grafana.yaml` - Helm repository
- `/kubernetes/apps/monitoring/loki/` - Loki deployment
- `/kubernetes/apps/monitoring/promtail/` - Promtail deployment

### Documentation
- `/docs/logging-stack/quickstart-deployment-summary.md` - This file
- `/docs/logging-stack/examples/airflow-logql-queries.md` - Query examples
- `/scripts/verify-logging-quickstart.sh` - Verification script

## Current Status

### ✅ Working
- Loki accepting logs via Promtail
- Promtail collecting from all nodes
- Grafana data source configured
- 144MB of logs already ingested
- Service discovery operational

### ⚠️ Limitations
- Using filesystem storage (50Gi limit)
- No S3 backend (ObjectStore issues)
- Single replica (no HA)
- Manual retention management needed

### ❌ Blocked
- S3 backend deployment (Ceph ObjectStore deletion stuck)
- Production-grade Simple Scalable mode
- Long-term retention policies

## Accessing Logs

### Via Grafana UI
1. Navigate to https://grafana (via Tailscale)
2. Login: admin / prom-operator
3. Go to Explore → Select "Loki" data source
4. Enter LogQL query (e.g., `{namespace="airflow"}`)

### Example Queries
```logql
# All Airflow logs
{namespace="airflow"}

# Airflow errors
{namespace="airflow"} |~ "ERROR"

# Specific component
{namespace="airflow", container="scheduler"}

# Recent scheduler restarts
{namespace="airflow", container="scheduler"} |~ "Starting the scheduler"
```

## Next Steps

### Immediate (This Week)
1. ✅ Monitor 50Gi PVC usage
2. ✅ Configure log retention (currently unlimited)
3. ✅ Create Airflow-specific dashboards
4. ✅ Document common queries for team

### Short-term (Next 2 Weeks)
1. 🔧 Troubleshoot Ceph ObjectStore issues
2. 🔧 Plan migration from filesystem to S3
3. 🔧 Implement automated retention policies
4. 🔧 Add alerting for log anomalies

### Long-term (Next Month)
1. 📋 Migrate to Simple Scalable mode with S3
2. 📋 Implement multi-tenancy if needed
3. 📋 Optimize ingestion performance
4. 📋 Integrate with tracing (Tempo)

## Troubleshooting

### No logs appearing in Grafana
```bash
# Check Promtail is collecting
kubectl logs -n monitoring daemonset/promtail --tail=50

# Check Loki is receiving
kubectl logs -n monitoring loki-0 --tail=50

# Verify data source in Grafana
curl -u admin:prom-operator http://grafana/api/datasources
```

### High PVC usage
```bash
# Check current usage
kubectl exec -n monitoring loki-0 -- df -h /var/loki

# Manual cleanup if needed
kubectl exec -n monitoring loki-0 -- find /var/loki -name "*.gz" -mtime +7 -delete
```

### Performance issues
```bash
# Check resource usage
kubectl top pods -n monitoring -l app.kubernetes.io/name=loki

# Increase resources if needed by editing HelmRelease
```

## Migration Plan (When S3 Ready)

1. **Enable Ceph ObjectStore**
   - Fix multisite configuration issue
   - Ensure RGW pods are running

2. **Deploy Loki Simple Scalable**
   - Use S3 backend configuration
   - Deploy read/write/backend components

3. **Dual-run Period**
   - Keep filesystem Loki for queries
   - New logs go to S3-backed Loki

4. **Data Migration**
   - Export historical data if needed
   - Or accept data split at cutover

5. **Decommission Quickstart**
   - Remove filesystem-based Loki
   - Reclaim 50Gi PVC

## Conclusion

The quickstart deployment successfully addresses the immediate need for centralized logging, particularly for the 100Gi Airflow logs issue. While not production-grade, it provides immediate value and can be migrated to a proper S3-backed deployment once the Ceph ObjectStore issues are resolved.

**Total Deployment Time**: ~30 minutes  
**Logs Collected**: All namespaces  
**Storage Used**: ~1% of 50Gi (after 25 minutes)  
**Estimated Capacity**: 30-45 days at current rate