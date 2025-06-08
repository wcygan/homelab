#!/usr/bin/env -S deno run --allow-all

/**
 * Hardware Change Detector
 *
 * Detects hardware changes on Talos Linux nodes and generates cluster-template
 * configuration patches. Integrates with talconfig.yaml and follows GitOps workflow.
 *
 * Features:
 * - Hardware inventory collection and comparison
 * - Automatic patch generation for new storage
 * - Cluster-template configuration integration
 * - Talos Image Factory schematic detection
 * - Dry-run mode for safe testing
 *
 * Usage Examples:
 *
 * # Save current hardware state as baseline (accepts IP only)
 * deno task hw:detect -n 192.168.1.98 --save-baseline
 *
 * # Detect changes since last baseline (dry-run)
 * deno task hw:detect -n 192.168.1.98 --dry-run
 *
 * # Compare against specific snapshot
 * deno task hw:detect -n 192.168.1.98 -b ./snapshots/hardware/k8s-1/1703123456.json
 *
 * # List available snapshots for a node
 * deno task hw:detect -n 192.168.1.98 --list-snapshots
 *
 * # Detect changes and generate patches (requires confirmation)
 * deno task hw:detect -n 192.168.1.98
 *
 * # Full workflow example:
 * # 1. Save baseline before hardware changes
 * deno task hw:detect -n 192.168.1.98 --save-baseline
 * # 2. [Perform hardware upgrade]
 * # 3. Detect changes and generate patches
 * deno task hw:detect -n 192.168.1.98
 *
 * Node Reference:
 * - Use Talos IP addresses (192.168.1.98, 192.168.1.99, 192.168.1.100)
 * - Script maps to hostnames automatically via talconfig.yaml
 *
 * Generated Files:
 * - Hardware snapshots: ./snapshots/hardware/<hostname>/<unix-timestamp>.json
 * - Storage patches: ./talos/patches/<hostname>/storage-<model>.yaml
 *
 * Integration:
 * - Reads talconfig.yaml for current configuration
 * - Suggests updates to talconfig.yaml for patch references
 * - Follows cluster-template GitOps workflow
 */

import { Command } from "jsr:@cliffy/command@1.0.0-rc.7";
import { colors } from "jsr:@cliffy/ansi@1.0.0-rc.7/colors";
import { Confirm } from "jsr:@cliffy/prompt@1.0.0-rc.7";
import { Table } from "jsr:@cliffy/table@1.0.0-rc.7";
import $ from "jsr:@david/dax@0.42.0";
import {
  parse as parseYaml,
  stringify as stringifyYaml,
} from "jsr:@std/yaml@1.0.5";
import { ensureDir } from "jsr:@std/fs@1.0.8";
import { join } from "jsr:@std/path@1.0.8";

interface HardwareSnapshot {
  timestamp: string;
  node: {
    hostname: string;
    ip: string;
  };
  disks: Array<{
    id: string;
    serial: string;
    size: number;
    model: string;
    transport: string;
  }>;
  interfaces: Array<{
    id: string;
    hardwareAddr: string;
    driver: string;
    busPath: string;
  }>;
  systemInfo: {
    talosVersion: string;
    schematicId: string;
  };
}

interface TalconfigNode {
  hostname: string;
  ipAddress: string;
  talosImageURL?: string;
  installDiskSelector?: {
    serial?: string;
    size?: string;
    type?: string;
  };
  networkInterfaces?: Array<{
    deviceSelector?: {
      hardwareAddr?: string;
      driver?: string;
      busPath?: string;
    };
  }>;
  patches?: string[];
}

class HardwareChangeDetector {
  private currentHardware: HardwareSnapshot | null = null;
  private baseline: HardwareSnapshot | null = null;
  private nodeConfig: TalconfigNode | null = null;
  private dryRun: boolean = false;

