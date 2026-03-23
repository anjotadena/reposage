/**
 * Generates Cursor rule files (.mdc) in .cursor/rules/
 */

import path from "node:path";
import { BaseGenerator } from "./base/BaseGenerator.js";
import { generateRuleViaAI } from "./AIGenerator.js";
import { buildStackProfile } from "./stackProfile.js";

/**
 * Core rules only: baseline, canonical merged architecture/security/testing,
 * tech stack, and conventions. Duplicate numbered + named pairs are merged into
 * architecture.mdc, security.mdc, and testing.mdc.
 */
const RULE_FILES = [
  "00-repo-baseline",
  "architecture",
  "security",
  "testing",
  "40-tech-stack",
  "coding-standards",
  "api-design",
  "naming-conventions",
];

export class CursorRuleGenerator extends BaseGenerator {
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
    const stackProfile = buildStackProfile(this.report, this.rootPath);
    const rulesDir = path.join(this.rootPath, ".cursor", "rules");
    this.ensureDir(rulesDir);

    for (const name of RULE_FILES) {
      let content: string;
      if (useAI) {
        content = await generateRuleViaAI(this.report, name, {
          model,
          workspace: this.rootPath,
        });
      } else {
        content = this.renderTemplate(`cursor/rules/${name}.hbs`, {
          report: this.report,
          stackProfile,
          generatedAt: this.report.metadata.generatedAt.toISOString(),
          version: this.report.metadata.generatorVersion,
        });
      }
      const filePath = path.join(".cursor", "rules", `${name}.mdc`);
      this.writeFile(filePath, content, force);
      options.onFileGenerated?.(filePath);
    }
  }
}
