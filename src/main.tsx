import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initMetaPixel } from "@/lib/metaPixel";
import { installCtaTracking } from "@/lib/analytics";
import { captureAttributionSnapshot } from "@/lib/attribution";
import { initPosthog } from "@/lib/posthog";

/* Before the first render, so the entry page's PageView carries the landing
   URL (campaign parameters included) and no route change can beat it. Both
   are no-ops off the production hosts or without ad consent. */
/* PostHog (disabled unless flag, host allowlist and analytics consent all
   pass). The attribution snapshot must be read BEFORE initMetaPixel(), which
   strips non-campaign query parameters from the address bar. */
captureAttributionSnapshot();
initMetaPixel();
installCtaTracking();
initPosthog();

createRoot(document.getElementById("root")!).render(<App />);
