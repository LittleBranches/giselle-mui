# BalanceSummaryCard

## Why it exists

Financial dashboards routinely need a top-of-page hero card that displays a total account balance alongside secondary income/expense figures and a row of quick-action buttons. Without this component, developers hand-wire a Paper, lay out the headline value, map over stats with ad-hoc trend indicators, and stitch in a chart slot — writing the same repetitive layout code across every fintech or banking dashboard they build.

## Why it belongs in giselle-mui

The pattern — headline balance, stats row with optional trends, quick-action row, chart slot — recurs in any project that shows financial account data: banking apps, investment dashboards, expense trackers, and budget tools. Nothing in the component's API or behaviour is specific to a single product; it is parameterised entirely through props, making it safely reusable across projects.

## Design decisions

TBD — filled in during implementation.

## Related

- [BudgetBreakdownCard](../budget-breakdown/README.md) — shows a categorised spend breakdown that pairs well below a balance summary
- [PeriodSummaryCard](../period-summary/README.md) — per-period variant of the same stat-plus-chart layout

## Build spec
> Remove this section once the component ships.

**Props / types:**
- `balance: string` — primary headline value (e.g. `'$49,990'`)
- `balanceLabel?: string` — label above the balance value (e.g. `'Total Balance'`)
- `stats: BalanceStat[]` — secondary figures; each has `label`, `value`, and optional `trend` (positive/negative number)
- `actions?: BalanceAction[]` — quick-action buttons row; each has `label`, `icon: ReactNode`, and optional `onClick`
- `chart?: ReactNode` — chart slot rendered below the stats row (sparkline, line chart, etc.)
- Extends `PaperProps` (minus `children`)

**Visual description:** A Paper surface with a large balance headline at the top, a horizontal row of secondary stats beneath it (each optionally decorated with a trend indicator arrow), a row of icon+label action buttons, and a bottom area reserved for an injected chart. Elevation and padding follow the MUI Paper defaults and can be overridden via `sx`.

**Reference component substituted:** Likely replaces a bespoke `BankingWidgetSummary` or `AccountBalanceCard` found in MUI paid fintech dashboard templates.

**Acceptance criteria:**
- [ ] Renders correctly with all required props (`balance`, `stats`)
- [ ] `balanceLabel` is displayed above the balance value when provided
- [ ] Each `BalanceStat` with a positive `trend` renders an upward indicator; negative renders a downward indicator; absent `trend` renders no indicator
- [ ] `actions` row is omitted from the DOM entirely when the prop is absent or empty
- [ ] `chart` slot renders any injected ReactNode without layout overflow
- [ ] Component forwards `sx` and all remaining `PaperProps` to the root element

## Phase

Phase: `H-G1` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