  async execute(options: {
    node: string;
    baseline?: string;
    saveBaseline?: boolean;
    listSnapshots?: boolean;
    dryRun: boolean;
  }) {
    this.dryRun = options.dryRun;

    if (this.dryRun) {
      console.log(
        colors.yellow("🔸 DRY RUN MODE - No files will be created\n"),
      );
    }

    // Collect current hardware state
    console.log(
      colors.blue(
        `🔍 Collecting hardware information for node ${options.node}...`,
      ),
    );
    this.currentHardware = await this.collectHardware(options.node);

    // Load node configuration from talconfig.yaml
    await this.loadNodeConfig(options.node);

    if (options.listSnapshots) {
      await this.listSnapshots();
      return;
    }

    if (options.saveBaseline) {
      await this.saveBaseline();
      return;
    }

    // Load baseline for comparison
    if (options.baseline) {
      this.baseline = JSON.parse(await Deno.readTextFile(options.baseline));
    } else {
      // Extract baseline from current talconfig
      this.baseline = await this.extractBaselineFromConfig();
    }

    // Detect and report changes
    await this.detectChanges();
  }

  private async collectHardware(nodeIp: string): Promise<HardwareSnapshot> {
    // Get hostname
    const hostnameCmd = new Deno.Command("talosctl", {
      args: ["get", "hostname", "-n", nodeIp, "-o", "json"],
    });
    const hostnameOutput = await hostnameCmd.output();
    const hostnameText = new TextDecoder().decode(hostnameOutput.stdout);
    const hostnameData = JSON.parse(hostnameText);
    const hostname = hostnameData.spec.hostname;

    // Get Talos version and schematic
    let talosVersion = "unknown";
    let schematicId = "unknown";

    try {
      const versionOutput = await $`talosctl version --nodes ${nodeIp} --short`
        .text();
      talosVersion =
        versionOutput.split("\n")[1]?.replace("Server:", "").trim().split(
          " ",
        )[0] || "unknown";
    } catch {
      console.log(colors.gray("Could not get Talos version"));
    }

    // Extract schematic from node config if available
    if (this.nodeConfig?.talosImageURL) {
      const match = this.nodeConfig.talosImageURL.match(
        /installer\/([a-f0-9]+)/,
      );
      schematicId = match ? match[1] : "unknown";
    }

    // Get disks
    const disksCmd = new Deno.Command("talosctl", {
      args: ["get", "disks", "-n", nodeIp, "-o", "json"],
    });
    const disksOutput = await disksCmd.output();
    const disksText = new TextDecoder().decode(disksOutput.stdout);

    const disks = [];
    let currentObj = "";
    let braceCount = 0;

    for (const line of disksText.split("\n")) {
      if (line.trim() === "") continue;
      currentObj += line + "\n";
      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;
      if (braceCount === 0 && currentObj.trim()) {
        const disk = JSON.parse(currentObj);
        // Filter out loop devices
        if (!disk.metadata.id.startsWith("loop")) {
          disks.push({
            id: disk.metadata.id,
            serial: disk.spec.serial || "unknown",
            size: disk.spec.size || 0,
            model: disk.spec.model || "unknown",
            transport: disk.spec.transport || "unknown",
          });
        }
        currentObj = "";
      }
    }

    // Get network interfaces
    const linksCmd = new Deno.Command("talosctl", {
      args: ["get", "links", "-n", nodeIp, "-o", "json"],
    });
    const linksOutput = await linksCmd.output();
    const linksText = new TextDecoder().decode(linksOutput.stdout);

    const interfaces = [];
    currentObj = "";
    braceCount = 0;

    for (const line of linksText.split("\n")) {
      if (line.trim() === "") continue;
      currentObj += line + "\n";
      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;
      if (braceCount === 0 && currentObj.trim()) {
        const link = JSON.parse(currentObj);
        // Filter to physical interfaces only
        if (
          link.spec.type === "ether" &&
          !link.metadata.id.startsWith("veth") &&
          !link.metadata.id.startsWith("cilium") &&
          !link.metadata.id.startsWith("lxc") &&
          !link.metadata.id.startsWith("dummy") &&
          !link.metadata.id.startsWith("bond")
        ) {
          interfaces.push({
            id: link.metadata.id,
            hardwareAddr: link.spec.hardwareAddr,
            driver: link.spec.driver || "unknown",
            busPath: link.spec.busPath || "unknown",
          });
        }
        currentObj = "";
      }
    }

    return {
      timestamp: new Date().toISOString(),
      node: { hostname, ip: nodeIp },
      disks: disks.sort((a, b) => a.id.localeCompare(b.id)),
      interfaces: interfaces.sort((a, b) => a.id.localeCompare(b.id)),
      systemInfo: { talosVersion, schematicId },
    };
  }

