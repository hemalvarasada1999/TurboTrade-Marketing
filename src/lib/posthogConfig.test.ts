import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import {
  APPROVED_KEY_FINGERPRINTS,
  describeBuild,
  evaluateConfig,
  keyFingerprint,
} from "@/lib/posthogConfig";
import { readConfig } from "@/lib/posthog";

/* P2: a project key is bound to its environment. Fake keys only; the real
   registry holds the QA fingerprint and (until the deployment gate) no
   production fingerprint. */
const PROD_KEY = "phc_prodprodprodprodprod";
const QA_KEY = "phc_qaqaqaqaqaqaqaqaqa";
const REGISTRY = { production: [keyFingerprint(PROD_KEY)], qa: [keyFingerprint(QA_KEY)] };
const CLOUD = "https://eu.i.posthog.com";

const prodEnv = { enabled: "true", host: CLOUD, hosts: "turbotrade.ai,www.turbotrade.ai", allowProduction: "true" };
const qaEnv = { enabled: "true", host: CLOUD, hosts: "localhost,turbotrade-git-qa.vercel.app" };

describe("key fingerprints", () => {
  it("are the SHA-256 hex of the key, as `shasum -a 256` prints it", () => {
    expect(keyFingerprint(QA_KEY)).toBe(createHash("sha256").update(QA_KEY).digest("hex"));
    expect(keyFingerprint("")).toBe(createHash("sha256").update("").digest("hex"));
    const long = "phc_" + "x".repeat(200);
    expect(keyFingerprint(long)).toBe(createHash("sha256").update(long).digest("hex"));
  });

  it("the registry holds well-formed fingerprints, no key, and no fingerprint in both lists", () => {
    const all = [...APPROVED_KEY_FINGERPRINTS.production, ...APPROVED_KEY_FINGERPRINTS.qa];
    for (const fp of all) expect(fp).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(APPROVED_KEY_FINGERPRINTS)).not.toMatch(/phc_/);
    expect(APPROVED_KEY_FINGERPRINTS.production.filter((fp) => APPROVED_KEY_FINGERPRINTS.qa.includes(fp))).toEqual([]);
  });

  it("matches turbotrade-ui: the registered QA fingerprint is project 348159's verified key (C1-H2)", () => {
    expect(APPROVED_KEY_FINGERPRINTS.qa).toEqual(["02237710e53d12e1fe4accbd6babccb78c9c10861ecc391cf010299e8f00d96d"]);
  });

  it("matches turbotrade-ui: registers exactly the owner-supplied production fingerprint (project 338008), distinct from QA", () => {
    expect(APPROVED_KEY_FINGERPRINTS.production).toEqual(["9af7395ca1b204da70d7228bd83d5f91cafd3913eb2f6c780f6d3a7a2504f6ce"]);
    expect(APPROVED_KEY_FINGERPRINTS.production[0]).toMatch(/^[0-9a-f]{64}$/);
    expect(APPROVED_KEY_FINGERPRINTS.qa).not.toContain(APPROVED_KEY_FINGERPRINTS.production[0]);
  });

  it("a key that is not the registered production key still cannot switch production on", () => {
    for (const host of ["turbotrade.ai", "www.turbotrade.ai"]) {
      expect(evaluateConfig({ ...prodEnv, key: PROD_KEY }, host)).toEqual({ config: null, reason: "key-not-approved-for-production" });
    }
  });
});

describe("production hostnames never ingest into the QA project", () => {
  it.each(["turbotrade.ai", "www.turbotrade.ai"])("%s accepts only a production key", (host) => {
    expect(evaluateConfig({ ...prodEnv, key: PROD_KEY }, host, false, REGISTRY).reason).toBe("ok");
    expect(evaluateConfig({ ...prodEnv, key: QA_KEY }, host, false, REGISTRY)).toEqual({
      config: null,
      reason: "key-not-approved-for-production",
    });
    expect(evaluateConfig({ ...prodEnv, key: "phc_unknownunknownunknown" }, host, false, REGISTRY).config).toBeNull();
  });

  it("still needs the explicit production flag with an approved key", () => {
    expect(evaluateConfig({ ...prodEnv, allowProduction: undefined, key: PROD_KEY }, "www.turbotrade.ai", false, REGISTRY).reason).toBe("production-not-allowed");
  });

  it("a fingerprint listed in both environments is refused everywhere", () => {
    const both = { production: REGISTRY.production, qa: [...REGISTRY.qa, ...REGISTRY.production] };
    expect(evaluateConfig({ ...prodEnv, key: PROD_KEY }, "www.turbotrade.ai", false, both).config).toBeNull();
    expect(evaluateConfig({ ...qaEnv, key: PROD_KEY }, "localhost", false, both).config).toBeNull();
  });
});

