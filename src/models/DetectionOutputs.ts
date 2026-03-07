/**
 * Aggregated output from all detectors, consumed by analyzers.
 */

import type { DetectionResult } from "./DetectionResult.js";
import type {
  LanguageInfo,
  FrameworkInfo,
  CICDInfo,
  InfrastructureInfo,
  ArchitectureInfo,
  ModuleInfo,
  EntryPointInfo,
  APIRouteInfo,
  DatabaseInfo,
  SecurityFinding,
  CodingConventions,
} from "./AnalysisReport.js";

export interface DetectionOutputs {
  languages: DetectionResult<LanguageInfo[]>;
  frameworks: DetectionResult<FrameworkInfo[]>;
  testFrameworks: DetectionResult<FrameworkInfo[]>;
  cicd: DetectionResult<CICDInfo[]>;
  infrastructure: DetectionResult<InfrastructureInfo>;
  architecture: DetectionResult<ArchitectureInfo>;
  modules: DetectionResult<ModuleInfo[]>;
  entryPoints: DetectionResult<EntryPointInfo[]>;
  apiRoutes: DetectionResult<APIRouteInfo[]>;
  databases: DetectionResult<DatabaseInfo[]>;
  security: DetectionResult<SecurityFinding[]>;
  codingConventions: DetectionResult<CodingConventions>;
}
