import chalk from "chalk";
import { runGenerateWorkflow } from "../generateWorkflow.js";

/**
 * Refresh all RepoSage-generated Cursor assets without confirmation prompts.
 * Intended as ongoing ".cursor maintenance" after the initial `generate`.
 */
export async function rsyncCommand(
  targetPath: string,
  opts: { ai?: boolean; model?: string } = {}
): Promise<void> {
  console.log(
    chalk.gray(
      "reposage rsync: full refresh of .cursor/ and docs/context/ (same as generate with --force, no prompt)"
    )
  );
  await runGenerateWorkflow(targetPath, {
    force: true,
    skipConfirm: true,
    ai: opts.ai,
    model: opts.model,
  });
}
