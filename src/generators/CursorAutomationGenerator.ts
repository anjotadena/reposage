/**
 * Generates Cursor automation workflow files in .cursor/automations/
 */

import path from "node:path";
import { BaseGenerator } from "./base/BaseGenerator.js";
import { generateAutomationViaAI } from "./AIGenerator.js";
import { buildStackProfile } from "./stackProfile.js";

/** High-value automations only; large-change test plans and dependency-only reviews are covered by commands + remaining workflows. */
const AUTOMATION_FILES = [
  "pr-review-or-risk-scan",
  "security-review",
  "refresh-context-on-structure-change",
  "release-readiness-check",
];

export class CursorAutomationGenerator extends BaseGenerator {
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
    const automationsDir = path.join(this.rootPath, ".cursor", "automations");
    this.ensureDir(automationsDir);

    for (const name of AUTOMATION_FILES) {
      let content: string;
      if (useAI) {
        content = await generateAutomationViaAI(this.report, name, {
          model,
          workspace: this.rootPath,
        });
      } else {
        content = this.renderTemplate(`cursor/automations/${name}.hbs`, {
          report: this.report,
          stackProfile,
          generatedAt: this.report.metadata.generatedAt.toISOString(),
          version: this.report.metadata.generatorVersion,
        });
      }
      const filePath = path.join(".cursor", "automations", `${name}.md`);
      this.writeFile(filePath, content, force);
      options.onFileGenerated?.(filePath);
    }
  }
}
