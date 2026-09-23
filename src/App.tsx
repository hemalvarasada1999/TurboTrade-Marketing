import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contact from "./components/Contact";
import { LEGAL_NAV } from "./content/legal/meta";
import Upcoming from "./pages/Upcoming";
import ScrollToTopButton from "./components/ScrollToTopButton";
import BrokerPartnerProgram from "./pages/BrokerPartnerProgram";
import { focusPageStart } from "@/lib/scroll";
import { useRouteAnalytics } from "@/lib/analytics";
import { lazy, Suspense, useEffect } from "react";

const queryClient = new QueryClient();

/* The legal copy is ~120 kB of text that the home page never needs, so it is
   split out and fetched on the first visit to any legal route. */
const LegalDoc = lazy(() => import("./pages/LegalDoc"));

/* Old or alternative spellings of legal routes. vercel.json answers these with
   a 301 in production; these client-side redirects cover the dev server and any
   in-app link that still uses them. */
const LEGAL_REDIRECTS: Record<string, string> = {
  "/sebi-compliance": "/disclosures",
  "/risk-disclosure": "/disclaimer",
  "/refund-policy": "/cancellation-refund",
};

const App = () => {
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
    useEffect(() => {
      window.scrollTo(0, 0);
      focusPageStart();
    }, [pathname]);
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTopRouteReset />
          <ScrollToTopButton />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/broker-partner-program" element={<BrokerPartnerProgram />} />
            <Route path="/broker-partner" element={<BrokerPartnerProgram />} />
            <Route path="/contact" element={<Contact />} />
            {/* /legal, /terms, /privacy, /cancellation-refund, /disclaimer,
                /grievance-redressal, /investor-charter, /disclosures,
                /complaint-board and /accessibility-statement */}
            {LEGAL_NAV.map(({ slug }) => (
              <Route key={slug} path={`/${slug}`} element={
                  <Suspense fallback={null}>
                    <LegalDoc slug={slug} />
                  </Suspense>
                } />
            ))}
            {Object.entries(LEGAL_REDIRECTS).map(([from, to]) => (
              <Route key={from} path={from} element={<Navigate to={to} replace />} />
            ))}
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/coming-soon" element={<Upcoming />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
