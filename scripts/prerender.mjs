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
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const template = readFileSync(join(dist, "index.html"), "utf8");
const { render, ROUTE_META, NOT_FOUND_META } = await import(
  pathToFileURL(join(root, "dist-ssr", "entry-server.js")).href
);

const ORIGIN = "https://turbotrade.ai";
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
  html = swap(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${esc(meta.title)}$2`, "og:title");
  html = swap(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`, "og:url");
  html = swap(html, /(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(meta.title)}$2`, "twitter:title");
  if (meta.noindex) {
    html = html.replace("</head>", `    <meta name="robots" content="noindex" />\n  </head>`);
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
