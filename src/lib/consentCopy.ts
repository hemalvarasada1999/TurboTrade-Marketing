/* PROPOSED COPY: pending product-owner and privacy review. Keep every
   visitor-facing string in this object so a review changes one place. */
export const CONSENT_COPY = {
  title: "Help us improve TurboTrade",
  body:
    "We use optional analytics to understand website visits and improve our services. " +
    "You can accept or decline analytics and change your choice later.",
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
