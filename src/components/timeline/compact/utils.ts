import type { TimelineDotProps } from '@mui/lab/TimelineDot';

import type { HighlightedPaletteKey } from '../two-column/types';

export { resolveTaskChildren } from '../two-column/utils';

// ----------------------------------------------------------------------

/**
 * Resolves a `TimelineDotProps['color']` value to a `HighlightedPaletteKey` safe
 * for indexing into `theme.vars.palette[color]`.
 *
 * - `done=true` always returns `'success'` (green checkmark — same convention as
 *   `TimelineTwoColumn`'s done-dot colour enforcement rule).
 * - `'inherit'` and `'grey'` fall back to `'primary'` — neither maps to a
 *   `mainChannel`-capable palette slot.
 * - `undefined` falls back to `'primary'`.
 */
export function resolveCompactColor(
  color: TimelineDotProps['color'] | undefined,
  done?: boolean
): HighlightedPaletteKey {
  if (done) return 'success';
  if (!color || color === 'inherit' || color === 'grey') return 'primary';
  return color;
}
