# BreakdownCarouselView

## Why it exists

Presenting a set of named content panels as a horizontally-navigable carousel requires
manually managing active slide state, animating the panel transitions, hiding inactive
panels from the layout, and building label-based navigation to jump between slides. Without
this component, every carousel in an app reimplements that logic from scratch with
inconsistent timing and interaction behaviour.

## Why it belongs in giselle-mui

Any dashboard or data-rich interface needs to present multiple breakdown views of the same
dataset — charts, tables, summaries — without showing them all at once. The carousel
abstraction (label navigation + animated slide transitions) is layout-agnostic; the
`content: ReactNode` slot means callers supply whatever they want per slide. This works for
financial data, project timelines, skill lists, or any other categorised content.

## Design decisions

TBD — filled in during implementation.

## Related

- [BreakdownExpandingView](../breakdown-expanding-view/README.md) — alternative view that expands in place
- [BreakdownStackedView](../breakdown-stacked-view/README.md) — alternative view that stacks panels vertically
- [WeeklyBreakdownPage](../weekly-breakdown-page/README.md) — page-level component that composes breakdown views
- [AnimatedTabPanel](../animated-tab-panel/README.md) — lower-level animated panel primitive

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `slides: BreakdownCarouselSlide[]` — ordered array of slides; each has `id: string`, `label: string`, `content: ReactNode`
- `defaultActiveId?: string` — initially active slide id; defaults to the first slide
- `sx?: SxProps<Theme>` — forwarded to the root `Box` (via `BoxProps`)

**Visual description:** A full-width container with a row of label chips or tabs across the
top. Clicking a label animates the content area: the current panel exits (slide or fade)
and the selected panel enters. Only one panel is visible at a time. The label row stays
fixed above the animated content area.

**Reference component substituted:** Closed-source carousel breakdown widget used in
weekly summary pages.

**Acceptance criteria:**
- [ ] Renders correctly with a minimum of one slide
- [ ] Clicking a label activates the corresponding slide with an animated transition
- [ ] `defaultActiveId` selects the correct initial slide; falls back to first slide if omitted or unmatched
- [ ] Active label is visually distinguished from inactive labels
- [ ] `content: ReactNode` slot renders arbitrary children without constraint
- [ ] `sx` prop is forwarded to the root element
- [ ] Passes existing unit test in `breakdown-carousel-view.test.ts`

## Phase

Phase: `I-D` | Priority tier: `T3`

_Compliance standard: [documentation-strategy.md](../../docs/documentation-strategy.md)_
