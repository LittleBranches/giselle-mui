'use client';

import { motion } from 'framer-motion';

import Box from '@mui/material/Box';

import {
  gradientHighlightAnimate,
  gradientHighlightTransition,
  headingMotionProps,
} from './scroll-parallax-hero.animations';
import { headingH1Sx, headingHighlightSx } from './scroll-parallax-hero.styles';
import type { AnimatedHeroHeadingProps } from './types';

// ----------------------------------------------------------------------

/**
 * `AnimatedHeroHeading` — an animated `<h1>` with a cycling gradient highlight span.
 *
 * The heading fades in on mount via `motionProps` (defaults to `fade('inUp', { distance: 24 })`).
 * The `highlight` word animates its gradient `backgroundPosition` infinitely, creating a
 * colour-wash effect using `theme.vars.palette.primary.main` and `theme.vars.palette.warning.main`.
 *
 * **Usage:**
 * ```tsx
 * <AnimatedHeroHeading
 *   subheading="The work of"
 *   highlight="Platform Team"
 * />
 * ```
 *
 * **Custom font family:**
 * ```tsx
 * <AnimatedHeroHeading
 *   subheading="The work of"
 *   highlight="Platform Team"
 *   sx={(theme) => ({ fontFamily: theme.typography.fontSecondaryFamily })}
 * />
 * ```
 *
 * **Note:** `fontFamily` is not baked in — it is intentionally left to the consumer.
 * Override via `sx` to apply any custom typeface from the active theme.
 *
 * **Quality status (May 2026):** implementation complete, styles tested.
 */
export function AnimatedHeroHeading({
  subheading,
  highlight,
  motionProps,
  sx,
}: AnimatedHeroHeadingProps) {
  const resolvedMotionProps = motionProps ?? headingMotionProps;

  return (
    <motion.div {...resolvedMotionProps}>
      <Box component="h1" sx={[headingH1Sx, ...(Array.isArray(sx) ? sx : [sx])]}>
        {subheading}{' '}
        <Box
          component={motion.span as React.ElementType}
          animate={gradientHighlightAnimate}
          transition={gradientHighlightTransition}
          sx={headingHighlightSx}
        >
          {highlight}
        </Box>
      </Box>
    </motion.div>
  );
}
