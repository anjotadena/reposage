/**
 * Generates context documentation in docs/context/
 */

import path from "node:path";
import { BaseGenerator } from "./base/BaseGenerator.js";

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
  async generate(options: { force?: boolean } = {}): Promise<void> {
    const force = options.force ?? false;
    const docsDir = path.join(this.rootPath, "docs", "context");
    this.ensureDir(docsDir);

    for (const name of DOC_FILES) {
      const content = this.renderTemplate(`docs/${name}.hbs`, {
        report: this.report,
        generatedAt: this.report.metadata.generatedAt.toISOString(),
        version: this.report.metadata.generatorVersion,
      });
      const filePath = path.join("docs", "context", `${name}.md`);
      this.writeFile(filePath, content, force);
    }
  }
}
