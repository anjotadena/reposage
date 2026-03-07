/**
 * Generates README.md for the analyzed repository.
 */

import { BaseGenerator } from "./base/BaseGenerator.js";

export class ReadmeGenerator extends BaseGenerator {
  async generate(options: { force?: boolean } = {}): Promise<void> {
    const force = options.force ?? false;
    const content = this.renderTemplate("docs/README.hbs", {
      report: this.report,
      generatedAt: this.report.metadata.generatedAt.toISOString(),
      version: this.report.metadata.generatorVersion,
    });
    this.writeFile("README.md", content, force);
  }
}
