# Storage Migration Checklist

## Pre-Migration Checklist

- [ ] Verify Ceph cluster health: `kubectl exec -n storage deploy/rook-ceph-tools -- ceph status`
- [ ] Check available Ceph capacity: `kubectl exec -n storage deploy/rook-ceph-tools -- ceph df`
- [ ] Verify Volsync is running: `kubectl get pods -n storage -l app.kubernetes.io/name=volsync`
- [ ] Create backup secret with S3 credentials (if using S3)
- [ ] Test snapshot creation: `kubectl apply -f test-snapshot.yaml`
- [ ] Document current PVC size and node affinity

## Migration Execution Checklist

### For Each PVC:

1. **Pre-Migration**
   - [ ] Record application state
   - [ ] Create ReplicationSource for backup
   - [ ] Wait for backup completion: `kubectl get replicationsource -n <namespace> <name> -o jsonpath='{.status.lastSyncTime}'`
   - [ ] Verify backup success: Check `.status.conditions`

2. **Migration**
   - [ ] Scale down application to 0 replicas
   - [ ] Confirm no pods using PVC: `kubectl get pods -n <namespace> -o json | jq '.items[] | select(.spec.volumes[].persistentVolumeClaim.claimName=="<pvc-name>")'`
   - [ ] Create new Ceph PVC
   - [ ] Create ReplicationDestination for restore
   - [ ] Monitor restore progress: `kubectl logs -n <namespace> -l volsync.backube/replicationdestination=<name>`

3. **Post-Migration**
   - [ ] Update application to use new PVC name
   - [ ] Scale up application
   - [ ] Verify pod starts successfully
   - [ ] Check application functionality
   - [ ] Monitor for errors: `kubectl logs -n <namespace> <pod-name>`

4. **Validation**
   - [ ] Application responding normally
   - [ ] Data integrity verified
   - [ ] Performance acceptable
   - [ ] No errors in logs

## Rollback Checklist

If issues occur:

1. **Immediate Rollback** (same storage class)
   - [ ] Scale down application
   - [ ] Revert PVC name in deployment/statefulset
   - [ ] Scale up application
   - [ ] Verify functionality

2. **Restore from Backup** (different storage class)
   - [ ] Create new PVC on original storage class
   - [ ] Use ReplicationDestination to restore
   - [ ] Update application configuration
   - [ ] Restart application

## Post-Migration Cleanup

After 7-day validation period:

- [ ] Delete old local-path PVC
- [ ] Delete migration ReplicationSource/Destination
- [ ] Update documentation
- [ ] Archive migration logs
- [ ] Update monitoring dashboards