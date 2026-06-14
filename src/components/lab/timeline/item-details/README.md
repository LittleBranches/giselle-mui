# TimelineItemDetails

## Why it exists

When a user expands a phase or milestone on `TimelineTwoColumn`, the detailed content (summary, rich body, nested task checklist) needs a consistent surface to render in. Without this component each callsite must compose a `Box` with summary text, a `TaskDetails` content slot, and an optional interactive checklist — duplicating the layout and done-state toggle logic for every detail surface.

## Why it belongs in giselle-mui

Timeline detail surfaces appear in career timelines, roadmaps, and project planning tools. The component is generic: it accepts `Task` and `TaskDetails` types from the shared timeline type system, carrying no app-specific logic.

## Design decisions

TBD — filled in during implementation.

## Related

- [lab/timeline/two-column](../two-column/README.md) — parent timeline component that renders this surface

## Build spec

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `task` | `Task` | yes | — | The task whose details are displayed |
| `details` | `TaskDetails` | no | — | Rich content: `summary`, `content`, `tasks[]` |
| `checklist` | `boolean` | no | `false` | When true renders nested `tasks[]` as an interactive checklist |
| `taskDoneState` | `boolean[]` | no | — | Controlled done state per task, indexed to `details.tasks` |
| `onTaskToggle` | `(taskIndex: number) => void` | no | — | Called when the user clicks a task checkbox |
| All `BoxProps` | — | no | — | Forwarded to root `Box` (excludes `children`) |

### Types (from `lab/timeline/two-column/types`)

```ts
interface TaskDetails {
  summary?: ReactNode;
  content?: ReactNode;
  tasks?: Task[];
}
type Task = {
  key: number | string;
  title: string;
  description?: string;
  done?: boolean;
  children?: Task[];
  // ... (see two-column/types.ts for full shape)
};
```

### Visual description

A `Box` containing:
1. Optional `details.summary` rendered as a `Typography variant="body2"` block.
2. `details.content` arbitrary rich content area.
3. When `checklist` is true and `details.tasks` is non-empty: a vertical list of `Checkbox` + label rows. Each row reflects `taskDoneState[i]`; clicking fires `onTaskToggle(i)`. Done rows are dimmed.

### Reference

Renders inside a modal or drawer opened from `TimelineTwoColumn` phase/milestone cards.

### Acceptance criteria

- When `checklist` is false, task list is read-only (no checkboxes).
- `onTaskToggle` is not called when `checklist` is false.
- `taskDoneState` and `details.tasks` must have the same length when both are provided.
- Passes TypeScript strict-mode checks.
- Storybook story showing both read-only and checklist modes.

## Phase

Phase: `G` | Priority tier: `T2`

---

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
