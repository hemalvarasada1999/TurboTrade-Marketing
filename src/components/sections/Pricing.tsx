import { APP_LOGIN_URL, APP_SIGNUP_URL } from "@/lib/brand";

/* ══════════════ PRICING ══════════════
   Two cards, but a sequence rather than a tier choice — free for five days, then
   per strategy. The paid card deliberately shows no figure: the price varies per
   strategy and belongs on the strategy page.

   The trial does not simulate anything. Real trades, real money, at the smallest
   size the exchange allows, and the card says so — because somebody who reads
   "free trial" and assumes no exposure finds out at the worst possible moment.

   Note what is absent: "No card. Broker not connected." The broker link is
   required on day one now. That friction moved from day six to day one and has to
   be visible before signup, not at the connect screen. */

const Check = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.9" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const TRIAL = [
  "One strategy, at the smallest size the exchange allows",
  "Real trades and real money, in your own broker account",
  "Backtest every strategy, over any period you choose",
  "No payment to start. Your broker account is connected.",
];

const PAID = [
  "Real trades in your own broker account",
  "You set the size. The stop loss is set in advance.",
  "Stop one strategy, or all of them, at any moment",
  "Same-day trade list, plus WhatsApp alerts",
];

export default function Pricing() {
  return (
    <section className="tint" id="pricing">
      <div className="wrap">
        <div className="s-head ctr">
          <span className="eyebrow">Pricing</span>
          <h2>One price per strategy. We take none of your profit.</h2>
          <p className="lede">
            Everything a strategy makes is yours. Our price is for running it, and you pay only for
            the ones you have switched on, month by month.
          </p>
        </div>

        <div className="price">
          <div className="pc feat" id="trial">
            <div className="nm">Free trial</div>
            <div className="amt">
              ₹0<small> · five trading days</small>
            </div>
            <ul>
              {TRIAL.map((li) => (
                <li key={li}>
                  <Check />
                  {li}
                </li>
              ))}
            </ul>
            <a className="btn btn-y" href={APP_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
              Start free
            </a>
          </div>

          <div className="pc">
            <div className="nm">After the trial</div>
            <div className="amt">
              Per strategy<small> · every month</small>
            </div>
            <ul>
              {PAID.map((li) => (
                <li key={li}>
                  <Check />
                  {li}
                </li>
              ))}
            </ul>
            <a className="btn btn-o" href={APP_LOGIN_URL} target="_blank" rel="noopener noreferrer">
              Log in to see prices
            </a>
          </div>
        </div>

        {/* Prices sit behind the login, so this line no longer promises them on
            the open site. If a public "from ₹X" is ever agreed, this is where it
            goes. */}
        <p className="price-fine">
          Inside, every strategy shows its price and the money you need to run it. Brokerage,
          exchange charges and GST are separate.
        </p>
      </div>
    </section>
  );
}
