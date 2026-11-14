import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import { CONSENT_COPY } from "@/lib/consentCopy";
import AnalyticsPreferencesLink from "@/components/AnalyticsPreferencesLink";
import { getAnalyticsConsent, resetConsentSyncForTests, setAnalyticsConsent } from "@/lib/analyticsConsent";
import { initPosthog, resetPosthogForTests } from "@/lib/posthog";
import { configure, mockTransport, setGpc, tick } from "@/test/helpers";

vi.mock("posthog-js", () => ({ default: { init: vi.fn(), capture: vi.fn(), reset: vi.fn() } }));

function Page() {
  return (
    <>
      <button>before</button>
      <ul>
        <AnalyticsPreferencesLink />
      </ul>
      <AnalyticsConsent />
    </>
  );
}

beforeEach(() => {
  resetPosthogForTests();
  resetConsentSyncForTests();
});
afterEach(() => resetPosthogForTests());

describe("consent card", () => {
  it("renders nothing, and no footer entry, while analytics is disabled", () => {
    render(<Page />);
    expect(screen.queryByTestId("analytics-consent")).toBeNull();
    expect(screen.queryByText("Analytics preferences")).toBeNull();
  });

  it("first visit: shows the proposed copy, nothing preselected, no focus stolen, not a modal", () => {
    configure();
    render(<Page />);
    const card = screen.getByTestId("analytics-consent");
    expect(card).toHaveAccessibleName(CONSENT_COPY.title);
    expect(card.getAttribute("role")).toBe("region");
    expect(card.getAttribute("aria-modal")).toBeNull();
    expect(screen.getByText(CONSENT_COPY.body)).toBeTruthy();
    expect(card.querySelectorAll("input[type=checkbox]:checked, input[type=radio]:checked")).toHaveLength(0);
    expect(document.activeElement).toBe(document.body);
    expect(document.body.style.overflow).toBe(""); // no scroll lock
    expect(getAnalyticsConsent()).toBe("unset"); // showing the card records nothing
    expect(document.cookie).not.toMatch(/tt_an_consent|tt_attr|ph_/);
  });

  it("Accept records granted and closes; Decline records denied and closes", () => {
    configure();
    const { unmount } = render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: CONSENT_COPY.accept }));
    expect(getAnalyticsConsent()).toBe("granted");
    expect(screen.queryByTestId("analytics-consent")).toBeNull();
    expect(screen.getByRole("status").textContent).toBe(CONSENT_COPY.saved);
    unmount();

    document.cookie = "tt_an_consent=; Max-Age=0; Path=/";
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: CONSENT_COPY.decline }));
    expect(getAnalyticsConsent()).toBe("denied");
    expect(screen.queryByTestId("analytics-consent")).toBeNull();
  });

  it("does not reappear after a choice, but the footer entry reopens it", () => {
    configure();
    setAnalyticsConsent(false);
    render(<Page />);
    expect(screen.queryByTestId("analytics-consent")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Analytics preferences" }));
    expect(screen.getByTestId("analytics-consent")).toBeTruthy();
    expect(screen.getByRole("button", { name: CONSENT_COPY.accept })).toBeTruthy();
  });

  it("reopened after accepting: offers withdrawal, which writes denied and stops analytics", async () => {
    configure();
    const t = mockTransport();
    setAnalyticsConsent(true);
    initPosthog();
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: "Analytics preferences" }));
    expect(screen.getByText(CONSENT_COPY.onTitle)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: CONSENT_COPY.turnOff }));
    expect(getAnalyticsConsent()).toBe("denied");
    expect(t.reset).toHaveBeenCalled();
    expect(document.cookie).not.toMatch(/tt_attr/);
    await tick();
  });

  it("focus: moves into the card when reopened, Escape closes without choosing and returns focus", () => {
    configure();
    setAnalyticsConsent(false);
    render(<Page />);
    const trigger = screen.getByRole("button", { name: "Analytics preferences" });
    trigger.focus();
    fireEvent.click(trigger);
    expect(document.activeElement).toBe(screen.getByRole("heading", { name: CONSENT_COPY.title }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByTestId("analytics-consent")).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(getAnalyticsConsent()).toBe("denied"); // unchanged
  });

  it("first-visit card closes with Escape for this page only and stores nothing", () => {
    configure();
    render(<Page />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByTestId("analytics-consent")).toBeNull();
    expect(getAnalyticsConsent()).toBe("unset");
  });

  it("Global Privacy Control: no prompt; reopening explains and offers no Accept", () => {
    configure();
    setGpc(true);
    render(<Page />);
    expect(screen.queryByTestId("analytics-consent")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Analytics preferences" }));
    expect(screen.getByText(CONSENT_COPY.gpcBody)).toBeTruthy();
    expect(screen.queryByRole("button", { name: CONSENT_COPY.accept })).toBeNull();
    setGpc(false);
  });

  it("the Meta advertising cookie neither shows nor hides the card", () => {
    configure();
    document.cookie = "tt_ad_consent=granted";
    render(<Page />);
    expect(screen.getByTestId("analytics-consent")).toBeTruthy();
    expect(getAnalyticsConsent()).toBe("unset");
  });
});
