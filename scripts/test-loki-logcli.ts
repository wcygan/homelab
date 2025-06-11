#!/usr/bin/env -S deno run --allow-all

/**
 * Test script to verify logcli installation and Loki connectivity
 * Tests various logcli commands and query patterns
 */

import { $ } from "jsr:@david/dax@^0.42.0";

const LOKI_NAMESPACE = "monitoring";
const LOKI_SERVICE = "loki-gateway";
const LOKI_PORT = 80;
const LOCAL_PORT = 3100;

async function setupPortForward(): Promise<Deno.ChildProcess> {
  console.log("🔄 Setting up port-forward to Loki...");
  
  const cmd = new Deno.Command("kubectl", {
    args: [
      "port-forward",
      "-n", LOKI_NAMESPACE,
      `svc/${LOKI_SERVICE}`,
      `${LOCAL_PORT}:${LOKI_PORT}`
    ],
    stdout: "piped",
    stderr: "piped",
  });
  
  const process = cmd.spawn();
  
  // Wait for port-forward to establish
  await new Promise(resolve => setTimeout(resolve, 3000));
  console.log("✅ Port-forward established");
  
  return process;
}

async function runLogcliTest(testName: string, args: string[]): Promise<boolean> {
  console.log(`\n📋 Test: ${testName}`);
  
  try {
    const result = await $`logcli ${args}`.env({
      LOGCLI_ADDR: `http://localhost:${LOCAL_PORT}`
    }).quiet();
    
    if (result.code === 0) {
      console.log(`✅ ${testName} - PASSED`);
      if (result.stdout) {
        const lines = result.stdout.trim().split('\n');
        console.log(`   Found ${lines.length} result lines`);
        if (lines.length > 0 && lines.length <= 5) {
          lines.forEach(line => console.log(`   > ${line.substring(0, 100)}...`));
        }
      }
      return true;
    } else {
      console.log(`❌ ${testName} - FAILED`);
      console.log(`   Error: ${result.stderr}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${testName} - ERROR`);
    console.log(`   ${error}`);
    return false;
  }
}

async function main() {
  console.log("🧪 Testing logcli with Loki...\n");
  
  // Check logcli installation
  console.log("1️⃣ Checking logcli installation...");
  try {
    const version = await $`logcli --version`.text();
    console.log(`✅ logcli installed: ${version.trim()}`);
  } catch {
    console.error("❌ logcli not found. Please install it first.");
    Deno.exit(1);
  }
  
  // Setup port-forward
  const portForwardProcess = await setupPortForward();
  
  try {
    // Test connectivity
    console.log("\n2️⃣ Testing Loki connectivity...");
    const tests: Array<[string, string[]]> = [
      // Basic connectivity test
      ["List labels", ["labels"]],
      
      // Label values test
      ["List namespaces", ["labels", "namespace"]],
      
      // Simple query test
      ["Query recent logs (limit 5)", ["query", "--limit=5", '{namespace="monitoring"}']],
      
      // Time-based query
      ["Query last hour logs", ["query", "--from=1h", "--to=now", "--limit=10", '{namespace="default"}']],
      
      // Pattern matching
      ["Search for errors", ["query", "--from=2h", "--limit=10", '{namespace=~"storage|flux-system"} |~ "error|Error|ERROR"']],
      
      // JSON parsing
      ["Parse JSON logs", ["query", "--limit=5", '{job="monitoring/alloy"} | json']],
      
      // Specific app logs
      ["Rook-Ceph logs", ["query", "--from=30m", "--limit=5", '{app="rook-ceph-rgw"}']],
      
      // Aggregate query (count logs)
      ["Count logs by namespace", ["query", "--from=1h", '--stats', 'sum by (namespace) (count_over_time({namespace=~".+"}[5m]))']],
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const [testName, args] of tests) {
      const success = await runLogcliTest(testName, args);
      if (success) passed++;
      else failed++;
    }
    
    // Test streaming (brief test)
    console.log("\n📋 Test: Stream logs (5 seconds)");
    try {
      const streamCmd = new Deno.Command("timeout", {
        args: ["5", "logcli", "query", "--tail", '{namespace="monitoring"}'],
        env: {
          ...Deno.env.toObject(),
          LOGCLI_ADDR: `http://localhost:${LOCAL_PORT}`
        },
        stdout: "piped",
        stderr: "piped",
      });
      
      const output = await streamCmd.output();
      if (output.success || output.code === 124) { // 124 is timeout's exit code
        console.log("✅ Stream logs - PASSED");
        passed++;
      } else {
        console.log("❌ Stream logs - FAILED");
        failed++;
      }
    } catch {
      console.log("❌ Stream logs - ERROR");
      failed++;
    }
    
    // Test output formats
    console.log("\n3️⃣ Testing output formats...");
    const formats = ["default", "jsonl", "raw"];
    for (const format of formats) {
      const success = await runLogcliTest(
        `Output format: ${format}`,
        ["query", "--limit=2", `--output=${format}`, '{namespace="default"}']
      );
      if (success) passed++;
      else failed++;
    }
    
    // Test the wrapper script
    console.log("\n4️⃣ Testing logcli wrapper script...");
    try {
      // Kill current port-forward since wrapper will create its own
      portForwardProcess.kill();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const wrapperResult = await $`./scripts/logcli-wrapper.ts query --limit=5 '{namespace="monitoring"}'`.quiet();
      if (wrapperResult.code === 0) {
        console.log("✅ Wrapper script - PASSED");
        passed++;
      } else {
        console.log("❌ Wrapper script - FAILED");
        failed++;
      }
    } catch {
      console.log("❌ Wrapper script - ERROR");
      failed++;
    }
    
    // Summary
    console.log("\n📊 Test Summary:");
    console.log(`   Total tests: ${passed + failed}`);
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    
    if (failed === 0) {
      console.log("\n🎉 All tests passed! logcli is working correctly with Loki.");
    } else {
      console.log("\n⚠️  Some tests failed. Check the output above for details.");
    }
    
    // Provide useful examples
    console.log("\n📚 Example queries you can run:");
    console.log("   ./scripts/logcli-wrapper.ts query '{namespace=\"storage\"}' --limit 100");
    console.log("   ./scripts/logcli-wrapper.ts query --tail '{app=\"rook-ceph-rgw\"}'");
    console.log("   ./scripts/logcli-wrapper.ts query --from=1h '{namespace=\"flux-system\"} |= \"reconciliation\"'");
    console.log("   ./scripts/logcli-wrapper.ts labels");
    console.log("   ./scripts/logcli-wrapper.ts labels pod --namespace=storage");
    
  } finally {
    // Clean up port-forward
    try {
      portForwardProcess.kill();
    } catch {
      // Ignore cleanup errors
    }
  }
}

await main();