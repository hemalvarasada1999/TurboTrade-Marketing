/* ══════════════ ATTRIBUTION (first touch / last eligible touch) ══════════════
   Implements `posthog-attribution-design.md` sections 3, 4 and 6.

   Flow:
   1. `captureAttributionSnapshot()` runs in main.tsx BEFORE initMetaPixel(),
      which may strip parameters from the address bar. The snapshot lives in
      memory only; nothing is written to disk before consent.
   2. After analytics consent, `persistAttribution()` merges the snapshot into
      the `tt_attr` cookie: `ft` (first touch) is written once and never
      replaced inside 90 days; `lt` (last eligible touch) is replaced by each
      later eligible visit.
   3. Events carry the flat `ft_*` / `lt_*` fields (`attributionProps()`).

   Only allowlisted, validated tokens are ever stored. Arbitrary query values,
   URLs, e-mail addresses and names are dropped, never truncated or escaped. */

import { ATTRIBUTION_FIELDS, type AttributionProps } from "@/lib/analyticsEvents";
import { cookieDomain } from "@/lib/analyticsConsent";
import { canonicalPath } from "@/lib/routePath";

export type TrafficClass =
  | "direct"
  | "referral_unknown"
  | "organic"
  | "referral"
  | "campaign";

export interface Touch {
  s?: string; // source
  m?: string; // medium
  c?: string; // campaign
  ct?: string; // content
  t?: string; // term
  id?: string; // utm id
  inf?: string; // influencer id
  plc?: string; // placement id
  ref?: string; // referrer host
  cls: TrafficClass;
  lp: string; // landing path
  ts: number; // epoch seconds
}

export interface AttrRecord {
  v: 1;
  ft: Touch;
  lt?: Touch;
}

export const ATTR_COOKIE = "tt_attr";
export const ATTR_WINDOW_SECONDS = 90 * 24 * 60 * 60;
const MAX_COOKIE_CHARS = 800;

/* ─── validation ─── */

const TOKEN = /^[a-z0-9_.-]{1,64}$/;
const INFLUENCER = /^inf_[a-z0-9]{3,8}$/;
const PLACEMENT = /^plc_[a-z0-9]{3,10}$/;
const HOST = /^[a-z0-9.-]{1,64}$/;

/* Lower-cased, whitespace runs become "_", then it must match the allowlist
   exactly. Anything else (a URL, an e-mail address, markup) is dropped. */
export function cleanToken(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  const v = raw.trim().toLowerCase().replace(/\s+/g, "_");
  return TOKEN.test(v) ? v : undefined;
}

function cleanId(raw: string | null | undefined, re: RegExp): string | undefined {
  const v = raw?.trim().toLowerCase();
  return v && re.test(v) ? v : undefined;
}

/* ─── referrer classification ─── */

interface Mapped {
  source: string;
  medium: string;
  cls: TrafficClass;
}

const SOCIAL: Record<string, string> = {
  "instagram.com": "instagram",
  "l.instagram.com": "instagram",
  "facebook.com": "facebook",
  "l.facebook.com": "facebook",
  "lm.facebook.com": "facebook",
  "m.facebook.com": "facebook",
  "t.co": "x",
  "x.com": "x",
  "twitter.com": "x",
  "youtube.com": "youtube",
  "m.youtube.com": "youtube",
  "linkedin.com": "linkedin",
  "lnkd.in": "linkedin",
  "t.me": "telegram",
  "web.telegram.org": "telegram",
};

const SEARCH: Record<string, string> = {
  "bing.com": "bing",
  "duckduckgo.com": "duckduckgo",
};

function hostFromReferrer(referrer: string): string | undefined {
  try {
    const h = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
    return HOST.test(h) ? h : undefined;
  } catch {
    return undefined;
  }
}

function isOwnHost(host: string, own: string): boolean {
  const base = (h: string) => h.replace(/^www\./, "");
  const o = base(own.toLowerCase());
  return host === o || host.endsWith(`.${o}`) || host.endsWith(".turbotrade.ai") || host === "turbotrade.ai";
}

