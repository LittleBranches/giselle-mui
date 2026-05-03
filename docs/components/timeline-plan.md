---
sidebar_position: 2
sidebar_label: 'RoadmapTimeline Plan'
---

# Timeline / Roadmap Component — Planning Notes

> **Status:** Planning phase. `TimelineTwoColumn` is shipped. `RoadmapTimeline` (a lighter `@mui/lab`-based variant) is not yet implemented.
> **Component shipped:** `TimelineTwoColumn` — see `src/components/timeline-two-column/`
> **Next component:** `RoadmapTimeline`

---

## Why two timeline components

`TimelineTwoColumn` and `RoadmapTimeline` solve different problems at different scales.

### TimelineTwoColumn — the showcase component

The full-featured career and project timeline. Purpose-built for presenting a dense body of professional history with visual impact.

- **Two-column alternating layout** — phases stagger left and right down a centre spine. Each phase sits in one column; its milestones surface in the opposite column.
- **Nested data model** — `phases[]` → each phase has its own `milestones[]`. The nesting is the point: phases give the macro shape, milestones give the detail.
- **Expandable `PhaseCard`** — collapses to a concise header; expands to show full description, details list, platform strip, and photos.
- **Overlap detection + date-repair UI** — `PhaseWarningPopover` lets the consumer visually correct overlapping date ranges without leaving the page.
- **Eye-button tracking** — per-phase and per-milestone viewed state (wired to `PortfolioPreferencesProvider`).
- **Custom spine** — `SpineConnector`, custom `TimelineDot`, done-state colouring, overdue colour, active pulsing ring.
- Uses `@mui/lab/Timeline` as the root wrapper only. Every visual component beneath it is custom-built.
- ~20 source files, 290 tests.

### RoadmapTimeline — the documentation component

A lightweight, single-column timeline for roadmap pages, changelogs, and documentation sites. Where `TimelineTwoColumn` is built for visual impact, `RoadmapTimeline` is built to be scannable, clean, and unobtrusive — the kind of thing you drop into a Docusaurus page beside prose.

- **Flat data model** — a `steps[]` array with no nesting. No milestones, no phases-within-phases.
- **Single-column** — left, right, or alternating content side, using `@mui/lab` layout props natively (`position="alternate"` etc.).
- **Uses the full `@mui/lab` Timeline primitive stack** — `Timeline` + `TimelineItem` + `TimelineSeparator` + `TimelineConnector` + `TimelineContent` + `TimelineDot`. MUI handles the accessible markup; this component only adds colour and typed content. It is deliberately thin.
- **Primary consumer: `giselle-docs`** — the Docusaurus documentation site for this library. The first page that will use it is the `giselle-mui` roadmap page (`/roadmaps/giselle-mui`).
- No expansion, no eye buttons, no photos, no overlap detection, no two-column layout. Those belong to `TimelineTwoColumn`.

**The deciding question:** If the timeline _is_ the page — the main showcase of a career or complex project — use `TimelineTwoColumn`. If the timeline is _on_ a page — supplementary context beside documentation prose, a changelog, or a simple product roadmap — use `RoadmapTimeline`.

---

## Variant architecture intent (Apr 2026)

The reference implementation in the private portfolio (`alexrebula`) has been split into focused sub-components — `PhaseCard`, `MilestoneBadge`, `SpineConnector`, `animations.ts` — all sharing a single `TimelinePhase` type as the data contract. This was done deliberately so that multiple layout variants can reuse the same card/badge primitives without forking the type or duplicating rendering logic.

Planned variants (portfolio → giselle-mui extraction candidates):

| Variant                                              | giselle-mui candidate? | Status                                                               |
| ---------------------------------------------------- | ---------------------- | -------------------------------------------------------------------- |
| `TimelineTwoColumn` (base, vertical alternating)     | ✅ Yes                 | ✅ Shipped — `src/components/timeline-two-column/`                    |
| `TimelineHorizontal` (click/swipe, horizontal track) | ✅ Yes                 | ⬜ Not started                                                       |
| `TimelineCompact` (single-column, mobile/sidebar)    | ✅ Yes                 | ⬜ Not started                                                       |
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

## `channelAlpha` dependency

The component uses `channelAlpha` for the scenario step background tint. `channelAlpha` is
exported from `src/utils/theme-utils.ts` and available from `@alexrebula/giselle-mui`
as of Phase A (4 May 2026). This prerequisite is met.

```ts
import { channelAlpha } from '@alexrebula/giselle-mui';
```

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

