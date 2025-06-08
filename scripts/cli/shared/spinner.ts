import { colors } from "@cliffy/ansi/colors";
import { sleep } from "./utils.ts";

/**
 * Spinner animation frames
 */
const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

/**
 * Individual spinner for a single task
 */
export class Spinner {
  private message: string;
  private frameIndex = 0;
  private isSpinning = false;
  private intervalId?: number;

  constructor(message: string) {
    this.message = message;
  }

  start(): void {
    if (this.isSpinning) return;
    
    this.isSpinning = true;
    this.frameIndex = 0;
    
    // Clear line and write initial spinner
    this.render();
    
    // Start animation at 10Hz (100ms intervals)
    this.intervalId = setInterval(() => {
      this.frameIndex = (this.frameIndex + 1) % SPINNER_FRAMES.length;
      this.render();
    }, 100);
  }

  stop(status: "success" | "warning" | "error", duration?: number): void {
    if (!this.isSpinning) return;
    
    this.isSpinning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    // Clear line and show final result
    this.clearLine();
    const icon = this.getStatusIcon(status);
    const durationText = duration ? colors.gray(` [${this.formatDuration(duration)}]`) : "";
    console.log(`${icon} ${this.message}${durationText}`);
  }

  private render(): void {
    if (!this.isSpinning) return;
    
    this.clearLine();
    const frame = colors.blue(SPINNER_FRAMES[this.frameIndex]);
    Deno.stdout.writeSync(new TextEncoder().encode(`${frame} ${this.message}...`));
  }

  private clearLine(): void {
    // Move cursor to beginning of line and clear it
    Deno.stdout.writeSync(new TextEncoder().encode("\r\x1b[K"));
  }

  private getStatusIcon(status: string): string {
    switch (status) {
      case "success": return colors.green("✓");
      case "warning": return colors.yellow("⚠");
      case "error": return colors.red("✗");
      default: return colors.gray("◦");
    }
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }
}

/**
 * Multi-spinner manager for parallel tasks
 */
export class MultiSpinner {
  private spinners: Map<string, Spinner> = new Map();
  private results: Map<string, { status: string; duration?: number }> = new Map();
  private isActive = false;

  add(id: string, message: string): void {
    const spinner = new Spinner(message);
    this.spinners.set(id, spinner);
  }

  start(id: string): void {
    const spinner = this.spinners.get(id);
    if (spinner && !this.isActive) {
      this.isActive = true;
      spinner.start();
    }
  }

  stop(id: string, status: "success" | "warning" | "error", duration?: number): void {
    const spinner = this.spinners.get(id);
    if (spinner) {
      spinner.stop(status, duration);
      this.results.set(id, { status, duration });
      this.isActive = false;
    }
  }

  async startAll(): Promise<void> {
    // For simplicity in this demo, we'll just start the first spinner
    // In a real implementation, this would handle multiple concurrent spinners
    const firstId = Array.from(this.spinners.keys())[0];
    if (firstId) {
      this.start(firstId);
    }
  }

  getResults(): Map<string, { status: string; duration?: number }> {
    return this.results;
  }
}