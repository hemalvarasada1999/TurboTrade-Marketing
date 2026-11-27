/* Which deployment this build is for, and therefore whether search engines may
   index it. Build-time only: scripts/prerender.mjs applies it to the static
   output (robots meta, robots.txt, sitemap.xml).

   Vercel builds Preview deployments with NODE_ENV=production too, so NODE_ENV
   cannot tell them apart. The signal is APP_ENVIRONMENT when set (the same
   name the platform repo uses), else Vercel's own VERCEL_ENV
   (production | preview | development). A build with neither — a laptop, CI —
   is "local".

   Fail closed: only an explicit "production" is indexable. A production deploy
   that is not on Vercel must set APP_ENVIRONMENT=production. */

type Env = Record<string, string | undefined>;

export const INDEXABLE_ENVIRONMENT = "production";

export function resolveSiteEnvironment(env: Env): string {
  return (env.APP_ENVIRONMENT || env.VERCEL_ENV || "local").trim().toLowerCase();
}

export function isIndexableEnvironment(env: Env): boolean {
  return resolveSiteEnvironment(env) === INDEXABLE_ENVIRONMENT;
}

/* One tag, added by the prerender to every page of a non-production build. The
   client never rewrites <meta name="robots">, so no route can override it. */
export const NOINDEX_META = `<meta name="robots" content="noindex, nofollow" />`;

export const BLOCK_ALL_ROBOTS_TXT = "User-agent: *\nDisallow: /\n";

/* An empty urlset: valid, and lists no URL a crawler could follow. */
export const EMPTY_SITEMAP_XML =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n';
