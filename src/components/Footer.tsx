import { Link } from "react-router-dom";
import { Linkedin, Twitter, Mail } from "lucide-react";
import {
  APP_LOGIN_URL,
  APP_ROUTE,
  APP_STRATEGIES_URL,
  SEBI_RA_NUMBER,
} from "@/lib/brand";
import { useBrandLogo } from "@/hooks/use-brand-logo";

/* ══════════════ FOOTER ══════════════
   Four columns and then the disclosures. Every legal route the site has is
   reachable from the Legal column — Contact, Disclaimer, Privacy, Terms and the
   Accessibility Statement. Those five are not decoration: a SEBI-registered
   intermediary's site has to carry them on every page, which is why they live in
   the footer rather than the nav.

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
            <div className="f-reg">SEBI Research Analyst · {SEBI_RA_NUMBER}</div>

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
              <a href="mailto:inquiry@turbotrade.ai" aria-label="Email TurboTrade">
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

          {/* <div>
            <h4>Platform</h4>
            <ul>
              <li>
                <a href={APP_STRATEGIES_URL} target="_blank" rel="noopener noreferrer">
                  See the strategies
                </a>
              </li>
              <li>
                <Link to="/#how">How it works</Link>
              </li>
              <li>
                <Link to="/#pricing">Pricing</Link>
              </li>
              <li>
                <Link to={APP_ROUTE}>Brokers we support</Link>
              </li>
              <li>
                <a href={APP_LOGIN_URL} target="_blank" rel="noopener noreferrer">
                  Log in
                </a>
              </li>
            </ul>
          </div> */}

          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <Link to="/contact">Contact us</Link>
              </li>
              <li>
                <Link to="/broker-partner-program">For brokers &amp; partners</Link>
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
            <h4>Legal</h4>
            <ul>
              <li>
                <Link to="/disclaimer">Disclaimer</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms &amp; conditions</Link>
              </li>
              <li>
                <Link to="/accessibility-statement">Accessibility statement</Link>
              </li>
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
              Only trade money you can afford to lose, and read the full terms below before you
              start.
            </li>
          </ul>
        </div>

        <div className="f-disc">
          <b>Risk disclosure.</b> Algorithmic trading in exchange-traded derivatives involves
          substantial risk of loss and is not suitable for every investor. Options and futures
          positions can produce losses exceeding the capital allocated to them. TurboTrade places
          orders in your own broker account under an authorisation you grant and within limits you
          configure; it does not hold client funds and is not a custodian. Past performance does not
          indicate or guarantee future results. Registration with SEBI does not guarantee
          performance or assure any returns. Please consider your financial position and risk
          tolerance, and read all related documents, before subscribing.
        </div>

        <div className="f-bot">
          <span>© {year} TurboTrade.ai</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
