# Loki + Alloy Quick Start Guide

## Overview

This guide provides the fastest path to getting Loki and Alloy running in your cluster. For detailed explanations, refer to the full implementation guide.

## Prerequisites Checklist

- [ ] Kubernetes cluster running (version 1.24+)
- [ ] Ceph cluster operational with S3 endpoint
- [ ] Grafana deployed (via kube-prometheus-stack)
- [ ] External Secrets Operator configured
- [ ] 1Password Connect configured

## Quick Deployment Steps

### 1. Enable Ceph Object Store (if needed)

```bash
# Check if disabled
ls kubernetes/apps/storage/rook-ceph-objectstore/ks.yaml*

# Enable if needed
mv kubernetes/apps/storage/rook-ceph-objectstore/ks.yaml.disabled \
   kubernetes/apps/storage/rook-ceph-objectstore/ks.yaml

# Commit and sync
git add -A && git commit -m "feat: enable Ceph object store"
git push && flux reconcile ks cluster-apps --with-source
```

### 2. Create Directory Structure

```bash
# Create Loki directories
mkdir -p kubernetes/apps/monitoring/loki/app
mkdir -p kubernetes/apps/monitoring/alloy/app

# Create kustomization directories
touch kubernetes/apps/monitoring/loki/ks.yaml
touch kubernetes/apps/monitoring/loki/app/kustomization.yaml
touch kubernetes/apps/monitoring/alloy/ks.yaml
touch kubernetes/apps/monitoring/alloy/app/kustomization.yaml
```

### 3. Add Grafana Helm Repository

```bash
cat > kubernetes/flux/meta/repos/grafana.yaml << 'EOF'
---
apiVersion: source.toolkit.fluxcd.io/v1
kind: HelmRepository
metadata:
  name: grafana
  namespace: flux-system
spec:
  interval: 1h
  url: https://grafana.github.io/helm-charts
EOF

# Update repos kustomization
cd kubernetes/flux/meta/repos/
echo "  - ./grafana.yaml" >> kustomization.yaml
```

### 4. Deploy Loki (Simplified Config)

```bash
# Create minimal Loki deployment
cat > kubernetes/apps/monitoring/loki/app/helmrelease.yaml << 'EOF'
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: loki
  namespace: monitoring
spec:
  interval: 30m
  chart:
    spec:
      chart: loki
      version: 6.23.0
      sourceRef:
        kind: HelmRepository
        name: grafana
        namespace: flux-system
  values:
    deploymentMode: SingleBinary
    loki:
      auth_enabled: false
      commonConfig:
        replication_factor: 1
      storage:
        type: filesystem
      schemaConfig:
        configs:
          - from: "2024-01-01"
            store: tsdb
            object_store: filesystem
            schema: v13
            index:
              prefix: index_
              period: 24h
    singleBinary:
      replicas: 1
      persistence:
        enabled: true
        storageClass: ceph-block
        size: 50Gi
    monitoring:
      dashboards:
        enabled: true
      serviceMonitor:
        enabled: true
    test:
      enabled: false
EOF

# Create kustomization
cat > kubernetes/apps/monitoring/loki/app/kustomization.yaml << 'EOF'
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: monitoring
resources:
  - ./helmrelease.yaml
EOF

# Create Flux kustomization
cat > kubernetes/apps/monitoring/loki/ks.yaml << 'EOF'
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: loki
  namespace: flux-system
spec:
  targetNamespace: monitoring
  interval: 30m
  prune: true
  wait: true
  path: ./kubernetes/apps/monitoring/loki/app
  sourceRef:
    kind: GitRepository
    name: flux-system
  dependsOn:
    - name: kube-prometheus-stack
      namespace: monitoring
EOF
```

### 5. Deploy Alloy (Minimal Config)

```bash
# Create Alloy deployment
cat > kubernetes/apps/monitoring/alloy/app/helmrelease.yaml << 'EOF'
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: alloy
  namespace: monitoring
spec:
  interval: 30m
  chart:
    spec:
      chart: alloy
      version: 0.10.0
      sourceRef:
        kind: HelmRepository
        name: grafana
        namespace: flux-system
  values:
    alloy:
      configMap:
        create: true
        content: |
          discovery.kubernetes "pods" {
            role = "pod"
          }
          
          discovery.relabel "pods" {
            targets = discovery.kubernetes.pods.targets
            
            rule {
              source_labels = ["__meta_kubernetes_namespace"]
              target_label  = "namespace"
            }
            
            rule {
              source_labels = ["__meta_kubernetes_pod_name"]
              target_label  = "pod"
            }
            
            rule {
              source_labels = ["__meta_kubernetes_pod_container_name"]
              target_label  = "container"
            }
            
            rule {
              source_labels = ["__meta_kubernetes_pod_phase"]
              regex         = "Pending|Succeeded|Failed|Completed|Unknown"
              action        = "drop"
            }
            
            rule {
              source_labels = ["__meta_kubernetes_pod_uid", "__meta_kubernetes_pod_container_name"]
              target_label  = "__path__"
              separator     = "/"
              replacement   = "/var/log/pods/*$1/$2/*.log"
            }
          }
          
          loki.source.kubernetes_logs "pods" {
            targets    = discovery.relabel.pods.output
            forward_to = [loki.write.default.receiver]
          }
          
          loki.write "default" {
            endpoint {
              url = "http://loki.monitoring.svc.cluster.local:3100/loki/api/v1/push"
            }
          }
    controller:
      type: daemonset
      volumes:
        - name: varlog
          hostPath:
            path: /var/log
      volumeMounts:
        - name: varlog
          mountPath: /var/log
          readOnly: true
      securityContext:
        privileged: true
        runAsUser: 0
    serviceMonitor:
      enabled: true
EOF

# Create kustomization
cat > kubernetes/apps/monitoring/alloy/app/kustomization.yaml << 'EOF'
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: monitoring
resources:
  - ./helmrelease.yaml
EOF

# Create Flux kustomization
cat > kubernetes/apps/monitoring/alloy/ks.yaml << 'EOF'
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: alloy
  namespace: flux-system
spec:
  targetNamespace: monitoring
  interval: 30m
  prune: true
  wait: true
  path: ./kubernetes/apps/monitoring/alloy/app
  sourceRef:
    kind: GitRepository
    name: flux-system
  dependsOn:
    - name: loki
      namespace: monitoring
EOF
```

