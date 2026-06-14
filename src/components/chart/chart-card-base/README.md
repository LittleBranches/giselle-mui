# ChartCardBase

## Why it exists

Every chart card in a dashboard needs the same outer shell: a MUI Paper with consistent elevation and padding, a title/subheader row, an optional header action slot (filter, menu), a chart body slot, an optional footer slot, and a loading skeleton state. Without this base component each chart card duplicates that shell markup, causing layout drift whenever padding or elevation is changed globally.

## Why it belongs in giselle-mui

`ChartCardBase` is a layout primitive with no domain knowledge — it composes a Paper, a header row, and named slots. Any project that renders dashboard-style chart cards can use it to ensure visual consistency across all charts.

## Design decisions

TBD — filled in during implementation.

## Related

- [AreaLineChartCard](../area-line-chart-card/README.md) — chart card that composes this base
- [DonutChartCard](../donut-chart-card/README.md) — chart card that composes this base
- [GroupedBarChartCard](../grouped-bar-chart-card/README.md) — chart card that composes this base

## Build spec

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | yes | — | Card heading |
| `subheader` | `string` | no | — | Secondary line below title in `text.secondary` |
| `action` | `ReactNode` | no | — | Header control slot (year filter, menu icon) rendered right of the title |
| `chart` | `ReactNode` | yes | — | Chart body — any chart element |
| `footer` | `ReactNode` | no | — | Optional footer below the chart (legend, totals row) |
| `loading` | `boolean` | no | `false` | When true renders a centred loading skeleton instead of the chart slot |
| All `PaperProps` | — | no | — | Forwarded to root `Paper` (excludes `title` and `children`) |

### Visual description

A MUI Paper (elevation 0, outlined variant) with:
1. Header row: title (`Typography variant="subtitle1"`) left-aligned + `action` slot right-aligned.
2. `subheader` below title in `text.secondary`.
3. Chart slot takes remaining height.
4. Optional `footer` below the chart.
5. When `loading` is true, a centred `CircularProgress` or `Skeleton` replaces the chart slot.

### Reference

Equivalent to the reusable card wrapper used by `AppConversionRates`, `AppWebsiteVisits`, etc. in Minimal UI.

### Acceptance criteria

- Renders without error when only required props (`title`, `chart`) are provided.
- `loading` state hides the chart and shows a skeleton.
- `action` slot renders correctly at all viewport widths.
- Passes TypeScript strict-mode checks.
- Storybook story shows all slot combinations.

## Phase

Phase: `H-G2` | Priority tier: `T1`

---

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
