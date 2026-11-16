import { vi } from "vitest";
import { setAnalyticsTransport, type AnalyticsTransport } from "@/lib/posthog";

export const KEY = "phc_testtesttesttest";

/* Analytics enabled for localhost with a local stub host. Never a real project. */
export function configure(over: Record<string, string> = {}) {
  vi.stubEnv("VITE_POSTHOG_ENABLED", "true");
  vi.stubEnv("VITE_POSTHOG_KEY", KEY);
  vi.stubEnv("VITE_POSTHOG_HOST", "http://localhost:9999");
  vi.stubEnv("VITE_POSTHOG_ENABLED_HOSTS", "localhost");
  for (const [k, v] of Object.entries(over)) vi.stubEnv(k, v);
}

export function mockTransport() {
  const t = {
    capture: vi.fn(),
    identify: vi.fn(),
    register: vi.fn(),
    reset: vi.fn(),
  } satisfies AnalyticsTransport;
  setAnalyticsTransport(t);
  return t;
}

export const tick = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

export const setGpc = (on: boolean) =>
  Object.defineProperty(navigator, "globalPrivacyControl", { value: on ? true : undefined, configurable: true });

/* Records every string assigned to document.cookie (the Set-Cookie text). */
export function spyCookieWrites(): { writes: string[]; restore: () => void } {
  const desc = Object.getOwnPropertyDescriptor(Document.prototype, "cookie")!;
  const writes: string[] = [];
  Object.defineProperty(document, "cookie", {
    configurable: true,
    get: () => desc.get!.call(document),
    set: (v: string) => {
      writes.push(v);
      desc.set!.call(document, v);
    },
  });
  return { writes, restore: () => delete (document as unknown as Record<string, unknown>).cookie };
}
