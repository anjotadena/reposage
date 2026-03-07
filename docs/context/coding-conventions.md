<!-- Generated: 2026-03-07T13:05:52.239Z | RepoSage 0.1.0 -->

## Coding Conventions

### Scope

This repository is primarily **TypeScript** (also contains **Markdown**, **JSON**, and a small amount of **JavaScript**).

### Detected tools and configs

- **ESLint**: `eslint.config.js`
- **Prettier**: `.prettierrc`

### TypeScript conventions

- **Strict TypeScript is enabled** (per analysis). Prefer fully-typed APIs and avoid introducing `any` unless required by external boundaries.
- Keep types and runtime behavior aligned; if you widen a type, ensure runtime validation exists where inputs are untrusted.

### Formatting conventions (Prettier)

- Treat Prettier as the **source of truth for formatting**. Don’t hand-format code that Prettier will reflow.
- Keep changes formatted consistently across TypeScript, JavaScript, JSON, and Markdown according to `.prettierrc`.

### Linting conventions (ESLint)

- Keep code **lint-clean** according to `eslint.config.js`.
- Prefer refactors that reduce lint suppression; if suppression is unavoidable, keep it narrowly scoped.

### Documentation conventions

- Keep repository docs in Markdown formatted consistently (Prettier applies to `.md` as configured).
- Prefer small, focused docs updates that match the repository’s existing `docs/context/` structure.