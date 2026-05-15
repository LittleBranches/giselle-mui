import type { Transition } from 'framer-motion';

// ----------------------------------------------------------------------

/** SVG line draw transition (0.64 s ease — FAQ-specific). */
export const svgLineTransition: Transition = {
  duration: 0.64,
  ease: [0.43, 0.13, 0.23, 0.96],
};
