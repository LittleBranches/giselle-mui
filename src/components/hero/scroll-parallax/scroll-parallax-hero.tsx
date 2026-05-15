'use client';

import { motion, useTransform } from 'framer-motion';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';

import {
  heroContainerSx,
  heroInnerWrapSx,
  heroLogoBoxSx,
  heroRootSx,
  heroStackSx,
  parallaxOpacityStyle,
  parallaxYStyle,
} from './scroll-parallax-hero.styles';
import { DEFAULT_PARALLAX_MULTIPLIERS } from './scroll-parallax-hero.const';
import { useScrollPercent } from './use-scroll-percent';
import { useTransformY } from './use-transform-y';
import type { ParallaxMultipliers, ScrollParallaxHeroProps } from './types';

// ----------------------------------------------------------------------

/**
 * `ScrollParallaxHero` — full-viewport hero section with depth-layered scroll parallax.
 *
 * The section fixes itself to the viewport while the user scrolls through it and fades out
 * as it leaves view. Each slot (`logo`, `heading`, `text`, `actions`, `icons`) is wrapped
 * in its own spring-physics parallax layer with a configurable depth multiplier, creating
 * a three-dimensional depth illusion.
 *
 * All visible content is provided as slot props — the component owns the scroll frame
 * and the parallax physics, not the content.
 *
 * **Usage:**
 * ```tsx
 * <ScrollParallaxHero
 *   logo={<InteractiveHeroLogo><YourLogo /></InteractiveHeroLogo>}
 *   heading={<AnimatedHeroHeading subheading="Welcome to" highlight="Platform Name" />}
 *   text={<Typography variant="body2">A short description of what you build.</Typography>}
 *   actions={<HeroButtonsRow items={buttons} />}
 *   background={<YourBackground />}
 * />
 * ```
 *
 * **Custom layout offset:** to push the hero beneath a sticky header, use the `sx` prop:
 * ```tsx
 * <ScrollParallaxHero
 *   sx={{ mt: 'calc(var(--your-header-height) * -1)' }}
 *   ...
 * />
 * ```
 *
 * **Quality status (May 2026):** implementation complete, tests passing.
 */
export function ScrollParallaxHero({
  logo,
  heading,
  text,
  actions,
  icons,
  background,
  parallax,
  sx,
  ...other
}: ScrollParallaxHeroProps) {
  const scrollProgress = useScrollPercent();
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'), { noSsr: true });

  const pm = { ...DEFAULT_PARALLAX_MULTIPLIERS, ...parallax } as Required<ParallaxMultipliers>;
  const multiplier = mdUp ? 1 : 0;

  // All four useTransformY calls are unconditional — hook call order must be stable.
  const y1 = useTransformY(scrollProgress.scrollY, scrollProgress.elementRef, multiplier * pm.logo);
  const y2 = useTransformY(
    scrollProgress.scrollY,
    scrollProgress.elementRef,
    multiplier * pm.heading
  );
  const y3 = useTransformY(scrollProgress.scrollY, scrollProgress.elementRef, multiplier * pm.text);
  const y4 = useTransformY(
    scrollProgress.scrollY,
    scrollProgress.elementRef,
    multiplier * pm.actions
  );

  const opacity = useTransform(scrollProgress.scrollY, (scrollY: number) => {
    if (!mdUp) return 1;
    const heroHeight = scrollProgress.elementRef.current?.offsetHeight;
    if (!heroHeight) return 1;
    return Math.max(0, 1 - scrollY / heroHeight);
  });

  return (
    <Box
      ref={scrollProgress.elementRef}
      component="section"
      sx={[heroRootSx, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      {/* opacity layer — CSS opacity does not affect fixed-position descendants */}
      <motion.div style={parallaxOpacityStyle(opacity)}>
        <Box sx={heroInnerWrapSx}>
          {/* stagger parent — propagates initial/animate to slot children via React Context */}
          <motion.div initial="initial" animate="animate">
            <Container sx={heroContainerSx}>
              {logo && (
                <motion.div style={parallaxYStyle(y1)}>
                  <Box sx={heroLogoBoxSx}>{logo}</Box>
                </motion.div>
              )}

              <Stack spacing={1} sx={heroStackSx}>
                {heading && <motion.div style={parallaxYStyle(y2)}>{heading}</motion.div>}
                {text && <motion.div style={parallaxYStyle(y3)}>{text}</motion.div>}
              </Stack>

              {actions && <motion.div style={parallaxYStyle(y4)}>{actions}</motion.div>}
              {icons && <motion.div style={parallaxYStyle(y4)}>{icons}</motion.div>}
            </Container>
          </motion.div>

          {background}
        </Box>
      </motion.div>
    </Box>
  );
}
