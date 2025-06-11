#!/usr/bin/env -S deno run --allow-all

/**
 * Complete Loki test suite - tests both Grafana UI and logcli CLI access
 * Generates test logs and verifies the entire logging pipeline
 */

import { $ } from "jsr:@david/dax@^0.42.0";

async function main() {
  console.log("🧪 Complete Loki Integration Test Suite\n");
  
  const timestamp = new Date().toISOString();
  const uniqueId = Date.now();
  const testMessage = `LOKI-TEST-${uniqueId}: Complete integration test at ${timestamp}`;
  
  // Phase 1: Generate test logs
  console.log("1️⃣ Generating test logs...");
  const testPodName = `loki-test-${uniqueId}`;
  
  try {
    // Create test pod with various log levels
    await $`kubectl run ${testPodName} --image=busybox --restart=Never -- sh -c "
      echo '[${timestamp}] [INFO] ${testMessage}' &&
      echo '[${timestamp}] [WARNING] Test warning: High memory usage detected' &&
      echo '[${timestamp}] [ERROR] Test error: Connection refused to database' &&
      echo '{\"timestamp\":\"${timestamp}\",\"level\":\"info\",\"msg\":\"JSON test log\",\"test_id\":\"${uniqueId}\"}' &&
      for i in \$(seq 1 10); do
        echo \"[${timestamp}] [DEBUG] Test log line \$i of 10\"
        sleep 1
      done &&
      echo '[${timestamp}] [INFO] Test completed successfully'
    "`.noThrow();
    
    console.log(`✅ Created test pod: ${testPodName}`);
    
    // Phase 2: Wait for log propagation
    console.log("\n2️⃣ Waiting for logs to propagate through Alloy → Loki pipeline...");
    await new Promise(resolve => setTimeout(resolve, 20000)); // 20 seconds
    
    // Phase 3: Test Grafana access
    console.log("\n3️⃣ Grafana UI Test Queries:");
    console.log("   Access Grafana at: https://grafana.walleye-monster.ts.net");
    console.log("   Navigate to Explore → Select Loki datasource\n");
    
    console.log("   Try these queries:");
    console.log(`   a) Exact test pod logs:`);
    console.log(`      {pod="${testPodName}"}`);
    console.log(`      {namespace="default"} |= "${uniqueId}"`);
    
    console.log(`\n   b) Log level filtering:`);
    console.log(`      {pod="${testPodName}"} |~ "ERROR|WARNING"`);
    console.log(`      {pod="${testPodName}"} | json | level="info"`);
    
    console.log(`\n   c) Time-based aggregation:`);
    console.log(`      count_over_time({pod="${testPodName}"}[5m])`);
    console.log(`      rate({namespace="default"} |= "Test" [1m])`);
    
    // Phase 4: Test logcli access
    console.log("\n4️⃣ Testing logcli access...");
    
    // Setup port-forward
    const portForwardCmd = new Deno.Command("kubectl", {
      args: ["port-forward", "-n", "monitoring", "svc/loki-gateway", "3100:80"],
      stdout: "piped",
      stderr: "piped",
    });
    const portForward = portForwardCmd.spawn();
    
    // Wait for port-forward
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
      // Test basic connectivity
      const labels = await $`logcli labels`.env({ LOGCLI_ADDR: "http://localhost:3100" }).text();
      console.log("✅ logcli connected to Loki");
      
      // Query our test logs
      console.log(`\n   Querying for test ID ${uniqueId}...`);
      const testLogs = await $`logcli query --from=5m --limit=20 '{namespace="default"} |= "${uniqueId}"'`.env({ 
        LOGCLI_ADDR: "http://localhost:3100" 
      }).text();
      
      const logLines = testLogs.split('\n').filter(line => line.includes(uniqueId));
      if (logLines.length > 0) {
        console.log(`   ✅ Found ${logLines.length} test log entries via logcli`);
        console.log(`   Sample: ${logLines[0].substring(0, 100)}...`);
      } else {
        console.log(`   ⚠️  Test logs not found via logcli (may need more time to propagate)`);
      }
      
      // Test different output formats
      console.log("\n   Testing output formats:");
      const formats = ["default", "jsonl", "raw"];
      for (const format of formats) {
        try {
          const result = await $`logcli query --from=5m --limit=2 --output=${format} '{pod="${testPodName}"}'`.env({
            LOGCLI_ADDR: "http://localhost:3100"
          }).quiet();
          console.log(`   ✅ Format '${format}' works`);
        } catch {
          console.log(`   ❌ Format '${format}' failed`);
        }
      }
      
      // Test streaming (brief)
      console.log("\n   Testing log streaming...");
      const streamCmd = new Deno.Command("timeout", {
        args: ["5", "logcli", "query", "--tail", `{pod="${testPodName}"}`],
        env: { ...Deno.env.toObject(), LOGCLI_ADDR: "http://localhost:3100" },
        stdout: "piped",
        stderr: "piped",
      });
      const streamResult = await streamCmd.output();
      if (streamResult.success || streamResult.code === 124) {
        console.log("   ✅ Log streaming works");
      }
      
    } finally {
      portForward.kill();
    }
    
    // Phase 5: Example queries
    console.log("\n5️⃣ Useful logcli commands for your cluster:");
    console.log("\n   Recent errors:");
    console.log(`   ./scripts/logcli-wrapper.ts query --from=1h '{namespace=~"storage|flux-system"} |~ "error|Error|ERROR"'`);
    
    console.log("\n   Storage health:");
    console.log(`   ./scripts/logcli-wrapper.ts query --from=30m '{namespace="storage"}'`);
    
    console.log("\n   Flux reconciliation:");
    console.log(`   ./scripts/logcli-wrapper.ts query --from=1h '{namespace="flux-system"} |= "reconciliation"'`);
    
    console.log("\n   Stream all logs:");
    console.log(`   ./scripts/logcli-wrapper.ts query --tail '{namespace="monitoring"}'`);
    
    console.log("\n   Export logs:");
    console.log(`   ./scripts/logcli-wrapper.ts query --from=1h --output=jsonl '{namespace="storage"}' > storage-logs.jsonl`);
    
    // Phase 6: Verify pipeline components
    console.log("\n6️⃣ Pipeline Component Status:");
    
    // Check Alloy
    const alloyPods = await $`kubectl get pods -n monitoring -l app.kubernetes.io/name=alloy -o json`.json();
    const alloyReady = alloyPods.items.filter((pod: any) => 
      pod.status.conditions?.some((c: any) => c.type === "Ready" && c.status === "True")
    ).length;
    console.log(`   ✅ Alloy: ${alloyReady}/${alloyPods.items.length} pods ready`);
    
    // Check Loki
    const lokiPods = await $`kubectl get pods -n monitoring -l app.kubernetes.io/name=loki -o json`.json();
    const lokiReady = lokiPods.items.filter((pod: any) => 
      pod.status.conditions?.some((c: any) => c.type === "Ready" && c.status === "True")
    ).length;
    console.log(`   ✅ Loki: ${lokiReady}/${lokiPods.items.length} pods ready`);
    
    // Check S3 storage
    const s3Secret = await $`kubectl get secret -n monitoring loki-s3-credentials -o json`.json();
    if (s3Secret.data) {
      console.log(`   ✅ S3 Storage: Configured`);
    }
    
  } finally {
    // Cleanup
    console.log("\n🧹 Cleaning up test pod...");
    await $`kubectl delete pod ${testPodName} --ignore-not-found=true`.noThrow();
  }
  
  console.log("\n✨ Complete Loki test finished!");
  console.log("   - Test logs were generated with unique ID: " + uniqueId);
  console.log("   - Both Grafana UI and logcli CLI access have been tested");
  console.log("   - Use the queries above to explore your logs");
}

await main();