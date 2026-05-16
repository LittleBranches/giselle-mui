// ----------------------------------------------------------------------

/** Diameter (px) of the coloured dot in the accordion phase summary row. */
export const COMPACT_PHASE_DOT_SIZE = 32;

/** Diameter (px) of the coloured dot in each milestone row.
 * Smaller than the phase dot to establish visual hierarchy (phase = 32 px, milestone = 24 px).
 * Matches the proportional ratio used by `TimelineTwoColumn` (42 px phase, 34 px milestone). */
export const COMPACT_MILESTONE_DOT_SIZE = 24;

/**
 * Size (px) of the icon rendered inside the phase summary dot.
 * Must be smaller than `COMPACT_PHASE_DOT_SIZE` to fit inside the circle.
 */
export const COMPACT_PHASE_ICON_SIZE = 18;

/**
 * Size (px) of the icon rendered inside each milestone dot.
 * Must be smaller than `COMPACT_MILESTONE_DOT_SIZE` to fit inside the circle.
 */
export const COMPACT_MILESTONE_ICON_SIZE = 14;

/**
 * Minimum acceptable diameter for the phase dot.
 * Must stay at or above this to remain glanceable at mobile font scales.
 */
export const COMPACT_MIN_PHASE_DOT_SIZE = 18;

/**
 * Minimum acceptable diameter for the milestone dot.
 * Must stay at or above this to remain visible as a distinct element.
 */
export const COMPACT_MIN_MILESTONE_DOT_SIZE = 18;
