import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { HeroButtonsRow } from '../buttons-row';
import { AnimatedHeroHeading } from './animated-hero-heading';
import { ScrollParallaxHero } from './scroll-parallax-hero';

// ----------------------------------------------------------------------
// Storybook metadata
// ----------------------------------------------------------------------

const meta: Meta<typeof ScrollParallaxHero> = {
  title: 'Giselle MUI/Hero/Scroll Parallax Hero',
  component: ScrollParallaxHero,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**ScrollParallaxHero** is a full-viewport hero section with depth-layered scroll parallax.

The section pins itself to the viewport while the outer div scrolls past it. Each slot
(\`logo\`, \`heading\`, \`text\`, \`actions\`, \`icons\`) moves at a different spring-physics
speed, creating a three-dimensional depth illusion as the user scrolls.

**Key design decisions:**

- **Pure slot props** — the component owns scroll mechanics, not content. Every visible
  element is provided by the consumer.
- **Spring physics** — \`mass=0.1, damping=20, stiffness=300\` gives a snappy, low-latency
  parallax feel that settles quickly.
- **On mobile** (\`< md\`): parallax and opacity-fade are disabled — content renders in normal
  flow for performance and readability.
- **Opacity fade** — the entire hero fades out as it scrolls off-screen on \`md+\`.

**Important:** wrap in a container with \`minHeight: '200vh'\` in your page to allow scrolling.
`,
      },
    },
  },
  argTypes: {
    logo: { control: false },
    heading: { control: false },
    text: { control: false },
    actions: { control: false },
    icons: { control: false },
    background: { control: false },
    sx: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollParallaxHero>;

// ----------------------------------------------------------------------
// Shared slot content
// ----------------------------------------------------------------------

const SampleHeading = <AnimatedHeroHeading subheading="The work of" highlight="Platform Team" />;

const SampleText = (
  <Typography variant="body2" sx={{ maxWidth: 480, textAlign: 'center', color: 'text.secondary' }}>
    Building scalable, accessible UIs with React, TypeScript, MUI, and Next.js.
  </Typography>
);

const SampleActions = (
  <HeroButtonsRow
    items={[
      { label: 'View work', href: '#work', variant: 'contained' },
      { label: 'About me', href: '#about', variant: 'outlined' },
    ]}
  />
);

/** Simple gradient background fill — consumers supply their own background slot. */
function GradientBackground() {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        background: (theme) =>
          `linear-gradient(135deg, ${theme.vars!.palette.primary.dark} 0%, ${theme.vars!.palette.secondary.dark} 100%)`,
        opacity: 0.12,
        zIndex: 0,
      }}
    />
  );
}

/** Scroll wrapper so the hero has room to scroll through in Storybook. */
function ScrollWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: '250vh', bgcolor: 'grey.900' }}>
      {children}
      <Box
        sx={{
          pt: 4,
          pb: 8,
          textAlign: 'center',
          color: 'text.secondary',
          typography: 'body2',
          // Visible only after scrolling past the hero
        }}
      >
        ↑ Scroll up to see the parallax hero
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------
// Stories
// ----------------------------------------------------------------------

/**
 * Default: heading + text + actions + gradient background.
 * Scroll the canvas to see the parallax layers in action.
 */
export const Default: Story = {
  decorators: [(Story) => React.createElement(ScrollWrapper, null, React.createElement(Story))],
  args: {
    heading: SampleHeading,
    text: SampleText,
    actions: SampleActions,
    background: React.createElement(GradientBackground),
  },
  parameters: {
    docs: {
      description: {
        story:
          'All three content slots (heading, text, actions) move at different parallax speeds. ' +
          'Scroll the canvas to see the depth layers separate.',
      },
    },
  },
};

/**
 * HeadingOnly: minimal story — just the animated heading.
 * Demonstrates that all slots are optional.
 */
export const HeadingOnly: Story = {
  decorators: [(Story) => React.createElement(ScrollWrapper, null, React.createElement(Story))],
  args: {
    heading: SampleHeading,
    background: React.createElement(GradientBackground),
  },
  parameters: {
    docs: {
      description: {
        story: 'All slots are optional. This story shows the heading alone with a background.',
      },
    },
  },
};

