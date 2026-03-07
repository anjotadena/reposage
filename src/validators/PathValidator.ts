/**
 * Validates repository paths for scanning.
 */

import fs from "node:fs";
import path from "node:path";

export interface PathValidationResult {
  valid: boolean;
  resolvedPath?: string;
  error?: string;
}

export function validatePath(inputPath: string): PathValidationResult {
  const resolved = path.resolve(inputPath);
  try {
    const stat = fs.statSync(resolved);
    if (!stat.isDirectory()) {
      return { valid: false, error: `Path is not a directory: ${resolved}` };
    }
    return { valid: true, resolvedPath: resolved };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { valid: false, error: `Cannot access path: ${msg}` };
  }
}

export const PathValidator = {
  validate(inputPath: string): PathValidationResult {
    return validatePath(inputPath);
  },
};
