import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface PeriodStat {
  label: string;
  value: string | number;
  trend?: number;
  /** MUI palette key. @default 'primary' */
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
}

export interface PeriodSummaryCardProps {
  /** Period label, e.g. 'This Week' or 'January 2026'. */
  period: string;
  title?: string;
  stats: PeriodStat[];
  /** Optional chart slot rendered below the stats. */
  chart?: ReactNode;
  sx?: SxProps<Theme>;
}
