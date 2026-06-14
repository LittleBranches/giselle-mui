# PhaseWarningPopover

## Why it exists

When phases in a timeline overlap in date, a plain tooltip can display the conflict but cannot
fix it. Users need a way to slide phase boundaries apart, preview the result on a mini Gantt ruler,
and apply or cancel before the parent state changes. Encoding this repair workflow inline in
`PhaseCard` would bloat it; extracting it into a focused popover keeps the card lean and makes the
conflict-repair logic independently testable.

## Why it belongs in giselle-mui

Date-range conflicts are a universal problem in any timeline or Gantt-style component — project
trackers, release planners, sprint boards. The popover binds to the generic `TimelinePhase`
data shape and exposes a single `onPhasesChange(updated)` callback. It carries no opinion about
what projects or phases represent, making it portable to any host application that renders a
two-column timeline.

## Design decisions

**`Popper` + `ClickAwayListener`, not `Tooltip` or `Dialog`.** MUI `Tooltip` is display-only and
blocks focus management inside interactive children. A `Dialog` would feel too heavy for an
inline fix. `Popper` + `Paper` gives a lightweight floating panel that can host sliders, a ruler,
and action buttons while keeping focus accessible (see JSDoc in `phase-warning-popover.tsx`).

**Connected overlap group isolation.** Only phases in the same connected overlap cluster as
`currentPhase` are loaded into the popover. Phases from unrelated clusters elsewhere in the
timeline are excluded from both display and from the `Apply` diff, preventing accidental date
changes to unrelated rows.

**State lifecycle — open-initialise, not mount-initialise.** `overrides` are reset from parsed
phase dates every time `open` becomes `true`. This means dismissing without applying always
discards edits, without needing an explicit "Cancel from closed state" code path.

**"Make sequential" pre-flight.** Clicking this button runs `resolveOverlaps` on the current
overrides and updates the sliders. `pendingApply` is set to `true`, showing the Apply/Cancel row.
The user sees the result before it reaches `onPhasesChange`.

**Shared month-index axis.** `computeAxis` derives a common `min`/`max` from all overrides so
all sliders and the mini Gantt ruler share the same scale. Individual phase durations are preserved
when dragging — `disableSwap` on each slider prevents start and end handles from crossing.

**Internal sub-component.** This component is not exported from the package barrel. It is an
implementation detail of `PhaseCard` and `TimelineTwoColumn`; consumers interact with it only via
the `onPhasesChange` + `allPhases` props on `PhaseCard`.

## Related

- [PhaseCard](../phase-card/README.md) — renders the corner warning badge that opens this popover
- [MUI Popper](https://mui.com/material-ui/react-popper/) — positioning primitive
- [MUI Slider](https://mui.com/material-ui/react-slider/) — range input for each phase row

---

_Compliance standard: [documentation-strategy.md](../../../../../docs/documentation-strategy.md)_
