import type { SxProps, Theme } from '@mui/material/styles';

import { channelAlpha } from '../../../utils/theme-utils';
import type { StatCardColor } from './types';

// ----------------------------------------------------------------------

/**
 * Root `Card` sx — gradient background tinted by the chosen palette color.
 * Uses `channelAlpha` on the standard MUI v7 `lightChannel` token.
 * No `varAlpha` or Minimals-specific channels are used.
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
  width: 48,
  height: 48,
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
  minWidth: 112,
};
