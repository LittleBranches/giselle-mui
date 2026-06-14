# BreakdownStackedView

## Why it exists

When all breakdown categories need to be visible simultaneously — for scanning and
comparison rather than drill-down — a stacked layout is more appropriate than a carousel
or accordion. Without a shared component, developers recreate the stacked panel layout,
entrance animation sequencing, and consistent spacing manually every time a summary
screen needs this pattern.

## Why it belongs in giselle-mui

Stacked summary panels appear on any overview or recap screen: weekly summaries,
budget breakdowns, skills inventories, portfolio highlights. The component handles
layout, stagger entrance animations, and consistent spacing; callers provide the panel
content. It is not tied to any specific data model.

## Design decisions

TBD — filled in during implementation.

## Related

- [BreakdownCarouselView](../breakdown-carousel-view/README.md) — carousel alternative that shows one panel at a time
- [BreakdownExpandingView](../breakdown-expanding-view/README.md) — accordion alternative for progressive disclosure
- [WeeklyBreakdownPage](../weekly-breakdown-page/README.md) — page-level container that hosts breakdown views
- [MotionViewport](../viewport/README.md) — scroll-triggered stagger container used by stack entrance

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `sx?: SxProps<Theme>` — forwarded to the root element

Note: panel item props (content, label) are to be defined during implementation.

**Visual description:** A vertically-stacked column of panels, each rendered at full
width. On mount (or scroll-into-view), the panels enter with a stagger: each one fades
up slightly after the previous. All panels are visible simultaneously with no interactive
expand/collapse. Intended as the "everything at a glance" view of a breakdown dataset.

**Reference component substituted:** Closed-source stacked summary view used in weekly
recap and reporting screens.

**Acceptance criteria:**
- [ ] Renders correctly with one or more panel items
- [ ] Panels enter with a staggered fade/slide animation on mount
- [ ] All panels are visible simultaneously — no hidden or collapsed content
- [ ] `sx` prop is forwarded to the root element
- [ ] Passes existing unit test in `breakdown-stacked-view.test.ts`

## Phase

Phase: `I-D` | Priority tier: `T3`

_Compliance standard: [documentation-strategy.md](../../docs/documentation-strategy.md)_
