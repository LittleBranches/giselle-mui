import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

export interface ErrorSectionProps extends Omit<BoxProps, 'children' | 'title'> {
  /** HTTP error code or custom string. @default '404' */
  code?: string;
  title?: string;
  description?: string;
  /** CTA button slot — pass a MUI `<Button>` or link element. */
  action?: ReactNode;
  /** Illustration slot. Defaults to a built-in error illustration. */
  illustration?: ReactNode;
}
