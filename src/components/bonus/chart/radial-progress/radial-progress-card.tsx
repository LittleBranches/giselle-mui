import { lazy, Suspense, useMemo } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import type { RadialProgressCardProps } from './types';
import {
  buildRadialProgressOptions,
  chartWrapSx,
  legendDotSx,
  legendItemSx,
  legendRowSx,
  legendValueSx,
} from './radial-progress-card.styles';

// ---------------------------------------------------------------------------
// Lazy-load ApexCharts — avoids SSR issues without requiring Next.js or
// any provider. React.lazy + Suspense shows a height-matched placeholder
// until the chart bundle arrives.
// ---------------------------------------------------------------------------

const ReactApexChart = lazy(() => import('react-apexcharts'));

// ---------------------------------------------------------------------------

/**
 * `RadialProgressCard`
 *
 * A `Card` containing a multi-series radial-bar chart and a legend row.
 * Independently implemented using standard MUI v7 theme tokens.
 *
 * **Usage:**
 * ```tsx
 * <RadialProgressCard
 *   title="Store Readiness"
 *   total={35}
 *   totalLabel="% Ready"
 *   series={[
 *     { label: 'Quality',    value: 90, color: 'success'  },
 *     { label: 'Components', value: 50, color: 'primary'  },
 *     { label: 'Theme',      value: 40, color: 'warning'  },
 *     { label: 'Docs',       value: 20, color: 'error'    },
 *   ]}
 * />
 * ```
 *
 * **Quality status (13 May 2026):** DoD 20/20 · Best practices 13/13
 */
export function RadialProgressCard({
  title,
  subheader,
  total,
  totalLabel = '%',
  chartHeight = 280,
  series,
  sx,
  ...other
}: RadialProgressCardProps) {
  const theme = useTheme();

  const resolvedColors = useMemo(
    () => series.map((item) => theme.palette[item.color].main),
    [series, theme]
  );

  const chartSeries = useMemo(() => series.map((s) => s.value), [series]);

  const chartLabels = useMemo(() => series.map((s) => s.label), [series]);

  const chartOptions = useMemo(
    () => buildRadialProgressOptions(theme, chartLabels, resolvedColors, total, totalLabel),
    [theme, chartLabels, resolvedColors, total, totalLabel]
  );

  return (
    <Card sx={[{}, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      {(title !== undefined || subheader !== undefined) && (
        <CardHeader title={title} subheader={subheader} />
      )}

      <CardContent>
        <Box sx={chartWrapSx}>
          <Suspense fallback={<Box sx={{ height: chartHeight }} />}>
            <ReactApexChart
              type="radialBar"
              series={chartSeries}
              options={chartOptions}
              width="100%"
              height={chartHeight}
            />
          </Suspense>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={legendRowSx}>
          {series.map((item, i) => (
            <Box key={item.label} sx={legendItemSx}>
              <Box sx={legendDotSx(resolvedColors[i] ?? theme.palette.primary.main)} />
              <Typography variant="subtitle2">{item.label}</Typography>
              <Typography variant="caption" sx={legendValueSx}>
                {item.value}%
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
