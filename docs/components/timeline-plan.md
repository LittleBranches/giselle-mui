---
sidebar_position: 2
sidebar_label: 'RoadmapTimeline Plan'
---

# Timeline / Roadmap Component — Planning Notes

> **Status:** Planning phase. Not yet implemented.
> **Candidate component name:** `RoadmapTimeline`

---

## Variant architecture intent (Apr 2026)

The reference implementation in the private portfolio (`alexrebula`) has been split into focused sub-components — `PhaseCard`, `MilestoneBadge`, `SpineConnector`, `animations.ts` — all sharing a single `TimelinePhase` type as the data contract. This was done deliberately so that multiple layout variants can reuse the same card/badge primitives without forking the type or duplicating rendering logic.

Planned variants (portfolio → giselle-mui extraction candidates):

| Variant                                              | giselle-mui candidate? | Blocker                                                              |
| ---------------------------------------------------- | ---------------------- | -------------------------------------------------------------------- |
| `TimelineTwoColumn` (base, vertical alternating)     | ✅ Yes                 | `varAlpha` + `Chip variant="soft"` (Minimals) must be replaced first |
| `TimelineHorizontal` (click/swipe, horizontal track) | ✅ Yes                 | Same Minimals blockers; no `framer-motion` needed                    |
| `TimelineCompact` (single-column, mobile/sidebar)    | ✅ Yes                 | Cleanest — least Minimals surface                                    |
| `TimelineAnimated` (Framer Motion + parallax)        | ❌ No                  | `framer-motion` is not an allowed giselle-mui peer dep               |

**The `TimelinePhase` type is the stable public API.** Extend additively (optional fields only). All variants accept `phases: TimelinePhase[]`.

---

## Why this component belongs in giselle-mui

A visually rich, alternating-side timeline is non-trivial to build correctly with
`@mui/lab` alone. The decisions about `done` state, scenario variants, icon rendering,
and responsive side-switching are easy to get wrong and worth encoding once for all
consumers. This is the same justification as every other component in this library.

**Reference implementation:** `alexrebula/src/sections/case-001/view.tsx` (private repo).
That file is the working source of truth for the visual pattern. The public component
will be rewritten from scratch — no code copied from the private repo.

---

## Required MUI peer dependencies

`@mui/lab` is needed for the Timeline primitives:

```ts
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import type { TimelineDotProps } from '@mui/lab/TimelineDot';
```

`@mui/lab` is part of the MUI ecosystem and is acceptable as a peer dependency in
`giselle-mui` under the zero-proprietary-dependencies rule.

---

## Step type design

```ts
export type TimelineStep = {
  /** Unique key — used as React key, also usable as anchor ID. */
  key: number | string;
  /** Short title shown in the main content area. */
  title: string;
  /** One-sentence description shown below the title. */
  description: string;
  /** Display date or date range, e.g. "28 Jun 2026" or "Jun–Aug 2026". */
  date: string;
  /**
   * Icon to display in the TimelineDot.
   * ReactNode — consumer provides; component never imports an icon library.
   */
  icon?: ReactNode;
  /**
   * Dot colour — follows MUI palette key convention.
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  /** Which side of the timeline the content appears on. */
  side: 'left' | 'right';
  /** Whether this step has been completed. Affects dot and connector styling. */
  done?: boolean;
  /** Optional list of bullet-point detail strings shown below the description. */
  details?: string[];
  /**
   * If true, renders the step with a distinct "scenario" visual treatment
   * (e.g. dashed border, lighter opacity, label badge).
   */
  isScenario?: boolean;
  /** Label shown on the scenario badge, e.g. "Scenario A". */
  scenarioLabel?: string;
};
```

**Why `ReactNode` for `icon`:** giselle-mui never imports an icon library internally.
The consumer is responsible for filling the icon slot — just like every other component
in this library. This follows the `ReactNode slots for icons and decoration` component rule.

**Why `isScenario` instead of `variant`:** Using a boolean flag is simpler and more
explicit for a two-state variant than a string enum. If more variants are needed later,
the type can be extended without a breaking change.