  private async loadNodeConfig(nodeIp: string) {
    try {
      const talconfigContent = await Deno.readTextFile(
        "./talos/talconfig.yaml",
      );
      const talconfig = parseYaml(talconfigContent) as any;

      this.nodeConfig = talconfig.nodes.find((n: any) =>
        n.ipAddress === nodeIp
      );

      if (!this.nodeConfig) {
        console.log(
          colors.yellow(`⚠️  Node ${nodeIp} not found in talconfig.yaml`),
        );
      }
    } catch (error) {
      console.log(
        colors.yellow(`⚠️  Could not load talconfig.yaml: ${error.message}`),
      );
    }
  }

  private async extractBaselineFromConfig(): Promise<HardwareSnapshot> {
    if (!this.nodeConfig) {
      throw new Error("No node configuration found");
    }

    // Extract what we know from the config
    const baseline: HardwareSnapshot = {
      timestamp: "config",
      node: {
        hostname: this.nodeConfig.hostname,
        ip: this.nodeConfig.ipAddress,
      },
      disks: [],
      interfaces: [],
      systemInfo: {
        talosVersion: "unknown",
        schematicId: "unknown",
      },
    };

    // Extract disk info
    if (this.nodeConfig.installDiskSelector?.serial) {
      baseline.disks.push({
        id: "system",
        serial: this.nodeConfig.installDiskSelector.serial,
        size: 0,
        model: "configured",
        transport: "configured",
      });
    }

    // Extract interface info
    if (this.nodeConfig.networkInterfaces) {
      this.nodeConfig.networkInterfaces.forEach((iface, idx) => {
        if (iface.deviceSelector?.hardwareAddr) {
          baseline.interfaces.push({
            id: `eth${idx}`,
            hardwareAddr: iface.deviceSelector.hardwareAddr,
            driver: iface.deviceSelector.driver || "configured",
            busPath: iface.deviceSelector.busPath || "configured",
          });
        }
      });
    }

    // Extract schematic
    if (this.nodeConfig.talosImageURL) {
      const match = this.nodeConfig.talosImageURL.match(
        /installer\/([a-f0-9]+)/,
      );
      baseline.systemInfo.schematicId = match ? match[1] : "unknown";
    }

    return baseline;
  }

  private async saveBaseline() {
    const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp
    const snapshotDir = `./snapshots/hardware/${
      this.currentHardware!.node.hostname
    }`;
    const filename = `${timestamp}.json`;
    const fullPath = join(snapshotDir, filename);

    if (!this.dryRun) {
      await ensureDir(snapshotDir);

      // Create sanitized version for storage
      const sanitizedSnapshot = this.sanitizeSnapshot(this.currentHardware!);

      await Deno.writeTextFile(
        fullPath,
        JSON.stringify(sanitizedSnapshot, null, 2),
      );
      console.log(colors.green(`\n✅ Baseline saved to ${fullPath}`));

      // Also save human-readable timestamp for reference
      const readableTime = new Date().toISOString();
      console.log(colors.gray(`   Timestamp: ${timestamp} (${readableTime})`));
    } else {
      console.log(colors.gray(`\nWould save baseline to ${fullPath}`));
    }

    // Show summary
    console.log(colors.blue("\n📊 Hardware Summary:"));
    console.log(`  Hostname: ${this.currentHardware!.node.hostname}`);
    console.log(`  IP: ${this.currentHardware!.node.ip}`);
    console.log(`  Disks: ${this.currentHardware!.disks.length}`);
    this.currentHardware!.disks.forEach((disk) => {
      console.log(
        `    - ${disk.id}: ${disk.model} (${
          this.formatBytes(disk.size)
        }) [${disk.serial}]`,
      );
    });
    console.log(
      `  Network Interfaces: ${this.currentHardware!.interfaces.length}`,
    );
    this.currentHardware!.interfaces.forEach((iface) => {
      console.log(`    - ${iface.id}: ${iface.hardwareAddr} (${iface.driver})`);
    });
  }

