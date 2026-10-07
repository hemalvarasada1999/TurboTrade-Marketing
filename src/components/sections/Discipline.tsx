/* ══════════════ WHILE YOU'RE AWAY ══════════════
   Fewer words, more air. A split head (claim left, one line right), then four
   one-line cards. There is no "See the strategies" button: the strategies
   section comes straight after. */

const CARDS = [
  {
    icon: (
      <path d="M17 2l4 4-4 4M3 11V9a4 4 0 014-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" />
    ),
    h: "Same plan, every trade",
    p: "No hoping on losers. No early exits on winners.",
  },
  {
    icon: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    h: "Never looks away",
    p: "Every strategy, watched from 9:15 to 3:30.",
  },
  {
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.6" />
        <rect x="14" y="3" width="7" height="7" rx="1.6" />
        <rect x="3" y="14" width="7" height="7" rx="1.6" />
        <rect x="14" y="14" width="7" height="7" rx="1.6" />
      </>
    ),
    h: "Many at once",
    p: "Each strategy runs at its own lot size.",
  },
  {
    icon: <path d="M18.36 6.64a9 9 0 11-12.73 0M12 2v10" />,
    h: "Stop any time",
    p: "One tap pauses it and closes open trades.",
  },
];

const Icon = ({ children, size }: { children: React.ReactNode; size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export default function Discipline() {
  return (
    <section id="what" className="disc">
      <div className="wrap">
        <div className="w-head">
          <div>
            <span className="eyebrow">While you're away</span>
            {/* the break keeps "disciplined execution." whole on its own line —
                `.hl` is nowrap, so a wrap would paint the marker across only part
                of the phrase */}
            <h2>
              No fear. No greed.
              <br />
              Just <span className="hl">disciplined execution.</span>
            </h2>
          </div>
          <p className="lede">Every trade&rsquo;s plan is fixed before it opens. TurboTrade follows it, every time.</p>
        </div>

        <div className="w-grid">
          {CARDS.map((c) => (
            <div className="w-card" key={c.h}>
              <span className="ic">
                <Icon size={19}>{c.icon}</Icon>
              </span>
              <h3>{c.h}</h3>
              <p>{c.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
