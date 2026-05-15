import type { Transition } from 'framer-motion';

// ----------------------------------------------------------------------

export type SlideDirection =
  | 'inUp'
  | 'inDown'
  | 'inLeft'
  | 'inRight'
  | 'outUp'
  | 'outDown'
  | 'outLeft'
  | 'outRight';

export type SlideOptions = {
  /** Distance in px. @default 160 */
  distance?: number;
  transitionIn?: Transition;
  transitionOut?: Transition;
};
