'use client';

import type React from 'react';
import type { MotionProps } from 'framer-motion';
import type { BoxProps } from '@mui/material/Box';
import type { Theme } from '@mui/material/styles';

import { motion } from 'framer-motion';

import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

import { container } from './container';

// ----------------------------------------------------------------------

export type MotionViewportProps = Omit<BoxProps, 'animate' | 'children'> &
  Omit<MotionProps, 'children'> & {
    /**
     * Disable the scroll-triggered animation on `sm` and below.
     * On small screens the section is often already fully visible on mount,
     * making the stagger animation jarring rather than pleasant.
     * @default true
     */
    disableAnimateOnMobile?: boolean;
    children?: React.ReactNode;
  };

/**
 * Scroll-triggered stagger container.
 *
 * Wraps children in a `motion.div` with `container()` variants that fire
 * once when the element enters the viewport. Children should use `fade`,
 * `slide`, or another variant factory that responds to the `initial`/`animate` keys.
 *
 * Animation is automatically disabled on `sm` and below when
 * `disableAnimateOnMobile` is `true` (default) — short mobile viewports
 * skip the stagger to avoid content appearing off-screen on first render.
 *
 * **Important:** uses `motion.div`, not `m.div`. The `m.*` API requires
 * `LazyMotion` in the consumer's tree — `motion.*` works without a provider.
 *
 * @example
 * ```tsx
 * <MotionViewport>
 *   <motion.div variants={fade('inUp')}>Title</motion.div>
 *   <motion.div variants={fade('inUp')}>Body</motion.div>
 * </MotionViewport>
 * ```
 */
export function MotionViewport({
  children,
  viewport,
  sx,
  disableAnimateOnMobile = true,
  ...other
}: MotionViewportProps) {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  if (smDown && disableAnimateOnMobile) {
    return (
      <Box sx={sx} {...other}>
        {children}
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      initial="initial"
      whileInView="animate"
      variants={container()}
      viewport={{ once: true, amount: 0.3, ...viewport }}
      sx={sx}
      {...other}
    >
      {children}
    </Box>
  );
}
