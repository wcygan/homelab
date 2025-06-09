<!--
name: logging-stack-execute
purpose: Execute the next pending objective in the Loki + Alloy logging stack deployment
tags: logging, loki, alloy, observability, execute, automation
-->

Execute the next pending objective in the Loki + Alloy centralized logging stack deployment, automatically gathering context and creating required deliverables.

## Execution Parameters:
- **Optional**: Specific objective ID to execute (e.g., "1.2") or "quickstart" for rapid deployment
- **Usage**: `/project:logging-stack-execute` or `/project:logging-stack-execute 1.2` or `/project:logging-stack-execute quickstart`

## Execution Steps:

1. **Load Current State**
   - Read `/docs/logging-stack/bootstrap/03-goals.json` to identify current objective
   - If "quickstart" provided, follow `/docs/logging-stack/bootstrap/04-quickstart.md`
   - If specific objective ID provided, validate it exists and prerequisites are met
   - Otherwise, find the next pending objective in sequence

2. **Gather Context**
   - Check existing monitoring configurations in `kubernetes/apps/monitoring/`
   - Review current logging setup in `docs/logging/`
   - Validate Ceph S3 availability in `kubernetes/apps/storage/`
   - Check for Grafana Helm repository in `kubernetes/flux/meta/repos/`
   - Review existing External Secrets patterns

3. **Execute Based on Mode**

   **For Quickstart Mode:**
   - Deploy monolithic Loki with filesystem storage
   - Use minimal Alloy configuration
   - Skip S3 setup complexity
   - Focus on immediate functionality
   
   **For Production Mode:**
   - Follow Simple Scalable deployment
   - Configure S3 backend with Ceph
   - Set up full monitoring integration
   - Implement retention policies

4. **Execute Deliverables**
   Based on the objective type, perform appropriate actions:
   
   **For Infrastructure Tasks:**
   - Enable Ceph ObjectStore if needed
   - Create ObjectBucketClaim for Loki
   - Add Grafana Helm repository
   - Configure External Secrets
   
   **For Deployment Tasks:**
   - Create HelmRelease manifests
   - Configure Kustomization files
   - Set appropriate resource limits
   - Enable ServiceMonitors
   
   **For Integration Tasks:**
   - Configure Grafana data source
   - Import dashboards
   - Set up alerting rules
   - Test log ingestion
   
   **For Migration Tasks:**
   - Update Airflow configuration
   - Implement retention policies
   - Create operational runbooks
   - Document LogQL queries

5. **Update Tracking**
   - Update objective status to "completed" in goals.json
   - Record completion timestamp
   - Create any specified artifacts
   - Update phase status if all objectives complete

6. **Validate Completion**
   - Verify all pods are running: `kubectl get pods -n monitoring -l app.kubernetes.io/name=loki`
   - Test log ingestion with test pod
   - Confirm Grafana can query logs
   - Check metrics are being collected

## Decision Flow:

```
IF $ARGUMENTS == "quickstart":
  -> Execute quickstart deployment from 04-quickstart.md
  -> Skip complex S3 configuration
  -> Use filesystem storage
  
ELIF executing specific objective (via $ARGUMENTS):
  -> Validate objective exists and prerequisites met
  -> Execute that specific objective
  
ELSE (automatic mode):
  -> Find first objective with status="pending" and met prerequisites
  -> Execute that objective
  
AFTER execution:
  -> Update goals.json (unless quickstart)
  -> Run validation tests
  -> Report completion and next steps
```

## Output Format:

```markdown
# Executing Objective [ID]: [Name]

## Pre-execution Checks
✅ Prerequisites met: [list]
✅ Resources available: [list]
✅ Dependencies ready: [list]

## Actions Taken
1. [Action performed with file path]
2. [Action performed with result]

## Deliverables Completed
- ✅ [Deliverable 1]: [artifact path]
- ✅ [Deliverable 2]: [validation result]

## Validation Results
```
[Show output of validation commands]
```

## Test Results
- Log ingestion: [PASS/FAIL]
- Grafana query: [PASS/FAIL]
- Metrics collection: [PASS/FAIL]

## Status Update
- Objective [ID] marked as completed
- Phase progress: [X/Y objectives complete]

## Next Steps
[Either next objective or phase completion message]

## Quick Verification
```bash
# Check deployment
kubectl get pods -n monitoring -l app.kubernetes.io/name=loki
kubectl get pods -n monitoring -l app.kubernetes.io/name=alloy

# Test logs
kubectl logs -n monitoring deployment/loki-read | tail -20
```
```

## Quickstart Execution:

When `quickstart` parameter is used:
1. Deploy Loki in monolithic mode with filesystem storage
2. Deploy Alloy with basic configuration
3. Skip S3 setup entirely
4. Focus on getting logs flowing quickly
5. Can migrate to production mode later

## Error Handling:

If execution fails:
1. Check pod events: `kubectl describe pod -n monitoring`
2. Review logs: `kubectl logs -n monitoring -l app.kubernetes.io/name=loki`
3. Validate prerequisites again
4. Document the failure reason
5. Suggest remediation steps

## Important Notes:

- Quickstart mode is for testing/development only
- Production mode requires S3 storage setup
- Always commit changes before Flux reconciliation
- Test with a sample pod before declaring success
- Keep Alloy configuration simple initially
- Monitor resource usage during rollout