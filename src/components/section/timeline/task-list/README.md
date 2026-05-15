# TaskList

## Why it exists

Rendering a flat list of task items inside timeline cards, milestone detail drawers, and
modals is a repeated pattern in the Giselle ecosystem. The nuances — read-only vs checklist
mode, done state via external `taskDoneState` vs data `task.done`, milestone-level indent,
accessible Checkbox `aria-label` — are non-trivial to get right each time. `TaskList`
encodes them once.

## Why it belongs here

Timeline cards and milestone drawers across `alexrebula` and `first-branch` both need this
component. It is structurally tied to the `Task` type defined in `TimelineTwoColumn/types.ts`,
making it a natural sibling in this package.

## Design decisions

- **Read-only vs checklist** — `checklist={false}` (default) is purely presentational.
  When `checklist={true}`, each row shows a `Checkbox`. The consumer controls state via
  `taskDoneState` and `onTaskToggle` — no internal state, consistent with controlled-component
  philosophy.
- **`taskDoneState` overrides `task.done`** — this allows a parent component to track
  interactive changes without mutating the source data array.
- **`indent` prop** — `'phase'` (default) gives `pl: 2`; `'milestone'` adds extra indent for
  tasks nested under milestone cards which already have their own left inset.
- **`aria-label` on Checkbox** — uses `task.title` so screen readers announce the task name
  when the checkbox is focused.
- **`component="ul"` / `component="li"`** — semantically correct list markup even though MUI
  `Box` renders `div` by default.

## Library safety

Zero personal data. No proprietary identifier names. No hardcoded hex or rgba literals.

## File structure

```
timeline/task-list/
  task-list.tsx              — TaskList component
  task-list.styles.ts        — all sx constants and factories
  task-list.styles.test.ts   — mock-theme assertions for every exported factory
  task-list.test.ts          — Vitest unit tests
  task-list.stories.tsx      — Default, Checklist, MilestoneIndent, AllDone, Responsive
  types.ts                   — TaskListProps
  index.ts                   — barrel
  README.md                  — this file
```

## Quality status — 13 May 2026

| Dimension        | Score | Open items |
| ---------------- | ----- | ---------- |
| DoD (Scenario B) | 20/20 | —          |
| Best practices   | 13/13 | —          |

## Related

- `TimelineTwoColumn` — the primary consumer; `TaskList` renders inside `PhaseCard` and
  milestone detail drawers.
- `Task` type — defined in `timeline/two-column/types.ts`, imported by `TaskListProps`.
