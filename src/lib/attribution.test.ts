import { describe, expect, it } from "vitest";
import {
  ATTR_WINDOW_SECONDS,
  attributionProps,
  buildTouch,
  captureAttributionSnapshot,
  clearAttribution,
  mergeTouch,
  persistAttribution,
  readAttrCookie,
  resetAttributionForTests,
  type TouchInput,
} from "@/lib/attribution";

const NOW = 1_800_000_000;
const touch = (over: Partial<TouchInput> = {}) =>
  buildTouch({
    search: "",
    referrer: "",
    pathname: "/",
    hostname: "www.turbotrade.ai",
    now: NOW,
    ...over,
  });

describe("traffic classification", () => {
  it("1. tagged Instagram influencer visitor", () => {
    const t = touch({
      search:
        "?utm_source=instagram&utm_medium=influencer&utm_campaign=diwali_26&utm_id=cmp_9&tt_inf=inf_ab12&tt_plc=plc_0042",
      referrer: "https://l.instagram.com/?u=https%3A%2F%2Fsecret",
    });
    expect(t).toMatchObject({
      cls: "campaign",
      s: "instagram",
      m: "influencer",
      c: "diwali_26",
      id: "cmp_9",
      inf: "inf_ab12",
      plc: "plc_0042",
      ref: "l.instagram.com",
    });
  });

  it("2. tagged Facebook visitor", () => {
    const t = touch({ search: "?utm_source=facebook&utm_medium=paid_social&utm_campaign=launch" });
    expect(t).toMatchObject({ cls: "campaign", s: "facebook", m: "paid_social", c: "launch" });
  });

  it("3. tagged YouTube visitor", () => {
    const t = touch({ search: "?utm_source=youtube&utm_medium=influencer&tt_inf=inf_yt9z" });
    expect(t).toMatchObject({ cls: "campaign", s: "youtube", inf: "inf_yt9z" });
  });

  it("4. untagged direct visitor: no influencer is invented", () => {
    const t = touch();
    expect(t).toEqual({ cls: "direct", lp: "/", ts: NOW });
    expect(t.inf).toBeUndefined();
  });

  it("5. organic visitor", () => {
    expect(touch({ referrer: "https://www.google.co.in/" })).toMatchObject({
      cls: "organic",
      s: "google",
      m: "organic",
    });
    expect(touch({ referrer: "https://duckduckgo.com/" }).cls).toBe("organic");
  });

  it("untagged social referrer is a platform at best, never an influencer", () => {
    const t = touch({ referrer: "https://l.instagram.com/" });
    expect(t).toMatchObject({ cls: "referral", s: "instagram", m: "social" });
    expect(t.inf).toBeUndefined();
  });

  it("6. unknown referral stays separate from direct", () => {
    expect(touch({ referrer: "https://some-blog.example/post?x=1" })).toMatchObject({
      cls: "referral_unknown",
      s: "some-blog.example",
      ref: "some-blog.example",
    });
  });

  it("own-site referrer is ignored (direct)", () => {
    expect(touch({ referrer: "https://www.turbotrade.ai/contact" }).cls).toBe("direct");
    expect(touch({ referrer: "https://app.turbotrade.ai/x" }).cls).toBe("direct");
  });

  it("click ids are hints: only presence is read, never the value", () => {
    const t = touch({ search: "?fbclid=SECRETVALUE123" });
    expect(t).toMatchObject({ cls: "referral", s: "meta", m: "click_id" });
    expect(JSON.stringify(t)).not.toContain("SECRETVALUE");
  });

  it("7. invalid or malicious input is dropped, not stored", () => {
    const t = touch({
      search:
        "?utm_source=" + encodeURIComponent("<script>alert(1)</script>") +
        "&utm_medium=" + encodeURIComponent("javascript:alert(1)") +
        "&utm_campaign=" + encodeURIComponent("jane.doe@example.com") +
        "&utm_content=" + "a".repeat(65) +
        "&tt_inf=Rahul%20Sharma&tt_plc=plc_!!&utm_term=ok_term",
    });
    expect(t).toMatchObject({ cls: "campaign", t: "ok_term" });
    expect(t.s).toBeUndefined();
    expect(t.m).toBeUndefined();
    expect(t.c).toBeUndefined();
    expect(t.ct).toBeUndefined();
    expect(t.inf).toBeUndefined();
    expect(t.plc).toBeUndefined();
    const all = JSON.stringify(t);
    expect(all).not.toMatch(/script|javascript|@|rahul/i);
  });

  it("only-invalid tags fall back to the referrer/direct classification", () => {
    expect(touch({ search: "?utm_source=%3Cb%3E" }).cls).toBe("direct");
  });

  it("aliased routes share one landing path", () => {
    expect(touch({ pathname: "/broker-partner/" }).lp).toBe("/broker-partner-program");
  });
});

