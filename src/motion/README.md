# Motion Primitives

Framer-motion variant factories, interaction helpers, and wrapper components for the
`@alexrebula/giselle-mui` `/motion` subpath.

**Import path:** `@alexrebula/giselle-mui/motion`

---

## Why it exists

Animating with framer-motion correctly requires the same boilerplate on every project:
consistent enter/exit timing, stagger containers, scroll-triggered viewports, and
interaction callbacks. These factories encode sensible defaults so consumers write
`fade('inUp')` instead of a 10-line `Variants` object.

## Why it belongs here

Every section page in a portfolio needs entrance animations. The same `container()` /
`fade()` / `slide()` pattern repeats across every project that uses framer-motion with MUI.
A shared, tested, named set removes ambiguity and prevents drift.

---

## The `motion.*` vs `m.*` rule — non-negotiable

**Always use `motion.div`, `motion.span`, etc. Never use `m.div`.**

The `m.*` API is framer-motion's tree-shaken surface that requires a `<LazyMotion>` provider
in every consumer's component tree. Without it, `m.div` throws at runtime. Since this library
cannot control what providers are in the consumer's tree, using `m.*` creates an invisible
hard dependency.

`motion.*` works without any provider and is always safe.

---

## Variant factories

All factories return a framer-motion `Variants` object with `initial`, `animate`, and
(where applicable) `exit` keys.

### `fade(direction, options?)`

Fade with optional translation. 10 directions.

```ts
import { fade } from '@alexrebula/giselle-mui/motion';

const variants = fade('inUp', { distance: 24 });
// → { initial: { y: 24, opacity: 0 }, animate: { ... }, exit: { ... } }
```

**Directions:** `'in' | 'inUp' | 'inDown' | 'inLeft' | 'inRight' | 'out' | 'outUp' | 'outDown' | 'outLeft' | 'outRight'`

**Options:** `{ distance?: number (default 120), transitionIn?, transitionOut? }`

---

### `slide(direction, options?)`

Pure positional slide (no opacity). 8 directions.

```ts
import { slide } from '@alexrebula/giselle-mui/motion';
const variants = slide('inLeft', { distance: 80 });
```

**Directions:** `'inUp' | 'inDown' | 'inLeft' | 'inRight' | 'outUp' | 'outDown' | 'outLeft' | 'outRight'`

---

### `scale(direction, options?)`

Scale + opacity. 6 directions (`'in' | 'inX' | 'inY' | 'out' | 'outX' | 'outY'`).

---

### `bounce(direction, options?)`

Keyframe-based bounce. 10 directions. Uses arrays for `y`/`scale` to produce the
overshoot-and-settle feel without spring physics.

---

### `rotate(direction, options?)`

Rotation + opacity. 2 directions (`'in' | 'out'`). Default 360°.

---

### `flip(direction, options?)`

3-D flip via `rotateX` / `rotateY`. 4 directions (`'inX' | 'inY' | 'outX' | 'outY'`).

---

### `zoom(direction, options?)`

Scale + translation. 10 directions. Default distance 720 px (dramatic entrance effect).

---

### `container(options?)`

Stagger container `Variants`. Children animate with 50 ms stagger. Used by `MotionContainer`
and `MotionViewport`.

```ts
import { container } from '@alexrebula/giselle-mui/motion';
const variants = container();
// → { animate: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } }, exit: { ... } }
```

---

## Transition defaults

```ts
import { transitionEnter, transitionExit } from '@alexrebula/giselle-mui/motion';
```

- `transitionEnter(overrides?)` — `duration: 0.64`, custom ease curve
- `transitionExit(overrides?)` — `duration: 0.48`, same ease curve

Both accept a partial `Transition` object to override any key.

---

## Interaction helpers

```ts
import { hover, tap, transitionHover, transitionTap } from '@alexrebula/giselle-mui/motion';

<motion.div
  whileHover={hover()}        // → { scale: 1.09 }
  whileTap={tap()}            // → { scale: 0.9 }
  transition={transitionHover()}
/>
```

- `hover(value?)` — default scale `1.09`
- `tap(value?)` — default scale `0.9`
- `transitionHover(overrides?)` — `duration: 0.32`, custom ease
- `transitionTap(overrides?)` — spring, `stiffness: 400`, `damping: 18`

---

## Components

### `<MotionContainer>`

Wraps children in a `motion.div` with `container()` stagger variants.

```tsx
import { MotionContainer, fade } from '@alexrebula/giselle-mui/motion';
import { motion } from 'framer-motion';

<MotionContainer>
  <motion.div variants={fade('inUp')}>Item 1</motion.div>
  <motion.div variants={fade('inUp')}>Item 2</motion.div>
</MotionContainer>;
```

**Props:**

- `action?: boolean` — when `true`, use `animate` prop to toggle states manually
- `animate?: boolean` — effective only when `action={true}`; `true` → `'animate'`, `false` → `'exit'`
- All other `BoxProps` (minus `animate`) and framer-motion `MotionProps`

---

### `<MotionViewport>`

Scroll-triggered stagger container. Fires `container()` variants when the element enters
the viewport. Automatically disabled on `sm` and below by default.

```tsx
import { MotionViewport, fade } from '@alexrebula/giselle-mui/motion';
import { motion } from 'framer-motion';

<MotionViewport>
  <motion.div variants={fade('inUp')}>Title</motion.div>
  <motion.div variants={fade('inUp')}>Body</motion.div>
</MotionViewport>;
```

**Props:**

- `disableAnimateOnMobile?: boolean` — default `true`; disables animation on `sm` and below
- `viewport?` — forwarded to framer-motion's `viewport` option (default: `{ once: true, amount: 0.3 }`)
- All other `BoxProps`

---

## `useScrollParallax`

5-layer scroll-driven parallax hook.

```ts
import { useScrollParallax } from '@alexrebula/giselle-mui/motion';

const { ref, layers } = useScrollParallax();
// layers[0] travels ±40px, layers[1] ±80px, ..., layers[4] ±200px
```

Attach `ref` to the scroll container and use `layers[i]` as a `MotionValue` for `style.y`.

---

## File structure

```
src/components/motion/
  transition.ts              — transitionEnter, transitionExit
  fade.ts                    — fade()
  container.ts               — container()
  slide.ts                   — slide()
  scale.ts                   — scale()
  bounce.ts                  — bounce()
  rotate.ts                  — rotate()
  flip.ts                    — flip()
  zoom.ts                    — zoom()
  actions.ts                 — hover, tap, transitionHover, transitionTap
  motion-container.tsx       — MotionContainer
  motion-viewport.tsx        — MotionViewport
  use-scroll-parallax.ts     — useScrollParallax
  motion.test.ts             — unit tests for all factories + helpers
  motion-container.stories.tsx  — Storybook stories
  README.md                  — this file
```
