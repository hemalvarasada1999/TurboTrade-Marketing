import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CONSENT_MAX_AGE,
  consentCookieString,
  cookieDomain,
  getAnalyticsConsent,
  resetConsentSyncForTests,
  setAnalyticsConsent,
} from "@/lib/analyticsConsent";
import { initPosthog, onRouteChange, resetPosthogForTests } from "@/lib/posthog";
import { configure, mockTransport, setGpc, spyCookieWrites, tick } from "@/test/helpers";

const sdk = vi.hoisted(() => ({ init: vi.fn(), capture: vi.fn(), reset: vi.fn(), identify: vi.fn(), register: vi.fn() }));
vi.mock("posthog-js", () => ({ default: sdk }));

beforeEach(() => {
  resetPosthogForTests();
  resetConsentSyncForTests();
  Object.values(sdk).forEach((f) => f.mockReset());
});
afterEach(() => resetPosthogForTests());

describe("tt_an_consent contract (shared with turbotrade-ui)", () => {
  it("pins the exact cookie attributes", () => {
    expect(CONSENT_MAX_AGE).toBe(31536000);
    expect(consentCookieString("granted", "www.turbotrade.ai", "https:")).toBe(
      "tt_an_consent=granted; Max-Age=31536000; Path=/; SameSite=Lax; Secure; Domain=.turbotrade.ai",
    );
    expect(consentCookieString("denied", "app.turbotrade.ai", "https:")).toBe(
      "tt_an_consent=denied; Max-Age=31536000; Path=/; SameSite=Lax; Secure; Domain=.turbotrade.ai",
    );
    expect(consentCookieString("granted", "turbotrade.ai", "https:")).toContain("Domain=.turbotrade.ai");
    // anywhere else: host-only, and no Secure over plain http
    expect(consentCookieString("granted", "localhost", "http:")).toBe(
      "tt_an_consent=granted; Max-Age=31536000; Path=/; SameSite=Lax",
    );
    expect(cookieDomain("preview-abc.vercel.app")).toBe("");
    expect(cookieDomain("evilturbotrade.ai")).toBe(""); // suffix lookalike must not match
    expect(consentCookieString("granted", "www.turbotrade.ai", "https:")).not.toMatch(/HttpOnly/i);
  });

  it("accept writes granted; decline writes denied; nothing is written before a choice", () => {
    const spy = spyCookieWrites();
    expect(getAnalyticsConsent()).toBe("unset");
    expect(spy.writes).toEqual([]);
    setAnalyticsConsent(true);
    expect(getAnalyticsConsent()).toBe("granted");
    setAnalyticsConsent(false);
    expect(getAnalyticsConsent()).toBe("denied");
    expect(spy.writes.map((w) => w.split(";")[0])).toEqual(["tt_an_consent=granted", "tt_an_consent=denied"]);
    spy.restore();
  });

  it("an unknown value or a tampered cookie is unset, never granted", () => {
    for (const v of ["yes", "GRANTED", "true", "1", ""]) {
      document.cookie = `tt_an_consent=${v}`;
      expect(getAnalyticsConsent()).toBe("unset");
    }
  });

  it("an expired preference is unset again (the prompt returns)", () => {
    setAnalyticsConsent(true);
    expect(getAnalyticsConsent()).toBe("granted");
    document.cookie = "tt_an_consent=granted; Max-Age=0; Path=/"; // what the browser does at expiry
    expect(getAnalyticsConsent()).toBe("unset");
    document.cookie = "tt_an_consent=granted; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/";
    expect(getAnalyticsConsent()).toBe("unset");
  });

  it("survives a refresh and is shared by a new tab (same cookie jar)", async () => {
    configure();
    setAnalyticsConsent(true);
    // "refresh" / "new tab" = a fresh document: module state reset, cookie jar kept
    resetPosthogForTests();
    const t = mockTransport();
    expect(getAnalyticsConsent()).toBe("granted");
    expect(initPosthog()).toBe(true);
    onRouteChange("default", "/");
    await tick();
    expect(t.capture).toHaveBeenCalledTimes(1);
    expect(t.capture.mock.calls[0][1]).not.toHaveProperty("consent_delayed"); // granted before load
  });

  it("Global Privacy Control beats a stored grant and blocks a click from granting", () => {
    setAnalyticsConsent(true);
    setGpc(true);
    expect(getAnalyticsConsent()).toBe("denied");
    const spy = spyCookieWrites();
    setAnalyticsConsent(true);
    expect(spy.writes[0].split(";")[0]).toBe("tt_an_consent=denied");
    spy.restore();
    setGpc(false);
  });

  it("withdrawal in one tab stops another tab at its next event, and visibility sync starts a tab that was waiting", async () => {
    configure();
    const t = mockTransport();
    initPosthog(); // unset
    onRouteChange("default", "/");
    await tick();
    expect(t.capture).not.toHaveBeenCalled();

    document.cookie = "tt_an_consent=granted; Path=/"; // another tab accepted
    document.dispatchEvent(new Event("visibilitychange"));
    await tick();
    expect(t.capture).toHaveBeenCalledTimes(1);
    expect(t.capture.mock.calls[0][1]).toMatchObject({ consent_delayed: true });

    document.cookie = "tt_an_consent=denied; Path=/"; // another tab withdrew
    onRouteChange("k2", "/contact"); // no visibility event yet: the per-event cookie check stops it
    await tick();
    expect(t.capture).toHaveBeenCalledTimes(1);
    document.dispatchEvent(new Event("visibilitychange"));
    expect(t.reset).toHaveBeenCalled();
  });

  it("a disabled build never loads the SDK, even with a stored grant", async () => {
    setAnalyticsConsent(true);
    expect(initPosthog()).toBe(false);
    onRouteChange("default", "/");
    await tick();
    expect(sdk.init).not.toHaveBeenCalled();
  });
});
