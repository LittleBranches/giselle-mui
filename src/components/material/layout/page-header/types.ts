import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

export interface PageHeaderProps extends Omit<BoxProps, 'children' | 'title'> {
  title: string;
  /** Breadcrumbs slot rendered above the title. */
  breadcrumbs?: ReactNode;
  /** Action buttons slot rendered at the trailing edge. */
  actions?: ReactNode;
}
