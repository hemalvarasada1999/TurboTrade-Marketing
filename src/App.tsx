import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contact from "./components/Contact";
import { LEGAL_NAV } from "./content/legal/meta";
import ScrollToTopButton from "./components/ScrollToTopButton";
import WhatsAppButton from "./components/WhatsAppButton";
import { focusPageStart } from "@/lib/scroll";
import { useRouteAnalytics } from "@/lib/analytics";
import { usePosthogPageview } from "@/lib/posthog";
import AnalyticsConsent from "./components/AnalyticsConsent";
import { lazy, Suspense, useEffect, type ReactNode } from "react";

/* No tooltip or toast providers here: nothing on the public site renders a
   Radix tooltip or toast, and mounting them put roughly 90 kB of Radix and
   floating-ui in the entry chunk of every page. The partner form's confirmation
   toast mounts its own <Toaster /> in BrokerPartnerProgram. */
const queryClient = new QueryClient();

/* Routes the home page never needs are split out and fetched on the first visit
   to them: the legal copy (~120 kB of text), the broker partner page with its
   form, and the upcoming page. Each prerendered page preloads its own chunk
   (scripts/prerender.mjs), so hydration does not wait on a second round trip. */
const LegalDoc = lazy(() => import("./pages/LegalDoc"));
const BrokerPartnerProgram = lazy(() => import("./pages/BrokerPartnerProgram"));
const Upcoming = lazy(() => import("./pages/Upcoming"));

const Lazy = ({ children }: { children: ReactNode }) => <Suspense fallback={null}>{children}</Suspense>;

/* Old or alternative spellings of legal routes. vercel.json answers these with
   a 301 in production; these client-side redirects cover the dev server and any
   in-app link that still uses them. */
const LEGAL_REDIRECTS: Record<string, string> = {
  "/sebi-compliance": "/disclosures",
  "/risk-disclosure": "/disclaimer",
  "/refund-policy": "/cancellation-refund",
};

/* Land every new route at the top, instantly.
   This used to smooth-scroll. React Router renders the incoming route at
   whatever offset the outgoing one was left at, so a visitor who clicked
   "Privacy policy" from the footer watched a correct page scroll itself upward
   for half a second before settling. The arrival animation is now the
   .page-rise transition on the layout instead — see styles/site.css.

   The focus call is what restores the keyboard position (WCAG 2.4.3), and it
   has to use preventScroll or it fights whatever put us at the top. */
function ScrollToTopRouteReset() {
  const { pathname } = useLocation();
  useRouteAnalytics();
  usePosthogPageview();
  useEffect(() => {
    window.scrollTo(0, 0);
    focusPageStart();
  }, [pathname]);
  return null;
}


/* Everything inside the router. main.tsx wraps it in a BrowserRouter; the
   prerender (src/entry-server.tsx) wraps the same tree in a StaticRouter, so the
   server HTML and the first client render are the same markup. */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
          <ScrollToTopRouteReset />
          <ScrollToTopButton />
          <WhatsAppButton />
          <AnalyticsConsent />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/broker-partner-program" element={<Lazy><BrokerPartnerProgram /></Lazy>} />
            <Route path="/broker-partner" element={<Lazy><BrokerPartnerProgram /></Lazy>} />
            <Route path="/contact" element={<Contact />} />
            {/* /legal, /terms, /privacy, /cancellation-refund, /disclaimer,
                /grievance-redressal, /investor-charter, /disclosures,
                /complaint-board and /accessibility-statement */}
            {LEGAL_NAV.map(({ slug }) => (
              <Route key={slug} path={`/${slug}`} element={<Lazy><LegalDoc slug={slug} /></Lazy>} />
            ))}
            {Object.entries(LEGAL_REDIRECTS).map(([from, to]) => (
              <Route key={from} path={from} element={<Navigate to={to} replace />} />
            ))}
            <Route path="/upcoming" element={<Lazy><Upcoming /></Lazy>} />
            <Route path="/coming-soon" element={<Lazy><Upcoming /></Lazy>} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
    </QueryClientProvider>
  );
};

export default App;
