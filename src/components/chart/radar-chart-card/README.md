# RadarChartCard

## Why it exists

Comparing multiple entities across the same set of dimensions (skill profiles, product feature scores, team competency ratings) is clearest in a radar/spider chart. Without this component a developer must configure ApexCharts Radar mode, handle multiple overlapping series, derive polygon colours from the theme, and wrap everything in a consistent card shell.

## Why it belongs in giselle-mui

Radar charts are used in HR tools, product comparison dashboards, and analytics platforms. The component is generic — it accepts any named `series` and `categories` arrays.

## Design decisions

TBD — filled in during implementation.

## Related

- [ChartCardBase](../chart-card-base/README.md) — shared card shell
- [GroupedBarChartCard](../grouped-bar-chart-card/README.md) — alternative multi-series comparison

## Build spec

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | yes | — | Card heading |
| `subheader` | `string` | no | — | Secondary line below title |
| `series` | `RadarSeriesItem[]` | yes | — | Named data series |
| `categories` | `string[]` | yes | — | Axis labels (polygon vertices) |
| `sx` | `SxProps<Theme>` | no | — | MUI sx forwarded to root Paper |

### Types

```ts
interface RadarSeriesItem {
  name: string;
  data: number[];
}
```

### Visual description

A MUI Paper card with:
1. Header: `title` + optional `subheader`.
2. ApexCharts Radar chart. Each series renders as a semi-transparent filled polygon with a coloured border.
3. Axis labels from `categories` appear at each vertex.
4. Legend below the chart.

### Reference

Equivalent to `AppCurrentSubject` radar card in Minimal UI.

### Acceptance criteria

- All series render on the same radar grid.
- `categories.length` determines the polygon vertex count.
- Passes TypeScript strict-mode checks.
- Storybook story with two series and six categories.

## Phase

Phase: `H-G2` | Priority tier: `T3`

---

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
