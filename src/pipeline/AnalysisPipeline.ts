import type { AnalysisReport, DetectionOutputs, ScanResult } from "../models/index.js";

/**
 * Orchestrates the five-phase analysis pipeline:
 * Discovery -> Content Parsing -> Detection -> Analysis -> Generation
 */
export class AnalysisPipeline {
  private rootPath: string = "";
  private scanResult: ScanResult | null = null;
  private report: AnalysisReport | null = null;

  constructor(rootPath: string) {
    this.rootPath = rootPath;
  }

  /**
   * Phase 1: Discovery - file system traversal
   */
  async runPhase1(): Promise<ScanResult> {
    const { FileScanner } = await import("../scanners/FileScanner.js");
    const scanner = new FileScanner(this.rootPath);
    this.scanResult = await scanner.scan();
    return this.scanResult;
  }

  /**
   * Phase 2: Content parsing - dependency manifests and file contents
   */
  async runPhase2(): Promise<void> {
    if (!this.scanResult) {
      throw new Error("Phase 1 must complete before Phase 2");
    }
    // ContentScanner and DependencyScanner are used by detectors
    // Phase 2 prepares/validates; actual parsing happens in Phase 3
  }

  /**
   * Phase 3: Detection - parallel pattern matching
   */
  async runPhase3(): Promise<void> {
    if (!this.scanResult) {
      throw new Error("Phase 1 must complete before Phase 3");
    }
    const { runDetectors } = await import("../detectors/runDetectors.js");
    const detectionOutputs = await runDetectors(this.scanResult);
    this.report = await this.runPhase4(detectionOutputs);
  }

  /**
   * Phase 4: Analysis - cross-cutting synthesis
   */
  private async runPhase4(detectionOutputs: DetectionOutputs): Promise<AnalysisReport> {
    const { runAnalyzers } = await import("../analyzers/runAnalyzers.js");
    return runAnalyzers(this.scanResult!, detectionOutputs);
  }

  /**
   * Phase 5: Generation - template rendering or Cursor CLI (AI)
   */
  async runPhase5(options: {
    force?: boolean;
    useAI?: boolean;
    model?: string;
  } = {}): Promise<void> {
    if (!this.report) {
      throw new Error("Phases 1-4 must complete before Phase 5");
    }
    const { runGenerators } = await import("../generators/runGenerators.js");
    await runGenerators(this.report, this.rootPath, options);
  }

  /**
   * Run full pipeline: scan -> analyze -> generate
   */
  async run(options: {
    force?: boolean;
    useAI?: boolean;
    model?: string;
  } = {}): Promise<AnalysisReport> {
    await this.runPhase1();
    await this.runPhase2();
    await this.runPhase3();
    if (options.force !== false) {
      await this.runPhase5(options);
    }
    return this.report!;
  }

  getScanResult(): ScanResult | null {
    return this.scanResult;
  }

  getReport(): AnalysisReport | null {
    return this.report;
  }
}
