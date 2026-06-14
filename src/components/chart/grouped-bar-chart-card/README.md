# GroupedBarChartCard

## Why it exists

Comparing multiple named series across categories (e.g. income vs expenses per month, or sales per region per quarter) requires a grouped or stacked bar chart. Without this component a developer must configure ApexCharts column mode, handle the grouped/stacked toggle, map series colours to the MUI palette, and wrap the chart in a consistent card shell — duplicating this for every comparative bar chart in the app.

## Why it belongs in giselle-mui

Multi-series bar charts are a standard dashboard primitive used in financial portals, analytics tools, and CRM dashboards across projects. The component is data-agnostic — it accepts any `series` and `categories` arrays.

## Design decisions

TBD — filled in during implementation.

## Related

- [ChartCardBase](../chart-card-base/README.md) — shared card shell
- [BudgetVsActualCard](../budget-vs-actual-card/README.md) — specialised dual-series variant
- [HorizontalBarChartCard](../horizontal-bar-chart-card/README.md) — horizontal orientation sibling

## Build spec

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | yes | — | Card heading |
| `subheader` | `string` | no | — | Secondary line below title |
| `series` | `BarSeriesItem[]` | yes | — | Named data series |
| `categories` | `string[]` | yes | — | X-axis category labels |
| `stacked` | `boolean` | no | `false` | When true renders bars stacked instead of grouped |
| `sx` | `SxProps<Theme>` | no | — | MUI sx forwarded to root Paper |

### Types

```ts
interface BarSeriesItem {
  name: string;
  data: number[];
}
```

### Visual description

A MUI Paper card with:
1. Header: `title` + optional `subheader`.
2. ApexCharts vertical column chart. When `stacked` is false, bars per category are placed side by side; when true, they stack.
3. Each series maps to a sequential MUI palette colour.
4. Legend below the chart.

### Reference

Equivalent to `AppConversionRates` or `EcommerceYearlySales` grouped bar cards in Minimal UI.

### Acceptance criteria

- `stacked` prop toggles between grouped and stacked rendering without remounting.
- Series colours cycle through the MUI theme palette.
- Passes TypeScript strict-mode checks.
- Storybook story with at least two series.

## Phase

Phase: `H-G2` | Priority tier: `T1`

---

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
