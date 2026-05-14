import type { Variants, Transition } from 'framer-motion';

// ----------------------------------------------------------------------

type ContainerOptions = {
  transitionIn?: Transition;
  transitionOut?: Transition;
};

/**
 * Stagger container `Variants` factory.
 *
 * Children animate with a 50 ms stagger (`staggerChildren: 0.05`, `delayChildren: 0.05`).
 * On exit, children reverse-stagger (`staggerDirection: -1`).
 *
 * @example
 * ```tsx
 * <motion.div variants={container()} initial="initial" animate="animate" exit="exit">
 *   <motion.div variants={fade('inUp')}>Item 1</motion.div>
 *   <motion.div variants={fade('inUp')}>Item 2</motion.div>
 * </motion.div>
 * ```
 */
export const container = (options?: ContainerOptions): Variants => ({
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
      ...options?.transitionIn,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      ...options?.transitionOut,
    },
  },
});
