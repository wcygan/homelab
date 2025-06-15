#!/usr/bin/env -S deno run --allow-all

/**
 * Grafana Performance Monitor
 * 
 * Monitors Grafana performance through Tailscale ingress and provides
 * detailed timing metrics for troubleshooting and optimization.
 */

import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { colors } from "@cliffy/ansi/colors";
import { MonitoringResult, ExitCode } from "./types/monitoring.ts";

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
    try {
      const metrics = await measurePerformance(endpoint.url);
      
      let status: "healthy" | "unhealthy" | "error" = "error";
      let details = "";
      
      if (metrics.statusCode === 200) {
        if (metrics.totalTime < 2000) {
          status = "healthy";
          details = `${metrics.totalTime.toFixed(0)}ms response`;
        } else {
          status = "unhealthy"; 
          details = `Slow response: ${metrics.totalTime.toFixed(0)}ms`;
        }
      } else if (metrics.statusCode > 0) {
        status = "unhealthy";
        details = `HTTP ${metrics.statusCode}`;
      } else {
        status = "error";
        details = "Connection failed";
      }
      
      results.push({
        endpoint: endpoint.name,
        status,
        responseTime: metrics.totalTime,
        details
      });
    } catch (error) {
      results.push({
        endpoint: endpoint.name,
        status: "error",
        responseTime: 0,
        details: (error as Error).message
      });
    }
  }
  
  return results;
}

