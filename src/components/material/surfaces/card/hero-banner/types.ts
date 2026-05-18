import type { ReactNode } from 'react';
import type { PaperProps } from '@mui/material/Paper';

// ----------------------------------------------------------------------

export interface HeroBannerCardProps extends Omit<PaperProps, 'children'> {
  title: string;
  subtitle?: string;
  description?: string;
  /** CTA button slot — pass a MUI `<Button>` with the desired label and handler. */
  action?: ReactNode;
  /** Illustration slot rendered on the right side — pass an `<img>` or SVG element. */
  illustration?: ReactNode;
}
