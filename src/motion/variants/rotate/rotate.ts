import type { Variants } from 'framer-motion';

import { transitionEnter, transitionExit } from '../transition';
import { ROTATE_DEFAULT_DEGREES } from './rotate.const';
import type { RotateDirection, RotateOptions } from './types';

// ----------------------------------------------------------------------

/**
 * Rotate motion `Variants` factory.
 *
 * Supports 2 directions: `'in'` (rotate in from negative angle) and `'out'` (rotate out).
 *
 * @example
 * ```tsx
 * <motion.div variants={rotate('in')} initial="initial" animate="animate" exit="exit" />
 * ```
 */
export const rotate = (direction: RotateDirection, options?: RotateOptions): Variants => {
  const deg = options?.deg ?? ROTATE_DEFAULT_DEGREES;
  const tIn = options?.transitionIn;
  const tOut = options?.transitionOut;

  const map: Record<RotateDirection, Variants> = {
    in: {
      initial: { opacity: 0, rotate: -deg },
      animate: { opacity: 1, rotate: 0, transition: transitionEnter(tIn) },
      exit: { opacity: 0, rotate: -deg, transition: transitionExit(tOut) },
    },
    out: {
      initial: { opacity: 1, rotate: 0 },
      animate: { opacity: 0, rotate: -deg, transition: transitionExit(tOut) },
    },
  };

  return map[direction];
};
