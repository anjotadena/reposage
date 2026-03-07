/**
 * AI-powered generation via Cursor CLI.
 * Uses GPT-5 (or configured model) to generate rules, commands, and context docs.
 */

import type { AnalysisReport } from "../models/index.js";
import { runAgent } from "../utils/cursorCli.js";

const DEFAULT_MODEL = "gpt-5.2";

function serializeReport(report: AnalysisReport): string {
  const copy = JSON.parse(
    JSON.stringify(report, (_, v) => (v instanceof Date ? v.toISOString() : v))
  );
  return JSON.stringify(copy, null, 2);
}

const OUTPUT_QUALITY_RUBRIC = `
## Output quality requirements
- Be evidence-based: only state facts supported by the report; label unknowns explicitly
- Be actionable: every section should guide concrete developer behavior
- Be scannable: use headers, bullet points, tables; avoid long prose
- Be consistent: match the repository's detected conventions and tooling
- Be concise: prefer 3–7 bullet points per section; no filler
- Include concrete examples where the report provides enough detail
`;

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
${OUTPUT_QUALITY_RUBRIC}

Repository analysis report (use this as the sole source of truth; do not invent facts):
\`\`\`json
${reportJson}
\`\`\`

Output ONLY the raw file content. No explanations, no markdown code fences around the output, no preamble. Start directly with the file content (e.g. frontmatter for .mdc, or the first line of the document).`;
}

const RULE_INSTRUCTIONS: Record<string, string> = {
  "coding-standards":
    "Generate a Cursor rule file (.mdc) for coding standards. Frontmatter: description, globs: *. Cover style/formatting (linter, formatter configs), code quality (small functions, avoid nesting, document APIs), and conventions. Be actionable.",
  architecture:
    "Generate a Cursor rule file (.mdc) for architecture context. Frontmatter: description, globs: *. Describe the inferred architecture style, key modules, entry points, and how components connect. Be evidence-based; only state what the report supports.",
  security:
    "Generate a Cursor rule file (.mdc) for security context. Frontmatter: description, globs: *. Summarize security findings (if any), dangerous patterns to avoid, and security conventions. Be concise.",
  testing:
    "Generate a Cursor rule file (.mdc) for testing strategy. Frontmatter: description, globs: *. List detected test frameworks, test file patterns, and recommendations for adding tests. Include confidence level from the report.",
  "api-design":
    "Generate a Cursor rule file (.mdc) for API design. Frontmatter: description, globs: *. Cover REST/API conventions, request/response patterns, error handling, versioning. Use report's API routes if present; otherwise provide framework-agnostic guidance.",
  "naming-conventions":
    "Generate a Cursor rule file (.mdc) for naming conventions. Frontmatter: description, globs: *. Cover files, modules, functions, variables, types. Infer from report's module structure and language; be specific to the stack.",
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
  "create-module":
    "Generate a Cursor command file (.md) for creating a new module. The command should: 1) Reference the analysis report for module structure, 2) Ask for module name and purpose, 3) Guide the AI to produce implementation following existing patterns.",
  "create-endpoint":
    "Generate a Cursor command file (.md) for creating an API endpoint. Use the report's API routes and framework info. The command should guide the AI to add a new endpoint with proper routing, validation, and error handling.",
  "generate-tests":
    "Generate a Cursor command file (.md) for generating tests. Reference detected test frameworks and modules. The command should guide the AI to write unit/integration tests for a given module or feature.",
  "refactor-service":
    "Generate a Cursor command file (.md) for refactoring a service. The command should guide the AI to improve structure, reduce coupling, and follow repository conventions. Reference architecture and module info from the report.",
  "analyze-performance":
    "Generate a Cursor command file (.md) for performance analysis. The command should guide the AI to identify bottlenecks, suggest optimizations, and reference the report's entry points and critical paths.",
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

const PROMPT_INSTRUCTIONS: Record<string, string> = {
  "generate-feature":
    "Generate a Cursor prompt file (.md) for feature generation. Structure: Context (use report), Inputs (feature name, acceptance criteria), Output (implementation plan, code, tests). Keep under 40 lines.",
  "refactor-code":
    "Generate a Cursor prompt file (.md) for refactoring. Structure: Context, Inputs (target file/module, goals), Output (refactored code with rationale). Reference architecture and conventions from the report.",
  "write-unit-tests":
    "Generate a Cursor prompt file (.md) for writing unit tests. Structure: Context (test framework from report), Inputs (module/function to test), Output (test cases with assertions). Be specific to detected stack.",
  "code-review":
    "Generate a Cursor prompt file (.md) for code review. Structure: Context (security, architecture from report), Inputs (diff or file), Output (review checklist, findings, suggestions).",
  "debug-issue":
    "Generate a Cursor prompt file (.md) for debugging. Structure: Context (entry points, modules from report), Inputs (symptoms, error messages), Output (hypothesis, trace steps, fix).",
};

const CURSOR_CONTEXT_INSTRUCTIONS: Record<string, string> = {
  "project-overview":
    "Generate .cursor/context/project-overview.md. High-level summary: purpose, key technologies, entry points, directory structure. Use report's modules and frameworks. Bullet format, under 50 lines.",
  "architecture-overview":
    "Generate .cursor/context/architecture-overview.md. Architecture style, layers, component relationships. Evidence-based from the report. Scannable with headers.",
  "tech-stack":
    "Generate .cursor/context/tech-stack.md. Languages, frameworks, databases, CI/CD, tooling. Include versions where available. Table or bullet list.",
  "domain-knowledge":
    "Generate .cursor/context/domain-knowledge.md. Key terms, domain concepts, acronyms used in the codebase. Infer from report's modules and file names.",
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
  const instructions = COMMAND_INSTRUCTIONS[commandName] ?? "Generate a Cursor command file (.md).";
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

export async function generatePromptViaAI(
  report: AnalysisReport,
  promptName: string,
  options: AIGenerationOptions
): Promise<string> {
  const instructions =
    PROMPT_INSTRUCTIONS[promptName] ?? "Generate a Cursor prompt file (.md).";
  const prompt = buildArtifactPrompt("Cursor prompt", `${promptName}.md`, report, instructions);
  return runAgent(prompt, {
    model: options.model ?? DEFAULT_MODEL,
    workspace: options.workspace,
  });
}

export async function generateCursorContextViaAI(
  report: AnalysisReport,
  contextName: string,
  options: AIGenerationOptions
): Promise<string> {
  const instructions =
    CURSOR_CONTEXT_INSTRUCTIONS[contextName] ?? "Generate .cursor/context documentation.";
  const prompt = buildArtifactPrompt(
    "Cursor context",
    `${contextName}.md`,
    report,
    instructions
  );
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
