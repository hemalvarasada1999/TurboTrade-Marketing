import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AccessibilityToolbar } from "@/components/site/AccessibilityToolbar";
import { APP_ROUTE } from "@/lib/brand";
import { useBrandLogo } from "@/hooks/use-brand-logo";

/* ══════════════ HEADER ══════════════
   The glass capsule. `header.nav` is a fixed positioning shell with no visual of
   its own; everything you can see belongs to `.nav-in`, so there is no
   full-bleed bar at any scroll position. See site.css for why nothing here
   animates a layout property.

   The accessibility control lives inside the capsule rather than in a bar of its
   own. It is a statutory feature (RPwD Act / IS 17802), so it has to be reachable
   from every route — and this header is the one component every route renders. */

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
            <img src={logo} alt="TurboTrade.ai" />
            {variant === "partner" && <span className="brand-tag">Partners</span>}
          </Link>

          {variant === "site" && (
            <>
              <button
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
              </nav>
            </>
          )}

          <div className={`nav-cta${variant === "partner" ? " nav-cta-end" : ""}`}>
            <AccessibilityToolbar triggerClassName="a11y-capsule-trigger" />
            {variant === "partner" ? (
              <a className="btn btn-y btn-sm" href="#apply">
                Apply Now
              </a>
            ) : (
              <>
                <Link className="btn btn-o btn-sm" to={APP_ROUTE}>
                  Log in
                </Link>
                <Link className="btn btn-y btn-sm" to={APP_ROUTE}>
                  Start free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
