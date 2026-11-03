import { Link } from "react-router-dom";
import { APP_LOGIN_URL, APP_PLANS_URL } from "@/lib/brand";

/* ══════════════ PRICING ══════════════
   Teaser: from-price + no profit share; full plans live behind sign-up. */

const Check = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.9" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const FEATURES = [
  { text: "No profit share. Everything a strategy makes is yours", key: true },
  { text: "One flat price, however often your strategies trade", key: false },
  { text: "Every plan comes with slots. One slot runs one lot", key: false },
  { text: "Your money stays in your own broker account", key: false },
];

export default function Pricing() {
  return (
    <section className="tint" id="pricing" aria-labelledby="pricingTitle">
      <div className="wrap">
        <div className="s-head ctr">
          <span className="eyebrow">Pricing</span>
          <h2 id="pricingTitle">
            Plans from ₹2,999&nbsp;a&nbsp;month.
            <br />
            <span className="hl">No profit share.</span>
          </h2>
          <p className="lede">
            Everything a strategy makes is yours. You pay one flat price for your plan, whether your strategies trade every day or wait out a quiet week.
          </p>
        </div>

        <div className="price">
          <div className="pc feat" id="account">
            <div className="nm">Plans starting from</div>
            <div className="amt">
              ₹2,999<small> /month</small>
            </div>
            <ul>
              {FEATURES.map((f) => (
                <li key={f.text} className={f.key ? "key" : undefined}>
                  <Check />
                  {f.text}
                </li>
              ))}
            </ul>
            <a className="btn btn-y" data-cta="pricing" href={APP_PLANS_URL} target="_blank" rel="noopener noreferrer">
              Create account
            </a>
            <p className="pc-fine">
              See every plan after you sign up. Already have an account?{" "}
              <a data-cta="pricing" href={APP_LOGIN_URL} target="_blank" rel="noopener noreferrer">
                Log in
              </a>
            </p>
          </div>

          <div className="pc">
            <div className="nm">How slots work</div>
            <div className="amt sm">One slot runs one lot.</div>
            <div
              className="sdemo"
              role="img"
              aria-label="Example with 5 slots: all five on Omega to trade it at 5 lots, or two on Omega and three on Flux."
            >
              <div className="row">
                <span className="cap">Trade one strategy bigger</span>
                <div className="tiles">
                  <span className="a">
                    Omega<small>lot 1</small>
                  </span>
                  <span className="a">
                    Omega<small>lot 2</small>
                  </span>
                  <span className="a">
                    Omega<small>lot 3</small>
                  </span>
                  <span className="a">
                    Omega<small>lot 4</small>
                  </span>
                  <span className="a">
                    Omega<small>lot 5</small>
                  </span>
                </div>
              </div>
              <div className="row">
                <span className="cap">Or spread them across several</span>
                <div className="tiles">
                  <span className="a">
                    Omega<small>lot 1</small>
                  </span>
                  <span className="a">
                    Omega<small>lot 2</small>
                  </span>
                  <span className="b">
                    Flux<small>lot 1</small>
                  </span>
                  <span className="b">
                    Flux<small>lot 2</small>
                  </span>
                  <span className="b">
                    Flux<small>lot 3</small>
                  </span>
                </div>
              </div>
            </div>
            <p className="pr-note">
              Five slots, two ways to use them. Move slots between strategies whenever you like. Each lot still needs its own margin in your broker account.
            </p>
          </div>
        </div>

        <p className="price-fine">
          Prices in INR, GST included. Brokerage, exchange charges and taxes on your trades are separate and go to your broker. Trading for an institution?{" "}
          <Link to="/contact">Talk to us</Link>.
        </p>
      </div>
    </section>
  );
}
