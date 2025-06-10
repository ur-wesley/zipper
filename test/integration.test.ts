import { afterEach, beforeEach, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import { TEST_DIR, cleanupTestDir, createTestFile, readZipContents, runZipper } from "./helpers.js";

beforeEach(async () => {
  await cleanupTestDir();
  await fs.mkdir(TEST_DIR, { recursive: true });
});

afterEach(async () => {
  await cleanupTestDir();
});

test("should work with config and zipignore together", async () => {
  await createTestFile(path.join(TEST_DIR, "src", "main.js"), "main");
  await createTestFile(path.join(TEST_DIR, "src", "test.spec.js"), "test");

  const config = { output: "source-code.zip", source: "./src" };
  await fs.writeFile(path.join(TEST_DIR, "zipconfig.json"), JSON.stringify(config));

  const zipignore = "*.spec.js";
  await fs.writeFile(path.join(TEST_DIR, "src", ".zipignore"), zipignore);

  const result = await runZipper([]);
  expect(result.exitCode).toBe(0);

  const zipPath = path.join(TEST_DIR, "source-code.zip");
  const zipContents = await readZipContents(zipPath);

  expect(zipContents).toContain("main.js");
  expect(zipContents).not.toContain("test.spec.js");
});

test("should create valid nested zip structure", async () => {
  await createTestFile(path.join(TEST_DIR, "root.txt"), "root file");
  await createTestFile(path.join(TEST_DIR, "level1", "file1.txt"), "level 1");
  await createTestFile(path.join(TEST_DIR, "level1", "level2", "file2.txt"), "level 2");
  await createTestFile(path.join(TEST_DIR, "level1", "level2", "level3", "deep.txt"), "deep");

  const result = await runZipper([]);
  expect(result.exitCode).toBe(0);

  const zipPath = path.join(TEST_DIR, "archive.zip");
  const zipContents = await readZipContents(zipPath);

  expect(zipContents).toContain("root.txt");
  expect(zipContents).toContain("level1/file1.txt");
  expect(zipContents).toContain("level1/level2/file2.txt");
  expect(zipContents).toContain("level1/level2/level3/deep.txt");
});
