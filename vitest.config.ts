import { defineConfig } from "vitest/config";
import path from "path";

/* Unit and integration tests. All analytics goes through a mock transport;
   nothing here can reach PostHog. */
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
    env: {
      VITE_META_PIXEL_ID: "",
      /* src/lib/company.ts reads these at import time (vite.config.ts refuses
         to BUILD without them). Synthetic test-only values so the suite runs in
         a fresh checkout or CI without a .env; never shown to anyone. */
      ...Object.fromEntries(
        [
          "VITE_COMPANY_CIN", "VITE_SEBI_RA_NUMBER", "VITE_BSE_ENLISTMENT_NUMBER",
          "VITE_CONTACT_EMAIL", "VITE_LEGAL_EMAIL", "VITE_PARTNER_EMAIL",
          "VITE_CONTACT_PHONE", "VITE_PARTNER_PHONE", "VITE_UPI_HANDLE",
          "VITE_SOCIAL_X_URL", "VITE_SOCIAL_X_HANDLE", "VITE_SOCIAL_INSTAGRAM_URL",
          "VITE_SOCIAL_FACEBOOK_URL", "VITE_SOCIAL_LINKEDIN_URL", "VITE_SOCIAL_TELEGRAM_URL",
          "VITE_SOCIAL_WHATSAPP_CHANNEL_URL", "VITE_WHATSAPP_NUMBER",
        ].map((k) => [k, process.env[k] || "test-synthetic"]),
      ),
    },
  },
});
