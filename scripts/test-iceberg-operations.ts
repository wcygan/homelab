#!/usr/bin/env -S deno run --allow-run --allow-env

/**
 * Test Iceberg Table Operations via Spark SQL
 * Validates objective 1.3 deliverables for Data Platform
 */

interface TestResult {
  name: string;
  success: boolean;
  output?: string;
  error?: string;
}

const NAMESPACE = "data-platform";
const POD_NAME = "spark-iceberg-client";

async function runSparkSQL(sql: string): Promise<TestResult> {
  try {
    console.log(`🧪 Executing: ${sql.substring(0, 100)}...`);
    
    const command = [
      "kubectl", "exec", "-n", NAMESPACE, POD_NAME, "--",
      "/opt/spark/bin/spark-sql",
      "--conf", "spark.sql.adaptive.enabled=true",
      "--conf", "spark.sql.adaptive.coalescePartitions.enabled=true",
      "-e", sql
    ];
    
    const process = new Deno.Command(command[0], {
      args: command.slice(1),
      stdout: "piped",
      stderr: "piped"
    });
    
    const { success, stdout, stderr } = await process.output();
    const output = new TextDecoder().decode(stdout);
    const error = new TextDecoder().decode(stderr);
    
    if (success) {
      console.log("✅ Success");
      return { name: sql.substring(0, 50), success: true, output };
    } else {
      console.log("❌ Failed");
      return { name: sql.substring(0, 50), success: false, error };
    }
  } catch (err) {
    console.log(`❌ Error: ${err}`);
    return { name: sql.substring(0, 50), success: false, error: String(err) };
  }
}

async function checkPodReady(): Promise<boolean> {
  try {
    console.log("🔍 Checking if Spark client pod is ready...");
    
    const command = ["kubectl", "get", "pod", "-n", NAMESPACE, POD_NAME, "-o", "jsonpath={.status.phase}"];
    const process = new Deno.Command(command[0], { args: command.slice(1), stdout: "piped" });
    const { success, stdout } = await process.output();
    
    if (success) {
      const phase = new TextDecoder().decode(stdout);
      if (phase === "Running") {
        console.log("✅ Pod is running");
        return true;
      } else {
        console.log(`❌ Pod status: ${phase}`);
        return false;
      }
    }
    return false;
  } catch (err) {
    console.log(`❌ Error checking pod: ${err}`);
    return false;
  }
}

async function testIcebergOperations(): Promise<TestResult[]> {
  const tests: TestResult[] = [];
  
  // Test 1: Create namespace
  tests.push(await runSparkSQL(`
    USE nessie;
    CREATE NAMESPACE IF NOT EXISTS lakehouse;
  `));
  
  // Test 2: Create Iceberg table
  tests.push(await runSparkSQL(`
    USE nessie;
    CREATE TABLE IF NOT EXISTS lakehouse.sample_data (
      id BIGINT,
      name STRING,
      created_at TIMESTAMP,
      status STRING
    ) USING iceberg
    LOCATION 's3a://iceberg-test/lakehouse/sample_data'
    TBLPROPERTIES (
      'write.format.default' = 'parquet',
      'write.parquet.compression-codec' = 'snappy'
    );
  `));
  
  // Test 3: Insert sample data
  tests.push(await runSparkSQL(`
    USE nessie;
    INSERT INTO lakehouse.sample_data VALUES 
      (1, 'first_record', current_timestamp(), 'active'),
      (2, 'second_record', current_timestamp(), 'inactive'),
      (3, 'third_record', current_timestamp(), 'active');
  `));
  
  // Test 4: Select data
  tests.push(await runSparkSQL(`
    USE nessie;
    SELECT * FROM lakehouse.sample_data ORDER BY id;
  `));
  
  // Test 5: Schema evolution - add column
  tests.push(await runSparkSQL(`
    USE nessie;
    ALTER TABLE lakehouse.sample_data ADD COLUMN category STRING;
  `));
  
  // Test 6: Update with new column
  tests.push(await runSparkSQL(`
    USE nessie;
    INSERT INTO lakehouse.sample_data VALUES 
      (4, 'fourth_record', current_timestamp(), 'active', 'test');
  `));
  
  // Test 7: Show table schema
  tests.push(await runSparkSQL(`
    USE nessie;
    DESCRIBE EXTENDED lakehouse.sample_data;
  `));
  
  // Test 8: Show table history (time travel)
  tests.push(await runSparkSQL(`
    USE nessie;
    SELECT * FROM lakehouse.sample_data.snapshots;
  `));
  
  return tests;
}

async function main() {
  console.log("🚀 Testing Iceberg Table Operations for Data Platform");
  console.log("   Objective 1.3: Create and manage Iceberg tables via Spark SQL\n");
  
  // Check prerequisites
  const podReady = await checkPodReady();
  if (!podReady) {
    console.error("❌ Spark client pod is not ready. Deploy it first with:");
    console.error("   kubectl apply -k kubernetes/apps/data-platform/spark-iceberg-client/app");
    Deno.exit(1);
  }
  
  // Run tests
  console.log("\n📊 Running Iceberg table operations tests...\n");
  const results = await testIcebergOperations();
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log("\n📋 Test Results Summary:");
  console.log(`   ✅ Successful: ${successful}/${total}`);
  console.log(`   ❌ Failed: ${total - successful}/${total}`);
  
  if (successful === total) {
    console.log("\n🎉 All Iceberg operations completed successfully!");
    console.log("   Objective 1.3 deliverables validated:");
    console.log("   ✅ Sample Iceberg table creation");
    console.log("   ✅ Schema evolution examples");
    console.log("   ✅ Time travel feature validation");
    console.log("   ✅ Basic table operations (INSERT/SELECT)");
    
    console.log("\n🔗 Validation Commands:");
    console.log(`   kubectl logs -n ${NAMESPACE} ${POD_NAME}`);
    console.log(`   aws s3 --endpoint-url http://rook-ceph-rgw-storage.storage.svc:80 ls s3://iceberg-test/lakehouse/sample_data/ --recursive`);
  } else {
    console.log("\n❌ Some tests failed. Review the errors above.");
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}