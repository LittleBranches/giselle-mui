# SparklineBar

## Why it exists

Stat tiles on analytics dashboards often include a small inline trend chart (sparkline) to show data direction at a glance without dedicating a full card to a chart. Without this component a developer must configure a minimal ApexCharts instance at a fixed small size, disable axes/tooltips/labels, and ensure it colour-matches the surrounding tile — repeating this for every stat card.

## Why it belongs in giselle-mui

Mini sparkline charts are a standard embeddable primitive used in any analytics or financial dashboard. The component is data-agnostic and size-configurable, designed to slot into the `chart` prop of a `StatCard` or `BalanceSummaryCard`.

## Design decisions

TBD — filled in during implementation.

## Related

- [ChartCardBase](../chart-card-base/README.md) — full card wrapper for larger charts

## Build spec

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `number[]` | yes | — | Data points to render |
| `type` | `'bar' \| 'area' \| 'line'` | no | `'bar'` | Chart rendering style |
| `color` | `'primary' \| 'secondary' \| 'info' \| 'success' \| 'warning' \| 'error'` | no | `'primary'` | MUI palette key for chart colour |
| `width` | `number` | no | `84` | Chart width in px |
| `height` | `number` | no | `56` | Chart height in px |
| `sx` | `SxProps<Theme>` | no | — | MUI sx forwarded to root element |

### Visual description

A minimal ApexCharts instance with axes, grid, and legend hidden. Renders as a bar, area, or line chart at `width x height` pixels. The fill/stroke colour is derived from `theme.palette[color].main`. No tooltip. Designed to sit inline inside a stat tile without consuming extra space.

### Reference

Equivalent to the `AppWidgetSummary` sparkline slot in Minimal UI.

### Acceptance criteria

- Renders correctly at the default 84×56 size inside a parent container.
- All three `type` values render without error.
- `color` prop maps to the correct MUI palette token.
- Passes TypeScript strict-mode checks.
- Storybook story showing all three types side by side.

## Phase

Phase: `H-G2` | Priority tier: `T1`

---

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
