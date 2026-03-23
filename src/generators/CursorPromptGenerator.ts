/**
 * Generates Cursor prompt files in .cursor/prompts/
 */

import path from "node:path";
import { BaseGenerator } from "./base/BaseGenerator.js";
import { generatePromptViaAI } from "./AIGenerator.js";
import { buildStackProfile } from "./stackProfile.js";

const PROMPT_FILES = [
  "generate-feature",
  "refactor-code",
  "write-unit-tests",
  "code-review",
  "debug-issue",
];

export class CursorPromptGenerator extends BaseGenerator {
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
    const promptsDir = path.join(this.rootPath, ".cursor", "prompts");
    this.ensureDir(promptsDir);

    for (const name of PROMPT_FILES) {
      let content: string;
      if (useAI) {
        content = await generatePromptViaAI(this.report, name, {
          model,
          workspace: this.rootPath,
        });
      } else {
        content = this.renderTemplate(`cursor/prompts/${name}.hbs`, {
          report: this.report,
          stackProfile,
          generatedAt: this.report.metadata.generatedAt.toISOString(),
          version: this.report.metadata.generatorVersion,
        });
      }
      const filePath = path.join(".cursor", "prompts", `${name}.md`);
      this.writeFile(filePath, content, force);
      options.onFileGenerated?.(filePath);
    }
  }
}
