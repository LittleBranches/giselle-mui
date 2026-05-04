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
