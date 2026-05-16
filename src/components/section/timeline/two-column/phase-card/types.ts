import type { Ref, ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';
import type { Task, TimelinePhase, HighlightedPaletteKey } from '../types';

// ----------------------------------------------------------------------

/** Alert entry for the corner warning badge — each alert is one row in the tooltip/popover. */
export type CardCornerAlert = { message: string; severity: 'error' | 'warning' };

/** Props for the `CardCornerAlertBadge` internal sub-component. */
export type CardCornerAlertBadgeProps = {
  alerts: CardCornerAlert[];
  columnSide?: 'left' | 'right';
  /** When provided, badge is a clickable button that opens the PhaseWarningPopover. */
  onClick?: () => void;
  /** Ref forwarded to the badge circle element — used as Popper anchor. */
  innerRef?: Ref<HTMLElement>;
};

/** Props for the `LabeledIconStrip` internal sub-component. */
export type LabeledIconStripProps = {
  /** Optional overline label rendered above the strip. Omitted when undefined. */
  label?: string;
  children: ReactNode;
};

/** Props for the `CardDetailBullets` internal sub-component. */
export type CardDetailBulletsProps = {
  /** Matches `aria-controls` on the parent Paper so screen readers wire the relationship. */
  id: string;
  details: Task[];
  in: boolean;
  /**
   * Done state keyed by task id (`String(task.key)`).
   * Implementations may also provide `idx-${n}` fallback keys for legacy list-index wiring.
   */
  taskDoneStates?: Record<string, boolean>;
  onToggleTask?: (taskIndex: number, done: boolean) => void;
};

/** Props for the `ScenarioBadge` internal sub-component. */
export type ScenarioBadgeProps = { color: string; scenarioLabel: string };

/** Props for the `CardStatusBadge` internal sub-component. */
export type CardStatusBadgeProps = {
  color: string;
  isScenario: boolean;
  scenarioLabel?: string;
};

/** Props for the `CardDecoration` internal sub-component. */
export type CardDecorationProps = {
  /** Effective palette key for the decoration colour (already resolved from phase.color). */
  color: HighlightedPaletteKey;
  /**
   * `true` when the phase is both overdue AND not yet done.
   * Switches the decoration and corner icon to the error (red) palette.
   */
  isOverduePending: boolean;
  /** Phase icon rendered in the corner. Accepts any ReactNode icon slot. */
  icon: ReactNode;
};

/** Parameters for the `buildPaperSx` sx factory in `phase-card.styles.ts`. */
export type PaperSxParams = {
  hasDetails: boolean;
  isDone: boolean;
  color: string;
  phaseSide: 'left' | 'right';
  isHighlighted: boolean;
  isScenario: boolean;
  isOverdue: boolean;
  suppressElevation: boolean;
  textAlign: 'left' | 'right' | undefined;
};

/** Parameters for the `buildDateTypographySx` sx factory in `phase-card.styles.ts`. */
export type DateTypographySxParams = {
  isScenario: boolean;
  isHighlighted: boolean;
  hideDecoration: boolean | undefined;
  color: string | undefined;
};

// ----------------------------------------------------------------------

export type PhaseCardProps = Omit<BoxProps, 'children'> & {
  /** The timeline phase data to render. */
  phase: TimelinePhase;
  /** Runtime done override from the parent timeline (local toggle state). Defaults to phase.done. */
  done?: boolean;
  /** Runtime overdue override from the parent timeline. Adds a red warning border to the card. */
  overdue?: boolean;
  /** Set by the parent when this phase's date range overlaps another phase. Shows a ⚠ Date overlap badge. */
  dateConflict?: boolean;
  /** Human-readable explanation of the overlap rendered in a Tooltip on the badge. */
  dateConflictLabel?: string;
  /**
   * Controlled expansion state. When provided together with `onRequestExpand`,
   * the card operates in controlled mode and the parent owns the open/close state.
   */
  isExpanded?: boolean;
  /** Called when the user clicks or keys the card to toggle details. Controlled mode only. */
  onRequestExpand?: () => void;
  /** When true, suppresses box-shadow so the card appears flat (used when another card is expanded). */
  suppressElevation?: boolean;
  /**
   * When true, the viewed eye indicator shows as filled (success colour).
   * Only renders the indicator when `onMarkViewed` is also provided.
   */
  isViewed?: boolean;
  /**
   * Called when the user clicks the viewed eye button. Provide this to enable the indicator.
   * The parent is responsible for persisting the viewed state.
   */
  onMarkViewed?: () => void;
  /**
   * Icon rendered in the expandable-details count badge. Defaults to the bundled inline SVG subtask icon.
   * Pass `null` to suppress the icon and show only the count number.
   */
  expandableIcon?: ReactNode;
  /**
   * Which column the card sits in — controls where the corner alert badge is anchored.
   * - `'right'` (default): badge floats on the right top corner (outer edge, away from spine).
   * - `'left'`: badge floats on the left top corner (mirrored outer edge, away from spine).
   */
  columnSide?: 'left' | 'right';
  /**
   * Forwarded from `TimelineTwoColumn.onPhasesChange`.
   *
   * When provided, the corner overlap-warning badge opens a rich `PhaseWarningPopover`
   * (range sliders + mini Gantt ruler + Apply/Cancel) instead of a plain string tooltip.
   * The popover calls this with the full updated phases array on "Apply".
   *
   * When omitted, the badge is read-only — plain tooltip only.
   */
  onPhasesChange?: (updated: TimelinePhase[]) => void;
  /**
   * The full `phases` array from `TimelineTwoColumn` — passed down only when
   * `onPhasesChange` is also provided. Used by `PhaseWarningPopover` to compute
   * the conflict group and to merge updated dates on Apply.
   */
  allPhases?: TimelinePhase[];
  /**
   * Done state for each task (sub-item) in this phase, keyed by `String(task.key)`.
   * `idx-${n}` fallback keys are accepted for compatibility with legacy index-based wiring.
   * Falls back to `task.done` from the data when absent.
   */
  taskDoneStates?: Record<string, boolean>;
  /**
   * Called when the user clicks a task toggle icon.
   * When provided, task rows are interactive; when absent they are decorative.
   */
  onToggleTask?: (taskIndex: number, done: boolean) => void;
};
