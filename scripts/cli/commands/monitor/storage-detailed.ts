import type { CLIOptions } from "../../shared/types.ts";
import { colors } from "@cliffy/ansi/colors";

interface StorageOptions extends CLIOptions {
  growthAnalysis?: boolean;
  checkProvisioner?: boolean;
}

/**
 * Storage health check - wraps existing comprehensive script
 */
export async function runStorageHealth(options: StorageOptions): Promise<void> {
  try {
    const args = ["run", "--allow-all", "scripts/storage-health-check.ts"];
    
    if (options.json) {
      args.push("--json");
    }
    
    if (options.verbose) {
      args.push("--verbose");
    }
    
    if (options.growthAnalysis) {
      args.push("--growth-analysis");
    }
    
    if (options.checkProvisioner) {
      args.push("--check-provisioner");
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
        issues: [`Storage health check failed: ${error instanceof Error ? error.message : String(error)}`]
      };
      console.log(JSON.stringify(errorResult, null, 2));
    } else {
      console.error(colors.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
    }
    Deno.exit(3);
  }
}