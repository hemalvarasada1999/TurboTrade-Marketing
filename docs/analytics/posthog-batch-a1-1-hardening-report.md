# PostHog Batch A1.1: Marketing Analytics Hardening Report

Repo: `TurboTrade-Marketing`, branch `feat/posthog-analytics` (base HEAD `3c59512`, nothing committed, nothing pushed).
PostHog is **disabled by default**. `VITE_POSTHOG_ALLOW_PRODUCTION` is unset. No event was sent to project 338008; all ingestion in tests is mocked.

## 1. Changes made

- **Consent UX:** `AnalyticsConsent.tsx`, `AnalyticsPreferencesLink.tsx`, `consentCopy.ts`, `styles/consent.css`. A footer entry "Analytics preferences" is always available (`Footer.tsx`, +2 lines).
- **Consent contract:** `analyticsConsent.ts` rewritten (see section 3).
- **Landing semantics:** `posthog.ts` now implements a 30-minute inactivity session for `is_landing` (see section 5).
- **Privacy filter hardening:** `before_send` sanitiser strips URL-like properties to origin + path, drops campaign and click-id keys, allows only `$pageview` and `marketing_cta_clicked`. `request_batching: false` plus opt-out and reset on withdrawal, so no queued event is delivered after withdrawal.
- **CTA tracking:** Plans links now tracked for PostHog only; Meta events unchanged.
- **Tooling:** Vitest config and test setup; `package.json` and `pnpm-lock.yaml` synced (+781 / 0 removals). `package-lock.json` is unchanged from main. `metaPixel.ts` unchanged.
- **Tests:** 80 across 7 files.
- `.env.example` documents the PostHog variables (all off by default).

## 2. Consent UX and preference controls

- Non-modal card anchored bottom-left (full-width on mobile). No focus trap, no scroll lock, no backdrop. Page remains usable without a choice.
- Heading "Help us improve TurboTrade"; body "We use optional analytics to understand website visits and improve our services. You can accept or decline analytics and change your choice later."; buttons "Accept analytics" / "Decline". Equal visual weight, nothing preselected.
- **Wording is a proposal pending product/privacy review.**
- Built from site tokens; works with the accessibility toolbar themes (dark, contrast, warm). Reduced-motion respected; safe-area insets applied.
- Buttons at least 44 px high; keyboard reachable; labelled region (`role="region"`, not a dialog). Focus moves to the card only when reopened from the footer, and returns to the footer link after a choice.
- The card is not shown when GPC is on or when a choice is already stored; the footer entry reopens it so the choice can be changed or withdrawn.
- Meta Pixel consent (`tt_ad_consent`) is untouched and never authorises PostHog; analytics consent is never inferred from it.
- No SDK is loaded and no attribution or PostHog cookie is written before an explicit "Accept analytics".

## 3. Final shared consent contract (for later use in turbotrade-ui)

| Item | Value |
|---|---|
| Name | `tt_an_consent` |
| Values | exactly `granted` or `denied`; anything else or absent = unset (treated as no consent) |
| Domain | `.turbotrade.ai` on turbotrade.ai and `*.turbotrade.ai`; host-only elsewhere |
| Path | `/` |
| Max-Age | 31536000 (365 days) |
| SameSite | Lax |
| Secure | on https |
| HttpOnly | no (read by JS) |
| Written | only from an explicit visitor action |
| Withdrawal | writes `denied` with the same attributes, then clears `tt_attr` and PostHog cookies/storage (`ph_*`, `__ph*`, `tt_ph_*`) |
| GPC | `navigator.globalPrivacyControl === true` = denied; never overwritten by the banner |
| Multi-tab | cookie re-checked per event and on `visibilitychange` / `pageshow` |

Attribution cookie `tt_attr` v1: first touch (`ft`, write-once) and last eligible touch (`lt`), 90 days, at most 800 chars, allowlisted tokens only, written only after consent.

Tested: accept, decline, reopen, withdraw, refresh, new tab, expired preference (re-prompts), GPC, disabled build.

## 4. Package-manager and lockfile verification

- `pnpm-lock.yaml` is the in-sync lockfile: `pnpm install --frozen-lockfile` passes on the feature branch; on `main`, `npm ci` fails and the pnpm install passes. Evidence points to pnpm.
- `package-lock.json` and `bun.lockb` are untouched. Unrelated dependencies preserved (lockfile diff has no removals).
- **Not verifiable from the repo:** what Vercel auto-detects. Please confirm the Install Command / detected manager in the Vercel project settings.
- Clean install and build were verified from a scratch copy of the real feature-branch files.

## 5. Landing-page attribution test results

