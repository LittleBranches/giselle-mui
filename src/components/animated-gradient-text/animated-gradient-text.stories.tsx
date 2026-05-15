import type { Meta, StoryObj } from '@storybook/react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { AnimatedGradientText } from './animated-gradient-text';

// ----------------------------------------------------------------------

const meta: Meta<typeof AnimatedGradientText> = {
  title: 'Data Display/Animated Gradient Text',
  component: AnimatedGradientText,
  argTypes: {
    sx: { control: false },
    component: { control: false },
  },
  args: {
    children: 'Open Source Platform',
    color1: 'primary',
    color2: 'secondary',
    duration: 3,
  },
};

export default meta;

type Story = StoryObj<typeof AnimatedGradientText>;

// ----------------------------------------------------------------------

export const Default: Story = {
  render: (args) => (
    <Typography variant="h3">
      <AnimatedGradientText {...args} />
    </Typography>
  ),
};

// ----------------------------------------------------------------------

/** All six palette color keys shown as `color1`, each paired with `secondary` as `color2`. */
export const AllPaletteKeys: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'All six palette color keys used as `color1`. The gradient cycles between the listed color and `secondary`.',
      },
    },
  },
  render: () => (
    <Stack spacing={2}>
      {(['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const).map((color) => (
        <Typography key={color} variant="h4">
          <AnimatedGradientText
            color1={color}
            color2={color === 'secondary' ? 'primary' : 'secondary'}
          >
            {color.charAt(0).toUpperCase() + color.slice(1)} gradient
          </AnimatedGradientText>
        </Typography>
      ))}
    </Stack>
  ),
};

// ----------------------------------------------------------------------

/** Slower cycle (6 s) vs faster cycle (1 s). */
export const DurationVariants: Story = {
  render: () => (
    <Stack spacing={2}>
      <Typography variant="h4">
        <AnimatedGradientText duration={1}>Fast — 1 s</AnimatedGradientText>
      </Typography>
      <Typography variant="h4">
        <AnimatedGradientText duration={3}>Default — 3 s</AnimatedGradientText>
      </Typography>
      <Typography variant="h4">
        <AnimatedGradientText duration={6}>Slow — 6 s</AnimatedGradientText>
      </Typography>
    </Stack>
  ),
};

// ----------------------------------------------------------------------

/**
 * Shows the component at the four MUI standard breakpoint widths.
 * The gradient text is inline — container width affects line wrapping only.
 */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack spacing={2}>
      {([360, 600, 900, 1200] as const).map((width) => (
        <div key={width}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'text.secondary' }}>
            {width}px
          </Typography>
          <Box sx={{ width, border: '1px dashed', borderColor: 'divider', p: 2 }}>
            <Typography variant="h4">
              <AnimatedGradientText color1="primary" color2="info">
                Building in the open, one commit at a time
              </AnimatedGradientText>
            </Typography>
          </Box>
        </div>
      ))}
    </Stack>
  ),
};
