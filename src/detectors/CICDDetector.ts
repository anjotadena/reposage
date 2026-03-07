import path from "node:path";
import type { ScanResult } from "../models/ScanResult.js";
import type { DetectionResult } from "../models/DetectionResult.js";
import type { CICDInfo } from "../models/AnalysisReport.js";

export async function detect(scanResult: ScanResult): Promise<DetectionResult<CICDInfo[]>> {
  const result: CICDInfo[] = [];

  const workflows = scanResult.files.filter(
    (f) => f.relativePath.startsWith(".github/workflows/") && /\.(yml|yaml)$/.test(f.relativePath)
  );
  for (const w of workflows) {
    result.push({
      type: "GitHub Actions",
      path: w.relativePath,
      configFile: w.absolutePath,
    });
  }

  const gitlab = scanResult.files.find((f) => f.relativePath === ".gitlab-ci.yml");
  if (gitlab) {
    result.push({ type: "GitLab CI", path: ".gitlab-ci.yml", configFile: gitlab.absolutePath });
  }

  const azure = scanResult.files.find(
    (f) => f.relativePath === "azure-pipelines.yml" || f.relativePath === "azure-pipelines.yaml"
  );
  if (azure) {
    result.push({
      type: "Azure Pipelines",
      path: path.basename(azure.relativePath),
      configFile: azure.absolutePath,
    });
  }

  return {
    detector: "CICDDetector",
    data: result,
    confidence: result.length > 0 ? "high" : "low",
    evidence: result.map((r) => ({
      file: r.configFile ?? r.path,
      pattern: r.type,
      description: `Detected ${r.type}`,
    })),
  };
}
