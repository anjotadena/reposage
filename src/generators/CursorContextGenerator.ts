/**
 * Generates Cursor context files in .cursor/context/
 */

import path from "node:path";
import { BaseGenerator } from "./base/BaseGenerator.js";
import { generateCursorContextViaAI } from "./AIGenerator.js";

const CONTEXT_FILES = [
  "project-overview",
  "architecture-overview",
  "tech-stack",
  "domain-knowledge",
];

export class CursorContextGenerator extends BaseGenerator {
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
    const contextDir = path.join(this.rootPath, ".cursor", "context");
    this.ensureDir(contextDir);

    for (const name of CONTEXT_FILES) {
      let content: string;
      if (useAI) {
        content = await generateCursorContextViaAI(this.report, name, {
          model,
          workspace: this.rootPath,
        });
      } else {
        content = this.renderTemplate(`cursor/context/${name}.hbs`, {
          report: this.report,
          generatedAt: this.report.metadata.generatedAt.toISOString(),
          version: this.report.metadata.generatorVersion,
        });
      }
      const filePath = path.join(".cursor", "context", `${name}.md`);
      this.writeFile(filePath, content, force);
      options.onFileGenerated?.(filePath);
    }
  }
}
