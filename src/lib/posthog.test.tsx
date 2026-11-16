import { StrictMode } from "react";
import { act, render } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sdk = vi.hoisted(() => ({
  init: vi.fn(),
  capture: vi.fn(),
  identify: vi.fn(),
  register: vi.fn(),
  reset: vi.fn(),
}));
vi.mock("posthog-js", () => ({ default: sdk }));

import {
  getAnalyticsConsent,
  setAnalyticsConsent,
} from "@/lib/analyticsConsent";
import { captureAttributionSnapshot, resetAttributionForTests } from "@/lib/attribution";
import {
  buildSdkConfig,
  initPosthog,
  onRouteChange,
  readConfig,
  resetPosthogForTests,
  safeCapture,
  sanitizeOutgoing,
  setAnalyticsTransport,
  stripUrl,
  usePosthogPageview,
  type AnalyticsTransport,
} from "@/lib/posthog";
import { sanitizeProps } from "@/lib/analyticsEvents";

const KEY = "phc_testtesttesttest";

function configure(over: Record<string, string> = {}) {
  vi.stubEnv("VITE_POSTHOG_ENABLED", "true");
  vi.stubEnv("VITE_POSTHOG_KEY", KEY);
  vi.stubEnv("VITE_POSTHOG_HOST", "http://localhost:9999");
  vi.stubEnv("VITE_POSTHOG_ENABLED_HOSTS", "localhost");
  for (const [k, v] of Object.entries(over)) vi.stubEnv(k, v);
}

function mockTransport() {
  const t = {
    capture: vi.fn(),
    identify: vi.fn(),
    register: vi.fn(),
    reset: vi.fn(),
  } satisfies AnalyticsTransport;
  setAnalyticsTransport(t);
  return t;
}

const tick = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

function Probe() {
  usePosthogPageview();
  return null;
}

function mount(entry = "/", strict = true) {
  const router = createMemoryRouter([{ path: "*", element: <Probe /> }], {
    initialEntries: [entry],
  });
  const ui = <RouterProvider router={router} />;
  render(strict ? <StrictMode>{ui}</StrictMode> : ui);
  return router;
}

const pageviews = (t: ReturnType<typeof mockTransport>) =>
  t.capture.mock.calls.filter((c) => c[0] === "$pageview");

beforeEach(() => {
  resetPosthogForTests();
  resetAttributionForTests();
  Object.values(sdk).forEach((f) => f.mockReset());
});
afterEach(() => resetPosthogForTests());

describe("configuration (disabled by default)", () => {
  it("24. missing or invalid project key is a safe no-op", async () => {
    const t = mockTransport();
    for (const key of ["", "not-a-key"]) {
      configure({ VITE_POSTHOG_KEY: key });
      setAnalyticsConsent(true);
      expect(readConfig()).toBeNull();
      expect(initPosthog()).toBe(false);
      expect(safeCapture("marketing_cta_clicked", { cta_id: "hero", cta_target: "signup", landing_path: "/" })).toBe(false);
    }
    await tick();
    expect(t.capture).not.toHaveBeenCalled();
    expect(sdk.init).not.toHaveBeenCalled();
  });

  it("is off without the flag, with an empty host list, and on real domains", () => {
    setAnalyticsConsent(true);
    expect(readConfig()).toBeNull(); // nothing configured at all
    configure({ VITE_POSTHOG_ENABLED: "false" });
    expect(readConfig()).toBeNull();
    configure({ VITE_POSTHOG_ENABLED_HOSTS: "" });
    expect(readConfig()).toBeNull();
    configure({ VITE_POSTHOG_ENABLED_HOSTS: "www.turbotrade.ai" });
    expect(readConfig("www.turbotrade.ai")).toBeNull(); // needs ALLOW_PRODUCTION
    configure({ VITE_POSTHOG_ENABLED_HOSTS: "localhost" });
    expect(readConfig()).not.toBeNull();
  });

  it("P2 kill switch: a build with VITE_POSTHOG_ENABLED=false never loads the SDK, even for a visitor who accepted, and keeps their choice", async () => {
    const t = mockTransport();
    configure({ VITE_POSTHOG_ENABLED: "false" });
    setAnalyticsConsent(true);
    setAnalyticsTransport(null);
    expect(initPosthog()).toBe(false);
    expect(safeCapture("marketing_cta_clicked", { cta_id: "hero", cta_target: "signup", landing_path: "/" })).toBe(false);
    onRouteChange("k1", "/");
    await tick();
    expect(sdk.init).not.toHaveBeenCalled();
    expect(t.capture).not.toHaveBeenCalled();
    expect(getAnalyticsConsent()).toBe("granted"); // the visitor's choice survives a rollback
  });

  it("dev builds refuse a non-local ingestion host", () => {
    configure({ VITE_POSTHOG_HOST: "https://eu.i.posthog.com" });
    expect(readConfig()).toBeNull(); // vitest runs with import.meta.env.DEV
  });

  it("SDK options disable every automatic capture (names type-checked against PostHogConfig)", () => {
    const c = buildSdkConfig({ key: KEY, host: "http://localhost:9999" });
    expect(c).toMatchObject({
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      disable_session_recording: true,
      enable_heatmaps: false,
      capture_heatmaps: false,
      capture_dead_clicks: false,
      capture_performance: false,
      capture_exceptions: false,
      advanced_disable_flags: true,
      disable_surveys: true,
      person_profiles: "identified_only",
      request_batching: false,
    });
    /* P2: the deprecated, no-op `ip` option is not set (IP handling is a project setting) */
    expect(c).not.toHaveProperty("ip");
  });
});

