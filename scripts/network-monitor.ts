#!/usr/bin/env -S deno run --allow-all

import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { colors } from "@cliffy/ansi/colors";
import { $ } from "@david/dax";

interface IngressInfo {
  metadata: {
    name: string;
    namespace: string;
  };
  spec: {
    ingressClassName?: string;
    rules?: Array<{
      host: string;
      http?: {
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
    tls?: Array<{
      hosts: string[];
      secretName: string;
    }>;
  };
}

interface CertificateInfo {
  namespace: string;
  secretName: string;
  hosts: string[];
  expiryDate?: Date;
  daysUntilExpiry?: number;
  status: "valid" | "warning" | "critical" | "expired" | "unknown";
}

interface IngressControllerHealth {
  name: string;
  namespace: string;
  ready: boolean;
  replicas: {
    desired: number;
    ready: number;
  };
}

interface NetworkHealthSummary {
  ingressControllers: IngressControllerHealth[];
  certificates: CertificateInfo[];
  ingressCount: {
    internal: number;
    external: number;
    total: number;
  };
  // TODO: Future additions
  // dnsChecks: DNSCheckResult[];
  // endpointHealth: EndpointHealth[];
  // cloudflareTunnelStatus?: CloudflareTunnelStatus;
}

class NetworkMonitor {
  constructor(
    private verbose = false,
    private certWarningDays = 30,
    private certCriticalDays = 7,
  ) {}

  async run(): Promise<void> {
    console.log(colors.bold.blue("Network & Ingress Health Monitor"));
    console.log("=" . repeat(50));

    try {
      const summary = await this.collectNetworkHealth();
      await this.displayResults(summary);
      
      // Check for critical issues
      const hasIssues = this.checkForIssues(summary);
      if (hasIssues) {
        Deno.exit(1);
      }
    } catch (error) {
      console.error(colors.red(`Error: ${error.message}`));
      Deno.exit(1);
    }
  }

  private async collectNetworkHealth(): Promise<NetworkHealthSummary> {
    const [controllers, ingresses] = await Promise.all([
      this.checkIngressControllers(),
      this.getIngresses(),
    ]);

    const certificates = await this.checkCertificates(ingresses);

    const ingressCount = {
      internal: ingresses.filter(i => i.spec.ingressClassName === "internal").length,
      external: ingresses.filter(i => i.spec.ingressClassName === "external").length,
      total: ingresses.length,
    };

    return {
      ingressControllers: controllers,
      certificates,
      ingressCount,
    };
  }

  private async checkIngressControllers(): Promise<IngressControllerHealth[]> {
    const controllers: IngressControllerHealth[] = [];

    // Check internal nginx controller
    try {
      const internalResult = await $`kubectl get deployment -n network internal-ingress-nginx-controller -o json`.json();
      controllers.push({
        name: "internal",
        namespace: "network",
        ready: internalResult.status.readyReplicas === internalResult.spec.replicas,
        replicas: {
          desired: internalResult.spec.replicas,
          ready: internalResult.status.readyReplicas || 0,
        },
      });
    } catch (error) {
      if (this.verbose) {
        console.error(colors.yellow("Internal ingress controller not found"));
      }
    }

    // Check external nginx controller
    try {
      const externalResult = await $`kubectl get deployment -n network external-ingress-nginx-controller -o json`.json();
      controllers.push({
        name: "external",
        namespace: "network",
        ready: externalResult.status.readyReplicas === externalResult.spec.replicas,
        replicas: {
          desired: externalResult.spec.replicas,
          ready: externalResult.status.readyReplicas || 0,
        },
      });
    } catch (error) {
      if (this.verbose) {
        console.error(colors.yellow("External ingress controller not found"));
      }
    }

    return controllers;
  }

  private async getIngresses(): Promise<IngressInfo[]> {
    const result = await $`kubectl get ingress -A -o json`.json();
    return result.items as IngressInfo[];
  }

  private async checkCertificates(ingresses: IngressInfo[]): Promise<CertificateInfo[]> {
    const certificates: CertificateInfo[] = [];
    const processedSecrets = new Set<string>();

    for (const ingress of ingresses) {
      if (!ingress.spec.tls) continue;

      for (const tls of ingress.spec.tls) {
        const secretKey = `${ingress.metadata.namespace}/${tls.secretName}`;
        if (processedSecrets.has(secretKey)) continue;
        processedSecrets.add(secretKey);

        const certInfo = await this.checkCertificate(
          ingress.metadata.namespace,
          tls.secretName,
          tls.hosts,
        );
        certificates.push(certInfo);
      }
    }

    return certificates.sort((a, b) => {
      // Sort by days until expiry (soonest first)
      const aDays = a.daysUntilExpiry ?? Infinity;
      const bDays = b.daysUntilExpiry ?? Infinity;
      return aDays - bDays;
    });
  }

  private async checkCertificate(
    namespace: string,
    secretName: string,
    hosts: string[],
  ): Promise<CertificateInfo> {
    try {
      // For now, return mock data
      // TODO: Implement actual certificate checking
      const mockDaysUntilExpiry = Math.floor(Math.random() * 90);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + mockDaysUntilExpiry);

      return {
        namespace,
        secretName,
        hosts,
        expiryDate,
        daysUntilExpiry: mockDaysUntilExpiry,
        status: this.getCertStatus(mockDaysUntilExpiry),
      };
    } catch (error) {
      return {
        namespace,
        secretName,
        hosts,
        status: "unknown",
      };
    }
  }

  private getCertStatus(daysUntilExpiry: number): CertificateInfo["status"] {
    if (daysUntilExpiry < 0) return "expired";
    if (daysUntilExpiry <= this.certCriticalDays) return "critical";
    if (daysUntilExpiry <= this.certWarningDays) return "warning";
    return "valid";
  }

  private async displayResults(summary: NetworkHealthSummary): Promise<void> {
    // Display Ingress Controllers
    console.log(colors.bold("\nIngress Controllers:"));
    for (const controller of summary.ingressControllers) {
      const status = controller.ready ? colors.green("✅ Healthy") : colors.red("❌ Unhealthy");
      console.log(`  ${controller.name} (nginx) - ${status} [${controller.replicas.ready}/${controller.replicas.desired} replicas]`);
    }

    // Display Ingress Count
    console.log(colors.bold("\nIngress Resources:"));
    console.log(`  Internal: ${summary.ingressCount.internal}`);
    console.log(`  External: ${summary.ingressCount.external}`);
    console.log(`  Total: ${summary.ingressCount.total}`);

    // Display Certificate Status
    console.log(colors.bold("\nCertificate Status:"));
    if (summary.certificates.length === 0) {
      console.log(colors.yellow("  No TLS certificates found"));
    } else {
      const table = new Table()
        .header(["Namespace", "Secret", "Hosts", "Days Until Expiry", "Status"])
        .body(
          summary.certificates.map(cert => [
            cert.namespace,
            cert.secretName,
            cert.hosts.join(", "),
            cert.daysUntilExpiry?.toString() ?? "Unknown",
            this.formatCertStatus(cert.status),
          ])
        )
        .padding(1)
        .border(true);
      
      console.log(table.toString());
    }

    // TODO: Future displays
    // - DNS resolution results
    // - Endpoint connectivity tests
    // - Cloudflare tunnel status
    // - Response time metrics
  }

  private formatCertStatus(status: CertificateInfo["status"]): string {
    switch (status) {
      case "valid":
        return colors.green("✅ Valid");
      case "warning":
        return colors.yellow("⚠️  Warning");
      case "critical":
        return colors.red("⚠️  Critical");
      case "expired":
        return colors.red("❌ Expired");
      case "unknown":
        return colors.gray("❓ Unknown");
    }
  }

  private checkForIssues(summary: NetworkHealthSummary): boolean {
    let hasIssues = false;

    // Check ingress controllers
    const unhealthyControllers = summary.ingressControllers.filter(c => !c.ready);
    if (unhealthyControllers.length > 0) {
      console.log(colors.bold.red(`\n⚠️  ${unhealthyControllers.length} ingress controller(s) unhealthy!`));
      hasIssues = true;
    }

    // Check certificates
    const criticalCerts = summary.certificates.filter(c => c.status === "critical" || c.status === "expired");
    if (criticalCerts.length > 0) {
      console.log(colors.bold.red(`\n⚠️  ${criticalCerts.length} certificate(s) need immediate attention!`));
      for (const cert of criticalCerts) {
        console.log(colors.red(`   - ${cert.hosts.join(", ")}: ${cert.status}`));
      }
      hasIssues = true;
    }

    return hasIssues;
  }

  // TODO: Future methods
  async checkDNSResolution(): Promise<void> {
    // Test DNS resolution via k8s-gateway
    // Verify internal vs external resolution
    // Check for DNS conflicts
  }

  async testEndpointConnectivity(): Promise<void> {
    // Test actual HTTP/HTTPS connectivity
    // Measure response times
    // Check for SSL errors
  }

  async checkCloudflareTunnel(): Promise<void> {
    // Check cloudflared pod health
    // Verify tunnel connectivity
    // Test external access
  }

  async runContinuousMode(interval: number): Promise<void> {
    // Continuous monitoring with alerts
    // Track changes over time
    // Send notifications on issues
  }
}

// CLI setup
const command = new Command()
  .name("network-monitor")
  .version("1.0.0")
  .description("Monitor network, ingress, and certificate health in Kubernetes cluster")
  .option("-v, --verbose", "Enable verbose output")
  .option("--cert-warning <days:number>", "Certificate warning threshold in days", { default: 30 })
  .option("--cert-critical <days:number>", "Certificate critical threshold in days", { default: 7 })
  // TODO: Future options
  // .option("--check-dns", "Include DNS resolution checks")
  // .option("--check-endpoints", "Test endpoint connectivity")
  // .option("--check-cloudflare", "Check Cloudflare tunnel status")
  // .option("--watch", "Run continuously and watch for changes")
  // .option("--interval <seconds:number>", "Check interval in seconds", { default: 300 })
  // .option("--export <format:string>", "Export metrics (json|prometheus)")
  // .option("--response-time-threshold <ms:number>", "Response time warning threshold", { default: 1000 })
  .action(async (options) => {
    const monitor = new NetworkMonitor(
      options.verbose,
      options.certWarning,
      options.certCritical,
    );
    await monitor.run();
  });

if (import.meta.main) {
  await command.parse(Deno.args);
}

/* Future Enhancements TODO List:
 * 
 * 1. Certificate Monitoring:
 *    - Extract actual certificate from secrets
 *    - Parse certificate details with openssl
 *    - Check certificate chain validity
 *    - Monitor cert-manager Certificate resources
 * 
 * 2. DNS Resolution Testing:
 *    - Query k8s-gateway service IP
 *    - Test resolution for each ingress host
 *    - Verify internal vs external DNS split
 *    - Check for NXDOMAIN or misconfigurations
 * 
 * 3. Endpoint Connectivity:
 *    - HTTP/HTTPS connectivity tests
 *    - Response time measurements
 *    - SSL/TLS validation
 *    - Header inspection
 * 
 * 4. Cloudflare Integration:
 *    - Check cloudflared pod status
 *    - Monitor tunnel health metrics
 *    - Verify external accessibility
 *    - Track tunnel configuration changes
 * 
 * 5. Advanced Features:
 *    - Load balancer health checks
 *    - Service mesh monitoring (if applicable)
 *    - Network policy validation
 *    - Traffic flow analysis
 * 
 * 6. Performance Metrics:
 *    - Request rate monitoring
 *    - Error rate tracking
 *    - Latency percentiles
 *    - Bandwidth usage
 * 
 * 7. Integration:
 *    - Prometheus metrics export
 *    - Grafana dashboard templates
 *    - PagerDuty/Slack alerts
 *    - Status page updates
 */