/**
 * Detects ESLint, Prettier, EditorConfig, Husky, strict TypeScript.
 */

import fs from "node:fs";
import type { ScanResult } from "../models/ScanResult.js";
import type { DetectionResult, DetectionOutputs } from "../models/index.js";
import type { CodingConventions } from "../models/AnalysisReport.js";

export const CodingConventionsAnalyzer = {
  async analyze(
    scanResult: ScanResult,
    _detectionOutputs: DetectionOutputs
  ): Promise<DetectionResult<CodingConventions>> {
    const configFiles: string[] = [];
    for (const f of scanResult.files) {
      const name = f.relativePath.toLowerCase();
      if (
        name === ".eslintrc" ||
        name === ".eslintrc.json" ||
        name === ".eslintrc.js" ||
        name.endsWith("eslint.config.js") ||
        name === ".prettierrc" ||
        name === ".prettierrc.json" ||
        name === ".editorconfig" ||
        name === ".husky/pre-commit"
      ) {
        configFiles.push(f.relativePath);
      }
    }
    return {
      detector: "CodingConventionsAnalyzer",
      data: {
        eslint: configFiles.some((f) => f.includes("eslint")),
        prettier: configFiles.some((f) => f.includes("prettier")),
        editorConfig: configFiles.some((f) => f.includes("editorconfig")),
        husky: configFiles.some((f) => f.includes("husky")),
        strictTypeScript: (() => {
          const tsconfig = scanResult.files.find(
            (f) => f.relativePath === "tsconfig.json" || f.relativePath.endsWith("/tsconfig.json")
          );
          if (!tsconfig) return false;
          try {
            const raw = fs.readFileSync(tsconfig.absolutePath, "utf-8");
            const cfg = JSON.parse(raw) as { compilerOptions?: { strict?: boolean } };
            return cfg.compilerOptions?.strict === true;
          } catch {
            return false;
          }
        })(),
        configFiles,
      },
      confidence: configFiles.length > 0 ? "medium" : "low",
      evidence: configFiles.map((f) => ({
        file: f,
        pattern: "config file",
        description: "Configuration file detected",
      })),
    };
  },
};