/**
 * LogoSlot: heading + animated logo placeholder.
 * In production: pass `<InteractiveHeroLogo>` with a real portrait and logo.
 *
 * The logo layer has the deepest parallax multiplier (default: -7) and moves
 * furthest — reinforcing the "logo floats in front of the background" illusion.
 */
export const LogoSlot: Story = {
  decorators: [(Story) => React.createElement(ScrollWrapper, null, React.createElement(Story))],
  args: {
    logo: (
      <Box
        sx={{
          width: 140,
          height: 180,
          borderRadius: 3,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.vars!.palette.primary.main}, ${theme.vars!.palette.secondary.main})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'common.white',
          typography: 'h4',
          fontWeight: 'bold',
        }}
      >
        G
      </Box>
    ),
    heading: SampleHeading,
    text: SampleText,
    actions: SampleActions,
    background: React.createElement(GradientBackground),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Logo slot — receives a placeholder rectangle. In production: pass ' +
          '`<InteractiveHeroLogo>` with a portrait image and logo SVG. ' +
          'The logo layer has the deepest parallax multiplier (-7) so it separates most as you scroll.',
      },
    },
  },
};

/**
 * CustomParallax: overridden depth multipliers.
 * Demonstrates that the `parallax` prop controls each layer's speed independently.
 */
export const CustomParallax: Story = {
  decorators: [(Story) => React.createElement(ScrollWrapper, null, React.createElement(Story))],
  args: {
    heading: SampleHeading,
    text: SampleText,
    actions: SampleActions,
    background: React.createElement(GradientBackground),
    parallax: {
      heading: -12,
      text: -3,
      actions: -1,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Custom `parallax` multipliers: heading=-12 (exaggerated depth), text=-3, actions=-1. ' +
          'Compare with `Default` to see how multipliers control the separation between layers.',
      },
    },
  },
};

/**
 * NoParallax: scroll but no depth effect (all multipliers = 0).
 * Useful as a baseline comparison — the opacity fade still works.
 */
export const NoParallax: Story = {
  decorators: [(Story) => React.createElement(ScrollWrapper, null, React.createElement(Story))],
  args: {
    heading: SampleHeading,
    text: SampleText,
    actions: SampleActions,
    background: React.createElement(GradientBackground),
    parallax: { logo: 0, heading: 0, text: 0, actions: 0 },
  },
  parameters: {
    docs: {
      description: {
        story:
          'All parallax multipliers set to 0 — no layer movement. ' +
          'The opacity fade still activates on md+. Use this as a baseline comparison.',
      },
    },
  },
};

/**
 * Responsive: the hero rendered at each MUI standard breakpoint width.
 *
 * On `< md` (xs, sm) parallax and opacity-fade are disabled — the hero renders
 * as a static full-width section. On `md+` the fixed-panel and parallax layers
 * activate. The breakpoint boundary is the key visual difference to verify here.
 */
export const Responsive: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Rendered inside labelled containers at xs (360px), sm (600px), md (900px), ' +
          'lg (1200px). On xs/sm the parallax is disabled and the section renders statically. ' +
          'On md+ the fixed-panel layout activates.',
      },
    },
  },
  render: () => {
    const breakpoints: Array<{ label: string; width: number }> = [
      { label: 'xs — 360px', width: 360 },
      { label: 'sm — 600px', width: 600 },
      { label: 'md — 900px', width: 900 },
      { label: 'lg — 1200px', width: 1200 },
    ];

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {breakpoints.map(({ label, width }) => (
          <Box key={label}>
            <Box
              sx={{
                typography: 'caption',
                color: 'text.secondary',
                mb: 1,
                pl: 1,
                borderLeft: '2px solid',
                borderColor: 'divider',
              }}
            >
              {label}
            </Box>
            <Box
              sx={{
                width,
                border: '1px dashed',
                borderColor: 'divider',
                overflow: 'hidden',
                position: 'relative',
                height: 320,
              }}
            >
              <ScrollParallaxHero
                heading={SampleHeading}
                text={SampleText}
                actions={SampleActions}
                background={React.createElement(GradientBackground)}
              />
            </Box>
          </Box>
        ))}
      </Box>
    );
  },
};
