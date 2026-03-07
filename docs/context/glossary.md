<!-- Generated: 2026-03-07T13:05:52.239Z | RepoSage 0.1.0 -->

# Glossary

Definitions in this glossary are derived solely from the repository analysis report generated on 2026-03-07.

## Project / build artifacts

### `reposage`
The detected CLI name (from the package `bin` entry) that maps to `dist/cli/index.js`.

### CLI (Command Line Interface)
An executable entry point intended to be run from a terminal. This repository’s CLI entry point is `dist/cli/index.js`.

### `dist/`
A directory name commonly used for build output. The analysis report identifies `dist/cli/index.js` as the runtime entry point.

### Entry point
A file designated as the program’s starting file by configuration. The analysis report detects:
- **`main` entry**: `dist/cli/index.js` (via the `package.json` `main` field)
- **`bin` entry**: `dist/cli/index.js` (via the CLI `bin` mapping)

### `main` (package entry)
A `package.json` field used to specify the primary module entry point for a package; detected as `dist/cli/index.js`.

### `bin` (package entry)
A `package.json` field used to specify executable command mappings for a package; detected as a CLI named `reposage` pointing at `dist/cli/index.js`.

## Languages / file types (detected)

### TypeScript (TS)
A typed superset of JavaScript. The report indicates TypeScript is the primary language by file count.

### JavaScript (JS)
A programming language used in the repository (detected, low file count relative to TypeScript).

### JSON
A data-interchange format; detected by `.json` files.

### Markdown
A lightweight markup format; detected by `.md` files.

## CI/CD

### CI (Continuous Integration)
Automated checks run on code changes. The report detects GitHub Actions CI configuration at `.github/workflows/ci.yml`.

### GitHub Actions
GitHub’s workflow automation system. Detected via `.github/workflows/ci.yml`.

### Workflow
A GitHub Actions configuration file defining automation steps. Detected workflow: `.github/workflows/ci.yml`.

## Code quality / formatting

### ESLint
A static analysis (linting) tool for JavaScript/TypeScript. The report indicates ESLint is present and references `eslint.config.js`.

### `eslint.config.js`
The detected ESLint configuration file path.

### Prettier
A code formatter. The report indicates Prettier is present and references `.prettierrc`.

### `.prettierrc`
The detected Prettier configuration file path.

### Strict TypeScript
A TypeScript configuration stance where stricter type-checking is enabled. The report indicates “strictTypeScript: true”.

## Infrastructure (explicitly not detected)

### Docker
Container tooling. The analysis report indicates Docker support was not detected.

### Docker Compose
Multi-container orchestration tooling. The analysis report indicates Docker Compose support was not detected.

### Terraform
Infrastructure-as-code tooling. The analysis report indicates Terraform support was not detected.

### Kubernetes
Container orchestration platform. The analysis report indicates Kubernetes support was not detected.