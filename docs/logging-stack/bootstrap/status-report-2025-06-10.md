# Loki + Alloy Deployment Status Report

**Date**: 2025-06-10  
**Phase**: 2 - Loki Deployment  
**Status**: In Progress

## Summary

Successfully completed Phase 1 (Infrastructure Preparation) and implemented the GitOps structure for Loki and Alloy deployment. Ready to deploy the logging stack.

## Completed Actions

### Phase 1: Infrastructure Preparation ✅
1. **S3 Storage Setup**: 
   - Ceph ObjectStore is operational
   - RGW pods running (2 replicas)
   - ObjectBucketClaim created but not bound yet
   - S3 credentials manually created in `loki-s3-credentials` secret

2. **Repository Configuration**:
   - Grafana Helm repository already configured and operational

### Phase 2: Loki Deployment (Implementation Complete, Awaiting Deployment)
1. **Created Loki HelmRelease**:
   - Simple Scalable mode configured
   - S3 backend using Ceph RGW
   - 2 write replicas, 2 read replicas, 1 backend replica
   - Monitoring integration enabled
   - Resource limits configured

2. **Created GitOps Structure**:
   - `/kubernetes/apps/monitoring/loki/app/helmrelease.yaml`
   - `/kubernetes/apps/monitoring/loki/app/kustomization.yaml`
   - `/kubernetes/apps/monitoring/loki/ks.yaml`

### Phase 3: Alloy Configuration (Implementation Complete, Awaiting Deployment)
1. **Created Alloy HelmRelease**:
   - DaemonSet deployment mode
   - Kubernetes log discovery configured
   - JSON parsing and label extraction
   - Prometheus metrics integration
   - Resource limits set conservatively

2. **Created GitOps Structure**:
   - `/kubernetes/apps/monitoring/alloy/app/helmrelease.yaml`
   - `/kubernetes/apps/monitoring/alloy/app/kustomization.yaml`
   - `/kubernetes/apps/monitoring/alloy/ks.yaml`

3. **Updated Monitoring Kustomization**:
   - Added Loki and Alloy to monitoring namespace resources

## Current State

- **S3 Backend**: ObjectStore ready, credentials configured
- **Loki**: Manifests created, awaiting deployment
- **Alloy**: Manifests created, awaiting deployment
- **Grafana Integration**: Loki datasource already configured in kube-prometheus-stack

## Next Steps

1. **Commit and Deploy**:
   ```bash
   git commit -m "feat(monitoring): add Loki + Alloy centralized logging stack"
   git push
   flux reconcile source git flux-system
   ```

2. **Monitor Deployment**:
   ```bash
   # Watch Flux reconciliation
   flux get kustomization -A --watch
   
   # Check pod status
   kubectl get pods -n monitoring -l app.kubernetes.io/name=loki
   kubectl get pods -n monitoring -l app.kubernetes.io/name=alloy
   ```

3. **Verify S3 Bucket Creation**:
   - Check if ObjectBucketClaim binds and creates bucket
   - May need to manually create bucket if OBC doesn't work

4. **Test Log Ingestion**:
   - Deploy test pod
   - Query logs in Grafana
   - Verify all nodes are shipping logs

## Risks & Mitigations

1. **S3 Bucket Creation**: ObjectBucketClaim may not automatically create bucket
   - Mitigation: Manual bucket creation via rook-ceph-tools if needed

2. **Resource Usage**: Initial deployment may require tuning
   - Mitigation: Conservative resource limits set, monitor and adjust

3. **Log Volume**: May need to implement filtering sooner
   - Mitigation: Basic namespace filtering already configured in Alloy

## Configuration Notes

### Loki S3 Configuration
- Endpoint: `http://rook-ceph-rgw-storage.storage.svc.cluster.local`
- Bucket: `loki-logs`
- Region: `us-east-1` (required but ignored by Ceph)
- Path style: Forced (required for Ceph S3)

### Alloy Configuration
- Discovery: Kubernetes pod role
- Log path: `/var/log/pods/*`
- Dropped namespaces: `kube-public`
- Batch size: 1MB
- Batch timeout: 10s

## Validation Checklist

- [x] Manifest validation passed
- [x] Grafana Helm repository ready
- [x] S3 ObjectStore operational
- [x] Dependencies configured correctly
- [ ] Loki pods running
- [ ] Alloy pods running on all nodes
- [ ] Test logs visible in Grafana
- [ ] Metrics being collected

---

**Next Action**: Commit changes and push to trigger Flux deployment