import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';

import { breakpointLabelSx, responsiveWrapperSx } from '../../../../../stories-defaults';

import { STAT_CARD_SPARKLINE_OPTIONS } from '../stat/stat-card';
import type { StatCardItem } from '../stat/types';
import { StatCardRow } from './stat-card-row';

// ----------------------------------------------------------------------

const meta: Meta<typeof StatCardRow> = {
  title: 'Material/Surfaces/Card/Stat Row',
  component: StatCardRow,
  parameters: { layout: 'padded' },
  argTypes: {
    items: { control: false },
    renderChart: { control: false },
    sx: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof StatCardRow>;

// ----------------------------------------------------------------------

const SAMPLE_ITEMS: StatCardItem[] = [
  {
    label: 'Tasks done',
    value: '24',
    trend: 8.2,
    trendLabel: 'this month',
    color: 'success',
    iconId: 'solar:check-circle-bold-duotone',
    sparkline: [4, 6, 8, 7, 10, 12, 14, 15],
  },
  {
    label: 'In progress',
    value: '3',
    trend: -1.4,
    trendLabel: 'last week',
    color: 'warning',
    iconId: 'solar:clock-circle-bold-duotone',
    sparkline: [9, 7, 6, 8, 5, 4, 3, 3],
  },
  {
    label: 'Total earned',
    value: '$840',
    trend: 12.5,
    trendLabel: 'this month',
    color: 'primary',
    iconId: 'solar:dollar-minimalistic-bold-duotone',
    sparkline: [60, 80, 90, 110, 140, 160, 180, 200],
  },
  {
    label: 'Paid out',
    value: '$600',
    trend: 4.8,
    trendLabel: 'last payment',
    color: 'info',
    iconId: 'solar:wallet-bold-duotone',
    sparkline: [20, 40, 40, 60, 80, 80, 100, 120],
  },
];

// ----------------------------------------------------------------------

/**
 * Named helper — `useTheme` requires a named function (not an inline arrow)
 * to satisfy `react-hooks/rules-of-hooks`.
 */
function RowWithSparklines({ items }: { items: StatCardItem[] }) {
  const theme = useTheme();

  return (
    <StatCardRow
      items={items}
      renderChart={(item) =>
        item.sparkline ? (
          <ReactApexChart
            type="line"
            series={[{ data: item.sparkline }]}
            options={{
              ...STAT_CARD_SPARKLINE_OPTIONS,
              colors: [theme.palette[item.color].dark],
            }}
            width={84}
            height={56}
          />
        ) : null
      }
    />
  );
}

// ----------------------------------------------------------------------

/**
 * Default state: four stat cards, no sparklines.
 *
 * The four-column grid at md+ is the canonical dashboard top-row layout.
 * At sm each card is half-width; at xs each card spans the full row.
 */
export const Default: Story = {
  render: () => <StatCardRow items={SAMPLE_ITEMS} />,
  parameters: {
    docs: {
      description: {
        story:
          'Four stat cards in a responsive `Grid2` row. No sparklines — `renderChart` omitted. Shows the layout contract at a glance.',
      },
    },
  },
};

/**
 * With sparklines — `renderChart` factory wires `ReactApexChart` from the `/charts` subpath.
 *
 * The consuming app imports from `@alexrebula/giselle-mui/charts` and passes
 * the factory in. The main `StatCardRow` bundle stays chart-free without it.
 */
export const WithSparklines: Story = {
  render: () => <RowWithSparklines items={SAMPLE_ITEMS} />,
  parameters: {
    docs: {
      description: {
        story:
          "The `renderChart` factory receives each `StatCardItem` and returns a `ReactApexChart` sparkline. The chart colours are derived from `theme.palette[item.color].dark` — consistent with each card's palette key.",
      },
    },
  },
};

/**
 * Responsive — renders the row inside labeled containers at each MUI breakpoint.
 *
 * At `xs` (360px) all cards stack; at `sm` (600px) two columns; at `md+` four columns.
 * The grid breakpoints are baked into `StatCardRow` — the consumer only passes items.
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
            <StatCardRow items={SAMPLE_ITEMS} />
          </Box>
        </div>
      ))}
    </Box>
  ),
  parameters: { layout: 'padded' },
};
