<!--
name: data-platform-bootstrap-review
purpose: Review current status of Data Platform bootstrap initiative and determine next actions
tags: data-platform, iceberg, trino, spark, review, status
-->

Review the current status of the Data Platform bootstrap initiative and provide actionable next steps for deploying Apache Iceberg + Trino + Spark Operator.

## Analysis Steps:

1. **Read Bootstrap Documentation**
   - Read all files in `/docs/data-platform/bootstrap/` directory in order (00-readiness.md through 04-production.md)
   - Pay special attention to trigger conditions and resource requirements
   - Review existing data platform documentation in `/docs/data-platform/`:
     - `investigation.md` - Technical analysis and architecture decisions
     - `proposal.md` - Strategic goals and roadmap

2. **Parse Goal Tracking Data**
   - Read and analyze `/docs/data-platform/bootstrap/goals.json`
   - Identify current phase and objective status
   - Check prerequisites and dependencies
   - Evaluate trigger conditions

3. **Validate Current State**
   - Check Ceph S3 storage readiness: `kubectl get cephobjectstore -n storage storage -o jsonpath='{.status.phase}'`
   - Verify cluster resource availability: `kubectl top nodes` 
   - Check Airflow status: `kubectl get helmrelease -n airflow airflow -o jsonpath='{.status.conditions[0].type}'`
   - Assess current storage usage: `kubectl get pvc -A --no-headers | awk '{print $4}' | grep -v "<none>"`
   - Check for data processing requirements in existing workloads

4. **Generate Status Report**
   - Current phase and progress percentage
   - Trigger condition evaluation 
   - Blocking issues or unmet prerequisites
   - Next objective details with specific actions

## Output Format:

```markdown
# Data Platform Bootstrap Status Review

## Current Status
- **Initiative**: [pending/active/completed]
- **Phase**: [Current phase name and ID]
- **Progress**: [X/Y objectives completed]
- **Next Objective**: [Next pending objective ID and name]

## Trigger Conditions
| Condition | Threshold | Current | Status |
|-----------|-----------|---------|--------|
| Storage Usage | >200Gi | [current] | ✅/❌ |
| S3 Requirements | Required | [yes/no] | ✅/❌ |
| Analytics Requirements | Required | [yes/no] | ✅/❌ |
| Data Processing | Required | [yes/no] | ✅/❌ |

## Infrastructure Readiness
| Component | Status | Details |
|-----------|--------|---------|
| Ceph S3 Storage | [Ready/NotReady] | [status details] |
| Available Resources | [Sufficient/Insufficient] | [memory/CPU available] |
| Airflow Orchestration | [Ready/NotReady] | [deployment status] |
| Monitoring Stack | [Ready/NotReady] | [Prometheus/Grafana status] |

## Current Objective
**[Objective ID]: [Objective Name]**
- Status: [pending/in_progress/completed/blocked]
- Prerequisites: [list any unmet prerequisites]
- Deliverables:
  - [ ] [Deliverable 1]
  - [ ] [Deliverable 2]

## Blocking Issues
[List any blockers preventing progress]

## Resource Impact Assessment
- **Memory Impact**: [X]GB additional RAM required (current: [Y]GB available)
- **CPU Impact**: [X] cores additional required (current: [Y] cores available)  
- **Storage Impact**: [X]GB additional storage required
- **Risk Level**: [Low/Medium/High] based on resource availability

## Recommended Next Actions
1. [Specific action item with kubectl command if applicable]
2. [Specific action item with validation step]
3. [Specific action item with expected outcome]

## Command to Execute
To proceed with the current objective, run:
```
/project:data-platform-bootstrap-execute
```

## Command to Execute Specific Objective
To execute a specific objective (e.g., 1.2), run:
```
/project:data-platform-bootstrap-execute 1.2
```
```

Focus on providing clear, actionable information that helps determine whether to proceed with data platform deployment or continue waiting for trigger conditions. Include specific kubectl commands for validation and resource assessment.