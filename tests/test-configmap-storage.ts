#!/usr/bin/env -S deno run --allow-all

import { $ } from "@david/dax";

// Test creating a ConfigMap for metrics storage

const testData = {
  "airflow/logs-airflow-triggerer-0": [
    {
      timestamp: new Date().toISOString(),
      usagePercent: 5,
      usedBytes: 21 * 1024 * 1024 * 1024 // 21GB
    }
  ]
};

const cmYaml = `
apiVersion: v1
kind: ConfigMap
metadata:
  name: storage-metrics-history
  namespace: default
data:
  history: |
    ${JSON.stringify(testData, null, 2).split('\n').join('\n    ')}
`;

console.log("Creating test ConfigMap...");
console.log(cmYaml);

try {
  await $`kubectl apply -f -`.stdin(cmYaml);
  console.log("ConfigMap created successfully!");
  
  // Read it back
  const cm = await $`kubectl get configmap storage-metrics-history -n default -o json`.json();
  console.log("\nStored data:");
  console.log(cm.data.history);
} catch (error) {
  console.error("Error:", error.message);
}