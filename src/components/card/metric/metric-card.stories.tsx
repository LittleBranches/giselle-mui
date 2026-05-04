import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { GiselleIcon } from '../../icon/giselle/giselle-icon';
import { MetricCard, MetricCardDecoration } from './metric-card';
import type { MetricCardColor } from './metric-card';

// ----------------------------------------------------------------------

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
  title: 'Components/MetricCard',
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

const BREAKPOINTS_GRID = [
  { label: 'xs — 360px', width: 360, cols: 1 },
  { label: 'sm — 600px', width: 600, cols: 2 },
  { label: 'md — 900px', width: 900, cols: 3 },
  { label: 'lg — 1200px', width: 1200, cols: 4 },
];

/**
 * Six metric cards in a responsive grid — column count grows with available width
 * at each MUI standard breakpoint.
 */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {BREAKPOINTS_GRID.map(({ label, width, cols }) => (
        <Box key={width}>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
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
        </Box>
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
      decoration={
        <MetricCardDecoration
          color="success"
          sx={{ width: 180, height: 180, top: 'auto', bottom: -60, right: 'auto', left: -60 }}
        />
      }
      sx={{ width: 240 }}
    />
  ),
};
