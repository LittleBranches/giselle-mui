# PeriodSummaryCard

## Why it exists

Analytics and finance dashboards commonly need a card that summarises performance metrics for a specific time period — a week, a month, a quarter — with colour-coded stat rows and an optional chart. Without this component, developers repeatedly construct a Paper with a period label, map over KPI figures with manual colour and trend logic, and stitch in a chart slot. Because the period label and the stat row structure recur across every analytics view, the duplication accumulates quickly.

## Why it belongs in giselle-mui

Summarising data for a time period is a domain-agnostic concern: it applies equally to revenue dashboards, health tracking apps, project management tools, and operational monitoring screens. The `period` label is a plain string; the stats array drives the rendered rows entirely through props. No business logic is embedded in the component.

## Design decisions

TBD — filled in during implementation.

## Related

- [BalanceSummaryCard](../balance-summary/README.md) — summarises a financial position rather than a time-bound performance slice
- [BudgetBreakdownCard](../budget-breakdown/README.md) — categorised breakdown that pairs naturally below a period summary

## Build spec
> Remove this section once the component ships.

**Props / types:**
- `period: string` — period label displayed as the card header (e.g. `'This Week'`, `'January 2026'`)
- `title?: string` — optional secondary title beneath the period label
- `stats: PeriodStat[]` — array of stat rows; each has `label`, `value`, optional `trend` (number), and optional `color` (MUI palette key, defaults to `'primary'`)
- `chart?: ReactNode` — optional chart slot rendered below the stats (sparkline, bar chart, etc.)
- Extends `PaperProps` (minus `children`)

**Visual description:** A Paper card with a period label at the top, an optional title, then a list of stat rows each showing a colour-coded label, a value, and an optional trend indicator. When `chart` is provided it renders in a section below the stats block. The colour key on each stat row uses the MUI palette to convey status (success for positive, error for negative, etc.).

**Reference component substituted:** Replaces bespoke `AnalyticsWeeklySummary` or `KpiPeriodCard` patterns from MUI analytics dashboard templates.

**Acceptance criteria:**
- [ ] Renders correctly with all required props (`period`, `stats`)
- [ ] `title` is rendered beneath the period label when provided; omitted when absent
- [ ] Each `PeriodStat` colour indicator uses the specified `color` palette key, defaulting to `'primary'`
- [ ] `trend` indicator is only rendered when `PeriodStat.trend` is defined
- [ ] `chart` slot renders any injected ReactNode without overflowing the card bounds
- [ ] Component forwards `sx` and all remaining `PaperProps` to the root element

## Phase

Phase: `I-B` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
