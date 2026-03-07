<p align="center">
  <img src="assets/reposage_logo.png" alt="RepoSage" width="450"/>
</p>

<p align="center">
  <a href="https://github.com/anjotadena/reposage/actions/workflows/ci.yml"><img src="https://github.com/anjotadena/reposage/actions/workflows/ci.yml/badge.svg" alt="CI"/></a>
</p>

# RepoSage

**AI-powered repository understanding and developer context generator**

---

## Overview

RepoSage is a CLI application that analyzes source code repositories and generates **Cursor-ready developer context**: rules, commands, prompts, and documentation. It helps developers understand unfamiliar codebases quickly, especially those that lack documentation and tests.

### The Problem

When you join a new project or inherit a legacy codebase, you often face:

- Sparse or outdated documentation
- No tests to guide behavior
- Unclear architecture and module boundaries
- Missing context for AI-assisted development (e.g., Cursor)

### The Solution

RepoSage scans repositories, detects tech stack and architecture, and generates structured context that both humans and AI tools can use. All analysis is **evidence-driven**—it reports only what it finds in files and manifests, without inventing frameworks or architecture.

### Who It Is For

- Developers onboarding to new or legacy repositories
- Teams adopting Cursor or similar AI-assisted IDEs
- Maintainers documenting undocumented codebases
- Architects reviewing repository structure and risks

---

## Key Features

- **Repository scanning** — Fast file traversal with configurable ignore patterns
- **Tech stack detection** — Languages, frameworks, dependency managers, test frameworks
- **Architecture inference** — MVC, layered, monolith, microservices from evidence
- **Module analysis** — Import-based dependency graph and module boundaries
- **CI/CD detection** — GitHub Actions, GitLab CI, Azure Pipelines
- **Infrastructure detection** — Docker, Terraform, Kubernetes manifests
- **Security analysis** — Dangerous patterns, hardcoded secrets, auth middleware
- **Cursor rule generation** — Context-aware `.mdc` rules for Cursor IDE
- **Cursor command generation** — Pre-built commands for explain, trace, document, review
- **Context documentation** — Repo map, architecture overview, module index, glossary, risks
- **AI-powered generation** — Uses Cursor CLI with GPT-5 (or templates as fallback)

---

## Example Output

Running `reposage generate ./my-repo` produces:

```
.cursor/
├── rules/
│   ├── 00-repo-baseline.mdc
│   ├── 10-architecture.mdc
│   ├── 20-testing-strategy.mdc
│   ├── 30-security.mdc
│   └── 40-tech-stack.mdc
└── commands/
    ├── explain-repo.md
    ├── trace-feature.md
    ├── create-test-plan.md
    ├── document-module.md
    └── review-risk.md

docs/
└── context/
    ├── repo-map.md
    ├── architecture-overview.md
    ├── module-index.md
    ├── coding-conventions.md
    ├── testing-strategy.md
    ├── glossary.md
    └── known-risks.md

README.md
```

---

## Installation

### Prerequisites

- **Node.js** 18 or later
- **npm** or **pnpm**

### Install RepoSage

**Global install (recommended):**

```bash
npm install -g reposage
# or
pnpm add -g reposage
```

**From source:**

```bash
git clone https://github.com/anjotadena/reposage.git
cd reposage
pnpm install
pnpm run build
pnpm link
```

**Verify:**

```bash
reposage --version
```

### Cursor CLI (for AI generation)

