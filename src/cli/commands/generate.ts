import path from "node:path";
import chalk from "chalk";
import ora from "ora";
import { AnalysisPipeline } from "../../pipeline/AnalysisPipeline.js";
import { PathValidator } from "../../validators/PathValidator.js";
import { isCursorCLIAvailable } from "../../utils/cursorCli.js";

export async function generateCommand(
  targetPath: string,
  opts: { force?: boolean; ai?: boolean; model?: string } = {}
): Promise<void> {
  const resolved = path.resolve(targetPath);
  const valid = PathValidator.validate(resolved);
  if (!valid.valid) {
    console.error(chalk.red(`Error: ${valid.error}`));
    process.exit(1);
  }

  let useAI = opts.ai !== false;
  const model = opts.model ?? "gpt-5";

  if (useAI) {
    const available = await isCursorCLIAvailable();
    if (!available) {
      console.warn(
        chalk.yellow(
          "Cursor CLI (agent) not found. Falling back to template-based generation. Install with: curl https://cursor.com/install -fsS | bash"
        )
      );
      useAI = false;
    }
  }

  const spinner = ora(
    useAI ? `Generating Cursor context with AI (${model})...` : "Generating Cursor context..."
  ).start();
  try {
    const pipeline = new AnalysisPipeline(resolved);
    await pipeline.run({
      force: opts.force,
      useAI,
      model,
    });
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
