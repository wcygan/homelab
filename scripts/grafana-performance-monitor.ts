#!/usr/bin/env -S deno run --allow-all

/**
 * Grafana Performance Monitor
 * 
 * Monitors Grafana performance through Tailscale ingress and provides
 * detailed timing metrics for troubleshooting and optimization.
 */

interface PerformanceMetrics {
  url: string;
  dnsResolution?: number;
  tcpConnection?: number;
  tlsHandshake?: number;
  httpRequest?: number;
  httpResponse?: number;
  totalTime: number;
  statusCode: number;
  responseSize: number;
  cacheHit?: boolean;
}

interface GrafanaHealthCheck {
  endpoint: string;
  status: "healthy" | "unhealthy" | "error";
  responseTime: number;
  details?: string;
}

interface MonitoringResult {
  status: "healthy" | "warning" | "critical" | "error";
  timestamp: string;
  summary: {
    total: number;
    healthy: number;
    warnings: number;
    critical: number;
  };
  details: {
    performance: PerformanceMetrics[];
    health: GrafanaHealthCheck[];
    statistics: {
      avgResponseTime: number;
      maxResponseTime: number;
      cacheHitRate: number;
      errorRate: number;
    };
  };
  issues: string[];
}

async function measurePerformance(url: string): Promise<PerformanceMetrics> {
  const startTime = performance.now();
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Grafana-Performance-Monitor/1.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.5",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      }
    });
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    const responseText = await response.text();
    const responseSize = new TextEncoder().encode(responseText).length;
    
    // Check for cache indicators in response headers
    const cacheControl = response.headers.get("cache-control");
    const expires = response.headers.get("expires");
    const cacheHit = !!(cacheControl || expires);
    
    return {
      url,
      totalTime,
      statusCode: response.status,
      responseSize,
      cacheHit
    };
  } catch (error) {
    const endTime = performance.now();
    return {
      url,
      totalTime: endTime - startTime,
      statusCode: 0,
      responseSize: 0,
      cacheHit: false
    };
  }
}

async function checkGrafanaHealth(): Promise<GrafanaHealthCheck[]> {
  const endpoints = [
    { 
      name: "Tailscale Ingress",
      url: "https://grafana.walleye-monster.ts.net/api/health"
    },
    {
      name: "Dashboard Load",
      url: "https://grafana.walleye-monster.ts.net/dashboards"
    },
    {
      name: "Static Assets",
      url: "https://grafana.walleye-monster.ts.net/public/img/grafana_icon.svg"
    }
  ];

  const results: GrafanaHealthCheck[] = [];
  
  for (const endpoint of endpoints) {
    const startTime = performance.now();
    
    try {
      const response = await fetch(endpoint.url, {
        method: "GET",
        headers: {
          "User-Agent": "Grafana-Health-Monitor/1.0"
        }
      });
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      results.push({
        endpoint: endpoint.name,
        status: response.ok ? "healthy" : "unhealthy",
        responseTime,
        details: response.ok ? `HTTP ${response.status}` : `HTTP ${response.status} ${response.statusText}`
      });
    } catch (error) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      results.push({
        endpoint: endpoint.name,
        status: "error",
        responseTime,
        details: error.message
      });
    }
  }
  
  return results;
}

