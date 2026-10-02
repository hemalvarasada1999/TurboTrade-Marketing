/* ══════════════ STRATEGY LIST ══════════════
   The public strategy table on the home page reads the app's strategy
   description endpoint. It needs no login; the marketing site can only show a
   strategy, never switch one on — every row hands off to the app instead.

   What leaves this file is deliberately narrower than what the API sends.
   The response carries the full record (rupee P&L, risk-reward, Sharpe, profit
   factor, streaks…). None of that may be published on the marketing site, so
   `toRow` copies across only the fields the table is cleared to show, and the
   monthly P&L is turned into chart geometry here — no rupee figure ever reaches
   the DOM. Return, drawdown and win rate are passed through for the fogged
   cell; they are in the page source even though they are blurred on screen.

   CORS: the API allows https://www.turbotrade.ai (where production is served —
   the apex 308s there) and https://app.turbotrade.ai. It rejects localhost, so
   the dev server goes through the /appapi proxy in vite.config.ts. */

const API_ORIGIN = import.meta.env.DEV
  ? "/appapi"
  : (import.meta.env.VITE_API_URL || "https://appapi.turbotrade.ai").replace(/\/+$/, "");

/* ─── the wire format, only as much of it as we read ─── */

type SearchCriteria = { filterKey: string; value: string; operation: "eq" };

type StrategyDescriptionDTO = {
  id: number;
  updatedAt: string;
  type: string;
  asset: string;
  style: string;
  roi: number;
  maxDd: number;
  winRate: number;
  timeFrame: string;
  strategyInstrument: {
    id: number;
    minimumRequiredCapital: number;
    strategy: { id: number; strategyId: string; name: string };
    instrument: { id: number; name: string };
    brandName: string;
  };
};

type StrategyPnlDTO = { value: number; dateTime: string; strategyDescriptionId: number };

type DescriptionResponse = {
  success: boolean;
  message?: string;
  data?: {
    strategies?: Record<
      string,
      { strategyDescriptionDTO: StrategyDescriptionDTO; strategyPnlDTOs: StrategyPnlDTO[] }[]
    >;
  };
};

/* ─── what the table renders ─── */

export type StrategyRow = {
  id: number;
  name: string;
  /* the index it trades, e.g. NIFTY */
  index: string;
  /* "Intraday" | "Positional" */
  type: string;
  /* "Option buying" | "Option selling" */
  side: string;
  minCapital: number;
  /* 12-month figures for the fogged cell, already rounded to one decimal */
  roi: number;
  maxDd: number;
  winRate: number;
  /* chart geometry — shapes only, no amounts */
  equity: EquityShape;
  bars: BarShape[];
  updatedAt: string;
};

/* Optional narrowing, by the ids the app uses for each filter. The home page
   sends none of these today: the table lists everything. */
export type StrategyFilters = {
  style?: number | string;
  type?: number | string;
  asset?: number | string;
};

export async function fetchStrategies(
  filters: StrategyFilters = {},
  signal?: AbortSignal,
): Promise<StrategyRow[]> {
  /* The time frame is fixed: the table is always the 12-month record. */
  const searchCriteriaList: SearchCriteria[] = [
    { filterKey: "timeFrame", value: "12m", operation: "eq" },
  ];
  for (const key of ["style", "type", "asset"] as const) {
    const v = filters[key];
    if (v !== undefined && v !== "") {
      searchCriteriaList.push({ filterKey: key, value: String(v), operation: "eq" });
    }
  }

  const res = await fetch(`${API_ORIGIN}/fe/v1/strategy/description`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ searchCriteriaList }),
    signal,
  });
  if (!res.ok) throw new Error(`Strategy list request failed (${res.status})`);

  const json = (await res.json()) as DescriptionResponse;
  if (!json.success) throw new Error(json.message || "Strategy list request failed");

  const rows = Object.values(json.data?.strategies ?? {})
    .flat()
    .map((e) => toRow(e.strategyDescriptionDTO, e.strategyPnlDTOs ?? []));

  /* Lowest minimum capital first. Array.prototype.sort is stable, so rows that
     tie keep the order the API sent them in. */
  return rows.sort((a, b) => a.minCapital - b.minCapital);
}

