Analyze and debug Flux deployment issues in the cluster using systematic troubleshooting methodology.

## Initial Assessment

First, check Flux system health and get a comprehensive view of all resources:
```bash
# Check Flux components and prerequisites
flux check

# Get all Flux resources status
flux get all -A
```

Look for any resources with `Ready: False` status and note their KIND, NAME, and NAMESPACE.

## Focused Investigation

If you find failing resources, investigate them specifically:
```bash
# For non-ready resources
flux get all -A --status-selector ready=false

# Check warning events
kubectl get events -n flux-system --field-selector type=Warning

# Check all sources
flux get sources all -A
kubectl get gitrepositories.source.toolkit.fluxcd.io -A
kubectl get helmrepositories.source.toolkit.fluxcd.io -A

# Check HelmReleases
flux get helmreleases --all-namespaces
```

## Deep Dive Commands

Based on the type of failure, use these commands:

### For HelmRelease issues:
```bash
flux describe helmrelease <name> -n <namespace>
kubectl logs -n flux-system deployment/helm-controller -f
```

### For Kustomization issues:
```bash
flux describe kustomization <name> -n flux-system
kubectl logs -n flux-system deployment/kustomize-controller -f
```

### For Source issues:
```bash
flux describe gitrepository flux-system -n flux-system
kubectl logs -n flux-system deployment/source-controller -f
```

## Common Issue Patterns

1. **Changes Not Being Applied**
   - Verify sources are up-to-date and ready
   - Check if Kustomization/HelmRelease objects are configured correctly
   - Force reconciliation: `flux reconcile helmrelease <name> -n <namespace> --with-source`

2. **Install Retries Exhausted**
   - Check Helm release events for root cause
   - Review controller logs for detailed errors

3. **Slow Syncs**
   - Check for kubectl caching issues
   - Verify KUBECONFIG environment variable

4. **Source Errors**
   - Ensure `namespace: flux-system` in sourceRef
   - Check authentication and repository access

5. **Schema Validation Failures**
   - Compare values against chart schema: `helm show values <repo>/<chart> --version <version>`

6. **StatefulSet Immutable Field Errors**
   - Error: "StatefulSet.apps is invalid: spec: Forbidden: updates to statefulset spec"
   - Solution: Delete and recreate the StatefulSet
   ```bash
   flux suspend helmrelease <name> -n <namespace>
   kubectl delete statefulset <name> -n <namespace> --cascade=orphan
   kubectl delete pod <pod-name> -n <namespace> --force --grace-period=0
   kubectl delete helmrelease <name> -n <namespace>
   flux reconcile kustomization <parent-kustomization> -n flux-system --with-source
   ```

7. **PVC Access Mode Conflicts (Local-Path Provisioner)**
   - Error: "NodePath only supports ReadWriteOnce and ReadWriteOncePod access modes"
   - Solution: Delete pending PVC and ensure chart doesn't request ReadWriteMany
   ```bash
   kubectl delete pvc <pvc-name> -n <namespace>
   ```

8. **Duplicate Volume Mount Paths**
   - Error: "volumeMounts[].mountPath: Invalid value: must be unique"
   - Solution: Review HelmRelease values for duplicate mount paths
   - Common cause: Persistent logging conflicts with other mounts

## Recovery Actions

### Soft Reset (Suspend/Resume)
```bash
flux suspend kustomization <name> -n flux-system
# Apply manual fixes if needed
flux resume kustomization <name> -n flux-system
```

### Force Chart Re-fetch
```bash
kubectl delete helmchart -n flux-system <namespace>-<helmrelease-name>
flux reconcile helmrelease <name> -n <namespace> --with-source
```

### Complete Resource Recreation (for immutable resource errors)
```bash
# 1. Suspend the HelmRelease
flux suspend helmrelease <name> -n <namespace>

# 2. Delete all related resources
kubectl delete all -l release=<name> -n <namespace>
kubectl delete pvc -l release=<name> -n <namespace>

# 3. Delete the HelmRelease
kubectl delete helmrelease <name> -n <namespace>

# 4. Force parent Kustomization to recreate everything
flux reconcile kustomization cluster-apps -n flux-system
```

### Trace Resource Origin
```bash
flux trace --api-version apps/v1 --kind Deployment --name <name> -n <namespace>
```

## Real-time Monitoring
```bash
# Watch Flux logs
flux logs --follow --tail=50

# Monitor all cluster events
kubectl get events -A --sort-by='.lastTimestamp'
```

## Output Summary

After investigation, provide:
1. Root cause of the failure
2. Specific error messages found
3. Recommended fix with exact commands
4. Any configuration changes needed
5. Verification steps to confirm resolution

## Key Troubleshooting Pattern

Most Flux issues follow this resolution pattern:
**Suspend → Delete → Reconcile**

This is especially effective for:
- StatefulSet immutable field errors
- PVC access mode conflicts
- Stuck resources that won't update
- HelmRelease upgrade failures