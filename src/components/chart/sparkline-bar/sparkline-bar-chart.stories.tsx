import { Suspense } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { SparklineBarChart } from './sparkline-bar-chart';

// ----------------------------------------------------------------------

const chartFallbackSx = {
  width: 84,
  height: 56,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const meta: Meta<typeof SparklineBarChart> = {
  title: 'Chart/Sparkline Bar',
  component: SparklineBarChart,
  parameters: { layout: 'padded' },
  argTypes: {
    sx: { control: false },
    type: { control: 'select', options: ['bar', 'area', 'line'] },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'info', 'success', 'warning', 'error'],
    },
  },
  decorators: [
    (Story) => (
      <Suspense
        fallback={
          <Box sx={chartFallbackSx}>
            <Typography variant="caption" color="text.secondary">
              …
            </Typography>
          </Box>
        }
      >
        <Story />
      </Suspense>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SparklineBarChart>;

// ----------------------------------------------------------------------

const SAMPLE_DATA = [5, 18, 12, 51, 68, 11, 9, 28, 42, 14];

// ----------------------------------------------------------------------

/**
 * Default — bar sparkline at the default 84×56 size.
 *
 * This is the canonical slot for the `chart` prop on `StatCard`. The chart
 * has no axes, grid, legend, or tooltip so it sits flush inside its parent
 * tile without consuming extra visual space.
 */
export const Default: Story = {
  args: {
    data: SAMPLE_DATA,
    type: 'bar',
    color: 'primary',
  },
};

/**
 * **Type variants** — bar, area, and line side by side.
 *
 * The `type` prop delegates directly to ApexCharts' chart type. All three
 * share the same stripped-down configuration (sparkline mode enabled, tooltip
 * disabled). The only visual difference is fill vs stroke rendering:
 *
 * - `bar` — columnar fill, no stroke
 * - `area` — gradient fill from `color.main` with a smooth stroke
 * - `line` — stroke only, no fill
 *
 * Use `bar` (default) for discrete count data and `area` or `line` when
 * showing a continuous trend.
 */
export const TypeVariants: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
      {(['bar', 'area', 'line'] as const).map((type) => (
        <Box
          key={type}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
        >
          <SparklineBarChart data={SAMPLE_DATA} type={type} color="primary" />
          <Typography variant="caption" color="text.secondary">
            {type}
          </Typography>
        </Box>
      ))}
    </Box>
  ),
};

/**
 * **Color variants** — all six MUI palette keys.
 *
 * The `color` prop maps to `theme.palette[color].main`. This ensures the
 * sparkline automatically adapts to the active theme (light or dark) and
 * stays visually consistent with the surrounding stat tile's accent colour.
 * No hardcoded hex values are used — everything flows through the MUI theme.
 */
export const ColorVariants: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'flex-end' }}>
      {(['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const).map((color) => (
        <Box
          key={color}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
        >
          <SparklineBarChart data={SAMPLE_DATA} color={color} />
          <Typography variant="caption" color="text.secondary">
            {color}
          </Typography>
        </Box>
      ))}
    </Box>
  ),
};

/**
 * CustomSize — overriding width and height.
 *
 * The `width` and `height` props accept any pixel value. The default 84×56
 * is tuned for stat tile headers; use larger values when embedding in a
 * wider card or a dedicated trend section.
 */
export const CustomSize: Story = {
  args: {
    data: SAMPLE_DATA,
    type: 'area',
    color: 'success',
    width: 160,
    height: 80,
  },
};
