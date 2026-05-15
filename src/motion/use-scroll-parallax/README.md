# useScrollParallax

## Why it exists

Implementing a scroll-driven parallax effect with framer-motion requires combining `useScroll`,
`useTransform`, and `useSpring` — five separate hook calls with specific configurations for
spring physics and transform ranges. The spring constants (`mass`, `damping`, `stiffness`) and
the layer multipliers (±40px → ±200px) are the result of iteration. Getting them wrong produces
either no visible effect or nauseating over-motion. `useScrollParallax` encodes the tuned values
so no consumer re-discovers them.

## Why it belongs here

Any hero section, background illustration, or depth-layered layout component uses this pattern.
The five fixed hook calls (one per layer) are a deliberate rules-of-hooks constraint — the count
must never change at runtime, so it is hardcoded to 5. This decision is non-obvious; a consumer
trying to make it dynamic would violate the rules of hooks. Encoding it here surfaces that
constraint explicitly.

## Design decisions

**Fixed 5 layers**

React's rules of hooks prohibit calling hooks conditionally or inside loops. The `useTransform`
and `useSpring` calls must happen the same number of times on every render. The count is fixed at
5 (layers `[0]` through `[4]`), matching the `LAYER_MULTIPLIERS` constant array. Consumers who
want fewer layers simply ignore the layers they don't need.

**Spring physics encoded as constants**

The spring configuration (`mass: 0.1, damping: 20, stiffness: 300`) produces smooth, slightly
floaty motion that reads well at typical scroll speeds. These values are exported as named
constants from `use-scroll-parallax.const.ts` so they are readable, testable by value, and
grep-findable if ever changed.

**`offset: ['start end', 'end start']`**

Tracks from when the element enters the viewport bottom to when it exits the viewport top — the
full scroll range of the element. This gives the maximum parallax travel distance without the
effect starting mid-animation.

**`ref` as part of the return value**

The hook returns `{ ref, layers }` so the consumer attaches the ref to the scroll target without
needing to manage it separately. The scroll target is the element containing the parallax layers,
not the window.

## Library safety

- No personal content, no portfolio-specific strings.
- All spring constants and multipliers are exported as named constants and covered by regression
  tests in `use-scroll-parallax.test.ts`.
- `'use client'` directive is required because `useScroll` and `useSpring` are framer-motion
  hooks; they must run in a browser context.

## File structure

```
use-scroll-parallax/
  use-scroll-parallax.ts        — hook implementation
  use-scroll-parallax.const.ts  — LAYER_MULTIPLIERS, spring constants
  use-scroll-parallax.test.ts   — Vitest tests
  types.ts                      — UseScrollParallaxResult
  index.ts                      — barrel export
  README.md                     — this file
```

## Related

- `MotionViewport` — scroll-triggered entrance animations (viewport-based, not scroll-position-based)
- `MotionContainer` — load-triggered stagger animations
