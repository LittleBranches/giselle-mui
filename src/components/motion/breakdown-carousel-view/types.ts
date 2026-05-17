import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface BreakdownCarouselSlide {
  id: string;
  label: string;
  content: ReactNode;
}

export interface BreakdownCarouselViewProps extends Omit<BoxProps, 'children'> {
  slides: BreakdownCarouselSlide[];
  /** Initially active slide id. @default first slide */
  defaultActiveId?: string;
  sx?: SxProps<Theme>;
}