describe("first and last touch", () => {
  const fb = touch({ search: "?utm_source=facebook&utm_medium=paid" });
  const yt = touch({ search: "?utm_source=youtube&utm_medium=influencer", now: NOW + 100 });
  const direct = touch({ now: NOW + 200 });
  const unknown = touch({ referrer: "https://blog.example/", now: NOW + 300 });

  it("8. first touch is never replaced; a direct first visit is still the first touch", () => {
    const a = mergeTouch(null, direct, NOW);
    expect(a.ft.cls).toBe("direct");
    expect(a.lt).toBeUndefined();
    const b = mergeTouch(a, fb, NOW + 10);
    expect(b.ft.cls).toBe("direct");
    expect(b.lt?.s).toBe("facebook");
  });

  it("9. last eligible touch is replaced by later eligible visits only", () => {
    const a = mergeTouch(null, fb, NOW);
    const b = mergeTouch(a, yt, NOW + 100);
    expect(b.ft.s).toBe("facebook");
    expect(b.lt?.s).toBe("youtube");
    const c = mergeTouch(b, direct, NOW + 200);
    expect(c.lt?.s).toBe("youtube"); // direct does not replace
    const d = mergeTouch(c, unknown, NOW + 300);
    expect(d.lt?.s).toBe("youtube"); // unknown does not replace a better touch
    const e = mergeTouch(mergeTouch(null, direct, NOW), unknown, NOW + 300);
    expect(e.lt?.cls).toBe("referral_unknown"); // but is eligible when none exists
  });

  it("10. attribution expires after 90 days", () => {
    const a = mergeTouch(null, fb, NOW);
    const later = NOW + ATTR_WINDOW_SECONDS + 1;
    const b = mergeTouch(a, yt, later);
    expect(b.ft.s).toBe("youtube"); // new first touch
    const inside = mergeTouch(a, yt, NOW + ATTR_WINDOW_SECONDS);
    expect(inside.ft.s).toBe("facebook");
  });

  it("an expired last touch is dropped while the first survives", () => {
    const a = mergeTouch(mergeTouch(null, direct, NOW), fb, NOW + 10);
    const b = mergeTouch({ ...a, ft: { ...a.ft, ts: NOW + 5_000_000 } }, direct, NOW + 10 + ATTR_WINDOW_SECONDS + 1);
    expect(b.lt).toBeUndefined();
  });
});

describe("cookie", () => {
  it("is written only by persistAttribution, round-trips, and is cleared", () => {
    resetAttributionForTests();
    window.history.replaceState(null, "", "/?utm_source=instagram&utm_medium=influencer&tt_inf=inf_ab12&secret=1");
    captureAttributionSnapshot();
    expect(document.cookie).not.toContain("tt_attr"); // snapshot is memory only
    persistAttribution();
    const rec = readAttrCookie();
    expect(rec?.ft).toMatchObject({ s: "instagram", inf: "inf_ab12" });
    expect(document.cookie).not.toContain("secret");
    expect(attributionProps()).toMatchObject({
      ft_source: "instagram",
      ft_influencer_id: "inf_ab12",
      lt_source: "instagram",
      ft_traffic_class: "campaign",
    });
    clearAttribution();
    expect(document.cookie).not.toContain("tt_attr");
    expect(attributionProps()).toEqual({});
  });

  it("stays small even with maximum-length values", () => {
    resetAttributionForTests();
    const long = "a".repeat(64);
    window.history.replaceState(null, "", `/?utm_source=${long}&utm_medium=${long}&utm_campaign=${long}&utm_content=${long}&utm_term=${long}&utm_id=${long}`);
    captureAttributionSnapshot();
    persistAttribution();
    const raw = document.cookie.match(/tt_attr=([^;]*)/)?.[1] ?? "";
    expect(raw.length).toBeLessThanOrEqual(800);
    resetAttributionForTests();
  });

  it("a tampered cookie is ignored", () => {
    document.cookie = "tt_attr=%7B%22v%22%3A2%7D";
    expect(readAttrCookie()).toBeNull();
    document.cookie = "tt_attr=not-json";
    expect(readAttrCookie()).toBeNull();
  });
});
