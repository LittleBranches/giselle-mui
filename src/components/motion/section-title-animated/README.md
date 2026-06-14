# SectionTitleAnimated

## Why it exists

Section headings that animate into view as the user scrolls to them are a standard
technique for adding polish to long-form pages. Without a shared component, developers
manually wrap each heading in a `MotionViewport` or `AnimatePresence`, select entrance
variants, choose timing, and apply consistent typographic styling — duplicating that
setup for every section heading across every page that uses this pattern.

## Why it belongs in giselle-mui

Animated section titles appear on any multi-section page: portfolios, landing pages,
dashboards, and case studies. The component encapsulates the scroll-triggered entrance
animation and opinionated typography so that all section headings across a project
behave identically with a single import. It accepts a text string (or children) and an
optional sub-label; it does not depend on any app-specific data.

## Design decisions

TBD — filled in during implementation.

## Related

- [MotionViewport](../viewport/README.md) — scroll-trigger container used internally
- [FloatingSideNav](../floating-side-nav/README.md) — nav that may link to sections marked by this component
- [HeroBackground](../hero-background/README.md) — full-page context in which section titles often appear

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `sx?: SxProps<Theme>` — forwarded to the root element

Note: text content props (e.g. `title: string`, `subtitle?: string`, `variant?: TypographyVariant`)
and animation direction are to be defined during implementation.

**Visual description:** A heading element (rendered as an `h2` or configurable heading
level) that is invisible on first render. When it scrolls into the viewport, the heading
fades and translates upward into its final position using the library's standard
`fade('inUp')` variant. An optional subtitle line appears beneath the heading with a
slight delay. The animation fires once per page load (not on every scroll in/out).

**Reference component substituted:** Closed-source animated section heading used on
portfolio and case-study long-form pages.

**Acceptance criteria:**
- [ ] Renders correctly with a title string
- [ ] Heading is not visible before it enters the viewport
- [ ] Entrance animation fires when the element scrolls into view
- [ ] Animation fires only once (not on re-entry)
- [ ] Optional subtitle renders with appropriate delay after the title
- [ ] `sx` prop is forwarded to the root element
- [ ] Passes existing unit test in `section-title-animated.test.ts`

## Phase

Phase: `I-2` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../docs/documentation-strategy.md)_
