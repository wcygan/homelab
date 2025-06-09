# Loki + Alloy Logging Stack Readiness Assessment

## Overview

This document provides a comprehensive readiness assessment for deploying Grafana Loki and Alloy (formerly Grafana Agent) as a centralized logging solution for the Kubernetes homelab. The logging stack will address current pain points with Airflow pod logs and provide cluster-wide log aggregation.

## Current State Analysis

### Pain Points
1. **Airflow Logs**: Currently using 100Gi PVC for local file logging
2. **No Centralized Logging**: Each application manages its own logs
3. **Limited Visibility**: Cannot easily search/correlate logs across services
4. **Storage Inefficiency**: Logs stored in expensive block storage

### Existing Infrastructure
- **Storage**: Ceph cluster with S3-compatible object storage ready
- **Monitoring**: Grafana already deployed via kube-prometheus-stack
- **Namespace**: `monitoring` namespace available for deployment
- **Documentation**: Basic implementation guide exists at `docs/logging/how-to-add.md`

## Prerequisites Validation

### ✅ Infrastructure Requirements

| Requirement | Status | Details |
|-------------|--------|---------|
| Kubernetes 1.24+ | ✅ | Running latest Talos Linux |
| Object Storage | ✅ | Ceph S3 available (not activated) |
| Monitoring Stack | ✅ | Grafana v11.4.0 deployed |
| Network Policies | ✅ | Cilium CNI supports policies |
| Resource Capacity | ✅ | 288GB RAM, ample CPU available |

### ✅ Storage Backend Options

| Storage Type | Available | Recommended | Notes |
|--------------|-----------|-------------|-------|
| Ceph S3 | ✅ | Yes | Production-grade, already deployed |
| Local Filesystem | ✅ | No | Not recommended for production |
| MinIO | ❌ | No | Redundant with Ceph S3 |

### ⚠️ Missing Components

| Component | Required | Action Needed |
|-----------|----------|---------------|
| Grafana Helm Repo | Yes | Add to `kubernetes/flux/meta/repos/` |
| S3 Bucket | Yes | Create via ObjectBucketClaim |
| S3 Credentials | Yes | Configure via External Secrets |

## Deployment Strategy Options

### Option 1: Simple Scalable Mode (Recommended)
- **Components**: Read/Write/Backend targets + Gateway
- **Pros**: Production-ready, horizontally scalable
- **Cons**: More complex, requires load balancer
- **Use Case**: Future-proof for log volume growth

### Option 2: Monolithic Mode
- **Components**: Single Loki binary
- **Pros**: Simple to deploy and manage
- **Cons**: Limited scalability
- **Use Case**: Quick start, can migrate later

### Option 3: Microservices Mode
- **Components**: Fully distributed components
- **Pros**: Maximum scalability
- **Cons**: Operational complexity
- **Use Case**: Very large deployments (>1TB/day)

## Resource Planning

### Estimated Requirements (Simple Scalable Mode)

| Component | CPU Request | Memory Request | Replicas | Total |
|-----------|-------------|----------------|----------|-------|
| Loki Write | 1 core | 2Gi | 3 | 3 cores, 6Gi |
| Loki Read | 1 core | 2Gi | 3 | 3 cores, 6Gi |
| Loki Backend | 0.5 core | 1Gi | 1 | 0.5 core, 1Gi |
| Gateway (Nginx) | 0.5 core | 512Mi | 2 | 1 core, 1Gi |
| Alloy (per node) | 0.5 core | 512Mi | 3 | 1.5 cores, 1.5Gi |
| **Total** | - | - | - | **9 cores, 15.5Gi** |

### Storage Requirements

| Storage Type | Size | Purpose |
|--------------|------|---------|
| S3 Chunks | 500Gi initial | Log data storage |
| S3 Index | 50Gi initial | Query acceleration |
| Local Cache | 10Gi per pod | Performance optimization |

## Risk Assessment

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| S3 misconfiguration | High | Test with small deployment first |
| Log volume explosion | Medium | Implement retention policies |
| Performance degradation | Medium | Use caching, tune queries |
| Alloy resource usage | Low | Set resource limits |

### Operational Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Learning curve | Medium | Start with monolithic mode |
| Monitoring gaps | Low | Gradual rollout by namespace |
| Cost of storage | Medium | Implement lifecycle policies |

## Migration Considerations

### From Current State
1. **Airflow Logs**: Can run in parallel initially
2. **Application Changes**: None required (stdout/stderr captured)
3. **Grafana Dashboards**: Can import pre-built dashboards
4. **Existing PVCs**: Can be retired after validation

### Promtail → Alloy Migration
- Promtail entering LTS phase (Feb 2025)
- EOL March 2026
- Alloy supports all Promtail features
- Migration tools available

## Success Criteria

1. **Functional Requirements**
   - [ ] All pod logs collected automatically
   - [ ] Logs queryable in Grafana
   - [ ] 30-day retention minimum
   - [ ] Sub-second query response

2. **Operational Requirements**
   - [ ] Automated deployment via GitOps
   - [ ] Monitoring and alerting configured
   - [ ] Backup/restore procedures documented
   - [ ] Resource usage within limits

3. **Performance Requirements**
   - [ ] Handle 100GB/day log volume
   - [ ] Query latency <1s for 24h window
   - [ ] 99.9% uptime for write path

## Recommendation

**Proceed with deployment** using:
1. **Simple Scalable Mode** for production readiness
2. **Ceph S3 backend** for cost-effective storage
3. **Phased rollout** starting with test namespaces
4. **Alloy** as the collection agent (not Promtail)

## Next Steps

1. Review and approve deployment strategy
2. Create S3 buckets in Ceph
3. Add Grafana Helm repository
4. Proceed to Phase 1: Planning & Design

---

**Assessment Date**: January 2025  
**Assessor**: AI-assisted analysis  
**Status**: READY TO PROCEED ✅