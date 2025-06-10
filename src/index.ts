#!/usr/bin/env node
import { parseArgs, showHelp, showVersion } from "./cli";
import { loadConfig, resolveConfigPaths } from "./config";
import { createIgnoreFilter, discoverFiles, filterFiles } from "./file-discovery";
import { createZipArchive } from "./zipper";

async function main() {
  console.log("📦 Starting zip process...");

  const args = parseArgs();

  if (args.showHelp) {
    showHelp();
    process.exit(0);
  }

  if (args.showVersion) {
    showVersion();
    process.exit(0);
  }

  try {
    const config = await loadConfig(args.targetPath);
    const { sourceDir, outputFile } = resolveConfigPaths(config);

    const ignoreFilter = await createIgnoreFilter(sourceDir, outputFile);

    const allFiles = await discoverFiles(sourceDir);
    const filesToZip = filterFiles(allFiles, ignoreFilter);

    await createZipArchive(filesToZip, sourceDir, outputFile);
  } catch (error) {
    console.error("❌ Error creating archive:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
});
