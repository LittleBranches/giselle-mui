import type { Meta, StoryObj } from '@storybook/react';

import Button from '@mui/material/Button';

import { HeroSection } from './hero-section';

// ----------------------------------------------------------------------

const meta: Meta<typeof HeroSection> = {
  title: 'Layout/Hero Section',
  component: HeroSection,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    sx: { control: false },
    actions: { control: false },
    headline: { control: 'text' },
    subtitle: { control: 'text' },
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
      headline="Build something great"
      subtitle="A clean, accessible, and fully typed component library for MUI v7."
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
  render: () => <HeroSection headline="Just a headline — no subtitle or actions." />,
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
          headline={`${color} tint`}
          subtitle="Background is channelAlpha at 8% opacity — works in light and dark mode."
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
          <p style={{ fontSize: 12, margin: '0 0 4px', color: '#666' }}>{width}px</p>
          <div style={{ width, margin: '0 auto', border: '1px dashed #ccc', overflow: 'hidden' }}>
            <HeroSection
              headline="Responsive hero"
              subtitle="Padding and font scale adjust at each MUI breakpoint."
              actions={<Button variant="contained">Action</Button>}
            />
          </div>
        </div>
      ))}
    </div>
  ),
};
