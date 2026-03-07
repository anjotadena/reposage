import path from "node:path";
import chalk from "chalk";
import ora from "ora";
import { AnalysisPipeline } from "../../pipeline/AnalysisPipeline.js";
import { PathValidator } from "../../validators/PathValidator.js";

export async function explainCommand(
  targetPath: string,
  opts: { ai?: boolean } = {}
): Promise<void> {
  const resolved = path.resolve(targetPath);
  const valid = PathValidator.validate(resolved);
  if (!valid.valid) {
    console.error(chalk.red(`Error: ${valid.error}`));
    process.exit(1);
  }

  if (opts.ai) {
    console.log(chalk.yellow("AI-enhanced explanation is not yet implemented."));
    console.log(chalk.gray("Falling back to standard explanation.\n"));
  }

  const spinner = ora("Analyzing repository...").start();
  try {
    const pipeline = new AnalysisPipeline(resolved);
    await pipeline.runPhase1();
    await pipeline.runPhase2();
    await pipeline.runPhase3();
    const report = pipeline.getReport();
    spinner.succeed("Analysis complete");

    if (!report) {
      console.error(chalk.red("No report generated"));
      process.exit(1);
    }

    console.log(chalk.bold("\n--- Repository Summary ---\n"));
    console.log(`This repository appears to be a ${report.frameworks.data.length > 0 ? report.frameworks.data.map((f) => f.name).join("/") : "codebase"} project.`);
    console.log(`\nKey findings:`);
    console.log(`- ${report.languages.data.length} language(s) detected`);
    console.log(`- ${report.frameworks.data.length} framework(s) detected`);
    console.log(`- ${report.entryPoints.data.length} entry point(s) found`);
    console.log(`- Architecture: ${report.architecture.data.style}`);
    if (report.infrastructure.data.docker || report.infrastructure.data.terraform) {
      console.log(`- Infrastructure: ${[report.infrastructure.data.docker && "Docker", report.infrastructure.data.terraform && "Terraform"].filter(Boolean).join(", ")}`);
    }
  } catch (err) {
    spinner.fail("Explanation failed");
    console.error(chalk.red(String(err)));
    process.exit(1);
  }
}
