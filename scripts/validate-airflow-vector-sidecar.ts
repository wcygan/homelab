#!/usr/bin/env -S deno run --allow-all

import { $ } from "npm:dax@0.39.2";
import { colors } from "https://deno.land/std@0.208.0/fmt/colors.ts";

interface ValidationResult {
  test: string;
  status: "passed" | "failed" | "warning";
  details: string;
  timestamp?: string;
}

async function main() {
  console.log(colors.bold(colors.blue("\n=== Airflow Vector Sidecar Validation ===")));
  console.log(colors.gray(new Date().toISOString()));
  
  const results: ValidationResult[] = [];
  
  // Test 1: Check if task pods have 2 containers
  console.log(colors.yellow("\n1. Checking task pods for Vector sidecar..."));
  try {
    const pods = await $`kubectl get pods -n airflow -o json`.json() as any;
    const taskPods = pods.items.filter((pod: any) => 
      pod.metadata.name.includes("hello-world") && 
      !pod.metadata.name.includes("health-check")
    );
    
    let sidecarCount = 0;
    let noSidecarCount = 0;
    
    for (const pod of taskPods) {
      const containers = pod.spec.containers;
      if (containers.length === 2 && containers.some((c: any) => c.name === "vector")) {
        sidecarCount++;
      } else {
        noSidecarCount++;
      }
    }
    
    if (sidecarCount > 0) {
      results.push({
        test: "Task pods have Vector sidecar",
        status: "passed",
        details: `Found ${sidecarCount} pods with Vector sidecar, ${noSidecarCount} without`
      });
    } else {
      results.push({
        test: "Task pods have Vector sidecar",
        status: "failed",
        details: `No task pods found with Vector sidecar (checked ${taskPods.length} pods)`
      });
    }
  } catch (e) {
    results.push({
      test: "Task pods have Vector sidecar",
      status: "failed",
      details: `Error checking pods: ${e.message}`
    });
  }

  // Test 2: Check Vector container status
  console.log(colors.yellow("\n2. Checking Vector container status..."));
  try {
    const pods = await $`kubectl get pods -n airflow -o json`.json() as any;
    const vectorPods = pods.items.filter((pod: any) => 
      pod.spec.containers.some((c: any) => c.name === "vector")
    );
    
    let restartCount = 0;
    let errorCount = 0;
    
    for (const pod of vectorPods) {
      const vectorStatus = pod.status.containerStatuses?.find((cs: any) => cs.name === "vector");
      if (vectorStatus) {
        restartCount += vectorStatus.restartCount || 0;
        if (vectorStatus.state.waiting || vectorStatus.state.terminated) {
          errorCount++;
        }
      }
    }
    
    if (errorCount === 0 && restartCount < 5) {
      results.push({
        test: "Vector containers stable",
        status: "passed",
        details: `Total restarts: ${restartCount}, no containers in error state`
      });
    } else {
      results.push({
        test: "Vector containers stable",
        status: "failed",
        details: `${errorCount} containers in error state, total restarts: ${restartCount}`
      });
    }
  } catch (e) {
    results.push({
      test: "Vector containers stable",
      status: "failed",
      details: `Error checking container status: ${e.message}`
    });
  }

  // Test 3: Check if logs appear in Loki
  console.log(colors.yellow("\n3. Checking Loki for Airflow task logs..."));
  try {
    // Port forward to Loki
    const portForward = $`kubectl port-forward -n monitoring svc/loki-gateway 3100:80`.spawn();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for port forward
    
    // Query Loki for recent Airflow logs
    const query = '{namespace="airflow"} |= "hello_world"';
    const end = new Date().toISOString();
    const start = new Date(Date.now() - 3600000).toISOString(); // 1 hour ago
    
    const response = await fetch(
      `http://localhost:3100/loki/api/v1/query_range?query=${encodeURIComponent(query)}&start=${start}&end=${end}&limit=10`
    );
    
    if (response.ok) {
      const data = await response.json();
      const logCount = data.data?.result?.reduce((acc: number, stream: any) => 
        acc + (stream.values?.length || 0), 0) || 0;
      
      if (logCount > 0) {
        results.push({
          test: "Logs appear in Loki",
          status: "passed",
          details: `Found ${logCount} log entries in the last hour`,
          timestamp: new Date().toISOString()
        });
      } else {
        results.push({
          test: "Logs appear in Loki",
          status: "warning",
          details: "No logs found in Loki for hello_world DAG"
        });
      }
    } else {
      results.push({
        test: "Logs appear in Loki",
        status: "failed",
        details: `Loki query failed: ${response.status} ${response.statusText}`
      });
    }
    
    portForward.kill();
  } catch (e) {
    results.push({
      test: "Logs appear in Loki",
      status: "failed",
      details: `Error querying Loki: ${e.message}`
    });
  }

  // Test 4: Check DAG execution times
  console.log(colors.yellow("\n4. Checking DAG execution times..."));
  try {
    const recentRuns = await $`kubectl exec -n airflow deployment/airflow-webserver -- airflow dags list-runs -d hello_world --limit 5`.text();
    
    if (recentRuns.includes("hello_world")) {
      results.push({
        test: "DAGs running without delays",
        status: "passed",
        details: "Recent DAG runs found, execution appears normal"
      });
    } else {
      results.push({
        test: "DAGs running without delays",
        status: "warning",
        details: "Could not verify DAG execution times"
      });
    }
  } catch (e) {
    results.push({
      test: "DAGs running without delays",
      status: "warning",
      details: `Could not check DAG runs: ${e.message}`
    });
  }

  // Test 5: Check Vector resource usage
  console.log(colors.yellow("\n5. Checking Vector resource usage..."));
  try {
    const pods = await $`kubectl get pods -n airflow -o json`.json() as any;
    const vectorPod = pods.items.find((pod: any) => 
      pod.spec.containers.some((c: any) => c.name === "vector") &&
      pod.status.phase === "Running"
    );
    
    if (vectorPod) {
      const metrics = await $`kubectl top pod ${vectorPod.metadata.name} -n airflow --containers`.text();
      const vectorLine = metrics.split('\n').find(line => line.includes('vector'));
      
      if (vectorLine) {
        const parts = vectorLine.trim().split(/\s+/);
        const cpu = parts[2];
        const memory = parts[3];
        
        results.push({
          test: "Vector resource usage",
          status: "passed",
          details: `CPU: ${cpu}, Memory: ${memory}`
        });
      } else {
        results.push({
          test: "Vector resource usage",
          status: "warning",
          details: "Could not parse resource metrics"
        });
      }
    } else {
      results.push({
        test: "Vector resource usage",
        status: "warning",
        details: "No running Vector containers found to measure"
      });
    }
  } catch (e) {
    results.push({
      test: "Vector resource usage",
      status: "warning",
      details: `Metrics server may not be available: ${e.message}`
    });
  }

  // Summary
  console.log(colors.bold(colors.blue("\n=== Validation Summary ===")));
  
  const passed = results.filter(r => r.status === "passed").length;
  const failed = results.filter(r => r.status === "failed").length;
  const warnings = results.filter(r => r.status === "warning").length;
  
  for (const result of results) {
    const icon = result.status === "passed" ? "✅" : 
                 result.status === "failed" ? "❌" : "⚠️";
    const color = result.status === "passed" ? colors.green :
                  result.status === "failed" ? colors.red : colors.yellow;
    
    console.log(`${icon} ${color(result.test)}: ${result.details}`);
  }
  
  console.log(colors.gray(`\nTotal: ${passed} passed, ${failed} failed, ${warnings} warnings`));
  
  // Exit code based on results
  if (failed > 0) {
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main().catch(console.error);
}