describe("consent", () => {
  it("11. absent and denied: nothing is sent, nothing is stored, SDK not loaded", async () => {
    configure();
    const t = mockTransport();
    captureAttributionSnapshot();
    expect(getAnalyticsConsent()).toBe("unset");
    initPosthog();
    onRouteChange("k1", "/");
    expect(document.cookie).not.toMatch(/tt_attr|ph_/);

    setAnalyticsConsent(false);
    expect(getAnalyticsConsent()).toBe("denied");
    onRouteChange("k2", "/contact");
    await tick();
    expect(t.capture).not.toHaveBeenCalled();
    expect(document.cookie).not.toContain("tt_attr");
    expect(sdk.init).not.toHaveBeenCalled();
  });

  it("the Meta advertising consent does not authorise PostHog", async () => {
    configure();
    const t = mockTransport();
    document.cookie = "tt_ad_consent=granted";
    expect(getAnalyticsConsent()).toBe("unset");
    initPosthog();
    onRouteChange("k1", "/");
    await tick();
    expect(t.capture).not.toHaveBeenCalled();
  });

  it("12. granted: events flow with schema_version, site and no campaign leakage", async () => {
    configure();
    const t = mockTransport();
    setAnalyticsConsent(true);
    expect(initPosthog()).toBe(true);
    onRouteChange("k1", "/");
    await tick();
    expect(t.capture).toHaveBeenCalledTimes(1);
    const [name, props] = t.capture.mock.calls[0];
    expect(name).toBe("$pageview");
    expect(props).toMatchObject({ schema_version: 1, site: "marketing", $current_url: `${window.location.origin}/` });
  });

  it("13. withdrawn: capture stops and attribution storage is cleared", async () => {
    configure();
    const t = mockTransport();
    window.history.replaceState(null, "", "/?utm_source=instagram");
    captureAttributionSnapshot();
    setAnalyticsConsent(true);
    initPosthog();
    expect(document.cookie).toContain("tt_attr");
    onRouteChange("k1", "/");
    await tick();
    expect(t.capture).toHaveBeenCalledTimes(1);

    setAnalyticsConsent(false);
    expect(t.reset).toHaveBeenCalled();
    expect(document.cookie).not.toContain("tt_attr");
    onRouteChange("k2", "/contact");
    await tick();
    expect(t.capture).toHaveBeenCalledTimes(1);
  });

  it("14. Global Privacy Control denies even after an explicit grant", async () => {
    configure();
    const t = mockTransport();
    Object.defineProperty(navigator, "globalPrivacyControl", { value: true, configurable: true });
    setAnalyticsConsent(true);
    expect(getAnalyticsConsent()).toBe("denied");
    expect(initPosthog()).toBe(false);
    onRouteChange("k1", "/");
    await tick();
    expect(t.capture).not.toHaveBeenCalled();
  });

  it("15. the SDK is not initialised without consent, and only once with it", async () => {
    configure();
    initPosthog();
    initPosthog();
    await tick();
    expect(sdk.init).not.toHaveBeenCalled();

    setAnalyticsConsent(true);
    initPosthog();
    await vi.waitFor(() => expect(sdk.init).toHaveBeenCalledTimes(1));
    initPosthog();
    setAnalyticsConsent(true);
    await tick();
    expect(sdk.init).toHaveBeenCalledTimes(1);
    expect(sdk.init.mock.calls[0][0]).toBe(KEY);
    expect(sdk.init.mock.calls[0][1]).toMatchObject({ autocapture: false, capture_pageview: false });
  });
});

