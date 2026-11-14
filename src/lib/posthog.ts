/* ══════════════ POSTHOG (marketing) ══════════════
   The one place the marketing site talks to PostHog. Components never import
   `posthog-js`; they call `safeCapture` or mount `usePosthogPageview`.

   ── Disabled by default ──
   Nothing happens unless ALL of these hold:
     1. VITE_POSTHOG_ENABLED === "true" and VITE_POSTHOG_KEY is set
     2. the current hostname is in VITE_POSTHOG_ENABLED_HOSTS (empty list =
        nothing allowed); the two real production hosts additionally need
        VITE_POSTHOG_ALLOW_PRODUCTION === "true", which is not set in A1
     3. analytics consent is granted (`tt_an_consent`, analyticsConsent.ts;
        never the Meta preference; Global Privacy Control = denied)
   Until then the SDK is not even downloaded and no cookie is written.

   ── Explicit capture only ──
   Autocapture, automatic pageviews and pageleave, recordings (and with them
   console and network capture), heatmaps, dead-click and exception capture,
   web vitals, surveys, product tours, conversations, web experiments and
   feature-flag requests are all off. Only `safeCapture` sends events.

   ── Never breaks the page ──
   Every entry point is wrapped; a failure is swallowed. Sending happens in a
   microtask after the caller returns. */

import type { CaptureResult, PostHogConfig } from "posthog-js";
import {
  BASE_PROPS,
  EVENT_ALLOWLIST,
  SCHEMA_VERSION,
  SITE,
  isKnownEvent,
  sanitizeProps,
  type EventName,
  type EventPropsMap,
} from "@/lib/analyticsEvents";
import {
  isAnalyticsGranted,
  onAnalyticsConsentChange,
} from "@/lib/analyticsConsent";
import { ATTRIBUTION_KEYS } from "@/lib/analyticsEvents";
import {
  attributionProps,
  clearAttribution,
  persistAttribution,
} from "@/lib/attribution";
import { canonicalPath } from "@/lib/routePath";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* ─── transport ─── */

export interface AnalyticsTransport {
  capture(event: string, props: Record<string, unknown>): void;
  identify(distinctId: string, setOnce?: Record<string, unknown>): void;
  register(props: Record<string, unknown>): void;
  reset(): void;
}

let transport: AnalyticsTransport | null = null;
let loading: Promise<void> | null = null;
const pending: Array<[string, Record<string, unknown>]> = [];
const MAX_PENDING = 20;

/* Tests (and any local stub) install a transport; the real SDK is then never
   loaded. */
export function setAnalyticsTransport(t: AnalyticsTransport | null): void {
  transport = t;
}

/* ─── configuration ─── */

const PRODUCTION_HOSTS = ["turbotrade.ai", "www.turbotrade.ai"];

interface Config {
  key: string;
  host: string;
}

function isLocalHost(h: string): boolean {
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]";
}

function parseHost(raw: string): string | null {
  try {
    const u = new URL(raw);
    if (u.protocol === "https:") return u.origin;
    if (u.protocol === "http:" && isLocalHost(u.hostname)) return u.origin;
  } catch {
    /* fall through */
  }
  return null;
}

