import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { componentTagger } from "lovable-tagger";

/* Company and regulatory details shown on the legal pages, footer and contact
   page (src/lib/company.ts). A SEBI-registered site must never ship with one of
   these blank, so a missing value stops the build instead of rendering "". */
const REQUIRED_ENV = [
  "VITE_COMPANY_CIN",
  "VITE_SEBI_RA_NUMBER",
  "VITE_BSE_ENLISTMENT_NUMBER",
  "VITE_CONTACT_EMAIL",
  "VITE_LEGAL_EMAIL",
  "VITE_PARTNER_EMAIL",
  "VITE_CONTACT_PHONE",
  "VITE_PARTNER_PHONE",
  "VITE_UPI_HANDLE",
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const missing = REQUIRED_ENV.filter((k) => !env[k]?.trim());
  if (missing.length) {
    throw new Error(
      `Missing env vars: ${missing.join(", ")}. Add them to .env (see .env.example) ` +
        `or to the Vercel project's Environment Variables.`,
    );
  }

  return {
    server: {
      host: "::",
      port: 8080,
      historyApiFallback: true,
      /* The strategy API allows only the production origins through CORS, so
         in dev the browser calls /appapi on this server and Vite forwards it.
         The Origin header is dropped on the way: the API rejects localhost but
         answers a request with no Origin at all. See src/lib/strategies.ts. */
      proxy: {
        "/appapi": {
          target: env.VITE_API_URL || "https://appapi.turbotrade.ai",
          changeOrigin: true,
          rewrite: (p: string) => p.replace(/^\/appapi/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (req) => req.removeHeader("origin"));
          },
        },
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
    },
  };
});
