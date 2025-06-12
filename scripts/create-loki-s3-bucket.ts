#!/usr/bin/env -S deno run --allow-all

import { $ } from "https://deno.land/x/dax@0.39.2/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";

console.log(colors.blue.bold("🪣 Creating Loki S3 Bucket"));

try {
  // Get the S3 credentials from Rook secret
  console.log("📥 Retrieving S3 credentials from Rook...");
  
  const accessKey = await $`kubectl get secret -n storage rook-ceph-object-user-storage-loki -o jsonpath='{.data.AccessKey}'`
    .text()
    .then(encoded => atob(encoded.trim()));
  
  const secretKey = await $`kubectl get secret -n storage rook-ceph-object-user-storage-loki -o jsonpath='{.data.SecretKey}'`
    .text()
    .then(encoded => atob(encoded.trim()));

  console.log(colors.green("✅ Retrieved S3 credentials"));
  console.log(`Access Key: ${accessKey}`);
  console.log(`Secret Key: ${colors.dim("*".repeat(secretKey.length))}`);

  // Create the bucket using a temporary pod
  console.log("\n🚀 Creating S3 bucket...");
  
  const result = await $`kubectl run -n storage create-loki-bucket --rm -i --restart=Never \
    --image=amazon/aws-cli:latest \
    --env=AWS_ACCESS_KEY_ID=${accessKey} \
    --env=AWS_SECRET_ACCESS_KEY=${secretKey} \
    -- s3 mb s3://loki --endpoint-url http://rook-ceph-rgw-storage.storage.svc.cluster.local:80 --region us-east-1`.text();

  if (result.includes("make_bucket: loki")) {
    console.log(colors.green("✅ Successfully created S3 bucket 'loki'"));
  } else if (result.includes("BucketAlreadyOwnedByYou") || result.includes("BucketAlreadyExists")) {
    console.log(colors.yellow("⚠️  Bucket 'loki' already exists"));
  } else {
    console.log(colors.red("❌ Unexpected response:"), result);
  }

  // Verify bucket creation
  console.log("\n🔍 Verifying bucket...");
  
  const buckets = await $`kubectl run -n storage list-buckets --rm -i --restart=Never \
    --image=amazon/aws-cli:latest \
    --env=AWS_ACCESS_KEY_ID=${accessKey} \
    --env=AWS_SECRET_ACCESS_KEY=${secretKey} \
    -- s3 ls --endpoint-url http://rook-ceph-rgw-storage.storage.svc.cluster.local:80 --region us-east-1`.text();

  if (buckets.includes("loki")) {
    console.log(colors.green("✅ Bucket 'loki' verified"));
  } else {
    console.log(colors.red("❌ Bucket 'loki' not found in listing"));
    console.log("Buckets found:", buckets);
  }

  // Display 1Password instructions
  console.log(colors.blue.bold("\n📝 Next Steps:"));
  console.log("1. Add these credentials to 1Password:");
  console.log(`   - Item name: ${colors.yellow("loki-s3-config")}`);
  console.log(`   - Field 'access_key': ${colors.yellow(accessKey)}`);
  console.log(`   - Field 'secret_key': ${colors.yellow(secretKey)}`);
  console.log("\n2. Commit and push the changes:");
  console.log(colors.dim("   git add kubernetes/apps/monitoring/loki/"));
  console.log(colors.dim("   git commit -m 'feat(loki): add S3 storage configuration with External Secrets'"));
  console.log(colors.dim("   git push"));
  console.log("\n3. Force reconciliation:");
  console.log(colors.dim("   flux reconcile kustomization cluster-apps --with-source"));

} catch (error) {
  console.error(colors.red("❌ Error:"), error.message);
  Deno.exit(1);
}