/* Reads the environment at call time (tests change it). Null = disabled. */
export function readConfig(hostname = window.location.hostname): Config | null {
  const env = import.meta.env;
  if (String(env.VITE_POSTHOG_ENABLED ?? "").trim() !== "true") return null;
  const key = String(env.VITE_POSTHOG_KEY ?? "").trim();
  if (!/^phc_[A-Za-z0-9]{10,}$/.test(key)) return null;
  const host = parseHost(String(env.VITE_POSTHOG_HOST ?? "").trim());
  if (!host) return null;

  const allowed = String(env.VITE_POSTHOG_ENABLED_HOSTS ?? "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  const h = hostname.toLowerCase();
  if (!allowed.includes(h)) return null;
  if (
    PRODUCTION_HOSTS.includes(h) &&
    String(env.VITE_POSTHOG_ALLOW_PRODUCTION ?? "").trim() !== "true"
  ) {
    return null;
  }
  /* `vite dev` may only talk to a local stub, never to a real project. */
  if (env.DEV && !isLocalHost(new URL(host).hostname)) return null;
  return { key, host };
}

export const isPosthogConfigured = () => {
  try {
    return readConfig() !== null;
  } catch {
    return false;
  }
};

/* Options verified against posthog-js 1.447.12 (`PostHogConfig`). */
export function buildSdkConfig(cfg: Config): Partial<PostHogConfig> {
  return {
    api_host: cfg.host,
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    disable_session_recording: true,
    enable_heatmaps: false,
    capture_heatmaps: false,
    capture_dead_clicks: false,
    capture_performance: false,
    capture_exceptions: false,
    disable_surveys: true,
    disable_product_tours: true,
    disable_conversations: true,
    disable_web_experiments: true,
    advanced_disable_flags: true,
    disable_external_dependency_loading: true,
    person_profiles: "identified_only",
    persistence: "localStorage+cookie",
    cross_subdomain_cookie:
      window.location.hostname === "turbotrade.ai" ||
      window.location.hostname.endsWith(".turbotrade.ai"),
    secure_cookie: window.location.protocol === "https:",
    cookie_expiration: 90,
    save_referrer: false,
    /* C1-H1.1 storage minimisation (as turbotrade-ui C0.1). Attribution is read
       by our own code (attribution.ts) from the address bar before the SDK
       loads, never from the SDK, so the SDK need not keep campaign or click-id
       parameters: it stops storing utm_* / gclid / fbclid in session storage
       and deriving the `$fbc` Meta click id. The landing URL it keeps in its own
       storage (`$initial_person_info`, session entry props) is masked for the
       advertising ids PostHog knows plus every parameter below. The value
       becomes `<masked>`; the key stays. Meta Pixel is separate and unchanged. */
    save_campaign_params: false,
    mask_personal_data_properties: true,
    custom_personal_data_properties: [...SENSITIVE_URL_PARAMS],
    ip: false,
    /* Send each event at once instead of in a 3-second batch: there is no
       queue of already-captured events to leak out after a withdrawal, and
       nothing is lost when the tab closes. Traffic is a handful of events. */
    request_batching: false,
    before_send: (result) =>
      sanitizeOutgoing(result as unknown as OutgoingEvent) as unknown as CaptureResult | null,
  };
}

/* URL parameters whose VALUES the SDK must never keep in its storage on the
   marketing site: campaign and influencer tags (attribution.ts reads them
   first-hand), advertising click ids, and anything an auth, signup or referral
   link could carry. The SDK matches names EXACTLY (case-sensitive), so common
   spellings are listed as sent. */
export const SENSITIVE_URL_PARAMS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id",
  "tt_inf", "tt_plc", "ref", "inf", "influencer", "influencer_id", "placement", "placement_id", "plc",
  "gclid", "fbclid", "msclkid", "dclid", "gbraid", "wbraid", "igshid", "ttclid", "twclid", "li_fat_id",
  "mc_cid", "mc_eid", "epik", "rdt_cid", "yclid", "sccid", "ScCid", "srsltid", "_gl", "_hsenc", "_hsmi", "mkt_tok",
  "token", "access_token", "refresh_token", "id_token", "auth_token", "credential",
  "code", "Code", "auth_code", "authCode", "state", "State",
  "otp", "email", "phone", "mobile", "userId", "userid", "referral_code", "coupon", "next", "fallback",
] as const;

/* ─── final outgoing filter (the SDK adds its own properties) ─── */

export interface OutgoingEvent {
  uuid?: string;
  event: string;
  properties?: Record<string, unknown>;
  $set?: Record<string, unknown>;
  $set_once?: Record<string, unknown>;
}

