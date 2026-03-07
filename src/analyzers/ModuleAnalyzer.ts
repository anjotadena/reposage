/**
 * Builds module dependency graph from import analysis.
 */

import path from "node:path";
import fs from "node:fs";
import type { ScanResult } from "../models/ScanResult.js";
import type { DetectionResult, DetectionOutputs } from "../models/index.js";
import type { ModuleInfo } from "../models/AnalysisReport.js";

const IMPORT_REGEX = /(?:import|from)\s+['"]([^'"]+)['"]|require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

function resolveImportPath(imp: string, filePath: string): string | null {
  if (imp.startsWith(".")) {
    const dir = path.dirname(filePath);
    const resolved = path.join(dir, imp);
    return path.normalize(resolved).replace(/\.(ts|tsx|js|jsx|mjs|cjs)$/, "");
  }
  return imp.split("/")[0];
}

export const ModuleAnalyzer = {
  async analyze(
    scanResult: ScanResult,
    _detectionOutputs: DetectionOutputs
  ): Promise<DetectionResult<ModuleInfo[]>> {
    const modules = new Map<string, ModuleInfo>();

    const srcFiles = scanResult.files.filter(
      (f) =>
        /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(f.extension) && !f.relativePath.includes("node_modules")
    );

    for (const f of srcFiles) {
      const modulePath = f.relativePath.replace(/\.(ts|tsx|js|jsx|mjs|cjs)$/, "");
      if (!modules.has(modulePath)) {
        modules.set(modulePath, {
          name: path.basename(modulePath),
          path: modulePath,
          entryPoints: [],
          dependencies: [],
        });
      }
      const info = modules.get(modulePath)!;

      const content = fs.readFileSync(f.absolutePath, "utf-8").slice(0, 4096);
      let m: RegExpExecArray | null;
      while ((m = IMPORT_REGEX.exec(content)) !== null) {
        const imp = m[1] ?? m[2];
        if (!imp || imp.startsWith("node:")) continue;
        const depPath = resolveImportPath(imp, f.relativePath);
        if (depPath && !info.dependencies.includes(depPath)) {
          info.dependencies.push(depPath);
        }
      }
    }

    const data = Array.from(modules.values()).slice(0, 50);
    return {
      detector: "ModuleAnalyzer",
      data,
      confidence: data.length > 0 ? "medium" : "low",
      evidence: data.slice(0, 5).map((m) => ({
        file: m.path,
        pattern: "module",
        description: `Module: ${m.name}`,
      })),
    };
  },
};
