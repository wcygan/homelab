#!/usr/bin/env deno run --allow-all

import { $ } from "https://deno.land/x/dax@0.35.0/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";

const nodes = [
  { name: "k8s-1", ip: "192.168.1.98" },
  { name: "k8s-2", ip: "192.168.1.99" },
  { name: "k8s-3", ip: "192.168.1.100" },
];

console.log(colors.blue.bold("🔍 Node Health Monitor"));
console.log("=" .repeat(50));

for (const node of nodes) {
  console.log(`\n${colors.yellow.bold(`Node: ${node.name} (${node.ip})`)}`);
  
  try {
    // Check containerd status
    const containerdStatus = await $`talosctl -n ${node.ip} service containerd`.text();
    const isHealthy = containerdStatus.includes("Running");
    
    console.log(`Containerd: ${isHealthy ? colors.green("✓ Running") : colors.red("✗ Not Running")}`);
    
    // Check for recent errors
    const errors = await $`talosctl -n ${node.ip} dmesg | grep -i "segfault\|error" | tail -5`.text();
    if (errors.trim()) {
      console.log(colors.red("Recent errors detected:"));
      console.log(errors);
    } else {
      console.log(colors.green("✓ No recent errors"));
    }
    
    // Memory usage
    const memory = await $`talosctl -n ${node.ip} memory`.text();
    const memLines = memory.split('\n');
    const memInfo = memLines[1]?.split(/\s+/) || [];
    if (memInfo.length > 3) {
      const used = parseInt(memInfo[2]);
      const total = parseInt(memInfo[1]);
      const percent = ((used / total) * 100).toFixed(1);
      console.log(`Memory: ${percent}% used (${used}MB / ${total}MB)`);
    }
    
  } catch (error) {
    console.log(colors.red(`✗ Failed to check node: ${error.message}`));
  }
}

// Check pod restart summary
console.log(`\n${colors.yellow.bold("Pod Restart Summary:")}`);
const restarts = await $`kubectl get pods -A -o json | jq -r '.items[] | select(.status.containerStatuses != null) | {namespace: .metadata.namespace, name: .metadata.name, restarts: [.status.containerStatuses[].restartCount] | add} | select(.restarts > 5) | "\(.namespace)/\(.name): \(.restarts) restarts"' | sort -k2 -nr`.text();

if (restarts.trim()) {
  console.log(restarts);
} else {
  console.log(colors.green("✓ No pods with high restart counts"));
}