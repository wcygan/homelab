#!/bin/bash
# Deploy Airflow health monitoring automation

set -euo pipefail

echo "🚀 Deploying Airflow Health Monitoring..."

# Step 1: Apply ConfigMaps
echo "📦 Creating ConfigMaps..."
kubectl apply -f kubernetes/apps/airflow/airflow/app/health-scripts-configmap.yaml
kubectl apply -f kubernetes/apps/airflow/airflow/app/airflow-alerting-config.yaml

# Step 2: Create RBAC for Airflow
echo "🔐 Setting up RBAC..."
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: airflow-health-checker
  namespace: airflow
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: airflow-health-checker
rules:
- apiGroups: [""]
  resources: ["nodes", "pods", "services", "configmaps", "persistentvolumeclaims", "namespaces"]
  verbs: ["get", "list", "create", "update", "patch", "delete"]
- apiGroups: ["apps"]
  resources: ["deployments", "statefulsets", "daemonsets", "replicasets"]
  verbs: ["get", "list"]
- apiGroups: ["kustomize.toolkit.fluxcd.io"]
  resources: ["kustomizations"]
  verbs: ["get", "list"]
- apiGroups: ["helm.toolkit.fluxcd.io"]
  resources: ["helmreleases"]
  verbs: ["get", "list"]
- apiGroups: ["source.toolkit.fluxcd.io"]
  resources: ["gitrepositories", "helmrepositories"]
  verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: airflow-health-checker
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: airflow-health-checker
subjects:
- kind: ServiceAccount
  name: airflow-worker
  namespace: airflow
- kind: ServiceAccount
  name: airflow-webserver
  namespace: airflow
- kind: ServiceAccount
  name: airflow-scheduler
  namespace: airflow
EOF

# Step 3: Restart Airflow scheduler to pick up new DAG
echo "🔄 Restarting Airflow scheduler..."
kubectl -n airflow rollout restart deployment airflow-scheduler

# Step 4: Wait for scheduler to be ready
echo "⏳ Waiting for scheduler to be ready..."
kubectl -n airflow rollout status deployment airflow-scheduler

# Step 5: List DAGs to confirm it's loaded
echo "📋 Checking if DAG is loaded..."
sleep 10
kubectl -n airflow exec deploy/airflow-webserver -- airflow dags list | grep -E "cluster_health|paused" || echo "DAG may still be loading..."

# Step 6: Unpause the DAG
echo "▶️  Unpausing health monitoring DAG..."
kubectl -n airflow exec deploy/airflow-webserver -- airflow dags unpause cluster_health_monitoring || true

echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Access Airflow UI to verify DAG is loaded"
echo "2. Trigger a manual run: kubectl -n airflow exec deploy/airflow-webserver -- airflow dags trigger cluster_health_monitoring"
echo "3. Check logs: kubectl -n airflow logs -l dag_id=cluster_health_monitoring"
echo "4. View stored results: kubectl get configmap -l type=health-check"