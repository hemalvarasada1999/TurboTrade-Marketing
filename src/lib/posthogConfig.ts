/* ══════════════ POSTHOG CONFIGURATION (pure) ══════════════
   The enable/host/production decision, shared by posthog.ts (browser) and the
   build-time preflight in vite.config.ts so both agree. No `window`, no
   `import.meta.env`; the caller passes the values in. Mirrors turbotrade-ui
   lib/analytics/posthog/config.ts.

   ── Key ↔ environment binding (P2) ──
   A project key is accepted only on the hosts of the environment it is
   registered for in APPROVED_KEY_FINGERPRINTS: the production hostnames accept
   only a production fingerprint, every other hostname (Vercel previews,
   localhost, the QA harness) only a QA fingerprint. So a QA key in a
   production build, or the production key in a QA build, leaves analytics OFF.
   The registry holds the SHA-256 of the public `phc_` key, never the key. A
   local stub ingestion host (http://localhost…) reaches no PostHog project and
   is exempt. */

import { sha256 } from "./sha256";

export const PRODUCTION_HOSTS = ["turbotrade.ai", "www.turbotrade.ai"];

export type PosthogEnvironment = "production" | "qa";

/* SHA-256 (lower-case hex) of each approved project key. Compute one without
   showing the key:  read -rs K; printf %s "$K" | shasum -a 256; unset K
   Adding a fingerprint is a reviewed code change, deliberately not an
   environment variable: the console that holds the key must not also be able
   to declare which environment it belongs to. */
export const APPROVED_KEY_FINGERPRINTS: Readonly<Record<PosthogEnvironment, readonly string[]>> = {
  /* Project 338008. DEPLOYMENT GATE: empty until the owner adds the
     production key's fingerprint; until then www.turbotrade.ai stays off. */
  production: [],
  /* Project 348159, "TurboTrade QA Analytics" (full-token match in C1-H2). */
  qa: ["02237710e53d12e1fe4accbd6babccb78c9c10861ecc391cf010299e8f00d96d"],
};

export interface Config {
  key: string;
  host: string;
}

export interface RawEnv {
  enabled?: unknown;
  key?: unknown;
  host?: unknown;
  hosts?: unknown;
  allowProduction?: unknown;
}

export type DisabledReason =
  | "flag-off"
  | "invalid-key"
  | "invalid-ingestion-host"
  | "host-not-allowed"
  | "production-not-allowed"
  | "dev-needs-local-stub"
  | "key-not-approved-for-production"
  | "key-not-approved-for-qa";

export type ConfigVerdict = { config: Config; reason: "ok" } | { config: null; reason: DisabledReason };

type Registry = Readonly<Record<PosthogEnvironment, readonly string[]>>;

export function isLocalHost(h: string): boolean {
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]";
}

function parseHost(raw: string): string | null {
  try {
    const u = new URL(raw);
    if (u.protocol === "https:") return u.origin;
    if (u.protocol === "http:" && isLocalHost(u.hostname)) return u.origin;
  } catch {
    /* fall through */
  }
  return null;
}

export function keyFingerprint(key: string): string {
  return Array.from(sha256(key), (b) => b.toString(16).padStart(2, "0")).join("");
}

const off = (reason: DisabledReason): ConfigVerdict => ({ config: null, reason });
const str = (v: unknown) => String(v ?? "").trim();
const hostList = (v: unknown) =>
  str(v)
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

/* Pure: the decision, and why, from an environment and a hostname. */
export function evaluateConfig(
  env: RawEnv,
  hostname: string,
  dev = false,
  registry: Registry = APPROVED_KEY_FINGERPRINTS,
): ConfigVerdict {
  if (str(env.enabled) !== "true") return off("flag-off");
  const key = str(env.key);
  if (!/^phc_[A-Za-z0-9]{10,}$/.test(key)) return off("invalid-key");
  const host = parseHost(str(env.host));
  if (!host) return off("invalid-ingestion-host");
  const h = hostname.toLowerCase();
  if (!hostList(env.hosts).includes(h)) return off("host-not-allowed");
  const production = PRODUCTION_HOSTS.includes(h);
  if (production && str(env.allowProduction) !== "true") return off("production-not-allowed");
  const localStub = isLocalHost(new URL(host).hostname);
  /* `vite dev` may only talk to a local stub, never to a real project. */
  if (dev && !localStub) return off("dev-needs-local-stub");
  if (!localStub) {
    const fp = keyFingerprint(key);
    const isProd = registry.production.includes(fp);
    const isQa = registry.qa.includes(fp);
    if (production && !(isProd && !isQa)) return off("key-not-approved-for-production");
    if (!production && !(isQa && !isProd)) return off("key-not-approved-for-qa");
  }
  return { config: { key, host }, reason: "ok" };
}

/* Build-time preflight (vite.config.ts): one line per allowed hostname saying
   whether analytics can run there and why not. Never prints the key; at most
   the first 8 characters of its fingerprint. */
export function describeBuild(env: RawEnv, dev = false, registry: Registry = APPROVED_KEY_FINGERPRINTS): string[] {
  if (str(env.enabled) !== "true") return ["PostHog: off (flag-off)"];
  const key = str(env.key);
  const fp = /^phc_[A-Za-z0-9]{10,}$/.test(key) ? keyFingerprint(key) : null;
  const label = fp
    ? `${fp.slice(0, 8)}… (${registry.production.includes(fp) ? "production" : registry.qa.includes(fp) ? "qa" : "unregistered"})`
    : "invalid";
  const hosts = hostList(env.hosts);
  if (!hosts.length) return [`PostHog: off on every host (no enabled hosts; key ${label})`];
  return hosts.map((h) => {
    const v = evaluateConfig(env, h, dev, registry);
    return `PostHog ${h}: ${v.config ? "ON" : `off (${v.reason})`}; key ${label}`;
  });
}
