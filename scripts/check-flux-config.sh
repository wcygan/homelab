#!/usr/bin/env bash
# Script to check Flux configuration for common issues

set -euo pipefail

echo "=== Flux Configuration Health Check ==="
echo

# Check for infinite retries in HelmReleases
echo "1. Checking for infinite retries (retries: -1) in HelmReleases..."
echo "   These should be changed to finite retries (e.g., retries: 3)"
echo
grep -r "retries: -1" kubernetes/apps/ --include="helmrelease.yaml" || echo "   ✓ No infinite retries found"
echo

# Check for missing health checks in Kustomizations
echo "2. Checking for Kustomizations without health checks..."
echo "   Consider adding health checks for critical services"
echo
for ks in $(find kubernetes/apps -name "ks.yaml" -type f); do
    if ! grep -q "healthChecks:" "$ks" 2>/dev/null; then
        echo "   ⚠ Missing health checks: $ks"
    fi
done
echo

# Check for missing wait configuration
echo "3. Checking for Kustomizations without explicit wait configuration..."
echo "   Infrastructure and dependencies should have wait: true"
echo
for ks in $(find kubernetes/apps -name "ks.yaml" -type f); do
    if ! grep -q "wait:" "$ks" 2>/dev/null; then
        echo "   ⚠ Missing wait config: $ks"
    fi
done
echo

# Check for missing timeout configuration
echo "4. Checking for Kustomizations without timeout configuration..."
echo "   Large deployments need appropriate timeouts"
echo
for ks in $(find kubernetes/apps -name "ks.yaml" -type f); do
    if ! grep -q "timeout:" "$ks" 2>/dev/null; then
        echo "   ⚠ Missing timeout: $ks"
    fi
done
echo

# Check for missing namespace in sourceRef
echo "5. Checking for sourceRef without namespace specification..."
echo "   All sourceRef should include 'namespace: flux-system'"
echo
for file in $(find kubernetes/apps -name "*.yaml" -type f); do
    if grep -q "sourceRef:" "$file" 2>/dev/null; then
        # Check if the next few lines after sourceRef contain namespace
        if ! grep -A 3 "sourceRef:" "$file" | grep -q "namespace:" 2>/dev/null; then
            echo "   ⚠ Missing namespace in sourceRef: $file"
        fi
    fi
done
echo

# Check for resource constraints in HelmReleases
echo "6. Checking for HelmReleases without resource constraints..."
echo "   All deployments should specify resource requests/limits"
echo
for hr in $(find kubernetes/apps -name "helmrelease.yaml" -type f); do
    if ! grep -q "resources:" "$hr" 2>/dev/null; then
        echo "   ⚠ Missing resources: $hr"
    fi
done
echo

# Check for inconsistent intervals
echo "7. Checking interval configurations..."
echo "   Intervals should follow standards (5m for critical, 15m for core, 30m-1h for apps)"
echo
echo "   HelmRelease intervals:"
grep -h "interval:" kubernetes/apps/**/helmrelease.yaml 2>/dev/null | sort | uniq -c | sort -nr || true
echo
echo "   Kustomization intervals:"
grep -h "interval:" kubernetes/apps/**/ks.yaml 2>/dev/null | sort | uniq -c | sort -nr || true
echo

echo "=== Check Complete ==="
echo
echo "Review the findings above and consider:"
echo "- Standardizing retry strategies (use finite retries)"
echo "- Adding health checks to critical services"
echo "- Setting appropriate wait/timeout values"
echo "- Ensuring all sourceRef include namespace"
echo "- Adding resource constraints to all deployments"
echo "- Standardizing interval configurations"