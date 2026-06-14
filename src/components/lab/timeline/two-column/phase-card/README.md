# PhaseCard

## Why it exists

Rendering a timeline phase as a card involves a recurring cluster of concerns: expand/collapse for a task bullet list, a three-level title disclosure on hover/expand, status badges (overdue, scenario), decorative background shapes, logo strips for clients/platforms/projects, a "viewed" eye button, and a date-conflict warning that optionally opens a repair popover. Without a shared component, each project writes its own version of this cluster and diverges on accessibility, keyboard handling, and MUI theming. `PhaseCard` encapsulates all of it behind a single prop surface with sensible defaults.

## Why it belongs in giselle-mui

Phase cards appear in every project roadmap and delivery timeline view. The overdue/scenario/highlight variant system, the controlled vs uncontrolled expansion modes, the corner-alert badge, and the eye-button interaction are all project-agnostic. Any application using `TimelineTwoColumn` can drop in `PhaseCard` with its own `TimelinePhase` data without reimplementing these behaviours.

## Design decisions

- **Controlled and uncontrolled expansion.** When `onRequestExpand` is provided the component is fully controlled (parent drives accordion). When omitted it manages its own `internalExpanded` state. `resolveCardExpansion` encapsulates this dual-mode logic.
- **Three-level title disclosure.** REST (collapsed, no hover) → `shortTitle`; HOVER → full title + description preview; EXPANDED → full title + description + icon strips + task bullets. Hover no longer triggers a `ResizeObserver` callback so there is no layout shift.
- **Corner alert composability.** `CardCornerAlertBadge` receives a plain `CardCornerAlert[]` array built from `isOverdue` and `dateConflict`. In read-only mode the badge is a tooltip; when `onPhasesChange` is provided it becomes a button that opens `PhaseWarningPopover`.
- **Decoration slot.** `CardDecoration` renders a coloured background shape and optional corner icon. Set `phase.hideDecoration = true` to suppress it for highlighted or scenario variants.
- **`suppressElevation` prop.** Flattens the Paper shadow for layouts that supply their own depth.
- **Eye button placement.** Floats outside the Paper at the bottom outer edge (mirrored by `columnSide`) so it does not overlap card content and mirrors the `CardCornerAlertBadge` which sits at the top outer edge.

Stories: [Lab/Timeline/Two Column/Phase Card](../phase-card.stories.tsx)

## Related

- [MilestoneBadge](../milestone-badge/README.md) — compact expandable badge for point-in-time milestones; shares the three-level disclosure pattern
- [PhaseWarningPopover](../phase-warning-popover/README.md) — date-overlap repair UI opened by the corner alert badge
- [TimelineDot](../timeline-dot/README.md) — dot circle placed at the spine for each phase row
- [SpineConnector](../spine-connector/README.md) — vertical connector line between rows
- [TimelineTwoColumn](../README.md) — parent layout component

---

_Compliance standard: [documentation-strategy.md](../../../../../docs/documentation-strategy.md)_
