#!/usr/bin/env -S deno run --allow-net --allow-env

/**
 * Validate Nessie REST Catalog Service
 * Tests API connectivity and basic operations for the Data Platform
 */

interface NessieConfig {
  defaultBranch: string;
  minSupportedApiVersion: number;
  maxSupportedApiVersion: number;
  actualApiVersion: number;
  specVersion: string;
}

interface NessieReference {
  type: string;
  name: string;
  hash: string;
}

const NESSIE_URL = Deno.env.get("NESSIE_URL") || "http://localhost:19120";

async function checkNessieHealth(): Promise<boolean> {
  try {
    console.log(`🔍 Checking Nessie service at ${NESSIE_URL}...`);
    
    // Test configuration endpoint
    const configResponse = await fetch(`${NESSIE_URL}/api/v2/config`);
    if (!configResponse.ok) {
      console.error(`❌ Failed to get Nessie config: ${configResponse.status}`);
      return false;
    }
    
    const config: NessieConfig = await configResponse.json();
    console.log(`✅ Nessie API v${config.actualApiVersion} (spec ${config.specVersion})`);
    console.log(`   Default branch: ${config.defaultBranch}`);
    console.log(`   Repository created: ${new Date(config.repositoryCreationTimestamp || 0).toISOString()}`);
    
    // List branches
    const branchesResponse = await fetch(`${NESSIE_URL}/api/v2/trees`);
    if (!branchesResponse.ok) {
      console.error(`❌ Failed to list branches: ${branchesResponse.status}`);
      return false;
    }
    
    const branches = await branchesResponse.json();
    console.log(`\n📊 Available branches:`);
    for (const ref of branches.references || []) {
      console.log(`   - ${ref.name} (${ref.type}) @ ${ref.hash.substring(0, 8)}...`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error checking Nessie health: ${error}`);
    return false;
  }
}

async function testNessieOperations(): Promise<boolean> {
  try {
    console.log(`\n🧪 Testing Nessie operations...`);
    
    // Get main branch details
    const mainBranchResponse = await fetch(`${NESSIE_URL}/api/v2/trees/branch/main`);
    if (!mainBranchResponse.ok) {
      console.error(`❌ Failed to get main branch: ${mainBranchResponse.status}`);
      return false;
    }
    
    const mainBranch = await mainBranchResponse.json();
    console.log(`✅ Main branch hash: ${mainBranch.hash.substring(0, 8)}...`);
    
    // Try to list contents (might be empty initially)
    const contentsUrl = `${NESSIE_URL}/api/v2/trees/branch/main/contents`;
    const contentsResponse = await fetch(contentsUrl);
    
    if (contentsResponse.ok) {
      const contents = await contentsResponse.json();
      console.log(`✅ Branch contents: ${JSON.stringify(contents, null, 2)}`);
    } else {
      console.log(`ℹ️  No contents in branch yet (${contentsResponse.status})`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error testing operations: ${error}`);
    return false;
  }
}

async function generateIntegrationNotes(): Promise<void> {
  console.log(`\n📝 Integration Notes for Iceberg:`);
  console.log(`
To use Nessie with Apache Iceberg, configure your Spark session with:

spark.sql.catalog.nessie = org.apache.iceberg.spark.SparkCatalog
spark.sql.catalog.nessie.catalog-impl = org.apache.iceberg.nessie.NessieCatalog
spark.sql.catalog.nessie.uri = ${NESSIE_URL}/api/v2
spark.sql.catalog.nessie.ref = main
spark.sql.catalog.nessie.warehouse = s3a://iceberg-test

Example Spark SQL:
  USE nessie;
  CREATE NAMESPACE IF NOT EXISTS lakehouse;
  CREATE TABLE lakehouse.sample (id BIGINT, name STRING) USING iceberg;
`);
}

async function main() {
  console.log("🚀 Nessie Catalog Validation for Data Platform\n");
  
  const healthOk = await checkNessieHealth();
  if (!healthOk) {
    console.error("\n❌ Nessie health check failed!");
    Deno.exit(1);
  }
  
  const opsOk = await testNessieOperations();
  if (!opsOk) {
    console.error("\n❌ Nessie operations test failed!");
    Deno.exit(1);
  }
  
  await generateIntegrationNotes();
  
  console.log("\n✨ Nessie validation completed successfully!");
  console.log("   The catalog service is ready for Iceberg table management.");
}

if (import.meta.main) {
  main();
}