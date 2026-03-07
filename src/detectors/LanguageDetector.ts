import type { ScanResult } from "../models/ScanResult.js";
import type { DetectionResult } from "../models/DetectionResult.js";
import type { LanguageInfo } from "../models/AnalysisReport.js";

const LANG_MAP: Record<string, { name: string; exts: string[] }> = {
  ts: { name: "TypeScript", exts: ["ts", "tsx"] },
  tsx: { name: "TypeScript", exts: ["ts", "tsx"] },
  js: { name: "JavaScript", exts: ["js", "jsx", "mjs", "cjs"] },
  jsx: { name: "JavaScript", exts: ["js", "jsx", "mjs", "cjs"] },
  mjs: { name: "JavaScript", exts: ["js", "jsx", "mjs", "cjs"] },
  cjs: { name: "JavaScript", exts: ["js", "jsx", "mjs", "cjs"] },
  py: { name: "Python", exts: ["py"] },
  go: { name: "Go", exts: ["go"] },
  rs: { name: "Rust", exts: ["rs"] },
  cs: { name: "C#", exts: ["cs"] },
  java: { name: "Java", exts: ["java"] },
  rb: { name: "Ruby", exts: ["rb"] },
  json: { name: "JSON", exts: ["json"] },
  md: { name: "Markdown", exts: ["md"] },
};

export async function detect(scanResult: ScanResult): Promise<DetectionResult<LanguageInfo[]>> {
  const extCount = new Map<string, number>();
  for (const f of scanResult.files) {
    if (f.extension) {
      extCount.set(f.extension, (extCount.get(f.extension) ?? 0) + 1);
    }
  }
  const total = scanResult.files.length || 1;
  const langTotals = new Map<string, number>();
  for (const [ext, count] of extCount) {
    const meta = LANG_MAP[ext];
    if (meta) {
      langTotals.set(meta.name, (langTotals.get(meta.name) ?? 0) + count);
    }
  }
  const nameToExts = new Map<string, string[]>();
  for (const meta of Object.values(LANG_MAP)) {
    if (!nameToExts.has(meta.name)) {
      nameToExts.set(meta.name, meta.exts);
    }
  }
  const result: LanguageInfo[] = [];
  for (const [name, fileCount] of langTotals) {
    const exts = nameToExts.get(name) ?? [name.toLowerCase()];
    result.push({
      name,
      extensions: exts,
      fileCount,
      percentage: Math.round((fileCount / total) * 100),
    });
  }
  return {
    detector: "LanguageDetector",
    data: result,
    confidence: result.length > 0 ? "high" : "low",
    evidence: [],
  };
}
