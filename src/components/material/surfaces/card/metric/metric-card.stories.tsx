import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import type { SystemStyleObject } from '@mui/system';
import type { Theme } from '@mui/material/styles';

import {
  BREAKPOINTS_GRID,
  breakpointLabelSx,
  responsiveWrapperSx,
} from '../../../../../stories-defaults';
import { GiselleIcon } from '../../../data-display/icon/giselle/giselle-icon';
import { MetricCard, MetricCardDecoration } from './metric-card';
import type { MetricCardColor } from './types';

// ----------------------------------------------------------------------

const decorationOffsetSx: SystemStyleObject<Theme> = {
  width: 180,
  height: 180,
  top: 'auto',
  bottom: -60,
  right: 'auto',
  left: -60,
};

const ALL_COLORS: MetricCardColor[] = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
];

const meta: Meta<typeof MetricCard> = {
  component: MetricCard,
  title: 'Material/Surfaces/Cards/Metric',
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

// ----------------------------------------------------------------------

/** Single card with icon and decoration — the full production pattern. */
export const Default: Story = {
  args: {
    value: '20+',
    label: 'Years',
    sublabel: 'of experience',
    color: 'primary',
    icon: <GiselleIcon icon="solar:clock-circle-bold-duotone" width={36} />,
    decoration: <MetricCardDecoration color="primary" />,
    sx: { width: 240 },
  },
  argTypes: {
    icon: { control: false },
    decoration: { control: false },
    sx: { control: false },
  },
};

/** All six palette color variants side by side. */
export const AllColors: Story = {
  render: () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 240px)', gap: 2 }}>
      {ALL_COLORS.map((color) => (
        <MetricCard
          key={color}
          value="20+"
          label="Years"
          sublabel="of experience"
          color={color}
          icon={<GiselleIcon icon="solar:clock-circle-bold-duotone" width={36} />}
          decoration={<MetricCardDecoration color={color} />}
        />
      ))}
    </Box>
  ),
};

/** Card without icon or decoration — minimal text-only form. */
export const NoIconNoDecoration: Story = {
  args: {
    value: '600ms',
    label: 'Response time',
    color: 'info',
    sx: { width: 240 },
  },
  argTypes: {
    icon: { control: false },
    decoration: { control: false },
    sx: { control: false },
  },
};

// ----------------------------------------------------------------------

/**
 * Six metric cards in a responsive grid — column count grows with available width
 * at each MUI standard breakpoint.
 */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Box sx={responsiveWrapperSx}>
      {BREAKPOINTS_GRID.map(({ label, width, cols }) => (
        <div key={width}>
          <Typography variant="caption" sx={breakpointLabelSx}>
            {label}
          </Typography>
          <Box
            sx={{
              width,
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: 2,
              border: '1px dashed',
              borderColor: 'divider',
              p: 1,
            }}
          >
            {ALL_COLORS.map((color) => (
              <MetricCard
                key={color}
                value="20+"
                label="Years"
                sublabel="of experience"
                color={color}
                icon={<GiselleIcon icon="solar:clock-circle-bold-duotone" width={36} />}
                decoration={<MetricCardDecoration color={color} />}
              />
            ))}
          </Box>
        </div>
      ))}
    </Box>
  ),
};

/** MetricCardDecoration rendered standalone — all six color variants. */
export const DecorationVariants: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {ALL_COLORS.map((color) => (
        <Box
          key={color}
          sx={{
            position: 'relative',
            width: 120,
            height: 120,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <MetricCardDecoration color={color} />
        </Box>
      ))}
    </Box>
  ),
};

/** Custom `sx` overrides: larger decoration moved to bottom-left. */
export const DecorationCustomSx: Story = {
  render: () => (
    <MetricCard
      value="99%"
      label="Uptime"
      color="success"
      icon={<GiselleIcon icon="solar:shield-check-bold-duotone" width={36} />}
      decoration={<MetricCardDecoration color="success" sx={decorationOffsetSx} />}
      sx={{ width: 240 }}
    />
  ),
};
