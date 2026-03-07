/**
 * AI-powered generation via Cursor CLI.
 * Uses GPT-5 (or configured model) to generate rules, commands, and context docs.
 */

import type { AnalysisReport } from "../models/index.js";
import { runAgent } from "../utils/cursorCli.js";

const DEFAULT_MODEL = "gpt-5";

function serializeReport(report: AnalysisReport): string {
  const copy = JSON.parse(
    JSON.stringify(report, (_, v) => (v instanceof Date ? v.toISOString() : v))
  );
  return JSON.stringify(copy, null, 2);
}

function buildArtifactPrompt(
  artifactType: string,
  artifactName: string,
  report: AnalysisReport,
  instructions: string
): string {
  const reportJson = serializeReport(report);
  return `You are generating a Cursor developer context artifact for a repository.

Artifact type: ${artifactType}
Artifact name: ${artifactName}

${instructions}

Repository analysis report (use this as the sole source of truth; do not invent facts):
\`\`\`json
${reportJson}
\`\`\`

Output ONLY the raw file content. No explanations, no markdown code fences around the output, no preamble. Start directly with the file content (e.g. frontmatter for .mdc, or the first line of the document).`;
}

const RULE_INSTRUCTIONS: Record<string, string> = {
  "00-repo-baseline":
    "Generate a Cursor rule file (.mdc) that establishes the repository baseline. Include YAML frontmatter with description and globs: *. Use concise bullet points for: detected stack (languages, frameworks), architecture, and conventions to follow. End with a brief 'Follow existing patterns' section.",
  "10-architecture":
    "Generate a Cursor rule file (.mdc) for architecture context. Frontmatter: description, globs: *. Describe the inferred architecture style, key modules, entry points, and how components connect. Be evidence-based; only state what the report supports.",
  "20-testing-strategy":
    "Generate a Cursor rule file (.mdc) for testing strategy. Frontmatter: description, globs: *. List detected test frameworks, test file patterns, and recommendations for adding tests. Include confidence level from the report.",
  "30-security":
    "Generate a Cursor rule file (.mdc) for security context. Frontmatter: description, globs: *. Summarize security findings (if any), dangerous patterns to avoid, and security conventions. Be concise.",
  "40-tech-stack":
    "Generate a Cursor rule file (.mdc) for tech stack context. Frontmatter: description, globs: *. List languages, frameworks, databases, CI/CD, infrastructure. Include versions where available. Keep it scannable.",
};

const COMMAND_INSTRUCTIONS: Record<string, string> = {
  "explain-repo":
    "Generate a Cursor command file (.md) that instructs the AI to explain the repository to a developer. The command should: 1) Reference the analysis report context, 2) Ask the AI to summarize structure, entry points, and key modules, 3) Be concise (under 30 lines).",
  "trace-feature":
    "Generate a Cursor command file (.md) for tracing a feature through the codebase. The command should ask the AI to trace from entry point to data layer using the module/API info in the report.",
  "create-test-plan":
    "Generate a Cursor command file (.md) for creating a test plan. Reference detected test frameworks and modules. The command should guide the AI to propose tests for a given module or feature.",
  "document-module":
    "Generate a Cursor command file (.md) for documenting a module. Use the module index from the report. The command should ask the AI to document a specified module with its dependencies and purpose.",
  "review-risk":
    "Generate a Cursor command file (.md) for risk review. Reference security findings and architecture. The command should guide the AI to review code changes for security and architectural risks.",
};

const DOC_INSTRUCTIONS: Record<string, string> = {
  "repo-map":
    "Generate docs/context/repo-map.md. A high-level map of the repository: top-level directories, key files, and how they relate. Use the report's modules and entry points. Bullet format.",
  "architecture-overview":
    "Generate docs/context/architecture-overview.md. Describe the architecture style, layers, and component relationships. Evidence-based only.",
  "module-index":
    "Generate docs/context/module-index.md. List modules from the report with paths and dependencies. Table or bullet list.",
  "coding-conventions":
    "Generate docs/context/coding-conventions.md. List detected tools (ESLint, Prettier, etc.) and config files. Brief conventions to follow.",
  "testing-strategy":
    "Generate docs/context/testing-strategy.md. Test frameworks, patterns, and how to add tests. Reference the report.",
  glossary:
    "Generate docs/context/glossary.md. Define key terms, acronyms, and concepts used in this codebase based on the report.",
  "known-risks":
    "Generate docs/context/known-risks.md. List security findings and architectural risks from the report. If none, state 'No known risks detected.'",
};

export interface AIGenerationOptions {
  model?: string;
  workspace: string;
  force?: boolean;
}

export async function generateRuleViaAI(
  report: AnalysisReport,
  ruleName: string,
  options: AIGenerationOptions
): Promise<string> {
  const instructions = RULE_INSTRUCTIONS[ruleName] ?? "Generate a Cursor rule file.";
  const prompt = buildArtifactPrompt("Cursor rule", `${ruleName}.mdc`, report, instructions);
  return runAgent(prompt, {
    model: options.model ?? DEFAULT_MODEL,
    workspace: options.workspace,
  });
}

export async function generateCommandViaAI(
  report: AnalysisReport,
  commandName: string,
  options: AIGenerationOptions
): Promise<string> {
  const instructions =
    COMMAND_INSTRUCTIONS[commandName] ?? "Generate a Cursor command file (.md).";
  const prompt = buildArtifactPrompt("Cursor command", `${commandName}.md`, report, instructions);
  return runAgent(prompt, {
    model: options.model ?? DEFAULT_MODEL,
    workspace: options.workspace,
  });
}

export async function generateContextDocViaAI(
  report: AnalysisReport,
  docName: string,
  options: AIGenerationOptions
): Promise<string> {
  const instructions = DOC_INSTRUCTIONS[docName] ?? "Generate context documentation.";
  const prompt = buildArtifactPrompt("Context doc", `${docName}.md`, report, instructions);
  return runAgent(prompt, {
    model: options.model ?? DEFAULT_MODEL,
    workspace: options.workspace,
  });
}

export async function generateReadmeViaAI(
  report: AnalysisReport,
  options: AIGenerationOptions
): Promise<string> {
  const instructions = `Generate a README.md for this repository. Use the analysis report to describe:
- Project overview (infer from frameworks, entry points, modules)
- Key technologies and versions
- How to get started (build, run, test)
- Project structure (brief)
- Links to docs/context/ for deeper documentation

Include a generated-by header: <!-- Generated: ${report.metadata.generatedAt.toISOString()} | RepoSage ${report.metadata.generatorVersion} -->`;
  const prompt = buildArtifactPrompt("README", "README.md", report, instructions);
  return runAgent(prompt, {
    model: options.model ?? DEFAULT_MODEL,
    workspace: options.workspace,
  });
}
