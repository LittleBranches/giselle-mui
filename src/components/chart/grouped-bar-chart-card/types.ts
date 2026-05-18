import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface BarSeriesItem {
  name: string;
  data: number[];
}

export interface GroupedBarChartCardProps {
  title: string;
  subheader?: string;
  series: BarSeriesItem[];
  categories: string[];
  /** When true renders bars stacked instead of grouped. @default false */
  stacked?: boolean;
  sx?: SxProps<Theme>;
}
