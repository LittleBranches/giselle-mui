# `Accordion`

## Why it exists

MUI's raw `Accordion` + `AccordionSummary` + `AccordionDetails` pattern solves
the basic expand/collapse problem well, but it does not answer two recurring
questions that come up the moment you use accordions for real content:

1. **How do I add an independent done-toggle before the title** (task lists,
   checklist items) without nesting interactive elements inside the summary
   button — which would violate WCAG?
2. **How do I place a decorative icon** before the title without handing that
   layout problem to every consumer?

`Accordion` answers both, correctly and once.

## Why it belongs here

Any section that lists collapsible items — FAQs, task lists, settings groups,
notification histories — needs exactly this API. It is not page-specific.
Building it here ensures every consumer gets the same WCAG compliance and the
same layout logic without copy-pasting the Box-wrapper-around-AccordionSummary
pattern every time.

## Design decisions

### Checkbox outside `AccordionSummary` (the key decision)

MUI `AccordionSummary` renders as a `<button>`. ARIA spec prohibits placing an
interactive element (another `<input type="checkbox">`) inside a `<button>`.
Doing so also breaks keyboard behaviour in most browsers.

The solution: render the `Checkbox` and `AccordionSummary` as **siblings** inside
a `<Box display="flex">`. This keeps both elements directly accessible, gives
them independent tab stops, and avoids all nesting issues.

The `<Box>` wrapper sits between `<Accordion>` and `<AccordionSummary>` in the
DOM. MUI v7 communicates between those two components via React context, not via
direct-child CSS selectors, so the wrapper is transparent to MUI's internal logic.

### `stopPropagation` on checkbox click

The checkbox `onClick` handler calls `e.stopPropagation()` as a defensive guard
against any root-level `onClick` a consumer might attach to the `Accordion` via
`...other`. Without it, a click on the checkbox would bubble up through the
`<Box>` and potentially trigger an unintended parent handler.

### `aria-label` on the checkbox

The checkbox input carries `aria-label: 'Mark as done'` / `'Mark as not done'`
that reflects the **current** state (describing what will happen on the next
click). This matches the ARIA checkbox pattern — the label describes the current
checked state in context, not the action.

### `leadingIcon` is `aria-hidden`

When not in checklist mode, the `leadingIcon` slot is wrapped in a `Box` with
`aria-hidden="true"`. Icons in this slot are always decorative — the title text
is the accessible label. Screen readers skip the icon wrapper entirely.

### String titles are wrapped in `<Typography>`

When `title` is a plain string, the component wraps it in
`<Typography component="span" variant="subtitle1">` for consistent visual style.
When `title` is a `ReactNode`, it is rendered as-is, giving the consumer full
control over typography.

## Library safety

- Zero proprietary dependencies. Only `@mui/material` components (`Accordion`,
  `AccordionSummary`, `AccordionDetails`, `Checkbox`, `Box`, `Typography`) and
  `react` standard hooks (`useId`).
- No hardcoded icon strings. The `expandIcon` and `leadingIcon` slots are
  consumer-provided `ReactNode`s.
- No hardcoded copy. All visible text (`title`, children) comes from props.

## File structure

```
src/components/accordion/
  accordion.tsx             — JSX composition only
  accordion.const.ts        — WCAG minimum touch target constants
  accordion.styles.ts       — static sx constants
  accordion.styles.test.ts  — assertions for every sx constant
  accordion.test.ts         — render, ARIA, interaction, and branch coverage tests
  accordion.stories.tsx     — Storybook: Default, Checklist, TaskList, CheckboxOutsideSummary (WCAG doc), Responsive
  check-icon-button.tsx     — internal icon-button done toggle sub-component
  check-icon-button.test.ts — structure, ARIA, and click tests for CheckIconButton
  index.ts                  — barrel export
  types.ts                  — AccordionProps, CheckIconButtonProps
  README.md                 — this file
```

## Quality status — 13 May 2026

| Dimension        | Score | Open items |
| ---------------- | ----- | ---------- |
| DoD (Scenario B) | 20/20 | —          |
| Best practices   | 13/13 | —          |

## Related

- `TaskList` — renders a flat list of `done`/`pending` items without expand/collapse
- `FaqSection` — full FAQ section with framer-motion scroll animation, decorative
  SVGs, and a contact footer; lives in `faq/accordion/` in the `/motion` subpath
- `TimelineCompact` — accordion-based timeline with milestone modals
