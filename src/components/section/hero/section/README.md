# `HeroSection`

## Why it exists

Every portfolio and product site has at least one hero section. The recurring pattern —
full-width background tint, centred headline, subtitle, and CTA buttons — involves non-trivial
decisions that are easy to get wrong:

- Hardcoding hex or rgba colours breaks dark mode.
- Applying `width: 100%` on a `Container` still respects the max-width constraint; you need an
  outer `Box` for a true full-width background.
- The CTA row needs `flexWrap: 'wrap'` or it breaks on mobile when two wide buttons overflow.

`HeroSection` encodes all three decisions so consumers get it right without thinking about it.

## Why it belongs here

This is a high-frequency layout pattern — not specific to any one project. Any portfolio,
product site, or landing page that has a hero area follows this exact structure. Encoding it in
`giselle-mui` means it is available to any consumer with zero reimplementation.

## Design decisions

### Background tint via `channelAlpha`

The background uses `channelAlpha(theme.vars!.palette[color].mainChannel, 0.08)` — an MUI v7
CSS-variable channel string with 8% alpha. This approach:

- Works in light and dark mode automatically (CSS variables resolve at render time).
- Requires no hardcoded hex or rgba values.
- Is consistent with how other tinted elements in this library (e.g. `MetricCard`) handle colour.

### Outer `Box` + inner `Container` pattern

The root `Box` carries the full-width background. The inner `Container maxWidth="lg"` constrains
the text content. A single `Container` would also constrain the background — the split is required
for a full-bleed tint.

### `actions` as `ReactNode`

Buttons vary by project: size, variant, routing library, and icon. `HeroSection` provides only
the layout shell (centred wrapping flex row). The consumer supplies the buttons. This keeps the
component dependency-free with respect to routing or button conventions.

### No hardcoded copy

Headline and subtitle are both `ReactNode` — consumers can embed gradient spans, icons, or any
other markup without fighting the component.

## Library safety

- Zero proprietary dependencies. Uses only `@mui/material` and the library's own `channelAlpha`.
- Written from scratch — no code derived from any proprietary source or third-party theme.
- CSS-variable tint works correctly in both light and dark mode.

## File structure

```
src/components/layout/section/hero/
  hero-section.tsx           — pure JSX composition
  types.ts                   — HeroSectionProps, HeroColorKey
  hero-section.styles.ts     — sx constants (heroRootSx, heroInnerSx, heroActionsRowSx)
  hero-section.styles.test.ts — mock-theme assertions for all exported sx functions
  hero-section.test.ts       — Vitest: rendering, slot behaviour, sx branch coverage
  hero-section.stories.tsx   — Default, HeadlineOnly, ColorVariants, Responsive
  roadmap.md                 — open improvements and known gaps
  index.ts                   — barrel
  roadmap.md                 — quality scorecard and open improvements
  README.md                  — this file
```

## Related

- [`SectionContainer`](../container/README.md) — standard section wrapper with consistent padding
- [`SectionTitle`](../title/section-title/README.md) — section heading + optional gradient accent
- [`channelAlpha`](../../../../utils/theme-utils.ts) — CSS-variable alpha tint utility

## Quality status

**14 May 2026 — DoD 21/21 · Best practices 13/13**
