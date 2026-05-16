# FloatingSubNav

## Why it exists

A floating pill of icon-only navigation buttons is a recurring pattern in portfolio and product
pages: a compact secondary nav that stays visible while the user scrolls through a long section.
Getting the positioning right — fixed-to-viewport vs. sticky-to-container, `height: 0` anchor
trick, `pointer-events` restoration — is non-trivial. `FloatingSubNav` encodes those decisions
once.

## Why it belongs here

Any project that uses section-based layouts needs a way to expose in-page navigation without
taking up layout space. The positioning logic (`translateY(-100%)` sticky anchor, fixed centring)
is reusable and would otherwise be rediscovered — incorrectly — in every consumer app.

## Design decisions

- **`sticky={false}` default → `position: fixed`** — the most common case is a global nav
  that stays at the bottom of the viewport regardless of where the user is on the page.
- **`sticky={true}` → `position: sticky` with zero-height anchor** — the outer Box has
  `height: 0; overflow: visible` so it occupies no layout space. The inner Box uses
  `translateY(-100%)` to float the pill above the anchor point. This is the only CSS technique
  that achieves sticky-to-container without a dedicated spacer element.
- **`activeId={null}` hides the nav** — the parent is the single source of truth for visibility.
  The component does not maintain its own show/hide state; it animates out via `AnimatePresence`.
- **Icon slot is `ReactNode`** — the component never imports an icon library. Consumers choose
  their own icon set and pass rendered nodes.
- **`framer-motion` subpath** — `FloatingSubNav` is exported from `src/motion-index.ts`
  (the `/motion` subpath entry) because it depends on `AnimatePresence`. It is not in the main
  bundle so consumers who don't use framer-motion do not pay for it.

## Touch target

Button sizes (`SUB_NAV_BUTTON_SIZE`) are exported as named constants and exceed the WCAG 2.2 AA
minimum touch target (24 px) at all breakpoints (xs: 36 px → lg: 44 px). Regression tests in
`floating-sub-nav.styles.test.ts` verify this.

## Library safety

- Zero personal data. No proprietary imports.
- `framer-motion` is used only here — contained in the `/motion` subpath entry.
- Icon slot is `ReactNode` — no icon library bundled.

## File structure

```
floating-sub-nav/
  floating-sub-nav.tsx              — composition
  floating-sub-nav.const.ts         — SUB_NAV_BUTTON_SIZE, SUB_NAV_BUTTON_MIN_SIZE, PILL_BUTTON_ROW_SPACING
  floating-sub-nav.animations.ts    — pillVariants, pillTransition, PILL_EASING, PILL_TRANSITION_DURATION
  floating-sub-nav.styles.ts        — all sx constants and factories
  floating-sub-nav.styles.test.ts   — styles + regression tests (touch-target)
  floating-sub-nav.test.ts          — Vitest unit tests
  floating-sub-nav.stories.tsx      — Fixed, Sticky, Hidden, Responsive
  nav-pill.tsx                      — internal NavPill sub-component
  sub-nav-button.tsx                — internal SubNavButton sub-component
  types.ts                          — FloatingSubNavProps, FloatingSubNavItem, sub-component props
  index.ts                          — barrel
  README.md                         — this file
```

## Related

- `SectionContainer` — the outer shell used to constrain section content. `FloatingSubNav` can
  be rendered inside a `SectionContainer` with `sticky={true}` to pin the nav to that section.

## Quality status — 13 May 2026

| Dimension        | Score | Open items |
| ---------------- | ----- | ---------- |
| DoD (Scenario A) | 9/9   | —          |
| Best practices   | 13/13 | —          |
