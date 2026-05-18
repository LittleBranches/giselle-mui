import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

/** Palette color keys accepted by AnimatedGradientText. */
export type PaletteColorKey = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

export interface AnimatedGradientTextProps extends Omit<BoxProps, 'color'> {
  /**
   * Palette color key for the gradient start and loop-back color.
   * @default 'primary'
   */
  color1?: PaletteColorKey;
  /**
   * Palette color key for the gradient midpoint color.
   * @default 'secondary'
   */
  color2?: PaletteColorKey;
  /**
   * Animation cycle duration in seconds. Must be positive.
   * @default 3
   */
  duration?: number;
}
