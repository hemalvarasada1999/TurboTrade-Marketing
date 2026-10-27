import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initMetaPixel } from "@/lib/metaPixel";
import { installCtaTracking } from "@/lib/analytics";

/* Before the first render, so the entry page's PageView carries the landing
   URL (campaign parameters included) and no route change can beat it. Both
   are no-ops off the production hosts or without ad consent. */
initMetaPixel();
installCtaTracking();

createRoot(document.getElementById("root")!).render(<App />);
