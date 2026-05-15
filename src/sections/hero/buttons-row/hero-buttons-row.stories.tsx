import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {
  BREAKPOINTS,
  breakpointLabelSx,
  buildBreakpointWidthSx,
  responsiveWrapperSx,
} from '../../../stories-defaults';
import { HeroButtonsRow } from './hero-buttons-row';

// ----------------------------------------------------------------------

const meta: Meta<typeof HeroButtonsRow> = {
  title: 'Sections/Hero/Buttons Row',
  component: HeroButtonsRow,
  parameters: { layout: 'centered' },
  argTypes: {
    items: { control: false },
    motionProps: { control: false },
    sx: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof HeroButtonsRow>;

// ----------------------------------------------------------------------

const SAMPLE_ITEMS = [
  { label: 'View work', href: '#work' },
  { label: 'Contact', href: '#contact', variant: 'outlined' as const },
];

/**
 * Default button row with two items — primary contained and secondary outlined.
 */
export const Default: Story = {
  args: { items: SAMPLE_ITEMS },
};

/**
 * Single button — confirms the row wrapping layout works with one item.
 */
export const SingleButton: Story = {
  args: {
    items: [{ label: 'Get started', href: '#start' }],
  },
};

/**
 * Three buttons — confirms the row wraps cleanly on narrow viewports.
 */
export const ThreeButtons: Story = {
  args: {
    items: [
      { label: 'Projects', href: '#projects' },
      { label: 'About', href: '#about', variant: 'outlined' as const },
      { label: 'Blog', href: '#blog', variant: 'text' as const },
    ],
  },
};

/**
 * **Responsive** — the row at MUI standard breakpoint widths.
 */
export const Responsive: Story = {
  render: () => (
    <Box sx={responsiveWrapperSx}>
      {BREAKPOINTS.map(({ label, width }) => (
        <div key={width}>
          <Typography variant="caption" sx={breakpointLabelSx}>
            {label}
          </Typography>
          <Box sx={buildBreakpointWidthSx(width)}>
            <HeroButtonsRow items={SAMPLE_ITEMS} />
          </Box>
        </div>
      ))}
    </Box>
  ),
  parameters: { layout: 'padded' },
};
