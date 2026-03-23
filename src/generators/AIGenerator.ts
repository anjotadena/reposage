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

## Automation-aware guidelines
- Reference related automations where applicable (e.g., "Run security-review automation for deep scan")
- Include clear trigger conditions for automated workflows
- Define expected outputs and fallback behaviors
- Ensure artifacts complement each other (rules constrain, commands execute, prompts structure, automations repeat)
- For commands and skills, require stack-aware execution guidance grounded in detected technologies
- Mention only ecosystems detected in the report; avoid generic multi-stack examples
- If Laravel/PHP is detected, keep examples and commands Laravel/PHP-native unless another stack is explicitly detected
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
    "Generate a Cursor rule file (.mdc) for coding standards. Frontmatter: description, globs: *. Cover style/formatting (detected linter, formatter configs), code quality (small functions, avoid nesting, document APIs), and conventions. Include sections for 'For Code Generation', 'For Automations', 'For Reviews'. Be actionable.",
  architecture:
    "Generate the canonical architecture rule file architecture.mdc (single merged rule). Frontmatter: description, globs: *. Include: (1) Project directory — table with directory name and absolute repository path from report metadata; (2) Why this architecture — explain inference from frameworks, modules, entry points, routes (heuristic, not formal ADR); (3) Detected architecture summary; (4) Linting and formatting — table from coding conventions (ESLint, Prettier, EditorConfig, Husky, strict TypeScript) and list config files; (5) Engineering practices — general bullets plus stack-specific (Node/TS, Laravel, PHP, Python) only if detected in report; (6) CI quality gates if cicd present; (7) Architecture rules for code, automations, reviews. Evidence-based only.",
  security:
    "Generate the canonical security rule file security.mdc. Frontmatter: description, globs: *. Merge security findings, dangerous patterns, conventions, and security-review automation guidance. Sections for code generation, automations, reviews.",
  testing:
    "Generate the canonical testing rule file testing.mdc. Frontmatter: description, globs: *. Merge detected test frameworks, patterns, coverage expectations, and references to create-test-plan / generate-tests commands and pr-review for large changes. Include confidence from the report.",
  "api-design":
    "Generate a Cursor rule file (.mdc) for API design. Frontmatter: description, globs: *. Cover REST/API conventions, request/response patterns, error handling, versioning. Use report's API routes if present; otherwise provide framework-agnostic guidance. Include guidance for automations reviewing API changes.",
  "naming-conventions":
    "Generate a Cursor rule file (.mdc) for naming conventions. Frontmatter: description, globs: *. Cover files, modules, functions, variables, types. Infer from report's module structure and language; be specific to the stack. Include guidance for automations to validate naming.",
  "00-repo-baseline":
    "Generate a Cursor rule file (.mdc) that establishes the repository baseline. Include YAML frontmatter with description and globs: *. Use concise bullet points for: detected stack (languages, frameworks), architecture, and conventions to follow. End with a brief 'Follow existing patterns' section. Reference .cursor/automations/ for recurring workflows.",
  "40-tech-stack":
    "Generate a Cursor rule file (.mdc) for tech stack context. Frontmatter: description, globs: *. List languages, frameworks, databases, CI/CD, infrastructure. Include versions where available. Reference release-readiness-check before releases and security-review for supply-chain-sensitive changes. Keep it scannable.",
};

