import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { breakpointLabelSx, responsiveWrapperSx } from '../../../../stories-defaults';
import { StatusLabel } from './status-label';
import type { StatusLabelStatus } from './types';

// ----------------------------------------------------------------------

const meta: Meta<typeof StatusLabel> = {
  title: 'Material/Data Display/Status Label',
  component: StatusLabel,
  parameters: { layout: 'padded' },
  argTypes: {
    sx: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof StatusLabel>;

// ----------------------------------------------------------------------

const ALL_STATUSES: StatusLabelStatus[] = [
  'active',
  'inactive',
  'pending',
  'review',
  'done',
  'cancelled',
  'overdue',
];

// ----------------------------------------------------------------------

const chipRowSx = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 1,
  alignItems: 'center',
} as const;

// ----------------------------------------------------------------------

/**
 * Default state — active status. Shows the soft green tint.
 */
export const Default: Story = {
  args: {
    status: 'active',
  },
};

/**
 * Label override — the `label` prop replaces the derived default.
 */
export const CustomLabel: Story = {
  args: {
    status: 'pending',
    label: 'Awaiting approval',
  },
};

/**
 * All seven statuses side by side. Each chip derives its colour from the
 * status → palette key mapping in `STATUS_CONFIG`.
 */
export const AllStatuses: Story = {
  render: () => (
    <Box sx={chipRowSx}>
      {ALL_STATUSES.map((status) => (
        <StatusLabel key={status} status={status} />
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'All seven workflow statuses. `active` and `done` share the success palette; ' +
          '`cancelled` and `overdue` share error; `inactive` uses the grey channel.',
      },
    },
  },
};

/**
 * Responsive story — chips at each MUI standard breakpoint width.
 */
export const Responsive: Story = {
  render: () => (
    <Box sx={responsiveWrapperSx}>
      {([360, 600, 900, 1200] as const).map((width) => (
        <div key={width}>
          <Typography variant="caption" sx={breakpointLabelSx}>
            {width}px
          </Typography>
          <Box sx={{ width }}>
            <Box sx={chipRowSx}>
              {ALL_STATUSES.map((status) => (
                <StatusLabel key={status} status={status} />
              ))}
            </Box>
          </Box>
        </div>
      ))}
    </Box>
  ),
  parameters: { layout: 'padded' },
};
