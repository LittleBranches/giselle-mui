import type { Transition } from 'framer-motion';

// ----------------------------------------------------------------------

export type BounceDirection =
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

export type BounceOptions = {
  /** Distance in px for directional bounce. @default 720 */
  distance?: number;
  transition?: Transition;
};
