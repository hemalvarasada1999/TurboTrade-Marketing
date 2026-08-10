/* ══════════════ WHILE YOU'RE AWAY ══════════════
   One section in place of three. "It sticks to the plan", "More than one at a
   time" and "You stay in control" were all answering the same question, and
   between them ran three full screens.

   Four boxless columns carry the argument; the band underneath carries the
   proof. Nothing here is a card — hairlines and one soft tint do the separating,
   which is what keeps it from reading heavy. */

const COLS = [
  {
    icon: (
      <path d="M17 2l4 4-4 4M3 11V9a4 4 0 014-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" />
    ),
    h: "Same plan, every trade",
    p: "It won't hold a losing trade and hope it turns. It won't close a good one early because you've had a long day.",
  },
  {
    icon: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    h: "It never looks away",
    p: "From 9:15 to 3:30 it watches every strategy you have running. It doesn't get tired at 2pm.",
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
    h: "More than one at a time",
    p: "You can only watch one chart. TurboTrade runs many strategies at once, each with its own lot size.",
  },
  {
    icon: <path d="M18.36 6.64a9 9 0 11-12.73 0M12 2v10" />,
    h: "Stop it any time",
    p: "Turn off one strategy or all of them, whenever you want. One tap closes your open trades.",
  },
];

/* The four things fixed before a trade opens. "fixed" is the whole point of the
   panel — do not soften it to "configurable". */
const PRESET = [
  { icon: <path d="M12 4v10M8 12l4 4 4-4M4 20h16" />, label: "Where to buy" },
  { icon: <path d="M12 20V10M8 12l4-4 4 4M4 4h16" />, label: "Where to sell" },
  { icon: <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />, label: "Where to get out" },
  {
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
    label: "When to close",
  },
];

export default function Discipline() {
  return (
    <section id="what" className="disc">
      <div className="wrap">
        <div className="disc-head">
          <span className="eyebrow">While you're away</span>
          {/* the break is deliberate: it keeps "just disciplined execution."
              whole on its own line. `.hl` is white-space:nowrap — the marker
              sweep is a single background band, so a wrap would paint it across
              only part of the phrase. */}
          <h2>
            No fear. No greed.
            <br />
            Just <span className="hl">disciplined execution.</span>
          </h2>
          <p className="lede">
            Every strategy comes with its numbers already decided &mdash; where to buy, where to
            sell, and where to get out if it goes wrong. TurboTrade follows them every time.
          </p>
        </div>

        <div className="dgrid">
          {COLS.map((c) => (
            <div className="dcol" key={c.h}>
              <span className="ic">
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {c.icon}
                </svg>
              </span>
              <h3>{c.h}</h3>
              <p>{c.p}</p>
            </div>
          ))}
        </div>

        <div className="dband">
          <div>
            <h3>Nothing is left open-ended.</h3>
            <p>
              Every position has a target, a stop and a closing time &mdash; set before the trade
              opens, and unchanged while it runs. We don't publish those numbers. We don't change
              them either.
            </p>
            <a
              className="btn btn-d"
              href="#strategies"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("strategies")?.scrollIntoView({ block: "start" });
              }}
            >
              See the strategies
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>

          <div className="dpanel">
            <div className="hd">Set before it goes live</div>
            <ul>
              {PRESET.map((row) => (
                <li key={row.label}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {row.icon}
                  </svg>
                  {row.label}
                  <span className="fx">fixed</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
