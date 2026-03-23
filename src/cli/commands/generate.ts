import { runGenerateWorkflow } from "../generateWorkflow.js";

export async function generateCommand(
  targetPath: string,
  opts: { force?: boolean; ai?: boolean; model?: string } = {}
): Promise<void> {
  await runGenerateWorkflow(targetPath, {
    force: opts.force,
    ai: opts.ai,
    model: opts.model,
    skipConfirm: false,
  });
}