  private async detectChanges() {
    console.log(colors.blue("\n🔍 Detecting Hardware Changes...\n"));

    // Compare disks
    const diskChanges = this.compareDisks();
    const interfaceChanges = this.compareInterfaces();
    const driverChanges = this.detectRequiredDrivers();

    // Report changes
    if (
      diskChanges.added.length === 0 &&
      diskChanges.removed.length === 0 &&
      diskChanges.changed.length === 0 &&
      interfaceChanges.added.length === 0 &&
      interfaceChanges.removed.length === 0 &&
      interfaceChanges.changed.length === 0
    ) {
      console.log(colors.green("✅ No hardware changes detected"));
      return;
    }

    // Show disk changes
    if (diskChanges.added.length > 0) {
      console.log(colors.green("➕ New Disks:"));
      diskChanges.added.forEach((disk) => {
        console.log(
          `   ${disk.id}: ${disk.model} (${
            this.formatBytes(disk.size)
          }) [${disk.serial}]`,
        );
      });
      console.log("");
    }

    if (diskChanges.removed.length > 0) {
      console.log(colors.red("➖ Removed Disks:"));
      diskChanges.removed.forEach((disk) => {
        console.log(`   ${disk.id}: ${disk.serial}`);
      });
      console.log("");
    }

    if (diskChanges.changed.length > 0) {
      console.log(colors.yellow("🔄 Changed Disks:"));
      diskChanges.changed.forEach((change) => {
        console.log(
          `   ${change.current.id}: ${change.baseline.serial} → ${change.current.serial}`,
        );
      });
      console.log("");
    }

    // Show interface changes
    if (interfaceChanges.added.length > 0) {
      console.log(colors.green("➕ New Network Interfaces:"));
      interfaceChanges.added.forEach((iface) => {
        console.log(`   ${iface.id}: ${iface.hardwareAddr} (${iface.driver})`);
      });
      console.log("");
    }

    if (interfaceChanges.removed.length > 0) {
      console.log(colors.red("➖ Removed Network Interfaces:"));
      interfaceChanges.removed.forEach((iface) => {
        console.log(`   ${iface.id}: ${iface.hardwareAddr}`);
      });
      console.log("");
    }

    if (interfaceChanges.changed.length > 0) {
      console.log(colors.yellow("🔄 Changed Network Interfaces:"));
      interfaceChanges.changed.forEach((change) => {
        console.log(
          `   ${change.current.id}: ${change.baseline.hardwareAddr} → ${change.current.hardwareAddr}`,
        );
      });
      console.log("");
    }

    // Check for driver requirements
    if (driverChanges.length > 0) {
      console.log(colors.yellow("⚠️  System Extensions May Be Required:"));
      driverChanges.forEach((driver) => {
        console.log(`   - ${driver}`);
      });
      console.log(
        colors.gray(
          "\n   Update your Talos image at https://factory.talos.dev",
        ),
      );
      console.log(
        colors.gray(
          `   Current schematic: ${
            this.currentHardware!.systemInfo.schematicId
          }`,
        ),
      );
      console.log("");
    }

    // Generate recommendations
    await this.generateRecommendations(diskChanges, interfaceChanges);
  }

