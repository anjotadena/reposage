/**
 * Context passed to Handlebars templates during generation.
 */

import type { AnalysisReport } from "./AnalysisReport.js";

export interface GeneratorContext {
  report: AnalysisReport;
  targetPath: string;
  force: boolean;
}
