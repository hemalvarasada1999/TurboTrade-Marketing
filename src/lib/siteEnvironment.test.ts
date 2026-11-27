import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  BLOCK_ALL_ROBOTS_TXT,
  EMPTY_SITEMAP_XML,
  NOINDEX_META,
  isIndexableEnvironment,
  resolveSiteEnvironment,
} from "./siteEnvironment";

describe("resolveSiteEnvironment", () => {
  it("prefers APP_ENVIRONMENT, then VERCEL_ENV, then local", () => {
    expect(resolveSiteEnvironment({ APP_ENVIRONMENT: "staging", VERCEL_ENV: "production" })).toBe("staging");
    expect(resolveSiteEnvironment({ VERCEL_ENV: "preview" })).toBe("preview");
    expect(resolveSiteEnvironment({ NODE_ENV: "production" })).toBe("local");
  });
});

describe("isIndexableEnvironment", () => {
  it("is true only for an explicit production, never from NODE_ENV alone", () => {
    expect(isIndexableEnvironment({ VERCEL_ENV: "production" })).toBe(true);
    expect(isIndexableEnvironment({ APP_ENVIRONMENT: "Production" })).toBe(true);
    expect(isIndexableEnvironment({ NODE_ENV: "production" })).toBe(false);
    for (const env of [{ VERCEL_ENV: "preview" }, { VERCEL_ENV: "development" }, { APP_ENVIRONMENT: "staging" }, {}]) {
      expect(isIndexableEnvironment(env)).toBe(false);
    }
  });
  it("lets APP_ENVIRONMENT override Vercel's label either way", () => {
    expect(isIndexableEnvironment({ APP_ENVIRONMENT: "staging", VERCEL_ENV: "production" })).toBe(false);
    expect(isIndexableEnvironment({ APP_ENVIRONMENT: "production", VERCEL_ENV: "preview" })).toBe(true);
  });
});

describe("non-production artifacts", () => {
  it("block everything", () => {
    expect(BLOCK_ALL_ROBOTS_TXT).toContain("Disallow: /");
    expect(EMPTY_SITEMAP_XML).not.toContain("<loc>");
    expect(NOINDEX_META).toContain("noindex");
  });
});

/* Runs against a finished `pnpm build` when dist/ exists: the prerendered HTML
   of whichever environment that build was for must agree with its own labels. */
describe.skipIf(!existsSync(join(process.cwd(), "dist", "index.html")))("built output", () => {
  const dist = join(process.cwd(), "dist");
  const pages = () =>
    readdirSync(dist, { withFileTypes: true })
      .filter((d) => d.isDirectory() && existsSync(join(dist, d.name, "index.html")))
      .map((d) => join(dist, d.name, "index.html"))
      .concat(join(dist, "index.html"), join(dist, "404.html"));
  it("every page, robots.txt and sitemap.xml follow the same environment", () => {
    const robotsTxt = readFileSync(join(dist, "robots.txt"), "utf8");
    const blocked = robotsTxt.trim() === BLOCK_ALL_ROBOTS_TXT.trim();
    for (const file of pages()) {
      const tags = readFileSync(file, "utf8").match(/<meta name="robots"[^>]*>/g) ?? [];
      if (file.endsWith("404.html")) expect(tags.length).toBe(1);
      else expect(tags.length).toBe(blocked ? 1 : 0);
      if (blocked) expect(tags[0]).toContain("noindex, nofollow");
    }
    expect(readFileSync(join(dist, "sitemap.xml"), "utf8").includes("<loc>")).toBe(!blocked);
  });
});