AI-powered generation (default) requires the [Cursor CLI](https://cursor.com/docs/cli/overview) to be installed and authenticated.

```bash
# macOS, Linux, WSL
curl https://cursor.com/install -fsS | bash

# Windows PowerShell
irm 'https://cursor.com/install?win32=true' | iex

# Log in
agent login
agent status   # Verify
```

Use `--no-ai` to generate with templates when Cursor CLI is not available.

---

## Usage

### Commands

```bash
reposage scan <path>      # Scan repository, report file statistics
reposage analyze <path>   # Analyze structure and tech stack
reposage generate <path>  # Generate Cursor rules, commands, docs
reposage explain <path>   # Human-readable repository summary
```

### Examples

**Scan a repository:**

```bash
reposage scan .
reposage scan ./my-project
```

**Analyze and view report:**

```bash
reposage analyze .
```

**Generate Cursor context (AI, default):**

```bash
reposage generate .
reposage generate . --model gpt-5.2
reposage generate . --force   # Overwrite existing files
```

**Generate with templates (no Cursor CLI):**

```bash
reposage generate . --no-ai
```

**Get a quick summary:**

```bash
reposage explain .
```

### Generate Options

| Option | Description |
|--------|-------------|
| `--ai` | Use Cursor CLI with AI (default) |
| `--no-ai` | Use Handlebars templates instead |
| `-m, --model <model>` | AI model (default: gpt-5.2) |
| `-f, --force` | Overwrite existing generated files |

---

## How It Works

RepoSage uses a five-phase analysis pipeline:

1. **Repository scan** — `FileScanner` traverses the repo with fast-glob, collects file metadata, and builds a key-files map (package.json, Dockerfile, etc.).

2. **Stack detection** — Parallel detectors identify:
   - Languages (from file extensions)
   - Frameworks (from dependencies and config files)
   - Test frameworks, CI/CD, infrastructure, databases
   - Entry points, API routes

3. **Architecture inference** — Analyzers synthesize detection results into:
   - Architecture style (MVC, layered, monolith, etc.)
   - Module dependency graph
   - Security findings
   - Coding conventions (ESLint, Prettier, etc.)

4. **Context generation** — Either Cursor CLI (AI) or Handlebars templates produce rules, commands, and documentation from the analysis report.

All findings include confidence levels and evidence sources.

---

## Project Architecture

```
src/
├── cli/                 # Commander-based CLI, command handlers
├── scanners/            # FileScanner, ContentScanner, DependencyScanner
├── detectors/           # Language, Framework, CICD, Infrastructure, etc.
├── analyzers/           # Architecture, Module, Security, CodingConventions
├── generators/          # CursorRule, CursorCommand, ContextDoc, Readme
├── templates/           # Handlebars templates (cursor/, docs/)
├── models/              # ScanResult, DetectionResult, AnalysisReport
├── utils/               # logger, file, ripgrep, hash, cursorCli
├── validators/          # PathValidator, ConfigValidator
└── pipeline/            # AnalysisPipeline orchestrator
```

| Module | Responsibility |
|--------|----------------|
| `cli` | Argument parsing, progress output, error handling |
| `scanners` | File system traversal, content reading, manifest parsing |
| `detectors` | Pattern matching for languages, frameworks, CI/CD, etc. |
| `analyzers` | Cross-cutting synthesis (architecture, modules, security) |
| `generators` | Template rendering or Cursor CLI invocation |
| `templates` | Handlebars templates for fallback generation |
| `models` | TypeScript interfaces for scan/detection/report data |
| `utils` | Logging, file helpers, ripgrep wrapper, Cursor CLI integration |
| `validators` | Path and config validation |
| `pipeline` | Orchestrates phases 1–5 in order |

---

## Generated Artifacts

| Artifact | Purpose |
|----------|---------|
| **Cursor rules** (`.mdc`) | Provide Cursor IDE with repository context: baseline, architecture, testing, security, tech stack |
| **Cursor commands** (`.md`) | Pre-built prompts for explain-repo, trace-feature, create-test-plan, document-module, review-risk |
| **Context docs** | Repo map, architecture overview, module index, coding conventions, testing strategy, glossary, known risks |

Each generated file includes a header with generation date and RepoSage version.

---

## Supported Technologies

**Languages & runtimes:** TypeScript, JavaScript, Python, Go, Rust, C#, Java, Ruby

**Manifests:** package.json, requirements.txt, go.mod, Cargo.toml, *.csproj, pom.xml, build.gradle

**CI/CD:** GitHub Actions, GitLab CI, Azure Pipelines

**Infrastructure:** Dockerfile, docker-compose, Terraform, Kubernetes manifests

**Databases:** PostgreSQL, MySQL, SQLite, MongoDB, Redis (via import/pattern detection)

---

## Development

```bash
# Clone and install
git clone https://github.com/your-org/reposage.git
cd reposage
pnpm install

# Build
pnpm run build

# Watch mode
pnpm dev

# Lint and format
pnpm run lint
pnpm run lint:fix
pnpm run format

# Run locally
node dist/cli/index.js scan .
```

---

## Contributing

Contributions are welcome. Please:

1. Open an issue to discuss significant changes
2. Fork the repo and create a feature branch
3. Follow existing code style (ESLint, Prettier)
4. Add or update tests where applicable
5. Submit a pull request with a clear description

---

## Roadmap

- [ ] AST-based analysis (tree-sitter) for deeper code understanding
- [ ] Richer architecture inference (hexagonal, clean architecture)
- [ ] Test coverage analysis and recommendations
- [ ] Dependency graph visualization
- [ ] IDE integrations (VS Code extension)
- [ ] Configurable detection rules and custom templates

---

## License

MIT
