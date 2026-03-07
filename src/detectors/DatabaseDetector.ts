import type { ScanResult } from "../models/ScanResult.js";
import type { DetectionResult } from "../models/DetectionResult.js";
import type { DatabaseInfo } from "../models/AnalysisReport.js";

export async function detect(scanResult: ScanResult): Promise<DetectionResult<DatabaseInfo[]>> {
  const result: DatabaseInfo[] = [];
  const patterns: Array<{ type: string; regex: RegExp }> = [
    { type: "PostgreSQL", regex: /postgres|pg\.|pgclient/i },
    { type: "MySQL", regex: /mysql|mysql2/i },
    { type: "SQLite", regex: /sqlite|better-sqlite3/i },
    { type: "MongoDB", regex: /mongodb|mongoose/i },
    { type: "Redis", regex: /redis|ioredis/i },
  ];

  for (const f of scanResult.files) {
    if (!/\.(ts|js|tsx|jsx|py|cs|java|go|rs)$/.test(f.extension)) continue;
    const fs = await import("node:fs");
    try {
      const content = fs.readFileSync(f.absolutePath, "utf-8");
      for (const { type, regex } of patterns) {
        if (regex.test(content)) {
          const existing = result.find((r) => r.type === type);
          if (existing) {
            existing.evidence.push(`${f.relativePath}`);
          } else {
            result.push({ type, evidence: [f.relativePath] });
          }
        }
      }
    } catch {
      // skip unreadable
    }
  }

  return {
    detector: "DatabaseDetector",
    data: result,
    confidence: result.length > 0 ? "medium" : "low",
    evidence: result.flatMap((r) => r.evidence.map((e) => ({ file: e, pattern: r.type, description: `Database usage: ${r.type}` }))),
  };
}
