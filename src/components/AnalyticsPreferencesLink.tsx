import { openAnalyticsPreferences } from "@/lib/analyticsConsent";
import { isPosthogConfigured } from "@/lib/posthog";
import "@/styles/consent.css";

/* Permanent footer entry that reopens the analytics preference card. Renders
   nothing while analytics is not configured for this host, so a build with the
   feature off shows no new UI. */
const AnalyticsPreferencesLink = () => {
  if (!isPosthogConfigured()) return null;
  return (
    <li>
      <button type="button" className="f-prefs" onClick={openAnalyticsPreferences}>
        Analytics preferences
      </button>
    </li>
  );
};

export default AnalyticsPreferencesLink;
