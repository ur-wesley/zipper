import { afterEach, beforeEach, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
 TEST_DIR,
 cleanupTestDir,
 createTestFile,
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

test("should exclude files matching .zipignore patterns", async () => {
 await createTestFile(path.join(TEST_DIR, "app.js"), "app code");
 await createTestFile(path.join(TEST_DIR, "app.log"), "log content");
 await createTestFile(path.join(TEST_DIR, "README.md"), "readme");

 const zipignore = "*.log";
 await fs.writeFile(path.join(TEST_DIR, ".zipignore"), zipignore);

 const result = await runZipper([]);
 expect(result.exitCode).toBe(0);
 expect(result.stdout).toContain("Loaded .zipignore rules");

 const zipPath = path.join(TEST_DIR, "archive.zip");
 const zipContents = await readZipContents(zipPath);
 expect(zipContents).toContain("app.js");
 expect(zipContents).toContain("README.md");
 expect(zipContents).not.toContain("app.log");
});

test("should handle complex .zipignore patterns", async () => {
 await createTestFile(path.join(TEST_DIR, "src", "main.js"), "main");
 await createTestFile(path.join(TEST_DIR, "src", "test.spec.js"), "test");
 await createTestFile(path.join(TEST_DIR, "dist", "bundle.js"), "bundle");
 await createTestFile(
  path.join(TEST_DIR, "node_modules", "lib", "index.js"),
  "lib"
 );
 await createTestFile(path.join(TEST_DIR, ".env"), "SECRET=123");
 await createTestFile(path.join(TEST_DIR, "docs", ".DS_Store"), "");

 const zipignore = `# Dependencies
node_modules/

# Environment files
.env*

# OS files
.DS_Store

# Test files
*.spec.js
*.test.js

# Build output
dist/`;
 await fs.writeFile(path.join(TEST_DIR, ".zipignore"), zipignore);

 const result = await runZipper([]);
 expect(result.exitCode).toBe(0);

 const zipPath = path.join(TEST_DIR, "archive.zip");
 const zipContents = await readZipContents(zipPath);

 expect(zipContents).toContain("src/main.js");

 expect(zipContents).not.toContain("src/test.spec.js");
 expect(zipContents).not.toContain("dist/bundle.js");
 expect(zipContents).not.toContain("node_modules/lib/index.js");
 expect(zipContents).not.toContain(".env");
 expect(zipContents).not.toContain("docs/.DS_Store");
});

test("should exclude default patterns", async () => {
 await createTestFile(path.join(TEST_DIR, "app.js"), "app");
 await createTestFile(path.join(TEST_DIR, ".git", "config"), "git config");
 await createTestFile(
  path.join(TEST_DIR, "node_modules", "pkg", "index.js"),
  "package"
 );

 const result = await runZipper([]);
 expect(result.exitCode).toBe(0);

 const zipPath = path.join(TEST_DIR, "archive.zip");
 const zipContents = await readZipContents(zipPath);

 expect(zipContents).toContain("app.js");
 expect(zipContents).not.toContain(".git/config");
 expect(zipContents).not.toContain("node_modules/pkg/index.js");
});

test("should work without .zipignore file", async () => {
 await createTestFile(path.join(TEST_DIR, "file.txt"), "content");

 const result = await runZipper([]);
 expect(result.exitCode).toBe(0);
 expect(result.stderr).toContain("⚠️ No .zipignore file found.");
 expect(result.stdout).toContain("Found 1 files to include");
});
