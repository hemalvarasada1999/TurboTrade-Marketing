# PostHog Batch A1: Marketing website analytics foundation

Branch `feat/posthog-analytics` (from `main` at `3c59512`), repository `TurboTrade-Marketing`. Date 2026-11-12. **Implemented and validated locally only. Disabled by default. Nothing pushed, merged, deployed or sent to any PostHog project.** Source of truth: the A0 documents in `turbotrade-ui/docs/analytics/`.

## 1. Implementation summary

Marketing now has a consent-gated, typed, fail-silent PostHog layer that sends exactly two events, `$pageview` and `marketing_cta_clicked`, through one wrapper (`safeCapture`). Nothing runs unless the build flag, the host allowlist and the visitor's analytics opt-in (`tt_an_consent`) all pass; until then the SDK is not downloaded and no cookie is written. The Meta Pixel code (`metaPixel.ts`) is untouched. Nothing in `turbotrade-ui` was changed, except one documentation correction (section 12).

## 2. Files

Added: `src/lib/analyticsEvents.ts` (schema, allowlists), `src/lib/analyticsConsent.ts`, `src/lib/attribution.ts`, `src/lib/posthog.ts` (config, transport, `safeCapture`, `usePosthogPageview`), `src/lib/routePath.ts` (the existing `canonicalPath`, moved so two modules can share it), `src/components/AnalyticsConsent.tsx`, `vitest.config.ts`, `src/test/setup.ts`, and three test files (`attribution.test.ts`, `posthog.test.tsx`, `analytics.test.tsx`).
Modified: `src/lib/analytics.ts` (imports `canonicalPath`; CTA listener extended; `useRouteAnalytics` logic unchanged), `src/main.tsx` (snapshot before the Pixel, `initPosthog()` after), `src/App.tsx` (`usePosthogPageview()` and `<AnalyticsConsent />`), `package.json` and `package-lock.json` (`posthog-js` 1.447.12; dev: vitest 2, jsdom, @testing-library/react, jest-dom; scripts `test`, `typecheck`), `.env.example`.
Not modified: `src/lib/metaPixel.ts` (verified by `git diff`), `main`, any `turbotrade-ui` code.

## 3. SDK configuration

Environment: `VITE_POSTHOG_ENABLED` (must be `true`), `VITE_POSTHOG_KEY` (public `phc_` token, never hardcoded), `VITE_POSTHOG_HOST`, `VITE_POSTHOG_ENABLED_HOSTS` (empty = no host), `VITE_POSTHOG_ALLOW_PRODUCTION` (extra opt-in needed on `turbotrade.ai` / `www.turbotrade.ai`; not set in A1). `vite dev` may only target a local stub host, never a real project. A missing or malformed key, host or flag is a silent no-op.

Option names were checked against the installed `PostHogConfig` types (the config object is type-checked by `tsc`). Set: `autocapture`, `capture_pageview`, `capture_pageleave`, `enable_heatmaps`, `capture_heatmaps`, `capture_dead_clicks`, `capture_performance` (network capture), `capture_exceptions` all `false`; `disable_session_recording` (and with it console capture), `disable_surveys`, `disable_product_tours`, `disable_conversations`, `disable_web_experiments`, `advanced_disable_flags`, `disable_external_dependency_loading` all `true`; `person_profiles: identified_only`; `ip: false`; `save_referrer: false`; `cookie_expiration: 90`; `persistence: localStorage+cookie`; cross-subdomain cookie only on `turbotrade.ai`. Web vitals are not enabled by any of these (the default is off). A `before_send` filter is the last line of defence: it drops every event except the two schema events, cuts any URL-like property (`$current_url`, `$referrer`, `$initial_*`, `$session_entry_url`, …) to origin plus path, removes campaign and click-id properties the SDK adds, and keeps only allowlisted custom keys plus the SDK's `token` and `distinct_id`.
The SDK is a separate lazily imported chunk (`module-*.js`), requested only after all gates pass.

## 4. Consent behaviour

`tt_an_consent` (`.turbotrade.ai`, 12 months). Absent, `denied` or Global Privacy Control means off; only an explicit `granted` (and no GPC) allows analytics. The Meta cookie `tt_ad_consent` is never read for this decision (a test proves it). Granting after page load starts the SDK, writes `tt_attr`, and sends one `$pageview` for the current page with `consent_delayed`; nothing earlier is replayed. Withdrawal stops capture, calls SDK `reset()`, deletes `ph_*` and `__ph*` cookies and storage and `tt_attr`, and drops queued events. API: `window.turbotradeAnalyticsConsent.grant() | deny() | status()`.

`AnalyticsConsent.tsx` is a small bottom card using the site's own `btn` styles. It renders **only** when analytics is configured for the host, no choice exists and GPC is off, so it is invisible while the feature is disabled. **Wording is a placeholder awaiting product-owner and privacy review.** There is no permanent "analytics preferences" link yet (it would change the footer design); withdrawal is available only through the API until the owner decides. Intended behaviour: choose once, stored 12 months, change at any time.

