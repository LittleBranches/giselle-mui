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

// ----------------------------------------------------------------------

// Re-export for consumers that import types from the component directly.
export type { StatCardColor, StatCardItem, StatCardProps } from './types';
// Re-export chart options constant so consumers can configure the sparkline slot.
export { STAT_CARD_SPARKLINE_OPTIONS } from './stat-card.styles';

// ----------------------------------------------------------------------

/**
 * Independent geometric decoration — two overlapping rotated rounded squares.
 * Uses `currentColor` so the shapes inherit the card's `color.dark` palette token
 * without any hardcoded hex values. Purely decorative: aria-hidden on the parent Box.
 *
 * Design note: colours follow MUI semantic conventions (not the mango visual palette).
 * The shapes are written from scratch — not derived from any third-party asset.
 */
function StatCardShape() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="14"
        y="14"
        width="80"
        height="80"
        rx="16"
        transform="rotate(15 54 54)"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <rect
        x="32"
        y="32"
        width="56"
        height="56"
        rx="12"
        transform="rotate(-8 60 60)"
        fill="currentColor"
        fillOpacity="0.1"
      />
    </svg>
  );
}

// ----------------------------------------------------------------------

/**
 * StatCard — KPI summary card with icon, trend indicator, and optional chart slot.
 *
 * The gradient background is built from the palette's `lightChannel` via `channelAlpha`.
 * No Minimals utilities (`varAlpha`, `varFade`, etc.) are used.
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
