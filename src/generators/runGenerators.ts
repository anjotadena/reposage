/**
 * Runs all generators to produce .cursor/, docs/, and README.md.
 */

import type { AnalysisReport } from "../models/index.js";

export interface GeneratorOptions {
  force?: boolean;
  useAI?: boolean;
  model?: string;
}

export async function runGenerators(
  report: AnalysisReport,
  rootPath: string,
  options: GeneratorOptions = {}
): Promise<void> {
  const { CursorRuleGenerator } = await import("./CursorRuleGenerator.js");
  const { CursorCommandGenerator } = await import("./CursorCommandGenerator.js");
  const { ContextDocGenerator } = await import("./ContextDocGenerator.js");
  const { ReadmeGenerator } = await import("./ReadmeGenerator.js");

  const cursorRules = new CursorRuleGenerator(report, rootPath);
  const cursorCommands = new CursorCommandGenerator(report, rootPath);
  const contextDocs = new ContextDocGenerator(report, rootPath);
  const readme = new ReadmeGenerator(report, rootPath);

  await Promise.all([
    cursorRules.generate(options),
    cursorCommands.generate(options),
    contextDocs.generate(options),
    readme.generate(options),
  ]);
}
