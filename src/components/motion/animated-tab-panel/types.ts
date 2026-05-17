import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

export interface AnimatedTabPanelProps extends Omit<BoxProps, 'children'> {
  children: ReactNode;
  /** Active tab index — keys the AnimatePresence transition on tab change. */
  activeIndex: number;
}
