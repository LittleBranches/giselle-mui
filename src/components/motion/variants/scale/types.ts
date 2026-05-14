import type { Transition } from 'framer-motion';

// ----------------------------------------------------------------------

export type ScaleDirection = 'in' | 'inX' | 'inY' | 'out' | 'outX' | 'outY';

export type ScaleOptions = {
  transitionIn?: Transition;
  transitionOut?: Transition;
};
