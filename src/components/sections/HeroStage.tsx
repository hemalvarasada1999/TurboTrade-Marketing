import { useEffect, useRef, useState } from "react";
import { APP_LOGIN_URL, APP_SIGNUP_URL, APP_STRATEGIES_URL, HERO_SCREENS, SEBI_RA_NUMBER } from "@/lib/brand";

/* ══════════════ HERO ══════════════
   Three bands in one screen: the claim beside three app screens, a three-step
   strip, and the trust row that ends the hero.

   The phone stack carries role="img" and one aria-label. Assistive tech gets
   the one-sentence description rather than three unlabelled images, and the
   screens are sample data by definition. Never put performance numbers in them. */

type Props = {
  /* True once the curtain has lifted. The registration badge's gold sweep is
     keyed to this, not to mount: underneath the curtain the animation would
     finish before anyone could see it. */
  shine?: boolean;
};

/* The floating notes around the phones, one per screen's point. */
const CHIPS = [
  { cls: "c1", label: "Plans from ₹2,999/month", d: "M20 6L9 17l-5-5" },
  { cls: "c2", label: "No profit share", d: "M5 12h14M12 5v14" },
  { cls: "c3", label: "One-tap stop", d: "M18.36 6.64a9 9 0 11-12.73 0M12 2v10" },
];

const STEPS = [
  { n: "01", h: "Connect your broker", p: "One login. Revoke any time." },
  { n: "02", h: "Pick a strategy", p: "15+ ready to run." },
  { n: "03", h: "Assign your slots", p: "One slot per lot. Move any time." },
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
                <a className="btn btn-y" data-cta="hero" href={APP_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
                  Create account
                </a>
                <a className="btn btn-o" data-cta="hero" href={APP_STRATEGIES_URL} target="_blank" rel="noopener noreferrer">
                  See strategies
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
              <p className="hero-fine">
                See every strategy&rsquo;s numbers before you commit. Already have an account?{" "}
                <a data-cta="hero" href={APP_LOGIN_URL} target="_blank" rel="noopener noreferrer">
                  Log in
                </a>
              </p>
            </div>

            <div>
              {/* Three app screens: left = HTML "Your plan" screen showing slots in use,
                  centre = algos.webp with its "Credits a day" line patched to slots,
                  and right = the emergency stop. */}
              <div
                className="phones"
                role="img"
                aria-label="TurboTrade app screens: your plan with seven of nine slots in use, seven strategies running with lot controls and a pause button, and the one-tap emergency stop."
              >
                <figure className="ph ph-l">
                  <div className="ph-ui" aria-hidden="true">
                    <div className="u-top">
                      <span className="u-back">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                      </span>
                      <span className="u-h">Your plan</span>
                    </div>
                    <div className="u-card">
                      <span className="u-k">Current plan</span>
                      <div className="u-plan">
                        <b>9 slots</b>
                        <span className="u-pill">Monthly</span>
                      </div>
                      <div className="u-bar">
                        <i className="on" />
                        <i className="on" />
                        <i className="on" />
                        <i className="on" />
                        <i className="on" />
                        <i className="on" />
                        <i className="on" />
                        <i />
                        <i />
                      </div>
                      <div className="u-row">
                        <span>Slots used</span>
                        <b>7 of 9</b>
                      </div>
                      <div className="u-row">
                        <span>Renews</span>
                        <b>3 Dec</b>
                      </div>
                    </div>
                    <span className="u-k">Slots in use</span>
                    <div className="u-list">
                      <div className="u-item">
                        <span className="u-ic">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5.5 18.5 18 6" />
                            <path d="M11 6h7v7" />
                            <circle cx="5.5" cy="18.5" r="1.8" />
                          </svg>
                        </span>
                        <span className="u-nm">
                          Vector<small>SENSEX</small>
                        </span>
                        <span className="u-lots">1 lot</span>
                      </div>
                      <div className="u-item">
                        <span className="u-ic">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 20.5h8L13.8 5h-3.6z" />
                            <path d="m12 16.5 4.6-9.5" />
                            <path d="M14.8 10.4h2.4" />
                            <path d="M6.5 20.5h11" />
                          </svg>
                        </span>
                        <span className="u-nm">
                          Cadence<small>NIFTY</small>
                        </span>
                        <span className="u-lots">1 lot</span>
                      </div>
                      <div className="u-item">
                        <span className="u-ic">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6z" />
                            <path d="m8.5 12.5 3.5-3.5 3.5 3.5" />
                            <path d="m8.5 16 3.5-3.5 3.5 3.5" />
                          </svg>
                        </span>
                        <span className="u-nm">
                          Venguard<small>BANKNIFTY</small>
                        </span>
                        <span className="u-lots">1 lot</span>
                      </div>
                      <div className="u-item u-free">+ 4 more · 2 slots free</div>
                    </div>
                    <div className="u-btn">Change plan</div>
                  </div>
                </figure>
                <figure className="ph ph-r">
                  <img src={HERO_SCREENS.stop} alt="" width="585" height="1266" loading="eager" decoding="async" />
                </figure>
                <figure className="ph ph-c">
                  <div className="shot">
                    <img src={HERO_SCREENS.algos} alt="" width="585" height="1266" fetchpriority="high" decoding="async" />
                    <span className="ph-patch" aria-hidden="true">
                      <span>Slots in use</span>
                      <b>7 of 9</b>
                    </span>
                  </div>
                </figure>
                {CHIPS.map((c) => (
                  <span className={`ph-chip ${c.cls}`} key={c.cls}>
                    <i aria-hidden="true">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d={c.d} />
                      </svg>
                    </i>
                    {c.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* band two: the three steps, as white cards on the frosted strip */}
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

      {/* band three: the trust points as pills, on the same frosted strip as
          the steps — the hairline under it is what ends the hero */}
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
