import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface AreaLineSeriesItem {
  name: string;
  data: number[];
}

export interface AreaLineChartCardProps {
  title: string;
  subheader?: string;
  series: AreaLineSeriesItem[];
  /** X-axis category labels, e.g. month abbreviations or week numbers. */
  categories: string[];
  /** Available years for the header year filter. When omitted, no filter is shown. */
  yearOptions?: number[];
  /** Initially selected year. @default first item in yearOptions */
  defaultYear?: number;
  sx?: SxProps<Theme>;
}
