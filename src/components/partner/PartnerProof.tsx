/* ══════════════ PROOF ══════════════
   An ordered list beside a sticky head. Boxless like the landing page's #what
   columns: hairlines and the numeral do the separating, so four items do not
   become four cards. The numerals are in the markup, not in CSS counters,
   because they are content — they get referred to by number in review.

   COMPLIANCE WORDING on item 04 and on the regulatory panel below describes what
   the architecture was BUILT FOR. Do not change either to "SEBI compliant algo",
   "SEBI approved" or "guaranteed compliant" — SEBI does not certify algos, and as
   a Research Analyst we cannot imply regulatory endorsement of a product. Keep
   this phrasing. */

const ITEMS = [
  {
    n: "01",
    h: "An in-house quant research desk",
    p: "Our team continuously builds, tests and retires strategies as volatility and market regimes shift — so your clients aren't left running a model that only worked in a market that's gone.",
  },
  {
    n: "02",
    h: "Institutional risk controls",
    p: "Position sizing, per-client exposure caps, and kill switches that act at the engine level.",
  },
  {
    n: "03",
    h: "Systematic SL/TP on every strategy",
    p: "Pre-defined exits executed mechanically. No discretion, no dispute afterwards.",
  },
  {
    n: "04",
    h: "Compliance and security by design",
    p: "Built around SEBI's algo framework from the ground up rather than retrofitted before an inspection — order tagging, audit trails and AES-256 key handling are structural, not add-ons.",
  },
];

export default function PartnerProof() {
  return (
    <section aria-labelledby="proofTitle">
      <div className="wrap split">
        <div className="s-head">
          <span className="eyebrow">Already Running in Production</span>
          <h2 id="proofTitle">What You'd Be Plugging Into.</h2>
        </div>
        <ol className="proof">
          {ITEMS.map((item) => (
            <li className="pi" key={item.n}>
              <span className="n" aria-hidden="true">
                {item.n}
              </span>
              <div>
                <h3>{item.h}</h3>
                <p>{item.p}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* The regulatory note is the expansion of item 04 above, not a section of
          its own. Demoted to h3 and set on a tinted panel: it is a peer argument,
          and at h2 size it competed with the list. */}
      <div className="wrap">
        <div className="regnote">
          <div>
            <span className="eyebrow">The Regulatory Reality</span>
            <h3 id="regTitle">SEBI Put Brokers at the Centre of Retail Algo.</h3>
          </div>
          <div className="reg">
            <p>
              Algos routed through you, registered with the exchange, uniquely tagged and auditable.{" "}
              <b>You carry that obligation either way</b> &mdash; the only question is whether you
              carry it for a third-party vendor's product or for your own revenue line.
            </p>
            <p>
              We built for that structure rather than around it. TurboTrade operates as a{" "}
              <b>SEBI-Registered Research Analyst</b> and an{" "}
              <b>exchange-empanelled algo provider</b>. Bring your compliance officer to the first
              call.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
