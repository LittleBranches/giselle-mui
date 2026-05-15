import type { Variants } from 'framer-motion';

import { transitionEnter, transitionExit } from '../transition';
import type { ScaleDirection, ScaleOptions } from './types';

// ----------------------------------------------------------------------

/**
 * Scale motion `Variants` factory.
 *
 * Supports 6 directions: `'in'`, `'inX'`, `'inY'`, `'out'`, `'outX'`, `'outY'`.
 *
 * @example
 * ```tsx
 * <motion.div variants={scale('in')} initial="initial" animate="animate" exit="exit" />
 * ```
 */
export const scale = (direction: ScaleDirection, options?: ScaleOptions): Variants => {
  const tIn = options?.transitionIn;
  const tOut = options?.transitionOut;

  const map: Record<ScaleDirection, Variants> = {
    in: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1, transition: transitionEnter(tIn) },
      exit: { scale: 0, opacity: 0, transition: transitionExit(tOut) },
    },
    inX: {
      initial: { scaleX: 0, opacity: 0 },
      animate: { scaleX: 1, opacity: 1, transition: transitionEnter(tIn) },
      exit: { scaleX: 0, opacity: 0, transition: transitionExit(tOut) },
    },
    inY: {
      initial: { scaleY: 0, opacity: 0 },
      animate: { scaleY: 1, opacity: 1, transition: transitionEnter(tIn) },
      exit: { scaleY: 0, opacity: 0, transition: transitionExit(tOut) },
    },
    out: {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 0, opacity: 0, transition: transitionEnter(tIn) },
      exit: { scale: 1, opacity: 1, transition: transitionExit(tOut) },
    },
    outX: {
      initial: { scaleX: 1, opacity: 1 },
      animate: { scaleX: 0, opacity: 0, transition: transitionEnter(tIn) },
      exit: { scaleX: 1, opacity: 1, transition: transitionExit(tOut) },
    },
    outY: {
      initial: { scaleY: 1, opacity: 1 },
      animate: { scaleY: 0, opacity: 0, transition: transitionEnter(tIn) },
      exit: { scaleY: 1, opacity: 1, transition: transitionExit(tOut) },
    },
  };

  return map[direction];
};
