/**
 * Generates README.md for the analyzed repository.
 */

import { BaseGenerator } from "./base/BaseGenerator.js";
import { generateReadmeViaAI } from "./AIGenerator.js";

export class ReadmeGenerator extends BaseGenerator {
  async generate(options: {
    force?: boolean;
    useAI?: boolean;
    model?: string;
  } = {}): Promise<void> {
    const force = options.force ?? false;
    const useAI = options.useAI ?? false;
    const model = options.model ?? "gpt-5";

    let content: string;
    if (useAI) {
      content = await generateReadmeViaAI(this.report, {
        model,
        workspace: this.rootPath,
      });
    } else {
      content = this.renderTemplate("docs/README.hbs", {
        report: this.report,
        generatedAt: this.report.metadata.generatedAt.toISOString(),
        version: this.report.metadata.generatorVersion,
      });
    }
    this.writeFile("README.md", content, force);
  }
}
