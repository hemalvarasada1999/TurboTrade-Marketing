/* PROPOSED COPY: pending product-owner and privacy review. Keep every
   visitor-facing string in this object so a review changes one place. */
export const CONSENT_COPY = {
  title: "Help us improve TurboTrade",
  body:
    "We'd like to use optional analytics to understand how our website and app are used, including which campaign or partner link brought you here. If you sign in, analytics are linked to your TurboTrade username. Nothing is collected unless you accept. You can change your choice at any time in Analytics preferences.",
  policyLink: "Privacy Policy",
  accept: "Accept analytics",
  decline: "Decline",
  onTitle: "Analytics are on",
  onBody: "Thank you. You can turn analytics off at any time.",
  turnOff: "Turn off analytics",
  close: "Close",
  gpcTitle: "Analytics are off",
  gpcBody:
    "Your browser is sending a Global Privacy Control signal, so we keep analytics off.",
  saved: "Analytics preference saved.",
} as const;
