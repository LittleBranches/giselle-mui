import type { ReactNode } from 'react';
import type { PaperProps } from '@mui/material/Paper';

// ----------------------------------------------------------------------

export interface FeaturedItemCardProps extends Omit<PaperProps, 'children'> {
  title: string;
  description?: string;
  /** Badge label overlaid on the image, e.g. 'NEW' or 'FEATURED'. */
  badge?: string;
  /** Image slot filling the top of the card — pass `<img src=... />` or any ReactNode. */
  image: ReactNode;
  /** CTA button slot — pass a MUI `<Button>`. */
  action?: ReactNode;
}
