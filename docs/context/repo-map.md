<!-- Generated: 2026-03-07T12:43:17.872Z | RepoSage 0.1.0 -->

# Repository Map (`reposage`)

- **Primary purpose (from detected entry points)**:
  - **CLI runtime entry**: `dist/cli/index.js`
    - **package main**: `dist/cli/index.js` (per `package.json` `main`)
    - **package bin**: `reposage` → `dist/cli/index.js`

- **Top-level map (known paths from analysis)**:
  - **`.github/`**: CI/CD configuration
    - **GitHub Actions workflow**: `.github/workflows/ci.yml`
  - **`dist/`**: distribution/build output
    - **CLI entry**: `dist/cli/index.js`
  - **Formatting/lint config**:
    - **Prettier**: `.prettierrc`
    - **ESLint**: `eslint.config.js`

- **Detected languages (by file count)**:
  - **TypeScript (`.ts`, `.tsx`)**: 43 files (~49%)
  - **Markdown (`.md`)**: 13 files (~15%)
  - **JSON (`.json`)**: 3 files (~3%)
  - **JavaScript (`.js`, `.jsx`, `.mjs`, `.cjs`)**: 1 file (~1%)

- **Architecture / modules (as detected)**:
  - **Architecture style**: Unknown (no framework-based pattern inferred)
  - **Modules**: none detected

- **Testing / runtime surface (as detected)**:
  - **Test frameworks**: none detected
  - **API routes**: none detected
  - **Databases**: none detected

- **Infrastructure (as detected)**:
  - **Docker**: not detected
  - **Docker Compose**: not detected
  - **Terraform**: not detected
  - **Kubernetes**: not detected

- **Coding conventions (as detected)**:
  - **ESLint**: present
  - **Prettier**: present
  - **TypeScript strict mode**: enabled
