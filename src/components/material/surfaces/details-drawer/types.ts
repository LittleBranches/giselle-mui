import type { ReactNode } from 'react';
import type { DrawerProps } from '@mui/material/Drawer';

// ----------------------------------------------------------------------

export interface DetailsDrawerProps extends Omit<DrawerProps, 'children'> {
  title?: string;
  children?: ReactNode;
  onClose?: () => void;
}
