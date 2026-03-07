## Repository Map

- **Repository shape (from analyzer)**
  - **Languages present**: TypeScript (primary), Markdown, JSON, JavaScript (minimal)
  - **Frameworks detected**: none
  - **Architecture style inferred**: unknown (no framework signal)
  - **Modules detected**: none (module analyzer returned empty)

- **Top-level areas (identified by referenced paths)**
  - **`.github/`**
    - **`.github/workflows/ci.yml`**: GitHub Actions CI pipeline configuration
  - **`dist/`**
    - **`dist/cli/index.js`**: compiled CLI entry used for both `main` and `bin`

- **Key entry points**
  - **`dist/cli/index.js`**
    - **`package.json` `main`**: points here
    - **CLI `bin` (`reposage`)**: points here

- **Developer tooling / conventions**
  - **`eslint.config.js`**: ESLint configuration present
  - **`.prettierrc`**: Prettier configuration present
  - **Strict TypeScript**: enabled (per conventions analyzer)