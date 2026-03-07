/**
 * ripgrep (rg) subprocess wrapper. Degrades gracefully if rg is not in PATH.
 */

import { spawn } from "node:child_process";

let rgAvailable: boolean | null = null;

export async function isRipgrepAvailable(): Promise<boolean> {
  if (rgAvailable !== null) {
    return rgAvailable;
  }
  try {
    const result = await new Promise<boolean>((resolve) => {
      const proc = spawn("rg", ["--version"], { stdio: "ignore" });
      proc.on("close", (code) => resolve(code === 0));
      proc.on("error", () => resolve(false));
    });
    rgAvailable = result;
    return result;
  } catch {
    rgAvailable = false;
    return false;
  }
}

export interface RipgrepMatch {
  path: string;
  lineNumber: number;
  line: string;
}

export async function search(
  pattern: string,
  cwd: string,
  options: { type?: string; maxCount?: number } = {}
): Promise<RipgrepMatch[]> {
  const available = await isRipgrepAvailable();
  if (!available) {
    return [];
  }

  const args = [
    "--line-number",
    "--no-heading",
    "--no-color",
    "-e",
    pattern,
    "--",
    ".",
  ];
  if (options.type) {
    args.unshift("-t", options.type);
  }
  if (options.maxCount !== undefined) {
    args.unshift("-m", String(options.maxCount));
  }

  return new Promise((resolve) => {
    const proc = spawn("rg", args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    proc.stdout?.on("data", (d) => (stdout += d.toString()));
    proc.stderr?.on("data", (d) => (stderr += d.toString()));
    proc.on("close", (code) => {
      if (code !== 0 && code !== 1) {
        resolve([]);
        return;
      }
      const matches: RipgrepMatch[] = [];
      for (const line of stdout.trim().split("\n")) {
        if (!line) continue;
        const colonIdx = line.indexOf(":");
        if (colonIdx === -1) continue;
        const pathPart = line.slice(0, colonIdx);
        const rest = line.slice(colonIdx + 1);
        const lineNumIdx = pathPart.lastIndexOf(":");
        const filePath = lineNumIdx === -1 ? pathPart : pathPart.slice(0, lineNumIdx);
        const lineNum = lineNumIdx === -1 ? 0 : parseInt(pathPart.slice(lineNumIdx + 1), 10);
        matches.push({
          path: filePath,
          lineNumber: lineNum,
          line: rest.trim(),
        });
      }
      resolve(matches);
    });
    proc.on("error", () => resolve([]));
  });
}
