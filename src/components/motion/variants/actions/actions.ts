import type { Transition } from 'framer-motion';

import { TRANSITION_EASE } from '../transition';
import {
  DEFAULT_HOVER_SCALE,
  DEFAULT_TAP_SCALE,
  TRANSITION_HOVER_DURATION,
  TRANSITION_TAP_STIFFNESS,
  TRANSITION_TAP_DAMPING,
  TRANSITION_TAP_TYPE,
} from './actions.const';

// ----------------------------------------------------------------------

/**
 * Returns a `whileHover` scale target for a `motion.*` element.
 *
 * @param value - Scale on hover. @default 1.09
 *
 * @example
 * ```tsx
 * <motion.div whileHover={hover()}>Hover me</motion.div>
 * <motion.button whileHover={hover(1.05)} whileTap={tap()}>Click</motion.button>
 * ```
 */
export const hover = (value = DEFAULT_HOVER_SCALE): { scale: number } => ({ scale: value });

/**
 * Returns a `whileTap` scale target for a `motion.*` element.
 *
 * @param value - Scale on press. @default 0.9
 */
export const tap = (value = DEFAULT_TAP_SCALE): { scale: number } => ({ scale: value });

/**
 * Spring transition for tap interactions.
 * Feels snappy: `stiffness: 400, damping: 18`.
 */
export const transitionTap = (props?: Transition): Transition => ({
  type: TRANSITION_TAP_TYPE,
  stiffness: TRANSITION_TAP_STIFFNESS,
  damping: TRANSITION_TAP_DAMPING,
  ...props,
});

/**
 * Ease transition for hover interactions.
 */
export const transitionHover = (props?: Transition): Transition => ({
  duration: TRANSITION_HOVER_DURATION,
  ease: TRANSITION_EASE,
  ...props,
});
