/**
 * Generates Cursor rule files (.mdc) in .cursor/rules/
 */

import path from "node:path";
import { BaseGenerator } from "./base/BaseGenerator.js";
import { generateRuleViaAI } from "./AIGenerator.js";

const RULE_FILES = [
  "00-repo-baseline",
  "10-architecture",
  "20-testing-strategy",
  "30-security",
  "40-tech-stack",
];

export class CursorRuleGenerator extends BaseGenerator {
  async generate(
    options: {
      force?: boolean;
      useAI?: boolean;
      model?: string;
    } = {}
  ): Promise<void> {
    const force = options.force ?? false;
    const useAI = options.useAI ?? false;
    const model = options.model ?? "gpt-5";
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
          generatedAt: this.report.metadata.generatedAt.toISOString(),
          version: this.report.metadata.generatorVersion,
        });
      }
      const filePath = path.join(".cursor", "rules", `${name}.mdc`);
      this.writeFile(filePath, content, force);
    }
  }
}
