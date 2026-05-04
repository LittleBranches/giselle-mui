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
