import type { Theme, SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

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
