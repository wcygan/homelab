import type { MonitoringResult } from "../../shared/types.ts";

interface StorageIssue {
  pvc: string;
  namespace: string;
  usagePercent: number;
  message: string;
  severity: "warning" | "critical";
}

/**
 * Quick storage health check - focuses on critical PVC usage issues
 * for fast execution in the default monitor command
 */
export async function storageQuickCheck(): Promise<MonitoringResult> {
  const startTime = Date.now();
  const issues: StorageIssue[] = [];
  
  try {
    // Quick check 1: PVC usage > 75% (configurable thresholds)
    await checkCriticalPVCUsage(issues);
    
    // Quick check 2: Basic storage provisioner health
    await checkProvisionerHealth(issues);
    
    const duration = Date.now() - startTime;
    return createResult(issues, duration);
    
  } catch (error) {
    return {
      status: "error",
      timestamp: new Date().toISOString(),
      summary: {
        total: 0,
        healthy: 0,
        warnings: 0,
        critical: 0,
      },
      details: [`Error: ${error instanceof Error ? error.message : String(error)}`],
      issues: [`Storage check failed: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Check for high PVC usage in critical namespaces
 */
async function checkCriticalPVCUsage(issues: StorageIssue[]): Promise<void> {
  try {
    // Get PVCs from critical namespaces
    const criticalNamespaces = ["kube-system", "flux-system", "monitoring", "default"];
    
    for (const namespace of criticalNamespaces) {
      try {
        const command = new Deno.Command("kubectl", {
          args: ["get", "pvc", "-n", namespace, "-o", "json", "--request-timeout=3s"],
          stdout: "piped",
          stderr: "piped",
        });
        
        const result = await command.output();
        
        if (!result.success) {
          // Namespace might not exist, skip
          continue;
        }
        
        const stdout = new TextDecoder().decode(result.stdout);
        const data = JSON.parse(stdout);
        
        for (const pvc of data.items || []) {
          if (pvc.status?.phase !== "Bound") {
            continue; // Skip unbound PVCs
          }
          
          // Try to get actual usage for this PVC
          const usage = await getQuickPVCUsage(pvc.metadata.name, namespace);
          if (usage) {
            if (usage.percent >= 90) {
              issues.push({
                pvc: pvc.metadata.name,
                namespace,
                usagePercent: usage.percent,
                message: `PVC ${pvc.metadata.name} is ${usage.percent}% full`,
                severity: "critical"
              });
            } else if (usage.percent >= 75) {
              issues.push({
                pvc: pvc.metadata.name,
                namespace,
                usagePercent: usage.percent,
                message: `PVC ${pvc.metadata.name} is ${usage.percent}% full`,
                severity: "warning"
              });
            }
          }
        }
      } catch {
        // Skip errors for individual namespaces
        continue;
      }
    }
  } catch (error) {
    // Don't fail the entire check for PVC issues
  }
}

/**
 * Get quick PVC usage by finding a pod and checking disk usage
 */
async function getQuickPVCUsage(pvcName: string, namespace: string): Promise<{percent: number} | null> {
  try {
    // Find pods in the namespace
    const command = new Deno.Command("kubectl", {
      args: ["get", "pods", "-n", namespace, "-o", "json", "--request-timeout=2s"],
      stdout: "piped",
      stderr: "piped",
    });
    
    const result = await command.output();
    
    if (!result.success) {
      return null;
    }
    
    const stdout = new TextDecoder().decode(result.stdout);
    const data = JSON.parse(stdout);
    
    // Look for a running pod that uses this PVC
    for (const pod of data.items || []) {
      if (pod.status?.phase !== "Running") {
        continue;
      }
      
      const volumes = pod.spec?.volumes || [];
      const volumeMount = volumes.find((v: any) => 
        v.persistentVolumeClaim?.claimName === pvcName
      );
      
      if (!volumeMount) {
        continue;
      }
      
      // Find mount path from container volumeMounts
      const containers = pod.spec?.containers || [];
      let mountPath = null;
      
      for (const container of containers) {
        const mounts = container.volumeMounts || [];
        const mount = mounts.find((m: any) => m.name === volumeMount.name);
        if (mount) {
          mountPath = mount.mountPath;
          break;
        }
      }
      
      if (!mountPath) {
        continue;
      }
      
      // Get usage via df command
      try {
        const containerName = containers[0]?.name;
        if (!containerName) continue;
        
        const dfCommand = new Deno.Command("kubectl", {
          args: ["exec", "-n", namespace, pod.metadata.name, "-c", containerName, "--", "df", "-h", mountPath],
          stdout: "piped",
          stderr: "piped",
        });
        
        const dfResult = await dfCommand.output();
        
        if (dfResult.success) {
          const dfOutput = new TextDecoder().decode(dfResult.stdout);
          const lines = dfOutput.trim().split('\n');
          
          if (lines.length > 1) {
            const parts = lines[1].split(/\s+/);
            if (parts.length >= 5) {
              const usePercent = parts[4].replace('%', '');
              const percent = parseInt(usePercent, 10);
              if (!isNaN(percent)) {
                return { percent };
              }
            }
          }
        }
      } catch {
        // Continue to next pod
        continue;
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Check basic storage provisioner health
 */
async function checkProvisionerHealth(issues: StorageIssue[]): Promise<void> {
  try {
    // Check for local-path-provisioner pod in storage namespace
    const command = new Deno.Command("kubectl", {
      args: ["get", "pods", "-n", "storage", "-l", "app=local-path-provisioner", "-o", "json", "--request-timeout=3s"],
      stdout: "piped",
      stderr: "piped",
    });
    
    const result = await command.output();
    
    if (!result.success) {
      // Try kube-system namespace
      const command2 = new Deno.Command("kubectl", {
        args: ["get", "pods", "-n", "kube-system", "-l", "app=local-path-provisioner", "-o", "json", "--request-timeout=3s"],
        stdout: "piped",
        stderr: "piped",
      });
      
      const result2 = await command2.output();
      
      if (!result2.success) {
        issues.push({
          pvc: "provisioner",
          namespace: "storage",
          usagePercent: 0,
          message: "Storage provisioner pods not found",
          severity: "warning"
        });
        return;
      }
      
      const stdout2 = new TextDecoder().decode(result2.stdout);
      const data2 = JSON.parse(stdout2);
      
      checkProvisionerPods(data2.items, issues);
    } else {
      const stdout = new TextDecoder().decode(result.stdout);
      const data = JSON.parse(stdout);
      
      checkProvisionerPods(data.items, issues);
    }
  } catch {
    // Don't fail for provisioner check
  }
}

/**
 * Check provisioner pod health
 */
function checkProvisionerPods(pods: any[], issues: StorageIssue[]): void {
  if (!pods || pods.length === 0) {
    issues.push({
      pvc: "provisioner",
      namespace: "storage",
      usagePercent: 0,
      message: "No storage provisioner pods found",
      severity: "warning"
    });
    return;
  }
  
  for (const pod of pods) {
    const phase = pod.status?.phase;
    const conditions = pod.status?.conditions || [];
    const readyCondition = conditions.find((c: any) => c.type === "Ready");
    
    if (phase !== "Running") {
      issues.push({
        pvc: "provisioner",
        namespace: pod.metadata?.namespace || "unknown",
        usagePercent: 0,
        message: `Storage provisioner pod ${pod.metadata?.name || "unknown"} is ${phase}`,
        severity: "critical"
      });
    } else if (readyCondition?.status !== "True") {
      issues.push({
        pvc: "provisioner",
        namespace: pod.metadata?.namespace || "unknown",
        usagePercent: 0,
        message: `Storage provisioner pod ${pod.metadata?.name || "unknown"} is not ready`,
        severity: "warning"
      });
    }
  }
}

/**
 * Create monitoring result from issues
 */
function createResult(issues: StorageIssue[], duration: number): MonitoringResult {
  const critical = issues.filter(i => i.severity === "critical").length;
  const warnings = issues.filter(i => i.severity === "warning").length;
  
  const status: MonitoringResult["status"] = 
    critical > 0 ? "critical" :
    warnings > 0 ? "warning" :
    "healthy";
  
  return {
    status,
    timestamp: new Date().toISOString(),
    summary: {
      total: critical + warnings,
      healthy: critical + warnings === 0 ? 1 : 0,
      warnings,
      critical,
    },
    details: [
      `Quick checks: pvc-usage, provisioner-health`,
      `Duration: ${duration}ms`,
      ...issues.map(i => `${i.severity}: ${i.namespace}/${i.pvc} - ${i.message}`)
    ],
    issues: issues.map(i => `${i.namespace}/${i.pvc}: ${i.message}`),
  };
}