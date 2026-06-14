# PhaseWarningPopover

## Why it exists

When two or more timeline phases have overlapping date ranges the timeline becomes misleading. Detecting the overlap is straightforward; giving the user a way to fix it inline is not. An MUI `Tooltip` cannot host interactive children (sliders, buttons) — focus management breaks. A full dialog is too heavy for a quick date nudge. `PhaseWarningPopover` solves this with a `Popper` + `Paper` that renders directly over the offending card, hosts per-phase range sliders on a shared month-index axis, shows a mini Gantt ruler for visual feedback, and provides a one-click "Make sequential" action plus Apply/Cancel.

## Why it belongs in giselle-mui

Date-overlap conflicts occur in any planning tool that surfaces a timeline. The slider-based repair pattern — conflict group isolation, shared axis, sequential resolution, Apply/Cancel lifecycle — is entirely generic. Any application using `TimelineTwoColumn` in controlled mode (with `onPhasesChange`) gets this repair flow without writing overlap-resolution logic.

## Design decisions

- **`Popper` + `ClickAwayListener`, not `Tooltip`:** MUI `Tooltip` does not support focusable children. `Popper` + `Paper` gives full control over focus and interactive content inside the panel.
- **Connected overlap group isolation.** `getConnectedOverlapGroup` computes only the phases in the same transitive overlap cluster as `currentPhase`. This prevents Apply from inadvertently modifying phases from unrelated overlap groups elsewhere in the timeline.
- **Override state lifecycle.** `overrides` is a `Map<phaseKey, PhaseRange>` that re-initialises from parsed phase dates every time the popover opens. Sliders mutate overrides locally; Apply merges them into `allPhases` via `mergeIntoAll` and calls `onPhasesChange`. Cancel resets to initial parse.
- **"Make sequential" as a staged action.** Clicking "Make sequential" runs `resolveOverlaps` on the current overrides and updates the sliders — it does not immediately commit. The Apply/Cancel pair only appears after a "Make sequential" run, giving the user a chance to review before writing back.
- **Internal sub-component.** `PhaseWarningPopover` is not exported from the package barrel. It is an implementation detail of `PhaseCard` / `TimelineTwoColumn` and should not be used in isolation.
- **`zIndex: theme.zIndex.tooltip + 1`:** Ensures the popover renders above all other overlapping timeline cards during the repair interaction.

## Related

- [PhaseCard](../phase-card/README.md) — the card that opens this popover via its corner alert badge
- [TimelineTwoColumn](../README.md) — owns `onPhasesChange` and passes it down to `PhaseCard`
- [MiniGanttRuler](./mini-gantt-ruler.tsx) — internal sub-component that renders the shared axis ruler inside the popover

---

_Compliance standard: [documentation-strategy.md](../../../../../docs/documentation-strategy.md)_
