import type { Transition, Variants } from 'framer-motion';

// ----------------------------------------------------------------------

/**
 * Cubic-bezier easing used for the pill enter/exit animation.
 * Matches Material Design's standard easing curve (`cubic-bezier(0.4, 0, 0.2, 1)`).
 */
export const PILL_EASING: [number, number, number, number] = [0.4, 0, 0.2, 1];

/** Duration (seconds) of the pill enter/exit animation. */
export const PILL_TRANSITION_DURATION = 0.28;

/**
 * Transition config applied to the pill motion wrapper.
 * Extracted so it can be referenced in tests and shared with any future
 * entrance animation on the same component.
 */
export const pillTransition: Transition = {
  duration: PILL_TRANSITION_DURATION,
  ease: PILL_EASING,
};

/**
 * Framer Motion variants for the floating pill enter/exit animation.
 *
 * - `initial` — hidden below the viewport bottom, fully transparent
 * - `animate` — fully visible at natural position
 * - `exit`    — fades out while sliding down slightly (shorter travel than entry
 *               to feel like a "collapse" rather than a second full entrance)
 */
export const pillVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};
