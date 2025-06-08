import type { CLIOptions } from "../../shared/types.ts";
import { colors } from "@cliffy/ansi/colors";

interface K8sOptions extends CLIOptions {
  namespace?: string;
  noFlux?: boolean;
}

/**
 * K8s health check - wraps existing comprehensive script
 */
export async function runK8sHealth(options: K8sOptions): Promise<void> {
  try {
    const args = ["run", "--allow-all", "scripts/k8s-health-check.ts"];
    
    if (options.json) {
      args.push("--json");
    }
    
    if (options.verbose) {
      args.push("--verbose");
    }
    
    if (options.namespace) {
      args.push("--namespace", options.namespace);
    }
    
    if (options.noFlux) {
      args.push("--no-flux");
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
        issues: [`K8s health check failed: ${error instanceof Error ? error.message : String(error)}`]
      };
      console.log(JSON.stringify(errorResult, null, 2));
    } else {
      console.error(colors.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
    }
    Deno.exit(3);
  }
}