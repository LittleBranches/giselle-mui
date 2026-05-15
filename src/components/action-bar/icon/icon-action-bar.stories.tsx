import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {
  breakpointContainerSx,
  breakpointLabelSx,
  responsiveWrapperSx,
} from '../../../stories-defaults';
import { GiselleIcon } from '../../icon/giselle/giselle-icon';
import { IconActionBar } from './icon-action-bar';

// ----------------------------------------------------------------------

const meta: Meta<typeof IconActionBar> = {
  component: IconActionBar,
  title: 'Data Display/Action Bar',
};

export default meta;
type Story = StoryObj<typeof IconActionBar>;

// ----------------------------------------------------------------------

/** Default document-toolbar actions — Edit, View, Print, Send, Share. */
export const Default: Story = {
  argTypes: {
    actions: { control: false },
    sx: { control: false },
  },
};

/** Custom action set — two items with click handlers. */
export const CustomActions: Story = {
  args: {
    actions: [
      { tooltip: 'Edit', icon: <GiselleIcon icon="solar:pen-bold" /> },
      { tooltip: 'Delete', icon: <GiselleIcon icon="solar:trash-bin-trash-bold" /> },
      { tooltip: 'Download', icon: <GiselleIcon icon="solar:download-bold" /> },
    ],
  },
  argTypes: {
    actions: { control: false },
    sx: { control: false },
  },
};

/** One disabled button mixed with active buttons. */
export const WithDisabled: Story = {
  args: {
    actions: [
      { tooltip: 'Edit', icon: <GiselleIcon icon="solar:pen-bold" /> },
      {
        tooltip: 'Print (unavailable)',
        icon: <GiselleIcon icon="solar:printer-minimalistic-bold" />,
        disabled: true,
      },
      { tooltip: 'Share', icon: <GiselleIcon icon="solar:share-bold" /> },
    ],
  },
  argTypes: {
    actions: { control: false },
    sx: { control: false },
  },
};

// ----------------------------------------------------------------------

const BREAKPOINTS = [
  { label: 'xs — 360px', width: 360 },
  { label: 'sm — 600px', width: 600 },
  { label: 'md — 900px', width: 900 },
  { label: 'lg — 1200px', width: 1200 },
];

/**
 * Bar inside labeled containers at each MUI standard breakpoint width.
 * Demonstrates that the bar fills available space (`flexGrow: 1`).
 */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Box sx={responsiveWrapperSx}>
      {BREAKPOINTS.map(({ label, width }) => (
        <div key={width}>
          <Typography variant="caption" sx={breakpointLabelSx}>
            {label}
          </Typography>
          <Box sx={[breakpointContainerSx, { width, p: 1 }]}>
            <IconActionBar />
          </Box>
        </div>
      ))}
    </Box>
  ),
};
