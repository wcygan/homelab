# Data Platform Bootstrap Commands

This document describes the available commands for managing the Data Platform bootstrap process.

## Available Commands

### Review Command: `/project:data-platform-bootstrap-review`

**Purpose**: Review current status and determine next actions for the Data Platform deployment.

**What it does**:
- Analyzes current cluster state and resource availability
- Evaluates trigger conditions for data platform deployment
- Checks infrastructure prerequisites (Ceph, Airflow, monitoring)
- Identifies blocking issues and next steps
- Provides detailed status report with actionable recommendations

**When to use**:
- Before starting the bootstrap process
- To check current progress and status
- When troubleshooting deployment issues
- To assess readiness for next phase

**Example usage**:
```bash
# Review current status
/project:data-platform-bootstrap-review
```

### Execute Command: `/project:data-platform-bootstrap-execute`

**Purpose**: Execute the next pending objective or a specific objective in the bootstrap process.

**What it does**:
- Loads current state from goals.json tracking
- Validates prerequisites and resource availability
- Creates required Kubernetes manifests and configurations
- Follows GitOps patterns for deployment
- Updates progress tracking automatically
- Validates completion of deliverables

**Usage modes**:
1. **Automatic**: Executes next pending objective
2. **Specific**: Executes a particular objective by ID

**Example usage**:
```bash
# Execute next pending objective automatically
/project:data-platform-bootstrap-execute

# Execute specific objective (e.g., Hive Metastore deployment)
/project:data-platform-bootstrap-execute 1.2

# Execute specific objective in different phase
/project:data-platform-bootstrap-execute 3.1
```

## Command Workflow

### Typical Usage Pattern

1. **Initial Assessment**:
   ```bash
   /project:data-platform-bootstrap-review
   ```
   - Check if trigger conditions are met
   - Verify infrastructure readiness
   - Assess resource availability

2. **Begin Execution** (if ready):
   ```bash
   /project:data-platform-bootstrap-execute
   ```
   - Starts with Objective 1.1 (S3 Storage Validation)
   - Creates necessary configurations
   - Validates completion

3. **Continue Progress**:
   ```bash
   /project:data-platform-bootstrap-review  # Check status
   /project:data-platform-bootstrap-execute  # Next objective
   ```
   - Repeat cycle for each objective
   - Review between phases for validation

4. **Handle Issues**:
   ```bash
   /project:data-platform-bootstrap-review
   ```
   - Identify blocking issues
   - Get specific remediation steps
   - Resume with execute command

### Advanced Usage

**Skip Prerequisites** (use with caution):
If you need to proceed despite unmet trigger conditions, the execute command can be used with manual override by acknowledging the risks.

**Execute Out of Order**:
```bash
# Jump to specific objective if prerequisites are manually satisfied
/project:data-platform-bootstrap-execute 2.1
```

**Retry Failed Objective**:
```bash
# Re-run specific objective after fixing issues
/project:data-platform-bootstrap-execute 1.2
```

## Integration with GitOps

Both commands are designed to work seamlessly with the existing GitOps workflow:

### File Locations Created
- **Manifests**: `kubernetes/apps/data-platform/{component}/`
- **Tracking**: `docs/data-platform/bootstrap/goals.json`
- **Documentation**: `docs/data-platform/bootstrap/*.md`

### Flux Integration
- Creates proper Kustomization files (`ks.yaml`)
- References HelmRepository sources from `kubernetes/flux/meta/repos/`
- Follows established naming and labeling conventions
- Includes proper dependencies and health checks

### Monitoring Integration
- Adds ServiceMonitor configurations for Prometheus
- Creates Grafana dashboard ConfigMaps
- Includes alert rules for critical components

## Progress Tracking

### Goals.json Structure
The system maintains detailed progress in `docs/data-platform/bootstrap/goals.json`:

```json
{
  "phases": [
    {
      "id": "phase_1",
      "status": "pending|in_progress|completed",
      "objectives": [
        {
          "id": "1.1",
          "status": "pending|in_progress|completed|blocked",
          "completion_timestamp": "2025-01-11T10:30:00Z"
        }
      ]
    }
  ],
  "current_status": {
    "active_phase": "phase_1",
    "next_pending_objective": "1.1",
    "completion_percentage": 25
  }
}
```

### Status Indicators
- **pending**: Objective not yet started
- **in_progress**: Currently being executed
- **completed**: Successfully finished with validation
- **blocked**: Failed or prerequisite issues

## Resource Management

### Memory Allocation by Phase
- **Phase 1 (Foundation)**: ~8GB RAM
- **Phase 2 (Compute)**: ~42GB RAM total
- **Phase 3 (Analytics)**: ~70GB RAM total  
- **Phase 4 (Production)**: Optimization and monitoring

### Safety Mechanisms
- Resource availability validation before execution
- Incremental deployment to prevent cluster overload
- Automatic rollback on validation failures
- Resource limit enforcement in all configurations

## Troubleshooting

### Common Issues

**Prerequisites Not Met**:
```bash
# Check specific requirements
/project:data-platform-bootstrap-review
# Review output for blocking issues
```

**Resource Constraints**:
```bash
# Check cluster capacity
kubectl top nodes
kubectl describe nodes | grep -A 10 "Allocated resources"
```

**Deployment Failures**:
```bash
# Check GitOps status
flux get all -A | grep data-platform
kubectl get helmrelease -n data-platform
```

### Recovery Procedures

**Reset Specific Objective**:
1. Edit `goals.json` to set objective status to "pending"
2. Clean up any partial deployments
3. Re-run execute command

**Phase Rollback**:
1. Use GitOps to suspend/delete problematic components
2. Update goals.json to reflect current state
3. Resume from last successful objective

## Best Practices

### Before Starting
1. Run review command to assess readiness
2. Ensure cluster has sufficient resources
3. Verify all dependencies are operational
4. Plan for maintenance windows during deployment

### During Execution
1. Monitor resource utilization closely
2. Check GitOps deployment status after each objective
3. Validate functionality before proceeding to next phase
4. Keep backup of goals.json for recovery

### After Completion
1. Run end-to-end validation tests
2. Configure monitoring and alerting
3. Document any customizations or deviations
4. Plan for operational handoff and training

These commands provide a structured, automated approach to deploying the data platform while maintaining safety, observability, and the ability to recover from issues.