/* `$fbc` / `$fbp` are Meta identifiers the SDK derives from `fbclid` and the _fbp cookie and
   adds to `$set` (C0 browser QA); they carry the raw click id, so they never leave. */
const CAMPAIGN_KEY =
  /(utm_|gclid|fbclid|msclkid|dclid|gbraid|wbraid|igshid|ttclid|twclid|li_fat_id|mc_cid|epik|rdt_cid|^\$fb[cp]$)/i;
/* Non-$ keys the SDK itself needs for ingestion; removing `token` drops the event. */
const SDK_KEYS = ["token", "distinct_id"];
const URL_KEYS = /^\$.*(url|referrer)$/i;

/* Origin + path only: no query string, no fragment. */
export function stripUrl(v: unknown): string | undefined {
  if (typeof v !== "string" || !v) return undefined;
  try {
    const u = new URL(v);
    return `${u.origin}${u.pathname}`;
  } catch {
    return undefined;
  }
}

function scrub(bag: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
  if (!bag) return bag;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(bag)) {
    /* Our own attribution fields are kept even when they contain a campaign
       word (`ft_utm_id`, `lt_utm_id`); raw campaign and click-id keys are
       dropped. Only the approved field names pass (ATTRIBUTION_KEYS), so an
       arbitrary `ft_*` key cannot ride along. */
    if (ATTRIBUTION_KEYS.includes(k)) {
      out[k] = v;
      continue;
    }
    if (CAMPAIGN_KEY.test(k)) continue;
    /* Any SDK property holding a URL ($current_url, $referrer, $initial_*,
       $session_entry_url, …) is cut to origin + path. A value that is not a
       URL (the SDK's "$direct") passes only if it has no query or fragment. */
    if (URL_KEYS.test(k)) {
      const s = stripUrl(v);
      if (s) out[k] = s;
      else if (typeof v === "string" && !/[?#]/.test(v)) out[k] = v;
      continue;
    }
    if (k.startsWith("$")) {
      out[k] = v;
      continue;
    }
    if (SDK_KEYS.includes(k)) {
      out[k] = v;
      continue;
    }
    if ((BASE_PROPS as readonly string[]).includes(k)) {
      out[k] = v;
      continue;
    }
    /* any other non-$ key must be on some event's allowlist */
    if (Object.values(EVENT_ALLOWLIST).some((l) => l.includes(k))) out[k] = v;
  }
  return out;
}

/* Returns null to drop the event. Only the two schema events may leave. */
export function sanitizeOutgoing(e: OutgoingEvent | null): OutgoingEvent | null {
  if (!e || !isKnownEvent(e.event)) return null;
  return {
    ...e,
    properties: scrub(e.properties),
    $set: scrub(e.$set),
    $set_once: scrub(e.$set_once),
  };
}

/* ─── real SDK, loaded lazily ─── */

async function loadSdkTransport(cfg: Config): Promise<AnalyticsTransport> {
  const { default: ph } = await import("posthog-js");
  ph.init(cfg.key, buildSdkConfig(cfg) as Partial<PostHogConfig>);
  return {
    capture: (event, props) => {
      /* Our own consent gate has already passed. After a withdrawal the SDK is
         left opted out (below), so a later explicit accept opts it back in. */
      if (ph.has_opted_out_capturing()) ph.opt_in_capturing({ captureEventName: false });
      void ph.capture(event, props);
    },
    identify: (id, setOnce) => void ph.identify(id, undefined, setOnce),
    register: (props) => void ph.register(props),
    /* Withdrawal: opt out first so events still waiting in the SDK's send queue
       are discarded rather than delivered after the visitor said no. */
    reset: () => {
      ph.opt_out_capturing();
      ph.reset();
    },
  };
}

/* Removes whatever the SDK left in storage. */
export function clearPosthogStorage(): void {
  try {
    const expire = (name: string) => {
      const domains = ["", `; Domain=${window.location.hostname}`];
      if (window.location.hostname.endsWith(".turbotrade.ai")) domains.push("; Domain=.turbotrade.ai");
      for (const d of domains) document.cookie = `${name}=; Max-Age=0; Path=/${d}`;
    };
    document.cookie
      .split(";")
      .map((c) => c.split("=")[0].trim())
      .filter((n) => n.startsWith("ph_") || n.startsWith("__ph"))
      .forEach(expire);
    for (const store of [window.localStorage, window.sessionStorage]) {
      Object.keys(store)
        .filter((k) => k.startsWith("ph_") || k.startsWith("__ph") || k.startsWith("tt_ph_"))
        .forEach((k) => store.removeItem(k));
    }
  } catch {
    /* storage may be unavailable */
  }
}

/* ─── lifecycle ─── */

let active = false;
let unsubscribe: (() => void) | null = null;

function flush(): void {
  if (!transport) return;
  while (pending.length) {
    const [event, props] = pending.shift()!;
    try {
      transport.capture(event, props);
    } catch {
      /* swallow */
    }
  }
}

function ensureTransport(cfg: Config): void {
  if (transport || loading) return;
  loading = loadSdkTransport(cfg)
    .then((t) => {
      if (!transport) transport = t;
      if (active) flush();
      else pending.length = 0;
    })
    .catch(() => {
      /* blocked or failed: drop silently, never retry in a loop */
      pending.length = 0;
    });
}

function start(late: boolean): void {
  if (active) return;
  let cfg: Config | null = null;
  try {
    cfg = readConfig();
  } catch {
    cfg = null;
  }
  if (!cfg) return;
  if (!isAnalyticsGranted()) {
    /* C0: consent withdrawn (or never given) on the OTHER site cannot clear this origin's
       localStorage, so a stale distinct id could survive and be reused on a later opt-in. */
    clearPosthogStorage();
    return;
  }
  active = true;
  persistAttribution();
  if (!transport) ensureTransport(cfg);
  else flush();
  /* The page was already showing when consent arrived: one pageview for the
     current page, flagged, no back-fill. */
  if (route.current && !route.sent) sendPageview(route.current, late);
}

function stop(): void {
  active = false;
  pending.length = 0;
  route.sent = null;
  sentThisDocument = false;
  lastActivityMem = 0;
  try {
    transport?.reset();
  } catch {
    /* ignore */
  }
  clearPosthogStorage();
  clearAttribution();
}

/* Call once from main.tsx after captureAttributionSnapshot() and the Meta
   Pixel start. Safe to call again. Returns whether analytics is running. */
export function initPosthog(): boolean {
  try {
    if (!readConfig()) return false;
    if (!unsubscribe) {
      unsubscribe = onAnalyticsConsentChange((granted) => (granted ? start(true) : stop()));
    }
    start(false);
    return active;
  } catch {
    return false;
  }
}

export function isPosthogActive(): boolean {
  return active && isAnalyticsGranted();
}

/* ─── capture ─── */

/* The only way an event leaves the app. Returns true when it was accepted. */
export function safeCapture<E extends EventName>(event: E, props: EventPropsMap[E]): boolean {
  try {
    if (!isKnownEvent(event) || !isPosthogActive()) return false;
    const body = {
      ...sanitizeProps(event, { ...attributionProps(), ...(props as Record<string, unknown>) }),
      schema_version: SCHEMA_VERSION,
      site: SITE,
    };
    touchActivity();
    queueMicrotask(() => {
      try {
        if (!isPosthogActive()) return;
        if (transport) transport.capture(event, body);
        else if (pending.length < MAX_PENDING) pending.push([event, body]);
      } catch {
        /* an analytics failure must never reach the caller */
      }
    });
    return true;
  } catch {
    return false;
  }
}

/* ─── pageviews ─── */

interface RouteState {
  current: { key: string; path: string } | null;
  sent: { key: string; path: string } | null;
  initialKey: string | null;
}
const route: RouteState = { current: null, sent: null, initialKey: null };
let sentThisDocument = false;

/* ── is_landing semantics ──
   `is_landing = true` marks the FIRST pageview of a browsing session, where a
   session ends after 30 minutes without activity (the same rule PostHog's own
   session uses; the SDK reports $configured_session_timeout_ms = 1800000).
   "Activity" is the last event this site captured, stored in localStorage so
   every tab of the browser shares one clock:
     - a reload, or a second tab opened within 30 minutes, is NOT a landing;
     - the first pageview after 30 idle minutes IS a landing, even when it is
       a client-side navigation in a tab that was left open;
     - a visitor who accepts analytics late only gets is_landing when the
       page showing at that moment is the page they actually entered on
       (a later page is flagged consent_delayed but not is_landing, because
       the true entry page was never measured).
   Differences from PostHog's session are listed in the A1.1 report (24 h cap,
   activity that is not captured). Cleared on withdrawal (tt_ph_ prefix). */
const LAST_ACTIVITY_KEY = "tt_ph_last";
const SESSION_GAP_MS = 30 * 60 * 1000;
let lastActivityMem = 0;

function readLastActivity(): number {
  try {
    const v = Number(window.localStorage.getItem(LAST_ACTIVITY_KEY));
    return Math.max(Number.isFinite(v) ? v : 0, lastActivityMem);
  } catch {
    return lastActivityMem;
  }
}

function touchActivity(): void {
  const now = Date.now();
  lastActivityMem = now;
  try {
    window.localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
  } catch {
    /* storage unavailable: the in-memory clock still covers this tab */
  }
}

function isSessionStart(): boolean {
  const last = readLastActivity();
  return last === 0 || Date.now() - last > SESSION_GAP_MS;
}

function referrerHost(): string | undefined {
  try {
    return document.referrer ? new URL(document.referrer).hostname : undefined;
  } catch {
    return undefined;
  }
}

function inAppBrowser(): boolean {
  return /Instagram|FBAN|FBAV|FB_IAB|Telegram|LinkedInApp|WhatsApp/i.test(navigator.userAgent);
}

function sendPageview(r: { key: string; path: string }, delayed: boolean): void {
  const landing = isSessionStart() && (!delayed || r.key === route.initialKey);
  const ok = safeCapture("$pageview", {
    $current_url: `${window.location.origin}${r.path}`,
    $referrer: sentThisDocument ? undefined : referrerHost(),
    ...(landing ? { is_landing: true } : {}),
    ...(delayed ? { consent_delayed: true } : {}),
    in_app_browser: inAppBrowser(),
  });
  if (ok) {
    route.sent = r;
    sentThisDocument = true;
  }
}

/* Pure, React-free core so it can be tested without rendering. */
export function onRouteChange(key: string, path: string): void {
  try {
    if (route.initialKey === null) route.initialKey = key;
    route.current = { key, path };
    if (!isPosthogActive()) return; // no consent, no event, nothing queued
    /* Same page as the last one sent: a StrictMode double effect, a remount,
       a parent re-render, a hash or query change, a click on the link to the
       page you are on. React Router's initial location key is the constant
       "default", so the path (not the key) is the reliable comparison. */
    if (route.sent?.path === path) return;
    sendPageview(route.current, false);
  } catch {
    /* ignore */
  }
}

/* Mounted once next to useRouteAnalytics. Independent of the Meta Pixel's
   first-render skip: the entry page's first effect IS a real pageview. */
export function usePosthogPageview(): void {
  const location = useLocation();
  const path = canonicalPath(location.pathname);
  useEffect(() => {
    onRouteChange(location.key, path);
  }, [location.key, path]);
}

export function resetPosthogForTests(): void {
  active = false;
  unsubscribe?.();
  unsubscribe = null;
  transport = null;
  loading = null;
  pending.length = 0;
  route.current = null;
  route.sent = null;
  route.initialKey = null;
  sentThisDocument = false;
  lastActivityMem = 0;
}
