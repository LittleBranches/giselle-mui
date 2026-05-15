# ScrollParallaxHero

Full-viewport hero section with depth-layered scroll parallax.

## Why it exists

A hero with convincing scroll parallax requires coordinating three things:

1. **Scroll frame mechanics** — the outer section scrolls while an inner panel stays fixed.
2. **Spring-physics y-offsets** — each layer moves at a different speed with `useSpring` settling.
3. **Opacity fade** — the whole hero fades out as it scrolls off-screen.

Getting all three right without this component means re-implementing the same scroll
measurement, hook wiring, and physics constants in every portfolio page. `ScrollParallaxHero`
encapsulates the mechanics so the consumer only provides content slots.

## Why it belongs in giselle-mui

Any section page with a hero — portfolio, product landing, case study — shares the same
scroll-parallax pattern. The implementation is generic: slots accept any `ReactNode`, the
parallax multipliers are configurable, and the physics constants are deliberately exposed
(via `useTransformY`) for consumers who need custom layers.

## Design decisions

### Pure slot props

The component owns the scroll frame, not the content. Every visible element is a slot prop
(`logo`, `heading`, `text`, `actions`, `icons`, `background`). This makes the component
reusable across projects without coupling it to any specific logo, heading style, or icon set.

### Spring physics constants

`mass=0.1, damping=20, stiffness=300, restDelta=0.001` — these produce a snappy,
low-latency feel that settles within ~300ms. The `restDelta` prevents micro-oscillation
artifacts. Exposed via `useTransformY` so consumers can use the same physics on custom layers.

### Parallax disabled on mobile

On `< md` breakpoints, `distance = 0` so all `useTransformY` calls return a static 0.
The opacity fade is also disabled. This is intentional — mobile devices have lower GPU
performance and the parallax effect is less noticeable on small screens.

### Stagger parent

The `motion.div initial="initial" animate="animate"` above the Container acts as a
framer-motion stagger parent. All descendant `motion.*` elements with `variants` inherit
the `initial` and `animate` state via React Context — including slot children provided
by the consumer (e.g., `AnimatedHeroHeading` uses `variants: fade('inUp', { distance: 24 })`).

### Opacity and `position: fixed`

CSS `opacity` does **not** establish a new stacking context or affect `position: fixed`
descendants. The outer `motion.div style={{ opacity }}` safely fades the entire hero without
disrupting the inner `Box sx={{ position: 'fixed' }}` layout.

### Header offset via `sx`

Custom layout variables (for example, a sticky header height token) are not referenced
here. Apply them via the `sx` prop:

```tsx
<ScrollParallaxHero
  sx={{ mt: 'calc(var(--your-header-height) * -1)' }}
  ...
/>
```

## File structure

```
scroll-parallax/
  scroll-parallax-hero.tsx            — pure JSX composition (slots + parallax wiring)
  animated-hero-heading.tsx           — sub-component: animated h1 with gradient highlight span
  use-scroll-percent.ts               — hook: tracks scroll position as 0–100 percent
  use-transform-y.ts                  — hook: spring-physics y-offset from scroll MotionValue
  scroll-parallax-hero.animations.ts  — framer-motion Variants and Transition constants
  scroll-parallax-hero.styles.ts      — all sx constants and factories
  scroll-parallax-hero.styles.test.ts — mock-theme assertions for every factory
  scroll-parallax-hero.test.ts        — Vitest unit tests (slots, AnimatedHeroHeading, useScrollPercent)
  scroll-parallax-hero.stories.tsx    — Storybook: Default, HeadingOnly, LogoSlot, CustomParallax, NoParallax
  types.ts                            — ScrollParallaxHeroProps, AnimatedHeroHeadingProps, UseScrollPercentResult, ParallaxMultipliers
  index.ts                            — barrel export
  README.md                           — this file
```

## Library safety

This component is exported from the `/motion` subpath (`@alexrebula/giselle-mui/motion`),
not the main bundle. Consumers who do not import from `/motion` pay zero bytes for
framer-motion.

- **No hardcoded content.** All visible text comes from slot props — zero strings are
  defined inside the component.
- **No personal data.** Stories, tests, and JSDoc examples use generic placeholders only
  (`highlight="Platform Team"`, `subheading="The work of"`).
- **Only allowed dependencies.** `framer-motion` and `@mui/material` — both declared as
  peer dependencies and marked external in `tsup.config.ts`.

## Quality status

**May 2026** — shipped and tested.

- `npm run check:verify` ✅
- Vitest unit tests: slots, `AnimatedHeroHeading`, `useScrollPercent` ✅
- `*.styles.test.ts` covers every exported sx factory ✅
- SonarQube: zero violations ✅
- Storybook: Default, HeadingOnly, LogoSlot, CustomParallax, NoParallax ✅

## Related

- [`interactive-logo/`](../interactive-logo/README.md) — `InteractiveHeroLogo`: hover-phase portrait reveal for the `logo` slot
- [`buttons-row/`](../buttons-row/README.md) — `HeroButtonsRow`: animated button row for the `actions` slot
- [`motion/variants/fade/`](../../motion/variants/fade/) — `fade()` factory used by `AnimatedHeroHeading`
