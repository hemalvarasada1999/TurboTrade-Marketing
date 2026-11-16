import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setAnalyticsConsent } from "@/lib/analyticsConsent";
import { initPosthog, onRouteChange, resetPosthogForTests, safeCapture } from "@/lib/posthog";
import { resetConsentSyncForTests } from "@/lib/analyticsConsent";
import { configure, mockTransport, tick } from "@/test/helpers";

vi.mock("posthog-js", () => ({ default: { init: vi.fn(), capture: vi.fn(), reset: vi.fn() } }));

const MIN = 60_000;
let now = 1_800_000_000_000;

beforeEach(() => {
  resetPosthogForTests();
  resetConsentSyncForTests();
  now = 1_800_000_000_000;
  vi.spyOn(Date, "now").mockImplementation(() => now);
  configure();
});
afterEach(() => {
  resetPosthogForTests();
  vi.restoreAllMocks();
});

/* A fresh document: module state is new, cookies and localStorage are kept,
   exactly like a reload or a second tab of the same browser. */
function newDocument() {
  resetPosthogForTests();
  const t = mockTransport();
  initPosthog();
  return t;
}
const views = (t: ReturnType<typeof mockTransport>) => t.capture.mock.calls.filter((c) => c[0] === "$pageview").map((c) => c[1]);

describe("is_landing = first pageview of a 30-minute browsing session", () => {
  beforeEach(() => setAnalyticsConsent(true));

  it("the first visit is a landing; the next pages of the visit are not", async () => {
    const t = newDocument();
    onRouteChange("default", "/");
    now += MIN;
    onRouteChange("k2", "/contact");
    await tick();
    expect(views(t).map((v) => v.is_landing)).toEqual([true, undefined]);
  });

  it("a reload, or a second tab opened inside 30 minutes, is not a new landing", async () => {
    let t = newDocument();
    onRouteChange("default", "/");
    await tick();
    now += 10 * MIN;
    t = newDocument(); // reload / new tab
    onRouteChange("default", "/");
    await tick();
    expect(views(t)[0].is_landing).toBeUndefined();
  });

  it("a visit after 30 idle minutes is a new landing (new document)", async () => {
    newDocument();
    onRouteChange("default", "/");
    await tick();
    now += 30 * MIN + 1;
    const t = newDocument();
    onRouteChange("default", "/pricing");
    await tick();
    expect(views(t)[0].is_landing).toBe(true);
  });

  it("exactly 30 minutes is still the same session", async () => {
    newDocument();
    onRouteChange("default", "/");
    await tick();
    now += 30 * MIN;
    const t = newDocument();
    onRouteChange("default", "/");
    await tick();
    expect(views(t)[0].is_landing).toBeUndefined();
  });

  it("a tab left open, then used after 30+ idle minutes, starts a new session on its next navigation", async () => {
    const t = newDocument();
    onRouteChange("default", "/");
    now += 45 * MIN;
    onRouteChange("k2", "/contact");
    await tick();
    expect(views(t).map((v) => v.is_landing)).toEqual([true, true]);
  });

  it("activity (a CTA click) extends the session", async () => {
    let t = newDocument();
    onRouteChange("default", "/");
    now += 25 * MIN;
    safeCapture("marketing_cta_clicked", { cta_id: "hero", cta_target: "signup", landing_path: "/" });
    await tick();
    now += 25 * MIN; // 50 min after the pageview, 25 after the click
    t = newDocument();
    onRouteChange("default", "/");
    await tick();
    expect(views(t)[0].is_landing).toBeUndefined();
  });

  it("every landing is also the first event of its own session: no two landings inside 30 minutes of activity", async () => {
    const flags: Array<boolean | undefined> = [];
    for (let i = 0; i < 6; i++) {
      const t = newDocument();
      onRouteChange("default", "/");
      await tick();
      flags.push(views(t)[0].is_landing as boolean | undefined);
      now += 12 * MIN; // keeps the session alive between loads
    }
    expect(flags).toEqual([true, undefined, undefined, undefined, undefined, undefined]);
  });
});

describe("late consent", () => {
  it("accepting on the page the visitor entered on: a real landing, flagged consent_delayed", async () => {
    const t = mockTransport();
    initPosthog();
    onRouteChange("default", "/");
    setAnalyticsConsent(true);
    await tick();
    expect(views(t)[0]).toMatchObject({ is_landing: true, consent_delayed: true });
  });

  it("accepting after moving to another page: delayed but NOT a landing (the real entry was never measured)", async () => {
    const t = mockTransport();
    initPosthog();
    onRouteChange("default", "/");
    onRouteChange("k2", "/contact");
    setAnalyticsConsent(true);
    await tick();
    const v = views(t)[0];
    expect(v).toMatchObject({ consent_delayed: true });
    expect(v.is_landing).toBeUndefined();
  });

  it("withdrawing clears the session clock, so a later accept starts a fresh session", async () => {
    let t = mockTransport();
    setAnalyticsConsent(true);
    initPosthog();
    onRouteChange("default", "/");
    await tick();
    setAnalyticsConsent(false);
    expect(window.localStorage.getItem("tt_ph_last")).toBeNull();
    now += MIN;
    t = mockTransport();
    setAnalyticsConsent(true);
    await tick();
    expect(views(t)[0]).toMatchObject({ is_landing: true, consent_delayed: true });
  });

  it("denied visitors leave no session clock behind", async () => {
    mockTransport();
    setAnalyticsConsent(false);
    initPosthog();
    onRouteChange("default", "/");
    await tick();
    expect(window.localStorage.getItem("tt_ph_last")).toBeNull();
  });
});