All pass (attribution tests 1-10 plus extras, landing and regression suites):

- Tagged Instagram influencer, Facebook, YouTube; untagged direct; organic; unknown referral (`referral_unknown`, separate from direct); own-site referrer ignored.
- Click ids are hints only: the value is never read or stored; click-id-only visits are `referral` / `click_id`.
- Malicious or invalid tags are dropped. No social referrer is fabricated into an influencer id; an untagged social referrer is a platform at best.
- Strict first touch (write-once) and last eligible touch; direct does not replace a better last touch; 90-day expiry.
- UTMs are snapshotted in `main.tsx` before the Meta Pixel initialises (Meta strips non-campaign params, including `tt_inf` and `tt_plc`, from the address bar).
- First pageview fires once; SPA routes counted once; no duplicates; refresh and new tab; late consent; withdrawal.

**`is_landing` definition:** the first pageview of a 30-minute inactivity session, with the clock in localStorage (`tt_ph_last`), shared across tabs. A reload or second tab within 30 minutes is not a landing. A tab left idle past 30 minutes starts a new session on its next navigation. Late consent: only the page that was entered on counts as landing, always with `consent_delayed`. Withdrawal clears the clock.
Differences from PostHog sessions: PostHog caps a session at 24 hours and also counts uncaptured activity, so `is_landing` and PostHog session boundaries will not always coincide.

## 6. SDK privacy checks

- posthog-js 1.447.14. Off: autocapture, pageview/pageleave auto-capture, heatmaps, dead clicks, performance, exceptions, session recording, surveys, product tours, conversations, web experiments, flags, external dependency loading.
- `person_profiles: identified_only`, `ip: false`, `save_referrer: false`, `request_batching: false`.
- `before_send` allows only `$pageview` and `marketing_cta_clicked`; URL-like properties cut to origin + path; campaign and click-id keys dropped; identifiers (`token`, `distinct_id`, attribution `ft_*`/`lt_*`) preserved; `$set` / `$set_once` sanitised.
- No form values, link text or hrefs are sent. No network requests when disabled or denied; withdrawal leaves zero requests.
- Note: posthog-js drops events from headless browsers; the smoke harness spoofs bot signals only.

## 7. Tests, build and responsive results

- Vitest: **80/80 passed** (7 files). `tsc --noEmit`: 0 errors. ESLint: 0 errors, 8 warnings (pre-existing react-refresh warnings). `vite build`: passes; main bundle 474.28 kB (150.42 kB gzip), CSS 158.18 kB (29.69 kB gzip).
- **Smoke checks (headless Chromium, built output):** 24/24 rows (320, 390, 768, 1024, 1440, 1920 x light and dark/a11y themes) pass: card in viewport, not hidden, no horizontal overflow, page scrollable, no scroll lock. Min button 44 px tall, min contrast 11.56. Keyboard access, focus return and reduced motion exercised.
- Known: at 320 px two hero CTAs are overlapped by the card until a choice is made (content remains scrollable; card is dismissible). The `.btn-y` contrast issue in dark/warm/contrast themes is pre-existing.
- **Not done:** Lighthouse, real devices, Safari, Firefox, real safe-area insets, LCP re-run after the A1.1 CSS changes. These are not covered by the smoke checks above.
- Git-ignored QA output remains in `dist/qa-on`, `dist/qa-off`; the sandbox could not delete it. Safe to remove (`rm -rf dist/qa-* dist/smoke-*`).

## 8. Unresolved privacy-review requirements

1. Approve or replace the consent copy and the "Analytics preferences" label; privacy policy and cookie list must name `tt_an_consent`, `tt_attr` and PostHog cookies/storage.
2. Confirm 12-month consent duration and 90-day attribution window with privacy counsel.
3. Confirm the legal basis for a pageview without any cookies for non-consenting visitors (currently: none sent).
4. Decide whether `.turbotrade.ai` domain-wide consent is acceptable and how turbotrade-ui reads it.
5. Confirm EU-region host and data-processing terms for project 338008 (Free plan).
6. Decide production hosts and the explicit `VITE_POSTHOG_ALLOW_PRODUCTION` activation; requires product-owner authorization together with the Help Center and Product Tour release.
7. Dev-only console `grant()` helper writes only the consent cookie; confirm it is excluded or acceptable in production builds.

## 9. Readiness for Batch B

Marketing side is ready, subject to items in section 8 and: run `pnpm install` locally (repo `node_modules` was not refreshed), confirm the Vercel package manager, and run Lighthouse plus real-device checks. turbotrade-ui is unchanged apart from `docs/analytics/`. Batch B has **not** been started.
