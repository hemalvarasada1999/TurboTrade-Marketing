/* Two routes are aliases that resolve to a page reachable under another path.
   A crawler arriving on the alias should be told where the real page lives, or
   the two spellings compete with each other in the index. The same table is
   what makes analytics count the two spellings as one page. */
const CANONICAL_ALIASES: Record<string, string> = {
  "/broker-partner": "/broker-partner-program",
  "/coming-soon": "/upcoming",
};

export function canonicalPath(pathname: string): string {
  /* Trailing slashes are stripped so /contact/ and /contact are one URL; the
     root keeps its slash because "" is not a path. */
  const trimmed = pathname.replace(/\/+$/, "") || "/";
  return CANONICAL_ALIASES[trimmed] ?? trimmed;
}
