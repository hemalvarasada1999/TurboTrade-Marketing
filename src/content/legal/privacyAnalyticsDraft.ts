/* ══════════════ DRAFT — NOT PUBLISHED — REQUIRES OWNER AND LEGAL APPROVAL ══════════════
   Proposed replacement for Privacy Policy section 7 "Cookies and tracking"
   (pages.ts, id "cookies-and-tracking") describing PostHog analytics.

   Nothing imports this module (enforced by privacyAnalyticsDraft.test.ts), so
   it cannot reach the live site. To publish after approval: resolve every
   [CONFIRM …] marker, replace the `html` of the "cookies-and-tracking" section
   in pages.ts with DRAFT_COOKIES_AND_TRACKING_HTML, update the "Last updated"
   chip, and delete this file and its test.

   Review notes for legal are in
   docs/analytics/posthog-privacy-disclosure-draft.md (open questions,
   section 13 data-location conflict, retention, consent banner wording). */

export const DRAFT_STATUS = "draft-awaiting-owner-and-legal-approval" as const;

export const DRAFT_COOKIES_AND_TRACKING_HTML = `<p>We use cookies and similar technologies (small files or entries stored by your browser) to keep you signed in, remember your preferences (including accessibility settings), keep the Platform secure, measure marketing campaigns and, only if you agree, to understand how our website and app are used.</p>
<h3>7.1 Optional product analytics (PostHog)</h3>
<p>We use <b>PostHog</b>, an analytics service provided by PostHog, Inc., acting as our Data Processor, to understand how visitors use www.turbotrade.ai and app.turbotrade.ai so we can improve them. <b>Analytics are off unless you choose to turn them on.</b> Until you accept, the analytics software is not loaded and no analytics cookie is set.</p>
<p>If you accept, we record:</p>
<ul><li>pages you view (the address without any query string), and buttons you use to sign up, log in or see plans and strategies;</li>
<li>steps and outcomes in sign-up, log-in, plan purchase, strategy activation and broker connection (for example "completed" or "failed", and a general reason category);</li>
<li>use of features such as filters and dashboard panels;</li>
<li>use of the in-app Help Center: which help articles you open, that you opened the explanation for a screen, and for a help search only the length of what you typed and the number of results (never the words you typed);</li>
<li>your browser, operating system and device type (for example "Chrome", "Android", "Mobile"); we do not keep the full browser identification string;</li>
<li>how you reached us: the campaign, source and medium in the link you followed, a partner or influencer code if the link contained one, and the website that referred you.</li></ul>
<p>Before you sign in you are identified only by a random identifier stored in your browser. When you sign in or create an account, your analytics are linked to a pseudonymous identifier derived from your account on our servers; it is not your name, email address or phone number.</p>
<div class="note"><b>Never sent to analytics</b>Passwords, OTPs, PINs, broker login credentials or broker session/access tokens, payment card, UPI or bank details, PAN or Aadhaar numbers, the contents of forms you fill in, or recordings of your screen. We do not use PostHog for advertising.</div>
<h3>7.2 Campaign attribution</h3>
<p>If you accept analytics, we remember for up to 90 days the first campaign or referral that brought you to TurboTrade (<b>first touch</b>) and the most recent one (<b>last touch</b>). When you create an account, the first touch and the last touch before sign-up are recorded once on your analytics profile, so we can tell which campaigns and partners lead to sign-ups. Influencer and partner codes are short identifiers; their names and any payments to them are kept outside the analytics service.</p>
<h3>7.3 Cookies and storage we use for analytics</h3>
<div class="tbl" role="region" tabindex="0" aria-label="Analytics cookies"><table><caption>Analytics cookies and browser storage</caption><thead><tr><th scope="col">Name</th><th scope="col">Purpose</th><th scope="col">Duration</th></tr></thead><tbody>
<tr><td><code>tt_an_consent</code></td><td>Remembers whether you accepted or declined analytics, on both www.turbotrade.ai and app.turbotrade.ai. Set only when you choose.</td><td>365 days</td></tr>
<tr><td><code>tt_attr</code></td><td>First-touch and last-touch campaign information described in 7.2. Set only after you accept.</td><td>90 days</td></tr>
<tr><td><code>ph_…_posthog</code> (cookie and browser storage)</td><td>PostHog's random identifier and session information, shared by our website and app. Set only after you accept.</td><td>Up to 90 days</td></tr>
<tr><td><code>tt_ph_…</code> (browser storage)</td><td>Technical state for analytics: when you were last active (to group visits into 30-minute sessions) and, during sign-up, linking your visit to your new account.</td><td>Session timing: until analytics is turned off; sign-up linking: until the tab is closed (used for at most 30 minutes)</td></tr>
</tbody></table></div>
<h3>7.4 Your choices</h3>
<ul><li>You can accept or decline analytics in the analytics notice, and change your choice at any time with <b>Analytics preferences</b> in the website footer, on the app's sign-in pages, or on your Account page.</li>
<li>If you turn analytics off, collection stops and the analytics cookies and storage listed above are deleted from that site. Data already collected is kept as described in 7.5; you can ask us to delete it by writing to <a href="mailto:{{EMAIL}}">{{EMAIL}}</a>.</li>
<li>If your browser sends a <b>Global Privacy Control</b> signal, we treat it as a refusal and analytics stay off.</li></ul>
<h3>7.5 Where analytics data is processed and how long it is kept</h3>
<p>Analytics data is processed by PostHog in [CONFIRM: the European Union (PostHog EU Cloud) — verify the production project's region before publishing]. [CONFIRM after the production project settings are applied and verified: PostHog is configured not to store your IP address and not to derive your location from it.] Analytics events are kept for [CONFIRM: retention period, matching the PostHog plan and project setting] and are then deleted.</p>
<h3>7.6 Advertising measurement</h3>
<p>Our website also uses advertising pixels, such as Meta Pixel, to measure marketing campaigns. This is separate from the analytics choice above.</p>
<p>You can also block or delete cookies in your browser settings. Essential cookies are needed for login and security; blocking them may break parts of the Platform.</p>`;

/* ── Companion changes for owner/legal review (also unpublished) ──
   Exact proposed wording for the other places the combined Help Center +
   PostHog release touches. Apply together with the section above. */

/* Section 6 "Who we share data with": replace the line
   "customer support, ticketing, analytics and security-monitoring tools;" with: */
export const DRAFT_SECTION_6_ANALYTICS_LINE_HTML = `<li>customer support, ticketing and security-monitoring tools, and, only if you accept analytics, our product-analytics provider PostHog, Inc. (see section 7);</li>`;

/* Section 13 "Where your data is stored": append this paragraph. It reconciles
   the India-first statement with PostHog's processing location. */
export const DRAFT_SECTION_13_ADDITION_HTML = `<p>If you accept optional analytics, analytics data described in section 7 is processed by PostHog in [CONFIRM: the European Union (PostHog EU Cloud) — verify the production project's region], outside India. This transfer happens only with your consent, under contractual and security safeguards, and as permitted by Indian law. Declining analytics, or a Global Privacy Control signal, prevents it.</p>`;

/* Consent notice (both sites: TurboTrade-Marketing src/lib/consentCopy.ts and
   turbotrade-ui lib/analytics/posthog/copy.ts), with a link to /privacy. */
export const DRAFT_CONSENT_BODY =
  "We'd like to use optional analytics to understand how our website and app are used, " +
  "including which campaign or partner link brought you here. Nothing is collected unless you accept. " +
  "You can change your choice at any time in Analytics preferences.";
export const DRAFT_CONSENT_POLICY_LINK_TEXT = "Privacy Policy";

