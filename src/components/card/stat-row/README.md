# StatCardRow

## Why it exists

Dashboards always have a top row of KPI stat cards. Without a layout wrapper, every consuming app reimplements the same `Grid2` responsive breakpoints (`xs=12 sm=6 md=3`) and the same `StatCardItem[]` → `StatCard` mapping. `StatCardRow` encodes that once so no consumer has to rediscover it.

## Why it belongs here

- It is the direct layout companion to `StatCard`, which already lives in this library.
- The `StatCardItem` type is defined here — the row is the natural consumer of that type.
- Any dashboard — contributor trackers, analytics pages, finance overviews — needs this pattern.

## Design decisions

### Responsive breakpoints are baked in

The default breakpoints (`xs=12 sm=6 md=3`) are intentional and cover the standard 4-card KPI row. Override via `spacing` or any other `GridProps` pass-through if needed. The constraint is that `StatCardRow` targets exactly four cards per row at `md+` — if you need a different count (3 or 5 cards), pass a custom `size` via a subgrid or use `StatCard` directly.

### `renderChart` keeps the main bundle chart-free

`StatCardRow` is in the **main bundle** (`@alexrebula/giselle-mui`). ApexCharts lives in the `/charts` subpath. The `renderChart?: (item: StatCardItem) => ReactNode` factory bridge is how the consumer wires them together without imposing a chart dependency on every app. When omitted, cards render without sparklines.

### `items` drives layout via `key={item.label}`

Item labels are used as React keys. Labels must be unique within a row. Duplicate labels cause React to emit a `console.error` warning in development, and the reconciliation result is undefined — items may be duplicated in the DOM rather than de-duplicated. Use distinct labels, or add an explicit `id` field to `StatCardItem` if labels need not be unique.

## Library safety

- Zero proprietary code. No Minimals, no `alexrebula/src/` imports.
- No hardcoded colors, hex literals, or custom theme tokens.
- No chart-library dependency in the component file.
- `GiselleIcon` is imported from within this library — no external icon registry required beyond the consumer's offline registration.

## File structure

```
src/components/card/stat-row/
  stat-card-row.tsx          — composition layer
  types.ts                   — StatCardRowProps
  stat-card-row.test.ts      — Vitest unit tests
  stat-card-row.stories.tsx  — Default / WithSparklines / Responsive stories
  index.ts                   — barrel export
  README.md                  — this file
```

## Related

- [`StatCard`](../stat/README.md) — the tile component rendered inside each grid cell
- [`StatCardItem`](../stat/types.ts) — the data type `StatCardRow` consumes
- [`STAT_CARD_SPARKLINE_OPTIONS`](../stat/stat-card.styles.ts) — base ApexCharts options for the sparkline slot