  private compareDisks() {
    const baselineDisks = new Map(
      this.baseline!.disks.map((d) => [d.serial, d]),
    );
    const currentDisks = new Map(
      this.currentHardware!.disks.map((d) => [d.serial, d]),
    );

    const added = this.currentHardware!.disks.filter((d) =>
      !baselineDisks.has(d.serial)
    );
    const removed = this.baseline!.disks.filter((d) =>
      !currentDisks.has(d.serial)
    );
    const changed: Array<{ baseline: any; current: any }> = [];

    // Check for changed disks (same slot, different serial)
    this.currentHardware!.disks.forEach((current) => {
      const baseline = this.baseline!.disks.find((d) => d.id === current.id);
      if (baseline && baseline.serial !== current.serial) {
        changed.push({ baseline, current });
      }
    });

    return { added, removed, changed };
  }

  private compareInterfaces() {
    const baselineIfaces = new Map(
      this.baseline!.interfaces.map((i) => [i.hardwareAddr, i]),
    );
    const currentIfaces = new Map(
      this.currentHardware!.interfaces.map((i) => [i.hardwareAddr, i]),
    );

    const added = this.currentHardware!.interfaces.filter((i) =>
      !baselineIfaces.has(i.hardwareAddr)
    );
    const removed = this.baseline!.interfaces.filter((i) =>
      !currentIfaces.has(i.hardwareAddr)
    );
    const changed: Array<{ baseline: any; current: any }> = [];

    // Check for changed interfaces (same bus, different MAC)
    this.currentHardware!.interfaces.forEach((current) => {
      const baseline = this.baseline!.interfaces.find((i) =>
        i.busPath === current.busPath
      );
      if (baseline && baseline.hardwareAddr !== current.hardwareAddr) {
        changed.push({ baseline, current });
      }
    });

    return { added, removed, changed };
  }

  private detectRequiredDrivers(): string[] {
    const drivers: string[] = [];

    // Check for specific NIC drivers that need extensions
    const specialDrivers = [
      "atlantic",
      "bnx2x",
      "liquidio",
      "mlx4_en",
      "mlx5_core",
    ];

    this.currentHardware!.interfaces.forEach((iface) => {
      if (specialDrivers.includes(iface.driver)) {
        drivers.push(iface.driver);
      }
    });

    return [...new Set(drivers)];
  }

  private async generateRecommendations(
    diskChanges: any,
    interfaceChanges: any,
  ) {
    console.log(colors.blue("📋 Recommendations:\n"));

    // Handle new disks
    if (diskChanges.added.length > 0) {
      const generatePatch = !this.dryRun && await Confirm.prompt({
        message: "Generate storage patch for new disks?",
        default: false,
      });

      if (generatePatch || this.dryRun) {
        for (const disk of diskChanges.added) {
          await this.generateStoragePatch(disk);
        }
      }
    }

    // Handle changed system disk
    if (
      diskChanges.changed.some((c: any) =>
        c.baseline.serial === this.nodeConfig?.installDiskSelector?.serial
      )
    ) {
      console.log(colors.yellow("⚠️  System disk has changed!"));
      console.log("   Update talconfig.yaml with new serial:");
      const change = diskChanges.changed.find((c: any) =>
        c.baseline.serial === this.nodeConfig?.installDiskSelector?.serial
      );
      console.log(
        colors.gray(
          `   installDiskSelector:\n     serial: "${change.current.serial}"`,
        ),
      );
      console.log("");
    }

    // Handle network changes
    if (interfaceChanges.changed.length > 0) {
      console.log(colors.yellow("⚠️  Network interfaces have changed!"));
      console.log("   Update talconfig.yaml with new MAC addresses:");
      interfaceChanges.changed.forEach((change: any) => {
        console.log(
          colors.gray(`   hardwareAddr: "${change.current.hardwareAddr}"`),
        );
      });
      console.log("");
    }

    // Show next steps
    console.log(colors.blue("\n🚀 Next Steps:\n"));
    console.log("1. Review and apply any manual configuration changes above");
    console.log("");
    console.log("2. If patches were generated, add them to talconfig.yaml");
    console.log("");
    console.log("3. Regenerate and apply configuration:");
    console.log(colors.gray("   task talos:generate-config"));
    console.log(
      colors.gray(
        `   task talos:apply-node IP=${
          this.currentHardware!.node.ip
        } MODE=auto`,
      ),
    );
    console.log("");
    console.log("4. Commit and push changes:");
    console.log(colors.gray("   git add -A"));
    console.log(
      colors.gray(
        `   git commit -m "feat: hardware changes for ${
          this.currentHardware!.node.hostname
        }"`,
      ),
    );
    console.log(colors.gray("   git push"));
  }

