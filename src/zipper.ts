import path from "node:path";
import JSZip from "jszip";

export async function createZipArchive(files: string[], sourceDir: string, outputFile: string): Promise<void> {
  console.log(`Found ${files.length} files to include.`);

  if (files.length === 0) {
    console.error("❌ No files to zip. Check your config and ignore patterns.");
    process.exit(1);
  }

  console.log("⚙️ Compressing files...");

  const zip = new JSZip();

  for (const file of files) {
    const filePath = path.join(sourceDir, file);
    const fs = await import("node:fs/promises");
    const content = await fs.readFile(filePath);

    zip.file(file, content);
  }

  const zipContent = await zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
    compressionOptions: {
      level: 9,
    },
  });

  const fs = await import("node:fs/promises");
  await fs.writeFile(outputFile, zipContent);

  console.log(`✅ Successfully created archive: ${outputFile}`);
  console.log(`Total size: ${(zipContent.length / 1024).toFixed(2)} KB`);
}
