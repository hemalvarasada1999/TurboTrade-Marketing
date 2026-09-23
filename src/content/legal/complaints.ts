import type { LegalSection } from "./pages";

/* ══════════════ COMPLAINT BOARD DATA ══════════════
   UPDATE MONTHLY, by the 7th of each month: move COMPLAINTS_AS_OF forward,
   rewrite CURRENT for that month, append the month to MONTHLY and update the
   running line in ANNUAL. Grand totals are calculated, not typed.

   The data is entity-level (EquityPulse Tech Pvt Ltd, covering EqtPulse and
   TurboTrade together), so it must match the EqtPulse site exactly. The table
   format is the one SEBI prescribes for Research Analysts. */

export const COMPLAINTS_AS_OF = "August 2026";

type CurrentRow = {
  from: string;
  pendingLastMonth: number;
  received: number;
  resolved: number;
  totalPending: number;
  pendingOver3Months: number;
  avgResolutionDays: number;
};

type TrendRow = {
  period: string;
  carriedForward: number;
  received: number;
  resolved: number;
  pending: number;
};

const CURRENT: CurrentRow[] = [
  { from: "Directly from investors", pendingLastMonth: 0, received: 0, resolved: 0, totalPending: 0, pendingOver3Months: 0, avgResolutionDays: 0 },
  { from: "SEBI (SCORES)", pendingLastMonth: 0, received: 0, resolved: 0, totalPending: 0, pendingOver3Months: 0, avgResolutionDays: 0 },
  { from: "Other sources (if any)", pendingLastMonth: 0, received: 0, resolved: 0, totalPending: 0, pendingOver3Months: 0, avgResolutionDays: 0 },
];

/* Financial year 2026-27, April onwards. */
const MONTHLY: TrendRow[] = [
  { period: "April 2026", carriedForward: 0, received: 0, resolved: 0, pending: 0 },
  { period: "May 2026", carriedForward: 0, received: 0, resolved: 0, pending: 0 },
  { period: "June 2026", carriedForward: 0, received: 0, resolved: 0, pending: 0 },
  { period: "July 2026", carriedForward: 0, received: 0, resolved: 0, pending: 0 },
  { period: "August 2026", carriedForward: 0, received: 0, resolved: 0, pending: 0 },
];

const ANNUAL: TrendRow[] = [
  { period: "2025-26", carriedForward: 0, received: 0, resolved: 0, pending: 0 },
  { period: `2026-27 (till ${COMPLAINTS_AS_OF})`, carriedForward: 0, received: 0, resolved: 0, pending: 0 },
];

/* ── rendering: the same markup the other legal tables use ── */

const sum = <T,>(rows: T[], pick: (r: T) => number) => rows.reduce((n, r) => n + pick(r), 0);

function table(caption: string, headers: string[], rows: (string | number)[][], numFrom: number) {
  const cls = (i: number) => (i >= numFrom ? " class=n" : "");
  const head = headers.map((h, i) => `<th scope="col"${cls(i)}>${h}</th>`).join("");
  const body = rows
    .map(
      (r, ri) =>
        `<tr${ri === rows.length - 1 ? ' class="total"' : ""}>` +
        r.map((c, i) => `<td${cls(i)}>${c}</td>`).join("") +
        "</tr>"
    )
    .join("");
  return (
    `<div class="tbl" role="region" tabindex="0" aria-label="${caption}"><table>` +
    `<caption>${caption}</caption><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`
  );
}

function trendRows(rows: TrendRow[]) {
  return [
    ...rows.map((r, i) => [i + 1, r.period, r.carriedForward, r.received, r.resolved, r.pending]),
    [
      "",
      "Grand total",
      rows[0]?.carriedForward ?? 0,
      sum(rows, (r) => r.received),
      sum(rows, (r) => r.resolved),
      rows[rows.length - 1]?.pending ?? 0,
    ],
  ];
}

export function complaintBoardSections(): LegalSection[] {
  const currentRows = [
    ...CURRENT.map((r, i) => [
      i + 1,
      r.from,
      r.pendingLastMonth,
      r.received,
      r.resolved,
      r.totalPending,
      r.pendingOver3Months,
      r.avgResolutionDays,
    ]),
    [
      "",
      "Grand total",
      sum(CURRENT, (r) => r.pendingLastMonth),
      sum(CURRENT, (r) => r.received),
      sum(CURRENT, (r) => r.resolved),
      sum(CURRENT, (r) => r.totalPending),
      sum(CURRENT, (r) => r.pendingOver3Months),
      "–",
    ],
  ];

  return [
    {
      id: `data-for-the-month-ending-${COMPLAINTS_AS_OF.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      heading: `1. Data for the month ending ${COMPLAINTS_AS_OF}`,
      html: table(
        `Complaints for the month ending ${COMPLAINTS_AS_OF}`,
        ["Sr.", "Received from", "Pending at end of last month", "Received", "Resolved*", "Total pending#", "Pending &gt; 3 months", "Avg. resolution time^ (days)"],
        currentRows,
        2
      ),
    },
    {
      id: "trend-of-monthly-disposal-of-complaints",
      heading: "2. Trend of monthly disposal of complaints",
      html: table(
        "Monthly disposal — financial year 2026-27",
        ["Sr.", "Month", "Carried forward from previous month", "Received", "Resolved*", "Pending#"],
        trendRows(MONTHLY),
        2
      ),
    },
    {
      id: "trend-of-annual-disposal-of-complaints",
      heading: "3. Trend of annual disposal of complaints",
      html: table(
        "Annual disposal",
        ["Sr.", "Year", "Carried forward from previous year", "Received", "Resolved*", "Pending#"],
        trendRows(ANNUAL),
        2
      ),
    },
  ];
}
