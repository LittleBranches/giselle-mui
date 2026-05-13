import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { GiselleIcon } from '../../icon/giselle';
import type { StatCardProps } from './types';
import {
  statCardRootSx,
  trendBoxSx,
  iconBoxSx,
  contentRowSx,
  labelsBoxSx,
  decorationSx,
} from './stat-card.styles';
import { StatCardShape } from './stat-card-shape';

// ----------------------------------------------------------------------

// Re-export for consumers that import types from the component directly.
export type { StatCardColor, StatCardItem, StatCardProps } from './types';
// Re-export chart options constant so consumers can configure the sparkline slot.
export { STAT_CARD_SPARKLINE_OPTIONS } from './stat-card.styles';

// ----------------------------------------------------------------------

/**
 * StatCard — KPI summary card with icon, trend indicator, and optional chart slot.
 *
 * The gradient background is built from the palette's `lightChannel` via `channelAlpha`.
 *
 * The `chart` slot accepts any `ReactNode` — no chart-library dependency inside this
 * component. Use `STAT_CARD_SPARKLINE_OPTIONS` as the base options for the canonical
 * 84×56 slot and override `colors` with the palette key's dark token.
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
 *   chart={
 *     <ReactApexChart
 *       type="line"
 *       series={[{ data: [4, 5, 6, 7, 8, 9] }]}
 *       options={{ ...STAT_CARD_SPARKLINE_OPTIONS, colors: [theme.palette.primary.dark] }}
 *       width={84}
 *       height={56}
 *     />
 *   }
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
  chart,
  sx,
  ...other
}: StatCardProps) {
  const isUp = (trend ?? 0) >= 0;

  return (
    <Card sx={[statCardRootSx(color), ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      {/* Decorative shape — bottom-right, behind all content, clipped by overflow:hidden */}
      <Box aria-hidden="true" sx={decorationSx}>
        <StatCardShape />
      </Box>

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

      {/* Value + chart row */}
      <Box sx={contentRowSx}>
        <Box sx={labelsBoxSx}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            {label}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>

        {chart}
      </Box>
    </Card>
  );
}
