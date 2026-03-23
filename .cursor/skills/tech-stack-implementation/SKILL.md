<!-- Generated: 2026-03-23T23:22:28.194Z | RepoSage 0.1.0 -->

# Tech Stack Implementation

Use this skill before generating code, commands, or prompts. Anchor every output to detected technologies and avoid assumptions outside the repository evidence.

## Detected Stack Evidence

### Languages
- **JSON** (5 files, 3%)
- **Markdown** (37 files, 23%)
- **JavaScript** (1 files, 1%)
- **TypeScript** (53 files, 33%)

- No framework evidence available from analysis report.


## How To Use This Skill

1. Start from `.cursor/context/tech-stack.md` and this file.
2. Limit generated implementation patterns to detected languages/frameworks.
3. If a requested pattern is not present in stack evidence, mark it as `Unknown` and ask for confirmation.
4. Mirror existing lint, formatting, testing, and CI signals before proposing changes.
5. Prefer extending existing modules and conventions over introducing new architecture.

## Hallucination Guardrails

- Do not invent frameworks, services, or deployment targets not present in report evidence.
- Do not claim versions unless detected in manifests or lockfiles.
- Do not produce commands that assume unavailable tooling.
- Do not include cross-ecosystem patterns unless those ecosystems are detected in stack evidence.
- Call out uncertainty explicitly with required follow-up checks.


## Daily development workflow (this project)

1. **Context first**: `.cursor/context/project-overview.md` → `architecture-overview.md` → `tech-stack.md`.
2. **Rules**: `.cursor/rules/*.mdc` — especially `architecture.mdc`, `security.mdc`, `testing.mdc`.
3. **Commands**: use `.cursor/commands/` for repeatable tasks (`explain-repo`, `analyze-codebase`, `generate-tests`, etc.).
4. **Automations**: run `pr-review-or-risk-scan`, `security-review`, or `release-readiness-check` when the task matches.
5. **Refresh**: after large refactors, re-run RepoSage (`reposage rsync` or `reposage generate`) to align `.cursor/` with the repo.

## Productivity commands (Cursor)

| Goal | Command file |
|------|----------------|
| Orient | `explain-repo` |
| Deep dive | `analyze-codebase`, `trace-feature` |
| Ship safely | `review-risk`, `generate-tests`, `create-test-plan` |
| Ship release | use `release-readiness-check` automation |

## Output Quality Checks

- Generated file references at least one detected stack signal.
- Proposed code style aligns with detected conventions.
- Test strategy matches detected test framework.
- Security-sensitive code paths include validation and safe defaults.
