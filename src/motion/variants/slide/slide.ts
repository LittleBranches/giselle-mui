import type { Variants } from 'framer-motion';

import { transitionEnter, transitionExit } from '../transition';
import { SLIDE_DEFAULT_DISTANCE } from './slide.const';
import type { SlideDirection, SlideOptions } from './types';

// ----------------------------------------------------------------------

/**
 * Slide motion `Variants` factory (no opacity — pure positional slide).
 *
 * Supports 8 directions: `'inUp'`, `'inDown'`, `'inLeft'`, `'inRight'`,
 * `'outUp'`, `'outDown'`, `'outLeft'`, `'outRight'`.
 *
 * @example
 * ```tsx
 * <motion.div variants={slide('inLeft')} initial="initial" animate="animate" exit="exit" />
 * ```
 */
export const slide = (direction: SlideDirection, options?: SlideOptions): Variants => {
  const distance = options?.distance ?? SLIDE_DEFAULT_DISTANCE;
  const tIn = options?.transitionIn;
  const tOut = options?.transitionOut;

  const map: Record<SlideDirection, Variants> = {
    inUp: {
      initial: { y: distance },
      animate: { y: 0, transition: transitionEnter(tIn) },
      exit: { y: distance, transition: transitionExit(tOut) },
    },
    inDown: {
      initial: { y: -distance },
      animate: { y: 0, transition: transitionEnter(tIn) },
      exit: { y: -distance, transition: transitionExit(tOut) },
    },
    inLeft: {
      initial: { x: -distance },
      animate: { x: 0, transition: transitionEnter(tIn) },
      exit: { x: -distance, transition: transitionExit(tOut) },
    },
    inRight: {
      initial: { x: distance },
      animate: { x: 0, transition: transitionEnter(tIn) },
      exit: { x: distance, transition: transitionExit(tOut) },
    },
    outUp: {
      initial: { y: 0 },
      animate: { y: -distance, transition: transitionEnter(tIn) },
      exit: { y: 0, transition: transitionExit(tOut) },
    },
    outDown: {
      initial: { y: 0 },
      animate: { y: distance, transition: transitionEnter(tIn) },
      exit: { y: 0, transition: transitionExit(tOut) },
    },
    outLeft: {
      initial: { x: 0 },
      animate: { x: -distance, transition: transitionEnter(tIn) },
      exit: { x: 0, transition: transitionExit(tOut) },
    },
    outRight: {
      initial: { x: 0 },
      animate: { x: distance, transition: transitionEnter(tIn) },
      exit: { x: 0, transition: transitionExit(tOut) },
    },
  };

  return map[direction];
};
