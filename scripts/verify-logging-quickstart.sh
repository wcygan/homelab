#!/bin/bash

echo "🔍 Verifying Loki + Promtail Logging Stack..."
echo

echo "📊 Pod Status:"
kubectl get pods -n monitoring -l "app.kubernetes.io/name in (loki, promtail)" -o wide
echo

echo "💾 Storage Usage:"
kubectl get pvc -n monitoring | grep -E "NAME|loki"
echo

echo "🌐 Service Endpoints:"
kubectl get svc -n monitoring | grep -E "NAME|loki|grafana"
echo

echo "📈 Loki Metrics:"
kubectl exec -n monitoring loki-0 -- wget -qO- http://localhost:3100/metrics 2>/dev/null | grep -E "loki_distributor_bytes_received_total|loki_ingester_chunks_stored_total" | head -3 || echo "Could not fetch metrics"
echo

echo "🎯 Promtail Status:"
POD=$(kubectl get pods -n monitoring -l app.kubernetes.io/name=promtail -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n monitoring $POD -- wget -qO- http://localhost:3101/targets 2>/dev/null | grep -o "state.*up" | wc -l | xargs echo "Active targets:"
echo

echo "📝 Test Log Generation:"
kubectl run test-logger --image=busybox --restart=Never -- sh -c 'echo "Test log from quickstart at $(date)"' 2>/dev/null || true
sleep 5
kubectl delete pod test-logger --force --grace-period=0 2>/dev/null || true
echo "✅ Test complete"
echo

echo "📋 Summary:"
echo "- Loki: Running with filesystem storage (50Gi PVC)"
echo "- Promtail: Running on all nodes as DaemonSet"
echo "- Grafana: Data source configured at http://loki-gateway.monitoring.svc.cluster.local"
echo "- Storage: Using ceph-block storage class"
echo
echo "🔗 Next Steps:"
echo "1. Access Grafana via Tailscale: https://grafana"
echo "2. Login: admin / prom-operator"
echo "3. Go to Explore → Select 'Loki' data source"
echo "4. Try query: {namespace=\"airflow\"}"
echo
echo "⚠️  Note: This is a quickstart deployment using filesystem storage."
echo "    For production, migrate to S3 backend once Ceph ObjectStore is fixed."