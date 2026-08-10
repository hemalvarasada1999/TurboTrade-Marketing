/* ══════════════ THE OBJECTIONS ══════════════
   Three, and each answers a question a broker asks before an internal pitch, not
   after. The "not yet" in the third answer is the point of the third answer —
   removing it turns a straight reply into a lead form. */

const QA = [
  {
    q: "How long does integration take, and what does it cost?",
    a: "Co-branded launches in weeks — the gateway is built and the engines are live. White-label depends on how much of your front end we're skinning. Both are revenue share; white-label carries an implementation fee that scales with the build. Exact numbers come on the call once we know your client count.",
    open: true,
  },
  {
    q: "Are the strategies disclosed?",
    a: "The engines are blackbox — logic isn't disclosed at strategy level. Risk parameters, instrument universe, expected holding period, drawdown behaviour and full execution logs are. Your compliance team gets what it needs to supervise; the IP stays with us.",
  },
  {
    q: "We're a small brokerage. Are we too small?",
    a: 'Co-branded exists precisely for brokers who shouldn\'t be committing capital to this yet. Tell us your active client count and we\'ll be straight about whether the economics work — including if the answer is "not yet."',
  },
];

export default function PartnerFaq() {
  return (
    <section aria-labelledby="faqTitle">
      <div className="wrap">
        <div className="s-head ctr">
          <span className="eyebrow">Straight Answers</span>
          <h2 id="faqTitle">The Objections, Handled.</h2>
        </div>
        <div className="faq">
          {QA.map((item) => (
            <details key={item.q} open={item.open}>
              <summary>{item.q}</summary>
              <div className="a">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
