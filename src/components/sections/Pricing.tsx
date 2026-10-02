import { APP_LOGIN_URL, APP_SIGNUP_URL } from "@/lib/brand";

/* ══════════════ PRICING ══════════════
   Pay per strategy, only on the days it places a trade. Two cards: the model,
   and one example week showing what that means in practice. Neither shows a
   figure — the price varies per strategy and lives on the strategy page,
   behind the login.

   Two claims here depend on product facts. "No trade that day, nothing to pay"
   is only true while there is no fixed annual or platform fee, and positional
   strategies must not carry a separate per-hold-day charge. If either changes,
   this section has to say so. */

const Check = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.9" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const MODEL = [
  "Charged only on days a strategy you subscribed to places a trade",
  "No trade that day, nothing to pay",
  "Each strategy is billed on its own. Add or remove any time",
  "No profit share. Everything a strategy makes is yours",
];

/* Illustrative, and the fine print says so. */
const WEEK: { d: string; traded: boolean }[] = [
  { d: "Mon", traded: true },
  { d: "Tue", traded: false },
  { d: "Wed", traded: false },
  { d: "Thu", traded: true },
  { d: "Fri", traded: false },
];

export default function Pricing() {
  return (
    <section className="tint" id="pricing">
      <div className="wrap">
        <div className="s-head ctr">
          <span className="eyebrow">Pricing</span>
          <h2>
            Pay only on the days <span className="hl">it trades.</span>
          </h2>
          <p className="lede">
            Every strategy is built around market structure and regime, and stays out when
            conditions don&rsquo;t suit it. It doesn&rsquo;t over-trade, so you don&rsquo;t over-pay.
          </p>
        </div>

        <div className="price">
          <div className="pc feat" id="account">
            <div className="nm">Pay as you use</div>
            <div className="amt">
              Per strategy<small> · per trade day</small>
            </div>
            <ul>
              {MODEL.map((li) => (
                <li key={li}>
                  <Check />
                  {li}
                </li>
              ))}
            </ul>
            <a className="btn btn-y" href={APP_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
              Create account
            </a>
          </div>

          <div className="pc pr-week">
            <div className="nm">How a week is billed</div>
            <div className="amt">
              2 of 5 days<small> · one strategy</small>
            </div>
            <ul
              className="pr-days"
              aria-label="Example week: the strategy traded on Monday and Thursday and sat out Tuesday, Wednesday and Friday"
            >
              {WEEK.map(({ d, traded }) => (
                <li key={d} className={traded ? "on" : "off"}>
                  <span className="d">{d}</span>
                  <span className="m" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={traded ? 2.6 : 2.4} strokeLinecap="round">
                      <path d={traded ? "M3 17l6-6 4 4 8-8" : "M5 12h14"} />
                    </svg>
                  </span>
                  <span className="s">{traded ? "Traded" : "Sat out"}</span>
                  <span className="c">{traded ? "Charged" : "₹0"}</span>
                </li>
              ))}
            </ul>
            <p className="pr-note">
              Quiet days aren&rsquo;t a fault. Waiting for the right conditions is part of the plan,
              and you don&rsquo;t pay for it.
            </p>
            <a className="btn btn-o" href={APP_LOGIN_URL} target="_blank" rel="noopener noreferrer">
              Log in to see prices
            </a>
          </div>
        </div>

        <p className="price-fine">
          Example week is illustrative. Each strategy shows its price per trade day inside.
          Brokerage, exchange charges and GST are separate.
        </p>
      </div>
    </section>
  );
}
