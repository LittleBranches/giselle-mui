import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface HeroBannerCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  /** CTA button slot — pass a MUI `<Button>` with the desired label and handler. */
  action?: ReactNode;
  /** Illustration slot rendered on the right side — pass an `<img>` or SVG element. */
  illustration?: ReactNode;
  sx?: SxProps<Theme>;
}