describe("pageviews", () => {
  async function granted() {
    configure();
    const t = mockTransport();
    setAnalyticsConsent(true);
    initPosthog();
    return t;
  }

  it("16. initial pageview exactly once, under StrictMode too, with is_landing", async () => {
    const t = await granted();
    mount("/", true);
    await tick();
    expect(pageviews(t)).toHaveLength(1);
    expect(pageviews(t)[0][1]).toMatchObject({ is_landing: true });
  });

  it("17. each client-side route change sends one pageview", async () => {
    const t = await granted();
    const router = mount("/");
    await act(async () => { await router.navigate("/contact"); });
    await act(async () => { await router.navigate("/privacy"); });
    await tick();
    const urls = pageviews(t).map((c) => c[1].$current_url);
    expect(urls).toEqual([
      `${window.location.origin}/`,
      `${window.location.origin}/contact`,
      `${window.location.origin}/privacy`,
    ]);
    expect(pageviews(t).filter((c) => c[1].is_landing)).toHaveLength(1);
  });

  it("18. re-renders and StrictMode remounts add nothing", async () => {
    const t = await granted();
    const router = mount("/contact");
    await act(async () => { await router.navigate("/contact", { replace: true }); });
    await tick();
    expect(pageviews(t)).toHaveLength(1);
  });

  it("19. Back and Forward each count as a page view", async () => {
    const t = await granted();
    const router = mount("/");
    await act(async () => { await router.navigate("/contact"); });
    await act(async () => { await router.navigate(-1); });
    await act(async () => { await router.navigate(1); });
    await tick();
    expect(pageviews(t).map((c) => new URL(c[1].$current_url).pathname)).toEqual(["/", "/contact", "/", "/contact"]);
  });

  it("20. same-path, hash-only and query-only navigation send nothing", async () => {
    const t = await granted();
    const router = mount("/");
    await act(async () => { await router.navigate("/"); });
    await act(async () => { await router.navigate("/#pricing"); });
    await act(async () => { await router.navigate("/?utm_source=x"); });
    await act(async () => { await router.navigate("/broker-partner"); });
    await act(async () => { await router.navigate("/broker-partner-program"); }); // alias = same page
    await tick();
    expect(pageviews(t).map((c) => new URL(c[1].$current_url).pathname)).toEqual(["/", "/broker-partner-program"]);
  });

  it("URLs carry no query string, fragment or campaign parameter", async () => {
    const t = await granted();
    window.history.replaceState(null, "", "/?utm_source=instagram&email=a@b.co#frag");
    const router = mount("/?utm_source=instagram&email=a@b.co#frag");
    await tick();
    const props = pageviews(t)[0][1];
    expect(props.$current_url).toBe(`${window.location.origin}/`);
    expect(JSON.stringify(props)).not.toMatch(/a@b\.co|frag|email/);
    void router;
  });

  it("late consent: no event before, one flagged pageview after, no back-fill", async () => {
    configure();
    const t = mockTransport();
    initPosthog(); // no consent yet
    const router = mount("/");
    await act(async () => { await router.navigate("/contact"); });
    await tick();
    expect(t.capture).not.toHaveBeenCalled();

    act(() => setAnalyticsConsent(true));
    await tick();
    expect(pageviews(t)).toHaveLength(1);
    expect(pageviews(t)[0][1]).toMatchObject({
      consent_delayed: true,
      $current_url: `${window.location.origin}/contact`,
    });
    expect(pageviews(t)[0][1].is_landing).toBeUndefined(); // not the entry page
    await act(async () => { await router.navigate("/privacy"); });
    await tick();
    expect(pageviews(t)).toHaveLength(2);
  });
});

