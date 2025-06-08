import { Spinner } from "./spinner.ts";
import type { DomainCheck, MonitoringResult } from "./types.ts";

/**
 * Task function type for parallel execution
 */
export type TaskFunction = () => Promise<MonitoringResult>;

/**
 * Task definition for parallel execution
 */
export interface ParallelTask {
  id: string;
  name: string;
  task: TaskFunction;
}

/**
 * Parallel task executor with progress tracking
 */
export class ParallelExecutor {
  private tasks: Map<string, ParallelTask> = new Map();
  private spinners: Map<string, Spinner> = new Map();
  private results: Map<string, DomainCheck> = new Map();
  private silent: boolean;

  constructor(silent = false) {
    this.silent = silent;
  }

  /**
   * Add a task to be executed
   */
  addTask(task: ParallelTask): void {
    this.tasks.set(task.id, task);
    this.spinners.set(task.id, new Spinner(task.name, this.silent));
    this.results.set(task.id, {
      name: task.name,
      status: "pending"
    });
  }

  /**
   * Execute all tasks in parallel with progress tracking
   */
  async executeAll(): Promise<DomainCheck[]> {
    const startTime = Date.now();
    
    // Start all spinners and execute tasks in parallel
    const promises = Array.from(this.tasks.entries()).map(async ([id, task]) => {
      const spinner = this.spinners.get(id)!;
      const result = this.results.get(id)!;
      
      const taskStartTime = Date.now();
      
      try {
        // Start spinner
        spinner.start();
        result.status = "running";
        
        // Execute the task
        const taskResult = await task.task();
        const duration = Date.now() - taskStartTime;
        
        // Update result
        result.result = taskResult;
        result.duration = duration;
        result.status = "completed";
        
        // Stop spinner with appropriate status
        const spinnerStatus = this.getSpinnerStatus(taskResult.status);
        spinner.stop(spinnerStatus, duration);
        
      } catch (error) {
        const duration = Date.now() - taskStartTime;
        
        // Handle error
        result.error = error instanceof Error ? error.message : String(error);
        result.duration = duration;
        result.status = "failed";
        
        // Stop spinner with error
        spinner.stop("error", duration);
      }
    });

    // Wait for all tasks to complete
    await Promise.all(promises);

    return Array.from(this.results.values());
  }

  /**
   * Execute tasks sequentially (for debugging)
   */
  async executeSequentially(): Promise<DomainCheck[]> {
    for (const [id, task] of this.tasks.entries()) {
      const spinner = this.spinners.get(id)!;
      const result = this.results.get(id)!;
      
      const taskStartTime = Date.now();
      
      try {
        spinner.start();
        result.status = "running";
        
        const taskResult = await task.task();
        const duration = Date.now() - taskStartTime;
        
        result.result = taskResult;
        result.duration = duration;
        result.status = "completed";
        
        const spinnerStatus = this.getSpinnerStatus(taskResult.status);
        spinner.stop(spinnerStatus, duration);
        
      } catch (error) {
        const duration = Date.now() - taskStartTime;
        
        result.error = error instanceof Error ? error.message : String(error);
        result.duration = duration;
        result.status = "failed";
        
        spinner.stop("error", duration);
      }
    }

    return Array.from(this.results.values());
  }

  /**
   * Convert monitoring result status to spinner status
   */
  private getSpinnerStatus(status: string): "success" | "warning" | "error" {
    switch (status) {
      case "healthy": return "success";
      case "warning": return "warning";
      case "critical":
      case "error":
      default:
        return "error";
    }
  }
}

/**
 * Helper function to create and execute parallel tasks
 */
export async function executeParallelTasks(
  tasks: ParallelTask[],
  sequential = false,
  silent = false
): Promise<DomainCheck[]> {
  const executor = new ParallelExecutor(silent);
  
  // Add all tasks
  for (const task of tasks) {
    executor.addTask(task);
  }
  
  // Execute
  if (sequential) {
    return await executor.executeSequentially();
  } else {
    return await executor.executeAll();
  }
}