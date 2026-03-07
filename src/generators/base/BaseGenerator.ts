/**
 * Base generator providing template rendering via Handlebars.
 */

import Handlebars from "handlebars";
import fs from "node:fs";
import path from "node:path";
import type { AnalysisReport } from "../../models/index.js";

export abstract class BaseGenerator {
  constructor(
    protected report: AnalysisReport,
    protected rootPath: string
  ) {}

  protected renderTemplate(templateName: string, context: Record<string, unknown>): string {
    const templatePath = path.join(
      import.meta.dirname ?? "",
      "..",
      "..",
      "templates",
      templateName
    );
    const raw = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(raw);
    return template(context);
  }

  protected ensureDir(dirPath: string): void {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  protected writeFile(filePath: string, content: string, force: boolean): void {
    const fullPath = path.join(this.rootPath, filePath);
    const dir = path.dirname(fullPath);
    this.ensureDir(dir);
    if (fs.existsSync(fullPath) && !force) {
      return;
    }
    fs.writeFileSync(fullPath, content, "utf-8");
  }

  abstract generate(options: { force?: boolean }): Promise<void>;
}
