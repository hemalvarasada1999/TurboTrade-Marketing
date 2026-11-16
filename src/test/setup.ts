import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

/* Every test starts from a clean browser state and with analytics unconfigured. */
beforeEach(() => {
  vi.unstubAllEnvs();
  document.cookie.split(";").forEach((c) => {
    const n = c.split("=")[0].trim();
    if (n) document.cookie = `${n}=; Max-Age=0; Path=/`;
  });
  window.localStorage.clear();
  window.sessionStorage.clear();
  Object.defineProperty(navigator, "globalPrivacyControl", { value: undefined, configurable: true });
  window.history.replaceState(null, "", "/");
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});
