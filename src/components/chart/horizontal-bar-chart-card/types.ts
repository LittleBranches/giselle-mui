import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface HorizontalBarItem {
  label: string;
  value: number;
}

export interface HorizontalBarChartCardProps {
  title: string;
  subheader?: string;
  items: HorizontalBarItem[];
  /** Reference maximum for bar width calculation. Defaults to the max item value. */
  max?: number;
  sx?: SxProps<Theme>;
}
