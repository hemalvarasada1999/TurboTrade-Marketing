/* Server-only entry: Fast Refresh never applies, so its non-component exports are fine. */
/* eslint-disable react-refresh/only-export-components */
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";

/* Server render of one route, for scripts/prerender.mjs. Resolves once every
   lazy chunk (the legal copy) has rendered, so the HTML is complete. */
export function render(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const out = new PassThrough();
    out.on("data", (c) => chunks.push(Buffer.from(c)));
    out.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    const { pipe } = renderToPipeableStream(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>,
      {
        onAllReady() {
          pipe(out);
        },
        onShellError: reject,
        onError: reject,
      },
    );
  });
}

export { ROUTE_META, NOT_FOUND_META } from "./lib/routeMeta";
export {
  BLOCK_ALL_ROBOTS_TXT,
  EMPTY_SITEMAP_XML,
  NOINDEX_META,
  isIndexableEnvironment,
  resolveSiteEnvironment,
} from "./lib/siteEnvironment";
