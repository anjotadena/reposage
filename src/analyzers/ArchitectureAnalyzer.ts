/**
 * Infers architecture style from framework and module detection results.
 */

import type { ScanResult } from "../models/ScanResult.js";
import type { DetectionResult, DetectionOutputs } from "../models/index.js";
import type { ArchitectureInfo, ArchitectureStyle } from "../models/AnalysisReport.js";

const FRAMEWORK_ARCH: Record<string, ArchitectureStyle> = {
  "Next.js": "Layered",
  NestJS: "Layered",
  Express: "Monolith",
  Fastify: "Monolith",
  React: "MVC",
  Vue: "MVC",
};

export const ArchitectureAnalyzer = {
  async analyze(
    _scanResult: ScanResult,
    detectionOutputs: DetectionOutputs
  ): Promise<DetectionResult<ArchitectureInfo>> {
    const frameworks = detectionOutputs.frameworks.data;
    let style: ArchitectureStyle = "Unknown";
    const evidence: Array<{ file: string; pattern: string; description: string }> = [];

    for (const fw of frameworks) {
      const inferred = FRAMEWORK_ARCH[fw.name];
      if (inferred) {
        style = inferred;
        evidence.push(...fw.evidence);
        break;
      }
    }

    const description =
      style !== "Unknown"
        ? `Inferred from framework: ${frameworks.map((f) => f.name).join(", ")}`
        : "No architecture pattern inferred from detected frameworks";

    return {
      detector: "ArchitectureAnalyzer",
      data: { style, description },
      confidence: style !== "Unknown" ? "medium" : "low",
      evidence,
    };
  },
};
