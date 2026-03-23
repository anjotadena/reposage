/**
 * Generates Cursor skill files in .cursor/skills/
 */

import path from "node:path";
import { BaseGenerator } from "./base/BaseGenerator.js";
import { generateSkillViaAI } from "./AIGenerator.js";
import { buildStackProfile } from "./stackProfile.js";

const SKILL_FILES = ["tech-stack-implementation"];
const CORE_SKILL_PACK: Array<{ fileName: string; content: string }> = [
  {
    fileName: "code-review.yaml",
    content: `name: code-review
description: Perform a comprehensive code review for quality, security, and maintainability
instructions: |
  Analyze the provided code and identify:
  1. Bugs or logical errors
  2. Security vulnerabilities
  3. Performance issues
  4. Code smells and maintainability concerns
rules:
  - Detect programming language automatically
  - Apply idiomatic best practices
  - Follow SOLID, DRY, KISS
  - Prioritize production-ready fixes
input_requirements:
  - Source code or file
output_format: |
  ## Summary
  ## Issues Found
  ## Recommendations
  ## Example Fixes
`,
  },
  {
    fileName: "refactor-safe.yaml",
    content: `name: refactor-safe
description: Improve code structure without changing behavior
instructions: |
  Refactor the code to improve readability, maintainability, and structure.
  Ensure no functional behavior is changed.
rules:
  - Preserve existing behavior
  - Improve naming and structure
  - Remove duplication
  - Keep changes minimal and safe
input_requirements:
  - Source code
output_format: |
  ## Changes Made
  ## Before vs After
  ## Rationale
`,
  },
  {
    fileName: "feature-implementation.yaml",
    content: `name: feature-implementation
description: Implement a feature based on a user story
instructions: |
  Translate the user story into implementation.
  Create necessary modules, handlers, and data interactions.
rules:
  - Follow separation of concerns
  - Include validation and error handling
  - Keep design modular and testable
input_requirements:
  - User story or requirements
output_format: |
  ## Design
  ## Components
  ## Implementation
  ## Notes
`,
  },
  {
    fileName: "system-design.yaml",
    content: `name: system-design
description: Design a scalable and maintainable system
instructions: |
  Design system architecture including components, interactions, and data flow.
rules:
  - Use modular architecture
  - Consider scalability and fault tolerance
  - Avoid over-engineering
input_requirements:
  - Problem description
output_format: |
  ## Overview
  ## Components
  ## Data Flow
  ## Trade-offs
`,
  },
  {
    fileName: "api-design.yaml",
    content: `name: api-design
description: Design API endpoints and contracts
instructions: |
  Define endpoints, inputs, outputs, and validation rules.
rules:
  - Follow REST or GraphQL principles
  - Ensure consistency
  - Include error handling
input_requirements:
  - Feature description
output_format: |
  ## Endpoints
  ## Request/Response
  ## Validation Rules
`,
  },
  {
    fileName: "data-modeling.yaml",
    content: `name: data-modeling
description: Design efficient data structures and schemas
instructions: |
  Create entities, relationships, and indexes.
rules:
  - Optimize for query patterns
  - Ensure scalability
  - Avoid redundancy
input_requirements:
  - Data requirements
output_format: |
  ## Entities
  ## Relationships
  ## Index Strategy
`,
  },
  {
    fileName: "test-generation.yaml",
    content: `name: test-generation
description: Generate unit and integration tests
instructions: |
  Create tests covering happy path, edge cases, and failures.
rules:
  - Ensure high coverage
  - Use clear naming
  - Keep tests maintainable
input_requirements:
  - Code or feature
output_format: |
  ## Test Cases
  ## Implementation
`,
  },
  {
    fileName: "bug-finder.yaml",
    content: `name: bug-finder
description: Identify root causes of issues
instructions: |
  Analyze code or logs to find bugs and root causes.
rules:
  - Focus on root cause, not symptoms
  - Provide fix suggestions
input_requirements:
  - Code or logs
output_format: |
  ## Issue
  ## Root Cause
  ## Fix Recommendation
`,
  },
  {
    fileName: "performance-optimization.yaml",
    content: `name: performance-optimization
description: Improve system performance
instructions: |
  Identify bottlenecks and suggest optimizations.
rules:
  - Focus on high-impact changes
  - Consider memory and CPU usage
input_requirements:
  - Code or system description
output_format: |
  ## Bottlenecks
  ## Recommendations
`,
  },
  {
    fileName: "security-audit.yaml",
    content: `name: security-audit
description: Detect security vulnerabilities
instructions: |
  Analyze code for security risks and vulnerabilities.
rules:
  - Follow OWASP principles
  - Highlight critical risks first
input_requirements:
  - Code or system
output_format: |
  ## Risks
  ## Severity
  ## Fixes
`,
  },
  {
    fileName: "error-handling.yaml",
    content: `name: error-handling
description: Improve error handling and resilience
instructions: |
  Standardize error handling and logging.
rules:
  - Ensure consistent error responses
  - Avoid exposing sensitive info
input_requirements:
  - Code
output_format: |
  ## Improvements
  ## Implementation
`,
  },
  {
    fileName: "ci-cd-design.yaml",
    content: `name: ci-cd-design
description: Design CI/CD pipelines
instructions: |
  Create pipeline for build, test, and deploy.
rules:
  - Include environment separation
  - Ensure rollback strategy
input_requirements:
  - Project description
output_format: |
  ## Pipeline Stages
  ## Tools
`,
  },
  {
    fileName: "containerization.yaml",
    content: `name: containerization
description: Containerize application
instructions: |
  Create container setup and configurations.
rules:
  - Keep images minimal
  - Ensure reproducibility
input_requirements:
  - Application description
output_format: |
  ## Docker Setup
  ## Notes
`,
  },
  {
    fileName: "codebase-analysis.yaml",
    content: `name: codebase-analysis
description: Analyze overall codebase structure
instructions: |
  Understand architecture, dependencies, and risks.
rules:
  - Identify hotspots
  - Highlight risks
input_requirements:
  - Codebase or structure
output_format: |
  ## Overview
  ## Risks
  ## Suggestions
`,
  },
  {
    fileName: "data-flow-analysis.yaml",
    content: `name: data-flow-analysis
description: Trace data flow through system
instructions: |
  Map how data moves through components.
rules:
  - Identify transformations
  - Highlight bottlenecks
input_requirements:
  - System or code
output_format: |
  ## Flow
  ## Observations
`,
  },
  {
    fileName: "scalability-design.yaml",
    content: `name: scalability-design
description: Design for scalability
instructions: |
  Suggest strategies to scale system.
rules:
  - Consider horizontal scaling
  - Include caching and async processing
input_requirements:
  - System description
output_format: |
  ## Strategy
  ## Recommendations
`,
  },
  {
    fileName: "modularization.yaml",
    content: `name: modularization
description: Break system into modules
instructions: |
  Decompose system into smaller units.
rules:
  - Reduce coupling
  - Increase cohesion
input_requirements:
  - Codebase
output_format: |
  ## Modules
  ## Boundaries
`,
  },
  {
    fileName: "dependency-analysis.yaml",
    content: `name: dependency-analysis
description: Analyze dependencies and coupling
instructions: |
  Identify dependencies and their impact.
rules:
  - Highlight tight coupling
  - Suggest decoupling
input_requirements:
  - Code or system
output_format: |
  ## Dependencies
  ## Risks
`,
  },
  {
    fileName: "documentation-generator.yaml",
    content: `name: documentation-generator
description: Generate technical documentation
instructions: |
  Create clear documentation for system or code.
rules:
  - Keep it concise
  - Use structured format
input_requirements:
  - Code or feature
output_format: |
  ## Overview
  ## Usage
  ## Details
`,
  },
  {
    fileName: "migration-strategy.yaml",
    content: `name: migration-strategy
description: Plan system or tech migration
instructions: |
  Create step-by-step migration plan.
rules:
  - Minimize downtime
  - Ensure rollback plan
input_requirements:
  - Current and target system
output_format: |
  ## Plan
  ## Risks
  ## Mitigation
`,
  },
];

