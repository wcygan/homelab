#!/usr/bin/env -S deno run --allow-all

/**
 * S3 Integration Test Script
 * Tests connectivity and basic operations against Ceph ObjectStore S3 endpoint
 */

import { $ } from "https://deno.land/x/dax@0.39.2/mod.ts";
import * as colors from "https://deno.land/std@0.208.0/fmt/colors.ts";

interface S3Config {
  endpoint: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

interface TestResult {
  test: string;
  status: "pass" | "fail" | "skip";
  message?: string;
  duration?: number;
}

class S3IntegrationTest {
  private results: TestResult[] = [];
  private config?: S3Config;

  async run() {
    console.log(colors.bold(colors.blue("\n🔍 S3 Integration Test Suite\n")));

    // Get S3 credentials from Kubernetes secret
    await this.getS3Credentials();

    if (!this.config) {
      console.error(colors.red("❌ Failed to retrieve S3 credentials"));
      Deno.exit(1);
    }

    // Run test suite
    await this.testEndpointConnectivity();
    await this.testListBuckets();
    await this.testBucketOperations();
    await this.testObjectOperations();

    // Print summary
    this.printSummary();

    // Exit with appropriate code
    const failed = this.results.filter(r => r.status === "fail").length;
    Deno.exit(failed > 0 ? 1 : 0);
  }

  private async getS3Credentials() {
    const start = performance.now();
    try {
      console.log("📋 Retrieving S3 credentials from Kubernetes secret...");
      
      // Get secret data
      const result = await $`kubectl get secret loki-s3-credentials -n monitoring -o json`.json();
      
      // Decode base64 values
      this.config = {
        endpoint: new TextDecoder().decode(
          Uint8Array.from(atob(result.data.endpoint), c => c.charCodeAt(0))
        ),
        bucket: new TextDecoder().decode(
          Uint8Array.from(atob(result.data.bucket), c => c.charCodeAt(0))
        ),
        accessKeyId: new TextDecoder().decode(
          Uint8Array.from(atob(result.data.access_key_id), c => c.charCodeAt(0))
        ),
        secretAccessKey: new TextDecoder().decode(
          Uint8Array.from(atob(result.data.secret_access_key), c => c.charCodeAt(0))
        ),
        region: new TextDecoder().decode(
          Uint8Array.from(atob(result.data.region), c => c.charCodeAt(0))
        ),
      };

      console.log(colors.green("✓ Retrieved credentials successfully"));
      console.log(`  Endpoint: ${this.config.endpoint}`);
      console.log(`  Bucket: ${this.config.bucket}`);
      console.log(`  Region: ${this.config.region}`);

      this.results.push({
        test: "Get S3 Credentials",
        status: "pass",
        duration: performance.now() - start,
      });
    } catch (error) {
      this.results.push({
        test: "Get S3 Credentials",
        status: "fail",
        message: error.message,
        duration: performance.now() - start,
      });
    }
  }

  private async testEndpointConnectivity() {
    const start = performance.now();
    console.log("\n🔌 Testing endpoint connectivity...");

    try {
      // Create a test pod with AWS CLI to test S3 connectivity
      const podYaml = `
apiVersion: v1
kind: Pod
metadata:
  name: s3-test-pod
  namespace: monitoring
spec:
  containers:
  - name: aws-cli
    image: amazon/aws-cli:2.15.10
    command: ["sleep", "3600"]
    env:
    - name: AWS_ACCESS_KEY_ID
      valueFrom:
        secretKeyRef:
          name: loki-s3-credentials
          key: access_key_id
    - name: AWS_SECRET_ACCESS_KEY
      valueFrom:
        secretKeyRef:
          name: loki-s3-credentials
          key: secret_access_key
    - name: AWS_DEFAULT_REGION
      valueFrom:
        secretKeyRef:
          name: loki-s3-credentials
          key: region
  restartPolicy: Never
`;

      // Create test pod
      await $`echo ${podYaml} | kubectl apply -f -`;
      
      // Wait for pod to be ready
      console.log("  Waiting for test pod to be ready...");
      await $`kubectl wait --for=condition=Ready pod/s3-test-pod -n monitoring --timeout=60s`;

      // Test connectivity
      const testCmd = `aws --endpoint-url=${this.config!.endpoint} s3 ls`;
      await $`kubectl exec -n monitoring s3-test-pod -- sh -c ${testCmd}`;

      console.log(colors.green("✓ Endpoint connectivity test passed"));
      this.results.push({
        test: "Endpoint Connectivity",
        status: "pass",
        duration: performance.now() - start,
      });
    } catch (error) {
      console.log(colors.red("✗ Endpoint connectivity test failed"));
      this.results.push({
        test: "Endpoint Connectivity",
        status: "fail",
        message: error.message,
        duration: performance.now() - start,
      });
    }
  }

