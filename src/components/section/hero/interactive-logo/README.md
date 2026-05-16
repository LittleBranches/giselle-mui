# InteractiveHeroLogo

## Why it exists

A logo element that responds to pointer position and time with three animated hover phases. The interaction is non-trivial to implement correctly with framer-motion alone because it requires:

- Frame scrub animation driven by a spring-backed motion value
- 3-D tilt and pan derived from normalised pointer position inside a `perspective` root
- A three-state phase machine (`idle → artistic → portrait`) driven by hover entry, an activation delay, and directional portrait switching

Without this component, every consumer that wants this pattern must rediscover the `useMotionTemplate` drop-shadow trick, the `useReducedMotion` integration, and the delay-based state machine.

## Why it belongs here

Any hero section across more than one project needs this exact interaction contract. The component accepts generic `children`, `artisticLogoSrc`, `portraitSrc`, and `portraitSources` — all consumer-controlled. Zero personal data lives inside the component.

## Design decisions

### Three-layer z-index stack

- `z-index 1` — `OriginalLogoLayer`: the base logo (children or frame animation)
- `z-index 2` — `ArtisticLogoLayer`: an alternate artistic overlay (e.g. watercolour variant)
- `z-index 3` — `PortraitLayer`: a directional portrait image scaled to bleed beyond the element boundary

Each layer is a dedicated sub-component so opacity and blur transitions can be controlled independently.

### `motion.div` not `m.div`

This library always uses `motion.*` — never `m.*`. The `m.*` API requires `LazyMotion` in the consumer tree; `motion.*` works standalone. Consumers of this library should not need to know about `LazyMotion`.

### `'use client'` boundary required

`InteractiveHeroLogo` uses React state, refs, effects, and framer-motion — all client-only APIs. It must always be rendered inside a `'use client'` boundary in Next.js App Router (or any RSC environment).

**Always import from the `/motion` subpath:**

```ts
import { InteractiveHeroLogo } from '@alexrebula/giselle-mui/motion';
```

The `/motion` entry carries `'use client'` at the bundle boundary, so the component and all its sub-components are treated as client modules automatically. Importing from the root `@alexrebula/giselle-mui` entry in an RSC tree will cause a runtime error.

### `useImagePreloader` call site

Portrait images are preloaded via `react-dom` `preload()` hints during render so the browser begins fetching all portrait variants before the first direction change. This prevents the flicker on initial portrait phase entry.

### `useReducedMotion` integration

When `prefers-reduced-motion` is active:

- All spring physics are bypassed (motion values are set directly, not via springs)
- Portrait activation delay is `0` — portrait appears immediately on hover
- Cursor shows `'default'` rather than `'grab'`/`'grabbing'`

### `portraitSources` directional map

`portraitSources` is a flat array of `{ direction, src }` pairs. The component builds a lookup map internally via `buildPortraitSourceMap`. The `src` value can be a string or an array — when an array, a random element is selected on each direction change, giving natural variation.

## File structure

```
interactive-logo/
  interactive-logo.tsx           — main component (pure JSX composition)
  interactive-logo.const.ts      — DEFAULT_PORTRAIT_DIRECTION, PORTRAIT_ACTIVATION_DELAY_MS
  interactive-logo.styles.ts     — all sx constants and factories
  interactive-logo.styles.test.ts — mock-theme assertions
  interactive-logo.utils.ts      — getRandomPortraitSrc, getPortraitDirectionFromAngle, buildPortraitSourceMap, getCursorStyle
  interactive-logo.test.ts       — Vitest tests for utils + sub-components
  interactive-logo.stories.tsx   — Storybook stories (all three phases)
  types.ts                       — all TypeScript types
  use-hover-phase-transition.ts  — phase state machine hook
  portrait-layer.tsx             — Layer 3: directional portrait
  artistic-logo-layer.tsx        — Layer 2: artistic logo overlay
  original-logo-layer.tsx        — Layer 1: original logo / frame animation
  index.ts                       — barrel export
  README.md                      — this file
```

## Related

- `HeroButtonsRow` — `src/components/hero/buttons-row/` — animated button row for hero sections
- `MotionViewport` — `src/components/motion/viewport/` — scroll-triggered entrance for sections
- Motion variant families — `src/components/motion/variants/` — fade, slide, bounce, etc.
