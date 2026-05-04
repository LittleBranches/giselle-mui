import type { SxProps, Theme } from '@mui/material/styles';

import { checkPop } from './animations';

// ----------------------------------------------------------------------

/**
 * Animated SVG checkmark shown inside a done dot.
 *
 * Dynamic — `iconSize` scales with the dot variant (phase = 23px, milestone = 17px).
 *
 * ⚠️ Performance note: returns a new object on every call.
 * The `DotInner` helper is unmounted/remounted on each `animationKey` change,
 * so the cost is negligible.
 */
export const doneCheckmarkSx = (iconSize: number): SxProps<Theme> => ({
  width: iconSize,
  height: iconSize,
  flexShrink: 0,
  animation: `${checkPop} 0.36s cubic-bezier(0.34, 1.56, 0.64, 1)`,
});
