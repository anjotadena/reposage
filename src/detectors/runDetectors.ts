/**
 * Runs all detectors in parallel and returns aggregated detection outputs.
 */

import type { ScanResult } from "../models/ScanResult.js";
import type { DetectionResult } from "../models/DetectionResult.js";
import type { DetectionOutputs } from "../models/DetectionOutputs.js";

function emptyDetection<T>(detector: string, data: T): DetectionResult<T> {
  return {
    detector,
    data,
    confidence: "low",
    evidence: [],
  };
}

export async function runDetectors(scanResult: ScanResult): Promise<DetectionOutputs> {
  const [
    LanguageDetector,
    FrameworkDetector,
    TestFrameworkDetector,
    CICDDetector,
    InfrastructureDetector,
    DatabaseDetector,
    EntryPointDetector,
    APIDetector,
  ] = await Promise.all([
    import("./LanguageDetector.js"),
    import("./FrameworkDetector.js"),
    import("./TestFrameworkDetector.js"),
    import("./CICDDetector.js"),
    import("./InfrastructureDetector.js"),
    import("./DatabaseDetector.js"),
    import("./EntryPointDetector.js"),
    import("./APIDetector.js"),
  ]);

  const [
    languages,
    frameworks,
    testFrameworks,
    cicd,
    infrastructure,
    databases,
    entryPoints,
    apiRoutes,
  ] = await Promise.all([
    LanguageDetector.detect(scanResult),
    FrameworkDetector.detect(scanResult),
    TestFrameworkDetector.detect(scanResult),
    CICDDetector.detect(scanResult),
    InfrastructureDetector.detect(scanResult),
    DatabaseDetector.detect(scanResult),
    EntryPointDetector.detect(scanResult),
    APIDetector.detect(scanResult),
  ]);

  return {
    languages,
    frameworks,
    testFrameworks,
    cicd,
    infrastructure,
    architecture: emptyDetection("ArchitectureAnalyzer", {
      style: "Unknown",
      description: "Architecture classification deferred to analyzers",
    }),
    modules: emptyDetection("ModuleAnalyzer", []),
    entryPoints,
    apiRoutes,
    databases,
    security: emptyDetection("SecurityAnalyzer", []),
    codingConventions: emptyDetection("CodingConventionsAnalyzer", {
      eslint: false,
      prettier: false,
      editorConfig: false,
      husky: false,
      strictTypeScript: false,
      configFiles: [],
    }),
  };
}
