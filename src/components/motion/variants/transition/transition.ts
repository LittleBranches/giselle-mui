import type { Transition } from 'framer-motion';

import {
  TRANSITION_ENTER_DURATION,
  TRANSITION_EXIT_DURATION,
  TRANSITION_EASE,
} from './transition.const';

// ----------------------------------------------------------------------

/**
 * Default enter transition.
 *
 * Duration: **0.64 s**. Easing: `cubic-bezier(0.43, 0.13, 0.23, 0.96)` — smooth ease-in-out.
 * Override any property via `opts`.
 */
export const transitionEnter = (opts?: Transition): Transition => ({
  duration: TRANSITION_ENTER_DURATION,
  ease: TRANSITION_EASE,
  ...opts,
});

/**
 * Default exit transition.
 *
 * Duration: **0.48 s**. Same easing as enter. Override any property via `opts`.
 */
export const transitionExit = (opts?: Transition): Transition => ({
  duration: TRANSITION_EXIT_DURATION,
  ease: TRANSITION_EASE,
  ...opts,
});
