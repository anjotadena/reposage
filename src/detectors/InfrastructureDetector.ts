import type { ScanResult } from "../models/ScanResult.js";
import type { DetectionResult } from "../models/DetectionResult.js";
import type { InfrastructureInfo } from "../models/AnalysisReport.js";

export async function detect(scanResult: ScanResult): Promise<DetectionResult<InfrastructureInfo>> {
  const files: string[] = [];
  let docker = false;
  let dockerCompose = false;
  let terraform = false;
  let kubernetes = false;

  for (const f of scanResult.files) {
    const base = f.relativePath.split("/").pop() ?? "";
    if (base === "Dockerfile") {
      docker = true;
      files.push(f.relativePath);
    } else if (/^docker-compose\.(yml|yaml)$/.test(base)) {
      dockerCompose = true;
      files.push(f.relativePath);
    } else if (f.extension === "tf" || base.endsWith(".tf.json")) {
      terraform = true;
      files.push(f.relativePath);
    } else if (
      f.relativePath.includes("k8s") ||
      f.relativePath.includes("kubernetes") ||
      (/\.(yaml|yml)$/.test(f.extension) &&
        (f.relativePath.includes("deployment") || f.relativePath.includes("service")))
    ) {
      kubernetes = true;
      files.push(f.relativePath);
    }
  }

  return {
    detector: "InfrastructureDetector",
    data: {
      docker,
      dockerCompose,
      terraform,
      kubernetes,
      files,
    },
    confidence: files.length > 0 ? "high" : "low",
    evidence: files.map((f) => ({
      file: f,
      pattern: "file",
      description: "Infrastructure file detected",
    })),
  };
}
