# MotionContainer

## Why it exists

Wrapping children in a `motion.div` with stagger variants is a repetitive, error-prone pattern.
Consumers have to know the right framer-motion API (`initial`, `animate`, `exit`), the right
variant keys (`container()` for the wrapper, named factories for children), and the `motion.div`
vs `m.div` constraint. `MotionContainer` encodes all of that into two props: `children` and
optionally `action`/`animate` for toggle mode.

## Why it belongs here

Any site with animated section content — portfolio, landing page, dashboard — uses this
pattern. The decision to use `motion.div` (not `m.div`), the specific `container()` variant
defaults, and the toggle-mode (`action`/`animate`) prop pair are all non-trivial to get right
independently. This component saves every consumer from rediscovering them.

## Design decisions

**`motion.div` not `m.div`**

The `m.*` API requires `LazyMotion` in the consumer's component tree. Without it, icons render
as nothing and there is no error. `motion.*` works without a provider and is correct for library
components that have no control over the consumer's tree.

**`container()` variant factory**

The stagger defaults (`staggerChildren: 0.05`, `delayChildren: 0.05`) are encoded in the
`container()` factory in `variants/container/`. `MotionContainer` always uses that factory —
consumers should not pass custom `variants` directly; use child-level variant factories instead.

**`action`/`animate` toggle mode**

When `action={true}`, the wrapper's `initial` is set to `false` (disabled) and the `animate`
value switches between `'animate'` (when `animate={true}`) and `'exit'` (when `animate={false}`).
This is the correct pattern for toggle-triggered animations (e.g. a nav menu opening/closing).
Without it, consumers hand-wire the `initial`/`animate`/`exit` state themselves — and often
get the logic wrong.

## Library safety

- No personal content, no portfolio-specific strings, no hardcoded copy.
- Uses `motion.div` — not `m.div` — so no `LazyMotion` peer requirement is imposed.
- All MUI-specific props pass through via `...other` on the root `Box`.

## File structure

```
container/
  motion-container.tsx          — JSX composition
  motion-container.stories.tsx  — Storybook stories
  motion-container.test.ts      — Vitest tests
  types.ts                      — MotionContainerProps
  index.ts                      — barrel export
  README.md                     — this file
```

## Related

- `variants/container/` — `container()` variant factory used internally
- `MotionViewport` — scroll-triggered variant of this component
- `fade`, `slide`, `scale`, `bounce` — variant factories for child elements
