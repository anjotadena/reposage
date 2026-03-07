<!-- Cursor Command: explain-repo.md -->
# Explain repo (from analysis report)

Use the **Repository analysis report (JSON) provided in this chat context** as the **sole source of truth**. Do not infer frameworks/modules not present in the report; if data is missing or low-confidence, say so.

Provide a concise explanation for a developer:
- Summarize repo **structure** at a high level (languages, notable config, CI/CD).
- List **entry points** and what they imply (e.g., CLI/bin vs library).
- Call out **key modules/components** only if the report identifies them; otherwise state that modules were not detected.

Include the following facts exactly as reported:
- **Entry points**: `dist/cli/index.js` (main), `dist/cli/index.js` (bin: `reposage`)
- **CI/CD**: GitHub Actions at `.github/workflows/ci.yml`
- **Conventions**: ESLint + Prettier, strict TypeScript; configs: `.prettierrc`, `eslint.config.js`

Keep it to ~10–15 lines. No speculation. End with 2–3 “next questions to investigate” based on unknowns in the report.