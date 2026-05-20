import type { MetricCardProps } from './types';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import {
  decorationOverlaySx,
  metricCardPaperSx,
  metricCardIconBoxSx,
  metricCardContentSx,
} from './metric-card.styles';

// Re-exports — keeps existing imports from './metric-card' working.
export type { MetricCardColor, MetricCardProps, MetricCardDecorationProps } from './types';
export { MetricCardDecoration } from './metric-card-decoration';

// ----------------------------------------------------------------------

/**
 * MetricCard — compact stat card with a large value, label, icon slot, and decoration slot.
 *
 * Library-ready: zero icon-library dependency. Pass any `ReactNode` into `icon` and `decoration`.
 *
 * @example
 * import { MetricCard, MetricCardDecoration, GiselleIcon } from '@littlebranches/giselle-mui';
 *
 * <MetricCard
 *   value="20+"
 *   label="Years"
 *   sublabel="of experience"
 *   color="primary"
 *   icon={<GiselleIcon icon="solar:clock-circle-bold-duotone" width={36} />}
 *   decoration={<MetricCardDecoration color="primary" />}
 *   sx={(theme) => ({ boxShadow: theme.shadows[2] })}
 * />
 *
 * **Quality status (8 May 2026):** DoD 20/20 · Best practices 13/13
 */
export function MetricCard({
  value,
  label,
  sublabel,
  icon,
  color = 'primary',
  decoration,
  elevation = 0,
  sx,
  ...other
}: MetricCardProps) {
  return (
    <Paper
      elevation={elevation}
      sx={[metricCardPaperSx, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      {decoration && (
        <Box aria-hidden="true" sx={decorationOverlaySx}>
          {decoration}
        </Box>
      )}
      <Box sx={metricCardContentSx}>
        <Box sx={{ typography: 'h3' }}>{value}</Box>
        <Typography noWrap variant="subtitle2" component="div" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
        {sublabel && (
          <Typography
            noWrap
            variant="caption"
            component="div"
            sx={{ color: 'text.disabled', mt: 0.25 }}
          >
            {sublabel}
          </Typography>
        )}
      </Box>
      {icon && (
        <Box aria-hidden="true" sx={metricCardIconBoxSx(color)}>
          {icon}
        </Box>
      )}
    </Paper>
  );
}
