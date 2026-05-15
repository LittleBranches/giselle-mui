# HeroButtonsRow

## Why it exists

A flex row of animated CTA buttons for hero sections. The pattern — flex container, `motion.div` per item, consistent `minWidth`/`height` sizing — is used in every hero section and is easy to get wrong (forgetting the animation wrapper, inconsistent button sizes, no `flexWrap` for narrow viewports).

## Why it belongs here

Any hero or landing page section in any project will need this exact layout. The component accepts a typed `items` array and optional `motionProps` — both consumer-controlled. Zero personal data inside.

## Design decisions

### `motion.div` per item (not `m.div`)

This library always uses `motion.*` — never `m.*`. The `m.*` API requires `LazyMotion` in the consumer tree; `motion.*` is standalone and correct for library components.

### `motionProps` forwarded to each wrapper

Each button item is individually wrapped in a `motion.div` that receives the same `motionProps`. This enables stagger via a parent `MotionContainer` or explicit per-item variants. The consumer passes the variant values; the component applies them uniformly.

### Fixed minimum dimensions

- `minWidth: 156` — keeps short labels from collapsing awkwardly
- `height: 48` — meets the WCAG 2.5.5 target size recommendation (44×44px minimum; 48px slightly exceeds it)

## File structure

```
buttons-row/
  hero-buttons-row.tsx           — component
  hero-buttons-row.styles.ts     — rowSx, buttonSx
  hero-buttons-row.styles.test.ts — style constant tests
  hero-buttons-row.test.ts       — render tests
  hero-buttons-row.stories.tsx   — Storybook stories
  types.ts                       — HeroButtonItem, HeroButtonsRowProps
  index.ts                       — barrel export
  README.md                      — this file
```

## Related

- `InteractiveHeroLogo` — `src/components/hero/interactive-logo/` — 3-phase interactive logo
- Motion variant families — `src/components/motion/variants/` — fade, slide, etc.
