import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface ContactItem {
  id: string;
  name: string;
  email?: string;
  avatarSrc?: string;
  /** Optional trailing action slot per row (e.g. message icon, phone icon). */
  action?: ReactNode;
}

export interface ContactsListProps {
  items: ContactItem[];
  sx?: SxProps<Theme>;
}
