import type { MetricCardDecorationProps } from './types';

import Box from '@mui/material/Box';

import { metricCardDecorationSx } from './metric-card.styles';

// ----------------------------------------------------------------------

/**
 * MetricCardDecoration — the rotated gradient rectangle that sits behind MetricCard content.
 *
 * Pass as the `decoration` prop of `MetricCard`. The card clips it via `overflow: hidden`.
 *
 * @example
 * import { MetricCard, MetricCardDecoration } from '@littlebranches/giselle-mui';
 * <MetricCard decoration={<MetricCardDecoration color="primary" />} ... />
 */
export function MetricCardDecoration({
  color = 'primary',
  sx,
  ...other
}: MetricCardDecorationProps) {
  return (
    <Box sx={[metricCardDecorationSx(color), ...(Array.isArray(sx) ? sx : [sx])]} {...other} />
  );
}
