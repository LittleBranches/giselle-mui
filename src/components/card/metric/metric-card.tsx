import type { MetricCardProps, MetricCardDecorationProps } from './types';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { decorationOverlaySx, metricCardPaperSx, metricCardIconBoxSx } from './metric-card.styles';

// Re-exports — keeps `import { MetricCardColor, MetricCardProps } from './metric-card'` working.
export type { MetricCardColor, MetricCardProps, MetricCardDecorationProps } from './types';

// ----------------------------------------------------------------------

/**
 * MetricCard — compact stat card with a large value, label, icon slot, and decoration slot.
 *
 * Library-ready: zero icon-library dependency. Pass any `ReactNode` into `icon` and `decoration`.
 *
 * @example
 * import { MetricCard, MetricCardDecoration, GiselleIcon } from '@alexrebula/giselle-mui';
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

      <Box sx={{ position: 'relative', zIndex: 1, flexGrow: 1 }}>
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

// ----------------------------------------------------------------------

/**
 * MetricCardDecoration — the rotated gradient rectangle that sits behind MetricCard content.
 *
 * Pass as the `decoration` prop of `MetricCard`. The card clips it via `overflow: hidden`.
 *
 * @example
 * import { MetricCard, MetricCardDecoration } from '@alexrebula/giselle-mui';
 * <MetricCard decoration={<MetricCardDecoration color="primary" />} ... />
 */
export function MetricCardDecoration({
  color = 'primary',
  sx,
  ...other
}: MetricCardDecorationProps) {
  return (
    <Box
      sx={[
        (theme) => ({
          top: -40,
          right: -56,
          width: 140,
          height: 140,
          opacity: 0.1,
          borderRadius: 4,
          position: 'absolute',
          transform: 'rotate(40deg)',
          background: `linear-gradient(to right, ${theme.vars!.palette[color].main}, transparent)`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    />
  );
}
