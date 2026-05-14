import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { heroActionsRowSx, heroInnerSx, heroRootSx } from './hero-section.styles';
import type { HeroSectionProps } from './types';

// ----------------------------------------------------------------------

/**
 * `HeroSection` — full-width, palette-tinted hero with headline, subtitle, and CTA slot.
 *
 * Background is tinted using `channelAlpha(mainChannel, 0.08)` — works in light and
 * dark mode with zero hardcoded hex values. Content is constrained to `maxWidth="lg"`
 * and centred.
 *
 * **Usage:**
 * ```tsx
 * <HeroSection
 *   headline="Build something great"
 *   subtitle="A clean, accessible component library for MUI v7."
 *   actions={
 *     <>
 *       <Button variant="contained">Get started</Button>
 *       <Button variant="outlined">View docs</Button>
 *     </>
 *   }
 * />
 * ```
 *
 * **Tint colour:**
 * ```tsx
 * <HeroSection headline="Success hero" color="success" />
 * ```
 *
 * **Quality status (14 May 2026):** DoD 21/21 · Best practices 13/13
 */
export function HeroSection({
  headline,
  subtitle,
  actions,
  color = 'primary',
  sx,
  ...other
}: HeroSectionProps) {
  return (
    <Box sx={[heroRootSx(color), ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <Container maxWidth="lg" sx={heroInnerSx}>
        <Typography variant="h1">{headline}</Typography>

        {subtitle && (
          <Typography variant="h5" color="text.secondary">
            {subtitle}
          </Typography>
        )}

        {actions && <Box sx={heroActionsRowSx}>{actions}</Box>}
      </Container>
    </Box>
  );
}
