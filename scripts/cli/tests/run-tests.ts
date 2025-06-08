#!/usr/bin/env -S deno run --allow-all

import { colors } from "@cliffy/ansi/colors";

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

/**
 * CLI Integration Test Suite
 */
class CLITestSuite {
  private results: TestResult[] = [];
  
  async runAllTests(): Promise<void> {
    console.log(colors.bold("🧪 CLI Integration Test Suite"));
    console.log("=".repeat(35));
    console.log();
    
    // Test basic CLI functionality
    await this.testBasicHelp();
    await this.testDefaultMonitor();
    await this.testDomainCommands();
    await this.testBackwardsCompatibility();
    await this.testJSONOutput();
    await this.testPerformance();
    
    this.printSummary();
    this.exit();
  }
  
  private async testBasicHelp(): Promise<void> {
    await this.runTest("Basic CLI Help", async () => {
      const result = await this.runCommand(["scripts/cli/homelab.ts", "--help"]);
      if (!result.output.includes("Monitor homelab components")) {
        throw new Error("Help output missing expected content");
      }
    });
    
    await this.runTest("Monitor Help", async () => {
      const result = await this.runCommand(["scripts/cli/homelab.ts", "monitor", "--help"]);
      if (!result.output.includes("flux") || !result.output.includes("k8s")) {
        throw new Error("Monitor help missing domain commands");
      }
    });
  }
  
  private async testDefaultMonitor(): Promise<void> {
    await this.runTest("Default Monitor Command", async () => {
      const result = await this.runCommand(["scripts/cli/homelab.ts", "monitor"]);
      if (result.code !== 0) {
        throw new Error(`Monitor command failed with exit code ${result.code}`);
      }
      if (!result.output.includes("Homelab Quick Health Check")) {
        throw new Error("Monitor output missing expected header");
      }
    });
    
    await this.runTest("Default Monitor JSON", async () => {
      const result = await this.runCommand(["scripts/cli/homelab.ts", "monitor", "--json"]);
      if (result.code !== 0) {
        throw new Error(`Monitor JSON failed with exit code ${result.code}`);
      }
      
      try {
        const data = JSON.parse(result.output);
        if (!data.status || !data.domains || !data.summary) {
          throw new Error("JSON output missing required fields");
        }
      } catch (e) {
        throw new Error(`Invalid JSON output: ${e.message}`);
      }
    });
  }
  
  private async testDomainCommands(): Promise<void> {
    const domains = [
      { name: "flux check", args: ["monitor", "flux", "check", "--json"] },
      { name: "flux status", args: ["monitor", "flux", "status", "--json"] },
      { name: "k8s health", args: ["monitor", "k8s", "health", "--json"] },
      { name: "storage health", args: ["monitor", "storage", "health", "--json"] },
      { name: "network health", args: ["monitor", "network", "health", "--json"] },
      { name: "all comprehensive", args: ["monitor", "all", "--json"] }
    ];
    
    for (const domain of domains) {
      await this.runTest(`Domain: ${domain.name}`, async () => {
        const result = await this.runCommand(["scripts/cli/homelab.ts", ...domain.args]);
        
        // Allow exit codes 0, 1, 2 (healthy, warning, critical) but not 3 (error)
        if (result.code === 3) {
          throw new Error(`Domain command failed with error code ${result.code}`);
        }
        
        try {
          const data = JSON.parse(result.output);
          if (!data.status) {
            throw new Error("JSON output missing status field");
          }
        } catch (e) {
          throw new Error(`Invalid JSON output: ${e.message}`);
        }
      });
    }
  }
  
