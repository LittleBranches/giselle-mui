import type { Variants, Transition } from 'framer-motion';

import { transitionEnter, transitionExit } from './transition';

// ----------------------------------------------------------------------

type FadeDirection =
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

type FadeOptions = {
  /** Distance in px for directional fade. @default 120 */
  distance?: number;
  transitionIn?: Transition;
  transitionOut?: Transition;
};

/**
 * Fade motion `Variants` factory.
 *
 * Supports 10 directions: `'in'`, `'inUp'`, `'inDown'`, `'inLeft'`, `'inRight'`,
 * `'out'`, `'outUp'`, `'outDown'`, `'outLeft'`, `'outRight'`.
 *
 * @example
 * ```tsx
 * <motion.div variants={fade('inUp')} initial="initial" animate="animate" exit="exit" />
 * <motion.div variants={fade('inUp', { distance: 24 })} initial="initial" animate="animate" />
 * ```
 */
export const fade = (direction: FadeDirection, options?: FadeOptions): Variants => {
  const distance = options?.distance ?? 120;
  const tIn = options?.transitionIn;
  const tOut = options?.transitionOut;

  const map: Record<FadeDirection, Variants> = {
    in: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: transitionEnter(tIn) },
      exit: { opacity: 0, transition: transitionExit(tOut) },
    },
    inUp: {
      initial: { y: distance, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: transitionEnter(tIn) },
      exit: { y: distance, opacity: 0, transition: transitionExit(tOut) },
    },
    inDown: {
      initial: { y: -distance, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: transitionEnter(tIn) },
      exit: { y: -distance, opacity: 0, transition: transitionExit(tOut) },
    },
    inLeft: {
      initial: { x: -distance, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: transitionEnter(tIn) },
      exit: { x: -distance, opacity: 0, transition: transitionExit(tOut) },
    },
    inRight: {
      initial: { x: distance, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: transitionEnter(tIn) },
      exit: { x: distance, opacity: 0, transition: transitionExit(tOut) },
    },
    out: {
      initial: { opacity: 1 },
      animate: { opacity: 0, transition: transitionEnter(tIn) },
      exit: { opacity: 1, transition: transitionExit(tOut) },
    },
    outUp: {
      initial: { y: 0, opacity: 1 },
      animate: { y: -distance, opacity: 0, transition: transitionEnter(tIn) },
      exit: { y: 0, opacity: 1, transition: transitionExit(tOut) },
    },
    outDown: {
      initial: { y: 0, opacity: 1 },
      animate: { y: distance, opacity: 0, transition: transitionEnter(tIn) },
      exit: { y: 0, opacity: 1, transition: transitionExit(tOut) },
    },
    outLeft: {
      initial: { x: 0, opacity: 1 },
      animate: { x: -distance, opacity: 0, transition: transitionEnter(tIn) },
      exit: { x: 0, opacity: 1, transition: transitionExit(tOut) },
    },
    outRight: {
      initial: { x: 0, opacity: 1 },
      animate: { x: distance, opacity: 0, transition: transitionEnter(tIn) },
      exit: { x: 0, opacity: 1, transition: transitionExit(tOut) },
    },
  };

  return map[direction];
};
