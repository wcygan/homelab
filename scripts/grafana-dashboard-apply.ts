#!/usr/bin/env -S deno run --allow-all
/**
 * Apply Grafana dashboards via API
 * Usage: ./grafana-dashboard-apply.ts [dashboard.json]
 */

import { $ } from "@david/dax";

const GRAFANA_URL = process.env.GRAFANA_URL || "https://grafana.walleye-monster.ts.net";
const GRAFANA_API_KEY = process.env.GRAFANA_API_KEY || "";

interface Dashboard {
  dashboard: any;
  folderId?: number;
  folderUid?: string;
  message?: string;
  overwrite: boolean;
}

async function applyDashboard(dashboardFile: string) {
  if (!GRAFANA_API_KEY) {
    console.error("❌ GRAFANA_API_KEY environment variable not set");
    console.log("Get an API key from Grafana → Configuration → API keys");
    Deno.exit(1);
  }

  // Read dashboard JSON
  const dashboardJson = await Deno.readTextFile(dashboardFile);
  const dashboard = JSON.parse(dashboardJson);

  // Prepare payload
  const payload: Dashboard = {
    dashboard: {
      ...dashboard,
      id: null,  // Let Grafana assign ID
      uid: dashboard.uid || null,
    },
    overwrite: true,
    message: `Applied via GitOps: ${new Date().toISOString()}`
  };

  // Apply dashboard
  const response = await fetch(`${GRAFANA_URL}/api/dashboards/db`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GRAFANA_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`❌ Failed to apply dashboard: ${error}`);
    Deno.exit(1);
  }

  const result = await response.json();
  console.log(`✅ Dashboard applied: ${result.uid} (${result.url})`);
}

// Alternative: Apply via kubectl port-forward (no API key needed)
async function applyDashboardViaKubectl(dashboardFile: string) {
  console.log("🔌 Setting up port-forward to Grafana...");
  
  // Get Grafana admin password
  const password = await $`kubectl get secret -n monitoring kube-prometheus-stack-grafana -o jsonpath="{.data.admin-password}" | base64 -d`.text();
  
  // Start port-forward
  const portForward = await $`kubectl port-forward -n monitoring svc/kube-prometheus-stack-grafana 3000:80`.spawn();
  
  try {
    // Wait for port-forward
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Read dashboard
    const dashboardJson = await Deno.readTextFile(dashboardFile);
    const dashboard = JSON.parse(dashboardJson);
    
    // Apply via local API
    const response = await fetch("http://localhost:3000/api/dashboards/db", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`admin:${password.trim()}`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dashboard: {
          ...dashboard,
          id: null,
          uid: dashboard.uid || null,
        },
        overwrite: true,
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to apply dashboard: ${error}`);
    }
    
    const result = await response.json();
    console.log(`✅ Dashboard applied: ${result.uid}`);
    
  } finally {
    portForward.kill();
  }
}

// Main
if (import.meta.main) {
  const dashboardFile = Deno.args[0];
  
  if (!dashboardFile) {
    console.error("Usage: ./grafana-dashboard-apply.ts <dashboard.json>");
    Deno.exit(1);
  }
  
  // Use kubectl method if no API key
  if (!GRAFANA_API_KEY) {
    await applyDashboardViaKubectl(dashboardFile);
  } else {
    await applyDashboard(dashboardFile);
  }
}