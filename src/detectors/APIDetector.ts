import type { ScanResult } from "../models/ScanResult.js";
import type { DetectionResult } from "../models/DetectionResult.js";
import type { APIRouteInfo } from "../models/AnalysisReport.js";

export async function detect(scanResult: ScanResult): Promise<DetectionResult<APIRouteInfo[]>> {
  const result: APIRouteInfo[] = [];
  const routePatterns = [
    /\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]/g,
    /router\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]/g,
    /app\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]/g,
  ];

  for (const f of scanResult.files) {
    if (!/\.(ts|js|tsx|jsx)$/.test(f.extension)) continue;
    const fs = await import("node:fs");
    try {
      const content = fs.readFileSync(f.absolutePath, "utf-8");
      for (const re of routePatterns) {
        let m: RegExpExecArray | null;
        while ((m = re.exec(content)) !== null) {
          result.push({
            method: m[1]?.toUpperCase(),
            path: m[2] ?? "",
            file: f.relativePath,
          });
        }
      }
    } catch {
      // skip
    }
  }

  return {
    detector: "APIDetector",
    data: result,
    confidence: result.length > 0 ? "medium" : "low",
    evidence: result.slice(0, 5).map((r) => ({
      file: r.file,
      pattern: `${r.method ?? "?"} ${r.path}`,
      description: "API route",
    })),
  };
}
