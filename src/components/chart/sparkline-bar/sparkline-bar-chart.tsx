import { lazy, Suspense, useMemo } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import type { ApexOptions } from 'apexcharts';

import type { SparklineBarChartProps } from './types';

// ---------------------------------------------------------------------------
// Lazy-load ApexCharts — avoids SSR issues without requiring Next.js or
// any provider. React.lazy + Suspense shows a transparent placeholder
// until the chart bundle arrives.
// ---------------------------------------------------------------------------

const ReactApexChart = lazy(() => import('react-apexcharts'));

// ---------------------------------------------------------------------------

/**
 * Embeddable mini sparkline chart for use in stat tiles and summary cards.
 *
 * Renders a minimal ApexCharts instance with axes, grid, legend, and tooltip
 * all hidden so the chart sits flush inside its parent without adding visual
 * noise. The fill/stroke colour is derived from `theme.palette[color].main`.
 *
 * Designed to slot into the `chart` prop of `StatCard` or `BalanceSummaryCard`.
 *
 * @example
 * ```tsx
 * <SparklineBarChart data={[5, 18, 12, 51, 68, 11, 9]} color="success" />
 * ```
 */
export function SparklineBarChart({
  data,
  type = 'bar',
  color = 'primary',
  width = 84,
  height = 56,
  sx,
}: SparklineBarChartProps) {
  const theme = useTheme();

  const resolvedColor = theme.palette[color].main;

  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type,
        sparkline: { enabled: true },
        background: 'transparent',
        animations: { enabled: false },
        toolbar: { show: false },
      },
      colors: [resolvedColor],
      fill: {
        type: type === 'area' ? 'gradient' : 'solid',
        gradient:
          type === 'area'
            ? {
                shadeIntensity: 1,
                opacityFrom: 0.56,
                opacityTo: 0.01,
                stops: [0, 100],
              }
            : undefined,
      },
      stroke: {
        width: type === 'bar' ? 0 : 2,
        curve: 'smooth',
      },
      plotOptions: {
        bar: {
          columnWidth: '68%',
          borderRadius: 1,
        },
      },
      tooltip: { enabled: false },
      xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { show: false } },
      grid: { show: false, padding: { top: 0, right: 0, bottom: 0, left: 0 } },
      legend: { show: false },
    }),
    [type, resolvedColor]
  );

  const chartSeries = useMemo(() => (type === 'bar' ? [{ data }] : [{ data }]), [type, data]);

  return (
    <Box sx={[{ width, height, overflow: 'hidden' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Suspense fallback={<Box sx={{ width, height }} />}>
        <ReactApexChart
          type={type}
          series={chartSeries}
          options={chartOptions}
          width={width}
          height={height}
        />
      </Suspense>
    </Box>
  );
}
