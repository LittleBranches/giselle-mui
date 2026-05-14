import type { Transition } from 'framer-motion';

// ----------------------------------------------------------------------

/**
 * Returns a `whileHover` scale target for a `motion.*` element.
 *
 * @param value - Scale on hover. @default 1.09
 *
 * @example
 * ```tsx
 * <motion.div whileHover={hover()}>Hover me</motion.div>
 * <motion.button whileHover={hover(1.05)} whileTap={tap()}>Click</motion.button>
 * ```
 */
export const hover = (value = 1.09): { scale: number } => ({ scale: value });

/**
 * Returns a `whileTap` scale target for a `motion.*` element.
 *
 * @param value - Scale on press. @default 0.9
 */
export const tap = (value = 0.9): { scale: number } => ({ scale: value });

/**
 * Spring transition for tap interactions.
 * Feels snappy: `stiffness: 400, damping: 18`.
 */
export const transitionTap = (props?: Transition): Transition => ({
  type: 'spring',
  stiffness: 400,
  damping: 18,
  ...props,
});

/**
 * Ease transition for hover interactions.
 */
export const transitionHover = (props?: Transition): Transition => ({
  duration: 0.32,
  ease: [0.43, 0.13, 0.23, 0.96],
  ...props,
});
