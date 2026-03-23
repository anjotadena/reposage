<!-- Generated: 2026-03-23T13:40:52.385Z | RepoSage 0.1.0 -->

# Tech Stack Implementation

Use this skill before generating code, commands, or prompts. Anchor every output to detected technologies and avoid assumptions outside the repository evidence.

## Detected Stack Evidence

### Languages
- **JSON** (5 files, 3%)
- **Markdown** (37 files, 23%)
- **JavaScript** (1 files, 1%)
- **TypeScript** (49 files, 31%)

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


## Output Quality Checks

- Generated file references at least one detected stack signal.
- Proposed code style aligns with detected conventions.
- Test strategy matches detected test framework.
- Security-sensitive code paths include validation and safe defaults.
