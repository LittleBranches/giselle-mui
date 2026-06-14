# BudgetVsActualCard

## Why it exists

Comparing planned versus actual spend over time is a routine financial dashboard pattern. Without this component a developer must hand-roll a dual-series bar chart, apply the correct colour semantics, wire a cumulative/delta toggle, format currency labels, and keep the card shell consistent with other chart cards. That wiring is repeated for every budget screen.

## Why it belongs in giselle-mui

Budget-vs-actual visualisation appears in financial portals, project management tools, and expense trackers across many projects. The component accepts generic `plannedSeries` and `actualSeries` arrays and an ISO 4217 `currency` code, so it carries no app-specific domain logic.

## Design decisions

TBD — filled in during implementation.

## Related

- [ChartCardBase](../chart-card-base/README.md) — shared card shell
- [AreaLineChartCard](../area-line-chart-card/README.md) — time-series sibling
- [ProjectionCard](../projection-card/README.md) — break-even projection variant

## Build spec

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | yes | — | Card heading |
| `plannedSeries` | `BudgetDataPoint[]` | yes | — | Budget data points |
| `actualSeries` | `BudgetDataPoint[]` | yes | — | Actual spend data points |
| `xAxisLabel` | `string` | no | — | X-axis category label, e.g. `'Week'` |
| `currency` | `string` | no | — | ISO 4217 code, e.g. `'AUD'` |
| `cumulativeMode` | `boolean` | no | `false` | When true renders cumulative totals; when false renders period deltas |
| `sx` | `SxProps<Theme>` | no | — | MUI sx forwarded to root Paper |

### Types

```ts
interface BudgetDataPoint {
  label: string;
  value: number;
}
```

### Visual description

A MUI Paper card with:
1. Header: `title` + optional mode chip (Cumulative / Delta).
2. Grouped bar chart: one bar per series per category. Planned series uses a muted palette colour; actual series uses `theme.palette.primary.main`.
3. X-axis shows `plannedSeries[n].label`; Y-axis formats values with `currency` prefix.
4. Legend below the chart labels both series.

### Reference

Equivalent to the dual-series bar cards (e.g. `EcommerceSalesOverview`) in Minimal UI dashboard templates.

### Acceptance criteria

- Toggling `cumulativeMode` re-renders with cumulative vs delta values.
- Currency prefix appears on Y-axis tick labels.
- `xAxisLabel` appears as an axis title.
- Passes TypeScript strict-mode checks.
- Storybook story with sample dataset provided.

## Phase

Phase: `H-G2` | Priority tier: `T2`

---

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
