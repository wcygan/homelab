# Milestone: Airflow Alloy Logging Integration

**Date**: 2025-06-10  
**Category**: Monitoring  
**Status**: In Progress

## Summary

Implement a unified logging solution for Apache Airflow using the existing Alloy and Loki infrastructure, enabling persistent log storage and centralized querying through Grafana without modifying Airflow configuration.

## Goals

- [x] Fix Loki S3 backend configuration with proper ObjectBucketClaim
- [x] Enhance Alloy configuration to better identify and label Airflow logs
- [ ] Create Grafana dashboard for Airflow log visualization and analysis
- [ ] Verify all Airflow component logs (scheduler, webserver, workers) are captured
- [ ] Document LogQL queries for common Airflow troubleshooting scenarios

## Implementation Details

### Components Deployed
- Loki (existing, needs S3 configuration fix)
- Alloy DaemonSet (existing, needs configuration enhancement)
- Grafana (existing, needs Airflow dashboard)
- Rook-Ceph S3 ObjectStore (existing, ready for use)

### Configuration Changes
- ✅ Verified Loki S3 configuration (using manual credentials, OBC exists but not used)
- ✅ Enhanced Alloy configuration with Airflow-specific log processing
- ✅ Added regex patterns to extract dag_id, task_id, and execution_date
- ✅ Fixed Alloy syntax error (replaced single quotes with double quotes)
- ✅ Configured label dropping to stay under Loki's 15 label limit

## Validation

### Tests Performed
- Test 1: Verify Loki can write to S3 bucket
- Test 2: Confirm Alloy captures logs from all Airflow pods
- Test 3: Validate DAG execution logs are searchable in Grafana
- Test 4: Check log retention after pod termination
- Test 5: Verify no duplicate logs are ingested

### Metrics
- Log ingestion rate: TBD MB/hour
- S3 storage usage: TBD GB
- Query performance: TBD seconds for 24h window
- Log retention: 30 days configured

## Lessons Learned

### What Went Well
- Existing Alloy infrastructure already captures Airflow logs
- No Airflow configuration changes required
- Unified logging pipeline simplifies operations

### Challenges
- Loki S3 configuration currently broken (missing ObjectBucketClaim)
- Need to extract structured data from unstructured Airflow logs
- Balancing log detail with storage costs

## Next Steps

- Phase 1: Fix Loki S3 integration (immediate)
- Phase 2: Consider Python handler integration if UI log viewing needed
- Phase 3: Implement log-based alerting for failed tasks
- Phase 4: Optimize log retention policies based on usage patterns

## References

- [Alloy Kubernetes Discovery](https://grafana.com/docs/alloy/latest/reference/components/discovery.kubernetes/)
- [Loki S3 Configuration](https://grafana.com/docs/loki/latest/storage/#s3)
- [Airflow Logging Architecture](https://airflow.apache.org/docs/apache-airflow/stable/administration-and-deployment/logging-monitoring/logging-architecture.html)
- [Previous Milestone: Loki Deployment](./2025-06-10-loki-deployment.md)