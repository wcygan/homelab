# Project Plan: Anton Homelab Enhancement

## Overview

Anton is a production-grade Kubernetes homelab running on 3x MS-01 mini PCs with
Talos Linux and Flux GitOps. This plan outlines comprehensive improvements to
enhance operational maturity, reliability, and feature completeness. The homelab
already demonstrates strong GitOps patterns but requires enhancements in
storage, observability, standardization, and automation.

## Current State Assessment

### Strengths

- Mature GitOps structure with Flux v2.5.1
- Well-architected networking (Cilium, dual ingress)
- Modern infrastructure choices (Talos Linux, CloudNative PG, DragonflyDB)
- Comprehensive monitoring scripts using Deno
- Clear documentation and conventions

### Key Gaps

- No distributed storage (local-path only)
- No centralized logging solution
- Inconsistent Flux configurations (retries, intervals, health checks)
- Missing resource limits on many workloads
- No backup/disaster recovery solution
- Limited automation for operational tasks

## Task Breakdown

### Phase 1: Foundation & Standardization (Parallel Tasks)

#### Task 1.1: Flux Configuration Standardization

- **Description**: Implement consistent Flux configurations across all
  Kustomizations
- **Files**: All `kubernetes/apps/**/ks.yaml` files
- **Dependencies**: None (can run in parallel)
- **Estimated Time**: 4 hours
- **Agent Assignment**: Agent A
- **Deliverables**:
  - Standardized retry strategies (finite retries)
  - Consistent interval configurations based on criticality
  - Health checks on all Kustomizations
  - Explicit dependencies where needed
  - Timeouts on all resources

#### Task 1.2: Resource Limits Implementation

- **Description**: Add resource requests/limits to all HelmReleases and
  deployments
- **Files**: All `kubernetes/apps/**/helmrelease.yaml` files
- **Dependencies**: None (can run in parallel)
- **Estimated Time**: 3 hours
- **Agent Assignment**: Agent B
- **Deliverables**:
  - Resource analysis for each workload
  - Appropriate requests/limits based on usage patterns
  - Documentation of resource allocation strategy

#### Task 1.3: Secrets Migration Completion

- **Description**: Complete migration from SOPS to 1Password for all remaining
  secrets
- **Files**: All `*.sops.yaml` files
- **Dependencies**: None (can run in parallel)
- **Estimated Time**: 2 hours
- **Agent Assignment**: Agent C
- **Deliverables**:
  - Identify remaining SOPS-encrypted secrets
  - Migrate to 1Password External Secrets
  - Update documentation
  - Remove deprecated SOPS configurations

#### Task 1.4: Monitoring Enhancement

- **Description**: Create comprehensive monitoring dashboards and alerts
- **Files**: `kubernetes/apps/monitoring/kube-prometheus-stack/`
- **Dependencies**: None (can run in parallel)
- **Estimated Time**: 4 hours
- **Agent Assignment**: Agent D
- **Deliverables**:
  - Flux-specific Grafana dashboards
  - AlertManager rules for critical failures
  - SLI/SLO definitions
  - Resource usage dashboards

### Phase 2: Join Point 1

- Merge all Phase 1 improvements
- Run comprehensive validation scripts
- Ensure cluster stability with new configurations
- Document any conflicts or adjustments needed

### Phase 3: Storage Infrastructure (Sequential)

#### Task 3.1: Rook Ceph Deployment

- **Description**: Deploy Rook Ceph for unified block, object, and file storage
- **Dependencies**: Phase 2 completion
- **Estimated Time**: 8 hours
- **Deliverables**:
  - Rook operator deployment
  - Ceph cluster configuration
  - CephBlockPool for RBD volumes
  - CephObjectStore for S3-compatible storage
  - CephFilesystem for shared file storage
  - Storage class configurations (block/file)
  - Ceph dashboard deployment
  - Performance benchmarks
  - Initial volume migration strategy

#### Task 3.2: Ceph Storage Configuration

- **Description**: Configure Ceph storage pools and access policies
- **Dependencies**: Task 3.1 (Rook Ceph base deployment)
- **Estimated Time**: 3 hours
- **Deliverables**:
  - S3 bucket creation for backups/logs
  - User and access key configuration
  - Replication and retention policies
  - Storage quotas setup
  - Integration testing with applications

### Phase 4: Observability Stack (Parallel Tasks)

#### Task 4.1: Loki Deployment

- **Description**: Deploy Loki for centralized log aggregation
- **Files**: Create `kubernetes/apps/monitoring/loki/`
- **Dependencies**: Task 3.2 (Ceph S3 for storage backend)
- **Estimated Time**: 4 hours
- **Agent Assignment**: Agent A
- **Deliverables**:
  - Loki deployment with Ceph S3 backend
  - Retention policies
  - Performance tuning
  - Query optimization

#### Task 4.2: Alloy Configuration

- **Description**: Deploy and configure Grafana Alloy for log collection
- **Files**: Create `kubernetes/apps/monitoring/alloy/`
- **Dependencies**: Task 3.2 (Ceph S3)
- **Estimated Time**: 3 hours
- **Agent Assignment**: Agent B
- **Deliverables**:
  - Alloy DaemonSet deployment
  - Log parsing rules
  - Metadata enrichment
  - Integration with Loki

### Phase 5: Join Point 2

- Validate complete observability stack
- Test log flow from applications to Loki
- Create example queries and dashboards
- Document troubleshooting procedures

### Phase 6: Disaster Recovery & Operations

#### Task 6.1: Velero Deployment

