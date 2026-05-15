import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// scroll-parallax-hero — sx constants used only in Storybook stories.
// Extracted per the >3-property rule: inline sx objects with more than
// ~3 properties belong in a *.styles.ts companion file.
// ----------------------------------------------------------------------

/**
 * Gradient overlay used by the `GradientBackground` helper in stories.
 *
 * Fills the parent container with a diagonal primary→secondary gradient at 12% opacity.
 * Consumes MUI CSS variable palette tokens so it adapts to both light and dark mode.
 */
export const gradientBackgroundSx: SxProps<Theme> = (theme) => ({
  position: 'absolute',
  inset: 0,
  background: `linear-gradient(135deg, ${theme.vars!.palette.primary.dark} 0%, ${theme.vars!.palette.secondary.dark} 100%)`,
  opacity: 0.12,
  zIndex: 0,
});
