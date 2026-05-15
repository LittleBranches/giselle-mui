import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { SectionTitle } from '../title';
import { HeroSection } from './hero-section';

// ----------------------------------------------------------------------

const meta: Meta<typeof HeroSection> = {
  title: 'Layout/Hero Section',
  component: HeroSection,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    sx: { control: false },
    actions: { control: false },
    headline: { control: false },
    subtitle: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

// ----------------------------------------------------------------------

/**
 * Default hero: headline, subtitle, and two CTA buttons.
 * Background tint is `primary` (Giselle deep grove green) at 8% alpha.
 */
export const Default: Story = {
  render: () => (
    <HeroSection
      headline={<Typography variant="h1">Build something great</Typography>}
      subtitle={
        <Typography variant="h5" color="text.secondary">
          A clean, accessible, and fully typed component library for MUI v7.
        </Typography>
      }
      actions={
        <>
          <Button variant="contained">Get started</Button>
          <Button variant="outlined">View docs</Button>
        </>
      }
    />
  ),
};

/**
 * Headline only — no subtitle, no actions.
 * The simplest valid configuration.
 */
export const HeadlineOnly: Story = {
  render: () => (
    <HeroSection
      headline={<Typography variant="h1">Just a headline — no subtitle or actions.</Typography>}
    />
  ),
};

/**
 * The `headline` slot accepts any `ReactNode` — `SectionTitle` is the natural fit
 * for a section-level hero (renders `h2`, includes caption, gradient accent, and description).
 *
 * **title + caption** — the most common pairing.
 */
export const SectionTitleBasic: Story = {
  render: () => (
    <HeroSection
      color="secondary"
      headline={<SectionTitle caption="What we offer" title="A focused component library" />}
    />
  ),
};

/**
 * `txtGradient` appends an accent word to the title with a left-to-right fade.
 * Works in light and dark mode — the gradient resolves to `text.primary` channel.
 */
export const SectionTitleWithGradient: Story = {
  render: () => (
    <HeroSection
      color="info"
      headline={<SectionTitle caption="Open source" title="Built for" txtGradient="everyone" />}
    />
  ),
};

/**
 * Full configuration: caption + title + txtGradient + description.
 * The description renders as `body1` in `text.secondary` below the heading group.
 */
export const SectionTitleFull: Story = {
  render: () => (
    <HeroSection
      color="success"
      headline={
        <SectionTitle
          caption="Component library"
          title="Everything you need to"
          txtGradient="ship faster"
          description="A set of focused MUI wrapper components that encode non-obvious design and accessibility decisions so you don't have to rediscover them."
        />
      }
    />
  ),
};

/**
 * `SectionTitle` inside a hero that also has a `subtitle` slot and CTA actions.
 * Shows all three slots in use together: headline (SectionTitle), subtitle, actions.
 */
export const SectionTitleWithSubtitleAndActions: Story = {
  render: () => (
    <HeroSection
      color="warning"
      headline={
        <SectionTitle
          caption="Get started"
          title="Zero boilerplate."
          txtGradient="Just components."
        />
      }
      subtitle={
        <Typography variant="body1" color="text.secondary">
          Install, import, and render. No theme setup required beyond MUI v7.
        </Typography>
      }
      actions={
        <>
          <Button variant="contained">View components</Button>
          <Button variant="outlined">Read the docs</Button>
        </>
      }
    />
  ),
};

/**
 * All six palette colour variants.
 * Background tint is derived from `channelAlpha(mainChannel, 0.08)` so each
 * colour works correctly in both light and dark mode.
 */
export const ColorVariants: Story = {
  render: () => (
    <div>
      {(['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const).map((color) => (
        <HeroSection
          key={color}
          color={color}
          headline={<Typography variant="h1">{color} tint</Typography>}
          subtitle={
            <Typography variant="h5" color="text.secondary">
              Background is channelAlpha at 8% opacity — works in light and dark mode.
            </Typography>
          }
        />
      ))}
    </div>
  ),
};

/**
 * Responsive layout — four labeled containers at MUI standard breakpoints.
 * Padding and typography scale adjust at xs (360px), sm (600px), md (900px), lg (1200px).
 */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {([360, 600, 900, 1200] as const).map((width) => (
        <div key={width}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'text.secondary' }}>
            {width}px
          </Typography>
          <Box
            sx={{
              width,
              mx: 'auto',
              border: '1px dashed',
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            <HeroSection
              headline={<Typography variant="h1">Responsive hero</Typography>}
              subtitle={
                <Typography variant="h5" color="text.secondary">
                  Padding and font scale adjust at each MUI breakpoint.
                </Typography>
              }
              actions={<Button variant="contained">Action</Button>}
            />
          </Box>
        </div>
      ))}
    </div>
  ),
};
