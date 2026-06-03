import type { SxProps, Theme } from '@mui/material/styles';

import { METRIC_CARD_ICON_BOX_SIZE, METRIC_CARD_DECORATION_SIZE } from './metric-card.const';

// ----------------------------------------------------------------------

/** Paper root for `MetricCard` — padding, positioning, overflow clipping. */
export const metricCardPaperSx: SxProps<Theme> = {
  py: 3,
  pl: 3,
  pr: 2.5,
  position: 'relative',
  overflow: 'hidden',
};

/**
 * Fills the parent container absolutely with no pointer events.
 * Used for the optional `decoration` overlay inside MetricCard.
 */
export const decorationOverlaySx: SxProps<Theme> = {
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  pointerEvents: 'none',
};

/** Content wrapper Box in `MetricCard` — sits above the decoration overlay. */
export const metricCardContentSx: SxProps<Theme> = {
  position: 'relative',
  zIndex: 1,
  flexGrow: 1,
};

/**
 * Absolutely-positioned icon Box in the top-right corner of `MetricCard`.
 *
 * @param color - MUI palette key used to tint the icon.
 */
export const metricCardIconBoxSx =
  (color: string): SxProps<Theme> =>
  (theme) => ({
    top: 24,
    right: 20,
    width: METRIC_CARD_ICON_BOX_SIZE,
    height: METRIC_CARD_ICON_BOX_SIZE,
    position: 'absolute',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: (theme.vars!.palette as unknown as Record<string, { main: string }>)[color]?.main,
  });

// ----------------------------------------------------------------------

/**
 * Rotated gradient rectangle decoration for `MetricCardDecoration`.
 *
 * @param color - MUI palette key for the gradient colour.
 */
export const metricCardDecorationSx =
  (color: string): SxProps<Theme> =>
  (theme) => ({
    top: -40,
    right: -56,
    width: METRIC_CARD_DECORATION_SIZE,
    height: METRIC_CARD_DECORATION_SIZE,
    opacity: 0.1,
    borderRadius: 4,
    position: 'absolute',
    transform: 'rotate(40deg)',
    background: `linear-gradient(to right, ${
      (theme.vars!.palette as unknown as Record<string, { main: string }>)[color]?.main
    }, transparent)`,
  });
