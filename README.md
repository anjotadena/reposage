<p align="center">
  <img src="assets/reposage_logo.png" alt="RepoSage" width="450"/>
</p>

<p align="center">
  <a href="https://github.com/anjotadena/reposage/actions/workflows/ci.yml"><img src="https://github.com/anjotadena/reposage/actions/workflows/ci.yml/badge.svg" alt="CI"/></a>
</p>

# RepoSage

CLI for analyzing source repositories and generating Cursor-ready developer context.

## What RepoSage Does

RepoSage helps you turn an unfamiliar repository into something both developers and AI tools can work with quickly. It scans the codebase, derives structure from files and manifests, and generates reusable context for Cursor.

Core capabilities:

- Scan a repository and report size, file counts, and key files.
- Detect languages, frameworks, test tooling, CI/CD, infrastructure, databases, entry points, and API routes.
- Infer a lightweight architecture summary and build a simple module dependency view.
- Surface basic security findings and coding-convention signals.
- Generate `.cursor/` assets for rules, commands, prompts, context, and automations.
- Generate stack-grounded `.cursor/skills/` artifacts to reduce AI hallucination.
- Generate `docs/context/` documentation for onboarding and repository understanding.

## Why It Exists

RepoSage is useful when a repository has little documentation, unclear structure, or weak onboarding material. Instead of manually piecing together framework choices, entry points, tooling, and conventions, you can run one command and generate a working context package for development in Cursor.

## Commands

```bash
reposage scan <path>
reposage analyze <path>
reposage generate [options] <path>
reposage explain [options] <path>
reposage update
```

| Command | Purpose |
|--------|---------|
| `scan <path>` | Fast repository scan with file statistics and detected key files |
| `analyze <path>` | Runs detection and prints a structured analysis summary |
| `generate <path>` | Generates Cursor assets and context docs from the analysis report |
| `explain <path>` | Prints a short human-readable repository summary |
| `update` | Updates a global install, or prints source-update instructions for linked/source installs |

## Installation

### Requirements

