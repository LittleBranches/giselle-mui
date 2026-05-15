import type { MotionValue } from 'framer-motion';
import type React from 'react';

// ----------------------------------------------------------------------

export interface UseScrollParallaxResult {
  /** Attach to the element whose scroll position drives the parallax. */
  ref: React.RefObject<HTMLDivElement | null>;
  /**
   * Five spring-smoothed `y` motion values, slowest → fastest
   * (`layers[0]` ±40px … `layers[4]` ±200px).
   *
   * Use only the layers you need — unused layers have no runtime cost.
   */
  layers: [
    MotionValue<number>,
    MotionValue<number>,
    MotionValue<number>,
    MotionValue<number>,
    MotionValue<number>,
  ];
}
