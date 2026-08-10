import { useEffect, useState } from "react";
import { LOGO_ON_DARK, LOGO_ON_LIGHT } from "@/lib/brand";

/* ══════════════ THEME-AWARE LOGO ══════════════
   The lockup ships in two versions and neither works on both surfaces: one is
   drawn in dark ink for a light background, the other in light ink for a dark
   one. Put the wrong one down and the wordmark is invisible rather than merely
   off-brand.

   The accessibility toolbar can invert either surface out from under a fixed
   choice, which is why this is a hook and not a constant:
     · Dark reading theme flips the PAGE dark, so the header — normally on paper —
       needs the light-ink lockup.
     · High contrast forces every surface to white, including the footer and the
       partner band, so the FOOTER needs the dark-ink lockup there.
   Those two pull in opposite directions, so each caller says which surface it is
   sitting on and the hook works out the rest.

   A MutationObserver on the <html> class list, rather than the toolbar's
   `turbotrade-theme-changed` event. The class is the actual source of truth — it
   is what every CSS rule keys off — and watching it directly means this keeps
   working if the theme is ever set from somewhere that does not fire that event
   (the cross-tab `storage` sync already is one such path). */

type ReadingTheme = "default" | "contrast" | "dark" | "warm" | "grayscale";

function readTheme(): ReadingTheme {
  if (typeof document === "undefined") return "default";
  const c = document.documentElement.classList;
  if (c.contains("a11y-theme-contrast")) return "contrast";
  if (c.contains("a11y-theme-dark")) return "dark";
  if (c.contains("a11y-theme-warm")) return "warm";
  if (c.contains("a11y-theme-grayscale")) return "grayscale";
  return "default";
}

/**
 * The lockup to use on a given surface, kept in step with the reading theme.
 *
 * @param surface What the logo is sitting on in the DEFAULT theme — "light" for
 *   the header capsule, "dark" for the footer and the partner band.
 */
export function useBrandLogo(surface: "light" | "dark"): string {
  const [theme, setTheme] = useState<ReadingTheme>(readTheme);

  useEffect(() => {
    const sync = () => setTheme(readTheme());
    /* Once on mount as well as on change: the toolbar applies saved settings in
       its own effect, and whichever of the two runs second would otherwise leave
       this stale for a frame. */
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  /* High contrast paints every surface white, so a nominally dark one is light.
     Dark reading does the reverse to the page, so a nominally light one is dark.
     Warm and grayscale leave the light/dark split alone. */
  const isDark = surface === "dark" ? theme !== "contrast" : theme === "dark";

  return isDark ? LOGO_ON_DARK : LOGO_ON_LIGHT;
}
