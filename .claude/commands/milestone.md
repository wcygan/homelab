<!--
name: milestone
purpose: Automatically create a new milestone document
usage: /project:milestone "Milestone Title"
example: /project:milestone "Loki Logging Stack Deployment"
-->

Create a new milestone document: "$ARGUMENTS"

Steps to execute:

1. Get the current date using `date +%Y-%m-%d` command
2. Convert "$ARGUMENTS" to kebab-case (lowercase, replace spaces with hyphens)
3. Create filename: `{date}-{kebab-case-title}.md` in `docs/milestones/`
4. Create the file with this template content:

```markdown
# Milestone: $ARGUMENTS

**Date**: {current date YYYY-MM-DD}  
**Category**: [Infrastructure/Application/Security/Monitoring/Storage]  
**Status**: In Progress

## Summary

Brief description of what was accomplished.

## Goals

- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

## Implementation Details

### Components Deployed
- Component 1 (version)
- Component 2 (version)

### Configuration Changes
- Change 1
- Change 2

## Validation

### Tests Performed
- Test 1: Result
- Test 2: Result

### Metrics
- Metric 1: Value
- Metric 2: Value

## Lessons Learned

### What Went Well
- Success 1
- Success 2

### Challenges
- Challenge 1 and resolution
- Challenge 2 and resolution

## Next Steps

- Follow-up action 1
- Follow-up action 2

## References

- [Link to related documentation]
- [Link to PR/commits]
```

5. Show the created file path to the user
6. Open the file for editing using the Read tool to display its contents

If no argument provided, ask user for the milestone title first.