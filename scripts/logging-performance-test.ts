#!/usr/bin/env deno run --allow-all

/**
 * Logging Stack Performance Testing Script
 * Tests query performance, dashboard load times, and resource usage
 */

import { $ } from "jsr:@david/dax@0.42.0";
import { delay } from "jsr:@std/async@1.0.13";

interface PerformanceMetrics {
  queryResponseTime: number;
  dashboardLoadTime: number;
  cacheHitRate: number;
  resourceUsage: {
    lokiCpu: string;
    lokiMemory: string;
    grafanaCpu: string;
    grafanaMemory: string;
  };
}

class LoggingPerformanceTest {
  private lokiEndpoint = "http://localhost:8080";
  private grafanaEndpoint = "http://localhost:3000";

  async runPerformanceTests(): Promise<PerformanceMetrics> {
    console.log("🚀 Starting Logging Stack Performance Tests");
    console.log("=" .repeat(50));

    // Setup port forwards
    console.log("\n📡 Setting up port forwards...");
    const lokiPortForward = $`kubectl port-forward -n monitoring svc/loki-gateway 8080:80`.spawn();
    const grafanaPortForward = $`kubectl port-forward -n monitoring svc/kube-prometheus-stack-grafana 3000:80`.spawn();
    
    await delay(3000); // Wait for port forwards

    try {
      const queryTime = await this.testQueryPerformance();
      const dashboardTime = await this.testDashboardPerformance();
      const cacheRate = await this.testCacheEffectiveness();
      const resources = await this.getResourceUsage();

      return {
        queryResponseTime: queryTime,
        dashboardLoadTime: dashboardTime,
        cacheHitRate: cacheRate,
        resourceUsage: resources
      };
    } finally {
      // Cleanup
      lokiPortForward.kill();
      grafanaPortForward.kill();
    }
  }

  private async testQueryPerformance(): Promise<number> {
    console.log("\n⚡ Testing Loki Query Performance...");
    
    const queries = [
      '{namespace="monitoring"}',
      '{namespace="airflow", dag_id=~".+"}',
      '{job="monitoring/alloy"} |~ "error"',
      'sum(rate({namespace="monitoring"}[5m]))'
    ];

    const times: number[] = [];
    
    for (const query of queries) {
      const startTime = performance.now();
      
      try {
        const endTime = new Date().toISOString();
        const startTime24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        
        const response = await fetch(
          `${this.lokiEndpoint}/loki/api/v1/query_range?query=${encodeURIComponent(query)}&start=${startTime24h}&end=${endTime}&limit=100`
        );
        
        if (response.ok) {
          const endTime = performance.now();
          const queryTime = endTime - startTime;
          times.push(queryTime);
          console.log(`  ✅ Query: ${query.substring(0, 30)}... - ${queryTime.toFixed(0)}ms`);
        }
      } catch (error) {
        console.log(`  ❌ Query failed: ${error.message}`);
      }
    }

    const avgTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    console.log(`  📊 Average query time: ${avgTime.toFixed(0)}ms`);
    
    return avgTime;
  }

  private async testDashboardPerformance(): Promise<number> {
    console.log("\n📊 Testing Dashboard Load Performance...");
    
    const dashboards = [
      "/d/loki-dashboard",
      "/d/homelab-critical-apps-v2",
      "/d/airflow-logs-v1"
    ];

    const times: number[] = [];

    for (const dashboard of dashboards) {
      const startTime = performance.now();
      
      try {
        const response = await fetch(`${this.grafanaEndpoint}${dashboard}`, {
          headers: {
            'Authorization': 'Basic ' + btoa('admin:prom-operator')
          }
        });
        
        if (response.ok) {
          const endTime = performance.now();
          const loadTime = endTime - startTime;
          times.push(loadTime);
          console.log(`  ✅ Dashboard: ${dashboard} - ${loadTime.toFixed(0)}ms`);
        }
      } catch (error) {
        console.log(`  ❌ Dashboard failed: ${error.message}`);
      }
    }

    const avgTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    console.log(`  📊 Average dashboard load time: ${avgTime.toFixed(0)}ms`);
    
    return avgTime;
  }

