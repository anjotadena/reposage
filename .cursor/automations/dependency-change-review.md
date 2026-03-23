<!-- Generated: 2026-03-23T13:40:52.385Z | RepoSage 0.1.0 -->

# Dependency Change Review

Automated workflow for reviewing dependency additions, updates, and removals.

## Trigger

- Changes to `package.json`
- Dependabot or Renovate PRs
- Manual dependency audit request

## Goal

Assess impact and risk of dependency changes:
- Identify breaking changes in updated packages
- Check for security vulnerabilities
- Verify license compatibility
- Assess bundle size and performance impact
- Review transitive dependency changes

## Steps

1. **Parse Dependency Changes**
   - Identify added, removed, and updated packages
   - Note version changes (major, minor, patch)
   - List transitive dependency changes

2. **Security Assessment**
   - Check for known vulnerabilities (CVEs)
   - Review security advisories for updated packages
   - Verify package authenticity and maintainer reputation

3. **Breaking Change Analysis**
   - Review changelogs for major version bumps
   - Check for deprecated API usage in codebase
   - Identify required code changes

4. **License Review**
   - Verify licenses are compatible with project
   - Flag new copyleft or restrictive licenses
   - Check for license changes in updates

5. **Performance Impact**
   - Estimate bundle size change (for frontend)
   - Note performance-related changes in updates
   - Flag heavy new dependencies

6. **Compatibility Check**
   - Verify peer dependency requirements
   - Check Node.js runtime version compatibility
   - Note any conflicting dependency versions

7. **Generate Review Report**
   - Summarize changes by risk level
   - Provide action items for each concern
   - Make approval/rejection recommendation

## Signals to Inspect

- Dependency files: `package.json`
- Lock files: `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`
- Security sources: `npm audit`, GitHub Advisory Database

## Expected Output

```markdown
## Dependency Change Review

### Summary
- Added: X packages
- Updated: Y packages
- Removed: Z packages
- Risk Level: [High/Medium/Low]

---

### Added Dependencies

#### `new-package@1.2.3`
- **Purpose**: Brief description of why it's needed
- **Size**: 150KB (gzipped)
- **License**: MIT ✅
- **Security**: No known vulnerabilities ✅
- **Maintenance**: Active (last publish: 2 weeks ago) ✅
- **Recommendation**: ✅ Approve

---

### Updated Dependencies

#### `existing-package` 2.0.0 → 3.0.0 (MAJOR)
- **Breaking Changes**:
  - `oldMethod()` removed, use `newMethod()`
  - Config format changed
- **Security Fixes**: CVE-2024-XXXX patched ✅
- **Required Code Changes**:
  ```javascript
  // Before
  package.oldMethod()
  // After
  package.newMethod()
  ```
- **Recommendation**: ✅ Approve after code updates

#### `another-package` 1.5.0 → 1.6.0 (MINOR)
- **Changes**: New features, backward compatible
- **Security**: No issues
- **Recommendation**: ✅ Approve

---

### Removed Dependencies

#### `old-package@1.0.0`
- **Reason**: No longer used after refactor
- **Verification**: No imports found in codebase ✅
- **Recommendation**: ✅ Approve removal

---

### Security Summary
| Package | Severity | CVE | Status |
|---------|----------|-----|--------|
| `vuln-package` | High | CVE-2024-1234 | Fixed in update |

### License Summary
| Package | License | Compatible |
|---------|---------|------------|
| `new-package` | MIT | ✅ Yes |
| `gpl-package` | GPL-3.0 | ⚠️ Review required |

### Action Items
1. [ ] Update code for `existing-package` breaking changes
2. [ ] Review GPL license compatibility with legal
3. [ ] Run full test suite after updates

### Recommendation
⚠️ **Approve with changes** - Code updates required before merge
```

## Fallback

If dependency assessment is unclear:
- Flag package for manual security review
- Recommend staging environment testing
- Suggest contacting package maintainers for clarification
- Defer to security team for unknown packages
