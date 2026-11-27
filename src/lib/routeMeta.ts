import { LEGAL_NAV } from "@/content/legal/meta";

/* The <title>, description and canonical path of every prerendered page.
   scripts/prerender.mjs writes these into each page's static HTML, so a crawler
   that never runs JavaScript still gets a distinct title and description per
   URL. (LegalDoc sets the same title again in the browser.) */

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  /* Pages that should not be indexed (the 404). */
  noindex?: boolean;
  /* Source file of the route's lazy page. The prerender preloads its chunk from
     this route's HTML, so the browser does not wait for the entry script to run
     before it discovers the chunk it must hydrate with. */
  chunk?: string;
}

const LEGAL_CHUNK = "src/pages/LegalDoc.tsx";

const HOME_TITLE = "TurboTrade.ai · Trading that runs without you";
const HOME_DESCRIPTION =
  "The market is open 9:15 to 3:30. You don't have to be. TurboTrade runs ready-made strategies on auto-pilot in your own broker account — your money never leaves your broker. SEBI registered. Plans from ₹2,999 a month. No profit share: everything a strategy makes is yours.";

export const ROUTE_META: RouteMeta[] = [
  { path: "/", title: HOME_TITLE, description: HOME_DESCRIPTION },
  {
    path: "/broker-partner-program",
    chunk: "src/pages/BrokerPartnerProgram.tsx",
    title: "Broker Partner Program · TurboTrade.ai",
    description:
      "Partner with TurboTrade: connect your brokerage with ready-made algorithmic strategies for your clients.",
  },
  {
    path: "/contact",
    title: "Contact · TurboTrade.ai",
    description: "Reach the TurboTrade team for support, partnerships and legal queries.",
  },
  {
    path: "/upcoming",
    chunk: "src/pages/Upcoming.tsx",
    title: "Coming Soon · TurboTrade.ai",
    description: "What TurboTrade is building next.",
  },
  ...LEGAL_NAV.map(({ slug, label, summary }) => ({
    path: `/${slug}`,
    chunk: LEGAL_CHUNK,
    title: `${label} · TurboTrade.ai`,
    description: summary,
  })),
];

export const NOT_FOUND_META: RouteMeta = {
  path: "/404",
  title: "Page not found · TurboTrade.ai",
  description: "This page does not exist.",
  noindex: true,
};
