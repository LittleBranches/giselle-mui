# timeline-two-column

## Why it exists

Building a two-column career/roadmap timeline correctly with MUI requires solving several non-obvious problems simultaneously:

- **Milestone placement** — milestones belong visually to a phase period. Rendering them as separate `TimelineItem` rows causes them to appear outside the period in the DOM flow. The correct approach places milestone rows as nested flex rows _inside_ the same `<li>` as their parent phase, in the opposite column, so they sit visually alongside the phase card.
- **Absolute milestone cards** — milestone badge cards are absolutely positioned within their column so expanding a card does not shift spine dot positions.
- **Accordion state** — phase card and milestone expansions are mutually exclusive. Opening one collapses the others. Clicking the same item again collapses it (true toggle).
- **Checklist mode** — dots become interactive checkboxes with `role="checkbox"`, `aria-checked`, `tabIndex={0}`, and an accessible label. Done items are dimmed. Past-due items (date in the past + not done + not active) turn red automatically.
- **Phase color on dots** — `phase.color` controls the dot color and must be derived consistently; the dot, spine connector, and phase card must all share the same palette key.
- **`'#fff'` prohibition** — done-phase dot foreground must use `theme.vars.palette.common.white`, not a hardcoded hex.
- **`.lighter` prohibition** — scenario badge background must be computed from `mainChannel` with opacity, not `*.lighter` (not part of the default MUI v7 palette).

## Why it belongs here

Any developer building a career timeline or product roadmap with MUI v7 would independently rediscover every problem above. This component encodes the correct answers once.

## Design decisions

### Column layout

Each phase renders as **one `<li>`** containing a stack of flex rows:

- Row 0: phase card | phase dot + spine | empty (or mirrored for `side='left'`)
- Row 1..N: milestone card | ms dot + spine | empty (or mirrored)

This keeps milestones visually inside their parent period without breaking the MUI `Timeline` separator alignment.

### TimelineColumn helper

The left/right content columns are extracted into a `TimelineColumn` local helper component (not exported). The two columns are nearly identical — extraction prevents drift during refactors. **Do not inline them back into the render.**

### Interactive modes

| Mode                       | Dot behavior                               | Done state                           |
| -------------------------- | ------------------------------------------ | ------------------------------------ |
| Read-only (default)        | Click expands card details; no done toggle | From prop only                       |
| Checklist (`checklist`)    | Click toggles done; `role="checkbox"`      | Local state, synced to `phases` prop |
| Hero nav (`onPhaseSelect`) | Click fires callback; `role="button"`      | From prop only                       |

### `phases` prop sync

Local done-state is initialised from `phases` and re-synced whenever the `phases` array identity changes. This allows async data loads and external resets to propagate without remounting the component.

### `platforms` field — dual shape for backward compatibility

The `platforms` prop accepts two shapes, exported as `TimelinePlatformItem`:

```ts
platforms?: TimelinePlatformItem[]
// where TimelinePlatformItem = { icon: ReactNode; label: string } | string
```

**The preferred form** is `{ icon, label }` — it renders a tooltip-wrapped icon slot:

```ts
platforms: [
  { icon: <GiselleIcon icon="logos:php" width={24} />, label: 'PHP' },
]
```

**The string form** (for example, `'PHP'`) is a **backward-compatibility shim only**. It renders the string literally as a plain text label chip with no icon; strings are **not** interpreted as icon IDs. It exists to accommodate legacy downstream consumer data that was originally written against an earlier `string[]` contract, avoiding a breaking migration for existing consumers.

**Do not write new string-form platform arrays.** Always use `{ icon, label }`. The string form may be removed in a future major version once all known legacy consumers have migrated.

### Sort stability

`sortPhasesByDate` sorts newest-first with active phases pinned first. When two phases are both `active`, the comparator falls back to descending key order (rather than returning -1 for both, which would make the comparator non-symmetric and produce engine-dependent ordering).

## Library safety

- No hardcoded hex or rgba — all colors via `theme.vars.palette.*`.
- No `.lighter` palette slot — tints use `rgba(var(--mui-palette-${color}-mainChannel) / 0.12)`.
- No `@iconify/react` import — icon slots accept `ReactNode` from the consumer.
- All interactive dots are keyboard-accessible (`tabIndex={0}`, `role`, `aria-label`).
- `TimelineTwoColumn` spreads `...other` on the root `Box` for `id`, `data-*`, `aria-*` passthrough.
- `TimelineDot` extends `BoxProps` (minus `color`/`onClick`) and spreads `...other`.

## File structure

```
src/components/timeline-two-column/
  animations.ts                              — CSS keyframes (checkPop, pulseRing)
  index.ts                                   — barrel: exports TimelineTwoColumn, PhaseCard, TimelineDot + types
  milestone-badge.tsx                        — expandable milestone card (internal)
  milestone-badge.interaction.test.ts        — harness-based interaction tests
  milestone-badge.logic.test.ts              — pure logic tests for derivations
  phase-card.tsx                             — phase card with variants, badges, icon strips (internal)
  phase-card.test.ts                         — logic tests for PhaseCard helper functions
  spine-connector.tsx                        — connecting line with optional year chip (internal)
  spine-connector.test.ts                    — rendering tests for SpineConnector
  timeline-dot.tsx                           — unified dot circle (exported)
  timeline-dot.test.ts                       — attribute + interaction tests for TimelineDot
  timeline-dot.stories.tsx                   — Storybook stories
  timeline-two-column.tsx                    — root component (exported)
  timeline-two-column.stories.tsx            — Storybook stories
  timeline-two-column.column-placement.test.ts — structural invariant tests
  types.ts                                   — TimelinePhase, TimelineTwoColumnProps, HighlightedPaletteKey
  utils.ts                                   — parseSortableDate, sortPhasesByDate, getLastYear, parseLastDate
  utils.test.ts                              — unit tests for date parsing/sorting utilities
  README.md                                  — this file
```

## Related

- `GiselleIcon` — use for `icon` and `platforms[].icon` slots
- `docs/components/timeline-plan.md` — original planning notes and variant architecture intent
