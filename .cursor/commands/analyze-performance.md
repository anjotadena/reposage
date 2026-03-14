<!-- Generated: 2026-03-14T02:16:42.230Z | RepoSage 0.1.0 -->

# Analyze Performance

Analyze performance of the selected code or feature.

## Context

Entry points to consider:
- `dist/cli/index.js` (main)
- `dist/cli/index.js` (bin)


## Inputs

- **Target**: Module, endpoint, or operation to analyze
- **Symptoms**: Observed performance issues (if any)
- **Goals**: Response time, throughput, or resource constraints

## Steps

1. Identify the critical path in the target code
2. Check for common performance anti-patterns:
   - N+1 queries
   - Blocking I/O in async code
   - Unnecessary data copying
   - Missing caching opportunities
3. Analyze algorithm complexity
4. Review resource usage (memory, connections, file handles)
5. Suggest profiling strategy

## Output

- Performance analysis summary
- Identified bottlenecks with severity
- Optimization recommendations (prioritized)
- Profiling or instrumentation suggestions
- Before/after complexity estimates

## Automation Integration

- Use `release-readiness-check` automation to verify performance after optimization
- Document performance-critical paths in `.cursor/context/`
