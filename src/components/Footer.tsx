import { Link, NavLink } from "react-router-dom";
import { Linkedin, Twitter, Mail } from "lucide-react";
import { useBrandLogo } from "@/hooks/use-brand-logo";
import { LEGAL_NAV } from "@/content/legal/meta";
import { COMPANY } from "@/lib/company";

/* ══════════════ FOOTER ══════════════
   Four columns and then the disclosures. Every legal page is reachable from the
   Legal column, which is generated from the same list as the routes
   (content/legal/pages.ts), so a page added there can never be missing here.
   "Investor help" carries the grievance routes SEBI expects a Research Analyst
   to surface: our own grievance page, the complaint board, SCORES and Smart ODR.
   None of this is decoration: a SEBI-registered intermediary's site has to carry
   it on every page, which is why it lives in the footer rather than the nav.

   The plain-English risk summary sits ABOVE the formal risk disclosure. It does
   not replace it, and the long paragraph must stay. */

const Footer = () => {
  const year = new Date().getFullYear();
  /* High contrast repaints the footer white, so the light-ink lockup would
     vanish there. */
  const logo = useBrandLogo("dark");

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="f-top">
          <div>
            <img src={logo} alt="TurboTrade.ai" />
            <p className="f-tag">Automatic trading, inside your own broker account.</p>
            <div className="f-reg">
              {COMPANY.entity}
              <br />
              SEBI Research Analyst · {COMPANY.sebiRa}
              <br />
              BSE Enlistment No. {COMPANY.bseEnlistment} · CIN {COMPANY.cin}
            </div>

            <div className="f-social">
              <a
                href="https://in.linkedin.com/company/tradeonai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TurboTrade on LinkedIn"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="https://x.com/TradeOnAi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TurboTrade on X"
              >
                <Twitter className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href={`mailto:${COMPANY.email}`} aria-label="Email TurboTrade">
                <Mail className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            {/* Typographic badge, not an ISO logo. ISO does not permit certified
                organisations to use its logo — only the certification body's
                mark, under that body's rules. Swap this for the certifier's mark
                once the artwork and the permission are in hand. */}
            <div className="f-iso" aria-label="ISO/IEC 27001:2022 certified">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3z" />
                <path d="M9 12.2l2 2 4-4.2" />
              </svg>
              <span>
                <b>ISO/IEC 27001:2022</b>
                <br />
                Information security management
              </span>
            </div>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <Link to="/contact">Contact us</Link>
              </li>
              <li>
                <Link to="/broker-partner-program">For brokers &amp; partners</Link>
              </li>
              <li>
                <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              </li>
              <li>
                <a href={`tel:${COMPANY.phoneTel}`}>{COMPANY.phone}</a>
              </li>
              {/* <li>
                <Link to={APP_ROUTE}>About us</Link>
              </li>
              <li>
                <Link to={APP_ROUTE}>Blog</Link>
              </li> */}
            </ul>
          </div>

          <div>
            <h4>Investor help</h4>
            <ul>
              <li>
                <Link to="/grievance-redressal">Raise a grievance</Link>
              </li>
              <li>
                <Link to="/complaint-board">Complaint board</Link>
              </li>
              <li>
                <a href="https://scores.sebi.gov.in" target="_blank" rel="noopener noreferrer">
                  SEBI SCORES
                </a>
              </li>
              <li>
                <a href="https://smartodr.in" target="_blank" rel="noopener noreferrer">
                  Smart ODR
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Legal</h4>
            <ul>
              {LEGAL_NAV.map(({ slug, label }) => (
                <li key={slug}>
                  <NavLink to={`/${slug}`} end>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="plain">
          <h4>The risks, in plain words</h4>
          <ul>
            <li>Trading options and futures is risky. You can lose money.</li>
            <li>On a bad day you can lose more than you put in.</li>
            <li>Nothing on this page is a promise of profit. Some months will be losses.</li>
            <li>
              Being registered with SEBI does not mean anyone can protect you from losing money.
            </li>
            <li>How a strategy did in the past does not tell you how it will do next.</li>
            <li>
              Only trade money you can afford to lose, and read the full terms before you start.
            </li>
          </ul>
        </div>

        <div className="f-disc">
          <b>Risk disclosure.</b> Algorithmic trading in exchange-traded derivatives involves
          substantial risk of loss and is not suitable for every investor. Options and futures
          positions can produce losses exceeding the capital allocated to them. TurboTrade places
          orders in your own broker account under an authorisation you grant and within limits you
          configure; it does not hold client funds and is not a custodian. Past performance does not
          indicate or guarantee future results. Registration with SEBI and enlistment with BSE do
          not guarantee performance or assure any returns. Please consider your financial position and risk
          tolerance, and read all related documents, before subscribing.
        </div>

        <div className="f-bot">
          <span>
            © {year} {COMPANY.entity} · TurboTrade.ai
          </span>
          <span>
            SEBI RA {COMPANY.sebiRa} · BSE Enlistment {COMPANY.bseEnlistment}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
