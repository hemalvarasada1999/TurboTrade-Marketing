/* ══════════════ TWO MODELS ══════════════
   Co-branded is marked as the recommended start, and the copy says why: it is
   the model for a broker who should not be committing capital to this yet. The
   "Best For" line on each card is the actual differentiator — the paragraphs
   above it describe the build, the line describes who should pick it. */

export default function PartnerModels() {
  return (
    <section id="models" className="tint" aria-labelledby="modelsTitle">
      <div className="wrap">
        <div className="s-head ctr">
          <span className="eyebrow">Two Ways In</span>
          <h2 id="modelsTitle">
            Start Co-Branded. Go White-Label When the Numbers Justify It.
          </h2>
        </div>
        <div className="models">
          <div className="model feat">
            <div className="model-id">
              OPTION_01 <span className="rec">Most partners start here</span>
            </div>
            <h3>Co-Branded</h3>
            <span className="model-meta">Fastest Launch · Revenue Share</span>
            <p>
              We supply the strategies, you distribute them to your client base. TurboTrade stays
              visible as the research and execution provider, so our SEBI RA registration does the
              credibility work for you. Lightest integration, quickest proof of demand.
            </p>
            <div className="model-best">
              <b>Best For</b>
              Finding out whether your clients pay for automation before you invest in anything.
            </div>
          </div>

          <div className="model">
            <div className="model-id">OPTION_02</div>
            <h3>White-Label</h3>
            <span className="model-meta">Your Brand End-to-End · Revenue Share</span>
            <p>
              A complete algo storefront inside your app or terminal &mdash; your brand, your
              pricing. Clients browse, subscribe, authorise and monitor without ever seeing our
              name. We run the engine, the research and the strategy roadmap. You own the client
              and the P&amp;L line.
            </p>
            <div className="model-best">
              <b>Best For</b>
              Making automation a reason people choose you, not a feature you merely have.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