  private async generateStoragePatch(disk: any) {
    const hostname = this.currentHardware!.node.hostname;
    const patchDir = `./talos/patches/${hostname}`;
    const safeName = disk.model.toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    const patchFile = `storage-${safeName}.yaml`;
    const patchPath = join(patchDir, patchFile);

    const patch = {
      machine: {
        volumes: [{
          name: `storage-${disk.serial.slice(-6).toLowerCase()}`,
          mountpoint: `/var/mnt/${safeName}`,
          diskSelector: {
            serial: disk.serial,
          },
          filesystem: {
            type: "xfs",
            options: ["noatime", "nodiratime"],
          },
        }],
      },
    };

    if (!this.dryRun) {
      await ensureDir(patchDir);
      await Deno.writeTextFile(patchPath, stringifyYaml(patch));
      console.log(colors.green(`✅ Created patch: ${patchPath}`));
    } else {
      console.log(colors.gray(`Would create patch: ${patchPath}`));
      console.log(colors.gray("Content:"));
      console.log(
        colors.gray(
          stringifyYaml(patch).split("\n").map((l) => `  ${l}`).join("\n"),
        ),
      );
    }

    // Show how to add to talconfig
    console.log(colors.yellow(`\n   Add to talconfig.yaml under ${hostname}:`));
    const patchRef = `@./patches/${hostname}/${patchFile}`;
    console.log(colors.gray(`   patches:`));
    if (this.nodeConfig?.patches) {
      this.nodeConfig.patches.forEach((p) => {
        console.log(colors.gray(`     - "${p}"`));
      });
    }
    console.log(colors.gray(`     - "${patchRef}"`));
    console.log("");
  }

  private sanitizeSnapshot(snapshot: HardwareSnapshot): HardwareSnapshot {
    // Create a sanitized copy that's safe for version control
    const sanitized = JSON.parse(JSON.stringify(snapshot));

    // Sanitize sensitive disk information
    sanitized.disks = sanitized.disks.map((disk: any) => ({
      ...disk,
      // Keep serial for identification but consider if this should be redacted
      serial: disk.serial, // These are needed for hardware matching
      // Size and model are generally safe
      size: disk.size,
      model: disk.model,
      transport: disk.transport,
    }));

    // Sanitize network interfaces - MAC addresses can be sensitive
    sanitized.interfaces = sanitized.interfaces.map((
      iface: any,
      index: number,
    ) => ({
      ...iface,
      // Redact actual MAC addresses but keep a consistent identifier
      hardwareAddr: this.redactMAC(iface.hardwareAddr, index),
      // Driver and bus path are generally safe
      driver: iface.driver,
      busPath: iface.busPath,
    }));

    // Add metadata about sanitization
    sanitized._sanitized = true;
    sanitized._sanitizedAt = new Date().toISOString();

    return sanitized;
  }

  private redactMAC(mac: string, index: number): string {
    // Create a consistent but redacted MAC for comparison purposes
    // Keep the vendor portion (first 3 octets) but redact device-specific part
    const parts = mac.split(":");
    if (parts.length === 6) {
      // Keep vendor OUI, redact device-specific portion
      return `${parts[0]}:${parts[1]}:${parts[2]}:xx:xx:${
        index.toString(16).padStart(2, "0")
      }`;
    }
    return `redacted-${index}`;
  }

