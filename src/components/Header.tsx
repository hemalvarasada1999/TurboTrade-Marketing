import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AccessibilityToolbar } from "@/components/site/AccessibilityToolbar";
import turbotrade from "/turbotrade.png";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-primary focus:text-primary-foreground focus:font-bold focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto max-w-7xl flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={turbotrade} alt="TurboTrade" className="h-11" />
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <AccessibilityToolbar />
            <Button size="sm" asChild className="btn-light-trail bg-primary text-primary-foreground font-semibold">
              <Link to="/coming-soon">
                Login
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <AccessibilityToolbar />
            <button
              className="p-2 text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t px-4 py-4 space-y-3">
            <Button size="sm" asChild className="w-full bg-primary text-primary-foreground">
              <Link to="/coming-soon">
                Log in
              </Link>
            </Button>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