async function runPerformanceAnalysis(options: { samples: number; json: boolean }): Promise<MonitoringResult> {
  const startTime = new Date().toISOString();
  
  if (!options.json) {
    console.log(colors.blue.bold("🔍 Grafana Performance Analysis\n"));
    console.log(`Taking ${options.samples} samples...`);
  }
  
  // Collect multiple samples for statistical analysis
  const allMetrics: PerformanceMetrics[] = [];
  
  for (let i = 0; i < options.samples; i++) {
    if (!options.json) {
      process.stdout.write(`\rSample ${i + 1}/${options.samples}...`);
    }
    
    const metrics = await measurePerformance("https://grafana.walleye-monster.ts.net/dashboards");
    allMetrics.push(metrics);
    
    // Wait between samples to avoid overwhelming
    if (i < options.samples - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  if (!options.json) {
    console.log("\n");
  }
  
  // Calculate statistics
  const responseTimes = allMetrics.map(m => m.totalTime);
  const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  const minResponseTime = Math.min(...responseTimes);
  const maxResponseTime = Math.max(...responseTimes);
  
  // Check health endpoints
  const healthChecks = await checkGrafanaHealth();
  
  // Determine overall status
  const criticalIssues = healthChecks.filter(h => h.status === "error").length;
  const warnings = healthChecks.filter(h => h.status === "unhealthy").length;
  const healthy = healthChecks.filter(h => h.status === "healthy").length;
  
  let overallStatus: "healthy" | "warning" | "critical" | "error" = "healthy";
  const issues: string[] = [];
  
  if (criticalIssues > 0) {
    overallStatus = "critical";
    issues.push(`${criticalIssues} endpoints failed`);
  } else if (warnings > 0) {
    overallStatus = "warning";
    issues.push(`${warnings} endpoints slow`);
  }
  
  if (avgResponseTime > 5000) {
    overallStatus = "critical";
    issues.push(`Average response time too high: ${avgResponseTime.toFixed(0)}ms`);
  } else if (avgResponseTime > 2000) {
    if (overallStatus === "healthy") overallStatus = "warning";
    issues.push(`Response time elevated: ${avgResponseTime.toFixed(0)}ms`);
  }
  
  // Display results
  if (!options.json) {
    console.log(colors.blue.bold("📊 Performance Statistics"));
    console.log("=".repeat(50));
    
    const statsTable = new Table()
      .header(["Metric", "Value"])
      .body([
        ["Average Response Time", `${avgResponseTime.toFixed(0)}ms`],
        ["Min Response Time", `${minResponseTime.toFixed(0)}ms`],
        ["Max Response Time", `${maxResponseTime.toFixed(0)}ms`],
        ["Samples Taken", options.samples.toString()],
        ["Success Rate", `${(allMetrics.filter(m => m.statusCode === 200).length / allMetrics.length * 100).toFixed(1)}%`]
      ]);
    
    console.log(statsTable.toString());
    console.log();
    
    console.log(colors.blue.bold("🏥 Health Check Results"));
    console.log("=".repeat(50));
    
    const healthTable = new Table()
      .header(["Endpoint", "Status", "Response Time", "Details"]);
    
    for (const check of healthChecks) {
      const statusColor = check.status === "healthy" ? colors.green : 
                         check.status === "unhealthy" ? colors.yellow : colors.red;
      
      healthTable.push([
        check.endpoint,
        statusColor(check.status.toUpperCase()),
        `${check.responseTime.toFixed(0)}ms`,
        check.details || ""
      ]);
    }
    
    console.log(healthTable.toString());
    console.log();
    
    if (issues.length > 0) {
      console.log(colors.yellow.bold("⚠️  Issues Found:"));
      for (const issue of issues) {
        console.log(`  • ${issue}`);
      }
      console.log();
    }
    
    console.log(colors.blue.bold("💡 Optimization Recommendations:"));
    if (avgResponseTime > 3000) {
      console.log("  • Dashboard loading is slow - consider reducing panel count");
      console.log("  • Check Loki query performance - reduce time ranges");
    }
    if (avgResponseTime > 1000) {
      console.log("  • Enable browser caching for static assets");
      console.log("  • Consider CDN for static content");
    }
    console.log("  • Monitor Grafana pod resource usage during peak loads");
    console.log("  • Check Tailscale network latency with: tailscale ping");
  }
  
  return {
    status: overallStatus,
    timestamp: startTime,
    summary: {
      total: healthChecks.length,
      healthy,
      warnings,
      critical: criticalIssues
    },
    details: {
      performance: {
        avgResponseTime: Math.round(avgResponseTime),
        minResponseTime: Math.round(minResponseTime), 
        maxResponseTime: Math.round(maxResponseTime),
        samples: options.samples
      },
      healthChecks,
      allMetrics: allMetrics.map(m => ({
        totalTime: Math.round(m.totalTime),
        statusCode: m.statusCode,
        responseSize: m.responseSize,
        cacheHit: m.cacheHit
      }))
    },
    issues
  };
}

async function main(): Promise<void> {
  await new Command()
    .name("grafana-performance-monitor")
    .version("1.0.0")
    .description("Monitor Grafana performance through Tailscale ingress")
    .option("-s, --samples <number:integer>", "Number of performance samples to take", { default: 5 })
    .option("-j, --json", "Output results in JSON format")
    .option("-w, --watch", "Continuously monitor (not compatible with --json)")
    .action(async (options) => {
      if (options.watch && options.json) {
        console.error("Error: --watch and --json options are incompatible");
        Deno.exit(1);
      }
      
      if (options.watch) {
        console.log(colors.blue.bold("📊 Continuous Grafana Performance Monitoring"));
        console.log(colors.gray("Press Ctrl+C to stop\n"));
        
        while (true) {
          const result = await runPerformanceAnalysis({ samples: options.samples, json: false });
          console.log(`\n${colors.gray(`Last updated: ${new Date().toLocaleTimeString()}`)}`);
          console.log(colors.gray("Waiting 30 seconds for next check...\n"));
          
          await new Promise(resolve => setTimeout(resolve, 30000));
        }
      } else {
        const result = await runPerformanceAnalysis({ samples: options.samples, json: options.json });
        
        if (options.json) {
          console.log(JSON.stringify(result, null, 2));
        }
        
        // Set exit code based on status
        const exitCode = result.status === "healthy" ? ExitCode.SUCCESS :
                        result.status === "warning" ? ExitCode.WARNING :
                        result.status === "critical" ? ExitCode.CRITICAL :
                        ExitCode.ERROR;
        
        Deno.exit(exitCode);
      }
    })
    .parse(Deno.args);
}

if (import.meta.main) {
  await main();
}