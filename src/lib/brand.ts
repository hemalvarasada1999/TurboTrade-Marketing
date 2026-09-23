import { COMPANY } from "./company";

/* Brand assets and the handful of facts repeated across sections.
   Paths, not imports: these live in /public/images and are referenced by URL so
   the <picture> srcsets in the curtain can name them as plain strings. */

/* The lockup naming is the artwork's, and it is the wrong way round from what
   you would guess: Full_white is the logo drawn FOR a white surface (dark ink),
   Full_dark is drawn for a dark one. Header gets the first, footer the second. */
export const LOGO_ON_LIGHT = "/images/Full_white.png";
export const LOGO_ON_DARK = "/images/Full_dark.png";

/* The opening illustration, in the sizes actually served. The 2 MB masters are
   not here on purpose — they are re-export sources, not page assets. */
export const CURTAIN_WIDE = {
  webp: [
    "/images/meditation-wide-640.webp 640w",
    "/images/meditation-wide-900.webp 900w",
    "/images/meditation-wide-1280.webp 1280w",
    "/images/meditation-wide-1682.webp 1682w",
  ].join(", "),
  fallback: "/images/meditation-wide.jpg",
};

/* Portrait phones get artwork drawn portrait, not a crop of the landscape file.
   `object-fit:cover` on a phone shows roughly a 1:2.2 centre slice whatever the
   source aspect, so the wide file was downloading about four times the pixels it
   displayed — and at 935px tall it was being upscaled 2.7x on a 3x screen. The
   3:4 master is 1448px tall, which brings that to 1.8x. */
export const CURTAIN_TALL = [
  "/images/meditation-tall-640.webp 640w",
  "/images/meditation-tall-828.webp 828w",
  "/images/meditation-tall-1086.webp 1086w",
].join(", ");

/* The value lives in .env; see lib/company.ts. */
export const SEBI_RA_NUMBER = COMPANY.sebiRa;

/* The holding page, kept for any CTA that has no home in the app yet. A link
   that 404s costs more trust than one that says "not yet". */
export const APP_ROUTE = "/coming-soon";

/* ─── hand-off to the app ───
   Every CTA that leaves the marketing site goes through ONE entry point in the
   app: /auth/continue. That page checks whether the visitor already has a live
   session and then either drops them straight where they were going, or sends
   them to the fallback below. So the marketing site never has to guess whether
   someone is signed in — it just states the destination and the fallback.

     next     — where a signed-in visitor lands
     fallback — where a visitor without a session lands

   Absolute URLs on purpose: these leave this origin, so they are plain <a>
   links, never react-router <Link>s. */
const APP_ORIGIN = (
  import.meta.env.VITE_APP_URL || "https://app.turbotrade.ai"
).replace(/\/+$/, "");

const appEntry = (next: string, fallback: string) =>
  `${APP_ORIGIN}/auth/continue` +
  `?next=${encodeURIComponent(next)}` +
  `&fallback=${encodeURIComponent(fallback)}`;

/* "Log in" — signed in goes to the dashboard, otherwise the login form. */
export const APP_LOGIN_URL = appEntry("/dashboard", "/auth/login");

/* "Start free" — an existing session should not be asked to sign up again, so
   it lands on the dashboard; everyone else gets the signup form. */
export const APP_SIGNUP_URL = appEntry("/dashboard", "/auth/signup");

/* "See strategies" / "Browse every strategy" — the only pair whose fallback is
   a public page rather than a form: strategies are browsable without an
   account, so no-session visitors land on the marketplace instead of a wall. */
export const APP_STRATEGIES_URL = appEntry(
  "/explore-strategies",
  "/marketplace"
);
