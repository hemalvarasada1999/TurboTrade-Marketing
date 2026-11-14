/* C1-H1.1 storage check against the REAL posthog-js (jsdom), with this site's
   own SDK config: what the SDK writes to storage for a landing URL full of
   campaign tags, click ids and auth/signup values. Nothing is sent anywhere:
   `fetch` is stubbed and the host is a dead local port. A negative control
   (the same SDK without the C1-H1.1 options) proves the check can fail. */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CaptureResult, PostHogConfig } from "posthog-js";

import { SENSITIVE_URL_PARAMS, buildSdkConfig } from "./posthog";

const LANDING =
  "/pricing?utm_source=instagram&utm_campaign=diwali&tt_inf=inf_ab12&fbclid=RAWFBCLICK&gclid=RAWGCLICK&msclkid=RAWMSCLICK&code=AUTHCODE123&token=SECRETTOKEN&state=STATE9&email=a%40b.c";
const SECRETS = /RAWFBCLICK|RAWGCLICK|RAWMSCLICK|SECRETTOKEN|AUTHCODE123|STATE9|a%40b\.c|a@b\.c|diwali|instagram|inf_ab12/;
const HOST = "http://127.0.0.1:9";
/* jsdom's user agent trips the SDK's bot filter, which drops events before the
   SDK stores anything; a real browser is not filtered. Test-only option. */
const AS_BROWSER = { opt_out_useragent_filter: true } as const;

function dumpStorage() {
  const read = (s: Storage) => Object.fromEntries(Object.keys(s).map((k) => [k, s.getItem(k)]));
  return { local: read(localStorage), session: read(sessionStorage), cookie: document.cookie };
}
const phEntries = (o: Record<string, string | null>) =>
  JSON.stringify(Object.fromEntries(Object.entries(o).filter(([k]) => /ph_|posthog/i.test(k))));

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  document.cookie.split(";").forEach((c) => (document.cookie = `${c.split("=")[0].trim()}=; Max-Age=0; Path=/`));
  window.history.replaceState(null, "", LANDING);
  vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 200 })));
});
afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState(null, "", "/");
});

describe("the SDK's own storage keeps no raw landing parameters (C1-H1.1)", () => {
  it("config: campaign params off, masking on, and every Marketing-relevant parameter listed", () => {
    const cfg = buildSdkConfig({ key: "phc_storagetesttesttest", host: HOST });
    expect(cfg.save_campaign_params).toBe(false);
    expect(cfg.mask_personal_data_properties).toBe(true);
    for (const p of ["utm_source", "utm_campaign", "tt_inf", "tt_plc", "fbclid", "gclid", "msclkid", "code", "token", "state", "email", "phone", "otp"]) {
      expect(cfg.custom_personal_data_properties).toContain(p);
    }
    expect(cfg.custom_personal_data_properties).toEqual([...SENSITIVE_URL_PARAMS]);
  });

  it("after init, a pageview and a CTA click: no raw value in localStorage, sessionStorage or cookies; no $fbc", async () => {
    const { default: ph } = await import("posthog-js");
    const cfg = buildSdkConfig({ key: "phc_storagetesttesttest", host: HOST });
    const sent: Array<CaptureResult | null> = [];
    ph.init("phc_storagetesttesttest", {
      ...cfg,
      ...AS_BROWSER,
      // the real sanitizer, then nothing leaves (the result is recorded instead)
      before_send: (r) => {
        sent.push((cfg.before_send as (x: CaptureResult | null) => CaptureResult | null)(r));
        return null;
      },
    } as Partial<PostHogConfig>);
    ph.capture("$pageview", { $current_url: `${window.location.origin}/pricing`, is_landing: true, schema_version: 1, site: "marketing", ft_source: "instagram" });
    ph.capture("marketing_cta_clicked", { cta_id: "hero", cta_target: "signup", landing_path: "/pricing", schema_version: 1, site: "marketing" });
    await new Promise((r) => setTimeout(r, 50));

    const d = dumpStorage();
    expect(JSON.stringify(d)).toMatch(/ph_/); // the SDK did persist something
    // 1. no raw landing URL with click ids, codes or tokens
    expect(JSON.stringify(d)).not.toMatch(SECRETS);
    // 2. no Meta click id persistence
    expect(JSON.stringify(d)).not.toMatch(/\$fbc|\$fbp|fb\.1\./);
    // 3. no raw click ids in the SDK's sessionStorage
    expect(phEntries(d.session)).not.toMatch(/RAWFBCLICK|RAWGCLICK|RAWMSCLICK|"gclid"|"fbclid"/);
    // with campaign params and referrer both off the SDK keeps no initial-person
    // landing URL at all; a session entry URL, if kept, is masked
    const stored = JSON.parse(d.local[Object.keys(d.local).find((k) => /^ph_.*_posthog$/.test(k))!] ?? "{}");
    expect(stored.$initial_person_info).toBeUndefined();
    expect(stored.$initial_campaign_params).toBeUndefined();
    const entryUrl = String(stored.$client_session_props?.props?.u ?? "");
    if (entryUrl) expect(entryUrl).toMatch(/fbclid=<masked>/);

    // 4. sanitized $pageview and marketing_cta_clicked still go out, intact
    const pv = sent.find((e) => e?.event === "$pageview");
    const cta = sent.find((e) => e?.event === "marketing_cta_clicked");
    expect(pv?.properties?.$current_url).toBe(`${window.location.origin}/pricing`);
    expect(pv?.properties?.ft_source).toBe("instagram"); // our own attribution field survives
    expect(cta?.properties).toMatchObject({ cta_id: "hero", cta_target: "signup", landing_path: "/pricing", site: "marketing" });
    expect(JSON.stringify(sent)).not.toMatch(/RAWFBCLICK|RAWGCLICK|SECRETTOKEN|AUTHCODE123|\$fbc/);
    ph.reset();
  });

  it("negative control: the same SDK WITHOUT the C1-H1.1 options does store the raw values", async () => {
    const { PostHog } = await import("posthog-js");
    const { save_campaign_params: _a, mask_personal_data_properties: _b, custom_personal_data_properties: _c, ...unhardened } =
      buildSdkConfig({ key: "phc_controltesttesttest", host: HOST });
    // init(token, config, name) returns the new named instance
    const ctl = new PostHog().init("phc_controltesttesttest", { ...unhardened, ...AS_BROWSER, before_send: () => null } as Partial<PostHogConfig>, "c1control")!;
    ctl.capture("$pageview", { $current_url: `${window.location.origin}/pricing` });
    await new Promise((r) => setTimeout(r, 50));
    const d = JSON.stringify(dumpStorage());
    expect(d).toMatch(/RAWFBCLICK|RAWGCLICK/);
    expect(d).toMatch(/\$initial_person_info/);
    ctl.reset();
  });
});
