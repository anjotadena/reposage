/**
 * Generates Cursor command files in .cursor/commands/
 */

import path from "node:path";
import { BaseGenerator } from "./base/BaseGenerator.js";

const COMMAND_FILES = [
  "explain-repo",
  "trace-feature",
  "create-test-plan",
  "document-module",
  "review-risk",
];

export class CursorCommandGenerator extends BaseGenerator {
  async generate(options: { force?: boolean } = {}): Promise<void> {
    const force = options.force ?? false;
    const commandsDir = path.join(this.rootPath, ".cursor", "commands");
    this.ensureDir(commandsDir);

    for (const name of COMMAND_FILES) {
      const content = this.renderTemplate(`cursor/commands/${name}.hbs`, {
        report: this.report,
        generatedAt: this.report.metadata.generatedAt.toISOString(),
        version: this.report.metadata.generatorVersion,
      });
      const filePath = path.join(".cursor", "commands", `${name}.md`);
      this.writeFile(filePath, content, force);
    }
  }
}
