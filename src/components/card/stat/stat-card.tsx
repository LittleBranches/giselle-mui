import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { GiselleIcon } from '../../icon/giselle';
import type { ApexChartComponent, StatCardProps } from './types';
import {
  statCardRootSx,
  trendBoxSx,
  iconBoxSx,
  contentRowSx,
  labelsBoxSx,
} from './stat-card.styles';

// ----------------------------------------------------------------------

// Re-export for consumers that import types from the component directly.
export type { StatCardColor, StatCardItem, StatCardProps } from './types';

// Module-level cache so the dynamic import runs only once per page load.
// IMPORTANT: stored in an object wrapper, never as a bare function.
// React's useState(fn) calls fn as a lazy initialiser, and setState(fn) calls fn
// as an updater — both would crash if the component reference were stored raw.
let cachedApexChart: { Chart: ApexChartComponent } | null = null;

// ----------------------------------------------------------------------

/**
 * StatCard — KPI summary card with icon, trend indicator, and optional ApexCharts sparkline.
 *
 * The gradient background is built from the palette's `lightChannel` via `channelAlpha`.
 * No Minimals utilities (`varAlpha`, `varFade`, etc.) are used.
 *
 * **Peer dependencies for sparkline:** `apexcharts ^5.0.0`, `react-apexcharts ^1.9.0`.
 * Both are optional — cards without the `sparkline` prop have zero chart dependency.
 *
 * @example
 * ```tsx
 * <StatCard
 *   label="Components"
 *   value="9"
 *   trend={12.5}
 *   trendLabel="this month"
 *   color="primary"
 *   icon={<GiselleIcon icon="solar:widget-bold-duotone" width={28} />}
 *   sparkline={[4, 5, 6, 7, 8, 9]}
 * />
 * ```
 */
export function StatCard({
  label,
  value,
  trend,
  trendLabel,
  icon,
  color = 'primary',
  sparkline,
  sx,
  ...other
}: StatCardProps) {
  const theme = useTheme();
  // chartHolder wraps the component so React never sees a bare function in state
  // (useState(fn) → lazy init call; setState(fn) → updater call — both crash).
  const [chartHolder, setChartHolder] = useState<{ Chart: ApexChartComponent } | null>(
    cachedApexChart
  );

  // Lazily load react-apexcharts only when the sparkline prop is provided.
  // The module-level cache ensures the import runs at most once per session.
  const loadChart = useCallback(() => {
    if (cachedApexChart) {
      setChartHolder(cachedApexChart);
      return;
    }
    import('react-apexcharts')
      .then((mod) => {
        cachedApexChart = { Chart: mod.default as ApexChartComponent };
        setChartHolder(cachedApexChart);
      })
      .catch(() => {
        // react-apexcharts not installed — sparkline silently absent
      });
  }, []);

  useEffect(() => {
    if (sparkline) loadChart();
  }, [sparkline, loadChart]);

  const ApexChart = chartHolder?.Chart ?? null;
  const isUp = (trend ?? 0) >= 0;
  // Optional chain: theme.palette may be absent in SSR/test environments without a provider.
  // This value is only consumed inside the client-only ApexChart branch.
  const sparklineColor = theme?.palette?.[color]?.dark ?? '#000';

  return (
    <Card sx={[statCardRootSx(color), ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      {/* Icon slot */}
      <Box sx={iconBoxSx}>{icon}</Box>

      {/* Trend indicator — top-right */}
      {trend !== undefined && (
        <Box sx={trendBoxSx}>
          <GiselleIcon width={20} icon={isUp ? 'eva:trending-up-fill' : 'eva:trending-down-fill'} />
          <Typography component="span" variant="subtitle2">
            {isUp && '+'}
            {trend}%
          </Typography>
          {trendLabel && (
            <Typography
              component="span"
              variant="caption"
              sx={{ opacity: 0.72, ml: 0.5, fontWeight: 400 }}
            >
              {trendLabel}
            </Typography>
          )}
        </Box>
      )}

      {/* Value + sparkline row */}
      <Box sx={contentRowSx}>
        <Box sx={labelsBoxSx}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            {label}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>

        {sparkline && ApexChart && (
          <ApexChart
            type="line"
            series={[{ data: sparkline }]}
            options={{
              chart: {
                sparkline: { enabled: true },
                animations: { enabled: false },
              },
              stroke: { width: 2, curve: 'smooth' },
              colors: [sparklineColor],
              tooltip: { enabled: false },
              markers: { strokeWidth: 0 },
            }}
            width={84}
            height={56}
          />
        )}
      </Box>
    </Card>
  );
}
