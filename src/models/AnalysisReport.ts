/**
 * Phase 5 input — the unified analysis report consumed by generators.
 */

import type { ConfidenceLevel, DetectionResult, Evidence } from "./DetectionResult.js";

export interface LanguageInfo {
  name: string;
  extensions: string[];
  fileCount: number;
  percentage: number;
}

export type FrameworkCategory = "frontend" | "backend" | "testing" | "build" | "infra" | "other";

export interface FrameworkInfo {
  name: string;
  category: FrameworkCategory;
  version?: string;
  confidence: ConfidenceLevel;
  evidence: Evidence[];
}

export interface CICDInfo {
  type: string;
  path: string;
  configFile?: string;
}

export interface InfrastructureInfo {
  docker: boolean;
  dockerCompose: boolean;
  terraform: boolean;
  kubernetes: boolean;
  files: string[];
}

export type ArchitectureStyle =
  | "MVC"
  | "Layered"
  | "Clean"
  | "Hexagonal"
  | "Microservices"
  | "Monolith"
  | "Unknown";

export interface ArchitectureInfo {
  style: ArchitectureStyle;
  description?: string;
}

export interface ModuleInfo {
  name: string;
  path: string;
  entryPoints: string[];
  dependencies: string[];
}

export interface EntryPointInfo {
  type: string;
  path: string;
  description?: string;
}

export interface APIRouteInfo {
  method?: string;
  path: string;
  file: string;
  line?: number;
}

export interface DatabaseInfo {
  type: string;
  evidence: string[];
}

export interface SecurityFinding {
  severity: "high" | "medium" | "low";
  category: string;
  description: string;
  file?: string;
  line?: number;
}

export interface CodingConventions {
  eslint: boolean;
  prettier: boolean;
  editorConfig: boolean;
  husky: boolean;
  strictTypeScript: boolean;
  configFiles: string[];
}

export interface AnalysisReportMetadata {
  generatedAt: Date;
  generatorVersion: string;
  targetRepository: string;
  scanDurationMs: number;
}

export interface AnalysisReport {
  metadata: AnalysisReportMetadata;
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
