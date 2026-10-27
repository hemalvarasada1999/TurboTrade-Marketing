import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AccessibilityToolbar } from "@/components/site/AccessibilityToolbar";
import { Accessibility } from "lucide-react";
import { APP_LOGIN_URL, APP_SIGNUP_URL, LOGO_MARK } from "@/lib/brand";
import { useBrandLogo } from "@/hooks/use-brand-logo";

/* ══════════════ HEADER ══════════════
   The glass capsule. `header.nav` is a fixed positioning shell with no visual of
   its own; everything you can see belongs to `.nav-in`, so there is no
   full-bleed bar at any scroll position. See site.css for why nothing here
   animates a layout property.

   The accessibility control lives inside the capsule rather than in a bar of its
   own. It is a statutory feature (RPwD Act / IS 17802), so it has to be reachable
   from every route — and this header is the one component every route renders.
   On a phone its trigger moves into the burger menu (see site.css) so the row
   can carry both Log in and Sign up; the panel itself is the same instance. */

type NavItem = { label: string; hash: string };

/* Section anchors, not routes. On the home page they scroll; from any other
   route they navigate home first and then scroll, which is what the second
   effect in Index.tsx is for. */
const NAV: NavItem[] = [
  { label: "Strategies", hash: "strategies" },
  { label: "Pricing", hash: "pricing" },
  { label: "Partners", hash: "partners" },
];

type Props = {
  /* The partner page runs a stripped capsule: a "Partners" brand tag, no section
     links, and one CTA. Same shell, different contents. */
  variant?: "site" | "partner";
};

const Header = ({ variant = "site" }: Props) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  /* The capsule sits on paper by default, but the dark reading theme flips the
     page out from under it — see use-brand-logo.ts. */
  const logo = useBrandLogo("light");

  /* Two guards against stalling the very first flick. The threshold is 70px, not
     24px, so the class flips once the gesture already has momentum instead of on
     its first millimetre. And the toggle is hysteretic — 70 down, 40 back up —
     so a scroll that idles near the boundary cannot thrash the class on and off,
     relaying out the bar on alternate frames. */
  useEffect(() => {
    let ticking = false;
    let on = false;
    const apply = () => {
      ticking = false;
      const next = on ? window.scrollY > 40 : window.scrollY > 70;
      if (next === on) return;
      on = next;
      setScrolled(next);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToSection = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (pathname === "/") {
      document.getElementById(hash)?.scrollIntoView({ block: "start" });
      /* Keep the URL honest so a copied link lands in the same place. */
      window.history.replaceState(null, "", `/#${hash}`);
      return;
    }
    navigate("/", { state: { scrollTo: hash } });
  };

  return (
    <>
      {/* Two skip links, and both are needed. `.site-skip` is the design's
          pill; the `skip-link` class is what the accessibility CSS in index.css
          already exempts from forced underlines. */}
      <a className="site-skip skip-link" href="#main-content">
        Skip to content
      </a>

      <header className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-in">
          <Link className="nav-logo" to="/" aria-label="TurboTrade.ai home">
            {/* Phones get the symbol alone; the breakpoint matches the 760px
                step in site.css that sizes it. */}
            <picture>
              <source media="(max-width: 760px)" srcSet={LOGO_MARK} />
              <img src={logo} alt="TurboTrade.ai" />
            </picture>
            {variant === "partner" && <span className="brand-tag">Partners</span>}
          </Link>

          {variant === "site" && (
            <>
              <button
                ref={burgerRef}
                type="button"
                className="burger"
                aria-label="Menu"
                aria-expanded={menuOpen}
                aria-controls="nav-links"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <svg width="17" height="13" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M0 1h18M0 7h18M0 13h18" />
                </svg>
              </button>

              <nav
                className={`nav-links${menuOpen ? " open" : ""}`}
                id="nav-links"
                aria-label="Main"
              >
                {NAV.map((item) => (
                  <a key={item.hash} href={`/#${item.hash}`} onClick={goToSection(item.hash)}>
                    {item.label}
                  </a>
                ))}
                {/* Routes, not sections: the hub that lists every policy, and the
                    contact page. The burger menu renders this same list. */}
                <Link to="/legal" onClick={() => setMenuOpen(false)}>
                  Legal
                </Link>
                <Link to="/contact" onClick={() => setMenuOpen(false)}>
                  Contact us
                </Link>
                {/* Phone only: the capsule's own trigger is hidden there, and
                    this row opens the same panel. */}
                <button
                  type="button"
                  className="nav-a11y"
                  aria-haspopup="dialog"
                  aria-controls="a11y-preferences-sheet"
                  onClick={() => {
                    setMenuOpen(false);
                    setA11yOpen(true);
                  }}
                >
                  <Accessibility aria-hidden="true" />
                  Accessibility
                </button>
              </nav>
            </>
          )}

          <div className={`nav-cta${variant === "partner" ? " nav-cta-end" : ""}`}>
            <AccessibilityToolbar
              triggerClassName={`a11y-capsule-trigger${variant === "site" ? " a11y-in-menu" : ""}`}
              open={a11yOpen}
              onOpenChange={setA11yOpen}
              returnFocusRef={burgerRef}
            />
            {variant === "partner" ? (
              <a className="btn btn-y btn-sm" href="#apply">
                Apply Now
              </a>
            ) : (
              <>
                <a className="btn btn-o btn-sm" data-cta="header" target="_blank" rel="noopener noreferrer" href={APP_LOGIN_URL}>
                  Log in
                </a>
                <a className="btn btn-y btn-sm nav-signup" data-cta="header" target="_blank" rel="noopener noreferrer" href={APP_SIGNUP_URL}>
                  Sign up
                </a>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
