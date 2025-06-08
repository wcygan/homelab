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
  certManagerManaged?: boolean;
  issuer?: string;
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

interface DNSCheckResult {
  hostname: string;
  internal: {
    resolved: boolean;
    ip?: string;
    error?: string;
  };
  external: {
    resolved: boolean;
    ip?: string;
    error?: string;
  };
  splitBrain: boolean; // True if internal and external resolve differently
}

interface EndpointHealth {
  url: string;
  hostname: string;
  path: string;
  backend: {
    service: string;
    port: number;
  };
  status: "healthy" | "unhealthy" | "timeout" | "error";
  statusCode?: number;
  responseTime?: number; // in milliseconds
  error?: string;
}

interface NetworkHealthSummary {
  ingressControllers: IngressControllerHealth[];
  certificates: CertificateInfo[];
  ingressCount: {
    internal: number;
    external: number;
    total: number;
  };
  dnsChecks: DNSCheckResult[];
  endpointHealth: EndpointHealth[];
  // TODO: Future additions
  // cloudflareTunnelStatus?: CloudflareTunnelStatus;
}

class NetworkMonitor {
  constructor(
    private verbose = false,
    private certWarningDays = 30,
    private certCriticalDays = 7,
    private checkDns = false,
    private checkEndpoints = false,
    private responseTimeThreshold = 1000,
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

    // Check DNS resolution if enabled
    let dnsChecks: DNSCheckResult[] = [];
    if (this.checkDns) {
      dnsChecks = await this.checkDNSResolution(ingresses);
    }

    // Check endpoint connectivity if enabled
    let endpointHealth: EndpointHealth[] = [];
    if (this.checkEndpoints) {
      endpointHealth = await this.testEndpointConnectivity(ingresses);
    }

    return {
      ingressControllers: controllers,
      certificates,
      ingressCount,
      dnsChecks,
      endpointHealth,
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

    // Check certificates from ingresses
    for (const ingress of ingresses) {
      if (!ingress.spec.tls) continue;

      for (const tls of ingress.spec.tls) {
        // Skip if no secretName (e.g., Tailscale ingresses)
        if (!tls.secretName) continue;
        
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

    // Also check cert-manager Certificate resources
    try {
      const certManagerCerts = await $`kubectl get certificate -A -o json`.json();
      for (const cert of certManagerCerts.items || []) {
        const secretKey = `${cert.metadata.namespace}/${cert.spec.secretName}`;
        if (processedSecrets.has(secretKey)) {
          // Update existing cert info with cert-manager details
          const existingCert = certificates.find(c => 
            c.namespace === cert.metadata.namespace && c.secretName === cert.spec.secretName
          );
          if (existingCert) {
            existingCert.certManagerManaged = true;
            existingCert.issuer = cert.spec.issuerRef?.name;
          }
        } else {
          processedSecrets.add(secretKey);
          const certInfo = await this.checkCertificate(
            cert.metadata.namespace,
            cert.spec.secretName,
            cert.spec.dnsNames || [],
          );
          certInfo.certManagerManaged = true;
          certInfo.issuer = cert.spec.issuerRef?.name;
          certificates.push(certInfo);
        }
      }
    } catch (error) {
      if (this.verbose) {
        console.error(colors.yellow("cert-manager not installed or no Certificate resources found"));
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
      // Get the TLS secret
      const secret = await $`kubectl get secret ${secretName} -n ${namespace} -o json`.json();
      
      if (!secret.data || !secret.data["tls.crt"]) {
        return {
          namespace,
          secretName,
          hosts,
          status: "unknown",
        };
      }

      // Decode the base64 certificate
      const certBase64 = secret.data["tls.crt"];
      const certPem = atob(certBase64);
      
      // Save cert to temp file for openssl processing
      const tempFile = await Deno.makeTempFile({ suffix: ".crt" });
      await Deno.writeTextFile(tempFile, certPem);
      
      try {
        // Extract certificate details using openssl
        const certDetails = await $`openssl x509 -in ${tempFile} -noout -dates`.text();
        
        // Parse the notAfter date
        const notAfterMatch = certDetails.match(/notAfter=(.*)/);
        if (!notAfterMatch) {
          throw new Error("Could not parse certificate expiry date");
        }
        
        const expiryDate = new Date(notAfterMatch[1]);
        const now = new Date();
        const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          namespace,
          secretName,
          hosts,
          expiryDate,
          daysUntilExpiry,
          status: this.getCertStatus(daysUntilExpiry),
        };
      } finally {
        // Clean up temp file
        await Deno.remove(tempFile);
      }
    } catch (error) {
      if (this.verbose) {
        console.error(colors.yellow(`Failed to check certificate ${namespace}/${secretName}: ${error.message}`));
      }
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
        .header(["Namespace", "Secret", "Hosts", "Days Until Expiry", "Status", "Managed By"])
        .body(
          summary.certificates.map(cert => [
            cert.namespace,
            cert.secretName,
            cert.hosts.join(", "),
            cert.daysUntilExpiry?.toString() ?? "Unknown",
            this.formatCertStatus(cert.status),
            cert.certManagerManaged ? `cert-manager (${cert.issuer || "unknown"})` : "manual",
          ])
        )
        .padding(1)
        .border(true);
      
      console.log(table.toString());
    }

    // Display DNS Resolution Results
    if (summary.dnsChecks.length > 0) {
      console.log(colors.bold("\nDNS Resolution Status:"));
      const dnsTable = new Table()
        .header(["Hostname", "Internal DNS", "External DNS", "Split Brain"])
        .body(
          summary.dnsChecks.map(check => [
            check.hostname,
            this.formatDNSResult(check.internal),
            this.formatDNSResult(check.external),
            check.splitBrain ? colors.yellow("⚠️  Yes") : colors.green("✅ No"),
          ])
        )
        .padding(1)
        .border(true);
      
      console.log(dnsTable.toString());
    }

    // Display Endpoint Health
    if (summary.endpointHealth.length > 0) {
      console.log(colors.bold("\nEndpoint Connectivity:"));
      const endpointTable = new Table()
        .header(["URL", "Backend", "Status", "Response Time", "HTTP Code"])
        .body(
          summary.endpointHealth.map(endpoint => [
            endpoint.url,
            `${endpoint.backend.service}:${endpoint.backend.port}`,
            this.formatEndpointStatus(endpoint.status),
            this.formatResponseTime(endpoint.responseTime, endpoint.status),
            endpoint.statusCode?.toString() || "—",
          ])
        )
        .padding(1)
        .border(true);
      
      console.log(endpointTable.toString());
    }

    // TODO: Future displays
    // - Cloudflare tunnel status
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

  private formatDNSResult(result: { resolved: boolean; ip?: string; error?: string }): string {
    if (result.resolved && result.ip) {
      return colors.green(`✅ ${result.ip}`);
    } else if (result.ip === "N/A") {
      return colors.gray("— N/A");
    } else if (result.error === "timeout") {
      return colors.yellow("⏱️  Timeout");
    } else if (result.error) {
      return colors.red(`❌ Error`);
    } else {
      return colors.red("❌ Not resolved");
    }
  }

  private formatEndpointStatus(status: EndpointHealth["status"]): string {
    switch (status) {
      case "healthy":
        return colors.green("✅ Healthy");
      case "unhealthy":
        return colors.red("❌ Unhealthy");
      case "timeout":
        return colors.yellow("⏱️  Timeout");
      case "error":
        return colors.red("❌ Error");
    }
  }

  private formatResponseTime(responseTime?: number, status?: string): string {
    if (!responseTime || status === "timeout" || status === "error") {
      return "—";
    }
    
    const ms = responseTime;
    if (ms < this.responseTimeThreshold) {
      return colors.green(`${ms}ms`);
    } else if (ms < this.responseTimeThreshold * 2) {
      return colors.yellow(`${ms}ms`);
    } else {
      return colors.red(`${ms}ms`);
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

    // Check DNS issues
    if (summary.dnsChecks.length > 0) {
      const dnsIssues = summary.dnsChecks.filter(d => 
        (!d.external.resolved && d.external.ip !== "N/A") || 
        d.splitBrain
      );
      if (dnsIssues.length > 0) {
        console.log(colors.bold.yellow(`\n⚠️  ${dnsIssues.length} DNS issue(s) detected!`));
        for (const dns of dnsIssues) {
          if (!dns.external.resolved) {
            console.log(colors.yellow(`   - ${dns.hostname}: Not resolving externally`));
          }
          if (dns.splitBrain) {
            console.log(colors.yellow(`   - ${dns.hostname}: Split-brain DNS detected`));
          }
        }
      }
    }

    // Check endpoint connectivity issues
    if (summary.endpointHealth.length > 0) {
      const endpointIssues = summary.endpointHealth.filter(e => 
        e.status !== "healthy"
      );
      if (endpointIssues.length > 0) {
        console.log(colors.bold.red(`\n⚠️  ${endpointIssues.length} endpoint(s) unhealthy!`));
        for (const endpoint of endpointIssues) {
          console.log(colors.red(`   - ${endpoint.url}: ${endpoint.status}`));
        }
        hasIssues = true;
      }

      const slowEndpoints = summary.endpointHealth.filter(e => 
        e.status === "healthy" && e.responseTime && e.responseTime > this.responseTimeThreshold
      );
      if (slowEndpoints.length > 0) {
        console.log(colors.bold.yellow(`\n⚠️  ${slowEndpoints.length} endpoint(s) responding slowly!`));
        for (const endpoint of slowEndpoints) {
          console.log(colors.yellow(`   - ${endpoint.url}: ${endpoint.responseTime}ms`));
        }
      }
    }

    return hasIssues;
  }

  private async checkDNSResolution(ingresses: IngressInfo[]): Promise<DNSCheckResult[]> {
    const dnsChecks: DNSCheckResult[] = [];
    const processedHosts = new Set<string>();

    // Get k8s-gateway service IP
    let k8sGatewayIP: string | undefined;
    try {
      const gatewayService = await $`kubectl get svc -n network k8s-gateway -o json`.json();
      k8sGatewayIP = gatewayService.status.loadBalancer?.ingress?.[0]?.ip || gatewayService.spec.clusterIP;
      if (this.verbose) {
        console.log(colors.gray(`Using k8s-gateway at ${k8sGatewayIP}`));
      }
    } catch (error) {
      console.error(colors.yellow("k8s-gateway service not found, skipping DNS checks"));
      return dnsChecks;
    }

    // Extract unique hostnames from ingresses
    for (const ingress of ingresses) {
      if (!ingress.spec.rules) continue;
      
      for (const rule of ingress.spec.rules) {
        if (rule.host && !processedHosts.has(rule.host)) {
          processedHosts.add(rule.host);
          
          const result = await this.checkHostDNS(rule.host, k8sGatewayIP);
          dnsChecks.push(result);
        }
      }
    }

    return dnsChecks;
  }

  private async checkHostDNS(hostname: string, k8sGatewayIP?: string): Promise<DNSCheckResult> {
    const result: DNSCheckResult = {
      hostname,
      internal: { resolved: false },
      external: { resolved: false },
      splitBrain: false,
    };

    // Check internal resolution via k8s-gateway
    if (k8sGatewayIP) {
      try {
        // For internal resolution, check if it's an internal-only domain
        const isInternalDomain = hostname.includes('.local') || hostname.includes('.cluster.local') || 
                                hostname.includes('tailscale') || !hostname.includes('.');
        
        if (isInternalDomain) {
          // Try to resolve using k8s-gateway with a timeout
          const internalDns = await $`timeout 2 dig +short @${k8sGatewayIP} ${hostname}`.text();
          const ips = internalDns.trim().split('\n').filter(ip => ip && !ip.startsWith(';'));
          if (ips.length > 0) {
            result.internal.resolved = true;
            result.internal.ip = ips[0];
          }
        } else {
          // For external domains, mark as N/A for internal resolution
          result.internal.resolved = false;
          result.internal.ip = "N/A";
        }
      } catch (error) {
        if (error.message.includes("timeout")) {
          result.internal.error = "timeout";
        } else {
          result.internal.error = error.message;
        }
      }
    }

    // Check external resolution
    try {
      const externalDns = await $`dig +short ${hostname} @8.8.8.8`.text();
      const ips = externalDns.trim().split('\n').filter(ip => ip && !ip.startsWith(';'));
      if (ips.length > 0) {
        result.external.resolved = true;
        result.external.ip = ips[0];
      }
    } catch (error) {
      result.external.error = error.message;
    }

    // Check for split-brain DNS
    if (result.internal.resolved && result.external.resolved) {
      result.splitBrain = result.internal.ip !== result.external.ip;
    }

    return result;
  }

  private async testEndpointConnectivity(ingresses: IngressInfo[]): Promise<EndpointHealth[]> {
    const endpoints: EndpointHealth[] = [];
    
    for (const ingress of ingresses) {
      if (!ingress.spec.rules) continue;
      
      // Only test external ingresses to avoid internal network issues
      const isExternal = ingress.spec.ingressClassName === "external";
      if (!isExternal && !this.verbose) continue;
      
      for (const rule of ingress.spec.rules) {
        if (!rule.host || !rule.http?.paths) continue;
        
        for (const path of rule.http.paths) {
          const protocol = ingress.spec.tls?.some(tls => 
            tls.hosts?.includes(rule.host)
          ) ? "https" : "http";
          
          const url = `${protocol}://${rule.host}${path.path}`;
          const endpoint = await this.checkEndpoint(url, rule.host, path);
          endpoints.push(endpoint);
        }
      }
    }
    
    return endpoints;
  }

  private async checkEndpoint(
    url: string, 
    hostname: string,
    path: IngressInfo["spec"]["rules"][0]["http"]["paths"][0]
  ): Promise<EndpointHealth> {
    const startTime = Date.now();
    const endpoint: EndpointHealth = {
      url,
      hostname,
      path: path.path,
      backend: {
        service: path.backend.service.name,
        port: path.backend.service.port.number,
      },
      status: "error",
    };

    try {
      // Use curl for connectivity testing with timeout
      const response = await $`curl -s -o /dev/null -w "%{http_code}|%{time_total}" \
        --connect-timeout 5 \
        --max-time 10 \
        -k \
        ${url}`.text();
      
      const [statusCode, responseTime] = response.trim().split('|');
      endpoint.statusCode = parseInt(statusCode);
      endpoint.responseTime = Math.round(parseFloat(responseTime) * 1000); // Convert to ms
      
      if (endpoint.statusCode >= 200 && endpoint.statusCode < 400) {
        endpoint.status = "healthy";
      } else if (endpoint.statusCode === 0) {
        endpoint.status = "timeout";
      } else {
        endpoint.status = "unhealthy";
      }
    } catch (error) {
      endpoint.error = error.message;
      endpoint.responseTime = Date.now() - startTime;
      
      if (error.message.includes("timeout")) {
        endpoint.status = "timeout";
      }
    }

    return endpoint;
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
  .option("--check-dns", "Include DNS resolution checks")
  .option("--check-endpoints", "Test endpoint connectivity")
  .option("--response-time-threshold <ms:number>", "Response time warning threshold", { default: 1000 })
  // TODO: Future options
  // .option("--check-cloudflare", "Check Cloudflare tunnel status")
  // .option("--watch", "Run continuously and watch for changes")
  // .option("--interval <seconds:number>", "Check interval in seconds", { default: 300 })
  // .option("--export <format:string>", "Export metrics (json|prometheus)")
  .action(async (options) => {
    const monitor = new NetworkMonitor(
      options.verbose,
      options.certWarning,
      options.certCritical,
      options.checkDns,
      options.checkEndpoints,
      options.responseTimeThreshold,
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