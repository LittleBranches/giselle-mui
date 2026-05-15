import type { SxProps, Theme } from '@mui/material/styles';

import { TECH_ICON_STRIP_ICON_SIZE } from './tech-icon-strip.const';

// ----------------------------------------------------------------------

/** Styles for the optional overline title above the strip. */
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
 * Forces all `<svg>` children to the minimum decorative icon size (32 px).
 */
export const iconSlotSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: TECH_ICON_STRIP_ICON_SIZE,
    height: TECH_ICON_STRIP_ICON_SIZE,
  },
};
