# SSD Installation Checklist

This checklist guides you through adding SSDs to your Talos Linux cluster nodes.

## Pre-Installation Phase

### 1. Verify Cluster Health
- [ ] Run comprehensive health check: `deno task monitor:all`
- [ ] Verify all nodes are Ready: `kubectl get nodes`
- [ ] Check etcd health: `kubectl -n kube-system get pods -l component=etcd`
- [ ] Ensure no pending Flux reconciliations: `flux get all -A`
- [ ] Document any existing issues before proceeding

### 2. Backup Current Configuration
- [ ] Backup Talos config: `cp -r talos/clusterconfig talos/clusterconfig.backup-$(date +%Y%m%d)`
- [ ] Export current disk configuration:
  ```bash
  for ip in 192.168.1.98 192.168.1.99 192.168.1.100; do
    echo "=== Node $ip ===" >> pre-ssd-disk-inventory.txt
    talosctl get disks -n $ip >> pre-ssd-disk-inventory.txt
  done
  ```
- [ ] Save cluster state: `kubectl cluster-info dump --output-directory=/tmp/cluster-state-$(date +%Y%m%d)`
- [ ] Document current storage usage: `./scripts/storage-health-check.ts --json > pre-ssd-storage-state.json`

### 3. Prepare Node-Specific Information
- [ ] Node order: k8s-3 → k8s-2 → k8s-1 (start with least critical)
- [ ] Create tracking sheet with columns: Node Name | IP | Current Serial | New SSD Serial | Status

## Per-Node Installation Process

### Node: k8s-3 (192.168.1.100)

#### Pre-Installation
- [ ] Set node variables:
  ```bash
  export NODE_NAME="k8s-3"
  export NODE_IP="192.168.1.100"
  ```
- [ ] Verify node health: `kubectl describe node ${NODE_NAME}`
- [ ] Check workloads on node: `kubectl get pods --field-selector spec.nodeName=${NODE_NAME} -A`
- [ ] Cordon node: `kubectl cordon ${NODE_NAME}`
- [ ] Drain node: `kubectl drain ${NODE_NAME} --ignore-daemonsets --delete-emptydir-data --force --timeout=600s`
- [ ] Verify drain completed: `kubectl get pods --field-selector spec.nodeName=${NODE_NAME} -A`

#### Physical Installation
- [ ] Power down node via Talos: `talosctl shutdown -n ${NODE_IP}`
- [ ] Wait for complete shutdown (verify no ping response)
- [ ] Physically install SSD in available slot
- [ ] Power on node
- [ ] Wait for node to boot: `talosctl health -n ${NODE_IP} --wait-timeout 10m`

#### Post-Installation Configuration
- [ ] Get new disk information: `talosctl get disks -n ${NODE_IP}`
- [ ] Record new SSD serial number: ________________
- [ ] Create storage patch file:
  ```bash
  cat > talos/patches/${NODE_NAME}/storage.yaml << EOF
  machine:
    volumes:
      - name: fast-storage
        mountpoint: /var/mnt/fast
        diskSelector:
          serial: "PASTE_NEW_SSD_SERIAL_HERE"
        filesystem:
          type: xfs
  EOF
  ```
- [ ] Update serial in patch file with actual value
- [ ] Generate new config: `task talos:generate-config`
- [ ] Apply configuration: `task talos:apply-node IP=${NODE_IP} MODE=auto`
- [ ] Wait for node ready: `kubectl wait --for=condition=Ready node/${NODE_NAME} --timeout=300s`
- [ ] Verify SSD mounted: `talosctl read /proc/mounts -n ${NODE_IP} | grep fast`
- [ ] Uncordon node: `kubectl uncordon ${NODE_NAME}`
- [ ] Verify workloads scheduled back: `kubectl get pods --field-selector spec.nodeName=${NODE_NAME} -A`

#### Verification
- [ ] Node status healthy: `kubectl get node ${NODE_NAME}`
- [ ] Storage accessible: `talosctl ls /var/mnt/fast -n ${NODE_IP}`
- [ ] No errors in logs: `talosctl logs -n ${NODE_IP} | grep -i error | tail -20`
- [ ] Flux reconciliations successful: `flux get all -A | grep False`

### Node: k8s-2 (192.168.1.99)
*Repeat all steps above with:*
- [ ] NODE_NAME="k8s-2"
- [ ] NODE_IP="192.168.1.99"

### Node: k8s-1 (192.168.1.98)
*Repeat all steps above with:*
- [ ] NODE_NAME="k8s-1"
- [ ] NODE_IP="192.168.1.98"

## Post-Installation Tasks

### 1. Verify Cluster Health
- [ ] All nodes Ready: `kubectl get nodes`
- [ ] Run full health check: `deno task monitor:all`
- [ ] Compare storage state: `./scripts/storage-health-check.ts --json | diff pre-ssd-storage-state.json -`
- [ ] Check etcd cluster health: `kubectl -n kube-system exec -it etcd-k8s-1 -- etcdctl member list`

### 2. Configure Kubernetes Storage
- [ ] Create StorageClass for fast storage (if using CSI driver)
- [ ] Update PV/PVC configurations as needed
- [ ] Test storage with sample pod:
  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: storage-test
  spec:
    containers:
    - name: test
      image: busybox
      command: ['sh', '-c', 'echo "Storage test successful" > /mnt/test/success.txt && cat /mnt/test/success.txt']
      volumeMounts:
      - name: fast-storage
        mountPath: /mnt/test
    volumes:
    - name: fast-storage
      hostPath:
        path: /var/mnt/fast
        type: Directory
    nodeSelector:
      kubernetes.io/hostname: k8s-1
  ```

### 3. Update Documentation
- [ ] Update hardware inventory in repository
- [ ] Commit talconfig changes: `git add talos/ && git commit -m "feat: add SSD storage to cluster nodes"`
- [ ] Document any issues encountered
- [ ] Update monitoring thresholds if needed

## Rollback Plan

If issues occur during installation:

1. **Node won't boot after SSD installation:**
   - Remove SSD and reboot
   - Apply original config without storage patch
   - Investigate hardware compatibility

2. **Configuration apply fails:**
   - Restore from backup: `cp -r talos/clusterconfig.backup-$(date +%Y%m%d)/* talos/clusterconfig/`
   - Regenerate and reapply: `task talos:generate-config && task talos:apply-node IP=${NODE_IP} MODE=auto`

3. **Cluster instability after changes:**
   - Check etcd health and quorum
   - Review logs: `talosctl logs -n ${NODE_IP} | grep -E "(error|fail|critical)"`
   - Consider reverting one node at a time

## Success Criteria

- [ ] All nodes report Ready status
- [ ] New SSDs mounted at `/var/mnt/fast` on all nodes
- [ ] No Flux reconciliation failures
- [ ] Storage test pod runs successfully
- [ ] Monitoring shows healthy cluster state
- [ ] No increase in error logs

## Notes Section

Use this space to document:
- Actual SSD models/serials installed
- Any deviations from the process
- Performance observations
- Lessons learned

---

**Started:** _______________  
**Completed:** _______________  
**Performed by:** _______________