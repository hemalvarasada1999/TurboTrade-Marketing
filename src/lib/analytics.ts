import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  APP_LOGIN_URL,
  APP_PLANS_URL,
  APP_SIGNUP_URL,
  APP_STRATEGIES_URL,
} from "@/lib/brand";
import { trackCustomEvent, trackPageView } from "@/lib/metaPixel";
import { canonicalPath } from "@/lib/routePath";
import { safeCapture } from "@/lib/posthog";
import { CTA_IDS, type CtaId, type CtaTarget } from "@/lib/analyticsEvents";

/* The canonical origin. Every <loc> in public/sitemap.xml and every canonical
   URL written below is built from this, so the sitemap and the pages agree on
   one spelling of the site — which is the whole point of a canonical. */
export const SITE_ORIGIN = "https://turbotrade.ai";

/* The Meta Pixel (src/lib/metaPixel.ts) fires PageView for the initial
   document only. React Router swaps routes without a document load, so without
   this every visit looks like a single-page session to Meta and no landing
   page but the entry point ever reports a view.

   The canonical <link> is rewritten here for the same reason: index.html ships
   one canonical for the root, and it would otherwise claim every route is the
   home page.

   PostHog pageviews are NOT sent from here: this hook skips its first run for
   Meta's sake, which would lose the landing page. PostHog has its own hook,
   usePosthogPageview (src/lib/posthog.ts). */
export function useRouteAnalytics() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = canonicalPath(pathname);
    const href = path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = href;

    const og = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (og) og.content = href;

    /* The first PageView already went out from the base code, so firing again
       on mount would double-count the entry page. */
    if (isFirstRender) {
      isFirstRender = false;
      return;
    }
    trackPageView();
  }, [pathname]);
}

let isFirstRender = true;

/* ─── CTA clicks ───
   Every "Sign up" / "Create account" link points at APP_SIGNUP_URL, every
   "Log in" link at APP_LOGIN_URL, the "See strategies" link at
   APP_STRATEGIES_URL and the "Pricing / Plans" link at APP_PLANS_URL
   (src/lib/brand.ts), so a click is recognised by its destination, not by its
   styling. One delegated listener covers every current and future CTA; the
   optional `data-cta` attribute names where on the page it sat.

   These are CUSTOM events on purpose. A click only says someone meant to
   sign up or log in — the app may find they already have an account, or they may
   abandon the form. The CompleteRegistration conversion is sent by the
   platform after its backend confirms the account exists.

   Two destinations, two tables:
   - CTA_EVENTS: the Meta custom events, exactly as before. Plans is NOT added
     here, so Meta's behaviour is unchanged.
   - CTA_TARGETS: what PostHog's `marketing_cta_clicked` reports, which also
     recognises Plans. */
const CTA_EVENTS: Record<string, string> = {
  [APP_SIGNUP_URL]: "SignupCTAClick",
  [APP_LOGIN_URL]: "LoginCTAClick",
  [APP_STRATEGIES_URL]: "StrategiesCTAClick",
};

const CTA_TARGET_BY_URL: Record<string, CtaTarget> = {
  [APP_SIGNUP_URL]: "signup",
  [APP_LOGIN_URL]: "login",
  [APP_PLANS_URL]: "plans",
  [APP_STRATEGIES_URL]: "strategies",
};

/* A double click, or click + middle-click, is one intent. */
const CTA_REPEAT_MS = 1000;

function ctaLocation(anchor: HTMLAnchorElement): string {
  const labelled = anchor.closest<HTMLElement>("[data-cta]");
  if (labelled?.dataset.cta) return labelled.dataset.cta;
  return anchor.closest<HTMLElement>("section[id]")?.id || "page";
}

/* PostHog only ever sees a value from the fixed list. */
function ctaId(location: string): CtaId {
  return (CTA_IDS as readonly string[]).includes(location) ? (location as CtaId) : "page";
}

let ctaTrackingInstalled = false;

export function installCtaTracking(): void {
  if (ctaTrackingInstalled) return;
  ctaTrackingInstalled = true;

  let last = { key: "", at: 0 };

  const onClick = (event: MouseEvent) => {
    /* Primary and middle button only — a right-click opens a menu, not the app. */
    if (event.button !== 0 && event.button !== 1) return;
    const anchor = (event.target as Element | null)?.closest?.("a[href]");
    if (!(anchor instanceof HTMLAnchorElement)) return;

    const href = anchor.getAttribute("href") ?? "";
    const target = CTA_TARGET_BY_URL[anchor.href] ?? CTA_TARGET_BY_URL[href];
    if (!target) return;
    const name = CTA_EVENTS[anchor.href] ?? CTA_EVENTS[href];

    const location = ctaLocation(anchor);
    const key = `${target}:${location}`;
    const now = Date.now();
    if (key === last.key && now - last.at < CTA_REPEAT_MS) return;
    last = { key, at: now };

    if (name) trackCustomEvent(name, { cta_location: location });
    safeCapture("marketing_cta_clicked", {
      cta_id: ctaId(location),
      cta_target: target,
      landing_path: canonicalPath(window.location.pathname),
    });
  };

  document.addEventListener("click", onClick, { capture: true });
  document.addEventListener("auxclick", onClick, { capture: true });
}
