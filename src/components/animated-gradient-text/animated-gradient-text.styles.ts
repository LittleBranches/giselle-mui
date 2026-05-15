import type { SxProps, Theme } from '@mui/material/styles';

import type { PaletteColorKey } from './types';

// ----------------------------------------------------------------------

/**
 * Returns `SxProps` that apply a cycling gradient text effect.
 *
 * Uses `var(--mui-palette-<key>-main)` CSS custom properties so it works in
 * both light and dark mode without a theme callback.
 *
 * `display: 'inline-block'` is required — `backgroundClip: 'text'` has no
 * effect on `display: inline` elements in most browsers.
 */
export const gradientTextSx = (
  color1: PaletteColorKey,
  color2: PaletteColorKey,
  duration: number
): SxProps<Theme> => ({
  background: `linear-gradient(135deg, var(--mui-palette-${color1}-main), var(--mui-palette-${color2}-main), var(--mui-palette-${color1}-main))`,
  backgroundSize: '200% 200%',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
  animation: `animatedGradientText ${duration}s ease infinite`,
  '@keyframes animatedGradientText': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
});
