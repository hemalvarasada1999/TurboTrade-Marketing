import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { NOT_FOUND_META, ROUTE_META } from "./routeMeta";

/* Runs against a finished `pnpm build` (dist/ is not committed, so the suite
   skips on a fresh checkout and CI's unit-test step, and runs after a build).
   It reads the prerendered HTML the way a crawler does, with no JavaScript. */
const dist = join(process.cwd(), "dist");
const built = existsSync(join(dist, "index.html"));
const ORIGIN = "https://turbotrade.ai";
const file = (path: string) => (path === "/" ? "index.html" : path === "/404" ? "404.html" : `${path.slice(1)}/index.html`);
const meta = (html: string, attr: "name" | "property", key: string) =>
  html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`))?.[1];
const unescape = (s?: string) => s?.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&amp;/g, "&");

describe.skipIf(!built)("prerendered pages", () => {
  const pages = [...ROUTE_META, NOT_FOUND_META];

  it.each(pages.map((p) => [p.path, p] as const))("%s carries its own head metadata", (path, route) => {
    const html = readFileSync(join(dist, file(path)), "utf8");
    const url = path === "/" ? `${ORIGIN}/` : `${ORIGIN}${path}`;
    // The regression this guards: replacement text with literal "$1"/"$2" left in <head>.
    expect(html).not.toMatch(/\$[12]/);
    expect(unescape(html.match(/<title>(.*?)<\/title>/)?.[1])).toBe(route.title);
    expect(unescape(meta(html, "name", "description"))).toBe(route.description);
    expect(html).toContain(`<link rel="canonical" href="${url}" />`);
    expect(unescape(meta(html, "property", "og:title"))).toBe(route.title);
    expect(meta(html, "property", "og:url")).toBe(url);
    expect(unescape(meta(html, "name", "twitter:title"))).toBe(route.title);
    if (path !== "/") {
      expect(unescape(meta(html, "property", "og:description"))).toBe(route.description);
      expect(unescape(meta(html, "name", "twitter:description"))).toBe(route.description);
    }
    // Exactly one of each, so nothing can contradict the page's own tag.
    for (const tag of ['<meta property="og:title"', '<meta property="og:url"', '<meta name="twitter:title"', '<link rel="canonical"']) {
      expect(html.split(tag).length - 1).toBe(1);
    }
  });

  it("gives every page real content and exactly one h1 before any JavaScript runs", () => {
    for (const { path } of pages) {
      const html = readFileSync(join(dist, file(path)), "utf8");
      const root = html.slice(html.indexOf('<div id="root">')).replace(/<script[\s\S]*?<\/script>/g, "");
      expect(root.match(/<h1[ >]/g)?.length, path).toBe(1);
      expect(root.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length, path).toBeGreaterThan(30);
    }
  });

  it("uses a unique title, description and canonical per page", () => {
    const seen = (pick: (html: string) => string | undefined) =>
      new Set(ROUTE_META.map((p) => pick(readFileSync(join(dist, file(p.path)), "utf8"))));
    expect(seen((h) => h.match(/<title>(.*?)<\/title>/)?.[1]).size).toBe(ROUTE_META.length);
    expect(seen((h) => meta(h, "name", "description")).size).toBe(ROUTE_META.length);
    expect(seen((h) => h.match(/rel="canonical" href="([^"]*)"/)?.[1]).size).toBe(ROUTE_META.length);
  });
  it("preloads a route's lazy chunk from that route's own HTML, and only there", () => {
    for (const { path, chunk } of pages) {
      const html = readFileSync(join(dist, file(path)), "utf8");
      const preloads = html.match(/<link rel="modulepreload"[^>]*>/g) ?? [];
      expect(preloads.length, path).toBe(chunk ? 1 : 0);
      for (const tag of preloads) {
        const href = tag.match(/href="([^"]+)"/)?.[1] ?? "";
        expect(existsSync(join(dist, href)), `${path}: ${href} must exist in dist`).toBe(true);
      }
    }
  });

  it("does not ship the build manifest", () => {
    expect(existsSync(join(dist, ".vite"))).toBe(false);
  });
});
