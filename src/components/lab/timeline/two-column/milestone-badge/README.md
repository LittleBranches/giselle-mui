# MilestoneBadge

## Why it exists

Timelines often have point-in-time achievements — releases, sign-offs, handovers — that are distinct from ongoing phases. Without a dedicated component, developers reach for a generic card and manually wire up expand/collapse, a "New" indicator, per-task toggle state, and left/right column mirroring. The result is fragile, inconsistently styled, and repeated across every timeline view. `MilestoneBadge` encapsulates that behaviour: a compact, expandable card that anchors to the spine, collapses to a glanceable short title, expands on click to reveal structured task children, and supports an optional "viewed" eye button — all in a single controlled component.

## Why it belongs in giselle-mui

Milestone-style markers appear in every project timeline view — roadmaps, delivery plans, progress dashboards. The expand/collapse accordion contract (at most one open per phase), the left/right spine mirroring, the "New" badge, and the task-toggle interaction are all generic behaviours that any project using the `TimelineTwoColumn` layout can reuse without modification.

## Design decisions

- **Externally controlled expansion.** `isExpanded` + `onRequestExpand` follow a controlled pattern so the parent (`TimelineTwoColumn`) can enforce an accordion constraint (at most one badge open at a time) without the badge holding global state.
- **Three-level title disclosure.** Collapsed with no hover shows `shortTitle` (glanceable); hovering shows the full title (preview); expanded shows full title and optional description. This was deliberately unhooked from `ResizeObserver` to avoid layout shifts on hover.
- **Backwards-compatible task children.** `m.children` (structured `Task[]`) takes precedence; if absent, `m.details` (legacy flat `string[]`) is shimmed to `{ title }` objects. This allows old data shapes to render without a migration.
- **Left-column right-alignment.** When `columnSide === 'left'` and the badge is collapsed, content right-aligns so text sits flush against the centre spine. Alignment resets to left-aligned when expanded.
- **`suppressElevation` prop.** Consumers can flatten the Paper shadow when the badge is embedded in a layout that already provides visual depth (e.g. inside a drawer).

Stories: [Lab/Timeline/Two Column/Milestone Badge](../milestone-badge.stories.tsx)

## Related

- [PhaseCard](../phase-card/README.md) — expandable card for full timeline phases; shares the three-level title disclosure pattern
- [TimelineDot](../timeline-dot/README.md) — the dot circle placed at the spine end of each milestone row
- [SpineConnector](../spine-connector/README.md) — the vertical bar connecting dots between rows
- [TimelineTwoColumn](../README.md) — parent layout that owns z-index, blur animations, and accordion state

---

_Compliance standard: [documentation-strategy.md](../../../../../docs/documentation-strategy.md)_
