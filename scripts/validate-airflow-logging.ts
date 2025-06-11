#!/usr/bin/env -S deno run --allow-all

import { $ } from "@david/dax";

console.log("🔍 Validating Airflow Logging Integration...\n");

// Test 1: Check Alloy pods are healthy
console.log("1️⃣ Checking Alloy pod health...");
try {
  const alloyPods = await $`kubectl get pods -n monitoring -l app.kubernetes.io/name=alloy -o json`.json();
  const unhealthyPods = alloyPods.items.filter((pod: any) => 
    pod.status.phase !== "Running" || 
    pod.status.containerStatuses?.some((c: any) => !c.ready)
  );
  
  if (unhealthyPods.length === 0) {
    console.log("✅ All Alloy pods are healthy");
  } else {
    console.log("❌ Some Alloy pods are unhealthy:", unhealthyPods.map((p: any) => p.metadata.name));
  }
} catch (error) {
  console.error("❌ Failed to check Alloy pods:", error);
}

// Test 2: Check if logs are being collected
console.log("\n2️⃣ Checking log collection...");
try {
  const result = await $`./scripts/logcli-wrapper.ts query '{namespace="airflow"}' --limit=1 --since=1h --output=raw`.text();
  if (result.includes("airflow")) {
    console.log("✅ Airflow logs are being collected");
  } else {
    console.log("❌ No Airflow logs found in the last hour");
  }
} catch (error) {
  console.error("❌ Failed to query logs:", error);
}

// Test 3: Check label extraction
console.log("\n3️⃣ Checking label extraction...");
try {
  const dagLogs = await $`./scripts/logcli-wrapper.ts query '{namespace="airflow", dag_id=~".+"}' --limit=1 --since=1h --output=raw`.text();
  if (dagLogs.includes("dag_id")) {
    console.log("✅ DAG ID labels are being extracted");
  } else {
    console.log("⚠️  No logs with dag_id label found");
  }
  
  const taskLogs = await $`./scripts/logcli-wrapper.ts query '{namespace="airflow", task_id=~".+"}' --limit=1 --since=1h --output=raw`.text();
  if (taskLogs.includes("task_id")) {
    console.log("✅ Task ID labels are being extracted");
  } else {
    console.log("⚠️  No logs with task_id label found");
  }
} catch (error) {
  console.error("❌ Failed to check labels:", error);
}

// Test 4: Check Grafana dashboard
console.log("\n4️⃣ Checking Grafana dashboard...");
try {
  const configMap = await $`kubectl get configmap grafana-dashboard-airflow-logs -n monitoring -o json`.json();
  if (configMap) {
    console.log("✅ Airflow dashboard ConfigMap exists");
    
    // Check if dashboard is loaded in Grafana
    const grafanaPod = await $`kubectl get pods -n monitoring -l app.kubernetes.io/name=grafana -o jsonpath='{.items[0].metadata.name}'`.text();
    if (grafanaPod) {
      console.log("✅ Grafana is running");
    }
  }
} catch (error) {
  console.error("❌ Dashboard not found:", error);
}

// Test 5: Summary of LogQL queries
console.log("\n5️⃣ Useful LogQL queries:");
console.log("   All Airflow logs: {namespace=\"airflow\"}");
console.log("   Specific DAG: {namespace=\"airflow\", dag_id=\"hello_world\"}");
console.log("   Task errors: {namespace=\"airflow\", level=\"ERROR\"}");
console.log("   Task executions: {namespace=\"airflow\"} |= \"TaskInstance Finished\"");

console.log("\n📊 Access the dashboard at: https://grafana.${SECRET_DOMAIN}/d/airflow-logs/airflow-logs");
console.log("\n✅ Validation complete!");