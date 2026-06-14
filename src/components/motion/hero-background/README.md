# HeroBackground

## Why it exists

Hero sections need a full-viewport background treatment — gradient overlays, animated
particles, parallax layers, or image compositing — that sits behind the content without
interfering with it. Without a shared component, developers manually compose `position:
absolute` layers, manage z-index stacking, wire scroll-driven parallax, and re-solve
the same performance and overflow concerns on every hero section they build.

## Why it belongs in giselle-mui

A full-page decorative background is a structural element needed by any landing page,
portfolio, or marketing screen. The component manages layer stacking, containment, and
any animation that drives the background; foreground content is placed by the caller via
standard page composition. It has no opinion about typography, layout, or colour beyond
what the theme provides.

## Design decisions

TBD — filled in during implementation.

## Related

- [InteractiveHeroLogo](../interactive-hero-logo/README.md) — interactive element that often sits in the hero
- [FloatingIconCloud](../floating-icon-cloud/README.md) — decorative overlay composable with this background
- [FloatingSideNav](../floating-side-nav/README.md) — nav that overlays the full-page context this creates
- [useScrollParallax](../use-scroll-parallax/README.md) — parallax hook used by background layers

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `sx?: SxProps<Theme>` — forwarded to the root element

Note: layer configuration props (e.g. gradient stops, overlay opacity, parallax enable/
disable) are to be defined during implementation.

**Visual description:** A `position: fixed` or `position: absolute` container that fills
the viewport (or its nearest positioned ancestor). It renders one or more decorative
layers — gradient mesh, subtle noise texture, or animated blobs — behind the page
content. The component handles containment so it never causes a scrollbar or overflow
on the page. Foreground content is not rendered inside this component; it is placed
independently on top.

**Reference component substituted:** Closed-source animated hero background used on
portfolio landing and intro screens.

**Acceptance criteria:**
- [ ] Renders correctly without any required props
- [ ] Does not cause page overflow or horizontal scrollbar
- [ ] Sits behind content in z-index (does not intercept pointer events)
- [ ] Covers the full viewport (or designated container)
- [ ] `sx` prop is forwarded to the root element
- [ ] Passes existing unit test in `hero-background.test.ts`

## Phase

Phase: `I-5` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../docs/documentation-strategy.md)_