  private async listSnapshots() {
    const hostname = this.currentHardware!.node.hostname;
    const snapshotDir = `./snapshots/hardware/${hostname}`;

    try {
      console.log(colors.blue(`📊 Hardware Snapshots for ${hostname}:\n`));

      const snapshots = [];
      for await (const entry of Deno.readDir(snapshotDir)) {
        if (entry.isFile && entry.name.endsWith(".json")) {
          const filePath = join(snapshotDir, entry.name);
          const stat = await Deno.stat(filePath);
          const timestamp = parseInt(entry.name.replace(".json", ""));
          const readableTime = new Date(timestamp * 1000).toISOString();

          snapshots.push({
            timestamp,
            filename: entry.name,
            readableTime,
            size: stat.size,
            filePath,
          });
        }
      }

      if (snapshots.length === 0) {
        console.log(
          colors.yellow(
            "No snapshots found. Use --save-baseline to create one.",
          ),
        );
        return;
      }

      // Sort by timestamp (newest first)
      snapshots.sort((a, b) => b.timestamp - a.timestamp);

      const snapshotTable = new Table()
        .header(["Timestamp", "Date/Time", "Size", "Filename"])
        .body(
          snapshots.map((snapshot) => [
            snapshot.timestamp.toString(),
            snapshot.readableTime.replace("T", " ").replace("Z", ""),
            this.formatBytes(snapshot.size),
            snapshot.filename,
          ]),
        );
      snapshotTable.render();

      console.log(
        colors.gray(`\nFound ${snapshots.length} snapshots in ${snapshotDir}`),
      );
      console.log(colors.gray("\nUsage examples:"));
      console.log(colors.gray(`  # Compare with latest snapshot:`));
      console.log(
        colors.gray(
          `  deno task hw:detect -n ${this.currentHardware!.node.ip} -b ${
            snapshots[0].filePath
          }`,
        ),
      );
      console.log(colors.gray(`  # Compare with specific snapshot:`));
      console.log(
        colors.gray(
          `  deno task hw:detect -n ${
            this.currentHardware!.node.ip
          } -b ${snapshotDir}/<timestamp>.json`,
        ),
      );
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        console.log(
          colors.yellow(`No snapshots directory found for ${hostname}.`),
        );
        console.log(
          colors.gray("Use --save-baseline to create your first snapshot."),
        );
      } else {
        console.error(colors.red(`Error reading snapshots: ${error.message}`));
      }
    }
  }

  private formatBytes(bytes: number): string {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}

// CLI setup
if (import.meta.main) {
  await new Command()
    .name("detect-hardware-changes")
    .version("0.1.0")
    .description(
      "Detect hardware changes and generate cluster-template patches",
    )
    .option("-n, --node <ip:string>", "Node IP address", { required: true })
    .option("-b, --baseline <file:string>", "Baseline hardware inventory file")
    .option("--save-baseline", "Save current hardware state as baseline")
    .option(
      "--list-snapshots",
      "List available hardware snapshots for the node",
    )
    .option("--dry-run", "Show what would be done without making changes", {
      default: false,
    })
    .example(
      "Save baseline",
      "detect-hardware-changes.ts -n 192.168.1.98 --save-baseline",
    )
    .example(
      "Detect changes (dry run)",
      "detect-hardware-changes.ts -n 192.168.1.98 --dry-run",
    )
    .example(
      "List snapshots",
      "detect-hardware-changes.ts -n 192.168.1.98 --list-snapshots",
    )
    .example(
      "Compare with baseline",
      "detect-hardware-changes.ts -n 192.168.1.98 -b baseline.json",
    )
    .action(async (options) => {
      try {
        const detector = new HardwareChangeDetector();
        await detector.execute(options);
      } catch (error) {
        console.error(colors.red(`\n❌ Error: ${error.message}`));
        Deno.exit(1);
      }
    })
    .parse(Deno.args);
}
