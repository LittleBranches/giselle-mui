import type React from 'react';
import type { ViewportOptions } from 'framer-motion';
import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

/**
 * Props for `MotionViewport`.
 *
 * Extends `BoxProps` only — framer-motion props are managed internally.
 * The animation is fully encapsulated: `initial`, `whileInView`, `variants`,
 * and `exit` are not forwarded by consumers.
 */
export type MotionViewportProps = Omit<BoxProps, 'animate' | 'children'> & {
  /**
   * Framer-motion viewport intersection options.
   * Merged with defaults `{ once: true, amount: 0.3 }`.
   */
  viewport?: ViewportOptions;
  /**
   * Disable the scroll-triggered animation on `sm` and below.
   * On small screens the section is often already fully visible on mount,
   * making the stagger animation jarring rather than pleasant.
   * @default true
   */
  disableAnimateOnMobile?: boolean;
  children?: React.ReactNode;
};
