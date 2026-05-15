import type { Transition } from 'framer-motion';

// ----------------------------------------------------------------------

export type RotateDirection = 'in' | 'out';

export type RotateOptions = {
  /** Rotation in degrees. @default 360 */
  deg?: number;
  transitionIn?: Transition;
  transitionOut?: Transition;
};
