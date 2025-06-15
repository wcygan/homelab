#!/usr/bin/env deno run --allow-all

/**
 * Functional tests for Loki + Alloy logging stack
 * Tests query performance, log ingestion, and retention policies
 */

import { $ } from "jsr:@david/dax@0.42.0";
import { assertEquals, assert } from "jsr:@std/assert@1.0.17";
import { delay } from "jsr:@std/async@1.0.13";

interface TestResult {
  name: string;
  status: "pass" | "fail";
  duration: number;
  details?: string;
}

class LoggingFunctionalTest {
  private results: TestResult[] = [];
  private lokiEndpoint = "http://localhost:8080";

  async run(): Promise<void> {
    console.log("🧪 Starting Loki + Alloy Functional Tests");
    console.log("=" .repeat(50));

    // Setup port forward
    console.log("\n📡 Setting up port forward to Loki...");
    const portForward = $`kubectl port-forward -n monitoring svc/loki-gateway 8080:80`.spawn();
    await delay(3000); // Wait for port forward to establish

    try {
      await this.testLogIngestion();
      await this.testQueryPerformance();
      await this.testRetentionPolicy();
      await this.testLogFiltering();
      await this.testMultiNamespaceQueries();
      await this.testErrorDetection();
    } finally {
      // Cleanup
      portForward.kill();
      await this.cleanup();
    }

    this.printResults();
  }

  private async testLogIngestion(): Promise<void> {
    const start = performance.now();
    console.log("\n📝 Testing log ingestion...");

    try {
      // Query for test workload logs
      const query = encodeURIComponent('{app="logging-test"}');
      const endTime = new Date().toISOString();
      const startTime = new Date(Date.now() - 60000).toISOString(); // Last minute

      const response = await fetch(
        `${this.lokiEndpoint}/loki/api/v1/query_range?query=${query}&start=${startTime}&end=${endTime}&limit=10`
      );
      const data = await response.json();

      assertEquals(data.status, "success", "Query should succeed");
      assert(data.data.result.length > 0, "Should have log results");
      
      const logCount = data.data.result[0]?.values?.length || 0;
      assert(logCount > 0, "Should have ingested logs");

      this.results.push({
        name: "Log Ingestion",
        status: "pass",
        duration: performance.now() - start,
        details: `Ingested ${logCount} logs in last minute`
      });
    } catch (error) {
      this.results.push({
        name: "Log Ingestion",
        status: "fail",
        duration: performance.now() - start,
        details: error.message
      });
    }
  }

  private async testQueryPerformance(): Promise<void> {
    const start = performance.now();
    console.log("\n⚡ Testing query performance...");

    const queries = [
      { name: "Simple label query", query: '{namespace="monitoring"}', range: "5m" },
      { name: "Regex filter", query: '{job="monitoring/alloy"} |~ "error|Error"', range: "15m" },
      { name: "JSON parsing", query: '{app="logging-test"} | json | level="error"', range: "1h" },
      { name: "Aggregation", query: 'sum(rate({namespace="monitoring"}[5m]))', range: "30m" }
    ];

    const perfResults: Array<{ query: string; duration: number }> = [];

    for (const test of queries) {
      const queryStart = performance.now();
      try {
        const endTime = new Date().toISOString();
        const startTime = new Date(Date.now() - this.parseRange(test.range)).toISOString();
        
        const response = await fetch(
          `${this.lokiEndpoint}/loki/api/v1/query_range?query=${encodeURIComponent(test.query)}&start=${startTime}&end=${endTime}&limit=100`
        );
        
        const queryDuration = performance.now() - queryStart;
        const data = await response.json();
        
        assertEquals(data.status, "success");
        perfResults.push({ query: test.name, duration: queryDuration });
      } catch (error) {
        perfResults.push({ query: test.name, duration: -1 });
      }
    }

    const avgDuration = perfResults.filter(r => r.duration > 0)
      .reduce((sum, r) => sum + r.duration, 0) / perfResults.length;

    this.results.push({
      name: "Query Performance",
      status: avgDuration < 1000 ? "pass" : "fail",
      duration: performance.now() - start,
      details: `Average query time: ${avgDuration.toFixed(2)}ms (target: <1000ms)`
    });
  }

  private async testRetentionPolicy(): Promise<void> {
    const start = performance.now();
    console.log("\n🗄️  Testing retention policy...");

    try {
      // Check configured retention
      const configCmd = await $`kubectl get cm -n monitoring loki -o jsonpath='{.data.config\.yaml}'`.text();
      const retentionMatch = configCmd.match(/retention_period:\s*(\d+h)/);
      
      if (retentionMatch) {
        const retentionHours = parseInt(retentionMatch[1]);
        assertEquals(retentionHours, 168, "Should have 7-day retention (168h)");
        
        this.results.push({
          name: "Retention Policy",
          status: "pass",
          duration: performance.now() - start,
          details: `Configured retention: ${retentionHours}h (7 days)`
        });
      } else {
        throw new Error("Could not find retention configuration");
      }
    } catch (error) {
      this.results.push({
        name: "Retention Policy",
        status: "fail",
        duration: performance.now() - start,
        details: error.message
      });
    }
  }