## 5. Attribution cookie contract (`tt_attr`, identical in `turbotrade-ui`)

`{"v":1,"ft":Touch,"lt":Touch?}` with `Touch = {s,m,c,ct,t,id,inf,plc,ref,cls,lp,ts}` (source, medium, campaign, content, term, utm id, influencer id, placement id, referrer host, traffic class, landing path, epoch seconds). `.turbotrade.ai`, `Path=/`, `SameSite=Lax`, `Secure` on https, `Max-Age` 90 days, written only after consent, at most 800 characters (long optional fields are trimmed, `lt` dropped last-but-one). Values must match `[a-z0-9_.-]{1,64}` (whitespace becomes `_`); anything else is dropped, never stored. `tt_inf` must match `^inf_[a-z0-9]{3,8}$`, `tt_plc` `^plc_[a-z0-9]{3,10}$`. The snapshot is read in `main.tsx` before the Pixel strips the URL and held in memory until consent.
Rules: `ft` is written once and never replaced inside 90 days (a direct first visit still counts); `lt` is replaced by every eligible visit (not direct; an unmapped referrer only if no better `lt` exists); a record older than 90 days starts over. Event properties `ft_*` and `lt_*` carry the 12 fields (`source`, `medium`, `campaign`, `content`, `term`, `utm_id`, `influencer_id`, `placement_id`, `referrer_host`, `traffic_class`, `landing_path`, `ts`). Classes: `campaign`, `organic`, `referral` (mapped social platform), `referral_unknown` (unmapped host), `direct`.

## 6. Pageview deduplication

`usePosthogPageview` (no first-render skip) calls `onRouteChange(key, canonicalPath)` from an effect on `[location.key, path]`. Nothing is sent without consent; otherwise a pageview is skipped when the path equals the last one sent (StrictMode double effect, remount, re-render, hash or query change, link to the same page, aliased routes). Back and Forward are ordinary path changes. `is_landing` is set only on the entry page and only once per tab session (`sessionStorage`). URL properties are origin plus canonical path; `$referrer` is host only and sent on the first view only. Meta's `useRouteAnalytics` keeps its skip (regression-tested).
Design note: the A0 text also keyed the guard on `location.key`. React Router's initial key is the constant `default`, so the path is the reliable comparison, and the key is used only for the landing flag.

## 7. CTA tracking

The existing delegated listener (installed once, with an idempotence test) now resolves a target from four destinations (signup, login, strategies, **plans**) and sends `marketing_cta_clicked` with `cta_id` (fixed list, else `page`), `cta_target` and `landing_path`. The existing 1 s repeat guard is shared. Meta custom events are unchanged: signup, login and strategies fire exactly as before, and the Plans click still sends **no** Meta event (adding one would change Meta behaviour; decide separately).

## 8. Event taxonomy sent by Marketing

`$pageview`: `$current_url`, `$referrer`, `is_landing`, `consent_delayed`, `in_app_browser`, `ft_*`, `lt_*`. `marketing_cta_clicked`: `cta_id`, `cta_target`, `landing_path`, `ft_*`, `lt_*`. Every event: `schema_version` 1, `site` `marketing`. No `marketing_landing_viewed`.

## 9. Performance checks (measured; Chromium headless, localhost, unthrottled)

- Initial entry bundle: **460.13 kB (144.82 kB gzip) on `main`, 473.15 kB (149.60 kB gzip) on this branch**: +13.0 kB raw, +4.8 kB gzip. CSS +0.57 kB (+0.07 kB gzip). The SDK is a separate 377.7 kB (126.1 kB gzip) chunk, not in `index.html`, not preloaded, requested only after consent (verified in the browser: no request without consent, GPC, or when disabled).
- LCP, 7 runs each, median (min to max): disabled build mobile 264 (248 to 308) ms, desktop 280 (264 to 308) ms; enabled build with no consent mobile 268 (252 to 320) ms, desktop 296 (268 to 312) ms. CLS 0.0000 in every run. This is a smoke comparison, not a Lighthouse score; `main` was not measured for LCP, external requests were blocked, and fonts were bundled.
- Listeners: one delegated click and one auxclick listener (tested). SDK init: once per page even with repeated `initPosthog()` and repeated grants (tested). Cookie writes: one `tt_attr` write at consent start. Blocked or throwing SDK or transport: swallowed (tested; no rendering or routing impact).

## 10. Tests and build (actual results)

