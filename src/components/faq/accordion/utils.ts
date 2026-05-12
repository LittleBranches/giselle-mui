import type { Variants, Transition } from 'framer-motion';

// ----------------------------------------------------------------------

const transitionEnter = (override?: Transition): Transition => ({
  duration: 0.64,
  ease: [0.43, 0.13, 0.23, 0.96],
  ...override,
});

const transitionExit = (override?: Transition): Transition => ({
  duration: 0.48,
  ease: [0.43, 0.13, 0.23, 0.96],
  ...override,
});

type FadeDirection = 'in' | 'inUp' | 'inDown' | 'inLeft' | 'inRight';

/**
 * Returns framer-motion `Variants` for a fade animation in the given direction.
 * @param direction - `'in'` | `'inUp'` | `'inDown'` | `'inLeft'` | `'inRight'`
 * @param distance - Translation distance in px. @default 120
 */
export const fadeVariants = (direction: FadeDirection, distance = 120): Variants => {
  const variants: Record<FadeDirection, Variants> = {
    in: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: transitionEnter() },
      exit: { opacity: 0, transition: transitionExit() },
    },
    inUp: {
      initial: { y: distance, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: transitionEnter() },
      exit: { y: distance, opacity: 0, transition: transitionExit() },
    },
    inDown: {
      initial: { y: -distance, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: transitionEnter() },
      exit: { y: -distance, opacity: 0, transition: transitionExit() },
    },
    inLeft: {
      initial: { x: -distance, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: transitionEnter() },
      exit: { x: -distance, opacity: 0, transition: transitionExit() },
    },
    inRight: {
      initial: { x: distance, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: transitionEnter() },
      exit: { x: distance, opacity: 0, transition: transitionExit() },
    },
  };
  return variants[direction];
};

/**
 * Returns framer-motion `Variants` for a stagger container.
 * Children animate with a 50 ms stagger delay.
 */
export const containerVariants = (): Variants => ({
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
});

/** SVG line draw transition (0.64 s ease). */
export const svgLineTransition: Transition = {
  duration: 0.64,
  ease: [0.43, 0.13, 0.23, 0.96],
};
