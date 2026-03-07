<!-- Generated: 2026-03-07T12:43:17.872Z | RepoSage 0.1.0 -->

# Glossary

Terms, acronyms, and concepts referenced by the repository analysis report.

## A

- **APIDetector**: The detector named in the report section `apiRoutes`.
- **API routes**: HTTP/API route surface. **Not detected** by the report.
- **ArchitectureAnalyzer**: The detector named in the report section `architecture`.
- **Architecture style**: High-level architecture classification. Reported as **Unknown** (“No architecture pattern inferred from detected frameworks”).

## B

- **bin (package.json field)**: A Node.js package field that defines executable command(s). Report detected **CLI: `reposage`** mapped to `dist/cli/index.js`.

## C

- **CI**: Continuous Integration. In this repository, detected via **GitHub Actions**.
- **CI/CD**: Continuous Integration / Continuous Delivery (or Deployment). In this repository, detected via **GitHub Actions** at `.github/workflows/ci.yml`.
- **CICDDetector**: The detector named in the report section `cicd`.
- **CLI**: Command-Line Interface. Reported entry point: `dist/cli/index.js`; command name: `reposage`.
- **Confidence**: Per-section confidence score reported by the analyzers (e.g., high/medium/low).

## D

- **DatabaseDetector**: The detector named in the report section `databases`.
- **Databases**: Persistent data stores. **Not detected** by the report.
- **dist/**: Distribution/build output directory. Reported to contain the CLI entry at `dist/cli/index.js`.

## E

- **EditorConfig**: Repository formatting convention file family. **Not detected** by the report.
- **ESLint**: JavaScript/TypeScript linter. Report says **present**; config file: `eslint.config.js`.
- **Entry point**: A runtime start file exposed by packaging metadata. Reported entry points:
  - `main`: `dist/cli/index.js`
  - `bin`: `reposage` → `dist/cli/index.js`

## F

- **FrameworkDetector**: The detector named in the report section `frameworks`.
- **Frameworks**: Application frameworks identified by the report. **None detected**.

## G

- **GitHub Actions**: CI/CD system detected by the report. Workflow file: `.github/workflows/ci.yml`.

## H

- **Husky**: Git hooks management tool. **Not detected** by the report.

## I

- **InfrastructureDetector**: The detector named in the report section `infrastructure`.

## J

- **JavaScript**: Language detected in the repo (extensions: `.js`, `.jsx`, `.mjs`, `.cjs`).
- **JSON**: Data format detected in the repo (extension: `.json`).

## K

- **Kubernetes**: Container orchestration. **Not detected** by the report.

## L

- **LanguageDetector**: The detector named in the report section `languages`.

## M

- **main (package.json field)**: A Node.js package field that defines the primary module entry. Report detected `main` as `dist/cli/index.js`.
- **Markdown**: Documentation format detected in the repo (extension: `.md`).
- **ModuleAnalyzer**: The detector named in the report section `modules`.
- **Modules**: Higher-level module structure as detected by the report. **None detected**.

## P

- **Prettier**: Code formatter. Report says **present**; config file: `.prettierrc`.

## R

- **RepoSage**: The report generator name/version shown in generated context docs (“RepoSage 0.1.0”).
- **reposage**: The CLI command name detected via the package `bin` entry; maps to `dist/cli/index.js`.

## S

- **scanDurationMs**: Report metadata field for scan runtime in milliseconds (reported as `0` in this run).
- **SecurityAnalyzer**: The detector named in the report section `security`.
- **Security findings**: Security-related detections in the report. **None reported**.
- **Strict TypeScript**: TypeScript compiler checking mode. Report says **strict mode enabled**.

## T

- **Terraform**: Infrastructure-as-code tool. **Not detected** by the report.
- **TestFrameworkDetector**: The detector named in the report section `testFrameworks`.
- **Test frameworks**: Testing tools/frameworks. **None detected** by the report.
- **TypeScript**: Language detected in the repo (extensions: `.ts`, `.tsx`).

## W

- **Workflow (GitHub Actions)**: A CI/CD configuration file under `.github/workflows/`. Report detected `.github/workflows/ci.yml`.
