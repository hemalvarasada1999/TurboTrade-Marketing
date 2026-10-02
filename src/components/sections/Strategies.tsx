import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { APP_LOGIN_URL, APP_SIGNUP_URL } from "@/lib/brand";
import {
  fetchStrategies,
  formatCapital,
  formatPct,
  type BarShape,
  type EquityShape,
  type StrategyRow,
} from "@/lib/strategies";

/* ══════════════ STRATEGIES ══════════════
   Every strategy we run, in one table, read live from the app. A visitor can
   look but not switch anything on: each row, and the CTA under the table, hands
   off to sign-up.

   What is public and what is locked is a compliance line, not a design one.
   Name, index, position type, minimum capital and the two 12-month shapes are
   shown. Return, worst drop and win rate sit under the fog with a lock — they
   are real figures and they are in the page source, so the wording around them
   was signed off as publishing performance. Never add another metric here; see
   the header comment in lib/strategies.ts for what must not leave the API.

   Below 900px each row becomes a card; the .st-k labels only show there. */

/* One mark per strategy, keyed by brand name. A strategy the app adds before
   this map is updated falls back to the generic line icon. */
const ICONS: Record<string, ReactNode> = {
  Venguard: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6z" />
      <path d="m8.5 12.5 3.5-3.5 3.5 3.5" />
      <path d="m8.5 16 3.5-3.5 3.5 3.5" />
    </>
  ),
  Vector: (
    <>
      <path d="M5.5 18.5 18 6" />
      <path d="M11 6h7v7" />
      <circle cx="5.5" cy="18.5" r="1.8" />
    </>
  ),
  Apex: (
    <>
      <path d="M2.5 19.5 9 8.5l3.4 5.4L15 10l6.5 9.5z" />
      <path d="M15 10V4.2l3.6 1.3L15 6.8" />
    </>
  ),
  Nexus: (
    <>
      <circle cx="12" cy="12" r="2.4" />
      <circle cx="5" cy="6" r="1.8" />
      <circle cx="19" cy="6" r="1.8" />
      <circle cx="5" cy="18" r="1.8" />
      <circle cx="19" cy="18" r="1.8" />
      <path d="M6.4 7.2 10.2 10.5M17.6 7.2l-3.8 3.3M6.4 16.8l3.8-3.3M17.6 16.8l-3.8-3.3" />
    </>
  ),
  Velocity: (
    <>
      <path d="M3.5 17a8.5 8.5 0 0 1 17 0" />
      <path d="m12 17 4.8-5.6" />
      <circle cx="12" cy="17" r="1.4" fill="currentColor" stroke="none" />
      <path d="M6.2 11.2l1.1 1.1M12 8.3v1.5M17.8 11.2l-1.1 1.1" />
    </>
  ),
  Cadence: (
    <>
      <path d="M8 20.5h8L13.8 5h-3.6z" />
      <path d="m12 16.5 4.6-9.5" />
      <path d="M14.8 10.4h2.4" />
      <path d="M6.5 20.5h11" />
    </>
  ),
  Horizon: (
    <>
      <path d="M2.5 16.5h19" />
      <path d="M6.5 16.5a5.5 5.5 0 0 1 11 0" />
      <path d="M12 5.5v2.2M5.3 8.6l1.5 1.5M18.7 8.6l-1.5 1.5" />
      <path d="M6 20h12" />
    </>
  ),
  Gravity: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <ellipse cx="12" cy="12" rx="10" ry="3.6" transform="rotate(-24 12 12)" />
      <circle cx="19.6" cy="7.4" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  Inertia: (
    <>
      <path d="M3 4.5h18" />
      <path d="M9 4.5V14M13 4.5V14M17 4.5V14" />
      <circle cx="9" cy="16" r="2" />
      <circle cx="13" cy="16" r="2" />
      <circle cx="17" cy="16" r="2" />
    </>
  ),
};
const FALLBACK_ICON = <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />;

const Lock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </svg>
);

const Arrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function Equity({ shape }: { shape: EquityShape }) {
  return (
    <svg
      className={`st-eq ${shape.up ? "up" : "dn"}`}
      viewBox="0 0 120 32"
      width="120"
      height="32"
      preserveAspectRatio="none"
      role="img"
      aria-label="Equity curve, last 12 months"
    >
      <line x1="0" y1={shape.zero} x2="120" y2={shape.zero} className="z" />
      <path d={shape.area} className="a" />
      <polyline points={shape.points} className="l" />
    </svg>
  );
}

function Bars({ bars }: { bars: BarShape[] }) {
  return (
    <svg className="st-spark" viewBox="0 0 120 32" width="120" height="32" role="img" aria-label="Monthly P&L, last 12 months">
      <line x1="0" y1="16" x2="120" y2="16" className="z" />
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="1.5" className={b.kind} />
      ))}
    </svg>
  );
}

