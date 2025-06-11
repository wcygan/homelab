#!/usr/bin/env -S deno run --allow-all

import { $ } from "@david/dax";

console.log("🔍 Testing Airflow log collection in Loki...");

// Wait for logs to be collected
console.log("⏳ Waiting 30 seconds for logs to be collected...");
await new Promise((resolve) => setTimeout(resolve, 30000));

// Test 1: Query for all Airflow logs
console.log("\n📊 Test 1: Querying for all Airflow namespace logs...");
try {
  const allLogs = await $`logcli query '{namespace="airflow"}' --limit=10 --addr=http://loki-gateway.monitoring.svc.cluster.local --output=raw`.text();
  console.log("✅ Found Airflow logs:");
  console.log(allLogs.split("\n").slice(0, 5).join("\n"));
} catch (error) {
  console.error("❌ Failed to query Airflow logs:", error);
}

// Test 2: Query for DAG-specific logs
console.log("\n📊 Test 2: Querying for hello_world DAG logs...");
try {
  const dagLogs = await $`logcli query '{namespace="airflow"} |= "dag_id=hello_world"' --limit=5 --addr=http://loki-gateway.monitoring.svc.cluster.local --output=raw`.text();
  if (dagLogs.trim()) {
    console.log("✅ Found hello_world DAG logs:");
    console.log(dagLogs);
  } else {
    console.log("⚠️  No hello_world DAG logs found yet");
  }
} catch (error) {
  console.error("❌ Failed to query DAG logs:", error);
}

// Test 3: Check if labels are being extracted
console.log("\n📊 Test 3: Checking if Airflow labels are being extracted...");
try {
  const labeledLogs = await $`logcli query '{namespace="airflow", dag_id=~".+"}' --limit=5 --addr=http://loki-gateway.monitoring.svc.cluster.local --output=raw`.text();
  if (labeledLogs.trim()) {
    console.log("✅ Found logs with dag_id label:");
    console.log(labeledLogs);
  } else {
    console.log("⚠️  No logs with dag_id label found - label extraction may not be working");
  }
} catch (error) {
  console.error("❌ Failed to query labeled logs:", error);
}

// Test 4: Query for task execution logs
console.log("\n📊 Test 4: Querying for task execution logs...");
try {
  const taskLogs = await $`logcli query '{namespace="airflow", app_kubernetes_io_component="worker"} |= "task_id"' --limit=5 --addr=http://loki-gateway.monitoring.svc.cluster.local --output=raw`.text();
  if (taskLogs.trim()) {
    console.log("✅ Found task execution logs:");
    console.log(taskLogs);
  } else {
    console.log("⚠️  No task execution logs found yet");
  }
} catch (error) {
  console.error("❌ Failed to query task logs:", error);
}

// Test 5: Show available labels for Airflow logs
console.log("\n📊 Test 5: Checking available labels for Airflow logs...");
try {
  const labels = await $`logcli labels '{namespace="airflow"}' --addr=http://loki-gateway.monitoring.svc.cluster.local`.text();
  console.log("✅ Available labels for Airflow logs:");
  console.log(labels);
} catch (error) {
  console.error("❌ Failed to query labels:", error);
}

console.log("\n✅ Testing complete!");