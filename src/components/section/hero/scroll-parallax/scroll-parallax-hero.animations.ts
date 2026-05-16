import type { MotionProps } from 'framer-motion';

// ----------------------------------------------------------------------

/** Framer Motion fade-inUp entry props for the heading `motion.div`. */
export const headingMotionProps: MotionProps = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
};

/** Animate object for the gradient highlight `<span>` — cycles `backgroundPosition`. */
export const gradientHighlightAnimate = {
  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
};

/** Transition for `gradientHighlightAnimate` — infinite linear loop over 4 s. */
export const gradientHighlightTransition = {
  duration: 4,
  ease: 'linear' as const,
  repeat: Infinity,
};
