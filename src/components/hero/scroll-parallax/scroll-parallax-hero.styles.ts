import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// ScrollParallaxHero — sx constants and factories
// ----------------------------------------------------------------------

/**
 * Root `<section>` — sets the scroll frame height.
 *
 * On md+: fixes to 100vh so content stays in view while the user scrolls through
 * the outer placeholder div. `willChange: 'opacity'` hints the browser to composite
 * this layer independently.
 */
export const heroRootSx: SxProps<Theme> = (theme) => ({
  overflow: 'hidden',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    minHeight: 760,
    height: '100vh',
    maxHeight: 1440,
    display: 'block',
    willChange: 'opacity',
  },
});

/**
 * Inner Box — layout spine for the hero content.
 *
 * On md+: `position: fixed` so the content panel stays anchored to the viewport
 * while the outer section div scrolls past it (the parallax-scroll illusion).
 */
export const heroInnerWrapSx: SxProps<Theme> = (theme) => ({
  width: 1,
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    height: 1,
    position: 'fixed',
    maxHeight: 'inherit',
    minHeight: '300px',
  },
});

/**
 * MUI `Container` — slot stagger parent and layout spine.
 *
 * `zIndex: 9` keeps the content layer above any `background` slot content.
 * On md+: `flex: 1 1 auto; justifyContent: center` fills the viewport vertically.
 */
export const heroContainerSx: SxProps<Theme> = (theme) => ({
  gap: 2,
  zIndex: 9,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  pb: 0,
  minHeight: { xs: '300px' },
  [theme.breakpoints.up('md')]: {
    flex: '1 1 auto',
    justifyContent: 'center',
  },
});

/** Logo slot wrapper — `position: relative; display: inline-flex`. */
export const heroLogoBoxSx: SxProps<Theme> = {
  position: 'relative',
  display: 'inline-flex',
};

/** Heading + text Stack — centres all text slots. */
export const heroStackSx: SxProps<Theme> = {
  textAlign: 'center',
};

// ----------------------------------------------------------------------
// AnimatedHeroHeading — sx constants and factories
// ----------------------------------------------------------------------

/**
 * `<h1>` Box — resets margin, caps width at 680px, enables flex wrapping for the
 * inline gradient span, and bumps font size to 72px on `lg+` screens.
 */
export const headingH1Sx: SxProps<Theme> = (theme) => ({
  my: 0,
  mx: 'auto',
  maxWidth: 680,
  display: 'flex',
  flexWrap: 'wrap',
  typography: 'h2',
  justifyContent: 'center',
  [theme.breakpoints.up('lg')]: {
    fontSize: theme.typography.pxToRem(72),
    lineHeight: '90px',
  },
});

/**
 * Gradient highlight span — infinitely cycles a 5-stop `primary → warning → primary`
 * linear gradient across 400% background-size, clipped to the text shape.
 *
 * Uses `WebkitTextFillColor: 'transparent'` instead of `color` so the gradient
 * is visible on Safari where `-webkit-background-clip: text` requires it.
 */
export const headingHighlightSx: SxProps<Theme> = (theme) => ({
  backgroundImage: `linear-gradient(300deg, ${theme.vars!.palette.primary.main} 0%, ${theme.vars!.palette.warning.main} 25%, ${theme.vars!.palette.primary.main} 50%, ${theme.vars!.palette.warning.main} 75%, ${theme.vars!.palette.primary.main} 100%)`,
  backgroundSize: '400%',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  ml: { xs: 0.75, md: 1, xl: 1.5 },
});
