/* ══════════════ META PIXEL ══════════════
   The one place the marketing site talks to Meta. Nothing else in the app
   calls `fbq` directly — components go through the functions exported here,
   so the rules below hold everywhere:

   ── Configuration, not code ──
   The dataset (Pixel) ID comes from VITE_META_PIXEL_ID. It is a public
   identifier — every visitor's browser sees it — but it is still kept out of
   source so production, previews and local builds can differ.

   ── Production only ──
   The Pixel loads only on the hosts in VITE_META_PIXEL_HOSTS (default: the
   two production hostnames). A Vercel preview, `vite dev` or `vite preview`
   therefore never sends events into the production dataset, even when the ID
   is set. To test locally, put `localhost` in that variable in .env.local.

   ── Consent: notice + opt-out ──
   The privacy policy discloses Meta Pixel. A visitor whose browser sends
   Global Privacy Control, or who has opted out (the `tt_ad_consent=denied`
   cookie, shared with app.turbotrade.ai), never loads the Pixel at all.
   `setAdConsent()` is the hook a future consent banner/CMP calls; it is also
   exposed as `window.turbotradeAdConsent` for scripts that are not modules.

   ── Data minimisation ──
   - autoConfig is OFF: Meta's "automatic events" would otherwise scrape
     button text and page metadata. Every event here is explicit.
   - pushState tracking is OFF: the Pixel would otherwise fire its own
     PageView on every client-side route change, on top of
     useRouteAnalytics() — double counting.
   - Query strings are reduced to campaign parameters (utm_*, fbclid, gclid)
     before the Pixel ever reads the URL, so nothing personal that someone
     appended to a link reaches Meta.
   - No advanced matching: no email, phone or name is ever passed to `init`.
     (Automatic Advanced Matching must also be OFF in Events Manager.) */

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: Fbq;
  loaded?: boolean;
  version?: string;
  disablePushState?: boolean;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
    turbotradeAdConsent?: {
      grant: () => void;
      revoke: () => void;
      status: () => AdConsent;
    };
  }
  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

export type AdConsent = "granted" | "denied";

const PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID ?? "").trim();

const DEFAULT_HOSTS = ["turbotrade.ai", "www.turbotrade.ai"];

const ENABLED_HOSTS = (import.meta.env.VITE_META_PIXEL_HOSTS ?? "")
  .split(",")
  .map((h) => h.trim().toLowerCase())
  .filter(Boolean);

/* Shared with the platform (app.turbotrade.ai) so one opt-out covers both. */
const CONSENT_COOKIE = "tt_ad_consent";
const CONSENT_MAX_AGE = 60 * 60 * 24 * 365;

/* Campaign attribution is the only thing a landing URL needs to carry. */
const KEPT_QUERY_PARAMS = /^(utm_[a-z_]+|fbclid|gclid)$/i;

let initialised = false;

/* A numeric dataset ID on an approved host. Anything else is a no-op. */
export function isPixelEnabled(hostname = window.location.hostname): boolean {
  if (!/^\d{10,20}$/.test(PIXEL_ID)) return false;
  const hosts = ENABLED_HOSTS.length ? ENABLED_HOSTS : DEFAULT_HOSTS;
  return hosts.includes(hostname.toLowerCase());
}

/* ─── consent ─── */

function readConsentCookie(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)tt_ad_consent=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function getAdConsent(): AdConsent {
  if (navigator.globalPrivacyControl === true) return "denied";
  return readConsentCookie() === "denied" ? "denied" : "granted";
}

/* `.turbotrade.ai` on production so the platform reads the same choice;
   host-only anywhere else (localhost, previews). */
function consentCookieDomain(): string {
  const host = window.location.hostname;
  return host === "turbotrade.ai" || host.endsWith(".turbotrade.ai")
    ? "; Domain=.turbotrade.ai"
    : "";
}

export function setAdConsent(granted: boolean): void {
  const value: AdConsent = granted ? "granted" : "denied";
  document.cookie =
    `${CONSENT_COOKIE}=${value}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax` +
    (window.location.protocol === "https:" ? "; Secure" : "") +
    consentCookieDomain();

  if (!granted) {
    window.fbq?.("consent", "revoke");
    return;
  }
  if (initialised) {
    window.fbq?.("consent", "grant");
  } else {
    initMetaPixel();
  }
}

/* ─── URL hygiene ─── */

/* Drops every query parameter that is not campaign attribution, in place.
   The site itself reads no query parameters, so this changes nothing a
   visitor can see except a cleaner address bar. Exported for tests. */
export function stripNonCampaignParams(href: string): string {
  const url = new URL(href);
  let changed = false;
  for (const key of Array.from(url.searchParams.keys())) {
    if (!KEPT_QUERY_PARAMS.test(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  return changed ? url.toString() : href;
}

function sanitiseCurrentUrl(): void {
  const clean = stripNonCampaignParams(window.location.href);
  if (clean !== window.location.href) {
    window.history.replaceState(window.history.state, "", clean);
  }
}

/* ─── loading ─── */

/* Meta's base code, unchanged in behaviour: installs the `fbq` queue stub and
   loads fbevents.js asynchronously. Kept as a function rather than an inline
   <script> so it can be gated on host and consent. */
function installBaseCode(): void {
  if (window.fbq) return;
  const n = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue!.push(args);
  } as Fbq;
  window.fbq = n;
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  const t = document.createElement("script");
  t.async = true;
  t.src = "https://connect.facebook.net/en_US/fbevents.js";
  const s = document.getElementsByTagName("script")[0];
  s.parentNode!.insertBefore(t, s);
}

/* Loads the Pixel and sends the entry page's PageView — once per document.
   Safe to call more than once. Returns whether the Pixel is now active. */
export function initMetaPixel(): boolean {
  if (initialised) return true;
  if (!isPixelEnabled() || getAdConsent() === "denied") return false;

  /* Some other tag (GTM, a stray snippet) already installed fbq. Installing
     a second copy would double every event, so stand down and say why. */
  if (window.fbq) {
    console.warn("[metaPixel] fbq already present; not installing a second Pixel.");
    return false;
  }

  sanitiseCurrentUrl();
  installBaseCode();
  const fbq = window.fbq!;
  fbq.disablePushState = true;
  fbq("set", "autoConfig", false, PIXEL_ID);
  fbq("init", PIXEL_ID);
  fbq("track", "PageView");
  initialised = true;
  return true;
}

/* ─── events ─── */

/* A client-side route change. The entry page's view is sent by
   initMetaPixel(), so callers skip the first render. */
export function trackPageView(): void {
  if (!initialised || getAdConsent() === "denied") return;
  sanitiseCurrentUrl();
  window.fbq?.("track", "PageView");
}

/* Custom events only — never a standard conversion such as
   CompleteRegistration or Lead. A click is intent, not a signup; the
   registration itself is reported by the platform once its backend confirms
   it. Parameters must be non-personal. */
export function trackCustomEvent(
  name: string,
  params: Record<string, string> = {},
): void {
  if (!initialised || getAdConsent() === "denied") return;
  window.fbq?.("trackCustom", name, params);
}

if (typeof window !== "undefined") {
  window.turbotradeAdConsent = {
    grant: () => setAdConsent(true),
    revoke: () => setAdConsent(false),
    status: getAdConsent,
  };
}
