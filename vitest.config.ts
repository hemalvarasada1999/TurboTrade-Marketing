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
    },
  },
});
