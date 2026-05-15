import type { Variants } from 'framer-motion';

import { transitionEnter, transitionExit } from '../transition';
import { FLIP_IN_ROTATION, FLIP_OUT_ROTATION } from './flip.const';
import type { FlipDirection, FlipOptions } from './types';

// ----------------------------------------------------------------------

/**
 * Flip motion `Variants` factory (3-D rotation on the X or Y axis).
 *
 * Supports 4 directions: `'inX'`, `'inY'`, `'outX'`, `'outY'`.
 *
 * @example
 * ```tsx
 * <motion.div variants={flip('inY')} initial="initial" animate="animate" exit="exit" />
 * ```
 */
export const flip = (direction: FlipDirection, options?: FlipOptions): Variants => {
  const tIn = options?.transitionIn;
  const tOut = options?.transitionOut;

  const map: Record<FlipDirection, Variants> = {
    inX: {
      initial: { rotateX: FLIP_IN_ROTATION, opacity: 0 },
      animate: { rotateX: 0, opacity: 1, transition: transitionEnter(tIn) },
      exit: { rotateX: FLIP_IN_ROTATION, opacity: 0, transition: transitionExit(tOut) },
    },
    inY: {
      initial: { rotateY: FLIP_IN_ROTATION, opacity: 0 },
      animate: { rotateY: 0, opacity: 1, transition: transitionEnter(tIn) },
      exit: { rotateY: FLIP_IN_ROTATION, opacity: 0, transition: transitionExit(tOut) },
    },
    outX: {
      initial: { rotateX: 0, opacity: 1 },
      animate: { rotateX: FLIP_OUT_ROTATION, opacity: 0, transition: transitionExit(tOut) },
    },
    outY: {
      initial: { rotateY: 0, opacity: 1 },
      animate: { rotateY: FLIP_OUT_ROTATION, opacity: 0, transition: transitionExit(tOut) },
    },
  };

  return map[direction];
};
