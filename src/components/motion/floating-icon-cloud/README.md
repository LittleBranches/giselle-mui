# FloatingIconCloud

## Why it exists

Presenting a collection of icons or technology logos as a visually interesting ambient
element — where items drift, bob, or orbit to give the impression of a living cloud —
requires orchestrating multiple independent framer-motion animations with staggered
timing and randomised offsets. Without a shared component, each implementation either
hard-codes icon positions and animation values or builds a custom physics/layout engine
that is difficult to reuse.

## Why it belongs in giselle-mui

A floating icon cloud is a hero or background decoration used on landing pages,
skill showcases, and portfolio introductions in any portfolio-style app. The component
manages the animation orchestration; callers provide the icon set. It is not tied to any
specific icon library or data domain.

## Design decisions

TBD — filled in during implementation.

## Related

- [HeroBackground](../hero-background/README.md) — full-screen background that can host decorative elements
- [InteractiveHeroLogo](../interactive-hero-logo/README.md) — hero-level interactive element

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `sx?: SxProps<Theme>` — forwarded to the root element

Note: icon data props (e.g. `icons: ReactNode[]` or `items: { icon: ReactNode; label?: string }[]`) and animation configuration props are to be defined during implementation.

**Visual description:** A bounded container (typically full-width, fixed height) in which
icon elements are scattered at semi-random positions. Each icon animates with a slow,
independent floating motion — a subtle vertical bob or drift — on a looping cycle.
Items are sized consistently and spaced to avoid overlap. On hover, an individual icon
may scale up or show a tooltip label.

**Reference component substituted:** Closed-source floating technology/skills icon cloud
used on portfolio landing and hero sections.

**Acceptance criteria:**
- [ ] Renders correctly with one or more icon items
- [ ] Each icon animates with a continuous, non-synchronised floating motion
- [ ] No icons overlap under default layout
- [ ] Animation runs indefinitely without memory leak (loops correctly)
- [ ] `sx` prop is forwarded to the root element
- [ ] Passes existing unit test in `floating-icon-cloud.test.ts`

## Phase

Phase: `I-6` | Priority tier: `T3`

_Compliance standard: [documentation-strategy.md](../../docs/documentation-strategy.md)_
