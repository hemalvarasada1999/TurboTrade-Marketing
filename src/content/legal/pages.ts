import { COMPANY } from "@/lib/company";
import { COMPLAINTS_AS_OF, complaintBoardSections } from "./complaints";

/* ══════════════ LEGAL DOCUMENTS ══════════════
   The copy of every legal page, rendered by pages/LegalDoc.tsx. This file is
   the source now; edit it directly.

   - Source of truth is the TurboTrade Algo Services Comprehensive Legal
     Agreement (v10). Each page cites the Article it summarises in an
     <span class="cl">Art. x.y</span> tag; when the Agreement changes, update
     the matching text here.
   - The text is HTML because it is legal wording and must stay verbatim. The
     classes it uses (card, note, tbl, contact, reg, steps, hub, cl) are styled
     in styles/legal.css under `.legal-doc`.
   - Registration numbers, emails, phone, addresses and the UPI handle are
     written as {{TOKENS}} and filled from .env by fillLegal() below, so they
     are changed in .env, not here.
   - Effective / last-updated dates are the chips on each page.
   - Complaint Board numbers are in ./complaints.ts: update them by the 7th of
     every month. They are entity-level (EquityPulse, covering EqtPulse and
     TurboTrade), so keep them identical to the EqtPulse site.
   - Section ids are the #anchors other pages link to (e.g. /terms#most-
     important-terms-and-conditions-mitc); don't rename one without searching
     for links to it. */

export type LegalSection = { id: string; heading: string; html: string };
export type LegalDoc = {
  slug: string;
  label: string;
  titleHtml: string;
  lede: string;
  description: string;
  chips: string[];
  toc: boolean;
  introHtml: string;
  sections: LegalSection[];
};

const TOKENS: Record<string, string> = {
  ENTITY: COMPANY.entity,
  CIN: COMPANY.cin,
  SEBI_RA: COMPANY.sebiRa,
  BSE: COMPANY.bseEnlistment,
  REGISTERED_OFFICE: COMPANY.registeredOffice,
  EMAIL: COMPANY.email,
  LEGAL_EMAIL: COMPANY.legalEmail,
  PHONE: COMPANY.phone,
  PHONE_TEL: COMPANY.phoneTel,
  UPI: COMPANY.upiHandle,
};

/* Swaps every {{TOKEN}} for its .env value. An unknown token is left visible
   rather than blanked, so a typo shows up on the page instead of hiding. */
