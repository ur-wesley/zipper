import path from "node:path";

export interface ZipperConfig {
  output: string;
  source: string;
}

const defaultConfig: ZipperConfig = {
  output: "archive.zip",
  source: ".",
};

export async function loadConfig(targetPath: string): Promise<ZipperConfig> {
  const configWithTargetPath = {
    ...defaultConfig,
    source: targetPath,
  };

  let userConfig = {};
  const configPath = path.join(targetPath, "zipconfig.json");

  try {
    const fs = await import("node:fs/promises");
    const configContent = await fs.readFile(configPath, "utf-8");
    userConfig = JSON.parse(configContent);
  } catch {
    console.warn("⚠️ No zipconfig.json found, using default settings.");
  }

  return { ...configWithTargetPath, ...userConfig };
}

export function resolveConfigPaths(config: ZipperConfig): {
  sourceDir: string;
  outputFile: string;
} {
  return {
    sourceDir: path.resolve(config.source),
    outputFile: path.resolve(config.output),
  };
}
