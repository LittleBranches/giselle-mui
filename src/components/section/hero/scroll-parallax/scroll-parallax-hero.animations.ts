import type { MotionProps, Transition } from 'framer-motion';

import { fade } from '../../../motion/variants/fade';

// ----------------------------------------------------------------------

/**
 * Default motion props for `AnimatedHeroHeading`.
 *
 * Uses `variants: fade('inUp', ...)` so the heading participates in parent
 * `MotionContainer` / `MotionViewport` stagger orchestration.
 * Override via the `motionProps` prop when stagger is not needed.
 */
export const headingMotionProps: MotionProps = {
  variants: fade('inUp', { distance: 24 }),
};

/**
 * Animate target for the cycling gradient highlight span.
 * Drives `backgroundPosition` from its CSS initial value to `200% center`.
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
