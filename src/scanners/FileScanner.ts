/**
 * Phase 1: File system traversal using fast-glob.
 * Produces ScanResult with file entries and keyFiles map.
 */

import fg from "fast-glob";
import path from "node:path";
import fs from "node:fs";
import type { FileEntry, ScanResult } from "../models/ScanResult.js";

const DEFAULT_IGNORE = [
  "**/node_modules/**",
  "**/.git/**",
  "**/dist/**",
  "**/build/**",
  "**/.next/**",
  "**/out/**",
  "**/.turbo/**",
];

const KEY_FILE_PATTERNS: Record<string, string> = {
  "package.json": "**/package.json",
  "package-lock.json": "**/package-lock.json",
  "pnpm-lock.yaml": "**/pnpm-lock.yaml",
  "yarn.lock": "**/yarn.lock",
  "requirements.txt": "**/requirements.txt",
  "go.mod": "**/go.mod",
  "Cargo.toml": "**/Cargo.toml",
  "Dockerfile": "**/Dockerfile",
  "docker-compose.yml": "**/docker-compose.yml",
  "docker-compose.yaml": "**/docker-compose.yaml",
  ".github/workflows": "**/.github/workflows/*.yml",
};

export class FileScanner {
  constructor(
    private rootPath: string,
    private ignore: string[] = DEFAULT_IGNORE
  ) {}

  async scan(): Promise<ScanResult> {
    const absRoot = path.resolve(this.rootPath);

    const allPatterns = ["**/*"];
    const entries = await fg(allPatterns, {
      cwd: absRoot,
      absolute: true,
      ignore: this.ignore,
      dot: true,
      onlyFiles: true,
    });

    const files: FileEntry[] = [];
    let totalBytes = 0;
    const keyFiles: Record<string, string> = {};

    for (const absPath of entries) {
      const relPath = path.relative(absRoot, absPath);
      const ext = path.extname(absPath).slice(1) || "";
      let sizeBytes = 0;
      try {
        const stat = fs.statSync(absPath);
        sizeBytes = stat.size;
      } catch {
        // skip if unreadable
      }
      totalBytes += sizeBytes;
      files.push({
        absolutePath: absPath,
        relativePath: relPath,
        extension: ext,
        sizeBytes,
      });
    }

    for (const [key, pattern] of Object.entries(KEY_FILE_PATTERNS)) {
      const matches = await fg(pattern, {
        cwd: absRoot,
        absolute: true,
        ignore: this.ignore,
        onlyFiles: true,
      });
      if (matches.length > 0) {
        keyFiles[key] = matches[0];
      }
    }

    return {
      rootPath: absRoot,
      files,
      keyFiles,
      stats: {
        totalFiles: files.length,
        totalBytes,
        scannedAt: new Date(),
      },
    };
  }
}
