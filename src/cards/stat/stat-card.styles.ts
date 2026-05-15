import type { SxProps, Theme } from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';

import { channelAlpha } from '../../utils/theme-utils';
import type { StatCardColor } from './types';
import { STAT_CARD_ICON_BOX_SIZE, STAT_CARD_LABELS_MIN_WIDTH } from './stat-card.const';

// ----------------------------------------------------------------------

/**
 * Root `Card` sx — gradient background tinted by the chosen palette color.
 * Uses `channelAlpha` on the standard MUI v7 `lightChannel` token.
 */
export const statCardRootSx =
  (color: StatCardColor): SxProps<Theme> =>
  (theme) => ({
    p: 3,
    boxShadow: 'none',
    position: 'relative',
    overflow: 'hidden',
    color: `${color}.dark`,
    backgroundImage: `linear-gradient(135deg, ${channelAlpha(theme.vars!.palette[color].lightChannel, 0.1)}, ${channelAlpha(theme.vars!.palette[color].lightChannel, 0.22)})`,
  });

/** Absolutely-positioned trend indicator — top-right corner of the card. */
export const trendBoxSx: SxProps<Theme> = {
  top: 16,
  right: 16,
  gap: 0.5,
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
};

/** Icon container — fixed 48×48, sits above the value row. */
export const iconBoxSx: SxProps<Theme> = {
  mb: 3,
  width: STAT_CARD_ICON_BOX_SIZE,
  height: STAT_CARD_ICON_BOX_SIZE,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
};

/** Bottom row — label+value on the left, sparkline on the right. */
export const contentRowSx: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
};

/** Flexible left block holding label and value. */
export const labelsBoxSx: SxProps<Theme> = {
  flexGrow: 1,
  minWidth: STAT_CARD_LABELS_MIN_WIDTH,
};

/**
 * Absolutely-positioned decoration layer — bottom-right corner, clipped by the
 * card's `overflow: hidden`. Must be rendered as the first child so it sits
 * behind all content. `pointerEvents: none` prevents interaction.
 */
export const decorationSx: SxProps<Theme> = {
  position: 'absolute',
  bottom: -20,
  right: -20,
  pointerEvents: 'none',
  lineHeight: 0,
};

// ----------------------------------------------------------------------

/**
 * Base ApexCharts options for the `StatCard` sparkline slot (84×56 px).
 *
 * Spread this and add `colors` to match the card's palette:
 *
 * ```ts
 * options={{ ...STAT_CARD_SPARKLINE_OPTIONS, colors: [theme.palette[color].dark] }}
 * ```
 */
export const STAT_CARD_SPARKLINE_OPTIONS: ApexOptions = {
  chart: {
    sparkline: { enabled: true },
    animations: { enabled: false },
  },
  stroke: { width: 2, curve: 'smooth' },
  tooltip: { enabled: false },
  markers: { strokeWidth: 0 },
};
