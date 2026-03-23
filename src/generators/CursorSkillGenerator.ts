/**
 * Generates Cursor skill files in .cursor/skills/
 * Single stack-grounded SKILL.md bundle; generic YAML packs removed in favor of one rich skill.
 */

import path from "node:path";
import { BaseGenerator } from "./base/BaseGenerator.js";
import { generateSkillViaAI } from "./AIGenerator.js";
import { buildStackProfile } from "./stackProfile.js";

const SKILL_FILES = ["tech-stack-implementation"];

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
    const stackProfile = buildStackProfile(this.report, this.rootPath);
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
  }
}
