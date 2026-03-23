<!-- Generated: 2026-03-23T23:22:28.194Z | RepoSage 0.1.0 -->

# Analyze Codebase

Analyze the repository structure, architecture, hotspots, and likely change impact for a given area of the codebase.

## Context

Use these sources first:
- `.cursor/context/project-overview.md`
- `.cursor/context/architecture-overview.md`
- `.cursor/context/tech-stack.md`
- `.cursor/context/domain-knowledge.md`
- `.cursor/skills/tech-stack-implementation/SKILL.md`

Entry points to consider:
- `dist/cli/index.js` (main)
- `dist/cli/index.js` (bin)

## Inputs

- **Scope**: File, directory, module, or feature area to analyze
- **Focus**: Architecture, data flow, dependencies, risks, conventions, or change impact
- **Depth**: Quick summary or deep analysis

## Steps

1. Identify the relevant entry points, modules, and boundaries for the requested scope
2. Constrain analysis and recommendations to detected tech stack evidence
3. Summarize the responsibility of each important file or component
4. Trace inbound and outbound dependencies
5. Call out architectural patterns, conventions, and coupling hotspots
6. Highlight risks, missing tests, or unclear ownership
7. Suggest safe next steps for implementation, refactoring, or debugging

## Output

- Codebase analysis summary
- Key files and responsibilities
- Dependency and data-flow notes
- Risks or unknowns
- Recommended next actions

## Automation Integration

- Use `pr-review-or-risk-scan` for change-risk follow-up
- Use `refresh-context-on-structure-change` after structural updates
