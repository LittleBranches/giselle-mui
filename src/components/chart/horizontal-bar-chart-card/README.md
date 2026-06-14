# HorizontalBarChartCard

## Why it exists

Ranking items by a single numeric value (top expense categories, most-used features, sales by country) is best displayed as a horizontal bar chart so long labels fit naturally. Without this component a developer must configure ApexCharts `bar` orientation, calculate the reference maximum for proportional widths, and wrap the chart in a card shell — repeating this for every ranking chart.

## Why it belongs in giselle-mui

Horizontal ranking charts are used across dashboards, analytics tools, and financial applications. The component is data-agnostic, accepting any `items` array of label/value pairs.

## Design decisions

TBD — filled in during implementation.

## Related

- [ChartCardBase](../chart-card-base/README.md) — shared card shell
- [GroupedBarChartCard](../grouped-bar-chart-card/README.md) — vertical multi-series sibling
- [ProgressStatsList](../../material/data-display/progress-stats-list/README.md) — list-style alternative with LinearProgress bars

## Build spec

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | yes | — | Card heading |
| `subheader` | `string` | no | — | Secondary line below title |
| `items` | `HorizontalBarItem[]` | yes | — | Ranked items |
| `max` | `number` | no | max item value | Reference maximum for bar width scaling |
| `sx` | `SxProps<Theme>` | no | — | MUI sx forwarded to root Paper |

### Types

```ts
interface HorizontalBarItem {
  label: string;
  value: number;
}
```

### Visual description

A MUI Paper card with:
1. Header: `title` + optional `subheader`.
2. ApexCharts horizontal bar chart. Bars extend left-to-right; width is proportional to `value / max`.
3. Labels rendered on the Y-axis.
4. Value formatted on each bar tooltip.

### Reference

Equivalent to `AppConversionRates` horizontal variant in Minimal UI.

### Acceptance criteria

- When `max` is omitted, uses the maximum value in `items` as the scale reference.
- Bars render proportionally; a value equal to `max` fills 100% of available width.
- Passes TypeScript strict-mode checks.
- Storybook story with 5+ items.

## Phase

Phase: `H-G2` | Priority tier: `T2`

---

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
