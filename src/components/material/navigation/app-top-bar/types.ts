import type { ReactNode } from 'react';
import type { AppBarProps } from '@mui/material/AppBar';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface AppTopBarProps extends Omit<AppBarProps, 'children'> {
  /** Logo or brand element rendered on the left. */
  logo?: ReactNode;
  /** Page title or breadcrumb slot. */
  title?: ReactNode;
  /** Action icons or controls on the right (notifications, avatar, etc.). */
  actions?: ReactNode;
  /** When provided, renders a sidebar toggle button that calls this handler. */
  onMenuClick?: () => void;
  sx?: SxProps<Theme>;
}
