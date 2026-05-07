import type { BoxProps } from '@mui/material/Box';

import type { TimelinePhase } from '../two-column/types';

// ----------------------------------------------------------------------

/**
 * Props for `TimelineCompact`.
 *
 * Accepts the same `phases` array as `TimelineTwoColumn` — no separate data model.
 * Swap at a breakpoint without changing the data layer:
 *
 * ```tsx
 * {isMobile
 *   ? <TimelineCompact phases={phases} />
 *   : <TimelineTwoColumn phases={phases} columnLabels={...} sidebar={...} />
 * }
 * ```
 *
 * The props below mirror the equivalent `TimelineTwoColumnProps` — they are passed
 * through automatically when `TimelineTwoColumn` switches to compact on mobile.
 */
export interface TimelineCompactProps extends BoxProps {
  /**
   * Timeline phases to render as accordion rows.
   *
   * Each phase maps to one accordion item:
   * - Summary: coloured dot + title + date
   * - Details: description text + task children list + milestone list
   */
  phases: TimelinePhase[];

  /**
   * Enables interactive checklist behaviour:
   * - Phase and milestone dots become clickable to toggle done state.
   * - Done items render with a green dot and reduced opacity.
   * - Task children render as checkboxes.
   * @see TimelineTwoColumnProps.checklist
   */
  checklist?: boolean;

  /**
   * Sort direction for phases and milestones — mirrors `TimelineTwoColumnProps.sortOrder`.
   * @default 'desc'
   * @see TimelineTwoColumnProps.sortOrder
   */
  sortOrder?: 'asc' | 'desc' | 'key';

  /**
   * Set of viewed phase keys. `phase-${phase.key}` is added when a phase accordion is opened.
   * @see TimelineTwoColumnProps.viewedKeys
   */
  viewedKeys?: Set<string>;

  /**
   * Called when a phase accordion is opened for the first time — key format `phase-${phase.key}`.
   * @see TimelineTwoColumnProps.onMarkViewed
   */
  onMarkViewed?: (key: string) => void;

  /**
   * Called when the user clicks a phase dot in checklist mode.
   * @see TimelineTwoColumnProps.onTogglePhaseDone
   */
  onTogglePhaseDone?: (key: number, done: boolean) => void;

  /**
   * Called when the user clicks a milestone dot in checklist mode.
   * @see TimelineTwoColumnProps.onToggleMilestoneDone
   */
  onToggleMilestoneDone?: (phaseKey: number, milestoneIndex: number, done: boolean) => void;

  /**
   * Called when the user toggles a task checkbox.
   * @see TimelineTwoColumnProps.onToggleTaskDone
   */
  onToggleTaskDone?: (
    phaseKey: number,
    milestoneIndex: number | null,
    taskIndex: number,
    done: boolean
  ) => void;
}