const COMMAND_INSTRUCTIONS: Record<string, string> = {
  "explain-repo":
    "Generate a Cursor command file (.md) that instructs the AI to explain the repository to a developer. The command should: 1) Reference the analysis report context, 2) Ask the AI to summarize structure, entry points, and key modules, 3) Require using .cursor/skills/tech-stack-implementation/SKILL.md first, 4) Be concise (under 30 lines).",
  "analyze-codebase":
    "Generate a Cursor command file (.md) for codebase analysis. The command should guide the AI to analyze a requested scope in the repository by summarizing responsibilities, tracing dependencies, calling out architecture and risks, and suggesting safe next steps. Reference the report's entry points, modules, conventions, related .cursor/context files, and .cursor/skills/tech-stack-implementation/SKILL.md.",
  "trace-feature":
    "Generate a Cursor command file (.md) for tracing a feature through the codebase. The command should ask the AI to trace from entry point to data layer using the module/API info in the report, and require stack-constrained reasoning using .cursor/skills/tech-stack-implementation/SKILL.md.",
  "create-test-plan":
    "Generate a Cursor command file (.md) for creating a test plan. Reference detected test frameworks and modules. The command should guide the AI to propose tests for a given module or feature and require use of .cursor/skills/tech-stack-implementation/SKILL.md.",
  "document-module":
    "Generate a Cursor command file (.md) for documenting a module. Use the module index from the report. The command should ask the AI to document a specified module with its dependencies and purpose, and ground recommendations in .cursor/skills/tech-stack-implementation/SKILL.md.",
  "review-risk":
    "Generate a Cursor command file (.md) for risk review. Reference security findings and architecture. The command should guide the AI to review code changes for security and architectural risks while using .cursor/skills/tech-stack-implementation/SKILL.md.",
  "create-module":
    "Generate a Cursor command file (.md) for creating a new module. The command should: 1) Reference the analysis report for module structure, 2) Ask for module name and purpose, 3) Guide the AI to produce implementation following existing patterns and .cursor/skills/tech-stack-implementation/SKILL.md.",
  "create-endpoint":
    "Generate a Cursor command file (.md) for creating an API endpoint. Use the report's API routes and framework info. The command should guide the AI to add a new endpoint with proper routing, validation, and error handling, grounded in .cursor/skills/tech-stack-implementation/SKILL.md.",
  "generate-tests":
    "Generate a Cursor command file (.md) for generating tests. Reference detected test frameworks and modules. The command should guide the AI to write unit/integration tests for a given module or feature and use .cursor/skills/tech-stack-implementation/SKILL.md.",
  "implement-task":
    "Generate a Cursor command file (.md) for implementing a concrete task (ticket, bugfix, or small feature). Do NOT repeat full rule text (Cursor applies .cursor/rules/*.mdc automatically). Instead require: (1) read .cursor/skills/tech-stack-implementation/SKILL.md first, (2) pull relevant facts from .cursor/context/project-overview.md, architecture-overview.md, tech-stack.md, domain-knowledge.md as needed, (3) optionally align output structure with .cursor/prompts/generate-feature.md patterns, (4) mention .cursor/automations/pr-review-or-risk-scan or release-readiness-check after substantive changes. Use report modules, entry points, and API routes. Under 45 lines.",
  "refactor-service":
    "Generate a Cursor command file (.md) for refactoring a service. The command should guide the AI to improve structure, reduce coupling, and follow repository conventions. Reference architecture and module info from the report plus .cursor/skills/tech-stack-implementation/SKILL.md.",
  "analyze-performance":
    "Generate a Cursor command file (.md) for performance analysis. The command should guide the AI to identify bottlenecks, suggest optimizations, and reference the report's entry points, critical paths, and .cursor/skills/tech-stack-implementation/SKILL.md.",
};

const SKILL_INSTRUCTIONS: Record<string, string> = {
  "tech-stack-implementation":
    "Generate .cursor/skills/tech-stack-implementation/SKILL.md only (no YAML). Stack-grounded generation: detected technologies first, no unsupported assumptions, explicit unknowns, anti-hallucination guardrails. Sections: Detected Stack Evidence, How To Use This Skill, Daily development workflow (this project), Productivity commands (table mapping goals to .cursor/commands/), Hallucination Guardrails, Output Quality Checks. If Laravel is detected, add Laravel-specific guidance and prohibit Python-centric examples unless Python is detected.",
};

