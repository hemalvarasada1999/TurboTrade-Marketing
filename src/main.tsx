import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
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

const root = document.getElementById("root")!;
const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

/* A prerendered page (scripts/prerender.mjs) arrives with its markup already in
   #root: attach to it rather than rebuilding it. The dev server and any route
   that was not prerendered start empty and render normally. */
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
