import type { Variants, Transition } from 'framer-motion';

import { transitionEnter, transitionExit } from './transition';

// ----------------------------------------------------------------------

type ZoomDirection =
  | 'in'
  | 'inUp'
  | 'inDown'
  | 'inLeft'
  | 'inRight'
  | 'out'
  | 'outUp'
  | 'outDown'
  | 'outLeft'
  | 'outRight';

type ZoomOptions = {
  /** Distance in px for directional zoom. @default 720 */
  distance?: number;
  transitionIn?: Transition;
  transitionOut?: Transition;
};

/**
 * Zoom motion `Variants` factory (scale + translate).
 *
 * Supports 10 directions: `'in'`, `'inUp'`, `'inDown'`, `'inLeft'`, `'inRight'`,
 * `'out'`, `'outUp'`, `'outDown'`, `'outLeft'`, `'outRight'`.
 *
 * @example
 * ```tsx
 * <motion.div variants={zoom('inUp')} initial="initial" animate="animate" exit="exit" />
 * ```
 */
export const zoom = (direction: ZoomDirection, options?: ZoomOptions): Variants => {
  const distance = options?.distance ?? 720;
  const tIn = options?.transitionIn;
  const tOut = options?.transitionOut;

  const map: Record<ZoomDirection, Variants> = {
    in: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1, transition: transitionEnter(tIn) },
      exit: { scale: 0, opacity: 0, transition: transitionExit(tOut) },
    },
    inUp: {
      initial: { scale: 0, opacity: 0, translateY: distance },
      animate: { scale: 1, opacity: 1, translateY: 0, transition: transitionEnter(tIn) },
      exit: { scale: 0, opacity: 0, translateY: distance, transition: transitionExit(tOut) },
    },
    inDown: {
      initial: { scale: 0, opacity: 0, translateY: -distance },
      animate: { scale: 1, opacity: 1, translateY: 0, transition: transitionEnter(tIn) },
      exit: { scale: 0, opacity: 0, translateY: -distance, transition: transitionExit(tOut) },
    },
    inLeft: {
      initial: { scale: 0, opacity: 0, translateX: -distance },
      animate: { scale: 1, opacity: 1, translateX: 0, transition: transitionEnter(tIn) },
      exit: { scale: 0, opacity: 0, translateX: -distance, transition: transitionExit(tOut) },
    },
    inRight: {
      initial: { scale: 0, opacity: 0, translateX: distance },
      animate: { scale: 1, opacity: 1, translateX: 0, transition: transitionEnter(tIn) },
      exit: { scale: 0, opacity: 0, translateX: distance, transition: transitionExit(tOut) },
    },
    out: {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 0, opacity: 0, transition: transitionEnter(tIn) },
    },
    outUp: {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 0, opacity: 0, translateY: -distance, transition: transitionEnter(tIn) },
    },
    outDown: {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 0, opacity: 0, translateY: distance, transition: transitionEnter(tIn) },
    },
    outLeft: {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 0, opacity: 0, translateX: -distance, transition: transitionEnter(tIn) },
    },
    outRight: {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 0, opacity: 0, translateX: distance, transition: transitionEnter(tIn) },
    },
  };

  return map[direction];
};
