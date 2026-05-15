'use client';

import { motion } from 'framer-motion';

import Box from '@mui/material/Box';

import { container } from '../variants/container';
import type { MotionContainerProps } from './types';

// ----------------------------------------------------------------------

/**
 * A stagger wrapper for framer-motion animations.
 *
 * Wraps children in a `motion.div` with `container()` variants.
 * Children should use `fade`, `slide`, or other variant factories
 * that respond to the `initial`/`animate`/`exit` keys.
 *
 * **Important:** uses `motion.div`, not `m.div`. The `m.*` API requires
 * `LazyMotion` in the consumer's tree — `motion.*` works without a provider.
 *
 * @example
 * ```tsx
 * <MotionContainer>
 *   <motion.div variants={fade('inUp')}>Item 1</motion.div>
 *   <motion.div variants={fade('inUp')}>Item 2</motion.div>
 * </MotionContainer>
 * ```
 */
export function MotionContainer({
  animate,
  children,
  action = false,
  ...other
}: MotionContainerProps) {
  const animateValue = action && !animate ? 'exit' : 'animate';

  return (
    <Box
      component={motion.div}
      variants={container()}
      initial={action ? false : 'initial'}
      animate={animateValue}
      exit={action ? undefined : 'exit'}
      {...other}
    >
      {children}
    </Box>
  );
}
