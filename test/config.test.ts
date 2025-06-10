import { afterEach, beforeEach, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { TEST_DIR, cleanupTestDir, createTestFile, fileExists, readZipContents, runZipper } from "./helpers.js";

beforeEach(async () => {
  await cleanupTestDir();
  await fs.mkdir(TEST_DIR, { recursive: true });
});

afterEach(async () => {
  await cleanupTestDir();
});

test("should use custom output filename from config", async () => {
  await createTestFile(path.join(TEST_DIR, "test.txt"), "test");

  const config = { output: "custom-archive.zip", source: "." };
  await fs.writeFile(path.join(TEST_DIR, "zipconfig.json"), JSON.stringify(config, null, 2));

  const result = await runZipper([]);
  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain("custom-archive.zip");

  const customZipPath = path.join(TEST_DIR, "custom-archive.zip");
  expect(await fileExists(customZipPath)).toBe(true);
});

test("should use custom source directory from config", async () => {
  await createTestFile(path.join(TEST_DIR, "src", "app.js"), "console.log('app');");
  await createTestFile(path.join(TEST_DIR, "src", "lib.js"), "export const lib = true;");
  await createTestFile(path.join(TEST_DIR, "README.md"), "# Project");

  const config = { output: "src-only.zip", source: "./src" };
  await fs.writeFile(path.join(TEST_DIR, "zipconfig.json"), JSON.stringify(config, null, 2));

  const result = await runZipper([]);
  expect(result.exitCode).toBe(0);

  const zipPath = path.join(TEST_DIR, "src-only.zip");
  const zipContents = await readZipContents(zipPath);
  expect(zipContents).toContain("app.js");
  expect(zipContents).toContain("lib.js");
  expect(zipContents).not.toContain("README.md");
});

test("should handle invalid config gracefully", async () => {
  await createTestFile(path.join(TEST_DIR, "test.txt"), "test");

  await fs.writeFile(path.join(TEST_DIR, "zipconfig.json"), "{ invalid json");

  const result = await runZipper([]);
  expect(result.exitCode).toBe(0);
  expect(result.stderr).toContain("⚠️ No zipconfig.json found, using default settings.");
});
