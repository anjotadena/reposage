/**
 * Structured console logger for RepoSage.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

let currentLevel: LogLevel = "info";

export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[currentLevel];
}

export function debug(message: string, meta?: Record<string, unknown>): void {
  console.debug(message, meta);
  if (shouldLog("debug")) {
    const suffix = meta ? ` ${JSON.stringify(meta)}` : "";
    console.debug(`[reposage] ${message}${suffix}`);
  }
}

export function info(message: string, meta?: Record<string, unknown>): void {
  console.info(message, meta);
  if (shouldLog("info")) {
    const suffix = meta ? ` ${JSON.stringify(meta)}` : "";
    console.info(`[reposage] ${message}${suffix}`);
  }
}

export function warn(message: string, meta?: Record<string, unknown>): void {
  console.warn(message, meta);
  if (shouldLog("warn")) {
    const suffix = meta ? ` ${JSON.stringify(meta)}` : "";
    console.warn(`[reposage] ${message}${suffix}`);
  }
}

export function error(message: string, meta?: Record<string, unknown>): void {
  console.error(message, meta);
  if (shouldLog("error")) {
    const suffix = meta ? ` ${JSON.stringify(meta)}` : "";
    console.error(`[reposage] ${message}${suffix}`);
  }
}
