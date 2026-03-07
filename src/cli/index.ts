#!/usr/bin/env node

import { program } from "commander";

program
  .name("reposage")
  .description("Analyzes repositories and generates Cursor-ready developer context")
  .version("0.1.0");

program
  .command("scan <path>")
  .description("Scan a repository and report file statistics")
  .action(async (path: string) => {
    const { scanCommand } = await import("./commands/scan.js");
    await scanCommand(path);
  });

program
  .command("analyze <path>")
  .description("Analyze repository structure and tech stack")
  .action(async (path: string) => {
    const { analyzeCommand } = await import("./commands/analyze.js");
    await analyzeCommand(path);
  });

program
  .command("generate <path>")
  .description("Generate Cursor rules, commands, and documentation")
  .option("-f, --force", "Overwrite existing files")
  .option("--ai", "Use Cursor CLI with AI to generate (default)")
  .option("--no-ai", "Use Handlebars templates instead of AI")
  .option("-m, --model <model>", "AI model for generation (default: gpt-5.2)", "gpt-5.2")
  .action(async (path: string, opts: { force?: boolean; ai?: boolean; model?: string }) => {
    const { generateCommand } = await import("./commands/generate.js");
    await generateCommand(path, opts);
  });

program
  .command("explain <path>")
  .description("Output human-readable repository summary")
  .option("--ai", "Use AI for enhanced explanation (requires external LLM)")
  .action(async (path: string, opts: { ai?: boolean }) => {
    const { explainCommand } = await import("./commands/explain.js");
    await explainCommand(path, opts);
  });

program.parse();
