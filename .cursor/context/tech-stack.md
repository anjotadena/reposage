<!-- Generated: 2026-03-14T02:16:42.230Z | RepoSage 0.1.0 -->

# Tech Stack

Complete technology inventory for agents and automation workflows.

## Languages

| Language | Files | Percentage |
|----------|-------|------------|
| Markdown | 33 | 22% |
| JavaScript | 1 | 1% |
| JSON | 3 | 2% |
| TypeScript | 46 | 31% |

## Frameworks & Libraries


No test frameworks detected.

## CI/CD

- **GitHub Actions**: `.github/workflows/ci.yml` (/home/an0malyx/projects/reposage/.github/workflows/ci.yml)

## Development Tools

### Code Quality
- ESLint: Configured
- Prettier: Configured
- EditorConfig: Not detected
- Husky: Not detected
- Strict TypeScript: Yes

### Config Files
- `.prettierrc`
- `eslint.config.js`

## Infrastructure

| Tool | Present |
|------|---------|
| Docker | No |
| Docker Compose | No |
| Kubernetes | No |
| Terraform | No |


## CLI Usage for Daily Development

### Available Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `reposage scan <path>` | Quick file statistics | Check repo size, file counts, key files |
| `reposage analyze <path>` | Full tech stack analysis | Understand architecture, dependencies, patterns |
| `reposage generate <path>` | Generate Cursor artifacts | Set up AI context for a new/updated repo |
| `reposage explain <path>` | Human-readable summary | Quick onboarding, documentation |

### Running the CLI

**From source (development):**

```bash
# Build first (required after code changes)
pnpm run build

# Run commands
node dist/cli/index.js scan .
node dist/cli/index.js analyze .
node dist/cli/index.js generate .
node dist/cli/index.js explain .

# Or use npm start with args
pnpm start -- scan .
pnpm start -- generate . --force
```

**After global install:**

```bash
reposage scan .
reposage analyze ./my-project
reposage generate /path/to/repo --force
```

### Common Workflows

**1. Onboarding to a new repository:**

```bash
# Quick overview
reposage explain ./new-repo

# Full analysis with Cursor context
reposage generate ./new-repo
```

**2. Regenerating after codebase changes:**

```bash
# Force overwrite existing artifacts
reposage generate . --force
```

**3. Using without Cursor CLI (template-based):**

```bash
# Falls back to Handlebars templates
reposage generate . --no-ai
```

**4. Using a specific AI model:**

```bash
reposage generate . --model gpt-5.2
reposage generate . --model claude-sonnet
```

**5. Quick scan before analysis:**

```bash
# Check file counts and key files first
reposage scan .

# Then run full analysis
reposage analyze .
```

### Generate Command Options

| Option | Short | Description |
|--------|-------|-------------|
| `--force` | `-f` | Overwrite existing `.cursor/` artifacts |
| `--ai` | — | Use Cursor CLI with AI (default) |
| `--no-ai` | — | Use Handlebars templates instead |
| `--model <model>` | `-m` | AI model to use (default: `gpt-5.2`) |

### Generated Artifacts

Running `reposage generate` creates:

```
.cursor/
├── rules/           # 11 rule files (.mdc)
├── commands/        # 10 command files
├── prompts/         # 5 prompt files
├── context/         # 4 context files (this file!)
└── automations/     # 6 automation workflows

docs/context/        # 7 documentation files
```

### Development Scripts

| Script | Command | Use Case |
|--------|---------|----------|
| `pnpm build` | `tsc && cp -r src/templates dist/` | Build before running CLI |
| `pnpm dev` | `tsc --watch` | Watch mode during development |
| `pnpm start` | `node dist/cli/index.js` | Run CLI after build |
| `pnpm lint` | `eslint .` | Check code quality |
| `pnpm lint:fix` | `eslint . --fix` | Auto-fix lint issues |
| `pnpm format` | `prettier --write .` | Format code |

### Tips for Daily Use

1. **Always build first** — Run `pnpm build` after any TypeScript changes
2. **Use `--force` sparingly** — Only when you want to overwrite existing artifacts
3. **Check scan before generate** — `scan` is fast and helps verify the target path
4. **Use `--no-ai` for offline work** — Templates work without Cursor CLI
5. **Regenerate after major changes** — Architecture changes warrant fresh artifacts

---

## Using Generated Artifacts

RepoSage generates 5 types of Cursor artifacts. Here's how to use each in daily development:

### 1. Context Files (`.cursor/context/`)

**Purpose:** Background information for AI agents to understand the project.

**Files:**
- `project-overview.md` — High-level summary, entry points, directory structure
- `architecture-overview.md` — Component relationships, API surface, data layer
- `tech-stack.md` — Languages, frameworks, CI/CD, infrastructure (this file)
- `domain-knowledge.md` — Business domain, terminology, key concepts

**How to use:**
- These files are **automatically loaded** by Cursor when you use AI features
- Reference them in chat: *"Based on the architecture overview, how should I add a new scanner?"*
- Update manually if RepoSage detection is incomplete

**Example prompt using context:**
```
Looking at .cursor/context/architecture-overview.md, I want to add a new
detector for GraphQL schemas. Which module should I add it to?
```

---

### 2. Rules (`.cursor/rules/`)

**Purpose:** Constraints and guidelines that AI follows when generating code.

**Files:**
| File | Purpose |
|------|---------|
| `00-repo-baseline.mdc` | Detected stack, core conventions |
| `10-architecture.mdc` | Architecture style, component boundaries |
| `20-testing-strategy.mdc` | Test patterns, coverage expectations |
| `30-security.mdc` | Security requirements, safe patterns |
| `40-tech-stack.mdc` | Tech-specific rules |
| `coding-standards.mdc` | Style guide, formatting, naming |
| `naming-conventions.mdc` | Variable/function/file naming |
| `security.mdc` | Input validation, auth, secrets |
| `architecture.mdc` | Module boundaries, dependencies |
| `testing.mdc` | Test structure, mocking patterns |
| `api-design.mdc` | Endpoint conventions, response formats |

