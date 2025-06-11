<!--
name: data-platform-bootstrap-execute
purpose: Execute the next pending objective in the Data Platform bootstrap process
tags: data-platform, iceberg, trino, spark, execute, automation
-->

Execute the next pending objective in the Data Platform bootstrap initiative, automatically gathering context and creating required deliverables for Apache Iceberg + Trino + Spark Operator deployment.

## Execution Parameters:
- **Optional**: Specific objective ID to execute (e.g., "1.2", "2.1")
- **Usage**: `/project:data-platform-bootstrap-execute` or `/project:data-platform-bootstrap-execute 1.2`

## Execution Steps:

1. **Load Current State**
   - Read `/docs/data-platform/bootstrap/goals.json` to identify current objective
   - If specific objective ID provided in `$ARGUMENTS`, validate it exists and prerequisites are met
   - Otherwise, find the next pending objective in sequence

2. **Gather Context**
   - Search codebase for relevant patterns and examples from existing deployments
   - Check existing storage configurations in `kubernetes/apps/storage/`
   - Review Airflow configuration in `kubernetes/apps/airflow/`
   - Examine monitoring stack patterns in `kubernetes/apps/monitoring/`
   - **Reference Existing Patterns**:
     - HelmRelease patterns from existing applications
     - Resource allocation strategies from current workloads
     - Monitoring integration from Prometheus stack
     - Storage integration from Ceph deployments

3. **Validate Prerequisites**
   - Check infrastructure requirements for the objective
   - Verify resource availability and capacity
   - Validate dependent services are operational
   - Confirm trigger conditions are met (if executing first objective)

4. **Execute Deliverables**
   Based on the objective type, perform appropriate actions:
   
   **For Configuration Tasks:**
   - Create required YAML manifests following GitOps patterns
   - Update Kustomization files with proper namespace configuration
   - Add necessary HelmRepository sources to `kubernetes/flux/meta/repos/`
   - Create ExternalSecret configurations for credentials
   
   **For Validation Tasks:**
   - Create validation scripts using established patterns
   - Run checks and capture output with proper error handling
   - Document results with structured JSON output when possible
   
   **For Integration Tasks:**
   - Update existing configurations (e.g., Airflow values)
   - Create new namespace and RBAC configurations
   - Implement monitoring integrations with ServiceMonitor

5. **Follow GitOps Patterns**
   - Use established directory structure: `kubernetes/apps/{namespace}/{app-name}/`
   - Create proper Kustomization hierarchies with `ks.yaml` files
   - Reference HelmRepository sources from `flux/meta/repos/`
   - Include proper resource limits and requests
   - Add monitoring labels and ServiceMonitor configurations

6. **Update Tracking**
   - Update objective status to "completed" in goals.json
   - Record completion timestamp
   - Update phase progress percentage
   - Identify next pending objective

7. **Validate Completion**
   - Run validation criteria specified in the objective
   - Ensure all deliverables are complete and functional
   - Check that artifacts exist and follow project conventions
   - Verify GitOps deployment succeeds

## Decision Flow:

```
IF trigger conditions not met AND executing first objective:
  -> Inform user and recommend waiting or manual override
  
IF executing specific objective (via $ARGUMENTS):
  -> Validate objective exists and prerequisites met
  -> Execute that specific objective
  
ELSE (automatic mode):
  -> Find first objective with status="pending" and met prerequisites
  -> Execute that objective
  
AFTER execution:
  -> Update goals.json with completion status
  -> Run validation commands
  -> Report completion and next steps
```

## Output Format:

```markdown
# Executing Objective [ID]: [Name]

## Pre-execution Checks
✅ Prerequisites validated: [list]
✅ Resources available: [memory/CPU/storage]
✅ Dependencies operational: [list services]

## Actions Taken
1. [Action performed with file path or command]
2. [Action performed with configuration details]
3. [Action performed with validation result]

## Files Created/Modified
- ✅ [File path]: [purpose/description]
- ✅ [File path]: [purpose/description]

## Deliverables Completed
- ✅ [Deliverable 1]: [artifact path or validation command]
- ✅ [Deliverable 2]: [artifact path or validation result]

## Validation Results
```bash
# [Validation command executed]
[Command output or success confirmation]
```

## GitOps Deployment
- Namespace: [namespace]
- Kustomization: [ks.yaml location]
- HelmRelease: [helmrelease.yaml location]  
- Dependencies: [list dependencies]

## Status Update
- Objective [ID] marked as completed at [timestamp]
- Phase [ID] progress: [X/Y objectives complete]
- Next pending objective: [next objective ID and name]

## Next Steps
[Either next objective details or phase completion message]

## Command for Next Step
```
/project:data-platform-bootstrap-execute
```
```

## Error Handling:

If execution fails:
1. Roll back any partial changes using GitOps principles
2. Update objective status to "blocked" with failure reason
3. Document the specific error and context
4. Suggest remediation steps or prerequisite fixes
5. Provide debugging commands for investigation

## Important Notes:

- Only execute ONE objective per invocation
- Always validate prerequisites before starting work
- Create actual working configurations, not templates or examples
- Test all configurations using kubectl dry-run when possible
- Maintain GitOps principles (all changes via Git)
- Follow established project patterns for consistency
- Use proper resource limits and monitoring integration
- Ensure proper RBAC and security configurations

## Data Platform Specific Patterns:

### Namespace Structure
```yaml
# kubernetes/apps/data-platform/{component}/
├── app/
│   ├── helmrelease.yaml
│   ├── kustomization.yaml
│   └── [component-specific configs]
└── ks.yaml
```

### Resource Allocation Guidelines
- **Hive Metastore**: 4GB RAM, 200m CPU
- **Spark Operator**: 512MB RAM, 200m CPU  
- **Trino Coordinator**: 8GB RAM, 500m CPU
- **Trino Workers**: 24GB RAM each, 2000m CPU

### Monitoring Integration
- Include ServiceMonitor for Prometheus metrics
- Add Grafana dashboard ConfigMaps when available
- Configure alert rules for critical components