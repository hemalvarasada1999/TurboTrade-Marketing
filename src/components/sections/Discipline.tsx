/* ══════════════ WHILE YOU'RE AWAY ══════════════
   Fewer words, more air. A split head (claim left, one line right), four
   one-line cards, then a slim strip naming the four things fixed before a trade
   opens. There is no "See the strategies" button: the strategies section comes
   straight after. */

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

/* The four things fixed before a trade opens. "Fixed" is the whole point of the
   strip — do not soften it to "configurable". */
const FIXED = [
  { icon: <path d="M12 4v10M8 12l4 4 4-4M4 20h16" />, label: "Entry" },
  { icon: <path d="M12 20V10M8 12l4-4 4 4M4 4h16" />, label: "Target" },
  { icon: <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />, label: "Stop loss" },
  {
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
    label: "Exit time",
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

        <div className="w-fixed">
          <div>
            <span className="hd">Set before it goes live</span>
            <p>Fixed when the trade opens. Never changed while it runs.</p>
          </div>
          <ul>
            {FIXED.map((f) => (
              <li key={f.label}>
                <Icon size={16}>{f.icon}</Icon>
                {f.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