  private async testListBuckets() {
    const start = performance.now();
    console.log("\n🪣 Testing bucket listing...");

    try {
      const listCmd = `aws --endpoint-url=${this.config!.endpoint} s3 ls`;
      const result = await $`kubectl exec -n monitoring s3-test-pod -- sh -c ${listCmd}`.text();

      console.log("  Current buckets:");
      if (result.trim()) {
        console.log(colors.dim(result.trim().split('\n').map(line => `    ${line}`).join('\n')));
      } else {
        console.log(colors.dim("    (no buckets found)"));
      }

      console.log(colors.green("✓ Bucket listing test passed"));
      this.results.push({
        test: "List Buckets",
        status: "pass",
        duration: performance.now() - start,
      });
    } catch (error) {
      console.log(colors.red("✗ Bucket listing test failed"));
      this.results.push({
        test: "List Buckets",
        status: "fail",
        message: error.message,
        duration: performance.now() - start,
      });
    }
  }

  private async testBucketOperations() {
    const start = performance.now();
    console.log("\n🪣 Testing bucket operations...");

    const testBucket = "test-bucket-" + Date.now();

    try {
      // Create bucket
      console.log(`  Creating test bucket: ${testBucket}`);
      const createCmd = `aws --endpoint-url=${this.config!.endpoint} s3 mb s3://${testBucket}`;
      await $`kubectl exec -n monitoring s3-test-pod -- sh -c ${createCmd}`;
      console.log(colors.green(`  ✓ Created bucket: ${testBucket}`));

      // List buckets to verify
      const listCmd = `aws --endpoint-url=${this.config!.endpoint} s3 ls`;
      const buckets = await $`kubectl exec -n monitoring s3-test-pod -- sh -c ${listCmd}`.text();
      
      if (buckets.includes(testBucket)) {
        console.log(colors.green("  ✓ Bucket appears in listing"));
      } else {
        throw new Error("Created bucket not found in listing");
      }

      // Delete bucket
      console.log(`  Deleting test bucket: ${testBucket}`);
      const deleteCmd = `aws --endpoint-url=${this.config!.endpoint} s3 rb s3://${testBucket}`;
      await $`kubectl exec -n monitoring s3-test-pod -- sh -c ${deleteCmd}`;
      console.log(colors.green(`  ✓ Deleted bucket: ${testBucket}`));

      console.log(colors.green("✓ Bucket operations test passed"));
      this.results.push({
        test: "Bucket Operations",
        status: "pass",
        duration: performance.now() - start,
      });

      // Now test creating the actual Loki bucket
      await this.createLokiBucket();

    } catch (error) {
      console.log(colors.red("✗ Bucket operations test failed"));
      this.results.push({
        test: "Bucket Operations",
        status: "fail",
        message: error.message,
        duration: performance.now() - start,
      });
    }
  }

  private async createLokiBucket() {
    const start = performance.now();
    console.log("\n🪣 Creating Loki bucket...");

    try {
      // Check if bucket already exists
      const listCmd = `aws --endpoint-url=${this.config!.endpoint} s3 ls`;
      const existing = await $`kubectl exec -n monitoring s3-test-pod -- sh -c ${listCmd}`.text();
      
      if (existing.includes(this.config!.bucket)) {
        console.log(colors.yellow(`  ⚠️  Bucket '${this.config!.bucket}' already exists`));
        this.results.push({
          test: "Create Loki Bucket",
          status: "pass",
          message: "Bucket already exists",
          duration: performance.now() - start,
        });
        return;
      }

      // Create the Loki bucket
      const createCmd = `aws --endpoint-url=${this.config!.endpoint} s3 mb s3://${this.config!.bucket}`;
      await $`kubectl exec -n monitoring s3-test-pod -- sh -c ${createCmd}`;
      
      console.log(colors.green(`✓ Created Loki bucket: ${this.config!.bucket}`));
      this.results.push({
        test: "Create Loki Bucket",
        status: "pass",
        duration: performance.now() - start,
      });
    } catch (error) {
      console.log(colors.red(`✗ Failed to create Loki bucket: ${this.config!.bucket}`));
      this.results.push({
        test: "Create Loki Bucket",
        status: "fail",
        message: error.message,
        duration: performance.now() - start,
      });
    }
  }

