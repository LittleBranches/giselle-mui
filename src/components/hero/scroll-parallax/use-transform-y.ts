import type { RefObject } from 'react';
import type { MotionValue } from 'framer-motion';
import { useSpring, useTransform } from 'framer-motion';

// ----------------------------------------------------------------------

/**
 * Spring-physics parallax y-offset.
 *
 * Transforms a framer-motion `MotionValue<number>` (window `scrollY` in pixels) into a
 * spring-animated y-translation proportional to how far the hero has been scrolled.
 * Pass a negative `distance` to move the layer upward as the user scrolls down.
 *
 * Reads `elementRef.current.offsetHeight` on each scroll event so the output range
 * scales correctly regardless of the hero's rendered height.
 *
 * Spring constants: `mass=0.1, damping=20, stiffness=300` — snappy, low-latency feel.
 *
 * @example
 * ```tsx
 * const { elementRef, scrollY } = useScrollPercent();
 * const y = useTransformY(scrollY, elementRef, -7);
 * return <motion.div style={{ y }}>{children}</motion.div>;
 * ```
 */
export function useTransformY(
  value: MotionValue<number>,
  elementRef: RefObject<HTMLDivElement | null>,
  distance: number
): MotionValue<number> {
  return useSpring(
    useTransform(value, (scrollY: number) => {
      const heroHeight = elementRef.current?.offsetHeight;
      if (!heroHeight) return 0;
      return (scrollY / heroHeight) * distance;
    }),
    {
      mass: 0.1,
      damping: 20,
      stiffness: 300,
      restDelta: 0.001,
    }
  );
}
