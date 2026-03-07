/**
 * Phase 3 output — generic wrapper every detector returns.
 */

export type ConfidenceLevel = "high" | "medium" | "low";

export interface Evidence {
  file: string;
  pattern: string;
  description: string;
}

export interface DetectionResult<T> {
  detector: string;
  data: T;
  confidence: ConfidenceLevel;
  evidence: Evidence[];
}