export const fillLegal = (text: string) =>
  text.replace(/\{\{([A-Z_]+)\}\}/g, (m, key: string) => TOKENS[key] ?? m);

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  "legal": {
    "slug": "legal",
    "label": "Legal & Compliance",
    "titleHtml": "Legal &amp; <em>Compliance</em>",
    "lede": "Every TurboTrade.ai policy, disclosure and regulatory detail in one place. The Algo Services Agreement you sign at onboarding governs; these pages explain it.",
    "description": "TurboTrade.ai legal and compliance hub: terms, privacy, refund, risk disclosure, grievance redressal, complaint board and accessibility for {{ENTITY}}.",
    "chips": [
      "Updated: 23 September 2026",
      "SEBI RA: {{SEBI_RA}}",
      "BSE Enlistment: {{BSE}}"
    ],
    "toc": false,
    "introHtml": "",
    "sections": [
      {
        "id": "policies-and-disclosures",
        "heading": "Policies and disclosures",
        "html": "<div class=\"hub\"><a class=\"tile\" href=\"/terms\"><h2>Terms &amp; Conditions</h2><p>The rules for using TurboTrade, fees, credits and the MITC.</p><span>Read Terms →</span></a><a class=\"tile\" href=\"/privacy\"><h2>Privacy Policy</h2><p>What data we collect, why, who sees it and your rights.</p><span>Read Privacy Policy →</span></a><a class=\"tile\" href=\"/cancellation-refund\"><h2>Cancellation &amp; Refund Policy</h2><p>When fees are refundable, when they are not, and how refunds are calculated.</p><span>Read Cancellation →</span></a><a class=\"tile\" href=\"/disclaimer\"><h2>Risk Disclosure &amp; Disclaimer</h2><p>The risks of automated trading, backtests, broker APIs and our regulatory status.</p><span>Read Risk Disclosure →</span></a><a class=\"tile\" href=\"/grievance-redressal\"><h2>Grievance Redressal</h2><p>How to raise a complaint, timelines and escalation to SEBI SCORES and Smart ODR.</p><span>Read Grievance Redressal →</span></a><a class=\"tile\" href=\"/investor-charter\"><h2>Investor Charter</h2><p>SEBI's Investor Charter for Research Analysts: services, your rights, and your do's and don'ts.</p><span>Read Investor Charter →</span></a><a class=\"tile\" href=\"/disclosures\"><h2>Regulatory Disclosures</h2><p>Registration details, key officers, escalation matrix and mandatory SEBI disclosures.</p><span>Read Regulatory Disclosures →</span></a><a class=\"tile\" href=\"/complaint-board\"><h2>Complaint Board</h2><p>Monthly complaint data disclosed as required for SEBI Research Analysts.</p><span>Read Complaint Board →</span></a><a class=\"tile\" href=\"/accessibility-statement\"><h2>Accessibility Statement</h2><p>Our WCAG 2.2 AA commitment, features and how to report a barrier.</p><span>Read Accessibility Statement →</span></a></div>"
      },
      {
        "id": "regulatory-information",
        "heading": "Regulatory information",
        "html": "<dl class=\"reg\"><div><dt>Entity</dt><dd>{{ENTITY}}</dd></div><div><dt>Brand</dt><dd>TurboTrade.ai</dd></div>\n<div><dt>SEBI Research Analyst Reg. No.</dt><dd>{{SEBI_RA}}</dd></div><div><dt>BSE Enlistment No.</dt><dd>{{BSE}}</dd></div>\n<div><dt>RAASB</dt><dd>BSE Administration &amp; Supervision Ltd.</dd></div><div><dt>CIN</dt><dd>{{CIN}}</dd></div></dl>\n<p>Registration granted by SEBI, enlistment with BSE and certification from NISM in no way guarantee the performance of the intermediary or provide any assurance of returns to investors.</p>"
      },
      {
        "id": "how-turbotrade-works-in-one-paragraph",
        "heading": "How TurboTrade works, in one paragraph",
        "html": "<p>TurboTrade.ai runs rule-based algorithmic strategies — most of them Blackbox — that place orders automatically in <b>your own broker account</b> through your broker's API, under the consent you give in the Algo Services Agreement and within limits you set. We never hold your money or securities, never ask for your broker password or OTP, and never promise returns. You authenticate with your broker every trading day, and you can pause a strategy or hit the Kill Switch at any time.</p>"
      },
      {
        "id": "before-you-pay",
        "heading": "Before you pay",
        "html": "<ul><li>Pay only by cheque, NEFT, RTGS, IMPS or UPI to our validated UPI handle <b>{{UPI}}</b> — check it on SEBI Check first. Never pay cash or to a personal account.</li>\n<li>Fees for individual and HUF clients are capped at ₹1,51,000 per annum per family (excluding taxes).</li>\n<li>Read the <a href=\"/terms#most-important-terms-and-conditions-mitc\">Most Important Terms &amp; Conditions</a> and SEBI's Do's and Don'ts for dealing with a Research Analyst.</li></ul>"
      },
      {
        "id": "need-help-or-want-to-complain",
        "heading": "Need help or want to complain?",
        "html": "<dl class=\"contact\"><div><dt>Entity</dt><dd>{{ENTITY}}</dd></div><div><dt>Brand</dt><dd>TurboTrade.ai</dd></div><div><dt>CIN</dt><dd>{{CIN}}</dd></div><div><dt>SEBI Research Analyst Reg. No.</dt><dd>{{SEBI_RA}}</dd></div><div><dt>BSE Enlistment No.</dt><dd>{{BSE}}</dd></div><div><dt>Registered office</dt><dd>{{REGISTERED_OFFICE}}</dd></div><div><dt>Email</dt><dd><a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a></dd></div><div><dt>Phone</dt><dd><a href=\"tel:{{PHONE_TEL}}\">{{PHONE}}</a></dd></div><div><dt>Website</dt><dd><a href=\"https://www.turbotrade.ai\">www.turbotrade.ai</a></dd></div></dl>\n<p><a href=\"/grievance-redressal\">Raise a grievance</a> · <a href=\"https://scores.sebi.gov.in\" target=\"_blank\" rel=\"noopener noreferrer\">SEBI SCORES</a> · <a href=\"https://smartodr.in\" target=\"_blank\" rel=\"noopener noreferrer\">Smart ODR</a></p>"
      }
    ]
  },
  "terms": {
    "slug": "terms",
    "label": "Terms & Conditions",
    "titleHtml": "Terms and <em>Conditions</em>",
    "lede": "The rules for using TurboTrade.ai, drawn from the Algo Services Agreement you sign at onboarding — services, fees, credits, responsibilities and the MITC.",
    "description": "TurboTrade.ai Terms & Conditions and Most Important Terms & Conditions (MITC) for algorithmic trading services by {{ENTITY}}, SEBI RA {{SEBI_RA}}.",
    "chips": [
      "Effective: 23 September 2026",
      "Last updated: 23 September 2026",
      "SEBI RA: {{SEBI_RA}}"
    ],
    "toc": true,
    "introHtml": "",
    "sections": [
      {
        "id": "introduction-and-acceptance",
        "heading": "1. Introduction and acceptance",
        "html": "<p>These Terms &amp; Conditions (\"<b>Terms</b>\") govern access to and use of TurboTrade.ai — the website at www.turbotrade.ai, the web and mobile applications, APIs, dashboards and related services (the \"<b>Platform</b>\") — owned and operated by <b>{{ENTITY}}</b> (\"<b>EquityPulse</b>\", \"<b>TurboTrade.ai</b>\", \"<b>we</b>\", \"<b>us</b>\").</p>\n<p>These Terms summarise and must be read together with the <b>TurboTrade Algo Services Comprehensive Legal Agreement</b> (the \"<b>Agreement</b>\") that every client executes before any paid service is rendered, and with our <a href=\"/privacy\">Privacy Policy</a>, <a href=\"/disclaimer\">Risk Disclosure &amp; Disclaimer</a>, <a href=\"/cancellation-refund\">Cancellation &amp; Refund Policy</a> and <a href=\"/grievance-redressal\">Grievance Redressal Policy</a>. <b>If anything on this website conflicts with the Agreement you have executed, the Agreement prevails.</b></p>\n<p>Browsing this marketing website does not by itself make you a client. Your consent to the Agreement, the Most Important Terms &amp; Conditions (MITC) and the risk disclosures is obtained separately during onboarding on the Platform. EquityPulse will not render any Algo Services or charge any Subscription Fees before the Agreement is duly executed <span class=\"cl\">Art. 5.2</span>.</p>\n<div class=\"note\"><b>If you do not agree to these Terms, do not create an account or subscribe.</b></div>"
      },
      {
        "id": "who-we-are-and-our-regulatory-status",
        "heading": "2. Who we are and our regulatory status",
        "html": "<p>{{ENTITY}} (CIN {{CIN}}) is registered with the Securities and Exchange Board of India (SEBI) as a <b>Research Analyst</b> vide Registration No. <b>{{SEBI_RA}}</b>, and is enlisted by <b>BSE Ltd.</b> as a Research Analyst vide Enlistment No. <b>{{BSE}}</b> <span class=\"cl\">Art. 7.1</span>.</p>\n<ul><li>EquityPulse is authorised to provide algorithmic research services and strategy recommendations.</li>\n<li>EquityPulse is <b>not</b> registered as an Investment Adviser or a Portfolio Manager <span class=\"cl\">Art. 7.2</span>.</li>\n<li>SEBI registration, BSE enlistment and NISM certification of our personnel do not guarantee performance or assure any return <span class=\"cl\">Art. 7.3</span>.</li></ul>"
      },
      {
        "id": "key-definitions",
        "heading": "3. Key definitions",
        "html": "<ul>\n<li><b>Algo Services</b> — algorithmic trading frameworks, Blackbox strategy execution, signal-based and rule-based trading systems, research-backed models, execution automation, dashboards and analytics made available through TurboTrade.ai.</li>\n<li><b>Blackbox Algorithm</b> — an automated strategy whose logic, parameters, signal methodology and exit criteria are proprietary to EquityPulse and are not disclosed to you.</li>\n<li><b>Broker API</b> — the API provided by your SEBI-registered stockbroker through which orders generated by the Platform are transmitted, placed, modified or cancelled on <b>your</b> account.</li>\n<li><b>Credits</b> — prepaid digital entitlements under the pay-per-use model. <b>1 Credit = ₹10.</b> Each strategy may require separate Credits.</li>\n<li><b>AMC / Onboarding Charge</b> — a one-time, non-refundable charge of <b>₹500</b> payable on initial onboarding.</li>\n<li><b>Working Day</b> — any day on which NSE and/or BSE are open for normal trading.</li>\n<li><b>RAASB</b> — the Research Analyst Administration and Supervisory Body, currently BSE Administration &amp; Supervision Limited (BASL).</li>\n</ul><p class=\"foot-note\">Full definitions: Article 1 of the Agreement.</p>"
      },
      {
        "id": "what-turbotrade-does-and-does-not-do",
        "heading": "4. What TurboTrade does — and does not do",
        "html": "<h3>What we provide <span class=\"cl\">Art. 2.1</span></h3>\n<ul><li>Algorithmic trading frameworks and quantitative, research-backed strategy models.</li>\n<li>Blackbox strategy deployment with <b>automated order placement through your own Broker API</b>.</li>\n<li>Signal-based and rule-based trading systems, including investing baskets.</li>\n<li>Platform access, performance dashboard, trade reporting and analytics.</li></ul>\n<h3>How automated execution works <span class=\"cl\">Art. 6.1–6.2</span></h3>\n<p>When you activate a strategy, its rule-based engine generates orders that are transmitted through your broker's API into <b>your own trading and Demat account</b>, under the consent you give in the Agreement and within the risk parameters you configure. The systems are deterministic and rule-based; no self-learning or autonomous decision-making system operates outside parameters defined by our research team.</p>\n<h3>What we do not do <span class=\"cl\">Art. 2.2 · M.1</span></h3>\n<ul><li>We do not trade on your behalf at our own discretion, and we do not take custody of, hold or move your funds or securities.</li>\n<li>We do not provide personalised or discretionary investment advice, portfolio management, tax, legal or fiduciary services.</li>\n<li>We do not guarantee, assure or represent any return or capital preservation.</li>\n<li>We do not ask for, and you must never share, your broker, Demat, bank or email login credentials, passwords or OTPs.</li></ul>\n<div class=\"note\"><b>You stay in control.</b> Every order is placed in your name, in your account, under your broker's terms. You can pause or deactivate a strategy, or use the Emergency Kill Switch, at any time.</div>"
      },
      {
        "id": "eligibility-kyc-and-onboarding",
        "heading": "5. Eligibility, KYC and onboarding",
        "html": "<p>To use the Algo Services you must <span class=\"cl\">Art. 3.1–3.3</span>:</p>\n<ul><li>be legally competent to contract under Indian law (18 years or older);</li>\n<li>hold a valid, active Demat and trading account with a SEBI-registered stockbroker;</li>\n<li>not be prohibited from accessing the securities market by any court, tribunal or regulator;</li>\n<li>complete KYC — PAN, proof of identity, proof of address, Demat details and any other document required by law. We may fetch your KYC record from SEBI-registered KYC Registration Agencies (CVL, CAMS, Karvy, NDML or DotEx KRA) so you need not re-submit documents;</li>\n<li>keep your broker account active, adequately funded and correctly mapped to the Platform, and tell us promptly about any change to your PAN, mobile, email or broker details.</li></ul>\n<p>We may suspend or terminate access, without liability, if required documentation is not provided.</p>"
      },
      {
        "id": "daily-authentication-static-ip-and-basket-rebala",
        "heading": "6. Daily authentication, Static IP and basket rebalancing",
        "html": "<h3>Daily broker authentication is mandatory <span class=\"cl\">Art. 3.4</span></h3>\n<p>You must re-authenticate your Broker API session every trading day before any strategy can execute. If you hold positional (overnight or multi-session) trades and fail to authenticate before the scheduled exit or management time, <b>the entire risk of unmanaged or unexited positions falls on you</b>, including losses, margin penalties and regulatory consequences.</p>\n<h3>Static IP users <span class=\"cl\">Art. 3.5</span></h3>\n<p>If you configure your Broker API integration using a static IP, you represent that you understand API order flows, order routing, latency, token management and execution dependencies, and you are solely responsible for any misconfiguration or connectivity issue arising from that setup. Static IP allocation is currently complimentary; we may introduce a charge with prior notice <span class=\"cl\">Art. 13.17</span>.</p>\n<h3>Investing algos and basket rebalance signals <span class=\"cl\">Art. 3.6</span></h3>\n<p>For stock baskets and investing algorithms, the Platform may generate a system-generated, non-discretionary rebalance signal. It is not portfolio management or an automatic execution instruction. Whether and when to act is your decision; if you choose to act, you must authenticate on the exact day the signal is generated. Reminder alerts are a courtesy only.</p>"
      },
      {
        "id": "free-trial-demo-and-paper-trading",
        "heading": "7. Free trial, demo and paper trading",
        "html": "<ul><li><b>Demo / free trial</b> <span class=\"cl\">Art. 5.2A</span> — offered at our discretion. It may include <b>real trades of short duration</b> to let you verify live broker connectivity and execution. Real trades carry real risk; any loss during a trial is yours. Scope, duration and parameters may be changed or withdrawn at any time.</li>\n<li><b>Paper trading</b> <span class=\"cl\">Art. 5.2B</span> — simulated only. No real orders are placed and no funds are at risk. Simulated fills ignore slippage, partial fills, market impact, brokerage and real liquidity, so paper results are not indicative of live performance.</li></ul>"
      },
      {
        "id": "additional-terms-for-automated-execution",
        "heading": "8. Additional terms for automated execution",
        "html": "<ul><li><b>System lapses.</b> Technical issues can cause orders not to be placed, or to be placed late. We make reasonable efforts to minimise and promptly rectify such lapses, but we are not liable for losses they cause <span class=\"cl\">Art. 6.4, 10.3, 18</span>.</li>\n<li><b>Price differences between users.</b> Where strategies place market or best-available-price orders, different users can receive different fill prices because of order timing, queue position, liquidity and broker processing. We are not responsible for such differences <span class=\"cl\">Art. 10.2</span>.</li>\n<li><b>Market data dependency.</b> Signals depend on real-time data from exchanges and third-party vendors. If a data source fails, lags or sends incorrect data, signals may be missed, delayed or wrong <span class=\"cl\">Art. 11.2</span>.</li>\n<li><b>Discontinuing the service.</b> We may suspend or discontinue automated execution for you or for a strategy, including for compliance or market-integrity reasons, as set out in <span class=\"cl\">Art. 25.1</span>. Where practicable we will notify you through the Platform or email. Manage or exit open positions in your broker account if a strategy stops.</li></ul>"
      },
      {
        "id": "fees-pricing-models-and-billing",
        "heading": "9. Fees, pricing models and billing",
        "html": "<p>TurboTrade.ai offers two pricing models; you may use one or both <span class=\"cl\">Art. 13</span>.</p>\n<h3>Model A — Fixed Subscription</h3>\n<div class=\"tbl\" role=\"region\" tabindex=\"0\" aria-label=\"Fixed Subscription plans (Art. 13.1)\"><table><caption>Fixed Subscription plans (Art. 13.1)</caption><thead><tr><th scope=\"col\">Plan</th><th scope=\"col\">Duration</th><th scope=\"col\">Billing</th><th scope=\"col\">Access</th></tr></thead><tbody><tr><td>Monthly</td><td>1 calendar month</td><td>Monthly, in advance</td><td>Unlimited Platform access for the plan period</td></tr><tr><td>Quarterly</td><td>3 calendar months</td><td>Quarterly, in advance</td><td>Unlimited access at a discounted rate</td></tr><tr><td>Annual</td><td>12 calendar months</td><td>Annually, in advance</td><td>Unlimited access at the maximum discount</td></tr><tr><td>Strategy-specific</td><td>As specified</td><td>As specified on the Platform</td><td>One or more specific strategies for a defined period</td></tr></tbody></table></div>\n<ul><li>Strategies, number of simultaneous deployments, analytics and support tier per plan are as shown on the pricing page at the time you subscribe <span class=\"cl\">13.2</span>.</li>\n<li>Plans <b>auto-renew by default</b> at the then-prevailing rate unless you cancel from the dashboard before the renewal date <span class=\"cl\">13.3</span>.</li>\n<li>With your express consent, fees may be collected in advance for up to <b>12 months</b>, in line with SEBI Circular SEBI/HO/MIRSD/MIRSD-PoD/P/CIR/2025/48 dated 2 April 2025 <span class=\"cl\">13.4</span>.</li></ul>\n<h3>Model B — Credit-based pay-per-use</h3>\n<ul><li><b>1 Credit = ₹10.</b> Credits are bought in packs; consumption per strategy or feature is published in the Platform's Credit Schedule — check it before activating a strategy <span class=\"cl\">13.5–13.8</span>.</li>\n<li>Credits are non-transferable, not redeemable for cash, not deposits, earn no interest, are personal to your account and expire as specified at purchase <span class=\"cl\">13.6, 13.9</span>.</li>\n<li>Expired Credits are forfeited. Unused, non-expired Credits may be refunded as set out in the <a href=\"/cancellation-refund\">Cancellation &amp; Refund Policy</a> <span class=\"cl\">13.10</span>.</li></ul>\n<h3>Common to both models</h3>\n<ul><li><b>AMC / Onboarding Charge:</b> one-time ₹500, <b>strictly non-refundable</b>. We may revise it and may deduct a revised charge from your Credit balance or ask for upfront payment <span class=\"cl\">13.11</span>.</li>\n<li><b>SEBI fee cap:</b> total fees to individual and HUF clients will not exceed <b>₹1,51,000 per annum per family</b>, excluding GST and statutory charges. The cap does not apply to non-individual clients or accredited investors, whose fees are agreed mutually <span class=\"cl\">5.3, 13.12</span>.</li>\n<li><b>Payment modes:</b> non-cash only — cheque, NEFT, RTGS, IMPS or UPI. For UPI, pay only to EquityPulse's validated UPI handle <b>{{UPI}}</b> and verify it on <b>SEBI Check</b> first. <b>Cash is never accepted</b> <span class=\"cl\">13.13</span>.</li>\n<li><b>Taxes:</b> GST and any other levies are charged in addition to fees <span class=\"cl\">13.15</span>.</li>\n<li><b>Price and billing changes:</b> revised prices apply to new purchases and renewals from the effective date. We may restructure billing (subscription, credit or hybrid) with reasonable notice via the Platform or registered email <span class=\"cl\">13.14, 13.16</span>.</li>\n<li><b>CeFCoM:</b> EquityPulse has not yet registered for SEBI's optional Centralised Fee Collection Mechanism run by BSE (RAASB). If we do, it will be offered as an optional channel and notified to you <span class=\"cl\">Art. 30</span>.</li></ul>"
      },
      {
        "id": "your-responsibilities",
        "heading": "10. Your responsibilities",
        "html": "<p>You are solely responsible for <span class=\"cl\">Art. 6.3, 14</span>:</p>\n<ul><li>capital allocation and position sizing;</li>\n<li>configuring and maintaining risk parameters in your broker account;</li>\n<li>maintaining adequate margin and funds at all times;</li>\n<li>monitoring open positions, Platform connectivity and Broker API status, and intervening promptly during any disruption;</li>\n<li>completing daily authentication;</li>\n<li>keeping your contact and broker details current;</li>\n<li>all tax obligations on your trading — income tax, capital gains, STT, GST and other levies <span class=\"cl\">Art. 20</span>.</li></ul>\n<p>We are not responsible for losses from missed alerts, incorrect execution, unhedged positions or consequences of your action or inaction <span class=\"cl\">14.2</span>.</p>"
      },
      {
        "id": "prohibited-activities",
        "heading": "11. Prohibited activities",
        "html": "<p>You must not, directly or indirectly <span class=\"cl\">Art. 15</span>:</p>\n<ol class=\"alpha\"><li>reverse-engineer, decompile or attempt to derive the logic, parameters or code of any Blackbox strategy or Platform feature;</li>\n<li>redistribute, resell, sublicense or share access to the Platform or any strategy, signal or data derived from it;</li>\n<li>scrape, copy or extract Platform data, content or reports by automated means;</li>\n<li>manipulate, exploit or circumvent any security feature or access control;</li>\n<li>use the Platform for any unlawful or fraudulent purpose, or in breach of SEBI regulations;</li>\n<li>integrate unauthorised third-party tools, scripts, bots or agents without our prior written consent.</li></ol>"
      },
      {
        "id": "intellectual-property",
        "heading": "12. Intellectual property",
        "html": "<p>All algorithms, trading models, Blackbox strategies, source code, data architectures, analytical frameworks, interface designs, brand names, logos and content are the exclusive property of {{ENTITY}} <span class=\"cl\">Art. 16</span>.</p>\n<p>Subject to compliance and payment, you get a limited, personal, non-exclusive, non-transferable, revocable licence to use the Platform for your own trading during your Subscription. Unauthorised reproduction, commercial exploitation or reverse engineering exposes you to civil and criminal remedies.</p>"
      },
      {
        "id": "confidentiality-data-and-security",
        "heading": "13. Confidentiality, data and security",
        "html": "<p>We keep your data confidential under the RA Regulations, applicable data protection law and our <a href=\"/privacy\">Privacy Policy</a>. You must keep our strategy logic, platform architecture and pricing information confidential <span class=\"cl\">Art. 17</span>.</p>\n<div class=\"note warn\"><b>Critical security notice <span class=\"cl\">17.3 · M.15</span></b>EquityPulse and its personnel will <b>never</b> ask for your login credentials, passwords, OTPs or any authentication details for your trading, Demat, bank or other financial account. Never share them with anyone, including our staff. Report any such request to us and to SEBI immediately.</div>"
      },
      {
        "id": "communications",
        "heading": "14. Communications",
        "html": "<p>We send strategy alerts, service notifications and official communications through the Platform dashboard, Telegram, WhatsApp, SMS and your registered email only <span class=\"cl\">Art. 21</span>. We are not liable for messages received through any other channel. Keep your email and mobile number current <span class=\"cl\">M.14</span>.</p>"
      },
      {
        "id": "conflict-of-interest-and-broker-revenue-sharing",
        "heading": "15. Conflict of interest and broker revenue sharing",
        "html": "<p>EquityPulse, its officers, directors, employees and associates do not hold, trade in or benefit from positions in securities that are the subject of a current strategy recommendation, and have not received compensation from issuers whose securities are the subject of our strategies <span class=\"cl\">Art. 12.2–12.4</span>.</p>\n<div class=\"note\"><b>Mandatory disclosure <span class=\"cl\">12.5 · M.5</span></b>EquityPulse may enter, or has entered, into revenue-sharing arrangements with brokers empanelled on TurboTrade.ai, under which the broker shares a percentage of brokerage generated from trades executed through the Platform. This costs you nothing extra, is a potential conflict of interest we acknowledge, does not influence strategy outputs, and does not restrict your choice of broker.</div>"
      },
      {
        "id": "limitation-of-liability-and-indemnity",
        "heading": "16. Limitation of liability and indemnity",
        "html": "<ul><li><b>Cap:</b> our total aggregate liability is limited to the Subscription Fees (excluding the AMC / Onboarding Charge) you actually paid in the <b>three calendar months</b> before the event giving rise to the claim <span class=\"cl\">Art. 18.1</span>.</li>\n<li><b>Excluded losses:</b> trading losses, opportunity costs, lost profits; loss of revenue, data or goodwill; indirect, consequential, special or punitive damages; losses from broker failures, exchange disruptions or data-feed errors; Force Majeure; and consequences of your failure to monitor or intervene <span class=\"cl\">18.2</span>.</li>\n<li><b>As-is:</b> the Platform and Algo Services are provided \"as is\" and \"as available\", without warranty of uninterrupted availability, accuracy, profitability or freedom from errors <span class=\"cl\">18.3</span>.</li>\n<li><b>No recourse for trading losses:</b> you acknowledge there is no recourse against EquityPulse for trading losses, howsoever arising <span class=\"cl\">Art. 4.4 · M.8</span>.</li>\n<li><b>Indemnity:</b> you indemnify EquityPulse, its directors, officers, employees, agents and assigns against claims arising from your misuse of the Platform, breach of the Agreement, violation of law, third-party claims related to your trading, or your fraudulent, negligent or wilful acts. This survives termination <span class=\"cl\">Art. 19</span>.</li></ul>\n<p class=\"foot-note\">Nothing here limits any right you have under law that cannot be excluded by contract.</p>"
      },
      {
        "id": "force-majeure",
        "heading": "17. Force majeure",
        "html": "<p>Neither party is liable for failure or delay caused by events beyond its reasonable control — including natural disasters, epidemics, war, terrorism, government or regulatory orders, exchange trading halts, telecom or internet failures, cyberattacks, and failures of brokers, data vendors or cloud providers <span class=\"cl\">Art. 22</span>.</p>"
      },
      {
        "id": "term-cancellation-and-termination",
        "heading": "18. Term, cancellation and termination",
        "html": "<ul><li>The Agreement runs for your chosen Subscription period unless terminated earlier. Articles 16–20, 32 and 33 survive termination <span class=\"cl\">Art. 31</span>.</li>\n<li>You may cancel at any time from the dashboard, by email to <a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a>, or by a support ticket. Cancellation is effective when we confirm it in writing, and access continues until the end of the current prepaid cycle <span class=\"cl\">Art. 24</span>.</li>\n<li>We may suspend, restrict or terminate your Subscription, with or without notice, for breach, false information, misuse, non-payment or chargeback, a regulatory directive or court order, or in the interest of market integrity or compliance <span class=\"cl\">Art. 25.1</span>.</li>\n<li>Refund consequences are set out in the <a href=\"/cancellation-refund\">Cancellation &amp; Refund Policy</a>.</li></ul>"
      },
      {
        "id": "disputes-governing-law-and-jurisdiction",
        "heading": "19. Disputes, governing law and jurisdiction",
        "html": "<ol><li><b>Grievance first.</b> Raise service issues through our <a href=\"/grievance-redressal\">Grievance Redressal</a> process. You may always approach SEBI through SCORES or the Smart ODR portal for matters within SEBI's jurisdiction <span class=\"cl\">Art. 32.4</span>.</li>\n<li><b>Good-faith negotiation</b> between senior executives for 30 calendar days after written notice of a dispute <span class=\"cl\">32.1</span>.</li>\n<li><b>Arbitration</b> under the Arbitration and Conciliation Act, 1996 by a sole arbitrator mutually appointed; seat and venue Bengaluru; language English; the award is final and binding <span class=\"cl\">32.2</span>.</li></ol>\n<p>These Terms and the Agreement are governed by the laws of India. Subject to arbitration, courts at <b>Bengaluru, Karnataka</b> have exclusive jurisdiction <span class=\"cl\">Art. 33</span>.</p>"
      },
      {
        "id": "amendments-and-general-provisions",
        "heading": "20. Amendments and general provisions",
        "html": "<ul><li>We may amend these Terms or the Agreement, including for regulatory changes, by publishing updated terms on the Platform and/or emailing you. Continued use after the effective date means acceptance; please review them periodically <span class=\"cl\">Art. 34</span>.</li>\n<li>If any provision is held unenforceable, the rest remains in force <span class=\"cl\">Art. 35</span>. The Agreement is the entire agreement between us <span class=\"cl\">Art. 36</span>. A delay in exercising a right is not a waiver <span class=\"cl\">Art. 37</span>.</li>\n<li>No employment, agency, partnership, joint venture or fiduciary relationship is created. EquityPulse acts solely as a research analyst and technology service provider <span class=\"cl\">Art. 38</span>.</li></ul>\n<p>Read the <a href=\"/investor-charter\">Investor Charter</a>, our <a href=\"/disclosures\">Regulatory Disclosures</a>, and SEBI's Do's and Don'ts for dealing with a Research Analyst, notified in SEBI Master Circular SEBI/HO/MIRSD-POD-1/P/CIR/2024/49 dated 21 May 2024, as updated.</p>"
      },
      {
        "id": "most-important-terms-and-conditions-mitc",
        "heading": "21. Most Important Terms &amp; Conditions (MITC)",
        "html": "<p>The MITC form an integral part of the Agreement. Read and acknowledge each point before you subscribe.</p><div class=\"tbl\" role=\"region\" tabindex=\"0\" aria-label=\"MITC — Part VII of the Agreement\"><table><caption>MITC — Part VII of the Agreement</caption><thead><tr><th scope=\"col\">No.</th><th scope=\"col\">Term</th><th scope=\"col\">What it means for you</th></tr></thead><tbody><tr><td>M.1</td><td>No discretionary trading by the RA</td><td>EquityPulse will not carry out any trade on your behalf at its own discretion. Orders are placed only in your own account, through your Broker API, under the consent and parameters you set.</td></tr><tr><td>M.2</td><td>Fee cap</td><td>Fees for individual/HUF clients will not exceed ₹1,51,000 per annum per family, excluding statutory charges. Non-individual clients and accredited investors are governed by mutual agreement.</td></tr><tr><td>M.3</td><td>AMC / Onboarding Charge &amp; advance fees</td><td>One-time ₹500, unconditionally non-refundable and revisable. Subscription fees may be collected up to 12 months in advance. Unused, non-expired Credits are refundable at ₹10 per Credit, subject to the 60-day deduction; expired or consumed Credits are not.</td></tr><tr><td>M.4</td><td>Payment mode</td><td>Non-cash only (cheque, NEFT/RTGS/IMPS, UPI). Verify our UPI handle {{UPI}} on SEBI Check. No cash.</td></tr><tr><td>M.5</td><td>Broker revenue sharing</td><td>We may receive a share of brokerage from empanelled brokers. No extra charge to you; strategy outputs are independent.</td></tr><tr><td>M.6</td><td>No assured returns</td><td>Any scheme offering guaranteed, assured or fixed returns is prohibited by law. We make no such representation.</td></tr><tr><td>M.7</td><td>No guarantee</td><td>We do not guarantee returns, profits, accuracy or risk-free investing.</td></tr><tr><td>M.8</td><td>Market risk</td><td>All investments are subject to market risk. There is no recourse to recover losses from use of the Platform.</td></tr><tr><td>M.9</td><td>Registration is not a guarantee</td><td>SEBI registration ({{SEBI_RA}}), BSE Enlistment No. {{BSE}} and NISM certification do not guarantee performance or returns.</td></tr><tr><td>M.10</td><td>Credit model</td><td>Pay-per-use Credits valued at ₹10 each; each strategy may need separate Credits; Credits are non-transferable.</td></tr><tr><td>M.11</td><td>Emergency Kill Switch</td><td>You can square off all or selected positions instantly from the Platform. Kill Switch orders are market or best-available-price orders through your Broker API and are subject to API availability, liquidity and exchange hours. Instant execution is not guaranteed.</td></tr><tr><td>M.12</td><td>Daily &amp; basket authentication</td><td>Daily Broker API authentication is mandatory. Missing it before a positional exit puts the entire risk on you. For basket rebalances, authenticate on the day the signal is generated; acting on it is your choice.</td></tr><tr><td>M.13</td><td>Grievance steps</td><td>Step 1 — TurboTrade support: <a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a> / {{PHONE}}. Step 2 — <a href=\"https://scores.sebi.gov.in\" target=\"_blank\" rel=\"noopener noreferrer\">SEBI SCORES</a>. Step 3 — <a href=\"https://smartodr.in\" target=\"_blank\" rel=\"noopener noreferrer\">Smart ODR</a>.</td></tr><tr><td>M.14</td><td>Contact details</td><td>Keep your registered email and mobile number updated at all times.</td></tr><tr><td>M.15</td><td>Security</td><td>We will never ask for your login credentials, OTPs or passwords for any financial account. Report any such request immediately.</td></tr></tbody></table></div>"
      },
      {
        "id": "contact",
        "heading": "22. Contact",
        "html": "<dl class=\"contact\"><div><dt>Entity</dt><dd>{{ENTITY}}</dd></div><div><dt>Brand</dt><dd>TurboTrade.ai</dd></div><div><dt>CIN</dt><dd>{{CIN}}</dd></div><div><dt>SEBI Research Analyst Reg. No.</dt><dd>{{SEBI_RA}}</dd></div><div><dt>BSE Enlistment No.</dt><dd>{{BSE}}</dd></div><div><dt>Registered office</dt><dd>{{REGISTERED_OFFICE}}</dd></div><div><dt>Email</dt><dd><a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a></dd></div><div><dt>Phone</dt><dd><a href=\"tel:{{PHONE_TEL}}\">{{PHONE}}</a></dd></div><div><dt>Website</dt><dd><a href=\"https://www.turbotrade.ai\">www.turbotrade.ai</a></dd></div></dl>"
      }
    ]
  },
  "privacy": {
    "slug": "privacy",
    "label": "Privacy Policy",
    "titleHtml": "Privacy <em>Policy</em>",
    "lede": "How TurboTrade.ai handles your identity, KYC, broker-connection and trading data — including exactly what we never ask for.",
    "description": "TurboTrade.ai Privacy Policy under the DPDP Act 2023: data collected for KYC, broker API connectivity and automated execution, sharing, retention, security and your rights.",
    "chips": [
      "Effective: 23 September 2026",
      "Last updated: 23 September 2026",
      "SEBI RA: {{SEBI_RA}}"
    ],
    "toc": true,
    "introHtml": "",
    "sections": [
      {
        "id": "scope-of-this-policy",
        "heading": "1. Scope of this policy",
        "html": "<p>This Privacy Policy explains how <b>{{ENTITY}}</b> (\"<b>EquityPulse</b>\", \"<b>TurboTrade.ai</b>\", \"<b>we</b>\") collects, uses, shares, stores and protects personal data when you visit www.turbotrade.ai, create an account, connect a broker, subscribe to the Algo Services, or contact us.</p>\n<p>It applies to website visitors, registered users, subscribers, trial and paper-trading users, and anyone who contacts us for support, billing, grievance or privacy matters. It does not cover third-party websites, brokers, payment gateways or data vendors, which follow their own policies.</p>\n<p>It is framed under the Digital Personal Data Protection Act, 2023 and the rules made under it, the Information Technology Act, 2000 and applicable rules, and the SEBI (Research Analysts) Regulations, 2014, and should be read with our <a href=\"/terms\">Terms &amp; Conditions</a> and the Algo Services Agreement <span class=\"cl\">Art. 17</span>.</p>"
      },
      {
        "id": "our-role",
        "heading": "2. Our role",
        "html": "<p>For your personal data processed through TurboTrade.ai, EquityPulse acts as a <b>Data Fiduciary</b>, and you are the <b>Data Principal</b>. Vendors that process data for us — cloud hosting, KYC, payments, messaging, analytics, support tools — act as <b>Data Processors</b> under contracts that restrict them to our instructions and require confidentiality and security.</p>\n<p>Your broker is an independent entity. Data you give your broker, and data your broker holds about your account, is governed by your broker's own privacy policy.</p>"
      },
      {
        "id": "information-we-collect",
        "heading": "3. Information we collect",
        "html": "<h3>3.1 Identity and contact</h3>\n<ul><li>Full name, father's/mother's name (as required for the Agreement), date of birth or age confirmation;</li>\n<li>mobile number, email address, residential address;</li>\n<li>signature, e-sign records, consents, declarations and acknowledgements.</li></ul>\n<h3>3.2 KYC and regulatory information</h3>\n<ul><li>PAN, proof of identity, proof of address and Demat account details, as required under KYC norms;</li>\n<li>your KYC record fetched from a SEBI-registered KYC Registration Agency (CVL, CAMS, Karvy, NDML or DotEx KRA) so you do not have to re-submit documents;</li>\n<li>risk-profile declarations and records required for audit, RAASB/SEBI inspection and grievance handling.</li></ul>\n<p>If you use Aadhaar as proof of address, submit a masked copy (only the last four digits visible). We do not seek your full Aadhaar number or biometric data.</p>\n<h3>3.3 Broker connection and trading data</h3>\n<p>This is what makes TurboTrade different from a signals-only service. To run strategies in your own account we process:</p>\n<ul><li>your broker name and client ID, and the <b>Broker API session / access token</b> your broker issues after <b>you</b> log in on your broker's own page during daily authentication;</li>\n<li>Static IP mapping, where you use it;</li>\n<li>strategy selections, capital allocation and risk parameters you configure;</li>\n<li>orders generated and transmitted, order status, fills, rejections, positions, holdings and P&amp;L returned by the Broker API;</li>\n<li>margin and fund-availability status needed to size or block orders;</li>\n<li>Kill Switch, pause and deactivation events, and daily authentication logs.</li></ul>\n<div class=\"note\"><b>What we never collect</b>Your broker login password, trading PIN, TOTP or OTP, Demat password, bank or net-banking password, card PIN, UPI PIN or any payment authentication credential. Broker authentication happens on your broker's page; we only receive the session token your broker issues. Never share credentials with anyone claiming to be from TurboTrade.</div>\n<h3>3.4 Subscription, Credit and payment information</h3>\n<ul><li>Plan, Credits purchased, consumed, remaining and expired, AMC / Onboarding Charge, renewal, cancellation and refund records;</li>\n<li>transaction ID, date, amount, payment mode, invoice and GST details.</li></ul>\n<p>Payments are processed by authorised payment gateways and banks. We receive confirmations and status only; we do not store card numbers, UPI PINs or net-banking credentials.</p>\n<h3>3.5 Device, usage and security data</h3>\n<ul><li>IP address, approximate location, device, operating system and browser;</li>\n<li>login activity, pages and features used, session data, error and crash logs, performance metrics and security logs.</li></ul>\n<h3>3.6 Communications</h3>\n<ul><li>Emails, support tickets, chat and in-app messages, grievance submissions, privacy requests, feedback;</li>\n<li>messages exchanged on the channels we use for alerts — Platform dashboard, Telegram, WhatsApp, SMS and email;</li>\n<li>call records or notes where lawful.</li></ul>"
      },
      {
        "id": "why-we-use-your-data",
        "heading": "4. Why we use your data",
        "html": "<div class=\"tbl\" role=\"region\" tabindex=\"0\" aria-label=\"Purposes and bases of processing\"><table><caption>Purposes and bases of processing</caption><thead><tr><th scope=\"col\">Purpose</th><th scope=\"col\">Data used</th><th scope=\"col\">Basis</th></tr></thead><tbody><tr><td>Account creation, identity verification, KYC and eligibility</td><td>Identity, KYC, contact</td><td>Legal obligation; contract</td></tr><tr><td>Executing the Agreement and onboarding</td><td>Identity, contact, e-sign, consents</td><td>Contract; consent</td></tr><tr><td>Running strategies: generating and transmitting orders to your broker, monitoring positions, Kill Switch</td><td>Broker connection and trading data</td><td>Contract; your express consent to automated execution (Agreement Art. 6.2)</td></tr><tr><td>Dashboards, trade reports, P&amp;L and analytics</td><td>Trading data, usage</td><td>Contract</td></tr><tr><td>Billing, Credits, renewals, invoices, cancellations and refunds</td><td>Subscription and payment data</td><td>Contract; legal obligation (tax)</td></tr><tr><td>Strategy alerts, service and compliance notices</td><td>Contact, communications</td><td>Contract; legal obligation</td></tr><tr><td>Support and grievance handling, SCORES/ODR responses</td><td>Contact, communications, trading data relevant to the issue</td><td>Legal obligation; contract</td></tr><tr><td>Security, fraud and misuse prevention (credential sharing, scraping, unauthorised access)</td><td>Device, usage, security logs</td><td>Legitimate use permitted by law; legal obligation</td></tr><tr><td>Regulatory records, audit, SEBI/RAASB/exchange inspection</td><td>All relevant categories</td><td>Legal obligation</td></tr><tr><td>Improving Platform reliability and features</td><td>Aggregated or pseudonymised usage and performance data</td><td>Consent where required</td></tr><tr><td>Promotional communication</td><td>Contact</td><td>Consent (you can opt out)</td></tr></tbody></table></div>\n<p>We do not use your data for any purpose beyond what is necessary for these purposes, except with your consent or where the law requires.</p>"
      },
      {
        "id": "consent-and-withdrawal",
        "heading": "5. Consent and withdrawal",
        "html": "<p>Where we rely on consent, we give you a clear notice describing the data, the purpose, who it is shared with, and how to withdraw consent or complain. You can withdraw consent at any time by writing to <a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a> or through any consent setting on the Platform.</p>\n<ul><li>Withdrawing consent to broker connectivity or automated execution will stop strategy execution on your account. It does not close positions already open; manage them in your broker account or use the Kill Switch first.</li>\n<li>Withdrawal does not affect processing already done lawfully, and we may retain data we are legally required to keep.</li>\n<li>By registering and giving your mobile number, you consent to receive transactional and service messages — and promotional messages if you opt in — from our official WhatsApp Business account and other channels listed in the Agreement (Art. 21).</li>\n<li>To stop promotional messages, reply \"STOP\" on WhatsApp, use the unsubscribe link in emails, or write to us. Transactional, security, compliance and grievance messages will continue.</li></ul>"
      },
      {
        "id": "who-we-share-data-with",
        "heading": "6. Who we share data with",
        "html": "<p>We share data on a need-to-know basis only with:</p>\n<ul><li><b>Your broker</b> — orders and related instructions are transmitted to your broker through its API; this is essential to the service you ask for;</li>\n<li>KYC Registration Agencies and KYC/verification vendors;</li>\n<li>payment gateways, banks and payment service providers;</li>\n<li>cloud hosting, infrastructure, market-data and technology vendors;</li>\n<li>messaging providers (email, SMS, WhatsApp Business, Telegram) used to deliver alerts;</li>\n<li>customer support, ticketing, analytics and security-monitoring tools;</li>\n<li>legal, tax, audit and compliance professionals;</li>\n<li>SEBI, BSE/RAASB, stock exchanges, courts, tribunals, tax and law-enforcement authorities when legally required;</li>\n<li>a successor entity in a merger, acquisition or restructuring, subject to this Policy.</li></ul>\n<p><b>We do not sell or rent your personal data.</b> Broker revenue-sharing arrangements disclosed in our <a href=\"/terms\">Terms</a> do not involve selling your personal data.</p>"
      },
      {
        "id": "cookies-and-tracking",
        "heading": "7. Cookies and tracking",
        "html": "<p>We use cookies, pixels, tags and similar technologies to keep you signed in, remember preferences (including accessibility settings), measure performance, detect security issues and measure marketing campaigns. Our website uses advertising and analytics pixels, such as Meta Pixel, for campaign measurement.</p>\n<p>You can block or delete cookies in your browser settings. Essential cookies are needed for login and security; blocking them may break parts of the Platform.</p>"
      },
      {
        "id": "retention",
        "heading": "8. Retention",
        "html": "<p>We keep personal data only as long as needed for the purposes above, and for the periods required by law. SEBI Research Analyst regulations require us to keep records such as KYC, agreements, fee and payment records, communications and research records for prescribed periods (currently at least five years). Tax, audit and dispute-resolution requirements may require longer retention.</p>\n<p>Some records will therefore survive account closure, cancellation, consent withdrawal or an erasure request. When the retention period ends, we delete, anonymise or securely archive the data.</p>"
      },
      {
        "id": "security",
        "heading": "9. Security",
        "html": "<p>TurboTrade.ai operates under an information security management system certified to <b>ISO/IEC 27001:2022</b>. Our safeguards include:</p>\n<ul><li>encryption in transit and at rest, including for broker session tokens;</li>\n<li>role-based access, multi-factor authentication and least-privilege access for staff;</li>\n<li>firewalls, monitoring, logging and intrusion detection;</li>\n<li>vulnerability testing, security reviews, backups and incident response procedures;</li>\n<li>vendor due diligence and contractual security obligations.</li></ul>\n<p>No system connected to the internet is completely secure. Please use a strong password, keep your devices secure and never share credentials.</p>"
      },
      {
        "id": "personal-data-breach",
        "heading": "10. Personal data breach",
        "html": "<p>If a personal data breach occurs, we will contain and investigate it and notify affected users and the Data Protection Board of India and other authorities where required by law. The notice will describe the breach, likely impact, what we have done, and steps you can take. Report suspected unauthorised access, phishing or suspicious messages to <a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a> immediately.</p>"
      },
      {
        "id": "your-rights",
        "heading": "11. Your rights",
        "html": "<p>Subject to applicable law, you can:</p>\n<ul><li>obtain a summary of the personal data we process and the processing activities;</li>\n<li>correct, complete or update your data;</li>\n<li>request erasure of data no longer needed, subject to legal retention requirements;</li>\n<li>withdraw consent;</li>\n<li>nominate another person to exercise your rights in the event of death or incapacity;</li>\n<li>raise a grievance with us, and, if unresolved, approach the Data Protection Board of India.</li></ul>\n<p>We may need to verify your identity before acting on a request.</p>"
      },
      {
        "id": "children",
        "heading": "12. Children",
        "html": "<p>TurboTrade.ai is only for persons legally competent to contract and participate in the securities market. We do not knowingly process personal data of anyone under 18. If we learn that we have, we will delete it, subject to law.</p>"
      },
      {
        "id": "where-your-data-is-stored",
        "heading": "13. Where your data is stored",
        "html": "<p>We store data on servers located in India wherever possible. Where a service provider processes data outside India, we do so only as permitted by Indian law and any restrictions notified by the Government of India, with contractual and security safeguards.</p>"
      },
      {
        "id": "your-security-responsibilities",
        "heading": "14. Your security responsibilities",
        "html": "<ul><li>Keep your TurboTrade login and your broker credentials confidential; never share OTPs, PINs or passwords.</li>\n<li>Do not share account access with others.</li>\n<li>Keep your email and mobile number updated.</li>\n<li>Use secure devices and networks, and log out on shared devices.</li>\n<li>Report suspicious activity immediately.</li></ul>\n<p>We are not responsible for losses caused by compromised devices, shared credentials, phishing or malware arising from your own conduct.</p>"
      },
      {
        "id": "privacy-requests-and-grievances",
        "heading": "15. Privacy requests and grievances",
        "html": "<p>Write to our privacy contact for access, correction, erasure, consent withdrawal, nomination or any privacy concern. We aim to respond to a complete, verifiable request within <b>30 days</b>.</p>\n<dl class=\"contact\"><div><dt>Entity</dt><dd>{{ENTITY}}</dd></div><div><dt>Brand</dt><dd>TurboTrade.ai</dd></div><div><dt>CIN</dt><dd>{{CIN}}</dd></div><div><dt>SEBI Research Analyst Reg. No.</dt><dd>{{SEBI_RA}}</dd></div><div><dt>BSE Enlistment No.</dt><dd>{{BSE}}</dd></div><div><dt>Registered office</dt><dd>{{REGISTERED_OFFICE}}</dd></div><div><dt>Email</dt><dd><a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a></dd></div><div><dt>Phone</dt><dd><a href=\"tel:{{PHONE_TEL}}\">{{PHONE}}</a></dd></div><div><dt>Website</dt><dd><a href=\"https://www.turbotrade.ai\">www.turbotrade.ai</a></dd></div><div><dt>Privacy contact</dt><dd>Chief Information Security Officer, {{ENTITY}}</dd></div></dl>\n<p class=\"foot-note\">Privacy grievances are different from securities-market grievances. For service, billing or investor complaints, use our <a href=\"/grievance-redressal\">Grievance Redressal</a> process, SEBI SCORES or Smart ODR.</p>"
      },
      {
        "id": "changes-to-this-policy",
        "heading": "16. Changes to this policy",
        "html": "<p>We may update this Policy for legal, regulatory or operational reasons. The current version, with its effective date, is always on this page. We will notify you of material changes through the Platform or email. Continued use after the effective date means you accept the updated Policy.</p>"
      }
    ]
  },
  "cancellation-refund": {
    "slug": "cancellation-refund",
    "label": "Cancellation & Refund Policy",
    "titleHtml": "Cancellation &amp; <em>Refund Policy</em>",
    "lede": "What is refundable at TurboTrade.ai, what is not, and exactly how refunds on unused Credits are calculated.",
    "description": "TurboTrade.ai Cancellation & Refund Policy: non-refundable AMC, subscription cancellation, refund of unused non-expired Credits at ₹10 per Credit less 60-day deduction.",
    "chips": [
      "Effective: 23 September 2026",
      "Last updated: 23 September 2026",
      "SEBI RA: {{SEBI_RA}}"
    ],
    "toc": true,
    "introHtml": "",
    "sections": [
      {
        "id": "at-a-glance",
        "heading": "1. At a glance",
        "html": "<div class=\"tbl\" role=\"region\" tabindex=\"0\" aria-label=\"Refund eligibility summary\"><table><caption>Refund eligibility summary</caption><thead><tr><th scope=\"col\">Item</th><th scope=\"col\">Refundable?</th><th scope=\"col\">Reference</th></tr></thead><tbody><tr><td>AMC / Onboarding Charge (₹500)</td><td><b>Never</b> — in any circumstance</td><td>Art. 13.11, 23.3</td></tr><tr><td>Fixed Subscription fees (Monthly / Quarterly / Annual / Strategy-specific)</td><td>No — access continues until the end of the paid cycle; no pro-rata refund</td><td>Art. 23.1, 24.3</td></tr><tr><td>Unused, non-expired Credits</td><td>Yes, on a valid and accepted request — at ₹10 per Credit, after the 60-day service deduction and taxes</td><td>Art. 13.10, 23.4</td></tr><tr><td>Consumed Credits</td><td>No</td><td>Art. 23.1</td></tr><tr><td>Expired Credits</td><td>No — forfeited automatically</td><td>Art. 13.9, 13.10(b)</td></tr><tr><td>Subscription if our SEBI registration is suspended for more than 60 days or cancelled</td><td>Yes — pro-rata from the date of SEBI's action to the end of the prepaid period</td><td>Art. 25.2</td></tr><tr><td>Termination for fraud, misrepresentation or breach of confidentiality</td><td>No refund of any nature</td><td>Art. 25.3</td></tr><tr><td>Goodwill refund in extraordinary circumstances</td><td>Only at EquityPulse's sole discretion</td><td>Art. 26</td></tr></tbody></table></div><p class=\"foot-note\">This page summarises Part IV (Articles 23–26) and Article 13 of the TurboTrade Algo Services Comprehensive Legal Agreement. If anything here differs from the Agreement you executed, the Agreement prevails.</p>"
      },
      {
        "id": "general-principle-fees-are-non-refundable",
        "heading": "2. General principle: fees are non-refundable",
        "html": "<p>All fees — Fixed Subscription fees and Credit pack purchases — are, as a general rule, <b>non-refundable</b>. Partial or unused time in a subscription period does not entitle you to a refund <span class=\"cl\">Art. 23.1</span>.</p>\n<p>Fees pay for access to technology infrastructure, trading models, execution capability and platform services — <b>not</b> for any assured outcome, guaranteed return or specific performance of a strategy <span class=\"cl\">23.5</span>.</p>\n<h3>No refund is given for <span class=\"cl\">23.2</span></h3>\n<ul><li>trading losses or portfolio losses;</li>\n<li>strategy underperformance;</li>\n<li>market volatility, black-swan events or regulatory changes;</li>\n<li>dissatisfaction with trading outcomes;</li>\n<li>technical disruptions caused by your broker, an exchange, your internet provider or any other third party;</li>\n<li>your own error, misconfiguration, missed daily authentication or failure to monitor your account;</li>\n<li>any Force Majeure event.</li></ul>"
      },
      {
        "id": "amc-onboarding-charge",
        "heading": "3. AMC / Onboarding Charge",
        "html": "<p>The one-time AMC / Onboarding Charge of ₹500 covers onboarding, account setup and technical implementation for your broker configuration. It is strictly, absolutely and unconditionally non-refundable — whether or not you use the service, and irrespective of any cancellation, termination or dispute. Refund requests for it will not be entertained <span class=\"cl\">Art. 13.11, 23.3</span>.</p>\n<p>We may revise this charge in future and may deduct a revised charge from your Credit balance or ask you to pay it upfront before continued access.</p>"
      },
      {
        "id": "cancelling-a-fixed-subscription",
        "heading": "4. Cancelling a Fixed Subscription",
        "html": "<ul><li><b>How:</b> use self-service cancellation on the dashboard, email <a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a>, or raise a support ticket on the Platform <span class=\"cl\">Art. 24.1</span>.</li>\n<li><b>When it takes effect:</b> on the date we acknowledge and confirm your request in writing <span class=\"cl\">24.2</span>.</li>\n<li><b>What happens next:</b> you keep access until the end of the current prepaid billing cycle. No pro-rated or partial refund is issued for the remaining period <span class=\"cl\">24.3</span>.</li>\n<li><b>Auto-renewal:</b> plans renew automatically at the then-prevailing rate. Cancel before the renewal date to avoid the next charge <span class=\"cl\">13.3</span>.</li></ul>\n<div class=\"note\"><b>Before you cancel</b>Cancelling does not close open positions. Square off or manage open positions in your broker account, or use the Emergency Kill Switch, before your access ends.</div>"
      },
      {
        "id": "refund-of-unused-credits",
        "heading": "5. Refund of unused Credits",
        "html": "<p>On a valid and accepted refund request, unused, <b>non-expired</b> Credits are refundable at their monetary value. Expired and consumed Credits are not <span class=\"cl\">Art. 13.10, 23.1</span>.</p>\n<h3>How the amount is calculated <span class=\"cl\">13.10(c), 23.4</span></h3>\n<ol><li>Take your remaining non-expired Credits × <b>₹10</b>.</li>\n<li>Deduct the <b>60-day service charge</b> — the monetary value of sixty calendar days of service, or the equivalent number of Credits representing sixty days of service, on your pricing model.</li>\n<li>Deduct applicable GST or statutory amounts.</li>\n<li>The AMC / Onboarding Charge is never part of any refund.</li></ol>\n<div class=\"note\"><b>Formula</b>Refund = (Remaining non-expired Credits × ₹10) − 60-day service deduction − applicable taxes</div>\n<p>The 60-day deduction applies to every client-initiated cancellation or Credit refund request, whatever the reason, and is separate from the non-refundable AMC / Onboarding Charge.</p>\n<p><b>Timeline:</b> accepted Credit refunds are processed within <b>14 Working Days</b> of our acceptance of the request <span class=\"cl\">13.10(a)</span>.</p>"
      },
      {
        "id": "cancellation-by-equitypulse",
        "heading": "6. Cancellation by EquityPulse",
        "html": "<p>We may suspend, restrict or terminate your Subscription, with or without notice, for <span class=\"cl\">Art. 25.1</span>:</p>\n<ul><li>breach or suspected breach of the Agreement;</li>\n<li>false, misleading or incomplete information;</li>\n<li>misuse, abuse or unauthorised exploitation of the Platform;</li>\n<li>non-payment or chargeback of fees;</li>\n<li>a regulatory directive or court order;</li>\n<li>a decision to discontinue service to you in the interest of market integrity or compliance.</li></ul>\n<p>If termination is for fraud, material misrepresentation or breach of confidentiality, no refund of any kind is payable <span class=\"cl\">25.3</span>.</p>\n<div class=\"note ok\"><b>If our SEBI registration is affected <span class=\"cl\">25.2</span></b>If SEBI suspends our registration for more than 60 calendar days, or cancels it, we will refund Subscription Fees pro-rata from the effective date of SEBI's action to the end of your prepaid period.</div>"
      },
      {
        "id": "discretionary-goodwill-refunds",
        "heading": "7. Discretionary goodwill refunds",
        "html": "<p>In extraordinary circumstances EquityPulse may, at its sole discretion, grant a one-time goodwill refund. We are not obliged to give reasons for granting or declining one, and a goodwill refund does not set a precedent, create any future obligation, or admit liability <span class=\"cl\">Art. 26</span>.</p>"
      },
      {
        "id": "how-to-request-a-refund",
        "heading": "8. How to request a refund",
        "html": "<div class=\"steps\">\n<div class=\"step\"><div><h3>Write to us</h3><p>Email <a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a> or raise a Platform ticket from your registered email or account.</p></div></div>\n<div class=\"step\"><div><h3>Include the details</h3><p>Registered name, mobile, PAN (last four characters only), plan or Credit pack, payment transaction ID, date, and the reason for the request.</p></div></div>\n<div class=\"step\"><div><h3>We review and confirm</h3><p>We confirm eligibility and the computed amount in writing. Accepted Credit refunds are paid within 14 Working Days.</p></div></div>\n</div>\n<p>If you disagree with a refund decision, raise it through our <a href=\"/grievance-redressal\">Grievance Redressal</a> process. You may escalate to SEBI SCORES or Smart ODR.</p>"
      },
      {
        "id": "payments-and-chargebacks",
        "heading": "9. Payments and chargebacks",
        "html": "<ul><li>Pay only through non-cash modes — cheque, NEFT, RTGS, IMPS or UPI to our validated UPI handle <b>{{UPI}}</b>, verified on SEBI Check. Never pay cash or to a personal account <span class=\"cl\">Art. 13.13</span>.</li>\n<li>If you initiate a chargeback instead of using this process, we may suspend or terminate your access <span class=\"cl\">25.1(d)</span>.</li></ul>"
      },
      {
        "id": "contact",
        "heading": "10. Contact",
        "html": "<dl class=\"contact\"><div><dt>Entity</dt><dd>{{ENTITY}}</dd></div><div><dt>Brand</dt><dd>TurboTrade.ai</dd></div><div><dt>CIN</dt><dd>{{CIN}}</dd></div><div><dt>SEBI Research Analyst Reg. No.</dt><dd>{{SEBI_RA}}</dd></div><div><dt>BSE Enlistment No.</dt><dd>{{BSE}}</dd></div><div><dt>Registered office</dt><dd>{{REGISTERED_OFFICE}}</dd></div><div><dt>Email</dt><dd><a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a></dd></div><div><dt>Phone</dt><dd><a href=\"tel:{{PHONE_TEL}}\">{{PHONE}}</a></dd></div><div><dt>Website</dt><dd><a href=\"https://www.turbotrade.ai\">www.turbotrade.ai</a></dd></div></dl>"
      }
    ]
  },
  "disclaimer": {
    "slug": "disclaimer",
    "label": "Risk Disclosure & Disclaimer",
    "titleHtml": "Risk Disclosure &amp; <em>Disclaimer</em>",
    "lede": "The risks of automated trading on TurboTrade.ai — markets, Blackbox strategies, broker APIs, backtests — and what our SEBI registration does and does not mean.",
    "description": "TurboTrade.ai Risk Disclosure & Disclaimer: automated algo trading risk, Blackbox strategies, Broker API dependency, backtesting, conflict of interest. SEBI RA {{SEBI_RA}}.",
    "chips": [
      "Effective: 23 September 2026",
      "Last updated: 23 September 2026",
      "SEBI RA: {{SEBI_RA}}"
    ],
    "toc": true,
    "introHtml": "",
    "sections": [
      {
        "id": "read-this-before-you-trade",
        "heading": "1. Read this before you trade",
        "html": "<p>This Risk Disclosure &amp; Disclaimer reproduces the substance of Part II (Articles 7–12) of the TurboTrade Algo Services Comprehensive Legal Agreement and forms part of it. Read it with our <a href=\"/terms\">Terms &amp; Conditions</a> and <a href=\"/cancellation-refund\">Cancellation &amp; Refund Policy</a>.</p>"
      },
      {
        "id": "regulatory-status",
        "heading": "2. Regulatory status",
        "html": "<dl class=\"reg\"><div><dt>Entity</dt><dd>{{ENTITY}}</dd></div><div><dt>SEBI Research Analyst</dt><dd>{{SEBI_RA}}</dd></div><div><dt>BSE Enlistment No.</dt><dd>{{BSE}}</dd></div><div><dt>CIN</dt><dd>{{CIN}}</dd></div></dl>\n<ul><li>SEBI registration authorises us to provide research services. It does not mean SEBI endorses the quality, accuracy or reliability of our services, and it does not guarantee or assure returns <span class=\"cl\">Art. 7.1</span>.</li>\n<li>We provide algorithmic research services and strategy recommendations. We are <b>not</b> registered as an Investment Adviser or Portfolio Manager <span class=\"cl\">7.2</span>.</li>\n<li>SEBI registration, BSE enlistment and NISM certification of our personnel do not, individually or together, guarantee performance or assure any return <span class=\"cl\">7.3 · M.9</span>.</li></ul>"
      },
      {
        "id": "market-risk",
        "heading": "3. Market risk",
        "html": "<ul><li>Trading in equities, equity derivatives (futures and options), currency and commodity derivatives, debt and other instruments carries significant market risk. There is no assurance of returns. You may lose more than your initial capital, particularly in leveraged and derivative positions <span class=\"cl\">Art. 8.1</span>.</li>\n<li>Past performance of any strategy or model does not guarantee future performance <span class=\"cl\">8.2</span>.</li>\n<li>Signals may not be profitable; markets can move materially against modelled trends <span class=\"cl\">8.3</span>.</li>\n<li>EquityPulse bears no liability for losses from reliance on strategy signals, research or automated execution through the Platform <span class=\"cl\">8.4</span>.</li>\n<li>Assess your financial condition, objectives, risk tolerance and liquidity needs, and consider consulting a SEBI-registered Investment Adviser before committing capital <span class=\"cl\">8.5</span>.</li></ul>\n<div class=\"tbl\" role=\"region\" tabindex=\"0\" aria-label=\"Risk by asset category (Art. 8)\"><table><caption>Risk by asset category (Art. 8)</caption><thead><tr><th scope=\"col\">No.</th><th scope=\"col\">Asset category</th><th scope=\"col\">Principal risk factors</th></tr></thead><tbody><tr><td>1</td><td>Equity &amp; equity-linked</td><td>Price volatility from macroeconomic factors, company events and sentiment; settlement and liquidity risk.</td></tr><tr><td>2</td><td>Debt instruments</td><td>Credit (issuer default), liquidity, interest-rate and reinvestment risk.</td></tr><tr><td>3</td><td>Foreign securities &amp; GDRs</td><td>Currency, sovereign, political and cross-border credit risk; FX moves can erode rupee returns.</td></tr><tr><td>4</td><td>Derivatives &amp; options</td><td>Leverage, counterparty, valuation and liquidity risk; uncovered or speculative positions can lose more than initial margin.</td></tr><tr><td>5</td><td>Algorithmic &amp; Blackbox strategies</td><td>Logic not disclosed; performance depends on technology, Broker API stability and market microstructure; backtests may differ materially from live; slippage, latency, partial-fill, API-failure and model-degradation risk.</td></tr></tbody></table></div>"
      },
      {
        "id": "blackbox-strategies",
        "heading": "4. Blackbox strategies",
        "html": "<p>Most TurboTrade strategies are <b>Blackbox Algorithms</b>: the computational logic, parameters, signal methodology and exit rules are proprietary and will not be disclosed to you <span class=\"cl\">Art. 1(c), 4.5</span>. By subscribing you accept that you cannot inspect why a specific trade was taken, and that questions about trade logic, signal rationale or entry/exit timing are outside our grievance mechanism <span class=\"cl\">Art. 28(c)</span>.</p>\n<p>The systems are deterministic, rule-based software. They are not autonomous, self-learning systems operating outside parameters defined by our research and technology team <span class=\"cl\">Art. 6.1</span>.</p>"
      },
      {
        "id": "automated-execution-and-your-consent",
        "heading": "5. Automated execution and your consent",
        "html": "<ul><li>By executing the Agreement you consent to automated execution of trades in your Demat account through your Broker API, based on signals from our rule-based systems, within parameters <b>you</b> configure <span class=\"cl\">Art. 6.2</span>.</li>\n<li>Automation does not eliminate, reduce or transfer investment risk <span class=\"cl\">6.4(a)</span>.</li>\n<li>All trades are in your own account, under your authority. You bear full legal, financial and regulatory responsibility for all trading activity in your account <span class=\"cl\">4.6</span>.</li>\n<li>You must configure risk parameters, keep adequate margin, and monitor Platform connectivity and Broker API status <span class=\"cl\">6.3</span>.</li></ul>"
      },
      {
        "id": "broker-api-execution-and-technology-risk",
        "heading": "6. Broker API, execution and technology risk",
        "html": "<ul><li><b>Broker API dependency.</b> The Platform depends entirely on your broker's API. We do not control or guarantee it. Token expiry, broker server failures or connectivity loss can stop the Platform from placing, modifying or cancelling orders — leading to missed signals, <b>unhedged or unexited positions</b> and financial loss <span class=\"cl\">Art. 10.1</span>.</li>\n<li><b>Execution risk.</b> Latency and volatility cause slippage; low liquidity causes partial fills <span class=\"cl\">10.2</span>.</li>\n<li><b>Technology risk.</b> Servers, software, databases and third-party services can fail or go down, with or without notice <span class=\"cl\">10.3</span>.</li>\n<li><b>Market disruptions.</b> Corporate actions, expiry cycles, circuit breakers, trading halts and regulatory interventions can hurt automated strategies <span class=\"cl\">10.4</span>.</li></ul>"
      },
      {
        "id": "daily-authentication-and-positional-risk",
        "heading": "7. Daily authentication and positional risk",
        "html": "<div class=\"note warn\"><b>If you miss daily authentication, the risk is yours.</b>Broker API re-authentication is mandatory every trading day before strategies can execute. If you hold positional trades and do not authenticate before the scheduled exit or management time, all risk of unmanaged or unexited positions — losses, margin penalties, regulatory consequences — falls entirely on you <span class=\"cl\">Art. 3.4 · M.12</span>.</div>\n<p>For investing baskets, rebalance signals are non-discretionary recommendations. You must authenticate on the day the signal is generated if you choose to act on it <span class=\"cl\">Art. 3.6</span>.</p>"
      },
      {
        "id": "emergency-kill-switch",
        "heading": "8. Emergency Kill Switch",
        "html": "<p>The Platform gives you a Kill Switch to square off all running positions across strategies, or selected positions. Kill Switch orders are market or best-available-price orders sent through your Broker API and face the same constraints as any order — API availability, liquidity and exchange hours. Instant execution is <b>not guaranteed</b>, and we are not liable for losses from delays, partial fills or market conditions at the time you use it <span class=\"cl\">M.11</span>.</p>"
      },
      {
        "id": "backtests-paper-trading-and-performance-figures",
        "heading": "9. Backtests, paper trading and performance figures",
        "html": "<ul><li>Backtests use historical data under idealised assumptions and are for information only — not a predictor of live results <span class=\"cl\">Art. 9.1–9.3</span>.</li>\n<li>Unless stated otherwise, backtests assume perfect fills at signal prices, no slippage or transaction costs, unlimited liquidity and continuous market availability. These do not hold in live markets <span class=\"cl\">9.6</span>.</li>\n<li>Paper-traded and simulated results may differ materially from live trading because of order-book impact, microstructure, capital constraints and broker processing <span class=\"cl\">9.4, 5.2B</span>.</li>\n<li>Where the Platform shows returns, it states the basis (absolute or percentage), the period, whether figures are gross of costs, and that past performance is not indicative of the future <span class=\"cl\">Art. 11.1</span>.</li>\n<li>Market data comes from exchanges, licensed vendors and third-party APIs, is not independently audited by us, and can be delayed or wrong <span class=\"cl\">11.2</span>.</li>\n<li>Unless otherwise stated, percentage returns are absolute returns. Performance for any period before a strategy's launch date is backtested and was not delivered to the public for actual trading.</li>\n<li>When strategies place market orders, different users may get different fill prices for the same signal, because of timing, liquidity and broker processing.</li></ul>\n<div class=\"note\"><b>Backtesting disclaimer</b>All simulated performance is based on historical price data and does not represent live trading. Strategy metrics are for educational and research purposes only and are not investment advice. Past performance and backtests do not guarantee future results. Trade only with funds you can afford to lose. EquityPulse / TurboTrade.ai bears no liability for investment decisions based on backtested performance.</div>"
      },
      {
        "id": "free-trial-risk",
        "heading": "10. Free trial risk",
        "html": "<p>A demo or free trial may include <b>real trades of short duration</b> to verify broker connectivity and execution. These are real trades with real financial risk; any loss during a trial is yours <span class=\"cl\">Art. 5.2A</span>.</p>"
      },
      {
        "id": "conflict-of-interest",
        "heading": "11. Conflict of interest",
        "html": "<ul><li>We comply with the RA Regulations on disclosing and managing conflicts of interest <span class=\"cl\">Art. 12.1</span>.</li>\n<li>EquityPulse and its officers, directors, employees and associates do not hold, trade in or benefit from positions in securities that are the subject of a current strategy recommendation <span class=\"cl\">12.2</span>.</li>\n<li>As of the date of the Agreement there are no material conflicts arising from connections with any issuer; any future conflict will be disclosed promptly <span class=\"cl\">12.3</span>.</li>\n<li>Our employees and associates have received no compensation from issuers whose securities are the subject of our strategies <span class=\"cl\">12.4</span>.</li>\n<li><b>Broker revenue sharing:</b> we may receive a share of brokerage from brokers empanelled on TurboTrade.ai for trades executed through the Platform. It costs you nothing extra, does not influence strategy outputs, and does not restrict your choice of broker <span class=\"cl\">12.5 · M.5</span>.</li></ul>"
      },
      {
        "id": "no-assured-returns-no-advice-no-fiduciary-relati",
        "heading": "12. No assured returns, no advice, no fiduciary relationship",
        "html": "<ul><li>Any scheme or representation offering guaranteed, assured or fixed returns is prohibited by law. We make no such representation <span class=\"cl\">M.6–M.7</span>.</li>\n<li>We do not provide personalised investment, tax, legal or accounting advice <span class=\"cl\">Art. 2.2, 20</span>. Our research is not an offer or solicitation to buy or sell any security, and does not take into account your individual objectives, financial situation or needs.</li>\n<li>No fiduciary, advisory, agency or partnership relationship is created <span class=\"cl\">Art. 38</span>.</li>\n<li>You waive claims for losses suffered in connection with strategy execution; there is no recourse against EquityPulse for trading losses <span class=\"cl\">Art. 4.4 · M.8</span>.</li></ul>"
      },
      {
        "id": "limitation-of-liability-and-force-majeure",
        "heading": "13. Limitation of liability and force majeure",
        "html": "<p>Our aggregate liability is capped at the Subscription Fees (excluding the AMC / Onboarding Charge) paid in the three calendar months before the claim. We are not liable for trading losses, lost profits, indirect or consequential loss, broker or exchange failures, data errors, Force Majeure events, or your failure to monitor or intervene. The Platform is provided \"as is\" and \"as available\" <span class=\"cl\">Art. 18, 22</span>.</p>"
      },
      {
        "id": "security-warning",
        "heading": "14. Security warning",
        "html": "<div class=\"note warn\"><b>We will never ask for your passwords or OTPs.</b>No one from EquityPulse or TurboTrade.ai will ask for login credentials, passwords, OTPs or authentication details for your trading, Demat, bank or any other financial account. Never share them. Report any such request to us at <a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a> and to SEBI <span class=\"cl\">Art. 17.3 · M.15</span>.</div>"
      },
      {
        "id": "your-acknowledgement",
        "heading": "15. Your acknowledgement",
        "html": "<p>By subscribing you confirm that you <span class=\"cl\">Execution & Client Acknowledgement</span>:</p>\n<ol class=\"alpha\"><li>have read and understood the Agreement, including these risk disclosures;</li>\n<li>were not induced, coerced or misled into subscribing;</li>\n<li>accept the Blackbox nature of the strategies and the absence of any guaranteed return;</li>\n<li>accept all risks of algorithmic trading, sole responsibility for outcomes, and the daily authentication requirement;</li>\n<li>can financially sustain potential losses and have assessed your own risk tolerance and position.</li></ol>"
      },
      {
        "id": "contact",
        "heading": "16. Contact",
        "html": "<dl class=\"contact\"><div><dt>Entity</dt><dd>{{ENTITY}}</dd></div><div><dt>Brand</dt><dd>TurboTrade.ai</dd></div><div><dt>CIN</dt><dd>{{CIN}}</dd></div><div><dt>SEBI Research Analyst Reg. No.</dt><dd>{{SEBI_RA}}</dd></div><div><dt>BSE Enlistment No.</dt><dd>{{BSE}}</dd></div><div><dt>Registered office</dt><dd>{{REGISTERED_OFFICE}}</dd></div><div><dt>Email</dt><dd><a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a></dd></div><div><dt>Phone</dt><dd><a href=\"tel:{{PHONE_TEL}}\">{{PHONE}}</a></dd></div><div><dt>Website</dt><dd><a href=\"https://www.turbotrade.ai\">www.turbotrade.ai</a></dd></div></dl>"
      }
    ]
  },
  "grievance-redressal": {
    "slug": "grievance-redressal",
    "label": "Grievance Redressal",
    "titleHtml": "Grievance <em>Redressal</em>",
    "lede": "How to raise a complaint with TurboTrade.ai, what we resolve and how fast, and how to escalate to SEBI SCORES and Smart ODR.",
    "description": "TurboTrade.ai Grievance Redressal Policy: escalation matrix, 7 working day resolution, SEBI SCORES and Smart ODR escalation for {{ENTITY}}, SEBI RA {{SEBI_RA}}.",
    "chips": [
      "Effective: 23 September 2026",
      "Last updated: 23 September 2026",
      "SEBI RA: {{SEBI_RA}}"
    ],
    "toc": true,
    "introHtml": "",
    "sections": [
      {
        "id": "purpose",
        "heading": "1. Purpose",
        "html": "<p>This policy sets out how {{ENTITY}}, operating TurboTrade.ai, records, investigates and resolves service grievances fairly, transparently and within defined timelines, and how you can escalate to SEBI. It reproduces Part V (Articles 27–29) of the TurboTrade Algo Services Comprehensive Legal Agreement.</p>\n<p>We aim to treat every complainant without bias, keep you informed, maintain complaint records for compliance, and fix the root cause where a Platform issue is found.</p>"
      },
      {
        "id": "what-you-can-raise-as-a-grievance",
        "heading": "2. What you can raise as a grievance",
        "html": "<p>We will investigate and resolve these service grievances within the prescribed timelines <span class=\"cl\">Art. 27</span>:</p>\n<ol class=\"alpha\"><li>Platform access failures, login disruptions or account lockouts caused by a Platform-side error;</li>\n<li>strategy activation or deactivation failures caused by a demonstrable Platform system error;</li>\n<li>order transmission failures directly and exclusively attributable to Platform-side defects;</li>\n<li>billing discrepancies, erroneous fee or Credit deductions, or payment processing failures;</li>\n<li>dashboard mismatches or material inaccuracies in reported positions or P&amp;L;</li>\n<li>alert or notification delivery failures caused by Platform infrastructure defects;</li>\n<li>account mapping or broker connectivity errors arising at the Platform level.</li></ol>\n<p>Refund disputes, KYC and onboarding problems, and conduct of our staff can also be raised through this process.</p>"
      },
      {
        "id": "what-is-outside-this-mechanism",
        "heading": "3. What is outside this mechanism",
        "html": "<p>These matters are not handled as service grievances <span class=\"cl\">Art. 28</span>:</p>\n<ol class=\"alpha\"><li>strategy performance, profitability, win rate or trading outcome;</li>\n<li>drawdowns, mark-to-market losses or risk exposure from market movements;</li>\n<li>trade logic, signal rationale, entry/exit timing or decisions of any Blackbox strategy;</li>\n<li>market gaps, slippage, partial fills or liquidity constraints;</li>\n<li>broker-side execution issues, margin shortfalls or risk actions by your broker;</li>\n<li>losses from failure to maintain margin, connectivity or position monitoring;</li>\n<li>losses from missing mandatory daily authentication.</li></ol>\n<div class=\"note\"><b>Broker-side issue?</b>Order rejections, margin calls and square-offs by your broker should be raised with your broker first. You can still write to us — if we find a Platform-side cause, we will treat it as a valid grievance. Your statutory right to approach SEBI SCORES or Smart ODR is not affected by this list.</div>"
      },
      {
        "id": "how-to-raise-a-grievance",
        "heading": "4. How to raise a grievance",
        "html": "<dl class=\"contact\"><div><dt>Entity</dt><dd>{{ENTITY}}</dd></div><div><dt>Brand</dt><dd>TurboTrade.ai</dd></div><div><dt>CIN</dt><dd>{{CIN}}</dd></div><div><dt>SEBI Research Analyst Reg. No.</dt><dd>{{SEBI_RA}}</dd></div><div><dt>BSE Enlistment No.</dt><dd>{{BSE}}</dd></div><div><dt>Registered office</dt><dd>{{REGISTERED_OFFICE}}</dd></div><div><dt>Email</dt><dd><a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a></dd></div><div><dt>Phone</dt><dd><a href=\"tel:{{PHONE_TEL}}\">{{PHONE}}</a></dd></div><div><dt>Website</dt><dd><a href=\"https://www.turbotrade.ai\">www.turbotrade.ai</a></dd></div><div><dt>Grievance Redressal / Compliance Officer</dt><dd>{{ENTITY}} — <a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a></dd></div></dl>\n<p>You can also write to our registered office. Complaints sent through unofficial channels (personal numbers, social media DMs) may not be treated as valid until acknowledged through an official channel.</p>\n<h3>Include these details</h3>\n<ul><li>full name, registered email and mobile number;</li>\n<li>TurboTrade client ID and linked broker;</li>\n<li>strategy, plan or Credit pack concerned;</li>\n<li>payment transaction ID, if billing-related;</li>\n<li>date and time of the issue, order IDs and screenshots where relevant;</li>\n<li>the resolution you are seeking.</li></ul>\n<p>Never include passwords, OTPs or full card or bank numbers in a complaint.</p>"
      },
      {
        "id": "registration-and-acknowledgement",
        "heading": "5. Registration and acknowledgement",
        "html": "<ul><li><b>By phone:</b> the grievance is logged in our system during the call. Simple issues are resolved on the call; anything needing investigation is escalated internally and confirmed to you in writing.</li>\n<li><b>By email or letter:</b> the grievance is recorded on receipt and given a unique grievance reference number, then assigned to the Grievance Redressal / Compliance Officer.</li>\n<li>Our acknowledgement gives the date of receipt, the reference number and the expected resolution timeline.</li>\n<li>If the matter is outside the scope of our services (see section 3), we will tell you so and, where possible, point you to the right party, such as your broker.</li></ul>"
      },
      {
        "id": "escalation-matrix-and-timelines",
        "heading": "6. Escalation matrix and timelines",
        "html": "<p>Every grievance is recorded with a reference number and handled under the supervision of the Grievance Redressal / Compliance Officer <span class=\"cl\">Art. 29.1</span>.</p>\n<div class=\"tbl\" role=\"region\" tabindex=\"0\" aria-label=\"Escalation matrix (Art. 29.1 · M.13)\"><table><caption>Escalation matrix (Art. 29.1 · M.13)</caption><thead><tr><th scope=\"col\">Level</th><th scope=\"col\">Where</th><th scope=\"col\">Contact / channel</th><th scope=\"col\">Resolution timeline</th></tr></thead><tbody><tr><td>1</td><td>TurboTrade Support — Grievance Redressal / Compliance Officer</td><td><a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a> · <a href=\"tel:{{PHONE_TEL}}\">{{PHONE}}</a> · <a href=\"https://www.turbotrade.ai\">www.turbotrade.ai</a></td><td>Within <b>7 Working Days</b></td></tr><tr><td>2</td><td>SEBI SCORES</td><td><a href=\"https://scores.sebi.gov.in\" target=\"_blank\" rel=\"noopener noreferrer\">scores.sebi.gov.in</a></td><td>As per SEBI-prescribed timelines</td></tr><tr><td>3</td><td>Online Dispute Resolution (Smart ODR)</td><td><a href=\"https://smartodr.in\" target=\"_blank\" rel=\"noopener noreferrer\">smartodr.in</a></td><td>As per ODR Portal rules</td></tr></tbody></table></div>\n<p class=\"foot-note\">Working Day means a day on which NSE and/or BSE are open for normal trading. Where we need more information from you, the timeline runs from when we receive it.</p>"
      },
      {
        "id": "resolution-and-closure",
        "heading": "7. Resolution and closure",
        "html": "<p>When we resolve your grievance we will tell you the resolution, the date, your reference number, the officer who handled it, and your further options if you are not satisfied. A grievance is treated as closed when:</p>\n<ul><li>we have met your request in full;</li>\n<li>you confirm in writing that you accept our response;</li>\n<li>you do not respond within 15 days of receiving our written response;</li>\n<li>we have confirmed to you that we have fulfilled our contractual, statutory and regulatory obligations; or</li>\n<li>the matter is found to be outside the scope of this mechanism.</li></ul>\n<p>Closure never limits your right to escalate to SEBI SCORES or Smart ODR, or to use any remedy available under law.</p>"
      },
      {
        "id": "escalating-to-sebi-scores",
        "heading": "8. Escalating to SEBI SCORES",
        "html": "<div class=\"steps\">\n<div class=\"step\"><div><h3>Raise it with us first</h3><p>SEBI expects complaints to be lodged with the Research Analyst first. Keep our reference number.</p></div></div>\n<div class=\"step\"><div><h3>Lodge on SCORES</h3><p>If you are not satisfied with our resolution, or have not heard back within the timeline, file at <a href=\"https://scores.sebi.gov.in\" target=\"_blank\" rel=\"noopener noreferrer\">scores.sebi.gov.in</a> or the SEBI SCORES mobile app. Attach our reference number and correspondence.</p></div></div>\n<div class=\"step\"><div><h3>Two levels of review</h3><p>SCORES 2.0 forwards the complaint to us. The first review is by the designated body — RAASB (BSE Administration &amp; Supervision Ltd.). If you are still dissatisfied, the second review is by SEBI.</p></div></div>\n</div>\n<p>You can also email RAASB's designated complaint address as published by BSE, or send a physical complaint to the Office of Investor Assistance and Education, SEBI Bhavan, Plot No. C4-A, 'G' Block, Bandra-Kurla Complex, Bandra (E), Mumbai – 400 051.</p>"
      },
      {
        "id": "online-dispute-resolution-smart-odr",
        "heading": "9. Online dispute resolution (Smart ODR)",
        "html": "<p>If the matter is not resolved through our process or SCORES, you may initiate dispute resolution on the <a href=\"https://smartodr.in\" target=\"_blank\" rel=\"noopener noreferrer\">Smart ODR portal</a>, which offers online conciliation and, if needed, arbitration under SEBI's ODR framework. This is in addition to the dispute-resolution provisions of the Agreement and does not limit your statutory right to approach SEBI <span class=\"cl\">Art. 32.4</span>.</p>"
      },
      {
        "id": "records-confidentiality-and-review",
        "heading": "10. Records, confidentiality and review",
        "html": "<ul><li>We keep records of grievances received, actions taken, responses and closure status as required by the RA Regulations, RAASB requirements and audit needs, and publish monthly complaint data on our <a href=\"/complaint-board\">Complaint Board</a>.</li>\n<li>Grievance information is handled confidentially, subject to regulatory reporting, audit and legal requirements.</li>\n<li>The Grievance Redressal / Compliance Officer reports grievance trends to senior management periodically so recurring Platform issues get fixed.</li>\n<li>We review this policy periodically and publish updates on this page.</li></ul>\n<p>See also the <a href=\"/investor-charter\">Investor Charter</a> and our <a href=\"/disclosures\">Regulatory Disclosures</a>, which list our key officers.</p>\n<p>Read SEBI's Do's and Don'ts for dealing with a Research Analyst in SEBI Master Circular SEBI/HO/MIRSD-POD-1/P/CIR/2024/49 dated 21 May 2024, as updated.</p>"
      }
    ]
  },
  "investor-charter": {
    "slug": "investor-charter",
    "label": "Investor Charter",
    "titleHtml": "Investor <em>Charter</em>",
    "lede": "The Investor Charter for Research Analysts prescribed by SEBI, as it applies to TurboTrade.ai.",
    "description": "TurboTrade.ai Investor Charter for Research Analysts: vision, services, grievance redressal, SCORES 2.0, Smart ODR, investor rights and do's and don'ts.",
    "chips": [
      "Updated: 23 September 2026",
      "SEBI RA: {{SEBI_RA}}",
      "BSE Enlistment: {{BSE}}"
    ],
    "toc": true,
    "introHtml": "",
    "sections": [
      {
        "id": "vision-and-mission",
        "heading": "1. Vision and mission",
        "html": "<p><b>Vision:</b> Invest with knowledge and safety.</p>\n<p><b>Mission:</b> Every investor should be able to invest in the right investment products based on their needs, manage and monitor them to meet their goals, access reports and enjoy financial wellness.</p>"
      },
      {
        "id": "business-transacted-by-the-research-analyst-with",
        "heading": "2. Business transacted by the Research Analyst with respect to investors",
        "html": "<p>{{ENTITY}}, operating TurboTrade.ai as a SEBI-registered Research Analyst ({{SEBI_RA}}), will:</p>\n<ul><li>publish research — including algorithmic strategy recommendations and signals — based on its research activities;</li>\n<li>provide an independent, unbiased view on securities;</li>\n<li>offer unbiased recommendations, disclosing any financial interest in recommended securities;</li>\n<li>base research recommendations on analysis of publicly available information and known observations;</li>\n<li>conduct an audit annually;</li>\n<li>ensure all advertisements follow the Advertisement Code for Research Analysts;</li>\n<li>maintain records of interactions with all clients, including prospective clients before onboarding, where any conversation about research services has taken place.</li></ul>"
      },
      {
        "id": "services-provided-to-investors",
        "heading": "3. Services provided to investors",
        "html": "<p class=\"foot-note\">No indicative timelines are prescribed for these services.</p>\n<ul><li>Onboarding of clients, including execution of the TurboTrade Algo Services Comprehensive Legal Agreement.</li>\n<li>Sharing the terms and conditions of research services, including the <a href=\"/terms#most-important-terms-and-conditions-mitc\">Most Important Terms &amp; Conditions</a>.</li>\n<li>Completing KYC of fee-paying clients.</li></ul>\n<h3>Disclosures to clients</h3>\n<ul><li>Information material to an informed decision — our business activity, disciplinary history, terms and conditions, associates, risks and conflicts of interest. See <a href=\"/disclosures\">Regulatory Disclosures</a> and <a href=\"/disclaimer\">Risk Disclosure</a>.</li>\n<li><b>Extent of use of Artificial Intelligence tools:</b> TurboTrade strategies run on deterministic, rule-based algorithmic software with parameters defined by our research and technology team. No autonomous, self-learning or independently evolving decision-making system is used without such defined rule parameters (Agreement Art. 6.1).</li>\n<li>When distributing a third-party research report, any material conflict of interest of that provider, or a link to its disclosures.</li>\n<li>Any conflict of interest between our research services and our other activities, including the broker revenue-sharing arrangement disclosed in our <a href=\"/terms\">Terms</a>.</li></ul>\n<h3>Our conduct</h3>\n<ul><li>Distribute research reports and recommendations to clients without discrimination.</li>\n<li>Keep a research report confidential until it is made available in the public domain.</li>\n<li>Respect clients' data privacy rights and protect their confidential information against unauthorised use.</li>\n<li>Disclose the timelines for our services and adhere to them.</li>\n<li>Give clear guidance and adequate caution notices when recommending complex and high-risk products, such as futures and options.</li>\n<li>Treat all clients with honesty and integrity.</li>\n<li>Keep client information confidential unless disclosure is required by law or the client has specifically consented.</li></ul>"
      },
      {
        "id": "grievance-redressal-mechanism-and-how-to-access-",
        "heading": "4. Grievance redressal mechanism and how to access it",
        "html": "<h3>With TurboTrade.ai (the Research Analyst)</h3>\n<p>Write to <a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a>, call <a href=\"tel:{{PHONE_TEL}}\">{{PHONE}}</a> or use <a href=\"/grievance-redressal\">our grievance page</a>. SEBI requires a Research Analyst to redress a grievance promptly and no later than 21 days from receipt; our own service standard is <b>7 Working Days</b>.</p>\n<h3>On SCORES or with RAASB</h3>\n<ol><li><b>SCORES 2.0</b> — SEBI's web-based centralised grievance redressal system at <a href=\"https://scores.sebi.gov.in\" target=\"_blank\" rel=\"noopener noreferrer\">scores.sebi.gov.in</a>. The first review is by the designated body (RAASB — BSE Administration &amp; Supervision Ltd.); the second review is by SEBI.</li>\n<li>Email to the designated email ID of RAASB, as published by BSE.</li></ol>\n<h3>Online dispute resolution</h3>\n<p>If you are not satisfied with the resolution, you can file the complaint on the <a href=\"https://smartodr.in\" target=\"_blank\" rel=\"noopener noreferrer\">SMART ODR</a> platform for resolution through online conciliation or arbitration.</p>\n<h3>Physical complaints</h3>\n<p>Office of Investor Assistance and Education, Securities and Exchange Board of India, SEBI Bhavan, Plot No. C4-A, 'G' Block, Bandra-Kurla Complex, Bandra (E), Mumbai – 400 051.</p>"
      },
      {
        "id": "rights-of-investors",
        "heading": "5. Rights of investors",
        "html": "<ul><li>Right to privacy and confidentiality.</li>\n<li>Right to transparent practices.</li>\n<li>Right to fair and equitable treatment.</li>\n<li>Right to adequate information.</li>\n<li>Right to initial and continuing disclosure, including all statutory and regulatory disclosures.</li>\n<li>Right to fair and true advertisement.</li>\n<li>Right to awareness about service parameters and turnaround times, and to be informed of the timeline for each service.</li>\n<li>Right to be heard and to satisfactory, timely grievance redressal.</li>\n<li>Right to exit a financial product or service in accordance with the terms agreed with the Research Analyst.</li>\n<li>Right to clear guidance and caution notices when dealing in complex and high-risk financial products and services.</li>\n<li>Additional rights for vulnerable consumers, including access to services in a suitable manner if differently abled — see our <a href=\"/accessibility-statement\">Accessibility Statement</a>.</li>\n<li>Right to give feedback on the products and services used.</li>\n<li>Right against coercive, unfair and one-sided clauses in financial agreements.</li></ul>"
      },
      {
        "id": "expectations-from-investors",
        "heading": "6. Expectations from investors",
        "html": "<h3>Do's</h3>\n<ul><li>Always deal with a SEBI-registered Research Analyst, and check that the registration certificate is valid. Our number is <b>{{SEBI_RA}}</b>.</li>\n<li>Verify registrations in <a href=\"https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&amp;intmId=14\" target=\"_blank\" rel=\"noopener noreferrer\">SEBI's list of registered Research Analysts</a>.</li>\n<li>Pay attention to the disclosures in research reports and on this website before investing.</li>\n<li>Pay only through banking channels and keep receipts. Our validated UPI handle is <b>{{UPI}}</b>; check it on SEBI Check. CeFCoM (RAASB's Centralised Fee Collection Mechanism) can be used only if a Research Analyst has opted in — we have not yet.</li>\n<li>Ask questions and clear your doubts before acting on a recommendation or activating a strategy, especially for complex, high-risk products.</li>\n<li>Remember you can stop the service as per the agreed terms, and give feedback on it.</li>\n<li>Remember you are not bound by any clause that contravenes regulatory provisions.</li>\n<li>Inform SEBI about any Research Analyst offering assured or guaranteed returns.</li></ul>\n<h3>Don'ts</h3>\n<ul><li>Do not give funds for investment to the Research Analyst. TurboTrade never holds your money; trades happen only in your own broker account.</li>\n<li>Do not fall for luring advertisements or market rumours.</li>\n<li>Do not be swayed by limited-period discounts, incentives or gifts.</li>\n<li>Do not share login credentials or passwords of your trading, Demat or bank accounts with the Research Analyst.</li></ul>"
      },
      {
        "id": "contact",
        "heading": "7. Contact",
        "html": "<dl class=\"contact\"><div><dt>Entity</dt><dd>{{ENTITY}}</dd></div><div><dt>Brand</dt><dd>TurboTrade.ai</dd></div><div><dt>CIN</dt><dd>{{CIN}}</dd></div><div><dt>SEBI Research Analyst Reg. No.</dt><dd>{{SEBI_RA}}</dd></div><div><dt>BSE Enlistment No.</dt><dd>{{BSE}}</dd></div><div><dt>Registered office</dt><dd>{{REGISTERED_OFFICE}}</dd></div><div><dt>Email</dt><dd><a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a></dd></div><div><dt>Phone</dt><dd><a href=\"tel:{{PHONE_TEL}}\">{{PHONE}}</a></dd></div><div><dt>Website</dt><dd><a href=\"https://www.turbotrade.ai\">www.turbotrade.ai</a></dd></div></dl>"
      }
    ]
  },
  "disclosures": {
    "slug": "disclosures",
    "label": "Regulatory Disclosures",
    "titleHtml": "Regulatory <em>Disclosures</em>",
    "lede": "The disclosures SEBI requires a Research Analyst to display on its website: registration details, key officers, escalation matrix and conflicts of interest.",
    "description": "TurboTrade.ai regulatory disclosures: SEBI RA registration {{SEBI_RA}}, BSE enlistment {{BSE}}, key officers, escalation matrix and conflict of interest.",
    "chips": [
      "Updated: 23 September 2026",
      "SEBI RA: {{SEBI_RA}}",
      "BSE Enlistment: {{BSE}}"
    ],
    "toc": true,
    "introHtml": "",
    "sections": [
      {
        "id": "sebi-registration-details",
        "heading": "1. SEBI registration details",
        "html": "<div class=\"tbl\" role=\"region\" tabindex=\"0\" aria-label=\"Registration details\"><table><caption>Registration details</caption><thead><tr><th scope=\"col\">Particular</th><th scope=\"col\">Details</th></tr></thead><tbody><tr><td>Name of the Research Analyst</td><td>{{ENTITY}}</td></tr><tr><td>Brand / platform</td><td>TurboTrade.ai</td></tr><tr><td>Type of registration</td><td>Research Analyst — Corporate (Private Limited Company)</td></tr><tr><td>SEBI Registration No.</td><td>{{SEBI_RA}}</td></tr><tr><td>BSE Enlistment No. (RAASB)</td><td>{{BSE}}</td></tr><tr><td>Validity of registration</td><td>Perpetual, unless suspended or cancelled by SEBI</td></tr><tr><td>CIN</td><td>{{CIN}}</td></tr><tr><td>Registered office</td><td>{{REGISTERED_OFFICE}}</td></tr><tr><td>Website</td><td><a href=\"https://www.turbotrade.ai\">www.turbotrade.ai</a></td></tr><tr><td>Associated SEBI office</td><td>Securities and Exchange Board of India, SEBI Bhavan, Plot No. C4-A, 'G' Block, Bandra-Kurla Complex, Bandra (East), Mumbai, Maharashtra – 400051</td></tr></tbody></table></div>"
      },
      {
        "id": "key-officers",
        "heading": "2. Key officers",
        "html": "<div class=\"tbl\" role=\"region\" tabindex=\"0\" aria-label=\"Key officers\"><table><caption>Key officers</caption><thead><tr><th scope=\"col\">Designation</th><th scope=\"col\">Phone</th><th scope=\"col\">Email</th></tr></thead><tbody><tr><td>Principal Officer</td><td><a href=\"tel:{{PHONE_TEL}}\">{{PHONE}}</a></td><td><a href=\"mailto:{{LEGAL_EMAIL}}\">{{LEGAL_EMAIL}}</a></td></tr><tr><td>Grievance Redressal / Compliance Officer</td><td><a href=\"tel:{{PHONE_TEL}}\">{{PHONE}}</a></td><td><a href=\"mailto:{{LEGAL_EMAIL}}\">{{LEGAL_EMAIL}}</a></td></tr></tbody></table></div>"
      },
      {
        "id": "escalation-matrix",
        "heading": "3. Escalation matrix",
        "html": "<div class=\"tbl\" role=\"region\" tabindex=\"0\" aria-label=\"Escalation matrix\"><table><caption>Escalation matrix</caption><thead><tr><th scope=\"col\">Level</th><th scope=\"col\">Designation</th><th scope=\"col\">Phone</th><th scope=\"col\">Email</th><th scope=\"col\">Working hours</th></tr></thead><tbody><tr><td>1</td><td>Customer Care — TurboTrade Support</td><td><a href=\"tel:{{PHONE_TEL}}\">{{PHONE}}</a></td><td><a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a></td><td>Mon–Fri, 9:00–17:00 IST</td></tr><tr><td>2</td><td>Grievance Redressal / Compliance Officer</td><td><a href=\"tel:{{PHONE_TEL}}\">{{PHONE}}</a></td><td><a href=\"mailto:{{LEGAL_EMAIL}}\">{{LEGAL_EMAIL}}</a></td><td>Mon–Fri, 9:00–17:00 IST</td></tr><tr><td>3</td><td>Principal Officer</td><td><a href=\"tel:{{PHONE_TEL}}\">{{PHONE}}</a></td><td><a href=\"mailto:{{LEGAL_EMAIL}}\">{{LEGAL_EMAIL}}</a></td><td>Mon–Fri, 9:00–17:00 IST</td></tr></tbody></table></div>\n<p>If your complaint is not resolved at these levels, escalate to <a href=\"https://scores.sebi.gov.in\" target=\"_blank\" rel=\"noopener noreferrer\">SEBI SCORES</a> and then to <a href=\"https://smartodr.in\" target=\"_blank\" rel=\"noopener noreferrer\">Smart ODR</a>. See <a href=\"/grievance-redressal\">Grievance Redressal</a> for timelines, and the <a href=\"/complaint-board\">Complaint Board</a> for monthly complaint data.</p>"
      },
      {
        "id": "mandatory-disclosures",
        "heading": "4. Mandatory disclosures",
        "html": "<ul><li>{{ENTITY}} is engaged in research activities in the Indian capital market, delivered as algorithmic strategies and signals through TurboTrade.ai.</li>\n<li>The Company has not been suspended or debarred from doing business by any stock exchange, SEBI or other authority, and its certificate of registration has not been cancelled by SEBI at any time.</li>\n<li>The Company is not engaged in merchant banking, investment banking or brokerage services. Orders generated by TurboTrade strategies are placed through your own SEBI-registered broker.</li>\n<li>The Company is not registered as an Investment Adviser or Portfolio Manager.</li>\n<li>Registration granted by SEBI, enlistment with BSE and certification from NISM in no way guarantee the performance of the intermediary or provide any assurance of returns to investors.</li>\n<li>Investments in the securities market are subject to market risks. Read all related documents carefully before investing.</li></ul>"
      },
      {
        "id": "research-and-performance-disclosures",
        "heading": "5. Research and performance disclosures",
        "html": "<ul><li>Unless otherwise stated, percentage returns shown on the website, the Platform or marketing material are <b>absolute returns</b>. Figures show the basis, the period and whether they are gross of transaction costs (Agreement Art. 11.1).</li>\n<li>Past performance does not guarantee future returns. Performance shown for any period before a strategy's launch date is calculated from <b>backtested data</b>; those signals were not delivered to the public for actual trading or investing.</li>\n<li>Market data used for calculations comes from stock exchanges and licensed third-party vendors and has not been audited or validated by the Company (Art. 11.2).</li>\n<li>Research and strategies are not an offer, or a solicitation of an offer, to buy or sell any security in any jurisdiction where that would be illegal. They are not personal recommendations and do not take into account any individual's objectives, financial situation, risk profile or needs.</li>\n<li>Information from the Company is one of many factors you should weigh. Your investment decision should rest on your own needs and risk tolerance, and you are responsible for validating the information you rely on.</li>\n<li>We try to keep information and strategies up to date on a reasonable basis, but regulatory, compliance or other reasons may prevent us from doing so.</li>\n<li>The Company does not promise or assure a favourable view of any industry, sector or business group.</li></ul>"
      },
      {
        "id": "conflict-of-interest",
        "heading": "6. Conflict of interest",
        "html": "<ul><li>The Company, its officers, directors, employees and associates do not hold, trade in or benefit from positions in securities that are the subject of a current strategy recommendation (Art. 12.2).</li>\n<li>They have received no compensation from any company whose securities are the subject of a strategy (Art. 12.4).</li>\n<li>As of the date of the Agreement there are no material conflicts arising from connections with any issuer; any future conflict will be disclosed promptly (Art. 12.3).</li>\n<li><b>Broker revenue sharing:</b> the Company may receive a share of brokerage from brokers empanelled on TurboTrade.ai for trades executed through the Platform. It costs you nothing extra, does not influence strategy outputs and does not restrict your choice of broker (Art. 12.5).</li></ul>"
      },
      {
        "id": "use-of-algorithms-and-ai",
        "heading": "7. Use of algorithms and AI",
        "html": "<p>TurboTrade.ai uses proprietary, deterministic, rule-based algorithmic software for signal generation, automated order placement, risk monitoring and analytics. No autonomous, self-learning or independently evolving decision-making system is used without rule parameters defined by our research and technology team (Art. 6.1).</p>"
      },
      {
        "id": "related-pages",
        "heading": "8. Related pages",
        "html": "<ul><li><a href=\"/investor-charter\">Investor Charter</a></li>\n<li><a href=\"/terms\">Terms &amp; Conditions and MITC</a></li>\n<li><a href=\"/disclaimer\">Risk Disclosure &amp; Disclaimer</a></li>\n<li><a href=\"/grievance-redressal\">Grievance Redressal</a> and <a href=\"/complaint-board\">Complaint Board</a></li>\n<li>SEBI's Do's and Don'ts for dealing with a Research Analyst — SEBI Master Circular SEBI/HO/MIRSD-POD-1/P/CIR/2024/49 dated 21 May 2024</li></ul>"
      },
      {
        "id": "contact",
        "heading": "9. Contact",
        "html": "<dl class=\"contact\"><div><dt>Entity</dt><dd>{{ENTITY}}</dd></div><div><dt>Brand</dt><dd>TurboTrade.ai</dd></div><div><dt>CIN</dt><dd>{{CIN}}</dd></div><div><dt>SEBI Research Analyst Reg. No.</dt><dd>{{SEBI_RA}}</dd></div><div><dt>BSE Enlistment No.</dt><dd>{{BSE}}</dd></div><div><dt>Registered office</dt><dd>{{REGISTERED_OFFICE}}</dd></div><div><dt>Email</dt><dd><a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a></dd></div><div><dt>Phone</dt><dd><a href=\"tel:{{PHONE_TEL}}\">{{PHONE}}</a></dd></div><div><dt>Website</dt><dd><a href=\"https://www.turbotrade.ai\">www.turbotrade.ai</a></dd></div></dl>"
      }
    ]
  },
  "complaint-board": {
    "slug": "complaint-board",
    "label": "Complaint Board",
    "titleHtml": "Complaint <em>Board</em>",
    "lede": "Investor complaint data for {{ENTITY}}, disclosed monthly in the format prescribed for SEBI-registered Research Analysts.",
    "description": "TurboTrade.ai complaint board: monthly and annual investor complaint data for {{ENTITY}}, SEBI Research Analyst {{SEBI_RA}}.",
    "chips": [
      `Data as of: ${COMPLAINTS_AS_OF}`,
      "SEBI RA: {{SEBI_RA}}",
      "BSE Enlistment: {{BSE}}"
    ],
    "toc": false,
    "introHtml": "",
    "sections": [...complaintBoardSections(), {
        "id": "notes",
        "heading": "4. Notes",
        "html": "<ul><li>* Includes complaints of previous months resolved in the current month, if any.</li>\n<li># Includes all complaints pending as on the last day of the month, if any.</li>\n<li>^ Average resolution time is the total time taken to resolve each complaint in the month divided by the number of complaints resolved in the month.</li>\n<li>Data covers all complaints received by {{ENTITY}} (SEBI RA {{SEBI_RA}}), across its research and algo services, and is updated by the 7th of each month.</li></ul>\n<p>To raise a complaint, see <a href=\"/grievance-redressal\">Grievance Redressal</a>, or go directly to <a href=\"https://scores.sebi.gov.in\" target=\"_blank\" rel=\"noopener noreferrer\">SEBI SCORES</a> or <a href=\"https://smartodr.in\" target=\"_blank\" rel=\"noopener noreferrer\">Smart ODR</a>.</p>"
      }]
  },
  "accessibility-statement": {
    "slug": "accessibility-statement",
    "label": "Accessibility Statement",
    "titleHtml": "Accessibility <em>Statement</em>",
    "lede": "Our commitment to WCAG 2.2 Level AA, IS 17802 and SEBI's accessibility guidelines — and how to reach us if something gets in your way.",
    "description": "TurboTrade.ai Accessibility Statement: WCAG 2.2 AA, IS 17802, RPwD Act 2016 and SEBI accessibility circulars; built-in accessibility controls and feedback.",
    "chips": [
      "Last reviewed: 23 September 2026",
      "WCAG 2.2 AA",
      "IS 17802"
    ],
    "toc": true,
    "introHtml": "",
    "sections": [
      {
        "id": "our-commitment",
        "heading": "1. Our commitment",
        "html": "<p>TurboTrade.ai, operated by {{ENTITY}} (SEBI RA {{SEBI_RA}}), believes automated trading tools, disclosures and investor-protection information should be usable by everyone — including people with visual, hearing, motor, speech or cognitive disabilities, and older users. We design, build and test our website and Platform for accessibility and treat accessibility barriers as service issues.</p>"
      },
      {
        "id": "standards-we-follow",
        "heading": "2. Standards we follow",
        "html": "<ul><li><b>WCAG 2.2 Level A and AA</b> — W3C Web Content Accessibility Guidelines 2.2, with backward compatibility for WCAG 2.1 AA.</li>\n<li><b>SEBI circulars</b> SEBI/HO/ITD-1/ITD_VIAP/P/CIR/2025/111 and SEBI/HO/ITD-1/ITD_VIAP/P/CIR/2025/131 on digital accessibility for regulated entities.</li>\n<li><b>Rights of Persons with Disabilities Act, 2016</b> and rules made under it.</li>\n<li><b>IS 17802</b> — Bureau of Indian Standards accessibility requirements for ICT products and services.</li>\n<li><b>GIGW</b> — applicable guidance from the Guidelines for Indian Government Websites.</li></ul>"
      },
      {
        "id": "built-in-accessibility-controls",
        "heading": "3. Built-in accessibility controls",
        "html": "<p>Open <b>Accessibility</b> in the top navigation bar to use:</p>\n<div class=\"tbl\" role=\"region\" tabindex=\"0\" aria-label=\"Accessibility preferences\"><table><caption>Accessibility preferences</caption><thead><tr><th scope=\"col\">Control</th><th scope=\"col\">What it does</th><th scope=\"col\">WCAG</th></tr></thead><tbody><tr><td>Text resizing</td><td>Scales text up to 200% without loss of content or broken layout.</td><td>1.4.4</td></tr><tr><td>Reading themes</td><td>Site default, High contrast (black on white), Dark reading, Warm sepia and Monochrome.</td><td>1.4.3 · 1.4.6</td></tr><tr><td>Link underlines</td><td>Forces high-visibility underlines on all links.</td><td>1.4.1</td></tr><tr><td>Motion controls</td><td>Turns off decorative motion and transitions, and respects your system's reduced-motion setting.</td><td>2.3.3</td></tr><tr><td>Text-to-speech reader</td><td>Reads selected text or the main page content aloud, with a visual outline tracking what is read.</td><td>—</td></tr></tbody></table></div>"
      },
      {
        "id": "accessibility-built-into-every-page",
        "heading": "4. Accessibility built into every page",
        "html": "<ul><li><b>Keyboard access</b> — all interactive elements work with <kbd>Tab</kbd>, <kbd>Shift</kbd>+<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd> and <kbd>Esc</kbd>, with clearly visible focus indicators.</li>\n<li><b>Skip link</b> — a \"Skip to content\" link appears on focus to bypass navigation.</li>\n<li><b>Reflow and zoom</b> — content works at 400% browser zoom and reflows down to 320 CSS pixels wide.</li>\n<li><b>Structure</b> — HTML5 landmarks (header, nav, main, footer), a logical heading order, breadcrumbs and an \"On this page\" index on long policies.</li>\n<li><b>Contrast</b> — at least 4.5:1 for normal text and 3:1 for large text and UI components.</li>\n<li><b>Tables</b> — data tables such as fees and complaint data use proper headers and scroll horizontally on small screens instead of shrinking text.</li>\n<li><b>Plain language</b> — key risks are summarised in plain words alongside the formal legal text.</li></ul>"
      },
      {
        "id": "known-limitations-and-alternatives",
        "heading": "5. Known limitations and alternatives",
        "html": "<p>Some parts of the journey rely on third parties we do not control, and may not fully meet WCAG 2.2 AA:</p>\n<ul><li><b>Broker login pages</b> used for daily authentication are hosted by your broker.</li>\n<li><b>Payment gateway</b> and <b>e-sign / KYC</b> screens are hosted by their providers.</li>\n<li>Some <b>interactive charts</b> in strategy dashboards may not expose every data point to screen readers. Ask us and we will share the underlying figures in text.</li></ul>\n<p>If anything blocks you, contact us. We can help by phone or email, walk you through onboarding, share the Agreement, MITC and disclosures in an accessible format, and help with the Kill Switch or deactivating a strategy.</p>"
      },
      {
        "id": "feedback-and-support",
        "heading": "6. Feedback and support",
        "html": "<p>Tell us about any barrier — the page or screen, what you were trying to do, and the device, browser or assistive technology you use. We aim to respond within <b>7 Working Days</b>.</p>\n<dl class=\"contact\"><div><dt>Entity</dt><dd>{{ENTITY}}</dd></div><div><dt>Brand</dt><dd>TurboTrade.ai</dd></div><div><dt>CIN</dt><dd>{{CIN}}</dd></div><div><dt>SEBI Research Analyst Reg. No.</dt><dd>{{SEBI_RA}}</dd></div><div><dt>BSE Enlistment No.</dt><dd>{{BSE}}</dd></div><div><dt>Registered office</dt><dd>{{REGISTERED_OFFICE}}</dd></div><div><dt>Email</dt><dd><a href=\"mailto:{{EMAIL}}\">{{EMAIL}}</a></dd></div><div><dt>Phone</dt><dd><a href=\"tel:{{PHONE_TEL}}\">{{PHONE}}</a></dd></div><div><dt>Website</dt><dd><a href=\"https://www.turbotrade.ai\">www.turbotrade.ai</a></dd></div></dl>\n<p>If you are not satisfied with our response, follow our <a href=\"/grievance-redressal\">Grievance Redressal</a> process or escalate to <a href=\"https://scores.sebi.gov.in\" target=\"_blank\" rel=\"noopener noreferrer\">SEBI SCORES</a>.</p>"
      },
      {
        "id": "review",
        "heading": "7. Review",
        "html": "<p>We review our website and Platform against these standards regularly and when we release significant changes. This statement was last reviewed on 23 September 2026.</p>"
      }
    ]
  }
};
