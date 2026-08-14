import { useEffect, useRef, useState } from "react";
import { APP_SIGNUP_URL, APP_STRATEGIES_URL, SEBI_RA_NUMBER } from "@/lib/brand";

/* ══════════════ HERO ══════════════
   Three bands in one screen: the claim beside a still of the product, a
   three-step strip, and the trust row that ends the hero.

   The panel carries role="img" and one aria-label. Assistive tech gets the
   one-sentence description rather than two dozen orphaned fragments, and
   everything inside it is decorative by definition — it is a screenshot drawn in
   CSS, not a live view. Do not add real numbers to it. */

type Props = {
  /* True once the curtain has lifted. The registration badge's gold sweep is
     keyed to this, not to mount: underneath the curtain the animation would
     finish before anyone could see it. */
  shine?: boolean;
};

const STEPS = [
  { n: "01", h: "Connect your broker", p: "One login. Revoke any time." },
  { n: "02", h: "Pick a strategy", p: "15+ ready to run." },
  { n: "03", h: "Set your quantity", p: "Lots per strategy. Change any time." },
];

export default function HeroStage({ shine = false }: Props) {
  const badgeRef = useRef<HTMLParagraphElement>(null);
  const [idle, setIdle] = useState(false);

  /* Paused while the badge is off-screen. A loop that keeps repainting a masked
     gradient behind three screenfuls of scrolled-past content is pure waste, and
     pausing (rather than removing the class) preserves the cycle position so
     scrolling back does not trigger a fresh sweep every time. */
  useEffect(() => {
    const el = badgeRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => setIdle(!entries[0].isIntersecting),
      { rootMargin: "80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="stage" id="stage" aria-labelledby="heroTitle">
      <div className="st-copy">
        <div className="wrap">
          {/* The registration seal. Two lines because the label and the number do
              different jobs: one says what we are, the other is the string a
              visitor can paste into SEBI's intermediary search. */}
          <p
            ref={badgeRef}
            className={`regbadge${shine ? " shine" : ""}${idle ? " idle" : ""}`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3l7.5 3.1v5.1c0 4.5-3.2 7.4-7.5 8.3-4.3-.9-7.5-3.8-7.5-8.3V6.1z" />
              <path d="M9.1 12.1l2 2 3.8-3.9" />
            </svg>
            <span className="tx">
              <span className="l1">SEBI registered research analyst</span>
              <span className="l2">Registration No. {SEBI_RA_NUMBER}</span>
            </span>
          </p>

          <div className="st-grid">
            <div>
              <span className="eyebrow">
                Luxury is time.
                <br />
                Time back. Life on track.
              </span>
              <h1 id="heroTitle">
                Trading that runs <span className="hl">without you.</span>
              </h1>
              <p className="deck">
                The market is open 9:15 to 3:30.
                <br />
                You don't have to be.
              </p>
              <div className="hero-cta">
                <a className="btn btn-y" href={APP_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
                  Start free
                </a>
                <a className="btn btn-o" href={APP_STRATEGIES_URL} target="_blank" rel="noopener noreferrer">
                  See strategies
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
              <p className="hero-fine">Free for 5 trading days. One strategy, real trades.</p>
            </div>

            <div>
              <div
                className="pnl"
                role="img"
                aria-label="A still of the TurboTrade dashboard mid-session: three strategies running at one or two lots each, each exiting on its own rules, a quantity control set to two lots, and two open positions with a square-off button."
              >
                <div className="pnl-top">
                  <span className="lv">
                    <span className="dot" />
                    Live
                  </span>
                  <span className="tm">11:40 am</span>
                </div>
                <div className="pnl-clock">
                  <span>9:15</span>
                  <span className="bar">
                    <i />
                  </span>
                  <span>3:30</span>
                </div>
                <span className="pnl-lbl">Running</span>
                <div className="pnl-rows">
                  <div className="prow">
                    <span className="dot" />
                    Nifty momentum<span className="q">2 lots</span>
                  </div>
                  <div className="prow">
                    <span className="dot" />
                    Bank straddle<span className="q">1 lot</span>
                  </div>
                  <div className="prow">
                    <span className="dot" />
                    Delta neutral<span className="q">1 lot</span>
                  </div>
                </div>
                <p className="pnl-note">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  Each exits on its own rules
                </p>
                <div className="pnl-ctl">
                  Quantity
                  <span className="r qty">
                    <i>&minus;</i>
                    <span>2 lots</span>
                    <i>+</i>
                  </span>
                </div>
                <div className="pnl-ctl">
                  Open positions <span className="v">2</span>
                  <span className="r pill-btn">Square off</span>
                </div>
              </div>
              <p className="pnl-cap">Illustrative. Not live data.</p>
            </div>
          </div>
        </div>
      </div>

      {/* band two: the three steps, boxless. The numeral does the work a card
          border used to — ~90px of height back, and one less thing that makes
          the hero read like a pricing table. */}
      <div className="hsteps" id="how">
        <div className="hsteps-in">
          <div className="hgrid">
            {STEPS.map((s) => (
              <div className="hstep" key={s.n}>
                <span className="hn" aria-hidden="true">
                  {s.n}
                </span>
                <div>
                  <h2>{s.h}</h2>
                  <p>{s.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* band three: a full-bleed tinted strip, the last thing in the hero and
          the rule that tells you the hero has finished */}
      <div className="hband">
        <p className="hband-in">
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Trading on auto-pilot
          </span>
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" />
            </svg>
            Money stays in your broker account
          </span>
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v6M10 10V6a2 2 0 0 0-4 0v9M18 8a2 2 0 0 1 4 0v6a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8" />
            </svg>
            Full control of open positions
          </span>
        </p>
      </div>
    </section>
  );
}
