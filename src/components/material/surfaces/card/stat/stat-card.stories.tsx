import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';

import { breakpointLabelSx, responsiveWrapperSx } from '../../../../../stories-defaults';
import {
  resolveMaturityColor,
  resolveMaturityLabel,
} from '../../../../../utils/maturity/maturity-utils';
import { GiselleIcon } from '../../../data-display/icon/giselle';
import { StatCard, STAT_CARD_SPARKLINE_OPTIONS } from './stat-card';
import type { StatCardColor } from './types';

// ----------------------------------------------------------------------

const meta: Meta<typeof StatCard> = {
  title: 'Material/Surfaces/Card/Stat',
  component: StatCard,
  parameters: { layout: 'padded' },
  argTypes: {
    icon: { control: false },
    chart: { control: false },
    sx: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

// ----------------------------------------------------------------------

const SAMPLE_SPARKLINE = [22, 18, 30, 25, 40, 35, 48];
const SAMPLE_SPARKLINE_DOWN = [48, 40, 35, 30, 22, 18, 14];

/**
 * Named helper so hooks are valid inside a render function.
 * Uses `useTheme` to pick the palette key's dark token as the line colour.
 */
function SparklineChart({ data, colorKey }: { data: number[]; colorKey: StatCardColor }) {
  const theme = useTheme();
  const dark = theme.palette[colorKey].dark;
  return (
    <ReactApexChart
      type="line"
      series={[{ data }]}
      options={{ ...STAT_CARD_SPARKLINE_OPTIONS, colors: [dark] }}
      width={84}
      height={56}
    />
  );
}

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
 * With sparkline — passes a pre-configured `<ReactApexChart>` into the `chart` slot.
 * `STAT_CARD_SPARKLINE_OPTIONS` encodes the canonical 84×56 options; the consumer
 * adds `colors` from the palette key.
 */
export const WithSparkline: Story = {
  args: {
    label: 'Weekly sales',
    value: '714k',
    trend: 2.6,
    trendLabel: 'last week',
    color: 'primary',
    icon: <GiselleIcon icon="solar:cart-large-4-bold-duotone" width={28} />,
    chart: <SparklineChart data={SAMPLE_SPARKLINE} colorKey="primary" />,
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
    chart: <SparklineChart data={SAMPLE_SPARKLINE_DOWN} colorKey="warning" />,
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
          chart={<SparklineChart data={SAMPLE_SPARKLINE} colorKey={color} />}
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
    <Box sx={responsiveWrapperSx}>
      {([360, 600, 900, 1200] as const).map((width) => (
        <div key={width}>
          <Typography variant="caption" sx={breakpointLabelSx}>
            {width}px
          </Typography>
          <Box sx={{ width }}>
            <StatCard
              label="Purchase orders"
              value="1.72m"
              trend={2.8}
              trendLabel="last week"
              color="info"
              icon={<GiselleIcon icon="solar:box-bold-duotone" width={28} />}
              chart={<SparklineChart data={SAMPLE_SPARKLINE} colorKey="info" />}
            />
          </Box>
        </div>
      ))}
    </Box>
  ),
  parameters: { layout: 'padded' },
};

/**
 * Named helper — uses `useState` so it must be a named function (not inline arrow).
 * Drives `StatCard` colour and label live from the slider value.
 */
function MaturityDemo() {
  const [percent, setPercent] = useState(35);
  const color = resolveMaturityColor(percent);
  const label = resolveMaturityLabel(percent);

  return (
    <Box sx={{ maxWidth: 360 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Readiness: <strong>{percent}%</strong> — {label}
        </Typography>
        <Slider
          value={percent}
          onChange={(_, v) => setPercent(v as number)}
          min={0}
          max={100}
          step={1}
          marks={[
            { value: 0, label: '0%' },
            { value: 20, label: '20%' },
            { value: 40, label: '40%' },
            { value: 60, label: '60%' },
            { value: 80, label: '80%' },
            { value: 100, label: '100%' },
          ]}
        />
      </Box>
      <StatCard
        label="Store Readiness"
        value={`${percent}%`}
        color={color}
        icon={<GiselleIcon icon="solar:shop-bold-duotone" width={28} />}
      />
    </Box>
  );
}

/**
 * **Mango ripeness scale — live colour picker.**
 *
 * Drag the slider through the full range and observe the card gradient
 * cycling through all five MUI semantic colour bands:
 *
 * | Range    | Palette key  | Semantic meaning   |
 * |----------|--------------|--------------------|
 * | 0–19 %   | `error`      | Blocked / not started |
 * | 20–39 %  | `warning`    | Early / at risk    |
 * | 40–59 %  | `info`       | In progress        |
 * | 60–79 %  | `primary`    | On track           |
 * | 80–100 % | `success`    | Stable / shipped   |
 *
 * Note: colours follow MUI semantic conventions, not the mango visual palette
 * (where green = unripe). The mango metaphor applies to release stage labels
 * (`resolveMaturityLabel`) and brand docs — not to the colour system.
 *
 * The colour boundaries are enforced by regression tests in `maturity-utils.test.ts`.
 * This story makes those same boundaries visually verifiable without reading the source.
 */
export const MaturityColorScale: StoryObj<typeof StatCard> = {
  render: () => <MaturityDemo />,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Drag the slider to see `resolveMaturityColor` map a readiness percentage to the correct MUI palette key. ' +
          'Boundary values (20, 40, 60, 80) should produce an immediate colour change — verifying the mango ripeness scale.',
      },
    },
  },
};