- Node.js `>=18`
- `npm` or `pnpm`
- Optional: [Cursor CLI](https://cursor.com/docs/cli/overview) for AI-backed generation

### Global install

```bash
npm install -g reposage
# or
pnpm add -g reposage
```

### From source

```bash
git clone https://github.com/anjotadena/reposage.git
cd reposage
pnpm install
pnpm run build
pnpm link
```

### Verify install

```bash
reposage --version
reposage --help
```

## Usage

### Quick start

```bash
# 1. Inspect a repository
reposage scan .

# 2. Get a structured summary
reposage analyze .

# 3. Generate Cursor context and docs
reposage generate . --no-ai
```

### AI-backed generation

`generate` uses Cursor CLI by default. If Cursor CLI is installed and authenticated, RepoSage can ask it to produce project-specific artifacts instead of using only Handlebars templates.

```bash
# Install Cursor CLI
curl https://cursor.com/install -fsS | bash

# Authenticate
agent login
agent status

# Generate with AI
reposage generate .
reposage generate . --model gpt-5.2
```

If Cursor CLI is unavailable, use template generation explicitly:

```bash
reposage generate . --no-ai
```

### Common workflows

```bash
# Scan a local repo
reposage scan ./my-project

# Analyze a repo before changing it
reposage analyze ./my-project

# Generate or refresh Cursor assets
reposage generate ./my-project --force

# Print a short repo summary
reposage explain ./my-project

# Update a global install
reposage update
```

### `generate` options

| Option | Description |
|--------|-------------|
| `--ai` | Use Cursor CLI with AI generation |
| `--no-ai` | Use built-in Handlebars templates |
| `-m, --model <model>` | Model passed to Cursor CLI, default `gpt-5.2` |
| `-f, --force` | Overwrite existing generated files without prompting |

Notes:

- If `.cursor/` already exists and `--force` is not provided, RepoSage asks for confirmation before overwriting generated assets.
- Generated output targets `.cursor/` and `docs/context/`.
- `README.md` is not part of the normal `generate` pipeline.

## What Gets Generated

Running `reposage generate <path>` creates or refreshes these artifacts:

```text
.cursor/
├── rules/           # 11 rule files
├── commands/        # 11 command files
├── prompts/         # 5 prompt files
├── context/         # 4 context files
├── automations/     # 6 automation workflows
└── skills/          # 1 stack-grounded skill bundle

docs/
└── context/         # 7 documentation files
```

Examples of generated assets:

- Rules for architecture, security, testing, naming, and tech stack.
- Commands such as `explain-repo`, `analyze-codebase`, `trace-feature`, and `generate-tests`.
- Prompts for feature generation, debugging, code review, refactoring, and unit-test writing.
- Automation playbooks for PR review, dependency review, release readiness, and security review.
- Skills for stack-grounded generation to reduce hallucination and keep outputs evidence-based.
- Context docs such as repo map, module index, coding conventions, and known risks.

## Detection Coverage

RepoSage is intentionally heuristic and evidence-driven. Today it recognizes the following areas directly in code:

### Languages

- TypeScript
- JavaScript
- Python
- Go
- Rust
- C#
- Java
- Ruby
- JSON
- Markdown

### Frameworks and test tooling

- React
- Next.js
- Vue
- Express
- Fastify
- NestJS
- Jest
- Vitest
- Mocha
- React Testing Library

### Delivery and infrastructure

- GitHub Actions
- GitLab CI
- Azure Pipelines
- Docker
- Docker Compose
- Terraform
- Kubernetes-style manifests and paths

### Repository signals

- `package.json` `main` and `bin` entry points
- `Program.cs` for ASP.NET-style entry points
- `main.py` for Python entry points
- Express-style route declarations such as `router.get(...)` and `app.post(...)`
- Database usage patterns for PostgreSQL, MySQL, SQLite, MongoDB, and Redis
- Basic security findings such as `eval`, `exec`, and obvious hardcoded secrets
- Coding-convention signals for ESLint, Prettier, EditorConfig, Husky, and strict TypeScript

## How It Works

RepoSage uses a five-phase pipeline:

1. Discovery: scans the repository with `fast-glob`, tracks file metadata, and collects key files.
2. Parsing: prepares repository content and manifests for downstream analysis.
3. Detection: runs detectors for stack, entry points, APIs, CI/CD, infrastructure, databases, and test tooling.
4. Analysis: synthesizes architecture, modules, security findings, and coding conventions.
5. Generation: renders Cursor assets and docs using AI or built-in templates.

## Project Structure

```text
src/
├── cli/         # command registration and handlers
├── scanners/    # repository discovery
├── detectors/   # stack and repository signal detection
├── analyzers/   # architecture, modules, security, conventions
├── generators/  # Cursor/doc generation
├── templates/   # Handlebars templates
├── models/      # report and detection types
├── utils/       # CLI helpers, filesystem helpers, Cursor CLI integration
├── validators/  # path/config validation
└── pipeline/    # orchestration
```

## Developer Usage

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Watch TypeScript during development
pnpm run dev

# Lint
pnpm run lint

# Auto-fix lint issues
pnpm run lint:fix

# Check formatting
pnpm run format:check

# Format source
pnpm run format

# Run the CLI locally
node dist/cli/index.js analyze .
node dist/cli/index.js generate . --no-ai
```

CI currently validates:

- Node.js 18 and 20
- `npm run lint`
- `npm run format:check`
- `npm run build`
- `npm audit --audit-level=high`

## Current Notes

- Architecture inference is lightweight and based mainly on detected frameworks.
- `explain --ai` currently falls back to the standard explanation flow.
- The generated artifacts are designed to bootstrap context quickly, not replace manual architecture review.

## License

MIT
