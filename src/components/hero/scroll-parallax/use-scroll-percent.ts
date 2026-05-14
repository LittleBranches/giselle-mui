'use client';

import { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

import type { UseScrollPercentResult } from './types';

// ----------------------------------------------------------------------

/**
 * Tracks how far the user has scrolled through the hero section as a percentage (0–100).
 *
 * Attach `elementRef` to the hero section's root element. `percent` updates on every
 * scroll event and is clamped to [0, 100]. `scrollY` is the raw framer-motion window
 * scroll MotionValue — pass it to `useTransformY` to drive parallax layers.
 *
 * @example
 * ```tsx
 * const { elementRef, percent, scrollY } = useScrollPercent();
 * const y = useTransformY(scrollY, percent * -7);
 * return <Box ref={elementRef}><motion.div style={{ y }}>{children}</motion.div></Box>;
 * ```
 */
export function useScrollPercent(): UseScrollPercentResult {
  const elementRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [percent, setPercent] = useState(0);

  useMotionValueEvent(scrollY, 'change', (scrollHeight) => {
    let heroHeight = 0;
    if (elementRef.current) heroHeight = elementRef.current.offsetHeight;
    const scrollPercent = Math.floor((scrollHeight / heroHeight) * 100);
    setPercent(scrollPercent >= 100 ? 100 : Math.floor(scrollPercent));
  });

  return { elementRef, percent, scrollY };
}
