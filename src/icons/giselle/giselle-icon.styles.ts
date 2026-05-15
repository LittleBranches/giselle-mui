import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/**
 * Root Box styles for `GiselleIcon`.
 *
 * Dynamic — `width` and `height` come from the `width`/`height` props
 * and must be set at render time rather than at module load.
 *
 * @param width - Icon width (also used as fallback height).
 * @param height - Resolved icon height (`height ?? width`).
 */
export const giselleIconRootSx = (
  width: string | number,
  height: string | number
): SxProps<Theme> => ({
  lineHeight: 0,
  display: 'inline-flex',
  flexShrink: 0,
  width,
  height,
});
