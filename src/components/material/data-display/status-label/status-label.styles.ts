import type { SxProps, Theme } from '@mui/material/styles';

import { channelAlpha } from '../../../../utils/theme/theme-utils/theme-utils';
import { STATUS_LABEL_HEIGHT, STATUS_LABEL_FONT_SIZE } from './status-label.const';
import type { StatusColorKey } from './status-label.const';

// ----------------------------------------------------------------------

const BASE_SX = {
  height: STATUS_LABEL_HEIGHT,
  fontSize: STATUS_LABEL_FONT_SIZE,
  fontWeight: 700,
  borderRadius: 0.75,
  '& .MuiChip-label': { px: 1 },
} as const;

/**
 * Returns a theme-aware sx object for the soft status chip variant.
 *
 * Semantic palette keys (`success`, `warning`, `info`, `error`) use
 * `mainChannel` at 0.16 alpha for background and `<color>.dark` for text.
 * The `'default'` key (inactive) falls back to the grey 500 channel
 * and `text.secondary`.
 */
export function statusChipSx(color: StatusColorKey): SxProps<Theme> {
  if (color === 'default') {
    return {
      ...BASE_SX,
      backgroundColor: channelAlpha('var(--mui-palette-grey-500Channel)', 0.16),
      color: 'text.secondary',
    };
  }
  return (theme: Theme) => ({
    ...BASE_SX,
    backgroundColor: channelAlpha(theme.vars!.palette[color].mainChannel, 0.16),
    color: `${color}.dark`,
  });
}
