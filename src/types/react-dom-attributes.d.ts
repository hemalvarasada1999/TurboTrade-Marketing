/* `import "react"` is load-bearing: it makes this file a module, which is what
   turns the block below into a declaration MERGE. Without an import the file is
   an ambient script and `declare module "react"` would declare a brand-new
   module, shadowing React's real types instead of extending them. */
import "react";

/* ── fetchpriority on <img> ──
   React 18 does not know the camelCase `fetchPriority`; it warns at runtime and
   drops the attribute, so the priority hint on the curtain illustration — the
   home page's largest contentful paint — silently never reaches the browser. The
   lowercase spelling passes straight through as a custom attribute, which is
   exactly what the HTML spec wants, but @types/react 18 does not declare it.

   React 19 added first-class `fetchPriority` support. When this project upgrades,
   delete this file and switch the JSX back to the camelCase prop. */
declare module "react" {
  interface ImgHTMLAttributes<T> {
    fetchpriority?: "high" | "low" | "auto";
  }
}
