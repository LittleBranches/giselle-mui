import type { Variants } from 'framer-motion';

import {
  CONTAINER_STAGGER_CHILDREN,
  CONTAINER_DELAY_CHILDREN,
  CONTAINER_EXIT_STAGGER_DIRECTION,
} from './container.const';
import type { ContainerOptions } from './types';

// ----------------------------------------------------------------------

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
      staggerChildren: CONTAINER_STAGGER_CHILDREN,
      delayChildren: CONTAINER_DELAY_CHILDREN,
      ...options?.transitionIn,
    },
  },
  exit: {
    transition: {
      staggerChildren: CONTAINER_STAGGER_CHILDREN,
      staggerDirection: CONTAINER_EXIT_STAGGER_DIRECTION,
      ...options?.transitionOut,
    },
  },
});
