/**
 * Generates Cursor command files in .cursor/commands/
 */

import path from "node:path";
import { BaseGenerator } from "./base/BaseGenerator.js";
import { generateCommandViaAI } from "./AIGenerator.js";

const COMMAND_FILES = [
  "explain-repo",
  "analyze-codebase",
  "trace-feature",
  "create-test-plan",
  "document-module",
  "review-risk",
  "create-module",
  "create-endpoint",
  "generate-tests",
  "refactor-service",
  "analyze-performance",
];

export class CursorCommandGenerator extends BaseGenerator {
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
    const commandsDir = path.join(this.rootPath, ".cursor", "commands");
    this.ensureDir(commandsDir);

    for (const name of COMMAND_FILES) {
      let content: string;
      if (useAI) {
        content = await generateCommandViaAI(this.report, name, {
          model,
          workspace: this.rootPath,
        });
      } else {
        content = this.renderTemplate(`cursor/commands/${name}.hbs`, {
          report: this.report,
          generatedAt: this.report.metadata.generatedAt.toISOString(),
          version: this.report.metadata.generatorVersion,
        });
      }
      const filePath = path.join(".cursor", "commands", `${name}.md`);
      this.writeFile(filePath, content, force);
      options.onFileGenerated?.(filePath);
    }
  }
}
