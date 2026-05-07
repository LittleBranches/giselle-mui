// ----------------------------------------------------------------------

/** Diameter (px) of the coloured dot in the accordion phase summary row. */
export const COMPACT_PHASE_DOT_SIZE = 14;

/** Diameter (px) of the coloured dot beside each milestone row in the details body. */
export const COMPACT_MILESTONE_DOT_SIZE = 10;

/**
 * Size (px) of the phase icon rendered inside the phase summary dot.
 * Must be smaller than `COMPACT_PHASE_DOT_SIZE` to fit inside the circle.
 */
export const COMPACT_PHASE_ICON_SIZE = 12;

/**
 * Minimum acceptable diameter for the phase dot.
 * Must stay at or above this to remain glanceable at mobile font scales.
 */
export const COMPACT_MIN_PHASE_DOT_SIZE = 12;

/**
 * Minimum acceptable diameter for the milestone dot.
 * Must stay at or above this to remain visible as a distinct element.
 */
export const COMPACT_MIN_MILESTONE_DOT_SIZE = 8;
