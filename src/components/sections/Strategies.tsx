import { Link } from "react-router-dom";
import { APP_ROUTE } from "@/lib/brand";

/* ══════════════ STRATEGIES ══════════════
   The head does four jobs and each belongs to exactly one element: the deck
   carries the mechanism, the lede carries the person, the tiles carry the
   trade-offs, the numbers panel carries the metrics. The section reads muddy the
   moment any one of them does two.

   Headings optimistic, bodies candid: that split is deliberate. Honest
   everywhere including the headings reads depressive; optimistic everywhere
   including the bodies reads like a sales page. The downside clauses in the
   bodies are load-bearing for trust AND for compliance — do not polish them out.

   The order of the three tiles echoes the lede. Reorder one and you have to
   reorder both. */

const TILES = [
  {
    icon: (
      <>
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M15 7h6v6" />
      </>
    ),
    tag: "Intraday",
    h: "You want the day to pay you today",
    p: "Opens and closes inside the session — you are flat before the market shuts. The move has to actually happen; a day that goes nowhere costs you.",
    sub: "Option buying · index options on NIFTY and BANKNIFTY",
  },
  {
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
    tag: "Positional",
    h: "You'd rather be paid for patience",
    p: "Paid for time passing rather than for a big move. Quiet most weeks — then one overnight gap takes back several of them.",
    sub: "Option selling",
  },
  {
    icon: <path d="M2 12c2.5-5 5-5 7.5 0s5 5 7.5 0 3.5-3 5-1" />,
    tag: "Positional",
    h: "You want a view you can sit with",
    p: "Holds with the market for days, on less money than the futures trade it behaves like. It still moves like a large position.",
    sub: "Synthetic futures",
  },
];

/* A 3x3 grid, not a ragged wrap. Nine labels on an even grid read as a spec
   sheet; the same nine flowing raggedly read as more prose. This strip is also a
   promise — do not list a metric the strategy pages do not actually show. */
const CHIPS = [
  "What it trades",
  "How long it holds",
  "Money needed",
  "Risk and reward",
  "Win rate",
  "Worst drawdown",
  "Longest losing streak",
  "Worst month",
  "How often it trades",
];

export default function Strategies() {
  return (
    <section id="strategies">
      <div className="wrap">
        <div className="s-head ctr">
          <span className="eyebrow">The strategies</span>
          <h2>
            Pick a style. <span className="hl">Then add another.</span>
          </h2>
          <p className="deck">
            Strategies run side by side, each at its own size, each exiting on its own rules.
          </p>
          <p className="lede">
            Everybody who trades has a way they&rsquo;d rather do it. Start with whichever of these
            sounds like you, and add a second when you have seen enough to trust it.
          </p>
        </div>

        <div className="tiles">
          {TILES.map((t) => (
            <Link className="tile" to={APP_ROUTE} key={t.h}>
              <span className="ic">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  {t.icon}
                </svg>
              </span>
              <span>
                <span className="tag">{t.tag}</span>
                <h3>{t.h}</h3>
                <p>{t.p}</p>
                {/* instrument names live below the body — readable for anyone who
                    knows the vocabulary, ignorable for the beginner the tiles are
                    written for. Naming the tile after the instrument was what
                    fenced in the roadmap last time. */}
                <span className="sub">{t.sub}</span>
              </span>
            </Link>
          ))}
        </div>

        {/* ─── the numbers panel ───
            It stays BELOW the tiles. The reader picks a style, gets interested,
            and only then asks what they actually know before switching it on.
            Moved above the tiles it stops selling and starts sounding defensive.

            The line is self-referential on purpose. Earlier drafts argued by
            contrast with unnamed competitors ("anyone can show you a return"),
            which needs the reader to already believe others are worse. Do not
            reintroduce a comparison. */}
        <div className="nb">
          <div>
            <h3 className="nb-h">Know exactly what you&rsquo;re switching on.</h3>
            <p className="nb-kick">
              We measure the bad stretches as carefully as the good ones. Both are printed on every
              strategy page.
            </p>
            {/* The CTA lives inside the panel rather than on its own row below
                it: one less stacked band, and the button sits beside the reason
                to press it. */}
            <div className="s-cta">
              <Link className="btn btn-d" to={APP_ROUTE}>
                Browse every strategy
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
          <div>
            <ul className="chips">
              {CHIPS.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
