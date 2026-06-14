# FloatingSideNav

## Why it exists

A persistent side navigation that floats above the page content — staying fixed in the
viewport as the user scrolls — requires positioning logic, scroll-offset awareness to
show/hide at the right point, and entrance/exit animations to avoid jarring layout
shifts. Without a shared component, this is reimplemented with custom position
calculations and ad-hoc animation code on every page that needs it.

## Why it belongs in giselle-mui

Floating contextual navigation appears in long-form pages (portfolios, case studies,
documentation, dashboards) across many project types. The component handles positioning,
scroll tracking, and show/hide animation; the nav items and their behaviour are provided
by the caller. It is not coupled to any routing library or specific link structure.

## Design decisions

TBD — filled in during implementation.

## Related

- [HeroBackground](../hero-background/README.md) — full-page context this nav typically overlays
- [SectionTitleAnimated](../section-title-animated/README.md) — section headings the nav may link to

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `sx?: SxProps<Theme>` — forwarded to the root element

Note: nav item props (e.g. `items: { label: string; onClick: () => void; active?: boolean }[]`),
scroll threshold, and side (left/right) props are to be defined during implementation.

**Visual description:** A vertically-oriented pill or card fixed to one side of the
viewport, clear of the page's main content column. It contains a small set of navigation
dots or labelled links. As the user scrolls, the active link updates to reflect the
current section. The nav fades or slides in after the user scrolls past the page hero,
and fades out when returning to the top.

**Reference component substituted:** Closed-source floating section navigator used on
long portfolio and case-study pages.

**Acceptance criteria:**
- [ ] Renders correctly with one or more nav items
- [ ] Stays fixed in the viewport while scrolling
- [ ] Appears (animated) after the scroll threshold is exceeded; hides before it
- [ ] Active item is visually distinguished from inactive items
- [ ] Clicking an item triggers the provided `onClick` handler
- [ ] `sx` prop is forwarded to the root element
- [ ] Passes existing unit test in `floating-side-nav.test.ts`

## Phase

Phase: `I-3` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../docs/documentation-strategy.md)_
