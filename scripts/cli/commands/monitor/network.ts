import type { MonitoringResult } from "../../shared/types.ts";

interface NetworkIssue {
  component: string;
  namespace: string;
  message: string;
  severity: "warning" | "critical";
}

/**
 * Quick network health check - focuses on critical networking components
 * for fast execution in the default monitor command
 */
export async function networkQuickCheck(): Promise<MonitoringResult> {
  const startTime = Date.now();
  const issues: NetworkIssue[] = [];
  
  try {
    // Quick check 1: Ingress controller health
    await checkIngressControllers(issues);
    
    // Quick check 2: CoreDNS health (critical for networking)
    await checkCoreDNS(issues);
    
    // Quick check 3: Basic connectivity (Cilium health)
    await checkCiliumHealth(issues);
    
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
      issues: [`Network check failed: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Check ingress controllers are running
 */
async function checkIngressControllers(issues: NetworkIssue[]): Promise<void> {
  const controllers = [
    { name: "internal-ingress-nginx-controller", namespace: "network" },
    { name: "external-ingress-nginx-controller", namespace: "network" }
  ];
  
  for (const controller of controllers) {
    try {
      const command = new Deno.Command("kubectl", {
        args: ["get", "deployment", "-n", controller.namespace, controller.name, "-o", "json", "--request-timeout=3s"],
        stdout: "piped",
        stderr: "piped",
      });
      
      const result = await command.output();
      
      if (!result.success) {
        // Controller might not exist (optional)
        continue;
      }
      
      const stdout = new TextDecoder().decode(result.stdout);
      const data = JSON.parse(stdout);
      
      const desired = data.spec?.replicas || 0;
      const ready = data.status?.readyReplicas || 0;
      
      if (ready === 0 && desired > 0) {
        issues.push({
          component: controller.name,
          namespace: controller.namespace,
          message: `Ingress controller ${controller.name} has no ready replicas`,
          severity: "critical"
        });
      } else if (ready < desired) {
        issues.push({
          component: controller.name,
          namespace: controller.namespace,
          message: `Ingress controller ${controller.name} has ${ready}/${desired} replicas ready`,
          severity: "warning"
        });
      }
    } catch {
      // Skip errors for individual controllers
      continue;
    }
  }
}

/**
 * Check CoreDNS health
 */
async function checkCoreDNS(issues: NetworkIssue[]): Promise<void> {
  try {
    const command = new Deno.Command("kubectl", {
      args: ["get", "deployment", "-n", "kube-system", "coredns", "-o", "json", "--request-timeout=3s"],
      stdout: "piped",
      stderr: "piped",
    });
    
    const result = await command.output();
    
    if (!result.success) {
      issues.push({
        component: "coredns",
        namespace: "kube-system",
        message: "CoreDNS deployment not found",
        severity: "critical"
      });
      return;
    }
    
    const stdout = new TextDecoder().decode(result.stdout);
    const data = JSON.parse(stdout);
    
    const desired = data.spec?.replicas || 0;
    const ready = data.status?.readyReplicas || 0;
    
    if (ready === 0 && desired > 0) {
      issues.push({
        component: "coredns",
        namespace: "kube-system",
        message: "CoreDNS has no ready replicas",
        severity: "critical"
      });
    } else if (ready < desired) {
      issues.push({
        component: "coredns",
        namespace: "kube-system",
        message: `CoreDNS has ${ready}/${desired} replicas ready`,
        severity: "warning"
      });
    }
  } catch {
    issues.push({
      component: "coredns",
      namespace: "kube-system",
      message: "Failed to check CoreDNS health",
      severity: "warning"
    });
  }
}

/**
 * Check Cilium health (CNI)
 */
async function checkCiliumHealth(issues: NetworkIssue[]): Promise<void> {
  try {
    // Check Cilium DaemonSet
    const command = new Deno.Command("kubectl", {
      args: ["get", "daemonset", "-n", "kube-system", "cilium", "-o", "json", "--request-timeout=3s"],
      stdout: "piped",
      stderr: "piped",
    });
    
    const result = await command.output();
    
    if (!result.success) {
      // Cilium might be named differently or not exist
      return;
    }
    
    const stdout = new TextDecoder().decode(result.stdout);
    const data = JSON.parse(stdout);
    
    const desired = data.status?.desiredNumberScheduled || 0;
    const ready = data.status?.numberReady || 0;
    
    if (ready === 0 && desired > 0) {
      issues.push({
        component: "cilium",
        namespace: "kube-system",
        message: "Cilium has no ready pods",
        severity: "critical"
      });
    } else if (ready < desired) {
      const percentReady = desired > 0 ? Math.round((ready / desired) * 100) : 0;
      
      if (percentReady < 50) {
        issues.push({
          component: "cilium",
          namespace: "kube-system",
          message: `Cilium has ${ready}/${desired} pods ready (${percentReady}%)`,
          severity: "critical"
        });
      } else if (percentReady < 80) {
        issues.push({
          component: "cilium",
          namespace: "kube-system",
          message: `Cilium has ${ready}/${desired} pods ready (${percentReady}%)`,
          severity: "warning"
        });
      }
    }
  } catch {
    // Don't fail for Cilium check
  }
}

/**
 * Create monitoring result from issues
 */
function createResult(issues: NetworkIssue[], duration: number): MonitoringResult {
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
      `Quick checks: ingress-controllers, coredns, cilium`,
      `Duration: ${duration}ms`,
      ...issues.map(i => `${i.severity}: ${i.namespace}/${i.component} - ${i.message}`)
    ],
    issues: issues.map(i => `${i.namespace}/${i.component}: ${i.message}`),
  };
}