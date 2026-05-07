# TimelineCompact

## Why it exists

`TimelineTwoColumn` is the full-featured timeline — two alternating columns, milestone badges, expandable cards, platform strips, eye buttons, and spine connectors. It is designed for desktop viewports (≥ md breakpoint) where horizontal space is available.

At xs/sm viewports, the two-column layout breaks: cards become too narrow to read, the centre spine disappears, and the alternating columns collapse in unpredictable ways.

`TimelineCompact` is the answer. It renders the **same `TimelinePhase[]` data** as a single-column list of expandable accordion items — no new data model, no separate factory. Consumers swap the component at a breakpoint and the data layer stays untouched:

```tsx
{
  isMobile ? (
    <TimelineCompact phases={phases} />
  ) : (
    <TimelineTwoColumn phases={phases} columnLabels={labels} sidebar={sidebar} />
  );
}
```

## Why it belongs here

Any project that uses `TimelineTwoColumn` for a career or roadmap timeline will face the same mobile problem. Building a mobile fallback once, correctly, in the library prevents every consumer from reinventing it. The component encodes the same done-state colour rule (`done: true` → green dot) and the same palette-key → CSS-variable pattern as `TimelineTwoColumn`.

## Design decisions

### Same data, different renderer

`TimelineCompact` is not a reduced-feature version of `TimelineTwoColumn` — it is a **different renderer** for the same data. The `TimelinePhase[]` interface is shared; the presentation contract changes:

| Feature                    | TimelineTwoColumn       | TimelineCompact                |
| -------------------------- | ----------------------- | ------------------------------ |
| Layout                     | Two alternating columns | Single column                  |
| Phase card                 | Expandable MUI Card     | MUI Accordion row              |
| Phase icon                 | Inside spine dot        | Inside summary dot             |
| Milestones                 | Spine badges            | Flat rows in accordion details |
| Column labels / sidebar    | ✅                      | — (not applicable)             |
| Eye buttons / viewed state | ✅                      | — (mobile scope, not tracked)  |

### Done-state colour rule

`done: true` phases and milestones always render with a **green (`success`) dot**, regardless of the data's `color` prop. This matches `TimelineTwoColumn`'s done-dot enforcement. The logic lives in `resolveCompactColor` in `utils.ts`.

The phase accordion also renders at 65% opacity when done — matching the visual language of `TimelineTwoColumn`'s grayed-out done cards.

### No expand icon for empty phases

Phases without `description` and without `milestones` have nothing to show in the accordion details. The chevron expand icon is omitted for these rows and the accordion is effectively non-interactive. This avoids a misleading tap target.

### Dot icon sizing

The phase dot is 14px × 14px with a 12px icon slot inside. This is deliberately smaller than `TimelineTwoColumn`'s spine dots — the compact layout demands smaller elements. The minimum size constants (`COMPACT_MIN_PHASE_DOT_SIZE = 12`, `COMPACT_MIN_MILESTONE_DOT_SIZE = 8`) are regression-tested to prevent future size reductions that would hurt readability at mobile scale.

## Library safety

- Zero Minimals utilities (`varAlpha`, `varFade`, `varBlur`, `customShadows`).
- Only `@mui/material` and `@mui/lab` APIs — both existing peer dependencies.
- The component renders nothing proprietary — palette colors come from the consumer's theme.
- `...other` spread on root Box enables `data-*`, `aria-*`, `id`, `className` without prop drilling.

## File structure

```
compact/
  compact.tsx           — pure JSX composition
  types.ts              — TimelineCompactProps
  utils.ts              — resolveCompactColor pure helper
  compact.const.ts      — dot sizes and minimums
  compact.styles.ts     — sx constants and factories
  compact.styles.test.ts — mock-theme assertions for sx factories
  compact.test.ts       — Vitest rendering + interaction tests
  compact.stories.tsx   — Storybook stories (Default, AllColors, NoDetails, Responsive)
  chevron-down-icon.tsx — inline SVG chevron for accordion expand indicator
  index.ts              — barrel
  README.md             — this file
```

## Related

- [`TimelineTwoColumn`](../two-column/README.md) — full two-column desktop variant
- [`TimelinePhase` type](../two-column/types.ts) — shared data model
