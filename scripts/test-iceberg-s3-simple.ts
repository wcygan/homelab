#!/usr/bin/env -S deno run --allow-all

import { $ } from "jsr:@david/dax@0.42.0";

// Get S3 credentials
const secretData = await $`kubectl get secret -n storage rook-ceph-object-user-storage-iceberg -o json`.json();
const accessKey = atob(secretData.data.AccessKey);
const secretKey = atob(secretData.data.SecretKey);

console.log("🔑 S3 Credentials retrieved");
console.log(`Access Key: ${accessKey}`);
console.log(`Secret Key: ${secretKey.substring(0, 5)}...`);

// Test S3 connection using kubectl run
console.log("\n🧪 Testing S3 connection...");

const testScript = `
export AWS_ACCESS_KEY_ID="${accessKey}"
export AWS_SECRET_ACCESS_KEY="${secretKey}"
export AWS_DEFAULT_REGION=us-east-1

echo "Listing buckets..."
aws s3 ls --endpoint-url http://rook-ceph-rgw-storage.storage.svc:80

echo -e "\nCreating iceberg-test bucket..."
aws s3 mb s3://iceberg-test --endpoint-url http://rook-ceph-rgw-storage.storage.svc:80 || echo "Bucket might already exist"

echo -e "\nCreating test file..."
echo "test data for iceberg" > /tmp/test.txt

echo -e "\nUploading test file..."
aws s3 cp /tmp/test.txt s3://iceberg-test/test.txt --endpoint-url http://rook-ceph-rgw-storage.storage.svc:80

echo -e "\nListing bucket contents..."
aws s3 ls s3://iceberg-test/ --endpoint-url http://rook-ceph-rgw-storage.storage.svc:80

echo -e "\nS3 validation complete!"
`;

await $`kubectl run -i --rm s3-test --image=amazon/aws-cli:latest --restart=Never -- sh`.stdin(testScript);

console.log("\n✅ S3 validation test completed!");

// Save validation results
const results = {
  timestamp: new Date().toISOString(),
  endpoint: "http://rook-ceph-rgw-storage.storage.svc:80",
  credentials: {
    accessKey: accessKey,
    secretKey: "***REDACTED***"
  },
  bucket: "iceberg-test",
  status: "validated"
};

await Deno.writeTextFile("/tmp/iceberg-s3-validation.json", JSON.stringify(results, null, 2));
console.log("\n📄 Results saved to: /tmp/iceberg-s3-validation.json");