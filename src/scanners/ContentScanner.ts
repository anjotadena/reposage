/**
 * Lazy file content reader with LRU cache (max 50 MB).
 * Used by detectors to avoid re-reading files.
 */

import fs from "node:fs";
import path from "node:path";

const MAX_CACHE_BYTES = 50 * 1024 * 1024; // 50 MB

interface CacheEntry {
  content: string;
  sizeBytes: number;
  lastAccess: number;
}

export class ContentScanner {
  private cache = new Map<string, CacheEntry>();
  private totalBytes = 0;
  private rootPath: string;

  constructor(rootPath: string) {
    this.rootPath = path.resolve(rootPath);
  }

  read(relativePath: string): string | null {
    const absPath = path.join(this.rootPath, relativePath);
    const cached = this.cache.get(absPath);
    if (cached) {
      cached.lastAccess = Date.now();
      return cached.content;
    }
    try {
      const content = fs.readFileSync(absPath, "utf-8");
      const sizeBytes = Buffer.byteLength(content, "utf-8");
      this.evictIfNeeded(sizeBytes);
      this.cache.set(absPath, {
        content,
        sizeBytes,
        lastAccess: Date.now(),
      });
      this.totalBytes += sizeBytes;
      return content;
    } catch {
      return null;
    }
  }

  readAbsolute(absolutePath: string): string | null {
    const cached = this.cache.get(absolutePath);
    if (cached) {
      cached.lastAccess = Date.now();
      return cached.content;
    }
    try {
      const content = fs.readFileSync(absolutePath, "utf-8");
      const sizeBytes = Buffer.byteLength(content, "utf-8");
      this.evictIfNeeded(sizeBytes);
      this.cache.set(absolutePath, {
        content,
        sizeBytes,
        lastAccess: Date.now(),
      });
      this.totalBytes += sizeBytes;
      return content;
    } catch {
      return null;
    }
  }

  private evictIfNeeded(requiredBytes: number): void {
    while (this.totalBytes + requiredBytes > MAX_CACHE_BYTES && this.cache.size > 0) {
      let oldest: { key: string; access: number } | null = null;
      for (const [key, entry] of this.cache) {
        if (oldest === null || entry.lastAccess < oldest.access) {
          oldest = { key, access: entry.lastAccess };
        }
      }
      if (oldest) {
        const entry = this.cache.get(oldest.key)!;
        this.totalBytes -= entry.sizeBytes;
        this.cache.delete(oldest.key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
    this.totalBytes = 0;
  }
}
