'use client';

import type { ReactNode } from 'react';
import type { ArtisticLogoLayerProps } from './types';

import { motion } from 'framer-motion';

import Box from '@mui/material/Box';

import { artisticLogoSx } from './interactive-logo.styles';

// ----------------------------------------------------------------------

/**
 * Layer 2 (z-index 2) — the artistic logo.
 *
 * An absolute-positioned `<img>` that fades in during the `'idle'` hover
 * phase, giving the logo a distinct watercolour-style look at rest.
 *
 * Returns `null` when no `artisticLogoSrc` is provided so the layer is
 * entirely absent from the DOM until a source is supplied.
 */
export function ArtisticLogoLayer({
  artisticLogoSrc,
  showArtisticLogo,
  logoFadeTransition,
  logoAlt,
}: ArtisticLogoLayerProps): ReactNode {
  if (!artisticLogoSrc) {
    return null;
  }

  return (
    <Box
      component={motion.img}
      alt={logoAlt ?? 'Logo'}
      src={artisticLogoSrc}
      initial={{
        opacity: 1,
        scale: 1.03,
        filter: 'blur(8px)',
      }}
      animate={{
        opacity: showArtisticLogo ? 1 : 0,
        scale: showArtisticLogo ? 1 : 1.03,
        filter: showArtisticLogo ? 'blur(0px)' : 'blur(8px)',
      }}
      transition={logoFadeTransition}
      sx={artisticLogoSx}
    />
  );
}
