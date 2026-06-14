# SpineConnector

## Why it exists

The vertical centre spine of a two-column timeline is not a single element — it is assembled from discrete connector bars that grow to fill the space between consecutive row dots. Each bar must match the colour of its adjacent dot, use a CSS variable-based opacity tint (not a hardcoded hex), and optionally float a year-chip label when a calendar-year boundary falls in the gap. Without a shared component this bar is hand-rolled in each phase row, leading to inconsistent colour resolution and missing year labels.

## Why it belongs in giselle-mui

The spine connector pattern is structural to any timeline that uses the two-column layout. The colour channel resolution logic (`theme.vars.palette[dotColor].mainChannel`) and the year-chip overlay are generic and apply to every project that renders a `TimelineTwoColumn` layout.

## Design decisions

- **`flexGrow: 1` sizing.** The connector bar grows to fill all available vertical space in its grid cell rather than taking a fixed height. This means the spacing between rows is driven entirely by the row content, not by the connector.
- **CSS variable colour with opacity.** The bar background uses `rgba(<mainChannel> / 0.3)` rather than a hardcoded colour. This integrates with MUI's CSS variables theme (`theme.vars`) and respects dark/light mode automatically. Falls back to `grey[500]` if the palette key is absent.
- **Year label as an overlay, not a row.** The `yearMilestone` chip floats absolutely inside the bar (via `yearLabelSx`) rather than occupying its own grid row, keeping the grid structure uniform.
- **`yearLabelMarginBottom` prop.** Allows the parent to nudge the year chip vertically within the connector to avoid overlap with the adjacent dot.

## Related

- [TimelineDot](../timeline-dot/README.md) — the dot placed at the top/bottom ends of each connector
- [PhaseCard](../phase-card/README.md) — the card that sits alongside each connector segment
- [MilestoneBadge](../milestone-badge/README.md) — the milestone card that shares the same spine
- [TimelineTwoColumn](../README.md) — parent layout that assembles dots and connectors into a grid

---

_Compliance standard: [documentation-strategy.md](../../../../../docs/documentation-strategy.md)_
