/* ══════════════ PARTNER HERO ══════════════
   The claim beside a demand panel, and then the "what stays yours" band that
   closes the hero.

   FIGURES: FY19 (7 lakh) and FY25 (~1 crore) individual F&O traders are
   traceable to SEBI's study on individual F&O traders. Keep the sourcing note
   attached to the numbers — the panel is the page's only quantitative claim.

   "What stays yours" is merged into the hero rather than sitting as its own
   section. It answers the objection the headline provokes, so it belongs in the
   same breath as the claim, not a scroll later. */

export default function PartnerHero() {
  return (
    <section className="phero" aria-labelledby="pTitle">
      <div className="wrap">
        <div className="phero-grid">
          <div>
            <span className="eyebrow">For SEBI-Registered Brokers &amp; Authorised Persons</span>
            <h1 id="pTitle">
              <span className="hl">Launch Algo Trading.</span>
              <span className="strike">Build an Algo Desk.</span>
            </h1>
            <p className="lede">
              Your clients are switching brokers to get automation. Offer it under{" "}
              <em>your own brand</em> &mdash; SEBI-registered strategies, exchange-compliant
              execution, institutional risk controls. No quant team. No client ever leaves your
              books.
            </p>
            <div className="cta-row">
              <a className="btn btn-y" href="#apply">
                Apply to the Partner Program
              </a>
              <a className="btn btn-o" href="#models">
                See the two models
              </a>
            </div>
            <ul className="trust">
              <li className="chip">
                <i aria-hidden="true" />
                SEBI-Registered Research Analyst
              </li>
              <li className="chip">
                <i aria-hidden="true" />
                Exchange Empanelled
              </li>
              <li className="chip">
                <i aria-hidden="true" />
                Funds Stay in Client Demat
              </li>
            </ul>
          </div>

          {/* the demand panel — the same still-of-a-product idiom as the landing
              hero. A <dl>: FY19 and FY25 are terms, the counts their definitions. */}
          <div className="signal">
            <div className="signal-top">
              <span className="t">Demand for Retail Algo</span>
              <span className="s">Individual F&amp;O traders · India</span>
            </div>
            <div className="signal-body">
              <dl className="sfig">
                <div className="srow a">
                  <dt>FY19</dt>
                  <dd>7 lakh</dd>
                </div>
                <div className="track thin" aria-hidden="true">
                  <i />
                </div>
                <div className="srow b">
                  <dt>FY25</dt>
                  <dd>~1 crore</dd>
                </div>
                <div className="track" aria-hidden="true">
                  <i className="full" />
                </div>
              </dl>
              <div className="sdelta">
                <b>+1,200%</b>
                <span>
                  growth in six years. Algo tooling went from niche to table stakes in the same
                  window.
                </span>
              </div>
              <p className="snote">
                Your most active clients already expect automation as standard.
              </p>
            </div>
            <div className="signal-foot">
              The demand is already here. Building for it takes quarters &mdash;{" "}
              <em>plugging into it takes weeks</em>.
            </div>
          </div>
        </div>

        <div className="conflict">
          <div className="conflict-top">
            <div>
              <span className="eyebrow">What Stays Yours</span>
              <h2 className="conflict-q" id="staysTitle">
                Your capital. Your order flow. Your brokerage.
              </h2>
              {/* one guarantee, sitting directly under the statement it qualifies
                  rather than in a row of its own. Not a heading — there is
                  nothing beneath it. */}
              <p className="cline">
                <span className="tick" aria-hidden="true">
                  &#10003;
                </span>
                Every order routes through you
              </p>
            </div>
            <div>
              <p className="conflict-a">
                We're a technology and strategy provider, not a trading destination.{" "}
                <b>Nothing in this partnership moves money or reroutes a single order.</b>
              </p>
              <p className="conflict-foot">
                <b>We make money when your clients trade more on your platform.</b> Our upside and
                yours point in the same direction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
