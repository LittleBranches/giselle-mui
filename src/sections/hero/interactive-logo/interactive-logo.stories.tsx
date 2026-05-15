import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { InteractiveHeroLogo } from './interactive-logo';
import { PLACEHOLDER_ART_SRC, PLACEHOLDER_PORTRAIT_SRC } from '../../../stories-defaults';

// ----------------------------------------------------------------------

/**
 * `InteractiveHeroLogo` is a three-phase interactive logo component driven by
 * pointer position. It layers three independently animated elements:
 *
 * - **Layer 1 (OriginalLogoLayer)** — the original logo or frame animation.
 * - **Layer 2 (ArtisticLogoLayer)** — an alternate / artistic overlay.
 * - **Layer 3 (PortraitLayer)** — a directional portrait that tracks pointer angle.
 *
 * Supply `children` as the default logo slot. Add `artisticLogoSrc` or
 * `portraitSrc` to activate the additional hover phases.
 */
const meta: Meta<typeof InteractiveHeroLogo> = {
  title: 'Sections/Hero/Interactive Logo',
  component: InteractiveHeroLogo,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof InteractiveHeroLogo>;

// ----------------------------------------------------------------------

const LOGO_SIZE = 240;

/** Placeholder logo rendered as the children slot. */
function PlaceholderLogo() {
  return (
    <Box
      sx={{
        width: LOGO_SIZE,
        height: LOGO_SIZE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #F5A623 0%, #2E7D32 100%)',
      }}
    >
      <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700, userSelect: 'none' }}>
        G
      </Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

/**
 * **Idle phase** — logo at rest with only the children slot visible.
 * No `artisticLogoSrc` or `portraitSrc` supplied — the component shows only
 * the base logo. Move the pointer over it to see the tilt and pan response.
 */
export const Default: Story = {
  render: () => (
    <Box sx={{ width: LOGO_SIZE, height: LOGO_SIZE }}>
      <InteractiveHeroLogo>
        <PlaceholderLogo />
      </InteractiveHeroLogo>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Base state — no artistic overlay, no portrait. ' +
          'Hover to see 3-D tilt; the logo tracks pointer position within the element.',
      },
    },
  },
};

/**
 * **Artistic phase** — hover reveals an artistic logo overlay.
 * Supply `artisticLogoSrc` to activate layer 2. On first hover the
 * original logo scrubs in while the artistic overlay fades.
 */
export const WithArtisticLogo: Story = {
  render: () => (
    <Box sx={{ width: LOGO_SIZE, height: LOGO_SIZE }}>
      <InteractiveHeroLogo artisticLogoSrc={PLACEHOLDER_ART_SRC}>
        <PlaceholderLogo />
      </InteractiveHeroLogo>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'With `artisticLogoSrc` set: at rest the artistic overlay is shown; ' +
          'on first hover the original logo fades in (artistic phase).',
      },
    },
  },
};

/**
 * **Portrait phase** — after a 500 ms hover, the portrait fills the bleed zone
 * and tracks pointer direction around the logo.
 */
export const WithPortrait: Story = {
  render: () => (
    <Box sx={{ width: LOGO_SIZE, height: LOGO_SIZE }}>
      <InteractiveHeroLogo
        portraitSrc={PLACEHOLDER_PORTRAIT_SRC}
        portraitAlt="Placeholder portrait"
      >
        <PlaceholderLogo />
      </InteractiveHeroLogo>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'With `portraitSrc`: hover and wait 500 ms for the portrait phase. ' +
          'Move the pointer around the edge to see directional image switching (requires `portraitSources`).',
      },
    },
  },
};

/**
 * **All phases active** — artistic overlay at rest, original logo on first hover,
 * portrait after the activation delay. Shows the complete three-phase sequence.
 */
export const AllPhases: Story = {
  render: () => (
    <Box sx={{ width: LOGO_SIZE, height: LOGO_SIZE }}>
      <InteractiveHeroLogo
        artisticLogoSrc={PLACEHOLDER_ART_SRC}
        portraitSrc={PLACEHOLDER_PORTRAIT_SRC}
        portraitAlt="Placeholder portrait"
      >
        <PlaceholderLogo />
      </InteractiveHeroLogo>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Full three-phase sequence: idle → artistic → portrait. ' +
          'Hover to progress through all phases. Leaving resets to idle.',
      },
    },
  },
};

/**
 * **Responsive** — the component at MUI standard breakpoint widths.
 */
export const Responsive: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {[360, 600, 900, 1200].map((width) => (
        <Box key={width}>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
            {width}px
          </Typography>
          <Box sx={{ width, height: LOGO_SIZE }}>
            <InteractiveHeroLogo>
              <PlaceholderLogo />
            </InteractiveHeroLogo>
          </Box>
        </Box>
      ))}
    </Box>
  ),
  parameters: { layout: 'padded' },
};
