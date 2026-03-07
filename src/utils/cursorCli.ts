/**
 * Cursor CLI integration for AI-powered generation.
 * Spawns `agent -p "..." --model "gpt-5.2" --output-format text` for non-interactive generation.
 */

import { spawn } from "node:child_process";
import path from "node:path";

const DEFAULT_MODEL = "gpt-5.2";

export interface CursorCLIOptions {
  model?: string;
  workspace?: string;
}

/**
 * Runs Cursor CLI agent with the given prompt and returns stdout.
 * Requires `agent` (Cursor CLI) to be installed and authenticated.
 */
export async function runAgent(prompt: string, options: CursorCLIOptions = {}): Promise<string> {
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
      "--trust",
    ];

    const proc = spawn("agent", args, {
      stdio: ["pipe", "pipe", "pipe"],
      shell: false,
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
          new Error(`Cursor CLI exited with code ${code}. ${stderr ? `stderr: ${stderr}` : ""}`)
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

export interface CursorCLICheckResult {
  ok: boolean;
  error?: "not-installed" | "not-logged-in";
  message?: string;
}

const INSTALL_INSTRUCTIONS = `Install Cursor CLI:
  macOS, Linux, WSL: curl https://cursor.com/install -fsS | bash
  Windows PowerShell: irm 'https://cursor.com/install?win32=true' | iex`;

const LOGIN_INSTRUCTIONS = `Log in to your Cursor account:
  agent login`;

/**
 * Verifies Cursor CLI is installed and the user is logged in.
 * Use this before AI-powered generation.
 */
export async function checkCursorCLIReady(): Promise<CursorCLICheckResult> {
  const installed = await isCursorCLIAvailable();
  if (!installed) {
    return {
      ok: false,
      error: "not-installed",
      message: `Cursor CLI (agent) is not installed. ${INSTALL_INSTRUCTIONS}`,
    };
  }

  const loggedIn = await isCursorCLILoggedIn();
  if (!loggedIn) {
    return {
      ok: false,
      error: "not-logged-in",
      message: `Cursor CLI is installed but you are not logged in. ${LOGIN_INSTRUCTIONS}`,
    };
  }

  return { ok: true };
}

/**
 * Checks if the user is authenticated with Cursor CLI.
 * Runs `agent status` and parses the output.
 */
async function isCursorCLILoggedIn(): Promise<boolean> {
  return new Promise((resolve) => {
    let stdout = "";
    const proc = spawn("agent", ["status"], {
      stdio: ["pipe", "pipe", "pipe"],
      shell: true,
    });

    proc.stdout?.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf-8");
    });

    proc.on("error", () => resolve(false));
    proc.on("close", (code) => {
      if (code !== 0) {
        resolve(false);
        return;
      }
      const lower = stdout.toLowerCase();
      const notAuthenticated =
        lower.includes("not authenticated") ||
        lower.includes("not logged in") ||
        lower.includes("login required") ||
        lower.includes("please log in");
      resolve(!notAuthenticated);
    });
  });
}