  private async testLogFiltering(): Promise<void> {
    const start = performance.now();
    console.log("\n🔍 Testing log filtering...");

    try {
      // Test namespace filtering
      const query = encodeURIComponent('{namespace!="kube-public"}');
      const endTime = new Date().toISOString();
      const startTime = new Date(Date.now() - 300000).toISOString(); // Last 5 minutes

      const response = await fetch(
        `${this.lokiEndpoint}/loki/api/v1/query_range?query=${query}&start=${startTime}&end=${endTime}&limit=100`
      );
      const data = await response.json();

      assertEquals(data.status, "success");
      
      // Verify no kube-public logs
      for (const stream of data.data.result) {
        assert(!stream.stream.namespace || stream.stream.namespace !== "kube-public",
          "Should not contain kube-public logs");
      }

      this.results.push({
        name: "Log Filtering",
        status: "pass",
        duration: performance.now() - start,
        details: "Namespace filtering working correctly"
      });
    } catch (error) {
      this.results.push({
        name: "Log Filtering",
        status: "fail",
        duration: performance.now() - start,
        details: error.message
      });
    }
  }

  private async testMultiNamespaceQueries(): Promise<void> {
    const start = performance.now();
    console.log("\n🔀 Testing multi-namespace queries...");

    try {
      const query = encodeURIComponent('{namespace=~"monitoring|flux-system|storage"}');
      const endTime = new Date().toISOString();
      const startTime = new Date(Date.now() - 60000).toISOString();

      const response = await fetch(
        `${this.lokiEndpoint}/loki/api/v1/query_range?query=${query}&start=${startTime}&end=${endTime}&limit=50`
      );
      const data = await response.json();

      assertEquals(data.status, "success");
      
      // Count unique namespaces
      const namespaces = new Set(data.data.result.map((r: any) => r.stream.namespace));
      assert(namespaces.size > 1, "Should query multiple namespaces");

      this.results.push({
        name: "Multi-namespace Queries",
        status: "pass",
        duration: performance.now() - start,
        details: `Found logs from ${namespaces.size} namespaces`
      });
    } catch (error) {
      this.results.push({
        name: "Multi-namespace Queries", 
        status: "fail",
        duration: performance.now() - start,
        details: error.message
      });
    }
  }

  private async testErrorDetection(): Promise<void> {
    const start = performance.now();
    console.log("\n🚨 Testing error detection...");

    try {
      const query = encodeURIComponent('{job="monitoring/alloy"} |~ "(?i)(error|fail|exception)"');
      const endTime = new Date().toISOString();
      const startTime = new Date(Date.now() - 3600000).toISOString(); // Last hour

      const response = await fetch(
        `${this.lokiEndpoint}/loki/api/v1/query_range?query=${query}&start=${startTime}&end=${endTime}&limit=10`
      );
      const data = await response.json();

      assertEquals(data.status, "success");
      
      this.results.push({
        name: "Error Detection",
        status: "pass",
        duration: performance.now() - start,
        details: `Error detection query completed successfully`
      });
    } catch (error) {
      this.results.push({
        name: "Error Detection",
        status: "fail",
        duration: performance.now() - start,
        details: error.message
      });
    }
  }

  private async cleanup(): Promise<void> {
    console.log("\n🧹 Cleaning up test resources...");
    try {
      await $`kubectl delete deployment -n monitoring logging-test-workload --ignore-not-found=true`.quiet();
      await $`kubectl delete configmap -n monitoring logging-test-script --ignore-not-found=true`.quiet();
    } catch {
      // Ignore cleanup errors
    }
  }

  private parseRange(range: string): number {
    const match = range.match(/(\d+)([mh])/);
    if (!match) return 300000; // Default 5m
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    return unit === 'h' ? value * 3600000 : value * 60000;
  }

  private printResults(): void {
    console.log("\n" + "=".repeat(50));
    console.log("📊 Test Results Summary");
    console.log("=".repeat(50));

    const passed = this.results.filter(r => r.status === "pass").length;
    const failed = this.results.filter(r => r.status === "fail").length;

    for (const result of this.results) {
      const icon = result.status === "pass" ? "✅" : "❌";
      console.log(`${icon} ${result.name}: ${result.status.toUpperCase()} (${result.duration.toFixed(0)}ms)`);
      if (result.details) {
        console.log(`   └─ ${result.details}`);
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`Total: ${passed} passed, ${failed} failed`);
    
    if (failed > 0) {
      console.log("\n❌ Some tests failed. Please check the details above.");
      Deno.exit(1);
    } else {
      console.log("\n✅ All tests passed!");
      Deno.exit(0);
    }
  }
}

// Run tests
if (import.meta.main) {
  const test = new LoggingFunctionalTest();
  await test.run();
}