---

## `varAlpha` dependency

The component needs `varAlpha` for the scenario step background tint. Phase A of
`theming-roadmap.md` ships this as an internal utility:

```ts
import { varAlpha } from '../utils/theme';
```

Phase A is therefore a prerequisite for this component.

---

## Data workflow: MD → JSON → sections-api

The intended consumer workflow for a roadmap/timeline page:

```
1. Author writes timeline data in a structured JSON file:
   sections-api/roadmap/roadmap-data.ts

2. Factory function returns typed RoadmapProps:
   export function getRoadmapData(): RoadmapProps { return { steps: STEPS }; }

3. Page passes typed props to view:
   app/roadmap/page.tsx → sections/roadmap/view.tsx

4. View passes steps to RoadmapTimeline:
   <RoadmapTimeline steps={data.steps} />
```

There is no MD → JSON transformer in scope for v1. The consumer writes `TimelineStep[]`
directly in TypeScript. An MD → JSON transformer could be added later as a separate
utility package if the need arises across multiple consumer projects.

---

## Sections-api integration pattern

```ts
// sections-api/roadmap/types.ts
import type { TimelineStep } from '@alexrebula/giselle-mui';

export interface RoadmapSectionProps {
  title?: string;
  description?: string;
  steps: TimelineStep[];
}

// sections-api/roadmap/roadmap-data.ts
import type { RoadmapSectionProps } from './types';

const STEPS: TimelineStep[] = [
  {
    key: 1,
    title: 'Phase 1',
    description: 'Foundation work',
    date: 'Q1 2026',
    side: 'left',
    done: true,
    color: 'success',
  },
  // ...
];

export function getRoadmapData(): RoadmapSectionProps {
  return { steps: STEPS };
}
```

---

## File structure (when implemented)

```
src/components/roadmap-timeline/
  roadmap-timeline.tsx       — component + exported Props and TimelineStep interfaces
  index.ts                   — barrel
  README.md                  — why it exists, design decisions
  roadmap-timeline.test.ts   — Vitest unit tests
```

---

## Storybook story outline

```ts
// stories/RoadmapTimeline.stories.tsx
export default {
  title: 'Components/RoadmapTimeline',
  component: RoadmapTimeline,
  argTypes: {
    steps: { control: false },
    sx: { control: false },
  },
};

// Story: Default (mixed done/undone, with icons from @iconify/react)
// Story: AllDone
// Story: WithScenarios (isScenario steps mixed in)
// Story: SingleStep
```

---

## Overlap detection and the planned date-repair UI (future)

### What is already shipped

`detectPhaseOverlaps(phases)` in `utils.ts` identifies phases whose date ranges
intersect. The result is wired into `TimelineTwoColumn` via `overlappingKeys`:
each conflicting phase card shows a `⚠ Date overlap` corner badge. The badge
carries a `dateConflictLabel` tooltip string — the parent can pass a
human-readable explanation (e.g. `"Overlaps with Phase B (Apr–Jun 2025)"`).

The badge, tooltip, and detection are fully functional and tested.

### What is not yet built — `PhaseWarningPopover` with range-slider repair UI

#### Trigger

The existing `⚠ Date overlap` corner badge on `PhaseCard` becomes the trigger.
Clicking it opens a **custom popover** (MUI `Popper` + `Paper`, not the basic
`Tooltip`). The popover is rich enough to host sliders and a mini-timeline — a
basic tooltip string cannot do that.

The popover is also the host for **all** warnings and errors on a phase, not
just overlaps. Future warning types (missing date, invalid date range, duplicate
key, etc.) render as a list in the same popover above the slider section.

#### Popover layout (top to bottom)

