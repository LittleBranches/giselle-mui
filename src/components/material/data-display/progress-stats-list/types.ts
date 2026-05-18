import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface ProgressStatsItem {
  label: string;
  /** Formatted display value beside the label, e.g. '$4,200' or '42%'. */
  value: string | number;
  /** Progress percentage (0–100). */
  percentage: number;
  /** MUI palette key for the LinearProgress colour. @default 'primary' */
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
}

export interface ProgressStatsListProps {
  items: ProgressStatsItem[];
  sx?: SxProps<Theme>;
}