## Hard blocker: TimelineTwoColumn cleanup overhaul

**RoadmapTimeline must not be started until this overhaul is complete.**

When `RoadmapTimeline` is built, it will share primitives with `TimelineTwoColumn` —
the `TimelineDot` colouring logic, the `SpineConnector`, and likely the `PhaseCard`
expand/collapse animations. Shared primitives that live in messy, complex source files
get forked instead of shared. The overhaul makes sharing possible.

Additionally: this is the top priority in the entire `alexrebula` project at this point in
time. Every other timeline variant and every other component that reuses timeline primitives
depends on `TimelineTwoColumn` being in a clean, well-structured state first.

### Required before RoadmapTimeline can begin

| Task | Why it matters |
|---|---|
| Extract all multi-property `sx` objects to `*.styles.ts` files | Reduces component file sizes; makes sx independently testable; prevents drift when multiple variants share the same visual rule |
| Fix cognitive complexity in `phase-card.tsx` (currently 17 → must be ≤ 15) | Sonar gate will block the quality check on any file that shares logic with this one |
| JSDoc pass on all exported functions and prop interfaces | `RoadmapTimeline` will export types; consistent JSDoc level across the component family is required before that |
| Wire `onPhasesChange` controlled-mode prop to `TimelineTwoColumn` root | Designed and tested; not yet wired. Leaving it un-wired creates a half-finished API surface |
| Wire `PhaseWarningPopover` into `PhaseCard` | Replace the current plain string tooltip. Also un-wired despite being built and tested |
| Complete the CareerTimeline UX polish list (alexrebula Phase 1.2) | The final real-world usage pass that will surface any remaining rough edges before the primitive split |

### Why the order matters

1. **Styles extraction first** — makes the components scannable and lets you see clearly what logic is shared vs. component-specific before the split.
2. **Cognitive complexity fix second** — can't pass the quality gate on the styles test files until the parent component itself passes.
3. **JSDoc pass third** — once the files are clean and scannable, documenting them is fast. Doing it on messy files wastes time.
4. **Wire the two un-wired features fourth** — they are already built; wiring them is low-risk and closes the loop on the current feature branch.
5. **UX polish last** — the final consumer feedback pass. Changes here may touch the same files; doing it after the cleanup avoids re-cleaning.

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

## Overlap detection and the date-repair UI

### What is shipped

The following are all shipped and fully tested:

**`utils.ts`:**
- `detectPhaseOverlaps(phases)` — identifies phases whose date ranges intersect; wired into `TimelineTwoColumn` via `overlappingKeys`; each conflicting card shows a `⚠ Date overlap` corner badge
- `resolveOverlaps(phases)` — pure function that shifts conflicting phases to be end-to-end sequential (preserves phase order, does not compress durations)
- `dateToMonthIndex(dateStr)` — converts a `'Mon YYYY'` string to a 0-based integer month index
- `monthIndexToDate(index)` — converts a month index back to a `'Mon YYYY'` string
- `sortMilestonesAsc` / `sortMilestonesDesc` — milestone sort helpers

**`phase-warning-popover.tsx`** (internal — not exported from barrel):
- `parsePhaseRange(phase)` — resolves a phase's date string to `{ startIdx, endIdx }`; returns `null` for year-only strings to avoid silently rewriting imprecise dates
- `getConnectedOverlapGroup(phases, startKey)` — BFS from the triggering phase to collect its connected overlap cluster; unrelated overlaps elsewhere on the timeline are excluded
- `PhaseWarningPopover` component — MUI `Popper` + `Paper` + `ClickAwayListener` with stacked colored range sliders, a mini timeline ruler, and a "Make sequential" button. Apply/Cancel buttons confirm before pushing `onPhasesChange`.

The corner badge, tooltip, detection, and the full repair UI are functional and have 26 tests.

### Remaining work

- **`onPhasesChange` controlled-mode prop** on `TimelineTwoColumn` — `PhaseWarningPopover` calls this to push updated date ranges to the consumer. The prop shape is designed but not yet wired to the component's root.
- **Wire `PhaseWarningPopover` into `PhaseCard`** — replace the current plain string tooltip with the popover trigger.

---

## Related

- [roadmap.md](../roadmap.md) — Phase A (`channelAlpha` utility) shipped 4 May 2026; Phases B/C pending
- [alexrebula docs/roadmap.md](../../rm/presentation/alexrebula/docs/roadmap.md) — milestone tracking
- `alexrebula/src/sections/career-timeline/` — reference implementation in production (private repo, do not copy code)
