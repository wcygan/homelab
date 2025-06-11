#!/usr/bin/env -S deno run --allow-all
/**
 * Dashboard Launcher CLI
 * 
 * Automatically discovers Grafana dashboards from the homelab monitoring stack
 * and provides an interactive fzf interface to open them in the browser.
 * 
 * Features:
 * - Auto-discovery of dashboard JSON files
 * - Extracts dashboard IDs and titles from JSON
 * - Dynamically finds Grafana ingress URL from Kubernetes
 * - Interactive dashboard selection with fzf
 * - Cross-platform browser opening
 */

import { $, CommandBuilder } from "jsr:@david/dax@0.42.0";
import { walk } from "jsr:@std/fs@1.0.17";
import { basename, join } from "jsr:@std/path@1.0.8";

interface Dashboard {
  id: string | null;
  title: string;
  file: string;
  uid?: string;
}

interface KubernetesIngress {
  metadata: {
    name: string;
    namespace: string;
  };
  spec: {
    rules?: Array<{
      host: string;
      http: {
        paths: Array<{
          path: string;
          backend: {
            service: {
              name: string;
              port: {
                number: number;
              };
            };
          };
        }>;
      };
    }>;
  };
}

/**
 * Discovers all dashboard JSON files in the monitoring stack
 */
