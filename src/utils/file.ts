/**
 * File system and path helpers.
 */

import fs from "node:fs";
import path from "node:path";

export function readFileSafe(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

export function existsSync(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function isDirectory(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch {
    return false;
  }
}

export function resolvePath(...segments: string[]): string {
  return path.resolve(...segments);
}

export function joinPath(...segments: string[]): string {
  return path.join(...segments);
}

export function relativePath(from: string, to: string): string {
  return path.relative(from, to);
}

export function extname(filePath: string): string {
  return path.extname(filePath);
}

export function dirname(filePath: string): string {
  return path.dirname(filePath);
}

export function basename(filePath: string, ext?: string): string {
  return path.basename(filePath, ext);
}
