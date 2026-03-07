/**
 * Flags security issues: hardcoded secrets, dangerous functions, auth patterns.
 */

import fs from "node:fs";
import type { ScanResult } from "../models/ScanResult.js";
import type { DetectionResult, DetectionOutputs } from "../models/index.js";
import type { SecurityFinding } from "../models/AnalysisReport.js";

const DANGEROUS_PATTERNS = [
  { pattern: /\beval\s*\(/g, category: "dangerous-function", severity: "high" as const },
  { pattern: /\bexec\s*\(/g, category: "dangerous-function", severity: "high" as const },
  {
    pattern: /(?:password|secret|api[_-]?key)\s*=\s*['"][^'"]{8,}['"]/gi,
    category: "hardcoded-secret",
    severity: "high" as const,
  },
];

export const SecurityAnalyzer = {
  async analyze(
    scanResult: ScanResult,
    _detectionOutputs: DetectionOutputs
  ): Promise<DetectionResult<SecurityFinding[]>> {
    const findings: SecurityFinding[] = [];
    const srcFiles = scanResult.files.filter((f) =>
      /\.(ts|tsx|js|jsx|py|cs|java|go|rs)$/.test(f.extension)
    );

    for (const f of srcFiles) {
      try {
        const content = fs.readFileSync(f.absolutePath, "utf-8");
        let lineNum = 0;
        for (const line of content.split("\n")) {
          lineNum++;
          for (const { pattern, category, severity } of DANGEROUS_PATTERNS) {
            pattern.lastIndex = 0;
            if (pattern.test(line)) {
              findings.push({
                severity,
                category,
                description: `Potential ${category} in ${f.relativePath}`,
                file: f.relativePath,
                line: lineNum,
              });
            }
          }
        }
      } catch {
        // skip unreadable
      }
    }

    return {
      detector: "SecurityAnalyzer",
      data: findings.slice(0, 20),
      confidence: findings.length > 0 ? "medium" : "low",
      evidence: findings.slice(0, 5).map((x) => ({
        file: x.file ?? "",
        pattern: x.category,
        description: x.description,
      })),
    };
  },
};