async function discoverDashboards(): Promise<Dashboard[]> {
  const dashboardsPath = "kubernetes/apps/monitoring/kube-prometheus-stack/app/dashboards";
  const dashboards: Dashboard[] = [];

  try {
    for await (const entry of walk(dashboardsPath, { 
      exts: [".json"],
      includeDirs: false 
    })) {
      if (entry.isFile && entry.path.endsWith('.json') && !entry.path.endsWith('kustomization.yaml')) {
        try {
          const content = await Deno.readTextFile(entry.path);
          const dashboard = JSON.parse(content);
          
          dashboards.push({
            id: dashboard.id,
            title: dashboard.title || basename(entry.path, '.json'),
            file: basename(entry.path),
            uid: dashboard.uid
          });
        } catch (error) {
          console.error(`Failed to parse ${entry.path}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.error(`Failed to discover dashboards: ${error.message}`);
    Deno.exit(1);
  }

  return dashboards;
}

/**
 * Finds the Grafana ingress URL from Kubernetes
 */
async function findGrafanaURL(): Promise<string> {
  try {
    const result = await $`kubectl get ingress -n monitoring -o json`.json();
    const ingresses = result.items as KubernetesIngress[];
    
    // Look for Grafana ingress (typically contains "grafana" in the name or points to grafana service)
    for (const ingress of ingresses) {
      if (ingress.metadata.name.toLowerCase().includes('grafana') || 
          ingress.spec.rules?.some(rule => 
            rule.http.paths.some(path => 
              path.backend.service.name.toLowerCase().includes('grafana')
            )
          )) {
        
        // Check if there's a host in the rules
        const host = ingress.spec.rules?.[0]?.host;
        if (host) {
          return `https://${host}`;
        }
        
        // For Tailscale ingress, check status.loadBalancer.ingress for the generated hostname
        try {
          const statusResult = await $`kubectl get ingress -n monitoring ${ingress.metadata.name} -o json`.json();
          const hostname = statusResult.status?.loadBalancer?.ingress?.[0]?.hostname;
          if (hostname) {
            return `https://${hostname}`;
          }
        } catch (statusError) {
          console.warn(`Could not get ingress status: ${statusError.message}`);
        }
        
        // Fallback: Try to find the Tailscale service hostname
        try {
          const svcResult = await $`kubectl get service -n monitoring -l "app.kubernetes.io/name=grafana" -o json`.json();
          for (const svc of svcResult.items) {
            if (svc.status?.loadBalancer?.ingress?.[0]?.hostname) {
              return `https://${svc.status.loadBalancer.ingress[0].hostname}`;
            }
          }
        } catch (svcError) {
          console.warn(`Could not get service status: ${svcError.message}`);
        }
      }
    }
    
    throw new Error("Grafana ingress not found or hostname not available");
  } catch (error) {
    console.error(`Failed to find Grafana URL: ${error.message}`);
    console.error("Make sure kubectl is configured and monitoring namespace exists");
    console.error("For Tailscale ingress, ensure the ingress controller is running and has assigned a hostname");
    Deno.exit(1);
  }
}

/**
 * Presents dashboard selection via fzf
 */
async function selectDashboard(dashboards: Dashboard[]): Promise<Dashboard | null> {
  if (dashboards.length === 0) {
    console.error("No dashboards found");
    return null;
  }

  // Format dashboards for fzf display
  const fzfOptions = dashboards.map(d => `${d.title} (${d.file})`).join('\n');
  
  try {
    const selection = await $`echo ${fzfOptions}`.pipe($`fzf --prompt="Select dashboard: " --height=40%`).text();
    
    // Parse selection back to dashboard
    const selectedTitle = selection.trim().split(' (')[0];
    return dashboards.find(d => d.title === selectedTitle) || null;
  } catch (error) {
    if (error.code === 130) {
      // User cancelled (Ctrl+C)
      console.log("Selection cancelled");
      return null;
    }
    console.error(`fzf selection failed: ${error.message}`);
    console.error("Make sure fzf is installed: brew install fzf");
    return null;
  }
}

/**
 * Constructs the Grafana dashboard URL
 */
function buildDashboardURL(baseURL: string, dashboard: Dashboard): string {
  // Use UID if available (preferred), otherwise use title slug
  let dashboardPath: string;
  
  if (dashboard.uid) {
    dashboardPath = dashboard.uid;
  } else {
    // Convert title to URL-friendly slug
    dashboardPath = dashboard.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  return `${baseURL}/d/${dashboardPath}/${dashboardPath}`;
}

/**
 * Opens URL in the default browser (cross-platform)
 */
async function openBrowser(url: string): Promise<void> {
  try {
    if (Deno.build.os === "darwin") {
      await $`open ${url}`;
    } else if (Deno.build.os === "linux") {
      await $`xdg-open ${url}`;
    } else if (Deno.build.os === "windows") {
      await $`start ${url}`;
    } else {
      console.log(`Please open this URL manually: ${url}`);
      return;
    }
    console.log(`Opened: ${url}`);
  } catch (error) {
    console.error(`Failed to open browser: ${error.message}`);
    console.log(`Please open this URL manually: ${url}`);
  }
}

/**
 * Main CLI function
 */
async function main(): Promise<void> {
  console.log("🔍 Discovering Grafana dashboards...");
  
  // Discover dashboards and find Grafana URL in parallel
  const [dashboards, grafanaURL] = await Promise.all([
    discoverDashboards(),
    findGrafanaURL()
  ]);
  
  console.log(`Found ${dashboards.length} dashboards`);
  console.log(`Grafana URL: ${grafanaURL}`);
  
  if (dashboards.length === 0) {
    console.log("No dashboards found in the monitoring stack");
    Deno.exit(1);
  }
  
  // Sort dashboards alphabetically by title
  dashboards.sort((a, b) => a.title.localeCompare(b.title));
  
  console.log("\n📊 Available dashboards:");
  dashboards.forEach((d, index) => {
    console.log(`  ${index + 1}. ${d.title} (${d.file})`);
  });
  
  // Interactive dashboard selection
  const selectedDashboard = await selectDashboard(dashboards);
  
  if (!selectedDashboard) {
    Deno.exit(0);
  }
  
  // Build and open dashboard URL
  const dashboardURL = buildDashboardURL(grafanaURL, selectedDashboard);
  console.log(`\n📊 Opening dashboard: ${selectedDashboard.title}`);
  
  await openBrowser(dashboardURL);
}

// Run the CLI
if (import.meta.main) {
  await main();
}