import type { Theme, SxProps } from '@mui/material/styles';
import type { HighlightedPaletteKey } from '../types';

// ----------------------------------------------------------------------

/**
 * Forces the effective colour to `'success'` when `done=true`.
 *
 * Exported so tests can assert the done-dot colour rule independently
 * of theme rendering.
 */
export function resolveEffectiveColor(
  color: HighlightedPaletteKey,
  done: boolean
): HighlightedPaletteKey {
  return done ? 'success' : color;
}

export function getDotSize(isMilestone: boolean): number {
  return isMilestone ? 34 : 42;
}

export function getIconSize(isMilestone: boolean): number {
  return isMilestone ? 17 : 23;
}

export function normaliseSx(sx: SxProps<Theme> | undefined): SxProps<Theme>[] {
  if (!sx) return [];
  return Array.isArray(sx) ? (sx as SxProps<Theme>[]) : [sx];
}
