import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// InteractiveHeroLogo sx constants

/** Layer 1 — original logo / animated frame. */
export const originalLayerSx: SxProps<Theme> = {
  position: 'relative',
  zIndex: 1,
  width: 1,
  height: 1,
  willChange: 'transform',
};

/** Layer 2 — artistic / alternate logo overlay. */
export const artisticLogoSx: SxProps<Theme> = {
  inset: 0,
  zIndex: 2,
  width: 1,
  height: 1,
  objectFit: 'contain',
  objectPosition: 'center center',
  position: 'absolute',
  pointerEvents: 'none',
};

/** Layer 3 — portrait image wrapper (positioned and scaled). */
export const portraitWrapperSx: SxProps<Theme> = {
  top: '50%',
  left: '50%',
  zIndex: 3,
  width: '100%',
  height: '100%',
  overflow: 'visible',
  objectFit: 'contain',
  objectPosition: 'center center',
  position: 'absolute',
  pointerEvents: 'none',
  transform: 'translate(-50%, -50%) scale(3.8)',
};

/** Inner `<img>` element inside the portrait wrapper. */
export const portraitImageSx: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  objectPosition: 'center center',
  display: 'block',
};

/** Stacking container for all three layers. */
export const innerContainerSx: SxProps<Theme> = {
  position: 'relative',
  display: 'inline-flex',
  width: 1,
  height: 1,
  overflow: 'visible',
  transformStyle: 'preserve-3d',
  transition: 'filter 240ms ease',
  mb: { xs: 0 },
};

/**
 * Outermost perspective root.
 * @param cursor - CSS cursor value driven by hover/drag state.
 */
export const rootBoxSx =
  (cursor: string): SxProps<Theme> =>
  () => ({
    perspective: 1200,
    cursor,
    overflow: 'visible',
  });

/** Relative positioning wrapper for the 3-D layer stack. */
export const logoStack3dWrapperSx: SxProps<Theme> = {
  position: 'relative',
  width: 1,
  height: 1,
};
