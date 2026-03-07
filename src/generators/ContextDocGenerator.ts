/**
 * Generates context documentation in docs/context/
 */

import path from "node:path";
import { BaseGenerator } from "./base/BaseGenerator.js";
import { generateContextDocViaAI } from "./AIGenerator.js";

const DOC_FILES = [
  "repo-map",
  "architecture-overview",
  "module-index",
  "coding-conventions",
  "testing-strategy",
  "glossary",
  "known-risks",
];

export class ContextDocGenerator extends BaseGenerator {
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
    const docsDir = path.join(this.rootPath, "docs", "context");
    this.ensureDir(docsDir);

    for (const name of DOC_FILES) {
      let content: string;
      if (useAI) {
        content = await generateContextDocViaAI(this.report, name, {
          model,
          workspace: this.rootPath,
        });
      } else {
        content = this.renderTemplate(`docs/${name}.hbs`, {
          report: this.report,
          generatedAt: this.report.metadata.generatedAt.toISOString(),
          version: this.report.metadata.generatorVersion,
        });
      }
      const filePath = path.join("docs", "context", `${name}.md`);
      this.writeFile(filePath, content, force);
    }
  }
}
