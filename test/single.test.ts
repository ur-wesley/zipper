import { expect, test } from "bun:test";
import { spawn } from "node:child_process";
import path from "node:path";

test("single test", async () => {
  const zipperPath = path.join(process.cwd(), "dist", "index.js");

  const result = await new Promise<{
    stdout: string;
    stderr: string;
    exitCode: number;
  }>((resolve) => {
    const child = spawn("node", [zipperPath, "--version"], {
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

  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain("1.0.0");
});
