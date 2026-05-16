import type { MotionProps, Transition } from 'framer-motion';

import { fade } from '../../../motion/variants/fade';

// ----------------------------------------------------------------------

/**
 * Animate target for the cycling gradient highlight span.
 * Drives the `backgroundPosition` from its initial CSS value to `200% center`.
 */
export const gradientHighlightAnimate = { backgroundPosition: '200% center' } as const;

/**
 * Transition for the infinitely cycling gradient highlight span.
 *
 * 20-second linear loop so the colour wash is slow and non-distracting.
 * `repeatType: 'reverse'` makes the gradient oscillate rather than jump at the wrap point.
 */
export const gradientHighlightTransition: Transition = {
  duration: 20,
  ease: 'linear',
  repeat: Infinity,
  repeatType: 'reverse',
};

/**
 * Default motion props for `AnimatedHeroHeading`.
 *
 * Fades the heading upward 24px on mount using the shared `fade` variant factory.
 * Can be overridden via the `motionProps` prop.
 */
export const headingMotionProps: MotionProps = {
  variants: fade('inUp', { distance: 24 }),
};
