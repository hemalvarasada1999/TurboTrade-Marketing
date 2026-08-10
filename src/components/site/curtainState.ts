/* ══════════════ CURTAIN STATE ══════════════
   Whether the opening curtain has already been spent on this page load.

   Module scope, so it survives route changes but resets on a real reload — which
   is exactly the original page's behaviour, where the curtain belonged to a
   document load. Without it, clicking "Back to TurboTrade" from the privacy
   policy remounts Index and replays the entire opening, and a visitor navigating
   around the site has to dismiss an illustration every time they pass through the
   home page.

   It lives in its own file rather than in Curtain.tsx so that module keeps
   exporting nothing but its component — otherwise Vite's fast refresh gives up on
   the whole file and every curtain tweak costs a full reload. */

let curtainShown = false;

/**
 * Whether a Curtain mounted right now would actually display.
 *
 * Pure — no side effects, safe to call during render and safe under StrictMode's
 * double invocation of state initialisers. Index uses it to choose between the
 * curtain and the page-rise entrance, so the two never run at once.
 *
 * The scroll and hash checks are the two cases where covering the page would be
 * hostile: a refresh partway down, and a deep link. Both mean the visitor asked
 * for something specific.
 */
export function curtainWillShow(): boolean {
  if (curtainShown) return false;
  if (typeof window === "undefined") return false;
  return window.scrollY <= 4 && !window.location.hash;
}

export function markCurtainShown(): void {
  curtainShown = true;
}
