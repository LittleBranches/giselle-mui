/** Default scale factor for `whileHover` interactions. */
export const DEFAULT_HOVER_SCALE = 1.09;

/** Default scale factor for `whileTap` interactions. */
export const DEFAULT_TAP_SCALE = 0.9;

/** Duration (seconds) for hover transition ease. */
export const TRANSITION_HOVER_DURATION = 0.32;

/**
 * Spring stiffness for tap transitions.
 * Higher values = snappier feel.
 */
export const TRANSITION_TAP_STIFFNESS = 400;

/**
 * Spring damping for tap transitions.
 * Lower values = more bounce; 18 gives a crisp snap without excessive oscillation.
 */
export const TRANSITION_TAP_DAMPING = 18;

/** Spring type identifier for tap transitions. */
export const TRANSITION_TAP_TYPE = 'spring' as const;
