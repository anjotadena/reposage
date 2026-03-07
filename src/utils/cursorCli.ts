/**
 * Cursor CLI integration for AI-powered generation.
 * Spawns `agent -p "..." --model "gpt-5" --output-format text` for non-interactive generation.
 */

import { spawn } from "node:child_process";
import path from "node:path";

const DEFAULT_MODEL = "gpt-5";

export interface CursorCLIOptions {
  model?: string;
  workspace?: string;
}

/**
 * Runs Cursor CLI agent with the given prompt and returns stdout.
 * Requires `agent` (Cursor CLI) to be installed and authenticated.
 */
export async function runAgent(
  prompt: string,
  options: CursorCLIOptions = {}
): Promise<string> {
  const model = options.model ?? DEFAULT_MODEL;
  const workspace = options.workspace ? path.resolve(options.workspace) : process.cwd();

  return new Promise((resolve, reject) => {
    const args = [
      "-p",
      prompt,
      "--model",
      model,
      "--output-format",
      "text",
      "--workspace",
      workspace,
    ];

    const proc = spawn("agent", args, {
      stdio: ["pipe", "pipe", "pipe"],
      shell: true,
    });

    let stdout = "";
    let stderr = "";

    proc.stdout?.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf-8");
    });

    proc.stderr?.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf-8");
    });

    proc.on("error", (err) => {
      reject(new Error(`Cursor CLI not found or failed to start: ${err.message}`));
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `Cursor CLI exited with code ${code}. ${stderr ? `stderr: ${stderr}` : ""}`
          )
        );
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

/**
 * Checks if Cursor CLI (agent) is available in PATH.
 */
export async function isCursorCLIAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    const proc = spawn("agent", ["--version"], {
      stdio: "ignore",
      shell: true,
    });
    proc.on("error", () => resolve(false));
    proc.on("close", (code) => resolve(code === 0));
  });
}
