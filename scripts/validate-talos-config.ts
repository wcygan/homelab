#!/usr/bin/env -S deno run --allow-all

import { Command } from "jsr:@cliffy/command@1.0.0-rc.7";
import { colors } from "jsr:@cliffy/ansi@1.0.0-rc.7/colors";
import $ from "jsr:@david/dax@0.42.0";
import { parse as parseYaml } from "jsr:@std/yaml@1.0.5";
import { walk } from "jsr:@std/fs@1.0.8";
import { join } from "jsr:@std/path@1.0.8";

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  info: string[];
}

interface TalConfig {
  clusterName: string;
  talosVersion: string;
  kubernetesVersion: string;
  endpoint: string;
  nodes: Array<{
    hostname: string;
    ipAddress: string;
    installDiskSelector?: {
      serial?: string;
      size?: string;
      type?: string;
      model?: string;
    };
    networkInterfaces?: Array<{
      deviceSelector?: {
        hardwareAddr?: string;
        driver?: string;
        busPath?: string;
      };
      addresses?: string[];
      dhcp?: boolean;
    }>;
    controlPlane: boolean;
    patches?: string[];
  }>;
  patches?: string[];
  controlPlane?: {
    patches?: string[];
  };
}

class TalosConfigValidator {
  private talosDir: string;
  private results: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: [],
  };

  constructor(talosDir: string = "./talos") {
    this.talosDir = talosDir;
  }

  async validate(quiet: boolean = false): Promise<ValidationResult> {
    if (!quiet) {
      console.log(colors.blue("🔍 Validating Talos configuration...\n"));
    }

    // Check directory structure
    await this.validateDirectoryStructure(quiet);

    // Validate main config files
    await this.validateTalConfig(quiet);
    await this.validateTalEnv(quiet);

    // Validate patches
    await this.validatePatches(quiet);

    // Check generated configs
    await this.validateGeneratedConfigs(quiet);

    // Check against live cluster
    await this.validateAgainstCluster(quiet);

    return this.results;
  }

  private async validateDirectoryStructure(quiet: boolean) {
    if (!quiet) console.log(colors.gray("📁 Checking directory structure..."));

    const requiredFiles = [
      "talconfig.yaml",
      "talenv.yaml",
    ];

    const recommendedDirs = [
      "patches",
      "clusterconfig",
    ];

    for (const file of requiredFiles) {
      const path = join(this.talosDir, file);
      try {
        await Deno.stat(path);
        this.results.info.push(`✓ Found required file: ${file}`);
      } catch {
        this.results.errors.push(`✗ Missing required file: ${file}`);
        this.results.valid = false;
      }
    }

    for (const dir of recommendedDirs) {
      const path = join(this.talosDir, dir);
      try {
        const stat = await Deno.stat(path);
        if (stat.isDirectory) {
          this.results.info.push(`✓ Found directory: ${dir}`);
        }
      } catch {
        this.results.warnings.push(`⚠ Missing recommended directory: ${dir}`);
      }
    }
  }

  private async validateTalConfig(quiet: boolean) {
    if (!quiet) console.log(colors.gray("\n📋 Validating talconfig.yaml..."));

    const configPath = join(this.talosDir, "talconfig.yaml");
    try {
      const content = await Deno.readTextFile(configPath);
      const config = parseYaml(content) as TalConfig;

      // Validate cluster name
      if (!config.clusterName) {
        this.results.errors.push("Missing clusterName in talconfig.yaml");
        this.results.valid = false;
      } else {
        this.results.info.push(`✓ Cluster name: ${config.clusterName}`);
      }

      // Validate endpoint
      if (!config.endpoint) {
        this.results.errors.push("Missing endpoint in talconfig.yaml");
        this.results.valid = false;
      } else {
        try {
          new URL(config.endpoint);
          this.results.info.push(`✓ Valid endpoint: ${config.endpoint}`);
        } catch {
          this.results.errors.push(`Invalid endpoint URL: ${config.endpoint}`);
          this.results.valid = false;
        }
      }

      // Validate nodes
      if (!config.nodes || config.nodes.length === 0) {
        this.results.errors.push("No nodes defined in talconfig.yaml");
        this.results.valid = false;
      } else {
        await this.validateNodes(config.nodes, quiet);
      }

      // Validate patches
      if (config.patches) {
        for (const patch of config.patches) {
          await this.validatePatchReference(patch);
        }
      }

    } catch (error) {
      this.results.errors.push(`Failed to parse talconfig.yaml: ${error}`);
      this.results.valid = false;
    }
  }

  private async validateNodes(nodes: TalConfig["nodes"], quiet: boolean) {
    if (!quiet) console.log(colors.gray("\n🖥️  Validating node configurations..."));

    const seenIPs = new Set<string>();
    const seenHostnames = new Set<string>();
    const seenMACs = new Set<string>();
    const seenSerials = new Set<string>();

    for (const node of nodes) {
      // Check for duplicate IPs
      if (seenIPs.has(node.ipAddress)) {
        this.results.errors.push(`Duplicate IP address: ${node.ipAddress}`);
        this.results.valid = false;
      }
      seenIPs.add(node.ipAddress);

      // Check for duplicate hostnames
      if (seenHostnames.has(node.hostname)) {
        this.results.errors.push(`Duplicate hostname: ${node.hostname}`);
        this.results.valid = false;
      }
      seenHostnames.add(node.hostname);

      // Validate IP format
      if (!this.isValidIP(node.ipAddress)) {
        this.results.errors.push(`Invalid IP address for ${node.hostname}: ${node.ipAddress}`);
        this.results.valid = false;
      }

      // Validate disk selector
      if (node.installDiskSelector?.serial) {
        if (seenSerials.has(node.installDiskSelector.serial)) {
          this.results.errors.push(`Duplicate disk serial: ${node.installDiskSelector.serial}`);
          this.results.valid = false;
        }
        seenSerials.add(node.installDiskSelector.serial);
      }

      // Validate network interfaces
      if (node.networkInterfaces) {
        for (const iface of node.networkInterfaces) {
          if (iface.deviceSelector?.hardwareAddr) {
            const mac = iface.deviceSelector.hardwareAddr;
            if (seenMACs.has(mac)) {
              this.results.errors.push(`Duplicate MAC address: ${mac}`);
              this.results.valid = false;
            }
            seenMACs.add(mac);

            if (!this.isValidMAC(mac)) {
              this.results.errors.push(`Invalid MAC address format: ${mac}`);
              this.results.valid = false;
            }
          }
        }
      }

      // Validate node patches
      if (node.patches) {
        for (const patch of node.patches) {
          await this.validatePatchReference(patch, node.hostname);
        }
      }
    }

    // Check control plane count
    const controlPlaneCount = nodes.filter(n => n.controlPlane).length;
    if (controlPlaneCount === 0) {
      this.results.errors.push("No control plane nodes defined");
      this.results.valid = false;
    } else if (controlPlaneCount % 2 === 0) {
      this.results.warnings.push(`Even number of control plane nodes (${controlPlaneCount}) - odd numbers are recommended for etcd quorum`);
    } else {
      this.results.info.push(`✓ Control plane nodes: ${controlPlaneCount}`);
    }
  }

  private async validateTalEnv(quiet: boolean) {
    if (!quiet) console.log(colors.gray("\n🔧 Validating talenv.yaml..."));

    const envPath = join(this.talosDir, "talenv.yaml");
    try {
      const content = await Deno.readTextFile(envPath);
      const env = parseYaml(content) as { talosVersion: string; kubernetesVersion: string };

      // Validate Talos version format
      if (!env.talosVersion || !env.talosVersion.match(/^v\d+\.\d+\.\d+$/)) {
        this.results.errors.push(`Invalid Talos version format: ${env.talosVersion}`);
        this.results.valid = false;
      } else {
        this.results.info.push(`✓ Talos version: ${env.talosVersion}`);
      }

      // Validate Kubernetes version format
      if (!env.kubernetesVersion || !env.kubernetesVersion.match(/^v\d+\.\d+\.\d+$/)) {
        this.results.errors.push(`Invalid Kubernetes version format: ${env.kubernetesVersion}`);
        this.results.valid = false;
      } else {
        this.results.info.push(`✓ Kubernetes version: ${env.kubernetesVersion}`);
      }

      // Check version compatibility
      const talosMinor = parseInt(env.talosVersion.split(".")[1]);
      const k8sMinor = parseInt(env.kubernetesVersion.split(".")[1]);
      
      // Rough compatibility check - Talos usually supports k8s versions within a range
      if (Math.abs(talosMinor - k8sMinor) > 5) {
        this.results.warnings.push(`Large version gap between Talos and Kubernetes - verify compatibility`);
      }

    } catch (error) {
      this.results.errors.push(`Failed to parse talenv.yaml: ${error}`);
      this.results.valid = false;
    }
  }

  private async validatePatches(quiet: boolean) {
    if (!quiet) console.log(colors.gray("\n🩹 Validating patches..."));

    const patchesDir = join(this.talosDir, "patches");
    try {
      for await (const entry of walk(patchesDir, { includeDirs: false, exts: [".yaml", ".yml"] })) {
        if (entry.name === "README.md") continue;
        
        try {
          const content = await Deno.readTextFile(entry.path);
          const patch = parseYaml(content);
          
          if (!patch || typeof patch !== "object") {
            this.results.errors.push(`Invalid patch file: ${entry.path}`);
            this.results.valid = false;
          } else {
            const relativePath = entry.path.replace(this.talosDir + "/", "");
            this.results.info.push(`✓ Valid patch: ${relativePath}`);
          }
        } catch (error) {
          this.results.errors.push(`Failed to parse patch ${entry.path}: ${error}`);
          this.results.valid = false;
        }
      }
    } catch {
      this.results.warnings.push("No patches directory found");
    }
  }

  private async validatePatchReference(patchRef: string, nodeName?: string) {
    // Handle @./patches/... references
    if (patchRef.startsWith("@./")) {
      const patchPath = join(this.talosDir, patchRef.substring(3));
      try {
        await Deno.stat(patchPath);
      } catch {
        const context = nodeName ? ` (referenced by ${nodeName})` : "";
        this.results.errors.push(`Missing patch file: ${patchRef}${context}`);
        this.results.valid = false;
      }
    }
  }

  private async validateGeneratedConfigs(quiet: boolean) {
    if (!quiet) console.log(colors.gray("\n📄 Validating generated configurations..."));

    const configDir = join(this.talosDir, "clusterconfig");
    try {
      const entries = [];
      for await (const entry of Deno.readDir(configDir)) {
        if (entry.name.endsWith(".yaml")) {
          entries.push(entry.name);
        }
      }

      if (entries.length === 0) {
        this.results.warnings.push("No generated configurations found - run 'task talos:generate-config'");
      } else {
        this.results.info.push(`✓ Found ${entries.length} generated config files`);
        
        // Check if configs are up to date
        const talconfigStat = await Deno.stat(join(this.talosDir, "talconfig.yaml"));
        for (const file of entries) {
          const configStat = await Deno.stat(join(configDir, file));
          if (talconfigStat.mtime! > configStat.mtime!) {
            this.results.warnings.push(`Generated config ${file} is older than talconfig.yaml - consider regenerating`);
          }
        }
      }
    } catch {
      this.results.warnings.push("No clusterconfig directory found - run 'task talos:generate-config'");
    }
  }

  private async validateAgainstCluster(quiet: boolean) {
    if (!quiet) console.log(colors.gray("\n☁️  Validating against live cluster..."));

    try {
      // Check if we can connect to the cluster
      await $`kubectl cluster-info`.quiet();
      
      // Compare configured nodes with actual nodes
      const configPath = join(this.talosDir, "talconfig.yaml");
      const content = await Deno.readTextFile(configPath);
      const config = parseYaml(content) as TalConfig;
      
      const k8sNodes = await $`kubectl get nodes -o json`.json();
      const actualNodes = new Set(k8sNodes.items.map((n: any) => n.metadata.name));
      const configuredNodes = new Set(config.nodes.map(n => n.hostname));
      
      // Check for missing nodes
      for (const node of configuredNodes) {
        if (!actualNodes.has(node)) {
          this.results.warnings.push(`Node ${node} is configured but not in cluster`);
        }
      }
      
      // Check for extra nodes
      for (const node of actualNodes) {
        if (!configuredNodes.has(node)) {
          this.results.warnings.push(`Node ${node} is in cluster but not in configuration`);
        }
      }

      // Validate hardware against configuration
      for (const node of config.nodes) {
        if (actualNodes.has(node.hostname)) {
          await this.validateNodeHardware(node);
        }
      }

    } catch (error) {
      this.results.info.push("⚠ Unable to connect to cluster for live validation");
    }
  }

  private async validateNodeHardware(node: TalConfig["nodes"][0]) {
    try {
      // Check disk serial if specified
      if (node.installDiskSelector?.serial) {
        const disks = await $`talosctl get disks -n ${node.ipAddress} -o json`.json();
        const diskSerials = disks.items.map((d: any) => d.spec.serial);
        
        if (!diskSerials.includes(node.installDiskSelector.serial)) {
          this.results.warnings.push(
            `Configured disk serial ${node.installDiskSelector.serial} not found on ${node.hostname}`
          );
        }
      }

      // Check MAC addresses if specified
      if (node.networkInterfaces) {
        const links = await $`talosctl get links -n ${node.ipAddress} -o json`.json();
        const macs = links.items.map((l: any) => l.spec.hardwareAddr?.toLowerCase());
        
        for (const iface of node.networkInterfaces) {
          if (iface.deviceSelector?.hardwareAddr) {
            const configuredMAC = iface.deviceSelector.hardwareAddr.toLowerCase();
            if (!macs.includes(configuredMAC)) {
              this.results.warnings.push(
                `Configured MAC ${configuredMAC} not found on ${node.hostname}`
              );
            }
          }
        }
      }
    } catch {
      // Ignore errors for individual node checks
    }
  }

  private isValidIP(ip: string): boolean {
    const parts = ip.split(".");
    if (parts.length !== 4) return false;
    
    return parts.every(part => {
      const num = parseInt(part);
      return !isNaN(num) && num >= 0 && num <= 255;
    });
  }

  private isValidMAC(mac: string): boolean {
    return /^[0-9a-fA-F]{2}(:[0-9a-fA-F]{2}){5}$/.test(mac);
  }

  displayResults() {
    console.log("\n" + colors.bold("📊 Validation Results:"));
    console.log(colors.gray("─".repeat(50)));

    if (this.results.errors.length > 0) {
      console.log(colors.red("\n❌ Errors:"));
      this.results.errors.forEach(error => console.log(`  • ${error}`));
    }

    if (this.results.warnings.length > 0) {
      console.log(colors.yellow("\n⚠️  Warnings:"));
      this.results.warnings.forEach(warning => console.log(`  • ${warning}`));
    }

    if (this.results.info.length > 0) {
      console.log(colors.green("\n✅ Info:"));
      this.results.info.forEach(info => console.log(`  • ${info}`));
    }

    console.log(colors.gray("\n─".repeat(50)));
    if (this.results.valid) {
      console.log(colors.green("✅ Configuration is valid!"));
    } else {
      console.log(colors.red("❌ Configuration has errors that must be fixed."));
    }
  }
}

// CLI setup
if (import.meta.main) {
  const command = new Command()
    .name("validate-talos-config")
    .version("0.1.0")
    .description("Validate Talos Linux configuration files and check against live cluster")
    .option("-d, --dir <dir:string>", "Talos configuration directory", { default: "./talos" })
    .option("-j, --json", "Output results as JSON")
    .option("-q, --quiet", "Only show errors")
    .action(async (options) => {
      const validator = new TalosConfigValidator(options.dir);
      const results = await validator.validate(options.json || options.quiet);

      if (options.json) {
        console.log(JSON.stringify(results, null, 2));
      } else if (!options.quiet) {
        validator.displayResults();
      } else if (results.errors.length > 0) {
        results.errors.forEach(error => console.error(error));
      }

      // Exit with error code if validation failed
      if (!results.valid) {
        Deno.exit(1);
      }
    });

  await command.parse(Deno.args);
}