---
sidebar_label: "PR16 - Phase warning popover"
---

**[Merged](https://github.com/AlexRebula/giselle-mui/pull/16)** — [`feature/phase-warning-popover`](https://github.com/AlexRebula/giselle-mui/tree/feature/phase-warning-popover) — 3 May – 3 May 2026


# PR 16 — feature/phase-warning-popover

This folder contains the message documents for PR 16.

---

## Additional Context: pr-16-docs-phase-a-shipped.md

# docs: Phase A theming utilities shipped — roadmap, workflow, and style extraction rules

## Summary

Marks **Phase A complete** (4 May 2026): `channelAlpha`, `hexToChannel`, `pxToRem`, `remToPx`
are shipped, tested, and exported from `src/utils/theme-utils.ts`. Updates all docs and
contributor guidelines to reflect the milestone and formalises several development rules that
emerged during Phase A work.

---

## Why

Phase A was the prerequisite for Phase B (Giselle brand palette), Phase C (`GiselleThemeProvider`),
and `RoadmapTimeline`. The docs were still showing these as blocked or in-progress. This PR brings
docs into parity with code and locks in the patterns discovered during Phase A so contributors
don't have to rediscover them.

---

## What changed

### Roadmap & planning docs

- **`docs/roadmap.md`** — `channelAlpha`, `hexToChannel`, `pxToRem`, `remToPx` marked ✅ shipped.
  Completion date recorded as 4 May 2026. Phases B and C unblocked.
- **`.github/copilot-instructions.md`** — updated "Current components" table to list all four
  Phase A utilities with status ✅; updated "Next planned work" to reflect that Phase A is done
  and Phase B is now priority 1.

### Mandatory `*.styles.ts` extraction pattern (new rule)

Inline `sx` objects spanning more than ~3 properties must be extracted to a co-located
`<component-name>.styles.ts` file. Key constraints:

- Static styles export as `SxProps<Theme>` functions; dynamic styles take component props and
  return `SxProps<Theme>`.
- Every `*.styles.ts` must have a `*.styles.test.ts` companion that calls the function with a
  minimal mock theme and asserts the returned object.
- Regression tests required for any style value that encodes a non-obvious design or
  accessibility decision (minimum size, WCAG contrast formula, required channel reference).
- Enforcement checklist added: run whenever a component file is edited.

### Git workflow rule (formalised)

No direct pushes to `main`. Every change — including docs and config — must go through a
branch and a pull request. Explicit `✅ correct` / `❌ forbidden` code blocks added to make
the rule unambiguous for contributors and Copilot sessions alike.

### Timeline component status

- `TimelineTwoColumn` marked ✅ shipped in the component table.
- Clarified what is shipped in the phase-warning-popover work: overlap detection,
  `PhaseWarningPopover`, controlled-mode `onPhasesChange` prop, `PhaseCard` integration,
  internal helpers, and full test coverage — all shipped.
- Updated test coverage table: reflected new tests for helpers, popovers, and accessibility;
  corrected total test count.
- Removed stale "blocked until Phase A" notes from components that are now unblocked.

### Minor corrections

- Outdated `varAlpha` / `createPaletteChannel` references replaced with the current
  `channelAlpha` / `hexToChannel` names throughout docs.
- Dependency status in gap analysis docs updated to match code.

---

## Checklist

- [x] All four Phase A utilities exported and tested (`theme-utils.ts`, 22 tests)
- [x] `docs/roadmap.md` shows Phase A ✅ with completion date
- [x] Copilot instructions updated (component table + next-work priority order)
- [x] `*.styles.ts` extraction rule documented with enforcement checklist
- [x] Git workflow rule formalised
- [x] Timeline component status and test table accurate
- [x] `npm run check:verify` passes (Prettier → ESLint → tsc → Vitest → tsup → Storybook)

---

## Additional Context: pr-16-feature-phase-warning-popover.md

# feat: PhaseWarningPopover + controlled mode + Phase A theme utilities

## Summary

Five commits across two concerns:

1. **`TimelineTwoColumn` overlap date-repair UI** — `onPhasesChange` controlled-mode prop, `PhaseWarningPopover` internal sub-component with range sliders and auto-fix
2. **Phase A theme utilities** — `channelAlpha`, `hexToChannel`, `pxToRem`, `remToPx` exported from `src/utils/`

Also includes: Storybook `CssVarsProvider → ThemeProvider` migration (MUI v7 API fix, committed to `main` before branching).

---

## Commits

### `chore(storybook)` — CssVarsProvider → ThemeProvider + theme toolbar

- Replace deprecated `extendTheme`/`CssVarsProvider` with `createTheme`/`ThemeProvider`
- Add `globalTypes` theme toolbar (`paintbrush` icon, `mui-default` entry, Phase B placeholder)
- Update incident doc and add `PhaseWarningPopover` design spec to `docs/components/timeline-plan.md`

### `feat(timeline)` — P1/P2: dateToMonthIndex, monthIndexToDate, resolveOverlaps

- `dateToMonthIndex(dateStr)` — `'Apr 2025'` → linear month index (`year×12+month`)
- `monthIndexToDate(index)` — reverse: `24303` → `'Apr 2025'`
- `resolveOverlaps(phases)` — shifts overlapping phases forward to be sequential; preserves duration; sorts by start date; leaves unparseable dates unchanged
- 18 new tests (330 total)

### `feat(timeline)` — P3: onPhasesChange controlled-mode prop

- `onPhasesChange?: (updated: TimelinePhase[]) => void` added to `TimelineTwoColumnProps` and `PhaseCardProps`
- When provided: badge becomes a popover trigger (P4/P5)
- When omitted: existing read-only tooltip behaviour unchanged
- JSDoc documents the gating pattern with a `useState` usage example

### `feat(timeline)` — P4/P5: PhaseWarningPopover + PhaseCard wiring

- **`phase-warning-popover.tsx`** — new internal sub-component (not exported from barrel):
  - Conflict group auto-computed via `detectPhaseOverlaps(allPhases)` on every open
  - One MUI range `Slider` per conflicting phase; all share a common month-index axis
  - `MiniGanttRuler` — read-only horizontal strip; hatched fill on overlapping segments
  - **Make sequential** button runs `resolveOverlaps` on current slider state
  - **Apply / Cancel** appear after Make sequential; Apply calls `onPhasesChange`
  - State resets to initial parsed dates every time the popover opens
- **`phase-card.tsx`** — `CardCornerAlertBadge` gains optional `onClick` + `innerRef` props:
  - Tooltip mode (no `onPhasesChange`): existing `Tooltip` wrapper unchanged
  - Popover mode (`onPhasesChange` + `allPhases`): badge renders as button; `PhaseWarningPopover` anchored to it
- **`timeline-two-column.tsx`** — passes `allPhases={phases}` to `PhaseCard` (gated on `onPhasesChange`)
- **Story `ControlledModeOverlapRepair`** — side-by-side read-only vs controlled demo; documents Popper-not-Tooltip design decision

### `feat(utils)` — Phase A: channelAlpha, hexToChannel, pxToRem, remToPx

- `channelAlpha(channel, alpha)` — `rgba()` from MUI v7 CSS-var channel string
- `hexToChannel(hex)` — 6-digit hex → space-separated RGB channel
- `pxToRem(px)` — `14` → `"0.875rem"` (16px baseline)
- `remToPx(rem)` — `0.875` → `14`
- All four exported from `src/index.ts`
- 22 tests in `theme-utils.test.ts`
- `docs/theming/nextjs.md` updated with usage examples
- `docs/roadmap.md` Phase A table marked complete

---

## Files changed

```
.storybook/preview.tsx                                     chore: ThemeProvider migration
docs/components/timeline-plan.md                           docs: design spec
docs/theming/nextjs.md                                     docs: Phase A usage examples
docs/roadmap.md                                            docs: Phase A complete (canonical roadmap; docs/theming/roadmap.md is now a redirect)
src/components/timeline-two-column/phase-card.tsx          feat: onClick/innerRef on badge; popover wiring
src/components/timeline-two-column/phase-warning-popover.tsx  feat: NEW — range-slider overlap repair UI
src/components/timeline-two-column/timeline-two-column.tsx feat: allPhases pass-through
src/components/timeline-two-column/timeline-two-column.stories.tsx  feat: ControlledModeOverlapRepair story
src/components/timeline-two-column/types.ts                feat: onPhasesChange prop
src/components/timeline-two-column/utils.ts                feat: dateToMonthIndex, monthIndexToDate, resolveOverlaps
src/components/timeline-two-column/utils.test.ts           test: 18 new tests
src/index.ts                                               feat: export theme utils
src/utils/theme-utils.ts                                   feat: NEW — channelAlpha, hexToChannel, pxToRem, remToPx
src/utils/theme-utils.test.ts                              test: 20 new tests
```

---

## Testing

All checks pass: Prettier → ESLint → `tsc --noEmit` → Vitest (350 tests) → tsup build → Storybook build.

```sh
npm run check:verify
```

## Breaking changes

None. `onPhasesChange` is optional; all existing usages without it behave identically.

---

## Additional Context: pr-16-migrate-to-themeprovider-and-enhance-timeline-utilities-and-ui.md

# PR #16: Migrate to ThemeProvider and enhance timeline utilities and UI

## Branch

`feature/phase-warning-popover` → `main`

## Date

4 May 2026

## Context

Historical PR record preserved for completeness in the PR messages index.

## Notes

- Title from GitHub: Migrate to ThemeProvider and enhance timeline utilities and UI
- Closed PR document added so the PR history stays complete and easy to compare against local branch work.
