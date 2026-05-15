import type { ReactNode, RefObject } from 'react';
import type { MotionProps, MotionValue } from 'framer-motion';
import type { BoxProps } from '@mui/material/Box';

import type { HeroSlotProps } from '../types';

export type { HeroSlotProps } from '../types';

// ----------------------------------------------------------------------

/** Parallax depth multipliers for each slot layer. Negative values move the layer upward on scroll. */
export type ParallaxMultipliers = {
  /** Logo layer multiplier. Default: `-7` (moves furthest — creates deepest depth). */
  logo?: number;
  /** Heading layer multiplier. Default: `-6`. */
  heading?: number;
  /** Text/description layer multiplier. Default: `-5`. */
  text?: number;
  /** Actions layer multiplier. Default: `-4` (moves least — shallowest depth). */
  actions?: number;
  /** Icons strip layer multiplier. Default: `-4` (same plane as actions). */
  icons?: number;
};

/** Props for `ScrollParallaxHero`. */
export type ScrollParallaxHeroProps = Omit<BoxProps, 'children'> &
  HeroSlotProps & {
    /**
     * Logo slot — wrapped in the deepest parallax layer (y1).
     *
     * Recommended: `<InteractiveHeroLogo>` with an `<img>` or SVG logo as the child.
     */
    logo?: ReactNode;
    /**
     * Background slot — renders below the content layer, not parallaxed.
     *
     * Fills the entire hero area. Use for gradient panels, blurred images, or animated shapes.
     */
    background?: ReactNode;
    /**
     * Parallax depth multipliers for each slot layer.
     *
     * Defaults: `{ logo: -7, heading: -6, text: -5, actions: -4 }`.
     * Negative values move the layer upward as the user scrolls down.
     */
    parallax?: ParallaxMultipliers;
  };

/** Props for `AnimatedHeroHeading`. */
export type AnimatedHeroHeadingProps = {
  /**
   * The plain-text portion before the animated highlight span.
   * Rendered as a text node inside the `<h1>`.
   */
  subheading: string;
  /**
   * The highlighted word(s). Rendered with an infinitely cycling linear gradient
   * animation using `theme.vars.palette.primary.main` and `theme.vars.palette.warning.main`.
   */
  highlight: string;
  /**
   * Motion props for the fade-in wrapper `motion.div`.
   * Defaults to `fade('inUp', { distance: 24 })`.
   */
  motionProps?: MotionProps;
  /**
   * Additional sx overrides applied to the `<h1>` Box element.
   *
   * Use to override `fontFamily`, `maxWidth`, `textAlign`, etc.
   */
  sx?: BoxProps['sx'];
};

/** Return value of `useScrollPercent`. */
export type UseScrollPercentResult = {
  /** Ref to attach to the hero section root element (measures height for percent calculation). */
  elementRef: RefObject<HTMLDivElement | null>;
  /**
   * Scroll progress through the hero as a clamped integer in [0, 100].
   * Updated on every scroll event via `useMotionValueEvent`.
   */
  percent: number;
  /** Raw window `scrollY` `MotionValue<number>` from framer-motion's `useScroll`. */
  scrollY: MotionValue<number>;
};
