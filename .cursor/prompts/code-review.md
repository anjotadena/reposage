<!-- Generated: 2026-03-14T02:16:42.230Z | RepoSage 0.1.0 -->

# Code Review

Review the selected changes for quality, security, and consistency.

## Context

- Reference `.cursor/rules/security.mdc` for security standards
- Reference `.cursor/rules/architecture.mdc` for architectural constraints
- Reference `.cursor/rules/coding-standards.mdc` for style

## Inputs

- **Changes**: Diff or file(s) to review
- **Focus areas** (optional): security, performance, maintainability, tests

## Review Checklist

### Code Quality
- [ ] Follows coding standards and naming conventions
- [ ] Functions are small and focused
- [ ] Error handling is appropriate
- [ ] No code duplication

### Security
- [ ] Input validation on external data
- [ ] No hardcoded secrets
- [ ] Safe use of external dependencies
- [ ] Proper authentication/authorization

### Architecture
- [ ] Respects module boundaries
- [ ] Follows detected architecture style
- [ ] No inappropriate dependencies

### Testing
- [ ] Adequate test coverage
- [ ] Tests are meaningful, not just present
- [ ] Edge cases covered

## Output Structure

```markdown
## Review Summary
- Risk level: [High/Medium/Low]
- Recommendation: [Approve/Request Changes/Needs Discussion]

## Findings

### Blockers (must fix)
1. [Finding with file:line and fix suggestion]

### Suggestions (should fix)
1. [Finding with rationale]

### Nits (optional)
1. [Minor improvement]

## Security Notes
- [Any security-relevant observations]

## Architecture Notes
- [Any architectural observations]
```

## Automation Integration

This prompt complements:
- `pr-review-or-risk-scan` automation for PR reviews
- `security-review` automation for security-focused review
