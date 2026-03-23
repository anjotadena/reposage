<!-- Generated: 2026-03-23T23:22:28.194Z | RepoSage 0.1.0 -->

# Refresh Context on Structure Change

Automated workflow for keeping `.cursor/context/` synchronized with repository structure.

## Trigger

- New directories or modules added
- Configuration files changed (tsconfig, package.json, etc.)
- Entry points added or removed
- Significant refactoring (> 50% of a module changed)
- Dependency graph changes

## Goal

Ensure `.cursor/context/` files remain accurate and useful:
- Update project overview when structure changes
- Refresh architecture docs when patterns evolve
- Sync tech stack info with actual dependencies
- Maintain domain knowledge accuracy

## Steps

1. **Detect Structure Changes**
   - Compare current directory structure to context docs
   - Identify new, removed, or renamed modules
   - Note configuration file changes

2. **Assess Impact**
   - Determine which context files are affected
   - Prioritize updates by impact (architecture > tech-stack > domain)
   - Flag conflicts with existing documentation

3. **Update Project Overview**
   - Refresh directory structure section
   - Update entry points list
   - Revise key files and their purposes

4. **Update Architecture Overview**
   - Reflect new module boundaries
   - Update component relationships
   - Note any pattern changes (monolith → service, etc.)

5. **Sync Tech Stack**
   - Add newly detected frameworks or tools
   - Update version numbers if changed
   - Remove deprecated dependencies

6. **Refresh Domain Knowledge**
   - Add new terms or concepts from new modules
   - Update acronym definitions if changed
   - Remove obsolete domain concepts

7. **Validate Consistency**
   - Cross-check context files for contradictions
   - Verify links and references are valid
   - Generate change summary

## Signals to Inspect

- Entry points: `dist/cli/index.js`, `dist/cli/index.js`
- Config files: package.json, tsconfig.json, *.config.js, .env.example
- Structure indicators: src/, lib/, app/, components/, services/

## Expected Output

```markdown
## Context Refresh Report

### Changes Detected
- New modules: [list]
- Removed modules: [list]
- Modified configs: [list]

### Files Updated

#### .cursor/context/project-overview.md
- Added: new-module section
- Updated: directory structure
- Removed: deprecated-feature reference

#### .cursor/context/architecture-overview.md
- Updated: component diagram
- Added: new service layer

### Validation
- [x] All internal links valid
- [x] No contradictions found
- [x] Tech stack versions current

### Manual Review Needed
- [ ] Verify new-module purpose description
- [ ] Confirm architecture change is intentional
```

## Fallback

If changes are ambiguous:
- Generate draft updates marked "[NEEDS REVIEW]"
- Preserve original content in comments
- Request developer clarification for major restructuring
- Log changes for manual verification
