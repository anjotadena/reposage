import type { ScanResult } from "../models/ScanResult.js";
import type { DetectionResult } from "../models/DetectionResult.js";
import type { FrameworkInfo } from "../models/AnalysisReport.js";

export async function detect(scanResult: ScanResult): Promise<DetectionResult<FrameworkInfo[]>> {
  const result: FrameworkInfo[] = [];
  const pkgPath = scanResult.keyFiles["package.json"];
  if (pkgPath) {
    const fs = await import("node:fs");
    try {
      const raw = fs.readFileSync(pkgPath, "utf-8");
      const pkg = JSON.parse(raw) as { devDependencies?: Record<string, string> };
      const dev = pkg.devDependencies ?? {};
      const known: Record<string, string> = {
        jest: "Jest",
        vitest: "Vitest",
        mocha: "Mocha",
        "react-testing-library": "React Testing Library",
        "@testing-library/react": "React Testing Library",
      };
      for (const [dep, name] of Object.entries(known)) {
        if (dev[dep]) {
          result.push({
            name,
            category: "testing",
            version: dev[dep],
            confidence: "high",
            evidence: [{ file: pkgPath, pattern: dep, description: `Found in devDependencies` }],
          });
        }
      }
    } catch {
      // ignore
    }
  }
  return {
    detector: "TestFrameworkDetector",
    data: result,
    confidence: result.length > 0 ? "high" : "low",
    evidence: [],
  };
}
