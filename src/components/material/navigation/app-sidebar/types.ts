import type { ReactNode } from 'react';
import type { DrawerProps } from '@mui/material/Drawer';

// ----------------------------------------------------------------------

export interface AppSidebarNavItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  active?: boolean;
  children?: AppSidebarNavItem[];
}

export interface AppSidebarProps extends Omit<DrawerProps, 'children'> {
  items: AppSidebarNavItem[];
  /** Logo slot rendered at the top of the sidebar. */
  logo?: ReactNode;
  /** Footer slot rendered at the bottom of the sidebar. */
  footer?: ReactNode;
}
