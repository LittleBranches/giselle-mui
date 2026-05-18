import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface WeeklyBreakdownPageProps {
  /** Week label rendered in the page header, e.g. 'Week of 12 May 2026'. */
  weekLabel?: string;
  children?: ReactNode;
  sx?: SxProps<Theme>;
}
