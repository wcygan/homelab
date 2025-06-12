# Golden Rules for Homelab Operations

This directory contains **CRITICAL** rules that must be followed to avoid catastrophic failures in the homelab cluster. These rules are born from real incidents and mistakes.

## Why These Rules Exist

Each rule documents a real incident where a seemingly simple action caused massive cluster disruption. Following these rules will prevent:
- Accidental deletion of 100+ pods
- Hours of recovery time
- Data loss
- Service outages

## Rule Categories

### 1. [Kubernetes Operations](./kubernetes-operations.md)
Critical rules for working with Kubernetes resources, especially Flux GitOps.

**Key Rules:**
- NEVER delete Flux kustomizations without analysis
- Always use suspend/resume instead of delete
- Test all changes locally first
- Understand resource ownership chains

### 2. [GitOps Best Practices](./gitops-practices.md)
Rules for maintaining GitOps workflows and preventing sync issues.

### 3. [Storage Operations](./storage-operations.md)
Critical rules for Rook-Ceph and persistent storage management.

### 4. [Network Changes](./network-operations.md)
Rules for modifying ingress, DNS, and network policies safely.

### 5. [Secret Management](./secret-management.md)
Rules for handling secrets, SOPS, and 1Password integration.

## The Universal Golden Rules

### Rule #1: Think Before You Delete
> Deletion is often irreversible and triggers cascading failures

### Rule #2: Suspend, Don't Delete
> Flux resources should be suspended for debugging, not deleted

### Rule #3: Test Locally First
> Use `--dry-run`, `kustomize build`, and local validation

### Rule #4: Understand Dependencies
> Know what depends on the resource you're modifying

### Rule #5: Monitor the Impact
> Watch pod counts and resource status during any operation

## Quick Decision Tree

```
Need to fix a broken resource?
├── Is it a Flux-managed resource?
│   ├── Yes → SUSPEND it first
│   └── No → Safe to modify directly
├── Is it a parent resource (namespace, kustomization)?
│   ├── Yes → EXTREME CAUTION - check dependencies
│   └── No → Proceed with normal caution
└── Will deletion cause cascading effects?
    ├── Yes → Find alternative (suspend, patch, fix in git)
    └── No → Safe to proceed
```

## Incident Log

- **2025-06-12**: Deleted `cluster-apps` kustomization, causing 80+ pod deletions
- **[Date]**: [Incident description] - Add new incidents here

## Remember

> **Every rule here represents hours of recovery time someone had to endure. Learn from these mistakes.**