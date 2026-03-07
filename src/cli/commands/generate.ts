import path from "node:path";
import chalk from "chalk";
import ora from "ora";
import { AnalysisPipeline } from "../../pipeline/AnalysisPipeline.js";
import { PathValidator } from "../../validators/PathValidator.js";
import { checkCursorCLIReady } from "../../utils/cursorCli.js";

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

  const useAI = opts.ai !== false;
  const model = opts.model ?? "gpt-5.2";

  if (useAI) {
    const check = await checkCursorCLIReady();
    if (!check.ok) {
      console.error(chalk.red("Error: Cursor CLI is required for AI generation."));
      console.error(chalk.yellow(`\n${check.message}`));
      console.error(chalk.gray("\nInstall (macOS, Linux, WSL):"));
      console.error(chalk.gray("  curl https://cursor.com/install -fsS | bash"));
      console.error(chalk.gray("Install (Windows PowerShell):"));
      console.error(chalk.gray("  irm 'https://cursor.com/install?win32=true' | iex"));
      console.error(chalk.gray("Log in:"));
      console.error(chalk.gray("  agent login"));
      console.error(chalk.gray("\nOr use templates: reposage generate <path> --no-ai"));
      process.exit(1);
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
