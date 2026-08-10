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

export const SEBI_RA_NUMBER = "INH000028565";

/* Where "Log in" and "Start free" point until the app itself is live. Both land
   on the same holding page, which is deliberate: a "Start free" that 404s costs
   more trust than one that says "not yet". */
export const APP_ROUTE = "/coming-soon";
