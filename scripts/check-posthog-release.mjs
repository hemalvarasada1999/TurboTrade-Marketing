#!/usr/bin/env node
/*
 * PostHog-only release guard for the Marketing BUILD OUTPUT (Batch P3).
 *
 *   node scripts/check-posthog-release.mjs [distDir]      (default dist)
 *
 * Run after `pnpm build`. Fails (exit 1) if the unpublished privacy draft
 * reached the bundle, if the PostHog SDK is not lazily split out, or if a
 * build that is meant to be OFF carries a project key.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const dist = process.argv[2] ?? "dist";
if (!existsSync(dist)) {
  console.error(`[release-guard] ${dist} not found: run pnpm build first`);
  process.exit(2);
}
const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|html|css|json|txt|xml)$/.test(name)) out.push(p);
  }
  return out;
};
const files = walk(dist).map((p) => ({ path: relative(dist, p), text: readFileSync(p, "utf8") }));
const failures = [];

/* 1. The privacy draft is NOT published (legal approval pending). */
for (const s of ["draft-awaiting-owner-and-legal-approval", "[CONFIRM", "PostHog, Inc.", "Analytics are off unless you choose"]) {
  for (const f of files) if (f.text.includes(s)) failures.push(`privacy draft text "${s}" in ${f.path}`);
}

/* 2. PostHog is present, and its SDK is a separate lazily loaded chunk. */
if (!files.some((f) => f.text.includes("tt_an_consent"))) failures.push("consent cookie name tt_an_consent not found");
const sdk = files.filter((f) => f.text.includes("$raw_user_agent"));
if (!sdk.length) failures.push("posthog-js SDK chunk not found");
const entry = files.find((f) => f.path === "index.html");
for (const f of sdk) if (entry?.text.includes(f.path.split("/").pop())) failures.push(`SDK chunk ${f.path} is loaded eagerly from index.html`);

/* 3. A build meant to be OFF ships no project key. */
const enabled = String(process.env.VITE_POSTHOG_ENABLED ?? "").trim() === "true";
const keys = files.filter((f) => /phc_[A-Za-z0-9]{10,}/.test(f.text)).map((f) => f.path);
if (!enabled && keys.length) failures.push(`analytics is off but a phc_ key is in: ${keys.join(", ")}`);

/* 4. No Help Center or Product Tour from the app (the SDK chunk has its own disabled tour code). */
for (const f of files.filter((f) => !sdk.includes(f))) {
  for (const s of ["help_center_opened", "Product Tour", "ProductTour"]) if (f.text.includes(s)) failures.push(`"${s}" in ${f.path}`);
}

if (failures.length) {
  console.error(`[release-guard] FAIL (${failures.length})`);
  for (const f of failures.slice(0, 50)) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`[release-guard] PASS: ${files.length} files in ${dist}; privacy draft unpublished, SDK lazy, ${enabled ? "analytics flag on" : "no project key (analytics off)"}`);
