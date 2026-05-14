import type { ReactNode } from 'react';

import type { BoxProps } from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/**
 * Palette color key for the `HeroSection` background tint.
 */
export type HeroColorKey = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

export interface HeroSectionProps extends Omit<BoxProps, 'color'> {
  /**
   * Heading slot. Render a `<Typography variant="h1">` (or any heading element) here.
   * The component does not wrap this in any element — whatever you pass is rendered directly.
   */
  headline: ReactNode;
  /**
   * Subtitle slot rendered below the headline. Render a `<Typography variant="h5">` or
   * similar here. Omit to render a headline-only hero.
   */
  subtitle?: ReactNode;
  /**
   * Optional CTA slot. Render one or more `Button` elements here.
   * They are laid out in a centred, wrapping flex row.
   */
  actions?: ReactNode;
  /**
   * MUI palette colour key used to derive the background tint.
   * The tint is `channelAlpha(mainChannel, 0.08)` — subtle, works in light and dark mode.
   * @default 'primary'
   */
  color?: HeroColorKey;
  /** MUI `sx` override on the root `Box`. */
  sx?: SxProps<Theme>;
}
