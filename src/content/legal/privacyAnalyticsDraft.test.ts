import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DRAFT_COOKIES_AND_TRACKING_HTML, DRAFT_STATUS } from "./privacyAnalyticsDraft";

/* The PostHog privacy wording is a DRAFT awaiting owner and legal approval.
   These guards keep it off the live site until someone deliberately publishes
   it (and deletes this test). */

const SRC = join(process.cwd(), "src");
function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

describe("privacy analytics draft (unpublished)", () => {
  it("is not imported by any application module", () => {
    const importers = walk(SRC).filter(
      (p) => !/privacyAnalyticsDraft(\.test)?\.ts$/.test(p) && /privacyAnalyticsDraft/.test(readFileSync(p, "utf8")),
    );
    expect(importers).toEqual([]);
  });

  it("the live policy does not yet contain the draft wording", () => {
    const live = readFileSync(join(SRC, "content/legal/pages.ts"), "utf8");
    expect(live).not.toMatch(/PostHog|tt_an_consent|\[CONFIRM/);
  });

  it("still carries its approval markers", () => {
    expect(DRAFT_STATUS).toBe("draft-awaiting-owner-and-legal-approval");
    expect(DRAFT_COOKIES_AND_TRACKING_HTML).toMatch(/\[CONFIRM/);
  });

  it("describes IP handling accurately: received in transit, discarded, never 'not collected'", () => {
    const text = DRAFT_COOKIES_AND_TRACKING_HTML;
    /* Owner-verified for 338008 on 2026-11-16: Discard client IP data ON, no GeoIP transformation. */
    expect(text).toMatch(/receives your IP address/);
    expect(text).toMatch(/<b>discard<\/b>/);
    expect(text).not.toMatch(/never (receive|collect|process)[^.]*IP|do not (receive|collect|process) your IP|no IP address is (received|processed)/i);
  });

  it("names the EU processing region and keeps the unverified project retention and deletion timing marked", () => {
    expect(DRAFT_COOKIES_AND_TRACKING_HTML).toMatch(/EU Cloud, in the European Union/);
    expect(DRAFT_COOKIES_AND_TRACKING_HTML).toMatch(/one year[^<]*\[CONFIRM: production project 338008/);
    expect(DRAFT_COOKIES_AND_TRACKING_HTML).toMatch(/within \[CONFIRM: response period/);
  });
});
