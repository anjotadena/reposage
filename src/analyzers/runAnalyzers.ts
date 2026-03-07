/**
 * Runs all analyzers and produces the final AnalysisReport.
 */

import type { ScanResult } from "../models/ScanResult.js";
import type { AnalysisReport, DetectionOutputs } from "../models/index.js";

export async function runAnalyzers(
  scanResult: ScanResult,
  detectionOutputs: DetectionOutputs
): Promise<AnalysisReport> {
  const { ArchitectureAnalyzer } = await import("./ArchitectureAnalyzer.js");
  const { ModuleAnalyzer } = await import("./ModuleAnalyzer.js");
  const { SecurityAnalyzer } = await import("./SecurityAnalyzer.js");
  const { CodingConventionsAnalyzer } = await import("./CodingConventionsAnalyzer.js");

  const [architecture, modules, security, codingConventions] = await Promise.all([
    ArchitectureAnalyzer.analyze(scanResult, detectionOutputs),
    ModuleAnalyzer.analyze(scanResult, detectionOutputs),
    SecurityAnalyzer.analyze(scanResult, detectionOutputs),
    CodingConventionsAnalyzer.analyze(scanResult, detectionOutputs),
  ]);

  return {
    metadata: {
      generatedAt: new Date(),
      generatorVersion: "0.1.0",
      targetRepository: scanResult.rootPath,
      scanDurationMs: 0,
    },
    languages: detectionOutputs.languages,
    frameworks: detectionOutputs.frameworks,
    testFrameworks: detectionOutputs.testFrameworks,
    cicd: detectionOutputs.cicd,
    infrastructure: detectionOutputs.infrastructure,
    architecture,
    modules,
    entryPoints: detectionOutputs.entryPoints,
    apiRoutes: detectionOutputs.apiRoutes,
    databases: detectionOutputs.databases,
    security,
    codingConventions,
  };
}