**How to use:**
- Rules are **automatically applied** when AI generates code
- AI will follow these constraints without explicit prompting
- Add custom rules to override or extend defaults

**Example:** When you ask Cursor to generate a new endpoint, it automatically:
- Follows naming conventions from `naming-conventions.mdc`
- Applies security patterns from `security.mdc`
- Matches API style from `api-design.mdc`

---

### 3. Commands (`.cursor/commands/`)

**Purpose:** Pre-built prompts for common development tasks.

**Available commands:**
| Command | When to Use |
|---------|-------------|
| `explain-repo` | Onboarding, understanding codebase |
| `trace-feature` | Following data flow through modules |
| `create-test-plan` | Planning test coverage for a feature |
| `document-module` | Generating module documentation |
| `review-risk` | Identifying risks in code changes |
| `generate-tests` | Creating unit/integration tests |
| `create-endpoint` | Adding new API endpoints |
| `create-module` | Scaffolding new modules |
| `refactor-service` | Restructuring existing code |
| `analyze-performance` | Finding performance issues |

**How to use:**
1. Open Cursor command palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Type "Cursor: Run Command"
3. Select the command file (e.g., `generate-tests.md`)
4. Provide the required inputs

**Example workflow — generating tests:**
```
1. Select the file: src/scanners/FileScanner.ts
2. Run command: .cursor/commands/generate-tests.md
3. Input: "unit tests for FileScanner.scan() method"
4. AI generates tests following project patterns
```

---

### 4. Prompts (`.cursor/prompts/`)

**Purpose:** Structured prompts with checklists and output formats.

**Available prompts:**
| Prompt | Purpose |
|--------|---------|
| `code-review.md` | Comprehensive code review with security, architecture, testing |
| `debug-issue.md` | Root cause analysis and fix proposals |
| `write-unit-tests.md` | Generate tests with edge cases |
| `refactor-code.md` | Restructure code while preserving behavior |
| `generate-feature.md` | Implement new features end-to-end |

**How to use:**
1. Open the prompt file to see the structure
2. Copy/paste into Cursor chat
3. Fill in the inputs (diff, error message, etc.)
4. AI responds with structured output

**Example — code review prompt:**
```
@code-review.md

Changes: [paste diff or select files]
Focus areas: security, performance

[AI returns structured review with:]
- Risk level
- Blockers (must fix)
- Suggestions (should fix)
- Security notes
- Architecture notes
```

**Example — debug issue prompt:**
```
@debug-issue.md

Error: TypeError: Cannot read property 'files' of undefined
Stack trace: [paste stack trace]
Steps to reproduce: Run `reposage scan` on empty directory

[AI returns:]
- Root cause analysis
- Proposed fix with code
- Verification steps
```

---

### 5. Automations (`.cursor/automations/`)

**Purpose:** Workflows triggered by specific events (PR, dependency change, etc.).

**Available automations:**
| Automation | Trigger |
|------------|---------|
| `pr-review-or-risk-scan.md` | PR creation/update, significant changes |
| `security-review.md` | Auth code changes, new endpoints, dependency updates |
| `dependency-change-review.md` | package.json/requirements.txt changes |
| `test-plan-on-large-change.md` | Large changes (>100 lines, >3 files) |
| `release-readiness-check.md` | Before releases, version bumps |
| `refresh-context-on-structure-change.md` | Major refactors, new modules |

**How to use:**
1. Automations are **reference workflows** — not automatically triggered
2. Run them manually when the trigger condition is met
3. Follow the steps in order
4. Use the expected output format for consistency

**Example — PR review workflow:**
```
Trigger: You're reviewing a PR with 150 lines changed across 5 files

1. Open .cursor/automations/pr-review-or-risk-scan.md
2. Follow the steps:
   - Gather context (read diff, identify affected modules)
   - Analyze changes (breaking changes, new dependencies)
   - Security scan (secrets, input validation)
   - Architecture review (module boundaries, patterns)
3. Generate report using the template
```

**Example — dependency change review:**
```
Trigger: Dependabot PR updates lodash from 4.17.20 to 4.17.21

1. Open .cursor/automations/dependency-change-review.md
2. Parse changes (identify version bump type)
3. Security assessment (check CVEs)
4. Breaking change analysis (review changelog)
5. Generate review with recommendation
```

---

## Quick Reference: Daily Workflows

| Task | Artifact to Use |
|------|-----------------|
| Understand the codebase | `context/project-overview.md`, `commands/explain-repo.md` |
| Add a new feature | `prompts/generate-feature.md`, `commands/create-module.md` |
| Write tests | `commands/generate-tests.md`, `prompts/write-unit-tests.md` |
| Fix a bug | `prompts/debug-issue.md`, `commands/trace-feature.md` |
| Review code | `prompts/code-review.md`, `automations/pr-review-or-risk-scan.md` |
| Check security | `automations/security-review.md`, `rules/security.mdc` |
| Update dependencies | `automations/dependency-change-review.md` |
| Document code | `commands/document-module.md` |
| Refactor | `prompts/refactor-code.md`, `commands/refactor-service.md` |
| Prepare release | `automations/release-readiness-check.md` |

---

## Automation Tooling Notes

- Use detected linter/formatter for code generation
- Follow test framework patterns for new tests
- Respect CI/CD pipeline requirements
- Match infrastructure patterns when adding services
