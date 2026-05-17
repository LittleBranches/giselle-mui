import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface FloatingControlBarProps {
  children?: ReactNode;
  /** When false the bar slides out via AnimatePresence exit. @default true */
  visible?: boolean;
  sx?: SxProps<Theme>;
}
