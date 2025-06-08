import type { MonitoringResult } from "../../shared/types.ts";

interface K8sIssue {
  type: string;
  message: string;
  severity: "warning" | "critical";
}

/**
 * Quick Kubernetes health check - focuses on critical cluster issues
 * for fast execution in the default monitor command
 */
export async function k8sQuickCheck(): Promise<MonitoringResult> {
  const startTime = Date.now();
  const issues: K8sIssue[] = [];
  
  try {
    // Quick check 1: Cluster accessibility
    const clusterAccess = await checkClusterAccess();
    if (!clusterAccess.success) {
      issues.push({
        type: "cluster-access",
        message: clusterAccess.error || "Cannot access cluster",
        severity: "critical"
      });
      // If we can't access cluster, no point in other checks
      return createResult(issues, Date.now() - startTime);
    }
    
    // Quick check 2: Node readiness
    await checkCriticalNodes(issues);
    
    // Quick check 3: Critical system pods
    await checkCriticalPods(issues);
    
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
      issues: [`K8s check failed: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Check basic cluster access
 */
async function checkClusterAccess(): Promise<{ success: boolean; error?: string }> {
  try {
    const command = new Deno.Command("kubectl", {
      args: ["cluster-info", "--request-timeout=5s"],
      stdout: "piped",
      stderr: "piped",
    });
    
    const result = await command.output();
    
    if (!result.success) {
      const stderr = new TextDecoder().decode(result.stderr);
      return { success: false, error: `Cluster access failed: ${stderr}` };
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: `kubectl command failed: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

/**
 * Check critical nodes are Ready
 */
async function checkCriticalNodes(issues: K8sIssue[]): Promise<void> {
  try {
    const command = new Deno.Command("kubectl", {
      args: ["get", "nodes", "-o", "json", "--request-timeout=5s"],
      stdout: "piped",
      stderr: "piped",
    });
    
    const result = await command.output();
    
    if (!result.success) {
      issues.push({
        type: "node-access",
        message: "Failed to get node status",
        severity: "critical"
      });
      return;
    }
    
    const stdout = new TextDecoder().decode(result.stdout);
    const data = JSON.parse(stdout);
    
    for (const node of data.items || []) {
      const conditions = node.status?.conditions || [];
      const readyCondition = conditions.find((c: any) => c.type === "Ready");
      
      if (!readyCondition || readyCondition.status !== "True") {
        issues.push({
          type: "node-not-ready",
          message: `Node ${node.metadata?.name || "unknown"} is not Ready`,
          severity: "critical"
        });
      }
    }
  } catch (error) {
    issues.push({
      type: "node-check-error",
      message: `Failed to check nodes: ${error instanceof Error ? error.message : String(error)}`,
      severity: "warning"
    });
  }
}

/**
 * Check critical system pods are running
 */
async function checkCriticalPods(issues: K8sIssue[]): Promise<void> {
  const criticalNamespaces = ["kube-system", "flux-system"];
  
  for (const namespace of criticalNamespaces) {
    try {
      const command = new Deno.Command("kubectl", {
        args: ["get", "pods", "-n", namespace, "-o", "json", "--request-timeout=5s"],
        stdout: "piped",
        stderr: "piped",
      });
      
      const result = await command.output();
      
      if (!result.success) {
        issues.push({
          type: "pod-access",
          message: `Failed to get pods in ${namespace}`,
          severity: "warning"
        });
        continue;
      }
      
      const stdout = new TextDecoder().decode(result.stdout);
      const data = JSON.parse(stdout);
      
      for (const pod of data.items || []) {
        const phase = pod.status?.phase;
        const conditions = pod.status?.conditions || [];
        const readyCondition = conditions.find((c: any) => c.type === "Ready");
        
        // Only report critical issues for system pods
        if (phase === "Failed" || phase === "Unknown") {
          issues.push({
            type: "pod-failed",
            message: `Pod ${pod.metadata?.name || "unknown"} in ${namespace} is ${phase}`,
            severity: "critical"
          });
        } else if (phase === "Running" && readyCondition?.status === "False") {
          // Running but not ready - could be temporary, so warning
          issues.push({
            type: "pod-not-ready",
            message: `Pod ${pod.metadata?.name || "unknown"} in ${namespace} is not ready`,
            severity: "warning"
          });
        }
      }
    } catch (error) {
      issues.push({
        type: "pod-check-error",
        message: `Failed to check pods in ${namespace}: ${error instanceof Error ? error.message : String(error)}`,
        severity: "warning"
      });
    }
  }
}

/**
 * Create monitoring result from issues
 */
function createResult(issues: K8sIssue[], duration: number): MonitoringResult {
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
      `Quick checks: cluster-access, node-readiness, critical-pods`,
      `Duration: ${duration}ms`,
      ...issues.map(i => `${i.severity}: ${i.type} - ${i.message}`)
    ],
    issues: issues.map(i => `${i.type}: ${i.message}`),
  };
}