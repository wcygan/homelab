# Logging Stack Recovery Plan

## Current State
- ❌ Deviated from S3-first approach
- ❌ Using Promtail instead of Alloy
- ❌ Filesystem storage instead of S3
- ✅ Ceph cluster is healthy
- ✅ Stuck resources cleaned up

## Recovery Steps

### Phase 1: Remove Current Deployment
```bash
# Delete current logging stack
kubectl delete kustomization loki promtail -n monitoring
kubectl delete helmrelease loki promtail -n monitoring
kubectl delete pvc storage-loki-0 -n monitoring

# Remove the deployments
rm -rf kubernetes/apps/monitoring/loki
rm -rf kubernetes/apps/monitoring/promtail
```

### Phase 2: Fix Ceph ObjectStore

1. **Create proper ObjectStore configuration** without multisite:
```yaml
apiVersion: ceph.rook.io/v1
kind: CephObjectStore
metadata:
  name: storage
  namespace: storage
spec:
  metadataPool:
    replicated:
      size: 3
  dataPool:
    replicated:
      size: 3
  preservePoolsOnDelete: false
  gateway:
    port: 80
    instances: 2
    priorityClassName: system-cluster-critical
```

2. **Re-enable ObjectStore**:
```bash
cd kubernetes/apps/storage/rook-ceph-objectstore/
# Ensure ks.yaml exists (not disabled)
git add -A && git commit -m "fix(storage): re-enable ObjectStore with simplified config"
git push
```

### Phase 3: Deploy Alloy (not Promtail)

The correct Alloy chart is available as `grafana/alloy` (not just `alloy`):
- Chart: `grafana/alloy`
- Latest version: Check with `helm search repo grafana/alloy -l`

### Phase 4: Deploy Loki with S3

Once S3 is working:
1. Deploy Loki in Simple Scalable mode
2. Configure S3 backend with Ceph
3. Use proper production configuration

## Why This Approach

1. **S3-First**: Avoids migration complexity later
2. **Alloy**: Modern, more features than Promtail
3. **Production Ready**: Scalable from day one
4. **No Technical Debt**: Clean implementation

## Decision Point

Do we:
1. **Option A**: Clean up and start fresh with S3-first approach
2. **Option B**: Keep current deployment and migrate later
3. **Option C**: Fix ObjectStore in parallel while using current deployment

Recommendation: **Option A** - Clean slate with proper S3 setup