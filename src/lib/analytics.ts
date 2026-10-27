import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { APP_LOGIN_URL, APP_SIGNUP_URL, APP_STRATEGIES_URL } from "@/lib/brand";
import { trackCustomEvent, trackPageView } from "@/lib/metaPixel";

/* The canonical origin. Every <loc> in public/sitemap.xml and every canonical
   URL written below is built from this, so the sitemap and the pages agree on
   one spelling of the site — which is the whole point of a canonical. */
export const SITE_ORIGIN = "https://turbotrade.ai";

/* Two routes are aliases that resolve to a page reachable under another path.
   A crawler arriving on the alias should be told where the real page lives, or
   the two spellings compete with each other in the index. */
const CANONICAL_ALIASES: Record<string, string> = {
  "/broker-partner": "/broker-partner-program",
  "/coming-soon": "/upcoming",
};

function canonicalPath(pathname: string) {
  /* Trailing slashes are stripped so /contact/ and /contact are one URL; the
     root keeps its slash because "" is not a path. */
  const trimmed = pathname.replace(/\/+$/, "") || "/";
  return CANONICAL_ALIASES[trimmed] ?? trimmed;
}

/* The Meta Pixel (src/lib/metaPixel.ts) fires PageView for the initial
   document only. React Router swaps routes without a document load, so without
   this every visit looks like a single-page session to Meta and no landing
   page but the entry point ever reports a view.

   The canonical <link> is rewritten here for the same reason: index.html ships
   one canonical for the root, and it would otherwise claim every route is the
   home page. */
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
   "Log in" link at APP_LOGIN_URL, and the "See strategies" link at
   APP_STRATEGIES_URL (src/lib/brand.ts), so a click
   is recognised by its destination, not by its styling. One delegated
   listener covers every current and future CTA; the optional `data-cta`
   attribute names where on the page it sat.

   These are CUSTOM events on purpose. A click only says someone meant to
   sign up or log in — the app may find they already have an account, or they may
   abandon the form. The CompleteRegistration conversion is sent by the
   platform after its backend confirms the account exists. */
const CTA_EVENTS: Record<string, string> = {
  [APP_SIGNUP_URL]: "SignupCTAClick",
  [APP_LOGIN_URL]: "LoginCTAClick",
  [APP_STRATEGIES_URL]: "StrategiesCTAClick",
};

/* A double click, or click + middle-click, is one intent. */
const CTA_REPEAT_MS = 1000;

function ctaLocation(anchor: HTMLAnchorElement): string {
  const labelled = anchor.closest<HTMLElement>("[data-cta]");
  if (labelled?.dataset.cta) return labelled.dataset.cta;
  return anchor.closest<HTMLElement>("section[id]")?.id || "page";
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

    const name = CTA_EVENTS[anchor.href] ?? CTA_EVENTS[anchor.getAttribute("href") ?? ""];
    if (!name) return;

    const location = ctaLocation(anchor);
    const key = `${name}:${location}`;
    const now = Date.now();
    if (key === last.key && now - last.at < CTA_REPEAT_MS) return;
    last = { key, at: now };

    trackCustomEvent(name, { cta_location: location });
  };

  document.addEventListener("click", onClick, { capture: true });
  document.addEventListener("auxclick", onClick, { capture: true });
}
