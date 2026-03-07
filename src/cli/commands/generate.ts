import path from "node:path";
import chalk from "chalk";
import ora from "ora";
import { AnalysisPipeline } from "../../pipeline/AnalysisPipeline.js";
import { PathValidator } from "../../validators/PathValidator.js";

export async function generateCommand(
  targetPath: string,
  opts: { force?: boolean } = {}
): Promise<void> {
  const resolved = path.resolve(targetPath);
  const valid = PathValidator.validate(resolved);
  if (!valid.valid) {
    console.error(chalk.red(`Error: ${valid.error}`));
    process.exit(1);
  }

  const spinner = ora("Generating Cursor context...").start();
  try {
    const pipeline = new AnalysisPipeline(resolved);
    await pipeline.run({ force: opts.force });
    spinner.succeed("Generation complete");

    console.log(chalk.green("\nGenerated artifacts:"));
    console.log("  - .cursor/rules/ (5 rule files)");
    console.log("  - .cursor/commands/ (5 command files)");
    console.log("  - docs/context/ (7 documentation files)");
    console.log("  - README.md");
  } catch (err) {
    spinner.fail("Generation failed");
    console.error(chalk.red(String(err)));
    process.exit(1);
  }
}
