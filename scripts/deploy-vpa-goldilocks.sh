#!/usr/bin/env bash
set -euo pipefail

# Script to deploy VPA and Goldilocks for resource optimization

echo "🚀 Deploying VPA and Goldilocks..."

# Check if running from homelab root
if [[ ! -f "Taskfile.yaml" ]]; then
    echo "❌ Error: Must run from homelab root directory"
    exit 1
fi

# Validate manifests
echo "📋 Validating manifests..."
deno task validate

# Check Flux status
echo "🔍 Checking Flux status..."
flux check

# Git operations
echo "📦 Committing and pushing changes..."
git add kubernetes/flux/meta/repos/fairwinds.yaml
git add kubernetes/apps/system-health/vpa/
git add kubernetes/apps/system-health/goldilocks/
git add kubernetes/apps/system-health/kustomization.yaml
git add kubernetes/flux/meta/repos/kustomization.yaml
git add docs/system-health/vpa-goldilocks-guide.md
git add scripts/deploy-vpa-goldilocks.sh

git commit -m "feat(system-health): add VPA and Goldilocks for resource optimization

- Add Fairwinds HelmRepository
- Deploy VPA (Vertical Pod Autoscaler) with Prometheus integration
- Deploy Goldilocks dashboard with Tailscale ingress
- Configure opt-in namespace labeling for VPA
- Add comprehensive deployment and usage documentation"

git push

# Force reconciliation
echo "♻️  Forcing reconciliation..."
flux reconcile source git flux-system
sleep 5
flux reconcile kustomization cluster-meta
flux reconcile kustomization cluster-apps

# Monitor deployment
echo "📊 Monitoring deployment..."
echo "Waiting for HelmRepository..."
kubectl wait --for=condition=ready --timeout=120s helmrepository fairwinds -n flux-system || true

echo "Waiting for VPA deployment..."
flux get hr vpa -n system-health --watch &
VPA_PID=$!

echo "Waiting for Goldilocks deployment..."
flux get hr goldilocks -n system-health --watch &
GOLDILOCKS_PID=$!

# Wait for both to complete (max 5 minutes)
sleep 300
kill $VPA_PID $GOLDILOCKS_PID 2>/dev/null || true

# Check final status
echo "📋 Final deployment status:"
flux get hr -A | grep -E "vpa|goldilocks" || echo "HelmReleases not found yet"
kubectl get pods -n system-health

echo "✅ Deployment complete!"
echo ""
echo "📚 Next steps:"
echo "1. Enable VPA for a namespace: kubectl label namespace <name> goldilocks.fairwinds.com/enabled=true"
echo "2. Access Goldilocks dashboard: https://goldilocks (via Tailscale)"
echo "3. See full guide: docs/system-health/vpa-goldilocks-guide.md"