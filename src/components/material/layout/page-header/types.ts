import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface PageHeaderProps extends Omit<BoxProps, 'children' | 'title'> {
  title: string;
  /** Breadcrumbs slot rendered above the title. */
  breadcrumbs?: ReactNode;
  /** Action buttons slot rendered at the trailing edge. */
  actions?: ReactNode;
  sx?: SxProps<Theme>;
}
