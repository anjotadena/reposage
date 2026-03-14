import { execSync } from "child_process";
import { existsSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import chalk from "chalk";
import { info } from "../../utils/logger.js";

const require = createRequire(import.meta.url);

interface InstallInfo {
  type: "npm" | "pnpm" | "source";
  path?: string;
}

function detectInstallationType(): InstallInfo {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const packageRoot = resolve(__dirname, "..", "..");

  const gitDir = join(packageRoot, ".git");
  if (existsSync(gitDir)) {
    return { type: "source", path: packageRoot };
  }

  try {
    const pnpmList = execSync("pnpm list -g reposage --json 2>/dev/null", {
      encoding: "utf-8",
    });
    if (pnpmList.includes("reposage")) {
      return { type: "pnpm" };
    }
  } catch {
    // Not installed via pnpm
  }

  return { type: "npm" };
}

async function checkLatestVersion(): Promise<string | null> {
  try {
    const result = execSync("npm view reposage version 2>/dev/null", {
      encoding: "utf-8",
    });
    return result.trim();
  } catch {
    return null;
  }
}

function getCurrentVersion(): string {
  const pkg = require("../../../package.json");
  return pkg.version;
}

export async function updateCommand(): Promise<void> {
  const currentVersion = getCurrentVersion();
  info(`Current version: ${currentVersion}`);

  const installInfo = detectInstallationType();

  if (installInfo.type === "source") {
    console.log(chalk.yellow("\nDetected source/linked installation"));
    console.log(chalk.bold("Source path: ") + installInfo.path);
    console.log("\nTo update a source installation, run:\n");
    console.log(chalk.cyan(`  cd ${installInfo.path}`));
    console.log(chalk.cyan("  git pull"));
    console.log(chalk.cyan("  pnpm install"));
    console.log(chalk.cyan("  pnpm run build"));
    return;
  }

  const latestVersion = await checkLatestVersion();
  if (latestVersion) {
    console.log(chalk.bold("Latest version: ") + latestVersion);
  }

  if (latestVersion && currentVersion === latestVersion) {
    console.log(chalk.green("\nAlready up to date!"));
    return;
  }

  const packageManager = installInfo.type;
  const updateCmd =
    packageManager === "pnpm" ? "pnpm update -g reposage" : "npm update -g reposage";

  console.log(`\nUpdating via ${packageManager}...\n`);

  try {
    execSync(updateCmd, { stdio: "inherit" });
    console.log(chalk.green("\nUpdate complete!"));

    const newVersion = execSync("reposage --version", { encoding: "utf-8" }).trim();
    console.log(chalk.bold("New version: ") + newVersion);
  } catch {
    console.error(chalk.red("\nUpdate failed. Try running manually:"));
    console.log(chalk.cyan(`  ${updateCmd}`));
    process.exit(1);
  }
}
