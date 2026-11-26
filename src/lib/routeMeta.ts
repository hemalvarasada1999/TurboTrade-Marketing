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
}

const HOME_TITLE = "TurboTrade.ai · Trading that runs without you";
const HOME_DESCRIPTION =
  "The market is open 9:15 to 3:30. You don't have to be. TurboTrade runs ready-made strategies on auto-pilot in your own broker account — your money never leaves your broker. SEBI registered. Plans from ₹2,999 a month. No profit share: everything a strategy makes is yours.";

export const ROUTE_META: RouteMeta[] = [
  { path: "/", title: HOME_TITLE, description: HOME_DESCRIPTION },
  {
    path: "/broker-partner-program",
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
    title: "Coming Soon · TurboTrade.ai",
    description: "What TurboTrade is building next.",
  },
  ...LEGAL_NAV.map(({ slug, label, summary }) => ({
    path: `/${slug}`,
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
