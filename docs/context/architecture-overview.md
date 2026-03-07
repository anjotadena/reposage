<!-- Generated: 2026-03-07T12:43:17.872Z | RepoSage 0.1.0 -->

# Architecture Overview

## Architecture Style (as detected)

- **Style**: **Unknown**
  - **Evidence**: The architecture analyzer did not infer a pattern from detected frameworks, and no frameworks were detected.

## Runtime Shape / Entry Points (as detected)

- **Packaged entry point**: `dist/cli/index.js`
  - **`package.json` `main`**: `dist/cli/index.js`
  - **`package.json` `bin`**: `reposage` → `dist/cli/index.js`

## Layers (evidence-based)

Only the following layers are directly evidenced by the analysis report:

- **Distribution / build output layer**: `dist/`
  - **CLI entry layer**: `dist/cli/index.js`

No additional source-layer structure (e.g., `src/`, domain/application/infrastructure boundaries) was detected by the report.

## Components and Relationships (as detected)

- **CLI (`reposage`)** invokes **`dist/cli/index.js`** (the same file is used for both `main` and `bin` entry points).

No other component graph (modules, services, API routing, database access) was detected by the report.

## Data / External Interfaces (as detected)

- **API routes**: none detected
- **Databases**: none detected

## Tooling That Shapes Architecture (as detected)

- **Linting/formatting**:
  - **ESLint**: `eslint.config.js` present
  - **Prettier**: `.prettierrc` present
- **TypeScript**:
  - **Strict mode**: enabled

## Delivery / Operations (as detected)

- **CI/CD**: GitHub Actions workflow at `.github/workflows/ci.yml`
- **Infrastructure as code / containers**:
  - Docker / Docker Compose / Terraform / Kubernetes: not detected
