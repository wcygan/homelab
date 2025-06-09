<!--
name: logging-stack-review
purpose: Review current status of Loki + Alloy logging stack initiative and determine next actions
tags: logging, loki, alloy, observability, review, status
-->

Review the current status of the Loki + Alloy centralized logging stack deployment initiative and provide actionable next steps.

## Analysis Steps:

1. **Read Bootstrap Documentation**
   - Read all files in `/docs/logging-stack/bootstrap/` directory in order
   - Pay special attention to trigger conditions and deployment strategy
   - Review the quickstart guide for simplified deployment options

2. **Parse Goal Tracking Data**
   - Read and analyze `/docs/logging-stack/bootstrap/03-goals.json`
   - Identify current phase and objective status
   - Check prerequisites and dependencies

3. **Validate Current State**
   - Check if Ceph ObjectStore is enabled: `ls kubernetes/apps/storage/rook-ceph-objectstore/ks.yaml*`
   - Verify Grafana Helm repository exists: `ls kubernetes/flux/meta/repos/grafana.yaml`
   - Check current logging volume: `kubectl get pvc -A | grep -E "airflow|log"`
   - Validate monitoring stack health: `kubectl get pods -n monitoring`
   - Check for existing Loki/Alloy deployments: `kubectl get hr -n monitoring | grep -E "loki|alloy"`

4. **Assess Infrastructure Readiness**
   - S3 storage availability (Ceph ObjectStore status)
   - Resource capacity (need 15.5Gi RAM for Simple Scalable mode)
   - External Secrets configuration
   - Network policies support

5. **Generate Status Report**
   - Current phase and progress percentage
   - Trigger condition evaluation
   - Blocking issues or unmet prerequisites
   - Next objective details with specific actions

## Output Format:

```markdown
# Logging Stack Deployment Status Review

## Current Status
- **Phase**: [Current phase name and ID]
- **Progress**: [X/Y objectives completed]
- **Initiative Status**: [pending/active/completed]

## Trigger Conditions
| Condition | Threshold | Current | Status |
|-----------|-----------|---------|---------|
| Airflow PVC Usage | >80Gi | [current] | ✅/❌ |
| Cross-Service Correlation | Needed | [yes/no] | ✅/❌ |
| Ceph S3 Ready | Required | [yes/no] | ✅/❌ |
| Debugging Pain | High | [yes/no] | ✅/❌ |

## Infrastructure Readiness
| Component | Required | Current | Status |
|-----------|----------|---------|---------|
| Ceph ObjectStore | Yes | [enabled/disabled] | ✅/❌ |
| Grafana Helm Repo | Yes | [exists/missing] | ✅/❌ |
| External Secrets | Yes | [configured/missing] | ✅/❌ |
| Resource Capacity | 15.5Gi RAM | [available] | ✅/❌ |

## Current Objective
**[Objective ID]: [Objective Name]**
- Status: [pending/in_progress/completed/blocked]
- Prerequisites: [list any]
- Deliverables:
  - [ ] [Deliverable 1]
  - [ ] [Deliverable 2]

## Deployment Strategy
- **Mode**: [Monolithic/Simple Scalable/Microservices]
- **Storage**: [Filesystem/S3]
- **Agent**: [Alloy/Promtail]

## Blocking Issues
[List any blockers preventing progress]

## Recommended Next Actions
1. [Specific action item]
2. [Specific action item]

## Command to Execute
To proceed with the current objective, run:
```
/project:logging-stack-execute
```

## Quick Start Alternative
For rapid deployment with minimal configuration:
```
/project:logging-stack-execute quickstart
```
```

Focus on providing clear, actionable information about whether to proceed with production deployment or use the quickstart approach.