async function runComprehensiveTest(samples: number = 5, jsonOutput: boolean = false, watch: boolean = false): Promise<void> {
  const testUrls = [
    "https://grafana.walleye-monster.ts.net/",
    "https://grafana.walleye-monster.ts.net/dashboards",
    "https://grafana.walleye-monster.ts.net/api/health",
    "https://grafana.walleye-monster.ts.net/public/css/grafana.dark.css"
  ];

  do {
    const timestamp = new Date().toISOString();
    const performanceResults: PerformanceMetrics[] = [];
    const issues: string[] = [];

    // Run performance tests
    for (const url of testUrls) {
      for (let i = 0; i < samples; i++) {
        const result = await measurePerformance(url);
        performanceResults.push(result);
        
        if (result.statusCode === 0) {
          issues.push(`Connection failed to ${url}`);
        } else if (result.statusCode >= 400) {
          issues.push(`HTTP ${result.statusCode} error for ${url}`);
        } else if (result.totalTime > 5000) {
          issues.push(`Slow response (${result.totalTime.toFixed(0)}ms) for ${url}`);
        }
      }
    }

    // Run health checks
    const healthResults = await checkGrafanaHealth();
    
    for (const health of healthResults) {
      if (health.status === "error") {
        issues.push(`Health check failed for ${health.endpoint}: ${health.details}`);
      } else if (health.responseTime > 3000) {
        issues.push(`Slow health check (${health.responseTime.toFixed(0)}ms) for ${health.endpoint}`);
      }
    }

    // Calculate statistics
    const responseTimes = performanceResults.map(r => r.totalTime);
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const maxResponseTime = Math.max(...responseTimes);
    const cacheHits = performanceResults.filter(r => r.cacheHit).length;
    const cacheHitRate = (cacheHits / performanceResults.length) * 100;
    const errors = performanceResults.filter(r => r.statusCode === 0 || r.statusCode >= 400).length;
    const errorRate = (errors / performanceResults.length) * 100;

    // Determine overall status
    let status: "healthy" | "warning" | "critical" | "error" = "healthy";
    if (issues.length > 0) {
      if (errorRate > 20) status = "critical";
      else if (avgResponseTime > 3000 || errorRate > 10) status = "warning";
    }

    const result: MonitoringResult = {
      status,
      timestamp,
      summary: {
        total: performanceResults.length + healthResults.length,
        healthy: performanceResults.filter(r => r.statusCode >= 200 && r.statusCode < 400).length + healthResults.filter(h => h.status === "healthy").length,
        warnings: 0,
        critical: errors + healthResults.filter(h => h.status === "error").length
      },
      details: {
        performance: performanceResults,
        health: healthResults,
        statistics: {
          avgResponseTime,
          maxResponseTime,
          cacheHitRate,
          errorRate
        }
      },
      issues
    };

    if (jsonOutput) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      printFormattedResults(result);
    }

    if (watch) {
      await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
    }
  } while (watch);
}

function printFormattedResults(result: MonitoringResult): void {
  console.log(`\n🚀 Grafana Performance Test Results - ${result.timestamp}`);
  console.log("=".repeat(60));
  
  console.log(`\n📊 Overall Status: ${getStatusEmoji(result.status)} ${result.status.toUpperCase()}`);
  
  console.log(`\n📈 Performance Statistics:`);
  console.log(`   Average Response Time: ${result.details.statistics.avgResponseTime.toFixed(0)}ms`);
  console.log(`   Maximum Response Time: ${result.details.statistics.maxResponseTime.toFixed(0)}ms`);
  console.log(`   Cache Hit Rate: ${result.details.statistics.cacheHitRate.toFixed(1)}%`);
  console.log(`   Error Rate: ${result.details.statistics.errorRate.toFixed(1)}%`);
  
  console.log(`\n🏥 Health Check Results:`);
  for (const health of result.details.health) {
    const emoji = health.status === "healthy" ? "✅" : health.status === "unhealthy" ? "⚠️" : "❌";
    console.log(`   ${emoji} ${health.endpoint}: ${health.responseTime.toFixed(0)}ms - ${health.details}`);
  }
  
  if (result.issues.length > 0) {
    console.log(`\n⚠️  Issues Detected (${result.issues.length}):`);
    for (const issue of result.issues) {
      console.log(`   • ${issue}`);
    }
  }
  
  console.log(`\n🎯 Performance Targets:`);
  console.log(`   Dashboard Load Time: <2000ms ${result.details.statistics.avgResponseTime < 2000 ? '✅' : '❌'}`);
  console.log(`   Cache Hit Rate: >30% ${result.details.statistics.cacheHitRate > 30 ? '✅' : '❌'}`);
  console.log(`   Error Rate: <5% ${result.details.statistics.errorRate < 5 ? '✅' : '❌'}`);
}

function getStatusEmoji(status: string): string {
  switch (status) {
    case "healthy": return "✅";
    case "warning": return "⚠️";
    case "critical": return "🔥";
    case "error": return "❌";
    default: return "❓";
  }
}

// CLI interface
if (import.meta.main) {
  const args = Deno.args;
  const jsonOutput = args.includes("--json");
  const watch = args.includes("--watch");
  const samples = parseInt(args.find(arg => arg.startsWith("--samples="))?.split("=")[1] || "5");

  try {
    await runComprehensiveTest(samples, jsonOutput, watch);
  } catch (error) {
    console.error(`❌ Performance test failed: ${error.message}`);
    Deno.exit(1);
  }
}