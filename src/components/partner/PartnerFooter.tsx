import { Link } from "react-router-dom";
import { useBrandLogo } from "@/hooks/use-brand-logo";

/* ══════════════ PARTNER FOOTER ══════════════
   A two-column risk block rather than the landing page's four-column sitemap:
   this page has one audience and one action, and a full sitemap here would
   compete with the application form directly above it.

   The legal routes still appear. A page a broker may land on directly cannot be
   the one page on the site with no route to the privacy policy. */

export default function PartnerFooter() {
  const year = new Date().getFullYear();
  const logo = useBrandLogo("dark");

  return (
    <footer className="site-footer">
      <div className="wrap foot-in">
        <div className="foot-l">
          <img src={logo} alt="TurboTrade.ai" />
          <p>
            <b>Risk disclosure.</b> Algorithmic and derivatives trading carries substantial risk of
            loss and is not suitable for every investor. Past performance is not indicative of future
            results. Strategies may incur losses in any period. Nothing on this page is investment
            advice or a solicitation to trade. This page is addressed to registered intermediaries
            and describes a business-to-business technology partnership only.
          </p>
          <Link className="foot-back" to="/">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              aria-hidden="true"
            >
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Back to TurboTrade
          </Link>
        </div>

        <div className="foot-r">
          SEBI-REGISTERED RESEARCH ANALYST
          <br />
          EXCHANGE EMPANELLED
          <br />
          <span>&copy; {year} TURBOTRADE.AI</span>
          <nav className="foot-legal" aria-label="Legal">
            <Link to="/contact">Contact</Link>
            <Link to="/disclaimer">Disclaimer</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/accessibility-statement">Accessibility</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
