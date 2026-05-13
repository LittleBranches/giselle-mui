# RadialProgressCard

## Why it exists

Charts that display one overall metric as a single-number gauge (half-circle or full
ring) lose context quickly. When readiness or progress has multiple contributing
dimensions — code quality, components shipped, documentation, test coverage — a
multi-segment radial bar shows all of them at a glance, with the aggregate in the
centre and a legend row below for per-dimension detail.

`RadialProgressCard` encodes this pattern so every section page that needs a
progress overview does not re-implement the same ApexCharts configuration from scratch.

---

## Why it belongs here

This component is independently useful for any section page that tracks work across
multiple quality dimensions — store readiness, roadmap phases, feature completeness.
It does not belong in a single page's `view.tsx` because:

- The ApexCharts `radialBar` option shape is non-trivial to configure correctly
  (hollow size, track colour via CSS vars, total-centre formatter, value formatter).
- The legend row pattern (coloured dot + label + percentage) is a repeating UI element
  that must stay consistent across sections.
- Proprietary alternatives to this pattern rely on non-MIT utilities (`varAlpha`, closed
  chart legend helpers). This component is the independently written, MIT-licensed equivalent.

---

## Design decisions

### ApexCharts loaded via `React.lazy` + `Suspense`

`react-apexcharts` does DOM operations at import time. Loading it synchronously
causes SSR failures. Since `giselle-mui` must not import `next/dynamic`, the
component uses `React.lazy` with a `Suspense` fallback (`<Box sx={{ height: chartHeight }} />`)
to defer the import until the browser is ready.

### Solid colours — no gradient

Some radial bar implementations use `fill.gradient` with `colorStops`. Gradient
fill in ApexCharts requires the `offset` values to match the segment positions, which
means coupling the factory to the number of segments. Solid colours are simpler,
visually clear, and still colour-coded by MUI palette key. Gradient can be added later
as a separate prop if needed.

### `theme.palette[color].main` — not `theme.vars`

ApexCharts resolves chart colours in SVG/Canvas, where CSS variable resolution is
browser-dependent and inconsistent across chart rendering modes. `theme.palette[color].main`
in MUI v7 with `ThemeProvider` (CSS variables mode) returns the CSS variable reference string
(`var(--mui-palette-primary-main)`), which modern browsers do resolve in SVG.
However, `theme.vars.palette.text.secondary` is used for text colours in the chart
labels because these do not depend on the SVG renderer — they are rendered as `style`
attributes that the browser resolves normally.

### `StatCardColor` reuse for `RadialProgressItem.color`

The same six-key palette union (`'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'`)
is shared with `StatCard`. Consumers already know this type — no new vocabulary needed.

---

## Library safety

- No banned identifier names (`varAlpha`, `varFade`, `varBlur`, `customShadows`).
- No `_mock` or personal data.
- No imports from `alexrebula/src/`.
- `react-apexcharts` is a peer dependency — not bundled.

---

## File structure

```
radial-progress/
  types.ts                          — exported TypeScript types
  radial-progress-card.tsx          — pure JSX composition
  radial-progress-card.styles.ts    — buildRadialProgressOptions factory + all sx constants
  radial-progress-card.styles.test.ts — regression tests for the factory
  radial-progress-card.test.ts      — component render tests (mocked MUI)
  index.ts                          — barrel
  README.md                         — this file
```

## Quality status — 13 May 2026

| Dimension        | Score | Open items |
| ---------------- | ----- | ---------- |
| DoD (Scenario B) | 20/20 | —          |
| Best practices   | 13/13 | —          |

## Related

- `StatCard` — uses the same `StatCardColor` palette union
- `resolveMaturityColor` / `resolveMaturityLabel` in `src/utils/maturity-utils.ts` —
  compute colour key + label from a percentage, useful for deriving `series[].color`
