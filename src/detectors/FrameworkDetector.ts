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
      const pkg = JSON.parse(raw) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
      const known: Record<string, { name: string; category: FrameworkInfo["category"] }> = {
        react: { name: "React", category: "frontend" },
        next: { name: "Next.js", category: "frontend" },
        vue: { name: "Vue", category: "frontend" },
        express: { name: "Express", category: "backend" },
        fastify: { name: "Fastify", category: "backend" },
        nest: { name: "NestJS", category: "backend" },
      };
      for (const [dep, meta] of Object.entries(known)) {
        if (deps[dep]) {
          result.push({
            name: meta.name,
            category: meta.category,
            version: deps[dep],
            confidence: "high",
            evidence: [{ file: pkgPath, pattern: dep, description: `Found in dependencies` }],
          });
        }
      }
    } catch {
      // ignore parse errors
    }
  }

  const composerPath = scanResult.keyFiles["composer.json"];
  if (composerPath) {
    const fs = await import("node:fs");
    try {
      const raw = fs.readFileSync(composerPath, "utf-8");
      const composer = JSON.parse(raw) as {
        require?: Record<string, string>;
      };
      const deps = composer.require ?? {};
      if (deps["laravel/framework"] || deps["laravel/laravel"]) {
        result.push({
          name: "Laravel",
          category: "backend",
          version: deps["laravel/framework"] ?? deps["laravel/laravel"],
          confidence: "high",
          evidence: [
            {
              file: composerPath,
              pattern: "laravel/framework",
              description: "Found in composer require dependencies",
            },
          ],
        });
      }
    } catch {
      // ignore parse errors
    }
  }
  return {
    detector: "FrameworkDetector",
    data: result,
    confidence: result.length > 0 ? "high" : "low",
    evidence: [],
  };
}
