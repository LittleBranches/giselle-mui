import type { PaperProps } from '@mui/material/Paper';
import type { ReactNode } from 'react';
import type { Task, TimelineMilestone, HighlightedPaletteKey } from '../types';

// Re-export for convenience — consumers can import from milestone-badge barrel.
export type { HighlightedPaletteKey, Task, TimelineMilestone };

export type MilestoneBadgeProps = Omit<PaperProps, 'children'> & {
  /** The milestone data object from the parent phase's `milestones` array. */
  milestone: TimelineMilestone;
  /** Dims and desaturates the card. Mirrors the checklist done state from the parent timeline. */
  done?: boolean;
  /** Whether this card's details section is currently expanded. Controlled by the parent accordion. */
  isExpanded: boolean;
  /** Called when the user clicks or keys Enter/Space to toggle this card open or closed. */
  onRequestExpand: () => void;
  /** When true, suppresses box-shadow so the card appears flat (used when another card is expanded). */
  suppressElevation?: boolean;
  /**
   * Icon rendered in the expandable-details count badge. Defaults to the bundled inline SVG subtask icon.
   * Pass `null` to suppress the icon and show only the count number.
   */
  expandableIcon?: ReactNode;
  /**
   * Stable unique id prefix used to construct the `aria-controls` / `id` pair for the
   * expandable details region. Should be unique across all milestones on the page
   * (e.g. `"${phaseKey}-${milestoneIndex}"`). Falls back to a sanitised title slug
   * when omitted, which can collide if two milestones share the same title.
   */
  stableId?: string;
  /**
   * When true, the viewed eye indicator shows as filled (success colour).
   * Only renders when `onMarkViewed` is also provided.
   */
  isViewed?: boolean;
  /** Called when the user clicks the viewed eye button. Parent handles persistence. */
  onMarkViewed?: () => void;
  /**
   * Which column this milestone sits in. Left-column milestones right-align their
   * collapsed title and inline elements so text sits flush against the centre spine.
   * Alignment resets to left when the card is expanded.
   * @default 'right'
   */
  columnSide?: 'left' | 'right';
  /**
   * Done state for each task (sub-item) in this milestone, indexed by position.
   * Provided by `TimelineTwoColumn` when task-level done state is active.
   * Falls back to `task.done` from the data when absent.
   */
  taskDoneStates?: boolean[];
  /**
   * Called when the user clicks a task toggle icon.
   * When provided, task rows are interactive; when absent they are decorative.
   */
  onToggleTask?: (taskIndex: number, done: boolean) => void;
};
