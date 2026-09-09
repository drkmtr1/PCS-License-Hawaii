import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const trackedFiles = execFileSync("git", ["-c", `safe.directory=${process.cwd()}`, "ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);
const obviousSecret = /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|AKIA[A-Z0-9]{16}|xox[baprs]-[A-Za-z0-9-]{20,})\b/;
const assignedSecret = /(?:password|secret|token)\s*[:=]\s*["'][^"'\r\n]{12,}["']/i;

describe("repository security boundary", () => {
  it("does not track environment files or obvious credentials", () => {
    expect(trackedFiles.some((file) => /^\.env(?:\.|$)/i.test(file))).toBe(false);
    const findings = trackedFiles.flatMap((file) => {
      const content = readFileSync(file, "utf8");
      return obviousSecret.test(content) || assignedSecret.test(content) ? [file] : [];
    });
    expect(findings).toEqual([]);
  });
});
