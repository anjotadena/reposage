export async function generateCommand(
  path: string,
  _opts: { force?: boolean }
): Promise<void> {
  console.log(`Generate: ${path}`);
}
