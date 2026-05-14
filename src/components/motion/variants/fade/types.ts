import type { Transition } from 'framer-motion';

// ----------------------------------------------------------------------

export type FadeDirection =
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

export type FadeOptions = {
  /** Distance in px for directional fade. @default 120 */
  distance?: number;
  transitionIn?: Transition;
  transitionOut?: Transition;
};
