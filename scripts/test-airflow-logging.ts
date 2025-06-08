#!/usr/bin/env -S deno run --allow-all
/**
 * Test script for Airflow persistent logging setup
 * This script helps verify that logs are properly persisted after pod termination
 */

import $ from "jsr:@david/dax";
import { parseArgs } from "@std/cli/parse-args";

const args = parseArgs(Deno.args, {
  boolean: ["help", "deploy", "test", "logs", "cleanup"],
  alias: { h: "help", d: "deploy", t: "test", l: "logs", c: "cleanup" },
});

function showHelp() {
  console.log(`
Airflow Logging Test Script

Usage: deno run --allow-all scripts/test-airflow-logging.ts [options]

Options:
  -d, --deploy    Deploy the updated Airflow configuration
  -t, --test      Trigger a test DAG run and monitor
  -l, --logs      Check current log status and PVC
  -c, --cleanup   Clean up test resources
  -h, --help      Show this help

Examples:
  # Deploy the updated configuration
  ./scripts/test-airflow-logging.ts --deploy

  # Test logging after deployment
  ./scripts/test-airflow-logging.ts --test

  # Check log persistence
  ./scripts/test-airflow-logging.ts --logs
  `);
}

async function deployAirflow() {
  console.log("🚀 Deploying Airflow with persistent logging...");

  try {
    // Force reconciliation of the Airflow Kustomization
    await $`flux reconcile kustomization airflow -n airflow --with-source`;
    console.log("✅ Flux reconciliation triggered");

    // Wait for deployment to be ready
    console.log("⏳ Waiting for Airflow deployment to be ready...");
    await $`kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=airflow -n airflow --timeout=300s`;
    console.log("✅ Airflow pods are ready");

    // Check PVC status
    console.log("📊 Checking persistent volume status...");
    await $`kubectl get pvc -n airflow`;
  } catch (error) {
    console.error(
      "❌ Deployment failed:",
      error instanceof Error ? error.message : String(error),
    );
    throw error;
  }
}

async function testLogging() {
  console.log("🧪 Testing Airflow logging...");

  try {
    // Check if DAG is available
    console.log("📋 Checking available DAGs...");
    const webserverPod =
      await $`kubectl get pods -n airflow -l component=webserver -o jsonpath='{.items[0].metadata.name}'`
        .text();

    if (!webserverPod) {
      throw new Error("No webserver pod found");
    }

    // List DAGs
    await $`kubectl exec -n airflow ${webserverPod} -- airflow dags list`;

    // Trigger the hello_world DAG
    console.log("🎯 Triggering hello_world DAG...");
    await $`kubectl exec -n airflow ${webserverPod} -- airflow dags trigger hello_world`;

    console.log("✅ DAG triggered successfully");
    console.log("⏳ Waiting for task execution (30 seconds)...");
    await $`sleep 30`;

    // Check task status
    console.log("📊 Checking task status...");
    await $`kubectl exec -n airflow ${webserverPod} -- airflow tasks list hello_world`;
  } catch (error) {
    console.error(
      "❌ Test failed:",
      error instanceof Error ? error.message : String(error),
    );
    throw error;
  }
}

async function checkLogs() {
  console.log("📋 Checking Airflow logs and persistence...");

  try {
    // Check PVC status
    console.log("💾 Persistent Volume Claims:");
    await $`kubectl get pvc -n airflow`;

    // Check if logs directory exists in PVC
    const webserverPod =
      await $`kubectl get pods -n airflow -l component=webserver -o jsonpath='{.items[0].metadata.name}'`
        .text();

    if (webserverPod) {
      console.log("📁 Checking logs directory structure:");
      await $`kubectl exec -n airflow ${webserverPod} -- ls -la /opt/airflow/logs/`;

      console.log("📄 Recent log files:");
      await $`kubectl exec -n airflow ${webserverPod} -- find /opt/airflow/logs/ -name "*.log" -type f -mtime -1 | head -10`;
    }

    // Check Airflow configuration
    console.log("⚙️ Airflow logging configuration:");
    if (webserverPod) {
      await $`kubectl exec -n airflow ${webserverPod} -- airflow config get-value logging remote_logging`;
      await $`kubectl exec -n airflow ${webserverPod} -- airflow config get-value core base_log_folder`;
    }
  } catch (error) {
    console.error(
      "❌ Log check failed:",
      error instanceof Error ? error.message : String(error),
    );
    throw error;
  }
}

async function cleanup() {
  console.log("🧹 Cleaning up test resources...");

  try {
    const webserverPod =
      await $`kubectl get pods -n airflow -l component=webserver -o jsonpath='{.items[0].metadata.name}'`
        .text();

    if (webserverPod) {
      // Clear old DAG runs
      console.log("🗑️ Clearing old DAG runs...");
      await $`kubectl exec -n airflow ${webserverPod} -- airflow dags delete hello_world --yes`
        .noThrow();
    }

    console.log("✅ Cleanup completed");
  } catch (error) {
    console.error(
      "❌ Cleanup failed:",
      error instanceof Error ? error.message : String(error),
    );
  }
}

async function main() {
  if (args.help) {
    showHelp();
    return;
  }

  try {
    if (args.deploy) {
      await deployAirflow();
    }

    if (args.test) {
      await testLogging();
    }

    if (args.logs) {
      await checkLogs();
    }

    if (args.cleanup) {
      await cleanup();
    }

    if (!args.deploy && !args.test && !args.logs && !args.cleanup) {
      console.log("ℹ️ No action specified. Use --help for usage information.");
      console.log(
        "💡 Quick start: ./scripts/test-airflow-logging.ts --deploy --test",
      );
    }
  } catch (error) {
    console.error(
      "❌ Script failed:",
      error instanceof Error ? error.message : String(error),
    );
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
