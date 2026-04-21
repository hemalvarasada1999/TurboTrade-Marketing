import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import turbotrade from "/turbotrade-logo.png";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks: { label: string; href: string }[] = [];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="#" className="flex items-center gap-3">
          <img src={turbotrade} alt="TurboTrade" className="h-11" />
        </a>


        <div className="hidden md:flex items-center gap-4">
          <Button size="sm" className="btn-light-trail bg-primary text-primary-foreground font-semibold">
            <a href="https://app.turbotrade.ai/auth/login" target="_blank">
              Login
            </a>
          </Button>
        </div>

        <button
          className="md:hidden p-2"
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

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t px-4 py-4 space-y-3">
          <Button size="sm" className="w-full bg-primary text-primary-foreground">Log in</Button>
        </div>
      )}
    </header>
  );
};

export default Header;