function mapReferrer(host: string): Mapped {
  if (SOCIAL[host]) return { source: SOCIAL[host], medium: "social", cls: "referral" };
  if (SEARCH[host]) return { source: SEARCH[host], medium: "organic", cls: "organic" };
  if (/^google\.[a-z.]{2,6}$/.test(host)) {
    return { source: "google", medium: "organic", cls: "organic" };
  }
  /* Unmapped referrer: its own class, never merged with direct. */
  return { source: host, medium: "referral", cls: "referral_unknown" };
}

/* ─── building a touch from a page load ─── */

export interface TouchInput {
  search: string;
  referrer: string;
  pathname: string;
  hostname: string;
  now: number; // epoch seconds
}

export function buildTouch(input: TouchInput): Touch {
  const q = new URLSearchParams(input.search);
  const s = cleanToken(q.get("utm_source"));
  const m = cleanToken(q.get("utm_medium"));
  const c = cleanToken(q.get("utm_campaign"));
  const ct = cleanToken(q.get("utm_content"));
  const t = cleanToken(q.get("utm_term"));
  const id = cleanToken(q.get("utm_id"));
  const inf = cleanId(q.get("tt_inf"), INFLUENCER);
  const plc = cleanId(q.get("tt_plc"), PLACEMENT);

  const base = { lp: canonicalPath(input.pathname), ts: input.now };
  const refHost = input.referrer ? hostFromReferrer(input.referrer) : undefined;
  const ref = refHost && !isOwnHost(refHost, input.hostname) ? refHost : undefined;

  const tagged = [s, m, c, ct, t, id, inf, plc].some(Boolean);
  if (tagged) {
    return strip({ s, m, c, ct, t, id, inf, plc, ref, cls: "campaign", ...base });
  }

  /* Click ids are hints, not proof of paid traffic: only their presence is
     read, never their value. */
  const hasFb = q.has("fbclid");
  const hasG = q.has("gclid");
  if (hasFb || hasG) {
    return strip({
      s: hasFb ? "meta" : "google",
      m: "click_id",
      ref,
      cls: "referral",
      ...base,
    });
  }

  if (ref) {
    const mapped = mapReferrer(ref);
    return strip({ s: mapped.source, m: mapped.medium, ref, cls: mapped.cls, ...base });
  }

  return { cls: "direct", ...base };
}

function strip(touch: Touch): Touch {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(touch)) if (v !== undefined) out[k] = v;
  return out as unknown as Touch;
}

/* ─── first / last touch rules ─── */

/* `lt` is replaced by every eligible (non-direct) visit. An unmapped referrer
   is eligible only when no better last touch exists. */
function replacesLast(next: Touch, current?: Touch): boolean {
  if (next.cls === "direct") return false;
  if (next.cls === "referral_unknown") {
    return !current || current.cls === "referral_unknown";
  }
  return true;
}

export function mergeTouch(
  existing: AttrRecord | null,
  next: Touch,
  now: number,
): AttrRecord {
  const fresh = existing && now - existing.ft.ts <= ATTR_WINDOW_SECONDS ? existing : null;
  if (!fresh) {
    /* First touch is strict: a direct first visit is still the first touch. */
    return {
      v: 1,
      ft: next,
      ...(next.cls !== "direct" ? { lt: next } : {}),
    };
  }
  let lt = fresh.lt && now - fresh.lt.ts <= ATTR_WINDOW_SECONDS ? fresh.lt : undefined;
  if (replacesLast(next, lt)) lt = next;
  return { v: 1, ft: fresh.ft, ...(lt ? { lt } : {}) };
}

/* ─── cookie ─── */

function validTouch(x: unknown): x is Touch {
  if (!x || typeof x !== "object") return false;
  const t = x as Record<string, unknown>;
  return (
    typeof t.ts === "number" &&
    typeof t.lp === "string" &&
    ["direct", "referral_unknown", "organic", "referral", "campaign"].includes(t.cls as string)
  );
}

