# RepoSage

CLI tool that analyzes source code repositories and generates **Cursor-ready developer context**: rules, commands, prompts, and documentation. Helps developers understand unfamiliar repositories quickly, especially those lacking documentation and tests.

## Installation

```bash
npm install -g reposage
# or with pnpm
pnpm add -g reposage
```

From source:

```bash
git clone <repo>
cd reposage
npm install
npm run build
npm link
```

## CLI Usage

```bash
reposage scan <path>      # Scan repository, report file statistics
reposage analyze <path>  # Analyze structure and tech stack
reposage generate <path> # Generate Cursor rules, commands, docs
reposage explain <path>  # Human-readable repository summary
```

Options:

- `reposage generate <path> --force` — Overwrite existing generated files

## Generated Output

Running `reposage generate ./my-repo` produces:

```
.cursor/
  rules/           # 5 Cursor rule files (.mdc)
  commands/        # 5 Cursor command files
docs/
  context/         # 7 context documentation files
README.md          # Repository overview (with --force)
```

## Architecture

RepoSage uses a five-phase pipeline:

1. **Discovery** — FileScanner traverses the repo with fast-glob
2. **Content Parsing** — DependencyScanner parses manifests (package.json, requirements.txt, etc.)
3. **Detection** — Parallel detectors identify languages, frameworks, CI/CD, infrastructure, APIs
4. **Analysis** — Analyzers infer architecture, modules, security findings, coding conventions
5. **Generation** — Handlebars templates render Cursor rules, commands, and docs

All analysis is evidence-driven; no assumptions are made without file or pattern evidence.

## Example Output

**Scan:**
```
✔ Scan complete
Repository: /path/to/repo
Total files: 82
Total size: 140.6 KB
Key files: 2
  - package.json: package.json
  - package-lock.json: package-lock.json
```

**Analyze:**
```
✔ Analysis complete
--- Analysis Report ---
Languages: TypeScript (49%), Markdown (16%), JSON (4%)
Frameworks: Express (backend)
Entry points: main: dist/cli/index.js
Architecture: Monolith
```

## Tech Stack

- TypeScript, Node.js, ES2022
- Commander (CLI), fast-glob (scanning), Handlebars (templates)
- Chalk, Ora (terminal output)

## License

MIT