  private async testBackwardsCompatibility(): Promise<void> {
    const currentTasks = [
      { task: "monitor", expectsJson: false },
      { task: "monitor:json", expectsJson: true },
      { task: "monitor:all", expectsJson: false }
    ];
    
    for (const { task, expectsJson } of currentTasks) {
      await this.runTest(`Deno Task: ${task}`, async () => {
        const result = await this.runCommand(["deno", "task", task], { useDeno: false });
        
        // Allow exit codes 0, 1, 2 but not 3
        if (result.code === 3) {
          throw new Error(`Task failed with error code ${result.code}`);
        }
        
        // Verify output contains expected patterns
        if (expectsJson && !result.output.includes("{")) {
          throw new Error("JSON task did not produce JSON output");
        }
        
        if (!expectsJson && result.output.includes("{") && result.output.includes("}")) {
          throw new Error("Non-JSON task produced JSON output");
        }
      });
    }
  }
  
  private async testJSONOutput(): Promise<void> {
    await this.runTest("JSON Schema Validation", async () => {
      const result = await this.runCommand(["scripts/cli/homelab.ts", "monitor", "--json"]);
      
      try {
        const data = JSON.parse(result.output);
        
        // Validate required fields
        const requiredFields = ["status", "timestamp", "totalDuration", "domains", "summary", "issues"];
        for (const field of requiredFields) {
          if (!(field in data)) {
            throw new Error(`Missing required field: ${field}`);
          }
        }
        
        // Validate domains structure
        if (!Array.isArray(data.domains)) {
          throw new Error("domains field must be an array");
        }
        
        for (const domain of data.domains) {
          if (!domain.name || !domain.status) {
            throw new Error("Domain missing required fields");
          }
        }
        
      } catch (e) {
        throw new Error(`JSON schema validation failed: ${e.message}`);
      }
    });
  }
  
  private async testPerformance(): Promise<void> {
    await this.runTest("Performance: Quick Monitor < 3s", async () => {
      const startTime = Date.now();
      const result = await this.runCommand(["scripts/cli/homelab.ts", "monitor"]);
      const duration = Date.now() - startTime;
      
      if (duration > 3000) {
        throw new Error(`Quick monitor took ${duration}ms, expected < 3000ms`);
      }
      
      if (result.code !== 0 && result.code !== 1) {
        throw new Error(`Performance test failed with exit code ${result.code}`);
      }
    });
  }
  
  private async runTest(name: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    
    try {
      await testFn();
      const duration = Date.now() - startTime;
      this.results.push({ name, passed: true, duration });
      console.log(`${colors.green("✓")} ${name} ${colors.gray(`(${duration}ms)`)}`);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.results.push({ name, passed: false, duration, error: errorMessage });
      console.log(`${colors.red("✗")} ${name} ${colors.gray(`(${duration}ms)`)}`);
      console.log(`  ${colors.red("Error:")} ${errorMessage}`);
    }
  }
  
  private async runCommand(
    args: string[], 
    options: { useDeno?: boolean } = { useDeno: true }
  ): Promise<{ code: number; output: string; error: string }> {
    const command = options.useDeno ? "deno" : args[0];
    const cmdArgs = options.useDeno ? ["run", "--allow-all", ...args] : args.slice(1);
    
    const cmd = new Deno.Command(command, {
      args: cmdArgs,
      stdout: "piped",
      stderr: "piped"
    });
    
    const result = await cmd.output();
    const output = new TextDecoder().decode(result.stdout);
    const error = new TextDecoder().decode(result.stderr);
    
    return {
      code: result.code,
      output,
      error
    };
  }
  
  private printSummary(): void {
    console.log();
    console.log(colors.bold("Test Summary"));
    console.log("=".repeat(15));
    
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log(`${colors.green("Passed:")} ${passed}`);
    console.log(`${colors.red("Failed:")} ${failed}`);
    console.log(`${colors.blue("Total Duration:")} ${totalDuration}ms`);
    
    if (failed > 0) {
      console.log();
      console.log(colors.red("Failed Tests:"));
      for (const result of this.results.filter(r => !r.passed)) {
        console.log(`  • ${result.name}: ${result.error}`);
      }
    }
  }
  
  private exit(): void {
    const failed = this.results.filter(r => !r.passed).length;
    Deno.exit(failed > 0 ? 1 : 0);
  }
}

// Run tests if this is the main module
if (import.meta.main) {
  const suite = new CLITestSuite();
  await suite.runAllTests();
}