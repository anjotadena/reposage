import type { ScanResult } from "../models/ScanResult.js";
import type { DetectionResult } from "../models/DetectionResult.js";
import type { EntryPointInfo } from "../models/AnalysisReport.js";

export async function detect(scanResult: ScanResult): Promise<DetectionResult<EntryPointInfo[]>> {
  const result: EntryPointInfo[] = [];
  const pkgPath = scanResult.keyFiles["package.json"];
  if (pkgPath) {
    const fs = await import("node:fs");
    try {
      const raw = fs.readFileSync(pkgPath, "utf-8");
      const pkg = JSON.parse(raw) as {
        main?: string;
        bin?: string | Record<string, string>;
        name?: string;
      };
      if (pkg.main) {
        result.push({
          type: "main",
          path: pkg.main,
          description: "package.json main field",
        });
      }
      if (pkg.bin) {
        const bins =
          typeof pkg.bin === "string" ? { [pkg.name ?? "cli"]: pkg.bin } : pkg.bin;
        for (const [name, entry] of Object.entries(bins)) {
          result.push({
            type: "bin",
            path: String(entry),
            description: `CLI: ${name}`,
          });
        }
      }
    } catch {
      // ignore
    }
  }

  const programCs = scanResult.files.find((f) => f.relativePath.endsWith("Program.cs"));
  if (programCs) {
    result.push({ type: "aspnet", path: programCs.relativePath, description: "ASP.NET entry" });
  }

  const mainPy = scanResult.files.find((f) => f.relativePath === "main.py" || f.relativePath.endsWith("/main.py"));
  if (mainPy) {
    result.push({ type: "python", path: mainPy.relativePath, description: "Python main" });
  }

  return {
    detector: "EntryPointDetector",
    data: result,
    confidence: result.length > 0 ? "high" : "low",
    evidence: result.map((r) => ({
      file: r.path,
      pattern: r.type,
      description: r.description ?? "",
    })),
  };
}
