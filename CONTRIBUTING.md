# Contributing to RepoSage

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automatic versioning.

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types and Version Bumps

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | **Minor** (1.0.0 → 1.1.0) |
| `fix` | Bug fix | **Patch** (1.0.0 → 1.0.1) |
| `perf` | Performance improvement | Patch |
| `refactor` | Code refactoring | Patch |
| `docs` | Documentation only | No release |
| `test` | Adding/updating tests | No release |
| `chore` | Maintenance tasks | No release |
| `ci` | CI/CD changes | No release |

### Breaking Changes

Add `!` after the type or include `BREAKING CHANGE:` in the footer for **major** version bumps:

```bash
# Major bump (1.0.0 → 2.0.0)
feat!: remove deprecated scan options

# Or with footer
feat: redesign CLI interface

BREAKING CHANGE: The --verbose flag has been renamed to --debug
```

### Examples

```bash
# Patch release (1.0.0 → 1.0.1)
git commit -m "fix(scanner): handle empty directories correctly"

# Minor release (1.0.0 → 1.1.0)
git commit -m "feat(detectors): add Rust framework detection"

# Major release (1.0.0 → 2.0.0)
git commit -m "feat!: redesign analysis pipeline API"

# No release (docs only)
git commit -m "docs: update README with new examples"
```

### Scopes (Optional)

Common scopes for this project:

- `cli` - Command-line interface
- `scanner` - File scanning
- `detector` - Tech stack detection
- `analyzer` - Analysis pipeline
- `generator` - Output generation
- `templates` - Handlebars templates

## How Releases Work

1. Push commits to `main` using conventional commit messages
2. Release Please automatically creates/updates a release PR
3. The PR accumulates changes and updates the changelog
4. When you merge the release PR:
   - Version in `package.json` is bumped
   - Git tag is created (e.g., `v1.1.0`)
   - GitHub Release is published
   - Package is published to npm (if configured)

## Development Workflow

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Lint and format
pnpm run lint:fix
pnpm run format

# Test locally
node dist/cli/index.js scan .
```
