/* The legal pages, in footer and hub order. Kept apart from pages.ts because the
   router and the footer need this list on every route, while the page copy is
   only fetched when a legal page is opened. The slugs are the routes; add a
   page here and in pages.ts together. */

export const LEGAL_NAV: { slug: string; label: string; summary: string }[] = [
  {
    "slug": "legal",
    "label": "Legal & Compliance",
    "summary": "Every policy, disclosure and regulatory detail in one place."
  },
  {
    "slug": "terms",
    "label": "Terms & Conditions",
    "summary": "The rules for using TurboTrade, fees, credits and the MITC."
  },
  {
    "slug": "privacy",
    "label": "Privacy Policy",
    "summary": "What data we collect, why, who sees it and your rights."
  },
  {
    "slug": "cancellation-refund",
    "label": "Cancellation & Refund Policy",
    "summary": "When fees are refundable, when they are not, and how refunds are calculated."
  },
  {
    "slug": "disclaimer",
    "label": "Risk Disclosure & Disclaimer",
    "summary": "The risks of automated trading, backtests, broker APIs and our regulatory status."
  },
  {
    "slug": "grievance-redressal",
    "label": "Grievance Redressal",
    "summary": "How to raise a complaint, timelines and escalation to SEBI SCORES and Smart ODR."
  },
  {
    "slug": "investor-charter",
    "label": "Investor Charter",
    "summary": "SEBI's Investor Charter for Research Analysts: services, your rights, and your do's and don'ts."
  },
  {
    "slug": "disclosures",
    "label": "Regulatory Disclosures",
    "summary": "Registration details, key officers, escalation matrix and mandatory SEBI disclosures."
  },
  {
    "slug": "complaint-board",
    "label": "Complaint Board",
    "summary": "Monthly complaint data disclosed as required for SEBI Research Analysts."
  },
  {
    "slug": "accessibility-statement",
    "label": "Accessibility Statement",
    "summary": "Our WCAG 2.2 AA commitment, features and how to report a barrier."
  }
];
