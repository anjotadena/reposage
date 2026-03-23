import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import chalk from "chalk";
import ora from "ora";
import { AnalysisPipeline } from "../../pipeline/AnalysisPipeline.js";
import type { AnalysisReport } from "../../models/index.js";
import { PathValidator } from "../../validators/PathValidator.js";
import { checkCursorCLIReady } from "../../utils/cursorCli.js";

async function confirmOverride(message: string): Promise<boolean> {
  if (!process.stdin.isTTY) return false;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(`${message} (y/N) `, (answer) => {
      rl.close();
      resolve(/^y(es)?$/i.test(answer.trim()));
    });
  });
}

function buildTechStackStandards(report: AnalysisReport): string[] {
  const standards: string[] = [];
  const languages = report.languages.data.map((l) => l.name);
  const frameworks = report.frameworks.data.map((f) => f.name);
  const tests = report.testFrameworks.data.map((t) => t.name);

  if (languages.length > 0) {
    standards.push(`Language standards: ${languages.join(", ")}`);
  }
  if (frameworks.length > 0) {
    standards.push(`Framework standards: ${frameworks.join(", ")}`);
  }
  if (tests.length > 0) {
    standards.push(`Testing standards: ${tests.join(", ")}`);
  }

  if (report.codingConventions.data.eslint) standards.push("Code quality: ESLint");
  if (report.codingConventions.data.prettier) standards.push("Formatting: Prettier");
  if (report.codingConventions.data.strictTypeScript) {
    standards.push("Type safety: strict TypeScript");
  }

  return standards;
}

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

  let force = opts.force ?? false;
  const cursorDir = path.join(resolved, ".cursor");
  const cursorExisted = fs.existsSync(cursorDir);
  if (!cursorExisted) {
    fs.mkdirSync(cursorDir, { recursive: true });
  }
  if (cursorExisted && !force) {
    const ok = await confirmOverride("Are you sure you want to override existing .cursor/**/*?");
    if (!ok) {
      console.log(chalk.gray("Aborted."));
      process.exit(0);
    }
    force = true;
  }

  try {
    const pipeline = new AnalysisPipeline(resolved);

    let spinner = ora("Scanning...").start();
    await pipeline.runPhase1();
    spinner.succeed("Scan complete");

    spinner = ora("Exploring repository structure...").start();
    await pipeline.runPhase2();
    spinner.succeed("Repository structure indexed");

    spinner = ora("Analyzing tech stack...").start();
    await pipeline.runPhase3();
    const report = pipeline.getReport();
    if (!report) {
      spinner.fail("Tech stack analysis failed");
      throw new Error(
        "No analysis report generated. Cannot generate context without tech stack analysis."
      );
    }
    spinner.succeed("Tech stack analysis complete");

    const detectedLanguages = report.languages.data.map((lang) => lang.name);
    const detectedFrameworks = report.frameworks.data.map((fw) => fw.name);
    const stackStandards = buildTechStackStandards(report);

    if (detectedLanguages.length === 0 && detectedFrameworks.length === 0) {
      throw new Error(
        "No recognizable tech stack detected. Run analyze and ensure manifests/source files are present before generating context."
      );
    }

    console.log(
      chalk.gray(
        `Detected stack: ${detectedLanguages.length > 0 ? detectedLanguages.join(", ") : "Unknown languages"}`
      )
    );
    console.log(
      chalk.gray(
        `Detected frameworks: ${
          detectedFrameworks.length > 0 ? detectedFrameworks.join(", ") : "No frameworks detected"
        }`
      )
    );
    if (stackStandards.length > 0) {
      console.log(chalk.gray("Applying stack standards:"));
      for (const standard of stackStandards) {
        console.log(chalk.gray(`  - ${standard}`));
      }
    } else {
      console.log(
        chalk.yellow(
          "No explicit stack standards detected (linter/test/framework); generation will use minimal defaults."
        )
      );
    }

    if (opts.force !== false) {
      console.log(chalk.gray("\nGenerating:"));
      await pipeline.runPhase5({
        force,
        useAI,
        model,
        onFileGenerated: (file) => console.log(chalk.gray(`  ${file} -> ${chalk.green("done!")}`)),
      });
    }

    console.log(chalk.green("\nGenerated artifacts:"));
    console.log("  - .cursor/rules/ (11 rule files)");
    console.log("  - .cursor/commands/ (10 command files)");
    console.log("  - .cursor/prompts/ (5 prompt files)");
    console.log("  - .cursor/skills/ (20 yaml + 1 markdown skill files)");
    console.log("  - .cursor/context/ (4 context files)");
    console.log("  - .cursor/automations/ (6 automation workflows)");
    console.log("  - docs/context/ (7 documentation files)");
  } catch (err) {
    console.error(chalk.red("Generation failed"));
    console.error(chalk.red(String(err)));
    process.exit(1);
  }
}
