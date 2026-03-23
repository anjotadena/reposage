/**
 * Removes generator outputs from older RepoSage versions that are no longer produced,
 * so `generate` / `rsync` leave a consistent .cursor/ tree.
 */

import fs from "node:fs";
import path from "node:path";

const OBSOLETE_FILES = [
  ".cursor/rules/architecture.mdc",
  ".cursor/rules/testing-strategy.mdc",
  ".cursor/rules/security.mdc",
  ".cursor/automations/test-plan-on-large-change.md",
  ".cursor/automations/dependency-change-review.md",
];

export function cleanupObsoleteCursorArtifacts(rootPath: string): void {
  for (const rel of OBSOLETE_FILES) {
    const full = path.join(rootPath, rel);
    try {
      if (fs.existsSync(full)) {
        fs.unlinkSync(full);
      }
    } catch {
      /* ignore permission or transient FS errors */
    }
  }

  const skillsDir = path.join(rootPath, ".cursor", "skills");
  try {
    if (!fs.existsSync(skillsDir)) return;
    for (const ent of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (ent.isFile() && ent.name.endsWith(".yaml")) {
        fs.unlinkSync(path.join(skillsDir, ent.name));
      }
    }
  } catch {
    /* ignore */
  }
}
