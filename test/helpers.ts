import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import JSZip from "jszip";

export const TEST_DIR = path.join(process.cwd(), "test-fixtures");
export const ZIPPER_PATH = path.join(process.cwd(), "dist", "index.js");

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * Helper function to run zipper CLI
 */
export async function runZipper(args: string[] = [], cwd: string = TEST_DIR): Promise<CommandResult> {
  return new Promise((resolve) => {
    const child = spawn("node", [ZIPPER_PATH, ...args], {
      cwd,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      resolve({ stdout, stderr, exitCode: code || 0 });
    });
  });
}

/**
 * Helper function to read zip file contents with normalized paths
 */
export async function readZipContents(zipPath: string): Promise<string[]> {
  const zipData = await fs.readFile(zipPath);
  const zip = await JSZip.loadAsync(zipData);
  return Object.keys(zip.files)
    .filter((name) => !zip.files[name]?.dir)
    .map((name) => name.replace(/\\/g, "/"));
}

/**
 * Helper function to create test files
 */
export async function createTestFile(filePath: string, content = "test content"): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content);
}

/**
 * Helper function to clean up test directory
 */
export async function cleanupTestDir(): Promise<void> {
  try {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
  } catch (_error) {}
}

/**
 * Helper function to check if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  return fs
    .access(filePath)
    .then(() => true)
    .catch(() => false);
}
