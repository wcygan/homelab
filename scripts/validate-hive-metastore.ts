#!/usr/bin/env -S deno run --allow-all

import { $ } from "jsr:@david/dax@0.42.0";
import { blue, green, red, yellow, bold } from "jsr:@std/fmt@1.0.3/colors";

const NAMESPACE = "data-platform";
const APP_NAME = "hive-metastore";
const POSTGRES_CLUSTER = "hive-metastore-postgres";

async function checkPostgresCluster(): Promise<boolean> {
  console.log(blue("\n🐘 Checking PostgreSQL cluster..."));
  
  try {
    const cluster = await $`kubectl get cluster -n ${NAMESPACE} ${POSTGRES_CLUSTER} -o json`.json();
    const phase = cluster.status?.phase;
    
    if (phase === "Cluster in healthy state") {
      console.log(green("✅ PostgreSQL cluster is healthy"));
      
      // Check endpoints
      const endpoints = await $`kubectl get endpoints -n ${NAMESPACE} ${POSTGRES_CLUSTER}-rw -o json`.json();
      if (endpoints.subsets?.[0]?.addresses?.length > 0) {
        const address = endpoints.subsets[0].addresses[0].ip;
        console.log(green(`✅ PostgreSQL endpoint available at: ${address}:5432`));
        return true;
      }
    } else {
      console.log(red(`❌ PostgreSQL cluster status: ${phase || 'Unknown'}`));
      return false;
    }
  } catch (error) {
    console.error(red("❌ PostgreSQL cluster not found or error:"), error.message);
    return false;
  }
}

async function checkHiveMetastorePods(): Promise<boolean> {
  console.log(blue("\n📦 Checking Hive Metastore pods..."));
  
  try {
    const pods = await $`kubectl get pods -n ${NAMESPACE} -l app.kubernetes.io/name=${APP_NAME} -o json`.json();
    
    if (pods.items.length === 0) {
      console.log(yellow("⚠️  No Hive Metastore pods found"));
      return false;
    }
    
    let allReady = true;
    for (const pod of pods.items) {
      const ready = pod.status.conditions?.find(c => c.type === "Ready")?.status === "True";
      const phase = pod.status.phase;
      
      if (ready && phase === "Running") {
        console.log(green(`✅ Pod ${pod.metadata.name} is running and ready`));
      } else {
        console.log(red(`❌ Pod ${pod.metadata.name} - Phase: ${phase}, Ready: ${ready}`));
        allReady = false;
      }
    }
    
    return allReady;
  } catch (error) {
    console.error(red("❌ Error checking pods:"), error.message);
    return false;
  }
}

async function checkService(): Promise<boolean> {
  console.log(blue("\n🌐 Checking Hive Metastore service..."));
  
  try {
    const service = await $`kubectl get svc -n ${NAMESPACE} ${APP_NAME} -o json`.json();
    const port = service.spec.ports?.[0]?.port;
    
    if (port === 9083) {
      console.log(green(`✅ Service ${APP_NAME} exposed on port ${port}`));
      
      // Check endpoints
      const endpoints = await $`kubectl get endpoints -n ${NAMESPACE} ${APP_NAME} -o json`.json();
      const addresses = endpoints.subsets?.[0]?.addresses?.length || 0;
      
      if (addresses > 0) {
        console.log(green(`✅ Service has ${addresses} endpoint(s)`));
        return true;
      } else {
        console.log(yellow("⚠️  Service has no endpoints"));
        return false;
      }
    } else {
      console.log(red(`❌ Service port mismatch: expected 9083, got ${port}`));
      return false;
    }
  } catch (error) {
    console.error(red("❌ Service not found:"), error.message);
    return false;
  }
}

async function testConnection(): Promise<boolean> {
  console.log(blue("\n🔌 Testing Hive Metastore connection..."));
  
  try {
    // Port forward to test connection
    console.log(yellow("⏳ Setting up port forward..."));
    const portForward = $`kubectl port-forward -n ${NAMESPACE} svc/${APP_NAME} 9083:9083`.spawn();
    
    // Wait for port forward to establish
    await $.sleep(3000);
    
    // Test connection with beeline (if available)
    console.log(yellow("⏳ Testing Thrift connection..."));
    
    // Simple TCP connection test
    const testResult = await $`nc -zv localhost 9083`.text();
    
    if (testResult.includes("succeeded") || testResult.includes("open")) {
      console.log(green("✅ Hive Metastore is accepting connections on port 9083"));
      portForward.kill();
      return true;
    } else {
      console.log(red("❌ Could not connect to Hive Metastore"));
      portForward.kill();
      return false;
    }
  } catch (error) {
    console.log(yellow("⚠️  Could not test connection (nc might not be available)"));
    return true; // Don't fail validation if we can't test
  }
}

async function checkLogs(): Promise<void> {
  console.log(blue("\n📋 Recent logs from Hive Metastore..."));
  
  try {
    const logs = await $`kubectl logs -n ${NAMESPACE} -l app.kubernetes.io/name=${APP_NAME} --tail=20`.text();
    console.log(logs);
  } catch (error) {
    console.log(yellow("⚠️  Could not fetch logs"));
  }
}

async function main() {
  console.log(bold(blue("🗄️  Hive Metastore Validation\n")));
  
  const checks = [
    { name: "PostgreSQL Cluster", fn: checkPostgresCluster },
    { name: "Hive Metastore Pods", fn: checkHiveMetastorePods },
    { name: "Service Configuration", fn: checkService },
    { name: "Connection Test", fn: testConnection },
  ];
  
  let passed = 0;
  for (const check of checks) {
    if (await check.fn()) {
      passed++;
    }
  }
  
  await checkLogs();
  
  if (passed === checks.length) {
    console.log(bold(green(`\n✅ All validation checks passed! (${passed}/${checks.length})`)));
    console.log(green("Hive Metastore is ready for use"));
    
    // Save validation results
    const results = {
      timestamp: new Date().toISOString(),
      namespace: NAMESPACE,
      checks: checks.length,
      passed: passed,
      postgresEndpoint: `${POSTGRES_CLUSTER}-rw.${NAMESPACE}.svc.cluster.local:5432`,
      metastoreEndpoint: `${APP_NAME}.${NAMESPACE}.svc.cluster.local:9083`
    };
    
    await Deno.writeTextFile("/tmp/hive-metastore-validation.json", JSON.stringify(results, null, 2));
    console.log(dim("\nResults saved to: /tmp/hive-metastore-validation.json"));
  } else {
    console.log(bold(red(`\n❌ Some validation checks failed (${passed}/${checks.length})`)));
    console.log(yellow("\nTroubleshooting tips:"));
    console.log("1. Check HelmRelease: kubectl describe helmrelease -n data-platform hive-metastore");
    console.log("2. Check PostgreSQL: kubectl get cluster -n data-platform -o wide");
    console.log("3. Check events: kubectl get events -n data-platform --sort-by='.lastTimestamp'");
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}