  private async testCacheEffectiveness(): Promise<number> {
    console.log("\n🗄️  Testing Cache Effectiveness...");
    
    try {
      // Run the same query twice to test caching
      const query = '{namespace="monitoring"}';
      const endTime = new Date().toISOString();
      const startTime1h = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      
      const url = `${this.lokiEndpoint}/loki/api/v1/query_range?query=${encodeURIComponent(query)}&start=${startTime1h}&end=${endTime}&limit=100`;
      
      // First query (should miss cache)
      const start1 = performance.now();
      await fetch(url);
      const firstQueryTime = performance.now() - start1;
      
      // Small delay
      await delay(100);
      
      // Second query (should hit cache)
      const start2 = performance.now();
      await fetch(url);
      const secondQueryTime = performance.now() - start2;
      
      const improvement = ((firstQueryTime - secondQueryTime) / firstQueryTime) * 100;
      console.log(`  📈 First query: ${firstQueryTime.toFixed(0)}ms`);
      console.log(`  📈 Second query: ${secondQueryTime.toFixed(0)}ms`);
      console.log(`  📊 Cache improvement: ${improvement.toFixed(1)}%`);
      
      return Math.max(0, improvement);
    } catch (error) {
      console.log(`  ❌ Cache test failed: ${error.message}`);
      return 0;
    }
  }

  private async getResourceUsage(): Promise<PerformanceMetrics['resourceUsage']> {
    console.log("\n💾 Checking Resource Usage...");
    
    try {
      const lokiStats = await $`kubectl top pod -n monitoring --selector=app.kubernetes.io/name=loki --no-headers`.text();
      const grafanaStats = await $`kubectl top pod -n monitoring --selector=app.kubernetes.io/name=grafana --no-headers`.text();
      
      const lokiParts = lokiStats.trim().split(/\s+/);
      const grafanaParts = grafanaStats.trim().split(/\s+/);
      
      const resources = {
        lokiCpu: lokiParts[1] || "N/A",
        lokiMemory: lokiParts[2] || "N/A", 
        grafanaCpu: grafanaParts[1] || "N/A",
        grafanaMemory: grafanaParts[2] || "N/A"
      };
      
      console.log(`  🔹 Loki: ${resources.lokiCpu} CPU, ${resources.lokiMemory} Memory`);
      console.log(`  🔹 Grafana: ${resources.grafanaCpu} CPU, ${resources.grafanaMemory} Memory`);
      
      return resources;
    } catch (error) {
      console.log(`  ❌ Resource check failed: ${error.message}`);
      return {
        lokiCpu: "N/A",
        lokiMemory: "N/A",
        grafanaCpu: "N/A", 
        grafanaMemory: "N/A"
      };
    }
  }

  printSummary(metrics: PerformanceMetrics): void {
    console.log("\n" + "=".repeat(50));
    console.log("📋 Performance Test Summary");
    console.log("=".repeat(50));
    
    console.log(`🔍 Query Performance:`);
    console.log(`   Average Response Time: ${metrics.queryResponseTime.toFixed(0)}ms`);
    console.log(`   Target: <100ms ${metrics.queryResponseTime < 100 ? '✅' : '❌'}`);
    
    console.log(`\n📊 Dashboard Performance:`);
    console.log(`   Average Load Time: ${metrics.dashboardLoadTime.toFixed(0)}ms`);
    console.log(`   Target: <5000ms ${metrics.dashboardLoadTime < 5000 ? '✅' : '❌'}`);
    
    console.log(`\n🗄️  Cache Effectiveness:`);
    console.log(`   Cache Hit Improvement: ${metrics.cacheHitRate.toFixed(1)}%`);
    console.log(`   Target: >20% ${metrics.cacheHitRate > 20 ? '✅' : '❌'}`);
    
    console.log(`\n💾 Resource Usage:`);
    console.log(`   Loki: ${metrics.resourceUsage.lokiCpu} CPU, ${metrics.resourceUsage.lokiMemory} Memory`);
    console.log(`   Grafana: ${metrics.resourceUsage.grafanaCpu} CPU, ${metrics.resourceUsage.grafanaMemory} Memory`);
  }
}

// Run performance tests
if (import.meta.main) {
  const tester = new LoggingPerformanceTest();
  try {
    const metrics = await tester.runPerformanceTests();
    tester.printSummary(metrics);
  } catch (error) {
    console.error(`❌ Performance test failed: ${error.message}`);
    Deno.exit(1);
  }
}