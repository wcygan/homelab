#!/usr/bin/env -S deno run --allow-all

/**
 * Test script to verify Loki is working in Grafana
 * Generates test logs and provides queries to verify in Grafana
 */

import { $ } from "jsr:@david/dax@^0.42.0";

async function main() {
  console.log("🔍 Testing Loki integration with Grafana...\n");

  // Check if Loki is running
  console.log("1️⃣ Checking Loki status...");
  const lokiPods = await $`kubectl get pods -n monitoring -l app.kubernetes.io/name=loki -o wide`.text();
  console.log(lokiPods);

  // Check if Alloy is running
  console.log("2️⃣ Checking Alloy (log collector) status...");
  const alloyPods = await $`kubectl get pods -n monitoring -l app.kubernetes.io/name=alloy -o wide`.text();
  console.log(alloyPods);

  // Generate some test logs
  console.log("3️⃣ Generating test logs...");
  const timestamp = new Date().toISOString();
  const testPodName = `loki-test-${Date.now()}`;
  
  try {
    // Create a test pod that generates logs
    await $`kubectl run ${testPodName} --image=busybox --restart=Never -- sh -c "
      echo '[INFO] Loki test started at ${timestamp}' &&
      echo '[WARNING] This is a test warning message' &&
      echo '[ERROR] This is a test error message' &&
      echo '{\"level\":\"info\",\"msg\":\"JSON formatted log\",\"timestamp\":\"${timestamp}\"}' &&
      sleep 10 &&
      echo '[INFO] Loki test completed'
    "`.noThrow();
    
    console.log(`✅ Created test pod: ${testPodName}`);
    console.log("   Waiting for logs to be collected...");
    await new Promise(resolve => setTimeout(resolve, 15000)); // Wait 15 seconds

    // Get pod logs to verify
    const logs = await $`kubectl logs ${testPodName}`.text();
    console.log("\n📋 Test pod logs:");
    console.log(logs);

  } finally {
    // Clean up test pod
    await $`kubectl delete pod ${testPodName} --ignore-not-found=true`.noThrow();
  }

  // Provide test queries
  console.log("\n4️⃣ Test these queries in Grafana:");
  console.log("   Access Grafana at: https://grafana.walleye-monster.ts.net");
  console.log("\n   Navigate to Explore → Select Loki datasource → Try these queries:\n");
  
  console.log("   a) Find test logs:");
  console.log(`      {pod="${testPodName}"}`);
  console.log(`      {namespace="default"} |= "Loki test"`);
  
  console.log("\n   b) System-wide queries:");
  console.log(`      {job="monitoring/alloy"} | json | limit 20`);
  console.log(`      sum by (namespace) (rate({job="monitoring/alloy"}[5m]))`);
  
  console.log("\n   c) Error detection:");
  console.log(`      {namespace=~"flux-system|storage"} |~ "error|Error|ERROR" | limit 50`);
  
  console.log("\n5️⃣ Quick health check:");
  
  // Check Loki Gateway endpoint
  try {
    const gatewayStatus = await $`kubectl exec -n monitoring deploy/loki-gateway -- wget -q -O- http://localhost:8080/ready`.text();
    console.log("   ✅ Loki Gateway is ready");
  } catch {
    console.log("   ❌ Loki Gateway might not be ready");
  }

  // Check recent log volume
  const recentPods = await $`kubectl get pods -A --sort-by=.status.startTime | tail -5`.text();
  console.log("\n   Recent pods (should have logs in Loki):");
  console.log(recentPods);

  console.log("\n✨ Test complete! Check the queries above in Grafana.");
}

await main();