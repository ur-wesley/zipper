import path from "node:path";
import { glob } from "glob";
import ignore from "ignore";

export async function createIgnoreFilter(sourceDir: string, outputFile: string) {
  const ig = ignore();

  ig.add([".git", "node_modules", path.basename(outputFile)]);

  try {
    const ignoreFilePath = path.join(sourceDir, ".zipignore");
    const fs = await import("node:fs/promises");
    const ignoreContent = await fs.readFile(ignoreFilePath, "utf-8");
    ig.add(ignoreContent);
    console.log("✅ Loaded .zipignore rules.");
  } catch {
    console.warn("⚠️ No .zipignore file found.");
  }

  return ig;
}

export async function discoverFiles(sourceDir: string): Promise<string[]> {
  const files = await glob("**/*", {
    cwd: sourceDir,
    nodir: true,
    dot: true,
  });

  return files;
}

export function filterFiles(files: string[], ignoreFilter: ReturnType<typeof ignore>): string[] {
  return files.filter((file) => !ignoreFilter.ignores(file));
}
