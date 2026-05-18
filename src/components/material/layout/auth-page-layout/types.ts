import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

export interface AuthPageLayoutProps extends Omit<BoxProps, 'children'> {
  /** Form content rendered on the primary side (left on desktop). */
  children: ReactNode;
  /** Illustration or decorative content for the secondary panel (right on desktop). */
  illustration?: ReactNode;
  /** When true the illustration appears on the left and the form on the right. @default false */
  reverse?: boolean;
}
