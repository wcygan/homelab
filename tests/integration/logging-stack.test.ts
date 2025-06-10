#!/usr/bin/env -S deno test --allow-all
/**
 * Integration tests for the logging stack: Loki + Ceph S3 + log ingestion
 * 
 * Tests validate:
 * - Loki API connectivity and readiness
 * - Log ingestion from test workloads
 * - S3 storage backend functionality
 * - End-to-end logging pipeline
 */

import { assertEquals, assert } from "@std/assert";
import { $ } from "@david/dax";

// Test configuration
const LOKI_NAMESPACE = "monitoring";
const LOKI_SERVICE = "loki-gateway";
const TEST_NAMESPACE = "logging-test";
const LOG_WAIT_TIME = 30000; // 30 seconds for log ingestion

/**
 * Helper function to execute kubectl commands with JSON output
 */
async function kubectl(args: string[]): Promise<any> {
  const result = await $`kubectl ${args} -o json`.json();
  return result;
}

/**
 * Helper function to wait for a condition with timeout
 */
async function waitFor(
  condition: () => Promise<boolean>,
  timeoutMs: number = 60000,
  intervalMs: number = 2000
): Promise<void> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    if (await condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  throw new Error(`Condition not met within ${timeoutMs}ms`);
}

Deno.test({
  name: "Loki API connectivity and readiness",
  fn: async () => {
    // Check if Loki pods are running
    const pods = await kubectl(["get", "pods", "-n", LOKI_NAMESPACE, "-l", "app.kubernetes.io/name=loki"]);
    const runningPods = pods.items.filter((pod: any) => 
      pod.status.phase === "Running" && 
      pod.status.conditions?.some((c: any) => c.type === "Ready" && c.status === "True")
    );
    
    assert(runningPods.length > 0, "No ready Loki pods found");
    
    // Test Loki readiness endpoint directly from pod
    const readyResponse = await $`kubectl exec -n ${LOKI_NAMESPACE} ${runningPods[0].metadata.name} -c loki -- wget -qO- http://localhost:3100/ready`.text();
    assertEquals(readyResponse.trim(), "ready", "Loki readiness endpoint failed");
    
    // Test Loki gateway service exists and is accessible
    const services = await kubectl(["get", "svc", "-n", LOKI_NAMESPACE, "-l", "app.kubernetes.io/name=loki"]);
    const gatewayService = services.items.find((svc: any) => svc.metadata.name.includes("gateway"));
    assert(gatewayService, "Loki gateway service not found");
    
    console.log("✅ Loki API connectivity verified");
  },
});

Deno.test({
  name: "Loki S3 backend configuration",
  fn: async () => {
    // Check if S3 credentials secret exists
    try {
      const secret = await kubectl(["get", "secret", "-n", LOKI_NAMESPACE, "loki-s3-credentials"]);
      assert(secret.metadata?.name === "loki-s3-credentials", "S3 credentials secret not found");
    } catch (error) {
      throw new Error(`S3 credentials secret missing: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Verify Loki configuration includes S3 backend
    const helmRelease = await kubectl(["get", "helmrelease", "-n", LOKI_NAMESPACE, "loki"]);
    const values = helmRelease.spec.values;
    assertEquals(values.loki.storage.type, "s3", "Loki not configured with S3 storage");
    assert(values.loki.storage.s3?.endpoint?.includes("rook-ceph-rgw"), "S3 endpoint not pointing to Ceph RGW");
    
    console.log("✅ Loki S3 backend configuration verified");
  },
});