```
┌─────────────────────────────────────────────────────┐
│  ⚠ 1 warning                              [×]       │
│  ─────────────────────────────────────────────────  │
│  ⚠ Date overlap with Phase B (3 months shared)      │
│  ─────────────────────────────────────────────────  │
│  Phase A  ███████████░░░░  Apr 2025 – Sep 2025       │  ← colored range slider
│  Phase B  ░░░░░███████████  Jul 2025 – Dec 2025      │  ← colored range slider
│                                                     │
│  ────────────────────────────────────────────────   │
│  [Apr 25]──[A]──[B]──[Dec 25]                       │  ← mini timeline ruler
│                                                     │
│                        [Make sequential]            │
└─────────────────────────────────────────────────────┘
```

#### Range sliders

- One horizontal **MUI `Slider`** per conflicting phase, stacked vertically.
- Each slider is a **range slider** (`value: [startIndex, endIndex]`) mapping
  month indices to the phase's date range. Dragging either thumb adjusts the
  phase's start or end date in real time.
- Each slider is colored with the phase's `color` palette key
  (`theme.vars.palette[phase.color].main`).
- The sliders share a common `min`/`max` axis (the earliest start month to the
  latest end month across all conflicting phases + 2 months of padding).
- As thumbs are dragged, the mini timeline ruler updates live and overlap
  highlighting updates live. A phase whose overlap is resolved turns green (no
  longer flagged).

#### Mini timeline ruler

- A narrow horizontal strip below the sliders showing all phases in the
  overlapping group as colored segments on a shared time axis.
- Tick marks at month or quarter boundaries.
- Segments that still overlap are shown with a hatched/striped fill; resolved
  segments are shown solid.
- This is a pure visual read-out — not interactive itself.

#### "Make sequential" button

- Calls a pure function `resolveOverlaps(phases): TimelinePhase[]` (to be added
  to `utils.ts`) that shifts conflicting phases to be end-to-end sequential:
  - Preserves phase order.
  - Sets each conflicting phase's start to the previous phase's end + 1 month.
  - Does not compress any phase below its original duration.
- The result is applied to the local slider state immediately. The user can
  review the proposed fix in the sliders before committing.
- A **"Apply"** / **"Cancel"** button pair appears after "Make sequential" is
  clicked, so the user confirms before the changes propagate to `onPhasesChange`.

#### Implementation notes

- **Controlled mode is a prerequisite.** The popover needs `onPhasesChange`
  callback prop on `TimelineTwoColumn` to push the updated date ranges back to
  the consumer. Controlled mode is not yet designed.
- **`resolveOverlaps(phases)`** must be a pure function in `utils.ts` — written
  and tested before any UI is wired.
- **Month-index helpers:** `dateToMonthIndex(dateStr): number` and
  `monthIndexToDate(n, endOfMonth?: boolean): string` — convert between the
  existing `'Apr 2025'` / `'Apr 2025 – Sep 2025'` string format and the integer
  index the Slider needs.
- **No MUI `Tooltip` wrapper.** The popover is a `Popper` + `ClickAwayListener`
  - `Paper` combination so it can host rich interactive content. MUI's `Tooltip`
    is display-only and does not support focus management inside interactive
    children.
- The `PhaseWarningPopover` component lives in the `timeline-two-column/`
  folder as an internal sub-component (not exported from the package barrel).
- **Copyright note:** the visual pattern of stacked colored range sliders is
  inspired by a Minimals component demo. The implementation must be written from
  scratch using MUI `Slider` — no code from the Minimals source.

#### Prerequisites in order

1. `resolveOverlaps(phases)` pure function + tests in `utils.ts`
2. Month-index helpers + tests in `utils.ts`
3. Controlled mode design (`onPhasesChange` prop shape)
4. `PhaseWarningPopover` component (reads controlled state, calls
   `onPhasesChange` on Apply)
5. Wire `PhaseWarningPopover` into `PhaseCard` corner badge (replace plain
   string tooltip with popover trigger)

---

## Related

- [theming-roadmap.md](./theming-roadmap.md) — Phase A (`varAlpha` utility) is a prerequisite
- [alexrebula docs/roadmap.md](../../rm/presentation/alexrebula/docs/roadmap.md) — milestone tracking
- `alexrebula/src/sections/ziga/view.tsx` — reference implementation (private repo, do not copy code)