const DOC_INSTRUCTIONS: Record<string, string> = {
  "repo-map":
    "Generate docs/context/repo-map.md. A high-level map of the repository: top-level directories, key files, and how they relate. Use the report's modules and entry points. Bullet format.",
  "architecture-overview":
    "Generate docs/context/architecture-overview.md. Include project identity, short rationale from evidence, linting/engineering discipline table from conventions, and detected summary. Suitable for human onboarding; evidence-based only.",
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
    "Generate a Cursor prompt file (.md) for feature generation. Structure: Context (architecture, frameworks from report), Inputs (feature name, description, acceptance criteria), Output (implementation plan, code, tests, documentation). Include 'Quality Expectations' section. Include 'Automation Follow-up' referencing pr-review-or-risk-scan and release-readiness-check when appropriate. Keep under 50 lines.",
  "refactor-code":
    "Generate a Cursor prompt file (.md) for refactoring. Structure: Context (architecture, modules from report), Inputs (target file/module, goals), Output (refactored code with rationale). Include guidance on maintaining test coverage and running automations post-refactor. Reference architecture and conventions from the report.",
  "write-unit-tests":
    "Generate a Cursor prompt file (.md) for writing unit tests. Structure: Context (test framework from report), Inputs (module/function to test), Output (test cases with assertions, coverage estimate). Include 'Test Quality Checklist'. Be specific to detected stack.",
  "code-review":
    "Generate a Cursor prompt file (.md) for code review. Structure: Context (security rules, architecture rules from report), Inputs (diff or file, focus areas), Output (structured review with severity levels). Include 'Review Checklist' covering code quality, security, architecture, testing. Include 'Automation Integration' section referencing pr-review-or-risk-scan and security-review automations.",
  "debug-issue":
    "Generate a Cursor prompt file (.md) for debugging. Structure: Context (entry points, modules, API routes from report), Inputs (symptoms, error messages, reproduction steps), Output (hypothesis, trace steps, root cause, fix). Include guidance on adding regression tests.",
};

const CURSOR_CONTEXT_INSTRUCTIONS: Record<string, string> = {
  "project-overview":
    "Generate .cursor/context/project-overview.md for THIS repository only. State the project directory name and path from the report. High-level summary: purpose, key technologies, entry points, directory structure. Include 'Quick Start for Agents', 'High-Signal Files', 'Safe Assumptions for Automations'. Ground every claim in the report; label unknowns. Bullet format, under 60 lines.",
  "architecture-overview":
    "Generate .cursor/context/architecture-overview.md for THIS repo. Include: project directory table (name + absolute path); Why this architecture (rationale from detected frameworks, modules, routes — heuristic); architecture style; linting/formatting table from coding conventions + stack practices; modules/APIs/data/infra; CI/CD as quality gates; Architecture guidelines for automations. Evidence-based, scannable headers.",
  "tech-stack":
    "Generate .cursor/context/tech-stack.md as the inventory of THIS project's stack from the report: languages, frameworks, databases, CI/CD, tooling, config files. Include 'Automation Tooling Notes'. Table or bullet list. Do not describe RepoSage itself.",
  "domain-knowledge":
    "Generate .cursor/context/domain-knowledge.md for THIS project: terms inferred from modules, routes, and names. Include 'For Automations'. Distinguish inferred guesses from verified product terminology.",
};

