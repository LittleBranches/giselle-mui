import type { Transition } from 'framer-motion';

// ----------------------------------------------------------------------

export type ZoomDirection =
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

export type ZoomOptions = {
  /** Distance in px for directional zoom. @default 720 */
  distance?: number;
  transitionIn?: Transition;
  transitionOut?: Transition;
};
