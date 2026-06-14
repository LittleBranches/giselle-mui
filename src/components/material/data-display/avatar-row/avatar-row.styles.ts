import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/** Root Box sx — horizontal row of avatars with uniform gap. */
export const avatarRowRootSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'row',
  gap: 1,
  alignItems: 'center',
};

/**
 * Returns sx for the per-avatar wrapper Box.
 *
 * When `isActive` is true, a primary-colour `outline` ring is applied
 * using `outlineOffset` so the ring does not shift adjacent avatars.
 */
export function avatarWrapperSx(isActive: boolean, hasSelect: boolean): SxProps<Theme> {
  return {
    borderRadius: '50%',
    cursor: hasSelect ? 'pointer' : 'default',
    outline: isActive ? '2px solid' : 'none',
    outlineColor: isActive ? 'primary.main' : undefined,
    outlineOffset: 2,
    lineHeight: 0,
  };
}
