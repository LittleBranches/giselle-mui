# AreaLineChartCard

## Why it exists

Displaying a multi-series area/line chart inside a dashboard card requires wiring together an ApexCharts (or Recharts) instance, a MUI Paper wrapper, a title/subheader row, and an optional year-filter control. Without this component a developer must copy that wiring for every chart card, keep the Paper elevation, padding, and header layout consistent across cards, and re-implement the year-filter dropdown each time.

## Why it belongs in giselle-mui

Any project that renders financial or analytics dashboards — budget trackers, investment portals, SaaS analytics — needs at least one time-series area/line chart card. The component owns no domain data; it receives generic `series` and `categories` arrays, making it reusable across projects without modification.

## Design decisions

TBD — filled in during implementation.

## Related

- [ChartCardBase](../chart-card-base/README.md) — the shared card shell this component composes
- [BudgetVsActualCard](../budget-vs-actual-card/README.md) — sibling chart card for budget comparison
- [SparklineBar](../sparkline-bar/README.md) — inline mini-chart for stat tiles

## Build spec

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | yes | — | Card heading |
| `subheader` | `string` | no | — | Secondary line below title |
| `series` | `AreaLineSeriesItem[]` | yes | — | Named data series; each item has `name: string` and `data: number[]` |
| `categories` | `string[]` | yes | — | X-axis labels (must match series data length) |
| `yearOptions` | `number[]` | no | — | Available years for header filter; omit to hide filter |
| `defaultYear` | `number` | no | first item in yearOptions | Initially selected year |
| `sx` | `SxProps<Theme>` | no | — | MUI sx forwarded to root Paper |

### Types

```ts
interface AreaLineSeriesItem {
  name: string;
  data: number[];
}
```

### Visual description

A MUI Paper card containing:
1. Header row: `title` left-aligned + optional `Select` year filter right-aligned.
2. `subheader` below title in `text.secondary`.
3. ApexCharts area chart filling the remaining card body. Each series renders as a smooth area with a semi-transparent fill and a solid line stroke. Palette colours are derived from `theme.palette.primary`, `secondary`, `info`, etc. in series order.
4. X-axis shows `categories` labels; Y-axis is auto-scaled.

### Reference

Equivalent to the `AppAreaInstalled` / `BookingRoomAvailable` chart cards in the Minimal UI dashboard template.

### Acceptance criteria

- Renders without error when `yearOptions` is omitted (no filter shown).
- When `yearOptions` is provided, selecting a year fires a callback (or is handled internally as uncontrolled state).
- Passes TypeScript strict-mode checks.
- Has a Storybook story with at least one sample dataset.

## Phase

Phase: `H-G2` | Priority tier: `T1`

---

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
