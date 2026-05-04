import type { SxProps, Theme } from '@mui/material/styles';

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
    width: 36,
    height: 36,
    position: 'absolute',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: (theme.vars!.palette as unknown as Record<string, { main: string }>)[color]?.main,
  });
