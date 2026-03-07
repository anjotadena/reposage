/**
 * Validates RepoSage configuration options.
 */

export interface RepoSageConfig {
  ignore?: string[];
  maxFileSize?: number;
}

export function validateConfig(config: Partial<RepoSageConfig>): {
  valid: boolean;
  error?: string;
} {
  if (config.ignore !== undefined && !Array.isArray(config.ignore)) {
    return { valid: false, error: "ignore must be an array of strings" };
  }
  if (config.maxFileSize !== undefined) {
    if (typeof config.maxFileSize !== "number" || config.maxFileSize < 0) {
      return { valid: false, error: "maxFileSize must be a non-negative number" };
    }
  }
  return { valid: true };
}
