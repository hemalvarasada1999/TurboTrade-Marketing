import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contact from "./components/Contact";
import Privacy from "./pages/Privacy";
import RiskDisclaimer from "./pages/Disclaimer";
import TermsCondition from "./pages/TermsCondition";
import RefundPolicy from "./pages/RefundPolicy";
import Upcoming from "./pages/Upcoming";
import ScrollToTopButton from "./components/ScrollToTopButton";
import AccessibilityStatement from "./pages/AccessibilityStatement";
import BrokerPartnerProgram from "./pages/BrokerPartnerProgram";
import { focusPageStart } from "@/lib/scroll";
import { useRouteAnalytics } from "@/lib/analytics";
import { useEffect } from "react";

const queryClient = new QueryClient();

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
            <Route path="/disclaimer" element={<RiskDisclaimer />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<TermsCondition />} />
            {/* <Route path="/refund-policy" element={<RefundPolicy />} /> */}
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/coming-soon" element={<Upcoming />} />
            <Route path="/accessibility-statement" element={<AccessibilityStatement />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
