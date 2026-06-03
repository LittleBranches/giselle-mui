import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface AvatarItem {
  id: string;
  name: string;
  avatarSrc?: string;
}

export interface AvatarRowProps {
  items: AvatarItem[];
  /** Id of the currently selected avatar. */
  activeId?: string;
  onSelect?: (id: string) => void;
  sx?: SxProps<Theme>;
}
