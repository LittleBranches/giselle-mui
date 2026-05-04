import type { SxProps, Theme } from '@mui/material/styles';

import { channelAlpha } from '../../../utils/theme-utils';

// ----------------------------------------------------------------------

/**
 * Gradient accent span — fades the word from `text.primary` to its 20% alpha
 * using a left-to-right CSS background-clip gradient.
 */
export const txtGradientSpanSx: SxProps<Theme> = (theme) => ({
  opacity: 0.4,
  display: 'inline-block',
  background: `linear-gradient(to right, ${theme.vars!.palette.text.primary}, ${channelAlpha(theme.vars!.palette.text.primaryChannel, 0.2)})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: 'transparent',
});
