import { expect, test } from "bun:test";
import { spawn } from "node:child_process";
import path from "node:path";

async function runZipper(
 args: string[] = []
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
 const zipperPath = path.join(process.cwd(), "dist", "index.js");

 return new Promise((resolve) => {
  const child = spawn("node", [zipperPath, ...args], {
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
 expect(result.stdout).toContain("1.0.0");
});

test("zipper should show help", async () => {
 const result = await runZipper(["--help"]);
 expect(result.exitCode).toBe(0);
 expect(result.stdout).toContain("Usage: zipper [path] [options]");
});
