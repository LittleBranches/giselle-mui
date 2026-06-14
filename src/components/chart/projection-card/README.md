# ProjectionCard

## Why it exists

Showing the point at which projected returns overtake actual cost — a break-even analysis — is a specialised chart pattern used in investment and ROI dashboards. Without this component a developer must manually compose two overlapping line series, calculate and annotate the crossing point, and keep the card shell consistent with other charts.

## Why it belongs in giselle-mui

Break-even / projection charts appear in investment calculators, SaaS pricing tools, and financial planning applications. The component accepts generic `actualSeries` and `projectedSeries` arrays plus a currency code, carrying no domain logic.

## Design decisions

TBD — filled in during implementation.

## Related

- [ChartCardBase](../chart-card-base/README.md) — shared card shell
- [BudgetVsActualCard](../budget-vs-actual-card/README.md) — budget comparison sibling
- [AreaLineChartCard](../area-line-chart-card/README.md) — time-series sibling

## Build spec

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | yes | — | Card heading |
| `actualSeries` | `ProjectionDataPoint[]` | yes | — | Actual cost data points |
| `projectedSeries` | `ProjectionDataPoint[]` | yes | — | Projected return data points |
| `xAxisLabel` | `string` | no | — | X-axis label, e.g. `'Month'` |
| `currency` | `string` | no | — | ISO 4217 code, e.g. `'AUD'` |
| `breakEvenAnnotation` | `boolean` | no | `true` | Renders a vertical annotation line at the break-even crossing point |
| `sx` | `SxProps<Theme>` | no | — | MUI sx forwarded to root Paper |

### Types

```ts
interface ProjectionDataPoint {
  label: string;
  value: number;
}
```

### Visual description

A MUI Paper card with:
1. Header: `title`.
2. ApexCharts line chart. Two series: actual (solid primary colour) and projected (dashed secondary colour).
3. When `breakEvenAnnotation` is true, a vertical dashed annotation line marks where the two series cross, labelled "Break even".
4. X-axis shows data point labels; Y-axis formats values with `currency` prefix.
5. Legend below the chart.

### Reference

Similar to financial ROI charts used in investment platform templates.

### Acceptance criteria

- Break-even annotation renders at the correct crossing index.
- When `breakEvenAnnotation` is false, no annotation is drawn.
- Passes TypeScript strict-mode checks.
- Storybook story with 12 monthly data points for each series.

## Phase

Phase: `H-G2` | Priority tier: `T3`

---

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
