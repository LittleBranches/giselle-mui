'use client';

import { motion } from 'framer-motion';

import Box from '@mui/material/Box';

import { fade } from '../../motion/variants/fade';
import { headingH1Sx, headingHighlightSx } from './scroll-parallax-hero.styles';
import type { AnimatedHeroHeadingProps } from './types';

// ----------------------------------------------------------------------

const DEFAULT_MOTION_PROPS = {
  variants: fade('inUp', { distance: 24 }),
};

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
 *   subheading="The portfolio of"
 *   highlight="Alex Rebula"
 * />
 * ```
 *
 * **Custom font family:**
 * ```tsx
 * <AnimatedHeroHeading
 *   subheading="The portfolio of"
 *   highlight="Alex Rebula"
 *   sx={(theme) => ({ fontFamily: theme.typography.fontSecondaryFamily })}
 * />
 * ```
 *
 * **Note:** `fontFamily` is not baked in — it is intentionally left to the consumer
 * because `theme.typography.fontSecondaryFamily` is portfolio-specific. Override via `sx`.
 *
 * **Quality status (May 2026):** implementation complete, styles tested.
 */
export function AnimatedHeroHeading({
  subheading,
  highlight,
  motionProps,
  sx,
}: AnimatedHeroHeadingProps) {
  const resolvedMotionProps = motionProps ?? DEFAULT_MOTION_PROPS;

  return (
    <motion.div {...resolvedMotionProps}>
      <Box component="h1" sx={[headingH1Sx, ...(Array.isArray(sx) ? sx : [sx])]}>
        {subheading}{' '}
        <Box
          component={motion.span as React.ElementType}
          animate={{ backgroundPosition: '200% center' }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          sx={headingHighlightSx}
        >
          {highlight}
        </Box>
      </Box>
    </motion.div>
  );
}
