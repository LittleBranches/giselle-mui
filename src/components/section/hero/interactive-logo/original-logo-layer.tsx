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
 * slotted `children`. When `hasArtisticContent` is `true`, this layer fades in
 * during the `'artistic'` hover phase (the artistic overlay is shown at rest).
 * When `hasArtisticContent` is `false`, this layer stays visible at full opacity
 * so the children are always shown — providing a basic hover-tilt experience
 * without requiring an artistic logo.
 */
export function OriginalLogoLayer({
  hoverPhase,
  logoFadeTransition,
  activeFrame,
  logoAlt,
  hasArtisticContent = false,
  children,
}: OriginalLogoLayerProps): ReactNode {
  const isArtistic = hoverPhase === 'artistic';
  const animateOpacity = isArtistic || !hasArtisticContent ? 1 : 0;
  const animateScale = isArtistic || !hasArtisticContent ? 1 : 0.985;
  const animateFilter = isArtistic || !hasArtisticContent ? 'blur(0px)' : 'blur(4px)';

  return (
    <Box
      component={motion.div}
      initial={{
        opacity: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      animate={{
        opacity: animateOpacity,
        scale: animateScale,
        filter: animateFilter,
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
