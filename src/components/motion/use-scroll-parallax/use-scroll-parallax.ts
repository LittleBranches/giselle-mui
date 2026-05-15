'use client';

import { useRef } from 'react';
import { useScroll, useTransform, useSpring } from 'framer-motion';

import {
  LAYER_MULTIPLIERS,
  USE_SCROLL_PARALLAX_SPRING_MASS,
  USE_SCROLL_PARALLAX_SPRING_DAMPING,
  USE_SCROLL_PARALLAX_SPRING_STIFFNESS,
} from './use-scroll-parallax.const';
import type { UseScrollParallaxResult } from './types';

// ----------------------------------------------------------------------

/**
 * Returns 5 spring-smoothed parallax `y` motion values driven by element scroll.
 *
 * Spring physics: `mass: 0.1, damping: 20, stiffness: 300`.
 * Each layer travels a different distance (±40 → ±200 px) as the element
 * scrolls through the viewport.
 *
 * @example
 * ```tsx
 * const { ref, layers } = useScrollParallax();
 * return (
 *   <div ref={ref}>
 *     <motion.div style={{ y: layers[0] }}>Back layer (slowest)</motion.div>
 *     <motion.div style={{ y: layers[2] }}>Mid layer</motion.div>
 *     <motion.div style={{ y: layers[4] }}>Front layer (fastest)</motion.div>
 *   </div>
 * );
 * ```
 */
export function useScrollParallax(): UseScrollParallaxResult {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const springConfig = {
    mass: USE_SCROLL_PARALLAX_SPRING_MASS,
    damping: USE_SCROLL_PARALLAX_SPRING_DAMPING,
    stiffness: USE_SCROLL_PARALLAX_SPRING_STIFFNESS,
  };

  // Fixed 5 hook calls — never conditional, never in a loop.
  const t0 = useTransform(scrollYProgress, [0, 1], [-LAYER_MULTIPLIERS[0], LAYER_MULTIPLIERS[0]]);
  const t1 = useTransform(scrollYProgress, [0, 1], [-LAYER_MULTIPLIERS[1], LAYER_MULTIPLIERS[1]]);
  const t2 = useTransform(scrollYProgress, [0, 1], [-LAYER_MULTIPLIERS[2], LAYER_MULTIPLIERS[2]]);
  const t3 = useTransform(scrollYProgress, [0, 1], [-LAYER_MULTIPLIERS[3], LAYER_MULTIPLIERS[3]]);
  const t4 = useTransform(scrollYProgress, [0, 1], [-LAYER_MULTIPLIERS[4], LAYER_MULTIPLIERS[4]]);

  const l0 = useSpring(t0, springConfig);
  const l1 = useSpring(t1, springConfig);
  const l2 = useSpring(t2, springConfig);
  const l3 = useSpring(t3, springConfig);
  const l4 = useSpring(t4, springConfig);

  return { ref, layers: [l0, l1, l2, l3, l4] };
}
