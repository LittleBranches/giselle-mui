import type { Theme } from '@mui/material/styles';

import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

import type { FaqMotionViewportProps } from './types';
import { container } from '../../motion/variants/container';

// ----------------------------------------------------------------------

// Created once at module load — never inside the render function.
const MotionBox = motion(Box);

// ----------------------------------------------------------------------

/**
 * Scroll-triggered animation container for `FaqSection`.
 * Wraps children in a framer-motion stagger container that fires once when
 * the section enters the viewport.
 *
 * Animation is disabled on `sm` and below — short viewports skip the
 * stagger to avoid content appearing off-screen on first render.
 *
 * @internal — used by `FaqSection` only.
 *
 * **Quality status (13 May 2026):** DoD 9/9 · Best practices 13/13
 */
export function FaqMotionViewport({ children, sx }: FaqMotionViewportProps) {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  if (smDown) {
    return <Box sx={sx}>{children}</Box>;
  }

  return (
    <MotionBox
      initial="initial"
      whileInView="animate"
      variants={container()}
      viewport={{ once: true, amount: 0.3 }}
      sx={sx}
    >
      {children}
    </MotionBox>
  );
}
