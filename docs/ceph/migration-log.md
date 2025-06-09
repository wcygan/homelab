# Ceph Migration Log

## 2025-06-09 - Test Workload Migrations

### DragonflyDB Test Cache (df-test-cache-0)

**Status**: In Progress
**Start Time**: 2025-06-09T17:30:00Z

#### Pre-Migration State
- **PVC**: df-test-cache-0 
- **Namespace**: database
- **Size**: 1Gi
- **StorageClass**: local-path
- **Node**: k8s-3
- **Pod**: test-cache-0 (Running)

#### Migration Steps

1. **Create new PVC on Ceph** (17:30:00Z)