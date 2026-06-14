# BreakdownExpandingView

## Why it exists

When displaying a breakdown of data across multiple categories, a common pattern is to
show a collapsed summary row per category and let the user expand one at a time to see
detail. Without a shared component, developers wire `useState` for the active item,
animate the height change with `AnimatePresence` or CSS transitions, ensure that closing
one panel while opening another does not produce a height glitch, and repeat that logic
in every screen that needs it.

## Why it belongs in giselle-mui

The expand-in-place breakdown interaction appears wherever categorised data needs
progressive disclosure — expense categories, skill groups, project phases, time blocks.
The component manages only the animation and state logic; the content rendered in each
panel is supplied by the caller. It is not tied to any specific data domain.

## Design decisions

TBD — filled in during implementation.

## Related

- [BreakdownCarouselView](../breakdown-carousel-view/README.md) — alternative carousel layout for the same breakdown data
- [BreakdownStackedView](../breakdown-stacked-view/README.md) — alternative always-visible stacked layout
- [WeeklyBreakdownPage](../weekly-breakdown-page/README.md) — page-level container that hosts breakdown views

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `sx?: SxProps<Theme>` — forwarded to the root element

Note: detailed item props (label, content, id) are to be defined during implementation based on the expand-in-place interaction model.

**Visual description:** A vertically-stacked list of section rows. Each row has a label/
header area that is always visible. Clicking the header expands the row to reveal its
detail content with a smooth height animation; clicking again collapses it. Only one row
can be expanded at a time (accordion behaviour) or multiple — the default is determined
during implementation.

**Reference component substituted:** Closed-source expanding breakdown accordion used in
budget and time-tracking detail views.

**Acceptance criteria:**
- [ ] Renders correctly with one or more breakdown items
- [ ] Clicking a row header expands its content with a smooth animated height transition
- [ ] Clicking an expanded header collapses it
- [ ] No layout jump during expand/collapse transitions
- [ ] `sx` prop is forwarded to the root element
- [ ] Passes existing unit test in `breakdown-expanding-view.test.ts`

## Phase

Phase: `I-D` | Priority tier: `T3`

_Compliance standard: [documentation-strategy.md](../../docs/documentation-strategy.md)_
