/**
 * Prerender every public route to static HTML (run after `vite build` and
 * `vite build --ssr`; see the "build" script in package.json).
 *
 * Why: the site is a client-rendered single-page app, so before this a crawler
 * that does not run JavaScript (GPTBot, ClaudeBot, PerplexityBot, most link
 * previews) saw an empty <div id="root"> and a single title for every URL. Each
 * route now ships its real markup, its own <title>/description/canonical, and
 * the browser hydrates it (src/main.tsx) instead of rebuilding it.
 *
 * Also writes dist/404.html, from the NotFound route. With the catch-all
 * rewrite gone from vercel.json, Vercel answers an unknown URL with this page
 * AND a real 404 status, where it used to send the home shell with a 200.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const template = readFileSync(join(dist, "index.html"), "utf8");
const {
  render,
  ROUTE_META,
  NOT_FOUND_META,
  BLOCK_ALL_ROBOTS_TXT,
  EMPTY_SITEMAP_XML,
  NOINDEX_META,
  isIndexableEnvironment,
  resolveSiteEnvironment,
} = await import(
  pathToFileURL(join(root, "dist-ssr", "entry-server.js")).href
);

/* Vite's manifest maps a source file to its built chunk. It is only a build
   input here, so it is removed from dist once read. */
const manifest = JSON.parse(readFileSync(join(dist, ".vite", "manifest.json"), "utf8"));
rmSync(join(dist, ".vite"), { recursive: true, force: true });

const ORIGIN = "https://turbotrade.ai";

/* Preview and staging builds are production builds too (NODE_ENV cannot tell
   them apart): see src/lib/siteEnvironment.ts. They must never be indexed. */
const INDEXABLE = isIndexableEnvironment(process.env);
console.log(`[prerender] environment: ${resolveSiteEnvironment(process.env)} (${INDEXABLE ? "indexable" : "noindex"})`);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function swap(html, pattern, replacement, what) {
  if (!pattern.test(html)) throw new Error(`prerender: template has no ${what}`);
  return html.replace(pattern, () => replacement);
}

function page(meta, body) {
  const url = meta.path === "/" ? `${ORIGIN}/` : `${ORIGIN}${meta.path}`;
  let html = template;
  html = swap(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`, "<title>");
  html = swap(
    html,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${esc(meta.description)}" />`,
    "meta description",
  );
  html = swap(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`, "canonical");
  // Whole-tag replacements: `swap` inserts its replacement literally, so capture
  // groups ($1) cannot be used here.
  const tag = (attr, key, value) => `<meta ${attr}="${key}" content="${esc(value)}" />`;
  const pattern = (attr, key) => new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/>`);
  html = swap(html, pattern("property", "og:title"), tag("property", "og:title", meta.title), "og:title");
  html = swap(html, pattern("property", "og:url"), tag("property", "og:url", url), "og:url");
  html = swap(html, pattern("name", "twitter:title"), tag("name", "twitter:title", meta.title), "twitter:title");
  if (meta.path !== "/") {
    // The home page keeps its own share copy from index.html; every other page
    // describes itself rather than repeating the home description.
    html = swap(html, pattern("property", "og:description"), tag("property", "og:description", meta.description), "og:description");
    html = swap(html, pattern("name", "twitter:description"), tag("name", "twitter:description", meta.description), "twitter:description");
  }
  if (meta.chunk) {
    const entry = manifest[meta.chunk];
    if (!entry) throw new Error(`prerender: no built chunk for ${meta.chunk}`);
    html = html.replace("</head>", `    <link rel="modulepreload" crossorigin href="/${entry.file}" />\n  </head>`);
  }
  if (meta.noindex || !INDEXABLE) {
    // One robots tag per page: a non-production build always blocks indexing.
    html = html.replace("</head>", `    ${meta.noindex && INDEXABLE ? '<meta name="robots" content="noindex" />' : NOINDEX_META}\n  </head>`);
  }
  return swap(html, /<div id="root"><\/div>/, `<div id="root">${body}</div>`, "#root");
}

function write(file, html) {
  const out = join(dist, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}

for (const meta of ROUTE_META) {
  const body = await render(meta.path);
  write(meta.path === "/" ? "index.html" : `${meta.path.slice(1)}/index.html`, page(meta, body));
  console.log(`[prerender] ${meta.path}  (${body.length} chars)`);
}
write("404.html", page(NOT_FOUND_META, await render("/__not-found__")));
console.log("[prerender] 404.html");

if (!INDEXABLE) {
  // A courtesy to well-behaved crawlers and a sitemap that names no page; the
  // robots meta tag above is what keeps the pages out of the index.
  write("robots.txt", BLOCK_ALL_ROBOTS_TXT);
  write("sitemap.xml", EMPTY_SITEMAP_XML);
  console.log("[prerender] non-production: robots.txt blocks all, sitemap.xml emptied");
}