  private async testObjectOperations() {
    const start = performance.now();
    console.log("\n📄 Testing object operations...");

    const testFile = "test-object-" + Date.now() + ".txt";
    const testContent = "Hello from S3 integration test!";

    try {
      // Create test file in pod
      console.log(`  Creating test object: ${testFile}`);
      await $`kubectl exec -n monitoring s3-test-pod -- sh -c "echo '${testContent}' > /tmp/${testFile}"`;

      // Upload object
      const uploadCmd = `aws --endpoint-url=${this.config!.endpoint} s3 cp /tmp/${testFile} s3://${this.config!.bucket}/${testFile}`;
      await $`kubectl exec -n monitoring s3-test-pod -- sh -c ${uploadCmd}`;
      console.log(colors.green(`  ✓ Uploaded object: ${testFile}`));

      // List objects
      const listCmd = `aws --endpoint-url=${this.config!.endpoint} s3 ls s3://${this.config!.bucket}/`;
      const objects = await $`kubectl exec -n monitoring s3-test-pod -- sh -c ${listCmd}`.text();
      
      if (objects.includes(testFile)) {
        console.log(colors.green("  ✓ Object appears in listing"));
      } else {
        throw new Error("Uploaded object not found in listing");
      }

      // Download object
      const downloadCmd = `aws --endpoint-url=${this.config!.endpoint} s3 cp s3://${this.config!.bucket}/${testFile} /tmp/downloaded-${testFile}`;
      await $`kubectl exec -n monitoring s3-test-pod -- sh -c ${downloadCmd}`;
      
      // Verify content
      const catCmd = `cat /tmp/downloaded-${testFile}`;
      const downloaded = await $`kubectl exec -n monitoring s3-test-pod -- sh -c ${catCmd}`.text();
      
      if (downloaded.trim() === testContent) {
        console.log(colors.green("  ✓ Downloaded content matches"));
      } else {
        throw new Error("Downloaded content does not match original");
      }

      // Delete object
      const deleteCmd = `aws --endpoint-url=${this.config!.endpoint} s3 rm s3://${this.config!.bucket}/${testFile}`;
      await $`kubectl exec -n monitoring s3-test-pod -- sh -c ${deleteCmd}`;
      console.log(colors.green(`  ✓ Deleted object: ${testFile}`));

      console.log(colors.green("✓ Object operations test passed"));
      this.results.push({
        test: "Object Operations",
        status: "pass",
        duration: performance.now() - start,
      });

    } catch (error) {
      console.log(colors.red("✗ Object operations test failed"));
      this.results.push({
        test: "Object Operations",
        status: "fail",
        message: error.message,
        duration: performance.now() - start,
      });
    } finally {
      // Cleanup test pod
      try {
        console.log("\n🧹 Cleaning up test pod...");
        await $`kubectl delete pod s3-test-pod -n monitoring --grace-period=0 --force`.quiet();
        console.log(colors.green("✓ Test pod cleaned up"));
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  private printSummary() {
    console.log(colors.bold(colors.blue("\n📊 Test Summary\n")));

    const passed = this.results.filter(r => r.status === "pass").length;
    const failed = this.results.filter(r => r.status === "fail").length;
    const skipped = this.results.filter(r => r.status === "skip").length;

    // Print individual results
    for (const result of this.results) {
      const icon = result.status === "pass" ? "✓" : 
                   result.status === "fail" ? "✗" : "○";
      const color = result.status === "pass" ? colors.green :
                    result.status === "fail" ? colors.red : colors.yellow;
      
      let line = color(`${icon} ${result.test}`);
      if (result.duration) {
        line += colors.dim(` (${result.duration.toFixed(0)}ms)`);
      }
      if (result.message) {
        line += colors.dim(` - ${result.message}`);
      }
      console.log(line);
    }

    // Print totals
    console.log(colors.bold(`\nTotal: ${this.results.length} tests`));
    console.log(colors.green(`Passed: ${passed}`));
    if (failed > 0) console.log(colors.red(`Failed: ${failed}`));
    if (skipped > 0) console.log(colors.yellow(`Skipped: ${skipped}`));

    // Final status
    if (failed === 0) {
      console.log(colors.bold(colors.green("\n✅ All S3 integration tests passed!")));
      console.log(colors.dim("S3 storage is ready for Loki deployment."));
    } else {
      console.log(colors.bold(colors.red("\n❌ Some S3 integration tests failed!")));
      console.log(colors.dim("Please fix the issues before proceeding with Loki deployment."));
    }
  }
}

// Run the test
if (import.meta.main) {
  const test = new S3IntegrationTest();
  await test.run();
}