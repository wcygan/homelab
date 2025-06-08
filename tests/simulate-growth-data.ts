#!/usr/bin/env -S deno run --allow-all

import { $ } from "@david/dax";

// Simulate historical data for growth analysis testing

const now = Date.now();
const day = 24 * 60 * 60 * 1000;

const simulatedHistory = {
  "airflow/logs-airflow-triggerer-0": [
    {
      timestamp: new Date(now - 7 * day).toISOString(), // 7 days ago
      usagePercent: 3,
      usedBytes: 10 * 1024 * 1024 * 1024 // 10GB
    },
    {
      timestamp: new Date(now - 3 * day).toISOString(), // 3 days ago
      usagePercent: 4,
      usedBytes: 15 * 1024 * 1024 * 1024 // 15GB
    },
    {
      timestamp: new Date().toISOString(), // now
      usagePercent: 5,
      usedBytes: 21 * 1024 * 1024 * 1024 // 21GB
    }
  ],
  "database/test-postgres-cluster-1": [
    {
      timestamp: new Date(now - 14 * day).toISOString(), // 14 days ago
      usagePercent: 5,
      usedBytes: 20 * 1024 * 1024 * 1024
    },
    {
      timestamp: new Date(now - 7 * day).toISOString(), // 7 days ago
      usagePercent: 6.5,
      usedBytes: 28 * 1024 * 1024 * 1024
    },
    {
      timestamp: new Date().toISOString(), // now
      usagePercent: 8,
      usedBytes: 36 * 1024 * 1024 * 1024
    }
  ],
  // Keep other PVCs with just current data
  "kubeai/open-webui": [
    {
      timestamp: new Date().toISOString(),
      usagePercent: 8,
      usedBytes: 36 * 1024 * 1024 * 1024
    }
  ],
  "airflow/data-airflow-postgresql-0": [
    {
      timestamp: new Date().toISOString(),
      usagePercent: 7,
      usedBytes: 29 * 1024 * 1024 * 1024
    }
  ],
  "database/df-test-cache-0": [
    {
      timestamp: new Date().toISOString(),
      usagePercent: 7,
      usedBytes: 29 * 1024 * 1024 * 1024
    }
  ]
};

// Save to temp file and update ConfigMap
const tempFile = await Deno.makeTempFile({ suffix: ".json" });
await Deno.writeTextFile(tempFile, JSON.stringify(simulatedHistory));

try {
  await $`kubectl create configmap storage-metrics-history -n default --from-file=history=${tempFile} --dry-run=client -o yaml | kubectl replace -f -`;
  console.log("Updated ConfigMap with simulated historical data");
  
  // Verify
  const cm = await $`kubectl get configmap storage-metrics-history -n default -o json`.json();
  const data = JSON.parse(cm.data.history);
  
  console.log("\nSimulated growth patterns:");
  console.log("- airflow/logs-airflow-triggerer-0: 3% → 5% over 7 days (0.29% per day)");
  console.log("- database/test-postgres-cluster-1: 5% → 8% over 14 days (0.21% per day)");
  
} catch (error) {
  console.error("Error:", error.message);
} finally {
  await Deno.remove(tempFile);
}