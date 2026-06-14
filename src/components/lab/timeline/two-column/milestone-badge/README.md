# MilestoneBadge

## Why it exists

Timeline views must signal discrete delivery events — releases, sign-offs, launches — without
overwhelming the phase cards that dominate the layout. Without a dedicated component, every
consumer re-implements the same pattern: a compact badge that right-aligns when in the left column,
expands on click to show a checklist of sub-tasks, collapses again when another card opens, and
provides a "mark as viewed" eye toggle so returning users can orient quickly. The boilerplate is
substantial and the accessibility concerns (controlled accordion, `aria-expanded`, keyboard
navigation, `aria-controls` id stability) make it error-prone to duplicate.

## Why it belongs in giselle-mui

Milestone events appear in every long-horizon product view — roadmaps, career timelines,
project histories, version changelogs. The component is parameterised purely on `TimelineMilestone`
data and MUI palette keys; it has no opinion about what the milestones represent. Any project
that renders a two-column timeline can drop in `MilestoneBadge` and control its state from the
parent accordion without touching layout logic.

## Design decisions

**Controlled accordion only.** `isExpanded` and `onRequestExpand` are required props — the
component does not manage its own open/close state. This keeps "at most one milestone open per
phase" a simple parent-level rule rather than cross-instance coordination inside the component.

**Three-level title disclosure.** Collapsed at rest shows `shortTitle` (glanceable); hovering
reveals the full `title` (preview before clicking); expanding shows `title` + `description` +
detail bullets. The ResizeObserver that previously triggered layout shifts on hover was removed,
making it safe to swap `displayTitle` on hover without reflow.

**Left-column alignment invariant.** When `columnSide="left"`, the collapsed card right-aligns so
text sits flush against the centre spine. Alignment resets to left-aligned only on expansion
(normal reading flow). Hover must not change alignment — this invariant is covered in tests.

**Eye button placement.** The "mark as viewed" eye button is inline in the title row, positioned
closest to the spine regardless of column side, meeting the WCAG 2.2 AA 20 px minimum interactive
icon target (`MILESTONE_EYE_ICON_SIZE = 20`).

**Legacy `details` compat.** The component accepts both `m.children` (structured `Task[]`) and
the legacy flat `m.details` string array. Legacy items are mapped to `{ title }` shims so existing
data does not require migration.

**Storybook:** `Lab/Timeline/Two Column/Milestone Badge`
Stories: `Default`, `ExpandedState`, `LeftColumn`, `LeftColumnExpanded`, `DoneState`,
`IsViewed`, `AllColors`, `Responsive`.

## Related

- [PhaseCard](../phase-card/README.md) — sibling card for timeline phases; shares the three-level
  disclosure model and `columnSide` alignment prop
- [TimelineDot](../timeline-dot/README.md) — the spine dot rendered beside each milestone
- [SpineConnector](../spine-connector/README.md) — the vertical line between spine dots
- [MUI Paper](https://mui.com/material-ui/react-paper/) — root element

---

_Compliance standard: [documentation-strategy.md](../../../../../docs/documentation-strategy.md)_
