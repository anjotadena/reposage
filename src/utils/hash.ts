/**
 * Deterministic fingerprinting for repository state.
 */

import { createHash } from "node:crypto";

export function hashString(input: string): string {
  return createHash("sha256").update(input, "utf-8").digest("hex").slice(0, 16);
}

export function hashObject(obj: unknown): string {
  const str = JSON.stringify(obj, Object.keys(obj as object).sort());
  return hashString(str);
}