- `npx vitest run`: **47 passed, 0 failed** (3 files). Covers the 25 requested areas: Instagram, Facebook, YouTube tagged; direct; organic; unknown referral; malicious input; first-touch; last-touch; 90-day expiry; consent absent, denied, granted, withdrawn; GPC; no SDK without consent; one initial pageview; route changes; StrictMode; Back and Forward; same-path and hash; CTA dedupe; Plans CTA; Meta regression; missing key; throwing transport. Mock transport and a mocked `posthog-js` only.
- `tsc -p tsconfig.app.json --noEmit`: clean. `eslint .`: 0 errors, 8 warnings, all in pre-existing UI and social files; the new and changed files are clean.
- `vite build`: succeeds (default build and a flag-on build pointing at a local stub).
- Browser smoke tests (Chromium via Playwright against the built output, desktop 1280x800 and mobile 390x844, ingestion intercepted locally; nothing left the machine): disabled build: no SDK request, no cookie, no banner. Enabled build, no consent: banner visible, no SDK chunk, no cookie, no horizontal overflow on mobile. Allow: SDK chunk loads, `tt_attr` and `ph_*` cookies set, a flagged late-consent `$pageview` with `is_landing`, `ft_source=instagram`, `ft_influencer_id=inf_ab12`, then a CTA event for login and for plans, a `/contact` pageview, and **no** event for a hash-only change. The payload contained no query string, no fragment and not the test e-mail address that had been appended to the URL. Deny: `tt_attr` and `ph_*` removed, no further requests. GPC: no banner, no SDK.
- Defects the smoke tests found and fixed before this report: the consent card was hidden under page content (z-index), the outgoing filter stripped the SDK's own `token` (every event would have been dropped), and the SDK's `$session_entry_url` carried the full query string (now stripped, with unit tests).
- Not run: Lighthouse, real devices, Safari or Firefox, a real PostHog project (by instruction). posthog-js drops events from headless browsers; the smoke run spoofed bot-detection signals, which is a test-harness detail only.

## 11. Known limitations

- Not enabled anywhere; `VITE_POSTHOG_ALLOW_PRODUCTION` must stay unset. Banner wording and a permanent preferences link need owner and privacy approval.
- A visitor who grants late is attributed to the landing parameters captured in memory at page load (needed for a correct first touch; discarded if consent is denied). Legal should confirm this reading of "no retroactive replay".
- `is_landing` follows the browser tab session, not PostHog's 30-minute session.
- Visitors without consent, blockers, Safari cookie limits and in-app browsers that hide referrers are not measured or look direct.
- Unmapped referrers are `referral_unknown`; click-id-only visits are `referral` with medium `click_id` (the A0 text was ambiguous here; recorded, not diverged).
- `tt_an_consent` may also hold `denied` (stored to stop re-prompting); the app must treat anything but `granted` as off.
- `node_modules` in the repository folder was **not** updated (dependencies were installed in a scratch copy); run `npm install` before running tests locally. `pnpm-lock.yaml` and `bun.lockb` were not regenerated; if Vercel uses one of them, update it before any release.
- The smoke-test scripts live outside the repository; `dist/smoke-on` and `dist/smoke-off` (ignored build output) can be deleted.

## 12. Readiness for Batch B

Ready from the Marketing side: the shared contract is fixed in `analyticsEvents.ts` (schema version 1, field names), `analyticsConsent.ts` (cookie) and `attribution.ts` (cookie), and `turbotrade-ui` should copy them verbatim and reuse the `before_send` filter (including the `token` and URL rules). Batch B still needs backend confirmation B1 (stable `userName`), the identity route, and the consent-banner and privacy-notice decisions. Before any live use: owner approval, wording, `ALLOW_PRODUCTION`, a test project key, and the integrated Help Center, PostHog and Product Tour release gate. Cross-repository audit correction: the stale recommendation to send PostHog pageviews from `useRouteAnalytics` (first-render guard) was replaced in `turbotrade-ui/docs/analytics/posthog-cross-repo-audit.md` (documentation only).

## 13. Git working-tree status

Branch `feat/posthog-analytics`, HEAD `3c59512` (same as `main`; **no commit was made**, the user commits). `main` untouched. No fetch, pull, rebase, merge, push or PR.

```
 M .env.example
 M package-lock.json
 M package.json
 M src/App.tsx
 M src/lib/analytics.ts
 M src/main.tsx
?? .claude/settings.local.json      (pre-existing, preserved)
?? docs/analytics/posthog-batch-a1-marketing-report.md
?? src/components/AnalyticsConsent.tsx
?? src/lib/analytics.test.tsx
?? src/lib/analyticsConsent.ts
?? src/lib/analyticsEvents.ts
?? src/lib/attribution.test.ts
?? src/lib/attribution.ts
?? src/lib/posthog.test.tsx
?? src/lib/posthog.ts
?? src/lib/routePath.ts
?? src/test/
?? vitest.config.ts
```

`turbotrade-ui`: branch `feat/help-center-product-tour` at `10425cd`, only untracked `docs/analytics/` (documentation; the audit file was corrected). No application code, Help Center content or package changed there.
