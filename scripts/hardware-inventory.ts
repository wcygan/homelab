#!/usr/bin/env -S deno run --allow-all

import { Command } from "jsr:@cliffy/command@1.0.0-rc.7";
import { Table } from "jsr:@cliffy/table@1.0.0-rc.7";
import { colors } from "jsr:@cliffy/ansi@1.0.0-rc.7/colors";
import $ from "jsr:@david/dax@0.42.0";

interface DiskInfo {
  id: string;
  size: string;
  transport: string;
  model: string;
  serial: string;
  rotational: boolean;
  wwid: string;
}

interface NetworkInterface {
  id: string;
  hardwareAddr: string;
  mtu: number;
  driver: string;
  busPath: string;
  pciAddress: string;
  speed?: string;
}

interface NodeInventory {
  hostname: string;
  ip: string;
  systemDisk: string;
  disks: DiskInfo[];
  interfaces: NetworkInterface[];
  mounts: Array<{
    source: string;
    target: string;
    filesystem: string;
  }>;
  talosVersion: string;
  kubernetesVersion: string;
}

class HardwareInventory {
  private nodes: string[] = [];
  private inventory: Map<string, NodeInventory> = new Map();

  async collectInventory(nodeIp: string): Promise<NodeInventory> {
    console.log(colors.blue(`\n📊 Collecting inventory for node ${nodeIp}...`));

    try {
      // Get hostname
      const hostnameOutput = await $`talosctl get hostname -n ${nodeIp} -o json`
        .text();
      const hostnameResult = JSON.parse(hostnameOutput);
      const hostname = hostnameResult.spec.hostname;

      // Get Talos version
      const versionOutput = await $`talosctl version --nodes ${nodeIp} --short`
        .text();
      const talosVersion =
        versionOutput.trim().split("\n")[1].replace("Server:", "").trim().split(
          " ",
        )[0];

      // Get Kubernetes version from node
      const k8sNode = await $`kubectl get node ${hostname} -o json`.json();
      const kubernetesVersion = k8sNode.status.nodeInfo.kubeletVersion;

      // Get system disk
      const systemDiskOutput =
        await $`talosctl get systemdisk -n ${nodeIp} -o json`.text();
      const systemDiskResult = JSON.parse(systemDiskOutput);
      const systemDisk = systemDiskResult.spec.diskID;

      // Get all disks
      const disksCmd = new Deno.Command("talosctl", {
        args: ["get", "disks", "-n", nodeIp, "-o", "json"],
      });
      const disksOutput = await disksCmd.output();
      const disksText = new TextDecoder().decode(disksOutput.stdout);
      // Parse multi-line JSON output (each object spans multiple lines)
      const disksResult = [];
      let currentObj = "";
      let braceCount = 0;
      for (const line of disksText.split("\n")) {
        if (line.trim() === "") continue;
        currentObj += line + "\n";
        braceCount += (line.match(/{/g) || []).length;
        braceCount -= (line.match(/}/g) || []).length;
        if (braceCount === 0 && currentObj.trim()) {
          disksResult.push(JSON.parse(currentObj));
          currentObj = "";
        }
      }
      const disks: DiskInfo[] = disksResult.map((disk: any) => ({
        id: disk.metadata.id,
        size: this.formatBytes(disk.spec.size),
        transport: disk.spec.transport || "unknown",
        model: disk.spec.model || "unknown",
        serial: disk.spec.serial || "unknown",
        rotational: disk.spec.rotational || false,
        wwid: disk.spec.wwid || "unknown",
      }));

      // Get network interfaces
      const linksCmd = new Deno.Command("talosctl", {
        args: ["get", "links", "-n", nodeIp, "-o", "json"],
      });
      const linksOutput = await linksCmd.output();
      const linksText = new TextDecoder().decode(linksOutput.stdout);
      // Parse multi-line JSON output
      const linksResult = [];
      let linkObj = "";
      let linkBraceCount = 0;
      for (const line of linksText.split("\n")) {
        if (line.trim() === "") continue;
        linkObj += line + "\n";
        linkBraceCount += (line.match(/{/g) || []).length;
        linkBraceCount -= (line.match(/}/g) || []).length;
        if (linkBraceCount === 0 && linkObj.trim()) {
          linksResult.push(JSON.parse(linkObj));
          linkObj = "";
        }
      }
      const interfaces: NetworkInterface[] = linksResult
        .filter((link: any) =>
          link.spec.type === "ether" &&
          !link.metadata.id.startsWith("veth") &&
          !link.metadata.id.startsWith("cilium")
        )
        .map((link: any) => ({
          id: link.metadata.id,
          hardwareAddr: link.spec.hardwareAddr,
          mtu: link.spec.mtu,
          driver: link.spec.driver || "unknown",
          busPath: link.spec.busPath || "unknown",
          pciAddress: link.spec.pciAddress || "unknown",
          speed: link.spec.speed,
        }));

      // Get mount points
      const mountsCmd = new Deno.Command("talosctl", {
        args: ["get", "mountstatus", "-n", nodeIp, "-o", "json"],
      });
      const mountsOutput = await mountsCmd.output();
      const mountsText = new TextDecoder().decode(mountsOutput.stdout);
      // Parse multi-line JSON output
      const mountsResult = [];
      let mountObj = "";
      let mountBraceCount = 0;
      for (const line of mountsText.split("\n")) {
        if (line.trim() === "") continue;
        mountObj += line + "\n";
        mountBraceCount += (line.match(/{/g) || []).length;
        mountBraceCount -= (line.match(/}/g) || []).length;
        if (mountBraceCount === 0 && mountObj.trim()) {
          mountsResult.push(JSON.parse(mountObj));
          mountObj = "";
        }
      }
      const mounts = mountsResult
        .filter((mount: any) =>
          mount.spec.source && mount.spec.source.startsWith("/dev")
        )
        .map((mount: any) => ({
          source: mount.spec.source,
          target: mount.spec.target,
          filesystem: mount.spec.filesystem,
        }));

      return {
        hostname,
        ip: nodeIp,
        systemDisk,
        disks,
        interfaces,
        mounts,
        talosVersion,
        kubernetesVersion,
      };
    } catch (error) {
      console.error(
        colors.red(`Failed to collect inventory for ${nodeIp}: ${error}`),
      );
      throw error;
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

  async displayInventory(format: "table" | "json" | "yaml") {
    if (format === "json") {
      const output = Object.fromEntries(this.inventory);
      console.log(JSON.stringify(output, null, 2));
      return;
    }

    if (format === "yaml") {
      // Simple YAML output
      for (const [ip, inv] of this.inventory) {
        console.log(`${inv.hostname}:`);
        console.log(`  ip: ${ip}`);
        console.log(`  talos_version: ${inv.talosVersion}`);
        console.log(`  kubernetes_version: ${inv.kubernetesVersion}`);
        console.log(`  system_disk: ${inv.systemDisk}`);
        console.log(`  disks:`);
        for (const disk of inv.disks) {
          console.log(`    - id: ${disk.id}`);
          console.log(`      serial: ${disk.serial}`);
          console.log(`      size: ${disk.size}`);
          console.log(`      model: ${disk.model}`);
        }
        console.log(`  interfaces:`);
        for (const iface of inv.interfaces) {
          console.log(`    - id: ${iface.id}`);
          console.log(`      mac: ${iface.hardwareAddr}`);
          console.log(`      driver: ${iface.driver}`);
        }
        console.log("");
      }
      return;
    }

    // Table format (default)
    for (const [ip, inv] of this.inventory) {
      console.log(colors.green(`\n📦 Node: ${inv.hostname} (${ip})`));
      console.log(
        colors.gray(
          `Talos: ${inv.talosVersion} | Kubernetes: ${inv.kubernetesVersion}`,
        ),
      );

      // Disks table
      console.log(colors.blue("\n💾 Disks:"));
      const diskTable = new Table()
        .header(["Device", "Serial", "Size", "Type", "Model", "System"])
        .body(
          inv.disks.map((disk) => [
            disk.id,
            disk.serial,
            disk.size,
            disk.transport,
            disk.model,
            disk.id === inv.systemDisk ? "✓" : "",
          ]),
        );
      diskTable.render();

      // Network interfaces table
      console.log(colors.blue("\n🔌 Network Interfaces:"));
      const netTable = new Table()
        .header(["Interface", "MAC Address", "Driver", "MTU", "PCI Address"])
        .body(
          inv.interfaces.map((iface) => [
            iface.id,
            iface.hardwareAddr,
            iface.driver,
            iface.mtu.toString(),
            iface.pciAddress,
          ]),
        );
      netTable.render();

      // Mounts table
      if (inv.mounts.length > 0) {
        console.log(colors.blue("\n📁 Mounts:"));
        const mountTable = new Table()
          .header(["Source", "Target", "Filesystem"])
          .body(
            inv.mounts.map((mount) => [
              mount.source,
              mount.target,
              mount.filesystem,
            ]),
          );
        mountTable.render();
      }
    }
  }

  async compareInventories(node1: string, node2: string) {
    const inv1 = this.inventory.get(node1);
    const inv2 = this.inventory.get(node2);

    if (!inv1 || !inv2) {
      throw new Error("Both nodes must be in inventory for comparison");
    }

    console.log(
      colors.green(`\n🔍 Comparing ${inv1.hostname} vs ${inv2.hostname}`),
    );

    // Compare disks
    const disks1 = new Set(inv1.disks.map((d) => d.serial));
    const disks2 = new Set(inv2.disks.map((d) => d.serial));

    const uniqueToNode1 = [...disks1].filter((s) => !disks2.has(s));
    const uniqueToNode2 = [...disks2].filter((s) => !disks1.has(s));

    if (uniqueToNode1.length > 0) {
      console.log(
        colors.yellow(`\nDisks only in ${inv1.hostname}:`),
        uniqueToNode1,
      );
    }
    if (uniqueToNode2.length > 0) {
      console.log(
        colors.yellow(`\nDisks only in ${inv2.hostname}:`),
        uniqueToNode2,
      );
    }

    // Compare network interfaces
    const macs1 = new Set(inv1.interfaces.map((i) => i.hardwareAddr));
    const macs2 = new Set(inv2.interfaces.map((i) => i.hardwareAddr));

    if (macs1.size !== macs2.size) {
      console.log(
        colors.yellow(
          `\nNetwork interface count differs: ${macs1.size} vs ${macs2.size}`,
        ),
      );
    }
  }

  async saveToFile(filename: string) {
    const output = Object.fromEntries(this.inventory);
    await Deno.writeTextFile(filename, JSON.stringify(output, null, 2));
    console.log(colors.green(`\n✅ Inventory saved to ${filename}`));
  }

  async run(
    options: {
      nodes?: string[];
      all: boolean;
      format: string;
      compare?: string;
      save?: string;
    },
  ) {
    // Determine which nodes to inventory
    if (options.all) {
      const nodesResult = await $`kubectl get nodes -o json`.json();
      this.nodes = nodesResult.items.map((node: any) =>
        node.status.addresses.find((addr: any) => addr.type === "InternalIP")
          .address
      );
    } else if (options.nodes && options.nodes.length > 0) {
      this.nodes = options.nodes;
    } else {
      // Default to all nodes if none specified
      const nodesResult = await $`kubectl get nodes -o json`.json();
      this.nodes = nodesResult.items.map((node: any) =>
        node.status.addresses.find((addr: any) => addr.type === "InternalIP")
          .address
      );
    }

    // Collect inventory for each node
    for (const node of this.nodes) {
      try {
        const inv = await this.collectInventory(node);
        this.inventory.set(node, inv);
      } catch (error) {
        console.error(colors.red(`Skipping node ${node} due to error`));
      }
    }

    // Compare if requested
    if (options.compare) {
      const [node1, node2] = options.compare.split(",");
      await this.compareInventories(node1, node2);
    } else {
      // Display inventory
      await this.displayInventory(options.format as "table" | "json" | "yaml");
    }

    // Save if requested
    if (options.save) {
      await this.saveToFile(options.save);
    }
  }
}

// CLI setup
if (import.meta.main) {
  const command = new Command()
    .name("hardware-inventory")
    .version("0.1.0")
    .description("Collect and display hardware inventory for Talos Linux nodes")
    .option("-n, --nodes <ips:string[]>", "Node IPs to inventory", {
      collect: true,
    })
    .option("-a, --all", "Inventory all nodes in cluster")
    .option("-f, --format <format:string>", "Output format", {
      default: "table",
    })
    .option(
      "-c, --compare <nodes:string>",
      "Compare two nodes (comma-separated IPs)",
    )
    .option("-s, --save <file:string>", "Save inventory to JSON file")
    .example("All nodes", "hardware-inventory.ts --all")
    .example(
      "Specific nodes",
      "hardware-inventory.ts -n 192.168.1.98 -n 192.168.1.99",
    )
    .example(
      "Compare nodes",
      "hardware-inventory.ts --all --compare 192.168.1.98,192.168.1.99",
    )
    .example(
      "Save to file",
      "hardware-inventory.ts --all --save inventory.json",
    )
    .action(async (options) => {
      const inventory = new HardwareInventory();
      await inventory.run(options);
    });

  await command.parse(Deno.args);
}
