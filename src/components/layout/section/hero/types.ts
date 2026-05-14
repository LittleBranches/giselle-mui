import type { ReactNode } from 'react';

import type { BoxProps } from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

import type { HeroSlotProps } from '../../../hero/types';

// ----------------------------------------------------------------------

/**
 * Palette color key for the `HeroSection` background tint.
 */
export type HeroColorKey = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

export interface HeroSectionProps extends Omit<BoxProps, 'color'>, HeroSlotProps {
  /**
   * Primary headline slot. Required — a hero without a heading is not a hero.
   *
   * Render a `<Typography variant="h1">`, a `<SectionTitle>`, or any heading element.
   * `AnimatedGradientText` can be embedded here for an animated accent word.
   */
  heading: ReactNode;
  /**
   * MUI palette colour key used to derive the background tint.
   * The tint is `channelAlpha(mainChannel, 0.08)` — subtle, works in light and dark mode.
   * @default 'primary'
   */
  color?: HeroColorKey;
  /** MUI `sx` override on the root `Box`. */
  sx?: SxProps<Theme>;
}

// Re-export for convenience — consumers importing from the hero section barrel
// get the shared base type without a separate import.
export type { HeroSlotProps } from '../../../hero/types';
