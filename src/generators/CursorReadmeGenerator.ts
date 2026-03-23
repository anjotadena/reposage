/**
 * Generates .cursor/CURSOR_README.md — onboarding for Cursor usage in this repository.
 */

import path from "node:path";
import { BaseGenerator } from "./base/BaseGenerator.js";
import { generateCursorReadmeViaAI } from "./AIGenerator.js";
import { buildStackProfile } from "./stackProfile.js";

export class CursorReadmeGenerator extends BaseGenerator {
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
    this.ensureDir(path.join(this.rootPath, ".cursor"));

    let content: string;
    if (useAI) {
      content = await generateCursorReadmeViaAI(this.report, {
        model,
        workspace: this.rootPath,
      });
    } else {
      content = this.renderTemplate("cursor/CURSOR_README.hbs", {
        report: this.report,
        stackProfile,
        generatedAt: this.report.metadata.generatedAt.toISOString(),
        version: this.report.metadata.generatorVersion,
      });
    }

    const filePath = ".cursor/CURSOR_README.md";
    this.writeFile(filePath, content, force);
    options.onFileGenerated?.(filePath);
  }
}
