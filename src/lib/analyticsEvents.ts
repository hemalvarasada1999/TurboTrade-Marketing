/* ══════════════ ANALYTICS EVENT SCHEMA ══════════════
   The one typed list of what the marketing site may send to PostHog.
   `posthog-event-taxonomy.md` (turbotrade-ui/docs/analytics) is the source of
   truth; turbotrade-ui carries an identical copy of this contract, and a copy
   that drifts shows up in PostHog as a different `schema_version`.

   Two layers protect the data:
   - TypeScript: an unknown event or property fails the build.
   - Runtime: `sanitizeProps` drops any property that is not on the event's
     allowlist, and any value that is not a short string, finite number or
     boolean. Nothing free-form can leave the browser by accident. */

export const SCHEMA_VERSION = 1;

export const SITE = "marketing" as const;

/* Attribution fields attached to anonymous events (ft = first touch, lt = last
   eligible touch). Same names in both repositories. */
export const ATTRIBUTION_FIELDS = [
  "source",
  "medium",
  "campaign",
  "content",
  "term",
  "utm_id",
  "influencer_id",
  "placement_id",
  "referrer_host",
  "traffic_class",
  "landing_path",
  "ts",
] as const;
export type AttributionField = (typeof ATTRIBUTION_FIELDS)[number];

type FirstTouchKey = `ft_${AttributionField}`;
type LastTouchKey = `lt_${AttributionField}`;
export type AttributionProps = Partial<
  Record<FirstTouchKey | LastTouchKey, string | number>
>;

export const CTA_IDS = [
  "header",
  "hero",
  "strategies",
  "strategy-row",
  "pricing",
  "get-started",
  "page",
] as const;
export type CtaId = (typeof CTA_IDS)[number];

export const CTA_TARGETS = ["signup", "login", "plans", "strategies"] as const;
export type CtaTarget = (typeof CTA_TARGETS)[number];

export interface EventPropsMap {
  $pageview: {
    $current_url: string;
    $referrer?: string;
    is_landing?: boolean;
    consent_delayed?: boolean;
    in_app_browser?: boolean;
  } & AttributionProps;
  marketing_cta_clicked: {
    cta_id: CtaId;
    cta_target: CtaTarget;
    landing_path: string;
  } & AttributionProps;
}
export type EventName = keyof EventPropsMap;

export const ATTRIBUTION_KEYS: string[] = ATTRIBUTION_FIELDS.flatMap((f) => [`ft_${f}`, `lt_${f}`]);

/* Super-properties added to every event by the wrapper. */
export const BASE_PROPS = ["schema_version", "site"] as const;

export const EVENT_ALLOWLIST: Record<EventName, readonly string[]> = {
  $pageview: [
    "$current_url",
    "$referrer",
    "is_landing",
    "consent_delayed",
    "in_app_browser",
    ...ATTRIBUTION_KEYS,
  ],
  marketing_cta_clicked: ["cta_id", "cta_target", "landing_path", ...ATTRIBUTION_KEYS],
};

export function isKnownEvent(name: string): name is EventName {
  return Object.prototype.hasOwnProperty.call(EVENT_ALLOWLIST, name);
}

const MAX_STRING = 200;

/* Keeps only allowlisted keys with primitive, bounded values. */
export function sanitizeProps(
  event: EventName,
  props: Record<string, unknown>,
): Record<string, string | number | boolean> {
  const allowed = EVENT_ALLOWLIST[event];
  const out: Record<string, string | number | boolean> = {};
  for (const key of allowed) {
    const v = props[key];
    if (typeof v === "boolean") out[key] = v;
    else if (typeof v === "number" && Number.isFinite(v)) out[key] = v;
    else if (typeof v === "string" && v.length > 0 && v.length <= MAX_STRING) out[key] = v;
  }
  return out;
}
