<!-- Cursor Command: review-risk.md -->
# Review risk (security + architecture)

Use the **Repository analysis report (JSON) provided in this chat context** as the **sole source of truth** for repository facts (entry points, detected tooling, architecture, security findings). **Do not invent** frameworks/modules/routes/databases/security issues that are not in the report. If a category is empty or low-confidence, say so and rely on **direct code inspection** of the proposed changes.

## Goal
Review the selected code changes for:
- **Security risks** (inputs, trust boundaries, secrets, supply chain).
- **Architectural risks** (coupling, boundaries, layering, maintainability, build/runtime conventions).

Deliver an evidence-based risk review with clear severity, impact, and concrete mitigations.

## Report facts you must anchor to
- **Entry points**:
  - `dist/cli/index.js` (main)
  - `dist/cli/index.js` (bin: `reposage`)
- **Languages**: TypeScript dominant; also Markdown/JSON; minimal JavaScript.
- **Conventions**: ESLint + Prettier; **strict TypeScript** enabled; configs: `.prettierrc`, `eslint.config.js`
- **CI/CD**: GitHub Actions at `.github/workflows/ci.yml`
- **Architecture**: **Unknown** (no architecture pattern inferred; low confidence)
- **Security findings**: **None detected in report** (security analyzer returned no items; low confidence)
- **Frameworks / tests**: none detected (low confidence)

## Inputs you should request (only if missing)
- The **diff / PR / commit range** to review (or the exact files).
- How to **run** the changed path (CLI invocation, sample args/flags, expected output/side effects).
- Any **security constraints** (expected threat model, data sensitivity, allowed environments).

## Review procedure (do this in order)
1. **Establish scope**
   - Identify exactly what changed (files, new dependencies, config changes, new IO boundaries).
   - If changes touch `dist/`, determine whether it’s generated output; prefer reviewing the **source** that produces it where possible.

2. **Map trust boundaries (CLI-first)**
   - Enumerate entry points for untrusted input:
     - CLI args/flags/stdin
     - environment variables/config files
     - filesystem paths/globs
     - network endpoints/URLs (if any)
     - subprocess invocation (if any)
   - For each boundary, note validation, normalization, and error handling.

3. **Security risk checklist (evidence-based)**
   - **Injection**: command injection (subprocess), argument injection, template injection, unsafe dynamic evaluation.
   - **Path safety**: path traversal, symlink following, unsafe temp files, writing outside intended directories.
   - **Deserialization/parsing**: unsafe parsing, prototype pollution vectors, unchecked JSON input, schema-less config loading.
   - **Network** (if present): SSRF patterns, insecure TLS handling, credential leakage in URLs/headers/logs.
   - **Secrets**: printing tokens, writing creds to disk, committing secrets in config/examples, over-verbose error dumps.
   - **AuthZ/AuthN** (if present): missing checks, privilege escalation via flags/config, unsafe defaults.
   - **DoS**: unbounded recursion/loops, reading huge files into memory, uncontrolled concurrency, catastrophic regex.
   - **Supply chain**: new/updated dependencies, new install scripts, fetching code at runtime, integrity pinning.
   - **Telemetry/logging**: sensitive data in logs, log injection, missing redaction.

4. **Architecture risk checklist (given “Unknown” architecture)**
   - **Boundary clarity**: keep IO adapters (FS/network/subprocess/env) separated from core logic where feasible.
   - **Coupling**: avoid leaking CLI concerns deep into libraries; avoid circular dependencies.
   - **Build/runtime conventions**: changes should remain compatible with a CLI entrypoint at `dist/cli/index.js`.
   - **Type safety**: maintain strict TypeScript assumptions; avoid `any`/unsafe casts without justification.
   - **Error strategy**: consistent exit codes, user-facing messages, and non-leaky stack traces for a CLI.
   - **Config surface area**: adding flags/env vars should be discoverable, validated, and backward compatible.
   - **CI compatibility**: ensure changes won’t break GitHub Actions workflow expectations.

5. **Required security validation (run if applicable to the change)**
   - Dependency/supply-chain checks (Node/TS repos):
     - `npm audit --json`
     - `npx snyk test --severity-threshold=high`
     - `trivy fs .`
   - If the repository has additional existing checks (lint/typecheck/tests), run them as well and report results.

## Required output format
### 1) Scope summary
- What changed (high-level), what’s in/out of scope, and which entry points/boundaries are impacted.

### 2) Security risk register
Provide a table with:
- **Risk**
- **Severity** (Critical/High/Medium/Low)
- **Likelihood**
- **Impact**
- **Evidence** (file path + symbol + line references where possible)
- **Mitigation** (specific code/config changes)
- **Residual risk / follow-ups**

### 3) Architecture risk register
Same table format, focusing on layering, coupling, boundary clarity, CLI conventions, and maintainability.

### 4) Validation results
- Commands run (at minimum list what you ran), pass/fail, and any high/critical findings.
- If you could not run a check, state why (missing lockfile, tool not available, etc.) and what to run next.

### 5) Decision + next actions
- Ship / ship-with-guards / block, with a short justification.
- Concrete next actions (patches, tests, docs) required to reduce risk.