const AUTOMATION_INSTRUCTIONS: Record<string, string> = {
  "pr-review-or-risk-scan": `Generate a Cursor automation workflow (.md) for PR review and risk scanning.
Structure:
- Trigger: When to run (e.g., on PR creation, code changes)
- Goal: What the automation should accomplish
- Steps: Numbered agent actions (1. gather context, 2. analyze changes, 3. report findings)
- Signals to inspect: Files, patterns, metrics from the report
- Expected output: Review checklist, risk assessment, recommendations
- Fallback: What to do if analysis is inconclusive
Keep under 60 lines. Be actionable and evidence-based.`,
  "security-review": `Generate a Cursor automation workflow (.md) for security review.
Structure:
- Trigger: When to run (e.g., security-sensitive file changes, dependency updates)
- Goal: Identify security risks and vulnerabilities
- Steps: Numbered agent actions for security analysis
- Signals to inspect: Auth patterns, data handling, API security from the report
- Expected output: Security findings with severity, remediation steps
- Fallback: Escalation path for uncertain findings
Reference the report's security findings if available.`,
  "refresh-context-on-structure-change": `Generate a Cursor automation workflow (.md) for refreshing context when repo structure changes.
Structure:
- Trigger: When architecture-relevant files change (e.g., config files, module additions)
- Goal: Keep .cursor/context up to date with repo reality
- Steps: Detect changes, update relevant context docs, validate consistency
- Signals to inspect: Directory structure, entry points, module index from the report
- Expected output: Updated context files, change summary
- Fallback: Flag for manual review if changes are ambiguous`,
  "release-readiness-check": `Generate a Cursor automation workflow (.md) for release readiness checks.
Structure:
- Trigger: Before release, version bump, or deployment
- Goal: Validate that the release is safe and complete
- Steps: Check tests pass, review breaking changes, verify docs, validate config
- Signals to inspect: Entry points, API routes, version info from the report
- Expected output: Release checklist with pass/fail, blocking issues
- Fallback: Manual review requirements for uncertain items`,
};

const CURSOR_README_INSTRUCTIONS = `Generate .cursor/CURSOR_README.md (Markdown). This file onboards developers to Cursor usage for THIS repository only.

Required sections (use ## headings):
1. Overview — project identity (use report metadata path basename), primary runtime from detected stack, what the generated .cursor/ assets are for.
2. Usage — table mapping .cursor/rules, commands, prompts, context, automations, skills to their roles.
3. Daily development examples — numbered concrete workflows (context first, then implement, test, review).
4. MCP — which MCP integrations are appropriate for THIS stack (filesystem/workspace default; suggest optional MCPs by ecosystem e.g. Node/npm, Python, PHP/Laravel if detected). Clearly label suggestions as optional.
5. Suggested MCPs — optional second list (Git PR, docs, cloud) only when relevant to the report; avoid irrelevant tools.
6. Daily workflow — numbered routine for staying aligned with generated context.
7. How to stay productive — short bullets (evidence-first, regenerate after refactors).
8. Productivity commands — markdown table: Goal | Command file name from .cursor/commands/.

End with a line: Regenerate with: reposage rsync <path>

Evidence-based only; under 120 lines. No code fences around the whole file.`;

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
  const instructions = PROMPT_INSTRUCTIONS[promptName] ?? "Generate a Cursor prompt file (.md).";
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
  const prompt = buildArtifactPrompt("Cursor context", `${contextName}.md`, report, instructions);
  return runAgent(prompt, {
    model: options.model ?? DEFAULT_MODEL,
    workspace: options.workspace,
  });
}

export async function generateAutomationViaAI(
  report: AnalysisReport,
  automationName: string,
  options: AIGenerationOptions
): Promise<string> {
  const instructions =
    AUTOMATION_INSTRUCTIONS[automationName] ??
    "Generate a Cursor automation workflow file (.md) with trigger, goal, steps, signals, expected output, and fallback sections.";
  const prompt = buildArtifactPrompt(
    "Cursor automation",
    `${automationName}.md`,
    report,
    instructions
  );
  return runAgent(prompt, {
    model: options.model ?? DEFAULT_MODEL,
    workspace: options.workspace,
  });
}

export async function generateSkillViaAI(
  report: AnalysisReport,
  skillName: string,
  options: AIGenerationOptions
): Promise<string> {
  const instructions =
    SKILL_INSTRUCTIONS[skillName] ??
    "Generate a Cursor skill file that is strictly grounded in detected technology evidence.";
  const prompt = buildArtifactPrompt("Cursor skill", `${skillName}/SKILL.md`, report, instructions);
  return runAgent(prompt, {
    model: options.model ?? DEFAULT_MODEL,
    workspace: options.workspace,
  });
}

export async function generateCursorReadmeViaAI(
  report: AnalysisReport,
  options: AIGenerationOptions
): Promise<string> {
  const prompt = buildArtifactPrompt(
    "Cursor README",
    "CURSOR_README.md",
    report,
    CURSOR_README_INSTRUCTIONS
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
