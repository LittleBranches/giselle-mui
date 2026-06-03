# StatCard

## Why it exists

A compact KPI card with a label, headline value, trend indicator, icon slot, and optional
sparkline is a fundamental dashboard primitive. The gradient background tinted by a palette
color, the decoration layer, and the ApexCharts sparkline wiring all have non-obvious
implementation details (CSS-variable channel access, sparkline options baseline, decoration
`overflow: hidden` clipping). `StatCard` encodes those decisions once.

## Why it belongs here

Any dashboard or summary strip across the Giselle ecosystem will need this card. It is
already consumed by the `alexrebula` portfolio and planned for `first-branch`. Centralising
the implementation ensures a consistent visual language and prevents silent drift.

## Design decisions

- **Gradient tint uses `lightChannel`** — the MUI v7 CSS-variable `lightChannel` token
  is the standard low-contrast tint source. It produces a soft, legible gradient at any
  palette color. Hardcoded hex or non-standard channel values are never used.
- **Trend indicator via absolute position** — top-right corner, outside the content flow,
  so the main metric can be larger without the trend stat competing for space.
- **Decoration via absolute position + `overflow: hidden` clip** — decorative background
  element is a `StatCardShape` rendered as the first child, underneath all content. The card
  uses `overflow: hidden` to clip the shape at the card boundary.
- **`STAT_CARD_SPARKLINE_OPTIONS` baseline exported** — consumers spread this and add only
  `colors: [theme.palette[color].dark]` for palette-keyed sparklines. The baseline
  handles sparkline mode, animation disable, tooltip disable, and stroke settings.
- **Icon slot is `ReactNode`** — no icon library bundled. Consumers pass `<GiselleIcon />`.
- **`StatCardItem` data type in giselle-mui** — the typed data-layer shape (`iconId: string`
  instead of `ReactNode`) lives in `types.ts` and is exported from the library barrel.

## Library safety

- Zero personal data. No proprietary identifier names. No hardcoded hex or rgba literals.
- ApexCharts lives behind the `/charts` subpath entry — not bundled in the main entry.
  Components that accept a `chart?: ReactNode` slot keep the main bundle chart-free.

## File structure

```
card/stat/
  stat-card.tsx              — StatCard component
  stat-card-shape.tsx        — StatCardShape decorative background sub-component
  stat-card.const.ts         — STAT_CARD_ICON_BOX_SIZE, STAT_CARD_LABELS_MIN_WIDTH
  stat-card.styles.ts        — all sx constants + STAT_CARD_SPARKLINE_OPTIONS
  stat-card.styles.test.ts   — mock-theme assertions + regression tests
  stat-card.test.ts          — Vitest unit tests (structure, slots, ARIA)
  stat-card.stories.tsx      — Default, AllColors, WithSparkline, Responsive
  types.ts                   — StatCardProps, StatCardColor, StatCardItem
  index.ts                   — barrel
  README.md                  — this file
```

## Quality status — 13 May 2026

| Dimension        | Score | Open items |
| ---------------- | ----- | ---------- |
| DoD (Scenario B) | 20/20 | —          |
| Best practices   | 13/13 | —          |

## Related

- `MetricCard` — a wider KPI card with a larger metric, delta chip, and icon. Different layout.
- `TwoColumnShowcaseRow` — a two-column layout that places a stat grid alongside a showcase.
