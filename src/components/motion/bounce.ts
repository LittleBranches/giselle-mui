import type { Variants, Transition } from 'framer-motion';

import { transitionEnter, transitionExit } from './transition';

// ----------------------------------------------------------------------

type BounceDirection =
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

type BounceOptions = {
  /** Distance in px for directional bounce. @default 720 */
  distance?: number;
  transition?: Transition;
};

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
  const distance = options?.distance ?? 720;
  const t = options?.transition;

  const map: Record<BounceDirection, Variants> = {
    in: {
      initial: {},
      animate: {
        scale: [0.3, 1.1, 0.9, 1.03, 0.97, 1],
        opacity: [0, 1, 1, 1, 1, 1],
        transition: transitionEnter(t),
      },
    },
    inUp: {
      initial: {},
      animate: {
        y: [distance, -24, 12, -4, 0],
        scaleY: [4, 0.9, 0.95, 0.985, 1],
        opacity: [0, 1, 1, 1, 1],
        transition: transitionEnter(t),
      },
    },
    inDown: {
      initial: {},
      animate: {
        y: [-distance, 24, -12, 4, 0],
        scaleY: [4, 0.9, 0.95, 0.985, 1],
        opacity: [0, 1, 1, 1, 1],
        transition: transitionEnter(t),
      },
    },
    inLeft: {
      initial: {},
      animate: {
        x: [-distance, 24, -12, 4, 0],
        scaleX: [3, 1, 0.98, 0.995, 1],
        opacity: [0, 1, 1, 1, 1],
        transition: transitionEnter(t),
      },
    },
    inRight: {
      initial: {},
      animate: {
        x: [distance, -24, 12, -4, 0],
        scaleX: [3, 1, 0.98, 0.995, 1],
        opacity: [0, 1, 1, 1, 1],
        transition: transitionEnter(t),
      },
    },
    out: {
      animate: {
        scale: [0.9, 1.1, 0.3],
        opacity: [1, 1, 0],
        transition: transitionExit(t),
      },
    },
    outUp: {
      animate: {
        y: [-12, 24, -distance],
        scaleY: [0.985, 0.9, 3],
        opacity: [1, 1, 0],
        transition: transitionExit(t),
      },
    },
    outDown: {
      animate: {
        y: [12, -24, distance],
        scaleY: [0.985, 0.9, 3],
        opacity: [1, 1, 0],
        transition: transitionExit(t),
      },
    },
    outLeft: {
      animate: {
        x: [0, 24, -distance],
        scaleX: [1, 0.9, 2],
        opacity: [1, 1, 0],
        transition: transitionExit(t),
      },
    },
    outRight: {
      animate: {
        x: [0, -24, distance],
        scaleX: [1, 0.9, 2],
        opacity: [1, 1, 0],
        transition: transitionExit(t),
      },
    },
  };

  return map[direction];
};
