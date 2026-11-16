import { useCallback, useEffect, useRef, useState } from "react";
import {
  OPEN_PREFERENCES_EVENT,
  getAnalyticsConsent,
  setAnalyticsConsent,
  type AnalyticsConsent as ConsentState,
} from "@/lib/analyticsConsent";
import { isPosthogConfigured } from "@/lib/posthog";
import { CONSENT_COPY } from "@/lib/consentCopy";
import "@/styles/consent.css";

type Panel = "closed" | "prompt" | "manage";

/* Non-modal preference card (PostHog analytics, opt-in).
   - Shows by itself only when analytics is configured for this host AND the
     visitor has not chosen yet AND the browser sends no Global Privacy Control.
     While the feature is disabled it renders nothing at all.
   - Can be reopened at any time (footer "Analytics preferences", or
     window.turbotradeAnalyticsConsent.open()) to accept, decline or withdraw.
   - Never pre-selects, never blocks the page, never traps focus, and only a
     click on a button records a choice. Escape closes it without choosing.
   - Independent of the Meta Pixel preference. */
const AnalyticsConsent = () => {
  const configured = isPosthogConfigured();
  const [panel, setPanel] = useState<Panel>(() =>
    configured && getAnalyticsConsent() === "unset" ? "prompt" : "closed",
  );
  const [announce, setAnnounce] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!configured) return;
    const open = () => {
      opener.current = document.activeElement as HTMLElement | null;
      setPanel(getAnalyticsConsent() === "unset" ? "prompt" : "manage");
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, open);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, open);
  }, [configured]);

  /* Move focus into the card only when the visitor asked for it (reopened);
     the first-visit prompt never steals focus. */
  useEffect(() => {
    if (panel !== "closed" && opener.current) heading.current?.focus();
  }, [panel]);

  const close = useCallback((saved: boolean) => {
    setPanel("closed");
    if (saved) setAnnounce(CONSENT_COPY.saved);
    const back = opener.current;
    opener.current = null;
    if (back && document.contains(back)) back.focus();
  }, []);

  useEffect(() => {
    if (panel === "closed") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panel, close]);

  if (!configured) return null;

  const state: ConsentState = getAnalyticsConsent();
  const gpc = typeof navigator !== "undefined" && navigator.globalPrivacyControl === true;

  return (
    <>
      <div className="tt-sr-only" role="status" aria-live="polite">
        {announce}
      </div>
      {panel !== "closed" && (
        <section
          className="tt-consent"
          role="region"
          aria-labelledby="tt-consent-title"
          aria-describedby="tt-consent-body"
          data-testid="analytics-consent"
        >
          <h2 id="tt-consent-title" ref={heading} tabIndex={-1}>
            {gpc ? CONSENT_COPY.gpcTitle : panel === "manage" && state === "granted" ? CONSENT_COPY.onTitle : CONSENT_COPY.title}
          </h2>
          <p id="tt-consent-body">
            {gpc ? CONSENT_COPY.gpcBody : panel === "manage" && state === "granted" ? CONSENT_COPY.onBody : CONSENT_COPY.body}{" "}
            <a href="/privacy">{CONSENT_COPY.policyLink}</a>
          </p>
          <div className="tt-consent-actions">
            {gpc ? (
              <button type="button" className="btn btn-o" onClick={() => close(false)}>
                {CONSENT_COPY.close}
              </button>
            ) : panel === "manage" && state === "granted" ? (
              <>
                <button
                  type="button"
                  className="btn btn-o"
                  onClick={() => {
                    setAnalyticsConsent(false);
                    close(true);
                  }}
                >
                  {CONSENT_COPY.turnOff}
                </button>
                <button type="button" className="btn btn-o" onClick={() => close(false)}>
                  {CONSENT_COPY.close}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-o"
                  onClick={() => {
                    setAnalyticsConsent(true);
                    close(true);
                  }}
                >
                  {CONSENT_COPY.accept}
                </button>
                <button
                  type="button"
                  className="btn btn-o"
                  onClick={() => {
                    setAnalyticsConsent(false);
                    close(true);
                  }}
                >
                  {CONSENT_COPY.decline}
                </button>
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default AnalyticsConsent;
