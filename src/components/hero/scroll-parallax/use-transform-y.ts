import type { MotionValue } from 'framer-motion';
import { useSpring, useTransform } from 'framer-motion';

// ----------------------------------------------------------------------

/**
 * Spring-physics parallax y-offset.
 *
 * Transforms a framer-motion `MotionValue<number>` (range [0, 1]) into a
 * spring-animated y-translation. Pass a negative `distance` to move the layer
 * upward as the user scrolls down, creating a parallax depth illusion.
 *
 * Spring constants: `mass=0.1, damping=20, stiffness=300` — these match the
 * reference implementation and produce a snappy, low-latency feel.
 *
 * @example
 * ```tsx
 * const { scrollY, percent } = useScrollPercent();
 * const y = useTransformY(scrollY, percent * -7);
 * return <motion.div style={{ y }}>{children}</motion.div>;
 * ```
 */
export function useTransformY(value: MotionValue<number>, distance: number): MotionValue<number> {
  return useSpring(useTransform(value, [0, 1], [0, distance]), {
    mass: 0.1,
    damping: 20,
    stiffness: 300,
    restDelta: 0.001,
  });
}
