import { describe, expect, it } from "vitest";
import { LEGAL_DOCS } from "./pages";

/* The published PostHog disclosure (Privacy Policy sections 6, 7 and 13).
   These guards keep the approved commitments in the live text and stop
   unresolved placeholders or an over-claim about IP handling. */

const privacy = LEGAL_DOCS.privacy;
const html = (id: string) => privacy.sections.find((s: { id: string }) => s.id === id)?.html ?? "";
const text = (id: string) => html(id).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

describe("Privacy Policy: PostHog analytics disclosure", () => {
  it("has no unresolved placeholder or draft marker", () => {
    const all = JSON.stringify(privacy);
    expect(all).not.toMatch(/\[CONFIRM|<PUBLICATION DATE>|draft-awaiting/);
  });

  it("states the approved commitments: opt-in, EU processing, retention, deletion, GPC, Help Center use", () => {
    const s7 = text("cookies-and-tracking");
    expect(s7).toMatch(/PostHog/);
    expect(s7).toMatch(/Analytics are off unless you choose to turn them on/);
    expect(s7).toMatch(/EU Cloud, in the European Union/);
    expect(s7).toMatch(/kept for up to one year and then deleted/);
    expect(s7).toMatch(/verify that you own the account/);
    expect(s7).toMatch(/within 30 days of verifying your request/);
    expect(s7).toMatch(/Global Privacy Control/);
    expect(s7).toMatch(/Help Center/);
    expect(s7).toMatch(/tt_an_consent[\s\S]*365 days/);
    expect(s7).toMatch(/tt_attr[\s\S]*90 days/);
  });

  it("describes IP handling accurately: received in transit, discarded, never 'not collected'", () => {
    const s7 = text("cookies-and-tracking");
    expect(s7).toMatch(/receives your IP address/);
    expect(s7).toMatch(/discard/);
    expect(s7).not.toMatch(/never (receive|collect|process)[^.]*IP|do not (receive|collect|process) your IP/i);
  });

  it("reconciles EU processing with the India data-storage section and names PostHog as a consent-only provider", () => {
    expect(text("where-your-data-is-stored")).toMatch(/processed by PostHog on its EU Cloud, in the European Union, outside India/);
    expect(text("where-your-data-is-stored")).toMatch(/only with your consent/);
    expect(text("who-we-share-data-with")).toMatch(/only if you accept analytics, our product-analytics provider PostHog/);
  });

  it("discloses the username on the analytics profile: consent-only, never name/email/phone, with storage, retention and access", () => {
    const s7 = text("cookies-and-tracking");
    expect(s7).toMatch(/record your TurboTrade username[^.]*on your analytics profile/);
    expect(s7).toMatch(/Your name, email address and phone number are never sent to analytics/);
    expect(s7).toMatch(/This happens only if you have accepted analytics/);
    expect(s7).toMatch(/Global Privacy Control signal, your account is not added to analytics at all/);
    expect(s7).toMatch(/once you sign in, your username\. Set only after you accept; your username is removed from it when you sign out or turn analytics off/);
    expect(s7).toMatch(/profile, which holds your pseudonymous identifier, your username[^.]*kept until you ask us to delete it/);
    expect(s7).toMatch(/access to analytics in PostHog is limited to authorised team members/);
    expect(text("why-we-use-your-data")).toMatch(/Optional product analytics[^]*username[^]*Consent \(optional; you can withdraw it at any time\)/);
  });
});
