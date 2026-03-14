<!-- Generated: 2026-03-14T02:16:42.230Z | RepoSage 0.1.0 -->

# Create Module

Create a new module following repository conventions.

## Context


## Inputs

- **Module name**: What to call this module
- **Purpose**: What responsibility it handles
- **Dependencies**: Other modules it imports (if known)

## Steps

1. Check `.cursor/context/architecture-overview.md` for module patterns
2. Verify the name follows existing conventions
3. Create directory structure matching siblings
4. Implement with proper exports and types
5. Add index file if pattern exists
6. Create basic tests following test patterns

## Output

- Module directory with source files
- Export declarations (index.ts or equivalent)
- Basic test file if test framework detected
- Documentation comments for public APIs

## Automation Integration

After creating a module:
- Run `refresh-context-on-structure-change` automation
- Update `.cursor/context/` if needed
