import { expect, test } from "bun:test";
import { spawn } from "node:child_process";
import path from "node:path";

/**
 * Get the correct Node.js executable for the current platform
 */
function getNodeExecutable(): string {
  // Try to use the same executable that's running this process
  if (process.execPath) {
    return process.execPath;
  }

  // Fallback to common names
  const possibleNames = ["node", "nodejs"];

  // On Windows, also try .exe variants
  if (process.platform === "win32") {
    possibleNames.push("node.exe", "nodejs.exe");
  }

  // Return the first one found, or default to "node"
  return possibleNames[0] || "node";
}

async function runZipper(args: string[] = []): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const zipperPath = path.join(process.cwd(), "dist", "index.js");

  return new Promise((resolve) => {
    const nodeExecutable = getNodeExecutable();
    const child = spawn(nodeExecutable, [zipperPath, ...args], {
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

test("zipper should show version", async () => {
  const result = await runZipper(["--version"]);
  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain("1.0.1");
});

test("zipper should show help", async () => {
  const result = await runZipper(["--help"]);
  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain("Usage: zipper [path] [options]");
});