- **Description**: Deploy Velero for backup and disaster recovery
- **Dependencies**: Phase 5 completion
- **Estimated Time**: 5 hours
- **Deliverables**:
  - Velero deployment with Ceph S3 backend
  - Backup schedules for all namespaces
  - Restore procedures documentation
  - Disaster recovery runbooks

#### Task 6.2: Operational Automation

- **Description**: Create automated operational procedures
- **Dependencies**: Task 6.1
- **Estimated Time**: 6 hours
- **Deliverables**:
  - Automated health check improvements
  - Emergency rollback procedures
  - Performance troubleshooting scripts
  - Capacity planning automation

### Phase 7: Security Hardening (Parallel Tasks)

#### Task 7.1: Network Policies

- **Description**: Implement zero-trust networking with Cilium
- **Files**: Create network policies for each namespace
- **Dependencies**: Phase 6 completion
- **Estimated Time**: 4 hours
- **Agent Assignment**: Agent A
- **Deliverables**:
  - Default deny policies
  - Application-specific allow rules
  - Policy validation tests
  - Traffic flow documentation

#### Task 7.2: Pod Security Standards

- **Description**: Enforce security contexts and Pod Security Standards
- **Files**: All deployment manifests
- **Dependencies**: Phase 6 completion
- **Estimated Time**: 3 hours
- **Agent Assignment**: Agent B
- **Deliverables**:
  - Pod Security Policy enforcement
  - Security context templates
  - Admission controller configuration
  - Compliance reporting

### Phase 8: Application Deployment

#### Task 8.1: Priority Applications

- **Description**: Deploy high-priority applications from backlog
- **Dependencies**: Phase 7 completion
- **Estimated Time**: 8 hours
- **Applications** (in order):
  1. Flux WebUI (or ArgoCD)
  2. Uptime Kuma
  3. Immich
  4. Additional apps as time permits

## Execution Strategy

### Multi-Agent Setup

```bash
# Terminal 1 - Agent A (Flux & Monitoring)
git checkout -b feature/flux-standardization
# Work on Tasks 1.1, 4.1, 7.1

# Terminal 2 - Agent B (Resources & Security)
git checkout -b feature/resource-management
# Work on Tasks 1.2, 4.2, 7.2

# Terminal 3 - Agent C (Secrets & Storage)
git checkout -b feature/secrets-storage
# Work on Tasks 1.3, 3.1, 3.2

# Terminal 4 - Agent D (Monitoring & Operations)
git checkout -b feature/monitoring-ops
# Work on Tasks 1.4, 6.1, 6.2
```

### Coordination Points

1. **Daily Sync**: 9 AM review of progress and blockers
2. **Status Tracking**: Update `/tmp/anton-status.md` hourly
3. **PR Strategy**: Create draft PRs early for visibility
4. **Testing**: Run validation scripts before each merge
5. **Documentation**: Update relevant docs with each change

### Risk Mitigation

1. **Backup Current State**: Full cluster backup before major changes
2. **Staged Rollout**: Test changes in non-critical namespaces first
3. **Rollback Plan**: Document rollback procedures for each phase
4. **Communication**: Use PR comments for cross-agent coordination
5. **Validation**: Automated testing at each join point

## Success Criteria

### Phase 1 (Standardization)

- [ ] All Flux configurations follow consistent patterns
- [ ] 100% of workloads have resource limits
- [ ] Zero SOPS secrets remaining
- [ ] Monitoring dashboards deployed

### Phase 3 (Storage)

- [ ] Rook Ceph cluster healthy and balanced
- [ ] CephBlockPool providing RBD volumes
- [ ] CephObjectStore serving S3 API successfully
- [ ] CephFilesystem providing shared storage
- [ ] All stateful apps migrated to Ceph storage

### Phase 4 (Observability)

- [ ] All pod logs collected in Loki
- [ ] Log retention meeting requirements
- [ ] Query performance < 5 seconds

### Phase 6 (Operations)

- [ ] Successful backup/restore test
- [ ] Automated runbooks in place
- [ ] Recovery time < 30 minutes

### Phase 7 (Security)

- [ ] Network policies enforced
- [ ] All pods running non-root
- [ ] Security scan passing

### Overall Project

- [ ] Zero critical alerts
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Performance baselines established

## Timeline

- **Week 1**: Phase 1 (Foundation & Standardization)
- **Week 2**: Phase 3 (Storage Infrastructure)
- **Week 3**: Phase 4 (Observability) + Phase 5 (Integration)
- **Week 4**: Phase 6 (Disaster Recovery)
- **Week 5**: Phase 7 (Security Hardening)
- **Week 6**: Phase 8 (Applications) + Final Testing

## Progress Tracking

### Automated Todo Generation

```typescript
// Script to generate todos from this plan
import { TodoWrite } from "./scripts/lib/todo.ts";

const phases = [
  { name: "Phase 1", tasks: ["1.1", "1.2", "1.3", "1.4"] },
  { name: "Phase 3", tasks: ["3.1", "3.2"] },
  // ... etc
];

phases.forEach((phase) => {
  phase.tasks.forEach((taskId) => {
    TodoWrite.create({
      content: `Complete Task ${taskId}`,
      status: "pending",
      priority: "high",
      phase: phase.name,
    });
  });
});
```

### Monitoring Progress

- Use `./scripts/flux-deployment-check.ts` after each change
- Run `./scripts/k8s-health-check.ts` hourly during execution
- Track metrics before/after each phase
- Document lessons learned in `/docs/enhancement-project/`

## Post-Implementation

1. **Documentation Update**: Comprehensive update of all docs
2. **Runbook Creation**: Operational procedures for new components
3. **Training**: Knowledge transfer sessions
4. **Monitoring Review**: 30-day stability assessment
5. **Optimization**: Performance tuning based on metrics
