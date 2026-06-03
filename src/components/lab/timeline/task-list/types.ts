import type { BoxProps } from '@mui/material/Box';

import type { Task } from '../two-column/types';

// ----------------------------------------------------------------------

export interface TaskListProps extends BoxProps {
  /** The task items to render. */
  tasks: Task[];
  /**
   * When `true`, renders a `Checkbox` before each task title so users can
   * toggle individual tasks done.
   * @default false
   */
  checklist?: boolean;
  /**
   * Resolved done-state per task (0-indexed, matches `tasks` array order).
   * When provided, overrides `task.done` for display and accessibility.
   * Must have the same length as `tasks`.
   */
  taskDoneState?: boolean[];
  /**
   * Called when the user toggles a task checkbox.
   * Receives the 0-based index of the toggled task.
   * Has no effect when `checklist={false}`.
   */
  onTaskToggle?: (taskIndex: number) => void;
  /**
   * Controls left-padding level.
   * - `'phase'` — top-level task list, `pl: 2` (default)
   * - `'milestone'` — nested under a milestone card, `pl: 3`
   * @default 'phase'
   */
  indent?: 'phase' | 'milestone';
}
