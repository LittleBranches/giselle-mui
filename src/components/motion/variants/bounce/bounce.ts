import type { Variants } from 'framer-motion';

import { transitionEnter, transitionExit } from '../transition';
import {
  BOUNCE_DEFAULT_DISTANCE,
  BOUNCE_IN_SCALE_KEYFRAMES,
  BOUNCE_IN_OPACITY_KEYFRAMES,
  BOUNCE_IN_SCALE_Y_KEYFRAMES,
  BOUNCE_IN_SCALE_X_KEYFRAMES,
  BOUNCE_IN_DIRECTIONAL_OPACITY_KEYFRAMES,
  BOUNCE_IN_UP_Y_KEYFRAMES,
  BOUNCE_IN_DOWN_Y_KEYFRAMES,
  BOUNCE_IN_LEFT_X_KEYFRAMES,
  BOUNCE_IN_RIGHT_X_KEYFRAMES,
  BOUNCE_OUT_SCALE_KEYFRAMES,
  BOUNCE_OUT_OPACITY_KEYFRAMES,
  BOUNCE_OUT_SCALE_Y_KEYFRAMES,
  BOUNCE_OUT_SCALE_X_KEYFRAMES,
  BOUNCE_OUT_UP_Y_KEYFRAMES,
  BOUNCE_OUT_DOWN_Y_KEYFRAMES,
  BOUNCE_OUT_LEFT_X_KEYFRAMES,
  BOUNCE_OUT_RIGHT_X_KEYFRAMES,
} from './bounce.const';
import type { BounceDirection, BounceOptions } from './types';

// ----------------------------------------------------------------------

/**
 * Bounce motion `Variants` factory.
 *
 * Supports 10 directions: `'in'`, `'inUp'`, `'inDown'`, `'inLeft'`, `'inRight'`,
 * `'out'`, `'outUp'`, `'outDown'`, `'outLeft'`, `'outRight'`.
 *
 * @example
 * ```tsx
 * <motion.div variants={bounce('inUp')} initial="initial" animate="animate" />
 * ```
 */
export const bounce = (direction: BounceDirection, options?: BounceOptions): Variants => {
  const distance = options?.distance ?? BOUNCE_DEFAULT_DISTANCE;
  const t = options?.transition;

  const map: Record<BounceDirection, Variants> = {
    in: {
      initial: {},
      animate: {
        scale: [...BOUNCE_IN_SCALE_KEYFRAMES],
        opacity: [...BOUNCE_IN_OPACITY_KEYFRAMES],
        transition: transitionEnter(t),
      },
    },
    inUp: {
      initial: {},
      animate: {
        y: BOUNCE_IN_UP_Y_KEYFRAMES(distance),
        scaleY: [...BOUNCE_IN_SCALE_Y_KEYFRAMES],
        opacity: [...BOUNCE_IN_DIRECTIONAL_OPACITY_KEYFRAMES],
        transition: transitionEnter(t),
      },
    },
    inDown: {
      initial: {},
      animate: {
        y: BOUNCE_IN_DOWN_Y_KEYFRAMES(distance),
        scaleY: [...BOUNCE_IN_SCALE_Y_KEYFRAMES],
        opacity: [...BOUNCE_IN_DIRECTIONAL_OPACITY_KEYFRAMES],
        transition: transitionEnter(t),
      },
    },
    inLeft: {
      initial: {},
      animate: {
        x: BOUNCE_IN_LEFT_X_KEYFRAMES(distance),
        scaleX: [...BOUNCE_IN_SCALE_X_KEYFRAMES],
        opacity: [...BOUNCE_IN_DIRECTIONAL_OPACITY_KEYFRAMES],
        transition: transitionEnter(t),
      },
    },
    inRight: {
      initial: {},
      animate: {
        x: BOUNCE_IN_RIGHT_X_KEYFRAMES(distance),
        scaleX: [...BOUNCE_IN_SCALE_X_KEYFRAMES],
        opacity: [...BOUNCE_IN_DIRECTIONAL_OPACITY_KEYFRAMES],
        transition: transitionEnter(t),
      },
    },
    out: {
      animate: {
        scale: [...BOUNCE_OUT_SCALE_KEYFRAMES],
        opacity: [...BOUNCE_OUT_OPACITY_KEYFRAMES],
        transition: transitionExit(t),
      },
    },
    outUp: {
      animate: {
        y: BOUNCE_OUT_UP_Y_KEYFRAMES(distance),
        scaleY: [...BOUNCE_OUT_SCALE_Y_KEYFRAMES],
        opacity: [...BOUNCE_OUT_OPACITY_KEYFRAMES],
        transition: transitionExit(t),
      },
    },
    outDown: {
      animate: {
        y: BOUNCE_OUT_DOWN_Y_KEYFRAMES(distance),
        scaleY: [...BOUNCE_OUT_SCALE_Y_KEYFRAMES],
        opacity: [...BOUNCE_OUT_OPACITY_KEYFRAMES],
        transition: transitionExit(t),
      },
    },
    outLeft: {
      animate: {
        x: BOUNCE_OUT_LEFT_X_KEYFRAMES(distance),
        scaleX: [...BOUNCE_OUT_SCALE_X_KEYFRAMES],
        opacity: [...BOUNCE_OUT_OPACITY_KEYFRAMES],
        transition: transitionExit(t),
      },
    },
    outRight: {
      animate: {
        x: BOUNCE_OUT_RIGHT_X_KEYFRAMES(distance),
        scaleX: [...BOUNCE_OUT_SCALE_X_KEYFRAMES],
        opacity: [...BOUNCE_OUT_OPACITY_KEYFRAMES],
        transition: transitionExit(t),
      },
    },
  };

  return map[direction];
};
