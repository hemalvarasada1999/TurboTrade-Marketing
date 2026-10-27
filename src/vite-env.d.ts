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
  readonly VITE_PARTNER_PHONE: string;
  readonly VITE_UPI_HANDLE: string;
  readonly VITE_SOCIAL_X_URL: string;
  readonly VITE_SOCIAL_X_HANDLE: string;
  readonly VITE_SOCIAL_INSTAGRAM_URL: string;
  readonly VITE_SOCIAL_FACEBOOK_URL: string;
  readonly VITE_SOCIAL_LINKEDIN_URL: string;
  readonly VITE_SOCIAL_TELEGRAM_URL: string;
  readonly VITE_SOCIAL_WHATSAPP_CHANNEL_URL: string;
  readonly VITE_WHATSAPP_NUMBER: string;
  readonly VITE_APP_URL?: string;
  readonly VITE_WHATSAPP_MESSAGE?: string;
  /* Meta Pixel (src/lib/metaPixel.ts). Optional: unset means no Pixel. */
  readonly VITE_META_PIXEL_ID?: string;
  readonly VITE_META_PIXEL_HOSTS?: string;
}
