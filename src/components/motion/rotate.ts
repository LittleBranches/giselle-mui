import type { Variants, Transition } from 'framer-motion';

import { transitionEnter, transitionExit } from './transition';

// ----------------------------------------------------------------------

type RotateDirection = 'in' | 'out';

type RotateOptions = {
  /** Rotation in degrees. @default 360 */
  deg?: number;
  transitionIn?: Transition;
  transitionOut?: Transition;
};

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
  const deg = options?.deg ?? 360;
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
