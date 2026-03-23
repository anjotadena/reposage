import type { AnalysisReport } from "../models/index.js";

export interface StackProfile {
  isLaravel: boolean;
  isPhp: boolean;
  isNode: boolean;
  isPython: boolean;
  dependencyFiles: string[];
  lockFiles: string[];
  securityAuditCommands: string[];
  runtimeLabel: string;
}

function hasLanguage(report: AnalysisReport, languageName: string): boolean {
  return report.languages.data.some((lang) => lang.name.toLowerCase() === languageName.toLowerCase());
}

function hasFramework(report: AnalysisReport, frameworkName: string): boolean {
  return report.frameworks.data.some((fw) => fw.name.toLowerCase() === frameworkName.toLowerCase());
}

export function buildStackProfile(report: AnalysisReport): StackProfile {
  const isLaravel = hasFramework(report, "Laravel");
  const isPhp = hasLanguage(report, "PHP") || isLaravel;
  const isNode = hasLanguage(report, "JavaScript") || hasLanguage(report, "TypeScript");
  const isPython = hasLanguage(report, "Python");

  const dependencyFiles: string[] = [];
  const lockFiles: string[] = [];
  const securityAuditCommands: string[] = [];

  if (isPhp) {
    dependencyFiles.push("composer.json");
    lockFiles.push("composer.lock");
    securityAuditCommands.push("composer audit");
  }
  if (isNode) {
    dependencyFiles.push("package.json");
    lockFiles.push("package-lock.json", "pnpm-lock.yaml", "yarn.lock");
    securityAuditCommands.push("npm audit");
  }
  if (isPython) {
    dependencyFiles.push("requirements.txt", "pyproject.toml", "Pipfile");
    lockFiles.push("poetry.lock", "Pipfile.lock");
    securityAuditCommands.push("pip-audit");
  }

  if (dependencyFiles.length === 0) {
    dependencyFiles.push("dependency manifests detected in this repository");
  }
  if (lockFiles.length === 0) {
    lockFiles.push("available lockfiles in this repository");
  }
  if (securityAuditCommands.length === 0) {
    securityAuditCommands.push("ecosystem-specific security audit commands");
  }

  const runtimeParts: string[] = [];
  if (isLaravel) runtimeParts.push("Laravel");
  if (isPhp && !isLaravel) runtimeParts.push("PHP");
  if (isNode) runtimeParts.push("Node.js");
  if (isPython) runtimeParts.push("Python");

  return {
    isLaravel,
    isPhp,
    isNode,
    isPython,
    dependencyFiles: [...new Set(dependencyFiles)],
    lockFiles: [...new Set(lockFiles)],
    securityAuditCommands: [...new Set(securityAuditCommands)],
    runtimeLabel: runtimeParts.length > 0 ? runtimeParts.join(" / ") : "detected runtime",
  };
}
