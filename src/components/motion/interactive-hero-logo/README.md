# InteractiveHeroLogo

## Why it exists

A hero logo that responds to pointer position — rotating, scaling, or distorting as the
cursor moves over it — creates an immediate sense of polish on a landing page. Without a
shared component, developers manually wire `useMotionValue` and `useTransform` from
framer-motion, calculate rotation or tilt from cursor coordinates relative to the element,
and clamp the values to prevent extreme angles. That wiring is non-trivial and is
duplicated every time an interactive hero element is needed.

## Why it belongs in giselle-mui

A pointer-reactive hero element is a self-contained presentational component that any
portfolio or landing page can use. It takes a logo or graphic as content and wraps it
with the interaction layer; no app-specific state or data is involved. The interaction
model (tilt, scale, or glow response) can be parameterised so it works across different
brand identities.

## Design decisions

TBD — filled in during implementation.

## Related

- [HeroBackground](../hero-background/README.md) — background layer behind this element
- [FloatingIconCloud](../floating-icon-cloud/README.md) — ambient decorative cloud often co-located with hero logos

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `sx?: SxProps<Theme>` — forwarded to the root element

Note: content slot (e.g. `children: ReactNode`), tilt intensity, and scale-on-hover props
are to be defined during implementation.

**Visual description:** A container that renders its child (logo SVG, image, or icon) with
a 3-D tilt effect driven by the pointer's position relative to the element's bounding box.
As the cursor moves across the element, the logo tilts toward the cursor (parallax tilt).
On pointer leave, the logo springs back to its resting orientation. An optional glow or
shadow follows the cursor position to reinforce the 3-D illusion.

**Reference component substituted:** Closed-source interactive logo element used on
portfolio hero sections.

**Acceptance criteria:**
- [ ] Renders correctly with a child element
- [ ] Logo tilts in response to pointer position relative to the element bounds
- [ ] Tilt resets to 0 when the pointer leaves (spring transition)
- [ ] Tilt angle is clamped to prevent extreme or inverted rotations
- [ ] Works correctly when the component is rendered at different sizes
- [ ] `sx` prop is forwarded to the root element
- [ ] Passes existing unit test in `interactive-hero-logo.test.ts`

## Phase

Phase: `I-7` | Priority tier: `T3`

_Compliance standard: [documentation-strategy.md](../../docs/documentation-strategy.md)_
