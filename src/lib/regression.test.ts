import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  attributionProps,
  captureAttributionSnapshot,
  persistAttribution,
  readAttrCookie,
  resetAttributionForTests,
} from "@/lib/attribution";
import { sanitizeOutgoing } from "@/lib/posthog";

vi.mock("posthog-js", () => ({ default: { init: vi.fn(), capture: vi.fn(), reset: vi.fn() } }));

const LANDING =
  "/?utm_source=instagram&utm_medium=influencer&utm_campaign=diwali&tt_inf=inf_ab12&tt_plc=plc_0042&email=a@b.co&pan=ABCDE1234F&otp=123456";

describe("UTMs are read before the Meta Pixel sanitises the URL", () => {
  afterEach(() => {
    delete (window as unknown as Record<string, unknown>).fbq;
    delete (window as unknown as Record<string, unknown>)._fbq;
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  beforeEach(() => {
    // Meta's loader inserts its tag before the first <script>; jsdom has none.
    document.head.appendChild(document.createElement("script"));
  });

  async function fresh() {
    vi.stubEnv("VITE_META_PIXEL_ID", "1234567890123");
    vi.stubEnv("VITE_META_PIXEL_HOSTS", "localhost");
    vi.resetModules();
    const meta = await import("@/lib/metaPixel");
    const attr = await import("@/lib/attribution");
    return { meta, attr };
  }

  it("the Pixel really does strip tt_inf, tt_plc and personal parameters from the address bar", async () => {
    const { meta } = await fresh();
    window.history.replaceState(null, "", LANDING);
    expect(meta.initMetaPixel()).toBe(true);
    expect(window.location.search).toContain("utm_source=instagram"); // Meta keeps utm_*
    expect(window.location.search).not.toMatch(/tt_inf|tt_plc|email|pan=|otp/);
  });

  it("the snapshot taken first keeps the influencer and placement ids; one taken after cannot", async () => {
    const { meta, attr } = await fresh();
    window.history.replaceState(null, "", LANDING);
    attr.captureAttributionSnapshot(); // main.tsx order: snapshot, then Pixel
    meta.initMetaPixel();
    attr.persistAttribution();
    expect(attr.readAttrCookie()?.ft).toMatchObject({ s: "instagram", inf: "inf_ab12", plc: "plc_0042" });
    expect(document.cookie).not.toMatch(/a@b\.co|ABCDE|123456/);

    // the wrong order, for contrast: this is the bug the order prevents
    attr.resetAttributionForTests();
    document.cookie = "tt_attr=; Max-Age=0; Path=/";
    attr.captureAttributionSnapshot(); // URL already stripped by the Pixel
    attr.persistAttribution();
    expect(attr.readAttrCookie()?.ft.inf).toBeUndefined();
  });
});

describe("first and last touch across refreshes and new tabs (real cookie)", () => {
  let now = 1_800_000_000_000;
  beforeEach(() => {
    now = 1_800_000_000_000;
    vi.spyOn(Date, "now").mockImplementation(() => now);
    resetAttributionForTests();
  });
  afterEach(() => vi.restoreAllMocks());

  const load = (url: string, referrer = "") => {
    resetAttributionForTests(); // a new document
    Object.defineProperty(document, "referrer", { value: referrer, configurable: true });
    window.history.replaceState(null, "", url);
    captureAttributionSnapshot();
    return persistAttribution();
  };

  it("keeps the first touch through a refresh and a new tab; the last eligible touch follows the newest eligible visit", () => {
    const a = load("/?utm_source=facebook&utm_medium=paid_social");
    now += 60_000;
    const refresh = load("/?utm_source=facebook&utm_medium=paid_social");
    expect(refresh?.ft.ts).toBe(a?.ft.ts);
    now += 3_600_000;
    const tab = load("/?utm_source=youtube&utm_medium=influencer&tt_inf=inf_yt9z");
    expect(tab?.ft.s).toBe("facebook");
    expect(tab?.lt?.s).toBe("youtube");
    now += 3_600_000;
    const direct = load("/");
    expect(direct?.ft.s).toBe("facebook");
    expect(direct?.lt?.s).toBe("youtube"); // direct is not eligible
    expect(attributionProps()).toMatchObject({ ft_source: "facebook", lt_source: "youtube", lt_influencer_id: "inf_yt9z" });
    expect(readAttrCookie()?.ft.s).toBe("facebook");
  });

  it("never invents a social referrer or influencer for untagged links", () => {
    const rec = load("/", "");
    expect(rec?.ft).toEqual({ cls: "direct", lp: "/", ts: Math.floor(now / 1000) });
    const blog = load("/", "https://some-blog.example/post");
    expect(blog?.ft.cls).toBe("direct"); // strict first touch is kept
    expect(blog?.lt).toMatchObject({ cls: "referral_unknown", s: "some-blog.example" });
    expect(blog?.lt?.inf).toBeUndefined();
  });
});

describe("outgoing SDK payload privacy", () => {
  const SECRETS = ["a@b.co", "ABCDE1234F", "123456", "hunter2", "tok_live_9"];
  const dirty = "https://www.turbotrade.ai/pricing?email=a@b.co&pan=ABCDE1234F&otp=123456&password=hunter2&token=tok_live_9&utm_source=x#frag";

  it("keeps the identifiers the SDK needs and strips every URL-like property", () => {
    const out = sanitizeOutgoing({
      uuid: "u-1",
      event: "$pageview",
      properties: {
        token: "phc_testtesttesttest",
        distinct_id: "d-1",
        $device_id: "dev-1",
        $session_id: "s-1",
        $window_id: "w-1",
        $lib: "web",
        $current_url: dirty,
        $referrer: dirty,
        $initial_current_url: dirty,
        $initial_referrer: dirty,
        $session_entry_url: dirty,
        $session_entry_referrer: dirty,
        $session_entry_pathname: "/pricing",
        $pathname: "/pricing",
        $referring_domain: "l.instagram.com",
        utm_source: "x",
        $session_entry_utm_source: "x",
        $session_entry_gclid: "g1",
        ft_source: "instagram",
        schema_version: 1,
      },
      $set: { $current_url: dirty },
      $set_once: { $initial_current_url: dirty, $initial_utm_source: "x", $initial_gclid: "g1" },
    })!;
    expect(out.uuid).toBe("u-1");
    expect(out.properties).toMatchObject({
      token: "phc_testtesttesttest",
      distinct_id: "d-1",
      $device_id: "dev-1",
      $session_id: "s-1",
      $window_id: "w-1",
      $lib: "web",
      ft_source: "instagram",
      schema_version: 1,
    });
    const json = JSON.stringify(out);
    for (const s of SECRETS) expect(json).not.toContain(s);
    for (const bag of [out.properties, out.$set, out.$set_once]) {
      for (const [k, v] of Object.entries(bag ?? {})) {
        if (typeof v === "string" && /^https?:/.test(v)) expect(v, k).not.toMatch(/[?#]/);
      }
    }
    expect(Object.keys(out.properties!).join()).not.toMatch(/utm_|gclid/);
  });
});
