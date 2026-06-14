# SpineConnector

## Why it exists

The two-column timeline layout requires a continuous vertical bar between consecutive phase dots
to read as a connected sequence rather than a list of isolated cards. Without a shared component,
every project must reimplement the colour derivation from the MUI palette, the flexible height
fill between rows, and the year-boundary chip overlay. Each reimplementation diverges in subtle
ways — wrong opacity, clipped chips, hardcoded colours that break in dark mode.

## Why it belongs in giselle-mui

Spine connectors are a structural primitive in any vertical timeline — roadmaps, changelogs,
career histories, release notes. The component accepts a `dotColor` palette key and derives
the bar colour as a 30% tint of the palette channel using MUI CSS variables (`theme.vars`),
which means it responds correctly to light/dark theme switching with no extra logic at the
call site.

## Design decisions

**Tint via CSS vars.** The background colour is expressed as
`rgba(<palette>.mainChannel / 0.3)` using `theme.vars`, not a hardcoded hex. This keeps the
connector semantically linked to the adjacent `TimelineDot` colour and ensures the tint updates
automatically when the theme or colour scheme changes.

**`flexGrow: 1` height.** The connector is a `Box` with `flexGrow: 1` and `minHeight: 24` rather
than a fixed pixel height. The parent grid row dictates the gap; the connector fills it entirely.
No height calculations are pushed to the consumer.

**Year chip.** When `yearMilestone` is provided, a floating caption label is rendered at the
bottom of the line via absolute positioning (`yearLabelMarginBottom` controls the offset from
the bottom). The label signals a year boundary to the reader without breaking the connector shape.

**No stories file.** The component is a structural primitive consumed exclusively by
`TimelineTwoColumn`. Visual coverage is provided by the parent timeline stories.

## Related

- [TimelineDot](../timeline-dot/README.md) — the dot rendered at each end of a spine connector
- [PhaseCard](../phase-card/README.md) — the card whose row height determines connector length
- [MilestoneBadge](../milestone-badge/README.md) — milestone cards also anchor to spine dots

---

_Compliance standard: [documentation-strategy.md](../../../../../docs/documentation-strategy.md)_
