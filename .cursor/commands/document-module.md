<!-- Cursor Command: document-module.md -->
# Document module (from analysis report)

Use the **Repository analysis report (JSON) provided in this chat context** as the **sole source of truth** for repo-wide facts (languages, entry points, detected modules, CI/CD, conventions). **Do not invent** modules, frameworks, routes, databases, or security posture that are not explicitly in the report. If the report is missing details (or low confidence), say so and rely on **direct code inspection** for module specifics.

## Goal
Document a specified module with:
- Its **purpose** (what it does / why it exists)
- Its **dependencies** (internal + external + IO boundaries)
- Its **public surface** (exports, CLI hooks, or other integration points)

## Inputs to ask for (if not provided)
- Module identifier: **directory path** or **source file path**, and the name you want to use in docs.
- What you consider “inside” the module vs “outside” (if there’s ambiguity).
- Intended audience (contributors vs users) and desired level of detail (short/medium/deep).

## Report facts you must anchor to
- **Entry points**:
  - `dist/cli/index.js` (main)
  - `dist/cli/index.js` (bin: `reposage`)
- **Detected modules (module index)**: the report’s `modules.data` is **empty** (not detected). Do not fabricate a module list; treat the user-provided module path/name as authoritative and build the module doc from code inspection.
- **CI/CD**: GitHub Actions at `.github/workflows/ci.yml`
- **Conventions**: ESLint + Prettier, strict TypeScript; configs: `.prettierrc`, `eslint.config.js`

## Documentation procedure (do this in order)
1. Locate the module boundary (directory/file) exactly as specified by the user.
2. Identify the module’s “entry” surface:
   - Files that are imported/required by other parts of the repo
   - Export barrels (e.g., `index.ts`) if present
   - For CLI-related modules, find where the command/handler is registered (anchor to `dist/cli/index.js`, then map to sources if `dist/` is build output)
3. Build a dependency inventory (evidence-based):
   - **Internal deps**: other repo modules/files imported
   - **External deps**: npm packages imported
   - **IO boundaries**: filesystem, network, subprocess, env/config, stdout/stderr
4. Summarize responsibilities and main workflows:
   - Key functions/classes and what they orchestrate
   - Data transformations and side effects
   - Important invariants/assumptions the code relies on
5. Capture correctness + safety details:
   - Error handling behavior and failure modes
   - Input validation/sanitization at module boundaries
   - Path safety and subprocess safety if applicable
6. Identify tests and verification points:
   - Existing tests that cover the module, or explicitly state “no tests found”
   - Minimal manual verification steps (especially for CLI paths)

## Required output format
Produce a Markdown document with these sections (keep it concise, high-signal):

### 1) Module overview
- Name, location, and scope boundary
- Purpose (1–3 bullets)

### 2) Responsibilities (what it owns)
- Bullet list of responsibilities
- Non-goals (if implied by code)

### 3) Public API / integration points
- Exported symbols (functions/classes/types) and what they’re for
- Who calls this module (callers) and how (imports/CLI wiring)

### 4) Dependencies
- **Internal**: list of repo dependencies with short “why”
- **External**: list of packages with short “why”
- **Boundaries**: FS / network / subprocess / env / console; list concrete touchpoints

### 5) Key flows (numbered)
Numbered “happy path” flows through the module with file/symbol references where possible.

### 6) Data contracts
- Important TypeScript types/interfaces (and runtime schemas if any)
- Inputs/outputs and where they originate/terminate

### 7) Error handling & observability
- Errors thrown/caught, retries, exit codes (if CLI-related)
- Logging behavior (if present)

### 8) Security notes (only what you can prove from code)
- Validation gaps, unsafe path handling, injection risks, secrets handling

### 9) Testing & verification
- Tests found (or “none found”)
- Quick manual verification checklist

Constraints:
- If you cannot prove something from code or the report, label it explicitly as **unknown**.
- Prefer short bullet points and concrete evidence over broad descriptions.