import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

export interface AppShellProps extends Omit<BoxProps, 'children'> {
  /** Sidebar drawer content. */
  sidebar?: ReactNode;
  /** Top navigation bar. */
  topbar?: ReactNode;
  /** Main page content. */
  children?: ReactNode;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
}
