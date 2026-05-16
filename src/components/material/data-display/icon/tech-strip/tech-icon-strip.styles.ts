import type { SxProps, Theme } from '@mui/material/styles';

import { TECH_ICON_STRIP_ICON_SIZE } from './tech-icon-strip.const';

// ----------------------------------------------------------------------

/**
 * Root container styles for `TechIconStrip`.
 * Stacks the optional heading above the icon row.
 */
export const stripRootSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
};

/** Styles for the optional overline heading above the strip. */
export const titleSx: SxProps<Theme> = {
  display: 'block',
  mb: 2,
  color: 'text.secondary',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

/**
 * Styles for the flex wrapper that holds all icon + label items.
 * `justifyContent` is controlled by `centeredWrap` — true centres the group
 * when there are fewer items than the row can hold.
 */
export const stripWrapperSx = (centered: boolean): SxProps<Theme> => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 3,
  justifyContent: centered ? 'center' : 'flex-start',
  alignItems: 'flex-start',
});

/** Styles for one icon + label column cell. */
export const itemSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 0.5,
  minWidth: 56,
};

/**
 * Styles for the icon slot wrapper.
 * Forces all `<svg>` and `<img>` children to the minimum decorative icon size (32 px).
 */
export const iconSlotSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg, & img': {
    width: TECH_ICON_STRIP_ICON_SIZE,
    height: TECH_ICON_STRIP_ICON_SIZE,
  },
};
