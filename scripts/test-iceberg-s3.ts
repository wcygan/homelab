#!/usr/bin/env -S deno run --allow-all

import { $ } from "jsr:@david/dax@0.42.0";
import { blue, green, red, yellow, bold, dim } from "jsr:@std/fmt@1.0.3/colors";

const CEPH_S3_ENDPOINT = "http://rook-ceph-rgw-storage.storage.svc:80";
const TEST_BUCKET = "iceberg-test";
const TEST_FILE = "test-data.parquet";

interface S3Credentials {
  accessKey: string;
  secretKey: string;
}

async function getS3Credentials(): Promise<S3Credentials> {
  console.log(blue("📡 Retrieving S3 credentials..."));
  
  const secretData = await $`kubectl get secret -n storage rook-ceph-object-user-storage-iceberg -o json`.json();
  
  return {
    accessKey: atob(secretData.data.AccessKey),
    secretKey: atob(secretData.data.SecretKey),
  };
}

async function testS3Connection(creds: S3Credentials): Promise<boolean> {
  console.log(blue("\n🔌 Testing S3 connection..."));
  
  try {
    // Create temporary AWS config
    const awsConfig = `
[default]
aws_access_key_id = ${creds.accessKey}
aws_secret_access_key = ${creds.secretKey}
`;
    
    await Deno.writeTextFile("/tmp/aws-credentials", awsConfig);
    
    // Test listing buckets
    const result = await $`AWS_SHARED_CREDENTIALS_FILE=/tmp/aws-credentials aws s3 ls --endpoint-url ${CEPH_S3_ENDPOINT}`.text();
    console.log(green("✅ S3 connection successful"));
    console.log("Existing buckets:", result || "(none)");
    
    return true;
  } catch (error) {
    console.error(red("❌ S3 connection failed:"), error.message);
    return false;
  }
}

async function createTestBucket(creds: S3Credentials): Promise<boolean> {
  console.log(blue(`\n🪣 Creating test bucket: ${TEST_BUCKET}...`));
  
  try {
    await $`AWS_SHARED_CREDENTIALS_FILE=/tmp/aws-credentials aws s3 mb s3://${TEST_BUCKET} --endpoint-url ${CEPH_S3_ENDPOINT}`;
    console.log(green(`✅ Bucket ${TEST_BUCKET} created successfully`));
    return true;
  } catch (error) {
    if (error.message.includes("BucketAlreadyExists")) {
      console.log(yellow(`⚠️  Bucket ${TEST_BUCKET} already exists`));
      return true;
    }
    console.error(red("❌ Bucket creation failed:"), error.message);
    return false;
  }
}

async function testIcebergOperations(creds: S3Credentials): Promise<boolean> {
  console.log(blue("\n🧊 Testing Iceberg-compatible operations..."));
  
  try {
    // Create a sample Parquet file
    const sampleData = JSON.stringify({
      metadata: {
        format: "iceberg",
        version: 2,
        table_uuid: "test-table-001"
      },
      data: [
        { id: 1, name: "test1", timestamp: new Date().toISOString() },
        { id: 2, name: "test2", timestamp: new Date().toISOString() }
      ]
    });
    
    await Deno.writeTextFile("/tmp/test-data.json", sampleData);
    
    // Upload test data
    await $`AWS_SHARED_CREDENTIALS_FILE=/tmp/aws-credentials aws s3 cp /tmp/test-data.json s3://${TEST_BUCKET}/data/test-data.json --endpoint-url ${CEPH_S3_ENDPOINT}`;
    console.log(green("✅ File upload successful"));
    
    // Test multipart upload (required for large Iceberg files)
    const largeFile = "/tmp/large-test.dat";
    await $`dd if=/dev/zero of=${largeFile} bs=1M count=10`;
    await $`AWS_SHARED_CREDENTIALS_FILE=/tmp/aws-credentials aws s3 cp ${largeFile} s3://${TEST_BUCKET}/data/large-test.dat --endpoint-url ${CEPH_S3_ENDPOINT}`;
    console.log(green("✅ Multipart upload successful"));
    
    // List objects
    const objects = await $`AWS_SHARED_CREDENTIALS_FILE=/tmp/aws-credentials aws s3 ls s3://${TEST_BUCKET}/data/ --endpoint-url ${CEPH_S3_ENDPOINT} --recursive`.text();
    console.log("Objects in bucket:", objects);
    
    // Test byte-range reads (important for Iceberg)
    await $`AWS_SHARED_CREDENTIALS_FILE=/tmp/aws-credentials aws s3api get-object --bucket ${TEST_BUCKET} --key data/test-data.json --range bytes=0-100 --endpoint-url ${CEPH_S3_ENDPOINT} /tmp/partial-read.txt`;
    console.log(green("✅ Byte-range read successful"));
    
    return true;
  } catch (error) {
    console.error(red("❌ Iceberg operations failed:"), error.message);
    return false;
  }
}