describe("failure isolation", () => {
  it("25. a throwing transport never reaches the caller, rendering or routing", async () => {
    configure();
    const t = mockTransport();
    t.capture.mockImplementation(() => {
      throw new Error("blocked");
    });
    setAnalyticsConsent(true);
    initPosthog();
    expect(() =>
      safeCapture("marketing_cta_clicked", { cta_id: "hero", cta_target: "signup", landing_path: "/" }),
    ).not.toThrow();
    const router = mount("/");
    await act(async () => { await router.navigate("/contact"); });
    await tick();
    expect(router.state.location.pathname).toBe("/contact");
    expect(t.capture).toHaveBeenCalled();
  });

  it("a failed SDK load (blocked request) is swallowed", async () => {
    configure();
    sdk.init.mockImplementation(() => {
      throw new Error("net::ERR_BLOCKED_BY_CLIENT");
    });
    setAnalyticsConsent(true);
    expect(() => initPosthog()).not.toThrow();
    await tick();
    expect(() => onRouteChange("k", "/")).not.toThrow();
  });
});

describe("outgoing filter", () => {
  it("drops unknown properties and non-primitive values", () => {
    expect(
      sanitizeProps("marketing_cta_clicked", {
        cta_id: "hero",
        cta_target: "signup",
        landing_path: "/",
        email: "a@b.co",
        nested: { a: 1 },
        text: "Sign up now",
      }),
    ).toEqual({ cta_id: "hero", cta_target: "signup", landing_path: "/" });
  });

  it("strips query and fragment, and drops campaign keys and foreign events", () => {
    expect(stripUrl("https://x.test/a/b?utm_source=z&e=a@b.co#h")).toBe("https://x.test/a/b");
    const out = sanitizeOutgoing({
      event: "$pageview",
      properties: {
        $current_url: "https://x.test/?utm_source=z",
        $referrer: "https://l.instagram.com/?u=secret",
        utm_source: "z",
        gclid: "abc",
        random_prop: 1,
        token: KEY,
        distinct_id: "abc",
        ft_source: "z",
        $screen_width: 100,
        $session_entry_url: "https://x.test/?email=a@b.co&utm_source=z#h",
        $session_entry_referrer: "$direct",
        $session_entry_utm_source: "z",
      },
      $set_once: { $initial_current_url: "https://x.test/?fbclid=1", $initial_utm_source: "z" },
    });
    expect(out?.properties).toEqual({
      $current_url: "https://x.test/",
      $referrer: "https://l.instagram.com/",
      token: KEY,
      distinct_id: "abc",
      ft_source: "z",
      $screen_width: 100,
      $session_entry_url: "https://x.test/",
      $session_entry_referrer: "$direct",
    });
    expect(out?.$set_once).toEqual({ $initial_current_url: "https://x.test/" });
    expect(sanitizeOutgoing({ event: "$autocapture" })).toBeNull();
    expect(sanitizeOutgoing({ event: "$feature_flag_called" })).toBeNull();
  });
});

