import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contact from "./components/Contact";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import TermsCondition from "./pages/TermsCondition";
import RefundPolicy from "./pages/RefundPolicy";
import Upcoming from "./pages/Upcoming";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [pathname]);
    return null;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<TermsCondition />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/upcoming" element={<Upcoming />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
};

export default App;
