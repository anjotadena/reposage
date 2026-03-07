import path from "node:path";
import chalk from "chalk";
import ora from "ora";
import { AnalysisPipeline } from "../../pipeline/AnalysisPipeline.js";
import { PathValidator } from "../../validators/PathValidator.js";

export async function analyzeCommand(targetPath: string): Promise<void> {
  const resolved = path.resolve(targetPath);
  const valid = PathValidator.validate(resolved);
  if (!valid.valid) {
    console.error(chalk.red(`Error: ${valid.error}`));
    process.exit(1);
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

    console.log(chalk.bold("\n--- Analysis Report ---\n"));
    console.log(chalk.gray(`Generated: ${report.metadata.generatedAt.toISOString()}`));
    console.log(chalk.gray(`Target: ${report.metadata.targetRepository}\n`));

    if (report.languages.data.length > 0) {
      console.log(chalk.bold("Languages:"));
      for (const lang of report.languages.data) {
        console.log(`  - ${lang.name}: ${lang.fileCount} files (${lang.percentage}%)`);
      }
      console.log();
    }

    if (report.frameworks.data.length > 0) {
      console.log(chalk.bold("Frameworks:"));
      for (const fw of report.frameworks.data) {
        console.log(`  - ${fw.name} (${fw.category})${fw.version ? ` v${fw.version}` : ""}`);
      }
      console.log();
    }

    if (report.entryPoints.data.length > 0) {
      console.log(chalk.bold("Entry points:"));
      for (const ep of report.entryPoints.data) {
        console.log(`  - ${ep.type}: ${ep.path}`);
      }
      console.log();
    }

    if (report.infrastructure.data.files.length > 0) {
      console.log(chalk.bold("Infrastructure:"));
      console.log(`  Docker: ${report.infrastructure.data.docker}`);
      console.log(`  Terraform: ${report.infrastructure.data.terraform}`);
      console.log(`  Kubernetes: ${report.infrastructure.data.kubernetes}`);
    }
  } catch (err) {
    spinner.fail("Analysis failed");
    console.error(chalk.red(String(err)));
    process.exit(1);
  }
}
