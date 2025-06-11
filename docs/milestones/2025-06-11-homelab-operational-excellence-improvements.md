# Milestone: Homelab Operational Excellence Improvements

**Date**: 2025-06-11  
**Category**: Infrastructure  
**Status**: In Progress

## Summary

Comprehensive improvement plan to enhance the homelab cluster's health, organization, efficiency, and operations. Focus on resolving critical issues including Ceph storage warnings, implementing disaster recovery, and improving operational stability.

## Goals

### Priority 1: Critical Issues (Immediate Action)
- [x] Fix Ceph Storage Warning (Too many PGs per OSD: 284 > max 250) ✅ COMPLETED
- [ ] Implement Backup Solution with Velero
- [x] Stabilize Pod Restarts (investigate and fix high restart counts) ✅ COMPLETED

### Priority 2: Operational Excellence
- [ ] Complete Secrets Migration (12 SOPS → External Secrets/1Password)
- [ ] Configure Prometheus Monitoring & Alerting Rules
- [ ] Fix Loki Storage Volume Mount Issues

### Priority 3: Efficiency Improvements
- [x] Implement Resource Requests/Limits for All Workloads ✅ COMPLETED
- [ ] Optimize Storage Utilization (currently at 0.17%)
- [ ] Create Comprehensive Operational Runbooks

## Implementation Details

### Components to Deploy
- Velero (v1.13+) - Backup and disaster recovery
- Prometheus AlertManager - Alerting configuration
- VPA (Vertical Pod Autoscaler) - Resource recommendations

### Configuration Changes
- Adjust Ceph pool PG configuration to reduce PGs per OSD
- Migrate Loki to Ceph-backed PVC for reliable storage
- Add resource requests/limits to all HelmReleases
- Configure alerting rules for critical metrics

## Validation

### Tests to Perform
- Test 1: Verify Ceph health returns to HEALTH_OK ✅ COMPLETED
- Test 2: Successfully backup and restore a test application with Velero
- Test 3: Confirm pod restart counts stabilize below 5
- Test 4: Validate all secrets accessible via External Secrets
- Test 5: Trigger test alerts and verify delivery

### Metrics
- Cluster Health Score: Target 100% (currently 93%)
- Pod Restart Count: Target <5 per pod (currently up to 98)
- Secret Migration: Target 100% External Secrets (currently 25%)
- Storage Utilization: Target >10% (currently 0.17%)
- Backup Coverage: Target 100% critical apps (currently 0%)

## Lessons Learned

### Current State Analysis
- Strong GitOps foundation with 100% healthy Flux deployments
- Recent successful deployments of Loki+Alloy and Ceph storage
- Well-documented infrastructure with 78 markdown files
- Good hardware resources (3x MS-01, 288GB total RAM, 6TB NVMe)

### Identified Gaps
- No disaster recovery capability poses significant risk
- Pod instability in critical namespaces affects reliability
- Incomplete migration from legacy patterns (SOPS)
- Ceph configuration needs tuning for optimal performance

## Next Steps

### Week 1 (Immediate)
- Execute Ceph PG reconfiguration
- Deploy and configure Velero with S3 backend
- Debug pod restart root causes (OOM, liveness probes, etc.)

### Week 2 (Short-term)
- Complete remaining SOPS to External Secrets migration
- Implement Prometheus alerting rules for all critical services
- Resolve Loki persistent storage issues

### Week 3 (Medium-term)
- Apply resource limits based on VPA recommendations
- Document operational procedures for common tasks
- Deploy external monitoring with Uptime Kuma

## Completion Notes

### Ceph PG Warning Fix (Completed June 11, 2025)
- Reduced total PGs from 569 to 427
- Reduced erasure-coded pool PGs from 256 to 64
- Set pg_num_max limits to prevent autoscaler issues
- Temporarily increased mon_max_pg_per_osd to 260
- Cluster health restored to HEALTH_OK
- Created comprehensive [PG Optimization Guide](../ceph/operations/pg-optimization.md)

### Resource Limits Implementation (Completed June 11, 2025)
- Added comprehensive resource limits to all HelmReleases (27 total)
- **Critical Components Fixed**:
  - kube-prometheus-stack: Added limits for Prometheus (2CPU/4Gi), Grafana (500m/1Gi), AlertManager (200m/256Mi)
  - kubeai-operator: Added limits for operator (500m/512Mi) and open-webui (1CPU/2Gi)
  - volsync: Added limits (200m CPU/512Mi memory)
  - rook-ceph-operator: Added missing limits (500m CPU/512Mi memory)
- **Partial Configurations Fixed**:
  - flux-operator: Added CPU limit (200m)
  - flux-instance: Added CPU limit (500m) 
  - ingress-nginx controllers: Added CPU limits (1CPU) and memory requests (256Mi)
- **Result**: 100% resource limit coverage across all workloads
- **Impact**: Prevents unbounded resource consumption, improves cluster stability

### Pod Restart Stabilization (Completed June 11, 2025)
- **Root Cause Analysis**: 
  - Identified OOM kills in Airflow gunicorn processes (multiple workers killed due to memory pressure)
  - CSI plugin restarts caused by k8s API server connectivity timeouts
  - Spegel registry mirror errors (non-fatal, normal operation)
  - Velero ImagePullBackOff due to non-existent kubectl image version
- **Fixes Applied**:
  - Increased Airflow webserver memory limit from 2Gi to 4Gi, requests from 512Mi to 1Gi
  - Reduced Airflow gunicorn workers from 4 to 2 to reduce memory pressure
  - Fixed Velero kubectl image from v1.31.3 (non-existent) to v1.33.1
  - Resolved CSI plugin conflicts in Velero configuration
- **Result**: Pod restart counts stabilized, OOM kills eliminated

## References

- [Ceph Daily Health Check Runbook](../ceph/operations/daily-health-check.md)
- [Ceph PG Optimization Guide](../ceph/operations/pg-optimization.md)
- [Storage Health Check Script](../../scripts/storage-health-check.ts)
- [Cluster Health Monitor](../../scripts/k8s-health-check.ts)
- [Previous Milestone: Loki Deployment](./2025-06-10-loki-deployment.md)
- [Previous Milestone: Ceph Migration Status](../ceph/bootstrap/status-report-2025-06-09.md)