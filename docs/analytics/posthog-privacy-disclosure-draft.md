# PostHog privacy disclosure — DRAFT for owner and legal review (Batch P2)

Date: 2026-11-16. Status: **DRAFT. Not published. Requires owner and legal/privacy approval before any of it goes live.** Not legal advice.

The proposed policy text is in `src/content/legal/privacyAnalyticsDraft.ts`. Nothing imports it, and `privacyAnalyticsDraft.test.ts` fails if anything does or if the live policy (`src/content/legal/pages.ts`) gains PostHog wording before it is deliberately published.

## 1. What the draft covers

It replaces section 7 "Cookies and tracking" of the Privacy Policy. Today that section names only Meta Pixel. The draft covers:

| Required topic | Where in the draft |
|---|---|
| PostHog as the analytics provider (Data Processor) | 7.1 |
| Opt-in analytics; nothing loads before consent | 7.1 |
| General event categories | 7.1 list |
| Device data limited to parsed browser, OS and device type; no full user-agent string | 7.1 list (matches the P2 code change) |
| Campaign attribution, influencer and partner identifiers | 7.1 list, 7.2 |
| First touch and sign-up last touch | 7.2 |
| Cookies and storage, purpose and duration | 7.3 table |
| Pseudonymous, server-derived identifier (not name, email or phone) | 7.1 |
| No passwords, OTPs, broker credentials or tokens, card, UPI or bank details, PAN or Aadhaar, form contents, recordings | 7.1 note |
| GPC respected; how to withdraw; what withdrawal deletes | 7.4 |
| Processing region | 7.5, **[CONFIRM]** |
| IP address and location | 7.5, **[CONFIRM]**, worded conditionally |
| Retention | 7.5, **[CONFIRM]** |
| Meta Pixel kept as a separate disclosure | 7.6 |

## 2. Facts the text relies on (verified in code, 2026-11-16)

| Statement | Evidence |
|---|---|
| Off until accepted; SDK not loaded before | `src/lib/posthog.ts` `start()`; turbotrade-ui `lib/analytics/posthog/client.ts` `start()`; tests "11. absent and denied", "no consent, no SDK, no network" |
| `tt_an_consent` 365 days, both sites | `src/lib/analyticsConsent.ts` `CONSENT_MAX_AGE`, `cookieDomain` |
| `tt_attr` 90 days, first + last touch | `src/lib/attribution.ts` `ATTR_WINDOW_SECONDS`, `mergeTouch` |
| PostHog cookie up to 90 days, shared across subdomains | `buildSdkConfig`: `cookie_expiration: 90`, `cross_subdomain_cookie` |
| `tt_ph_last` (localStorage), `tt_ph_uid` / `tt_ph_merge` (sessionStorage, 30-minute merge window) | `posthog.ts` `LAST_ACTIVITY_KEY`; ui `identity.ts` `ID_CACHE_KEY`, `MERGE_KEY`, `MERGE_TTL_MS` |
| Withdrawal deletes those cookies and storage on that site | `stop()` → `clearPosthogStorage()`, `clearAttribution()` |
| GPC = refusal | `getAnalyticsConsent()` in both repos; identity route checks `sec-gpc` |
| No full user agent | P2: `USER_AGENT_KEY` drop in both `before_send` filters, with tests |
| URLs without query strings | `stripUrl` in both filters |
| Server-derived pseudonymous id | ui `identity.server.ts` (HMAC with `POSTHOG_ID_SECRET`) |
| Preference controls | MK footer "Analytics preferences"; app sign-in footer (`AuthShell`) and Account page (`AnalyticsPreferencesSection`) |

## 3. Open items for the owner and legal reviewer

1. **[CONFIRM] Processing region.** The QA project 348159 is on PostHog EU Cloud (`eu.i.posthog.com`). The region of the production project 338008 was **not checked** (this batch did not access it).
2. **Conflict with section 13 "Where your data is stored".** That section says data is stored in India wherever possible. EU processing by PostHog is a cross-border transfer and should be named there or in section 6 (sharing: "analytics tools" is already listed).
3. **[CONFIRM] IP and location.** Publish "PostHog is configured not to store your IP address and not to derive your location" only after the owner has, in production project 338008, turned on "Discard client IP data" and disabled the GeoIP transformation, and verified both with the D9.9.8 sentinel tile. Until then, delete that sentence rather than publish it.
4. **[CONFIRM] Retention.** Set to the PostHog plan's event retention, or a shorter period if a deletion process exists.
5. **Deletion requests.** The draft offers deletion by email. The owner needs a procedure: delete the person in PostHog by the `u_…` id, which support can derive server-side.
6. **Section 4 "Why we use your data"**: the row "Improving Platform reliability and features — Consent where required" fits. Consider naming PostHog analytics in it.
7. **"Last updated" chip** in the policy must change on publication.

## 4. Consent notice wording (review together with the policy)

Both copy files are still marked PROPOSED (`src/lib/consentCopy.ts`; ui `lib/analytics/posthog/copy.ts`). They are consistent in substance (opt-in, accept/decline with equal weight, change later, GPC message). Two small differences remain: MK "understand website visits" vs app "understand how TurboTrade is used", and the app has separate on/off/unset status lines. Neither mentions campaign attribution or links to the policy. **Proposed aligned body (not applied to source):**

> We'd like to use optional analytics to understand how our website and app are used, including which campaign or partner link brought you here. Nothing is collected unless you accept. You can change your choice at any time in Analytics preferences. [Privacy Policy]

Applying it needs a link element in both consent components and a copy test update. Do this together with publishing the policy.

## 5. Do Not Track: decision required

- **Current behaviour (both sites):** DNT is not read. GPC is honoured as a refusal.
- **Recommendation:** keep it as it is, and say so in the policy. Analytics is already opt-in, so a DNT user is never tracked without an explicit click. DNT is deprecated (Safari removed it in 2019; the DPDP Act does not refer to it — legal to confirm), and treating it as a hard refusal would also block users who explicitly accept. GPC remains the recognised automatic signal.
- **Alternative if the reviewer prefers:** treat DNT like GPC (hard refusal), or let DNT only suppress the automatic prompt while keeping "Analytics preferences" available. Either is a change to the shared consent contract (`analyticsConsent.ts` and ui `consent.ts` must change together) and needs regression tests in both repos. Not implemented in P2 because it changes the consent UX under legal review.

## 6. Publishing checklist (after approval)

1. Resolve every `[CONFIRM …]` marker; remove sentences that cannot be confirmed.
2. Replace `html` of `cookies-and-tracking` in `src/content/legal/pages.ts` with the approved text; update the "Last updated" chip; reconcile section 13.
3. Delete `privacyAnalyticsDraft.ts` and its test.
4. Apply the approved consent copy in both repos (section 4).
5. Publish the policy **before or with** the first production analytics build.
