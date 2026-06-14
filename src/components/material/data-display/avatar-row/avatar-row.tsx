import MuiAvatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

import { avatarRowRootSx, avatarWrapperSx } from './avatar-row.styles';
import type { AvatarRowProps } from './types';

// ----------------------------------------------------------------------

/**
 * AvatarRow — a horizontal strip of circular avatars where one can be
 * highlighted as active via a ring indicator.
 *
 * Falls back to two-letter initials derived from `name` when `avatarSrc` is
 * absent. Clicking an avatar fires `onSelect` with the item's `id`.
 *
 * @example
 * ```tsx
 * <AvatarRow
 *   items={[{ id: '1', name: 'Alice Johnson' }, { id: '2', name: 'Bob Smith', avatarSrc: '/bob.jpg' }]}
 *   activeId="1"
 *   onSelect={(id) => setActive(id)}
 * />
 * ```
 */
export function AvatarRow({ items, activeId, onSelect, sx }: AvatarRowProps) {
  return (
    <Box sx={[avatarRowRootSx, ...(Array.isArray(sx) ? sx : [sx])]}>
      {items.map((item) => {
        const isActive = item.id === activeId;
        const initials = item.name
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((word) => word[0]?.toUpperCase() ?? '')
          .join('');

        return (
          <Box
            key={item.id}
            onClick={() => onSelect?.(item.id)}
            sx={avatarWrapperSx(isActive, Boolean(onSelect))}
            aria-pressed={isActive}
            role={onSelect ? 'button' : undefined}
            aria-label={item.name}
          >
            <MuiAvatar src={item.avatarSrc} alt={item.name}>
              {!item.avatarSrc ? initials : undefined}
            </MuiAvatar>
          </Box>
        );
      })}
    </Box>
  );
}

AvatarRow.displayName = 'AvatarRow';