export function readAttrCookie(): AttrRecord | null {
  try {
    const m = document.cookie.match(/(?:^|;\s*)tt_attr=([^;]*)/);
    if (!m) return null;
    const rec = JSON.parse(decodeURIComponent(m[1]));
    if (rec?.v !== 1 || !validTouch(rec.ft)) return null;
    return { v: 1, ft: rec.ft, ...(validTouch(rec.lt) ? { lt: rec.lt } : {}) };
  } catch {
    return null;
  }
}

function omit(t: Touch, keys: Array<keyof Touch>): Touch {
  const o = { ...t } as Record<string, unknown>;
  keys.forEach((k) => delete o[k]);
  return o as unknown as Touch;
}

function encode(rec: AttrRecord): string {
  let r = rec;
  let s = encodeURIComponent(JSON.stringify(r));
  /* Stay well inside the cookie size limit. Real values are short; this only
     trims pathological ones: long optional fields first (last touch, then
     first touch), then the last touch altogether. The first touch is kept. */
  const steps: Array<(x: AttrRecord) => AttrRecord> = [
    (x) => (x.lt ? { ...x, lt: omit(x.lt, ["ct", "t"]) } : x),
    (x) => ({ ...x, ft: omit(x.ft, ["ct", "t"]) }),
    (x) => ({ v: 1, ft: x.ft }),
    (x) => ({ v: 1, ft: omit(x.ft, ["c", "id"]) }),
  ];
  for (const step of steps) {
    if (s.length <= MAX_COOKIE_CHARS) break;
    r = step(r);
    s = encodeURIComponent(JSON.stringify(r));
  }
  return s;
}

function writeAttrCookie(rec: AttrRecord): void {
  document.cookie =
    `${ATTR_COOKIE}=${encode(rec)}; Max-Age=${ATTR_WINDOW_SECONDS}; Path=/; SameSite=Lax` +
    (window.location.protocol === "https:" ? "; Secure" : "") +
    cookieDomain();
}

export function clearAttrCookie(): void {
  document.cookie =
    `${ATTR_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax` +
    (window.location.protocol === "https:" ? "; Secure" : "") +
    cookieDomain();
}

/* ─── snapshot (memory only) and persistence (after consent) ─── */

let snapshot: Touch | null = null;
let resolved: AttrRecord | null = null;

export function captureAttributionSnapshot(): Touch | null {
  try {
    snapshot = buildTouch({
      search: window.location.search,
      referrer: document.referrer,
      pathname: window.location.pathname,
      hostname: window.location.hostname,
      now: Math.floor(Date.now() / 1000),
    });
  } catch {
    snapshot = null;
  }
  return snapshot;
}

/* Only call after analytics consent. Returns the record now in force. */
export function persistAttribution(): AttrRecord | null {
  try {
    if (!snapshot) return (resolved = readAttrCookie());
    const now = Math.floor(Date.now() / 1000);
    resolved = mergeTouch(readAttrCookie(), snapshot, now);
    writeAttrCookie(resolved);
    return resolved;
  } catch {
    return resolved;
  }
}

/* Consent withdrawn: forget everything, in memory and on disk. */
export function clearAttribution(): void {
  resolved = null;
  try {
    clearAttrCookie();
  } catch {
    /* ignore */
  }
}

export function resetAttributionForTests(): void {
  snapshot = null;
  resolved = null;
}

const COOKIE_KEY: Record<(typeof ATTRIBUTION_FIELDS)[number], keyof Touch> = {
  source: "s",
  medium: "m",
  campaign: "c",
  content: "ct",
  term: "t",
  utm_id: "id",
  influencer_id: "inf",
  placement_id: "plc",
  referrer_host: "ref",
  traffic_class: "cls",
  landing_path: "lp",
  ts: "ts",
};

/* Flat event properties: ft_source, lt_source, … */
export function attributionProps(): AttributionProps {
  const out: Record<string, string | number> = {};
  if (!resolved) return out;
  for (const [prefix, touch] of [
    ["ft", resolved.ft],
    ["lt", resolved.lt],
  ] as const) {
    if (!touch) continue;
    for (const f of ATTRIBUTION_FIELDS) {
      const v = touch[COOKIE_KEY[f]];
      if (v !== undefined) out[`${prefix}_${f}`] = v as string | number;
    }
  }
  return out as AttributionProps;
}
