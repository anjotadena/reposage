<!-- Cursor Command: create-test-plan.md -->
# Create Test Plan (from analysis report)

Use the **Repository analysis report (JSON) provided in this chat context** as the **sole source of truth**. Do not claim the repo uses any test framework or module structure unless it is explicitly present in the report; if data is missing or low-confidence, say so and design the plan to adapt once the user provides details or you inspect the code.

## What to produce
Create a practical, actionable **test plan** for the **selected module or feature** that a developer can implement immediately.

Your output must be a structured document with these sections:
- **Context & scope** (what is being tested; what is out of scope)
- **Repository constraints from the report** (facts only)
- **Test strategy** (layers and goals)
- **Test cases** (table or checklist; include success + failure paths)
- **Test data & fixtures**
- **Mocking/stubbing plan**
- **Non-functional tests** (security, performance, reliability) where applicable
- **CI execution notes** (how it should run in CI; align to reported CI/CD)
- **Open questions / missing info** (explicitly call out unknowns from the report)

## Facts you must reflect (from this report)
Include these facts exactly, and build the plan around them:
- **Languages**: TypeScript (strict), Markdown, JSON; minimal JavaScript
- **Entry points**: `dist/cli/index.js` (main), `dist/cli/index.js` (bin: `reposage`)
- **CI/CD**: GitHub Actions at `.github/workflows/ci.yml`
- **Conventions**: ESLint + Prettier; configs: `.prettierrc`, `eslint.config.js`; strict TypeScript
- **Detected test frameworks**: none reported (confidence low)
- **Detected modules**: none reported (confidence low)

## How to tailor the plan to the target module/feature
Start by extracting (or asking for) the minimum details needed to write good tests:
- **Target**: module path(s) / function(s) / CLI command(s) / behavior to validate
- **Interfaces**: inputs (args/flags/env/files), outputs (stdout/stderr/files), side effects
- **Acceptance criteria**: 3–10 bullet points of “must” behaviors
- **Risks**: edge cases, error handling, security-sensitive inputs, filesystem/network usage

If the user did not provide enough detail, proceed anyway with a best-effort plan:
- State assumptions explicitly.
- Write tests as parameterized scenarios that can be mapped to concrete functions/commands once code is inspected.

## Test strategy guidance (given the report)
Because the repo is a **CLI** (bin `reposage` via `dist/cli/index.js`), design tests across these layers:
- **Unit tests**: pure logic and helpers (no I/O), table-driven cases, boundary conditions
- **Integration tests**: modules interacting (e.g., parsing → validation → execution), minimal external effects
- **CLI end-to-end tests**: invoke the CLI as a subprocess, assert:
  - exit code
  - stdout/stderr content (stable, non-flaky assertions)
  - produced/modified files (in temp dirs)
  - behavior under invalid args/flags and missing inputs

## Test framework handling (do not invent)
The report did **not** detect a test framework. Handle this explicitly:
- If you can inspect the repo while writing the plan, look for existing test tooling (e.g., `package.json` scripts/devDependencies, `*.test.*` files, `test/` or `__tests__/`), and then tailor the plan to that tooling.
- If you cannot confirm tooling, write the plan **framework-agnostically** (describe test intent and structure), and include an **“Implementation options”** subsection listing common TypeScript-friendly choices as proposals (clearly labeled as proposals, not as existing repo facts).

## Test case format requirements
Provide test cases as a table with at least these columns:
- **ID**
- **Layer** (unit/integration/e2e)
- **Scenario**
- **Inputs**
- **Expected result**
- **Notes** (mocking/fixtures, flake risks)

Include:
- At least **8–15** test cases for a non-trivial feature, fewer only if the scope is truly small.
- Both **positive** and **negative** paths.
- At least **2** edge cases and **2** error-handling cases.
- If the feature touches CLI UX, include tests for **help output**, **invalid usage**, and **stable error messages**.

## Security & reliability considerations (plan-level)
Even without security findings in the report, include relevant checks when applicable:
- **Input validation**: untrusted argv/env/file content; path traversal patterns; unexpected encodings
- **Safe filesystem behavior**: operate in temp directories; avoid clobbering; atomic writes if needed
- **Determinism**: fixed timestamps/randomness via injection; stable snapshots of output where appropriate

## CI notes
Reference the reported CI file and describe how the test suite should run under GitHub Actions:
- Mention `.github/workflows/ci.yml` as the integration point.
- Keep recommendations generic unless you can confirm exact commands.

## Output constraints
- Be concise but specific. Prefer checklists and tables over prose.
- No speculation stated as fact. When unsure, mark as **unknown** and add it to **Open questions**.