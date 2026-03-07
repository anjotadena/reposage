import path from "node:path";
import chalk from "chalk";
import ora from "ora";
import { AnalysisPipeline } from "../../pipeline/AnalysisPipeline.js";
import { PathValidator } from "../../validators/PathValidator.js";

export async function scanCommand(targetPath: string): Promise<void> {
  const resolved = path.resolve(targetPath);
  const valid = PathValidator.validate(resolved);
  if (!valid.valid) {
    console.error(chalk.red(`Error: ${valid.error}`));
    process.exit(1);
  }

  const spinner = ora("Scanning repository...").start();
  try {
    const pipeline = new AnalysisPipeline(resolved);
    const scanResult = await pipeline.runPhase1();
    spinner.succeed("Scan complete");

    console.log(chalk.bold("\nRepository: ") + scanResult.rootPath);
    console.log(chalk.bold("Total files: ") + scanResult.stats.totalFiles);
    console.log(chalk.bold("Total size: ") + formatBytes(scanResult.stats.totalBytes));
    console.log(chalk.bold("Key files: ") + Object.keys(scanResult.keyFiles).length);
    if (Object.keys(scanResult.keyFiles).length > 0) {
      for (const [key, filePath] of Object.entries(scanResult.keyFiles)) {
        console.log(`  - ${key}: ${path.relative(resolved, filePath)}`);
      }
    }
  } catch (err) {
    spinner.fail("Scan failed");
    console.error(chalk.red(String(err)));
    process.exit(1);
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
