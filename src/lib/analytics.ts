import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* The canonical origin. Every <loc> in public/sitemap.xml and every canonical
   URL written below is built from this, so the sitemap and the pages agree on
   one spelling of the site — which is the whole point of a canonical. */
export const SITE_ORIGIN = "https://turbotrade.ai";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

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

/* The Meta Pixel base code in index.html fires PageView for the initial
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
    window.fbq?.("track", "PageView");
  }, [pathname]);
}

let isFirstRender = true;
