/**
 * Phase 1 output — raw file system scan results.
 */

export interface FileEntry {
  absolutePath: string;
  relativePath: string;
  extension: string;
  sizeBytes: number;
}

export interface ScanStats {
  totalFiles: number;
  totalBytes: number;
  scannedAt: Date;
}

export interface ScanResult {
  rootPath: string;
  files: FileEntry[];
  keyFiles: Record<string, string>;
  stats: ScanStats;
}