export class CursorSkillGenerator extends BaseGenerator {
  async generate(
    options: {
      force?: boolean;
      useAI?: boolean;
      model?: string;
      onFileGenerated?: (relativePath: string) => void;
    } = {}
  ): Promise<void> {
    const force = options.force ?? false;
    const useAI = options.useAI ?? false;
    const model = options.model ?? "gpt-5.2";
    const stackProfile = buildStackProfile(this.report);
    const skillsDir = path.join(this.rootPath, ".cursor", "skills");
    this.ensureDir(skillsDir);

    for (const name of SKILL_FILES) {
      let content: string;
      if (useAI) {
        content = await generateSkillViaAI(this.report, name, {
          model,
          workspace: this.rootPath,
        });
      } else {
        content = this.renderTemplate(`cursor/skills/${name}.hbs`, {
          report: this.report,
          stackProfile,
          generatedAt: this.report.metadata.generatedAt.toISOString(),
          version: this.report.metadata.generatorVersion,
        });
      }

      const filePath = path.join(".cursor", "skills", name, "SKILL.md");
      this.writeFile(filePath, content, force);
      options.onFileGenerated?.(filePath);
    }

    for (const skill of CORE_SKILL_PACK) {
      const filePath = path.join(".cursor", "skills", skill.fileName);
      this.writeFile(filePath, skill.content, force);
      options.onFileGenerated?.(filePath);
    }
  }
}
