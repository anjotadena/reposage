<!-- Generated: 2026-03-23T13:40:52.385Z | RepoSage 0.1.0 -->

# Generate Feature

Generate a new feature for this codebase.

## Context

- Architecture: Unknown
- Follow patterns in `.cursor/context/architecture-overview.md`
- Match coding standards in `.cursor/rules/`

## Inputs

- **Feature name**: Clear, descriptive identifier
- **Description**: What the feature does
- **Acceptance criteria**: How to verify it works
- **Affected modules**: Where changes are needed (if known)

## Output Structure

1. **Implementation plan**
   - Files to create or modify
   - Dependencies and integration points
   - Risk areas to watch

2. **Code changes**
   - Follow existing patterns exactly
   - Include type definitions
   - Add appropriate error handling

3. **Tests**
   - Unit tests for new logic
   - Integration tests if boundaries crossed
   - Match existing test patterns

4. **Documentation**
   - Update relevant context files
   - Add JSDoc for public APIs

## Quality Expectations

- Code passes linter and formatter
- Tests pass with good coverage
- No security vulnerabilities introduced
- Documentation is current

## Automation Follow-up

After feature generation:
- Run `pr-review-or-risk-scan` before merge
- Run `test-plan-on-large-change` if spanning modules
