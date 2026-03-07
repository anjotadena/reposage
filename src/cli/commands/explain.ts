export async function explainCommand(
  path: string,
  _opts: { ai?: boolean }
): Promise<void> {
  console.log(`Explain: ${path}`);
}
