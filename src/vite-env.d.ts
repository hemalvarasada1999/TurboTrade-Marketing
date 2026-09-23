/// <reference types="vite/client" />

/* Required at build time; vite.config.ts refuses to build without them. */
interface ImportMetaEnv {
  readonly VITE_COMPANY_CIN: string;
  readonly VITE_SEBI_RA_NUMBER: string;
  readonly VITE_BSE_ENLISTMENT_NUMBER: string;
  readonly VITE_CONTACT_EMAIL: string;
  readonly VITE_LEGAL_EMAIL: string;
  readonly VITE_PARTNER_EMAIL: string;
  readonly VITE_CONTACT_PHONE: string;
  readonly VITE_UPI_HANDLE: string;
  readonly VITE_APP_URL?: string;
}
