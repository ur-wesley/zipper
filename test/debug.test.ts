import { expect, test } from "bun:test";

test("simple working test", () => {
  expect(2 + 2).toBe(4);
});

test("string test", () => {
  expect("hello world").toContain("world");
});