describe("sanitizer keeps every approved attribution property (B2.1)", () => {
  const touch = ["source", "medium", "campaign", "content", "term", "utm_id", "influencer_id", "placement_id", "referrer_host", "traffic_class", "landing_path", "ts"];
  const approved = touch.flatMap((f) => [`ft_${f}`, `lt_${f}`]);

  it("all 24 first- and last-touch fields survive, including ft_utm_id and lt_utm_id", () => {
    const props = Object.fromEntries(approved.map((k) => [k, k.endsWith("_ts") ? 1700000000 : "v"]));
    const out = sanitizeOutgoing({ event: "marketing_cta_clicked", properties: props });
    expect(Object.keys(out?.properties ?? {}).sort()).toEqual([...approved].sort());
    expect(out?.properties?.ft_utm_id).toBe("v");
    expect(out?.properties?.lt_utm_id).toBe("v");
  });

  it("the same fields survive in $set_once (the person's first touch)", () => {
    const out = sanitizeOutgoing({ event: "$pageview", $set_once: { ft_utm_id: "c1", lt_utm_id: "c2", ft_source: "google" } });
    expect(out?.$set_once).toEqual({ ft_utm_id: "c1", lt_utm_id: "c2", ft_source: "google" });
  });

  it("raw campaign parameters, click ids, SDK utm properties and sensitive URL parts remain excluded", () => {
    const out = sanitizeOutgoing({
      event: "$pageview",
      properties: {
        utm_id: "raw", utm_source: "raw", gclid: "g", fbclid: "f", msclkid: "m", mc_cid: "c", ttclid: "t",
        $initial_utm_id: "x", $session_entry_utm_id: "x", $initial_gclid: "x",
        ft_utm_id: "ok", ft_made_up_field: "no", lt_gclid: "no",
        $current_url: "https://x.test/p?utm_id=raw&email=a@b.co&code=AUTH#frag",
        email: "a@b.co", phone: "9999999999",
      },
    });
    expect(out?.properties).toEqual({ ft_utm_id: "ok", $current_url: "https://x.test/p" });
  });
});

describe("Meta identifiers the SDK derives from click ids never leave (C0)", () => {
  it("drops $fbc / $fbp (raw fbclid) from properties, $set and $set_once, keeps approved fields", () => {
    const out = sanitizeOutgoing({
      event: "$pageview",
      properties: { $fbc: "fb.1.1700000000000.RAWCLICK", $fbp: "fb.1.1700000000000.123", ft_source: "meta" },
      $set: { $fbc: "fb.1.1700000000000.RAWCLICK", ft_source: "meta" },
      $set_once: { $fbc: "fb.1.1700000000000.RAWCLICK", ft_medium: "paid" },
    });
    const dump = JSON.stringify(out);
    expect(dump).not.toMatch(/RAWCLICK|\$fbc|\$fbp/);
    expect(out?.properties).toMatchObject({ ft_source: "meta" });
    expect(out?.$set).toEqual({ ft_source: "meta" });
    expect(out?.$set_once).toEqual({ ft_medium: "paid" });
  });
});

describe("raw user agent never leaves (P2)", () => {
  const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Instagram 340.0";

  it("drops $raw_user_agent (and any user-agent spelling) from properties, $set and $set_once", () => {
    const out = sanitizeOutgoing({
      event: "$pageview",
      properties: {
        token: KEY,
        $raw_user_agent: UA,
        $initial_raw_user_agent: UA,
        user_agent: UA,
        userAgent: UA,
        $browser: "Mobile Safari",
        $os: "iOS",
        $device_type: "Mobile",
        in_app_browser: true,
      },
      $set: { $raw_user_agent: UA, $os: "iOS" },
      $set_once: { $initial_raw_user_agent: UA, $initial_browser: "Mobile Safari" },
    });
    expect(JSON.stringify(out)).not.toMatch(/Mozilla|AppleWebKit|iPhone OS|user_?agent/i);
    expect(out?.properties).toEqual({
      token: KEY,
      $browser: "Mobile Safari",
      $os: "iOS",
      $device_type: "Mobile",
      in_app_browser: true,
    });
    expect(out?.$set).toEqual({ $os: "iOS" });
    expect(out?.$set_once).toEqual({ $initial_browser: "Mobile Safari" });
  });

  it("the SDK config routes every event through that filter", () => {
    const c = buildSdkConfig({ key: KEY, host: "http://localhost:9999" });
    const send = c.before_send as unknown as (e: unknown) => { properties: Record<string, unknown> } | null;
    expect(send({ event: "$pageview", properties: { $raw_user_agent: UA, $device_type: "Mobile" } })?.properties).toEqual({
      $device_type: "Mobile",
    });
  });
});
