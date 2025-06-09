<!--
name: ceph-bootstrap-review
purpose: Review current status of Ceph bootstrap initiative and determine next actions
tags: ceph, storage, review, status
-->

Review the current status of the Ceph distributed storage bootstrap initiative and provide actionable next steps.

## Analysis Steps:

1. **Read Bootstrap Documentation**
   - Read all files in `/docs/ceph/bootstrap/` directory in order (00-readiness.md through 05-ROADMAP.md)
   - Pay special attention to trigger conditions and requirements
   - Review implementation examples in `/docs/ceph/ceph-examples/`:
     - `onedr0p-home-ops.md` - Simple, practical approach
     - `joryirving-home-ops.md` - Enterprise-grade structure
     - `rook-ceph-quickstart.md` - Official Rook patterns

2. **Parse Goal Tracking Data**
   - Read and analyze `/docs/ceph/bootstrap/goals.json`
   - Identify current phase and objective status
   - Check prerequisites and dependencies

3. **Validate Current State**
   - Check current storage usage: `kubectl get pv -A` and sum up capacities
   - Verify if any workloads require RWX access: `kubectl get pvc -A -o json | jq '.items[] | select(.spec.accessModes[] | contains("ReadWriteMany"))'`
   - Check for S3 requirements in pending deployments
   - Validate production workload status

4. **Generate Status Report**
   - Current phase and progress percentage
   - Trigger condition evaluation
   - Blocking issues or unmet prerequisites
   - Next objective details with specific actions

## Output Format:

```markdown
# Ceph Bootstrap Status Review

## Current Status
- **Phase**: [Current phase name and ID]
- **Progress**: [X/Y objectives completed]
- **Initiative Status**: [pending/active/completed]

## Trigger Conditions
| Condition | Threshold | Current | Status |
|-----------|-----------|---------|---------|
| Storage Usage | >100Gi | [current] | ✅/❌ |
| Production Workloads | Required | [yes/no] | ✅/❌ |
| RWX Access | Required | [yes/no] | ✅/❌ |
| S3 Storage | Required | [yes/no] | ✅/❌ |

## Current Objective
**[Objective ID]: [Objective Name]**
- Status: [pending/in_progress/completed/blocked]
- Prerequisites: [list any]
- Deliverables:
  - [ ] [Deliverable 1]
  - [ ] [Deliverable 2]

## Blocking Issues
[List any blockers preventing progress]

## Recommended Next Actions
1. [Specific action item]
2. [Specific action item]

## Command to Execute
To proceed with the current objective, run:
```
/project:ceph-bootstrap-execute
```
```

Focus on providing clear, actionable information that helps determine whether to proceed with Ceph deployment or continue waiting for trigger conditions.