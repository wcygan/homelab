<!--
name: ceph-bootstrap-execute
purpose: Execute the next pending objective in the Ceph bootstrap process
tags: ceph, storage, execute, automation
-->

Execute the next pending objective in the Ceph distributed storage bootstrap initiative, automatically gathering context and creating required deliverables.

## Execution Parameters:
- **Optional**: Specific objective ID to execute (e.g., "1.2")
- **Usage**: `/project:ceph-bootstrap-execute` or `/project:ceph-bootstrap-execute 1.2`

## Execution Steps:

1. **Load Current State**
   - Read `/docs/ceph/bootstrap/goals.json` to identify current objective
   - If specific objective ID provided in `$ARGUMENTS`, validate it exists and prerequisites are met
   - Otherwise, find the next pending objective in sequence

2. **Gather Context**
   - Search codebase for relevant patterns and examples
   - Check existing storage configurations in `kubernetes/apps/storage/`
   - Review Talos configuration in `talos/` directory
   - Search for similar implementations in the cluster
   - **Reference Implementation Examples**:
     - Read `/docs/ceph/ceph-examples/onedr0p-home-ops.md` for the simplified approach
     - Read `/docs/ceph/ceph-examples/joryirving-home-ops.md` for the enterprise approach
     - Review `/docs/ceph/ceph-examples/rook-ceph-quickstart.md` for official patterns
     - Use the "Hybrid Progressive" strategy combining onedr0p's simplicity with joryirving's structure

3. **Request External Examples** (if needed)
   - For complex objectives, ask user for repository examples
   - Specifically request: "Please provide a link to a repository that implements [specific feature] with [specific technology]"
   - Analyze provided examples for best practices
   - Note: The ceph-examples directory already contains analyzed examples from:
     - onedr0p's home-ops (simple, practical approach)
     - joryirving's home-ops (enterprise-grade structure)
     - Rook official quickstart guide

4. **Execute Deliverables**
   Based on the objective type, perform appropriate actions:
   
   **For Configuration Tasks:**
   - Create required YAML manifests
   - Update Kustomization files
   - Add necessary patches
   
   **For Validation Tasks:**
   - Create validation scripts
   - Run checks and capture output
   - Document results
   
   **For Documentation Tasks:**
   - Create required documentation
   - Update existing docs
   - Generate runbooks

5. **Update Tracking**
   - Update objective status to "completed" in goals.json
   - Record completion timestamp
   - Create any specified artifacts
   - Update phase status if all objectives complete

6. **Validate Completion**
   - Run validation criteria specified in the objective
   - Ensure all deliverables are complete
   - Check that artifacts exist and are valid

## Decision Flow:

```
IF trigger conditions not met:
  -> Inform user and ask for next steps
  
IF executing specific objective (via $ARGUMENTS):
  -> Validate objective exists and prerequisites met
  -> Execute that specific objective
  
ELSE (automatic mode):
  -> Find first objective with status="pending" and met prerequisites
  -> Execute that objective
  
AFTER execution:
  -> Update goals.json
  -> Run validation
  -> Report completion and next steps
```

## Output Format:

```markdown
# Executing Objective [ID]: [Name]

## Pre-execution Checks
✅ Prerequisites met: [list]
✅ Resources available: [list]

## Actions Taken
1. [Action performed with file path]
2. [Action performed with result]

## Deliverables Completed
- ✅ [Deliverable 1]: [artifact path]
- ✅ [Deliverable 2]: [validation result]

## Validation Results
[Show output of validation commands]

## Status Update
- Objective [ID] marked as completed
- Phase progress: [X/Y objectives complete]

## Next Steps
[Either next objective or phase completion message]
```

## Error Handling:

If execution fails:
1. Roll back any partial changes
2. Update objective status to "blocked"
3. Document the failure reason
4. Suggest remediation steps

## Important Notes:

- Only execute ONE objective per invocation
- Always validate prerequisites before starting
- Create actual working configurations, not templates
- Test all scripts before marking complete
- Maintain GitOps principles (all changes via Git)