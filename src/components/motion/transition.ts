import type { Transition } from 'framer-motion';

// ----------------------------------------------------------------------

/**
 * Default enter transition.
 *
 * Duration: 0.64s. Easing: cubic-bezier(0.43, 0.13, 0.23, 0.96) — smooth ease-in-out.
 * Override any property via `opts`.
 */
export const transitionEnter = (opts?: Transition): Transition => ({
  duration: 0.64,
  ease: [0.43, 0.13, 0.23, 0.96],
  ...opts,
});

/**
 * Default exit transition.
 *
 * Duration: 0.48s. Same easing as enter. Override any property via `opts`.
 */
export const transitionExit = (opts?: Transition): Transition => ({
  duration: 0.48,
  ease: [0.43, 0.13, 0.23, 0.96],
  ...opts,
});
