'use client';

import type { ReactNode } from 'react';
import type { OriginalLogoLayerProps } from './types';

import { motion } from 'framer-motion';

import Box from '@mui/material/Box';

import { originalLayerSx } from './interactive-logo.styles';

// ----------------------------------------------------------------------

/**
 * Layer 1 (z-index 1) — the original logo.
 *
 * Renders either a frame from the scrub animation (`activeFrame`) or the
 * slotted `children`. Fades in during the `'artistic'` hover phase and
 * fades out at all other phases.
 */
export function OriginalLogoLayer({
  hoverPhase,
  logoFadeTransition,
  activeFrame,
  logoAlt,
  children,
}: OriginalLogoLayerProps): ReactNode {
  return (
    <Box
      component={motion.div}
      initial={{
        opacity: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      animate={{
        opacity: hoverPhase === 'artistic' ? 1 : 0,
        scale: hoverPhase === 'artistic' ? 1 : 0.985,
        filter: hoverPhase === 'artistic' ? 'blur(0px)' : 'blur(4px)',
      }}
      transition={logoFadeTransition}
      sx={originalLayerSx}
    >
      {activeFrame ? (
        <Box
          component="img"
          alt={logoAlt ?? 'Logo'}
          src={activeFrame}
          sx={{ width: 1, height: 1 }}
        />
      ) : (
        children
      )}
    </Box>
  );
}
