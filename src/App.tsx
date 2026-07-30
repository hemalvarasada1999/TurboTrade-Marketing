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
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  function ScrollToTopRouteReset() {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      const target =
        document.getElementById("main-content") ||
        (document.querySelector("h1") as HTMLElement | null);
      if (target) {
        target.focus();
      }
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
