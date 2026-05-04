import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

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
