import type { Transition } from 'framer-motion';

// ----------------------------------------------------------------------

export type FlipDirection = 'inX' | 'inY' | 'outX' | 'outY';

export type FlipOptions = {
  transitionIn?: Transition;
  transitionOut?: Transition;
};