function toRow(d: StrategyDescriptionDTO, pnl: StrategyPnlDTO[]): StrategyRow {
  const months = [...pnl]
    .sort((a, b) => a.dateTime.localeCompare(b.dateTime))
    .map((p) => p.value);

  return {
    id: d.id,
    name: d.strategyInstrument.brandName || d.strategyInstrument.strategy.name,
    index: d.strategyInstrument.instrument.name,
    type: d.type,
    side: sideOf(d.style, d.type),
    minCapital: d.strategyInstrument.minimumRequiredCapital,
    roi: round1(d.roi),
    maxDd: round1(d.maxDd),
    winRate: round1(d.winRate),
    equity: equityShape(months),
    bars: barShapes(months),
    updatedAt: d.updatedAt,
  };
}

/* "Positional Option Selling" → "Option selling". The type is already its own
   tag, so it is dropped from the front of the style. */
function sideOf(style: string, type: string): string {
  const s = style.replace(new RegExp(`^${type}\\s+`, "i"), "").trim();
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/* ─── chart geometry ───
   Both charts draw into a 120×32 viewBox. Coordinates are rounded to one
   decimal so the markup stays small. */

const W = 120;
const f1 = (n: number) => Number(n.toFixed(1));

export type EquityShape = {
  up: boolean;
  /* y of the zero line */
  zero: number;
  points: string;
  area: string;
};

/* Cumulative P&L from a zero start: one point for the start, then one per
   month. Plotted as straight segments between the points the record actually
   has — no smoothing, no interpolation. */
function equityShape(months: number[]): EquityShape {
  const cum = [0];
  for (const v of months) cum.push(cum[cum.length - 1] + v);

  const min = Math.min(...cum);
  const max = Math.max(...cum);
  const span = max - min || 1;
  const top = 3;
  const bottom = 29;
  const y = (v: number) => f1(bottom - ((v - min) / span) * (bottom - top));
  const step = cum.length > 1 ? W / (cum.length - 1) : 0;

  const pts = cum.map((v, i) => `${f1(i * step)},${y(v)}`);
  return {
    up: cum[cum.length - 1] >= 0,
    zero: y(0),
    points: pts.join(" "),
    area: `M0,32 L${pts.join(" L")} L${W},32 Z`,
  };
}

export type BarShape = { x: number; y: number; w: number; h: number; kind: "p" | "n" | "z0" };

/* One bar per month around a centre zero line, scaled to the strategy's own
   largest month. A flat month still gets a sliver so the slot reads as "no
   trades" rather than missing data. */
function barShapes(months: number[]): BarShape[] {
  if (!months.length) return [];
  const mid = 16;
  const maxH = 15;
  const minH = 1.5;
  const peak = Math.max(...months.map(Math.abs)) || 1;
  const slot = W / months.length;
  const w = f1(slot * 0.7);
  const pad = (slot - w) / 2;

  return months.map((v, i) => {
    const x = f1(i * slot + pad);
    if (v === 0) return { x, y: mid - minH, w, h: minH, kind: "z0" as const };
    const h = f1(Math.max(minH, (Math.abs(v) / peak) * maxH));
    return v > 0
      ? { x, y: f1(mid - h), w, h, kind: "p" as const }
      : { x, y: mid, w, h, kind: "n" as const };
  });
}

/* ─── formatting ─── */

/* ₹80K, ₹2L, ₹3.2L, ₹1.5Cr */
export function formatCapital(n: number): string {
  const trim = (v: number) => String(Number(v.toFixed(1)));
  if (n >= 1e7) return `₹${trim(n / 1e7)}Cr`;
  if (n >= 1e5) return `₹${trim(n / 1e5)}L`;
  if (n >= 1e3) return `₹${trim(n / 1e3)}K`;
  return `₹${n}`;
}

/* A true minus sign, not a hyphen: the figures are set in tabular numerals and a
   hyphen sits visibly shorter and lower. */
export function formatPct(n: number, signed = false): string {
  const body = `${Math.abs(n).toFixed(1)}%`;
  if (n < 0) return `−${body}`;
  return signed && n > 0 ? `+${body}` : body;
}
