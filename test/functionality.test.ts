import { afterEach, beforeEach, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
 TEST_DIR,
 cleanupTestDir,
 createTestFile,
 fileExists,
 readZipContents,
 runZipper,
} from "./helpers.js";

beforeEach(async () => {
 await cleanupTestDir();
 await fs.mkdir(TEST_DIR, { recursive: true });
});

afterEach(async () => {
 await cleanupTestDir();
});

test("should zip simple files", async () => {
 await createTestFile(path.join(TEST_DIR, "file1.txt"), "content 1");
 await createTestFile(path.join(TEST_DIR, "file2.txt"), "content 2");
 await createTestFile(path.join(TEST_DIR, "subdir", "file3.txt"), "content 3");

 const result = await runZipper([]);
 expect(result.exitCode).toBe(0);
 expect(result.stdout).toContain("Found 3 files to include");

 const zipPath = path.join(TEST_DIR, "archive.zip");
 expect(await fileExists(zipPath)).toBe(true);

 const zipContents = await readZipContents(zipPath);
 expect(zipContents).toContain("file1.txt");
 expect(zipContents).toContain("file2.txt");
 expect(zipContents).toContain("subdir/file3.txt");
});

test("should handle empty directory", async () => {
 const result = await runZipper([]);
 expect(result.exitCode).toBe(1);
 expect(result.stderr || result.stdout).toContain("No files to zip");
});

test("should zip specified directory", async () => {
 const targetDir = path.join(TEST_DIR, "target");
 await createTestFile(path.join(targetDir, "file1.txt"), "content 1");
 await createTestFile(path.join(targetDir, "file2.txt"), "content 2");
 await createTestFile(path.join(TEST_DIR, "outside.txt"), "outside");

 const result = await runZipper(["target"], TEST_DIR);
 expect(result.exitCode).toBe(0);

 const zipPath = path.join(TEST_DIR, "archive.zip");
 const zipContents = await readZipContents(zipPath);

 expect(zipContents).toContain("file1.txt");
 expect(zipContents).toContain("file2.txt");
 expect(zipContents).not.toContain("outside.txt");
});
