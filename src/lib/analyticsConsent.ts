/* ══════════════ ANALYTICS CONSENT (PostHog) ══════════════
   Separate from the Meta advertising preference (`tt_ad_consent`, see
   metaPixel.ts), which is an opt-out. PostHog is OPT-IN:

     absent  → no analytics (the visitor has not chosen; the prompt may show)
     denied  → no analytics (the visitor declined or withdrew)
     granted → analytics may run (still subject to the build flag and host
               allowlist in posthog.ts)

   Global Privacy Control always counts as denied, whatever the cookie says.
   The Meta cookie is never read or written here.

   ── SHARED CONTRACT (turbotrade-ui must implement it identically) ──
   Name      tt_an_consent
   Value     exactly "granted" or "denied"; anything else, or no cookie, = unset
   Domain    .turbotrade.ai on turbotrade.ai and any *.turbotrade.ai host, so
             www.turbotrade.ai and app.turbotrade.ai share one choice;
             host-only (no Domain attribute) anywhere else
   Path      /
   Max-Age   31536000 (365 days), refreshed each time the visitor chooses;
             an expired cookie is "unset" and the prompt returns
   SameSite  Lax;  Secure on https;  never HttpOnly (the page must read it)
   Writes    only from an explicit visitor action (a click on Accept, Decline
             or Turn off); never defaulted, never inferred from another cookie
   Withdraw  writes "denied" with the same attributes (so it overwrites the
             granted cookie on the same domain), then clears tt_attr and every
             PostHog cookie and storage key (posthog.ts → stop()). The cookie is
             not deleted: "denied" remembers the choice so the prompt does not
             nag. Every tab re-reads the cookie before each event and when it
             becomes visible again, so a change in one tab reaches the others. */

export type AnalyticsConsent = "granted" | "denied" | "unset";

export const CONSENT_COOKIE = "tt_an_consent";
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 365;
export const OPEN_PREFERENCES_EVENT = "tt:open-analytics-preferences";

type Listener = (granted: boolean) => void;
const listeners = new Set<Listener>();
let lastKnown: boolean | null = null;
let syncInstalled = false;

declare global {
  interface Window {
    turbotradeAnalyticsConsent?: {
      grant: () => void;
      deny: () => void;
      status: () => AnalyticsConsent;
      open: () => void;
    };
  }
}

function readCookie(): string | null {
  const m = document.cookie.match(/(?:^|;\s*)tt_an_consent=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof document === "undefined") return "denied";
  if (navigator.globalPrivacyControl === true) return "denied";
  const v = readCookie();
  if (v === "granted") return "granted";
  if (v === "denied") return "denied";
  return "unset";
}

export const isAnalyticsGranted = () => getAnalyticsConsent() === "granted";

/* `.turbotrade.ai` on the real domains so the app reads the same choice;
   host-only anywhere else. */
export function cookieDomain(host: string = window.location.hostname): string {
  const h = host.toLowerCase();
  return h === "turbotrade.ai" || h.endsWith(".turbotrade.ai") ? "; Domain=.turbotrade.ai" : "";
}

function secure(protocol: string = window.location.protocol): string {
  return protocol === "https:" ? "; Secure" : "";
}

/* The exact Set-Cookie string for a value (exported so tests pin the contract). */
export function consentCookieString(
  value: "granted" | "denied",
  host?: string,
  protocol?: string,
): string {
  return (
    `${CONSENT_COOKIE}=${value}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax` +
    secure(protocol) +
    cookieDomain(host)
  );
}

function notify(granted: boolean): void {
  lastKnown = granted;
  for (const fn of Array.from(listeners)) {
    try {
      fn(granted);
    } catch {
      /* a listener must never break the click that changed the preference */
    }
  }
}

/* Call only from an explicit visitor action. */
export function setAnalyticsConsent(granted: boolean): void {
  /* GPC wins: a visitor who sends it cannot be switched on by a click. */
  const effective = granted && navigator.globalPrivacyControl !== true;
  document.cookie = consentCookieString(effective ? "granted" : "denied");
  notify(effective);
}

/* Another tab may have changed the cookie, or GPC may have appeared: compare
   with what this tab last acted on and notify only on a real change. */
export function syncAnalyticsConsent(): void {
  const now = isAnalyticsGranted();
  if (lastKnown === null) lastKnown = now;
  if (now !== lastKnown) notify(now);
}

/* Called by posthog.ts. Returns an unsubscribe function. */
export function onAnalyticsConsentChange(fn: Listener): () => void {
  listeners.add(fn);
  if (lastKnown === null && typeof document !== "undefined") lastKnown = isAnalyticsGranted();
  if (!syncInstalled && typeof document !== "undefined") {
    syncInstalled = true;
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") syncAnalyticsConsent();
    });
    window.addEventListener("pageshow", syncAnalyticsConsent);
  }
  return () => listeners.delete(fn);
}

/* Reopens the preference panel (footer link, console, future privacy page). */
export function openAnalyticsPreferences(): void {
  window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT));
}

export function resetConsentSyncForTests(): void {
  listeners.clear();
  lastKnown = null;
}

if (typeof window !== "undefined") {
  window.turbotradeAnalyticsConsent = {
    grant: () => setAnalyticsConsent(true),
    deny: () => setAnalyticsConsent(false),
    status: getAnalyticsConsent,
    open: openAnalyticsPreferences,
  };
}
