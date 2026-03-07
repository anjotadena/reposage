<!-- Cursor Command: trace-feature.md -->
# Trace feature (from analysis report)

Use the **Repository analysis report (JSON) provided in this chat context** as the **sole source of truth** for repo facts (entry points, detected APIs/modules, databases, tooling). **Do not invent** modules, routes, databases, or frameworks that are not in the report. If the report is missing details (or is low confidence), say so and rely on **direct code inspection**.

## Goal
Trace a specific feature end-to-end **from entry point → command wiring → core logic → boundaries (“data layer”)** and produce a navigable, evidence-based trace with file/line citations.

## Inputs to ask for (if not provided)
- Feature name and user-visible behavior (“what should happen?”).
- How to trigger it (exact CLI invocation, flags, args, example input/output).
- Any relevant files, config, or env vars the user suspects are involved.

## Report facts you must anchor to
- **Entry points**:
  - `dist/cli/index.js` (main)
  - `dist/cli/index.js` (bin: `reposage`)
- **Detected modules / API routes / databases**: if the report shows none, explicitly state “not detected in report” and treat “data layer” as external boundaries (filesystem, network, subprocess, env/config).

## Tracing procedure (do this in order)
1. Start at the entry point `dist/cli/index.js`. Identify:
   - CLI argument parsing and command dispatch
   - How subcommands/handlers are registered
   - Global config/logging/error handlers initialized early
2. From the user’s invocation (or the closest matching command), follow the call chain through:
   - Command handler function(s)
   - Service/library functions called by the handler
   - Any adapters for IO (filesystem reads/writes, network requests, subprocess execution, env/config loading)
3. If code in `dist/` is compiled output, try to map to source by:
   - Following source maps if present, or
   - Searching in `src/` for the same command name, flags, error messages, or key strings/types used in the `dist/` handler.
4. Continue tracing until you hit **data boundaries** (the “data layer”), such as:
   - File system operations (read/write, globbing, path construction)
   - Network calls (HTTP clients, fetch, sockets)
   - Subprocess execution
   - Serialization/deserialization (JSON/YAML/etc.)
   - Persistent storage (if any is found in code, even if not detected in the report)
5. For each step, capture:
   - File path + exact symbol (function/class) names
   - Key inputs/outputs and transformations
   - Error handling and retry/backoff behavior (if any)
   - Security-relevant handling (validation/sanitization, path safety, command injection risks)

## Required output format
Produce a concise report with these sections:

### 1) Feature definition
- What the feature is, how it’s triggered, expected result.
- Any assumptions (clearly labeled).

### 2) End-to-end trace (numbered)
A numbered chain from entrypoint to boundary, like:
- (1) Entry point → (2) Command dispatch → (3) Handler → (4) Service → (5) Adapter → (6) Boundary
Each step must include **file + symbol + line references** where possible.

### 3) Data flow + side effects
- What data enters/leaves the system
- Where state is persisted (or explicitly “none found”)
- External dependencies touched (FS/network/subprocess/env)

### 4) Key types / schemas / contracts
- Important TypeScript types/interfaces (or runtime schemas) governing the feature.

### 5) Failure modes and observability
- Expected errors, where they are thrown/caught
- Logging/telemetry hooks (if any)
- User-facing error messages and exit codes (for CLI flows)

### 6) Security notes (only what you can prove from code)
- Input validation gaps, unsafe path handling, risky subprocess usage, secrets exposure risks.

### 7) Verification pointers
- Minimal steps to manually verify the traced path
- Any existing tests you found that cover it (or “no tests found for this path”)

Keep it evidence-based, avoid speculation, and prefer short, high-signal bullet points.