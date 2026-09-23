/* ══════════════ COMPANY & REGULATORY DETAILS ══════════════
   The entity name and both addresses are written here. Registration numbers,
   contact channels and the UPI handle are read from VITE_* env vars (.env
   locally, Project Settings → Environment Variables on Vercel). Either way,
   this is the one place they change, not every page that shows them.

   These are NOT secrets. SEBI requires a Research Analyst to publish all of
   them on its website, and Vite inlines every VITE_ value into the public
   bundle at build time. The env file is a single point of change, not a way to
   hide anything. Never put a real secret (API key, token) in a VITE_ var.

   vite.config.ts fails the build if any of these is missing, so a deploy can
   never ship legal pages with a blank registration number or phone. */

const env = import.meta.env;

const phone = env.VITE_CONTACT_PHONE;

export const COMPANY = {
  entity: "EquityPulse Tech Private Limited",
  cin: env.VITE_COMPANY_CIN,
  sebiRa: env.VITE_SEBI_RA_NUMBER,
  bseEnlistment: env.VITE_BSE_ENLISTMENT_NUMBER,
  /* The registered office as the legal documents state it. */
  registeredOffice: "RK Complex, Electronic City Phase-1, Bengaluru, Karnataka – 560100, India",
  /* The fuller street address the Contact page gives visitors. */
  contactAddress:
    "1st floor, RK Complex, KSSIDC Compound, Indra Nagar, Electronic City Phase I, Bengaluru, Karnataka 560100",
  email: env.VITE_CONTACT_EMAIL,
  legalEmail: env.VITE_LEGAL_EMAIL,
  partnerEmail: env.VITE_PARTNER_EMAIL,
  phone,
  /* tel: wants the number without spaces. */
  phoneTel: phone.replace(/[^\d+]/g, ""),
  upiHandle: env.VITE_UPI_HANDLE,
} as const;
