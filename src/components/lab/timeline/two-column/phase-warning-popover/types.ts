import type { TimelinePhase } from '../types';

// ----------------------------------------------------------------------

/** Internal representation of a single phase's date range as month indices. */
export type PhaseRange = { startIdx: number; endIdx: number };

export type MiniGanttRulerProps = {
  axis: { min: number; max: number };
  conflictingPhases: TimelinePhase[];
  overrides: Map<number, PhaseRange>;
};

export type PhaseWarningPopoverProps = {
  /** Whether the popover is currently open. */
  open: boolean;
  /**
   * DOM element the Popper is anchored to — typically the corner alert badge button.
   * Pass `null` when closed; the popover will not render.
   */
  anchorEl: Element | null;
  /** Called to close the popover without applying changes. */
  onClose: () => void;
  /**
   * The full phases array passed to `TimelineTwoColumn`.
   * Used to compute the conflict group and to merge updated dates on Apply.
   */
  allPhases: TimelinePhase[];
  /**
   * The phase whose corner badge triggered this popover.
   * Used to identify which phases are in the same conflict group.
   */
  currentPhase: TimelinePhase;
  /**
   * Forwarded from `TimelineTwoColumn.onPhasesChange`.
   * Called on Apply with the full updated phases array (dates corrected).
   */
  onPhasesChange: (updated: TimelinePhase[]) => void;
};
