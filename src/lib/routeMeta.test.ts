import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { NOT_FOUND_META, ROUTE_META } from "./routeMeta";

describe("prerendered routes", () => {
  it("match the sitemap exactly, so no listed page is left unprerendered", () => {
    const xml = readFileSync(resolve(__dirname, "../../public/sitemap.xml"), "utf8");
    const locs = [...xml.matchAll(/<loc>https:\/\/turbotrade\.ai(\/[^<]*)<\/loc>/g)].map((m) => m[1]);
    expect(ROUTE_META.map((r) => r.path).sort()).toEqual(locs.sort());
  });

  it("each page has its own title and description", () => {
    const titles = ROUTE_META.map((r) => r.title);
    expect(new Set(titles).size).toBe(titles.length);
    for (const r of ROUTE_META) expect(r.description.length).toBeGreaterThan(10);
  });

  it("keeps the 404 out of the index", () => {
    expect(NOT_FOUND_META.noindex).toBe(true);
  });
});
