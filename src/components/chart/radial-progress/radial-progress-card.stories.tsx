import { Suspense } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import type { SystemStyleObject } from '@mui/system';
import type { Theme } from '@mui/material/styles';

import { breakpointLabelSx, responsiveWrapperSx } from '../../../stories-defaults';
import { RadialProgressCard } from './radial-progress-card';

// ----------------------------------------------------------------------

const chartFallbackSx: SystemStyleObject<Theme> = {
  height: 320,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const meta: Meta<typeof RadialProgressCard> = {
  title: 'Charts/Radial Progress',
  component: RadialProgressCard,
  parameters: { layout: 'padded' },
  argTypes: {
    sx: { control: false },
  },
  decorators: [
    (Story) => (
      <Suspense
        fallback={
          <Box sx={chartFallbackSx}>
            <Typography color="text.secondary">Loading chart…</Typography>
          </Box>
        }
      >
        <Story />
      </Suspense>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RadialProgressCard>;

// ----------------------------------------------------------------------

const SAMPLE_SERIES = [
  { label: 'Quality', value: 90, color: 'success' as const },
  { label: 'Components', value: 50, color: 'primary' as const },
  { label: 'Theme', value: 40, color: 'warning' as const },
  { label: 'Docs', value: 20, color: 'error' as const },
];

// ----------------------------------------------------------------------

/**
 * Default — four-series radial bar with title and legend row.
 */
export const Default: Story = {
  args: {
    title: 'Store Readiness',
    subheader: 'Aggregate across 4 dimensions',
    total: 35,
    totalLabel: '% Ready',
    series: SAMPLE_SERIES,
  },
};

/**
 * WithoutHeader — card with no title or subheader: only the chart + legend.
 */
export const WithoutHeader: Story = {
  args: {
    total: 72,
    totalLabel: '% Done',
    series: [
      { label: 'Phase A', value: 100, color: 'success' as const },
      { label: 'Phase B', value: 80, color: 'primary' as const },
      { label: 'Phase C', value: 40, color: 'warning' as const },
    ],
  },
};

/**
 * SingleSeries — one segment; useful as a simple radial progress indicator.
 */
export const SingleSeries: Story = {
  args: {
    title: 'Completion',
    total: 68,
    totalLabel: '%',
    series: [{ label: 'Progress', value: 68, color: 'info' as const }],
  },
};

/**
 * Responsive — shows the card at standard MUI breakpoint widths.
 * Verify that the chart reflows and the legend remains readable at each width.
 */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Box sx={responsiveWrapperSx}>
      {[360, 600, 900, 1200].map((width) => (
        <Box key={width}>
          <Typography variant="caption" sx={breakpointLabelSx}>
            {width}px
          </Typography>
          <Box sx={{ width, maxWidth: '100%' }}>
            <RadialProgressCard
              title="Store Readiness"
              total={35}
              totalLabel="% Ready"
              series={SAMPLE_SERIES}
            />
          </Box>
        </Box>
      ))}
    </Box>
  ),
};
