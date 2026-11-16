import { act, render } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const meta = vi.hoisted(() => ({
  trackCustomEvent: vi.fn(),
  trackPageView: vi.fn(),
}));
vi.mock("@/lib/metaPixel", () => meta);

import { APP_LOGIN_URL, APP_PLANS_URL, APP_SIGNUP_URL, APP_STRATEGIES_URL } from "@/lib/brand";
import { installCtaTracking, useRouteAnalytics } from "@/lib/analytics";
import { setAnalyticsConsent } from "@/lib/analyticsConsent";
import {
  initPosthog,
  resetPosthogForTests,
  setAnalyticsTransport,
  usePosthogPageview,
} from "@/lib/posthog";

let clock = 1_000_000;
const t = {
  capture: vi.fn(),
  identify: vi.fn(),
  register: vi.fn(),
  reset: vi.fn(),
};

const tick = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

function addLink(href: string, cta?: string, section?: string) {
  document.body.innerHTML = "";
  const host = document.createElement(section ? "section" : "div");
  if (section) host.id = section;
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  if (cta) a.dataset.cta = cta;
  a.textContent = "Some visible text that must never be sent";
  host.appendChild(a);
  document.body.appendChild(host);
  return a;
}

function click(a: HTMLAnchorElement, button = 0) {
  a.dispatchEvent(new MouseEvent(button === 0 ? "click" : "auxclick", { bubbles: true, cancelable: true, button }));
}

const ctaCalls = () => t.capture.mock.calls.filter((c) => c[0] === "marketing_cta_clicked");

beforeAll(() => installCtaTracking());
beforeEach(() => {
  resetPosthogForTests();
  Object.values(t).forEach((f) => f.mockReset());
  Object.values(meta).forEach((f) => f.mockReset());
  clock += 10_000; // clears the 1 s repeat guard between tests
  vi.spyOn(Date, "now").mockImplementation(() => clock);
  vi.stubEnv("VITE_POSTHOG_ENABLED", "true");
  vi.stubEnv("VITE_POSTHOG_KEY", "phc_testtesttesttest");
  vi.stubEnv("VITE_POSTHOG_HOST", "http://localhost:9999");
  vi.stubEnv("VITE_POSTHOG_ENABLED_HOSTS", "localhost");
  setAnalyticsTransport(t);
  setAnalyticsConsent(true);
  initPosthog();
});

describe("CTA tracking", () => {
  it("22. recognises signup, login, strategies and the previously missing plans link", async () => {
    const cases: Array<[string, string]> = [
      [APP_SIGNUP_URL, "signup"],
      [APP_LOGIN_URL, "login"],
      [APP_STRATEGIES_URL, "strategies"],
      [APP_PLANS_URL, "plans"],
    ];
    for (const [url, target] of cases) {
      clock += 5_000;
      click(addLink(url, "pricing"));
      await tick();
      expect(ctaCalls().at(-1)?.[1]).toMatchObject({
        cta_id: "pricing",
        cta_target: target,
        landing_path: "/",
        site: "marketing",
        schema_version: 1,
      });
    }
    expect(ctaCalls()).toHaveLength(4);
  });

  it("sends no text, href or query data, and maps unknown placements to 'page'", async () => {
    click(addLink(APP_SIGNUP_URL, undefined, "weird-section-id"));
    await tick();
    const props = ctaCalls()[0][1];
    expect(props.cta_id).toBe("page");
    expect(JSON.stringify(props)).not.toMatch(/visible text|auth\/continue|next=|http/);
  });

  it("21. a double click, or click plus middle-click, is one intent; another place is a new one", async () => {
    const a = addLink(APP_SIGNUP_URL, "hero");
    click(a);
    click(a);
    click(a, 1);
    await tick();
    expect(ctaCalls()).toHaveLength(1);
    expect(meta.trackCustomEvent).toHaveBeenCalledTimes(1);

    click(addLink(APP_SIGNUP_URL, "header"));
    await tick();
    expect(ctaCalls()).toHaveLength(2);
  });

  it("ignores right-clicks and unrelated links, and adds no second listener", async () => {
    const spy = vi.spyOn(document, "addEventListener");
    installCtaTracking();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
    click(addLink(APP_SIGNUP_URL, "hero"), 2);
    click(addLink("https://example.com/x", "hero"));
    await tick();
    expect(ctaCalls()).toHaveLength(0);
  });

  it("without consent a click sends nothing to PostHog but Meta still fires", async () => {
    setAnalyticsConsent(false);
    click(addLink(APP_LOGIN_URL, "header"));
    await tick();
    expect(ctaCalls()).toHaveLength(0);
    expect(meta.trackCustomEvent).toHaveBeenCalledWith("LoginCTAClick", { cta_location: "header" });
  });
});

describe("23. Meta Pixel behaviour is unchanged", () => {
  it("custom events and parameters match the pre-A1 behaviour; plans adds no Meta event", async () => {
    click(addLink(APP_SIGNUP_URL, "hero"));
    clock += 5_000;
    click(addLink(APP_LOGIN_URL, "header"));
    clock += 5_000;
    click(addLink(APP_STRATEGIES_URL, "hero"));
    clock += 5_000;
    click(addLink(APP_PLANS_URL, "pricing"));
    expect(meta.trackCustomEvent.mock.calls).toEqual([
      ["SignupCTAClick", { cta_location: "hero" }],
      ["LoginCTAClick", { cta_location: "header" }],
      ["StrategiesCTAClick", { cta_location: "hero" }],
    ]);
  });

  it("useRouteAnalytics still skips the first render and sends one Meta PageView per later route", async () => {
    let go: (to: string) => void = () => {};
    function Nav() {
      useRouteAnalytics();
      usePosthogPageview();
      go = useNavigate();
      return null;
    }
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    );
    expect(meta.trackPageView).not.toHaveBeenCalled();
    await act(async () => go("/contact"));
    expect(meta.trackPageView).toHaveBeenCalledTimes(1);
    await tick();
    // ...while PostHog counted the landing page as well
    expect(t.capture.mock.calls.filter((c) => c[0] === "$pageview")).toHaveLength(2);
  });
});
