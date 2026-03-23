<!-- Generated: 2026-03-23T23:22:28.194Z | RepoSage 0.1.0 -->

# Release Readiness Check

Automated workflow for validating release readiness before deployment.

## Trigger

- Version bump (package.json, version.ts, etc.)
- Release branch creation
- Tag creation matching release pattern (v*, release-*)
- Pre-deployment manual check
- CI/CD pipeline pre-release stage

## Goal

Validate that the release is safe, complete, and well-documented:
- All tests pass and coverage is adequate
- Breaking changes are documented
- Dependencies are secure and up-to-date
- Documentation reflects current state
- No critical bugs or blockers remain

## Steps

1. **Verify Test Status**
   - Confirm all test suites pass
   - Check coverage meets threshold
   - Identify any skipped or flaky tests

2. **Review Breaking Changes**
   - Scan for API changes since last release
   - Check for removed or renamed exports
   - Verify migration guides if needed

3. **Audit Dependencies**
   - Run security audit (`npm audit`)
   - Check for outdated critical dependencies
   - Verify license compatibility

4. **Validate Documentation**
   - Ensure CHANGELOG is updated
   - Verify README reflects current features
   - Check API documentation is current

5. **Check Configuration**
   - Verify environment configs are production-ready
   - Check for debug flags or dev-only settings
   - Validate deployment configuration

6. **Review Open Issues**
   - Check for release-blocking bugs
   - Verify all release milestone items closed
   - Note known issues for release notes

7. **Generate Release Report**
   - Compile checklist with pass/fail status
   - List blocking issues if any
   - Provide release recommendation

## Signals to Inspect

- Version: 0.1.0
- Analysis date: Tue Mar 24 2026 07:22:28 GMT+0800 (Philippine Standard Time)
- Entry points to verify: `dist/cli/index.js`, `dist/cli/index.js`
- Release files: CHANGELOG.md, package.json, version.ts
- Config files: .env.production, config/production.*
- CI status: .github/workflows/, .gitlab-ci.yml

## Expected Output

```markdown
## Release Readiness Report

### Version: X.Y.Z
### Date: YYYY-MM-DD
### Status: ✅ Ready / ⚠️ Ready with Notes / ❌ Blocked

---

### Checklist

#### Tests
- [x] All unit tests pass (150/150)
- [x] Integration tests pass (25/25)
- [x] Coverage: 85% (threshold: 80%)
- [ ] E2E tests: 2 flaky tests noted

#### Breaking Changes
- [x] No breaking API changes
- [x] Deprecation warnings added for v2 removals

#### Dependencies
- [x] Security audit: 0 vulnerabilities
- [x] All dependencies up to date
- [x] License check passed

#### Documentation
- [x] CHANGELOG updated
- [x] README current
- [ ] API docs: minor update needed

#### Configuration
- [x] Production config verified
- [x] No debug flags enabled
- [x] Environment variables documented

---

### Blocking Issues
None

### Known Issues (non-blocking)
- Flaky test in auth module (tracked: #123)
- Minor typo in API docs

### Release Notes Draft
**New Features**
- Feature A: description
- Feature B: description

**Bug Fixes**
- Fixed issue with X
- Resolved Y edge case

**Improvements**
- Performance improvement in Z

### Recommendation
✅ **Proceed with release** - all critical checks pass
```

## Fallback

If readiness is uncertain:
- List specific blocking items with owners
- Recommend release delay with timeline
- Suggest partial/phased release if possible
- Escalate to release manager for decision
