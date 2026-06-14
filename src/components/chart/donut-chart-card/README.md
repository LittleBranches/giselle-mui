# DonutChartCard

## Why it exists

Showing proportional data (budget breakdown, traffic sources, expense categories) as a donut chart inside a card is a high-frequency dashboard pattern. Without this component a developer must manually compose an ApexCharts Pie/Donut instance, configure the centre-label override, wrap it in a Paper, and add title/subheader markup — repeating this for every breakdown chart.

## Why it belongs in giselle-mui

Proportional breakdown visualisations appear in finance, analytics, and project management dashboards across projects. The component receives generic `series: number[]` and `labels: string[]`, carries no domain logic, and is directly reusable.

## Design decisions

TBD — filled in during implementation.

## Related

- [ChartCardBase](../chart-card-base/README.md) — shared card shell
- [GroupedBarChartCard](../grouped-bar-chart-card/README.md) — alternative breakdown representation

## Build spec

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | yes | — | Card heading |
| `subheader` | `string` | no | — | Secondary line below title |
| `series` | `number[]` | yes | — | Segment values (must sum to a meaningful total) |
| `labels` | `string[]` | yes | — | Segment labels, matched by index to `series` |
| `total` | `number` | no | sum of series | Value displayed in the chart centre hole |
| `sx` | `SxProps<Theme>` | no | — | MUI sx forwarded to root Paper |

### Visual description

A MUI Paper card with:
1. Header: `title` + optional `subheader`.
2. ApexCharts Pie chart rendered as a donut (inner radius ~60%). The centre hole shows the formatted `total` value.
3. Segment colours derived from the MUI theme palette in rotation.
4. A legend below (or beside) the chart lists each label with its colour swatch.

### Reference

Equivalent to `AppCurrentDownload` or `BankingExpensesCategories` in Minimal UI dashboard templates.

### Acceptance criteria

- When `total` is omitted, renders the sum of `series` in the centre.
- Segment count matches `labels` length; mismatched lengths throw a PropTypes warning.
- Passes TypeScript strict-mode checks.
- Storybook story with a 4-segment sample dataset.

## Phase

Phase: `H-G2` | Priority tier: `T1`

---

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