### 6. Update Monitoring Kustomization

```bash
# Add to kubernetes/apps/monitoring/kustomization.yaml
echo "  - ./loki/" >> kubernetes/apps/monitoring/kustomization.yaml
echo "  - ./alloy/" >> kubernetes/apps/monitoring/kustomization.yaml
```

### 7. Configure Grafana Data Source

```bash
# Add to kube-prometheus-stack values
cat >> kubernetes/apps/monitoring/kube-prometheus-stack/app/helmrelease.yaml << 'EOF'
        additionalDataSources:
          - name: Loki
            type: loki
            access: proxy
            url: http://loki.monitoring.svc.cluster.local:3100
            isDefault: false
EOF
```

### 8. Deploy Everything

```bash
# Commit and push
git add -A
git commit -m "feat: add Loki and Alloy logging stack"
git push

# Force reconciliation
flux reconcile source git flux-system
flux reconcile ks cluster-apps --with-source

# Watch deployment
watch flux get helmrelease -n monitoring
```

### 9. Verify Deployment

```bash
# Check pods
kubectl get pods -n monitoring -l app.kubernetes.io/name=loki
kubectl get pods -n monitoring -l app.kubernetes.io/name=alloy

# Test log collection
kubectl run test-logger --image=busybox --restart=Never -- \
  sh -c 'for i in $(seq 1 60); do echo "Test log $i"; sleep 1; done'

# Wait 30 seconds for logs to appear
sleep 30

# Check in Grafana Explore
# Query: {pod="test-logger"}

# Cleanup
kubectl delete pod test-logger
```

## Quick Validation

1. **Grafana**: Navigate to Explore → Select "Loki" data source
2. **Simple Query**: `{namespace="default"}`
3. **Check Metrics**: Look for `loki_ingester_chunks_created_total` in Prometheus

## Common Quick Fixes

### No logs appearing?
```bash
# Check Alloy logs
kubectl logs -n monitoring -l app.kubernetes.io/name=alloy | tail -50

# Restart Alloy
kubectl rollout restart daemonset/alloy -n monitoring
```

### Loki not starting?
```bash
# Check Loki logs
kubectl logs -n monitoring -l app.kubernetes.io/name=loki

# Check PVC
kubectl get pvc -n monitoring
```

### Need S3 storage instead?
See the full implementation guide for S3 configuration with Ceph.

## What's Next?

1. **Import Dashboards**: 
   - Loki Logs Dashboard (ID: 13639)
   - Loki Stats Dashboard (ID: 14055)

2. **Configure Retention**:
   ```yaml
   limits_config:
     retention_period: 720h  # 30 days
   ```

3. **Add Filters**:
   - Drop debug logs
   - Exclude system namespaces
   - Parse JSON logs

4. **Scale Up**:
   - Move to Simple Scalable mode
   - Add S3 storage backend
   - Increase replicas

## Useful LogQL Queries

```logql
# All logs from a namespace
{namespace="airflow"}

# Errors only
{namespace="airflow"} |~ "ERROR|FATAL"

# Specific pod
{pod="airflow-scheduler-0"}

# JSON parsing
{namespace="airflow"} | json | level="error"

# Rate of logs
rate({namespace="airflow"}[5m])
```

## Quick Teardown

If you need to remove everything:

```bash
# Delete resources
flux suspend ks alloy -n flux-system
flux suspend ks loki -n flux-system
kubectl delete hr alloy -n monitoring
kubectl delete hr loki -n monitoring

# Remove from git
rm -rf kubernetes/apps/monitoring/loki
rm -rf kubernetes/apps/monitoring/alloy
git add -A && git commit -m "feat: remove logging stack"
git push
```

---

**Quick Start Version**: 1.0  
**Time to Deploy**: ~15 minutes  
**Complexity**: Low (filesystem storage)