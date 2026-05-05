import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';

import { GiselleIcon } from '../../icon/giselle';
import { StatCard } from './stat-card';

// ----------------------------------------------------------------------

const meta: Meta<typeof StatCard> = {
  title: 'Cards/Stat',
  component: StatCard,
  parameters: { layout: 'padded' },
  argTypes: {
    icon: { control: false },
    sx: { control: false },
    sparkline: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

// ----------------------------------------------------------------------

const SAMPLE_SPARKLINE = [22, 18, 30, 25, 40, 35, 48];
const SAMPLE_SPARKLINE_DOWN = [48, 40, 35, 30, 22, 18, 14];

// ----------------------------------------------------------------------

/**
 * Default state: label + value only. No trend, no sparkline.
 * Shows the card's gradient background at rest.
 */
export const Default: Story = {
  args: {
    label: 'Components',
    value: '9',
    color: 'primary',
    icon: <GiselleIcon icon="solar:widget-bold-duotone" width={28} />,
  },
};

/**
 * With upward trend indicator and supplementary label.
 * The trend badge sits in the top-right corner — position is absolute relative to the card.
 */
export const WithTrendUp: Story = {
  args: {
    label: 'Tests passing',
    value: '551',
    trend: 12.5,
    trendLabel: 'this month',
    color: 'success',
    icon: <GiselleIcon icon="solar:check-circle-bold-duotone" width={28} />,
  },
};

/**
 * Downward trend — the arrow flips, and the value is prefixed with the minus sign
 * (no + prefix is added for negative values).
 */
export const WithTrendDown: Story = {
  args: {
    label: 'Coverage',
    value: '76%',
    trend: -3.1,
    trendLabel: 'vs last sprint',
    color: 'error',
    icon: <GiselleIcon icon="solar:graph-down-bold-duotone" width={28} />,
  },
};

/**
 * With sparkline — the chart loads lazily via dynamic import after mount.
 * Requires `react-apexcharts` and `apexcharts` to be installed.
 */
export const WithSparkline: Story = {
  args: {
    label: 'Weekly sales',
    value: '714k',
    trend: 2.6,
    trendLabel: 'last week',
    color: 'primary',
    icon: <GiselleIcon icon="solar:cart-large-4-bold-duotone" width={28} />,
    sparkline: SAMPLE_SPARKLINE,
  },
};

/**
 * Declining sparkline — the chart still renders; the visual shows a downward curve.
 */
export const WithSparklineDown: Story = {
  args: {
    label: 'Bounce rate',
    value: '48%',
    trend: -5.2,
    trendLabel: 'last week',
    color: 'warning',
    icon: <GiselleIcon icon="solar:arrow-down-bold-duotone" width={28} />,
    sparkline: SAMPLE_SPARKLINE_DOWN,
  },
};

/**
 * All six palette colors side by side. Every card uses the same data so the only
 * variable is the background tint and trend/sparkline color.
 */
export const AllColors: Story = {
  render: () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
      {(['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const).map((color) => (
        <StatCard
          key={color}
          label={color}
          value="42"
          trend={2.6}
          trendLabel="last week"
          color={color}
          icon={<GiselleIcon icon="solar:star-bold-duotone" width={28} />}
          sparkline={SAMPLE_SPARKLINE}
        />
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'All six MUI palette keys — gradient tint, trend colour, and sparkline colour all derive from the palette key.',
      },
    },
  },
};

/**
 * Responsive story — renders at each MUI standard breakpoint width.
 * The card fills its column; sparkline reflows naturally.
 */
export const Responsive: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {([360, 600, 900, 1200] as const).map((width) => (
        <Box key={width}>
          <Box sx={{ mb: 0.5, fontSize: '0.75rem', color: 'text.secondary' }}>{width}px</Box>
          <Box sx={{ width }}>
            <StatCard
              label="Purchase orders"
              value="1.72m"
              trend={2.8}
              trendLabel="last week"
              color="info"
              icon={<GiselleIcon icon="solar:box-bold-duotone" width={28} />}
              sparkline={SAMPLE_SPARKLINE}
            />
          </Box>
        </Box>
      ))}
    </Box>
  ),
  parameters: { layout: 'padded' },
};
