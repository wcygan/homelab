#!/usr/bin/env deno run --allow-all

import { $ } from "https://deno.land/x/dax@0.35.0/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";

console.log(colors.blue.bold("🧹 Cleaning up completed pods..."));

// Get completed pods
const completedPods = await $`kubectl get pods -A --field-selector=status.phase=Succeeded -o json`.json();

let cleaned = 0;
for (const pod of completedPods.items) {
  const namespace = pod.metadata.namespace;
  const name = pod.metadata.name;
  
  try {
    await $`kubectl delete pod -n ${namespace} ${name}`;
    console.log(colors.green(`✓ Deleted ${namespace}/${name}`));
    cleaned++;
  } catch (error) {
    console.log(colors.red(`✗ Failed to delete ${namespace}/${name}: ${error.message}`));
  }
}

console.log(`\n${colors.green(`Cleaned up ${cleaned} completed pods`)}`);

// Also clean up old replica sets
console.log(`\n${colors.blue.bold("🧹 Cleaning up old replica sets...")}`);

const replicaSets = await $`kubectl get rs -A -o json | jq -r '.items[] | select(.spec.replicas == 0 and .status.replicas == 0 and (.metadata.creationTimestamp | fromdateiso8601) < (now - 86400)) | "\(.metadata.namespace)/\(.metadata.name)"'`.lines();

let rsCleaneed = 0;
for (const rs of replicaSets) {
  if (!rs) continue;
  const [namespace, name] = rs.split('/');
  
  try {
    await $`kubectl delete rs -n ${namespace} ${name}`;
    console.log(colors.green(`✓ Deleted replica set ${namespace}/${name}`));
    rsCleaneed++;
  } catch (error) {
    console.log(colors.yellow(`⚠ Skipped ${namespace}/${name}: ${error.message}`));
  }
}

console.log(`\n${colors.green(`Cleaned up ${rsCleaneed} old replica sets`)}`);