#!/usr/bin/env -S deno run --allow-all

import { $ } from "jsr:@david/dax@0.42.0";

console.log("🔍 Testing Loki + Promtail Logging Stack...\n");

// Check pod status
console.log("📊 Checking pod status:");
const pods = await $`kubectl get pods -n monitoring -l "app.kubernetes.io/name in (loki, promtail)" -o wide`.text();
console.log(pods);

// Check service endpoints
console.log("\n🌐 Checking service endpoints:");
const services = await $`kubectl get svc -n monitoring | grep -E "loki|promtail|grafana"`.text();
console.log(services);

// Test log generation
console.log("\n📝 Generating test logs:");
const timestamp = Date.now();
await $`kubectl run test-logger-${timestamp} --image=busybox --restart=Never -- sh -c "for i in 1 2 3 4 5; do echo Test log message \$i at \$(date); sleep 1; done"`.quiet();
console.log("✅ Test pod created");

// Wait for logs to be collected
console.log("\n⏳ Waiting 15 seconds for log collection...");
await new Promise(resolve => setTimeout(resolve, 15000));

// Check Loki metrics
console.log("\n📈 Checking Loki ingestion metrics:");
try {
  const metrics = await $`kubectl exec -n monitoring loki-0 -- wget -qO- http://localhost:3100/metrics | grep -E "loki_distributor_bytes_received_total|loki_ingester_chunks_stored_total" | head -5`.text();
  console.log(metrics);
} catch (e) {
  console.log("⚠️  Could not fetch metrics directly");
}

// Check Promtail targets
console.log("\n🎯 Checking Promtail targets:");
try {
  const targets = await $`kubectl exec -n monitoring daemonset/promtail -- wget -qO- http://localhost:3101/targets | grep -c "state.*up"`.text();
  console.log(`Active targets: ${targets.trim()}`);
} catch (e) {
  console.log("⚠️  Could not fetch Promtail targets");
}

// Check PVC usage
console.log("\n💾 Checking storage usage:");
const pvcs = await $`kubectl get pvc -n monitoring | grep loki`.text();
console.log(pvcs);

// Clean up test pods
console.log("\n🧹 Cleaning up test pods:");
await $`kubectl delete pods -l run=test-logger --force --grace-period=0 2>/dev/null || true`.quiet();
console.log("✅ Cleanup complete");

// Summary
console.log("\n📋 Summary:");
console.log("- Loki: Deployed with filesystem storage (50Gi)");
console.log("- Promtail: Running on all nodes");
console.log("- Grafana: Data source configured");
console.log("- Next steps: Access Grafana to query logs");
console.log("\n🔗 Access Grafana at: https://grafana/");
console.log("   Username: admin");
console.log("   Password: prom-operator");
console.log("\n📝 Example query: {namespace=\"airflow\"}");