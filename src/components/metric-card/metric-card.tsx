import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';
import type { PaperProps } from '@mui/material/Paper';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { decorationOverlaySx } from './metric-card.styles';

// ----------------------------------------------------------------------

export type MetricCardColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

export interface MetricCardProps extends PaperProps {
  /** Pre-formatted display value, e.g. `"20+"` or `"<600ms"`. */
  value: string | number;
  /** Primary label rendered below the value. */
  label: string;
  /** Optional second-line detail rendered below the label. */
  sublabel?: string;
  /**
   * Icon slot rendered at the top-right of the card.
   * Accepts any `ReactNode` — the component has no icon-library dependency.
   *
   * @example
   * import { GiselleIcon, MetricCard } from '@alexrebula/giselle-mui';
   * <MetricCard icon={<GiselleIcon icon="solar:clock-circle-bold-duotone" width={36} />} ... />
   */
  icon?: ReactNode;
  /**
   * Palette color key used for the icon tint.
   * @default 'primary'
   */
  color?: MetricCardColor;
  /**
   * Optional decoration rendered in a zero-interaction layer behind the card content.
   * The decoration positions itself; the card clips it via `overflow: hidden`.
   *
   * @example
   * import { MetricCard, MetricCardDecoration } from '@alexrebula/giselle-mui';
   * <MetricCard decoration={<MetricCardDecoration color="primary" />} ... />
   */
  decoration?: ReactNode;
}

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
      sx={[
        { py: 3, pl: 3, pr: 2.5, position: 'relative', overflow: 'hidden' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
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
        <Box
          aria-hidden="true"
          sx={(theme) => ({
            top: 24,
            right: 20,
            width: 36,
            height: 36,
            position: 'absolute',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.vars!.palette[color].main,
          })}
        >
          {icon}
        </Box>
      )}
    </Paper>
  );
}

// ----------------------------------------------------------------------

export interface MetricCardDecorationProps extends BoxProps {
  /**
   * Palette color used for the gradient fill.
   * @default 'primary'
   */
  color?: MetricCardColor;
}

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
