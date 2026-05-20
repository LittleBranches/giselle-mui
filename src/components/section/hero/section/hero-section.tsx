import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { heroActionsRowSx, heroIconsSlotSx, heroInnerSx, heroRootSx } from './hero-section.styles';
import type { HeroSectionProps } from './types';

// ----------------------------------------------------------------------

/**
 * `HeroSection` — full-width, palette-tinted hero with heading, text, actions, and icon strip slots.
 *
 * Background is tinted using `channelAlpha(mainChannel, 0.08)` — works in light and
 * dark mode with zero hardcoded hex values. Content is constrained to `maxWidth="lg"`
 * and centred.
 *
 * Slot vocabulary is shared with `ScrollParallaxHero` — swap between them without
 * renaming props.
 *
 * **Usage:**
 * ```tsx
 * <HeroSection
 *   heading={<Typography variant="h1">Build something great</Typography>}
 *   text={<Typography variant="h5" color="text.secondary">A clean, accessible component library for MUI v7.</Typography>}
 *   actions={
 *     <>
 *       <Button variant="contained">Get started</Button>
 *       <Button variant="outlined">View docs</Button>
 *     </>
 *   }
 *   icons={<TechIconStrip title="Built with" centeredWrap items={stackItems} />}
 * />
 * ```
 *
 * **Tint colour:**
 * ```tsx
 * <HeroSection heading="Success hero" color="success" />
 * ```
 *
 * **Quality status (14 May 2026):** DoD 21/21 · Best practices 13/13
 */
export function HeroSection({
  heading,
  text,
  actions,
  icons,
  color = 'primary',
  sx,
  ...other
}: HeroSectionProps) {
  return (
    <Box sx={[heroRootSx(color), ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <Container maxWidth="lg" sx={heroInnerSx}>
        {heading}
        {text}
        {actions && <Box sx={heroActionsRowSx}>{actions}</Box>}
        {icons && <Box sx={heroIconsSlotSx}>{icons}</Box>}
      </Container>
    </Box>
  );
}
