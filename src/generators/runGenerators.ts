/**
 * Runs all generators to produce .cursor/ and docs/. README.md is excluded to avoid overwriting existing content.
 */

import type { AnalysisReport } from "../models/index.js";

export interface GeneratorOptions {
  force?: boolean;
  useAI?: boolean;
  model?: string;
  onFileGenerated?: (relativePath: string) => void;
}

export async function runGenerators(
  report: AnalysisReport,
  rootPath: string,
  options: GeneratorOptions = {}
): Promise<void> {
  const { CursorRuleGenerator } = await import("./CursorRuleGenerator.js");
  const { CursorCommandGenerator } = await import("./CursorCommandGenerator.js");
  const { ContextDocGenerator } = await import("./ContextDocGenerator.js");

  const cursorRules = new CursorRuleGenerator(report, rootPath);
  const cursorCommands = new CursorCommandGenerator(report, rootPath);
  const contextDocs = new ContextDocGenerator(report, rootPath);

  await Promise.all([
    cursorRules.generate(options),
    cursorCommands.generate(options),
    contextDocs.generate(options),
  ]);
}