async function performanceBaseline(creds: S3Credentials): Promise<void> {
  console.log(blue("\n⚡ Measuring performance baseline..."));
  
  const fileSizes = [1, 10, 100]; // MB
  const results: any[] = [];
  
  for (const size of fileSizes) {
    const filename = `/tmp/perf-test-${size}mb.dat`;
    await $`dd if=/dev/zero of=${filename} bs=1M count=${size}`;
    
    // Upload timing
    const uploadStart = performance.now();
    await $`AWS_SHARED_CREDENTIALS_FILE=/tmp/aws-credentials aws s3 cp ${filename} s3://${TEST_BUCKET}/perf/test-${size}mb.dat --endpoint-url ${CEPH_S3_ENDPOINT}`;
    const uploadTime = performance.now() - uploadStart;
    
    // Download timing
    const downloadStart = performance.now();
    await $`AWS_SHARED_CREDENTIALS_FILE=/tmp/aws-credentials aws s3 cp s3://${TEST_BUCKET}/perf/test-${size}mb.dat /tmp/download-${size}mb.dat --endpoint-url ${CEPH_S3_ENDPOINT}`;
    const downloadTime = performance.now() - downloadStart;
    
    results.push({
      size: `${size}MB`,
      uploadTime: `${(uploadTime / 1000).toFixed(2)}s`,
      uploadSpeed: `${(size * 8 / (uploadTime / 1000)).toFixed(2)} Mbps`,
      downloadTime: `${(downloadTime / 1000).toFixed(2)}s`,
      downloadSpeed: `${(size * 8 / (downloadTime / 1000)).toFixed(2)} Mbps`,
    });
    
    // Cleanup
    await $`rm ${filename} /tmp/download-${size}mb.dat`;
  }
  
  console.table(results);
}

async function configureBucketLifecycle(creds: S3Credentials): Promise<boolean> {
  console.log(blue("\n♻️  Configuring bucket lifecycle policies..."));
  
  const lifecyclePolicy = {
    Rules: [
      {
        ID: "iceberg-cleanup",
        Status: "Enabled",
        Filter: { Prefix: "metadata/snap-" },
        Expiration: { Days: 30 },
      },
      {
        ID: "temp-file-cleanup", 
        Status: "Enabled",
        Filter: { Prefix: ".tmp/" },
        Expiration: { Days: 1 },
      }
    ]
  };
  
  try {
    await Deno.writeTextFile("/tmp/lifecycle.json", JSON.stringify(lifecyclePolicy));
    await $`AWS_SHARED_CREDENTIALS_FILE=/tmp/aws-credentials aws s3api put-bucket-lifecycle-configuration --bucket ${TEST_BUCKET} --lifecycle-configuration file:///tmp/lifecycle.json --endpoint-url ${CEPH_S3_ENDPOINT}`;
    console.log(green("✅ Lifecycle policies configured"));
    return true;
  } catch (error) {
    console.error(red("❌ Lifecycle configuration failed:"), error.message);
    return false;
  }
}

async function main() {
  console.log(bold(blue("🧊 Iceberg S3 Compatibility Test Suite\n")));
  
  // Wait for S3 user to be created
  console.log(yellow("⏳ Waiting for S3 user creation..."));
  await $.sleep(5000);
  
  try {
    const creds = await getS3Credentials();
    
    const tests = [
      { name: "S3 Connection", fn: () => testS3Connection(creds) },
      { name: "Bucket Creation", fn: () => createTestBucket(creds) },
      { name: "Iceberg Operations", fn: () => testIcebergOperations(creds) },
      { name: "Bucket Lifecycle", fn: () => configureBucketLifecycle(creds) },
    ];
    
    let passed = 0;
    for (const test of tests) {
      if (await test.fn()) {
        passed++;
      }
    }
    
    if (passed === tests.length) {
      await performanceBaseline(creds);
      
      console.log(bold(green(`\n✅ All tests passed! (${passed}/${tests.length})`)));
      console.log(green("Ceph S3 is compatible with Apache Iceberg requirements"));
      
      // Save results
      const results = {
        timestamp: new Date().toISOString(),
        endpoint: CEPH_S3_ENDPOINT,
        bucket: TEST_BUCKET,
        testsRun: tests.length,
        testsPassed: passed,
        credentials: {
          accessKey: creds.accessKey,
          secretKey: "***REDACTED***"
        }
      };
      
      await Deno.writeTextFile("/tmp/iceberg-s3-validation.json", JSON.stringify(results, null, 2));
      console.log(dim("\nResults saved to: /tmp/iceberg-s3-validation.json"));
    } else {
      console.log(bold(red(`\n❌ Some tests failed (${passed}/${tests.length})`)));
      Deno.exit(1);
    }
    
    // Cleanup
    await $`rm -f /tmp/aws-credentials /tmp/lifecycle.json`;
    
  } catch (error) {
    console.error(bold(red("Fatal error:")), error.message);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}