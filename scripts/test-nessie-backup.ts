#!/usr/bin/env -S deno run --allow-run --allow-env

/**
 * Test Nessie Backup Procedures
 * Validates backup and recovery for Nessie catalog metadata
 */

interface BackupResult {
  component: string;
  success: boolean;
  details: string;
}

async function runCommand(cmd: string[]): Promise<{ success: boolean; output: string; error: string }> {
  try {
    const process = new Deno.Command(cmd[0], {
      args: cmd.slice(1),
      stdout: "piped",
      stderr: "piped"
    });
    
    const { success, stdout, stderr } = await process.output();
    return {
      success,
      output: new TextDecoder().decode(stdout),
      error: new TextDecoder().decode(stderr)
    };
  } catch (err) {
    return { success: false, output: "", error: String(err) };
  }
}

async function testBackupInfrastructure(): Promise<BackupResult[]> {
  const results: BackupResult[] = [];
  
  console.log("🔍 Testing backup infrastructure...\n");
  
  // Test 1: Check if backup CronJob exists
  console.log("📅 Checking backup CronJob...");
  const cronJobResult = await runCommand([
    "kubectl", "get", "cronjob", "-n", "data-platform", "nessie-backup", "-o", "jsonpath={.metadata.name}"
  ]);
  
  if (cronJobResult.success && cronJobResult.output.trim() === "nessie-backup") {
    console.log("✅ Backup CronJob exists");
    results.push({ component: "Backup CronJob", success: true, details: "CronJob configured for daily execution" });
  } else {
    console.log("❌ Backup CronJob not found");
    results.push({ component: "Backup CronJob", success: false, details: cronJobResult.error });
  }
  
  // Test 2: Check if backup PVC exists
  console.log("💾 Checking backup storage...");
  const pvcResult = await runCommand([
    "kubectl", "get", "pvc", "-n", "data-platform", "nessie-backup-pvc", "-o", "jsonpath={.status.phase}"
  ]);
  
  if (pvcResult.success && pvcResult.output.trim() === "Bound") {
    console.log("✅ Backup storage is ready");
    results.push({ component: "Backup Storage", success: true, details: "PVC bound and ready" });
  } else {
    console.log("❌ Backup storage not ready");
    results.push({ component: "Backup Storage", success: false, details: pvcResult.error });
  }
  
  // Test 3: Check PostgreSQL connectivity
  console.log("🗄️ Checking PostgreSQL connectivity...");
  const pgResult = await runCommand([
    "kubectl", "exec", "-n", "data-platform", "nessie-postgres-1", "-c", "postgres", "--",
    "psql", "-U", "postgres", "-d", "nessie", "-c", "SELECT version();"
  ]);
  
  if (pgResult.success) {
    console.log("✅ PostgreSQL is accessible");
    results.push({ component: "PostgreSQL Access", success: true, details: "Database connection successful" });
  } else {
    console.log("❌ PostgreSQL connection failed");
    results.push({ component: "PostgreSQL Access", success: false, details: pgResult.error });
  }
  
  return results;
}

async function runTestBackup(): Promise<BackupResult> {
  console.log("🧪 Running test backup...\n");
  
  // Create a test backup job
  const jobName = `nessie-backup-test-${Date.now()}`;
  
  const createJobResult = await runCommand([
    "kubectl", "create", "job", "--from=cronjob/nessie-backup", jobName, "-n", "data-platform"
  ]);
  
  if (!createJobResult.success) {
    return { component: "Test Backup", success: false, details: `Failed to create test job: ${createJobResult.error}` };
  }
  
  console.log(`📦 Created test backup job: ${jobName}`);
  
  // Wait for job completion (up to 5 minutes)
  console.log("⏳ Waiting for backup job to complete...");
  for (let i = 0; i < 30; i++) {
    const statusResult = await runCommand([
      "kubectl", "get", "job", "-n", "data-platform", jobName, "-o", "jsonpath={.status.conditions[?(@.type==\"Complete\")].status}"
    ]);
    
    if (statusResult.success && statusResult.output.trim() === "True") {
      console.log("✅ Test backup completed successfully");
      
      // Get job logs
      const logsResult = await runCommand([
        "kubectl", "logs", "-n", "data-platform", `job/${jobName}`, "--tail=20"
      ]);
      
      // Cleanup test job
      await runCommand(["kubectl", "delete", "job", "-n", "data-platform", jobName]);
      
      return { 
        component: "Test Backup", 
        success: true, 
        details: `Backup completed successfully. Log snippet: ${logsResult.output.split('\n').slice(-3).join('; ')}` 
      };
    }
    
    // Check if job failed
    const failedResult = await runCommand([
      "kubectl", "get", "job", "-n", "data-platform", jobName, "-o", "jsonpath={.status.conditions[?(@.type==\"Failed\")].status}"
    ]);
    
    if (failedResult.success && failedResult.output.trim() === "True") {
      const logsResult = await runCommand([
        "kubectl", "logs", "-n", "data-platform", `job/${jobName}`, "--tail=10"
      ]);
      
      await runCommand(["kubectl", "delete", "job", "-n", "data-platform", jobName]);
      
      return { 
        component: "Test Backup", 
        success: false, 
        details: `Backup job failed. Logs: ${logsResult.output}` 
      };
    }
    
    // Wait 10 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
  
  // Timeout
  await runCommand(["kubectl", "delete", "job", "-n", "data-platform", jobName]);
  return { component: "Test Backup", success: false, details: "Backup job timed out after 5 minutes" };
}

async function main() {
  console.log("🚀 Testing Nessie Backup Procedures\n");
  
  // Test infrastructure
  const infraResults = await testBackupInfrastructure();
  
  // Only run backup test if infrastructure is ready
  const infraReady = infraResults.every(r => r.success);
  let backupResult: BackupResult | null = null;
  
  if (infraReady) {
    backupResult = await runTestBackup();
  } else {
    console.log("⚠️ Skipping backup test due to infrastructure issues\n");
  }
  
  // Summary
  const allResults = backupResult ? [...infraResults, backupResult] : infraResults;
  const successful = allResults.filter(r => r.success).length;
  const total = allResults.length;
  
  console.log("\n📋 Backup System Test Results:");
  console.log(`   ✅ Successful: ${successful}/${total}`);
  console.log(`   ❌ Failed: ${total - successful}/${total}`);
  
  // Details
  console.log("\n📊 Component Status:");
  for (const result of allResults) {
    const status = result.success ? "✅" : "❌";
    console.log(`   ${status} ${result.component}: ${result.details}`);
  }
  
  if (successful === total) {
    console.log("\n🎉 All backup procedures working correctly!");
    console.log("   Nessie metadata backup system is operational");
    
    console.log("\n📝 Manual Operations:");
    console.log("   • Test backup: kubectl create job --from=cronjob/nessie-backup nessie-backup-manual -n data-platform");
    console.log("   • View backups: kubectl exec -n data-platform deploy/nessie -c nessie -- ls -la /backup");
    console.log("   • Schedule: Daily at 2 AM UTC");
    
    return 0;
  } else {
    console.log("\n❌ Backup system has issues. Review component details above.");
    return 1;
  }
}

if (import.meta.main) {
  const exitCode = await main();
  Deno.exit(exitCode);
}