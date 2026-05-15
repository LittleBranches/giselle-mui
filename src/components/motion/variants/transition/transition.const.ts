/** Duration (seconds) for enter transitions. */
export const TRANSITION_ENTER_DURATION = 0.64;

/** Duration (seconds) for exit transitions. */
export const TRANSITION_EXIT_DURATION = 0.48;

/**
 * Shared cubic-bezier easing for all motion transitions.
 * Smooth ease-in-out: fast start, gradual settle.
 */
export const TRANSITION_EASE: [number, number, number, number] = [0.43, 0.13, 0.23, 0.96];