function Row({ s }: { s: StrategyRow }) {
  return (
    <a className="st-row" role="row" href={APP_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
      <span className="st-name" role="cell">
        <span className="st-ic" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {ICONS[s.name] ?? FALLBACK_ICON}
          </svg>
        </span>
        <span>
          <b>{s.name}</b>
          <span className="st-sub">{s.index}</span>
        </span>
      </span>
      <span className="st-c st-chart" role="cell">
        <span className="st-k">12 months equity</span>
        <Equity shape={s.equity} />
      </span>
      <span className="st-c st-chart" role="cell">
        <span className="st-k">12 months P&amp;L</span>
        <Bars bars={s.bars} />
      </span>
      <span className="st-c st-num" role="cell">
        <span className="st-k">Min capital</span>
        {formatCapital(s.minCapital)}
      </span>
      <span className="st-c st-pos" role="cell">
        <span className="st-k">Position type</span>
        <span className="st-tag">{s.type}</span>
        <span className="st-side">{s.side}</span>
      </span>
      <span className="st-fog" role="cell" aria-label="Return, worst drop and win rate available after sign-up">
        <span className="st-fog-v" aria-hidden="true">
          <b>{formatPct(s.roi, true)}</b>
          <b>{formatPct(s.maxDd)}</b>
          <b>{formatPct(s.winRate)}</b>
        </span>
        <span className="st-fog-g" aria-hidden="true" />
        <span className="st-fog-l" aria-hidden="true">
          <Lock />
        </span>
      </span>
    </a>
  );
}

/* Placeholder rows hold the table's height while the list loads, so the page
   below does not jump when it arrives. */
function SkeletonRow() {
  return (
    <div className="st-row st-skel" role="row" aria-hidden="true">
      <span className="st-name">
        <span className="st-ic" />
        <span className="st-bone" style={{ width: 110 }} />
      </span>
      <span className="st-bone st-bone-chart" />
      <span className="st-bone st-bone-chart" />
      <span className="st-bone" style={{ width: 48, justifySelf: "end" }} />
      <span className="st-bone" style={{ width: 90 }} />
      <span className="st-fog" />
    </div>
  );
}

/* The month the newest record was refreshed, for the fine print. */
function asOf(rows: StrategyRow[]): string | null {
  const stamps = rows.map((r) => r.updatedAt).sort();
  const latest = stamps[stamps.length - 1];
  if (!latest) return null;
  const d = new Date(latest.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

export default function Strategies() {
  const { data, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: ["strategies", "12m"],
    queryFn: ({ signal }) => fetchStrategies({}, signal),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const rows = data ?? [];
  const listed = asOf(rows);

  return (
    <section id="strategies">
      <div className="wrap">
        <div className="w-head st-headrow">
          <div>
            <span className="eyebrow">The strategies</span>
            <h2>
              Mix your styles. <span className="hl">Run them side by side.</span>
            </h2>
          </div>
          <p className="lede">
            Switch on as many as your capital allows. Each runs at its own size, on its own rules.
          </p>
        </div>

        <div className="st-table" role="table" aria-label="TurboTrade strategies" aria-busy={isPending}>
          <div className="st-head" role="row">
            <span role="columnheader">Strategy</span>
            <span role="columnheader">12 months equity</span>
            <span role="columnheader">12 months P&amp;L</span>
            <span role="columnheader" className="r">
              Min capital
            </span>
            <span role="columnheader">Position type</span>
            <span role="columnheader" className="st-lockh">
              <Lock />
              Return · Drop · Win rate
            </span>
          </div>

          {isPending && Array.from({ length: 6 }, (_, i) => <SkeletonRow key={i} />)}

          {isError && (
            <div className="st-msg" role="row">
              <span role="cell">
                We couldn&rsquo;t load the strategies just now.{" "}
                <button type="button" onClick={() => refetch()} disabled={isFetching}>
                  {isFetching ? "Trying again…" : "Try again"}
                </button>
              </span>
            </div>
          )}

          {!isPending && !isError && rows.length === 0 && (
            <div className="st-msg" role="row">
              <span role="cell">No strategies are listed right now. Check back soon.</span>
            </div>
          )}

          {rows.map((s) => (
            <Row key={s.id} s={s} />
          ))}
        </div>

        <div className="st-cta">
          <a className="btn btn-d" href={APP_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
            Sign up to see every record
            <Arrow />
          </a>
          <span className="st-login">
            Already have an account?{" "}
            <a href={APP_LOGIN_URL} target="_blank" rel="noopener noreferrer">
              Log in
            </a>
          </span>
        </div>

        <p className="st-fine">
          Equity, P&amp;L, return, drop and win rate are backtested over 12 months on 1 lot, before
          charges. Past performance does not indicate future results. Minimum capital is for 1 lot.
          {listed && <> Strategies listed as of {listed}.</>}
        </p>
      </div>
    </section>
  );
}
