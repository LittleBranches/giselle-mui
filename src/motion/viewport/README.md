# MotionViewport

## Why it exists

Scroll-triggered entrance animations require the same boilerplate as `MotionContainer` plus
three more decisions: the `whileInView` trigger, the `viewport` options (`once: true`,
`amount: 0.3`), and whether to disable animations on mobile (where off-screen content
appearing suddenly is jarring on small viewports). `MotionViewport` encodes all of that.

## Why it belongs here

Any page section that animates in as the user scrolls uses this pattern. The `once: true` /
`amount: 0.3` viewport defaults are the result of iteration — too low an amount fires too
early, triggering on items already visible at page load. Getting this wrong is invisible in
development (viewport is usually the full page) and obvious in production. Encoding it here
means no consumer makes that mistake twice.

## Design decisions

**`whileInView` with `{ once: true, amount: 0.3 }`**

`once: true` prevents the animation re-firing when the user scrolls back up — repeated entrance
animations are distracting. `amount: 0.3` fires when 30% of the element is in view, which
avoids triggering on partial glimpses at the fold.

**Mobile disable via `disableAnimateOnMobile`**

On small viewports, most of the page content is below the fold and enters on the first render.
Staggered entrance animations on mobile often result in a page that looks broken on load — the
top content is visible, the bottom content fades in at 0.05s intervals, and the user sees a
half-rendered page. `disableAnimateOnMobile={true}` (the default) disables the stagger on `sm`
and below, letting the content render immediately.

**`motion.div` not `m.div`**

Same rule as `MotionContainer` — `motion.*` works without a `LazyMotion` provider. Library
components must not impose invisible provider requirements on the consumer's tree.

## Library safety

- No personal content, no portfolio-specific strings, no hardcoded copy.
- The `sm` breakpoint check uses `useMediaQuery` from `@mui/material` — no custom breakpoint
  values are hardcoded.
- All MUI-specific props pass through via `...other`.

## File structure

```
viewport/
  motion-viewport.tsx           — JSX composition
  motion-viewport.test.ts       — Vitest tests
  types.ts                      — MotionViewportProps
  index.ts                      — barrel export
  README.md                     — this file
```

## Related

- `variants/container/` — `container()` variant factory used internally
- `MotionContainer` — same pattern for non-scroll-triggered (load-triggered) animations
- `fade`, `slide`, `scale`, `bounce` — variant factories for child elements
