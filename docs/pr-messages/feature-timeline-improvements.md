# feat: TimelineTwoColumn improvements — tooltips, marker variant, footer slot, height measurement

## Summary

6 commits · 10 files changed

This PR adds four independent improvements to `TimelineTwoColumn`, all motivated by
real-world usage in the `alexrebula` career timeline:

1. **Smart dot tooltips** — description previews in read-only mode; status labels in checklist mode
2. **`marker` variant** — spine-only row for single point-in-time events with no card
3. **`footer` slot on `PhaseCard`** — for interactive elements (play buttons, links) below the card body
4. **Per-milestone height measurement** — `useLayoutEffect` + `ResizeObserver` for layout stability

Plus: `sortMilestonesDesc`, `dotBg` on milestone dots, milestone dot size bump (32 → 34px),
open-only expand behaviour, and z-index hardening.

---

## Changes

### 1. Smart dot tooltips

**Motivation:** The previous tooltip showed only `status · date` in every mode. In read-only
timelines this added no information the user couldn't already see on the card. In checklist
mode the status label is genuinely useful. A description preview would be far more valuable
for read-only use.

**New behaviour:**

| Mode                            | Tooltip content                                     |
| ------------------------------- | --------------------------------------------------- |
| Read-only (no `checklist` prop) | First sentence of `description`, capped at 72 chars |
| Checklist                       | Status label + date (previous behaviour, preserved) |
| Either, with `dotTooltip` set   | `dotTooltip` always wins                            |

**New API — `TimelinePhase` and milestone:**

```ts
dotTooltip?: string;  // overrides automatic tooltip on the phase or milestone dot
```

**New exported helpers** (internal, exported for unit tests):

```ts
truncateDescription(s: string, maxLen?: number): string
resolvePhaseTooltip(checklist, color, done, phase): string
resolveMilestoneTooltip(checklist, color, done, ms): string
```

**Tooltip placement** changed from `'left' | 'right'` (spine-side-aware) to `'top'` for
both phase and milestone dots — avoids the tooltip obscuring the adjacent card column.

**New test file:** `timeline-two-column.tooltip.test.ts` — 259 lines, covers all branching
logic for both helpers and `truncateDescription`.

---

### 2. `marker` variant

**Motivation:** Some career timeline entries are single point-in-time events (a certification
date, a visa grant, a birth) that don't warrant a full phase card. Previously these had to be
shoehorned into a minimal `life-event` card. The `marker` variant renders spine-only: dot +
floating label, no card.

**New API:**

```ts
variant?: 'scenario' | 'life-event' | 'marker';
```

`description` is now optional on `TimelinePhase` (was required). `marker` entries have no
card so no description is needed. The dot tooltip for `marker` entries falls back to
`shortTitle + date`.

---

### 3. `footer` slot on `PhaseCard`

**Motivation:** The `alexrebula` career timeline needed a play button (`ModemSoundButton`)
wired to the 2003 birth-of-broadband milestone. The button belongs contextually to the card
but is not part of the expandable detail bullets.

**New API on `TimelinePhase`:**

```tsx
footer?: ReactNode;
```

Rendered at the bottom of the card's always-visible content area, below all icon strips and
above the expandable detail bullets.

```tsx
// Example usage:
footer={<ModemSoundButton />}
```

**New tests:** `phase-card.test.ts` — added `footer` slot rendering and `null`/`undefined`
fallback assertions.

---

### 4. Per-milestone height measurement

**Motivation:** In the absolute-positioned milestone column, overlapping cards from adjacent
phases can clip each other. The fix measures each mounted milestone card with
`useLayoutEffect` + `ResizeObserver` and stores heights in `msHeightMapRef` so the parent
can reserve the correct slot height per phase.

**Implementation:**

- `MilestoneRowCtx` gains `onMeasure: (mi, el) => void`
- Both left-column and right-column card `Box` elements get `ref` + `data-ms-card="true"`
- `useRef<Record<string, number>>` accumulates heights; `useLayoutEffect` observes resizes

---

### 5. Sorting — `sortMilestonesDesc` + sort order wired to milestones

`sortMilestonesDesc` added to `utils.ts` (complement to the existing `sortMilestonesAsc`).

**New behaviour:** milestone sort order now follows `sortOrder` prop:

- `sortOrder='asc'` (roadmap) → milestones earliest-first
- `sortOrder='desc'` (career timeline) → milestones latest-first (matches the
  top-to-bottom newest-first visual flow of the timeline)

Previously milestones were always sorted ascending regardless of `sortOrder`.

---

### 6. `dotBg` on milestone dots

**Motivation:** Brand icon dots (Bitcoin, Knockout.js) have specific brand colours that
clash with the palette-derived `bgcolor`. `dotBg` overrides the circle background while
still enforcing success-green on `done=true` dots.

**New API — `TimelinePhase` milestone:**

```ts
dotBg?: string;  // CSS colour string, e.g. '#f7931a'
```

**Ignored when `done=true`** — done dots are always success-green per the done-dot colour
enforcement rule.

---

### 7. Open-only expand behaviour

Cards previously toggled on re-click (open → close). Behaviour changed to open-only:
a second click on an already-open card keeps it open. Only an outside-click document
listener closes it. This prevents accidental collapse when a user clicks an embedded
interactive element (e.g. the `footer` play button).

---

### 8. z-index hardening

Expanded milestone card z-index raised from `10` to `1000`; hover z-index from `9` to
`999`. Ensures expanded cards always render above adjacent phase cards, which can have
elevated z-index from their own hover states.

---

### 9. Milestone dot size + separator padding

Milestone dot diameter increased from 32px to 34px for better visual weight against the
42px phase dots. Separator border gains `padding: '2px'` so the white separator ring sits
correctly against the larger dot.

---

## Tests

| File                                           | Status     | Notes                                        |
| ---------------------------------------------- | ---------- | -------------------------------------------- |
| `timeline-two-column.tooltip.test.ts`          | ✅ new     | 259 lines — all tooltip helper branches      |
| `phase-card.test.ts`                           | ✅ updated | footer slot + null fallback assertions added |
| `timeline-two-column.column-placement.test.ts` | ✅ updated | minor import addition                        |

All existing tests continue to pass. No regression in done-dot colour enforcement,
corner badge positioning, or eye button WCAG tests.

---

## Checklist

- [x] All new props documented with JSDoc
- [x] `description` optionality change is backwards-compatible (was required, now optional)
- [x] `dotBg` correctly skipped when `done=true` (done-dot colour enforcement rule preserved)
- [x] `marker` variant renders no card — no `footer`, no `description` needed
- [x] `sortMilestonesDesc` exported from `utils.ts` barrel
- [x] New Storybook stories added for `marker` variant and tooltip behaviour
- [x] `.github/copilot-instructions.md` updated with column placement rule

---

## Related

- `alexrebula` branch `fix/pr33-stale-doc-references-and-env-comment` — consumer of
  `footer` slot (`ModemSoundButton`), `dotBg` (Bitcoin/Knockout icons), `marker` variant
  (birth milestone), and `sortOrder='desc'` milestone ordering
