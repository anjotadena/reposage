<!-- Generated: 2026-03-07T12:43:17.872Z | RepoSage 0.1.0 -->

# Coding Conventions

## Tooling (as detected)

- **ESLint**: present
  - **Config**: `eslint.config.js`
- **Prettier**: present
  - **Config**: `.prettierrc`
- **TypeScript**:
  - **Strict mode**: enabled

Not detected by the report:

- **EditorConfig**: not detected
- **Husky**: not detected

## Conventions to follow (brief)

- **Formatting**: format code using **Prettier** (per `.prettierrc`).
- **Linting**: keep code **ESLint-clean** (per `eslint.config.js`).
- **TypeScript**: write code compatible with **strict** TypeScript checking (avoid `any` where possible; narrow types; handle `null`/`undefined` explicitly).

## CI (as detected)

- **GitHub Actions**: `.github/workflows/ci.yml`