describe("the QA harness and previews never ingest into the production project", () => {
  it("accepts only a QA key on localhost and preview hosts", () => {
    expect(evaluateConfig({ ...qaEnv, key: QA_KEY }, "localhost", false, REGISTRY).reason).toBe("ok");
    expect(evaluateConfig({ ...qaEnv, key: QA_KEY }, "turbotrade-git-qa.vercel.app", false, REGISTRY).reason).toBe("ok");
    expect(evaluateConfig({ ...qaEnv, key: PROD_KEY }, "turbotrade-git-qa.vercel.app", false, REGISTRY)).toEqual({
      config: null,
      reason: "key-not-approved-for-qa",
    });
    expect(evaluateConfig({ ...qaEnv, key: "phc_unknownunknownunknown" }, "localhost", false, REGISTRY).config).toBeNull();
  });

  it("a local stub ingestion host reaches no project and needs no registered key", () => {
    const stub = { enabled: "true", host: "http://localhost:9999", hosts: "localhost", key: "phc_testtesttesttest" };
    expect(evaluateConfig(stub, "localhost", false, REGISTRY).reason).toBe("ok");
    expect(evaluateConfig(stub, "localhost", true, REGISTRY).reason).toBe("ok");
  });
});

describe("missing or inconsistent values keep analytics off", () => {
  it.each([
    [{}, "flag-off"],
    [{ ...qaEnv, enabled: "TRUE", key: QA_KEY }, "flag-off"],
    [{ ...qaEnv, key: "" }, "invalid-key"],
    [{ ...qaEnv, key: "phx_personalpersonalkey" }, "invalid-key"],
    [{ ...qaEnv, key: QA_KEY, host: "" }, "invalid-ingestion-host"],
    [{ ...qaEnv, key: QA_KEY, host: "http://eu.i.posthog.com" }, "invalid-ingestion-host"],
    [{ ...qaEnv, key: QA_KEY, hosts: "" }, "host-not-allowed"],
  ] as const)("%j → %s", (env, reason) => {
    expect(evaluateConfig(env, "localhost", false, REGISTRY)).toEqual({ config: null, reason });
  });

  it("`vite dev` refuses a real ingestion host even with an approved key", () => {
    expect(evaluateConfig({ ...qaEnv, key: QA_KEY }, "localhost", true, REGISTRY).reason).toBe("dev-needs-local-stub");
  });

  it("posthog.ts readConfig applies the same rules to import.meta.env", () => {
    vi.stubEnv("VITE_POSTHOG_ENABLED", "true");
    vi.stubEnv("VITE_POSTHOG_KEY", "phc_testtesttesttest");
    vi.stubEnv("VITE_POSTHOG_HOST", "http://localhost:9999");
    vi.stubEnv("VITE_POSTHOG_ENABLED_HOSTS", "localhost,www.turbotrade.ai");
    vi.stubEnv("VITE_POSTHOG_ALLOW_PRODUCTION", "true");
    expect(readConfig("localhost")).toEqual({ key: "phc_testtesttesttest", host: "http://localhost:9999" });
    vi.stubEnv("VITE_POSTHOG_HOST", CLOUD);
    expect(readConfig("www.turbotrade.ai")).toBeNull(); // unregistered key, and vitest is a dev build
    vi.unstubAllEnvs();
  });
});

describe("build-time preflight (vite.config.ts)", () => {
  it("reports each host's verdict without printing the key", () => {
    const lines = describeBuild({ ...prodEnv, hosts: "www.turbotrade.ai,localhost", key: QA_KEY }, false, REGISTRY);
    const fp = keyFingerprint(QA_KEY).slice(0, 8);
    expect(lines).toEqual([
      `PostHog www.turbotrade.ai: off (key-not-approved-for-production); key ${fp}… (qa)`,
      `PostHog localhost: ON; key ${fp}… (qa)`,
    ]);
    expect(lines.join("\n")).not.toContain(QA_KEY);
  });

  it("says plainly when the build is off", () => {
    expect(describeBuild({ enabled: "false", key: QA_KEY })).toEqual(["PostHog: off (flag-off)"]);
    expect(describeBuild({ enabled: "true", key: QA_KEY, host: CLOUD }, false, REGISTRY)).toEqual([
      `PostHog: off on every host (no enabled hosts; key ${keyFingerprint(QA_KEY).slice(0, 8)}… (qa))`,
    ]);
  });
});
