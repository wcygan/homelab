import type { CLIOptions } from "../../shared/types.ts";
import { colors } from "@cliffy/ansi/colors";

interface NetworkOptions extends CLIOptions {
  checkDns?: boolean;
  checkEndpoints?: boolean;
}

/**
 * Network health check - wraps existing comprehensive script
 */
export async function runNetworkHealth(options: NetworkOptions): Promise<void> {
  try {
    const args = ["run", "--allow-all", "scripts/network-monitor.ts"];
    
    if (options.json) {
      args.push("--json");
    }
    
    if (options.verbose) {
      args.push("--verbose");
    }
    
    if (options.checkDns) {
      args.push("--check-dns");
    }
    
    if (options.checkEndpoints) {
      args.push("--check-endpoints");
    }
    
    const command = new Deno.Command("deno", {
      args,
      stdout: "inherit",
      stderr: "inherit"
    });
    
    const result = await command.output();
    Deno.exit(result.code);
    
  } catch (error) {
    if (options.json) {
      const errorResult = {
        status: "error",
        timestamp: new Date().toISOString(),
        summary: { total: 0, healthy: 0, warnings: 0, critical: 0 },
        details: [`Error: ${error instanceof Error ? error.message : String(error)}`],
        issues: [`Network health check failed: ${error instanceof Error ? error.message : String(error)}`]
      };
      console.log(JSON.stringify(errorResult, null, 2));
    } else {
      console.error(colors.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
    }
    Deno.exit(3);
  }
}