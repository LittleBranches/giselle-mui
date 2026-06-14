# HorizontalScrollRail

## Why it exists

Displaying a row of cards or items that overflows the viewport horizontally — with
smooth drag-to-scroll or button-driven scroll — requires handling `overflow-x`, hiding
the scrollbar aesthetically, optionally enabling framer-motion drag, and rendering
left/right navigation controls that disable themselves at the scroll boundaries. That
setup is verbose and is reimplemented on every screen that needs a horizontal list.

## Why it belongs in giselle-mui

Horizontal scroll rails appear in any interface with a list of cards, tags, periods,
media items, or selectable options that would otherwise wrap uncomfortably on mobile.
The component owns the scroll container, drag binding, and navigation controls; callers
render the items inside it via `children`. It is not tied to any specific card or item
type.

## Design decisions

TBD — filled in during implementation.

## Related

- [ExpandingPeriodStrip](../expanding-period-strip/README.md) — uses horizontal scroll for period navigation
- [BreakdownCarouselView](../breakdown-carousel-view/README.md) — carousel that may build on this primitive

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `sx?: SxProps<Theme>` — forwarded to the root element

Note: scroll behaviour props (e.g. `showArrows?: boolean`, `dragEnabled?: boolean`,
`gap?: number`) are to be defined during implementation.

**Visual description:** A full-width container with `overflow-x: auto` and a hidden
scrollbar. Children are laid out in a horizontal row with a configurable gap. Optional
left and right arrow buttons appear at the edges; each scrolls the rail by a fixed
amount and is disabled when the rail is already at that boundary. On touch and pointer
devices, the rail supports drag-to-scroll via framer-motion's `drag="x"`.

**Reference component substituted:** Closed-source horizontal scroll container used in
card lists and tag selectors.

**Acceptance criteria:**
- [ ] Renders children in a horizontal scrollable row
- [ ] Scrollbar is hidden on all browsers
- [ ] Arrow navigation scrolls by a reasonable fixed amount and disables at boundaries
- [ ] Drag-to-scroll works on pointer devices without interfering with child click events
- [ ] `sx` prop is forwarded to the root element
- [ ] Passes existing unit test in `horizontal-scroll-rail.test.ts`

## Phase

Phase: `I-C` | Priority tier: `T3`

_Compliance standard: [documentation-strategy.md](../../docs/documentation-strategy.md)_
