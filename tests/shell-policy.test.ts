import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const page = readFileSync(join(process.cwd(), "app/page.tsx"), "utf8");
const notFound = readFileSync(join(process.cwd(), "app/not-found.tsx"), "utf8");
const layout = readFileSync(join(process.cwd(), "app/layout.tsx"), "utf8");
const styles = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
const config = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");

describe("BL-002 neutral shell", () => {
  it("contains the required no-guidance boundary", () => {
    expect(page).toMatch(/does not provide\s+licensing advice/);
    expect(page).toContain("Only those authorities can make licensing determinations");
  });

  it("does not expose routing inputs or external guidance in the shell", () => {
    expect(`${page}\n${notFound}`).not.toMatch(/<form|href=|fetch\(|eligible|license number|practice may begin/i);
    expect(`${page}\n${layout}\n${notFound}`).not.toMatch(/cookies\(|localStorage|sessionStorage|searchParams|useSearchParams|document\.cookie/i);
  });

  it("keeps the shell's accessibility and security contract explicit", () => {
    expect(layout).toContain('<html lang="en">');
    expect(page).toMatch(/<main[\s\S]*<h1[\s\S]*<section[\s\S]*aria-labelledby/);
    expect(notFound).toMatch(/<main[\s\S]*<h1[\s\S]*<section[\s\S]*aria-labelledby/);
    expect(styles).toContain(":focus-visible");
    expect(styles).toContain("prefers-reduced-motion");
    expect(config).toContain("Strict-Transport-Security");
    expect(config).toContain("Content-Security-Policy");
    expect(config).toContain('process.env.NODE_ENV === "development"');
    expect(config).toMatch(/script-src 'self' 'unsafe-inline'/);
    expect(config).toContain("Referrer-Policy");
  });
});
